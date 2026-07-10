import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import Dashboard from './pages/Dashboard'
import NotificationsPage from './pages/NotificationsPage'
import DocumentGeneratorPage from './pages/documents/DocumentGeneratorPage'
import DocumentGenerationPage from './pages/documents/DocumentGenerationPage'
import EmploymentAgreement from './pages/documents/EmploymentAgreement'
import ConsultantAgreement from './pages/documents/ConsultantAgreement'
import NDAAgreement from './pages/documents/ip/NDAAgreement'
import OfferLetterAgreement from './pages/documents/employment/OfferLetterAgreement'
import ShareSubscriptionAgreement from './pages/documents/corporate/ShareSubscriptionAgreement'
import BoardResolutionAgreement from './pages/documents/corporate/BoardResolutionAgreement'
import MOAAgreement from './pages/documents/corporate/MOAAgreement'
import ArticlesOfAssociationAgreement from './pages/documents/corporate/ArticlesOfAssociationAgreement'
import ShareholderResolutionAgreement from './pages/documents/corporate/ShareholderResolutionAgreement'
import NoticeBoardMeetingAgreement from './pages/documents/corporate/NoticeBoardMeetingAgreement'
import CopyrightAssignmentAgreement from './pages/documents/ip/CopyrightAssignmentAgreement'
import MinutesBoardMeetingAgreement from './pages/documents/corporate/MinutesBoardMeetingAgreement'
import DirectorAppointmentAgreement from './pages/documents/corporate/DirectorAppointmentAgreement'
import DirectorResignationAgreement from './pages/documents/corporate/DirectorResignationAgreement'
import CorporateAuthorizationLetterAgreement from './pages/documents/corporate/CorporateAuthorizationLetterAgreement'
import PowerOfAttorneyCorporateAgreement from './pages/documents/corporate/PowerOfAttorneyCorporateAgreement'
import ConvertibleNoteAgreement from './pages/documents/corporate/ConvertibleNoteAgreement'
import ESOPPlanAgreement from './pages/documents/corporate/ESOPPlanAgreement'
import DynamicDocumentGenerator from './pages/documents/DynamicDocumentGenerator'


import ServiceAgreement from './pages/documents/commercial/ServiceAgreement'
import MSAAgreement from './pages/documents/commercial/MSAAgreement'
import CommercialLeaseAgreement from './pages/documents/realestate/CommercialLeaseAgreement'
import ResidentialLeaseAgreement from './pages/documents/realestate/ResidentialLeaseAgreement'
import DocumentHub from './pages/documents/DocumentHub'
import MyDocuments from './pages/documents/MyDocuments'
import DocumentReviewPage from './pages/documents/DocumentReviewPage'
import LegalResearchPage from './pages/research/LegalResearchPage'
import AILawyerList from './pages/AILawyerList'
import LawyerProfile from './pages/LawyerProfile'
import LawyerBooking from './pages/LawyerBooking'
import LawyerBookingSuccess from './pages/LawyerBookingSuccess'
import BillingPlans from './pages/BillingPlans'
import BillingCheckout from './pages/BillingCheckout'
import SettingsPage from './pages/SettingsPage'
import AdminSettings from './pages/admin/AdminSettings'
import CasesPage from './pages/CasesPage'
import AdminProtectedRoute from './components/auth/AdminProtectedRoute'
import ConsultationMeeting from './pages/ConsultationMeeting'
import ConsultationsPage from './pages/ConsultationsPage'
import ConsultationRoom from './pages/ConsultationRoom'

function App() {
    return (
        <BrowserRouter basename="/user">
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/document-generator" element={<DocumentGeneratorPage />} />
                <Route path="/document/create" element={<DocumentGenerationPage />} />

                {/* Document Hub - Browse all document types */}
                <Route path="/documents" element={<DocumentHub />} />
                <Route path="/documents/hub" element={<DocumentHub />} />
                <Route path="/documents/workspace" element={<MyDocuments />} />
                <Route path="/documents/review" element={<DocumentReviewPage />} />
                <Route path="/workspace" element={<MyDocuments />} />

                {/* Specific Document Generators */}
                <Route path="/documents/employment-contract-generator" element={<EmploymentAgreement />} />
                <Route path="/documents/employment-contract" element={<EmploymentAgreement />} />
                <Route path="/document/employment-contract" element={<EmploymentAgreement />} />
                <Route path="/documents/consultant-agreement" element={<ConsultantAgreement />} />
                <Route path="/documents/nda" element={<NDAAgreement />} />
                <Route path="/documents/offer-letter" element={<OfferLetterAgreement />} />
                <Route path="/documents/share-subscription" element={<ShareSubscriptionAgreement />} />
                <Route path="/documents/board-resolution" element={<BoardResolutionAgreement />} />
                <Route path="/documents/moa" element={<MOAAgreement />} />
                <Route path="/documents/aoa" element={<ArticlesOfAssociationAgreement />} />
                <Route path="/documents/shareholder-resolution" element={<ShareholderResolutionAgreement />} />
                <Route path="/documents/notice-board-meeting" element={<NoticeBoardMeetingAgreement />} />
                <Route path="/documents/copyright-assignment" element={<CopyrightAssignmentAgreement />} />
                <Route path="/documents/minutes-board-meeting" element={<MinutesBoardMeetingAgreement />} />
                <Route path="/documents/director-appointment" element={<DirectorAppointmentAgreement />} />
                <Route path="/documents/director-resignation" element={<DirectorResignationAgreement />} />
                <Route path="/documents/corporate-authorization-letter" element={<CorporateAuthorizationLetterAgreement />} />
                <Route path="/documents/power-of-attorney-corporate" element={<PowerOfAttorneyCorporateAgreement />} />
                <Route path="/documents/convertible-note" element={<ConvertibleNoteAgreement />} />
                <Route path="/documents/esop-plan" element={<ESOPPlanAgreement />} />
                <Route path="/documents/generate/:docId" element={<DynamicDocumentGenerator />} />


                <Route path="/documents/service-agreement" element={<ServiceAgreement />} />
                <Route path="/documents/msa" element={<MSAAgreement />} />
                <Route path="/documents/commercial-lease" element={<CommercialLeaseAgreement />} />
                <Route path="/documents/residential-lease" element={<ResidentialLeaseAgreement />} />
                <Route path="/research" element={<LegalResearchPage />} />
                <Route path="/lawyers" element={<AILawyerList />} />
                <Route path="/lawyers/:id" element={<LawyerProfile />} />
                <Route path="/lawyers/booking/:id" element={<LawyerBooking />} />
                <Route path="/lawyers/booking-success" element={<LawyerBookingSuccess />} />
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/cases/:id/meet" element={<ConsultationMeeting />} />
                <Route path="/consultations" element={<ConsultationsPage />} />
                <Route path="/consultations/:id/meet" element={<ConsultationRoom />} />
                <Route path="/billing" element={<BillingPlans />} />
                <Route path="/billing/checkout" element={<BillingCheckout />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={
                    <AdminProtectedRoute>
                        <AdminSettings />
                    </AdminProtectedRoute>
                } />
                <Route path="/admin/:tab" element={
                    <AdminProtectedRoute>
                        <AdminSettings />
                    </AdminProtectedRoute>
                } />
                
            </Routes>
            <Toaster position="top-center" />
        </BrowserRouter>
    )
}

export default App
