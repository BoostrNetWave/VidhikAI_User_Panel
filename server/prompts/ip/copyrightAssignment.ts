// Copyright Assignment Prompt Template
// Specialized for transfer of copyright ownership under Indian law

import { formatBasePrompt } from '../common/basePrompt';

export interface CopyrightAssignmentData {
    // Assignor (Transferor)
    assignorName: string;
    assignorAddress: string;
    assignorType: 'Individual' | 'Company' | 'Firm';
    assignorID?: string; // PAN or CIN

    // Assignee (Transferee)
    assigneeName: string;
    assigneeAddress: string;
    assigneeType: 'Individual' | 'Company' | 'Firm';
    assigneeID?: string; // PAN or CIN

    // Work Details
    workTitle: string;
    workDescription: string;
    workType: 'Literary' | 'Artistic' | 'Musical' | 'Software/Code' | 'Cinematograph Film' | 'Sound Recording';
    creationDate: string;

    // Assignment Terms
    considerationAmount: string; // "Nominal", specific amount, or "Work for Hire"
    territory: string; // e.g., "Worldwide"
    duration: string; // e.g., "Perpetual" or specific years
    rightsAssigned: string; // e.g., "All exclusive rights including reproduction, distribution..."

    // Additional Details
    effectiveDate: string;
    governingLaw: string;
    jurisdiction: string;
}

export const generateCopyrightAssignmentPrompt = (formData: CopyrightAssignmentData): string => {
    const data = {
        assignor_details: {
            name: formData.assignorName,
            address: formData.assignorAddress,
            type: formData.assignorType,
            id: formData.assignorID
        },
        assignee_details: {
            name: formData.assigneeName,
            address: formData.assigneeAddress,
            type: formData.assigneeType,
            id: formData.assigneeID
        },
        description_of_work: formData.workDescription,
        type_of_work: formData.workType,
        date_of_creation: formData.creationDate,
        registration_details: "To be registered if required by Assignee",
        territory: formData.territory,
        duration: formData.duration,
        consideration_amount: formData.considerationAmount,
        payment_terms: "One-time payment upon execution",
        gst_applicable: false,
        indemnity_required: true,
        arbitration_details: `Arbitration in ${formData.jurisdiction || 'India'} as per Arbitration and Conciliation Act, 1996`,
        additional_clauses: `Rights Assigned: ${formData.rightsAssigned}`
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** COPYRIGHT ASSIGNMENT AGREEMENT

APPLICABLE LAWS:
- Indian Copyright Act, 1957
- Indian Contract Act, 1872

INPUT DATA (JSON):
${JSON.stringify(formData, null, 2)}

Please generate the Copyright Assignment Agreement now based on this data and the provided system instructions.`;
};
