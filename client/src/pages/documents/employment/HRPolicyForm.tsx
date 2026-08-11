import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, BookOpen } from "lucide-react";

interface HRPolicyFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const HRPolicyForm: React.FC<HRPolicyFormProps> = ({
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
                company_name: 'Apex AI Software Technologies Private Limited',
                company_type: 'Private Limited',
                company_logo: '',
                registered_office: 'Block A, 4th Floor, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
                policy_version: '1.2',
                effective_date: new Date().toISOString().split('T')[0],
                approved_by: 'Board of Directors & Chief Human Resources Officer',
                policy_owner: 'HR Department',
                review_frequency: 'Annually',
                employment_policies: '1. Recruitment & Onboarding: All hirings must undergo strict professional background checks.\n2. Probation & Confirmation: New hires undergo 6 months probation. Confirmation is subject to performance review.\n3. Promotion & Transfer: Promotions occur during annual reviews based on KPIs.',
                attendance_policy: 'Employees must register attendance daily via biometrics or the HR Portal. Standard working hours are 9:30 AM to 6:30 PM. Core collaboration hours are 11:00 AM to 4:00 PM.',
                working_hours_policy: 'Standard 45-hour work week, Monday to Friday. Shift timings may vary based on business requirements. Overtime is only permitted for operations support and must be pre-approved.',
                leave_policy: 'Employees are entitled to 24 days of paid leave per year (12 Earned Leaves, 6 Sick Leaves, and 6 Casual Leaves). Earned leaves can be carried forward up to a maximum of 30 days.',
                holiday_policy: 'The company observes 10 mandatory public holidays per year, including National holidays (26th Jan, 15th Aug, 2nd Oct) and state festivals.',
                remote_work_policy: 'Remote work is permitted up to 2 days per week with manager approval. Employees must ensure stable internet and follow cyber security mandates.',
                hybrid_work_policy: 'Employees are required to attend the office at least 3 days per week (Tuesdays, Wednesdays, and Thursdays).',
                compensation_policy: 'Salaries are calculated monthly and paid on the last working day of the month. Components include Basic Salary, HRA, Special Allowance, and LTA. Performance bonuses are paid annually.',
                benefits_policy: 'Comprehensive group health insurance covering up to INR 5,00,000 for employee, spouse, and two children. Regular health check-ups and meal vouchers.',
                performance_management_policy: 'Annual performance cycles (April - March) with mid-year reviews. Goal-setting occurs in April. Performance Improvement Plan (PIP) duration is 30 to 90 days for low performers.',
                learning_development_policy: 'The company supports professional certifications with 100% tuition reimbursement up to INR 50,000 per year upon successful course completion.',
                code_of_conduct: 'Employees must maintain high ethical standards. Conflict of interest, bribery, and harassment are strictly prohibited. Strict POSH compliance is mandated.',
                confidentiality_policy: 'Employees shall maintain absolute confidentiality regarding all proprietary codebase, client data, patents, and financial plans during and post-employment.',
                information_security_policy: 'Mandatory password rotation every 90 days. Two-Factor Authentication (2FA) must be enabled on all corporate email profiles. Use of VPN is compulsory on public Wi-Fi.',
                intellectual_property_policy: 'All source code, designs, documentation, and tools developed during employment shall vest immediately and exclusively with the Company.',
                posh_policy: 'Zero-tolerance policy for sexual harassment. Apex Internal Committee (IC) is constituted for hearing grievances. The presiding officer is Ms. Sarah Mathews (VP HR).',
                health_safety_policy: 'Workplace safety compliance under OSH Code 2020. Annual fire drills and evacuation guidelines. Clean and hygienic office workspaces.',
                grievance_policy: 'Employees can report grievances to the immediate supervisor. Escalation path goes to HR Manager and finally to the Grievance Redressal Committee.',
                disciplinary_policy: 'Progressive disciplinary action: Verbal Warning, Written Warning, Suspension, and Termination. Code plagiarism or data theft results in immediate termination.',
                separation_policy: 'Notice period of 60 days for confirmed employees, and 30 days during probation. Buy-out is subject to management approval. Exit interviews are mandatory.',
                statutory_compliance: 'Strict compliance with EPF Act, Gratuity Act, Maternity Benefit Act, and POSH Act 2013.',
                amendment_policy: 'The company reserves the right to amend, delete, or add policies at any time. Changes will be notified to employees via email.',
                acknowledgment_text: 'I acknowledge that I have received, read, and understood the Apex AI HR Policy Manual, and I agree to abide by all its rules and guidelines.',
                company_industry: 'Information Technology',
                startup: true,
                remote_first: false,
                global_operations: false,
                authorized_signatory: 'Mr. Aniket Sen (HR Director)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_policies: 'This manual overrides all previous HR policy letters and documents.'
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

            {/* Section 1: Company Profile & Document Control */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Building2 className="h-5 w-5" />
                        Company Profile & Control
                    </CardTitle>
                    <CardDescription>Enter company details, version, and document owner parameters</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name" className={errors?.company_name ? "text-red-500" : ""}>
                                Company Legal Name *
                            </Label>
                            <Input
                                id="company_name"
                                name="company_name"
                                placeholder="e.g. Apex AI Software Technologies Private Limited"
                                value={formData.company_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('company_name')}
                            />
                            {errors?.company_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.company_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_type" className={errors?.company_type ? "text-red-500" : ""}>
                                Company Type *
                            </Label>
                            <Select
                                value={formData.company_type || 'Private Limited'}
                                onValueChange={(v) => handleSelectChange('company_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('company_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited Company</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited Company</SelectItem>
                                    <SelectItem value="LLP">LLP</SelectItem>
                                    <SelectItem value="Individual">Individual / Partnership</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.company_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.company_type}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="registered_office" className={errors?.registered_office ? "text-red-500" : ""}>
                                Registered Office Address *
                            </Label>
                            <Input
                                id="registered_office"
                                name="registered_office"
                                placeholder="Registered corporate address..."
                                value={formData.registered_office || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('registered_office')}
                            />
                            {errors?.registered_office && (
                                <p className="text-xs text-red-500 font-medium">{errors.registered_office}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_industry">Industry / Sector</Label>
                            <Input
                                id="company_industry"
                                name="company_industry"
                                placeholder="e.g. Information Technology"
                                value={formData.company_industry || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="policy_version" className={errors?.policy_version ? "text-red-500" : ""}>
                                Policy Version *
                            </Label>
                            <Input
                                id="policy_version"
                                name="policy_version"
                                placeholder="e.g. 1.2"
                                value={formData.policy_version || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('policy_version')}
                            />
                            {errors?.policy_version && (
                                <p className="text-xs text-red-500 font-medium">{errors.policy_version}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effective_date" className={errors?.effective_date ? "text-red-500" : ""}>
                                Effective Date *
                            </Label>
                            <Input
                                id="effective_date"
                                name="effective_date"
                                type="date"
                                value={formData.effective_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('effective_date')}
                            />
                            {errors?.effective_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.effective_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="approved_by" className={errors?.approved_by ? "text-red-500" : ""}>
                                Approved By *
                            </Label>
                            <Input
                                id="approved_by"
                                name="approved_by"
                                placeholder="Board of Directors / CHRO"
                                value={formData.approved_by || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('approved_by')}
                            />
                            {errors?.approved_by && (
                                <p className="text-xs text-red-500 font-medium">{errors.approved_by}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="policy_owner" className={errors?.policy_owner ? "text-red-500" : ""}>
                                Policy Owner *
                            </Label>
                            <Input
                                id="policy_owner"
                                name="policy_owner"
                                placeholder="HR Department"
                                value={formData.policy_owner || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('policy_owner')}
                            />
                            {errors?.policy_owner && (
                                <p className="text-xs text-red-500 font-medium">{errors.policy_owner}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="review_frequency" className={errors?.review_frequency ? "text-red-500" : ""}>
                                Review Frequency *
                            </Label>
                            <Input
                                id="review_frequency"
                                name="review_frequency"
                                placeholder="e.g. Annually, Bi-annually"
                                value={formData.review_frequency || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('review_frequency')}
                            />
                            {errors?.review_frequency && (
                                <p className="text-xs text-red-500 font-medium">{errors.review_frequency}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Employment Policies */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Users className="h-5 w-5" />
                        Employment & Lifecycle Policies
                    </CardTitle>
                    <CardDescription>Define recruitment, onboarding, probation, confirmation and promotion practices</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="employment_policies" className={errors?.employment_policies ? "text-red-500" : ""}>
                            Employment Lifecycle Policies *
                        </Label>
                        <Textarea
                            id="employment_policies"
                            name="employment_policies"
                            placeholder="Recruitment background checks, probation confirmations, promotions..."
                            rows={3}
                            value={formData.employment_policies || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('employment_policies')}
                        />
                        {errors?.employment_policies && (
                            <p className="text-xs text-red-500 font-medium">{errors.employment_policies}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="attendance_policy" className={errors?.attendance_policy ? "text-red-500" : ""}>
                            Attendance & Timing Policy *
                        </Label>
                        <Textarea
                            id="attendance_policy"
                            name="attendance_policy"
                            placeholder="Biometric logs, daily core collaborative hours..."
                            rows={2}
                            value={formData.attendance_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('attendance_policy')}
                        />
                        {errors?.attendance_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.attendance_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="working_hours_policy" className={errors?.working_hours_policy ? "text-red-500" : ""}>
                            Working Hours & Overtime *
                        </Label>
                        <Textarea
                            id="working_hours_policy"
                            name="working_hours_policy"
                            placeholder="Weekly working hours, shift timings, overtime rules..."
                            rows={2}
                            value={formData.working_hours_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('working_hours_policy')}
                        />
                        {errors?.working_hours_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.working_hours_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="leave_policy" className={errors?.leave_policy ? "text-red-500" : ""}>
                            Leave Accrual & Carry Forward Policy *
                        </Label>
                        <Textarea
                            id="leave_policy"
                            name="leave_policy"
                            placeholder="Casual, sick, and earned leave allocations and limits..."
                            rows={2}
                            value={formData.leave_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('leave_policy')}
                        />
                        {errors?.leave_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.leave_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="holiday_policy" className={errors?.holiday_policy ? "text-red-500" : ""}>
                            Public Holidays Policy *
                        </Label>
                        <Textarea
                            id="holiday_policy"
                            name="holiday_policy"
                            placeholder="National holidays, state public list..."
                            rows={2}
                            value={formData.holiday_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('holiday_policy')}
                        />
                        {errors?.holiday_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.holiday_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="remote_work_policy">Remote Work Policies (Optional)</Label>
                        <Textarea
                            id="remote_work_policy"
                            name="remote_work_policy"
                            placeholder="Internet limits, home setups, communications..."
                            rows={2}
                            value={formData.remote_work_policy || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hybrid_work_policy">Hybrid Office Attendance policies (Optional)</Label>
                        <Textarea
                            id="hybrid_work_policy"
                            name="hybrid_work_policy"
                            placeholder="Required office attendance days..."
                            rows={2}
                            value={formData.hybrid_work_policy || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Compensation & Benefits */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Compensation & Performance Review
                    </CardTitle>
                    <CardDescription>Salary components, benefits, health insurance, and review cycles</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="compensation_policy" className={errors?.compensation_policy ? "text-red-500" : ""}>
                            Compensation & Salary Structure *
                        </Label>
                        <Textarea
                            id="compensation_policy"
                            name="compensation_policy"
                            placeholder="Salary components (Basic, HRA, allowance), payout dates, bonuses..."
                            rows={2}
                            value={formData.compensation_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('compensation_policy')}
                        />
                        {errors?.compensation_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.compensation_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="benefits_policy" className={errors?.benefits_policy ? "text-red-500" : ""}>
                            Employee Benefits & Health Insurance *
                        </Label>
                        <Textarea
                            id="benefits_policy"
                            name="benefits_policy"
                            placeholder="Medical insurance caps, retirement PF, state gratuity rules..."
                            rows={2}
                            value={formData.benefits_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('benefits_policy')}
                        />
                        {errors?.benefits_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.benefits_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="performance_management_policy" className={errors?.performance_management_policy ? "text-red-500" : ""}>
                            Performance Management Policy *
                        </Label>
                        <Textarea
                            id="performance_management_policy"
                            name="performance_management_policy"
                            placeholder="KPI goal-setting, mid-term reviews, PIP programs..."
                            rows={2}
                            value={formData.performance_management_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('performance_management_policy')}
                        />
                        {errors?.performance_management_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.performance_management_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="learning_development_policy" className={errors?.learning_development_policy ? "text-red-500" : ""}>
                            Learning & Development *
                        </Label>
                        <Textarea
                            id="learning_development_policy"
                            name="learning_development_policy"
                            placeholder="Training options, certificate fee support, tuition reimbursements..."
                            rows={2}
                            value={formData.learning_development_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('learning_development_policy')}
                        />
                        {errors?.learning_development_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.learning_development_policy}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Conduct & POSH */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Conduct & POSH Policy
                    </CardTitle>
                    <CardDescription>Professional behavior, anti-harassment committee, and dispute escalations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code_of_conduct" className={errors?.code_of_conduct ? "text-red-500" : ""}>
                            Employee Code of Conduct *
                        </Label>
                        <Textarea
                            id="code_of_conduct"
                            name="code_of_conduct"
                            placeholder="Bribery prohibitions, gift policies, social media codes..."
                            rows={3}
                            value={formData.code_of_conduct || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('code_of_conduct')}
                        />
                        {errors?.code_of_conduct && (
                            <p className="text-xs text-red-500 font-medium">{errors.code_of_conduct}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="posh_policy">Prevention of Sexual Harassment (POSH) (Optional)</Label>
                        <Textarea
                            id="posh_policy"
                            name="posh_policy"
                            placeholder="Constitution of Internal Committee (IC), hearing processes..."
                            rows={2}
                            value={formData.posh_policy || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="grievance_policy" className={errors?.grievance_policy ? "text-red-500" : ""}>
                            Grievance Redressal Policy *
                        </Label>
                        <Textarea
                            id="grievance_policy"
                            name="grievance_policy"
                            placeholder="Escalation steps for resolving employee conflicts..."
                            rows={2}
                            value={formData.grievance_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('grievance_policy')}
                        />
                        {errors?.grievance_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.grievance_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="disciplinary_policy" className={errors?.disciplinary_policy ? "text-red-500" : ""}>
                            Disciplinary Actions Policy *
                        </Label>
                        <Textarea
                            id="disciplinary_policy"
                            name="disciplinary_policy"
                            placeholder="Warnings, suspensions, material breach terminations..."
                            rows={2}
                            value={formData.disciplinary_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('disciplinary_policy')}
                        />
                        {errors?.disciplinary_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.disciplinary_policy}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Cybersecurity & Intellectual Property */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Cybersecurity & Intellectual Property
                    </CardTitle>
                    <CardDescription>IP assignment covenants, password management, and data confidentiality</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confidentiality_policy" className={errors?.confidentiality_policy ? "text-red-500" : ""}>
                            Data & Asset Confidentiality *
                        </Label>
                        <Textarea
                            id="confidentiality_policy"
                            name="confidentiality_policy"
                            placeholder="Protection of client profiles, database keys, source codes..."
                            rows={2}
                            value={formData.confidentiality_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidentiality_policy')}
                        />
                        {errors?.confidentiality_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidentiality_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="information_security_policy" className={errors?.information_security_policy ? "text-red-500" : ""}>
                            Information Security & IT Usage *
                        </Label>
                        <Textarea
                            id="information_security_policy"
                            name="information_security_policy"
                            placeholder="Device protocols, VPN mandates, password schedules..."
                            rows={2}
                            value={formData.information_security_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('information_security_policy')}
                        />
                        {errors?.information_security_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.information_security_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_policy" className={errors?.intellectual_property_policy ? "text-red-500" : ""}>
                            Intellectual Property Policy *
                        </Label>
                        <Textarea
                            id="intellectual_property_policy"
                            name="intellectual_property_policy"
                            placeholder="IP vesting, copyright transfer on codebase creations..."
                            rows={2}
                            value={formData.intellectual_property_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intellectual_property_policy')}
                        />
                        {errors?.intellectual_property_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.intellectual_property_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="health_safety_policy" className={errors?.health_safety_policy ? "text-red-500" : ""}>
                            Health, Safety & Wellness *
                        </Label>
                        <Textarea
                            id="health_safety_policy"
                            name="health_safety_policy"
                            placeholder="Fire drills, office sanitation, mental health initiatives..."
                            rows={2}
                            value={formData.health_safety_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('health_safety_policy')}
                        />
                        {errors?.health_safety_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.health_safety_policy}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Exits & Signatures */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Exits, Controls & Signatures
                    </CardTitle>
                    <CardDescription>Notice buyouts, full and final settlements, and policy updates</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="separation_policy" className={errors?.separation_policy ? "text-red-500" : ""}>
                                Separation & Notice Policies *
                            </Label>
                            <Textarea
                                id="separation_policy"
                                name="separation_policy"
                                placeholder="Notice periods, buyout options, exit interview mandates..."
                                rows={2}
                                value={formData.separation_policy || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('separation_policy')}
                            />
                            {errors?.separation_policy && (
                                <p className="text-xs text-red-500 font-medium">{errors.separation_policy}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="statutory_compliance" className={errors?.statutory_compliance ? "text-red-500" : ""}>
                                Statutory Labor Compliance *
                            </Label>
                            <Textarea
                                id="statutory_compliance"
                                name="statutory_compliance"
                                placeholder="Maternity benefits, Payment of Gratuity, EPF standards..."
                                rows={2}
                                value={formData.statutory_compliance || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('statutory_compliance')}
                            />
                            {errors?.statutory_compliance && (
                                <p className="text-xs text-red-500 font-medium">{errors.statutory_compliance}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="amendment_policy" className={errors?.amendment_policy ? "text-red-500" : ""}>
                                Policy Amendment *
                            </Label>
                            <Textarea
                                id="amendment_policy"
                                name="amendment_policy"
                                placeholder="Right to modify policy, email notification guidelines..."
                                rows={2}
                                value={formData.amendment_policy || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('amendment_policy')}
                            />
                            {errors?.amendment_policy && (
                                <p className="text-xs text-red-500 font-medium">{errors.amendment_policy}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="acknowledgment_text" className={errors?.acknowledgment_text ? "text-red-500" : ""}>
                                Employee Acknowledgment Text *
                            </Label>
                            <Textarea
                                id="acknowledgment_text"
                                name="acknowledgment_text"
                                placeholder="Verification statement employees sign..."
                                rows={2}
                                value={formData.acknowledgment_text || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('acknowledgment_text')}
                            />
                            {errors?.acknowledgment_text && (
                                <p className="text-xs text-red-500 font-medium">{errors.acknowledgment_text}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatory" className={errors?.authorized_signatory ? "text-red-500" : ""}>
                                Authorized Approver Name/Designation *
                            </Label>
                            <Input
                                id="authorized_signatory"
                                name="authorized_signatory"
                                placeholder="e.g. Mr. Aniket Sen (HR Director)"
                                value={formData.authorized_signatory || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatory')}
                            />
                            {errors?.authorized_signatory && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatory}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="execution_place" className={errors?.execution_place ? "text-red-500" : ""}>
                                Place of Execution *
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
                                Date of Execution *
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

            {/* Section 7: Configuration Setup Flags */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific startup, remote, and global settings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="startup"
                                checked={formData.startup || false}
                                onCheckedChange={(checked) => handleSelectChange('startup', !!checked)}
                            />
                            <Label htmlFor="startup" className="text-sm font-normal cursor-pointer">Startup flexibility policies</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="remote_first"
                                checked={formData.remote_first || false}
                                onCheckedChange={(checked) => handleSelectChange('remote_first', !!checked)}
                            />
                            <Label htmlFor="remote_first" className="text-sm font-normal cursor-pointer">Remote-first company</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="global_operations"
                                checked={formData.global_operations || false}
                                onCheckedChange={(checked) => handleSelectChange('global_operations', !!checked)}
                            />
                            <Label htmlFor="global_operations" className="text-sm font-normal cursor-pointer">Global operations compliance</Label>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="additional_policies">Additional Custom policies / Appendices (Optional)</Label>
                        <Textarea
                            id="additional_policies"
                            name="additional_policies"
                            placeholder="Add any specific guidelines, special allowances, etc..."
                            rows={3}
                            value={formData.additional_policies || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HRPolicyForm;
