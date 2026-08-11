import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, AlertTriangle } from "lucide-react";

interface ShowCauseNoticeFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const ShowCauseNoticeForm: React.FC<ShowCauseNoticeFormProps> = ({
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
                notice_number: 'APEX/DISC/2026/SCN-089',
                issue_date: new Date().toISOString().split('T')[0],
                employee_name: 'Rohit Verma',
                employee_id: 'APEX-2023-0104',
                designation: 'Senior Software Engineer',
                department: 'Core Platform Engineering',
                subject: 'Show Cause Notice: Explanation for Unauthorized Access to Production Data Repositories',
                incident_date: new Date().toISOString().split('T')[0],
                incident_time: '14:35 PM',
                incident_location: 'Apex HQ Bangalore (Remote Logins via VP-401)',
                allegation_details: 'It has been reported that on the incident date, there was an unauthorized pull of client database tables. These actions were executed without corresponding JIRA approval tickets or platform manager authorizations.',
                policy_references: '1. Apex Code of Conduct: Section 12 (Information Security & Data Protection)\n2. Information Security Policy: Clause 4.2 (Production Access Controls)\n3. Employment Agreement: Section 7 (Confidentiality & Data Security Obligations)',
                evidence_list: '1. VPN Access logs tracking IP address 192.168.1.45\n2. AWS CloudTrail events recording production database pull executions\n3. Git repository branch checkout history logs.',
                witnesses: '1. Mr. Dinesh Kumar (Security Infrastructure Lead)\n2. Ms. Sarah Mathews (Core Engineering Lead)',
                response_deadline: 'Within 7 calendar days from the receipt of this Notice',
                response_submission_mode: 'Written submission via Email and Hard Copy',
                response_recipient: 'Compliance & HR Committee (compliance@apexai.com)',
                consequences_of_non_response: 'In the event that no explanation is received within the stipulated deadline, it shall be presumed that you have no explanation to offer, and the Company reserves the right to proceed with further disciplinary proceedings in accordance with the Model Standing Orders and applicable company policies.',
                suspension_pending_inquiry: false,
                financial_misconduct: false,
                information_security_incident: true,
                attendance_misconduct: false,
                posh_related: false,
                safety_violation: false,
                hr_representative: 'Ms. Sarah Mathews (VP Human Resources)',
                authorized_signatory: 'Mr. Aniket Sen (Director HR & Compliance)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure 1: Database access event audit reports\nAnnexure 2: Standing Orders disciplinary guidelines',
                additional_conditions: 'This notice is issued strictly in compliance with the Principles of Natural Justice, and no final disciplinary decision or presumption of guilt has been established.'
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
                        Company & Notice Details
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
                            <Label htmlFor="notice_number">Notice Reference Number (Optional)</Label>
                            <Input
                                id="notice_number"
                                name="notice_number"
                                placeholder="e.g. APEX/DISC/2026/SCN-089"
                                value={formData.notice_number || ''}
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
                    <CardDescription>Enter details of the employee to whom the notice is addressed</CardDescription>
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

            {/* Section 3: Particulars of Allegations */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <AlertTriangle className="h-5 w-5" />
                        Allegations & Factual Details
                    </CardTitle>
                    <CardDescription>Define dates, specific details, violated policies, and evidence lists</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject" className={errors?.subject ? "text-red-500" : ""}>
                            Subject of Notice *
                        </Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="e.g. Show Cause Notice Regarding Alleged Misconduct"
                            value={formData.subject || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('subject')}
                        />
                        {errors?.subject && (
                            <p className="text-xs text-red-500 font-medium">{errors.subject}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Label htmlFor="incident_time">Incident Time (Optional)</Label>
                            <Input
                                id="incident_time"
                                name="incident_time"
                                placeholder="e.g. 14:35 PM"
                                value={formData.incident_time || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="incident_location">Incident Location (Optional)</Label>
                            <Input
                                id="incident_location"
                                name="incident_location"
                                placeholder="e.g. Office HQ / Remote"
                                value={formData.incident_location || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="allegation_details" className={errors?.allegation_details ? "text-red-500" : ""}>
                            Factual Description of Allegations *
                        </Label>
                        <Textarea
                            id="allegation_details"
                            name="allegation_details"
                            placeholder="Provide factual details of the alleged incidents, avoiding language presuming guilt..."
                            rows={4}
                            value={formData.allegation_details || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('allegation_details')}
                        />
                        {errors?.allegation_details && (
                            <p className="text-xs text-red-500 font-medium">{errors.allegation_details}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="policy_references" className={errors?.policy_references ? "text-red-500" : ""}>
                            Applicable Policy Violations *
                        </Label>
                        <Textarea
                            id="policy_references"
                            name="policy_references"
                            placeholder="List standing orders, code of conduct clauses, or handbook sections allegedly violated..."
                            rows={3}
                            value={formData.policy_references || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('policy_references')}
                        />
                        {errors?.policy_references && (
                            <p className="text-xs text-red-500 font-medium">{errors.policy_references}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="evidence_list" className={errors?.evidence_list ? "text-red-500" : ""}>
                            Evidence References *
                        </Label>
                        <Textarea
                            id="evidence_list"
                            name="evidence_list"
                            placeholder="List documents, CCTV footage, IT logs, swipe card access entries, emails..."
                            rows={3}
                            value={formData.evidence_list || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('evidence_list')}
                        />
                        {errors?.evidence_list && (
                            <p className="text-xs text-red-500 font-medium">{errors.evidence_list}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="witnesses">Witness Names (Optional)</Label>
                        <Textarea
                            id="witnesses"
                            name="witnesses"
                            placeholder="List people who observed the alleged incidents..."
                            rows={2}
                            value={formData.witnesses || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Opportunity to Respond & Exits */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Response Channels & Hearings
                    </CardTitle>
                    <CardDescription>Response deadlines, recipient directories, and non-response outcomes</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="response_deadline" className={errors?.response_deadline ? "text-red-500" : ""}>
                                Response Deadline *
                            </Label>
                            <Input
                                id="response_deadline"
                                name="response_deadline"
                                placeholder="e.g. Within 7 calendar days from the receipt of this Notice"
                                value={formData.response_deadline || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('response_deadline')}
                            />
                            {errors?.response_deadline && (
                                <p className="text-xs text-red-500 font-medium">{errors.response_deadline}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="response_submission_mode" className={errors?.response_submission_mode ? "text-red-500" : ""}>
                                Mode of Response Submission *
                            </Label>
                            <Input
                                id="response_submission_mode"
                                name="response_submission_mode"
                                placeholder="e.g. Written submission via Email or Hard Copy"
                                value={formData.response_submission_mode || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('response_submission_mode')}
                            />
                            {errors?.response_submission_mode && (
                                <p className="text-xs text-red-500 font-medium">{errors.response_submission_mode}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="response_recipient" className={errors?.response_recipient ? "text-red-500" : ""}>
                                Response Recipient / Department *
                            </Label>
                            <Input
                                id="response_recipient"
                                name="response_recipient"
                                placeholder="e.g. Compliance Committee / HR Department (hr@company.com)"
                                value={formData.response_recipient || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('response_recipient')}
                            />
                            {errors?.response_recipient && (
                                <p className="text-xs text-red-500 font-medium">{errors.response_recipient}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="consequences_of_non_response">Consequences of Non-Response (Optional)</Label>
                            <Textarea
                                id="consequences_of_non_response"
                                name="consequences_of_non_response"
                                placeholder="Details on what happens if the employee fails to respond..."
                                rows={3}
                                value={formData.consequences_of_non_response || ''}
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
                                placeholder="e.g. Annexure 1: Logs, Annexure 2: Policies"
                                value={formData.annexures || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="additional_conditions">Additional Conditions (Optional)</Label>
                            <Textarea
                                id="additional_conditions"
                                name="additional_conditions"
                                placeholder="Add any specific conditions, buyout rules, etc..."
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
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific incident scenarios or inquiry suspension status</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="suspension_pending_inquiry"
                                checked={formData.suspension_pending_inquiry || false}
                                onCheckedChange={(checked) => handleSelectChange('suspension_pending_inquiry', !!checked)}
                            />
                            <Label htmlFor="suspension_pending_inquiry" className="text-sm font-normal cursor-pointer">Suspension Pending Inquiry</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="financial_misconduct"
                                checked={formData.financial_misconduct || false}
                                onCheckedChange={(checked) => handleSelectChange('financial_misconduct', !!checked)}
                            />
                            <Label htmlFor="financial_misconduct" className="text-sm font-normal cursor-pointer">Financial Misconduct</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="information_security_incident"
                                checked={formData.information_security_incident || false}
                                onCheckedChange={(checked) => handleSelectChange('information_security_incident', !!checked)}
                            />
                            <Label htmlFor="information_security_incident" className="text-sm font-normal cursor-pointer">Info Security Incident</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="attendance_misconduct"
                                checked={formData.attendance_misconduct || false}
                                onCheckedChange={(checked) => handleSelectChange('attendance_misconduct', !!checked)}
                            />
                            <Label htmlFor="attendance_misconduct" className="text-sm font-normal cursor-pointer">Attendance Misconduct</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="posh_related"
                                checked={formData.posh_related || false}
                                onCheckedChange={(checked) => handleSelectChange('posh_related', !!checked)}
                            />
                            <Label htmlFor="posh_related" className="text-sm font-normal cursor-pointer">POSH-Related Matter</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="safety_violation"
                                checked={formData.safety_violation || false}
                                onCheckedChange={(checked) => handleSelectChange('safety_violation', !!checked)}
                            />
                            <Label htmlFor="safety_violation" className="text-sm font-normal cursor-pointer">Safety / HSE Violation</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShowCauseNoticeForm;
