// Memorandum of Association (MOA) Prompt Template
// Compliant with Companies Act, 2013 (India)

export interface MOAFormData {
    company_name?: string;
    companyName?: string;
    company_type?: string;
    companyType?: string;
    cin?: string;
    date_of_incorporation?: string;
    registered_office_state?: string;
    registeredOfficeState?: string;
    main_objects?: string;
    ancillary_objects?: string;
    section8_objectives?: string;
    liability_type?: string;
    authorized_share_capital?: string;
    number_of_equity_shares?: string;
    face_value_per_share?: string;
    preference_shares_details?: string;
    subscriber_details?: string;
    witness_details?: string;
    foreign_subscribers?: boolean;
}

export const generateMOAPrompt = (formData: MOAFormData): string => {
    const structured = {
        company_details: {
            company_name: formData.company_name || formData.companyName || "Vidhik AI Solutions Private Limited",
            company_type: formData.company_type || formData.companyType || "Private Limited",
            cin: formData.cin || "Under Incorporation",
            date_of_incorporation: formData.date_of_incorporation || new Date().toISOString().split('T')[0],
            registered_office_state: formData.registered_office_state || formData.registeredOfficeState || "Karnataka"
        },
        objects_clause: {
            main_objects: formData.main_objects || "To carry on the business of providing artificial intelligence based legal technology solutions, document automation, and legal research services.",
            ancillary_objects: formData.ancillary_objects || "To acquire, build, and maintain software infrastructure, data centers, and related technologies for the fulfillment of main objects.",
            section8_specific_objectives: formData.section8_objectives || ""
        },
        capital_and_liability: {
            liability_type: formData.liability_type || "Limited by Shares",
            authorized_share_capital: formData.authorized_share_capital || "10,00,000",
            number_of_equity_shares: formData.number_of_equity_shares || "1,00,000",
            face_value_per_share: formData.face_value_per_share || "10",
            preference_shares_details: formData.preference_shares_details || "None"
        },
        subscribers_and_signatories: {
            subscribers: formData.subscriber_details || "Rahul Sharma, S/o Sunil Sharma, R/o Mumbai, Occupation: Business, Nationality: Indian - 5,000 shares.\nPriya Singh, D/o Anand Singh, R/o Delhi, Occupation: Professional, Nationality: Indian - 5,000 shares.",
            witness: formData.witness_details || "Mr. X, S/o Mr. Y, residing at 123, Main Street, Bangalore.",
            foreign_subscribers_present_fema: Boolean(formData.foreign_subscribers)
        },
        raw_inputs: formData
    };

    return JSON.stringify(structured, null, 2);
};

