import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { NDAForm } from './NDAForm';

export default function NDAAgreement() {
    const initialFormData = {
        disclosingPartyName: 'Quantum AI Systems Pvt Ltd',
        disclosingPartyAddress: 'Suite 201, T-Hub 2.0, Knowledge City, Hyderabad, Telangana 500081',
        receivingPartyName: 'BuildFast Ventures LLP',
        receivingPartyAddress: '7th Floor, WeWork Galaxy, Residency Road, Bangalore, Karnataka 560001',
        ndaType: 'Unilateral',
        purpose: 'Evaluation of potential investment and strategic partnership including integration of Quantum AI\'s proprietary LLM stack.',
        effectiveDate: new Date().toISOString().split('T')[0],
        duration: '5 Years from the date of disclosure',
        confidentialityScope: 'Proprietary AI architectures, training datasets, financial models, cap table details, and strategic product roadmaps.',
        exceptions: 'Standard legal exceptions including information already in public domain, independently developed, or required by law.',
        governingLaw: 'Laws of India',
        jurisdiction: 'Hyderabad, Telangana',
        liquidatedDamages: '₹50,00,000 (Rupees Fifty Lakhs) per proven material breach',
        injunctiveRelief: 'Yes'
    };

    const sidebarTips = [
        { title: "Mutual vs Unilateral", content: "Use a Mutual NDA if both parties will be sharing sensitive data. Otherwise, a Unilateral (one-way) NDA is standard." },
        { title: "Specific Purpose", content: "Courts favor NDAs where the purpose of disclosure is clearly defined (e.g., 'Merger Discussion' vs 'General Business')." },
        { title: "Survival Clause", content: "Confidentiality obligations should typically survive the agreement for 2-5 years." },
        { title: "Injunctive Relief", content: "Always include the right to seek an injunction, as monetary damages are often insufficient for data leaks." }
    ];

    return (
        <DocumentBaseGenerator
            title="Non-Disclosure Agreement (NDA)"
            description="Protect your proprietary information and trade secrets before sharing with third parties"
            documentType="nda"
            initialFormData={initialFormData}
            docxFilename="non-disclosure-agreement.docx"
            sidebarDescription="An NDA is the first line of defense in any business discussion. It ensures that your shared ideas remain your property."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <NDAForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
