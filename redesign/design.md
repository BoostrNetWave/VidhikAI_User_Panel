# Vidhik AI — Premium SaaS UI/UX Design System
## Version 2.0 — Production UI Redesign Specification

> **Purpose:** Replace the current generic legal-dashboard aesthetic with a polished, premium, product-led SaaS interface that feels deliberately designed and implemented by an experienced frontend team.
>
> **Non-negotiable:** Preserve Vidhik AI's existing product capabilities, routes, API contracts, data model, authentication behavior, and business logic unless explicitly required for UI implementation. This is a UI/UX redesign, not a product rewrite.

---

# 1. Design Direction

## 1.1 Product Personality

Vidhik AI should feel:

- premium
- calm
- authoritative
- intelligent
- trustworthy
- modern
- precise
- efficient
- human-designed
- enterprise-ready

It must **not** feel:

- like an AI-generated dashboard
- like a template marketplace
- excessively rounded
- overly colorful
- visually noisy
- full of gradients
- like a generic admin panel
- like a cryptocurrency/AI startup landing page
- like a collection of disconnected cards

The visual language should sit between a premium legal product and a modern productivity SaaS.

### Reference quality bar

The interface should feel comparable in polish to products such as:

- Linear
- Notion
- Stripe Dashboard
- Vercel
- Raycast
- Clerk
- Ramp
- modern enterprise legal-tech products

Do **not** copy their branding. Use them only as quality references.

---

# 2. Core Visual Principle

## "Quiet Premium"

The UI should communicate quality through:

- spacing
- typography
- alignment
- hierarchy
- subtle borders
- restrained shadows
- carefully chosen interaction states
- consistent component geometry
- excellent empty/loading/error states

Avoid trying to communicate "premium" through:

- excessive gradients
- glassmorphism everywhere
- giant shadows
- neon colors
- oversized typography
- decorative blobs
- excessive animations

The product should look expensive because it is **precise**, not because it is visually loud.

---

# 3. Design Tokens

## 3.1 Color System

Use semantic tokens rather than hard-coded colors throughout the application.

### Base

```text
Background:
--background: #F8FAFC

Primary Surface:
--surface: #FFFFFF

Elevated Surface:
--surface-elevated: #FFFFFF

Subtle Surface:
--surface-muted: #F1F5F9

Border:
--border: #E2E8F0

Border Strong:
--border-strong: #CBD5E1

Primary Text:
--foreground: #0F172A

Secondary Text:
--muted-foreground: #64748B

Tertiary Text:
#94A3B8
```

### Brand

Use a deep navy/blue identity.

```text
Primary:
#1E3A8A

Primary Hover:
#1E40AF

Primary Soft:
#EFF6FF

Primary Border:
#BFDBFE
```

Use the existing Vidhik brand color if the current product already has a defined brand color. **Do not silently replace the existing brand identity.** Map the existing brand color into these semantic roles.

### Semantic

```text
Success:
#15803D

Success Soft:
#F0FDF4

Warning:
#B45309

Warning Soft:
#FFFBEB

Danger:
#B91C1C

Danger Soft:
#FEF2F2

Info:
#0369A1

Info Soft:
#F0F9FF
```

### Rule

Color should primarily communicate:

1. hierarchy
2. state
3. action
4. status

Never use color merely for decoration.

---

# 4. Typography

## Primary Font

Use:

```text
Inter
```

Fallback:

```text
ui-sans-serif, system-ui, sans-serif
```

For legal document previews, use a highly readable document-oriented serif only when it improves the reading experience. UI itself remains sans-serif.

## Type Scale

```text
Display:
40–48px / 1.05 / 700

Page Heading:
28–32px / 1.15 / 650

Section Heading:
20–24px / 1.25 / 650

Card Heading:
15–17px / 1.3 / 600

Body:
14–15px / 1.55 / 400

Small:
12–13px / 1.4 / 400

Label:
11–12px / 1.3 / 600
```

Do not make every heading bold.

Use weight strategically:

- 400 = normal information
- 500 = emphasized information
- 600 = headings and controls
- 700 = major page titles only

---

# 5. Geometry

## Border Radius

Use restrained radius values.

```text
Button:
8px

Input:
8px

Card:
12px

Dialog:
16px

Large Surface:
16px

Pill:
9999px
```

Do not turn every element into a pill.

## Borders

Default:

