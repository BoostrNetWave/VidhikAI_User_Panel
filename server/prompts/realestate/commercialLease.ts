// Commercial Lease Agreement Prompt Template
// Specialized for Indian commercial property law

import { formatBasePrompt } from '../common/basePrompt';

export interface CommercialLeaseData {
    // Lessor (Landlord)
    lessorName: string;
    lessorAddress: string;
    lessorPAN: string;

    // Lessee (Tenant)
    lesseeName: string;
    lesseeAddress: string;
    lesseeID: string; // CIN

    // Property Details
    propertyAddress: string;
    unitDetails: string;
    area: string;

    // Term
    commencementDate: string;
    leaseTerm: string;
    lockInPeriod: string;

    // Rent & Security
    monthlyRent: string;
    escalationTerms: string;
    gstApplicable: boolean;
    securityDepositAmount: string;

    // Use & Maintenance
    permittedUse: string;
    maintenanceStructure: string;
    terminationNoticePeriod: string;

    // Legal
    disputeResolutionDetails: string;
    registrationResponsibility: string;
    additionalClauses?: string;
}

export const generateCommercialLeasePrompt = (formData: any): string => {
    const data = {
        lessor_details: {
            name: formData.lessorName,
            address: formData.lessorAddress,
            pan: formData.lessorPAN
        },
        lessee_details: {
            name: formData.lesseeName,
            address: formData.lesseeAddress,
            id: formData.lesseeID || formData.lesseePAN
        },
        property_address: formData.propertyAddress,
        unit_details: formData.unitDetails || formData.propertyType || "Commercial Unit",
        area: formData.area || formData.leaseArea,
        commencement_date: formData.commencementDate,
        lease_term: formData.leaseTerm,
        lock_in_period: formData.lockInPeriod,
        monthly_rent: formData.monthlyRent,
        escalation_terms: formData.escalationTerms || formData.escalationRate || "5% annual increase",
        gst_applicable: Boolean(formData.gstApplicable),
        security_deposit_amount: formData.securityDepositAmount || formData.securityDeposit,
        permitted_use: formData.permittedUse || "Commercial Office use",
        maintenance_structure: formData.maintenanceStructure || (formData.maintenanceCharges ? `Monthly maintenance: ${formData.maintenanceCharges}` : "As per society/building terms"),
        termination_notice_period: formData.terminationNoticePeriod || formData.noticePeriod || "3 Months",
        dispute_resolution_details: {
            method: "Arbitration",
            arbitration_clause: formData.disputeResolutionDetails || "Arbitration in jurisdiction of the property"
        },
        registration_responsibility: formData.registrationResponsibility || "Shared equally between Lessor and Lessee",
        additional_clauses: formData.additionalClauses || ""
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** COMMERCIAL LEASE AGREEMENT

APPLICABLE LAWS:
- Transfer of Property Act, 1882
- Registration Act, 1908
- Indian Stamp Act, 1899
- GST Act, 2017

INPUT DATA (JSON):
${JSON.stringify({ ...data, raw_inputs: formData }, null, 2)}

Please generate the Commercial Lease Agreement now based on this data and the provided system instructions.`;
};
