import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ShareholderResolutionForm from './ShareholderResolutionForm';

const ShareholderResolutionAgreement: React.FC = () => {
    const initialData = {
companyName: 'Vidhik AI Solutions Private Limited',
                cin: 'U74999KA2022PTC158273',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                meetingType: 'Extra-Ordinary General Meeting',
                meetingDate: '2024-05-15',
                meetingTime: '11:00 AM',
                meetingVenue: 'Registered Office at Bangalore',
                chairpersonName: 'Amit Shah',
                quorumPresent: true,
                resolutionType: 'Special Resolution',
                subjectMatter: 'Increase in Authorized Share Capital',
                resolutionDetails: 'Approval for the issuance of 10,000 Equity Shares of INR 10 each at a premium of INR 90 per share to existing shareholders on a rights basis.',
                statutoryReference: 'Section 61 of the Companies Act, 2013',
                authorizedPersonDetails: 'Vikram Singh (Director, DIN: 01234567)',
                certificationSignatory: 'Amit Shah (Director, DIN: 08765432)',
                placeOfSigning: 'Bangalore',
                proxies: 'Mr. Rahul Dravid (Proxy for Mr. Sachin Tendulkar)'
    };

    const sidebarTips = [
        { title: "Meeting Types", content: "AGMs are annual. EGMs are for urgent matters between AGMs." },
        { title: "Quorum", content: "Ensure the meeting has the required quorum as per Section 103 of Companies Act, 2013." },
        { title: "Special vs Ordinary", content: "Specify if the resolution is 'Ordinary' (simple majority) or 'Special' (75% majority)." },
        { title: "Notice Period", content: "General meetings usually require 21 clear days' notice unless shorter notice is agreed." },
        { title: "Proxies", content: "Members have a right to appoint proxies to attend and vote on their behalf." }
    ];

    return (
        <DocumentBaseGenerator
            title="Shareholder Resolution"
            description="Generate formal decisions and resolutions passed by company shareholders."
            documentType="shareholder-resolution"
            initialFormData={initialData}
            docxFilename="shareholder-resolution.docx"
            sidebarDescription="Shareholder resolutions are official records of decisions made by the owners of the company."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ShareholderResolutionForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default ShareholderResolutionAgreement;
