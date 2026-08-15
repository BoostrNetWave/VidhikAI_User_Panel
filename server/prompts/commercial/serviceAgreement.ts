// B2B Service Agreement Prompt Template
// Specialized for commercial service contracts under Indian law

import { formatBasePrompt } from '../common/basePrompt';

export interface ServiceAgreementData {
    // Service Provider (Party A)
    providerName: string;
    providerAddress: string;
    providerType: 'Company' | 'LLP' | 'Proprietorship';
    providerID: string; // CIN or GSTIN

    // Client (Party B)
    clientName: string;
    clientAddress: string;
    clientType: 'Company' | 'LLP' | 'Proprietorship';
    clientID: string;

    // Engagement Details
    effectiveDate: string;
    expiryDate: string;
    servicesDescription: string;
    milestones?: string;

    // Commercial Terms
    fees: string;
    paymentTerms: string;
    latePaymentPenalty?: string;

    // IP and Legal
    ipOwnership: 'Provider' | 'Client' | 'Joint';
    confidentialityPeriod: string;
    terminationNotice: string;
    governingLaw: string;
    jurisdiction: string;
}

export const generateServiceAgreementPrompt = (formData: ServiceAgreementData): string => {
    const data = {
        service_provider_details: {
            name: formData.providerName,
            address: formData.providerAddress,
            type: formData.providerType,
            id: formData.providerID
        },
        client_details: {
            name: formData.clientName,
            address: formData.clientAddress,
            type: formData.clientType,
            id: formData.clientID
        },
        scope_of_services: formData.servicesDescription,
        deliverables: formData.milestones || "As specified in the scope of services",
        fee_structure: formData.fees,
        payment_terms: formData.paymentTerms,
        gst_applicable: true,
        service_levels: "Standard professional service levels and response times",
        ip_structure: formData.ipOwnership === 'Client'
            ? "Work-for-hire: Client owns all IP in deliverables"
            : formData.ipOwnership === 'Provider'
                ? "Provider retains IP; Client receives non-exclusive license"
                : "Joint ownership of deliverables",
        term_details: {
            effective_date: formData.effectiveDate,
            expiry_date: formData.expiryDate || 'Perpetual until terminated'
        },
        termination_terms: {
            notice_period: formData.terminationNotice,
            for_convenience: true
        },
        liability_cap: "100% of fees paid in the twelve (12) months preceding the claim",
        dispute_resolution_details: {
            method: "Arbitration",
            jurisdiction: formData.jurisdiction,
            governing_law: formData.governingLaw
        },
        non_solicitation_required: true,
        data_processing_involved: false,
        additional_clauses: `Late Payment Penalty: ${formData.latePaymentPenalty || 'None'}. Confidentiality Period: ${formData.confidentialityPeriod}.`
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** B2B MASTER SERVICE AGREEMENT (MSA)

APPLICABLE LAWS:
- Indian Contract Act, 1872
- Information Technology Act, 2000
- GST Act, 2017

INPUT DATA (JSON):
${JSON.stringify(formData, null, 2)}

Please generate the B2B Service Agreement now based on this data and the provided system instructions.`;
};
