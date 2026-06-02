# MoveVerse Web App — System Architecture

## 📌 High-Level System Architecture Diagram

<br>

![System Architecture Diagram](./images/system-architecture-diagram.png)

# 🧠 Architecture Overview

The application follows a modern **client-server architecture** where real-time motion detection and gameplay synchronization occur entirely in the browser to reduce latency and improve responsiveness.

<br>

## ⚛️ Frontend Responsibilities

The frontend is built using **React.js** and handles:

- 🎥 Webcam access
- 🧠 Browser-based motion detection using TensorFlow.js
- 🎮 Game rendering and local gameplay logic
- 🏆 Local score calculation
- 📊 Dashboard and leaderboard UI

Once gameplay events or scores are generated, the frontend communicates with the backend API through secure HTTP requests.

<br>

## 🟢 Backend Responsibilities

The backend uses **Express.js** to manage:

- 🔐 Authentication and authorization
- 👤 User profile management
- 🏆 Score storage and leaderboard services
- 📈 Dashboard data retrieval
- 🌐 Future multiplayer-ready API structure

<br>

## 🐘 Database Responsibilities

Persistent application data is stored in **PostgreSQL**.

Stored data includes:

- 👤 Users
- 🏆 Scores
- 🎖️ Achievements
- 📈 Leaderboard data
- 🕹️ Game sessions

<br>

### ⚡ Future Multiplayer Scalability

To support future scalability, the architecture is designed to later integrate **Socket.IO** for:

- Real-time multiplayer sessions
- Live score synchronization
- Player matchmaking
- Event broadcasting

The application structure is intentionally modular so multiplayer features can be integrated without major restructuring.

<br><br>

# 🔄 Data Flow Explanation

<br>

## 👤 1. User Interaction

- The user accesses the application through a web browser.
- Webcam input is processed directly in the frontend.

<br>

## 🧠 2. Motion Detection

Media Pipe analyzes movement locally in the browser.

Detected gestures trigger gameplay events.

### 🎯 Example Actions

- Squat detected → Player jump action
- Punch detected → Attack action

<br>

## 🎮 3. Game Processing

The game engine processes movement events and handles:

- Character actions
- Score calculation
- Visual effects
- Sound effects
- Gameplay statistics

<br>

## 🌐 4. Backend Communication

The frontend sends authenticated requests to the Express.js backend.

Backend services:
- validate requests
- process scores
- manage users
- return leaderboard/dashboard data

<br>

## 🐘 5. Database Storage

PostgreSQL stores persistent application data including:

- User accounts
- Scores
- Leaderboards
- Achievements
- Gameplay sessions

<br>

## 📊 6. Dashboard Retrieval

The frontend fetches:
- leaderboard data
- user statistics
- achievements
- gameplay history

from the backend API.

<br>

## ⚡ 7. Future Multiplayer Expansion

Socket.IO can later be integrated for:

- Real-time multiplayer gameplay
- Live leaderboard synchronization
- Multiplayer rooms and matchmaking
- Event broadcasting between players

<br><br>

# 🛠️ Technologies Used

<br>

| Layer | Technology |
|---|---|
| ⚛️ Frontend | React.js + TypeScript |
| 🎨 Styling | Tailwind CSS |
| 🧠 Motion Detection | Media Pipe |
| 🎮 Game Logic | Browser-Based Game Engine |
| 🟢 Backend | Express.js |
| 🔐 Authentication | JWT | Google Auth
| 🐘 Database | PostgreSQL |
| ⚡ Multiplayer (Future) | Socket.IO |
| 📦 Containerization | Docker |
| 🔄 Service Orchestration | Docker Compose |

<br><br>

# 📈 Scalability Considerations

The architecture is intentionally modular to support future multiplayer features and long-term scalability.

<br>

### ✅ Key Architectural Decisions

- Motion detection is processed client-side to reduce backend computational load.
- Frontend gameplay logic is separated from backend persistence services.
- Event-driven communication allows future multiplayer synchronization.
- Docker containerization ensures consistent development environments.
- Socket.IO can later be integrated without redesigning the existing application structure.
- Modular separation of concerns improves maintainability and scalability.