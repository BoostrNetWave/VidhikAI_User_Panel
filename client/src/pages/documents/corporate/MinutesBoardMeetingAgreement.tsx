import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import MinutesBoardMeetingForm from './MinutesBoardMeetingForm';

const MinutesBoardMeetingAgreement: React.FC = () => {
    const initialData = {
companyName: 'Vidhik AI Solutions Private Limited',
                cin: 'U72900KA2024PTC123456',
                registeredOffice: 'No. 12, MG Road, Bangalore - 560001, Karnataka, India',
                meetingNumber: '02/2024-25',
                meetingDate: '2024-06-20',
                meetingTime: '11:00 AM',
                meetingVenue: 'Registered Office of the Company',
                chairpersonName: 'Mr. Rajesh Kumar',
                directorsPresent: 'Mr. Rajesh Kumar, Ms. Priya Sharma, Mr. Amit Singh',
                directorsAbsent: 'None',
                directorsOnLeave: 'Mr. Sunil Varma',
                invitees: 'Mr. Suresh (Statutory Auditor)',
                resolutionsPassed: '1. Noted the minutes of the previous board meeting held on April 15, 2024.\n2. Approved the quarterly financial results for the period ended March 31, 2024.\n3. Ratified the appointment of Mr. Sunil as the Internal Auditor.\n4. Authorized the opening of a new bank account with HDFC Bank.',
                interestedDirectors: 'None',
                conclusionTime: '12:30 PM',
                authorizedSignatory: 'Mr. Rajesh Kumar',
                otherBusiness: 'The Board discussed the expansion plans into the Middle East market.',
                nextMeetingInfo: 'The next meeting is tentatively scheduled for September 2024.'
    };

    const sidebarTips = [
        { title: "Statutory Requirement", content: "Section 118 of the Companies Act, 2013 requires every company to cause minutes of the proceedings of every board meeting to be prepared and signed." },
        { title: "Timeline", content: "Minutes should be recorded in the Minutes Book within 30 days of the conclusion of the meeting." },
        { title: "Secretarial Standard-1", content: "SS-1 provides detailed guidance on the format and content of board meeting minutes, including attendance and resolution details." },
        { title: "Signing", content: "Minutes must be signed and dated by the Chairman of the meeting or the Chairman of the next meeting." },
        { title: "Preservation", content: "Minutes of all meetings must be preserved permanently in physical or electronic form with Timestamp." }
    ];

    return (
        <DocumentBaseGenerator
            title="Minutes of Board Meeting"
            description="Official record of proceedings and resolutions passed during a meeting of the Board of Directors."
            documentType="minutes-board-meeting"
            initialFormData={initialData}
            docxFilename="minutes-board-meeting.docx"
            sidebarDescription="Minutes serve as the official legal record of board decisions and are critical for corporate compliance."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <MinutesBoardMeetingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default MinutesBoardMeetingAgreement;
