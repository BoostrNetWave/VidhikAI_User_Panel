import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, FileText, Code, Cpu, Database, Server, Key, DollarSign } from "lucide-react";

interface SoftwareDevFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const SoftwareDevForm: React.FC<SoftwareDevFormProps> = ({
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
                agreement_number: 'SDA-2026/108',
                effective_date: new Date().toISOString().split('T')[0],
                project_name: 'NexusAI Enterprise Analytics & Automated Workflow Platform',
                commercial_purpose: 'Custom design, end-to-end development, testing, API integration, cloud deployment, and intellectual property transfer of an AI-driven enterprise data analytics and automated workflow system for Client business operations.',
                client: 'FinTech Dynamics India Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Cyber City, Phase 3, Gurugram, Haryana 122002, India',
                developer: 'Cognitive Code Labs Private Limited, a technology engineering company incorporated under the Companies Act, 2013, having its registered office at HSR Layout, Sector 6, Bangalore, Karnataka 560102, India',
                authorized_representatives: 'Client: Mr. Amitav Banerjee (CTO); Developer: Mr. Siddharth Rao (VP Engineering)',
                software_type: 'Enterprise SaaS Web Platform & AI Workflow Engine',
                platform: 'Web (React/TypeScript frontend), Cloud Backend (Node.js/Python microservices), PostgreSQL Database, and AWS Cloud Infrastructure',
                project_objectives: 'To build a secure, multi-tenant scalable software platform providing real-time data processing, predictive ML analytics models, automated approval workflows, and RESTful API integrations.',
                scope_of_services: '1. Requirement gathering & Technical Architecture Specification.\n2. UI/UX Figma Design & Design System System Creation.\n3. Frontend & Backend Microservices Development.\n4. AI Model Integration & Training Data Pipeline Construction.\n5. Third-Party Banking & Payment Gateway API Integrations.\n6. Security Vulnerability Testing & Penetration Audit.\n7. AWS Cloud Infrastructure CI/CD Deployment & User Training.',
                deliverables: '1. Production Source Code Repositories (Git).\n2. Compiled Executable Object Code & Docker Containers.\n3. Complete System Architecture & API Documentation (Swagger/Postman).\n4. User Manual & Admin Operation Guides.\n5. Security Compliance & Penetration Audit Reports.',
                technical_specifications: 'Frontend: React 18, Next.js, Tailwind CSS; Backend: Node.js (TypeScript), Python (FastAPI/PyTorch); Database: PostgreSQL 16, Redis; Cloud: AWS EKS, Lambda, S3, RDS.',
                milestones: 'Milestone 1: Architecture & UI/UX Wireframes (Month 1, 20% payment);\nMilestone 2: Core Microservices & Database Schema (Month 2, 30% payment);\nMilestone 3: AI Engine & API Integration (Month 3, 30% payment);\nMilestone 4: UAT Acceptance, Final Deployment & IP Transfer (Month 4, 20% payment).',
                project_start_date: new Date().toISOString().split('T')[0],
                project_completion_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                acceptance_testing: 'Client shall conduct User Acceptance Testing (UAT) for a period of 15 (fifteen) business days following delivery of each milestone release.',
                acceptance_criteria: 'All functional features operating without Priority-1 or Priority-2 defects as per Technical Specifications, passing security audit benchmarks, and achieving 99.5% test case pass rate.',
                payment_structure: 'Fixed Total Price of INR 45,00,000 (Rupees Forty-Five Lakhs Only) milestone-based payment schedule.',
                gst_applicable: true,
                invoicing_terms: 'Developer shall submit milestone tax invoices upon successful sign-off; Client shall pay within 15 (fifteen) calendar days of invoice receipt.',
                change_request_process: 'Any scope modification shall be documented in a written Change Request Form (CRF) detailing impact on cost and timelines, requiring mutual written authorization.',
                client_responsibilities: 'Provide timely business requirements, API access credentials, test datasets, feedback within 5 business days, and appoint a dedicated Project Manager.',
                developer_responsibilities: 'Deploy qualified software engineers, adhere to secure coding standards (OWASP Top 10), meet delivery milestones, provide source code commits weekly, and deliver bug fixes during UAT.',
                intellectual_property_clause: 'Upon full payment of consideration, all Foreground IP, source code, object code, custom algorithms, AI models, and documentation shall be exclusively assigned to and owned by the Client.',
                background_ip: 'Developer retains ownership of pre-existing reusable utility libraries, frameworks, and developer tools ("Developer Background IP") and grants Client a perpetual, royalty-free, worldwide license to use same embedded in the Deliverables.',
                foreground_ip: 'All custom software, custom source code, databases, AI models, UI designs, and deliverables created specifically under this Agreement ("Foreground IP") belong exclusively to the Client.',
                open_source_components: 'Developer shall use only permissive OSI-approved Open Source Software (MIT, Apache 2.0, BSD) and shall strictly exclude copyleft licenses (GPL, AGPL) without prior written Client consent.',
                confidentiality_clause: 'Both parties agree to maintain strict confidentiality of proprietary algorithms, business data, source code, trade secrets, and user data for 5 years post-termination.',
                data_privacy_clause: 'Developer shall comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) and implement strict technical measures to protect personal data processed during development.',
                information_security_requirements: 'Developer shall implement end-to-end encryption (TLS 1.3, AES-256), secure credential management, OWASP security compliance, role-based access control, and zero hardcoded secret keys.',
                warranty_terms: 'Developer warrants that for 90 (ninety) days post-final acceptance ("Warranty Period"), the Software shall perform substantially in accordance with Specifications and remain free of material bugs or security defects.',
                support_and_maintenance: 'Developer shall provide 90-day post-launch warranty bug support free of cost and offers optional Annual Maintenance Contract (AMC) at 15% of total project cost per annum.',
                service_level_agreement: 'Priority 1 (Critical Outage): 2-hour response, 8-hour resolution; Priority 2 (Major Defect): 4-hour response, 24-hour resolution; Priority 3 (Minor Issue): 24-hour response.',
                limitation_of_liability: 'Total aggregate liability of either party shall be capped at the total contract value actually paid under this Agreement, except for breach of confidentiality, IP infringement, or willful misconduct.',
                indemnity_clause: 'Developer shall defend and indemnify Client against third-party claims alleging that the Deliverables infringe third-party IP rights or open-source licenses.',
                force_majeure: 'Standard force majeure event relief upon immediate written notification within 7 days.',
                termination_clause: 'Either party may terminate for uncured material breach upon 30 days written notice, or Client may terminate for convenience upon paying for work completed up to notice date.',
                post_termination_obligations: 'Developer shall immediately hand over all completed work, source code commits, documentation, return Client data, and destroy confidential materials.',
                notice_details: 'Client: cto@fintechdynamics.in, Cyber City Gurugram; Developer: legal@cognitivecodelabs.com, HSR Layout Bangalore.',
                governing_law: 'Laws of India (including Information Technology Act, 2000 & Indian Contract Act, 1872)',
                dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed.',
                arbitration_details: 'Seat and venue of arbitration at Bangalore, Karnataka, conducted in English language.',
                jurisdiction: 'Courts at Bangalore, Karnataka, India',
                miscellaneous_clauses: 'Entire Agreement, Amendments in writing, Severability, Independent Contractor status, Counterparts, and Electronic Signatures under IT Act, 2000.',
                saas_project: true,
                ai_project: true,
                mobile_application: false,
                web_application: true,
                government_project: false,
                agile_methodology: true,
                devops_services: true,
                cross_border_project: false,
                witnesses: '1. Mr. Rohan Gupta (Gurugram); 2. Ms. Kavita Menon (Bangalore)',
                authorized_signatories: 'Client: Mr. Amitav Banerjee (CTO); Developer: Mr. Siddharth Rao (VP Engineering)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure A: Detailed Statement of Work (SOW) & Technical Specs; Annexure B: Milestone Payment Schedule; Annexure C: Service Level Agreement (SLA).'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-zinc-50 to-indigo-50 p-4 rounded-lg border border-zinc-100 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">Software Development Agreement Form</h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">Govern custom software creation, technical deliverables, IP ownership, milestones, acceptance criteria, and maintenance under Indian IT and Contract laws.</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={fillDummyData}
                    className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-slate-800 dark:text-zinc-300 dark:border-slate-600 dark:hover:bg-slate-700 shadow-sm transition-all"
                >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Auto-Fill Demo Data
                </Button>
            </div>

            {/* Section 1: Agreement Reference & Project Overview */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-zinc-600" />
                        1. Agreement Details & Business Purpose
                    </CardTitle>
                    <CardDescription>Reference details, effective date, project title, and software creation goals.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="agreement_number">Agreement Reference Number (Optional)</Label>
                            <Input
                                id="agreement_number"
                                name="agreement_number"
                                value={formData.agreement_number || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. SDA-2026/108"
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
                        <Label htmlFor="project_name" className="flex items-center gap-1">
                            Project Name / Software Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="project_name"
                            name="project_name"
                            value={formData.project_name || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. NexusAI Enterprise Analytics & Automated Workflow Platform"
                            className={errors?.project_name ? "border-red-500" : ""}
                        />
                        {errors?.project_name && <p className="text-xs text-red-500">{errors.project_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="commercial_purpose" className="flex items-center gap-1">
                            Commercial & Business Purpose <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="commercial_purpose"
                            name="commercial_purpose"
                            rows={3}
                            value={formData.commercial_purpose || ''}
                            onChange={handleInputChange}
                            placeholder="Describe software creation objectives, commercial deployment, and end-user goals..."
                            className={errors?.commercial_purpose ? "border-red-500" : ""}
                        />
                        {errors?.commercial_purpose && <p className="text-xs text-red-500">{errors.commercial_purpose}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Client & Developer Details */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        2. Client & Developer Entity Details
                    </CardTitle>
                    <CardDescription>Full legal details of the Client (acquirer/owner) and Developer (engineering vendor).</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client" className="flex items-center gap-1">
                                Client Details <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="client"
                                name="client"
                                rows={3}
                                value={formData.client || ''}
                                onChange={handleInputChange}
                                placeholder="Client Company Name, CIN, Registered Address..."
                                className={errors?.client ? "border-red-500" : ""}
                            />
                            {errors?.client && <p className="text-xs text-red-500">{errors.client}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="developer" className="flex items-center gap-1">
                                Developer Details <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="developer"
                                name="developer"
                                rows={3}
                                value={formData.developer || ''}
                                onChange={handleInputChange}
                                placeholder="Developer Company Name, CIN, Registered Address..."
                                className={errors?.developer ? "border-red-500" : ""}
                            />
                            {errors?.developer && <p className="text-xs text-red-500">{errors.developer}</p>}
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
                            placeholder="e.g. Client: Mr. Amitav Banerjee (CTO); Developer: Mr. Siddharth Rao (VP Engineering)"
                            className={errors?.authorized_representatives ? "border-red-500" : ""}
                        />
                        {errors?.authorized_representatives && <p className="text-xs text-red-500">{errors.authorized_representatives}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Technical Scope & Platform Architecture */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Code className="w-5 h-5 text-zinc-600" />
                        3. Software Type, Platform & Architecture Objectives
                    </CardTitle>
                    <CardDescription>Define technology stack, target platforms, software category, and architectural objectives.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="software_type" className="flex items-center gap-1">
                                Software Category / Type <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="software_type"
                                name="software_type"
                                value={formData.software_type || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Enterprise SaaS Web Platform & AI Workflow Engine"
                                className={errors?.software_type ? "border-red-500" : ""}
                            />
                            {errors?.software_type && <p className="text-xs text-red-500">{errors.software_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="platform" className="flex items-center gap-1">
                                Target Platform & Tech Stack <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="platform"
                                name="platform"
                                value={formData.platform || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Web (React/TypeScript), Node.js, PostgreSQL, AWS Cloud"
                                className={errors?.platform ? "border-red-500" : ""}
                            />
                            {errors?.platform && <p className="text-xs text-red-500">{errors.platform}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project_objectives" className="flex items-center gap-1">
                            Project Objectives <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="project_objectives"
                            name="project_objectives"
                            rows={2}
                            value={formData.project_objectives || ''}
                            onChange={handleInputChange}
                            placeholder="Performance targets, scalability, concurrent user support, API integration..."
                            className={errors?.project_objectives ? "border-red-500" : ""}
                        />
                        {errors?.project_objectives && <p className="text-xs text-red-500">{errors.project_objectives}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scope_of_services" className="flex items-center gap-1">
                                Scope of Engineering Services <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="scope_of_services"
                                name="scope_of_services"
                                rows={4}
                                value={formData.scope_of_services || ''}
                                onChange={handleInputChange}
                                placeholder="Requirement analysis, UI/UX design, frontend/backend coding, API integrations, testing..."
                                className={errors?.scope_of_services ? "border-red-500" : ""}
                            />
                            {errors?.scope_of_services && <p className="text-xs text-red-500">{errors.scope_of_services}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deliverables" className="flex items-center gap-1">
                                Technical Deliverables List <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="deliverables"
                                name="deliverables"
                                rows={4}
                                value={formData.deliverables || ''}
                                onChange={handleInputChange}
                                placeholder="Git source code repositories, compiled object code, Docker containers, API docs..."
                                className={errors?.deliverables ? "border-red-500" : ""}
                            />
                            {errors?.deliverables && <p className="text-xs text-red-500">{errors.deliverables}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="technical_specifications" className="flex items-center gap-1">
                            Technical Specifications & Standards <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="technical_specifications"
                            name="technical_specifications"
                            rows={2}
                            value={formData.technical_specifications || ''}
                            onChange={handleInputChange}
                            placeholder="Framework versions, database engines, security protocols, API standards..."
                            className={errors?.technical_specifications ? "border-red-500" : ""}
                        />
                        {errors?.technical_specifications && <p className="text-xs text-red-500">{errors.technical_specifications}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Timeline, Milestones & Acceptance Testing */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        4. Timeline, Milestones & Acceptance Testing
                    </CardTitle>
                    <CardDescription>Delivery schedules, milestone breakdown, testing procedures, and UAT acceptance criteria.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="project_start_date" className="flex items-center gap-1">
                                Project Start Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="project_start_date"
                                name="project_start_date"
                                type="date"
                                value={formData.project_start_date || ''}
                                onChange={handleInputChange}
                                className={errors?.project_start_date ? "border-red-500" : ""}
                            />
                            {errors?.project_start_date && <p className="text-xs text-red-500">{errors.project_start_date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project_completion_date" className="flex items-center gap-1">
                                Target Completion Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="project_completion_date"
                                name="project_completion_date"
                                type="date"
                                value={formData.project_completion_date || ''}
                                onChange={handleInputChange}
                                className={errors?.project_completion_date ? "border-red-500" : ""}
                            />
                            {errors?.project_completion_date && <p className="text-xs text-red-500">{errors.project_completion_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="milestones" className="flex items-center gap-1">
                            Milestone Schedule & Payment Triggers <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="milestones"
                            name="milestones"
                            rows={3}
                            value={formData.milestones || ''}
                            onChange={handleInputChange}
                            placeholder="Milestone 1: Wireframes (Month 1, 20%); Milestone 2: Backend (Month 2, 30%)..."
                            className={errors?.milestones ? "border-red-500" : ""}
                        />
                        {errors?.milestones && <p className="text-xs text-red-500">{errors.milestones}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="acceptance_testing" className="flex items-center gap-1">
                                Acceptance Testing Procedure <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="acceptance_testing"
                                name="acceptance_testing"
                                rows={3}
                                value={formData.acceptance_testing || ''}
                                onChange={handleInputChange}
                                placeholder="User Acceptance Testing (UAT) period, defect notification, re-testing timeline..."
                                className={errors?.acceptance_testing ? "border-red-500" : ""}
                            />
                            {errors?.acceptance_testing && <p className="text-xs text-red-500">{errors.acceptance_testing}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="acceptance_criteria" className="flex items-center gap-1">
                                Acceptance Criteria & Quality Gates <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="acceptance_criteria"
                                name="acceptance_criteria"
                                rows={3}
                                value={formData.acceptance_criteria || ''}
                                onChange={handleInputChange}
                                placeholder="Zero Critical defects, compliance with specifications, security audit pass rate..."
                                className={errors?.acceptance_criteria ? "border-red-500" : ""}
                            />
                            {errors?.acceptance_criteria && <p className="text-xs text-red-500">{errors.acceptance_criteria}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Financial Terms, Invoicing & Change Management */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        5. Commercial Terms, GST & Scope Modifications
                    </CardTitle>
                    <CardDescription>Pricing structure, milestone invoicing, tax treatment, and change request procedures.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment_structure" className="flex items-center gap-1">
                                Payment Structure & Pricing Model <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="payment_structure"
                                name="payment_structure"
                                rows={2}
                                value={formData.payment_structure || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Fixed Total Price of INR 45,00,000 OR Time & Material rate..."
                                className={errors?.payment_structure ? "border-red-500" : ""}
                            />
                            {errors?.payment_structure && <p className="text-xs text-red-500">{errors.payment_structure}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invoicing_terms" className="flex items-center gap-1">
                                Invoicing & Payment Timeline <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="invoicing_terms"
                                name="invoicing_terms"
                                rows={2}
                                value={formData.invoicing_terms || ''}
                                onChange={handleInputChange}
                                placeholder="Tax invoice submission upon milestone sign-off, payment within 15 days..."
                                className={errors?.invoicing_terms ? "border-red-500" : ""}
                            />
                            {errors?.invoicing_terms && <p className="text-xs text-red-500">{errors.invoicing_terms}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="change_request_process" className="flex items-center gap-1">
                            Change Request Procedure (Scope Alterations) <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="change_request_process"
                            name="change_request_process"
                            rows={2}
                            value={formData.change_request_process || ''}
                            onChange={handleInputChange}
                            placeholder="Written Change Request Form (CRF) detailing cost & timeline impact requiring mutual sign-off..."
                            className={errors?.change_request_process ? "border-red-500" : ""}
                        />
                        {errors?.change_request_process && <p className="text-xs text-red-500">{errors.change_request_process}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client_responsibilities" className="flex items-center gap-1">
                                Client Responsibilities <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="client_responsibilities"
                                name="client_responsibilities"
                                rows={2}
                                value={formData.client_responsibilities || ''}
                                onChange={handleInputChange}
                                placeholder="Providing requirements, credentials, test data, timely UAT sign-offs..."
                                className={errors?.client_responsibilities ? "border-red-500" : ""}
                            />
                            {errors?.client_responsibilities && <p className="text-xs text-red-500">{errors.client_responsibilities}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="developer_responsibilities" className="flex items-center gap-1">
                                Developer Responsibilities <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="developer_responsibilities"
                                name="developer_responsibilities"
                                rows={2}
                                value={formData.developer_responsibilities || ''}
                                onChange={handleInputChange}
                                placeholder="Deploying qualified engineers, secure coding, weekly commits, bug fixes..."
                                className={errors?.developer_responsibilities ? "border-red-500" : ""}
                            />
                            {errors?.developer_responsibilities && <p className="text-xs text-red-500">{errors.developer_responsibilities}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Intellectual Property & Open Source */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5 text-indigo-600" />
                        6. Intellectual Property, Source Code & Open Source
                    </CardTitle>
                    <CardDescription>Foreground IP assignment, Developer Background IP licensing, and Open Source Software (OSS) compliance.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_clause" className="flex items-center gap-1">
                            IP Ownership Assignment Clause <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="intellectual_property_clause"
                            name="intellectual_property_clause"
                            rows={3}
                            value={formData.intellectual_property_clause || ''}
                            onChange={handleInputChange}
                            placeholder="Complete assignment of custom code, algorithms, models, and documentation to Client upon payment..."
                            className={errors?.intellectual_property_clause ? "border-red-500" : ""}
                        />
                        {errors?.intellectual_property_clause && <p className="text-xs text-red-500">{errors.intellectual_property_clause}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="background_ip" className="flex items-center gap-1">
                                Developer Background IP <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="background_ip"
                                name="background_ip"
                                rows={2}
                                value={formData.background_ip || ''}
                                onChange={handleInputChange}
                                placeholder="Pre-existing libraries, developer tools, and perpetual license grant to Client..."
                                className={errors?.background_ip ? "border-red-500" : ""}
                            />
                            {errors?.background_ip && <p className="text-xs text-red-500">{errors.background_ip}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="foreground_ip" className="flex items-center gap-1">
                                Foreground Custom IP <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="foreground_ip"
                                name="foreground_ip"
                                rows={2}
                                value={formData.foreground_ip || ''}
                                onChange={handleInputChange}
                                placeholder="Custom source code, UI components, custom algorithms, and database schemas created for Client..."
                                className={errors?.foreground_ip ? "border-red-500" : ""}
                            />
                            {errors?.foreground_ip && <p className="text-xs text-red-500">{errors.foreground_ip}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="open_source_components">Open Source Software (OSS) Rules (Optional)</Label>
                        <Textarea
                            id="open_source_components"
                            name="open_source_components"
                            rows={2}
                            value={formData.open_source_components || ''}
                            onChange={handleInputChange}
                            placeholder="Permissive licenses (MIT, Apache 2.0) allowed; copyleft GPL/AGPL strictly prohibited without consent..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Confidentiality, Security & Warranty */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-zinc-600" />
                        7. Confidentiality, Security, Warranty & Maintenance
                    </CardTitle>
                    <CardDescription>Cybersecurity controls, DPDP Act data protection, warranty period, SLA, and maintenance scope.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="confidentiality_clause" className="flex items-center gap-1">
                                Confidentiality Provisions <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="confidentiality_clause"
                                name="confidentiality_clause"
                                rows={2}
                                value={formData.confidentiality_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Strict protection of trade secrets, source code, and business data..."
                                className={errors?.confidentiality_clause ? "border-red-500" : ""}
                            />
                            {errors?.confidentiality_clause && <p className="text-xs text-red-500">{errors.confidentiality_clause}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="information_security_requirements" className="flex items-center gap-1">
                                Information Security & OWASP <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="information_security_requirements"
                                name="information_security_requirements"
                                rows={2}
                                value={formData.information_security_requirements || ''}
                                onChange={handleInputChange}
                                placeholder="Encryption TLS 1.3, OWASP compliance, zero hardcoded keys, vulnerability audits..."
                                className={errors?.information_security_requirements ? "border-red-500" : ""}
                            />
                            {errors?.information_security_requirements && <p className="text-xs text-red-500">{errors.information_security_requirements}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="data_privacy_clause">DPDP Data Privacy Compliance (Optional)</Label>
                            <Textarea
                                id="data_privacy_clause"
                                name="data_privacy_clause"
                                rows={2}
                                value={formData.data_privacy_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Compliance with Digital Personal Data Protection Act, 2023..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="warranty_terms" className="flex items-center gap-1">
                                Software Warranty Terms <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="warranty_terms"
                                name="warranty_terms"
                                rows={2}
                                value={formData.warranty_terms || ''}
                                onChange={handleInputChange}
                                placeholder="90-day post-acceptance bug warranty, non-infringement, performance as per specifications..."
                                className={errors?.warranty_terms ? "border-red-500" : ""}
                            />
                            {errors?.warranty_terms && <p className="text-xs text-red-500">{errors.warranty_terms}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="support_and_maintenance" className="flex items-center gap-1">
                                Support & Maintenance Scope <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="support_and_maintenance"
                                name="support_and_maintenance"
                                rows={2}
                                value={formData.support_and_maintenance || ''}
                                onChange={handleInputChange}
                                placeholder="Free warranty bug support & optional AMC terms..."
                                className={errors?.support_and_maintenance ? "border-red-500" : ""}
                            />
                            {errors?.support_and_maintenance && <p className="text-xs text-red-500">{errors.support_and_maintenance}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service_level_agreement">Service Level Agreement (SLA) (Optional)</Label>
                            <Textarea
                                id="service_level_agreement"
                                name="service_level_agreement"
                                rows={2}
                                value={formData.service_level_agreement || ''}
                                onChange={handleInputChange}
                                placeholder="Priority 1/2/3 response and resolution timelines..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 8: Special Project Frameworks */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        8. Special Project Categories & Delivery Flags
                    </CardTitle>
                    <CardDescription>Select specific software project nature and methodology flags.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="saas_project"
                                checked={formData.saas_project || false}
                                onCheckedChange={(checked) => handleSelectChange('saas_project', checked)}
                            />
                            <Label htmlFor="saas_project" className="text-sm font-normal cursor-pointer">
                                Cloud / SaaS Platform
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="ai_project"
                                checked={formData.ai_project || false}
                                onCheckedChange={(checked) => handleSelectChange('ai_project', checked)}
                            />
                            <Label htmlFor="ai_project" className="text-sm font-normal cursor-pointer">
                                AI / Machine Learning Integration
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="mobile_application"
                                checked={formData.mobile_application || false}
                                onCheckedChange={(checked) => handleSelectChange('mobile_application', checked)}
                            />
                            <Label htmlFor="mobile_application" className="text-sm font-normal cursor-pointer">
                                Mobile App (iOS / Android)
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="web_application"
                                checked={formData.web_application || false}
                                onCheckedChange={(checked) => handleSelectChange('web_application', checked)}
                            />
                            <Label htmlFor="web_application" className="text-sm font-normal cursor-pointer">
                                Web Application
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="agile_methodology"
                                checked={formData.agile_methodology || false}
                                onCheckedChange={(checked) => handleSelectChange('agile_methodology', checked)}
                            />
                            <Label htmlFor="agile_methodology" className="text-sm font-normal cursor-pointer">
                                Agile / Sprint Delivery
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="devops_services"
                                checked={formData.devops_services || false}
                                onCheckedChange={(checked) => handleSelectChange('devops_services', checked)}
                            />
                            <Label htmlFor="devops_services" className="text-sm font-normal cursor-pointer">
                                DevOps & CI/CD Pipeline
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="government_project"
                                checked={formData.government_project || false}
                                onCheckedChange={(checked) => handleSelectChange('government_project', checked)}
                            />
                            <Label htmlFor="government_project" className="text-sm font-normal cursor-pointer">
                                Government / Public Sector
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="cross_border_project"
                                checked={formData.cross_border_project || false}
                                onCheckedChange={(checked) => handleSelectChange('cross_border_project', checked)}
                            />
                            <Label htmlFor="cross_border_project" className="text-sm font-normal cursor-pointer">
                                Cross-Border Development
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 9: Legal Provisions & Signatories */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                        9. Governing Law, Jurisdiction & Execution Signatories
                    </CardTitle>
                    <CardDescription>Liability caps, dispute resolution, governing law, and authorized signatories.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="limitation_of_liability" className="flex items-center gap-1">
                                Limitation of Liability <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="limitation_of_liability"
                                name="limitation_of_liability"
                                value={formData.limitation_of_liability || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Total aggregate liability capped at total contract amount paid"
                                className={errors?.limitation_of_liability ? "border-red-500" : ""}
                            />
                            {errors?.limitation_of_liability && <p className="text-xs text-red-500">{errors.limitation_of_liability}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="indemnity_clause" className="flex items-center gap-1">
                                Indemnity Clause <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="indemnity_clause"
                                name="indemnity_clause"
                                value={formData.indemnity_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Indemnification against third-party IP infringement claims..."
                                className={errors?.indemnity_clause ? "border-red-500" : ""}
                            />
                            {errors?.indemnity_clause && <p className="text-xs text-red-500">{errors.indemnity_clause}</p>}
                        </div>
                    </div>

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
                                placeholder="e.g. Laws of India (IT Act 2000 & Contract Act 1872)"
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
                                Dispute Resolution <span className="text-red-500">*</span>
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
                                Miscellaneous Clauses <span className="text-red-500">*</span>
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
                                placeholder="Client: Mr. Amitav Banerjee; Developer: Mr. Siddharth Rao"
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
                            placeholder="Annexure A: Statement of Work (SOW); Annexure B: Milestone Schedule; Annexure C: SLA"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SoftwareDevForm;
