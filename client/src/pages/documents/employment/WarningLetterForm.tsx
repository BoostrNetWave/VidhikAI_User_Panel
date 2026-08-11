import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, AlertCircle } from "lucide-react";

interface WarningLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const WarningLetterForm: React.FC<WarningLetterFormProps> = ({
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
                cin: 'U72200KA2021PTC143100',
                registered_office: 'Block A, 4th Floor, Tech Park Main Road, Outer Ring Road, Bangalore, Karnataka 560103',
                letter_number: 'APEX/DISC/2026/WARN-310',
                issue_date: new Date().toISOString().split('T')[0],
                employee_name: 'Rohit Verma',
                employee_id: 'APEX-2023-0104',
                designation: 'Senior Software Engineer',
                department: 'Core Platform Engineering',
                subject: 'Warning Letter: Written Warning for Breach of Confidentiality and Security Policies',
                incident_date: new Date().toISOString().split('T')[0],
                incident_description: 'On the incident date, it was detected that database tables containing client credentials were pulled from the server without JIRA approval, using a private device.',
                policy_violations: '1. Code of Conduct: Section 12 (Information Security)\n2. Employment Agreement: Clause 7.1 (Confidentiality Covenant)',
                investigation_reference: 'Apex Security Operations Audit Report Ref: SEC-2026-098',
                show_cause_notice_reference: 'Show Cause Notice Ref: APEX/DISC/2026/SCN-089 dated 15th January 2026',
                employee_explanation_summary: 'The employee submitted a response stating that the pull was executed to debug a staging environment bug rapidly, and the private device was used because of corporate VPN latency.',
                findings: 'The Disciplinary Committee reviewed the explanation and found that downloading database dumps to personal devices remains a severe policy breach, regardless of intent.',
                warning_type: 'First',
                corrective_action_plan: '1. Immediately delete all local database copies and sign the wipe declaration.\n2. Complete the Mandatory Information Security compliance training within 14 days.\n3. Utilize only corporate network environments for engineering checkouts.',
                monitoring_period: '90 Days from the date of issue of this Letter',
                consequences_of_repeat_misconduct: 'Any subsequent violations of data security or confidentiality policies within the monitoring period will result in further disciplinary action, up to and including termination of employment under Standing Orders.',
                attendance_issue: false,
                performance_issue: false,
                information_security_issue: true,
                safety_violation: false,
                posh_related: false,
                previous_warning_reference: 'None',
                hr_representative: 'Ms. Sarah Mathews (VP Human Resources)',
                authorized_signatory: 'Mr. Aniket Sen (Director HR & Compliance)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure A: Wipe Declaration Certificate\nAnnexure B: Disciplinary Committee Meeting Minutes',
                additional_conditions: 'This warning letter is placed in your official personnel file and will be reviewed upon the completion of the monitoring period.'
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

            {/* Section 1: Corporate Profile & Letter Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Building2 className="h-5 w-5" />
                        Company & Letter Details
                    </CardTitle>
                    <CardDescription>Enter company details, CIN, letter reference numbers, and dates</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name" className={errors?.company_name ? "text-red-500" : ""}>
                                Company legal Name *
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
                        <div className="space-y-2">
                            <Label htmlFor="cin">Company CIN (Optional)</Label>
                            <Input
                                id="cin"
                                name="cin"
                                placeholder="e.g. U72200KA2021PTC143100"
                                value={formData.cin || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="letter_number">Letter Reference Number (Optional)</Label>
                            <Input
                                id="letter_number"
                                name="letter_number"
                                placeholder="e.g. APEX/DISC/2026/WARN-310"
                                value={formData.letter_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="registered_office" className={errors?.registered_office ? "text-red-500" : ""}>
                                Registered Office *
                            </Label>
                            <Input
                                id="registered_office"
                                name="registered_office"
                                placeholder="Registered corporate office..."
                                value={formData.registered_office || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('registered_office')}
                            />
                            {errors?.registered_office && (
                                <p className="text-xs text-red-500 font-medium">{errors.registered_office}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="issue_date" className={errors?.issue_date ? "text-red-500" : ""}>
                                Issue Date *
                            </Label>
                            <Input
                                id="issue_date"
                                name="issue_date"
                                type="date"
                                value={formData.issue_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('issue_date')}
                            />
                            {errors?.issue_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.issue_date}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Employee Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <UserCheck className="h-5 w-5" />
                        Employee Credentials
                    </CardTitle>
                    <CardDescription>Enter details of the employee to whom the warning is addressed</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employee_name" className={errors?.employee_name ? "text-red-500" : ""}>
                                Employee Name *
                            </Label>
                            <Input
                                id="employee_name"
                                name="employee_name"
                                placeholder="e.g. Rohit Verma"
                                value={formData.employee_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('employee_name')}
                            />
                            {errors?.employee_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.employee_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employee_id" className={errors?.employee_id ? "text-red-500" : ""}>
                                Employee ID *
                            </Label>
                            <Input
                                id="employee_id"
                                name="employee_id"
                                placeholder="e.g. APEX-2023-0104"
                                value={formData.employee_id || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('employee_id')}
                            />
                            {errors?.employee_id && (
                                <p className="text-xs text-red-500 font-medium">{errors.employee_id}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation" className={errors?.designation ? "text-red-500" : ""}>
                                Employee Designation *
                            </Label>
                            <Input
                                id="designation"
                                name="designation"
                                placeholder="e.g. Senior Software Engineer"
                                value={formData.designation || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('designation')}
                            />
                            {errors?.designation && (
                                <p className="text-xs text-red-500 font-medium">{errors.designation}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department" className={errors?.department ? "text-red-500" : ""}>
                                Department *
                            </Label>
                            <Input
                                id="department"
                                name="department"
                                placeholder="e.g. Core Platform Engineering"
                                value={formData.department || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('department')}
                            />
                            {errors?.department && (
                                <p className="text-xs text-red-500 font-medium">{errors.department}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Particulars of Misconduct */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <AlertCircle className="h-5 w-5" />
                        Disciplinary Findings & Misconduct Details
                    </CardTitle>
                    <CardDescription>Define dates, incident descriptions, violated policies, warning types, and findings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject" className={errors?.subject ? "text-red-500" : ""}>
                            Subject of Letter *
                        </Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="e.g. Warning Letter: Written Warning for Policy Breach"
                            value={formData.subject || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('subject')}
                        />
                        {errors?.subject && (
                            <p className="text-xs text-red-500 font-medium">{errors.subject}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="incident_date" className={errors?.incident_date ? "text-red-500" : ""}>
                                Incident Date *
                            </Label>
                            <Input
                                id="incident_date"
                                name="incident_date"
                                type="date"
                                value={formData.incident_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('incident_date')}
                            />
                            {errors?.incident_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.incident_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="warning_type" className={errors?.warning_type ? "text-red-500" : ""}>
                                Warning Level *
                            </Label>
                            <Select
                                value={formData.warning_type || 'First'}
                                onValueChange={(v) => handleSelectChange('warning_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('warning_type')}>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="First">First Written Warning</SelectItem>
                                    <SelectItem value="Second">Second Written Warning</SelectItem>
                                    <SelectItem value="Final">Final Written Warning</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.warning_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.warning_type}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="incident_description" className={errors?.incident_description ? "text-red-500" : ""}>
                            Factual Incident Description *
                        </Label>
                        <Textarea
                            id="incident_description"
                            name="incident_description"
                            placeholder="Provide factual details of the misconduct..."
                            rows={3}
                            value={formData.incident_description || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('incident_description')}
                        />
                        {errors?.incident_description && (
                            <p className="text-xs text-red-500 font-medium">{errors.incident_description}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="policy_violations" className={errors?.policy_violations ? "text-red-500" : ""}>
                            Violoated Policy References *
                        </Label>
                        <Textarea
                            id="policy_violations"
                            name="policy_violations"
                            placeholder="List code of conduct sections or standing orders violated..."
                            rows={2}
                            value={formData.policy_violations || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('policy_violations')}
                        />
                        {errors?.policy_violations && (
                            <p className="text-xs text-red-500 font-medium">{errors.policy_violations}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="investigation_reference">Investigation Report Reference (Optional)</Label>
                            <Input
                                id="investigation_reference"
                                name="investigation_reference"
                                placeholder="e.g. Audit Report Ref: SEC-2026-098"
                                value={formData.investigation_reference || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="show_cause_notice_reference">Show Cause Notice Reference (Optional)</Label>
                            <Input
                                id="show_cause_notice_reference"
                                name="show_cause_notice_reference"
                                placeholder="e.g. Show Cause Notice Ref: SCN-089"
                                value={formData.show_cause_notice_reference || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employee_explanation_summary">Employee Explanation Summary (Optional)</Label>
                        <Textarea
                            id="employee_explanation_summary"
                            name="employee_explanation_summary"
                            placeholder="Briefly state employee explanation submitted in their reply..."
                            rows={2}
                            value={formData.employee_explanation_summary || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="findings">Disciplinary Committee Findings (Optional)</Label>
                        <Textarea
                            id="findings"
                            name="findings"
                            placeholder="Enumerate the findings established during inquiry..."
                            rows={2}
                            value={formData.findings || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Corrective Action Plan */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Corrective Action Plan & Outcomes
                    </CardTitle>
                    <CardDescription>Improvement schedules, monitoring timelines, and next steps</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="corrective_action_plan" className={errors?.corrective_action_plan ? "text-red-500" : ""}>
                            Corrective Action Plan *
                        </Label>
                        <Textarea
                            id="corrective_action_plan"
                            name="corrective_action_plan"
                            placeholder="Mandatory tasks, training, delete declarations..."
                            rows={3}
                            value={formData.corrective_action_plan || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('corrective_action_plan')}
                        />
                        {errors?.corrective_action_plan && (
                            <p className="text-xs text-red-500 font-medium">{errors.corrective_action_plan}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="monitoring_period">Monitoring / Probation Period (Optional)</Label>
                            <Input
                                id="monitoring_period"
                                name="monitoring_period"
                                placeholder="e.g. 90 Days from the date of issue of this Letter"
                                value={formData.monitoring_period || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="previous_warning_reference">Prior Warning References (Optional)</Label>
                            <Input
                                id="previous_warning_reference"
                                name="previous_warning_reference"
                                placeholder="e.g. Verbal Warning Dated 12th Dec"
                                value={formData.previous_warning_reference || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="consequences_of_repeat_misconduct">Consequences of Repeat Misconduct (Optional)</Label>
                            <Textarea
                                id="consequences_of_repeat_misconduct"
                                name="consequences_of_repeat_misconduct"
                                placeholder="State that repeated breaches will result in progressive disciplinary action..."
                                rows={2}
                                value={formData.consequences_of_repeat_misconduct || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Signature Coordinates */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Execution Coordinates
                    </CardTitle>
                    <CardDescription>Designate authorized signatories, HR representatives, place, and date</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorized_signatory" className={errors?.authorized_signatory ? "text-red-500" : ""}>
                                Authorized Signatory *
                            </Label>
                            <Input
                                id="authorized_signatory"
                                name="authorized_signatory"
                                placeholder="e.g. Mr. Aniket Sen (Director HR & Compliance)"
                                value={formData.authorized_signatory || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatory')}
                            />
                            {errors?.authorized_signatory && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatory}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hr_representative">HR Representative (Optional)</Label>
                            <Input
                                id="hr_representative"
                                name="hr_representative"
                                placeholder="e.g. Ms. Sarah Mathews (VP HR)"
                                value={formData.hr_representative || ''}
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="annexures">Annexures (Optional)</Label>
                            <Input
                                id="annexures"
                                name="annexures"
                                placeholder="e.g. Annexure A: Wipe Declaration"
                                value={formData.annexures || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="additional_conditions">Additional Conditions (Optional)</Label>
                            <Textarea
                                id="additional_conditions"
                                name="additional_conditions"
                                placeholder="Add any specific conditions..."
                                rows={2}
                                value={formData.additional_conditions || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Specific Configuration Flags */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Specific Incident Flags
                    </CardTitle>
                    <CardDescription>Toggle specific incident categories for tailored templates</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="attendance_issue"
                                checked={formData.attendance_issue || false}
                                onCheckedChange={(checked) => handleSelectChange('attendance_issue', !!checked)}
                            />
                            <Label htmlFor="attendance_issue" className="text-sm font-normal cursor-pointer">Attendance Misconduct</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="performance_issue"
                                checked={formData.performance_issue || false}
                                onCheckedChange={(checked) => handleSelectChange('performance_issue', !!checked)}
                            />
                            <Label htmlFor="performance_issue" className="text-sm font-normal cursor-pointer">Performance Issue (PIP)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="information_security_issue"
                                checked={formData.information_security_issue || false}
                                onCheckedChange={(checked) => handleSelectChange('information_security_issue', !!checked)}
                            />
                            <Label htmlFor="information_security_issue" className="text-sm font-normal cursor-pointer">Info Security Incident</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="safety_violation"
                                checked={formData.safety_violation || false}
                                onCheckedChange={(checked) => handleSelectChange('safety_violation', !!checked)}
                            />
                            <Label htmlFor="safety_violation" className="text-sm font-normal cursor-pointer">Safety / HSE Violation</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="posh_related"
                                checked={formData.posh_related || false}
                                onCheckedChange={(checked) => handleSelectChange('posh_related', !!checked)}
                            />
                            <Label htmlFor="posh_related" className="text-sm font-normal cursor-pointer">POSH-Related Matter</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WarningLetterForm;
