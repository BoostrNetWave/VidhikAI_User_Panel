import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ArticlesOfAssociationForm from './ArticlesOfAssociationForm';

const ArticlesOfAssociationAgreement: React.FC = () => {
    const initialData = {
        companyName: 'Vidhik AI Solutions Private Limited',
        companyType: 'Private Limited',
        cin: 'U72900KA2023PTC198273',
        registeredOfficeState: 'Karnataka',
        effectiveDate: new Date().toISOString().split('T')[0],
        authorizedCapital: '10,00,000',
        paidUpShareCapital: '5,00,000',
        shareClasses: 'Equity Shares with voting rights, Class B Preference Shares',
        numberOfDirectors: '3',
        directorCategories: 'Managing Director, Independent Director, Nominee Director',
        quorumRequirements: '2 Directors or 1/3rd of total strength, whichever is higher',
        votingRights: 'One vote per equity share. E-voting permitted for general meetings.',
        dividendPolicy: 'Final dividend recommended by Board and declared by shareholders.',
        transferRestrictionsRequired: true,
        nomineeDirectorAllowed: true,
        retirementByRotationApplicable: false,
        commonSealRequired: false,
        listedCompany: false,
        section8Company: false,
        opcCompany: false,
        foreignShareholders: true,
        arbitrationClause: true,
        borrowingLimit: '50,00,000',
        additionalGovernanceClauses: 'The Board shall have the power to appoint an Advisory Committee for strategic decisions. Any dispute between shareholders shall be settled via arbitration in Mumbai.'
    };

    const sidebarTips = [
        { title: "Table F", content: "Most private companies adopt Table F of Schedule I as their model articles." },
        { title: "Share Transfer", content: "AOA must contain restrictions on the transfer of shares for private companies." },
        { title: "Director Powers", content: "Clearly define the powers and duties of directors to avoid future disputes." },
        { title: "Borrowing Powers", content: "Directors usually need specific authorization in AOA to borrow money beyond certain limits." },
        { title: "General Meetings", content: "Provisions for notice and quorum of meetings should comply with Section 101-103." }
    ];

    return (
        <DocumentBaseGenerator
            title="Articles of Association (AOA)"
            description="Generate internal rules and regulations for your company under Companies Act, 2013"
            documentType="aoa"
            initialFormData={initialData}
            docxFilename="articles-of-association.docx"
            sidebarDescription="The AOA contains the internal rules and regulations for the management of the company."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ArticlesOfAssociationForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default ArticlesOfAssociationAgreement;
