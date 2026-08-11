import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import IPAssignmentForm from './IPAssignmentForm';

export default function IPAssignmentAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_number: 'APEX/IPAA/2026/104',
        effective_date: today,
        commercial_purpose: 'Securing full intellectual property ownership, patent applications, software rights, and brand assets transfer from founder to corporate entity Apex AI.',
        assignor: 'Mr. Rajesh Kumar, an individual tech founder residing at Flat 101, Sunshine Apartments, Indiranagar, Bangalore, Karnataka 560038',
        assignee: 'Apex AI Software Technologies Private Limited, a company incorporated under the laws of India, with its registered office at Block A, Outer Ring Road, Bangalore 560103',
        authorized_representatives: 'Assignor: Mr. Rajesh Kumar; Assignee: Mr. Aniket Sen (Director)',
        assigned_ip_assets: '1. Patent Application No. 202441012345 (System and Method for AI-Based Drone Collision Avoidance).\n2. Trademark "ApexAir" under Class 9 and Class 12.\n3. Autonomous Drone Navigation Software (v2.1) source code and models.\n4. Domain Name apexairdrone.com and associated brand logo assets.',
        ip_categories: 'Patents, Trademarks, Software Source Code, Domain Names, Trade Secrets, and AI Models.',
        intellectual_property_definition: 'Intellectual Property shall mean all patents, patent applications, trademarks, service marks, registered designs, copyrights, database rights, trade secrets, know-how, domain names, and AI models.',
        assigned_rights: 'All rights, title, interest, ownership, exploitation, licensing, sub-licensing, registration, and enforcement rights worldwide.',
        retained_rights: 'The Assignor retains the non-exclusive right to use the underlying general programming algorithms for non-commercial academic research.',
        assignment_type: 'Exclusive',
        territory: 'Worldwide',
        assignment_duration: 'Perpetual / Full statutory duration of respective IP protections',
        effective_assignment_date: today,
        commercialization_rights: 'Absolute right to monetize, license, commercialize, sub-license, distribute, and exploit in any physical or digital medium globally.',
        registration_rights: 'Right to prosecute patent applications, register trademarks, record assignment deeds in IP Offices, and maintain renewals in the name of Assignee.',
        enforcement_rights: 'Right to institute legal proceedings, sue for past infringement, seek damages, and obtain injunctions against third-party infringers.',
        consideration: 'A one-time consolidated lump sum payment of INR 10,00,000 (Rupees Ten Lakhs Only) payable within 15 days of execution.',
        moral_rights_clause: 'The Assignor hereby waives all moral rights of attribution and integrity under Copyright Act, 1957 or other statutes to the maximum extent permitted by law.',
        representations_and_warranties: 'The Assignor represents that he is the sole owner of the Assigned IP, the assets are free of any liens, encumbrances, or prior assignments, and do not infringe third-party rights.',
        further_assurances: 'The Assignor agrees to execute all assignment deeds, patent transfer forms, trademark recordals, and assist in hearings to complete transfer registration.',
        confidentiality_clause: 'The parties agree to keep the terms of this assignment and proprietary details of the Assigned IP strictly confidential.',
        indemnity_clause: 'The Assignor agrees to indemnify and hold harmless the Assignee from any losses, damages, or liabilities arising from third-party IP infringement claims related to the Assigned IP.',
        limitation_of_liability: 'The maximum aggregate liability of the Assignor under this agreement shall be capped at the total consideration amount received.',
        termination_clause: 'This agreement represents an absolute and irrevocable transfer of IP ownership and cannot be terminated once executed.',
        notice_details: 'Assignor: rajesh.k@email.com, Indiranagar, Bangalore; Assignee: legal@apexai.com, Block A, Outer Ring Road, Bangalore.',
        governing_law: 'Laws of India',
        dispute_resolution: 'Amicable settlement failing which dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.',
        arbitration_details: 'Sole arbitrator appointed mutually, proceedings conducted in English language, seat of arbitration at Bangalore.',
        jurisdiction: 'Courts in Bangalore, Karnataka',
        miscellaneous_clauses: 'This agreement constitutes the entire understanding, is severable, cannot be assigned without consent, and may be executed in counterparts.',
        software_ip: true,
        employee_assignment: false,
        founder_assignment: true,
        startup_investment: false,
        patent_assignment: true,
        trademark_assignment: true,
        research_ip: false,
        cross_border_transaction: false,
        witnesses: '1. Mr. Dinesh Kumar (Bangalore)\n2. Ms. Sarah Mathews (Pune)',
        authorized_signatories: 'Signed for Assignor: Mr. Rajesh Kumar; Signed for Assignee: Mr. Aniket Sen',
        execution_place: 'Bangalore',
        execution_date: today,
        annexures: 'Annexure A: Schedule of Patents & Trademark Certificates'
    };

    const requiredFields = [
        'effective_date',
        'commercial_purpose',
        'assignor',
        'assignee',
        'authorized_representatives',
        'assigned_ip_assets',
        'ip_categories',
        'intellectual_property_definition',
        'assigned_rights',
        'assignment_type',
        'territory',
        'assignment_duration',
        'effective_assignment_date',
        'commercialization_rights',
        'registration_rights',
        'enforcement_rights',
        'consideration',
        'representations_and_warranties',
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
            title: "IP Asset Specification",
            content: "Explicitly list patents, applications, trademarks, domain names, designs, and source code modules to be assigned. Section 19 of Copyright Act and Section 68 of Patents Act govern this."
        },
        {
            title: "Prosecution Rights",
            content: "Assigning patent applications must transfer the right to prosecute, respond to office actions, and obtain final grants in the assignee's name."
        },
        {
            title: "Trademark Goodwill",
            content: "Trademarks can be assigned with or without the goodwill of the business. Default is set to transfer with goodwill."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Intellectual Property Assignment Agreement"
            description="Generate a professional IP Assignment Agreement legally transferring complete ownership of patents, trademarks, software repositories, and proprietary technology assets."
            documentType="ip-assignment"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a legally compliant IP Assignment Agreement under Patents Act 1970, Trade Marks Act 1999, and Copyright Act 1957."
            docxFilename="Intellectual_Property_Assignment_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <IPAssignmentForm
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
