import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import MutualNDAForm from './MutualNDAForm';

export default function MutualNDAAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_number: 'APEX/MNDA/2026/049',
        effective_date: today,
        business_purpose: 'Evaluating and discussing a potential joint technological integration, software licensing partnership, and software API development collaboration between the parties.',
        party_a: 'Apex AI Software Technologies Private Limited, a company incorporated under the laws of India, with its registered office at Block A, Outer Ring Road, Bangalore 560103',
        party_b: 'Vertex Innovations Private Limited, a company incorporated under the laws of India, with its registered office at Tech Park Road, Sector 5, Pune 411001',
        authorized_representatives: 'Apex AI: Mr. Aniket Sen (Director); Vertex Innovations: Mr. Rajesh Pillai (VP Engineering)',
        confidential_information_definition: 'Confidential Information shall mean all non-public, proprietary, or trade secret information disclosed by either party (as Disclosing Party) to the other party (as Receiving Party), whether in writing, oral, visual, or digital formats.',
        confidential_information_categories: '1. Technical data, source codes, algorithms, DB schemas, and system architectures.\n2. Business plans, client lists, pricing formulas, and product roadmaps.\n3. Personal data of employees, candidates, and customers processed by the parties.',
        exclusions: '1. Information already in the public domain at the time of disclosure.\n2. Information independently developed by the receiving party without reference to disclosing party materials.\n3. Disclosures required under statutory mandates or court orders.',
        reciprocal_confidentiality_obligations: 'Each party shall maintain strict confidentiality, limit access only to need-to-know representatives, implement reasonable security safeguards, and return/destroy all copies upon request or termination.',
        permitted_disclosures: 'Disclosures to affiliates, legal advisors, auditors, and key employees who have signed confidentiality obligations at least as restrictive as this agreement.',
        intellectual_property_clause: 'All intellectual property, proprietary tools, and source code disclosed under this agreement shall remain the exclusive property of the respective disclosing party, and no license or transfer is granted hereunder.',
        data_privacy_clause: 'The parties agree to process personal data strictly in compliance with the Digital Personal Data Protection (DPDP) Act, 2023, implementing technical and organizational measures to prevent data breaches.',
        term_commencement: 'Effective Date of this Agreement',
        agreement_duration: '3 Years from the date of disclosure of the respective Confidential Information',
        confidentiality_survival_period: '5 Years post the termination of this Agreement',
        remedies: 'The disclosing party shall be entitled to seek injunctive relief, specific performance, and monetary damages in the event of any proven breach.',
        limitation_of_liability: 'Neither party shall be liable for indirect, incidental, or consequential damages, and maximum aggregate liability for proven breaches shall be capped at INR 10,00,000.',
        termination_clause: 'This agreement may be terminated by either party upon giving 30 days prior written notice to the other party.',
        notice_details: 'Apex AI: legal@apexai.com, Block A, Outer Ring Road, Bangalore; Vertex Innovations: legal@vertex.com, Sector 5, Pune.',
        governing_law: 'Laws of India',
        dispute_resolution: 'Amicable settlement failing which dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.',
        arbitration_details: 'Sole arbitrator appointed mutually, proceedings conducted in English language, seat of arbitration at Bangalore.',
        jurisdiction: 'Courts in Bangalore, Karnataka',
        miscellaneous_clauses: 'This agreement constitutes the entire understanding, is severable, cannot be assigned without consent, and may be executed in counterparts.',
        joint_venture: false,
        merger_acquisition: false,
        technology_collaboration: true,
        research_collaboration: false,
        investor_discussions: false,
        vendor_evaluation: false,
        cross_border_transaction: false,
        witnesses: '1. Mr. Dinesh Kumar (Bangalore)\n2. Ms. Sarah Mathews (Pune)',
        authorized_signatories: 'Signed for Apex AI: Mr. Aniket Sen; Signed for Vertex Innovations: Mr. Rajesh Pillai',
        execution_place: 'Bangalore',
        execution_date: today,
        annexures: 'Annexure A: Technical Architecture Scope Details'
    };

    const requiredFields = [
        'effective_date',
        'business_purpose',
        'party_a',
        'party_b',
        'authorized_representatives',
        'confidential_information_definition',
        'confidential_information_categories',
        'exclusions',
        'reciprocal_confidentiality_obligations',
        'permitted_disclosures',
        'intellectual_property_clause',
        'term_commencement',
        'agreement_duration',
        'confidentiality_survival_period',
        'remedies',
        'termination_clause',
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
            title: "Reciprocity Principle",
            content: "In a Mutual Confidentiality Agreement, both entities are held to standard reciprocal obligations to ensure balanced risk-sharing."
        },
        {
            title: "DPDP Compliance",
            content: "Aligns your technological collaboration under the Digital Personal Data Protection Act, 2023, protecting private data exchange."
        },
        {
            title: "Arbitration Seats",
            content: "Setting an explicit arbitration seat and venue prevents jurisdictional disputes during dispute resolution."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Mutual Confidentiality Agreement"
            description="Generate a professional Mutual Confidentiality Agreement (Two-Way NDA) establishing reciprocal protections for proprietary data."
            documentType="confidentiality-mutual"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a legally compliant Mutual Confidentiality Agreement suitable for partnerships, M&A due diligence, and collaborations."
            docxFilename="Mutual_Confidentiality_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <MutualNDAForm
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
