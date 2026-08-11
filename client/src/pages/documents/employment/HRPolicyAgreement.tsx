import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import HRPolicyForm from './HRPolicyForm';

export default function HRPolicyAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Apex AI Software Technologies Private Limited',
        company_type: 'Private Limited',
        company_logo: '',
        registered_office: 'Block A, 4th Floor, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
        policy_version: '1.2',
        effective_date: today,
        approved_by: 'Board of Directors & Chief Human Resources Officer',
        policy_owner: 'HR Department',
        review_frequency: 'Annually',
        employment_policies: '1. Recruitment & Onboarding: All hirings must undergo strict professional background checks.\n2. Probation & Confirmation: New hires undergo 6 months probation. Confirmation is subject to performance review.\n3. Promotion & Transfer: Promotions occur during annual reviews based on KPIs.',
        attendance_policy: 'Employees must register attendance daily via biometrics or the HR Portal. Standard working hours are 9:30 AM to 6:30 PM. Core collaboration hours are 11:00 AM to 4:00 PM.',
        working_hours_policy: 'Standard 45-hour work week, Monday to Friday. Shift timings may vary based on business requirements. Overtime is only permitted for operations support and must be pre-approved.',
        leave_policy: 'Employees are entitled to 24 days of paid leave per year (12 Earned Leaves, 6 Sick Leaves, and 6 Casual Leaves). Earned leaves can be carried forward up to a maximum of 30 days.',
        holiday_policy: 'The company observes 10 mandatory public holidays per year, including National holidays (26th Jan, 15th Aug, 2nd Oct) and state festivals.',
        remote_work_policy: 'Remote work is permitted up to 2 days per week with manager approval. Employees must ensure stable internet and follow cyber security mandates.',
        hybrid_work_policy: 'Employees are required to attend the office at least 3 days per week (Tuesdays, Wednesdays, and Thursdays).',
        compensation_policy: 'Salaries are calculated monthly and paid on the last working day of the month. Components include Basic Salary, HRA, Special Allowance, and LTA. Performance bonuses are paid annually.',
        benefits_policy: 'Comprehensive group health insurance covering up to INR 5,00,000 for employee, spouse, and two children. Regular health check-ups and meal vouchers.',
        performance_management_policy: 'Annual performance cycles (April - March) with mid-year reviews. Goal-setting occurs in April. Performance Improvement Plan (PIP) duration is 30 to 90 days for low performers.',
        learning_development_policy: 'The company supports professional certifications with 100% tuition reimbursement up to INR 50,000 per year upon successful course completion.',
        code_of_conduct: 'Employees must maintain high ethical standards. Conflict of interest, bribery, and harassment are strictly prohibited. Strict POSH compliance is mandated.',
        confidentiality_policy: 'Employees shall maintain absolute confidentiality regarding all proprietary codebase, client data, patents, and financial plans during and post-employment.',
        information_security_policy: 'Mandatory password rotation every 90 days. Two-Factor Authentication (2FA) must be enabled on all corporate email profiles. Use of VPN is compulsory on public Wi-Fi.',
        intellectual_property_policy: 'All source code, designs, documentation, and tools developed during employment shall vest immediately and exclusively with the Company.',
        posh_policy: 'Zero-tolerance policy for sexual harassment. Apex Internal Committee (IC) is constituted for hearing grievances. The presiding officer is Ms. Sarah Mathews (VP HR).',
        health_safety_policy: 'Workplace safety compliance under OSH Code 2020. Annual fire drills and evacuation guidelines. Clean and hygienic office workspaces.',
        grievance_policy: 'Employees can report grievances to the immediate supervisor. Escalation path goes to HR Manager and finally to the Grievance Redressal Committee.',
        disciplinary_policy: 'Progressive disciplinary action: Verbal Warning, Written Warning, Suspension, and Termination. Code plagiarism or data theft results in immediate termination.',
        separation_policy: 'Notice period of 60 days for confirmed employees, and 30 days during probation. Buy-out is subject to management approval. Exit interviews are mandatory.',
        statutory_compliance: 'Strict compliance with EPF Act, Gratuity Act, Maternity Benefit Act, and POSH Act 2013.',
        amendment_policy: 'The company reserves the right to amend, delete, or add policies at any time. Changes will be notified to employees via email.',
        acknowledgment_text: 'I acknowledge that I have received, read, and understood the Apex AI HR Policy Manual, and I agree to abide by all its rules and guidelines.',
        company_industry: 'Information Technology',
        startup: true,
        remote_first: false,
        global_operations: false,
        authorized_signatory: 'Mr. Aniket Sen (HR Director)',
        execution_place: 'Bangalore',
        execution_date: today,
        additional_policies: 'This manual overrides all previous HR policy letters and documents.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'registered_office',
        'policy_version',
        'effective_date',
        'approved_by',
        'policy_owner',
        'review_frequency',
        'employment_policies',
        'attendance_policy',
        'working_hours_policy',
        'leave_policy',
        'holiday_policy',
        'compensation_policy',
        'benefits_policy',
        'performance_management_policy',
        'learning_development_policy',
        'code_of_conduct',
        'confidentiality_policy',
        'information_security_policy',
        'intellectual_property_policy',
        'health_safety_policy',
        'grievance_policy',
        'disciplinary_policy',
        'separation_policy',
        'statutory_compliance',
        'amendment_policy',
        'acknowledgment_text',
        'company_industry',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "POSH Act Compliance",
            content: "For establishments with 10 or more employees, it is mandatory under the POSH Act 2013 to constitute an Internal Committee (IC) to address sexual harassment grievances."
        },
        {
            title: "Leave Accrual Limits",
            content: "Verify that sick, casual, and earned leave allocations align with the state's specific Shops and Establishments rules."
        },
        {
            title: "Notice Period Terms",
            content: "Ensure separation notice periods (usually 30 to 90 days) are compliant with employment contracts and state laws."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="HR Policy Manual"
            description="Generate a comprehensive, legally compliant Company HR Policies and Rules manual under Indian labor laws."
            documentType="hr-policy-manual"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts an official HR policy manual governing corporate employment, benefits, codes of conduct, and compliance."
            docxFilename="HR_Policy_Manual.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <HRPolicyForm
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
