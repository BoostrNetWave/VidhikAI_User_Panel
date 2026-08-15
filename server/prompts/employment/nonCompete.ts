export const generateNonCompetePrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
