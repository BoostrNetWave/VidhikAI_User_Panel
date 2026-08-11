import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import RelievingLetterForm from './RelievingLetterForm';

export default function RelievingLetterAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Vidhik Legal Solutions Private Limited',
        company_type: 'Private Limited',
        cin: 'U74110DL2023PTC412356',
        registered_office: 'Block E, 4th Floor, Connaught Place, New Delhi, 110001',
        letter_number: 'VLS/REL/2026/092',
        issue_date: today,
        employee_name: 'Vikram Aditya Roy',
        employee_id: 'VLS-402',
        employment_type: 'Permanent',
        designation: 'Senior Legal Technology Consultant',
        department: 'Legal Operations',
        joining_date: '2023-06-01',
        last_working_date: '2026-06-30',
        relieving_date: '2026-06-30',
        separation_type: 'Resignation accepted',
        resignation_acceptance_date: '2026-05-15',
        retirement_date: '',
        contract_completion: '',
        handover_completed: true,
        asset_clearance: 'Completed',
        hr_clearance: 'Completed',
        finance_clearance: 'Completed',
        it_clearance: 'Completed',
        administrative_clearance: 'Completed',
        final_settlement_status: 'Full & Final Settlement Completed',
        gratuity_status: 'Paid',
        leave_encashment_status: 'Encashed',
        post_employment_obligations: 'The employee remains bound by the post-employment confidentiality and intellectual property obligations detailed in Section 9 of the Employment Agreement dated 1st June 2023.',
        appreciation_message: 'We appreciate Vikram\'s contributions and dedication to the Legal Operations team and wish him success in all his future endeavors.',
        experience_letter_reference: 'VLS/EXP/2026/047',
        hr_representative: 'Ms. Priyadarshini Sen (Director HR)',
        authorized_signatory: 'For Vidhik Legal Solutions: Mr. Sandeep Anand (Managing Director)',
        company_seal_required: true,
        execution_place: 'New Delhi',
        execution_date: today,
        additional_conditions: 'No outstanding dues or company properties are pending recovery.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'registered_office',
        'issue_date',
        'employee_name',
        'designation',
        'department',
        'employment_type',
        'joining_date',
        'last_working_date',
        'relieving_date',
        'separation_type',
        'handover_completed',
        'asset_clearance',
        'hr_clearance',
        'finance_clearance',
        'it_clearance',
        'administrative_clearance',
        'post_employment_obligations',
        'authorized_signatory',
        'company_seal_required',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Official Separation Record",
            content: "Formally confirms the cessation of the employer-employee relationship and complete release of duties."
        },
        {
            title: "Clearance & Handover Compliance",
            content: "Certifies that all company assets are returned, IT/HR/finance clearances are obtained, and knowledge transfer is complete."
        },
        {
            title: "Statutory & Verification Ready",
            content: "Complies with Indian labour laws, suitable for background verification (BGV), financial applications, and immigration."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Relieving Letter"
            description="Draft a legally compliant official Relieving Letter confirming employee separation, clearances, and handover completion."
            documentType="relieving-letter"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts an official relieving document certifying that the employee has completed all separation formalities and has been released."
            docxFilename="Relieving_Letter.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <RelievingLetterForm
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
