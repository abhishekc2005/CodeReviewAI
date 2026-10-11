# AI Code Reviewer

An AI powered code review web application built using React, Node.js and Gemini API.

## Features

- AI powered code review
- Syntax highlighted code editor
- Language selection (JavaScript, Python, C++)
- Copy review button
- Loading indicator
- Markdown formatted responses

## Tech Stack

Frontend
- React
- PrismJS
- React Simple Code Editor

Backend
- Node.js
- Express
- Gemini API

## Deployment

Frontend: Vercel  
Backend: Render

## Usage

1. Paste your code into the editor
2. Select programming language
3. Click *Review Code*
4. AI will generate suggestions

## Running with Docker

### Prerequisites
- Docker Desktop on Windows/macOS
- Docker Engine and Docker Compose on Linux
- Git

### Setup & Local Startup

1. From the repository root:
   ```bash
   cd CodeReviewAI
   ```
2. Create `backend/.env` using `backend/.env.example` and fill in your external service credentials (MongoDB Atlas, Groq API, GitHub API, Resend).
3. Build and run:
   ```bash
   docker compose up --build
   ```

### Access
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### Useful Docker Commands
```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs
docker compose logs backend
docker compose logs frontend
docker compose logs -f
docker compose down
```

> **Note:** MongoDB Atlas, Groq, GitHub, and Resend remain external APIs and are configured via `backend/.env`.

## Author

Abhishek Choudhary
