import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Sparkles, UserCheck, FileText, Briefcase, ShieldCheck, ClipboardCheck, AlertCircle } from "lucide-react";

interface RelievingLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const RelievingLetterForm: React.FC<RelievingLetterFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData,
    errors
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                ...formData,
                company_name: 'Vidhik Legal Solutions Private Limited',
                company_type: 'Private Limited',
                cin: 'U74110DL2023PTC412356',
                registered_office: 'Block E, 4th Floor, Connaught Place, New Delhi, 110001',
                letter_number: 'VLS/REL/2026/092',
                issue_date: today,
                employee_name: 'Vikram Aditya Roy',
                employee_id: 'VLS-402',
                employment_type: 'Permanent',
                designation: 'Senior Legal Technology Consultant',
                department: 'Legal Operations',
                joining_date: '2023-06-01',
                last_working_date: '2026-06-30',
                relieving_date: '2026-06-30',
                separation_type: 'Resignation accepted',
                resignation_acceptance_date: '2026-05-15',
                retirement_date: '',
                contract_completion: '',
                handover_completed: true,
                asset_clearance: 'Completed',
                hr_clearance: 'Completed',
                finance_clearance: 'Completed',
                it_clearance: 'Completed',
                administrative_clearance: 'Completed',
                final_settlement_status: 'Full & Final Settlement Completed',
                gratuity_status: 'Paid',
                leave_encashment_status: 'Encashed',
                post_employment_obligations: 'The employee remains bound by the post-employment confidentiality and intellectual property obligations detailed in Section 9 of the Employment Agreement dated 1st June 2023.',
                appreciation_message: 'We appreciate Vikram\'s contributions and dedication to the Legal Operations team and wish him success in all his future endeavors.',
                experience_letter_reference: 'VLS/EXP/2026/047',
                hr_representative: 'Ms. Priyadarshini Sen (Director HR)',
                authorized_signatory: 'For Vidhik Legal Solutions: Mr. Sandeep Anand (Managing Director)',
                company_seal_required: true,
                execution_place: 'New Delhi',
                execution_date: today,
                additional_conditions: 'No outstanding dues or company properties are pending recovery.'
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

            {/* Section 1: Company Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Building2 className="h-5 w-5" />
                        Company Details
                    </CardTitle>
                    <CardDescription>Enter registered details of the employer company</CardDescription>
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
                                placeholder="e.g. Vidhik Legal Solutions Private Limited"
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
                                    <SelectItem value="Partnership">Partnership</SelectItem>
                                    <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
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
                                placeholder="e.g. U74110DL2023PTC412356"
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
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <UserCheck className="h-5 w-5" />
                        Employee Details
                    </CardTitle>
                    <CardDescription>Enter details of the relieved employee</CardDescription>
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
                                placeholder="e.g. Vikram Aditya Roy"
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
                                placeholder="e.g. VLS-402"
                                value={formData.employee_id || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employment_type" className={errors?.employment_type ? "text-red-500" : ""}>
                                Employment Type *
                            </Label>
                            <Select
                                value={formData.employment_type || 'Permanent'}
                                onValueChange={(v) => handleSelectChange('employment_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('employment_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Permanent">Permanent / Regular Employee</SelectItem>
                                    <SelectItem value="Consultant">Consultant / Advisor</SelectItem>
                                    <SelectItem value="Internship">Internship Engagement</SelectItem>
                                    <SelectItem value="Fixed-Term">Fixed-Term Employee</SelectItem>
                                    <SelectItem value="Temporary">Temporary / Contract Employee</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.employment_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.employment_type}</p>
                            )}
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

            {/* Section 3: Separation Context & Period */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Calendar className="h-5 w-5" />
                        Separation Details
                    </CardTitle>
                    <CardDescription>Detail the employment tenure and separation context</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Label htmlFor="last_working_date" className={errors?.last_working_date ? "text-red-500" : ""}>
                                Last Working Date *
                            </Label>
                            <Input
                                id="last_working_date"
                                name="last_working_date"
                                type="date"
                                value={formData.last_working_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('last_working_date')}
                            />
                            {errors?.last_working_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.last_working_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relieving_date" className={errors?.relieving_date ? "text-red-500" : ""}>
                                Effective Relieving Date *
                            </Label>
                            <Input
                                id="relieving_date"
                                name="relieving_date"
                                type="date"
                                value={formData.relieving_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('relieving_date')}
                            />
                            {errors?.relieving_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.relieving_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="separation_type" className={errors?.separation_type ? "text-red-500" : ""}>
                                Type of Separation *
                            </Label>
                            <Select
                                value={formData.separation_type || 'Resignation accepted'}
                                onValueChange={(v) => handleSelectChange('separation_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('separation_type')}>
                                    <SelectValue placeholder="Select separation type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Resignation accepted">Resignation accepted</SelectItem>
                                    <SelectItem value="Retirement">Retirement</SelectItem>
                                    <SelectItem value="Contract completed">Contract completed</SelectItem>
                                    <SelectItem value="Mutual agreement">Termination by Mutual Agreement</SelectItem>
                                    <SelectItem value="Consultancy concluded">Consultancy engagement concluded</SelectItem>
                                    <SelectItem value="Lawful termination">Lawful separation / termination</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.separation_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.separation_type}</p>
                            )}
                        </div>

                        {/* Conditional Date inputs based on separation type */}
                        {formData.separation_type === 'Resignation accepted' && (
                            <div className="space-y-2">
                                <Label htmlFor="resignation_acceptance_date">Resignation Acceptance Date (Optional)</Label>
                                <Input
                                    id="resignation_acceptance_date"
                                    name="resignation_acceptance_date"
                                    type="date"
                                    value={formData.resignation_acceptance_date || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                        {formData.separation_type === 'Retirement' && (
                            <div className="space-y-2">
                                <Label htmlFor="retirement_date">Retirement Date (Optional)</Label>
                                <Input
                                    id="retirement_date"
                                    name="retirement_date"
                                    type="date"
                                    value={formData.retirement_date || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                        {(formData.separation_type === 'Contract completed' || formData.separation_type === 'Consultancy concluded') && (
                            <div className="space-y-2">
                                <Label htmlFor="contract_completion">Contract Completion Date (Optional)</Label>
                                <Input
                                    id="contract_completion"
                                    name="contract_completion"
                                    type="date"
                                    value={formData.contract_completion || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="experience_letter_reference">Experience Letter Reference (Optional)</Label>
                            <Input
                                id="experience_letter_reference"
                                name="experience_letter_reference"
                                placeholder="e.g. VLS/EXP/2026/047"
                                value={formData.experience_letter_reference || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="handover_completed"
                                checked={!!formData.handover_completed}
                                onCheckedChange={(val) => handleSelectChange('handover_completed', !!val)}
                            />
                            <Label htmlFor="handover_completed" className="text-sm font-normal cursor-pointer">
                                Successful completion of knowledge transfer and handovers *
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Clearances */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <ClipboardCheck className="h-5 w-5" />
                        Clearance Status
                    </CardTitle>
                    <CardDescription>Specify the clearance statuses of various departments</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="asset_clearance" className={errors?.asset_clearance ? "text-red-500" : ""}>
                                Asset Return Clearance *
                            </Label>
                            <Select
                                value={formData.asset_clearance || 'Completed'}
                                onValueChange={(v) => handleSelectChange('asset_clearance', v)}
                            >
                                <SelectTrigger className={getErrorClass('asset_clearance')}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.asset_clearance && (
                                <p className="text-xs text-red-500 font-medium">{errors.asset_clearance}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="it_clearance" className={errors?.it_clearance ? "text-red-500" : ""}>
                                IT & Access Clearance *
                            </Label>
                            <Select
                                value={formData.it_clearance || 'Completed'}
                                onValueChange={(v) => handleSelectChange('it_clearance', v)}
                            >
                                <SelectTrigger className={getErrorClass('it_clearance')}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.it_clearance && (
                                <p className="text-xs text-red-500 font-medium">{errors.it_clearance}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hr_clearance" className={errors?.hr_clearance ? "text-red-500" : ""}>
                                HR Department Clearance *
                            </Label>
                            <Select
                                value={formData.hr_clearance || 'Completed'}
                                onValueChange={(v) => handleSelectChange('hr_clearance', v)}
                            >
                                <SelectTrigger className={getErrorClass('hr_clearance')}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.hr_clearance && (
                                <p className="text-xs text-red-500 font-medium">{errors.hr_clearance}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="finance_clearance" className={errors?.finance_clearance ? "text-red-500" : ""}>
                                Finance & Accounts Clearance *
                            </Label>
                            <Select
                                value={formData.finance_clearance || 'Completed'}
                                onValueChange={(v) => handleSelectChange('finance_clearance', v)}
                            >
                                <SelectTrigger className={getErrorClass('finance_clearance')}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.finance_clearance && (
                                <p className="text-xs text-red-500 font-medium">{errors.finance_clearance}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="administrative_clearance" className={errors?.administrative_clearance ? "text-red-500" : ""}>
                                Administrative Clearance *
                            </Label>
                            <Select
                                value={formData.administrative_clearance || 'Completed'}
                                onValueChange={(v) => handleSelectChange('administrative_clearance', v)}
                            >
                                <SelectTrigger className={getErrorClass('administrative_clearance')}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.administrative_clearance && (
                                <p className="text-xs text-red-500 font-medium">{errors.administrative_clearance}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Settlement & Dues */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Briefcase className="h-5 w-5" />
                        Settlement Details
                    </CardTitle>
                    <CardDescription>Detail final payout and statutory settlements</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="final_settlement_status">Full & Final Settlement Status (Optional)</Label>
                            <Select
                                value={formData.final_settlement_status || ''}
                                onValueChange={(v) => handleSelectChange('final_settlement_status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full & Final Settlement Completed">Full & Final Settlement Completed</SelectItem>
                                    <SelectItem value="Full & Final Settlement Pending">Full & Final Settlement Pending</SelectItem>
                                    <SelectItem value="No Outstanding Dues Remaining">No Outstanding Dues Remaining</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gratuity_status">Gratuity Status (Optional)</Label>
                            <Select
                                value={formData.gratuity_status || ''}
                                onValueChange={(v) => handleSelectChange('gratuity_status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid">Paid / Cleared</SelectItem>
                                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                    <SelectItem value="Processed with Final Settlement">Processed with Final Settlement</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leave_encashment_status">Leave Encashment Status (Optional)</Label>
                            <Select
                                value={formData.leave_encashment_status || ''}
                                onValueChange={(v) => handleSelectChange('leave_encashment_status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Encashed">Encashed / Paid</SelectItem>
                                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                    <SelectItem value="Adjusted in Notice Period">Adjusted in Notice Period</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Obligations & Appreciation */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <ShieldCheck className="h-5 w-5" />
                        Covenants & Contributions
                    </CardTitle>
                    <CardDescription>Enter post-employment obligations and appreciation</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="post_employment_obligations" className={errors?.post_employment_obligations ? "text-red-500" : ""}>
                            Post-Employment Obligations *
                        </Label>
                        <Textarea
                            id="post_employment_obligations"
                            name="post_employment_obligations"
                            placeholder="Detail confidentiality, intellectual property, and non-solicitation covenants..."
                            value={formData.post_employment_obligations || ''}
                            onChange={handleInputChange}
                            className={`min-h-[100px] ${getErrorClass('post_employment_obligations')}`}
                        />
                        {errors?.post_employment_obligations && (
                            <p className="text-xs text-red-500 font-medium">{errors.post_employment_obligations}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="appreciation_message">Appreciation Message (Optional)</Label>
                        <Textarea
                            id="appreciation_message"
                            name="appreciation_message"
                            placeholder="Add formal appreciation for the employee's contribution..."
                            value={formData.appreciation_message || ''}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Signatories & Execution */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <FileText className="h-5 w-5" />
                        Execution Details
                    </CardTitle>
                    <CardDescription>Enter signatories, place of issue, and dates</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorized_signatory" className={errors?.authorized_signatory ? "text-red-500" : ""}>
                                Authorized Signatory Name & Title *
                            </Label>
                            <Input
                                id="authorized_signatory"
                                name="authorized_signatory"
                                placeholder="e.g. For Acme Tech: Mr. Sandeep (MD)"
                                value={formData.authorized_signatory || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatory')}
                            />
                            {errors?.authorized_signatory && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatory}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hr_representative">HR Representative Name (Optional)</Label>
                            <Input
                                id="hr_representative"
                                name="hr_representative"
                                placeholder="e.g. Ms. Priyadarshini Sen"
                                value={formData.hr_representative || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="letter_number">Letter Reference Number (Optional)</Label>
                            <Input
                                id="letter_number"
                                name="letter_number"
                                placeholder="e.g. ACME/HR/REL/2026/092"
                                value={formData.letter_number || ''}
                                onChange={handleInputChange}
                            />
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
                        <div className="space-y-2">
                            <Label htmlFor="execution_place" className={errors?.execution_place ? "text-red-500" : ""}>
                                Execution / Issue Place *
                            </Label>
                            <Input
                                id="execution_place"
                                name="execution_place"
                                placeholder="e.g. New Delhi"
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
                                Execution / Sign Date *
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
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="company_seal_required"
                                checked={!!formData.company_seal_required}
                                onCheckedChange={(val) => handleSelectChange('company_seal_required', !!val)}
                            />
                            <Label htmlFor="company_seal_required" className="text-sm font-normal cursor-pointer">
                                Company Seal Required on Letter *
                            </Label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="additional_conditions">Additional Conditions / Notes (Optional)</Label>
                            <Textarea
                                id="additional_conditions"
                                name="additional_conditions"
                                placeholder="Specify any additional parameters or compliance notes..."
                                value={formData.additional_conditions || ''}
                                onChange={handleInputChange}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RelievingLetterForm;
