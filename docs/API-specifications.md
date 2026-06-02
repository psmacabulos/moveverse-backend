# API Specifications: External APIs and internal API endpoints.

## External APIs

### MediaPipe
Used for real-time pose detection and movement tracking.

**Purpose**
- Detect body landmarks
- Track player movement
- Validate exercise/game actions

### Webcam API (`getUserMedia`)
Used to access the player's camera feed.

**Purpose**
- Capture live video
- Stream frames into MediaPipe for processing

---

## Internal APIs

### Game Engine
Responsible for:
- Processing pose landmarks
- Validating player actions
- Managing game state
- Triggering game events

### Scoreboard Service
Responsible for:
- Recording scores
- Calculating rankings
- Managing leaderboards

### Mini-Game Scene Manager
Responsible for:
- Loading game modes
- Managing gameplay sessions
- Handling transitions between scenes

---

## Authentication

### Current Approach
- JWT (JSON Web Tokens)

### Future Consideration
- OAuth 2.0
  - Google Sign-In
  - Apple Sign-In
  - Other social providers

---

# Database Options

| Database Category | Best Choices | Best Used For | Pros | Cons |
|------------------|--------------|---------------|------|------|
| Relational (SQL) | PostgreSQL, MySQL | Player accounts, leaderboards, purchases | High data integrity, reliable, supports complex queries | Less flexible when schemas change frequently |
| Document (NoSQL) | MongoDB, Couchbase | Inventories, save states, quest logs | Flexible schemas, rapid development, scalable | Less strict validation |
| In-Memory / Real-Time | Redis | Caching, matchmaking, real-time leaderboards, chat | Extremely fast | Usually requires a persistent backing database |
| Embedded (Local) | SQLite, ObjectBox | Single-player saves, offline mobile games | Lightweight and portable | Limited concurrent writes |
| Cloud BaaS | Firebase, PlayFab | Multiplayer, analytics, matchmaking | Easy integration, managed scaling | Potential vendor lock-in and increased costs |

### Recommended Database (Current)
- MySQL

---

# Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | React |
| Backend | Node.js |
| Database | MySQL (TBD) |
| Authentication | JWT |
| Pose Detection | MediaPipe |
| Camera Access | getUserMedia |

---

# System Architecture

> TBD

---

# API Flow

## External API Flow

```text
Webcam
   ↓
Raw Video Stream
   ↓
MediaPipe
   ↓
Pose Landmarks
   ↓
Game Engine
```

## Internal API Flow

```text
React Frontend
      ↓
REST API
      ↓
Node.js Backend
      ↓
MySQL Database
```

---

# Authentication API

## Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/auth/register` | Create a new user account |
| POST | `/auth/login` | Authenticate user and receive JWT |
| POST | `/auth/logout` | Log out the user |

---

## POST `/auth/register`

### Request Body

| Field | Type | Required | Description |
|---------|---------|---------|-------------|
| username | string | Yes | Unique username |
| email | string | Yes | Valid email address |
| password | string | Yes | Minimum 8 characters |

### Example

```json
{
  "username": "player1",
  "email": "player@example.com",
  "password": "password123"
}
```

---

## POST `/auth/login`

### Request Body

| Field | Type | Required | Description |
|---------|---------|---------|-------------|
| email | string | Yes | Registered email address |
| password | string | Yes | Registered password |

### Example

```json
{
  "email": "player@example.com",
  "password": "password123"
}
```

---

# Users & Profiles

## Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/users/:id` | Fetch public profile for a user |
| GET | `/users/me` | Fetch authenticated user's profile |
| PUT | `/users/me` | Update profile information |
| GET | `/users/me/stats` | Fetch personal statistics |

---

## GET `/users/me`

### Response

| Field | Type | Description |
|---------|---------|-------------|
| username | string | Display name |
| avatar | string | Profile image URL |
| theme | string | UI theme preference (light/dark) |

### Example

```json
{
  "username": "player1",
  "avatar": "https://example.com/avatar.png",
  "theme": "dark"
}
```

---

# Scores API

## Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/scores` | Save a completed game |
| GET | `/scores/me` | Retrieve score history |

---

## POST `/scores`

### Request Body

| Field | Type | Description |
|---------|---------|-------------|
| mode | string | BranchHopper, LilyHopper, Pushups, Squats |
| reps | integer | Total valid repetitions completed |
| duration | integer | Round duration (seconds) |
| difficulty | string | Easy, Medium, Hard |

### Example

```json
{
  "mode": "Squats",
  "reps": 42,
  "duration": 60,
  "difficulty": "Medium"
}
```

---

# Leaderboard API

## Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/leaderboard` | Top 50 scores across all users and modes |
| GET | `/leaderboard/:mode` | Top 50 scores for a specific mode |
| GET | `/leaderboard/me/rank` | Authenticated user's global ranking |

---

## Example Leaderboard Response

```json
[
  {
    "rank": 1,
    "username": "player1",
    "score": 1250,
    "mode": "Squats"
  },
  {
    "rank": 2,
    "username": "player2",
    "score": 1180,
    "mode": "Pushups"
  }
]
```

---

# Future Enhancements

- OAuth Authentication (Google, Apple)
- Friend System
- Achievements & Badges
- Multiplayer Challenges
- Real-Time Leaderboards (Redis)
- Analytics Dashboard
- Session Replay Storage
- Cloud Save Support