import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import DirectorResignationForm from './DirectorResignationForm';

const DirectorResignationAgreement: React.FC = () => {
    const initialData = {
companyName: 'Vidhik AI Solutions Private Limited',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                directorName: 'Mr. Arvind Kejriwal',
                din: '01234567',
                designation: 'Independent Director',
                resignationDate: new Date().toISOString().split('T')[0],
                effectiveDate: new Date().toISOString().split('T')[0],
                reason: 'Due to personal reasons and other professional commitments.',
                transitionSupportRequired: true,
                additionalStatements: 'I confirm that there are no outstanding claims or disputes with the company.'
    };

    return (
        <DocumentBaseGenerator
            documentType="director-resignation"
            title="Resignation of Director Letter"
            description="Letter for director resignation addressed to the Board of Directors of an Indian company."
            initialFormData={initialData}
            sidebarTips={[
                { title: "Statutory Filing", content: "The resignation must be filed with the ROC in Form DIR-12 within 30 days." },
                { title: "Effective Date", content: "Ensure the effective date matches your actual last day of service for legal clarity." }
            ]}
            sidebarDescription="Generate a legally compliant resignation letter suitable for board submission and ROC filing."
            docxFilename="Director_Resignation_Letter.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <DirectorResignationForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default DirectorResignationAgreement;
