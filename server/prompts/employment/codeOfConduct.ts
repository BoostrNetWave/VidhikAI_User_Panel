export const generateCodeOfConductPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
