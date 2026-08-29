# Vidhik AI - Architecture & System Workflow

## 1. High-Level Architecture Overview
The Vidhik AI platform follows a modern, decoupled Client-Server architecture.

- **Frontend (Client):** A Single Page Application (SPA) built with React 18, Vite, and Tailwind CSS. It communicates with the backend via RESTful APIs.
- **Backend (Server):** A Node.js/Express server (TypeScript) providing API endpoints, integrating with MongoDB, and handling business logic, AI integrations (OpenAI/Gemini), and document generation.
- **Database:** MongoDB (via Mongoose) for flexible, document-based data storage (Users, Cases, Configs, Tickets).

## 2. Directory Structure & Roles
### Client (`/client`)
- `/src/components`: Reusable UI building blocks (buttons, inputs, modals).
- `/src/layout`: Structural components wrapping pages (Sidebar, Navbar).
- `/src/pages`: Route-level components representing distinct views (Dashboard, Cases, Auth).
- `/src/services`: API client wrappers (Axios instances) handling network requests to the server.
- `/src/lib`: Utility functions, formatters, and shared helpers.

### Server (`/server`)
- `/routes`: Express route definitions mapping URLs to controllers.
- `/controllers`: Business logic for handling requests and formatting responses.
- `/models`: Mongoose schemas defining data structures.
- `/middleware`: Request interceptors (Authentication, Role Checking, Error Handling).

## 3. Core Application Workflows

### 3.1 Authentication & Authorization Flow
1. **Login/Registration:** User submits credentials via the frontend Auth pages.
2. **API Request:** Sent to `/api/auth/login` or `/api/auth/register`.
3. **Verification (Backend):** Server validates credentials against MongoDB (using bcrypt for passwords).
4. **Token Generation:** Server issues a JWT (JSON Web Token) and sends it back (either in an HTTP-only cookie or response body).
5. **State Update (Frontend):** Frontend stores the token/user data in Context or global state.
6. **Routing:** User is redirected to their respective Dashboard based on their role (Client vs. Admin vs. Lawyer).
7. **Protected Routes:** Subsequent API calls include the JWT in the `Authorization: Bearer <token>` header.

### 3.2 AI Document Generation Flow (`/pages/documents`)
1. **Template Selection:** User selects a document type (e.g., `ConsultantAgreement.tsx`) from the `DocumentHub`.
2. **Data Entry:** User fills out a multi-step form detailing the specifics of the agreement.
3. **Submission:** Form data is sent to the backend document generation endpoint.
4. **AI Processing:** The backend constructs a prompt using the provided data and sends it to the integrated LLM (e.g., OpenAI/Gemini API).
5. **Formatting:** The LLM's raw output is parsed, formatted into a structured document (PDF/DOCX using libraries like `jspdf` or `docx`).
6. **Delivery:** The generated file URL or binary stream is returned to the frontend.
7. **UI Update:** The frontend presents a "Success" screen allowing the user to preview, download, or save the document to their case file.

### 3.3 Legal Research Workflow (`/pages/research`)
1. **Query Input:** User types a legal question or scenario into the search bar.
2. **API Request:** Query is sent to the backend research endpoint.
3. **Vector/Semantic Search (Backend):** The backend queries an AI model or a vector database containing legal precedents and statutes.
4. **Response Aggregation:** The backend compiles the most relevant findings, summaries, and citations.
5. **Display:** Frontend renders the results in an expandable, readable list format.

### 3.4 Lawyer Booking & Consultation Flow
1. **Browsing:** User views `AILawyerList.tsx` (fetches active lawyers from backend).
2. **Profile View:** User clicks a lawyer to view details, ratings, and availability (`LawyerProfile.tsx`).
3. **Scheduling:** User selects a time slot in `LawyerBooking.tsx`.
4. **Payment/Confirmation:** User proceeds to checkout (`BillingCheckout.tsx`). Once payment is verified, the backend creates a `Consultation` record.
5. **Meeting:** At the scheduled time, both parties join the `ConsultationMeeting.tsx` / `ConsultationRoom.tsx`, which interfaces with WebRTC or a third-party video SDK.

### 3.5 Admin Control Flow (`/pages/admin`)
1. **Access:** Only users with `role === 'admin'` can access the Admin Layout.
2. **Configuration Editing:** Admin edits system limits or UI text.
3. **Save:** Frontend sends updated JSON payload to the backend config endpoint.
4. **Propagation:** Backend updates the `SystemConfig` in MongoDB. Next time the application loads, or via a live-refresh context, the new settings are applied globally.

## 4. State Management & Data Fetching
- **Local State:** `useState` and `useReducer` for component-level UI state (toggles, form inputs, modal visibility).
- **Data Fetching:** Standard React hooks (`useEffect`) coupled with Axios, or potentially React Query for caching, background refetching, and complex data synchronization.
- **Global State:** React Context API used for widespread data like current User Profile, Authentication Status, and global UI theme/settings.