```text
1px solid #E2E8F0
```

Borders should provide structure without becoming visually heavy.

## Shadows

Default cards should primarily rely on borders.

Use shadows only for elevation:

```text
sm:
0 1px 2px rgba(15,23,42,0.04)

md:
0 4px 12px rgba(15,23,42,0.06)

lg:
0 12px 32px rgba(15,23,42,0.10)
```

Avoid permanent large shadows.

---

# 6. Application Shell

## Desktop Layout

Use:

```text
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │ Topbar                                             │
│         ├─────────────────────────────────────────────────────┤
│         │                                                     │
│         │ Main Content                                       │
│         │                                                     │
│         │                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar

Width:

```text
248px expanded
72px collapsed
```

Characteristics:

- fixed
- full viewport height
- clean white / slightly tinted surface
- subtle right border
- compact navigation
- grouped navigation
- no oversized icons
- no giant logo treatment

### Sidebar hierarchy

```text
Vidhik AI

WORKSPACE
Overview
Documents
Cases
Legal Research
Consultations

WORK
Recent Documents
Saved Research
Templates

SYSTEM
Settings
Help & Support
```

The exact navigation must follow the existing application routes.

### Active item

Active navigation item should use:

- subtle primary-tinted background
- primary icon
- primary text
- 3–4px visual emphasis
- no excessive glow

---

# 7. Top Navigation

Height:

```text
64px
```

Structure:

```text
Breadcrumb / Page Context
                Search
                Notifications
                Help
                User Menu
```

The topbar should not contain unnecessary controls.

## Global Search

Use a compact command-search style trigger:

```text
Search...
⌘ K
```

Clicking opens a command palette.

Search should support:

- documents
- cases
- research
- lawyers
- settings

---

# 8. Dashboard

The dashboard must not be a grid of 12 identical cards.

## Hero Section

Use a calm contextual welcome:

```text
Good morning, Shiv

Manage your legal work, documents, research and consultations from one workspace.
```

Avoid artificial AI copy.

## Primary Action

One dominant action:

```text
Create document
```

Secondary:

```text
Start legal research
```

## Overview Metrics

Use 3–4 compact metric blocks.

Example:

```text
Documents
24
+4 this month

Active Cases
8
2 requiring attention

Research
17
5 saved this week

Consultations
3
Next: Tomorrow, 11:30 AM
```

Metrics should not dominate the page.

## Recent Activity

Use a timeline/list rather than a card wall.

Example:

```text
Today

Contract generated
Consultant Agreement
10 minutes ago

Case updated
Case #VDK-1042
1 hour ago

Research saved
Section 138 precedent
3 hours ago
```

---

# 9. Document Hub

This is one of the most important areas.

## Layout

Top:

```text
Documents
Create, manage and organize your legal documents.

[ Search documents... ] [Filter] [Create document]
```

Below:

```text
Categories
All | Agreements | Corporate | Employment | IP | Notices | Other
```

## Template Cards

Do NOT create huge cards with illustrations.

Preferred structure:

```text
┌────────────────────────────────────┐
│ [document icon]                    │
│                                    │
│ Consultant Agreement               │
│ Create a professional consulting   │
│ agreement tailored to your needs.  │
│                                    │
│ Agreement · 8–12 min               │
│                                    │
│ Create →                            │
└────────────────────────────────────┘
```

Use subtle icon containers and typography.

## Hover

Only subtle:

- border becomes slightly stronger
- surface elevation increases
- arrow/action becomes visible
- 120–180ms transition

No dramatic card movement.

---

# 10. Document Generation Experience

The generation flow must feel like a premium guided workflow.

## Stepper

Use:

```text
01 Basics
02 Parties
03 Terms
04 Review
05 Generate
```

Current step is clearly emphasized.

Completed steps show checkmarks.

## Main Layout

Desktop:

```text
┌───────────────────────────────────────────────────────────────┐
│ Stepper                                                       │
├───────────────────────────────────────┬───────────────────────┤
│                                       │                       │
│ Form                                  │ Document summary      │
│                                       │                       │
│ Fields                                │ Progress              │
│                                       │                       │
│                                       │                       │
├───────────────────────────────────────┴───────────────────────┤
│ Back                                      Continue →          │
└───────────────────────────────────────────────────────────────┘
```

The right panel can remain sticky.

## Form Rules

- Group related fields.
- Never place 10+ fields in a single undifferentiated form.
- Use descriptions for legally important fields.
- Mark required fields clearly.
- Use contextual help.
- Preserve entered data between steps.
- Show validation next to the field.
- Avoid giant input heights.

---

# 11. Document Review

The review stage should feel like a document editor rather than a normal dashboard.

Use:

```text
┌──────────────────────────────────────────────────────────────┐
│ Document title                         Edit | Download | Save │
├──────────────────────────────────────┬───────────────────────┤
│                                      │ Document details      │
│              DOCUMENT                │                       │
│                                      │ Completion            │
│                                      │ 100%                  │
│                                      │                       │
│                                      │ Parties               │
│                                      │ Terms                 │
│                                      │ Metadata              │
└──────────────────────────────────────┴───────────────────────┘
```

Document preview:

- white page
- realistic page width
- subtle page shadow
- generous document margins
- readable legal typography
- zoom controls
- page navigation

---

# 12. Legal Research

Research should feel like a professional legal research workspace.

## Search

Large but restrained:

```text
What legal question are you researching?

