// Articles of Association (AOA) Prompt Template
// Compliant with Companies Act, 2013 (India)

export const generateAOAPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
