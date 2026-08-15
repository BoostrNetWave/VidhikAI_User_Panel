// Share Subscription Agreement Prompt Template
// For equity investment and share issuance agreements

import { formatBasePrompt } from '../common/basePrompt';

export interface ShareSubscriptionData {
    // Company Details
    companyName: string;
    companyAddress: string;
    companyRegNumber: string;
    authorizedCapital: string;

    // Investor Details
    investorName: string;
    investorAddress: string;
    investorPAN?: string;

    // Share Details
    shareClass: 'Equity' | 'Preference';
    numberOfShares: string;
    faceValuePerShare: string;
    pricePerShare: string;
    totalInvestment: string;

    // Terms
    lockInPeriod?: string;
    tagAlongRights: 'Yes' | 'No';
    dragAlongRights: 'Yes' | 'No';
    preemptiveRights: 'Yes' | 'No';

    // Legal
    closingDate: string;
    governingLaw: string;
    jurisdiction: string;
}

export const generateShareSubscriptionPrompt = (formData: ShareSubscriptionData): string => {
    const data = {
        company_details: {
            name: formData.companyName,
            address: formData.companyAddress,
            reg_number: formData.companyRegNumber,
            authorized_capital: formData.authorizedCapital
        },
        investor_details: {
            name: formData.investorName,
            address: formData.investorAddress,
            pan: formData.investorPAN
        },
        share_class: formData.shareClass,
        number_of_shares: formData.numberOfShares,
        face_value: formData.faceValuePerShare,
        price_per_share: formData.pricePerShare,
        total_subscription_amount: formData.totalInvestment,
        closing_date: formData.closingDate,
        conditions_precedent: [
            "Board resolution authorizing share issuance",
            "Shareholder approval (if required)",
            "Regulatory approvals (if any)",
            "Due diligence completion"
        ],
        covenants: {
            preemptive_rights: formData.preemptiveRights,
            tag_along_rights: formData.tagAlongRights,
            drag_along_rights: formData.dragAlongRights,
            lock_in_period: formData.lockInPeriod
        },
        dispute_resolution_details: {
            governing_law: formData.governingLaw,
            jurisdiction: formData.jurisdiction
        },
        fdi_applicable: false // Default to false unless investor is clearly foreign
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** SHARE SUBSCRIPTION AGREEMENT

INPUT FORMAT (JSON):
${JSON.stringify(formData, null, 2)}

Please generate the Share Subscription Agreement now based on this data and the provided system instructions.`;
};
