
02-FRONTEND-ARCHITECTURE.md

This is the blueprint for the entire frontend. Every future decision should align with this document.

Proposed Structure
1. Overview

2. Tech Stack

3. Architecture Principles

4. Project Structure

5. Routing Architecture

6. Rendering Strategy

7. State Management

8. Data Fetching

9. Authentication

10. API Layer

11. Socket Architecture

12. Forms & Validation

13. Error Handling

14. Loading Strategy

15. Performance Strategy

16. Security

17. Coding Standards

18. Development Rules

Notice something?

This isn't just "what libraries we use." It explains why we use them and how they fit together.

1. Overview

A one-page summary.

Example:

CodeArena follows a feature-first architecture using Next.js App Router. The frontend is optimized for real-time interactions, server state synchronization, and a responsive coding experience. The architecture prioritizes scalability, maintainability, and clear separation of concerns.

2. Tech Stack

Instead of just listing technologies, explain their responsibility.

Technology	Purpose
Next.js	Framework
TypeScript	Type safety
Tailwind CSS	Styling
shadcn/ui	Base UI components
TanStack Query	Server state
Zustand	Client state
React Hook Form	Forms
Zod	Validation
Socket.IO	Real-time communication
Monaco Editor	Code editor
Clerk	Authentication
Framer Motion	Purposeful animations

This becomes the reference whenever someone asks, "Where should this go?"

3. Architecture Principles ⭐

This is one of the most important sections.

For example:

Feature-first organization

Everything belongs to a feature.

features/

auth/

battle/

problem/

profile/

Not:

components/

hooks/

pages/

utils/

because those become huge over time.

Keep business logic out of components

Components render UI.

Hooks coordinate.

Services talk to the backend.

This mirrors your backend architecture.

Prefer composition over inheritance

Build small, reusable pieces instead of large, rigid components.

4. Project Structure

Here we'll define the actual folder layout.

I would not put everything under app.

Something like:

app/

components/
    ui/
    shared/

features/
    auth/
    dashboard/
    battle/
    problem/
    profile/

services/

hooks/

lib/

types/

constants/

styles/

This is much easier to scale.

5. Routing Architecture

Instead of just listing routes, define route groups.

Example:

(public)

/

/about

/login

-----------------

(protected)

/dashboard

/problems

/battle

/profile

/settings

-----------------

(match)

/lobby/[roomCode]

/match/[matchId]

This helps with layouts and middleware later.

6. Rendering Strategy ⭐

This is often ignored in AI-generated projects.

We should explicitly decide:

Server Components by default
Client Components only when needed
Server-side data fetching where appropriate
Client-side real-time updates for active matches

That keeps the app performant.

7. State Management

Instead of just saying "use Zustand", define clear rules.

State	Tool
Backend data	TanStack Query
UI state	Zustand
Forms	React Hook Form
URL filters	Search Params
Local state	useState

Also include what not to do, for example:

Don't duplicate server state in Zustand.
Don't fetch data directly inside random components.
8. API Layer

We already built a clean backend.

The frontend should mirror it.

services/

problem.service.ts

battle.service.ts

submission.service.ts

Components should never call fetch() directly.

9. Socket Architecture

Define a single Socket Manager.

Not multiple connections scattered around the app.

Responsibilities:

Connect
Disconnect
Reconnect
Event listeners
Event emitters
10. Forms

Standardize:

React Hook Form
Zod
Shared form components
Consistent validation messages

Every form behaves the same.

11. Error Handling

Standardize:

API errors
Validation errors
Network failures
Socket disconnects
Unexpected errors

No random alert() calls.

12. Loading Strategy

Prefer:

Skeletons
Progressive loading
Optimistic updates (where appropriate)

Avoid endless spinners.

13. Performance Strategy

Document rules like:

Lazy load Monaco Editor
Dynamic imports for heavy components
Memoize expensive computations
Prefetch likely navigation targets
Optimize images and fonts
14. Coding Standards

Define conventions:

Component naming
File naming
Import order
Barrel exports (if used)
Type definitions
Hook naming
Service naming

This keeps the codebase consistent.

15. Development Rules ⭐

This is my favorite section.

Instead of paragraphs, make it a checklist.

✅ Always
Keep components focused on rendering.
Fetch server data with TanStack Query.
Validate forms with Zod.
Keep feature logic within its feature folder.
Prefer reusable components over duplication.
❌ Never
Call fetch() directly inside components.
Store server state in Zustand.
Create circular dependencies.
Mix UI and business logic.
Use inline styles for production components.

These rules become the team's shared conventions.