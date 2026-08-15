export const generateShareTransferPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
