import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import PatentAssignmentForm from './PatentAssignmentForm';

export default function PatentAssignmentAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_number: 'PAT-ASSIGN/2026/089',
        effective_date: today,
        commercial_purpose: 'Complete legal assignment and transfer of patent rights, patent application No. 202441056789 (AI-based Quantum Encryption Protocol), and associated technical know-how from lead inventor/researcher to BioQuantum Technologies Pvt. Ltd.',
        assignor: 'Dr. Vikramaditya Sharma, an individual inventor and scientist residing at 45, Tech Innovation Enclave, Phase 2, Whitefield, Bangalore, Karnataka 560066, India',
        assignee: 'BioQuantum Technologies Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Plot 12, Electronic City Phase 1, Bangalore, Karnataka 560100, India',
        authorized_representatives: 'Assignor: Dr. Vikramaditya Sharma; Assignee: Ms. Ananya Roy (Chief Executive Officer)',
        patent_title: 'System and Method for Quantum-Resistant Hybrid Cryptographic Key Generation in Autonomous Networks',
        patent_numbers: 'Indian Patent Grant No. 412985 (Granted on 14th March 2025)',
        patent_application_numbers: 'Indian Patent Application No. 202441056789 (Filing Date: 12th January 2024); PCT Application No. PCT/IN2024/050123',
        inventor_details: 'Dr. Vikramaditya Sharma (Lead Inventor, 80% contribution) and Dr. Neha Deshmukh (Co-Inventor, 20% contribution)',
        filing_dates: '12th January 2024 (Priority Filing), 10th November 2024 (International PCT Filing)',
        priority_dates: '12th January 2024 (Indian Patent Application No. 202441056789)',
        grant_dates: '14th March 2025 (Patent Grant No. 412985)',
        jurisdictions: 'India, United States (USPTO), European Patent Office (EPO), and Japan (JPO)',
        technology_field: 'Quantum Cryptography, Cybersecurity, Artificial Intelligence, and Embedded Network Security',
        assigned_patent_rights: 'Full and complete legal ownership, title, interest, patent claims, priority rights, continuation rights, divisional application rights, continuations-in-part, foreign counterparts, right to register Form 16 in Patent Office, right to collect past damages, and right to prosecute patent claims globally.',
        patent_family_details: 'Includes Indian Patent Grant No. 412985, US Patent Application No. 18/554,321, EP Patent Application No. 2481234.5, and all future divisional, continuation, and continuation-in-part filings arising therefrom.',
        associated_know_how: 'Complete mathematical proofs, cryptographic algorithm source code (v3.4), hardware interface specs, FPGA implementation firmware, laboratory test logs, and security benchmark test suites.',
        technical_documentation: 'System Architecture Document (v2.1), Cryptographic Key Exchange Whitepaper, Laboratory Notebooks (Vol I-IV), FPGA Synthesis Scripts, and Security Audit Certification Reports.',
        assignment_scope: 'Absolute, irrevocable, perpetual, worldwide, and unencumbered transfer of all patent rights, patent applications, and associated intellectual property.',
        commercialization_rights: 'Exclusive and unrestricted right to manufacture, use, offer for sale, sell, import, license, sub-license, distribute, and commercialize the patented invention globally.',
        enforcement_rights: 'Sole and exclusive right to enforce patent claims, initiate infringement suits, defend patent validity challenges, collect past and future royalties, and retain damages awarded in any judicial forum.',
        registration_rights: 'Right to record this assignment deed with the Indian Patent Office under Section 68 & 69 of the Patents Act, 1970 (Form 16) and foreign Patent Offices.',
        territory: 'Worldwide / All countries and jurisdictions',
        effective_assignment_date: today,
        consideration: 'A fixed lump sum consideration of INR 25,00,000 (Rupees Twenty-Five Lakhs Only) plus a 2% net sales royalty on commercial product deployments payable quarterly.',
        representations_and_warranties: 'The Assignor represents and warrants that he is the rightful owner/co-inventor, the patent rights are free from any pledge, mortgage, lien, or prior license, no third-party litigation is pending, and all information supplied to the Patent Office is accurate and complete.',
        further_assurances: 'The Assignor covenants to execute Form 16 under Patents Rules, 2003, sign power of attorney for patent attorneys, testify in patent opposition/litigation proceedings, and execute foreign assignment instruments upon request.',
        confidentiality_clause: 'Both parties agree to maintain strict confidentiality regarding technical know-how, unfiled patent claims, proprietary code, and commercial consideration terms.',
        indemnity_clause: 'The Assignor agrees to indemnify the Assignee against any claims or losses arising from breach of inventorship warranties or undisclosed prior assignments.',
        limitation_of_liability: 'The total aggregate liability of the Assignor under this agreement shall not exceed the total consideration amount actually received by the Assignor.',
        termination_clause: 'This agreement constitutes a permanent and absolute assignment of patent rights and cannot be revoked or terminated post-execution.',
        post_termination_provisions: 'Surviving obligations include confidentiality, further assurances, indemnity, and dispute resolution covenants.',
        notice_details: 'Assignor: vikram.sharma@innovationlab.org, 45 Whitefield, Bangalore; Assignee: legal@bioquantumtech.com, Plot 12, Electronic City, Bangalore.',
        governing_law: 'Laws of India (including Patents Act, 1970 & Indian Contract Act, 1872)',
        dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed.',
        arbitration_details: 'Seat and venue of arbitration at Bangalore, proceedings conducted in English language.',
        jurisdiction: 'Courts at Bangalore, Karnataka, India',
        miscellaneous_clauses: 'Entire Agreement, Amendments in writing only, Severability, Counterparts, and Electronic Signatures validity under IT Act, 2000.',
        employee_invention: false,
        university_research: true,
        startup_investment: true,
        patent_family: true,
        technology_transfer: true,
        joint_ownership: false,
        cross_border_assignment: true,
        witnesses: '1. Dr. Rajesh Verma, Senior Scientist; 2. Ms. Priya Menon, Legal Associate',
        authorized_signatories: 'Assignor: Dr. Vikramaditya Sharma; Assignee: Ms. Ananya Roy (CEO)',
        execution_place: 'Bangalore',
        execution_date: today,
        annexures: 'Annexure A: Schedule of Patents & Applications; Annexure B: Technical Documentation List; Annexure C: Form 16 Assignment Deed Format.'
    };

    const requiredFields = [
        'effective_date',
        'commercial_purpose',
        'assignor',
        'assignee',
        'authorized_representatives',
        'patent_title',
        'patent_numbers',
        'patent_application_numbers',
        'inventor_details',
        'filing_dates',
        'jurisdictions',
        'technology_field',
        'assigned_patent_rights',
        'assignment_scope',
        'commercialization_rights',
        'enforcement_rights',
        'registration_rights',
        'territory',
        'effective_assignment_date',
        'consideration',
        'representations_and_warranties',
        'further_assurances',
        'notice_details',
        'governing_law',
        'dispute_resolution',
        'jurisdiction',
        'miscellaneous_clauses',
        'authorized_signatories',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Section 68 & 69 Requirements",
            content: "Under Section 68 of the Patents Act, 1970, an assignment of a patent or patent application is valid only if it is in writing and registered with the Patent Office using Form 16."
        },
        {
            title: "Right to Prosecute & Divisionals",
            content: "Ensure the assignment deed explicitly covers pending applications, future continuation filings, divisional applications, PCT international phases, and foreign counterparts."
        },
        {
            title: "Inventorship Declarations",
            content: "Check that all co-inventors execute the assignment deed or provide written consent to prevent future inventorship disputes or patent invalidation challenges."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Patent Assignment Agreement"
            description="Generate a legally compliant Patent Assignment Agreement transferring ownership of patent rights, patent applications, inventions, and technical know-how under the Patents Act, 1970."
            documentType="patent-assignment"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="Drafted in accordance with the Patents Act 1970, Patents Rules 2003, and Indian Contract Act 1872."
            docxFilename="Patent_Assignment_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <PatentAssignmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                    errors={validationErrors}
                />
            )}
        />
    );
}
