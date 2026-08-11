import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import SalaryIncrementLetterForm from './SalaryIncrementLetterForm';

export default function SalaryIncrementLetterAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Apex AI Software Technologies Private Limited',
        company_type: 'Private Limited',
        cin: 'U72200KA2021PTC143100',
        registered_office: 'Block A, 4th Floor, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
        letter_number: 'APEX/HR/2026/SAL-REV-4021',
        issue_date: today,
        employee_name: 'Rohit Verma',
        employee_id: 'APEX-2023-0104',
        designation: 'Senior Software Engineer',
        department: 'Core Platform Engineering',
        previous_ctc: 'INR 12,00,000 per annum',
        revised_ctc: 'INR 15,00,000 per annum',
        increment_amount: 'INR 3,00,000 per annum',
        increment_percentage: '25%',
        effective_date: today,
        revised_salary_structure: 'Basic Salary: INR 6,25,000 per annum\nHouse Rent Allowance (HRA): INR 3,12,500 per annum\nSpecial Allowance: INR 4,37,500 per annum\nEmployer Provident Fund (EPF): INR 75,000 per annum\nEmployer Gratuity Contribution: INR 30,000 per annum',
        performance_bonus: 'Target annual performance bonus of 10% of Basic Salary (INR 62,500) based on individual achievements and company milestones.',
        variable_pay: 'INR 1,25,000 annual variable pay linked directly to the quarterly release performance metrics.',
        esop_details: 'Vesting of an additional 500 Employee Stock Options under the APEX ESOP Scheme 2024 with a 4-year vesting schedule and 1-year cliff.',
        promotion_details: 'Simultaneous promotion from Software Engineer to Senior Software Engineer role in the Core Platform Engineering department.',
        tax_notes: 'All compensation components are subject to professional tax, income tax, and other statutory TDS deductions in accordance with the Income Tax Act, 1961.',
        statutory_deductions: 'Statutory deductions for Employee PF, ESI (if applicable), and Professional Tax shall be deducted at source in accordance with state and central regulations.',
        appointment_letter_reference: 'Appointment Letter Dated: 12th July 2023',
        employment_agreement_reference: 'Employment Agreement Dated: 12th July 2023',
        hr_representative: 'Ms. Sarah Mathews (VP Human Resources)',
        authorized_signatory: 'Mr. Aniket Sen (HR Director)',
        execution_place: 'Bangalore',
        execution_date: today,
        ctc_annexure_reference: 'Annexure A: Detailed Revised Salary Breakup Schematic',
        appreciation_message: 'The management extends its appreciation for your outstanding contribution to the cloud migration projects during the financial year.',
        additional_conditions: 'This letter serves as an amendment to your original Appointment Letter, while all other terms and conditions remain unchanged.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'registered_office',
        'issue_date',
        'employee_name',
        'designation',
        'department',
        'previous_ctc',
        'revised_ctc',
        'increment_amount',
        'increment_percentage',
        'effective_date',
        'revised_salary_structure',
        'statutory_deductions',
        'appointment_letter_reference',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Salary Component Structure",
            content: "Ensure the total sum of Basic, HRA, and Special Allowances equals the revised gross salary. Under Code on Wages, Basic Salary must be at least 50% of total CTC."
        },
        {
            title: "Employment Continuity",
            content: "Always specify that existing terms like confidentiality, intellectual property assignment, and notice periods remain fully applicable unless revised."
        },
        {
            title: "EPF Deductions",
            content: "Verify revised contributions conform to the Employees' Provident Funds Act, ensuring employer matching contributions are calculated correctly."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Salary Increment Letter"
            description="Generate a professional Compensation Revision Letter formally communicating revised salary structures under the Code on Wages."
            documentType="salary-increment-letter"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a legally compliant Salary Increment Letter suitable for annual performance reviews."
            docxFilename="Salary_Increment_Letter.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <SalaryIncrementLetterForm
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
