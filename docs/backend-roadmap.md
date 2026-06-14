# 🗺️ MoveVerse Backend — Build Roadmap

A step-by-step guide from setup to production.
This is a living document — update it as the project evolves.

---

## 🎯 Current Target — Phase 7b Google OAuth

Phase 7a is complete and merged to main. Google OAuth is the next active focus.

```
Phases 1–6   ✅ Done     Setup, server, Docker, CI/CD, database, seed data
Heroku       ✅ Live     App deployed, migrations ran, database seeded
Phase 7a     ✅ Done     Email + password auth — register, login, JWT middleware
Phase 7b     🔨 Next     Google OAuth
```

---

## 🌿 Branch Strategy

```
main  ──────────────────────────────────────────►  production (Heroku auto-deploys)
        ↑ PR + CI checks pass
dev   ──────────────────────────────────────────►  integration (your working branch)
        ↑ PR
feature/auth, feature/exercises, ...              individual features
```

| Branch | Purpose |
|---|---|
| `main` | Always deployable. Heroku deploys from here automatically. |
| `dev` | Where active development happens. Merge features here first. |
| `feature/*` | One branch per feature. PR into `dev` when done. |

**Rule:** Never push directly to `main`. Always go through `dev` → PR → `main`.

---

## 🤖 How GitHub Actions Grows With the Project

CI/CD starts simple and gains steps as there is more to check.
Each phase below notes when a new CI step is added.

```
After Phase 2  →  Level 1: lint check on every push
After Phase 3  →  Level 2: + TypeScript build check
After Phase 7  →  Level 3: + automated tests for auth endpoints
After Phase 12 →  Level 4: + full test suite on PR to main
```

| Level | Trigger | Steps | Purpose |
|---|---|---|---|
| 1 | Push to any branch | Lint + Prettier check | Catch style errors early |
| 2 | Push to any branch | + TypeScript build | Catch compile errors |
| 3 | Push to `dev` or `main` | + Auth tests | Protect the most critical feature |
| 4 | PR to `main` | + Full test suite | Gate production deployments |

---

## 📊 Progress Overview — ~50% complete (Phase 7a done, 7b next)

```
Phase 1  ████████████████████  ✅ Done          Setup & Tooling
Phase 2  ████████████████████  ✅ Done          Entry Point & Server
Phase 3  ████████████████████  ✅ Done          Docker
─────────────────────────────── 🚀 Deployed to Heroku ✅ Live
Phase 4  ████████████████████  ✅ Done          Database Connection
Phase 5  ████████████████████  ✅ Done          Schema & Migrations
Phase 6  ████████████████████  ✅ Done          Seed Data
Phase 7a ████████████████████  ✅ Done          Auth — Email + Password
Phase 7b ░░░░░░░░░░░░░░░░░░░░  🔨 Next          Auth — Google OAuth  ← active
Phase 8  ░░░░░░░░░░░░░░░░░░░░  ⏳ Upcoming       Exercises Endpoint
Phase 9  ░░░░░░░░░░░░░░░░░░░░  ⏳ Upcoming       Workout Sessions
Phase 10 ░░░░░░░░░░░░░░░░░░░░  ⏳ Upcoming       Achievement System
Phase 11 ░░░░░░░░░░░░░░░░░░░░  ⏳ Upcoming       User Profile
Phase 12 ░░░░░░░░░░░░░░░░░░░░  ⏳ Upcoming       Leaderboard & Public Profiles
Phase 13 ░░░░░░░░░░░░░░░░░░░░  ⏳ Upcoming       Validation & Error Handling
```

---

## ✅ Phase 1 — Setup & Tooling
> Goal: A clean, consistent project that every teammate can run the same way.

