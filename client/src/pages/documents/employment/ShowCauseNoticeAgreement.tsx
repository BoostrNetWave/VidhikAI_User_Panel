import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ShowCauseNoticeForm from './ShowCauseNoticeForm';

export default function ShowCauseNoticeAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Apex AI Software Technologies Private Limited',
        company_type: 'Private Limited',
        cin: 'U72200KA2021PTC143100',
        registered_office: 'Block A, 4th Floor, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
        notice_number: 'APEX/DISC/2026/SCN-089',
        issue_date: today,
        employee_name: 'Rohit Verma',
        employee_id: 'APEX-2023-0104',
        designation: 'Senior Software Engineer',
        department: 'Core Platform Engineering',
        subject: 'Show Cause Notice: Explanation for Unauthorized Access to Production Data Repositories',
        incident_date: today,
        incident_time: '14:35 PM',
        incident_location: 'Apex HQ Bangalore (Remote Logins via VP-401)',
        allegation_details: 'It has been reported that on the incident date, there was an unauthorized pull of client database tables. These actions were executed without corresponding JIRA approval tickets or platform manager authorizations.',
        policy_references: '1. Apex Code of Conduct: Section 12 (Information Security & Data Protection)\n2. Information Security Policy: Clause 4.2 (Production Access Controls)\n3. Employment Agreement: Section 7 (Confidentiality & Data Security Obligations)',
        evidence_list: '1. VPN Access logs tracking IP address 192.168.1.45\n2. AWS CloudTrail events recording production database pull executions\n3. Git repository branch checkout history logs.',
        witnesses: '1. Mr. Dinesh Kumar (Security Infrastructure Lead)\n2. Ms. Sarah Mathews (Core Engineering Lead)',
        response_deadline: 'Within 7 calendar days from the receipt of this Notice',
        response_submission_mode: 'Written submission via Email and Hard Copy',
        response_recipient: 'Compliance & HR Committee (compliance@apexai.com)',
        consequences_of_non_response: 'In the event that no explanation is received within the stipulated deadline, it shall be presumed that you have no explanation to offer, and the Company reserves the right to proceed with further disciplinary proceedings in accordance with the Model Standing Orders and applicable company policies.',
        suspension_pending_inquiry: false,
        financial_misconduct: false,
        information_security_incident: true,
        attendance_misconduct: false,
        posh_related: false,
        safety_violation: false,
        hr_representative: 'Ms. Sarah Mathews (VP Human Resources)',
        authorized_signatory: 'Mr. Aniket Sen (Director HR & Compliance)',
        execution_place: 'Bangalore',
        execution_date: today,
        annexures: 'Annexure 1: Database access event audit reports\nAnnexure 2: Standing Orders disciplinary guidelines',
        additional_conditions: 'This notice is issued strictly in compliance with the Principles of Natural Justice, and no final disciplinary decision or presumption of guilt has been established.'
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
        'allegation_details',
        'policy_references',
        'evidence_list',
        'response_deadline',
        'response_submission_mode',
        'response_recipient',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Principles of Natural Justice",
            content: "Always formulate allegations neutrally and avoid any language indicating predefined guilt. The employee must receive a fair opportunity to offer their explanation."
        },
        {
            title: "Suspension Rules",
            content: "If suspension pending inquiry is toggled, ensure standard subsistence allowances are specified in accordance with the Industrial Employment (Standing Orders) Act, 1946."
        },
        {
            title: "Confidentiality & POSH",
            content: "In POSH-related complaints, ensure that no confidential names of the complainant or witnesses are disclosed, adhering strictly to Section 16 of the POSH Act."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Show Cause Notice"
            description="Generate a professional Show Cause Notice seeking a formal explanation regarding alleged misconduct in compliance with the Principles of Natural Justice."
            documentType="show-cause-notice"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a legally compliant Show Cause Notice to ensure procedural fairness before any disciplinary inquiry is held."
            docxFilename="Show_Cause_Notice.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <ShowCauseNoticeForm
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
