# MoveVerse Backend Classes Documentation

## 📖 Overview

This document defines the backend classes, services, and architectural responsibilities of the MoveVerse backend system.

MoveVerse uses:

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Google OAuth
- REST API Architecture

---

# 🧩 Backend Components and Classes

## 1. User Class

### Purpose
Represents registered users within MoveVerse.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| id | UUID | Unique user identifier |
| username | String | User display name |
| email | String | User email address |
| passwordHash | String (nullable) | Hashed password for email/password authentication |
| googleId | String (nullable) | Google OAuth identifier |
| role | ENUM | User role (`user`, `admin`) |
| createdAt | Timestamp | Account creation date |
| updatedAt | Timestamp | Last profile update |

### Methods

| Method | Description |
|---|---|
| register() | Creates a new user account |
| login() | Authenticates user credentials |
| generateJWT() | Generates JWT token |
| updateProfile() | Updates user profile |
| getDashboardStats() | Retrieves dashboard analytics |
| validatePassword() | Verifies hashed password |

---

## 2. WorkoutSession Class

### Purpose
Stores completed MoveVerse workout sessions and gameplay results.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| id | UUID | Unique workout session identifier |
| userId | UUID | Foreign key reference to user |
| exerciseDifficultyId | UUID | Foreign key reference to difficulty preset |
| repsCompleted | Integer | Number of completed repetitions |
| score | Integer | Final workout score |
| durationSeconds | Integer | Workout duration |
| caloriesBurned | Decimal | Estimated calories burned |
| completedAt | Timestamp | Workout completion timestamp |

### Methods

| Method | Description |
|---|---|
| saveSession() | Stores workout session |
| calculateScore() | Computes final score |
| calculateCalories() | Estimates calories burned |
| validateSession() | Validates session data |
| getSessionHistory() | Retrieves workout history |

---

## 3. Exercise Class

### Purpose
Defines supported exercises within MoveVerse.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| id | UUID | Unique exercise identifier |
| name | String | Exercise name |
| description | Text | Exercise description |
| caloriesPerRep | Decimal | Calories burned per repetition |
| isActive | Boolean | Determines if exercise is active |
| createdAt | Timestamp | Exercise creation timestamp |

### Methods

| Method | Description |
|---|---|
| createExercise() | Adds new exercise |
| updateExercise() | Updates exercise |
| deactivateExercise() | Disables exercise |
| getExercises() | Retrieves exercises |

---

## 4. ExerciseDifficulty Class

### Purpose
Defines exercise-specific difficulty presets.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| id | UUID | Unique difficulty preset identifier |
| exerciseId | UUID | Foreign key reference to exercise |
| levelName | ENUM | Difficulty level |
| targetReps | Integer | Required repetitions |
| scoreMultiplier | Decimal | Score multiplier |

### Methods

| Method | Description |
|---|---|
| createDifficultyPreset() | Creates difficulty preset |
| getExerciseDifficulties() | Retrieves exercise difficulties |
| validateDifficulty() | Validates selected difficulty |
| calculateMultiplier() | Applies score multiplier |

### Design Decision

MoveVerse uses exercise-specific difficulty presets instead of global difficulty settings.

Example:

- Squat Easy = 5 reps
- Push-up Easy = 3 reps

This improves scalability and exercise balancing.

---

## 5. Leaderboard Class

### Purpose
Handles MoveVerse leaderboard functionality.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| leaderboardType | String | Leaderboard category |
| rankingLimit | Integer | Maximum ranking count |

### Methods

| Method | Description |
|---|---|
| getTopPlayers() | Retrieves top-ranked users |
| getUserRanking() | Retrieves user rank |
| getExerciseLeaderboard() | Retrieves exercise leaderboard |
| calculateRankings() | Calculates rankings dynamically |

### Design Decision

Leaderboards are dynamically computed using SQL aggregation instead of storing redundant ranking data.

---

## 6. Achievement Class

### Purpose
Represents MoveVerse achievement badges and rewards.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| id | UUID | Unique achievement identifier |
| name | String | Achievement name |
| description | Text | Achievement description |
| badgeImage | String | Badge image path |
| requirementType | String | Requirement category |
| requirementValue | Integer | Required threshold |

### Methods

| Method | Description |
|---|---|
| createAchievement() | Creates achievement |
| unlockAchievement() | Unlocks achievement |
| getUserAchievements() | Retrieves user achievements |
| validateAchievementProgress() | Validates achievement completion |

---

## 7. UserAchievement Class

### Purpose
Represents the relationship between users and achievements.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| userId | UUID | Foreign key reference to user |
| achievementId | UUID | Foreign key reference to achievement |
| unlockedAt | Timestamp | Unlock timestamp |

### Methods

| Method | Description |
|---|---|
| assignAchievement() | Assigns achievement |
| getUnlockedAchievements() | Retrieves unlocked achievements |

---

## 8. AdminService Class

### Purpose
Handles administrator-only functionality.

### Attributes

| Attribute | Type | Description |
|---|---|---|
| adminId | UUID | Administrator identifier |
| permissions | Array | Admin permissions |

### Methods

| Method | Description |
|---|---|
| deactivateUser() | Disables user account |
| promoteUserToAdmin() | Grants admin privileges |
| createExercise() | Adds exercise entries |
| manageAchievements() | Manages achievements |
| viewAnalytics() | Retrieves platform analytics |

### Design Decision

MoveVerse does not use a separate admin table. Administrator access is managed through the `role` field in the users table.
