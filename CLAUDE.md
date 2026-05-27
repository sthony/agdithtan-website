# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (`cd backend`)
```bash
npm install          # install dependencies
npm run dev          # start with nodemon (auto-reload) on port 4000
npm start            # start production server
npm run db:init      # create/migrate PostgreSQL tables
```

### Frontend (`cd frontend`)
```bash
npm install          # install dependencies
npm run dev          # Vite dev server on port 5173 (proxies /api → localhost:4000)
npm run build        # production build → frontend/dist/
npm run preview      # preview the production build
```

There are no tests in this project.

## Architecture

This is a Vue 3 + Express company profile site with a CMS-style admin backend. Content is stored in PostgreSQL and served via REST API to a SPA frontend.

**Request flow:**
1. Browser hits Vite dev server (`:5173`), which proxies `/api/*` → Express (`:4000`)
2. `App.vue` calls `GET /api/pages/all` on mount — a single aggregated query that fetches all sections in parallel and returns them as one JSON object
3. Each Vue component receives its slice of data as a prop and renders it

**Backend structure (`backend/`):**
- `server.js` — Express app entry; wires up middleware, routes, and calls `initDatabase()` at startup
- `config/database.js` — PostgreSQL pool via `pg`; exports `run()`, `get()`, `all()` helpers that wrap `pool.query()`; `initDatabase()` runs `CREATE TABLE IF NOT EXISTS` for every table
- `middleware/auth.js` — JWT verification (`authenticateToken`) and generation (`generateToken`, 24h expiry)
- `routes/pageRoutes.js` — public read-only endpoints; all admin routes are protected by `authenticateToken` applied at the router level in `server.js`
- `routes/adminRoutes.js` — write/delete endpoints for all content sections; uses upsert pattern (check for existing row, then UPDATE or INSERT)
- `routes/uploadRoutes.js` — multer-based image upload, stored under `backend/uploads/images/`, served at `/uploads/`
- `routes/contactRoutes.js` — saves contact form submissions to `contact_submissions` table and sends email via nodemailer

**Frontend structure (`frontend/src/`):**
- `App.vue` — root component; owns all data state, fetches `/api/pages/all`, distributes props to section components; re-fetches on `visibilitychange`
- `components/` — one file per page section (AppHeader, HeroSection, AboutSection, ServicesSection, HeroProjectSection, PortfolioSection, ContactSection, TeamSection, TestimonialsSection, AppFooter); all are stateless prop-driven components

**Database:** PostgreSQL. Connection configured via `DATABASE_URL` (takes priority) or individual `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD` vars. Tables are auto-created on server start. Singleton-style tables (header, hero, about, footer, hero_project) always hold at most one row — the upsert logic in admin routes enforces this. List tables (services, portfolio, team, testimonials) support ordering via `order_index`.

## Environment Setup

Copy and fill in `backend/.env.example` → `backend/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/agdith
PORT=4000
JWT_SECRET=<long random string>
SMTP_USER=...
SMTP_PASS=...       # Gmail App Password
CONTACT_EMAIL=...
```

The `.env.example` shows both `DATABASE_URL` (Option A) and individual vars (Option B); `DATABASE_URL` takes priority in `config/database.js`.

## Authentication Flow

- `POST /api/auth/register` — creates first admin (bcrypt password hash, stored in `admins` table)
- `POST /api/auth/login` — returns a 24h JWT
- All `/api/admin/*` routes require `Authorization: Bearer <token>` header
- `POST /api/upload/*` routes also require the JWT

## Notes

- The root-level files (`server.js`, `database.js`, `auth.js`, etc.) are an older prototype; the active code lives entirely under `backend/` and `frontend/`
- `social_media` in `footer_content` is stored as a JSON string; parse it before use
- Image uploads are stored locally in `backend/uploads/images/`; in production consider moving to object storage and updating URLs accordingly
