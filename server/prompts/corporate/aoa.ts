// Articles of Association (AOA) Prompt Template
// Compliant with Companies Act, 2013 (India)

export interface AOAFormData {
    companyName?: string;
    company_name?: string;
    companyType?: string;
    company_type?: string;
    cin?: string;
    registeredOfficeState?: string;
    registered_office_state?: string;
    effectiveDate?: string;
    effective_date?: string;
    authorizedCapital?: string;
    authorized_capital?: string;
    paidUpShareCapital?: string;
    paid_up_share_capital?: string;
    shareClasses?: string;
    share_classes?: string;
    numberOfDirectors?: string;
    number_of_directors?: string;
    directorCategories?: string;
    director_categories?: string;
    quorumRequirements?: string;
    quorum_requirements?: string;
    votingRights?: string;
    voting_rights?: string;
    dividendPolicy?: string;
    dividend_policy?: string;
    transferRestrictionsRequired?: boolean;
    nomineeDirectorAllowed?: boolean;
    retirementByRotationApplicable?: boolean;
    commonSealRequired?: boolean;
    listedCompany?: boolean;
    section8Company?: boolean;
    opcCompany?: boolean;
    foreignShareholders?: boolean;
    arbitrationClause?: boolean;
    borrowingLimit?: string;
    borrowing_limit?: string;
    additionalGovernanceClauses?: string;
    additional_governance_clauses?: string;
}

export const generateAOAPrompt = (formData: AOAFormData): string => {
    const structured = {
        company_details: {
            company_name: formData.companyName || formData.company_name || "Vidhik AI Solutions Private Limited",
            company_type: formData.companyType || formData.company_type || "Private Limited",
            cin: formData.cin || "Under Incorporation",
            registered_office_state: formData.registeredOfficeState || formData.registered_office_state || "Karnataka",
            effective_date: formData.effectiveDate || formData.effective_date || new Date().toISOString().split('T')[0]
        },
        capital_structure: {
            authorized_share_capital: formData.authorizedCapital || formData.authorized_capital || "10,00,000",
            paid_up_share_capital: formData.paidUpShareCapital || formData.paid_up_share_capital || "5,00,000",
            share_classes_and_rights: formData.shareClasses || formData.share_classes || "Equity Shares with voting rights, Class B Preference Shares",
            share_transfer_restrictions_required: formData.transferRestrictionsRequired !== false
        },
        board_governance: {
            number_of_directors: formData.numberOfDirectors || formData.number_of_directors || "3",
            director_categories: formData.directorCategories || formData.director_categories || "Managing Director, Independent Director, Nominee Director",
            quorum_requirements: formData.quorumRequirements || formData.quorum_requirements || "2 Directors or 1/3rd of total strength, whichever is higher",
            nominee_director_allowed: Boolean(formData.nomineeDirectorAllowed),
            retirement_by_rotation: Boolean(formData.retirementByRotationApplicable),
            borrowing_limit: formData.borrowingLimit || formData.borrowing_limit || "50,00,000"
        },
        shareholder_and_meetings: {
            voting_rights: formData.votingRights || formData.voting_rights || "One vote per equity share. E-voting permitted for general meetings.",
            dividend_policy: formData.dividendPolicy || formData.dividend_policy || "Final dividend recommended by Board and declared by shareholders.",
            common_seal_required: Boolean(formData.commonSealRequired),
            arbitration_clause_included: Boolean(formData.arbitrationClause)
        },
        special_clauses_and_regulatory: {
            is_listed_company_sebi: Boolean(formData.listedCompany),
            is_section8_company: Boolean(formData.section8Company),
            is_one_person_company: Boolean(formData.opcCompany),
            has_foreign_shareholders_fema: Boolean(formData.foreignShareholders),
            additional_governance_clauses: formData.additionalGovernanceClauses || formData.additional_governance_clauses || ""
        },
        raw_inputs: formData
    };

    return JSON.stringify(structured, null, 2);
};

