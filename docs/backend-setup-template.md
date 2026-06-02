# Node.js + TypeScript + Express Backend — Setup Template

A step-by-step reference for setting up a new backend project from scratch.

---

## 1. Initialise the project

```bash
npm init -y
```

---

## 2. Install TypeScript and dev tooling

```bash
npm install --save-dev typescript ts-node-dev @types/node
```

```bash
npx tsc --init
```

---

## 3. Install production dependencies

```bash
npm install express pg dotenv jsonwebtoken bcryptjs cors helmet
```

---

## 4. Install TypeScript type definitions

```bash
npm install --save-dev @types/express @types/pg @types/jsonwebtoken @types/bcryptjs @types/cors
```

---

## 5. Install Prettier and ESLint

```bash
npm install --save-dev prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

---

## 6. Create the folder structure

```bash
mkdir -p src/config src/controllers src/middleware src/models src/routes src/services src/types
```

---

## 7. Config files to create

### `tsconfig.json` (replace the generated one)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### `eslint.config.mjs`

```js
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  prettierConfig,
];
```

### `.vscode/settings.json`

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

### `.gitignore`

```
# Dependencies
node_modules/

# Compiled output
dist/

# Environment variables - NEVER commit these
.env

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db
```

### `.env.example`

```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

### `.env` (copy from `.env.example`, never commit)

```
# Server
PORT=5000
NODE_ENV=development

# Database — use 'postgres' as DB_HOST when running via Docker
DB_HOST=postgres
DB_PORT=5432
DB_NAME=moveverse_db
DB_USER=moveverse_user
DB_PASSWORD=moveverse_password

# JWT
JWT_SECRET=dev_secret_change_this_in_production
JWT_EXPIRES_IN=7d
```

---

## 8. Update `package.json` scripts and main field

```json
"main": "dist/index.js",
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "lint": "eslint src/**/*.ts",
  "format": "prettier --write src/**/*.ts",
  "test": "echo \"No tests yet\" && exit 1"
}
```

---

## 9. Create `src/index.ts` (entry point)

```ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 10. Final folder structure

```
project-root/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── index.ts
├── docs/
├── .env                  ← never commit
├── .env.example          ← commit this
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── .vscode/
│   └── settings.json
├── eslint.config.mjs
├── package.json
├── package-lock.json     ← always commit
└── tsconfig.json
```

---

## VS Code extensions to install

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

---

## Notes

- `DB_HOST=postgres` in `.env` when running via Docker Compose (service name, not localhost)
- Always commit `package-lock.json` — it locks exact dependency versions
- Never commit `.env` — only commit `.env.example`
- Run `docker-compose up` to start the app, not `npm run dev` directly