- [x] `npm init` — initialise the project with `package.json`
- [x] Install production dependencies — `express`, `pg`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`, `helmet`, `google-auth-library`
- [x] Install dev dependencies — `typescript`, `ts-node-dev`, `@types/*`, `eslint`, `prettier`
- [x] `tsconfig.json` — TypeScript compiler settings
- [x] Folder structure — `src/routes/`, `src/controllers/`, `src/services/`, `src/models/`, `src/middleware/`, `src/config/`
- [x] `.env` and `.env.example` — environment variables
- [x] `.gitignore` — excludes `node_modules/`, `.env`, `dist/`
- [x] ESLint config — `eslint.config.mjs`
- [x] Prettier config — `.prettierrc`
- [x] VS Code settings — `.vscode/settings.json` committed for team consistency

---

## ✅ Phase 2 — Entry Point & Server
> Goal: A working Express server that starts, applies middleware, and responds to a health check.

- [x] `src/index.ts` — imports (dotenv, express, cors, helmet)
- [x] Create the Express `app` instance
- [x] Apply global middleware — `helmet()`, `cors()`, `express.json()`
- [x] Mount a health check route — `GET /health` → `{ status: 'ok' }`
- [x] Start the server — `app.listen(PORT)`
- [x] Test: `npm run dev` → browser hits `http://localhost:3000/health`

```
src/index.ts
  ├── Load .env
  ├── Create Express app
  ├── Apply middleware (helmet, cors, json parser)
  ├── Mount routes
  └── app.listen(PORT)
```

### 🤖 CI Checkpoint — Add Level 1 after this phase

Create `.github/workflows/ci.yml`:

```
Trigger: push to any branch
Steps:
  1. npm ci
  2. npm run lint
  3. npm run format:check  (Prettier check, no auto-fix)
```

This runs on every push. If lint or formatting fails, the developer is notified before the code reaches `dev` or `main`.

---

## ✅ Phase 3 — Docker
> Goal: Node app + PostgreSQL both run in containers. No local PostgreSQL installation needed.

- [x] `Dockerfile` — how to build the Node.js image
- [x] `docker-compose.yml` — two services: `app` (Node) and `db` (PostgreSQL)
- [x] Add DB variables to `.env` — `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- [x] Test: `docker-compose up --build` starts both services
- [x] Test: `GET /health` responds from inside the container

```
docker-compose up
  ├── db   postgres:15   port 5432
  └── app  node:20       port 3000  (waits for db to be ready)
```

### 🤖 CI Checkpoint — Upgrade to Level 2 after this phase

Add to `ci.yml`:
```
  4. npm run build   (TypeScript compiles without errors)
```

### 🚀 Deployment Checkpoint — Deploy to Heroku after this phase

Do not wait until the project is finished to deploy. Deploy now with just the `/health` endpoint working. This gives you a live production URL early, and `main` is always deployable from this point on.

See `docs/cicd-procedure.md` for the full step-by-step setup.

- [x] Create Heroku app via the GitHub Student Developer Pack
- [x] Add Heroku Postgres (Mini plan) as an add-on
- [x] Add `engines` field to `package.json`
- [x] Create `Procfile` in project root (`release: npm run migrate:prod`, `web: npm start`)
- [x] Add `HEROKU_API_KEY` to GitHub Secrets
- [x] Add deploy job to `ci.yml` (runs only on push to `main`, needs CI to pass)
- [x] Set all config vars in Heroku dashboard
- [x] Verify: push to `main` → Heroku deploys → `GET https://moveverse-backend.herokuapp.com/health` responds

```
From this point on, the workflow is:

  feature branch  →  PR to dev  →  PR to main  →  Heroku auto-deploys
                                        ↑
                                   CI must pass
```

---

## ✅ Phase 4 — Database Connection
> Goal: The app connects to PostgreSQL using a connection pool shared across all models.

- [x] `src/config/db.ts` — create and export a `pg.Pool` using `.env` variables
- [x] On startup: test the connection, log success or exit with an error
- [x] Confirm pool is reused (not a new connection per query)

```
src/config/db.ts  →  exports pool
                          ↓
                   imported by every model file
```

---

## ✅ Phase 5 — Schema & Migrations
> Goal: All database tables are created and exactly match the database design document.

- [x] Create `src/db/migrations/` folder
- [x] `001_create_users.sql`
- [x] `002_create_exercises.sql`
- [x] `003_create_exercise_difficulties.sql`
- [x] `004_create_workout_sessions.sql`
- [x] `005_create_achievements.sql`
- [x] `006_create_user_achievements.sql`
- [x] `src/db/migrate.ts` — script that runs all `.sql` files in order
- [x] Add `"migrate": "ts-node src/db/migrate.ts"` to `package.json`
- [x] Run `npm run migrate` — verify tables exist in the database

```
Migration order matters — foreign keys require parent tables first:

  001  users
  002  exercises
  003  exercise_difficulties    (FK → exercises)
  004  workout_sessions         (FK → users, exercise_difficulties)
  005  achievements
  006  user_achievements        (FK → users, achievements)
```

---

## ✅ Phase 6 — Seed Data
> Goal: The database has real data so you can test features without manually inserting rows every time.

- [x] `src/db/seed.ts` — inserts exercises and difficulties
- [x] Squats with Easy / Medium / Hard difficulties seeded
- [x] Add `"seed": "ts-node src/db/seed.ts"` to `package.json`
- [x] Run `npm run seed` — verified data exists

---

## 🔐 Phase 7 — Authentication  🎯 Monday 9 June target
> Goal: Users can register, log in (email/password + Google), and access protected routes.

Every endpoint in this phase follows the **Route → Controller → Service → Model** pattern.

### 7a — Email + Password  ✅ Done — merged to main 2026-06-13

- [x] `src/models/user.model.ts` — `createUser()`, `findByEmail()`, `findById()`
- [x] `src/services/auth.service.ts` — `register()`, `login()`, `generateJWT()`
- [x] `src/controllers/auth.controller.ts` — `handleRegister()`, `handleLogin()`
- [x] `src/routes/auth.routes.ts` — `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- [x] `src/middleware/auth.middleware.ts` — `requireAuth()` verifies JWT, attaches `req.user`
- [x] `src/types/express.d.ts` — TypeScript augmentation for `req.user`
- [x] Mount auth routes in `src/index.ts` at `/api/v1/auth`
- [x] Test register: `POST /api/v1/auth/register` → `201 { token, user }`
- [x] Test login: `POST /api/v1/auth/login` → `200 { token, user }`
- [x] Test duplicate email → `409`, duplicate username → `409`
- [x] Test wrong password → `401`, unknown email → `401`

```
POST /api/v1/auth/register
  → auth.controller
  → auth.service  (hash password, create user, generate JWT)
  → user.model    (INSERT INTO users)
  → PostgreSQL
  ← { token, user }

requireAuth middleware (on every protected route):
  Authorization: Bearer <token>
  → verify JWT signature
  → attach req.user.userId
  → next()
```

### 7b — Google OAuth

- [ ] `src/services/google.service.ts` — `verifyGoogleToken()` using `google-auth-library`
- [ ] Add `handleGoogleAuth()` to `auth.controller.ts`
- [ ] Add `POST /api/v1/auth/google` to `auth.routes.ts`
- [ ] Test: send a real Google ID token → receive MoveVerse JWT

### 🤖 CI Checkpoint — Upgrade to Level 3 after this phase

Add to `ci.yml` (only on push to `dev` or `main`):
```
  5. npm test   (runs auth endpoint tests)
```

---

## 🏋️ Phase 8 — Exercises Endpoint
> Goal: One protected endpoint returns all active exercises with nested difficulties. Called once on login, cached in React context.

**Design decisions:**
- No separate `GET /exercises/:id/difficulties` endpoint — difficulties are nested inside the exercises response
- `score` is never sent by the frontend — backend calculates it from `reps_completed × score_multiplier`
- Frontend displays live score locally during gameplay; backend only involved at session end

- [ ] `src/models/exercise.model.ts` — `getAllExercises()` (JOIN with exercise_difficulties, group into nested structure)
- [ ] `src/services/exercise.service.ts` — `getExercises()`
- [ ] `src/controllers/exercise.controller.ts` — `handleGetExercises()`
- [ ] `src/routes/exercise.routes.ts` — `GET /api/v1/exercises` (protected)
- [ ] Mount in `src/index.ts`
- [ ] Test: valid JWT → exercises with nested difficulties array including target_reps and score_multiplier

```
GET /api/v1/exercises
  → requireAuth
  → exercise.controller
  → exercise.service
  → exercise.model
      SELECT e.id, e.name, e.description, e.calories_per_rep,
             ed.id, ed.level_name, ed.target_reps, ed.score_multiplier
      FROM exercises e
      JOIN exercise_difficulties ed ON ed.exercise_id = e.id
      WHERE e.is_active = true
      ORDER BY e.name, ed.level_name
  ← [ { id, name, calories_per_rep, difficulties: [...] } ]
```

---

## 💪 Phase 9 — Workout Sessions
> Goal: Users save a completed workout. Score and calories are calculated server-side.

- [ ] `src/models/workout.model.ts` — `createSession()`, `getSessionsByUser()`
- [ ] `src/services/workout.service.ts`
  - [ ] `saveSession()` — validates `exercise_difficulty_id`, calculates score + calories, saves
  - [ ] `checkAchievements()` — checks if new achievements unlocked after saving
- [ ] `src/controllers/workout.controller.ts` — `handleSaveSession()`, `handleGetMyHistory()`
- [ ] `src/routes/workout.routes.ts` — `POST /api/v1/workout_sessions`, `GET /api/v1/workout_sessions/me`
- [ ] Mount in `src/index.ts`
- [ ] Test: POST workout → check score, calories, `new_achievements` in response

```
POST /api/v1/workout_sessions
  → requireAuth (reads req.user.userId — NOT from body)
  → workout.controller
  → workout.service
      ├── look up exercise_difficulty → get score_multiplier + calories_per_rep
      ├── score    = reps_completed × score_multiplier × base_score
      ├── calories = reps_completed × calories_per_rep
      ├── INSERT INTO workout_sessions
      └── checkAchievements() → new_achievements array
  ← { id, score, calories_burned, completed_at, new_achievements }
```

---

## 🏆 Phase 10 — Achievement System
> Goal: Achievements unlock automatically after saving a workout. Users can fetch their earned badges.

- [ ] `src/models/achievement.model.ts` — `getAll()`, `getUserAchievements()`, `unlock()`
- [ ] `src/services/achievement.service.ts` — `evaluateAchievements()` compares stats to thresholds
- [ ] `src/controllers/achievement.controller.ts` — `handleGetMyAchievements()`
- [ ] `src/routes/achievement.routes.ts` — `GET /api/v1/users/me/achievements` (protected)
- [ ] Mount in `src/index.ts`
- [ ] Test: first workout → `new_achievements` includes "First Workout" → GET achievements → appears in list

```
Achievement evaluation (inside workout.service, after saving):
  1. Get user's total session count, total reps
  2. For each achievement: check requirement_type + requirement_value
  3. If threshold crossed and not already in user_achievements → INSERT
  4. Return newly inserted achievements
```

---

## 👤 Phase 11 — User Profile
> Goal: Users can view and update their own profile, workout history, and stats.

- [ ] `src/models/user.model.ts` — add `updateUsername()`, `getStatsByUser()`
- [ ] `src/services/user.service.ts` — `getProfile()`, `updateProfile()`, `getStats()`
- [ ] `src/controllers/user.controller.ts` — one handler per endpoint
- [ ] `src/routes/user.routes.ts`
  - [ ] `GET  /api/v1/users/me` (protected)
  - [ ] `PUT  /api/v1/users/me` (protected)
  - [ ] `GET  /api/v1/users/me/stats` (protected)
  - [ ] `GET  /api/v1/users/:id` (public)
- [ ] Mount in `src/index.ts`
- [ ] Test: update username → GET /users/me reflects the change

---

## 📊 Phase 12 — Leaderboard & Public Profiles
> Goal: Anyone can view the leaderboard, optionally filtered by exercise.

- [ ] `src/models/leaderboard.model.ts` — `getTopScores(exerciseName?)`
- [ ] `src/services/leaderboard.service.ts` — `getLeaderboard(exerciseName?)`
- [ ] `src/controllers/leaderboard.controller.ts` — `handleGetLeaderboard()`
- [ ] `src/routes/leaderboard.routes.ts` — `GET /api/v1/leaderboard` (public)
- [ ] Mount in `src/index.ts`
- [ ] Test: multiple users post workouts → leaderboard shows them ranked by score
- [ ] Test: `?exercise=squats` → only squats results returned

```
GET /api/v1/leaderboard?exercise=squats
  → leaderboard.controller
  → leaderboard.service
  → leaderboard.model
      SELECT username, exercise name, difficulty, score, reps, completed_at
      FROM workout_sessions
      JOIN users, exercise_difficulties, exercises
      WHERE exercises.name ILIKE $1   (if filter provided)
      ORDER BY score DESC  LIMIT 50
  ← [ { rank, username, exercise_name, score, ... } ]
```

### 🤖 CI Checkpoint — Upgrade to Level 4 after this phase

Update `ci.yml` for PRs to `main`:
```
  5. npm test   (full test suite — all endpoints)
```

---

## 🛡️ Phase 13 — Validation & Global Error Handling
> Goal: Every bad request gets a clean, consistent error. Every crash is caught.

> Note: basic validation is added in each phase as endpoints are built.
> This phase is a final pass to make sure nothing was missed and global handlers are wired up.

- [ ] Install `zod` or `express-validator` for request body validation
- [ ] `src/middleware/validate.middleware.ts` — reusable validation middleware
- [ ] `src/middleware/error.middleware.ts` — global error handler → returns `500`
- [ ] `src/middleware/notFound.middleware.ts` — catches unknown routes → returns `404`
- [ ] Mount both at the bottom of `src/index.ts` (must be after all routes)
- [ ] Test: send bad data to every endpoint → confirm `{ "error": "..." }` shape

```
Middleware order in src/index.ts:

  helmet()
  cors()
  express.json()
  ↓
  /api/v1/auth routes
  /api/v1/exercises routes
  /api/v1/workout_sessions routes
  /api/v1/users routes
  /api/v1/leaderboard routes
  ↓
  404 handler     ← must be after all routes
  error handler   ← must be last
```

---

## 🔁 The Pattern You Will Repeat (Phases 7–12)

Every feature is built as four files in the same structure:

```
Request
  ↓
routes/*.routes.ts         maps URL to controller function
  ↓
controllers/*.controller.ts  reads req, calls service, sends res
  ↓
services/*.service.ts        business logic and decisions
  ↓
models/*.model.ts            SQL queries only
  ↓
PostgreSQL
```

| File | Its only job | Must NOT do |
|---|---|---|
| routes | Map URL + method to a controller | Any logic |
| controller | Handle HTTP (req/res) | SQL, business rules |
| service | Business logic and calculations | SQL, HTTP |
| model | Database queries | Logic, HTTP |

Once you build it for auth, every other phase repeats this exact structure.
You will get faster with each phase.
