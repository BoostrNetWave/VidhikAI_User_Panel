import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface InternshipAgreementFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const InternshipAgreementForm: React.FC<InternshipAgreementFormProps> = ({
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
                agreement_date: new Date().toISOString().split('T')[0],
                organization_name: 'Apex AI Systems Private Limited',
                organization_type: 'Private Limited',
                organization_address: '5th Floor, Block C, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
                intern_name: 'Rohit Verma',
                intern_address: 'Room 204, Hostels 3, Indian Institute of Information Technology, Dharwad, Karnataka 580009',
                educational_institution: 'Indian Institute of Information Technology, Dharwad',
                institution_address: 'IIIT Dharwad Campus, Itigatti Road, Dharwad, Karnataka 580009',
                internship_title: 'Full-Stack Developer Intern',
                department: 'Software Engineering',
                reporting_supervisor: 'Mr. Rajesh Kumar (Senior Architect)',
                internship_mode: 'Hybrid',
                commencement_date: new Date().toISOString().split('T')[0],
                end_date: '2026-10-31',
                duration: '3 Months',
                working_days: '5 days per week (Monday to Friday)',
                working_hours: '9:30 AM to 6:30 PM (inclusive of 1 hour lunch break)',
                learning_objectives: '1. Hands-on learning of React and Node.js enterprise microservices architectures.\n2. Understanding Agile development processes, code reviews, and Git workflows.\n3. Exposure to scalable CI/CD pipelines and Docker deployment.',
                scope_of_work: 'Development of UI modules for the customer portal, drafting unit tests for backend APIs under the guidance of the reporting supervisor, and bug-fixing of reported portal issues.',
                training_plan: 'Week 1-2: Onboarding & Stack Review\nWeek 3-8: Guided Feature Development\nWeek 9-12: End-to-end Integration and Performance Optimization',
                mentor_details: 'Mr. Rajesh Kumar, IIIT Alumnus and Engineering Architect',
                stipend_type: 'Paid',
                stipend_amount: 'INR 25,000 per month',
                reimbursement_policy: 'One-time relocation support of INR 5,000 and pre-approved project travel costs reimbursed against invoices.',
                payment_schedule: 'Stipend shall be disbursed on the 5th day of the subsequent calendar month.',
                confidentiality_clause: 'Intern shall not disclose, share, or publish any proprietary source codes, internal databases, password keys, or designs during the internship term.',
                intellectual_property_clause: 'All codes, modules, UI pages, and documentation developed during the internship shall vest exclusively with Apex AI Systems.',
                data_processing: 'All user data handled during developmental staging must comply with the DPDP Act 2023 guidelines.',
                attendance_requirements: 'Minimum 90% attendance during the internship period. Regular check-ins on Slack by 9:45 AM daily.',
                organization_obligations: 'Provide access to developer laptops, AWS staging profiles, Slack workspaces, and allocate a dedicated mentor.',
                intern_obligations: 'Follow all company security protocols, maintain confidentiality, complete weekly reports, and comply with working hour guidelines.',
                certificate_of_completion: 'Intern will receive an official Certificate of Internship Completion and Recommendation Letter upon successful performance sign-off by the mentor.',
                ppo_eligibility: 'Eligible for a Pre-Placement Offer (PPO) for the role of Associate Software Engineer subject to outstanding performance evaluation and business requirements.',
                termination_conditions: 'Either party may terminate the internship with 7 days written notice, or immediately by the organization for code plagiarism, breach of confidentiality, or misconduct.',
                notice_period: '7 Days written notice',
                governing_law: 'Laws of India',
                dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 in Bangalore by a sole arbitrator.',
                electronic_execution: true,
                authorized_signatories: 'Apex AI Systems: Mr. Aniket Sen (HR Director)\nIntern: Rohit Verma',
                institution_signatory: 'IIIT Dharwad Placement Office: Prof. Amit Nair',
                witness_details: 'Witness 1: Mr. Suresh Gowda, Bangalore\nWitness 2: Ms. Priya Sharma, Bangalore',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'This internship is purely educational and does not guarantee regular permanent employment upon completion.'
            });
        }
    };

    const getErrorClass = (fieldName: string) => {
        return errors?.[fieldName] ? "border-red-500 focus-visible:ring-red-500" : "";
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end pt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillDummyData}
                    className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50"
                >
                    <Sparkles className="h-4 w-4" />
                    Fill Dummy Data
                </Button>
            </div>

            {/* Section 1: Organization Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Building2 className="h-5 w-5" />
                        Organization Details
                    </CardTitle>
                    <CardDescription>Enter details of the hosting organization</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="organization_name" className={errors?.organization_name ? "text-red-500" : ""}>
                                Organization Name *
                            </Label>
                            <Input
                                id="organization_name"
                                name="organization_name"
                                placeholder="e.g. Apex AI Systems Private Limited"
                                value={formData.organization_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('organization_name')}
                            />
                            {errors?.organization_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.organization_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="organization_type" className={errors?.organization_type ? "text-red-500" : ""}>
                                Organization Type *
                            </Label>
                            <Select
                                value={formData.organization_type || 'Private Limited'}
                                onValueChange={(v) => handleSelectChange('organization_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('organization_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited Company</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited Company</SelectItem>
                                    <SelectItem value="LLP">LLP</SelectItem>
                                    <SelectItem value="Partnership">Partnership Firm</SelectItem>
                                    <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.organization_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.organization_type}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="organization_address" className={errors?.organization_address ? "text-red-500" : ""}>
                                Organization Registered Address *
                            </Label>
                            <Input
                                id="organization_address"
                                name="organization_address"
                                placeholder="Registered office or principal business office address..."
                                value={formData.organization_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('organization_address')}
                            />
                            {errors?.organization_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.organization_address}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Intern Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <UserCheck className="h-5 w-5" />
                        Intern Details
                    </CardTitle>
                    <CardDescription>Enter details of the student or trainee being engaged</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="intern_name" className={errors?.intern_name ? "text-red-500" : ""}>
                                Intern Name *
                            </Label>
                            <Input
                                id="intern_name"
                                name="intern_name"
                                placeholder="e.g. Rohit Verma"
                                value={formData.intern_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('intern_name')}
                            />
                            {errors?.intern_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.intern_name}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="intern_address" className={errors?.intern_address ? "text-red-500" : ""}>
                                Intern Address *
                            </Label>
                            <Input
                                id="intern_address"
                                name="intern_address"
                                placeholder="Intern's residential or campus hostel address..."
                                value={formData.intern_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('intern_address')}
                            />
                            {errors?.intern_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.intern_address}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="educational_institution">Educational Institution (Optional)</Label>
                            <Input
                                id="educational_institution"
                                name="educational_institution"
                                placeholder="e.g. Indian Institute of Information Technology, Dharwad"
                                value={formData.educational_institution || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="institution_address">Institution Address (Optional)</Label>
                            <Input
                                id="institution_address"
                                name="institution_address"
                                placeholder="Institution complete address..."
                                value={formData.institution_address || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Internship details & SOW */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Award className="h-5 w-5" />
                        Internship Structure & SOW
                    </CardTitle>
                    <CardDescription>Timelines, working hours, mentorship, and training plan</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="internship_title" className={errors?.internship_title ? "text-red-500" : ""}>
                                Internship Title *
                            </Label>
                            <Input
                                id="internship_title"
                                name="internship_title"
                                placeholder="e.g. Full-Stack Developer Intern"
                                value={formData.internship_title || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('internship_title')}
                            />
                            {errors?.internship_title && (
                                <p className="text-xs text-red-500 font-medium">{errors.internship_title}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department" className={errors?.department ? "text-red-500" : ""}>
                                Department *
                            </Label>
                            <Input
                                id="department"
                                name="department"
                                placeholder="e.g. Software Engineering"
                                value={formData.department || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('department')}
                            />
                            {errors?.department && (
                                <p className="text-xs text-red-500 font-medium">{errors.department}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reporting_supervisor" className={errors?.reporting_supervisor ? "text-red-500" : ""}>
                                Reporting Supervisor *
                            </Label>
                            <Input
                                id="reporting_supervisor"
                                name="reporting_supervisor"
                                placeholder="e.g. Mr. Rajesh Kumar (Senior Architect)"
                                value={formData.reporting_supervisor || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('reporting_supervisor')}
                            />
                            {errors?.reporting_supervisor && (
                                <p className="text-xs text-red-500 font-medium">{errors.reporting_supervisor}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="internship_mode" className={errors?.internship_mode ? "text-red-500" : ""}>
                                Internship Mode *
                            </Label>
                            <Select
                                value={formData.internship_mode || 'Office'}
                                onValueChange={(v) => handleSelectChange('internship_mode', v)}
                            >
                                <SelectTrigger className={getErrorClass('internship_mode')}>
                                    <SelectValue placeholder="Select Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Office">On-site Office</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid Office</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.internship_mode && (
                                <p className="text-xs text-red-500 font-medium">{errors.internship_mode}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="commencement_date" className={errors?.commencement_date ? "text-red-500" : ""}>
                                Commencement Date *
                            </Label>
                            <Input
                                id="commencement_date"
                                name="commencement_date"
                                type="date"
                                value={formData.commencement_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('commencement_date')}
                            />
                            {errors?.commencement_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.commencement_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date" className={errors?.end_date ? "text-red-500" : ""}>
                                End Date *
                            </Label>
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={formData.end_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('end_date')}
                            />
                            {errors?.end_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.end_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration" className={errors?.duration ? "text-red-500" : ""}>
                                Duration *
                            </Label>
                            <Input
                                id="duration"
                                name="duration"
                                placeholder="e.g. 3 Months"
                                value={formData.duration || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('duration')}
                            />
                            {errors?.duration && (
                                <p className="text-xs text-red-500 font-medium">{errors.duration}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="working_days" className={errors?.working_days ? "text-red-500" : ""}>
                                Working Days *
                            </Label>
                            <Input
                                id="working_days"
                                name="working_days"
                                placeholder="e.g. Monday to Friday"
                                value={formData.working_days || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('working_days')}
                            />
                            {errors?.working_days && (
                                <p className="text-xs text-red-500 font-medium">{errors.working_days}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="working_hours" className={errors?.working_hours ? "text-red-500" : ""}>
                                Working Hours *
                            </Label>
                            <Input
                                id="working_hours"
                                name="working_hours"
                                placeholder="e.g. 9:30 AM to 6:30 PM"
                                value={formData.working_hours || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('working_hours')}
                            />
                            {errors?.working_hours && (
                                <p className="text-xs text-red-500 font-medium">{errors.working_hours}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="learning_objectives" className={errors?.learning_objectives ? "text-red-500" : ""}>
                            Learning Objectives *
                        </Label>
                        <Textarea
                            id="learning_objectives"
                            name="learning_objectives"
                            placeholder="Detail what technical skills or professional processes the intern will learn..."
                            rows={3}
                            value={formData.learning_objectives || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('learning_objectives')}
                        />
                        {errors?.learning_objectives && (
                            <p className="text-xs text-red-500 font-medium">{errors.learning_objectives}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scope_of_work" className={errors?.scope_of_work ? "text-red-500" : ""}>
                            Scope of Work & Guided Tasks *
                        </Label>
                        <Textarea
                            id="scope_of_work"
                            name="scope_of_work"
                            placeholder="Describe software coding, portal design, unit test tasks..."
                            rows={3}
                            value={formData.scope_of_work || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('scope_of_work')}
                        />
                        {errors?.scope_of_work && (
                            <p className="text-xs text-red-500 font-medium">{errors.scope_of_work}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="training_plan" className={errors?.training_plan ? "text-red-500" : ""}>
                            Training & Mentorship Plan *
                        </Label>
                        <Textarea
                            id="training_plan"
                            name="training_plan"
                            placeholder="Week-wise training outline..."
                            rows={2}
                            value={formData.training_plan || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('training_plan')}
                        />
                        {errors?.training_plan && (
                            <p className="text-xs text-red-500 font-medium">{errors.training_plan}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mentor_details" className={errors?.mentor_details ? "text-red-500" : ""}>
                            Mentor Details *
                        </Label>
                        <Input
                            id="mentor_details"
                            name="mentor_details"
                            placeholder="Name and designation of assigned mentor..."
                            value={formData.mentor_details || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('mentor_details')}
                        />
                        {errors?.mentor_details && (
                            <p className="text-xs text-red-500 font-medium">{errors.mentor_details}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="attendance_requirements" className={errors?.attendance_requirements ? "text-red-500" : ""}>
                            Attendance Requirements *
                        </Label>
                        <Input
                            id="attendance_requirements"
                            name="attendance_requirements"
                            placeholder="e.g. Minimum 90% attendance during the period"
                            value={formData.attendance_requirements || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('attendance_requirements')}
                        />
                        {errors?.attendance_requirements && (
                            <p className="text-xs text-red-500 font-medium">{errors.attendance_requirements}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Stipend & Reimbursements */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Stipend & Travel Allocations
                    </CardTitle>
                    <CardDescription>Define stipend structure, monthly amounts, and meal/travel allowance rules</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stipend_type" className={errors?.stipend_type ? "text-red-500" : ""}>
                                Stipend Type *
                            </Label>
                            <Select
                                value={formData.stipend_type || 'Paid'}
                                onValueChange={(v) => handleSelectChange('stipend_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('stipend_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid">Paid Internship</SelectItem>
                                    <SelectItem value="Unpaid">Unpaid Internship</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.stipend_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.stipend_type}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stipend_amount">Stipend Amount (Optional)</Label>
                            <Input
                                id="stipend_amount"
                                name="stipend_amount"
                                placeholder="e.g. INR 25,000 per month"
                                value={formData.stipend_amount || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reimbursement_policy">Reimbursement Policy (Optional)</Label>
                            <Input
                                id="reimbursement_policy"
                                name="reimbursement_policy"
                                placeholder="Meal allowance, relocation support, travel..."
                                value={formData.reimbursement_policy || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_schedule">Payment Schedule (Optional)</Label>
                            <Input
                                id="payment_schedule"
                                name="payment_schedule"
                                placeholder="e.g. Disbursed on the 5th day of subsequent month"
                                value={formData.payment_schedule || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Legal & General Clauses */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Legal Compliance & IP
                    </CardTitle>
                    <CardDescription>Define confidentiality, intellectual property assignment, and data privacy</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confidentiality_clause" className={errors?.confidentiality_clause ? "text-red-500" : ""}>
                            Confidentiality Obligations *
                        </Label>
                        <Textarea
                            id="confidentiality_clause"
                            name="confidentiality_clause"
                            placeholder="Intern obligations regarding proprietary source code, internal databases..."
                            rows={2}
                            value={formData.confidentiality_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidentiality_clause')}
                        />
                        {errors?.confidentiality_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidentiality_clause}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_clause" className={errors?.intellectual_property_clause ? "text-red-500" : ""}>
                            Intellectual Property Assignment *
                        </Label>
                        <Textarea
                            id="intellectual_property_clause"
                            name="intellectual_property_clause"
                            placeholder="Absolute and unconditional assignment of all codes, portal designs, and documentation to the organization..."
                            rows={2}
                            value={formData.intellectual_property_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intellectual_property_clause')}
                        />
                        {errors?.intellectual_property_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.intellectual_property_clause}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data_processing">Data Processing & DPDP Act compliance (Optional)</Label>
                        <Textarea
                            id="data_processing"
                            name="data_processing"
                            placeholder="Rules regarding handling and processing of personal datasets during training..."
                            rows={2}
                            value={formData.data_processing || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organization_obligations" className={errors?.organization_obligations ? "text-red-500" : ""}>
                            Organization Obligations *
                        </Label>
                        <Textarea
                            id="organization_obligations"
                            name="organization_obligations"
                            placeholder="Provide office desk access, staging profiles, laptops..."
                            rows={2}
                            value={formData.organization_obligations || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('organization_obligations')}
                        />
                        {errors?.organization_obligations && (
                            <p className="text-xs text-red-500 font-medium">{errors.organization_obligations}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intern_obligations" className={errors?.intern_obligations ? "text-red-500" : ""}>
                            Intern Obligations *
                        </Label>
                        <Textarea
                            id="intern_obligations"
                            name="intern_obligations"
                            placeholder="Ethical behaviour, reporting requirements, weekly logs, compliance with IT policies..."
                            rows={2}
                            value={formData.intern_obligations || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intern_obligations')}
                        />
                        {errors?.intern_obligations && (
                            <p className="text-xs text-red-500 font-medium">{errors.intern_obligations}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="certificate_of_completion">Certificate of Completion terms (Optional)</Label>
                            <Input
                                id="certificate_of_completion"
                                name="certificate_of_completion"
                                placeholder="e.g. Certificate and LOR issued upon successful sign-off"
                                value={formData.certificate_of_completion || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ppo_eligibility">PPO Eligibility guidelines (Optional)</Label>
                            <Input
                                id="ppo_eligibility"
                                name="ppo_eligibility"
                                placeholder="e.g. Eligible for PPO based on outstanding CTO review"
                                value={formData.ppo_eligibility || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="academic_reporting">University Academic Reporting terms (Optional)</Label>
                            <Textarea
                                id="academic_reporting"
                                name="academic_reporting"
                                placeholder="Describe academic logbook signatures, placement reports..."
                                rows={2}
                                value={formData.academic_reporting || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Exits & Governance */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Termination & Governance
                    </CardTitle>
                    <CardDescription>Termination notices, governing laws, and dispute seats</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="termination_conditions" className={errors?.termination_conditions ? "text-red-500" : ""}>
                                Termination Conditions *
                            </Label>
                            <Textarea
                                id="termination_conditions"
                                name="termination_conditions"
                                placeholder="7 days notice for convenience, or immediate termination for code plagiarism or misconduct..."
                                rows={2}
                                value={formData.termination_conditions || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('termination_conditions')}
                            />
                            {errors?.termination_conditions && (
                                <p className="text-xs text-red-500 font-medium">{errors.termination_conditions}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notice_period" className={errors?.notice_period ? "text-red-500" : ""}>
                                Notice Period *
                            </Label>
                            <Input
                                id="notice_period"
                                name="notice_period"
                                placeholder="e.g. 7 Days written notice"
                                value={formData.notice_period || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('notice_period')}
                            />
                            {errors?.notice_period && (
                                <p className="text-xs text-red-500 font-medium">{errors.notice_period}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="governing_law" className={errors?.governing_law ? "text-red-500" : ""}>
                                Governing Law *
                            </Label>
                            <Input
                                id="governing_law"
                                name="governing_law"
                                placeholder="e.g. Laws of India"
                                value={formData.governing_law || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('governing_law')}
                            />
                            {errors?.governing_law && (
                                <p className="text-xs text-red-500 font-medium">{errors.governing_law}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dispute_resolution" className={errors?.dispute_resolution ? "text-red-500" : ""}>
                                Dispute Resolution *
                            </Label>
                            <Textarea
                                id="dispute_resolution"
                                name="dispute_resolution"
                                placeholder="Arbitration seats, court jurisdictions..."
                                rows={2}
                                value={formData.dispute_resolution || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('dispute_resolution')}
                            />
                            {errors?.dispute_resolution && (
                                <p className="text-xs text-red-500 font-medium">{errors.dispute_resolution}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Execution Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Execution Details
                    </CardTitle>
                    <CardDescription>Designate signatories, place, and date of agreement</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatories" className={errors?.authorized_signatories ? "text-red-500" : ""}>
                                Authorized Signatories *
                            </Label>
                            <Textarea
                                id="authorized_signatories"
                                name="authorized_signatories"
                                placeholder="Names and designations of organization and intern executing..."
                                rows={2}
                                value={formData.authorized_signatories || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatories')}
                            />
                            {errors?.authorized_signatories && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatories}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="institution_signatory">University / Placement Officer Signatory (Optional)</Label>
                            <Input
                                id="institution_signatory"
                                name="institution_signatory"
                                placeholder="e.g. placement@iiitdwd.ac.in, placement officer"
                                value={formData.institution_signatory || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="witness_details">Witness Details (Optional)</Label>
                            <Textarea
                                id="witness_details"
                                name="witness_details"
                                placeholder="Names, addresses, and details of witnesses..."
                                rows={2}
                                value={formData.witness_details || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="execution_place" className={errors?.execution_place ? "text-red-500" : ""}>
                                Execution Place *
                            </Label>
                            <Input
                                id="execution_place"
                                name="execution_place"
                                placeholder="e.g. Bangalore"
                                value={formData.execution_place || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('execution_place')}
                            />
                            {errors?.execution_place && (
                                <p className="text-xs text-red-500 font-medium">{errors.execution_place}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="execution_date" className={errors?.execution_date ? "text-red-500" : ""}>
                                Execution Date *
                            </Label>
                            <Input
                                id="execution_date"
                                name="execution_date"
                                type="date"
                                value={formData.execution_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('execution_date')}
                            />
                            {errors?.execution_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.execution_date}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 8: Specific Layout Flags */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific layout variations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="electronic_execution"
                                checked={formData.electronic_execution || false}
                                onCheckedChange={(checked) => handleSelectChange('electronic_execution', !!checked)}
                            />
                            <Label htmlFor="electronic_execution" className="text-sm font-normal cursor-pointer">Electronic execution permitted</Label>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="additional_conditions">Additional Conditions / Board instructions (Optional)</Label>
                        <Textarea
                            id="additional_conditions"
                            name="additional_conditions"
                            placeholder="Add any specific startup-related conditions, board seats, etc..."
                            rows={3}
                            value={formData.additional_conditions || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InternshipAgreementForm;
