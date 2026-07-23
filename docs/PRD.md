# Product Requirements Document (PRD)

**Project Name:** CodeArena

**Version:** 1.0 (MVP)

**Status:** Planning

---

# 1. Project Overview

CodeArena is a real-time competitive coding platform where developers and students can create private coding rooms and compete in one-on-one programming challenges.

A user creates a private room, selects the programming topic, difficulty level, and match duration, then shares a unique room code with a friend. Once both players join, the host starts the match and both participants receive the same coding problem. Solutions are evaluated automatically, and the platform determines the winner based on predefined rules.

The primary goal of CodeArena is to make coding practice interactive, competitive, and enjoyable while remaining simple and focused.

---

# 2. Problem Statement

Most coding platforms focus on individual practice.

While platforms like LeetCode, GeeksforGeeks, and HackerRank provide excellent problem libraries, they offer limited support for private real-time coding competitions between friends.

Students often compare solutions over screen sharing or messaging apps, making the experience unstructured and difficult to manage.

CodeArena solves this problem by providing a dedicated environment for private coding battles with synchronized timers, automated evaluation, and instant results.

---

# 3. Target Users

### Primary Users

* College students preparing for placements
* Developers practicing Data Structures & Algorithms
* Friends who enjoy competitive coding
* Programming clubs and study groups

### Secondary Users

* Coding mentors
* Small coding communities
* Bootcamp students

---

# 4. Goals

The MVP aims to achieve the following:

* Allow users to authenticate securely.
* Allow users to create private coding rooms.
* Allow friends to join using a room code.
* Conduct synchronized real-time coding matches.
* Evaluate submissions automatically.
* Display match results instantly.
* Store previous matches for future reference.

---

# 5. Non Goals (Version 1)

The following features are intentionally excluded from the MVP:

* Public matchmaking
* Tournaments
* Leaderboards
* ELO or ranking system
* Achievements
* Streaks
* Friends system
* Chat
* AI-powered code review
* Team battles (2v2 or larger)
* Spectator mode
* Organization support

These may be considered in future releases.

---

# 6. Core Features

## Authentication

* Clerk Authentication
* Google Sign-In
* Protected routes

---

## Dashboard

* Create Match
* Join Match
* Match History
* User Profile

---

## Room Management

* Create private room
* Generate unique room code
* Join using room code
* Display connected players
* Host-controlled match start

---

## Match

* Topic selection
* Difficulty selection
* Time selection
* Random problem allocation
* Shared countdown timer
* Integrated code editor
* Multi-language support
* Code submission

---

## Result

* Winner
* Match duration
* Submission status
* Runtime
* Memory usage
* Submission timestamp

---

## Match History

* Previous matches
* Match outcome
* Problem information
* Submission summary

---

# 7. User Journey

```text
Landing Page
        │
        ▼
Sign In
        │
        ▼
Dashboard
   ┌───────────────┐
   │ Create Match  │
   │ Join Match    │
   │ History       │
   │ Profile       │
   └───────────────┘
        │
        ▼
Lobby
        │
        ▼
Start Match
        │
        ▼
Coding Screen
        │
        ▼
Submit Solution
        │
        ▼
Result
```

---

# 8. MVP Scope

The MVP includes:

* User authentication
* Private rooms
* Room code sharing
* One-on-one matches
* Real-time synchronization
* Judge0 integration
* Match timer
* Match results
* Match history

The MVP is intentionally limited to ensure a polished experience rather than a feature-heavy application.

---

# 9. Future Scope

Potential future enhancements include:

* Public matchmaking
* Ranking system
* Tournaments
* AI code review
* AI-generated coding challenges
* Live chat
* Team battles
* Spectator mode
* Company-specific interview rounds
* Daily coding challenges
* Custom problem sets
* Organizations and classrooms
* Notifications
* Code replay
* Performance analytics

---

# 10. Success Metrics

The MVP will be considered successful if users can:

* Sign in without issues.
* Create and join private rooms.
* Start synchronized coding matches.
* Submit solutions successfully.
* Receive accurate evaluation results.
* View match history.
* Complete the entire experience without manual intervention.

---

# 11. Assumptions

* Every match consists of exactly two players.
* Only the host can start the match.
* A room becomes locked once the match begins.
* Players cannot join after the match has started.
* Every player receives the same programming problem.
* Problems are selected randomly based on the chosen topic and difficulty.
* Judge0 is responsible only for code execution and evaluation.
* The application requires an internet connection throughout the match.

---

# 12. Out of Scope

The following are outside the scope of Version 1:

* Mobile application
* Offline mode
* Video or voice communication
* Screen sharing
* Custom coding contests
* Payment features
* Premium subscriptions
* Admin dashboard
* Community forums
* Problem authoring tools

---

# Product Vision

**CodeArena aims to become the simplest and most engaging platform for real-time private coding competitions, allowing developers and students to challenge friends, improve problem-solving skills, and practice programming in an interactive environment.**
