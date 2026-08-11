export const generateCapTableCertPrompt = (formData: any): string => {
    const data = {
        company_name: formData.company_name,
        company_type: formData.company_type || 'Private Limited',
        cin: formData.cin,
        registered_office: formData.registered_office,
        certificate_date: formData.certificate_date,
        effective_date: formData.effective_date,
        reference_number: formData.reference_number || '',
        authorized_share_capital: formData.authorized_share_capital,
        authorized_shares: formData.authorized_shares,
        face_value: formData.face_value,
        share_classes: formData.share_classes,
        issued_share_capital: formData.issued_share_capital,
        subscribed_share_capital: formData.subscribed_share_capital,
        paid_up_share_capital: formData.paid_up_share_capital,
        shareholders: formData.shareholders || [],
        esop_pool: formData.esop_pool || '',
        convertible_securities: formData.convertible_securities || '',
        fully_diluted_summary: formData.fully_diluted_summary,
        transfer_restrictions: formData.transfer_restrictions || '',
        notes: formData.notes || '',
        startup: !!formData.startup,
        listed_company: !!formData.listed_company,
        foreign_investors: !!formData.foreign_investors,
        shareholders_agreement_exists: !!formData.shareholders_agreement_exists,
        company_secretary: formData.company_secretary || '',
        authorized_signatory: formData.authorized_signatory,
        company_seal_required: !!formData.company_seal_required,
        execution_place: formData.execution_place,
        execution_date: formData.execution_date,
        additional_conditions: formData.additional_conditions || ''
    };

    return JSON.stringify(data, null, 2);
};
