# SnapLink — Smart URL Shortener & Analytics Platform

<div align="center">

![SnapLink Banner](https://img.shields.io/badge/SnapLink-Smart%20URL%20Shortener-cyan?style=for-the-badge&logo=link&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

**Create powerful short links, track performance, and grow your online presence — all in one place.**

[Get Started](#-local-setup) · [API Reference](#-api-reference) · [Docker Setup](#-docker--local-postgres)

</div>

---

## 📖 Overview

SnapLink is a full-stack URL shortening platform built with a modern, production-ready architecture. Users can register an account, generate compact short links from any long URL, and monitor click analytics through a sleek dashboard. Every redirect automatically increments a click counter, giving you real-time insight into link performance.

The interface features a dark-themed, glassmorphism-inspired UI with ambient animations, smooth transitions, and a fully responsive layout — built with React 18, Tailwind CSS, and Vite.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure register/login/logout flow. Passwords are hashed with `bcryptjs` (10 salt rounds). Tokens are verified on every protected request via a dedicated `authMiddleware`. |
| ⚡ **Instant URL Shortening** | Generates a unique 7-character short code using `nanoid`. Validates the original URL (must include protocol) before persisting. |
| 🔀 **Smart Redirects** | Visiting `/:shortCode` immediately resolves the original URL and issues an HTTP redirect. Only active links are resolved. |
| 📊 **Click Analytics** | Each redirect atomically increments the link's `clickCount`. The Analytics page provides per-link stats with visual cards. |
| 🗂️ **My Links Dashboard** | Authenticated users can view all their created links, copy short URLs, and delete any link they own. |
| 🛡️ **Ownership Enforcement** | Delete and stats endpoints verify that the requesting user owns the target link before performing any action. |
| 📱 **Responsive Design** | Fully responsive layout across mobile, tablet, and desktop using Tailwind utility classes. |
| 🎨 **Premium UI** | Dark glassmorphism aesthetic with animated ambient orbs, glowing cards, gradient CTAs, and smooth entrance animations. |

---

## 🏗️ Architecture

```
SNAPLINK/
├── backend/                    # Node.js + Express REST API
│   ├── server.js               # App entry point — wires Express, CORS, routes
│   ├── config/
│   │   ├── db.js               # Prisma client connection initializer
│   │   └── prisma.js           # Singleton Prisma client export
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Url models)
│   │   └── migrations/         # Prisma migration history
│   ├── controllers/
│   │   ├── authController.js   # register, login, me handlers
│   │   └── urlController.js    # createShortUrl, getMyLinks, deleteLink, getLinkStats, redirectShortUrl
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification + user lookup
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/* route definitions
│   │   └── urlRoutes.js        # /api/url/* route definitions (all protected)
│   ├── utils/
│   │   └── generateToken.js    # JWT signing helper
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── frontend/                   # React 18 + Vite + Tailwind CSS SPA
│   ├── index.html              # HTML shell
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Custom Tailwind theme extensions
│   ├── src/
│   │   ├── main.jsx            # React + BrowserRouter mount point
│   │   ├── App.jsx             # Route definitions + ambient background
│   │   ├── index.css           # Global styles, animations, glassmorphism utilities
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Responsive navigation bar with auth state
│   │   │   ├── ProtectedRoute.jsx  # Auth guard — redirects to /login if unauthenticated
│   │   │   ├── UrlForm.jsx         # URL input form with validation feedback
│   │   │   └── UrlTable.jsx        # Links table with copy-to-clipboard & delete
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (user, token) via React Context
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page — hero, stats, features, CTA
│   │   │   ├── Login.jsx           # Login form page
│   │   │   ├── Register.jsx        # Registration form page
│   │   │   ├── Dashboard.jsx       # Authenticated link management page
│   │   │   └── Analytics.jsx       # Per-link analytics & stats cards
│   │   └── services/
│   │       └── api.js              # Axios instance with base URL config
│   └── package.json
│
├── docker-compose.yml          # Local PostgreSQL 16 container
└── .gitignore
```

---

## 🗄️ Database Schema

SnapLink uses **PostgreSQL** managed via **Prisma ORM**. There are two models:

### `User`
| Column | Type | Notes |
|---|---|---|
| `id` | `String` (UUID) | Primary key |
| `name` | `String` | Display name |
| `email` | `String` | Unique, lowercased on write |
| `passwordHash` | `String` | bcrypt hash |
| `createdAt` | `DateTime` | Auto-set |
| `updatedAt` | `DateTime` | Auto-updated |

### `Url`
| Column | Type | Notes |
|---|---|---|
| `id` | `String` (UUID) | Primary key |
| `userId` | `String` | Foreign key → `User.id` (cascade delete) |
| `originalUrl` | `String` | Full destination URL |
| `shortCode` | `String` | Unique 7-char nanoid |
| `clickCount` | `Int` | Defaults to `0`, incremented on redirect |
| `isActive` | `Boolean` | Defaults to `true`; only active links redirect |
| `createdAt` | `DateTime` | Auto-set |
| `updatedAt` | `DateTime` | Auto-updated |

**Indexes:** `[userId, createdAt]` for fast dashboard queries; `[shortCode, isActive]` for fast redirect lookups.

> Deleting a user cascades and removes all their associated URLs.

---

## 🧰 Tech Stack

### Backend
| Technology | Version | Role |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | ^4.19 | HTTP framework |
| Prisma | ^6.0 | ORM + migrations |
| PostgreSQL | 16 | Relational database |
| `jsonwebtoken` | ^9.0 | JWT signing & verification |
| `bcryptjs` | ^2.4 | Password hashing |
| `nanoid` | ^3.3 | Short code generation |
| `validator` | ^13.12 | Email & URL validation |
| `cors` | ^2.8 | Cross-origin resource sharing |
| `dotenv` | ^16.4 | Environment variable loading |
| `nodemon` | ^3.1 | Dev auto-restart |

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | ^18.3 | UI framework |
| React Router DOM | ^6.26 | Client-side routing |
| Vite | ^5.4 | Build tool & dev server |
| Tailwind CSS | ^3.4 | Utility-first styling |
| Axios | ^1.7 | HTTP client |
| PostCSS / Autoprefixer | ^8 / ^10 | CSS processing |

---

## ⚙️ Local Setup

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **PostgreSQL** database (local via Docker or hosted via [Supabase](https://supabase.com))

---

### 1 — Backend

```bash
cd backend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # macOS / Linux
```

Edit `.env` and fill in the required values:

```dotenv
PORT=5000

# Runtime connection (pooled — recommended for Supabase PgBouncer)
DATABASE_URL=postgresql://postgres:<PASSWORD>@<HOST>:6543/postgres?pgbouncer=true&connection_limit=1

# Direct connection (used by Prisma migrate)
DIRECT_URL=postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres?sslmode=require

JWT_SECRET=replace_with_super_secret_key

# Base URL used when constructing short URLs returned by the API
BASE_URL=http://localhost:5000
```

Run database migrations to create all tables:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev        # nodemon — auto-restarts on file changes
# npm start        # plain node (production-like)
```

Backend runs at **http://localhost:5000**

---

### 2 — Frontend

```bash
cd frontend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # macOS / Linux
```

Edit `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🐳 Docker — Local Postgres

If you don't have PostgreSQL installed locally, spin up a containerised instance with:

```bash
docker compose up -d
```

This starts a **PostgreSQL 16** container with:
- **Database:** `snaplink`
- **User / Password:** `postgres` / `postgres`
- **Port:** `5432`
- **Persistent volume:** `snaplink_pg_data`

Then set your `backend/.env` connection strings to point at `localhost:5432`.

---

## ☁️ Supabase Setup (Hosted PostgreSQL)

1. Create a free project at [supabase.com](https://supabase.com).
2. Navigate to **Project Settings → Database → Connection string**.
3. Copy both connection strings into `backend/.env`:
   - **`DIRECT_URL`** → use the *Direct connection* string (port `5432`) — required for Prisma migrations.
   - **`DATABASE_URL`** → use the *Transaction Pooler* string (port `6543`) — used at runtime.
4. Run migrations:

```bash
cd backend
npx prisma migrate dev
```

For CI/production deployments (skips interactive prompts):

```bash
npm run prisma:deploy    # runs: prisma migrate deploy
```

---

## 🌐 Application Pages & Routing

| Route | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `Home.jsx` | No | Landing page with hero section, stats, features grid, and CTA |
| `/register` | `Register.jsx` | No | Account creation form |
| `/login` | `Login.jsx` | No | Login form |
| `/dashboard` | `Dashboard.jsx` | ✅ Yes | Create short links; view, copy, and delete your links |
| `/analytics` | `Analytics.jsx` | ✅ Yes | Per-link analytics cards with click count and metadata |

Protected routes are guarded by `ProtectedRoute.jsx`, which reads auth state from `AuthContext` and redirects unauthenticated users to `/login`.

---

## 📡 API Reference

All API endpoints are prefixed with the base URL (e.g., `http://localhost:5000`).

> **Authentication**: Protected routes require a `Bearer <token>` header. The token is returned on successful login or registration.

---

### Auth — `/api/auth`

#### `POST /api/auth/register`
Create a new user account.

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Success `201`:**
```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com" }
}
```

**Validation rules:** all fields required; valid email format; password ≥ 6 characters; email must not already be registered.

---

#### `POST /api/auth/login`
Authenticate and receive a JWT.

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

**Success `200`:**
```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com" }
}
```

---

#### `GET /api/auth/me` 🔒
Returns the profile of the currently authenticated user.

**Success `200`:**
```json
{
  "user": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com", "createdAt": "...", "updatedAt": "..." }
}
```

---

### URLs — `/api/url` 🔒 *(all routes require authentication)*

#### `POST /api/url/create`
Create a new short link.

**Request body:**
```json
{
  "originalUrl": "https://very-long-website-url.com/some/deep/path?with=query"
}
```

**Success `201`:**
```json
{
  "message": "Short URL created",
  "link": { "id": "uuid", "shortCode": "xK9mPq7", "originalUrl": "...", "clickCount": 0, "isActive": true, "createdAt": "...", "updatedAt": "..." },
  "shortUrl": "http://localhost:5000/xK9mPq7"
}
```

---

#### `GET /api/url/my-links`
Retrieve all links belonging to the authenticated user, ordered newest first.

**Success `200`:** Array of URL objects.

---

#### `DELETE /api/url/:id`
Delete a specific link by its UUID. Only the owning user may delete.

**Success `200`:**
```json
{ "message": "Link deleted" }
```

**Errors:** `404` if not found; `403` if the link belongs to another user.

---

#### `GET /api/url/stats/:id`
Get detailed stats for a specific link. Only accessible by the owning user.

**Success `200`:**
```json
{
  "id": "uuid",
  "originalUrl": "https://...",
  "shortCode": "xK9mPq7",
  "clickCount": 42,
  "createdAt": "...",
  "isActive": true
}
```

---

### Redirect — Public

#### `GET /:shortCode`
Resolves a short code and issues an HTTP `302` redirect to the original URL. Atomically increments `clickCount` before redirecting.

- Returns `404` if the short code does not exist or the link is inactive.

---

## 🔒 Security

- **Password hashing** — `bcryptjs` with 10 salt rounds. Plain-text passwords are never stored.
- **JWT verification** — Every protected endpoint passes through `authMiddleware`, which validates the token signature and fetches the user from the database on every request (prevents use of tokens after account changes).
- **Email normalization** — Emails are lowercased before storage and lookup to prevent duplicate registrations.
- **Ownership checks** — Delete and stats operations verify `link.userId === req.user.id` before proceeding.
- **URL validation** — `validator.isURL` with `require_protocol: true` prevents the creation of malformed or relative URLs.

---

## 🛠️ Available Scripts

### Backend (`/backend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `nodemon server.js` | Development server with hot-reload |
| `start` | `node server.js` | Production server |
| `prisma:generate` | `prisma generate` | Regenerate Prisma client after schema changes |
| `prisma:migrate` | `prisma migrate dev` | Run migrations in development |
| `prisma:deploy` | `prisma migrate deploy` | Apply migrations in production/CI |

### Frontend (`/frontend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Development server with HMR |
| `build` | `vite build` | Production build to `/dist` |
| `preview` | `vite preview` | Preview the production build locally |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute it as you see fit.

---

<div align="center">
  <strong>SnapLink</strong> — Crafted with precision. 🔗
</div>
