# Vidhik AI Admin Panel - System Design

## Overview

The Vidhik AI Admin Panel is a comprehensive, centralized dashboard designed for super administrators. It provides full control over the platform's ecosystem, bridging the Client application, Lawyer application, and the public-facing Landing Page. The panel allows for real-time configuration changes, user moderation, financial approvals, and support ticket management.

---

## Core Features & Capabilities

### 1. Unified Dashboard & Analytics
Provides a high-level operational overview at a glance.
- **Key Metrics**: Tracks Total Users, Pending Lawyer Approvals, Active Live Consultations, Unresolved Support Tickets, total Client Documents generated, and overall System Status.

### 2. Dynamic Configuration Management
A powerful JSON-based editor that allows admins to update platform content and limits without requiring a code deployment.
- **Landing Page Controls**: Customize Hero sections, How It Works steps, Core Features, Pricing Plans, Contact Information, and FAQs.
- **User Module Limits**: Toggle active status and set limits for the AI Document Generator, Document Review file sizes, and AI Legal Assistant daily quotas.
- **Lawyer Module Settings**: Manage Lawyer dashboard announcements, blog post limits, minimum appointment notice hours, minimum payout amounts, and TDS (commission) percentages.

### 3. Comprehensive User Management
- **Master User Directory**: A searchable table of all registered users (clients and lawyers).
- **Deep-Dive Profiles**: View a user's associated cases, generated legal documents, and current subscription plan in a detailed modal.
- **Subscription Overrides**: Manually upgrade, downgrade, or extend user subscription plans.
- **Verification Bypassing**: Ability to manually verify user emails if they face issues with standard OTP/link verification.

### 4. Lawyer Onboarding & Moderation
- **Approval Queue**: Dedicated view for new lawyer registrations.
- **Credential Review**: Evaluate lawyer specializations, credentials, and approve or reject their profiles to maintain platform quality.

### 5. Case & Financial Administration
- **Milestone Payout Approvals**: Manage escrow/payouts for legal cases. When a lawyer completes a milestone, admins review and explicitly approve or reject the payout.
- **Consultation Oversight**: Monitor all booked and active live consultations (video/audio) between clients and lawyers.

### 6. Support & Operations
- **Ticketing System**: Centralized inbox for all user support tickets. Admins can read user queries, reply directly, and update the ticket status (e.g., to "Closed").
- **Document Audit Trail**: Global view of all AI-generated legal documents to monitor usage and system performance.

---

## Architecture & Technical Stack

### Frontend (Client-side)
- **Component Entry Point**: `client/src/pages/admin/AdminSettings.tsx`
- **Routing**: Handled by React Router on `/admin` and `/admin/:tab`. Protected client-side by the `<AdminProtectedRoute>` wrapper.
- **UI/UX**: Built with React, styled using Tailwind CSS, and heavily utilizes `lucide-react` for iconography to create a clean, modern, and professional aesthetic.
- **State Management**: Relies on React hooks (`useState`, `useEffect`) to handle complex JSON configuration editing, modal states, and data fetching via the `adminService`.

### Backend (Server-side)
- **Routes**: `server/routes/adminRoutes.ts`
- **Controllers**: `server/controllers/adminController.ts`
- **Security Middlewares**: Every admin route uses `protect` (JWT validation) and `adminOnly` (RBAC role verification) to ensure strict access control.
- **Database Entities (MongoDB)**:
  - `SystemConfig`: Stores the dynamic configurations.
  - `User`: Handles all role-based accounts.
  - `Case` & `LiveConsultation`: Manages legal matters and appointments.
  - `SupportTicket` & `DocumentModel`: Handles operations and audits.

---

## Security Model
- **Strict Role-Based Access Control (RBAC)**: Both the UI and API layer enforce that only users with the `admin` role can view the dashboard or trigger controller actions.
- **Data Isolation**: While admins can see metadata (like document titles and statuses), the architecture ensures they can facilitate support without compromising deep sensitive content unless explicitly built into the audit views.
