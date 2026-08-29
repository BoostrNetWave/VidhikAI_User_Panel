# Vidhik AI — Frontend Architecture After UI Redesign

## 1. Objective

The redesign changes the frontend presentation layer while preserving backend contracts and product behavior.

Architecture principle:

```text
Existing APIs + Existing Business Logic
                ↓
       Typed Service Layer
                ↓
       Query / State Layer
                ↓
     Feature Components
                ↓
     shadcn/ui Primitives
                ↓
        Design Tokens
```

---

# 2. Recommended Frontend Structure

```text
client/src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/
│       ├── AuthProvider.tsx
│       ├── QueryProvider.tsx
│       └── ThemeProvider.tsx
│
├── components/
│   ├── ui/
│   │   └── shadcn components
│   │
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNavigation.tsx
│   │
│   ├── navigation/
│   │   ├── CommandSearch.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── feedback/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingState.tsx
│   │   └── PageSkeleton.tsx
│   │
│   └── shared/
│       ├── PageHeader.tsx
│       ├── SectionHeader.tsx
│       ├── StatusBadge.tsx
│       ├── MetricCard.tsx
│       └── ActivityTimeline.tsx
│
├── features/
│   ├── dashboard/
│   ├── documents/
│   ├── research/
│   ├── cases/
│   ├── consultations/
│   ├── auth/
│   └── settings/
│
├── pages/
│   └── route-level compositions only
│
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── documents.service.ts
│   ├── research.service.ts
│   ├── cases.service.ts
│   └── consultations.service.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDocuments.ts
│   ├── useCases.ts
│   └── useResearch.ts
│
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── formatters.ts
│
├── styles/
│   ├── globals.css
│   └── tokens.css
│
└── types/
    ├── auth.ts
    ├── document.ts
    ├── case.ts
    └── consultation.ts
```

---

# 3. Component Responsibility

## Pages

Pages should compose features.

Avoid placing large amounts of business logic directly inside page components.

Bad:

```text
Page
 ├── API call
 ├── transformation
 ├── validation
 ├── modal state
 ├── table
 ├── form
 └── visual markup
```

Preferred:

```text
Page
 ├── PageHeader
 ├── FeatureContainer
 │    ├── query hook
 │    ├── domain components
 │    └── states
```

---

# 4. Data Fetching

Prefer TanStack Query if it can be introduced without disrupting existing behavior.

Benefits:

- caching
- loading state management
- background refetch
- mutation state
- stale data handling
- query invalidation

If the project already has an established data-fetching strategy, preserve it unless migration is low-risk.

---

# 5. Forms

Use:

```text
React Hook Form
+
Zod
+
shadcn/ui Form
```

Pattern:

```text
schema
↓
form
↓
field validation
↓
submit mutation
↓
success/error feedback
```

Do not duplicate validation rules across components.

---

# 6. Design Token Strategy

Centralize:

- colors
- radius
- typography
- shadows
- spacing
- focus styles

Do not hard-code arbitrary Tailwind values across the application.

The goal is that a visual adjustment can be made centrally.

---

# 7. Routing

Keep route paths unchanged unless the existing application has a documented reason to change them.

Route-level redesign should not alter:

- API endpoints
- authentication semantics
- authorization rules
- document generation contracts
- case identifiers
- consultation identifiers

---

# 8. Performance

Avoid:

- unnecessary global state
- huge component trees
- duplicate API calls
- rendering expensive document previews unnecessarily
- loading all research results at once
- unnecessary animation libraries

Use:

- lazy-loaded route components
- memoization only where useful
- virtualization for very large tables/lists
- optimized image loading
- query caching

---

# 9. Error Boundaries

Use route-level error boundaries where practical.

A single page failure should not blank the entire application shell.

---

# 10. Security Preservation

The redesign must not:

- move JWT handling into unsafe client storage without explicit reason
- expose secrets
- place API keys in frontend code
- bypass authorization
- weaken protected routes
- expose private legal documents through client-only checks

UI redesign must preserve the existing security model.

---

# 11. Implementation Principle

Build the redesign in this order:

```text
1. Tokens
2. shadcn/ui foundation
3. App shell
4. Navigation
5. Page primitives
6. Dashboard
7. Documents
8. Document generation
9. Research
10. Cases
11. Consultations
12. Authentication
13. Settings
14. Responsive QA
15. Accessibility QA
16. Visual consistency pass
```

Do not redesign every page independently. Establish the system first.
