export const generateIndependentContractorPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
