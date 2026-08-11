import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import SoftwareDevForm from './SoftwareDevForm';

export default function SoftwareDevAgreement() {
    const today = new Date().toISOString().split('T')[0];
    const completionDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const initialFormData = {
        agreement_number: 'SDA-2026/108',
        effective_date: today,
        project_name: 'NexusAI Enterprise Analytics & Automated Workflow Platform',
        commercial_purpose: 'Custom design, end-to-end development, testing, API integration, cloud deployment, and intellectual property transfer of an AI-driven enterprise data analytics and automated workflow system for Client business operations.',
        client: 'FinTech Dynamics India Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Cyber City, Phase 3, Gurugram, Haryana 122002, India',
        developer: 'Cognitive Code Labs Private Limited, a technology engineering company incorporated under the Companies Act, 2013, having its registered office at HSR Layout, Sector 6, Bangalore, Karnataka 560102, India',
        authorized_representatives: 'Client: Mr. Amitav Banerjee (CTO); Developer: Mr. Siddharth Rao (VP Engineering)',
        software_type: 'Enterprise SaaS Web Platform & AI Workflow Engine',
        platform: 'Web (React/TypeScript frontend), Cloud Backend (Node.js/Python microservices), PostgreSQL Database, and AWS Cloud Infrastructure',
        project_objectives: 'To build a secure, multi-tenant scalable software platform providing real-time data processing, predictive ML analytics models, automated approval workflows, and RESTful API integrations.',
        scope_of_services: '1. Requirement gathering & Technical Architecture Specification.\n2. UI/UX Figma Design & Design System Creation.\n3. Frontend & Backend Microservices Development.\n4. AI Model Integration & Training Data Pipeline Construction.\n5. Third-Party Banking & Payment Gateway API Integrations.\n6. Security Vulnerability Testing & Penetration Audit.\n7. AWS Cloud Infrastructure CI/CD Deployment & User Training.',
        deliverables: '1. Production Source Code Repositories (Git).\n2. Compiled Executable Object Code & Docker Containers.\n3. Complete System Architecture & API Documentation (Swagger/Postman).\n4. User Manual & Admin Operation Guides.\n5. Security Compliance & Penetration Audit Reports.',
        technical_specifications: 'Frontend: React 18, Next.js, Tailwind CSS; Backend: Node.js (TypeScript), Python (FastAPI/PyTorch); Database: PostgreSQL 16, Redis; Cloud: AWS EKS, Lambda, S3, RDS.',
        milestones: 'Milestone 1: Architecture & UI/UX Wireframes (Month 1, 20% payment);\nMilestone 2: Core Microservices & Database Schema (Month 2, 30% payment);\nMilestone 3: AI Engine & API Integration (Month 3, 30% payment);\nMilestone 4: UAT Acceptance, Final Deployment & IP Transfer (Month 4, 20% payment).',
        project_start_date: today,
        project_completion_date: completionDate,
        acceptance_testing: 'Client shall conduct User Acceptance Testing (UAT) for a period of 15 (fifteen) business days following delivery of each milestone release.',
        acceptance_criteria: 'All functional features operating without Priority-1 or Priority-2 defects as per Technical Specifications, passing security audit benchmarks, and achieving 99.5% test case pass rate.',
        payment_structure: 'Fixed Total Price of INR 45,00,000 (Rupees Forty-Five Lakhs Only) milestone-based payment schedule.',
        gst_applicable: true,
        invoicing_terms: 'Developer shall submit milestone tax invoices upon successful sign-off; Client shall pay within 15 (fifteen) calendar days of invoice receipt.',
        change_request_process: 'Any scope modification shall be documented in a written Change Request Form (CRF) detailing impact on cost and timelines, requiring mutual written authorization.',
        client_responsibilities: 'Provide timely business requirements, API access credentials, test datasets, feedback within 5 business days, and appoint a dedicated Project Manager.',
        developer_responsibilities: 'Deploy qualified software engineers, adhere to secure coding standards (OWASP Top 10), meet delivery milestones, provide source code commits weekly, and deliver bug fixes during UAT.',
        intellectual_property_clause: 'Upon full payment of consideration, all Foreground IP, source code, object code, custom algorithms, AI models, and documentation shall be exclusively assigned to and owned by the Client.',
        background_ip: 'Developer retains ownership of pre-existing reusable utility libraries, frameworks, and developer tools ("Developer Background IP") and grants Client a perpetual, royalty-free, worldwide license to use same embedded in the Deliverables.',
        foreground_ip: 'All custom software, custom source code, databases, AI models, UI designs, and deliverables created specifically under this Agreement ("Foreground IP") belong exclusively to the Client.',
        open_source_components: 'Developer shall use only permissive OSI-approved Open Source Software (MIT, Apache 2.0, BSD) and shall strictly exclude copyleft licenses (GPL, AGPL) without prior written Client consent.',
        confidentiality_clause: 'Both parties agree to maintain strict confidentiality of proprietary algorithms, business data, source code, trade secrets, and user data for 5 years post-termination.',
        data_privacy_clause: 'Developer shall comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) and implement strict technical measures to protect personal data processed during development.',
        information_security_requirements: 'Developer shall implement end-to-end encryption (TLS 1.3, AES-256), secure credential management, OWASP security compliance, role-based access control, and zero hardcoded secret keys.',
        warranty_terms: 'Developer warrants that for 90 (ninety) days post-final acceptance ("Warranty Period"), the Software shall perform substantially in accordance with Specifications and remain free of material bugs or security defects.',
        support_and_maintenance: 'Developer shall provide 90-day post-launch warranty bug support free of cost and offers optional Annual Maintenance Contract (AMC) at 15% of total project cost per annum.',
        service_level_agreement: 'Priority 1 (Critical Outage): 2-hour response, 8-hour resolution; Priority 2 (Major Defect): 4-hour response, 24-hour resolution; Priority 3 (Minor Issue): 24-hour response.',
        limitation_of_liability: 'Total aggregate liability of either party shall be capped at the total contract value actually paid under this Agreement, except for breach of confidentiality, IP infringement, or willful misconduct.',
        indemnity_clause: 'Developer shall defend and indemnify Client against third-party claims alleging that the Deliverables infringe third-party IP rights or open-source licenses.',
        force_majeure: 'Standard force majeure event relief upon immediate written notification within 7 days.',
        termination_clause: 'Either party may terminate for uncured material breach upon 30 days written notice, or Client may terminate for convenience upon paying for work completed up to notice date.',
        post_termination_obligations: 'Developer shall immediately hand over all completed work, source code commits, documentation, return Client data, and destroy confidential materials.',
        notice_details: 'Client: cto@fintechdynamics.in, Cyber City Gurugram; Developer: legal@cognitivecodelabs.com, HSR Layout Bangalore.',
        governing_law: 'Laws of India (including Information Technology Act, 2000 & Indian Contract Act, 1872)',
        dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed.',
        arbitration_details: 'Seat and venue of arbitration at Bangalore, Karnataka, conducted in English language.',
        jurisdiction: 'Courts at Bangalore, Karnataka, India',
        miscellaneous_clauses: 'Entire Agreement, Amendments in writing, Severability, Independent Contractor status, Counterparts, and Electronic Signatures under IT Act, 2000.',
        saas_project: true,
        ai_project: true,
        mobile_application: false,
        web_application: true,
        government_project: false,
        agile_methodology: true,
        devops_services: true,
        cross_border_project: false,
        witnesses: '1. Mr. Rohan Gupta (Gurugram); 2. Ms. Kavita Menon (Bangalore)',
        authorized_signatories: 'Client: Mr. Amitav Banerjee (CTO); Developer: Mr. Siddharth Rao (VP Engineering)',
        execution_place: 'Bangalore',
        execution_date: today,
        annexures: 'Annexure A: Detailed Statement of Work (SOW) & Technical Specs; Annexure B: Milestone Payment Schedule; Annexure C: Service Level Agreement (SLA).'
    };

    const requiredFields = [
        'effective_date',
        'project_name',
        'commercial_purpose',
        'client',
        'developer',
        'authorized_representatives',
        'software_type',
        'platform',
        'project_objectives',
        'scope_of_services',
        'deliverables',
        'technical_specifications',
        'milestones',
        'project_start_date',
        'project_completion_date',
        'acceptance_testing',
        'acceptance_criteria',
        'payment_structure',
        'invoicing_terms',
        'change_request_process',
        'client_responsibilities',
        'developer_responsibilities',
        'intellectual_property_clause',
        'background_ip',
        'foreground_ip',
        'confidentiality_clause',
        'information_security_requirements',
        'warranty_terms',
        'support_and_maintenance',
        'limitation_of_liability',
        'indemnity_clause',
        'force_majeure',
        'termination_clause',
        'post_termination_obligations',
        'notice_details',
        'governing_law',
        'dispute_resolution',
        'jurisdiction',
        'miscellaneous_clauses',
        'authorized_signatories',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "IP Allocation (Background vs Foreground)",
            content: "Under Section 17 of Copyright Act 1957, software created for consideration belongs to the commissioning Client only if expressly assigned in writing."
        },
        {
            title: "Open Source (OSS) Risks",
            content: "Strictly regulate viral/copyleft licenses (GPL/AGPL) to prevent Client proprietary source code from being legally forced into open disclosure."
        },
        {
            title: "DPDP Act Compliance",
            content: "Under the Digital Personal Data Protection Act 2023, developers handling personal data must implement data security safeguards and process data strictly per Client instructions."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Software Development Agreement"
            description="Generate a legally compliant Software Development Agreement governing custom software creation, milestones, acceptance testing, open source compliance, and IP ownership under Indian IT and Contract laws."
            documentType="software-development"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="Drafted in accordance with the Information Technology Act 2000, Copyright Act 1957, DPDP Act 2023, and Indian Contract Act 1872."
            docxFilename="Software_Development_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <SoftwareDevForm
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
