export const generateDirectorAppointmentPrompt = (formData: any): string => {
    return JSON.stringify(formData, null, 2);
};
