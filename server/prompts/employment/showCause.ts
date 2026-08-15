export const generateShowCausePrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
