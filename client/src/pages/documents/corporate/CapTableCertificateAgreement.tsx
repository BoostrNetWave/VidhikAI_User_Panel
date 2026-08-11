import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import CapTableCertificateForm from './CapTableCertificateForm';

export default function CapTableCertificateAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'StellarAI Technologies Private Limited',
        company_type: 'Private Limited',
        cin: 'U72200KA2023PTC987654',
        registered_office: 'Level 5, Sector 6, HSR Layout, Bangalore, Karnataka 560102',
        certificate_date: today,
        effective_date: today,
        reference_number: 'CTC/2026/04',
        authorized_share_capital: 'INR 15,00,000',
        authorized_shares: '1,50,000',
        face_value: 'INR 10',
        share_classes: 'Equity Shares of INR 10 each',
        issued_share_capital: 'INR 10,00,000',
        subscribed_share_capital: 'INR 10,00,000',
        paid_up_share_capital: 'INR 10,00,000',
        shareholders: [
            { shareholder_name: 'Founder A', shareholder_type: 'Promoter', security_type: 'Equity', share_class: 'Equity', number_of_securities: '45,000', ownership_percentage: '45', fully_diluted_percentage: '37.5' },
            { shareholder_name: 'Founder B', shareholder_type: 'Promoter', security_type: 'Equity', share_class: 'Equity', number_of_securities: '45,000', ownership_percentage: '45', fully_diluted_percentage: '37.5' },
            { shareholder_name: 'Nexus Ventures LLP', shareholder_type: 'Investor', security_type: 'CCPS', share_class: 'Series A', number_of_securities: '10,000', ownership_percentage: '10', fully_diluted_percentage: '8.33' }
        ],
        esop_pool: 'Total ESOP Pool: 15,000 options (10% of fully diluted capital). Granted: 5,000 options. Unallocated: 10,000 options.',
        convertible_securities: 'Series A CCPS: 10,000 shares convertible to Equity on a 1:1 basis.\nConvertible Notes: Nexus Ventures holds a note of INR 25,00,000 convertible at next round.',
        fully_diluted_summary: 'Existing Equity: 90,000 shares (75.00%). Series A CCPS: 10,000 shares (8.33%). ESOP Pool: 20,000 options/shares (16.67%). Total Fully Diluted: 1,20,000 shares (100.00%).',
        transfer_restrictions: 'Right of First Refusal (ROFR) and Tag-Along rights apply to transfers as per the Shareholders Agreement dated June 15, 2024.',
        notes: 'All shareholdings certified as per statutory filings and Ben-2 returns.',
        startup: true,
        listed_company: false,
        foreign_investors: false,
        shareholders_agreement_exists: true,
        company_secretary: 'Mr. Ritesh Sen, FCS 9087',
        authorized_signatory: 'For StellarAI Technologies: Mr. Arvind Swamy (Director)',
        company_seal_required: true,
        execution_place: 'Bangalore',
        execution_date: today,
        additional_conditions: 'This certificate is issued to Nexus Ventures for due diligence purposes.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'cin',
        'registered_office',
        'certificate_date',
        'effective_date',
        'authorized_share_capital',
        'authorized_shares',
        'face_value',
        'share_classes',
        'issued_share_capital',
        'subscribed_share_capital',
        'paid_up_share_capital',
        'fully_diluted_summary',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Cap Table Certificate",
            content: "Certified capitalization sheet documenting current equity holders, option pools, and convertible securities."
        },
        {
            title: "Fully Diluted Capitalization",
            content: "Calculates ownership assuming all convertibles (CCPS, notes) convert and option pools are fully allocated."
        },
        {
            title: "Signatory Authority",
            content: "Must be signed by an authorized Director of the Company. If the Company has a Company Secretary, they should co-sign."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Cap Table Certificate"
            description="Generate a legally certified capitalization table and shareholding certificate under Indian corporate laws."
            documentType="cap-table-certificate"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator creates a comprehensive Cap Table Certificate certified by company executives."
            docxFilename="Cap_Table_Certificate.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <CapTableCertificateForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                    errors={validationErrors}
                />
            )}
        />
    );
}
