
03-DESIGN-SYSTEM.md

This is not just a color palette.

It's the personality of CodeArena.

I want this document to answer one question:

"If another developer built a new page tomorrow, would it still look like CodeArena?"

If the answer is yes, the design system is doing its job.

Structure
1. Design Philosophy

2. Brand Identity

3. Color System

4. Typography

5. Spacing System

6. Grid & Layout

7. Border Radius

8. Elevation & Shadows

9. Icons

10. Motion & Animation

11. Component Guidelines

12. Page Layout Patterns

13. Feedback States

14. Accessibility

15. Responsive Design

16. Design Rules
1. Design Philosophy ⭐

This is the soul of the UI.

Examples:

Editor First
Competitive but Professional
Dark by Default
Minimal Visual Noise
Purposeful Motion
Fast Interaction
Consistency over Decoration

Every future design decision should align with these.

2. Brand Identity

We define what CodeArena represents.

Examples:

Instead of

Dashboard

use

Arena

Instead of

Room

use

Battle Room

Instead of

Submit

keep

Submit Solution

Instead of

Waiting...

use

Waiting for Challenger...

The words matter.

3. Color System

Don't pick random Tailwind colors.

Create semantic colors.

Background

Surface

Primary

Secondary

Accent

Success

Warning

Danger

Border

Muted

Text Primary

Text Secondary

Components use semantic colors, not direct colors.

Example:

Button

↓

Primary

↓

Orange

instead of

Button

↓

Orange-500

This makes theme changes much easier later.

4. Typography

Choose fonts once.

Example:

Heading

Geist

Body

Geist

Code

JetBrains Mono

Define:

H1
H2
H3
Body
Caption
Labels

No random font sizes.

5. Spacing

Instead of random padding:

13px

27px

41px

Use a spacing scale.

Example:

4

8

12

16

24

32

48

64

Everything follows the scale.

6. Grid & Layout

Define page widths.

Example:

Landing

1280px

Dashboard

1440px

Match

Full Width

This keeps layouts consistent.

7. Border Radius

One system.

Not

rounded-md

rounded-xl

rounded-3xl

rounded-full

randomly everywhere.

Choose 3–4 radius values and stick to them.

8. Shadows

Only a few elevation levels.

Example:

None

Small

Medium

Large

No giant glowing shadows.

9. Icons

Choose one library.

For example:

Lucide.

Never mix Lucide, Heroicons, Font Awesome, Tabler, etc.

10. Motion ⭐

This is where most AI-generated apps fail.

Every animation should have a purpose.

Good:

Hover
Press
Page transition
Lobby updates
Countdown
Match start
Victory

Bad:

Floating cards
Random bouncing
Constant glowing
Infinite animations

Motion should communicate change, not decorate the page.

11. Component Guidelines

For each reusable component, define:

Purpose

Variants

States

Usage

Do

Don't

Example:

Button

Variants:

Primary
Secondary
Ghost
Danger

States:

Default
Hover
Active
Loading
Disabled

Now every button behaves consistently.

12. Page Layout Patterns

Instead of designing every page from scratch, define templates.

Examples:

Landing

Dashboard

List Page

Detail Page

Battle Lobby

Coding Screen

Profile

Settings

Future pages reuse these patterns.

13. Feedback States

Define standard behavior for:

Loading

Empty

Error

Success

Offline

Every feature should use the same patterns.

14. Accessibility

Basic rules.

Examples:

Keyboard navigation
Visible focus states
Color contrast
Screen reader labels
Minimum touch targets
15. Responsive Design

Decide once.

Example:

Landing

Desktop + Mobile

Dashboard

Desktop + Tablet

Coding Screen

Desktop only (MVP)

No surprises later.

16. Design Rules ⭐

End with a simple checklist.

✅ Always
Use semantic colors.
Keep layouts clean.
Prioritize readability.
Use reusable components.
Animate only meaningful interactions.
❌ Never
Add decorative gradients without purpose.
Mix multiple visual styles.
Use inconsistent spacing.
Create one-off components when a reusable one fits.
Sacrifice usability for visual effects.
One thing I want to add

This is something many projects miss:

Component Inventory

At the end of the document, list every reusable component you expect to build.

Example:

Button
Input
Textarea
Select
Dialog
Drawer
Tooltip
Toast
Badge
Avatar
Navbar
Sidebar
Breadcrumb
Card
Data Table
Tabs
Code Editor
Problem Card
Battle Card
Leaderboard Row
Countdown Timer
Scoreboard
Submission Panel
Loading Skeleton

Whenever you need a new UI element, check this inventory first.

If it already exists, reuse it.

If not, add it to the inventory before building it.

This helps prevent ending up with three different card designs or four different button styles.