import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, FileText, Cpu, Key, Database, Globe } from "lucide-react";

interface PatentAssignmentFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const PatentAssignmentForm: React.FC<PatentAssignmentFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData,
    errors
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                agreement_number: 'PAT-ASSIGN/2026/089',
                effective_date: new Date().toISOString().split('T')[0],
                commercial_purpose: 'Complete legal assignment and transfer of patent rights, patent application No. 202441056789 (AI-based Quantum Encryption Protocol), and associated technical know-how from lead inventor/researcher to BioQuantum Technologies Pvt. Ltd.',
                assignor: 'Dr. Vikramaditya Sharma, an individual inventor and scientist residing at 45, Tech Innovation Enclave, Phase 2, Whitefield, Bangalore, Karnataka 560066, India',
                assignee: 'BioQuantum Technologies Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Plot 12, Electronic City Phase 1, Bangalore, Karnataka 560100, India',
                authorized_representatives: 'Assignor: Dr. Vikramaditya Sharma; Assignee: Ms. Ananya Roy (Chief Executive Officer)',
                patent_title: 'System and Method for Quantum-Resistant Hybrid Cryptographic Key Generation in Autonomous Networks',
                patent_numbers: 'Indian Patent Grant No. 412985 (Granted on 14th March 2025)',
                patent_application_numbers: 'Indian Patent Application No. 202441056789 (Filing Date: 12th January 2024); PCT Application No. PCT/IN2024/050123',
                inventor_details: 'Dr. Vikramaditya Sharma (Lead Inventor, 80% contribution) and Dr. Neha Deshmukh (Co-Inventor, 20% contribution)',
                filing_dates: '12th January 2024 (Priority Filing), 10th November 2024 (International PCT Filing)',
                priority_dates: '12th January 2024 (Indian Patent Application No. 202441056789)',
                grant_dates: '14th March 2025 (Patent Grant No. 412985)',
                jurisdictions: 'India, United States (USPTO), European Patent Office (EPO), and Japan (JPO)',
                technology_field: 'Quantum Cryptography, Cybersecurity, Artificial Intelligence, and Embedded Network Security',
                assigned_patent_rights: 'Full and complete legal ownership, title, interest, patent claims, priority rights, continuation rights, divisional application rights, continuations-in-part, foreign counterparts, right to register Form 16 in Patent Office, right to collect past damages, and right to prosecute patent claims globally.',
                patent_family_details: 'Includes Indian Patent Grant No. 412985, US Patent Application No. 18/554,321, EP Patent Application No. 2481234.5, and all future divisional, continuation, and continuation-in-part filings arising therefrom.',
                associated_know_how: 'Complete mathematical proofs, cryptographic algorithm source code (v3.4), hardware interface specs, FPGA implementation firmware, laboratory test logs, and security benchmark test suites.',
                technical_documentation: 'System Architecture Document (v2.1), Cryptographic Key Exchange Whitepaper, Laboratory Notebooks (Vol I-IV), FPGA Synthesis Scripts, and Security Audit Certification Reports.',
                assignment_scope: 'Absolute, irrevocable, perpetual, worldwide, and unencumbered transfer of all patent rights, patent applications, and associated intellectual property.',
                commercialization_rights: 'Exclusive and unrestricted right to manufacture, use, offer for sale, sell, import, license, sub-license, distribute, and commercialize the patented invention globally.',
                enforcement_rights: 'Sole and exclusive right to enforce patent claims, initiate infringement suits, defend patent validity challenges, collect past and future royalties, and retain damages awarded in any judicial forum.',
                registration_rights: 'Right to record this assignment deed with the Indian Patent Office under Section 68 & 69 of the Patents Act, 1970 (Form 16) and foreign Patent Offices.',
                territory: 'Worldwide / All countries and jurisdictions',
                effective_assignment_date: new Date().toISOString().split('T')[0],
                consideration: 'A fixed lump sum consideration of INR 25,00,000 (Rupees Twenty-Five Lakhs Only) plus a 2% net sales royalty on commercial product deployments payable quarterly.',
                representations_and_warranties: 'The Assignor represents and warrants that he is the rightful owner/co-inventor, the patent rights are free from any pledge, mortgage, lien, or prior license, no third-party litigation is pending, and all information supplied to the Patent Office is accurate and complete.',
                further_assurances: 'The Assignor covenants to execute Form 16 under Patents Rules, 2003, sign power of attorney for patent attorneys, testify in patent opposition/litigation proceedings, and execute foreign assignment instruments upon request.',
                confidentiality_clause: 'Both parties agree to maintain strict confidentiality regarding technical know-how, unfiled patent claims, proprietary code, and commercial consideration terms.',
                indemnity_clause: 'The Assignor agrees to indemnify the Assignee against any claims or losses arising from breach of inventorship warranties or undisclosed prior assignments.',
                limitation_of_liability: 'The total aggregate liability of the Assignor under this agreement shall not exceed the total consideration amount actually received by the Assignor.',
                termination_clause: 'This agreement constitutes a permanent and absolute assignment of patent rights and cannot be revoked or terminated post-execution.',
                post_termination_provisions: 'Surviving obligations include confidentiality, further assurances, indemnity, and dispute resolution covenants.',
                notice_details: 'Assignor: vikram.sharma@innovationlab.org, 45 Whitefield, Bangalore; Assignee: legal@bioquantumtech.com, Plot 12, Electronic City, Bangalore.',
                governing_law: 'Laws of India (including Patents Act, 1970 & Indian Contract Act, 1872)',
                dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed.',
                arbitration_details: 'Seat and venue of arbitration at Bangalore, proceedings conducted in English language.',
                jurisdiction: 'Courts at Bangalore, Karnataka, India',
                miscellaneous_clauses: 'Entire Agreement, Amendments in writing only, Severability, Counterparts, and Electronic Signatures validity under IT Act, 2000.',
                employee_invention: false,
                university_research: true,
                startup_investment: true,
                patent_family: true,
                technology_transfer: true,
                joint_ownership: false,
                cross_border_assignment: true,
                witnesses: '1. Dr. Rajesh Verma, Senior Scientist; 2. Ms. Priya Menon, Legal Associate',
                authorized_signatories: 'Assignor: Dr. Vikramaditya Sharma; Assignee: Ms. Ananya Roy (CEO)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure A: Schedule of Patents & Applications; Annexure B: Technical Documentation List; Annexure C: Form 16 Assignment Deed Format.'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
                <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Patent Assignment Agreement Form</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Complete legal transfer of patent rights, applications, inventions, and technical know-how under the Patents Act, 1970.</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={fillDummyData}
                    className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border-blue-200 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-600 dark:hover:bg-slate-700 shadow-sm transition-all"
                >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Auto-Fill Demo Data
                </Button>
            </div>

            {/* Section 1: Agreement & Commercial Details */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        1. Agreement Details & Commercial Purpose
                    </CardTitle>
                    <CardDescription>Specify reference details, effective dates, and transaction purpose.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="agreement_number">Agreement Number / Reference (Optional)</Label>
                            <Input
                                id="agreement_number"
                                name="agreement_number"
                                value={formData.agreement_number || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. PAT-ASSIGN/2026/089"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effective_date" className="flex items-center gap-1">
                                Effective Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="effective_date"
                                name="effective_date"
                                type="date"
                                value={formData.effective_date || ''}
                                onChange={handleInputChange}
                                className={errors?.effective_date ? "border-red-500" : ""}
                            />
                            {errors?.effective_date && <p className="text-xs text-red-500">{errors.effective_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="commercial_purpose" className="flex items-center gap-1">
                            Commercial Purpose & Recitals <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="commercial_purpose"
                            name="commercial_purpose"
                            rows={3}
                            value={formData.commercial_purpose || ''}
                            onChange={handleInputChange}
                            placeholder="Describe the underlying transaction, research context, or technology transfer motivation..."
                            className={errors?.commercial_purpose ? "border-red-500" : ""}
                        />
                        {errors?.commercial_purpose && <p className="text-xs text-red-500">{errors.commercial_purpose}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Parties Information */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        2. Assignor & Assignee Party Details
                    </CardTitle>
                    <CardDescription>Full legal entity or individual inventor details of the transferor and transferee.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="assignor" className="flex items-center gap-1">
                                Assignor Details (Owner/Inventor) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="assignor"
                                name="assignor"
                                rows={3}
                                value={formData.assignor || ''}
                                onChange={handleInputChange}
                                placeholder="Full Name / Entity Name, Legal Status, Registered Address..."
                                className={errors?.assignor ? "border-red-500" : ""}
                            />
                            {errors?.assignor && <p className="text-xs text-red-500">{errors.assignor}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignee" className="flex items-center gap-1">
                                Assignee Details (Acquirer) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="assignee"
                                name="assignee"
                                rows={3}
                                value={formData.assignee || ''}
                                onChange={handleInputChange}
                                placeholder="Full Entity Name, CIN/LLPIN, Registered Address..."
                                className={errors?.assignee ? "border-red-500" : ""}
                            />
                            {errors?.assignee && <p className="text-xs text-red-500">{errors.assignee}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="authorized_representatives" className="flex items-center gap-1">
                            Authorized Representatives <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="authorized_representatives"
                            name="authorized_representatives"
                            value={formData.authorized_representatives || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Assignor: Dr. Vikramaditya Sharma; Assignee: Ms. Ananya Roy (CEO)"
                            className={errors?.authorized_representatives ? "border-red-500" : ""}
                        />
                        {errors?.authorized_representatives && <p className="text-xs text-red-500">{errors.authorized_representatives}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Patent Asset Identification */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-blue-600" />
                        3. Patent Identification & Technological Assets
                    </CardTitle>
                    <CardDescription>Detail patent numbers, application numbers, inventors, filing dates, and technical documentation.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="patent_title" className="flex items-center gap-1">
                            Title of Patented Invention <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="patent_title"
                            name="patent_title"
                            value={formData.patent_title || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. System and Method for Quantum-Resistant Hybrid Cryptographic Key Generation"
                            className={errors?.patent_title ? "border-red-500" : ""}
                        />
                        {errors?.patent_title && <p className="text-xs text-red-500">{errors.patent_title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="patent_numbers" className="flex items-center gap-1">
                                Granted Patent Numbers <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="patent_numbers"
                                name="patent_numbers"
                                value={formData.patent_numbers || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Indian Patent Grant No. 412985"
                                className={errors?.patent_numbers ? "border-red-500" : ""}
                            />
                            {errors?.patent_numbers && <p className="text-xs text-red-500">{errors.patent_numbers}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="patent_application_numbers" className="flex items-center gap-1">
                                Patent Application Numbers <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="patent_application_numbers"
                                name="patent_application_numbers"
                                value={formData.patent_application_numbers || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Indian Patent Application No. 202441056789; PCT/IN2024/050123"
                                className={errors?.patent_application_numbers ? "border-red-500" : ""}
                            />
                            {errors?.patent_application_numbers && <p className="text-xs text-red-500">{errors.patent_application_numbers}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="inventor_details" className="flex items-center gap-1">
                                Inventor Details <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="inventor_details"
                                name="inventor_details"
                                value={formData.inventor_details || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Dr. Vikramaditya Sharma (Lead Inventor), Dr. Neha Deshmukh (Co-Inventor)"
                                className={errors?.inventor_details ? "border-red-500" : ""}
                            />
                            {errors?.inventor_details && <p className="text-xs text-red-500">{errors.inventor_details}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filing_dates" className="flex items-center gap-1">
                                Filing & Priority Dates <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="filing_dates"
                                name="filing_dates"
                                value={formData.filing_dates || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Filing Date: 12th Jan 2024; PCT Date: 10th Nov 2024"
                                className={errors?.filing_dates ? "border-red-500" : ""}
                            />
                            {errors?.filing_dates && <p className="text-xs text-red-500">{errors.filing_dates}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority_dates">Priority Dates (Optional)</Label>
                            <Input
                                id="priority_dates"
                                name="priority_dates"
                                value={formData.priority_dates || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 12th Jan 2024"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grant_dates">Grant Dates (Optional)</Label>
                            <Input
                                id="grant_dates"
                                name="grant_dates"
                                value={formData.grant_dates || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 14th March 2025"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jurisdictions" className="flex items-center gap-1">
                                Jurisdictions <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="jurisdictions"
                                name="jurisdictions"
                                value={formData.jurisdictions || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. India, USPTO, EPO, JPO"
                                className={errors?.jurisdictions ? "border-red-500" : ""}
                            />
                            {errors?.jurisdictions && <p className="text-xs text-red-500">{errors.jurisdictions}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="technology_field" className="flex items-center gap-1">
                                Technology Field <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="technology_field"
                                name="technology_field"
                                value={formData.technology_field || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Quantum Cryptography, Cybersecurity, Artificial Intelligence"
                                className={errors?.technology_field ? "border-red-500" : ""}
                            />
                            {errors?.technology_field && <p className="text-xs text-red-500">{errors.technology_field}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="patent_family_details">Patent Family Details (Optional)</Label>
                            <Input
                                id="patent_family_details"
                                name="patent_family_details"
                                value={formData.patent_family_details || ''}
                                onChange={handleInputChange}
                                placeholder="Foreign counterparts, divisionals, continuations..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="associated_know_how">Associated Technical Know-How (Optional)</Label>
                            <Textarea
                                id="associated_know_how"
                                name="associated_know_how"
                                rows={2}
                                value={formData.associated_know_how || ''}
                                onChange={handleInputChange}
                                placeholder="Source codes, mathematical proofs, firmware, prototype data..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="technical_documentation">Technical Documentation List (Optional)</Label>
                            <Textarea
                                id="technical_documentation"
                                name="technical_documentation"
                                rows={2}
                                value={formData.technical_documentation || ''}
                                onChange={handleInputChange}
                                placeholder="Architecture specs, whitepapers, laboratory notebooks..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Assignment Scope & Commercialization */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5 text-emerald-600" />
                        4. Scope of Assignment & Commercialization Rights
                    </CardTitle>
                    <CardDescription>Define rights assigned, territory, registration rights, and enforcement covenants.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="assigned_patent_rights" className="flex items-center gap-1">
                            Assigned Patent Rights <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="assigned_patent_rights"
                            name="assigned_patent_rights"
                            rows={3}
                            value={formData.assigned_patent_rights || ''}
                            onChange={handleInputChange}
                            placeholder="Full ownership of patent claims, priority rights, continuations, divisionals, Form 16 recordal rights..."
                            className={errors?.assigned_patent_rights ? "border-red-500" : ""}
                        />
                        {errors?.assigned_patent_rights && <p className="text-xs text-red-500">{errors.assigned_patent_rights}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="assignment_scope" className="flex items-center gap-1">
                                Assignment Scope <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="assignment_scope"
                                name="assignment_scope"
                                value={formData.assignment_scope || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Absolute, irrevocable, perpetual, worldwide, unencumbered transfer"
                                className={errors?.assignment_scope ? "border-red-500" : ""}
                            />
                            {errors?.assignment_scope && <p className="text-xs text-red-500">{errors.assignment_scope}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="territory" className="flex items-center gap-1">
                                Territory <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="territory"
                                name="territory"
                                value={formData.territory || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Worldwide / India and All Foreign Jurisdictions"
                                className={errors?.territory ? "border-red-500" : ""}
                            />
                            {errors?.territory && <p className="text-xs text-red-500">{errors.territory}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="commercialization_rights" className="flex items-center gap-1">
                                Commercialization Rights <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="commercialization_rights"
                                name="commercialization_rights"
                                rows={2}
                                value={formData.commercialization_rights || ''}
                                onChange={handleInputChange}
                                placeholder="Right to manufacture, sell, license, sub-license globally..."
                                className={errors?.commercialization_rights ? "border-red-500" : ""}
                            />
                            {errors?.commercialization_rights && <p className="text-xs text-red-500">{errors.commercialization_rights}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="enforcement_rights" className="flex items-center gap-1">
                                Enforcement Rights <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="enforcement_rights"
                                name="enforcement_rights"
                                rows={2}
                                value={formData.enforcement_rights || ''}
                                onChange={handleInputChange}
                                placeholder="Right to sue infringers, collect past & future damages..."
                                className={errors?.enforcement_rights ? "border-red-500" : ""}
                            />
                            {errors?.enforcement_rights && <p className="text-xs text-red-500">{errors.enforcement_rights}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="registration_rights" className="flex items-center gap-1">
                                Registration & Office Filings <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="registration_rights"
                                name="registration_rights"
                                rows={2}
                                value={formData.registration_rights || ''}
                                onChange={handleInputChange}
                                placeholder="Right to file Form 16 in Patent Office & maintain renewals..."
                                className={errors?.registration_rights ? "border-red-500" : ""}
                            />
                            {errors?.registration_rights && <p className="text-xs text-red-500">{errors.registration_rights}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="effective_assignment_date" className="flex items-center gap-1">
                            Effective Date of Assignment <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="effective_assignment_date"
                            name="effective_assignment_date"
                            type="date"
                            value={formData.effective_assignment_date || ''}
                            onChange={handleInputChange}
                            className={errors?.effective_assignment_date ? "border-red-500" : ""}
                        />
                        {errors?.effective_assignment_date && <p className="text-xs text-red-500">{errors.effective_assignment_date}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Financial Terms & Consideration */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Scale className="w-5 h-5 text-amber-600" />
                        5. Consideration & Financial Terms
                    </CardTitle>
                    <CardDescription>Lump sum payment, royalties, milestone payments, or equity consideration.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="consideration" className="flex items-center gap-1">
                            Consideration Payment Details <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="consideration"
                            name="consideration"
                            rows={3}
                            value={formData.consideration || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. INR 25,00,000 lump sum consideration plus 2% net sales royalty payable quarterly..."
                            className={errors?.consideration ? "border-red-500" : ""}
                        />
                        {errors?.consideration && <p className="text-xs text-red-500">{errors.consideration}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Warranties & Further Assurances */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        6. Warranties, Assurances & Post-Termination
                    </CardTitle>
                    <CardDescription>Declarations on patent validity, non-encumbrance, Patent Office Form 16 execution, and indemnities.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="representations_and_warranties" className="flex items-center gap-1">
                            Representations & Warranties <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="representations_and_warranties"
                            name="representations_and_warranties"
                            rows={3}
                            value={formData.representations_and_warranties || ''}
                            onChange={handleInputChange}
                            placeholder="Sole inventorship declarations, validity, no prior assignment, no liens..."
                            className={errors?.representations_and_warranties ? "border-red-500" : ""}
                        />
                        {errors?.representations_and_warranties && <p className="text-xs text-red-500">{errors.representations_and_warranties}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="further_assurances" className="flex items-center gap-1">
                            Further Assurances & Form 16 Execution <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="further_assurances"
                            name="further_assurances"
                            rows={3}
                            value={formData.further_assurances || ''}
                            onChange={handleInputChange}
                            placeholder="Covenants to execute Form 16 under Patents Rules, testimony in prosecution/litigation..."
                            className={errors?.further_assurances ? "border-red-500" : ""}
                        />
                        {errors?.further_assurances && <p className="text-xs text-red-500">{errors.further_assurances}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="confidentiality_clause">Confidentiality Provisions (Optional)</Label>
                            <Textarea
                                id="confidentiality_clause"
                                name="confidentiality_clause"
                                rows={2}
                                value={formData.confidentiality_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Confidential treatment of technical know-how and unfiled claims..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="indemnity_clause">Indemnity Clause (Optional)</Label>
                            <Textarea
                                id="indemnity_clause"
                                name="indemnity_clause"
                                rows={2}
                                value={formData.indemnity_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Indemnification against inventorship defects or undisclosed encumbrances..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="limitation_of_liability">Limitation of Liability (Optional)</Label>
                            <Input
                                id="limitation_of_liability"
                                name="limitation_of_liability"
                                value={formData.limitation_of_liability || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Capped at total consideration amount received"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="termination_clause">Termination Clause (Optional)</Label>
                            <Input
                                id="termination_clause"
                                name="termination_clause"
                                value={formData.termination_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Irrevocable & non-terminable post-execution transfer"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Special Clauses & Transaction Context */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        7. Special Transaction Context & Flags
                    </CardTitle>
                    <CardDescription>Select applicability of special patent transfer frameworks.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="employee_invention"
                                checked={formData.employee_invention || false}
                                onCheckedChange={(checked) => handleSelectChange('employee_invention', checked)}
                            />
                            <Label htmlFor="employee_invention" className="text-sm font-normal cursor-pointer">
                                Employee Invention Framework
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="university_research"
                                checked={formData.university_research || false}
                                onCheckedChange={(checked) => handleSelectChange('university_research', checked)}
                            />
                            <Label htmlFor="university_research" className="text-sm font-normal cursor-pointer">
                                University / Institutional Research
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="startup_investment"
                                checked={formData.startup_investment || false}
                                onCheckedChange={(checked) => handleSelectChange('startup_investment', checked)}
                            />
                            <Label htmlFor="startup_investment" className="text-sm font-normal cursor-pointer">
                                Startup VC / Investor Requirement
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="patent_family"
                                checked={formData.patent_family || false}
                                onCheckedChange={(checked) => handleSelectChange('patent_family', checked)}
                            />
                            <Label htmlFor="patent_family" className="text-sm font-normal cursor-pointer">
                                Patent Family / Continuations Exists
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="technology_transfer"
                                checked={formData.technology_transfer || false}
                                onCheckedChange={(checked) => handleSelectChange('technology_transfer', checked)}
                            />
                            <Label htmlFor="technology_transfer" className="text-sm font-normal cursor-pointer">
                                Technology Transfer Covenants
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="cross_border_assignment"
                                checked={formData.cross_border_assignment || false}
                                onCheckedChange={(checked) => handleSelectChange('cross_border_assignment', checked)}
                            />
                            <Label htmlFor="cross_border_assignment" className="text-sm font-normal cursor-pointer">
                                Cross-Border International Filing
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 8: Legal Framework & Signatories */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                        8. Governing Law, Jurisdiction & Execution
                    </CardTitle>
                    <CardDescription>Dispute resolution, arbitration seat, jurisdiction courts, and signatories.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="governing_law" className="flex items-center gap-1">
                                Governing Law <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="governing_law"
                                name="governing_law"
                                value={formData.governing_law || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Laws of India (including Patents Act, 1970)"
                                className={errors?.governing_law ? "border-red-500" : ""}
                            />
                            {errors?.governing_law && <p className="text-xs text-red-500">{errors.governing_law}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction" className="flex items-center gap-1">
                                Jurisdiction Courts <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="jurisdiction"
                                name="jurisdiction"
                                value={formData.jurisdiction || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Courts at Bangalore, Karnataka, India"
                                className={errors?.jurisdiction ? "border-red-500" : ""}
                            />
                            {errors?.jurisdiction && <p className="text-xs text-red-500">{errors.jurisdiction}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dispute_resolution" className="flex items-center gap-1">
                                Dispute Resolution Mechanism <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="dispute_resolution"
                                name="dispute_resolution"
                                rows={2}
                                value={formData.dispute_resolution || ''}
                                onChange={handleInputChange}
                                placeholder="Arbitration under the Arbitration and Conciliation Act, 1996..."
                                className={errors?.dispute_resolution ? "border-red-500" : ""}
                            />
                            {errors?.dispute_resolution && <p className="text-xs text-red-500">{errors.dispute_resolution}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="miscellaneous_clauses" className="flex items-center gap-1">
                                Miscellaneous & Boilerplate <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="miscellaneous_clauses"
                                name="miscellaneous_clauses"
                                rows={2}
                                value={formData.miscellaneous_clauses || ''}
                                onChange={handleInputChange}
                                placeholder="Entire Agreement, Amendments, Severability, Counterparts..."
                                className={errors?.miscellaneous_clauses ? "border-red-500" : ""}
                            />
                            {errors?.miscellaneous_clauses && <p className="text-xs text-red-500">{errors.miscellaneous_clauses}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorized_signatories" className="flex items-center gap-1">
                                Authorized Signatories <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="authorized_signatories"
                                name="authorized_signatories"
                                value={formData.authorized_signatories || ''}
                                onChange={handleInputChange}
                                placeholder="Assignor: Dr. Vikramaditya Sharma; Assignee: Ms. Ananya Roy"
                                className={errors?.authorized_signatories ? "border-red-500" : ""}
                            />
                            {errors?.authorized_signatories && <p className="text-xs text-red-500">{errors.authorized_signatories}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="execution_place" className="flex items-center gap-1">
                                Execution Place <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="execution_place"
                                name="execution_place"
                                value={formData.execution_place || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Bangalore"
                                className={errors?.execution_place ? "border-red-500" : ""}
                            />
                            {errors?.execution_place && <p className="text-xs text-red-500">{errors.execution_place}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="execution_date" className="flex items-center gap-1">
                                Execution Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="execution_date"
                                name="execution_date"
                                type="date"
                                value={formData.execution_date || ''}
                                onChange={handleInputChange}
                                className={errors?.execution_date ? "border-red-500" : ""}
                            />
                            {errors?.execution_date && <p className="text-xs text-red-500">{errors.execution_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="annexures">Annexures & Schedules (Optional)</Label>
                        <Textarea
                            id="annexures"
                            name="annexures"
                            rows={2}
                            value={formData.annexures || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Annexure A: Schedule of Patents; Annexure B: Technical Documentation List; Annexure C: Form 16"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PatentAssignmentForm;
