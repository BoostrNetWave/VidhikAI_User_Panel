import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import WarningLetterForm from './WarningLetterForm';

export default function WarningLetterAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Apex AI Software Technologies Private Limited',
        company_type: 'Private Limited',
        cin: 'U72200KA2021PTC143100',
        registered_office: 'Block A, 4th Floor, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
        letter_number: 'APEX/DISC/2026/WARN-310',
        issue_date: today,
        employee_name: 'Rohit Verma',
        employee_id: 'APEX-2023-0104',
        designation: 'Senior Software Engineer',
        department: 'Core Platform Engineering',
        subject: 'Warning Letter: Written Warning for Breach of Confidentiality and Security Policies',
        incident_date: today,
        incident_description: 'On the incident date, it was detected that database tables containing client credentials were pulled from the server without JIRA approval, using a private device.',
        policy_violations: '1. Code of Conduct: Section 12 (Information Security)\n2. Employment Agreement: Clause 7.1 (Confidentiality Covenant)',
        investigation_reference: 'Apex Security Operations Audit Report Ref: SEC-2026-098',
        show_cause_notice_reference: 'Show Cause Notice Ref: APEX/DISC/2026/SCN-089 dated 15th January 2026',
        employee_explanation_summary: 'The employee submitted a response stating that the pull was executed to debug a staging environment bug rapidly, and the private device was used because of corporate VPN latency.',
        findings: 'The Disciplinary Committee reviewed the explanation and found that downloading database dumps to personal devices remains a severe policy breach, regardless of intent.',
        warning_type: 'First',
        corrective_action_plan: '1. Immediately delete all local database copies and sign the wipe declaration.\n2. Complete the Mandatory Information Security compliance training within 14 days.\n3. Utilize only corporate network environments for engineering checkouts.',
        monitoring_period: '90 Days from the date of issue of this Letter',
        consequences_of_repeat_misconduct: 'Any subsequent violations of data security or confidentiality policies within the monitoring period will result in further disciplinary action, up to and including termination of employment under Standing Orders.',
        attendance_issue: false,
        performance_issue: false,
        information_security_issue: true,
        safety_violation: false,
        posh_related: false,
        previous_warning_reference: 'None',
        hr_representative: 'Ms. Sarah Mathews (VP Human Resources)',
        authorized_signatory: 'Mr. Aniket Sen (Director HR & Compliance)',
        execution_place: 'Bangalore',
        execution_date: today,
        annexures: 'Annexure A: Wipe Declaration Certificate\nAnnexure B: Disciplinary Committee Meeting Minutes',
        additional_conditions: 'This warning letter is placed in your official personnel file and will be reviewed upon the completion of the monitoring period.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'registered_office',
        'issue_date',
        'employee_name',
        'employee_id',
        'designation',
        'department',
        'subject',
        'incident_date',
        'incident_description',
        'policy_violations',
        'warning_type',
        'corrective_action_plan',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Proportional Warnings",
            content: "Ensure warnings remain proportionate to the severity of the misconduct findings. Defamatory or excessively punitive language should be avoided."
        },
        {
            title: "Corrective Action Plans",
            content: "Always specify actionable, measurable objectives in the plan, such as compliance training schedules, delete verifications, or PIP timelines."
        },
        {
            title: "Personnel Records",
            content: "Warning letters serve as formal legal evidence in labor courts. Ensure all procedural steps, such as show cause replies and findings, are referenced."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Warning Letter"
            description="Generate a professional Warning Letter documenting a formal disciplinary warning, details of misconduct, and corrective action plans."
            documentType="warning-letter"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a legally compliant Warning Letter suitable for performance, attendance, safety, or confidentiality breaches."
            docxFilename="Warning_Letter.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <WarningLetterForm
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
