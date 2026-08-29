import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Sparkles, UserCheck, Award, FileText, Briefcase, BookOpen, ShieldCheck } from "lucide-react";

interface ExperienceLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const ExperienceLetterForm: React.FC<ExperienceLetterFormProps> = ({
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
                company_name: 'Vidhik Legal Solutions Private Limited',
                company_type: 'Private Limited',
                cin: 'U74110DL2023PTC412356',
                registered_office: 'Block E, 4th Floor, Connaught Place, New Delhi, 110001',
                letter_number: 'VLS/EXP/2026/047',
                issue_date: new Date().toISOString().split('T')[0],
                employee_name: 'Vikram Aditya Roy',
                employee_id: 'VLS-402',
                employment_type: 'Permanent',
                designation: 'Senior Legal Technology Consultant',
                department: 'Legal Operations',
                joining_date: '2023-06-01',
                last_working_date: '2026-06-30',
                employment_duration: '3 Years and 1 Month',
                previous_designations: 'Legal Tech Analyst (Jun 2023 - May 2024), promoted to Consultant in Jun 2024, and Senior Legal Technology Consultant in Dec 2025.',
                responsibilities: 'Managed high-value client contracts and automation workflows. Supervised a team of 4 junior legal engineers in implementing AI contract analytics. Led integration of legal research APIs with internal applications.',
                projects: 'Automated 120+ standard commercial agreement templates, reducing document turnaround time by 60%.',
                achievements: 'Awarded the "Innovative Product Champion" accolade in annual general meeting 2025.',
                conduct_statement: 'Vikram performed his duties with exceptional professionalism, high dedication, and a strong sense of integrity.',
                exit_status: 'Resignation accepted',
                hr_representative: 'Ms. Priyadarshini Sen (Director HR)',
                authorized_signatory: 'For Vidhik Legal Solutions: Mr. Sandeep Anand (Managing Director)',
                company_seal_required: true,
                execution_place: 'New Delhi',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'All company assets returned, dues cleared, and no outstanding obligations remain.'
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
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <UserCheck className="h-5 w-5" />
                        Employee Details
                    </CardTitle>
                    <CardDescription>Enter details of the employee or contractor</CardDescription>
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
                                    <SelectItem value="Consultant">Consultant</SelectItem>
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

            {/* Section 3: Employment Period */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Employment Period
                    </CardTitle>
                    <CardDescription>Specify the employment dates and duration</CardDescription>
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="employment_duration" className={errors?.employment_duration ? "text-red-500" : ""}>
                                Total Duration of Employment *
                            </Label>
                            <Input
                                id="employment_duration"
                                name="employment_duration"
                                placeholder="e.g. 3 Years and 6 Months"
                                value={formData.employment_duration || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('employment_duration')}
                            />
                            {errors?.employment_duration && (
                                <p className="text-xs text-red-500 font-medium">{errors.employment_duration}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="previous_designations">Previous Designations Held (Chronological / Optional)</Label>
                            <Textarea
                                id="previous_designations"
                                name="previous_designations"
                                placeholder="e.g. Joined as Software Engineer I, promoted to Senior Software Engineer in 2024..."
                                value={formData.previous_designations || ''}
                                onChange={handleInputChange}
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Roles & Responsibilities */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Briefcase className="h-5 w-5" />
                        Roles, Projects & Achievements
                    </CardTitle>
                    <CardDescription>Detail employee's core assignments, projects, and awards</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="responsibilities" className={errors?.responsibilities ? "text-red-500" : ""}>
                            Principal Responsibilities *
                        </Label>
                        <Textarea
                            id="responsibilities"
                            name="responsibilities"
                            placeholder="Detail technical, management, client, administrative, or leadership responsibilities..."
                            value={formData.responsibilities || ''}
                            onChange={handleInputChange}
                            className={`min-h-[100px] ${getErrorClass('responsibilities')}`}
                        />
                        {errors?.responsibilities && (
                            <p className="text-xs text-red-500 font-medium">{errors.responsibilities}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="projects">Projects Undertaken (Optional)</Label>
                        <Textarea
                            id="projects"
                            name="projects"
                            placeholder="Describe any key projects the employee led or contributed to..."
                            value={formData.projects || ''}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="achievements">Key Achievements (Optional)</Label>
                        <Textarea
                            id="achievements"
                            name="achievements"
                            placeholder="Mention any awards, promotions, or special recognitions..."
                            value={formData.achievements || ''}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Conduct, Exit & Execution */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                        Performance, Exit & Signatures
                    </CardTitle>
                    <CardDescription>Enter exit conditions, signatory details, and place of issue</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="conduct_statement">Performance & Conduct Statement (Optional)</Label>
                            <Textarea
                                id="conduct_statement"
                                name="conduct_statement"
                                placeholder="e.g. Vikram maintained high professional conduct and exhibited excellent teamwork."
                                value={formData.conduct_statement || ''}
                                onChange={handleInputChange}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exit_status">Exit Status (Optional)</Label>
                            <Select
                                value={formData.exit_status || ''}
                                onValueChange={(v) => handleSelectChange('exit_status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select exit status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employment concluded normally">Employment concluded normally</SelectItem>
                                    <SelectItem value="Resignation accepted">Resignation accepted</SelectItem>
                                    <SelectItem value="Contract completed">Contract completed</SelectItem>
                                    <SelectItem value="Retirement">Retirement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hr_representative">HR Representative Name (Optional)</Label>
                            <Input
                                id="hr_representative"
                                name="hr_representative"
                                placeholder="e.g. Ms. Sneha Patil"
                                value={formData.hr_representative || ''}
                                onChange={handleInputChange}
                            />
                        </div>
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
                            <Label htmlFor="letter_number">Letter Reference Number (Optional)</Label>
                            <Input
                                id="letter_number"
                                name="letter_number"
                                placeholder="e.g. ACME/HR/EXP/2026/089"
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
                                Company Seal Required on Letter
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

export default ExperienceLetterForm;
