# Vidhik AI — UI Redesign Implementation & QA Checklist

## Phase 1 — Audit

- [ ] Inspect all user-facing routes.
- [ ] Inspect existing layout components.
- [ ] Inspect existing Tailwind configuration.
- [ ] Inspect package.json.
- [ ] Inspect existing Radix/shadcn components.
- [ ] Inspect authentication flow.
- [ ] Inspect API/service layer.
- [ ] Inspect all document workflows.
- [ ] Inspect research workflow.
- [ ] Inspect cases workflow.
- [ ] Inspect consultation workflow.
- [ ] Identify reusable components.
- [ ] Identify duplicated UI patterns.

## Phase 2 — Foundation

- [ ] Install/configure shadcn/ui if required.
- [ ] Establish semantic color tokens.
- [ ] Establish typography.
- [ ] Establish spacing.
- [ ] Establish radius.
- [ ] Establish shadows.
- [ ] Establish focus states.
- [ ] Configure global CSS.
- [ ] Configure Inter or the existing approved brand font.
- [ ] Remove inconsistent one-off styling.

## Phase 3 — Shell

- [ ] Build AppShell.
- [ ] Build responsive Sidebar.
- [ ] Build Topbar.
- [ ] Build mobile navigation.
- [ ] Build breadcrumbs.
- [ ] Build global command search.
- [ ] Build profile menu.
- [ ] Build notification entry point.

## Phase 4 — Shared Components

- [ ] PageHeader.
- [ ] SectionHeader.
- [ ] EmptyState.
- [ ] ErrorState.
- [ ] LoadingState.
- [ ] StatusBadge.
- [ ] MetricCard.
- [ ] ActivityTimeline.
- [ ] DataTable foundation.
- [ ] Form foundation.
- [ ] Dialog foundation.
- [ ] Drawer foundation.

## Phase 5 — Product Pages

- [ ] Dashboard.
- [ ] Documents.
- [ ] Document generation.
- [ ] Document review.
- [ ] Document preview.
- [ ] Legal research.
- [ ] Cases.
- [ ] Lawyer directory.
- [ ] Lawyer profile.
- [ ] Booking.
- [ ] Checkout.
- [ ] Consultation room.
- [ ] Settings.
- [ ] Authentication.

## Phase 6 — State Design

For every important route:

- [ ] Initial loading.
- [ ] Skeleton loading.
- [ ] Empty state.
- [ ] Error state.
- [ ] Retry state.
- [ ] Success feedback.
- [ ] Disabled state.
- [ ] Hover state.
- [ ] Focus state.
- [ ] Active state.

## Phase 7 — Responsive QA

- [ ] 1440×900.
- [ ] 1280×800.
- [ ] 1024×768.
- [ ] 768×1024.
- [ ] 390×844.
- [ ] Sidebar collapse.
- [ ] Mobile drawer.
- [ ] Tables.
- [ ] Forms.
- [ ] Dialogs.
- [ ] Document preview.
- [ ] Calendar.
- [ ] Consultation room.

## Phase 8 — Accessibility

- [ ] Keyboard navigation.
- [ ] Focus-visible styles.
- [ ] Form labels.
- [ ] Dialog focus trap.
- [ ] Screen-reader labels.
- [ ] Color contrast.
- [ ] Non-color state indicators.
- [ ] Reduced motion.
- [ ] 44px touch targets.

## Phase 9 — Final Visual Polish

- [ ] Remove generic cards.
- [ ] Remove unnecessary gradients.
- [ ] Remove unnecessary shadows.
- [ ] Normalize spacing.
- [ ] Normalize icon size.
- [ ] Normalize button heights.
- [ ] Normalize input heights.
- [ ] Normalize border radius.
- [ ] Normalize typography.
- [ ] Improve empty states.
- [ ] Improve error states.
- [ ] Improve loading states.
- [ ] Remove decorative UI with no product purpose.
- [ ] Check all pages for visual consistency.

## Phase 10 — Technical Validation

- [ ] npm run build
- [ ] Existing lint command.
- [ ] Existing typecheck command.
- [ ] Existing tests.
- [ ] Verify API requests.
- [ ] Verify authentication.
- [ ] Verify protected routes.
- [ ] Verify document generation.
- [ ] Verify downloads.
- [ ] Verify booking.
- [ ] Verify consultation.
- [ ] Verify settings.

## Final Gate

- [ ] Feels premium.
- [ ] Feels human-designed.
- [ ] Feels cohesive.
- [ ] Feels fast.
- [ ] Feels trustworthy.
- [ ] Does not feel AI-generated.
