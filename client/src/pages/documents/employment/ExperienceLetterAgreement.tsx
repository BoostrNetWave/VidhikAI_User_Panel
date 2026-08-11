import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ExperienceLetterForm from './ExperienceLetterForm';

export default function ExperienceLetterAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Vidhik Legal Solutions Private Limited',
        company_type: 'Private Limited',
        cin: 'U74110DL2023PTC412356',
        registered_office: 'Block E, 4th Floor, Connaught Place, New Delhi, 110001',
        letter_number: 'VLS/EXP/2026/047',
        issue_date: today,
        employee_name: 'Vikram Aditya Roy',
        employee_id: 'VLS-402',
        employment_type: 'Permanent',
        designation: 'Senior Legal Technology Consultant',
        department: 'Legal Operations',
        joining_date: '2023-06-01',
        last_working_date: '2026-06-30',
        employment_duration: '3 Years and 1 Month',
        previous_designations: 'Legal Tech Analyst (Jun 2023 - May 2024), promoted to Consultant in Jun 2024, and Senior Legal Technology Consultant in Dec 2025.',
        responsibilities: 'Managed high-value client contracts and automation workflows. Supervised a team of 4 junior legal engineers in implementing AI contract analytics. Led integration of legal research APIs with internal applications.',
        projects: 'Automated 120+ standard commercial agreement templates, reducing document turnaround time by 60%.',
        achievements: 'Awarded the "Innovative Product Champion" accolade in annual general meeting 2025.',
        conduct_statement: 'Vikram performed his duties with exceptional professionalism, high dedication, and a strong sense of integrity.',
        exit_status: 'Resignation accepted',
        hr_representative: 'Ms. Priyadarshini Sen (Director HR)',
        authorized_signatory: 'For Vidhik Legal Solutions: Mr. Sandeep Anand (Managing Director)',
        company_seal_required: true,
        execution_place: 'New Delhi',
        execution_date: today,
        additional_conditions: 'All company assets returned, dues cleared, and no outstanding obligations remain.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'registered_office',
        'issue_date',
        'employee_name',
        'employment_type',
        'designation',
        'department',
        'joining_date',
        'last_working_date',
        'employment_duration',
        'responsibilities',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Work Experience Certification",
            content: "Formally certifies an employee's designation, tenure, department, and primary responsibilities within the organization."
        },
        {
            title: "Indian Labour Law Compliance",
            content: "Complies with the Shops and Establishments Act, Payment of Wages, and Code on Social Security regulations regarding service certification."
        },
        {
            title: "Neutral & Factual Tone",
            content: "Ensures the document is background-check ready for immigration, future employers, banks, and academic institutions."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Experience Letter"
            description="Draft a legally compliant work experience certificate detailing designations, employment timeline, and key responsibilities."
            documentType="experience-letter"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator creates a formal certificate of employment compliant with Indian corporate HR policies and employment regulations."
            docxFilename="Experience_Letter.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <ExperienceLetterForm
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
