import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ESOPGrantLetterForm from './ESOPGrantLetterForm';

export default function ESOPGrantLetterAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        company_name: 'Quantum Leap Innovations Private Limited',
        company_type: 'Private Limited',
        cin: 'U72900KA2022PTC123987',
        registered_office: '12th Floor, Tower B, Prestige Tech Park, Marathahalli, Bangalore, Karnataka 560103',
        plan_name: 'Employee Stock Option Plan 2026',
        grant_letter_number: 'QLI/ESOP/2026/089',
        grant_date: today,
        effective_date: today,
        employee_name: 'Aditya Sharma',
        employee_id: 'QLI-908',
        designation: 'Lead Software Engineer',
        department: 'Engineering',
        employment_type: 'Full-Time',
        office_location: 'Bangalore Office',
        board_or_committee_approval_reference: 'Board Meeting held on May 10, 2026',
        total_options_granted: '5,000',
        option_type: 'Equity Stock Option',
        exercise_price: 'INR 150 per share',
        currency: 'INR',
        fair_market_value: 'INR 180 per share',
        vesting_start_date: today,
        cliff_period: '12 months from Effective Date',
        vesting_frequency: 'Equal monthly installments over 36 months following cliff',
        vesting_schedule: 'Total vesting over 48 months: 25% vests at the end of the cliff period, and the remaining 75% vests in equal monthly increments over the next 36 months.',
        performance_conditions: 'N/A',
        accelerated_vesting: 'Accelerated vesting of 100% of unvested options in the event of an Acquisition or Merger of the Company.',
        exercise_window: 'Within five (5) years from the date of vesting of the respective Options.',
        exercise_method: 'Submission of physical Option Exercise Form along with payment of the aggregate exercise price.',
        payment_method: 'NEFT/RTGS bank transfer or Demand Draft.',
        lapse_rules: '1. Resignation / Good Leaver: Vested options must be exercised within 30 days of last working day.\n2. Termination for Cause / Bad Leaver: All options (vested and unvested) lapse immediately.\n3. Death or Permanent Disability: Nominee has 6 months to exercise vested options.',
        transfer_restrictions: 'Options are strictly personal, non-transferable, and cannot be pledged, mortgaged, or encumbered in any manner.',
        taxation_clause: 'The option holder shall be solely responsible for all tax liabilities, including perquisite tax upon exercise and capital gains tax upon sale of shares.',
        confidentiality_required: true,
        listed_company: false,
        dpiit_startup: true,
        foreign_employee: false,
        cashless_exercise: false,
        rsu_grant: false,
        authorized_signatory: 'For Quantum Leap Innovations: Mr. Arvind Swamy (Director)',
        employee_acceptance_required: true,
        execution_place: 'Bangalore',
        execution_date: today,
        additional_conditions: 'Any options that lapse or are forfeited shall be added back to the ESOP pool and remain available for future grants.'
    };

    const requiredFields = [
        'company_name',
        'company_type',
        'cin',
        'registered_office',
        'plan_name',
        'grant_date',
        'effective_date',
        'employee_name',
        'employee_id',
        'designation',
        'department',
        'employment_type',
        'office_location',
        'board_or_committee_approval_reference',
        'total_options_granted',
        'option_type',
        'exercise_price',
        'currency',
        'vesting_start_date',
        'cliff_period',
        'vesting_frequency',
        'vesting_schedule',
        'exercise_window',
        'exercise_method',
        'payment_method',
        'lapse_rules',
        'transfer_restrictions',
        'taxation_clause',
        'authorized_signatory',
        'execution_place',
        'execution_date'
    ];

    const sidebarTips = [
        {
            title: "What is an ESOP Grant Letter?",
            content: "It is a formal offer letter to the employee containing details of option quantity, exercise price, and vesting timelines."
        },
        {
            title: "Vesting Timelines",
            content: "Under the Companies Act, there must be a minimum gap of one (1) year between option grant and option vesting."
        },
        {
            title: "Taxation (Perquisites)",
            content: "Options are taxed as salary perquisites upon exercise, calculated as the difference between FMV and Exercise Price."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="ESOP Grant Letter"
            description="Generate a legally compliant ESOP Option Grant Letter under your approved company ESOP Plan."
            documentType="esop-grant"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator creates a comprehensive ESOP Grant Letter compliant with the Companies Act, 2013."
            docxFilename="ESOP_Grant_Letter.docx"
            requiredFields={requiredFields}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData, validationErrors) => (
                <ESOPGrantLetterForm
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