[ Describe your question...                          Search ]
```

Provide example prompts below the search field.

## Results

Each result should contain:

```text
Case / Authority title
Court · Year
Relevance
Short summary

Citations
Tags
Save
Open
```

Avoid accordion overload.

Use a split-view research experience on desktop:

```text
Results list | Selected authority / AI synthesis
```

---

# 13. Cases

Cases should use a high-quality data table.

Toolbar:

```text
Cases
Track and manage your legal matters.

[ Search cases... ] [Status] [Sort] [New case]
```

Table:

```text
Case
Client
Status
Priority
Last updated
Next action
```

Use:

- sticky header
- row hover
- compact row height
- status badges
- contextual actions
- pagination

Avoid excessive grid borders.

---

# 14. Consultation Experience

## Lawyer Directory

Use list + card hybrid.

Each lawyer:

```text
Avatar
Name
Specialization
Experience
Rating
Availability
Price
View profile →
```

Prioritize comparison.

## Booking

Three-stage experience:

```text
01 Lawyer
02 Date & Time
03 Confirmation
```

Calendar should be compact and premium.

Available slots should use clear states:

```text
10:00 AM
10:30 AM
11:00 AM
```

Selected slot receives primary emphasis.

---

# 15. Consultation Room

The consultation room should be visually immersive but restrained.

Structure:

```text
┌───────────────────────────────────────────────┬───────────────┐
│                                               │               │
│                                               │ Chat          │
│                Video Area                     │               │
│                                               │ Messages      │
│                                               │               │
│                                               │               │
├───────────────────────────────────────────────┤               │
│ Mute  Camera  Share  More        End call    │               │
└───────────────────────────────────────────────┴───────────────┘
```

Controls:

- circular but not oversized
- clear hover states
- destructive red only for end-call
- keyboard accessible

---

# 16. Authentication

Authentication should feel like a product entry point, not an admin form.

Desktop split layout:

```text
Brand / product message | Authentication panel
```

The brand side may contain:

- concise product statement
- trust indicators
- subtle abstract legal visual language

Avoid stock imagery.

Form side:

- logo
- title
- subtitle
- email
- password
- primary CTA
- secondary actions
- terms

Keep it minimal.

---

# 17. Empty States

Every empty state needs:

1. explanation
2. useful action
3. optional contextual illustration/icon

Example:

```text
No documents yet

Create your first legal document from a professionally structured template.

[ Create document ]
```

Do not use giant empty-state illustrations.

---

# 18. Loading States

Never show blank pages while loading.

Use:

- skeleton text
- skeleton cards
- table row skeletons
- document page skeleton
- button loading state

Skeleton shapes must match final geometry.

---

# 19. Error States

Errors should be calm and actionable.

Bad:

```text
Something went wrong!!!
```

Better:

```text
We couldn't load your documents.

Please try again. If the problem continues, contact support.

