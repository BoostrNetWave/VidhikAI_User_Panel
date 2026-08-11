import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import InternshipAgreementForm from './InternshipAgreementForm';

export default function InternshipAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_date: today,
        organization_name: 'Apex AI Systems Private Limited',
        organization_type: 'Private Limited',
        organization_address: '5th Floor, Block C, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
        intern_name: 'Rohit Verma',
        intern_address: 'Room 204, Hostels 3, Indian Institute of Information Technology, Dharwad, Karnataka 580009',
        educational_institution: 'Indian Institute of Information Technology, Dharwad',
        institution_address: 'IIIT Dharwad Campus, Itigatti Road, Dharwad, Karnataka 580009',
        internship_title: 'Full-Stack Developer Intern',
        department: 'Software Engineering',
        reporting_supervisor: 'Mr. Rajesh Kumar (Senior Architect)',
        internship_mode: 'Hybrid',
        commencement_date: today,
        end_date: '2026-10-31',
        duration: '3 Months',
        working_days: '5 days per week (Monday to Friday)',
        working_hours: '9:30 AM to 6:30 PM (inclusive of 1 hour lunch break)',
        learning_objectives: '1. Hands-on learning of React and Node.js enterprise microservices architectures.\n2. Understanding Agile development processes, code reviews, and Git workflows.\n3. Exposure to scalable CI/CD pipelines and Docker deployment.',
        scope_of_work: 'Development of UI modules for the customer portal, drafting unit tests for backend APIs under the guidance of the reporting supervisor, and bug-fixing of reported portal issues.',
        training_plan: 'Week 1-2: Onboarding & Stack Review\nWeek 3-8: Guided Feature Development\nWeek 9-12: End-to-end Integration and Performance Optimization',
        mentor_details: 'Mr. Rajesh Kumar, IIIT Alumnus and Engineering Architect',
        stipend_type: 'Paid',
        stipend_amount: 'INR 25,000 per month',
        reimbursement_policy: 'One-time relocation support of INR 5,00,000 and pre-approved project travel costs reimbursed against invoices.',
        payment_schedule: 'Stipend shall be disbursed on the 5th day of the subsequent calendar month.',
        confidentiality_clause: 'Intern shall not disclose, share, or publish any proprietary source codes, internal databases, password keys, or designs during the internship term.',
        intellectual_property_clause: 'All codes, modules, UI pages, and documentation developed during the internship shall vest exclusively with Apex AI Systems.',
        data_processing: 'All user data handled during developmental staging must comply with the DPDP Act 2023 guidelines.',
        attendance_requirements: 'Minimum 90% attendance during the internship period. Regular check-ins on Slack by 9:45 AM daily.',
        organization_obligations: 'Provide access to developer laptops, AWS staging profiles, Slack workspaces, and allocate a dedicated mentor.',
        intern_obligations: 'Follow all company security protocols, maintain confidentiality, complete weekly reports, and comply with working hour guidelines.',
        certificate_of_completion: 'Intern will receive an official Certificate of Internship Completion and Recommendation Letter upon successful performance sign-off by the mentor.',
        ppo_eligibility: 'Eligible for a Pre-Placement Offer (PPO) for the role of Associate Software Engineer subject to outstanding performance evaluation and business requirements.',
        termination_conditions: 'Either party may terminate the internship with 7 days written notice, or immediately by the organization for code plagiarism, breach of confidentiality, or misconduct.',
        notice_period: '7 Days written notice',
        governing_law: 'Laws of India',
        dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 in Bangalore by a sole arbitrator.',
        electronic_execution: true,
        authorized_signatories: 'Apex AI Systems: Mr. Aniket Sen (HR Director)\nIntern: Rohit Verma',
        institution_signatory: 'IIIT Dharwad Placement Office: Prof. Amit Nair',
        witness_details: 'Witness 1: Mr. Suresh Gowda, Bangalore\nWitness 2: Ms. Priya Sharma, Bangalore',
        execution_place: 'Bangalore',
        execution_date: today,
        additional_conditions: 'This internship is purely educational and does not guarantee regular permanent employment upon completion.'
    };

    const requiredFields = [
        'agreement_date',
        'organization_name',
        'organization_type',
        'organization_address',
        'intern_name',
        'intern_address',
        'internship_title',
        'department',
        'reporting_supervisor',
        'internship_mode',
        'commencement_date',
        'end_date',
        'duration',
        'working_days',
        'working_hours',
        'learning_objectives',
        'scope_of_work',
        'training_plan',
        'mentor_details',
        'stipend_type',
        'confidentiality_clause',
        'intellectual_property_clause',
        'attendance_requirements',
        'organization_obligations',
        'intern_obligations',
        'termination_conditions',
        'notice_period',
        'governing_law',
        'dispute_resolution',
        'authorized_signatories',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Educational Purpose Focus",
            content: "Ensure the internship is structured primarily as a learning experience. Clearly distinguish the intern from full-time employees to avoid employee classification liabilities."
        },
        {
            title: "Intellectual Property Ownership",
            content: "Under Section 17 of the Copyright Act, 1957, ensure the agreement explicitly assigns all copyright and IP rights in code developed by the intern to the host organization."
        },
        {
            title: "Unpaid / Stipend Restrictions",
            content: "State clearly that no employment wages are payable except the agreed stipend. Paid stipends are typically exempt from provident fund (PF) contributions."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Internship Agreement"
            description="Generate a professional Internship Agreement establishing a mentored training and learning program under the Indian Contract Act."
            documentType="internship-agreement"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a structured Internship Agreement suitable for campus recruitment and educational collaborations."
            docxFilename="Internship_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <InternshipAgreementForm
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
