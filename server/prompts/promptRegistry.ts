// Prompt Registry - Manages prompt template selection
// Routes to appropriate prompt based on document type

import { generateNDAPrompt } from './ip/nda';
import { generateMutualNDAPrompt } from './ip/mutualNDA';
import { generateCopyrightAssignmentPrompt } from './ip/copyrightAssignment';
import { generateIPAssignmentPrompt } from './ip/ipAssignment';
import { generateTrademarkLicensePrompt } from './ip/trademarkLicense';
import { generatePatentAssignmentPrompt } from './ip/patentAssignment';
import { generateSoftwareDevPrompt } from './ip/softwareDev';

import { generateEmploymentContractPrompt } from './employment/standardContract';
import { generateConsultantAgreementPrompt } from './employment/consultantAgreement';
import { generateOfferLetterPrompt } from './employment/offerLetter';
import { generateProbationConfirmationPrompt } from './employment/probationConfirmation';
import { generateInternshipAgreementPrompt } from './employment/internshipAgreement';
import { generateHRPolicyPrompt } from './employment/hrPolicy';
import { generateCodeOfConductPrompt } from './employment/codeOfConduct';
import { generateSalaryIncrementPrompt } from './employment/salaryIncrement';
import { generateShowCausePrompt } from './employment/showCause';
import { generateWarningLetterPrompt } from './employment/warningLetter';
import { generateRelievingLetterPrompt } from './employment/relievingLetter';
import { generateExperienceLetterPrompt } from './employment/experienceLetter';
import { generateIndependentContractorPrompt } from './employment/independentContractor';
import { generateNonCompetePrompt } from './employment/nonCompete';

import { generateMOAPrompt } from './corporate/moa';
import { generateAOAPrompt } from './corporate/aoa';
import { generateBoardResolutionPrompt } from './corporate/boardResolution';
import { generateShareholderResolutionPrompt } from './corporate/shareholderResolution';
import { generateNoticeBoardMeetingPrompt } from './corporate/noticeBoardMeeting';
import { generateMinutesBoardMeetingPrompt } from './corporate/minutesBoardMeeting';
import { generateDirectorAppointmentPrompt } from './corporate/directorAppointment';
import { generateDirectorResignationPrompt } from './corporate/directorResignation';
import { generateCorporateAuthorizationLetterPrompt } from './corporate/corporateAuthorizationLetter';
import { generatePoACorporatePrompt } from './corporate/powerOfAttorneyCorporate';
import { generateConvertibleNotePrompt } from './corporate/convertibleNote';
import { generateESOPPlanPrompt } from './corporate/esopPlan';
import { generateESOPGrantPrompt } from './corporate/esopGrant';
import { generateCapTableCertPrompt } from './corporate/capTableCert';
import { generateShareTransferPrompt } from './corporate/shareTransfer';
import { generateShareSubscriptionPrompt } from './corporate/shareSubscription';

import { generateServiceAgreementPrompt } from './commercial/serviceAgreement';
import { generateMSAPrompt } from './commercial/msa';

import { generateCommercialLeasePrompt } from './realestate/commercialLease';
import { generateResidentialLeasePrompt } from './realestate/residentialLease';

export interface PromptGenerationResult {
    systemPrompt: string;
    userPrompt: string;
}

const COMMON_HTML_STYLING_RULES = `
STRICT RULES:
1. Output ONLY the final legal document as pure HTML - no markdown, no code blocks, no explanations, no HTML code wrappers (like \`\`\`html). Just direct HTML nodes starting with <h1> or a container <div>.
2. No explanations. No commentary. No markdown formatting (use HTML tags like <h1>, <h2>, <p>, <strong>, <table>, etc.).
3. Use ONLY the supplied JSON / input data. Never fabricate legal, technical, or commercial terms.
4. If mandatory information is missing insert: [REQUIRED INPUT MISSING: field_name].
5. **CRITICAL TYPOGRAPHY & CONTAINER STYLING:**
   Wrap the entire document in a main container with Calibri font, 1.6 line-height, text-justify alignment, and 15px text size:
   <div style="font-family: 'Calibri', sans-serif; line-height: 1.6; text-align: justify; font-size: 15px; color: #1a202c; padding: 10px;">
6. TITLE: Centered, bold, capitalized, size 20px, with 25px margin-bottom.
7. PARTIES & METADATA: Format party details, registered addresses, CIN/GSTIN, and execution dates in clean, borderless HTML tables.
8. CLAUSES & SCHEDULES: Number clauses sequentially. Render payment terms, milestones, SLAs, and compensation in structured HTML tables.
9. SIGNATURE BLOCK: Provide styled side-by-side execution lines in a borderless HTML table for authorized signatories.
`;

