/**
 * GitHub Repository Analysis Service
 *
 * Fetches public repository data via the GitHub REST API,
 * filters files intelligently, builds a compact context,
 * and returns it ready for a single Groq AI request.
 */

// ─── Configuration (Hardcoded safe limits to prevent OOM) ───────────
const MAX_FILES = 100; // Fetch up to 100 important files
const MAX_FILE_SIZE_KB = 300; // Skip individual files larger than 300KB
const MAX_TOTAL_SIZE_MB = 10; // Stop fetching if total size exceeds 10MB

// Timeout for every individual GitHub API fetch (ms)
const GITHUB_FETCH_TIMEOUT_MS = 15_000;

// ─── Custom error class for clean status propagation ─────────
class RepoError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "RepoError";
  }
}

// ─── GitHub URL validation ───────────────────────────────────
const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?$/;

function parseGitHubUrl(url) {
  const match = url.trim().replace(/\/+$/, "").match(GITHUB_REPO_REGEX);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function validateGitHubUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Block obvious SSRF vectors
  if (/^(http:\/\/|file:\/\/|ftp:\/\/)/.test(trimmed)) return false;
  if (/localhost|127\.0\.0\.\d|0\.0\.0\.0|\[::1\]|10\.\d|172\.(1[6-9]|2\d|3[01])\.|192\.168\./.test(trimmed)) return false;

  return GITHUB_REPO_REGEX.test(trimmed.replace(/\/+$/, ""));
}

// ─── Directories / files to ignore ───────────────────────────
const IGNORED_DIRS = new Set([
  ".git", "node_modules", "dist", "build", "coverage", ".next",
  "venv", "__pycache__", "target", "vendor", ".vscode", ".idea",
  ".github", ".husky", "out", ".cache", ".parcel-cache", "bin", "obj",
  ".nuxt", ".output", ".svelte-kit", "bower_components", "jspm_packages"
]);

const IGNORED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".bmp", ".webp", ".avif",
  ".mp4", ".mov", ".avi", ".mkv", ".webm",
  ".mp3", ".wav", ".ogg", ".flac",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".zip", ".tar", ".gz", ".rar", ".7z",
  ".exe", ".dll", ".so", ".dylib", ".bin",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".pptx",
  ".lock", ".sum", ".min.js", ".min.css", ".map",
  ".pyc", ".pyo", ".class", ".o", ".obj"
]);

const IGNORED_FILES = new Set([
  ".gitignore", ".gitattributes", ".editorconfig", ".prettierrc",
  ".prettierignore", ".eslintignore", ".npmrc", ".nvmrc",
  "yarn.lock", "package-lock.json", "pnpm-lock.yaml", "composer.lock",
  "Pipfile.lock", "Gemfile.lock", "go.sum", "Cargo.lock",
  ".DS_Store", "Thumbs.db", ".env", ".env.local", ".env.production",
  ".env.development", ".env.test"
]);

// ─── Priority files (always include if present) ──────────────
const PRIORITY_FILES = new Set([
  "README.md", "readme.md", "README.rst", "README",
  "package.json", "requirements.txt", "setup.py", "pyproject.toml",
  "pom.xml", "build.gradle", "build.gradle.kts", "settings.gradle",
  "go.mod", "Cargo.toml", "composer.json", "Gemfile",
  "tsconfig.json", "jsconfig.json",
  "Dockerfile", "docker-compose.yml", "docker-compose.yaml",
  ".env.example",
  "Makefile", "CMakeLists.txt"
]);

const PRIORITY_CONFIG_PATTERNS = [
  /^vite\.config\./,
  /^next\.config\./,
  /^nuxt\.config\./,
  /^webpack\.config\./,
  /^rollup\.config\./,
  /^tailwind\.config\./,
  /^postcss\.config\./,
  /^babel\.config\./,
  /^jest\.config\./,
  /^vitest\.config\./,
  /^\.csproj$/,
  /^app\.json$/,
  /^angular\.json$/,
  /^svelte\.config\./
];

