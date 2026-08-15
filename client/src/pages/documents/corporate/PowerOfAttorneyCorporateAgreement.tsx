import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import PowerOfAttorneyCorporateForm from './PowerOfAttorneyCorporateForm';

const PowerOfAttorneyCorporateAgreement: React.FC = () => {
    const initialData = {
company_name: 'TechFlow Solutions Private Limited',
                company_cin: 'U72900KA2022PTC123456',
                registered_office: '12th Floor, Cyber Hub, Outer Ring Road, Bangalore, Karnataka 560103',
                authorized_signatory_name: 'Mr. Arvind Swamy',
                authorized_signatory_designation: 'Managing Director',
                board_resolution_date: '2024-03-01',
                attorney_name: 'Mr. Kavita Rao',
                attorney_address: 'No. 45, Residency Road, Bangalore, Karnataka 560025',
                attorney_id_details: 'PAN: ABCPR1234M, Aadhar: 1234 5678 9012',
                purpose_of_poa: 'To represent the Company before the Registrar of Companies and other statutory authorities for the purpose of filing annual returns and corporate governance compliance.',
                specific_powers: [
                    'To sign and file Form MGT-7 and AOC-4 with the MCA.',
                    'To represent the Company before the Regional Director and Registrar of Companies.',
                    'To execute declarations and affidavits required for ROC filings.',
                    'To appoint professionals for assisted filings.'
                ],
                monetary_limit: 'Limited to payment of statutory filing fees up to INR 50,000.',
                geographic_limit: 'Within the jurisdiction of RoC Bangalore and RD Southeast Region.',
                delegation_allowed: false,
                effective_date: new Date().toISOString().split('T')[0],
                expiry_date: '2025-03-31',
                revocable: true,
                registration_required: false,
                additional_clauses: 'The attorney shall provide a monthly report of all filings done under this Power of Attorney.'
    };

    return (
        <DocumentBaseGenerator
            documentType="power-of-attorney-corporate"
            title="Power of Attorney (Corporate)"
            description="Legal document for corporate representation authorizing an individual to act on behalf of the company."
            initialFormData={initialData}
            sidebarTips={[
                { title: "Define Scope Clearly", content: "Avoid blanket 'all acts' language. Specify exactly what the attorney can and cannot do." },
                { title: "Registration", content: "PoAs involving property rights or high-value transactions often require mandatory registration before a Sub-Registrar." },
                { title: "Revocation", content: "Ensure you maintain the right to revoke the PoA unless it's intended to be irrevocable for a specific reason." }
            ]}
            sidebarDescription="Generate a legally enforceable Corporate Power of Attorney compliant with Indian laws."
            docxFilename="Power_of_Attorney_Corporate.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <PowerOfAttorneyCorporateForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default PowerOfAttorneyCorporateAgreement;
