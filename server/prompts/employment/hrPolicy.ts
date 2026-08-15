export const generateHRPolicyPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
