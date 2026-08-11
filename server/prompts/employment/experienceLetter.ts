export const generateExperienceLetterPrompt = (formData: any): string => {
    const data = {
        company_name: formData.company_name,
        company_type: formData.company_type || 'Private Limited',
        cin: formData.cin || '',
        registered_office: formData.registered_office,
        letter_number: formData.letter_number || '',
        issue_date: formData.issue_date,
        employee_name: formData.employee_name,
        employee_id: formData.employee_id || '',
        employment_type: formData.employment_type || 'Regular',
        designation: formData.designation,
        department: formData.department,
        joining_date: formData.joining_date,
        last_working_date: formData.last_working_date,
        employment_duration: formData.employment_duration,
        previous_designations: formData.previous_designations || '',
        responsibilities: formData.responsibilities,
        projects: formData.projects || '',
        achievements: formData.achievements || '',
        conduct_statement: formData.conduct_statement || '',
        exit_status: formData.exit_status || '',
        hr_representative: formData.hr_representative || '',
        authorized_signatory: formData.authorized_signatory,
        company_seal_required: !!formData.company_seal_required,
        execution_place: formData.execution_place,
        execution_date: formData.execution_date,
        additional_conditions: formData.additional_conditions || ''
    };

    return JSON.stringify(data, null, 2);
};
