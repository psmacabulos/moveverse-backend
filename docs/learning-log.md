# MoveVerse Backend — Learning Log

A record of important concepts covered during the build. Use this as a study reference.

---

## Lesson 1 — Why Docker exists (the "works on my machine" problem)

**The problem:** Different computers have different Node.js versions, different operating systems, and different OS-specific package builds. Code that works on Windows may behave differently on Mac or Linux.

**What Docker does:** Creates a container — a lightweight, isolated Linux environment — that has a specific Node version and all dependencies installed inside it. The container runs identically on any machine.

**The hybrid development model:**
- `npm install` locally → gives your code editor (VS Code) autocomplete and type checking
- `docker-compose up` → runs your actual app inside the container
- `node_modules` is never committed to GitHub — only `package.json` travels with the code
- On a new machine: clone the repo → `docker-compose up` → everything works

**Key insight:** `package.json` is the shopping list. `node_modules` is the groceries. You share the list, not the groceries.

---

## Lesson 2 — How JWT Authentication works

**What a JWT is:** A signed token (like an ID card) that the server issues after login. It contains a payload — a small JSON object baked into the token.

**Example payload:**
```json
{
  "userId": "abc-123-uuid",
  "role": "user",
  "exp": 1720000000
}
```

**The flow:**
1. User logs in → backend verifies credentials → generates JWT → sends it to the frontend
2. Frontend stores the token and sends it in the `Authorization` header on every protected request:
   `Authorization: Bearer <token>`
3. Backend middleware decodes the token, verifies the signature, attaches the user to `req.user`
4. Route handler reads `req.user.userId` — no need for the frontend to send a user ID in the body

**Why tampered tokens are rejected:** The token is cryptographically signed using a secret key only the server knows. If anyone changes the payload, the signature no longer matches and the backend rejects it.

**Why user_id is not in the request body:** It comes from the verified JWT token. The middleware attaches it to `req.user` before the route handler runs.

---

## Lesson 3 — TypeScript compilation and tsconfig.json

**What TypeScript is:** A transpiler — it takes `.ts` source files and compiles them into `.js` files that Node.js can run. TypeScript itself does not run in production.

**Key tsconfig.json settings for a Node.js backend:**

| Setting | Value | Why |
|---|---|---|
| `target` | `ES2020` | The JavaScript version the compiled output uses. Node 14+ supports ES2020. |
| `module` | `commonjs` | How modules are handled. You still write `import` — it compiles to `require()`. |
| `outDir` | `./dist` | Where compiled `.js` files go. This is what Node actually runs. |
| `rootDir` | `./src` | Where your TypeScript source lives. |
| `strict` | `true` | Full type safety — catches bugs before runtime. |
| `esModuleInterop` | `true` | Lets you write `import express from 'express'` cleanly. |
| `skipLibCheck` | `true` | Skips type-checking inside `node_modules` — speeds up compilation. |
| `resolveJsonModule` | `true` | Lets you import `.json` files directly. |
| `sourceMap` | `true` | Maps compiled JS lines back to your TypeScript — makes error messages readable. |

**Important:** `module: commonjs` does NOT mean you write `require()`. You always write `import` in TypeScript. The compiler converts it for you.

**Where to find tsconfig settings without memorising them:**
- `npx tsc --init` generates a commented starting point
- Search "tsconfig.json Node.js Express TypeScript" for community boilerplates
- TypeScript official docs: https://aka.ms/tsconfig

**Why separate `build` and `dev` scripts:**
- `dev` uses `ts-node-dev` — compiles TypeScript on the fly. Fast restarts, good for development
- `build` + `start` uses `tsc` then `node dist/index.js` — pre-compiled JavaScript. Fast startup, lean container, no TypeScript tooling needed in production

---

## Lesson 4 — Layered Architecture (Controller-Service-Repository Pattern)

**What it is:** An industry-standard pattern for REST APIs where each layer has exactly one responsibility.

**The layers and data flow:**
```
HTTP Request
     ↓
  Routes       → maps URLs to the right controller function
     ↓
  Controllers  → reads req, calls a service, sends res
     ↓
  Services     → business logic (calculations, rules, decisions)
     ↓
  Models       → database queries only
     ↓
  PostgreSQL
```

**Each layer's rule:**

| Layer | Its ONE job | Must NOT do |
|---|---|---|
| Controller | Handle HTTP (req/res) | SQL queries, business logic |
| Service | Business rules and decisions | SQL queries, HTTP concerns |
| Model | Database queries | Business logic, HTTP concerns |

**Why this matters (Separation of Concerns):**
- Swap the database? Only change the models layer
- Change a business rule? Only change the services layer
- Test score calculation? Test the service directly — no HTTP or database needed

