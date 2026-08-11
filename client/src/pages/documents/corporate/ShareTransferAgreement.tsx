import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ShareTransferForm from './ShareTransferForm';

export default function ShareTransferAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'StellarAI Technologies Private Limited',
        company_type: 'Private Limited',
        cin: 'U72200KA2023PTC987654',
        registered_office: 'Level 5, Sector 6, HSR Layout, Bangalore, Karnataka 560102',
        agreement_date: today,
        transferor_name: 'Aditya Sharma',
        transferor_address: 'Flat 402, Oakwood Apartments, Jayanagar, Bangalore 560041',
        transferee_name: 'Nexus Ventures LLP',
        transferee_address: '22nd Floor, Nariman Point, Mumbai, Maharashtra 400021',
        company_party: true,
        share_class: 'Equity Shares',
        share_certificate_numbers: 'SEC-0982-ST',
        distinctive_numbers: '10,001 to 20,000',
        number_of_shares: '10,000',
        face_value: 'INR 10',
        paid_up_status: 'Fully Paid-Up',
        purchase_consideration: '15,00,000',
        currency: 'INR',
        payment_method: 'RTGS Bank Transfer',
        payment_schedule: 'The aggregate Purchase Consideration of INR 15,00,000 shall be paid in full by the Transferee to the Transferor on the Closing Date.',
        taxes: 'The Transferor shall be solely responsible for any capital gains tax liabilities arising from the transfer of shares.',
        stamp_duty_responsibility: 'The Transferee shall bear the stamp duty charges (0.015% of the purchase consideration) required for the execution of Form SH-4.',
        conditions_precedent: '1. Approval of the Board of Directors of the Company for the transfer.\n2. Waiver of Right of First Refusal (ROFR) by other shareholders.\n3. Executed share transfer form (Form SH-4).',
        closing_date: today,
        closing_deliverables: '1. Original Share Certificate.\n2. Executed Form SH-4.\n3. Resignation letter of Transferor from Board (if applicable).',
        representations_transferor: '1. Transferor is the sole legal and beneficial owner of the shares.\n2. Shares are free from any liens, charges, pledges, or encumbrances.\n3. Transferor has full power and authority to sell the shares.',
        representations_transferee: '1. Transferee has corporate power and authority to enter into this Agreement.\n2. Execution does not violate any material contracts or laws.',
        representations_company: '1. Company is validly incorporated and in good standing.\n2. Board has approved the transfer subject to execution.',
        pre_closing_covenants: '1. Transferor shall not sell, pledge, or encumber the shares pre-closing.\n2. Company shall not issue any new shares pre-closing.',
        post_closing_covenants: '1. Company shall update its Register of Members within 15 days of Closing.\n2. Company shall issue fresh share certificates or endorse existing ones.',
        indemnity_required: true,
        confidentiality_required: true,
        termination_conditions: 'This Agreement may be terminated by mutual written consent or if closing has not occurred within thirty (30) days of execution.',
        governing_law: 'Laws of India',
        dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 in Bangalore by a sole arbitrator appointed by the Company.',
        startup: true,
        private_company: true,
        listed_company: false,
        foreign_investor: false,
        employee_shares: false,
        promoter_shares: true,
        drag_tag_rights: 'Tag-Along rights apply to the transfer in accordance with the Shareholders Agreement.',
        aoa_restrictions: 'Transfer is subject to AOA restrictions and approval of the Board.',
        shareholders_agreement_reference: 'Shareholders Agreement dated June 15, 2024',
        authorized_signatories: 'Transferor: Aditya Sharma\nTransferee: Mr. Rajesh Mehta (Partner, Nexus Ventures)\nCompany: Mr. Arvind Swamy (Director, StellarAI)',
        witness_details: 'Witness 1: Mr. Amit Singh, Bangalore\nWitness 2: Ms. Priya Sen, Bangalore',
        execution_place: 'Bangalore',
        execution_date: today,
        additional_conditions: 'Any modifications to this Agreement must be executed in writing by all parties.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'cin',
        'registered_office',
        'agreement_date',
        'transferor_name',
        'transferor_address',
        'transferee_name',
        'transferee_address',
        'share_class',
        'share_certificate_numbers',
        'distinctive_numbers',
        'number_of_shares',
        'face_value',
        'paid_up_status',
        'purchase_consideration',
        'currency',
        'payment_method',
        'payment_schedule',
        'taxes',
        'stamp_duty_responsibility',
        'conditions_precedent',
        'closing_date',
        'closing_deliverables',
        'representations_transferor',
        'representations_transferee',
        'pre_closing_covenants',
        'post_closing_covenants',
        'termination_conditions',
        'governing_law',
        'dispute_resolution',
        'authorized_signatories',
        'witness_details',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "What is a Share Transfer Agreement?",
            content: "An agreement governing the sale and purchase of shares between an existing shareholder (Transferor) and a buyer (Transferee)."
        },
        {
            title: "Form SH-4 & Stamp Duty",
            content: "Under Section 56 of the Companies Act, 2013, share transfers must be executed using Form SH-4. Stamp duty of 0.015% is payable on the transfer consideration."
        },
        {
            title: "FEMA Pricing Compliance",
            content: "If shares are transferred between a resident and non-resident, the transfer must comply with FEMA pricing guidelines and be reported via Form FCTRS within 60 days."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Share Transfer Agreement"
            description="Generate a legally binding agreement for the sale and transfer of shares in an Indian company."
            documentType="share-transfer"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a comprehensive Share Transfer Agreement compliant with Companies Act, 2013."
            docxFilename="Share_Transfer_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <ShareTransferForm
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
