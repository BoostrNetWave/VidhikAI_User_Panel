// MSA Prompt Template
// Specialized for framework agreements for ongoing services under Indian law

import { formatBasePrompt } from '../common/basePrompt';

export interface MSAData {
    // Party A (usually Provider)
    partyAName: string;
    partyAAddress: string;
    partyAType: 'Company' | 'LLP' | 'Proprietorship';
    partyAID: string; // CIN or GSTIN

    // Party B (usually Client)
    partyBName: string;
    partyBAddress: string;
    partyBType: 'Company' | 'LLP' | 'Proprietorship';
    partyBID: string;

    // Framework Details
    effectiveDate: string;
    initialTerm: string; // e.g., 3 years
    renewalTerms?: string; // e.g., automatic renewal for 1 year
    sowMechanism: string; // e.g., "Separate Statements of Work (SOW) for each project"

    // High Level Services
    serviceCategories: string; // e.g., IT Consulting, Digital Marketing

    // Financial Framework
    billingCycle: string; // e.g., Monthly
    lateInterestRate: string; // e.g., 18% p.a.
    liabilityCap: string; // e.g., "100% of fees paid in last 12 months"

    // Legal Framework
    confidentialityTerm: string;
    terminationNotice: string;
    nonSolicitationPeriod: string;
    governingLaw: string;
    jurisdiction: string;
}

export const generateMSAPrompt = (formData: MSAData): string => {
    const data = {
        service_provider_details: {
            name: formData.partyAName,
            address: formData.partyAAddress,
            type: formData.partyAType,
            id: formData.partyAID
        },
        client_details: {
            name: formData.partyBName,
            address: formData.partyBAddress,
            type: formData.partyBType,
            id: formData.partyBID
        },
        high_level_services: formData.serviceCategories,
        term_details: {
            effective_date: formData.effectiveDate,
            initial_term: formData.initialTerm,
            renewal_terms: formData.renewalTerms || "Mutually agreed in writing",
            sow_mechanism: formData.sowMechanism
        },
        payment_terms: {
            billing_cycle: formData.billingCycle,
            late_interest: formData.lateInterestRate,
            terms: "Payment within 15 days of invoice date"
        },
        gst_applicable: true,
        tds_applicable: true,
        ip_structure: {
            background_ip: "Remains with the respective owner",
            foreground_ip: "Transferred to Client upon full payment",
            license: "Provider retains non-exclusive license to use its tools"
        },
        liability_cap: formData.liabilityCap,
        dispute_resolution_details: {
            method: "Arbitration",
            governing_law: formData.governingLaw,
            jurisdiction: formData.jurisdiction
        },
        non_solicitation_required: true,
        subcontracting_allowed: false,
        data_processing_involved: false,
        additional_clauses: `Confidentiality: ${formData.confidentialityTerm}. Termination Notice: ${formData.terminationNotice}. Non-Solicitation: ${formData.nonSolicitationPeriod}.`
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** MASTER SERVICE AGREEMENT (MSA) - FRAMEWORK CONTRACT

APPLICABLE LAWS:
- Indian Contract Act, 1872
- Information Technology Act, 2000
- GST Act, 2017

INPUT DATA (JSON):
${JSON.stringify(formData, null, 2)}

Please generate the Master Service Agreement now based on this data and the provided system instructions.`;
};
