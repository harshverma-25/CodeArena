# 05-WIREFRAMES.md

## Purpose

This document defines the layout and information hierarchy of every major screen in CodeArena before implementation.

**Goals**

- Maintain consistency across the application.
- Focus on user experience before UI.
- Reuse layouts and components.
- Reduce redesign during development.

---

# Design Principles

- Editor First
- One Primary Action Per Screen
- Minimal Visual Noise
- Clear Information Hierarchy
- Consistent Navigation
- Responsive by Design

---

# Layout System

## Public Layout

Used for:

- Landing
- Login
- Register

```
+------------------------------------------------------------+
| Logo                                      Login / Signup   |
+------------------------------------------------------------+

                    Page Content

                    (Dynamic)

+------------------------------------------------------------+
| Footer                                                     |
+------------------------------------------------------------+
```

---

## Dashboard Layout

Used for:

- Dashboard
- Problems
- Profile
- History
- Settings

```
+------------------------------------------------------------+
| Logo      Search      Notifications          Avatar         |
+------------------------------------------------------------+

+-----------+-----------------------------------------------+
| Sidebar   |                                               |
|           |                                               |
| Dashboard |                                               |
| Problems  |                                               |
| History   |              Main Content                     |
| Profile   |                                               |
| Settings  |                                               |
|           |                                               |
+-----------+-----------------------------------------------+
```

---

## Battle Layout

Used for:

- Lobby
- Match
- Results

```
+------------------------------------------------------------+
| Timer          Battle Status          Opponent             |
+------------------------------------------------------------+

                 Dynamic Battle Content
```

---

# Shared Components

- Navbar
- Sidebar
- Button
- Card
- Dialog
- Modal
- Input
- Select
- Badge
- Avatar
- Toast
- Skeleton
- Table
- Pagination
- Tabs
- Countdown
- Timer
- Code Editor
- Submission Panel

---

# Screen Wireframes

---

## Landing Page

Purpose

Introduce CodeArena and encourage users to sign up.

```
+------------------------------------------------------------+
| Logo                                  Login   Get Started  |
+------------------------------------------------------------+

                 HERO SECTION

         Real-Time Competitive Coding Battles

      [ Start Battling ]   [ Learn More ]

--------------------------------------------------------------

                Why CodeArena?

--------------------------------------------------------------

                Key Features

--------------------------------------------------------------

                Call To Action

--------------------------------------------------------------

                    Footer
```

Primary Action

- Get Started

---

## Dashboard

Purpose

Allow users to quickly begin a battle or continue learning.

```
+------------------------------------------------------------+
| Navbar                                                     |
+------------------------------------------------------------+

Welcome back, User

+----------------+----------------+----------------+
| Create Battle  | Join Battle    | Practice       |
+----------------+----------------+----------------+

-------------------------------------------------------------

Recent Battles

+-----------------------------------------------------------+

Your Statistics

+-----------------------------------------------------------+
```

Primary Action

- Create Battle

---

## Problems

Purpose

Browse coding problems.

```
+------------------------------------------------------------+
| Navbar                                                     |
+------------------------------------------------------------+

Search

Difficulty Filter

Topic Filter

------------------------------------------------------------

+----------------------------------------------------------+
| Problem Name     Difficulty     Acceptance     Solve     |
+----------------------------------------------------------+
|                                                  ...     |
|                                                  ...     |
|                                                  ...     |
+----------------------------------------------------------+

Pagination
```

Primary Action

- Open Problem

---

## Problem Details

Purpose

Read the problem before starting a battle or practice.

```
+------------------------------------------------------------+
| Navbar                                                     |
+------------------------------------------------------------+

Problem Title

Difficulty

Tags

------------------------------------------------------------

Description

------------------------------------------------------------

Examples

------------------------------------------------------------

Constraints

------------------------------------------------------------

[ Practice ]      [ Start Battle ]
```

Primary Action

- Practice
- Start Battle

---

## Create Battle

Purpose

Configure a new battle.

```
+------------------------------------------------------------+
| Navbar                                                     |
+------------------------------------------------------------+

Create Battle

Difficulty

Language

Time Limit

Privacy

------------------------------------------------------------

          Create Battle
```

Primary Action

- Create Battle

---

## Battle Lobby

Purpose

Prepare both players before the battle begins.

```
+------------------------------------------------------------+
| Battle Room #AB12                                          |
+------------------------------------------------------------+

Player One        ✅ Ready

Player Two        ⏳ Waiting

------------------------------------------------------------

Battle Settings

Difficulty

Language

Time Limit

------------------------------------------------------------

          Ready
```

Primary Action

- Ready

---

## Match Screen

Purpose

Solve the problem in real time.

```
+--------------------------------------------------------------------+
| Logo               Timer               Opponent                    |
+--------------------------------------------------------------------+

+----------------------+--------------------------------------------+
|                      |                                            |
| Problem              |            Monaco Editor                   |
|                      |                                            |
|                      |                                            |
|                      |                                            |
+----------------------+--------------------------------------------+

+----------------------+--------------------------------------------+
| Test Cases           | Output / Console                           |
+----------------------+--------------------------------------------+

          Run Code               Submit Solution
```

Primary Action

- Submit Solution

---

## Results

Purpose

Display battle outcome.

```
+------------------------------------------------------------+
| Battle Results                                             |
+------------------------------------------------------------+

Winner

Score

Execution Time

Accuracy

------------------------------------------------------------

Your Submission

------------------------------------------------------------

Opponent Submission

------------------------------------------------------------

[ Play Again ]     [ Dashboard ]
```

Primary Action

- Play Again

---

## Profile

Purpose

Display personal progress and history.

```
+------------------------------------------------------------+
| Navbar                                                     |
+------------------------------------------------------------+

Avatar

Username

Rating

------------------------------------------------------------

Statistics

------------------------------------------------------------

Recent Battles

------------------------------------------------------------

Achievements

------------------------------------------------------------

Solved Problems
```

Primary Action

- View Progress

---

# Responsive Behavior

## Desktop

- Full layout
- Sidebar visible
- Two-column match screen

---

## Tablet

- Collapsible sidebar
- Match screen adjusts editor width

---

## Mobile

- Landing fully responsive
- Dashboard responsive
- Problems responsive
- Lobby responsive
- Match screen displays unsupported message (MVP)

---

# Navigation Flow

```
Landing
    ↓
Login
    ↓
Dashboard
    ↓
Create Battle / Join Battle
    ↓
Battle Lobby
    ↓
Match Screen
    ↓
Results
    ↓
Dashboard
```

---

# Information Priority

## Match Screen

1. Timer
2. Code Editor
3. Problem Statement
4. Test Cases
5. Output Console
6. Opponent Status

---

## Dashboard

1. Create Battle
2. Join Battle
3. Practice
4. Recent Battles
5. Statistics

---

# Notes

- Every page should have one clear primary action.
- Prefer reusable layouts over unique page structures.
- Maintain consistent spacing and alignment.
- Keep navigation predictable.
- The Match Screen is the highest-priority experience and should receive the most design attention.