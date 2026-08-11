import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import TrademarkLicenseForm from './TrademarkLicenseForm';

export default function TrademarkLicenseAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        agreement_number: 'TML-2026/042',
        effective_date: today,
        commercial_purpose: 'Grant of exclusive trademark license for manufacturing, marketing, distributing, and selling premium consumer lifestyle products and apparel under the licensed brand name across India.',
        licensor: 'Acme Brand Holdings Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Landmark Towers, Bandra-Kurla Complex, Mumbai, Maharashtra 400051, India',
        licensee: 'Vanguard Retail Enterprises Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Brigade Gateway, Rajajinagar, Bangalore, Karnataka 560055, India',
        authorized_representatives: 'Licensor: Mr. Vikram Shah (Director); Licensee: Ms. Deepal Parekh (Managing Director)',
        trademark_details: 'Registered Word Mark "NEXUS LIFE" and Formative Logo Device (Class 25 & Class 35)',
        trademark_registration_numbers: 'Trademark Registration No. 4812904 in Class 25 (Apparel) and Registration No. 5102938 in Class 35 (Retail Services)',
        pending_trademark_applications: 'Application No. 6102948 in Class 18 (Footwear & Leather Accessories)',
        licensed_goods_services: 'Apparel, Footwear, Fashion Accessories, Retail Store Operations, and E-commerce Brand Outlets',
        license_type: 'Exclusive',
        territory: 'Territory of India and SAARC Member States',
        license_duration: '5 (Five) Years from the Effective Date, renewable upon mutual consent',
        permitted_use: 'Use of the Licensed Mark exclusively on approved products, packaging, point-of-sale displays, marketing collateral, and official brand website.',
        quality_control_requirements: 'Strict compliance with Licensor Brand Manual (v3.0), mandatory sample approval prior to production batches, quarterly quality inspections, and immediate recall of non-conforming items.',
        royalty_structure: 'Royalty rate of 6% (six percent) of Quarterly Net Sales, subject to an Annual Minimum Guarantee of INR 20,00,000 (Rupees Twenty Lakhs Only).',
        payment_terms: 'Royalties payable within 30 (thirty) days following the end of each calendar quarter along with Net Sales certified statement.',
        taxes: 'All payments subject to applicable Goods and Services Tax (GST) and Tax Deducted at Source (TDS) as per Indian Income Tax Act, 1961.',
        audit_rights: 'Licensor retains right to appoint an independent Chartered Accountant to audit Licensee books and sales records once per financial year upon 14 days notice.',
        restrictions: 'No sub-licensing, assignment, alteration of trademark geometry or color codes, domain registration containing the Mark, or anti-competitive brand dilution.',
        representations_and_warranties: 'Licensor represents sole ownership of valid trademark registrations; Licensee warrants compliance with quality standards and statutory laws.',
        infringement_clause: 'Licensee shall promptly notify Licensor of any unauthorized third-party trademark infringement; Licensor retains primary right to institute enforcement actions.',
        confidentiality_clause: 'Both parties agree to preserve confidentiality of royalty figures, sales statements, brand manuals, and technical specifications.',
        termination_clause: 'Licensor may terminate upon 30 days written notice for uncured material breach, insolvency, quality failure, or non-payment of royalties.',
        post_termination_obligations: 'Licensee shall immediately cease brand usage, destroy or return point-of-sale displays, and sell off existing stock within a 90-day sell-off period.',
        notice_details: 'Licensor: legal@acmebrands.com, BKC Mumbai; Licensee: compliance@vanguardretail.in, Rajajinagar Bangalore.',
        governing_law: 'Laws of India (including Trade Marks Act, 1999 & Indian Contract Act, 1872)',
        dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator appointed by mutual agreement.',
        arbitration_details: 'Seat and venue of arbitration at Mumbai, Maharashtra, conducted in the English language.',
        jurisdiction: 'Courts at Mumbai, Maharashtra, India',
        miscellaneous_clauses: 'Entire Agreement, Amendments in writing only, Severability, Counterparts, and Electronic Signatures under IT Act, 2000.',
        franchise_license: false,
        brand_license: true,
        software_branding: false,
        merchandise_license: true,
        international_license: false,
        co_branding: false,
        ecommerce_distribution: true,
        witnesses: '1. Mr. Rohan Kapoor (Mumbai); 2. Ms. Swati Nair (Bangalore)',
        authorized_signatories: 'Licensor: Mr. Vikram Shah (Director); Licensee: Ms. Deepal Parekh (MD)',
        execution_place: 'Mumbai',
        execution_date: today,
        annexures: 'Annexure A: Schedule of Licensed Trademarks & Certificates; Annexure B: Brand Quality Guidelines Manual.'
    };

    const requiredFields = [
        'effective_date',
        'commercial_purpose',
        'licensor',
        'licensee',
        'authorized_representatives',
        'trademark_details',
        'trademark_registration_numbers',
        'licensed_goods_services',
        'license_type',
        'territory',
        'license_duration',
        'permitted_use',
        'quality_control_requirements',
        'royalty_structure',
        'payment_terms',
        'taxes',
        'restrictions',
        'representations_and_warranties',
        'infringement_clause',
        'termination_clause',
        'post_termination_obligations',
        'notice_details',
        'governing_law',
        'dispute_resolution',
        'jurisdiction',
        'miscellaneous_clauses',
        'authorized_signatories',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "Quality Control & Validity",
            content: "Under Section 48 & 49 of Trade Marks Act 1999, quality control by the licensor is legally essential to prevent the mark from becoming deceptive or losing distinctiveness."
        },
        {
            title: "Registered User Recordal",
            content: "Licensor and licensee may apply to the Registrar of Trade Marks (Form TM-U) to register the licensee as a 'Registered User'."
        },
        {
            title: "Goodwill Reservation",
            content: "Ensure the license deed explicitly states that all goodwill generated through licensee's usage inures exclusively to the licensor."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Trademark License Agreement"
            description="Generate a legally compliant Trademark License Agreement granting usage rights while preserving brand ownership, goodwill, and quality standards under the Trade Marks Act, 1999."
            documentType="trademark-license"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="Drafted in accordance with the Trade Marks Act 1999, Trade Marks Rules 2017, and Indian Contract Act 1872."
            docxFilename="Trademark_License_Agreement.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <TrademarkLicenseForm
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
