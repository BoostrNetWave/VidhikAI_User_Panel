export const generateProbationConfirmationPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
