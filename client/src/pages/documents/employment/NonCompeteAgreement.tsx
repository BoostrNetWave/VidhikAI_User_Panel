import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import NonCompeteForm from './NonCompeteForm';

export default function NonCompeteAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_date: today,
        first_party_name: 'Stark Enterprises Private Limited',
        first_party_type: 'Private Limited',
        first_party_address: '10th Floor, Arc Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
        second_party_name: 'Dr. Bruce Banner',
        second_party_type: 'Individual',
        second_party_address: 'Flat 702, Gamma Residences, Green Avenue, Pune, Maharashtra 411007',
        relationship_type: 'Employee',
        purpose: 'To protect the proprietary research, confidential trade secrets, and market goodwill of Stark Enterprises in relation to quantum computing and bio-technology projects.',
        business_interests: 'Confidential Information, Trade Secrets, Customer Relationships, Proprietary Technology, and Goodwill.',
        confidential_information_definition: 'All technical data, source codes, hardware designs, quantum formulas, bio-molecular structures, client lists, and strategic business plans shared by the First Party.',
        trade_secret_definition: 'The proprietary biochemical formulas and quantum simulation algorithms developed during the project.',
        restricted_activities: 'Engaging, advising, or working with any competitor developing quantum computing software or bio-technology solutions.',
        restricted_period: '12 Months post-separation',
        restricted_territory: 'Republic of India',
        non_solicitation: 'Second Party shall not solicit or hire First Party employees, nor solicit First Party active clients for a period of 12 months post-separation.',
        intellectual_property_clause: 'All intellectual property rights, discoveries, patents, and copyrightable works created during the engagement shall vest solely with Stark Enterprises.',
        consideration: 'The mutual covenants contained herein, the offer of employment, and access to highly confidential research tools.',
        exceptions: 'Academic publishing of general quantum theories that do not contain any proprietary or confidential Stark Enterprises data.',
        confidentiality_required: true,
        term: 'Co-terminus with the employment contract, with confidentiality and IP clauses surviving indefinitely.',
        termination_conditions: 'Upon termination of the underlying employment agreement or by mutual written consent of both parties.',
        notices: 'First Party: legal@starkenterprises.com, Arc Tower, Mumbai.\nSecond Party: bruce@gammaresidences.com, Gamma Residences, Pune.',
        governing_law: 'Laws of India',
        dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 in Mumbai by a sole arbitrator.',
        cross_border: false,
        founder_agreement: false,
        business_sale: false,
        employee_agreement: true,
        consultant_agreement: false,
        authorized_signatories: 'First Party Signatory: Mr. Pepper Potts (Chief Executive Officer)\nSecond Party Signatory: Dr. Bruce Banner',
        witness_details: 'Witness 1: Mr. Happy Hogan, Mumbai\nWitness 2: Ms. Natasha Romanoff, Mumbai',
        execution_place: 'Mumbai',
        execution_date: today,
        additional_conditions: 'This agreement is executed in two counterparts, each of which shall be deemed an original.'
    };

    const requiredFields = [
        'agreement_date',
        'first_party_name',
        'first_party_type',
        'first_party_address',
        'second_party_name',
        'second_party_type',
        'second_party_address',
        'relationship_type',
        'purpose',
        'business_interests',
        'confidential_information_definition',
        'restricted_activities',
        'intellectual_property_clause',
        'consideration',
        'term',
        'termination_conditions',
        'notices',
        'governing_law',
        'dispute_resolution',
        'authorized_signatories',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Section 27 Constraints",
            content: "Under Section 27 of the Indian Contract Act, post-employment non-competes are generally unenforceable. To optimize protection, rely heavily on robust confidentiality and client/employee non-solicitation clauses."
        },
        {
            title: "Legitimate Business Interest",
            content: "Ensure the agreement clearly defines Stark's proprietary technology or client goodwill being protected to justify the restrictions in court."
        },
        {
            title: "Severability Protection",
            content: "Always include a severability clause so that if the non-compete is struck down by a court, the confidentiality and IP assignment provisions remain valid."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Non-Compete Agreement"
            description="Generate a balanced Non-Compete Agreement protecting legitimate business interests within the constraints of Indian law."
            documentType="non-compete-agreement"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator drafts a Non-Compete Agreement tailored to Indian legal standards and Section 27 precedents."
            docxFilename="Non_Compete_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <NonCompeteForm
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
