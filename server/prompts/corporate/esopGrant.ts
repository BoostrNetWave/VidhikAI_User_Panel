export const generateESOPGrantPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
