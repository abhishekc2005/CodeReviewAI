# CodeReviewAI

CodeReviewAI is a full-stack, AI-powered code and repository review application built with React, TypeScript, Node.js, Express, Groq, and MongoDB.

---

## Running with Docker

### Prerequisites
- Docker Desktop on Windows / macOS
- Docker Engine and Docker Compose on Linux
- Git

### Setup & Local Startup

1. Clone and navigate to the project directory:
   ```bash
   cd CodeReviewAI
   ```

2. Create `backend/.env` using `backend/.env.example` as a template, and fill in your external service credentials:
   ```bash
   cp backend/.env.example backend/.env
   ```
   > **Note:** MongoDB Atlas, Groq API, GitHub API, and Resend remain external services and are accessed securely via credentials in `backend/.env`. Do not commit `.env` to version control.

3. Build and start the containers:
   ```bash
   docker compose up --build
   ```

### Accessing the Application
- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## Useful Docker Commands

- **Build images without starting:**
  ```bash
  docker compose build
  ```

- **Run in detached mode (background):**
  ```bash
  docker compose up -d
  ```

- **Check container status:**
  ```bash
  docker compose ps
  ```

- **View combined logs:**
  ```bash
  docker compose logs
  ```

- **Follow logs in real-time:**
  ```bash
  docker compose logs -f
  ```

- **View service-specific logs:**
  ```bash
  docker compose logs backend
  docker compose logs frontend
  ```

- **Stop and remove containers:**
  ```bash
  docker compose down
  ```

---

## Live Deployment
- **Frontend**: Vercel
- **Backend**: Render
