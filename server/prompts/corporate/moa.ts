// Memorandum of Association (MOA) Prompt Template
// Compliant with Companies Act, 2013 (India)

export const generateMOAPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
