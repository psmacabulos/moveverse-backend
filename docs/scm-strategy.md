# MoveVerse SCM Strategy

## 📖 Purpose

This document defines the Software Configuration Management (SCM) strategy for the MoveVerse project.

The SCM process establishes:

- Git workflow standards
- Team collaboration procedures
- Repository organization strategies
- Branch management workflows
- Pull request workflows
- Code review processes
- Version control conventions
- Continuous Integration workflows

---

# 🗂️ Repository Structure Strategy

MoveVerse follows a multi-repository project structure to separate concerns between frontend development, backend services, and technical documentation.

## Repository Structure

```text
moveverse-docs
moveverse-frontend
moveverse-backend
```

---

## Repository Purposes

| Repository | Purpose |
|---|---|
| `moveverse-docs` | Centralized technical documentation and project planning |
| `moveverse-frontend` | React frontend application |
| `moveverse-backend` | Express backend API and PostgreSQL integration |

---

## Central Documentation Repository

The `moveverse-docs` repository serves as the primary project entry point.

This repository contains:

- Technical documentation
- Architecture diagrams
- Database design
- SCM and QA strategies
- Setup instructions
- Links to frontend and backend repositories

This structure allows employers, collaborators, and reviewers to understand the complete project architecture from a centralized location.

---

# 🛠️ Version Control Platform

| Tool | Purpose |
|---|---|
| Git | Distributed version control |
| GitHub | Repository hosting and collaboration |
| Docker | Local environment consistency |
| GitHub Actions | Automated CI validation |

---

# 🌿 Repository Branching Strategy

MoveVerse follows a simplified Git Flow workflow.

## Main Branches

| Branch | Purpose |
|---|---|
| `main` | Stable production-ready code |
| `dev` | Development integration branch |

---

## `main` Branch

The `main` branch contains:

- Stable releases
- Fully reviewed code
- Production-ready implementations

Direct commits to `main` are prohibited.

---

## `dev` Branch

The `dev` branch is used for:

- Team development
- Feature integration
- Local testing
- Pre-production validation

All feature branches are merged into `dev` before deployment.

---

# 🌱 Conventional Branching Strategy

Each feature, fix, or documentation task uses its own dedicated branch.

## Branch Naming Format

```bash
<type>/<short-description>
```

---

## Branch Types

| Type | Purpose |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code restructuring |
| `test/` | Testing-related work |
| `style/` | UI or formatting changes |
| `chore/` | Maintenance tasks |
| `hotfix/` | Urgent production fixes |

---

## Branch Naming Examples

### Frontend

```bash
feat/login-page
feat/dashboard-ui
fix/navbar-mobile-layout
refactor/auth-context
```

### Backend

```bash
feat/jwt-authentication
feat/workout-session-api
fix/token-validation
```

### Documentation

```bash
docs/system-architecture
docs/database-design
docs/scm-strategy
```

---

# 🔄 Development Workflow

```text
1. Pull latest changes from dev
2. Create feature branch from dev
3. Implement feature
4. Commit changes
5. Push branch to GitHub
6. Create Pull Request
7. Conduct code review
8. Merge into dev
9. Run integration validation
10. Merge dev into main
```

---

# 📝 Conventional Commits Strategy

MoveVerse follows Conventional Commits for readable and maintainable Git history.

## Commit Format

```bash
<type>: <short-description>
```

---

## Commit Types

| Commit | Purpose |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation updates |
| `refactor:` | Code restructuring |
| `style:` | Styling/formatting |
| `test:` | Testing changes |
| `chore:` | Maintenance/configuration |

---

## Commit Examples

### Feature Commits

```bash
feat: implement JWT authentication
feat: add leaderboard API endpoint
```

### Fix Commits

```bash
fix: resolve login validation issue
fix: correct calorie calculation logic
```

### Documentation Commits

```bash
docs: add database design documentation
docs: update system architecture diagram
```

### Maintenance Commits

```bash
chore: configure docker environment
chore: update eslint rules
```

---

# 👥 Pull Request and Code Review Strategy

## Pull Request Rules

Before merging:

- Code must be tested
- Branch naming must follow standards
- Commits must follow conventions
- Pull requests should remain focused on one task

---

## Code Review Process

At least one teammate reviews every pull request before merging.

Review focus areas:

- Readability
- Folder structure
- API correctness
- Security
- Error handling
- UI consistency
- Database queries

---

## Merge Strategy

MoveVerse uses:

```text
Squash and Merge
```

Benefits:

- Cleaner commit history
- Easier rollback management
- Reduced unnecessary commits

---

# 🐳 Docker Development Strategy

MoveVerse uses Docker for local development consistency.

Benefits:

- Standardized development environments
- Easier onboarding
- Dependency isolation
- Simplified PostgreSQL setup

Docker is used during:

- Backend execution
- Database services
- Local integration testing

---

# ⚙️ Continuous Integration (CI) Strategy

MoveVerse uses GitHub Actions for automated validation during development.

GitHub Actions automatically validates:

- Pull requests
- Pushes to dev
- Pushes to main

---

## CI Workflow Purpose

The CI workflow ensures unstable or broken code is detected before merging into shared branches.

Automated validation includes:

- Dependency installation
- Frontend build validation
- Backend validation
- Unit testing
- Linting

---

## Initial CI Workflow

### Frontend Validation

```text
- npm install
- npm run build
```

### Backend Validation

```text
- npm install
```

---

## Expanded CI Workflow

As the project grows, the CI pipeline additionally executes:

```text
- npm run lint
- npm test
- integration tests
- Docker validation
```

---

# 🔒 Repository Protection Strategy

The following branches are protected:

- `main`
- `dev`

GitHub branch protection rules include:

- Prevent direct pushes
- Require pull requests
- Require review approval
- Require successful CI checks

---

# 📦 Semantic Versioning Strategy

MoveVerse follows semantic versioning.

## Version Format

```text
MAJOR.MINOR.PATCH
```

### Example

```text
v1.2.3
```

| Version Type | Meaning |
|---|---|
| MAJOR | Breaking changes |
| MINOR | New features |
| PATCH | Bug fixes |

---

# ✅ Conclusion

The MoveVerse SCM strategy establishes a structured workflow for collaborative development, repository management, testing, validation, and release management.

By implementing:

- Multi-repository architecture
- Conventional branching
- Conventional commits
- Pull request reviews
- GitHub Actions CI validation
- Docker-based local environments
- Protected branch workflows

The MoveVerse team improves:

- Development consistency
- Collaboration
- Code maintainability
- Software reliability
- Long-term scalability
