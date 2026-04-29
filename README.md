# SnapLink - Smart URL Shortener

SnapLink is a full-stack MVP that lets users register, create short URLs, manage links, and view basic click analytics.

## MVP Features

- JWT authentication (register/login/me)
- Create short links
- Redirect by short code
- Track click counts
- My links dashboard
- Delete owned links
- Basic analytics cards
- Responsive React + Tailwind UI

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, Vite
- Backend: Node.js, Express, PostgreSQL, Prisma, JWT, bcrypt

## Project Structure

- `backend/` - REST API + redirect handler
- `frontend/` - React web app

## Local Setup

### 1) Backend

```bash
cd backend
npm install
copy .env.example .env
```

Set values in `.env`:

- `DATABASE_URL`
- `DIRECT_URL` (recommended for Supabase migrations)
- `JWT_SECRET`
- `BASE_URL` (example: `http://localhost:5000`)

Run DB migrations (creates tables in PostgreSQL):

```bash
npx prisma migrate dev
```

Run server:

```bash
npm run dev
```

## Supabase setup (PostgreSQL)
1. Create a Supabase project.
2. In Supabase dashboard: **Project Settings → Database → Connection string**.
3. Put the values into `backend/.env`:
   - **`DIRECT_URL`**: use the *direct* Postgres connection string (port `5432`) and ensure it includes `sslmode=require`.
   - **`DATABASE_URL`**: you can use Supabase’s *pooler* connection string (port `6543`) for runtime.
4. Create the tables on Supabase:

```bash
cd backend
npx prisma migrate dev
```

For CI/production deploys (no dev prompts), use:

```bash
npm run prisma:deploy
```

### 2) Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend default: `http://localhost:5173`
Backend default: `http://localhost:5000`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### URL

- `POST /api/url/create`
- `GET /api/url/my-links`
- `DELETE /api/url/:id`
- `GET /api/url/stats/:id`

### Redirect

- `GET /:shortCode`
