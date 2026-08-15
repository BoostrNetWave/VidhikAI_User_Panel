import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import NoticeBoardMeetingForm from './NoticeBoardMeetingForm';

const NoticeBoardMeetingAgreement: React.FC = () => {
    const initialData = {
companyName: 'Vidhik AI Solutions Private Limited',
                cin: 'U74999KA2022PTC158273',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                noticeDate: new Date().toISOString().split('T')[0],
                meetingDate: '2024-06-20',
                meetingDay: 'Thursday',
                meetingTime: '11:00 AM',
                meetingVenue: 'Registered Office at Bangalore',
                modeOfMeeting: 'physical',
                agenda: '1. To confirm minutes of previous meeting\n2. To consider and approve financial statements\n3. To approve appointment of new director\n4. Opening of new bank account\n5. Any other business with permission of chair',
                directorsList: 'Anand Sharma, Rahul Varma, Aditi Nair',
                issuingAuthorityName: 'Amit Shah',
                issuingAuthorityDesignation: 'Director',
                virtualOption: true
    };

    const sidebarTips = [
        { title: "Statutory Requirement", content: "Section 173(3) requires every board meeting to be called by giving at least 7 days' notice." },
        { title: "Agenda", content: "While not explicitly mandated by Sec 173, SS-1 requires the agenda to be sent at least 7 days before the meeting." },
        { title: "Virtual Meetings", content: "Directors can participate via video call. The notice must specify the options for such participation." },
        { title: "Shorter Notice", content: "To transact urgent business, a meeting may be called at shorter notice if at least one independent director is present." },
        { title: "Mode of Delivery", content: "Notice must be delivered by hand, post, or electronic means (Email)." }
    ];

    return (
        <DocumentBaseGenerator
            title="Notice of Board Meeting"
            description="Official notice to directors for calling a meeting of the Board of Directors."
            documentType="notice-board-meeting"
            initialFormData={initialData}
            docxFilename="notice-board-meeting.docx"
            sidebarDescription="A formal notice is a statutory requirement before any valid Board Meeting can take place."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <NoticeBoardMeetingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default NoticeBoardMeetingAgreement;
