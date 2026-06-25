# Altus Backend — Claude Code Context

## Project
Node.js + Express + TypeScript + PostgreSQL backend for **Altus** (formerly MoveVerse) — a fitness game where players complete exercises tracked by MediaPipe on the frontend and compete on a leaderboard.

- **Local:** `http://localhost:5600` · Docker-based dev (`docker compose up -d`)
- **Production:** `https://api.altus.games` · Heroku (app name: `moveverse-backend`)
- **Route prefix:** `/v1/` (not `/api/v1/`)
- **Terminal:** Git Bash always

## Mentor approach — non-negotiable
- User writes ALL source code (`.ts`, `.sql`, config files) — never write these directly
- Explain business-why first, then derive technical design from user stories
- Show code only as examples in chat or in `EXAMPLES/` folder
- Every conceptual question must be logged immediately as a lesson in `docs/learning-log.md`
- When updating learning log, also update `docs/backend-roadmap.md`
- Remind user to commit at the end of each completed phase

## Architecture — Route → Controller → Service → Model
```
src/routes/       URL → controller mapping
src/controllers/  unpack req, call service, send res
src/services/     business logic
src/models/       SQL queries only
src/middleware/   auth.middleware.ts — requireAuth (JWT check → req.user.userId)
src/types/        express.d.ts — adds req.user to Express types
src/config/       db.ts — pg connection pool
```

## Naming conventions
| Layer | Pattern | Example |
|---|---|---|
| Model | `verb + Noun` — DB action | `getAllExercises`, `createUser`, `findByEmail` |
| Service | `verb` — business action | `getExercises`, `register`, `login` |
| Controller | `handle` + action | `handleGetExercises`, `handleRegister` |

## Current state
- Phases 1–7a complete and merged to `main` — deployed to Heroku
- Phase 7b (Google OAuth) deferred
- Phase 8 (Exercises endpoint) complete — `GET /v1/exercises` built and tested
- **Next: Phase 9 — Workout Sessions**

## Branch strategy
```
main → production (Heroku auto-deploys)
dev  → integration
feat/* → one branch per phase (current: merge feat/exercises → dev → main)
```

## Key decisions already made
- Difficulties nested inside exercises response — no separate endpoint (avoids N+1)
- `exercise_difficulty_id` from GET /exercises is sent to POST /workout_sessions
- Score and calories calculated server-side only — frontend never sends a score
- JWT payload: `{ userId }` only — 7 day expiry
- Logout is client-side only for MVP — no blacklist needed
- `AppError` class lives in `auth.service.ts` for now — move to shared utils in Phase 13

## Key docs
- `docs/API-specifications.md` — full endpoint spec and response shapes
- `docs/backend-roadmap.md` — phase plan and progress
- `docs/learning-log.md` — 122 lessons logged (Lessons 0–122, Phase 1–9, read before answering questions)
- `docs/learning-log-part2.md` — topic-based reference (Phase 9+, automated testing onwards)
- `docs/user-stories.md` — user stories mapped to phases
- `EXAMPLES/` — reference files for each layer (model, service, controller, routes)
