const fs = require('fs');

// Fix jwt.ts
let jwtPath = __dirname + '/src/utils/jwt.ts';
let jwtContent = fs.readFileSync(jwtPath, 'utf8');
jwtContent = jwtContent.replace(/generateToken\s*=\s*\((userId)\)/g, 'generateToken = (userId: string)');
jwtContent = jwtContent.replace(/verifyToken\s*=\s*\((token)\)/g, 'verifyToken = (token: string)');
jwtContent = jwtContent.replace(/setTokenCookie\s*=\s*\((res, userId)\)/g, 'setTokenCookie = (res: Response, userId: string)');
jwtContent = jwtContent.replace(/clearTokenCookie\s*=\s*\((res)\)/g, 'clearTokenCookie = (res: Response)');
jwtContent = jwtContent.replace(/process\.env\.JWT_SECRET\s*(?!as)/g, '(process.env.JWT_SECRET as string)');
fs.writeFileSync(jwtPath, jwtContent);

// Fix resetToken.ts
let resetPath = __dirname + '/src/utils/resetToken.ts';
let resetContent = fs.readFileSync(resetPath, 'utf8');
resetContent = resetContent.replace(/hashToken\s*=\s*\((rawToken)\)/g, 'hashToken = (rawToken: string)');
fs.writeFileSync(resetPath, resetContent);

// Fix repo.service.ts
let repoPath = __dirname + '/src/services/repo.service.ts';
let repoContent = fs.readFileSync(repoPath, 'utf8');

// The `stack` arrays that are causing "Argument of type '"Stack"' is not assignable to parameter of type 'never'"
// are probably typed as `[]` because they are initialized as `const frameworks = []`.
repoContent = repoContent.replace(/const frameworks = \[\];/g, 'const frameworks: string[] = [];');
repoContent = repoContent.replace(/const languages = \[\];/g, 'const languages: string[] = [];');
repoContent = repoContent.replace(/const libraries = \[\];/g, 'const libraries: string[] = [];');
repoContent = repoContent.replace(/const tools = \[\];/g, 'const tools: string[] = [];');
repoContent = repoContent.replace(/const databases = \[\];/g, 'const databases: string[] = [];');
repoContent = repoContent.replace(/const testing = \[\];/g, 'const testing: string[] = [];');

repoContent = repoContent.replace(/function fetchRepoData\(owner, repo\)/g, 'async function fetchRepoData(owner: string, repo: string)');
repoContent = repoContent.replace(/const fetchRepoData = async \(owner, repo\)/g, 'const fetchRepoData = async (owner: string, repo: string)');
repoContent = repoContent.replace(/function filterAndPrioritizeFiles\(tree\)/g, 'function filterAndPrioritizeFiles(tree: any[])');
repoContent = repoContent.replace(/const filterAndPrioritizeFiles = \(tree\)/g, 'const filterAndPrioritizeFiles = (tree: any[])');
repoContent = repoContent.replace(/const fetchFileContents = async \(owner, repo, branch, files\)/g, 'const fetchFileContents = async (owner: string, repo: string, branch: string, files: any[])');
repoContent = repoContent.replace(/const buildRepoContext = \(meta, tree, fileContents, limitReached\)/g, 'const buildRepoContext = (meta: any, tree: any[], fileContents: any[], limitReached: boolean)');
repoContent = repoContent.replace(/let item of tree/g, 'let item of (tree as any[])');
repoContent = repoContent.replace(/tree\.filter\(\(item\)/g, 'tree.filter((item: any)');
repoContent = repoContent.replace(/tree\.filter\(\(file\)/g, 'tree.filter((file: any)');
repoContent = repoContent.replace(/tree\.forEach\(\(item\)/g, 'tree.forEach((item: any)');
repoContent = repoContent.replace(/tree\.forEach\(\(file\)/g, 'tree.forEach((file: any)');
repoContent = repoContent.replace(/tree\.sort\(\(a, b\)/g, 'tree.sort((a: any, b: any)');
repoContent = repoContent.replace(/files\.map\(async \(file\)/g, 'files.map(async (file: any)');
repoContent = repoContent.replace(/determineStack\(stack\)/g, 'determineStack(stack: any)');
repoContent = repoContent.replace(/const determineStack = \(stack\)/g, 'const determineStack = (stack: any)');
repoContent = repoContent.replace(/typeof content !== 'string'/g, 'typeof (content as any) !== "string"');
repoContent = repoContent.replace(/content\.substring/g, '(content as string).substring');
repoContent = repoContent.replace(/fileContents\.forEach\(\(content, file\)/g, 'fileContents.forEach((content: any, file: any)');
repoContent = repoContent.replace(/content = content\.substring/g, 'content = (content as string).substring');

fs.writeFileSync(repoPath, repoContent);

console.log('Fixed repo, jwt, resetToken');
