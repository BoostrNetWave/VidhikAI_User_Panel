import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import MOAForm from './MOAForm';

const MOAAgreement: React.FC = () => {
    const initialData = {
        company_name: 'Vidhik AI Solutions Private Limited',
        company_type: 'Private Limited',
        cin: 'U72900KA2023PTC198273',
        date_of_incorporation: '2023-04-15',
        registered_office_state: 'Karnataka',
        main_objects: 'To carry on the business of providing artificial intelligence based legal technology solutions, document automation, and legal research services.',
        ancillary_objects: 'To acquire, build, and maintain software infrastructure, data centers, and related technologies for the fulfillment of main objects.',
        liability_type: 'Limited by Shares',
        authorized_share_capital: '10,00,000',
        number_of_equity_shares: '1,00,000',
        face_value_per_share: '10',
        preference_shares_details: 'None',
        subscriber_details: 'Rahul Sharma, S/o Sunil Sharma, R/o Mumbai, Occupation: Business, Nationality: Indian - 5,000 shares.\nPriya Singh, D/o Anand Singh, R/o Delhi, Occupation: Professional, Nationality: Indian - 5,000 shares.',
        witness_details: 'Mr. X, S/o Mr. Y, residing at 123, Main Street, Bangalore.',
        foreign_subscribers: false,
        section8_objectives: ''
    };

    const sidebarTips = [
        { title: "Objects Clause", content: "Ensure the main objects clearly define your core business. MCA is strict about vague object clauses." },
        { title: "Authorized Capital", content: "This is the maximum capital your company can issue. You can increase it later by passing a resolution." },
        { title: "Subscribers", content: "These are the initial shareholders who agree to take shares in the company upon incorporation." },
        { title: "Liability", content: "Most companies are 'Limited by Shares', meaning a shareholder's liability is limited to the unpaid amount on their shares." },
        { title: "Ancillary Objects", content: "These must be necessary for furthering the main objects, not entirely separate business activities." }
    ];

    return (
        <DocumentBaseGenerator
            title="Memorandum of Association (MOA)"
            description="Generate a legally compliant MOA under Companies Act, 2013"
            documentType="moa"
            initialFormData={initialData}
            docxFilename="memorandum-of-association.docx"
            sidebarDescription="The MOA is the primary governing document that defines the company's scope of operations and relationship with the outside world."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <MOAForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default MOAAgreement;
