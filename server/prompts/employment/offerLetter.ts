// Offer Letter Prompt Template
// Specialized for job offer communications under Indian law

import { formatBasePrompt } from '../common/basePrompt';

export interface OfferLetterData {
   companyName: string;
   companyAddress: string;
   candidateName: string;
   candidateAddress: string;
   position: string;
   department: string;
   reportingManager: string;
   joiningDate: string;
   salary: string; // CTC per annum or monthly
   expiryDate: string; // Validity of this offer
   probationPeriod: string;
   noticePeriod: string;
   workLocation: string;
}

export const generateOfferLetterPrompt = (formData: OfferLetterData): string => {
   const data = {
      company_name: formData.companyName,
      company_address: formData.companyAddress,
      candidate_name: formData.candidateName,
      candidate_address: formData.candidateAddress,
      job_title: formData.position,
      department: formData.department,
      reporting_manager: formData.reportingManager,
      start_date: formData.joiningDate,
      compensation_details: formData.salary,
      probation_details: formData.probationPeriod,
      work_location: formData.workLocation,
      working_hours: "Standard Business Hours", // Default or if available in formData
      background_check_required: true,
      agreement_required: true,
      acceptance_deadline: formData.expiryDate
   };

   return `${formatBasePrompt()}

**DOCUMENT TYPE:** JOB OFFER LETTER

INPUT FORMAT (JSON):
${JSON.stringify(formData, null, 2)}

Please generate the Job Offer Letter now based on this data and the provided system instructions.`;
};