[ Try again ]
```

---

# 20. Toasts

Use Sonner or the existing toast infrastructure.

Rules:

- concise
- actionable
- no paragraph-length messages
- success, warning, error semantics
- maximum 1–2 simultaneous visible toasts

---

# 21. Dialogs / Drawers

Use shadcn/ui Dialog, Sheet and AlertDialog.

Dialogs:

- 480–640px typical width
- clear title
- concise description
- primary + secondary action
- destructive confirmation for dangerous operations

Use drawers for contextual editing when appropriate instead of navigating away.

---

# 22. shadcn/ui Component Standard

Use shadcn/ui as the default component foundation.

Preferred components:

```text
Button
Input
Textarea
Select
Combobox
DropdownMenu
Command
Dialog
AlertDialog
Sheet
Popover
Calendar
Tabs
Tooltip
Badge
Card
Table
DataTable
Breadcrumb
Pagination
Separator
Skeleton
Progress
Avatar
ScrollArea
Accordion
Form
```

Customize tokens and variants to match Vidhik AI.

Do not blindly use the default shadcn appearance.

---

# 23. Component Architecture

Use reusable primitives.

```text
components/
├── ui/
├── layout/
├── navigation/
├── data-display/
├── forms/
├── documents/
├── research/
├── cases/
├── consultations/
└── feedback/
```

Build product-level components such as:

```text
PageHeader
SectionHeader
EmptyState
LoadingState
StatusBadge
MetricCard
SearchCommand
DocumentTemplateCard
DocumentStepper
DocumentPreview
CaseTable
ResearchResult
LawyerCard
AvailabilityPicker
ActivityTimeline
```

---

# 24. Motion

Motion should communicate state.

Allowed:

- 120–180ms hover transitions
- 180–240ms dialogs
- 200–300ms page content transitions
- subtle drawer transitions
- skeleton pulse

Avoid:

- bouncing UI
- continuous floating objects
- excessive parallax
- animated gradients
- large page transitions

Respect:

```text
prefers-reduced-motion
```

---

# 25. Responsive Behavior

Breakpoints:

```text
sm: 640
md: 768
lg: 1024
xl: 1280
2xl: 1536
```

Desktop:

- persistent sidebar
- split views
- sticky contextual panels

Tablet:

- collapsible sidebar
- reduced padding
- fewer simultaneous columns

Mobile:

- bottom-safe action areas where necessary
- sidebar becomes drawer
- tables become stacked cards or horizontal scroll
- split views become tabs/drawers
- minimum 44px touch targets

---

# 26. Accessibility

Must meet WCAG AA expectations.

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- accessible labels
- ARIA only when necessary
- contrast-safe text
- reduced-motion support
- no color-only state indicators
- screen-reader friendly forms
- focus trapping in dialogs

---

# 27. Anti-AI-Generated UI Rules

This section is mandatory.

Do NOT produce:

- excessive rounded cards
- gradient text
- purple/blue AI gradients
- glowing borders
- floating blobs
- excessive glassmorphism
- generic dashboard metric-card walls
- random illustrations
- emoji as primary UI icons
- oversized hero text inside application pages
- inconsistent icon sizes
- inconsistent spacing
- 10 different border radii
- decorative animation without purpose
- fake AI copy such as "Unlock the power of AI"
- repetitive "Smart / Intelligent / Powerful" marketing labels
- arbitrary badges everywhere

The final interface should look like it was refined through multiple rounds of design review.

---

# 28. Visual QA Checklist

Before considering a page complete:

- [ ] Typography hierarchy is consistent.
- [ ] Spacing follows the design tokens.
- [ ] No arbitrary colors are introduced.
- [ ] No component has unnecessary decoration.
- [ ] Primary action is visually obvious.
- [ ] Secondary actions do not compete with primary action.
- [ ] Empty state exists.
- [ ] Loading state exists.
- [ ] Error state exists.
- [ ] Mobile layout has been considered.
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Icons have consistent dimensions.
- [ ] Buttons use consistent heights.
- [ ] Cards do not all look identical.
- [ ] Tables are readable at realistic data density.
- [ ] Long legal content remains readable.
- [ ] No horizontal overflow on normal desktop/mobile widths.
- [ ] Existing functionality still works.

---

# 29. Definition of Done

The redesign is complete only when:

1. The entire user-facing application follows one coherent visual system.
2. Every major route has consistent layout behavior.
3. shadcn/ui is used as the component foundation.
4. Existing functionality is preserved.
5. The application feels premium without relying on decorative effects.
6. Interactions have polished hover/focus/loading/error states.
7. Desktop, tablet and mobile layouts are intentional.
8. No page looks like a default Tailwind/shadcn template.
9. No page looks AI-generated.
10. The final product feels like a production SaaS application built by a senior frontend engineer and product designer.
