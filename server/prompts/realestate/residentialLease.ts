// Residential Lease Agreement Prompt Template
// Specialized for Indian residential property law

import { formatBasePrompt } from '../common/basePrompt';

export interface ResidentialLeaseData {
    // Landlord
    landlordName: string;
    landlordAddress: string;
    landlordPAN: string;

    // Tenant
    tenantName: string;
    tenantAddress: string;
    tenantID: string;

    // Property
    propertyAddress: string;
    propertyDescription: string;
    commencementDate: string;
    leaseDuration: string;

    // Financials
    monthlyRent: string;
    rentDueDate: string;
    escalationTerms?: string;
    securityDepositAmount: string;

    // Operational
    noticePeriod: string;
    lockInPeriod?: string;
    furnishingDetails?: string;
    parkingDetails?: string;
    societyRulesApplicable: boolean;

    // Legal
    disputeResolutionPreference: 'court' | 'arbitration';
    registrationResponsibility: string;
    additionalClauses?: string;
}

export const generateResidentialLeasePrompt = (formData: any): string => {
    const data = {
        landlord_details: {
            name: formData.landlordName,
            address: formData.landlordAddress,
            pan: formData.landlordPAN
        },
        tenant_details: {
            name: formData.tenantName,
            address: formData.tenantAddress,
            id: formData.tenantID || formData.tenantPAN
        },
        property_address: formData.propertyAddress,
        property_description: formData.propertyDescription || `${formData.propertyType || 'Residential Unit'} (${formData.leaseArea || ''})`,
        commencement_date: formData.commencementDate,
        lease_duration: formData.leaseDuration || formData.leaseTerm || '11 Months',
        monthly_rent: formData.monthlyRent,
        rent_due_date: formData.rentDueDate || 'On or before 5th of each calendar month',
        escalation_terms: formData.escalationTerms || 'None during 11-month tenure',
        security_deposit_amount: formData.securityDepositAmount || formData.securityDeposit,
        notice_period: formData.noticePeriod || '1 Month',
        lock_in_period: formData.lockInPeriod || 'None',
        furnishing_details: formData.furnishingDetails || 'Semi-furnished with standard fixtures and fittings',
        parking_details: formData.parkingDetails || '1 Dedicated car parking space',
        society_rules_applicable: formData.societyRulesApplicable !== false,
        dispute_resolution_preference: formData.disputeResolutionPreference || 'arbitration',
        registration_responsibility: formData.registrationResponsibility || 'Stamp duty and registration expenses shared equally',
        additional_clauses: formData.additionalClauses || (formData.maintenanceCharges ? `Maintenance charges: ${formData.maintenanceCharges} per month` : '')
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** RESIDENTIAL LEASE AGREEMENT

APPLICABLE LAWS:
- Transfer of Property Act, 1882
- Information Technology Act, 2000
- Registration Act, 1908
- Indian Stamp Act, 1899

INPUT DATA (JSON):
${JSON.stringify({ ...data, raw_inputs: formData }, null, 2)}

Please generate the Residential Lease Agreement now based on this data and the provided system instructions.`;
};
