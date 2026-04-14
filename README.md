# Blood Donation Server

![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

A production-grade REST API for the Blood Donation platform. Connects donors with recipients through secure request management, real-time notifications, async job queues, structured logging, and a full integration test suite.

- JWT authentication — access token in memory, refresh token as HTTP-only cookie
- Role-based access control — `USER`, `ADMIN`, `SUPER_ADMIN`
- Donation request lifecycle — create, approve/reject, complete with status transition guards
- Real-time WebSocket notifications via Socket.io (donation events delivered to connected clients)
- Async job queue with BullMQ + Redis — welcome emails, donation alerts, status updates
- Structured logging with Winston — colorized dev output, daily-rotating JSON files in production
- Full integration test suite — 57 tests across 7 suites (Jest + Supertest)
- Docker + Docker Compose — multi-stage build with PostgreSQL and Redis services
- CI/CD pipeline — GitHub Actions runs typecheck and full test suite on every push

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Module Structure](#module-structure)
- [Middleware Stack](#middleware-stack)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Health Check](#health-check)
- [Job Queue](#job-queue)
- [Logging](#logging)

---

## Architecture Overview

The server follows a layered module pattern. Every domain module is self-contained with its own controller, service, route, validation, and type files. Cross-cutting concerns (auth, error handling, rate limiting, logging) live in shared middleware.

```text
src/
├── app/
│   ├── config/         # Zod-validated env vars (fail-fast at startup)
│   ├── error/          # AppError custom class
│   ├── lib/            # Singletons: Redis client, Winston logger
│   ├── middleware/      # auth, validateRequest, rateLimiter, httpLogger, globalErrorHandler
│   ├── modules/        # Domain modules (auth, donation, profile, review, user, meta, event, queue)
│   ├── routes/         # Central router — mounts all module routers
│   └── utils/          # catchAsync, sendResponse, pagination, Prisma filter helpers
├── app.ts              # Express app assembly
└── server.ts           # HTTP server, worker boot, graceful shutdown
```

---

## Tech Stack

| Layer                | Technology                                                    |
| -------------------- | ------------------------------------------------------------- |
| Runtime              | Node.js 20                                                    |
| Framework            | Express 4                                                     |
| Language             | TypeScript 5                                                  |
| ORM                  | Prisma 5                                                      |
| Database             | PostgreSQL                                                    |
| Cache / Queue broker | Redis (ioredis)                                               |
| Job queue            | BullMQ                                                        |
| Auth                 | JWT (access token in memory + refresh token HTTP-only cookie) |
| Validation           | Zod                                                           |
| Password hashing     | bcrypt                                                        |
| Security headers     | Helmet                                                        |
| Compression          | compression (gzip)                                            |
| Rate limiting        | express-rate-limit                                            |
| Logging              | Winston + winston-daily-rotate-file + Morgan                  |
| Testing              | Jest 29 + ts-jest + Supertest                                 |

---

## Module Structure

Each module under `src/app/modules/{name}/` follows this exact pattern:

```text
{name}.controller.ts   — thin layer; calls service, sends response via sendResponse()
{name}.service.ts      — all business logic, Prisma queries, transactions
{name}.route.ts        — Express router; applies auth() and validateRequest()
{name}.validation.ts   — Zod input schemas
{name}.type.ts         — TypeScript types for the module
```

**Existing modules:** `auth` · `donation` · `profile` · `review` · `user` · `meta` · `event` · `queue`

---

## Middleware Stack

Middleware is applied in this order inside `app.ts`:

1. `helmet()` — security headers
2. `compression()` — gzip response compression
3. `httpLogger` — Morgan request logging piped into Winston
4. `cors()` — whitelisted origins with credentials
5. `cookieParser()`
6. `express.json()`
7. `globalRateLimiter` — 100 req / 15 min per IP (all routes)
8. `authRateLimiter` — 20 req / 15 min per IP on `/api/register`, `/api/login`, `/api/auth/refresh-token`
9. `/api` router
10. `globalErrorHandler`
11. `notFound` handler

> Rate limiters are disabled automatically when `NODE_ENV=test`.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth

| Method | Path                    | Auth                       | Description                                       |
| ------ | ----------------------- | -------------------------- | ------------------------------------------------- |
| POST   | `/register`             | Public                     | Register a new user                               |
| POST   | `/login`                | Public                     | Login, returns access token + sets refresh cookie |
| POST   | `/auth/refresh-token`   | Cookie                     | Issue new access token via refresh token          |
| POST   | `/auth/change-password` | User / Admin / Super Admin | Change own password                               |

### Profile

| Method | Path                      | Auth                       | Description                  |
| ------ | ------------------------- | -------------------------- | ---------------------------- |
| GET    | `/my-profile`             | User / Admin / Super Admin | Get own profile              |
| PUT    | `/my-profile`             | User / Admin / Super Admin | Update own profile           |
| GET    | `/donor-details/:donorId` | Public                     | Get a donor's public profile |

### Donation

| Method | Path                                        | Auth                       | Description                                 |
| ------ | ------------------------------------------- | -------------------------- | ------------------------------------------- |
| POST   | `/donation-request`                         | User / Admin / Super Admin | Create a blood donation request             |
| GET    | `/donation-request`                         | Admin / Super Admin        | List all donation requests                  |
| GET    | `/donation-request/my-donor-requests`       | User                       | Requests where I am the donor               |
| GET    | `/donation-request/my-donation-requests`    | User                       | Requests I have made                        |
| GET    | `/donation-request/check-donation-request`  | User                       | Check if a request exists between two users |
| GET    | `/donation-request/donation-request-status` | User                       | Get status of a specific request            |
| PUT    | `/donation-request/:requestId`              | User                       | Update request (accept / reject)            |
| PUT    | `/donation-request/complete/:requestId`     | User                       | Mark request as completed                   |
| GET    | `/donor-list`                               | Public                     | Paginated donor list with filters           |

### Users (Admin)

| Method | Path             | Auth                | Description                        |
| ------ | ---------------- | ------------------- | ---------------------------------- |
| GET    | `/users`         | Admin / Super Admin | List all users (paginated)         |
| PUT    | `/users/:userId` | Admin / Super Admin | Change user active/inactive status |

### Reviews

| Method | Path                  | Auth                       | Description     |
| ------ | --------------------- | -------------------------- | --------------- |
| POST   | `/review`             | User                       | Create a review |
| GET    | `/review`             | User / Admin / Super Admin | Get own review  |
| GET    | `/review/all-reviews` | Public                     | Get all reviews |

### Events

| Method | Path                                 | Auth                | Description                      |
| ------ | ------------------------------------ | ------------------- | -------------------------------- |
| POST   | `/event`                             | Admin / Super Admin | Create a blood donation event    |
| POST   | `/event/event-registration/:eventId` | User                | Register for an event            |
| PATCH  | `/event/event-registration/:eventId` | Admin / Super Admin | Update event registration status |
| GET    | `/event/:eventId`                    | Public              | Get a single event               |
| GET    | `/event`                             | Public              | List all events                  |

### Meta

| Method | Path               | Auth                | Description             |
| ------ | ------------------ | ------------------- | ----------------------- |
| GET    | `/meta-data`       | User                | User-scoped statistics  |
| GET    | `/meta-data/admin` | Admin / Super Admin | Admin-scoped statistics |

### System

| Method | Path      | Auth   | Description                 |
| ------ | --------- | ------ | --------------------------- |
| GET    | `/health` | Public | Server + Redis health check |

---

## Environment Variables

All variables are validated at startup via Zod. The server exits immediately with a clear error if any required variable is missing. Copy `.env.example` to `.env` and fill in values.

```bash
cp .env.example .env
```

| Variable                 | Required | Default       | Description                                            |
| ------------------------ | -------- | ------------- | ------------------------------------------------------ |
| `NODE_ENV`               | No       | `development` | `development` \| `production` \| `test`                |
| `PORT`                   | No       | `5000`        | HTTP server port                                       |
| `DATABASE_URL`           | **Yes**  | —             | PostgreSQL connection string                           |
| `JWT_ACCESS_SECRET`      | **Yes**  | —             | Secret for signing access tokens (min 32 chars)        |
| `JWT_REFRESH_SECRET`     | **Yes**  | —             | Secret for signing refresh tokens (min 32 chars)       |
| `JWT_ACCESS_EXPIRES_IN`  | **Yes**  | —             | Access token TTL, e.g. `15m`                           |
| `JWT_REFRESH_EXPIRES_IN` | **Yes**  | —             | Refresh token TTL, e.g. `30d`                          |
| `SALT_ROUNDS`            | **Yes**  | —             | bcrypt rounds (use `12` for production, `1` for tests) |
| `REDIS_URL`              | No       | —             | Redis connection string; queue is disabled if absent   |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 7+ (optional — queue features degrade gracefully if absent)

### Install

```bash
npm install
```

### Database setup

```bash
# Apply all migrations
npx prisma migrate dev

# Or push schema without migration files (dev only)
npx prisma db push
```

### Development

```bash
npm run start         # ts-node-dev with hot reload
npm run studio        # open Prisma Studio
```

### Production build

```bash
npm run build         # compiles TypeScript → dist/
node dist/server.js   # run compiled output
```

---

## Running Tests

Tests use a separate database and `.env.test`. The test runner resets the database schema before every run.

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# CI mode (sequential, no watch)
npm run test:ci
```

### Test database setup

Create a separate PostgreSQL database (e.g. `blood_donation_test`) and set it in `.env.test`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/blood_donation_test
SALT_ROUNDS=1
# Leave REDIS_URL unset — queue is disabled in tests
```

### Test suite

| File                      | Cases | Endpoints                                                          |
| ------------------------- | ----- | ------------------------------------------------------------------ |
| `health.test.ts`          | 3     | GET /health, GET /, 404                                            |
| `auth.test.ts`            | 14    | POST /register, /login, /auth/refresh-token, /auth/change-password |
| `profile.test.ts`         | 7     | GET/PUT /my-profile, GET /donor-details/:id                        |
| `donorList.test.ts`       | 4     | GET /donor-list                                                    |
| `donationRequest.test.ts` | 12    | POST/GET/PUT /donation-request                                     |
| `user.test.ts`            | 7     | GET/PUT /users                                                     |
| `meta.test.ts`            | 6     | GET /meta-data, GET /meta-data/admin                               |

---

## Health Check

```http
GET /health
```

Returns server status and Redis connectivity:

```json
{
  "success": true,
  "message": "Server is healthy",
  "redis": {
    "status": "connected"
  }
}
```

`redis.status` is one of `connected` | `disconnected` | `unconfigured`.

---

## Job Queue

The queue module (`src/app/modules/queue/`) is built on BullMQ + Redis.

**Job types:**

- `WELCOME_NOTIFICATION` — fired after successful user registration
- `DONATION_REQUEST_NOTIFICATION` — fired when a donation request is created
- `REQUEST_STATUS_UPDATE` — fired when a request status changes

The producer (`queue.service.ts`) no-ops silently when Redis is not configured, so the server runs without Redis in development and test environments. The worker starts after the HTTP server and is shut down cleanly on `SIGTERM` / `SIGINT`.

---

## Logging

Structured logging via Winston:

- **Development** — colorized human-readable output to console
- **Production** — JSON lines to console + daily-rotating files under `logs/`
  - `logs/application-YYYY-MM-DD.log` — all levels
  - `logs/error-YYYY-MM-DD.log` — error level only
- HTTP request logging via Morgan bridged into Winston at the `http` level
- `logs/` is excluded from version control via `.gitignore`

---

## Social Links

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adnan-sarkar-8b54341a0/)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/AdnanSarkar14)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/adnansarkaraduvai/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_a_d_u_v_a_i_/)
[![Hashnode](https://img.shields.io/badge/Hashnode-2962FF?style=for-the-badge&logo=hashnode&logoColor=white)](https://adnansarkar.hashnode.dev/)
