import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import CodeOfConductForm from './CodeOfConductForm';

export default function CodeOfConductAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Apex AI Software Technologies Private Limited',
        company_type: 'Private Limited',
        document_version: '2.0',
        effective_date: today,
        approved_by: 'Board of Directors & Chief Compliance Officer',
        policy_owner: 'Compliance & Ethics Department',
        review_cycle: 'Annually',
        company_values: '1. Integrity: We execute our tasks with honesty and transparency.\n2. Respect: We value diversity and treat all stakeholders with dignity.\n3. Accountability: We take responsibility for our actions and code outputs.',
        applicability: 'All full-time employees, directors, officers, interns, independent contractors, and consultants engaged by the company.',
        definitions: 'Covered Persons: All employees, officers, directors, and external contractors.\nCompany Assets: All physical workspaces, laptops, network systems, proprietary software codes, and repositories.',
        professional_conduct_policy: 'Covered persons must act with high professionalism, avoid conflict of interest, perform tasks diligently, and represent the organization ethically in all public forums.',
        workplace_behaviour_policy: 'Commitment to a safe, productive, and collaborative work environment. Harassment, verbal abuse, and workplace violence are strictly prohibited.',
        equal_opportunity_policy: 'Providing equal employment opportunities to all candidates and employees without regard to race, gender, religion, sexual orientation, disability, or age.',
        anti_harassment_policy: 'Zero-tolerance policy for harassment, including sexual harassment (POSH compliance) and bullying. Mandatory POSH training for all employees.',
        legal_compliance_policy: 'Compliance with all central, state, and local laws, including labor standards, environmental codes, and tax obligations.',
        conflict_of_interest_policy: 'Employees must disclose any personal, financial, or familial relationships that may conflict with the performance of company duties.',
        gifts_hospitality_policy: 'No employee may accept gifts, hospitality, or favors exceeding INR 2,00,000 from clients, vendors, or competitors without compliance sign-off.',
        anti_bribery_policy: 'Strict compliance with the Prevention of Corruption Act 1988. Giving or receiving bribes, kickbacks, or facilitation payments is completely banned.',
        confidentiality_policy: 'Employees must protect proprietary codebase, database schemas, financial reports, customer datasets, and business plans during and after employment.',
        information_security_policy: 'Compulsory password updates every 90 days. Use of corporate VPN on public networks. Strictly no sharing of login credentials.',
        intellectual_property_policy: 'All source code, designs, UI elements, documentation, patents, and innovations developed during work vest exclusively with the Company.',
        company_property_policy: 'Corporate laptops, licenses, and networks must be used only for authorized business tasks and handled with care.',
        social_media_policy: 'Employees must not post proprietary information, confidential code, or make defamatory statements about the company on social media.',
        data_privacy_policy: 'Strict processing guidelines for customer and employee personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
        reporting_misconduct_policy: 'Report any violation of the Code immediately to the Compliance Officer or via the Whistleblower hotline (compliance@apexai.com).',
        whistleblower_policy: 'Anonymous reporting channels are provided. The company guarantees absolute protection against retaliation or adverse employment actions for good-faith reports.',
        disciplinary_policy: 'Progressive disciplinary procedures: Written warnings, suspension, and immediate termination for gross misconduct, data theft, or corruption.',
        acknowledgment_text: 'I acknowledge that I have received, read, and understood the Apex AI Code of Conduct, and I agree to comply with all its rules and ethical guidelines.',
        industry_type: 'Information Technology',
        listed_company: true,
        global_operations: false,
        government_contractor: false,
        authorized_signatory: 'Mr. Aniket Sen (Chief Compliance Officer)',
        execution_place: 'Bangalore',
        execution_date: today,
        additional_policies: 'This code overrides all previous ethical policies and employee booklets.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'document_version',
        'effective_date',
        'approved_by',
        'policy_owner',
        'review_cycle',
        'company_values',
        'applicability',
        'professional_conduct_policy',
        'workplace_behaviour_policy',
        'equal_opportunity_policy',
        'anti_harassment_policy',
        'legal_compliance_policy',
        'conflict_of_interest_policy',
        'gifts_hospitality_policy',
        'anti_bribery_policy',
        'confidentiality_policy',
        'information_security_policy',
        'intellectual_property_policy',
        'company_property_policy',
        'data_privacy_policy',
        'reporting_misconduct_policy',
        'disciplinary_policy',
        'acknowledgment_text',
        'industry_type',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Anti-Bribery Rules",
            content: "Specify detailed standards in compliance with the Prevention of Corruption Act, 1988, completely outlawing kickbacks or facilitation payments."
        },
        {
            title: "Equal Opportunity",
            content: "Ensure compliance with the Rights of Persons with Disabilities Act, 2016 and equal remuneration principles, ensuring zero tolerance for workplace bias."
        },
        {
            title: "Whistleblower Channels",
            content: "Under Companies Act 2013, listed entities must establish a vigil mechanism (Whistleblower policy) ensuring protection against retaliation."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Code of Conduct"
            description="Generate a professional Code of Conduct establishing ethical standards, professional responsibilities, and corporate values."
            documentType="code-of-conduct"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts an official Code of Conduct governing workplace ethics, anti-corruption, POSH, and data confidentiality."
            docxFilename="Code_of_Conduct.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <CodeOfConductForm
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
