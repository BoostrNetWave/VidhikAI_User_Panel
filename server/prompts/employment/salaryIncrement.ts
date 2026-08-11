export const generateSalaryIncrementPrompt = (formData: any): string => {
    const data = {
        company_name: formData.company_name,
        company_type: formData.company_type || 'Private Limited',
        cin: formData.cin || '',
        registered_office: formData.registered_office,
        letter_number: formData.letter_number || '',
        issue_date: formData.issue_date,
        employee_name: formData.employee_name,
        employee_id: formData.employee_id || '',
        designation: formData.designation,
        department: formData.department,
        previous_ctc: formData.previous_ctc,
        revised_ctc: formData.revised_ctc,
        increment_amount: formData.increment_amount,
        increment_percentage: formData.increment_percentage,
        effective_date: formData.effective_date,
        revised_salary_structure: formData.revised_salary_structure,
        performance_bonus: formData.performance_bonus || '',
        variable_pay: formData.variable_pay || '',
        esop_details: formData.esop_details || '',
        promotion_details: formData.promotion_details || '',
        tax_notes: formData.tax_notes || '',
        statutory_deductions: formData.statutory_deductions,
        appointment_letter_reference: formData.appointment_letter_reference,
        employment_agreement_reference: formData.employment_agreement_reference || '',
        hr_representative: formData.hr_representative || '',
        authorized_signatory: formData.authorized_signatory,
        execution_place: formData.execution_place,
        execution_date: formData.execution_date,
        ctc_annexure_reference: formData.ctc_annexure_reference || '',
        appreciation_message: formData.appreciation_message || '',
        additional_conditions: formData.additional_conditions || ''
    };

    return JSON.stringify(data, null, 2);
};
