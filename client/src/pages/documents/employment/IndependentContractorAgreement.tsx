import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import IndependentContractorForm from './IndependentContractorForm';

export default function IndependentContractorAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_date: today,
        client_name: 'Alpha Software Solutions Private Limited',
        client_type: 'Private Limited',
        client_address: '7th Floor, Innovation Tower, IT Tech Park, Electronic City, Bangalore, Karnataka 560100',
        contractor_name: 'Vikas Patel',
        contractor_type: 'Individual',
        contractor_address: 'Flat 403, Residency Heights, Whitefield Main Road, Bangalore, Karnataka 560066',
        contractor_registration_details: 'PAN: BPPXP1234F, GSTIN: 29BPPXP1234F1Z5',
        engagement_type: 'Technology Services',
        effective_date: today,
        commencement_date: today,
        expiry_date: '2027-01-31',
        renewal_terms: 'This agreement may be renewed for successive 6-month periods by mutual written consent at least 30 days prior to expiry.',
        scope_of_services: 'End-to-end cloud infrastructure optimization and architectural redesign of the core enterprise dashboard application. Migration of legacy SQL databases to scalable AWS architectures.',
        deliverables: '1. Complete AWS cloud architecture design schematic.\n2. Finalized cloud migration codebase in GitHub.\n3. Detailed optimization performance benchmark report.',
        milestones: 'Milestone 1: Architecture Blueprint (Month 2) - 30%\nMilestone 2: Database Migration (Month 4) - 40%\nMilestone 3: Performance Benchmarking (Month 6) - 30%',
        acceptance_criteria: 'All deliverables must pass strict security checks, load-testing benchmarks, and be approved in writing by the Client Chief Technology Officer.',
        fee_structure: 'Fixed Project Fee model',
        payment_schedule: '30% upon blueprint sign-off, 40% upon database migration approval, and 30% upon final bench-marking delivery.',
        reimbursement_policy: 'Pre-approved travel, lodging, and out-of-pocket expenses shall be reimbursed at cost within 15 days of invoice validation.',
        gst_applicable: true,
        gst_registration_number: '29BPPXP1234F1Z5',
        tax_responsibility: 'Contractor is solely responsible for all income taxes, professional taxes, and GST compliance. Client will deduct TDS at 10% under Section 194J.',
        client_obligations: 'Provide access to AWS staging console, cloud repositories, and engineering documentation within 3 days of signing.',
        contractor_obligations: 'Ensure all services are performed to industry standards. Maintain adequate backup tools and deliver reports on a weekly basis.',
        intellectual_property_clause: 'Absolute and unconditional assignment of all work product, scripts, database schemas, and documentation to the Client.',
        confidentiality_clause: 'Contractor shall protect and maintain the strict confidentiality of all proprietary source code and client databases shared during the project.',
        data_processing: 'All personal data processed under this agreement shall comply with the Digital Personal Data Protection Act, 2023.',
        non_solicitation: 'Neither party shall solicit or hire employees of the other party during the term and for 12 months post-termination.',
        non_compete: 'Contractor shall not perform similar database migration services for direct cloud competitor entities during the term of this engagement.',
        insurance_requirements: 'Contractor shall maintain professional indemnity insurance covering up to INR 10,00,000.',
        limitation_of_liability: 'The total liability of either party for any claims under this agreement shall be capped at the total professional fees paid to the contractor.',
        indemnity_clause: 'Contractor agrees to indemnify and hold harmless the Client against any third-party claims arising from intellectual property infringement or gross negligence.',
        termination_conditions: 'Either party may terminate for convenience with 30 days written notice, or immediately for material breach that remains uncured for 10 days.',
        notice_period: '30 Days written notice',
        force_majeure: 'Neither party shall be liable for delays caused by acts of God, war, government regulations, or pandemics.',
        governing_law: 'Laws of India',
        dispute_resolution: 'Arbitration in Bangalore under the Arbitration and Conciliation Act, 1996 by a sole arbitrator.',
        electronic_execution: true,
        authorized_signatories: 'Client Signatory: Mr. Rajeev Mehta (Managing Director)\nContractor Signatory: Vikas Patel',
        witness_details: 'Witness 1: Mr. Suresh Kumar, Bangalore\nWitness 2: Ms. Ananya Sen, Bangalore',
        execution_place: 'Bangalore',
        execution_date: today,
        additional_conditions: 'This agreement constitutes the entire understanding between the parties and overrides any prior proposals.'
    };

    const requiredFields = [
        'agreement_date',
        'client_name',
        'client_type',
        'client_address',
        'contractor_name',
        'contractor_type',
        'contractor_address',
        'engagement_type',
        'effective_date',
        'commencement_date',
        'expiry_date',
        'scope_of_services',
        'deliverables',
        'acceptance_criteria',
        'fee_structure',
        'payment_schedule',
        'tax_responsibility',
        'client_obligations',
        'contractor_obligations',
        'intellectual_property_clause',
        'confidentiality_clause',
        'limitation_of_liability',
        'indemnity_clause',
        'termination_conditions',
        'notice_period',
        'force_majeure',
        'governing_law',
        'dispute_resolution',
        'authorized_signatories',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Independent Contractor Status",
            content: "Draft rules to prevent the contractor from being misclassified as an employee under central or state labour laws. Maintain project-based billing timelines."
        },
        {
            title: "TDS Deductions",
            content: "Ensure correct TDS withholding allocations are referenced. Typically, 10% is deducted for professional services under Section 194J of the Income Tax Act."
        },
        {
            title: "Intellectual Property vesting",
            content: "Clearly transfer ownership of any scripts, cloud schematics, and migrating codebase to the client immediately upon completion."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Independent Contractor Agreement"
            description="Generate a professional Independent Contractor Agreement establishing specialized service terms under the Indian Contract Act."
            documentType="independent-contractor"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a legally compliant Independent Contractor Agreement for specialized commercial services."
            docxFilename="Independent_Contractor_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <IndependentContractorForm
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