// ─── Priority directories (source code lives here) ───────────
const PRIORITY_DIRS = [
  "src/", "app/", "server/", "backend/", "frontend/",
  "components/", "pages/", "routes/", "controllers/",
  "services/", "models/", "middleware/", "utils/", "lib/",
  "helpers/", "hooks/", "context/", "store/", "api/",
  "config/", "core/", "modules/", "views/", "templates/",
  "handlers/", "resolvers/", "schemas/", "types/"
];

// ─── Source code extensions ──────────────────────────────────
const SOURCE_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".h", ".hpp",
  ".cs", ".go", ".rs", ".php", ".rb", ".kt", ".kts", ".swift", ".scala",
  ".dart", ".lua", ".sh", ".bash", ".sql", ".r", ".m", ".mm",
  ".html", ".css", ".scss", ".sass", ".less", ".vue", ".svelte",
  ".json", ".yaml", ".yml", ".toml", ".xml", ".md", ".txt",
  ".env.example", ".cfg", ".ini", ".conf"
]);

// ─── Helper: fetch with timeout ──────────────────────────────
async function fetchWithTimeout(url, options = {}, timeoutMs = GITHUB_FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new RepoError(504, "GitHub API request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Helper: check GitHub rate-limit headers ─────────────────
function checkRateLimit(res) {
  const remaining = res.headers.get("x-ratelimit-remaining");
  if (remaining !== null && Number(remaining) === 0) {
    throw new RepoError(429, "GitHub API rate limit reached. Please try again later.");
  }
}

// ─── Tech stack detection ────────────────────────────────────
function detectTechStack(fileContents) {
  const stack = {
    languages: new Set(),
    frameworks: [],
    databases: [],
    tools: [],
    other: []
  };

  // Detect from package.json
  const pkgContent = fileContents["package.json"];
  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      stack.languages.add("JavaScript");

      if (allDeps["typescript"]) stack.languages.add("TypeScript");
      if (allDeps["react"] || allDeps["react-dom"]) stack.frameworks.push("React");
      if (allDeps["next"]) stack.frameworks.push("Next.js");
      if (allDeps["vue"]) stack.frameworks.push("Vue.js");
      if (allDeps["nuxt"]) stack.frameworks.push("Nuxt.js");
      if (allDeps["@angular/core"]) stack.frameworks.push("Angular");
      if (allDeps["svelte"]) stack.frameworks.push("Svelte");
      if (allDeps["express"]) stack.frameworks.push("Express.js");
      if (allDeps["fastify"]) stack.frameworks.push("Fastify");
      if (allDeps["koa"]) stack.frameworks.push("Koa");
      if (allDeps["hono"]) stack.frameworks.push("Hono");
      if (allDeps["nestjs"] || allDeps["@nestjs/core"]) stack.frameworks.push("NestJS");
      if (allDeps["mongoose"]) stack.databases.push("MongoDB (Mongoose)");
      if (allDeps["mongodb"]) stack.databases.push("MongoDB");
      if (allDeps["pg"] || allDeps["postgres"]) stack.databases.push("PostgreSQL");
      if (allDeps["mysql2"] || allDeps["mysql"]) stack.databases.push("MySQL");
      if (allDeps["prisma"] || allDeps["@prisma/client"]) stack.databases.push("Prisma ORM");
      if (allDeps["sequelize"]) stack.databases.push("Sequelize ORM");
      if (allDeps["drizzle-orm"]) stack.databases.push("Drizzle ORM");
      if (allDeps["redis"] || allDeps["ioredis"]) stack.databases.push("Redis");
      if (allDeps["tailwindcss"]) stack.tools.push("Tailwind CSS");
      if (allDeps["vite"]) stack.tools.push("Vite");
      if (allDeps["webpack"]) stack.tools.push("Webpack");
      if (allDeps["jest"]) stack.tools.push("Jest");
      if (allDeps["vitest"]) stack.tools.push("Vitest");
      if (allDeps["mocha"]) stack.tools.push("Mocha");
      if (allDeps["docker"]) stack.tools.push("Docker");
      if (allDeps["socket.io"]) stack.other.push("Socket.IO");
      if (allDeps["graphql"]) stack.other.push("GraphQL");
      if (allDeps["stripe"]) stack.other.push("Stripe");
    } catch { /* ignore parse errors */ }
  }

  // Detect from requirements.txt
  const reqContent = fileContents["requirements.txt"];
  if (reqContent) {
    stack.languages.add("Python");
    const reqs = reqContent.toLowerCase();
    if (reqs.includes("django")) stack.frameworks.push("Django");
    if (reqs.includes("flask")) stack.frameworks.push("Flask");
    if (reqs.includes("fastapi")) stack.frameworks.push("FastAPI");
    if (reqs.includes("sqlalchemy")) stack.databases.push("SQLAlchemy");
    if (reqs.includes("psycopg")) stack.databases.push("PostgreSQL");
    if (reqs.includes("pymongo")) stack.databases.push("MongoDB");
    if (reqs.includes("celery")) stack.tools.push("Celery");
    if (reqs.includes("pytest")) stack.tools.push("Pytest");
  }

  // Detect from pyproject.toml
  if (fileContents["pyproject.toml"]) {
    stack.languages.add("Python");
  }

  // Detect from pom.xml / build.gradle
  if (fileContents["pom.xml"]) {
    stack.languages.add("Java");
    const pom = fileContents["pom.xml"];
    if (pom.includes("spring-boot")) stack.frameworks.push("Spring Boot");
  }
  if (fileContents["build.gradle"] || fileContents["build.gradle.kts"]) {
    stack.languages.add("Java/Kotlin");
    const gradle = fileContents["build.gradle"] || fileContents["build.gradle.kts"];
    if (gradle.includes("spring")) stack.frameworks.push("Spring Boot");
    if (gradle.includes("kotlin")) stack.languages.add("Kotlin");
  }

  // Detect from go.mod
  if (fileContents["go.mod"]) {
    stack.languages.add("Go");
    const gomod = fileContents["go.mod"];
    if (gomod.includes("gin")) stack.frameworks.push("Gin");
    if (gomod.includes("echo")) stack.frameworks.push("Echo");
    if (gomod.includes("fiber")) stack.frameworks.push("Fiber");
  }

  // Detect from Cargo.toml
  if (fileContents["Cargo.toml"]) {
    stack.languages.add("Rust");
    const cargo = fileContents["Cargo.toml"];
    if (cargo.includes("actix")) stack.frameworks.push("Actix");
    if (cargo.includes("axum")) stack.frameworks.push("Axum");
    if (cargo.includes("rocket")) stack.frameworks.push("Rocket");
  }

  // Detect from composer.json
  if (fileContents["composer.json"]) {
    stack.languages.add("PHP");
    try {
      const composer = JSON.parse(fileContents["composer.json"]);
      const reqs = { ...composer.require, ...composer["require-dev"] };
      if (reqs["laravel/framework"]) stack.frameworks.push("Laravel");
      if (reqs["symfony/framework-bundle"]) stack.frameworks.push("Symfony");
    } catch { /* ignore */ }
  }

  // Detect from Gemfile
  if (fileContents["Gemfile"]) {
    stack.languages.add("Ruby");
    const gemfile = fileContents["Gemfile"];
    if (gemfile.includes("rails")) stack.frameworks.push("Ruby on Rails");
    if (gemfile.includes("sinatra")) stack.frameworks.push("Sinatra");
  }

  // Detect from Dockerfile
  if (fileContents["Dockerfile"] || fileContents["docker-compose.yml"] || fileContents["docker-compose.yaml"]) {
    stack.tools.push("Docker");
  }

  // Detect from file extensions in the tree
  return stack;
}

