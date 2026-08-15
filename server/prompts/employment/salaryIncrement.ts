export const generateSalaryIncrementPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
