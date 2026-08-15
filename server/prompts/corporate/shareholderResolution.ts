// Shareholder Resolution Prompt Template
// Compliant with Companies Act, 2013 (India)

export const generateShareholderResolutionPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
