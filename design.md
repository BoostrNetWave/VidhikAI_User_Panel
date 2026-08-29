# Vidhik AI - Frontend UI/UX Design System & Details

## 1. Design Philosophy
Vidhik AI is designed with a premium, professional, and trustworthy aesthetic, suitable for a legal technology platform. The interface balances high-density information (like legal documents and case details) with clean, breathable whitespace. 
- **Modern & Clean:** A minimalist approach utilizing ample whitespace to avoid cognitive overload.
- **Trust & Authority:** Utilizing deep blues, crisp whites, and slate grays to convey professionalism and security.
- **Accessibility:** High contrast ratios, clear typography, and logical tab orders.
- **Responsiveness:** Fluid layouts that adapt seamlessly from desktop to mobile screens.

## 2. Core Technologies
- **Framework:** React 18 with Vite for lightning-fast HMR and optimized builds.
- **Styling:** Tailwind CSS (utility-first CSS framework) for rapid and consistent styling.
- **Component Library:** Radix UI primitives for accessible, unstyled foundational components (Dialogs, Tabs, Selects, Accordions).
- **Icons:** Lucide React for consistent, crisp, and scalable SVG iconography.
- **Animations:** Framer Motion / Tailwind CSS transitions for fluid micro-interactions and page transitions.

## 3. Typography & Color Palette
### Typography
- **Primary Font:** `Inter` or `Roboto` - Used for general UI, readable at small sizes.
- **Headings:** Bold, clear font weights (600-800) for section titles and page headers.
- **Monospace (for legal formatting):** `JetBrains Mono` or similar for specific data points or code-like snippets if needed.

### Color Palette
- **Primary Blue:** Used for primary actions (buttons, active states, links).
- **Slate/Gray Scale:** Used for backgrounds (`bg-slate-50`), borders (`border-gray-200`), and secondary text (`text-gray-500`).
- **Success Green:** For completed actions, approved statuses, and successful notifications.
- **Warning/Error Red:** For destructive actions, errors, and urgent alerts.
- **Surface Colors:** Pure white (`bg-white`) for cards and modals to create elevation against lighter gray backgrounds.

## 4. Layout Architecture
### 4.1 DashboardLayout (`layout/DashboardLayout.tsx`)
- **Sidebar (Left):** Contains main navigation links (Dashboard, Cases, Documents, Legal Research, Consultations, Settings). Collapsible on smaller screens. Features the Vidhik AI brand logo at the top.
- **Top Navbar:** Contains user profile dropdown, notification bell, and global search.
- **Main Content Area:** The dynamic area where page components are rendered. Features a subtle gray background to contrast with white content cards.

### 4.2 AdminLayout (`layout/AdminLayout.tsx`)
- Specifically tailored for super admins.
- Similar structure to the DashboardLayout but with admin-specific navigation (System Config, User Management, Lawyer Approvals, Financials).

## 5. Key UI Components & Features

### 5.1 Authentication Module (`pages/auth/`)
- **Login/Register:** Clean card-based forms with clear input fields.
- **Transitions:** Smooth fade-ins when switching between Login, Register, and Forgot Password states.
- **Validation:** Real-time inline error messages using React Hook Form + Zod.

### 5.2 Document Hub (`pages/documents/DocumentHub.tsx`)
- **Grid Layout:** Displays available document templates (Consultant Agreement, Board Resolution, etc.) in a responsive grid of cards.
- **Hover Effects:** Cards slightly elevate (`-translate-y-1`) with a soft shadow (`shadow-lg`) on hover to indicate interactivity.
- **Document Generation Flow:** Step-by-step wizard style or long-form with sticky navigation. Uses progress bars to show completion status.

### 5.3 Legal Research (`pages/research/LegalResearchPage.tsx`)
- **Search Interface:** Prominent, centered search bar resembling a high-end search engine.
- **Results View:** Clean list view with expandable accordions for detailed case summaries or legal precedents.

### 5.4 Lawyer Consultation (`pages/AILawyerList.tsx`, `ConsultationRoom.tsx`)
- **Lawyer Directory:** Profile cards showing lawyer picture, specialization tags, rating, and hourly rate.
- **Booking Flow (`LawyerBooking.tsx`):** Interactive calendar (likely using `react-day-picker`) for selecting slots, followed by a summary and payment checkout modal.
- **Consultation Room:** Video/Audio interface with side-panel chat. Features glowing active-speaker borders and clear mute/camera toggle buttons.

### 5.5 Data Tables & Lists
- Used extensively in Cases (`CasesPage.tsx`) and Admin panels.
- Features sorting headers, pagination, and sticky headers.
- **Row Hover:** Subtle background color change on row hover (`hover:bg-slate-50`).

## 6. Micro-Interactions & Transitions
- **Buttons:** Active scale down (`active:scale-95`), background color transitions (`transition-colors duration-200`).
- **Modals/Dialogs:** Backdrop blur (`backdrop-blur-sm`) with a quick fade and slight scale-up animation for the modal card.
- **Skeletons:** Loading states use pulsing skeleton loaders (`animate-pulse`) matching the shape of the content to reduce perceived loading time.
- **Toast Notifications:** Slide-in toasts from the bottom-right or top-right (using `sonner` or similar) for success/error feedback.

## 7. Responsiveness
- **Mobile First Approach:** Base classes target mobile, with `md:`, `lg:`, `xl:` breakpoints adjusting layouts (e.g., stacking grids, hiding sidebars into hamburger menus).
- **Touch Targets:** Minimum 44px height for interactive elements on mobile devices.
