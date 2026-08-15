export const generateExperienceLetterPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