function formatTechStack(stack) {
  const parts = [];
  if (stack.languages.size > 0) parts.push(`Languages: ${[...stack.languages].join(", ")}`);
  if (stack.frameworks.length > 0) parts.push(`Frameworks: ${[...new Set(stack.frameworks)].join(", ")}`);
  if (stack.databases.length > 0) parts.push(`Databases: ${[...new Set(stack.databases)].join(", ")}`);
  if (stack.tools.length > 0) parts.push(`Tools: ${[...new Set(stack.tools)].join(", ")}`);
  if (stack.other.length > 0) parts.push(`Other: ${[...new Set(stack.other)].join(", ")}`);
  return parts.join("\n");
}

// ─── Core: Fetch and analyze a public GitHub repo ────────────

async function fetchRepoData(owner, repo) {
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "CodeReviewAI-Bot/1.0"
  };

  // 1. Fetch repository metadata
  console.log("[REPO] Fetching repository metadata");
  const metaRes = await fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}`, { headers });

  checkRateLimit(metaRes);

  if (!metaRes.ok) {
    if (metaRes.status === 404) {
      throw new RepoError(404, "Repository not found or it is private. Please provide a public GitHub repository.");
    }
    if (metaRes.status === 403) {
      // Could be rate-limit or access denied
      throw new RepoError(429, "GitHub API rate limit reached. Please try again later.");
    }
    throw new RepoError(metaRes.status, "GitHub API error while fetching repository metadata.");
  }
  const meta = await metaRes.json();
  console.log("[REPO] Repository metadata received");

  if (meta.private) {
    throw new RepoError(404, "Repository not found or it is private. Please provide a public GitHub repository.");
  }

  // 2. Fetch file tree (recursive)
  const defaultBranch = meta.default_branch || "main";
  console.log("[REPO] Fetching repository tree");
  const treeRes = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
    { headers }
  );

  checkRateLimit(treeRes);

  if (!treeRes.ok) {
    if (treeRes.status === 404) {
      throw new RepoError(404, "Repository not found or it is private. Please provide a public GitHub repository.");
    }
    if (treeRes.status === 403) {
      throw new RepoError(429, "GitHub API rate limit reached. Please try again later.");
    }
    throw new RepoError(treeRes.status, "Unable to read repository structure.");
  }
  const treeData = await treeRes.json();
  console.log("[REPO] Tree received");

  return { meta, tree: treeData.tree || [], defaultBranch };
}

function filterAndPrioritizeFiles(tree) {
  const maxFiles = MAX_FILES;
  const maxFileSizeBytes = MAX_FILE_SIZE_KB * 1024;

  // Filter out ignored directories, files, and binary extensions
  const candidates = tree.filter(item => {
    if (item.type !== "blob") return false;

    const path = item.path;
    const filename = path.split("/").pop();
    const ext = "." + filename.split(".").pop().toLowerCase();

    // Check ignored directories
    const pathParts = path.split("/");
    for (const part of pathParts.slice(0, -1)) {
      if (IGNORED_DIRS.has(part)) return false;
    }

    // Check ignored files
    if (IGNORED_FILES.has(filename)) return false;

    // Check ignored extensions
    if (IGNORED_EXTENSIONS.has(ext)) return false;
    if (path.endsWith(".min.js") || path.endsWith(".min.css")) return false;

    // Check file size (tree provides size for blobs)
    if (item.size && item.size > maxFileSizeBytes) return false;

    // Must be a source/config extension
    if (!SOURCE_EXTENSIONS.has(ext) && !PRIORITY_FILES.has(filename)) {
      // Check config patterns
      const isPriorityConfig = PRIORITY_CONFIG_PATTERNS.some(p => p.test(filename));
      if (!isPriorityConfig) return false;
    }

    return true;
  });

  console.log(`[REPO] Candidate files found: ${candidates.length}`);

  // Score and sort files by priority
  const scored = candidates.map(item => {
    const path = item.path;
    const filename = path.split("/").pop();
    let score = 0;

    // Priority files get highest score
    if (PRIORITY_FILES.has(filename)) score += 100;

    // Priority config patterns
    if (PRIORITY_CONFIG_PATTERNS.some(p => p.test(filename))) score += 80;

    // Files in priority directories
    for (const dir of PRIORITY_DIRS) {
      if (path.includes(dir)) {
        score += 60;
        break;
      }
    }

    // Entry point files
    if (/^(index|main|app|server)\.(js|ts|jsx|tsx|py|go|rs|java|rb|php)$/.test(filename)) {
      score += 70;
    }

    // Shorter paths = more likely to be important
    const depth = path.split("/").length;
    score += Math.max(0, 20 - depth * 3);

    return { ...item, score };
  });

  // Sort by score descending, take top N
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, maxFiles);
  console.log(`[REPO] Files selected: ${selected.length}`);
  return selected;
}

async function fetchFileContents(owner, repo, branch, files) {
  const maxTotalBytes = MAX_TOTAL_SIZE_MB * 1024 * 1024;
  let totalBytes = 0;
  const contents = {};
  const headers = {
    "User-Agent": "CodeReviewAI-Bot/1.0"
  };

  // Fetch files in small batches
  const BATCH_SIZE = 10;
  let limitReached = false;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    if (limitReached) break;

    const batch = files.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (file) => {
        // Use raw.githubusercontent.com to avoid standard GitHub API rate limits!
        const res = await fetchWithTimeout(
          `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`,
          { headers }
        );

        if (res.status === 429) {
          console.warn("[REPO] Rate limit hit on raw.githubusercontent.com");
          return null;
        }

        if (!res.ok) return null;
        const text = await res.text();
        return { path: file.path, content: text };
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        const { path, content } = result.value;
        const byteSize = Buffer.byteLength(content, "utf-8");

        if (totalBytes + byteSize > maxTotalBytes) {
          limitReached = true;
          break;
        }

        totalBytes += byteSize;
        contents[path] = content;
      }
    }
  }

  const sizeMB = (totalBytes / (1024 * 1024)).toFixed(2);
  const sizeKB = (totalBytes / 1024).toFixed(1);
  console.log(`[REPO] Total context size: ${totalBytes > 1024 * 1024 ? sizeMB + " MB" : sizeKB + " KB"}`);

  return { contents, totalBytes, limitReached };
}

// ─── Build compact context for the AI prompt ─────────────────

function buildRepoContext(meta, tree, fileContents, limitReached) {
  const allFilePaths = tree
    .filter(item => item.type === "blob")
    .map(item => item.path);

  const techStack = detectTechStack(fileContents);
  const techStackFormatted = formatTechStack(techStack);

  // Build file structure (truncated if huge)
  const structureLines = allFilePaths.slice(0, 200);
  const structureTruncated = allFilePaths.length > 200;

  // Build file contents section (compact)
  const fileContentSections = [];
  for (const [path, content] of Object.entries(fileContents)) {
    // Truncate individual file content for the prompt
    const truncated = content.length > 8000
      ? content.substring(0, 8000) + "\n... (truncated)"
      : content;
    fileContentSections.push(`--- FILE: ${path} ---\n${truncated}`);
  }

  let finalFileContents = fileContentSections.join("\n\n");
  
  // Truncate the entire context to prevent exceeding the LLM token limit (approx 20,000 chars is ultra-safe for any model)
  const MAX_CONTEXT_LENGTH = 20000;
  if (finalFileContents.length > MAX_CONTEXT_LENGTH) {
    finalFileContents = finalFileContents.substring(0, MAX_CONTEXT_LENGTH) + "\n\n... (Context truncated due to size limits to ensure AI stability)";
    limitReached = true;
  }

  const context = {
    name: meta.full_name,
    description: meta.description || "No description provided",
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    language: meta.language || "Not specified",
    topics: (meta.topics || []).join(", ") || "None",
    createdAt: meta.created_at,
    updatedAt: meta.updated_at,
    defaultBranch: meta.default_branch,
    totalFiles: allFilePaths.length,
    analyzedFiles: Object.keys(fileContents).length,
    techStack: techStackFormatted,
    structure: structureLines.join("\n") + (structureTruncated ? "\n... (truncated)" : ""),
    fileContents: finalFileContents,
    limitReached
  };

  return context;
}

// ─── Public API ──────────────────────────────────────────────

module.exports = {
  parseGitHubUrl,
  validateGitHubUrl,
  fetchRepoData,
  filterAndPrioritizeFiles,
  fetchFileContents,
  buildRepoContext,
  RepoError
};
