import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { MSAForm } from './MSAForm';

export default function MSAAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        partyAName: 'CloudScale Solutions LLP',
        partyAAddress: 'No. 12, HSR Layout, Sector 7, Bangalore, Karnataka 560102',
        partyAType: 'LLP',
        partyAID: 'AAA-1234-LLP / GSTIN: 29AABCC1234D1Z5',
        partyBName: 'NexGen Robotics Technologies Pvt Ltd',
        partyBAddress: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
        partyBType: 'Company',
        partyBID: 'U72900KA2023PTC198273',
        effectiveDate: today,
        initialTerm: '36 Months',
        renewalTerms: 'Automatic 12-month renewal unless noticed 60 days prior',
        sowMechanism: 'Individual Statements of Work (SOWs) for each project/engagement',
        serviceCategories: 'Cloud Engineering, DevOps Automation, Security Audits, and SRE Services',
        billingCycle: 'Monthly Net-15',
        lateInterestRate: '18% Per Annum',
        liabilityCap: '100% of the fees paid by Client in the 12 months preceding the claim',
        confidentialityTerm: '5 Years post termination',
        terminationNotice: '60 Days written notice for convenience',
        nonSolicitationPeriod: '24 Months post termination',
        governingLaw: 'India',
        jurisdiction: 'Bangalore, Karnataka'
    };

    const sidebarTips = [
        { title: "Framework Nature", content: "An MSA defines 'how' you do business together, while SOWs define 'what' work is done. This prevents renegotiating legal terms for every project." },
        { title: "SOW Precedence", content: "Ensure the MSA states that if an SOW conflicts with the MSA, the MSA terms prevail unless the SOW explicitly states otherwise." },
        { title: "IP Strategy", content: "Usually, Background IP stays with the owner, and Foreground IP (created under SOWs) is transferred to the Client upon full payment." },
        { title: "Governance", content: "For long-term contracts, include a governance clause (Steering Committee) to resolve operational issues before they become legal disputes." }
    ];

    return (
        <DocumentBaseGenerator
            title="Master Service Agreement (MSA)"
            description="A foundational framework agreement for long-term B2B service relationships and recurring projects."
            documentType="msa"
            initialFormData={initialFormData}
            docxFilename="master-service-agreement.docx"
            sidebarDescription="Establish a robust legal foundation for ongoing B2B engagements using a Master Service Agreement (MSA)."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <MSAForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
