import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ProbationConfirmationLetterForm from './ProbationConfirmationLetterForm';

export default function ProbationConfirmationLetterAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Quantum Leap Innovations Private Limited',
        company_type: 'Private Limited',
        cin: 'U72900KA2022PTC123987',
        registered_office: '12th Floor, Tower B, Prestige Tech Park, Marathahalli, Bangalore, Karnataka 560103',
        letter_number: 'QLI/HR/CONF/2026/043',
        issue_date: today,
        employee_name: 'Aditya Sharma',
        employee_id: 'QLI-908',
        designation: 'Senior Software Engineer',
        department: 'Engineering',
        joining_date: '2025-07-20',
        probation_start_date: '2025-07-20',
        probation_completion_date: '2026-01-20',
        confirmation_effective_date: '2026-01-21',
        reporting_manager: 'Ms. Shruti Rao (Engineering Director)',
        work_location: 'Bangalore Office',
        appointment_letter_reference: 'QLI/HR/APP/2025/112',
        employment_agreement_reference: 'Employment Agreement dated July 18, 2025',
        salary_revision: true,
        revised_compensation: 'INR 12,00,000 per annum',
        revised_compensation_effective_date: '2026-02-01',
        permanent_employee_benefits: 'Gratuity eligibility, group health insurance cover up to INR 5,00,000, and annual performance bonus eligibility.',
        confidentiality_required: true,
        intellectual_property_required: true,
        transferability: 'Employee is subject to transfer to any office, branch, or subsidiary of the Company within India as per business requirements.',
        esop_eligibility: 'Eligible for options grant under the Employee Stock Option Plan 2026, subject to Board approval.',
        promotion_details: 'Promotion to Senior Software Engineer (previously Software Engineer II) in recognition of outstanding probation performance.',
        senior_management: false,
        remote_employee: false,
        hybrid_employee: true,
        authorized_signatory: 'For Quantum Leap Innovations: Mr. Arvind Swamy (Director)',
        execution_place: 'Bangalore',
        execution_date: today,
        additional_conditions: 'All other terms and conditions of the original Appointment Letter remain unchanged.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'registered_office',
        'issue_date',
        'employee_name',
        'designation',
        'department',
        'joining_date',
        'probation_start_date',
        'probation_completion_date',
        'confirmation_effective_date',
        'reporting_manager',
        'work_location',
        'appointment_letter_reference',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Probation Confirmation",
            content: "Formally confirms the successful completion of probation and transitions the employee to permanent employment status."
        },
        {
            title: "Appointment Continuity",
            content: "Clearly reference the original Appointment Letter or Employment Contract to maintain continuous service records."
        },
        {
            title: "Statutory Benefits Eligibility",
            content: "Upon confirmation, permanent employees typically become eligible for statutory benefits such as gratuity (after 5 years) and regular PF allocations."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Probation Confirmation Letter"
            description="Generate a legally compliant letter confirming permanent employment status following successful probation completion."
            documentType="probation-confirmation"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a formal HR letter compliant with Indian labour laws and Shops & Establishments Acts."
            docxFilename="Probation_Confirmation_Letter.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <ProbationConfirmationLetterForm
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
