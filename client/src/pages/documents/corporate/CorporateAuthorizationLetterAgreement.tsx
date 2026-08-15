import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import CorporateAuthorizationLetterForm from './CorporateAuthorizationLetterForm';

const CorporateAuthorizationLetterAgreement: React.FC = () => {
    const initialData = {
companyName: 'Vidhik AI Solutions Private Limited',
                companyCin: 'U74999KA2023PTC123456',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                authorizedPersonName: 'Mr. Rajesh Kumar',
                authorizedPersonDesignation: 'Vice President - Operations',
                idDetails: 'PAN: ABCPK1234L',
                authorityRecipient: 'The Branch Manager, HDFC Bank, MG Road Branch, Bangalore',
                purposeOfAuthorization: 'To represent the company for opening and operating a new current account.',
                scopeDetails: 'To sign all necessary documents, KYC forms, and account opening mandates on behalf of the company.',
                monetaryLimit: 'No specific monetary limit for account opening.',
                validityStartDate: new Date().toISOString().split('T')[0],
                validityEndDate: '',
                boardResolutionDate: '2024-02-15',
                revocable: true,
                additionalConditions: 'This authorization is specific to the HDFC Bank MG Road branch and shall not be used elsewhere.'
    };

    return (
        <DocumentBaseGenerator
            documentType="corporate-authorization-letter"
            title="Corporate Authorization Letter"
            description="Letter authorizing a person to act for a company for a specified purpose."
            initialFormData={initialData}
            sidebarTips={[
                { title: "Limited Authority", content: "Always specify the exact scope of authority to prevent unauthorized actions." },
                { title: "Validity Period", content: "It's best practice to include a validity start and end date for control." },
                { title: "Board Resolution", content: "Mentioning a Board Resolution adds legal weight and confirms corporate approval." }
            ]}
            sidebarDescription="Generate a legally valid authorization letter suitable for banks, authorities, and vendors."
            docxFilename="Corporate_Authorization_Letter.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <CorporateAuthorizationLetterForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default CorporateAuthorizationLetterAgreement;
