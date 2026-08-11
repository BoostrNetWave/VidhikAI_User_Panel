import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, TrendingUp } from "lucide-react";

interface SalaryIncrementLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const SalaryIncrementLetterForm: React.FC<SalaryIncrementLetterFormProps> = ({
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
                letter_number: 'APEX/HR/2026/SAL-REV-4021',
                issue_date: new Date().toISOString().split('T')[0],
                employee_name: 'Rohit Verma',
                employee_id: 'APEX-2023-0104',
                designation: 'Senior Software Engineer',
                department: 'Core Platform Engineering',
                previous_ctc: 'INR 12,00,000 per annum',
                revised_ctc: 'INR 15,00,000 per annum',
                increment_amount: 'INR 3,00,000 per annum',
                increment_percentage: '25%',
                effective_date: new Date().toISOString().split('T')[0],
                revised_salary_structure: 'Basic Salary: INR 6,25,000 per annum\nHouse Rent Allowance (HRA): INR 3,12,500 per annum\nSpecial Allowance: INR 4,37,500 per annum\nEmployer Provident Fund (EPF): INR 75,000 per annum\nEmployer Gratuity Contribution: INR 30,000 per annum',
                performance_bonus: 'Target annual performance bonus of 10% of Basic Salary (INR 62,500) based on individual achievements and company milestones.',
                variable_pay: 'INR 1,25,000 annual variable pay linked directly to the quarterly release performance metrics.',
                esop_details: 'Vesting of an additional 500 Employee Stock Options under the APEX ESOP Scheme 2024 with a 4-year vesting schedule and 1-year cliff.',
                promotion_details: 'Simultaneous promotion from Software Engineer to Senior Software Engineer role in the Core Platform Engineering department.',
                tax_notes: 'All compensation components are subject to professional tax, income tax, and other statutory TDS deductions in accordance with the Income Tax Act, 1961.',
                statutory_deductions: 'Statutory deductions for Employee PF, ESI (if applicable), and Professional Tax shall be deducted at source in accordance with state and central regulations.',
                appointment_letter_reference: 'Appointment Letter Dated: 12th July 2023',
                employment_agreement_reference: 'Employment Agreement Dated: 12th July 2023',
                hr_representative: 'Ms. Sarah Mathews (VP Human Resources)',
                authorized_signatory: 'Mr. Aniket Sen (HR Director)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                ctc_annexure_reference: 'Annexure A: Detailed Revised Salary Breakup Schematic',
                appreciation_message: 'The management extends its appreciation for your outstanding contribution to the cloud migration projects during the financial year.',
                additional_conditions: 'This letter serves as an amendment to your original Appointment Letter, while all other terms and conditions remain unchanged.'
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
                    <CardDescription>Enter company profile, CIN, letter numbers, and date of issue</CardDescription>
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
                                placeholder="e.g. APEX/HR/2026/SAL-REV-4021"
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
                    <CardDescription>Enter details of the employee receiving the salary increment</CardDescription>
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
                            <Label htmlFor="employee_id">Employee ID (Optional)</Label>
                            <Input
                                id="employee_id"
                                name="employee_id"
                                placeholder="e.g. APEX-2023-0104"
                                value={formData.employee_id || ''}
                                onChange={handleInputChange}
                            />
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

            {/* Section 3: Compensation Revision Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <TrendingUp className="h-5 w-5" />
                        Compensation Revision Covenants
                    </CardTitle>
                    <CardDescription>Define previous CTC, revised CTC, increment parameters, and structures</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="previous_ctc" className={errors?.previous_ctc ? "text-red-500" : ""}>
                                Previous Annual CTC *
                            </Label>
                            <Input
                                id="previous_ctc"
                                name="previous_ctc"
                                placeholder="e.g. INR 12,00,000 per annum"
                                value={formData.previous_ctc || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('previous_ctc')}
                            />
                            {errors?.previous_ctc && (
                                <p className="text-xs text-red-500 font-medium">{errors.previous_ctc}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="revised_ctc" className={errors?.revised_ctc ? "text-red-500" : ""}>
                                Revised Annual CTC *
                            </Label>
                            <Input
                                id="revised_ctc"
                                name="revised_ctc"
                                placeholder="e.g. INR 15,00,000 per annum"
                                value={formData.revised_ctc || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('revised_ctc')}
                            />
                            {errors?.revised_ctc && (
                                <p className="text-xs text-red-500 font-medium">{errors.revised_ctc}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="increment_amount" className={errors?.increment_amount ? "text-red-500" : ""}>
                                Increment Amount *
                            </Label>
                            <Input
                                id="increment_amount"
                                name="increment_amount"
                                placeholder="e.g. INR 3,00,000 per annum"
                                value={formData.increment_amount || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('increment_amount')}
                            />
                            {errors?.increment_amount && (
                                <p className="text-xs text-red-500 font-medium">{errors.increment_amount}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="increment_percentage" className={errors?.increment_percentage ? "text-red-500" : ""}>
                                Increment Percentage *
                            </Label>
                            <Input
                                id="increment_percentage"
                                name="increment_percentage"
                                placeholder="e.g. 25%"
                                value={formData.increment_percentage || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('increment_percentage')}
                            />
                            {errors?.increment_percentage && (
                                <p className="text-xs text-red-500 font-medium">{errors.increment_percentage}</p>
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
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="revised_salary_structure" className={errors?.revised_salary_structure ? "text-red-500" : ""}>
                            Revised Salary Component Structure *
                        </Label>
                        <Textarea
                            id="revised_salary_structure"
                            name="revised_salary_structure"
                            placeholder="Basic Salary, HRA, allowance breakdowns..."
                            rows={4}
                            value={formData.revised_salary_structure || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('revised_salary_structure')}
                        />
                        {errors?.revised_salary_structure && (
                            <p className="text-xs text-red-500 font-medium">{errors.revised_salary_structure}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="performance_bonus">Performance Bonus terms (Optional)</Label>
                        <Textarea
                            id="performance_bonus"
                            name="performance_bonus"
                            placeholder="Target annual bonus details..."
                            rows={2}
                            value={formData.performance_bonus || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="variable_pay">Variable Pay parameters (Optional)</Label>
                        <Textarea
                            id="variable_pay"
                            name="variable_pay"
                            placeholder="Release metric variable details..."
                            rows={2}
                            value={formData.variable_pay || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="esop_details">ESOP Allocation changes (Optional)</Label>
                        <Textarea
                            id="esop_details"
                            name="esop_details"
                            placeholder="Vesting schedules of additional granted options..."
                            rows={2}
                            value={formData.esop_details || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="promotion_details">Promotion details (Optional)</Label>
                        <Textarea
                            id="promotion_details"
                            name="promotion_details"
                            placeholder="Simultaneous promotion details..."
                            rows={2}
                            value={formData.promotion_details || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: General HR Covenants */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Employment Continuity & Taxes
                    </CardTitle>
                    <CardDescription>References to original letters and TDS/statutory calculations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="appointment_letter_reference" className={errors?.appointment_letter_reference ? "text-red-500" : ""}>
                                Appointment Letter Date Reference *
                            </Label>
                            <Input
                                id="appointment_letter_reference"
                                name="appointment_letter_reference"
                                placeholder="e.g. Appointment Letter Dated: 12th July 2023"
                                value={formData.appointment_letter_reference || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('appointment_letter_reference')}
                            />
                            {errors?.appointment_letter_reference && (
                                <p className="text-xs text-red-500 font-medium">{errors.appointment_letter_reference}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employment_agreement_reference">Employment Agreement Reference (Optional)</Label>
                            <Input
                                id="employment_agreement_reference"
                                name="employment_agreement_reference"
                                placeholder="e.g. Employment Agreement Dated: 12th July 2023"
                                value={formData.employment_agreement_reference || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="statutory_deductions" className={errors?.statutory_deductions ? "text-red-500" : ""}>
                                Statutory Deductions Covenants *
                            </Label>
                            <Textarea
                                id="statutory_deductions"
                                name="statutory_deductions"
                                placeholder="State that Employee PF, ESI, and Professional Taxes are deducted at source..."
                                rows={2}
                                value={formData.statutory_deductions || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('statutory_deductions')}
                            />
                            {errors?.statutory_deductions && (
                                <p className="text-xs text-red-500 font-medium">{errors.statutory_deductions}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="tax_notes">Taxation Covenants & TDS notes (Optional)</Label>
                            <Textarea
                                id="tax_notes"
                                name="tax_notes"
                                placeholder="Professional tax and Income tax notes..."
                                rows={2}
                                value={formData.tax_notes || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="appreciation_message">Appreciation Message (Optional)</Label>
                            <Textarea
                                id="appreciation_message"
                                name="appreciation_message"
                                placeholder="Extend management appreciation for contributions during the financial year..."
                                rows={2}
                                value={formData.appreciation_message || ''}
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
                            <Label htmlFor="ctc_annexure_reference">CTC Annexure Reference (Optional)</Label>
                            <Input
                                id="ctc_annexure_reference"
                                name="ctc_annexure_reference"
                                placeholder="e.g. Annexure A: Detailed Revised Salary Breakup Schematic"
                                value={formData.ctc_annexure_reference || ''}
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
        </div>
    );
};

export default SalaryIncrementLetterForm;
