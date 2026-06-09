<p align="center">
  <h1 align="center">GradIQ</h1>
  <p align="center">
    AI-powered CV analysis platform for fresh graduates — score your resume, get actionable feedback, and improve your hireability.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Groq-AI-000000?style=for-the-badge" alt="Groq AI" />
</p>

---

## About

**GradIQ** is a backend API that helps fresh graduates evaluate and improve their CVs before they apply for jobs. Users upload a resume, and the platform extracts the text, runs it through an AI-powered ATS (Applicant Tracking System) analysis, and returns a structured score with strengths, weaknesses, missing keywords, and improvement suggestions.

Built with a production-minded stack: modular NestJS architecture, async job processing, OAuth authentication, and cloud file storage.

---

## Features

| Module | What it does |
|--------|--------------|
| **Authentication** | Local sign-up/sign-in, JWT sessions, GitHub & Google OAuth, temporary tokens for OAuth onboarding |
| **CV Management** | Upload PDF/DOCX resumes to Cloudinary, metadata storage, per-user CV library |
| **ATS Analysis** | Background CV processing via BullMQ — text extraction → Groq AI (Llama 3.3 70B) → structured feedback |
| **User Management** | Profile updates, role-based access (`USER` / `ADMIN`), linked OAuth provider accounts |
| **Job Matching** | Adzuna API integration scaffolded for future job-market matching |

### Highlights

- **Async pipeline** — CV uploads return immediately; analysis runs in a Redis-backed queue with retries
- **AI feedback** — Score (0–100), strengths, suggestions, missing keywords, and vulnerabilities
- **Secure by default** — JWT guards, role guards, bcrypt password hashing, validated env config (Joi)
- **API docs** — Interactive Swagger UI at `/api-docs`
- **Container-ready** — Multi-stage Dockerfile + Docker Compose (Postgres, Redis, pgAdmin)

---

## Tech Stack

### Core

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 |
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | PostgreSQL 16 |
| ORM | Drizzle ORM + Drizzle Kit migrations |
| Cache / Queue | Redis 7 + BullMQ |
| AI | Groq SDK — Llama 3.3 70B |
| File storage | Cloudinary |
| Auth | Passport.js (Local, JWT, GitHub, Google) |

### Supporting

- **Validation** — class-validator, class-transformer, Zod, Joi
- **Docs** — Swagger / OpenAPI
- **File parsing** — pdf-parse, mammoth (PDF & DOCX)
- **DevOps** — Docker, Docker Compose
- **Testing** — Jest, Supertest

---

## Architecture

```mermaid
flowchart LR
    Client([Client]) --> API[NestJS API]
    API --> Auth[Auth Module]
    API --> CV[CV Module]
    CV --> Cloudinary[(Cloudinary)]
    CV --> Queue[BullMQ Queue]
    Queue --> Worker[ATS Processor]
    Worker --> Groq[Groq AI]
    Worker --> DB[(PostgreSQL)]
    API --> DB
    Queue --> Redis[(Redis)]
    Auth --> DB
```

**CV analysis flow**

1. User uploads a CV (authenticated)
2. File is stored on Cloudinary; record saved in Postgres
3. A `process-cv` job is enqueued in BullMQ
4. Worker downloads the file, extracts text (PDF/DOCX)
5. Groq AI returns ATS score and feedback
6. Results persisted — fetch via `GET /ats/:cvId`

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register with email & password |
| `POST` | `/auth/signIn` | Local login → JWT |
| `GET` | `/auth/github` | GitHub OAuth |
| `GET` | `/auth/google` | Google OAuth |
| `POST` | `/auth/logout` | Invalidate session |
| `POST` | `/cv/upload` | Upload CV (multipart) |
| `GET` | `/cv/:cvId` | Get CV by ID |
| `GET` | `/cv/user/:userId` | List user's CVs |
| `GET` | `/ats/:cvId` | Get ATS analysis results |
| `GET` | `/users/getUserByToken` | Current user profile |

Full interactive documentation: **`http://localhost:3000/api-docs`**

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16
- Redis 7
- Accounts / keys for: Cloudinary, Groq, GitHub OAuth, Google OAuth

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/grad-iq.git
cd grad-iq
npm install
```

### Environment

Create `.env.development` in the project root:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/grad_iq
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=grad_iq

JWT_SECRET=your-secret-min-4-chars
JWT_EXPIRES_IN=7d

REDIS_HOST_DEV=localhost
REDIS_PORT=6379

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GROQ_API_KEY=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
```

### Database migrations

```bash
npm run start:migrate
```

### Run locally

```bash
# development (watch mode)
npm run start:dev

# production build
npm run build
npm run start:prod
```

### Run with Docker Compose

```bash
docker compose up --build
```

App: `http://localhost:3000` · pgAdmin: `http://localhost:5050`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run production build |
| `npm run start:migrate` | Apply Drizzle migrations |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | ESLint |

---

## Project Structure

```
grad-iq/
├── src/
│   ├── modules/
│   │   ├── auth/          # Registration, login, OAuth
│   │   ├── users/         # User profiles & roles
│   │   ├── cv/            # Upload, storage, queue dispatch
│   │   ├── ats/           # AI analysis & BullMQ worker
│   │   └── jobOffer/      # Job matching (in progress)
│   ├── db/
│   │   ├── schema/        # Drizzle table definitions
│   │   └── drizzle/       # SQL migrations
│   ├── config/            # Env validation & service configs
│   └── common/            # Guards, strategies, filters, interceptors
├── test/                  # E2E tests
├── docker-compose.yml
└── src/docker/dockerfile  # Multi-stage production image
```

---

## Roadmap

- [ ] Job market matching via Adzuna API
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Health check endpoint for production deploys
- [ ] Expanded test coverage & e2e with service containers

---

## License

UNLICENSED — private project.

---

## Share on LinkedIn

Copy the post below for your LinkedIn announcement.

---

### LinkedIn Post (copy-paste ready)

**Excited to share GradIQ — an AI-powered backend I built to help fresh graduates improve their CVs before they hit the job market.**

Applying for your first role is tough. Most resumes never make it past automated screening. GradIQ tackles that problem head-on: upload your CV, get an ATS-style score, and receive concrete feedback on strengths, gaps, missing keywords, and what to fix.

**What it does**
- Secure auth — email/password plus GitHub & Google OAuth
- CV upload & storage (PDF/DOCX) via Cloudinary
- Background AI analysis powered by Groq (Llama 3.3 70B)
- Structured ATS feedback — score, suggestions, keywords, vulnerabilities
- Role-based user management with JWT-protected API

**Built with**
NestJS · TypeScript · PostgreSQL · Drizzle ORM · Redis · BullMQ · Groq AI · Cloudinary · Passport.js · Docker · Swagger

The architecture uses async job queues so uploads stay fast while AI analysis runs in the background — the kind of pattern you'd see in a real production hiring tool.

More features on the way, including job market matching. Happy to connect with anyone working in backend, AI integrations, or career-tech.

Check out the repo on GitHub — link in comments / featured section.

**Hashtags**

`#NestJS` `#TypeScript` `#BackendDevelopment` `#NodeJS` `#PostgreSQL` `#Redis` `#BullMQ` `#ArtificialIntelligence` `#Groq` `#OpenSource` `#SoftwareEngineering` `#WebDevelopment` `#API` `#Docker` `#CareerDevelopment` `#FreshGraduates` `#ResumeBuilder` `#ATS` `#SideProject` `#BuildInPublic`

---

<p align="center">
  Built with NestJS · GradIQ © 2026
</p>