/**
 * Prompt Registry - Central hub for all document prompts
 */
class PromptRegistry {
    /**
     * Get appropriate prompt for document type
     */
    getPrompt(documentType: string, formData: any): PromptGenerationResult {
        console.log(`[Prompt Registry] Getting prompt for: ${documentType}`);

        switch (documentType) {
            // IP Documents
            case 'nda':
            case 'confidentiality-nda':
            case 'nda-one-way':
                return this.getNDAPrompt(formData);

            case 'confidentiality-mutual':
            case 'nda-mutual':
                return this.getMutualNDAPrompt(formData);

            case 'copyright-assignment':
                return this.getCopyrightAssignmentPrompt(formData);

            case 'ip-assignment':
                return this.getIPAssignmentPrompt(formData);

            case 'trademark-license':
                return this.getTrademarkLicensePrompt(formData);

            case 'patent-assignment':
                return this.getPatentAssignmentPrompt(formData);

            case 'software-development':
                return this.getSoftwareDevPrompt(formData);

            // Commercial Contracts
            case 'service-agreement':
                return this.getServiceAgreementPrompt(formData);

            case 'msa':
                return this.getMSAPrompt(formData);

            case 'commercial-lease':
                return this.getCommercialLeasePrompt(formData);

            case 'residential-lease':
                return this.getResidentialLeasePrompt(formData);

            // Employment Documents
            case 'employment-contract':
                return this.getEmploymentContractPrompt(formData);

            case 'consultant-agreement':
                return this.getConsultantAgreementPrompt(formData);

            case 'offer-letter':
            case 'job-offer-letter':
            case 'appointment-letter':
                return this.getOfferLetterPrompt(formData);

            case 'probation-confirmation':
                return this.getProbationConfirmationPrompt(formData);

            case 'internship-agreement':
                return this.getInternshipAgreementPrompt(formData);

            case 'hr-policy-manual':
                return this.getHRPolicyPrompt(formData);

            case 'code-of-conduct':
                return this.getCodeOfConductPrompt(formData);

            case 'salary-increment-letter':
                return this.getSalaryIncrementPrompt(formData);

            case 'show-cause-notice':
                return this.getShowCausePrompt(formData);

            case 'warning-letter':
                return this.getWarningLetterPrompt(formData);

            case 'relieving-letter':
                return this.getRelievingLetterPrompt(formData);

            case 'experience-letter':
                return this.getExperienceLetterPrompt(formData);

            case 'independent-contractor':
                return this.getIndependentContractorPrompt(formData);

            case 'non-compete':
                return this.getNonCompetePrompt(formData);

            // Corporate Documents
            case 'moa':
                return this.getMOAPrompt(formData);

            case 'aoa':
                return this.getAOAPrompt(formData);

            case 'board-resolution':
                return this.getBoardResolutionPrompt(formData);

            case 'shareholder-resolution':
                return this.getShareholderResolutionPrompt(formData);

            case 'notice-board-meeting':
                return this.getNoticeBoardMeetingPrompt(formData);

            case 'minutes-board-meeting':
                return this.getMinutesBoardMeetingPrompt(formData);

            case 'director-appointment':
                return this.getDirectorAppointmentPrompt(formData);

            case 'director-resignation':
                return this.getDirectorResignationPrompt(formData);

            case 'corporate-authorization-letter':
                return this.getCorporateAuthorizationLetterPrompt(formData);

            case 'power-of-attorney-corporate':
                return this.getPoACorporatePrompt(formData);

            case 'convertible-note':
                return this.getConvertibleNotePrompt(formData);

            case 'esop-plan':
                return this.getESOPPlanPrompt(formData);

            case 'esop-grant':
                return this.getESOPGrantPrompt(formData);

            case 'cap-table-certificate':
                return this.getCapTableCertPrompt(formData);

            case 'share-transfer':
                return this.getShareTransferPrompt(formData);

            case 'share-subscription':
                return this.getShareSubscriptionPrompt(formData);

            default:
                return this.getGenericPrompt(documentType, formData);
        }
    }

