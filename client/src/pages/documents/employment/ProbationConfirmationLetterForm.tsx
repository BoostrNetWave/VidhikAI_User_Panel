import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface ProbationConfirmationLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const ProbationConfirmationLetterForm: React.FC<ProbationConfirmationLetterFormProps> = ({
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
                company_name: 'Quantum Leap Innovations Private Limited',
                company_type: 'Private Limited',
                cin: 'U72900KA2022PTC123987',
                registered_office: '12th Floor, Tower B, Prestige Tech Park, Marathahalli, Bangalore, Karnataka 560103',
                letter_number: 'QLI/HR/CONF/2026/043',
                issue_date: new Date().toISOString().split('T')[0],
                employee_name: 'Aditya Sharma',
                employee_id: 'QLI-908',
                designation: 'Senior Software Engineer',
                department: 'Engineering',
                joining_date: '2025-07-20',
                probation_start_date: '2025-07-20',
                probation_completion_date: '2026-01-20',
                confirmation_effective_date: '2026-01-21',
                reporting_manager: 'Ms. Shruti Rao (Engineering Director)',
                work_location: 'Bangalore Office',
                appointment_letter_reference: 'QLI/HR/APP/2025/112',
                employment_agreement_reference: 'Employment Agreement dated July 18, 2025',
                salary_revision: true,
                revised_compensation: 'INR 12,00,000 per annum',
                revised_compensation_effective_date: '2026-02-01',
                permanent_employee_benefits: 'Gratuity eligibility, group health insurance cover up to INR 5,00,000, and annual performance bonus eligibility.',
                confidentiality_required: true,
                intellectual_property_required: true,
                transferability: 'Employee is subject to transfer to any office, branch, or subsidiary of the Company within India as per business requirements.',
                esop_eligibility: 'Eligible for options grant under the Employee Stock Option Plan 2026, subject to Board approval.',
                promotion_details: 'Promotion to Senior Software Engineer (previously Software Engineer II) in recognition of outstanding probation performance.',
                senior_management: false,
                remote_employee: false,
                hybrid_employee: true,
                authorized_signatory: 'For Quantum Leap Innovations: Mr. Arvind Swamy (Director)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'All other terms and conditions of the original Appointment Letter remain unchanged.'
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
                    className="gap-2 text-primary border-primary/20 hover:bg-secondary"
                >
                    <Sparkles className="h-4 w-4" />
                    Fill Dummy Data
                </Button>
            </div>

            {/* Section 1: Company Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Company Details
                    </CardTitle>
                    <CardDescription>Enter details of the employer company</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name" className={errors?.company_name ? "text-red-500" : ""}>
                                Company Name *
                            </Label>
                            <Input
                                id="company_name"
                                name="company_name"
                                placeholder="e.g. Quantum Leap Innovations Private Limited"
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
                                    <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited</SelectItem>
                                    <SelectItem value="LLP">LLP</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.company_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.company_type}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cin">CIN (Corporate Identification Number) (Optional)</Label>
                            <Input
                                id="cin"
                                name="cin"
                                placeholder="e.g. U72900KA2022PTC123987"
                                value={formData.cin || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registered_office" className={errors?.registered_office ? "text-red-500" : ""}>
                                Registered Office Address *
                            </Label>
                            <Input
                                id="registered_office"
                                name="registered_office"
                                placeholder="Complete registered office address..."
                                value={formData.registered_office || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('registered_office')}
                            />
                            {errors?.registered_office && (
                                <p className="text-xs text-red-500 font-medium">{errors.registered_office}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Employee Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <UserCheck className="h-5 w-5" />
                        Employee Details
                    </CardTitle>
                    <CardDescription>Enter details of the employee being confirmed</CardDescription>
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
                                placeholder="e.g. Aditya Sharma"
                                value={formData.employee_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('employee_name')}
                            />
                            {errors?.employee_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.employee_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employee_id">Employee ID (Optional)</Label>
                            <Input
                                id="employee_id"
                                name="employee_id"
                                placeholder="e.g. QLI-908"
                                value={formData.employee_id || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation" className={errors?.designation ? "text-red-500" : ""}>
                                Designation *
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
                                placeholder="e.g. Engineering"
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

            {/* Section 3: Probation & Confirmation Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Probation & Confirmation Timelines
                    </CardTitle>
                    <CardDescription>Dates and reference codes driving the confirmation</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="joining_date" className={errors?.joining_date ? "text-red-500" : ""}>
                                Joining Date *
                            </Label>
                            <Input
                                id="joining_date"
                                name="joining_date"
                                type="date"
                                value={formData.joining_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('joining_date')}
                            />
                            {errors?.joining_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.joining_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="probation_start_date" className={errors?.probation_start_date ? "text-red-500" : ""}>
                                Probation Start Date *
                            </Label>
                            <Input
                                id="probation_start_date"
                                name="probation_start_date"
                                type="date"
                                value={formData.probation_start_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('probation_start_date')}
                            />
                            {errors?.probation_start_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.probation_start_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="probation_completion_date" className={errors?.probation_completion_date ? "text-red-500" : ""}>
                                Probation Completion Date *
                            </Label>
                            <Input
                                id="probation_completion_date"
                                name="probation_completion_date"
                                type="date"
                                value={formData.probation_completion_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('probation_completion_date')}
                            />
                            {errors?.probation_completion_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.probation_completion_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmation_effective_date" className={errors?.confirmation_effective_date ? "text-red-500" : ""}>
                                Confirmation Effective Date *
                            </Label>
                            <Input
                                id="confirmation_effective_date"
                                name="confirmation_effective_date"
                                type="date"
                                value={formData.confirmation_effective_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('confirmation_effective_date')}
                            />
                            {errors?.confirmation_effective_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.confirmation_effective_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reporting_manager" className={errors?.reporting_manager ? "text-red-500" : ""}>
                                Reporting Manager *
                            </Label>
                            <Input
                                id="reporting_manager"
                                name="reporting_manager"
                                placeholder="e.g. Ms. Shruti Rao (Engineering Director)"
                                value={formData.reporting_manager || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('reporting_manager')}
                            />
                            {errors?.reporting_manager && (
                                <p className="text-xs text-red-500 font-medium">{errors.reporting_manager}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="work_location" className={errors?.work_location ? "text-red-500" : ""}>
                                Work Location *
                            </Label>
                            <Input
                                id="work_location"
                                name="work_location"
                                placeholder="e.g. Bangalore Office"
                                value={formData.work_location || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('work_location')}
                            />
                            {errors?.work_location && (
                                <p className="text-xs text-red-500 font-medium">{errors.work_location}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appointment_letter_reference" className={errors?.appointment_letter_reference ? "text-red-500" : ""}>
                                Appointment Letter Ref *
                            </Label>
                            <Input
                                id="appointment_letter_reference"
                                name="appointment_letter_reference"
                                placeholder="e.g. QLI/HR/APP/2025/112"
                                value={formData.appointment_letter_reference || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('appointment_letter_reference')}
                            />
                            {errors?.appointment_letter_reference && (
                                <p className="text-xs text-red-500 font-medium">{errors.appointment_letter_reference}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employment_agreement_reference">Employment Agreement Ref (Optional)</Label>
                            <Input
                                id="employment_agreement_reference"
                                name="employment_agreement_reference"
                                placeholder="e.g. Employment Agreement dated July 18, 2025"
                                value={formData.employment_agreement_reference || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="letter_number">Letter Number (Optional)</Label>
                            <Input
                                id="letter_number"
                                name="letter_number"
                                placeholder="e.g. QLI/HR/CONF/2026/043"
                                value={formData.letter_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Compensation & Benefits */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Compensation & Benefits
                    </CardTitle>
                    <CardDescription>Provide salary revisions and benefit structures</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <Checkbox
                            id="salary_revision"
                            checked={formData.salary_revision || false}
                            onCheckedChange={(checked) => handleSelectChange('salary_revision', !!checked)}
                        />
                        <Label htmlFor="salary_revision" className="text-sm font-normal cursor-pointer">Include Salary Revision / Revised Compensation</Label>
                    </div>

                    {formData.salary_revision && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="revised_compensation">Revised Compensation</Label>
                                <Input
                                    id="revised_compensation"
                                    name="revised_compensation"
                                    placeholder="e.g. INR 12,00,000 per annum"
                                    value={formData.revised_compensation || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="revised_compensation_effective_date">Revised Compensation Effective Date</Label>
                                <Input
                                    id="revised_compensation_effective_date"
                                    name="revised_compensation_effective_date"
                                    type="date"
                                    value={formData.revised_compensation_effective_date || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="permanent_employee_benefits">Permanent Employee Benefits (Optional)</Label>
                        <Textarea
                            id="permanent_employee_benefits"
                            name="permanent_employee_benefits"
                            placeholder="Gratuity, PF, medical insurance details..."
                            rows={2}
                            value={formData.permanent_employee_benefits || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Legal & General Clauses */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Legal & General Clauses
                    </CardTitle>
                    <CardDescription>Intellectual property, location transfer rules, and confidentiality policies</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transferability">Location Transferability policy (Optional)</Label>
                        <Textarea
                            id="transferability"
                            name="transferability"
                            placeholder="State rules on transferring employee to subsidiaries or branch offices..."
                            rows={2}
                            value={formData.transferability || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="esop_eligibility">ESOP Options pool eligibility (Optional)</Label>
                        <Input
                            id="esop_eligibility"
                            name="esop_eligibility"
                            placeholder="Define equity/options grant eligibility details..."
                            value={formData.esop_eligibility || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="promotion_details">Promotion Details (Optional)</Label>
                        <Input
                            id="promotion_details"
                            name="promotion_details"
                            placeholder="e.g. Promotion to Senior Software Engineer"
                            value={formData.promotion_details || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Signing & Locations */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Execution Details
                    </CardTitle>
                    <CardDescription>Designate executants, place, and date of confirmation</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatory" className={errors?.authorized_signatory ? "text-red-500" : ""}>
                                Authorized Company Signatory *
                            </Label>
                            <Input
                                id="authorized_signatory"
                                name="authorized_signatory"
                                placeholder="Designations and names of officers executing on behalf of company..."
                                value={formData.authorized_signatory || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatory')}
                            />
                            {errors?.authorized_signatory && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatory}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="additional_conditions">Additional Plan Conditions / Restrictions (Optional)</Label>
                            <Textarea
                                id="additional_conditions"
                                name="additional_conditions"
                                placeholder="Add any specific startup-related conditions, board seats, etc..."
                                rows={3}
                                value={formData.additional_conditions || ''}
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

            {/* Section 7: Setup Compliance Flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Compliance Flags
                    </CardTitle>
                    <CardDescription>Configure remote, senior status, and confidentiality covenants</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="senior_management"
                                checked={formData.senior_management || false}
                                onCheckedChange={(checked) => handleSelectChange('senior_management', !!checked)}
                            />
                            <Label htmlFor="senior_management" className="text-sm font-normal cursor-pointer">Senior Management (Leadership details)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="remote_employee"
                                checked={formData.remote_employee || false}
                                onCheckedChange={(checked) => handleSelectChange('remote_employee', !!checked)}
                            />
                            <Label htmlFor="remote_employee" className="text-sm font-normal cursor-pointer">Remote Employee structure</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="hybrid_employee"
                                checked={formData.hybrid_employee || false}
                                onCheckedChange={(checked) => handleSelectChange('hybrid_employee', !!checked)}
                            />
                            <Label htmlFor="hybrid_employee" className="text-sm font-normal cursor-pointer">Hybrid Office guidelines</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="confidentiality_required"
                                checked={formData.confidentiality_required || false}
                                onCheckedChange={(checked) => handleSelectChange('confidentiality_required', !!checked)}
                            />
                            <Label htmlFor="confidentiality_required" className="text-sm font-normal cursor-pointer">Confidentiality compliance required</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="intellectual_property_required"
                                checked={formData.intellectual_property_required || false}
                                onCheckedChange={(checked) => handleSelectChange('intellectual_property_required', !!checked)}
                            />
                            <Label htmlFor="intellectual_property_required" className="text-sm font-normal cursor-pointer">Intellectual Property compliance required</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProbationConfirmationLetterForm;
