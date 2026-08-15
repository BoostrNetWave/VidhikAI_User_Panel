export const generateInternshipAgreementPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
