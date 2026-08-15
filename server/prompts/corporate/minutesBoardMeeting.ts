// Minutes of Board Meeting Prompt Template
// Compliant with Section 118 of Companies Act, 2013 and SS-1

export const generateMinutesBoardMeetingPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
