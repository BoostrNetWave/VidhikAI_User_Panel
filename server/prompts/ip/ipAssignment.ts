export const generateIPAssignmentPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
