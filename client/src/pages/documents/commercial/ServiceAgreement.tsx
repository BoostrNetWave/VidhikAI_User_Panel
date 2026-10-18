import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { ServiceAgreementForm } from './ServiceAgreementForm';

export default function ServiceAgreement() {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expiryDate = nextYear.toISOString().split('T')[0];

    const initialFormData = {
        providerName: 'CloudScale Solutions LLP',
        providerAddress: 'No. 12, HSR Layout, Sector 7, Bangalore, Karnataka 560102',
        providerType: 'LLP',
        providerID: 'AAA-1234-LLP / GSTIN: 29AABCC1234D1Z5',
        clientName: 'NexGen Robotics Technologies Pvt Ltd',
        clientAddress: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
        clientType: 'Company',
        clientID: 'U72900KA2023PTC198273',
        effectiveDate: today,
        expiryDate: expiryDate,
        servicesDescription: 'Comprehensive Cloud Infrastructure Management, DevOps Automation, and 24/7 Site Reliability Engineering (SRE) support.',
        milestones: 'Infrastructure Audit (Month 1), Migration to Kubernetes (Month 3), Auto-scaling Optimization (Month 6)',
        fees: 'INR 2,50,000 per month (exclusive of taxes)',
        paymentTerms: 'Payment within 15 days of invoice date',
        latePaymentPenalty: '1.5% interest per month for delayed payments',
        ipOwnership: 'Client',
        confidentialityPeriod: '3 Years from termination',
        terminationNotice: '30 Days written notice',
        governingLaw: 'India',
        jurisdiction: 'Bangalore, Karnataka'
    };

    const sidebarTips = [
        { title: "Scope Clarity", content: "Ensure 'Services' are described in detail or refer to an Annexure to avoid 'scope creep' during the project." },
        { title: "Payment Terms", content: "Clearly define the billing cycle (Monthly/Milestone-based) and the grace period for payments." },
        { title: "IP Ownership", content: "For B2B services, the Client usually owns the deliverables (Work for Hire), but the Provider may retain rights to its pre-existing tools." },
        { title: "Termination", content: "Include a notice period that allows both parties enough time to transition or find alternatives if the relationship ends." }
    ];

    return (
        <DocumentBaseGenerator
            title="B2B Service Agreement"
            description="Professional Master Service Agreement (MSA) for B2B engagements, IT services, or consulting."
            documentType="service-agreement"
            initialFormData={initialFormData}
            docxFilename="service-agreement.docx"
            sidebarDescription="Generate legally robust B2B service contracts with clear commercial terms, IP protection, and liability limits."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ServiceAgreementForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