    /**
     * Generic Prompt Handler for unmapped document types
     */
    private getGenericPrompt(documentType: string, formData: any): PromptGenerationResult {
        return {
            systemPrompt: `You are a senior legal document drafter with expertise in Indian commercial and corporate law. 
Your task is to generate a legally enforceable, professional ${documentType.replace(/-/g, ' ').toUpperCase()} as pure HTML.

${COMMON_HTML_STYLING_RULES}`,
            userPrompt: `Generate a ${documentType.replace(/-/g, ' ')} based on the following input data:

INPUT DATA (JSON):
${JSON.stringify(formData, null, 2)}`
        };
    }

    private getNDAPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateNDAPrompt(formData);
        return {
            systemPrompt: `You are a senior Intellectual Property & Commercial Contracts Lawyer in India specializing in Non-Disclosure Agreements (NDA).
Your task is to generate a legally compliant One-Way Non-Disclosure Agreement under the Indian Contract Act 1872 and IT Act 2000 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getMutualNDAPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateMutualNDAPrompt(formData);
        return {
            systemPrompt: `You are a senior Commercial Contracts Lawyer in India specializing in Mutual Confidentiality Agreements.
Your task is to generate a legally compliant Two-Way Mutual Non-Disclosure Agreement under the Indian Contract Act 1872 and IT Act 2000 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getCopyrightAssignmentPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateCopyrightAssignmentPrompt(formData);
        return {
            systemPrompt: `You are a senior Intellectual Property Lawyer in India specializing in Copyright Law.
Your task is to generate a legally enforceable Copyright Assignment Agreement under Section 18 & 19 of the Copyright Act, 1957 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getIPAssignmentPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateIPAssignmentPrompt(formData);
        return {
            systemPrompt: `You are a senior IP Transactions Lawyer in India specializing in Intellectual Property Assignment.
Your task is to generate a comprehensive IP Assignment Agreement transferring Copyright, Patents, Trademarks, Trade Secrets, and Designs under Indian IP laws as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getTrademarkLicensePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateTrademarkLicensePrompt(formData);
        return {
            systemPrompt: `You are a senior Trademark Lawyer in India specializing in Trademark Licensing.
Your task is to generate a legally compliant Trademark License Agreement under the Trade Marks Act, 1999 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getPatentAssignmentPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generatePatentAssignmentPrompt(formData);
        return {
            systemPrompt: `You are a Patent Attorney and Technology Lawyer in India specializing in Patent Rights Transfer.
Your task is to generate a legally enforceable Patent Assignment Agreement under Section 68 and 69 of the Patents Act, 1970 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getSoftwareDevPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateSoftwareDevPrompt(formData);
        return {
            systemPrompt: `You are a senior Technology Transactions Lawyer specializing in Software Development Agreements, SaaS, IT Outsourcing, and Agile Projects under Indian law.
Your task is to generate a legally compliant Software Development Agreement covering SOW, Milestones, Acceptance Criteria, Background/Foreground IP, and DPDP Act compliance as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getServiceAgreementPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateServiceAgreementPrompt(formData);
        return {
            systemPrompt: `You are a senior Corporate Lawyer and Commercial Contracts Specialist in India drafting Business-to-Business (B2B) Service Agreements.
Your task is to generate an enterprise B2B Service Agreement governing Scope of Services, SLAs, Pricing, GST, IP allocation, and Liability Caps as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getMSAPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateMSAPrompt(formData);
        return {
            systemPrompt: `You are a senior Corporate Lawyer in India specializing in Master Service Agreements (MSA).
Your task is to generate an enterprise Master Service Agreement umbrella contract governing Statements of Work (SOWs) as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getCommercialLeasePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateCommercialLeasePrompt(formData);
        return {
            systemPrompt: `You are a senior Real Estate and Property Lawyer in India specializing in Commercial Leases.
Your task is to generate a Commercial Lease Agreement for office/retail premises under Indian property laws as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getResidentialLeasePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateResidentialLeasePrompt(formData);
        return {
            systemPrompt: `You are a Property Lawyer in India specializing in Residential Tenancy Agreements.
Your task is to generate a Residential Lease / Tenancy Agreement as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getEmploymentContractPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateEmploymentContractPrompt(formData);
        return {
            systemPrompt: `You are a senior Employment Lawyer in India specializing in Executive Employment Contracts.
Your task is to generate a legally compliant Employment Agreement under Indian labor laws as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getConsultantAgreementPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateConsultantAgreementPrompt(formData);
        return {
            systemPrompt: `You are a senior Corporate Lawyer in India specializing in Consultant Agreements.
Your task is to generate a legally enforceable Independent Contractor / Consultant Agreement as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getOfferLetterPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateOfferLetterPrompt(formData);
        return {
            systemPrompt: `You are an HR Legal Counsel in India specializing in Job Offer Letters.
Your task is to generate a professional, conditional Job Offer Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getProbationConfirmationPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateProbationConfirmationPrompt(formData);
        return {
            systemPrompt: `You are an HR Legal Advisor in India specializing in Probation Confirmation Letters.
Your task is to generate an Employment Probation Confirmation Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getInternshipAgreementPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateInternshipAgreementPrompt(formData);
        return {
            systemPrompt: `You are an Employment Law Specialist in India.
Your task is to generate a structured Internship Agreement as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getHRPolicyPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateHRPolicyPrompt(formData);
        return {
            systemPrompt: `You are a Labor Law & HR Governance Counsel in India.
Your task is to generate an HR Policy Manual document as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getCodeOfConductPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateCodeOfConductPrompt(formData);
        return {
            systemPrompt: `You are a Corporate Governance & Ethics Specialist in India.
Your task is to generate a Corporate Code of Conduct Agreement as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getSalaryIncrementPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateSalaryIncrementPrompt(formData);
        return {
            systemPrompt: `You are an HR Operations Specialist in India.
Your task is to generate a Salary Increment Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getShowCausePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateShowCausePrompt(formData);
        return {
            systemPrompt: `You are a Disciplinary & Industrial Relations Lawyer in India.
Your task is to generate a Show Cause Notice under employment regulations as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getWarningLetterPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateWarningLetterPrompt(formData);
        return {
            systemPrompt: `You are an Employment Disciplinary Specialist in India.
Your task is to generate an Employee Warning Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getRelievingLetterPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateRelievingLetterPrompt(formData);
        return {
            systemPrompt: `You are an HR Operations Specialist in India.
Your task is to generate an Employee Relieving Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getExperienceLetterPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateExperienceLetterPrompt(formData);
        return {
            systemPrompt: `You are an HR Operations Specialist in India.
Your task is to generate an Employment Experience Certificate Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getIndependentContractorPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateIndependentContractorPrompt(formData);
        return {
            systemPrompt: `You are a Commercial Contracts Lawyer in India specializing in Independent Contractor Agreements.
Your task is to generate an Independent Contractor Agreement as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getNonCompetePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateNonCompetePrompt(formData);
        return {
            systemPrompt: `You are an Employment Law Specialist in India specializing in Non-Compete Agreements under Section 27 of the Indian Contract Act 1872.
Your task is to generate a Non-Compete & Non-Solicitation Agreement as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getMOAPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateMOAPrompt(formData);
        return {
            systemPrompt: `You are a senior Corporate Lawyer in India specializing in statutory company incorporation.
Your task is to generate a Memorandum of Association (MOA) under Section 4 of the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getAOAPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateAOAPrompt(formData);
        return {
            systemPrompt: `You are a senior Corporate Lawyer in India specializing in company governance documents.
Your task is to generate Articles of Association (AOA) under the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getBoardResolutionPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateBoardResolutionPrompt(formData);
        return {
            systemPrompt: `You are a Company Secretary (CS) and Corporate Governance Expert in India.
Your task is to generate a Board Resolution under the Companies Act 2013 and ICSI Secretarial Standards as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getShareholderResolutionPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateShareholderResolutionPrompt(formData);
        return {
            systemPrompt: `You are a Company Secretary (CS) in India specializing in Shareholder Resolutions.
Your task is to generate a Shareholders' Ordinary / Special Resolution under the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getNoticeBoardMeetingPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateNoticeBoardMeetingPrompt(formData);
        return {
            systemPrompt: `You are a Company Secretary (CS) in India.
Your task is to generate a Notice of Board Meeting with Agenda under the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getMinutesBoardMeetingPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateMinutesBoardMeetingPrompt(formData);
        return {
            systemPrompt: `You are a Company Secretary (CS) in India specializing in Secretarial Standards (SS-1).
Your task is to generate Minutes of Board Meeting as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getDirectorAppointmentPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateDirectorAppointmentPrompt(formData);
        return {
            systemPrompt: `You are a Corporate Governance Specialist in India.
Your task is to generate a Director Appointment Letter under the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getDirectorResignationPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateDirectorResignationPrompt(formData);
        return {
            systemPrompt: `You are a Corporate Legal Advisor in India.
Your task is to generate a Director Resignation Letter under Section 168 of the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getCorporateAuthorizationLetterPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateCorporateAuthorizationLetterPrompt(formData);
        return {
            systemPrompt: `You are a Corporate Legal Counsel in India.
Your task is to generate a Corporate Authorization Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getPoACorporatePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generatePoACorporatePrompt(formData);
        return {
            systemPrompt: `You are a Commercial Property & Corporate Lawyer in India.
Your task is to generate a Corporate Power of Attorney document as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getConvertibleNotePrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateConvertibleNotePrompt(formData);
        return {
            systemPrompt: `You are a Venture Capital & Corporate Finance Lawyer in India.
Your task is to generate a Convertible Note Agreement under the Companies Act 2013 and RBI regulations as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getESOPPlanPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateESOPPlanPrompt(formData);
        return {
            systemPrompt: `You are a Venture Capital & Equity Compensation Lawyer in India.
Your task is to generate an Employee Stock Option Plan (ESOP Plan) under the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getESOPGrantPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateESOPGrantPrompt(formData);
        return {
            systemPrompt: `You are an Equity Compensation Specialist in India.
Your task is to generate an ESOP Grant Letter as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getCapTableCertPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateCapTableCertPrompt(formData);
        return {
            systemPrompt: `You are a Corporate Secretarial & Fundraising Specialist in India.
Your task is to generate a Cap Table Certificate signed by a Director / CS as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getShareTransferPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateShareTransferPrompt(formData);
        return {
            systemPrompt: `You are a Corporate Transactions Lawyer in India.
Your task is to generate a Share Transfer Agreement under Section 56 of the Companies Act 2013 as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }

    private getShareSubscriptionPrompt(formData: any): PromptGenerationResult {
        const fullPrompt = generateShareSubscriptionPrompt(formData);
        return {
            systemPrompt: `You are a Venture Capital Lawyer in India specializing in Equity Investments.
Your task is to generate a Share Subscription Agreement (SSA) as pure HTML.
${COMMON_HTML_STYLING_RULES}`,
            userPrompt: fullPrompt
        };
    }
}

// Export singleton
export const promptRegistry = new PromptRegistry();