**Interview answer:**
> "We followed a layered Controller-Service-Repository pattern. Each layer has a single responsibility — controllers handle HTTP, services contain business logic, and models handle data access. This gives us separation of concerns, making the code testable and easy to maintain."

---

## Lesson 5 — Password Hashing with bcryptjs

**Why you never store plain text passwords:**
If your database is breached, attackers get every user's password instantly — and since people reuse passwords, that compromises their accounts everywhere.

**How bcrypt works:**
- bcrypt is a **one-way hashing function** — you cannot reverse it back to the original password
- On register: `bcrypt.hash('password123')` → stores `$2b$10$xyz...` in the database
- On login: bcrypt re-hashes what the user typed and **compares the two hashes**
- Even database admins cannot read user passwords

**Key point:** bcrypt is not encryption (reversible). It is hashing (irreversible).

---

## Lesson 6 — ORM vs Raw SQL

**ORM (Object-Relational Mapper):** A library that lets you write JavaScript/TypeScript objects instead of SQL.

```ts
// ORM approach (Prisma)
prisma.user.findUnique({ where: { email: 'test@example.com' } })

// Raw SQL approach (pg)
pool.query('SELECT * FROM users WHERE email = $1', ['test@example.com'])
```

**This project uses raw SQL with `pg`.** Why:
- You see exactly what hits the database — no hidden magic
- Forces you to properly learn SQL (joins, aggregations, indexes)
- Better debugging — you know what query ran
- ORMs can silently generate inefficient SQL

**When to use an ORM:** After you understand SQL well. Learn raw SQL first.

---

## Lesson 7 — npm Versioning and package-lock.json

**Not specifying a version on install is normal for new projects.** npm installs the latest stable version.

```json
"dependencies": {
  "express": "^4.21.2"
}
```
The `^` means "accept compatible minor/patch updates."

**`package-lock.json` is the real lock.** It records the exact version of every package. When anyone clones and runs `npm install`, they get identical versions — not "latest."

| File | Purpose |
|---|---|
| `package.json` | The shopping list (approximate versions) |
| `package-lock.json` | The exact receipt (precise versions of everything) |

**Always commit `package-lock.json` to GitHub.** It makes builds reproducible across machines and Docker.

---

## Lesson 8 — Prettier vs ESLint — Two Different Tools

**The problem:** Without enforced formatting, every developer writes code differently. Git sees whitespace changes as real changes, polluting pull requests with meaningless diffs.

**Prettier — Code Formatter**
- Handles HOW code looks: spacing, semicolons, quotes, line length, indentation
- Runs automatically on save via VS Code extension

**ESLint — Code Linter**
- Handles WHETHER code is correct: unused variables, bad patterns, TypeScript violations
- Catches bugs before runtime

**They work together:**
- `eslint-config-prettier` disables ESLint rules that conflict with Prettier. Prettier wins all formatting disputes.

**Industry standard in 2026:** Prettier + ESLint with `@typescript-eslint` rules.

**Two levels of enforcement:**
1. **VS Code** — `.vscode/settings.json` committed to repo. Every teammate gets format-on-save on clone
2. **CI/CD** — GitHub Actions runs `npm run lint` on every PR. Failing code cannot be merged

---

## Lesson 9 — ESLint Flat Config (ESLint 9+)

ESLint 9+ uses **flat config** — file named `eslint.config.mjs` (`.mjs` = explicit ES module).

```js
files: ['src/**/*.ts']             // Only lint TypeScript files in src/
languageOptions: { parser }        // Teach ESLint to read TypeScript syntax
plugins: { '@typescript-eslint' }  // Load TypeScript-specific rules
...tseslint.configs.recommended    // Spread in all recommended TS rules
prettierConfig                     // Disable ESLint rules that conflict with Prettier (must be last)
```

**Why `prettierConfig` must be last:** ESLint applies configs in order. Prettier's config must override any earlier formatting rules.

---

## Lesson 10 — VS Code Settings for Team Consistency

`.vscode/settings.json` is committed to the repository so every teammate gets the same editor behaviour when they clone the project.

```json
{
  "prettier.enable": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

| Setting | What it does |
|---|---|
| `prettier.enable` | Activates the Prettier extension |
| `formatOnSave` | Runs Prettier every time you press `Ctrl+S` |
| `defaultFormatter` | Tells VS Code to use Prettier, not the built-in formatter |
| `codeActionsOnSave` | Runs ESLint auto-fix on save |
| `[typescript]` block | Explicitly sets Prettier as the formatter for `.ts` files |

**Troubleshooting tip:** If Prettier says "cannot format TypeScript files", check the VS Code Output panel (View → Output → Prettier). Common fix: make sure `"prettier.enable": true` is in settings.
