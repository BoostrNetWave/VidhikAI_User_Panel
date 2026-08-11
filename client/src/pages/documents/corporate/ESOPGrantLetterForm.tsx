import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface ESOPGrantLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const ESOPGrantLetterForm: React.FC<ESOPGrantLetterFormProps> = ({
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
                plan_name: 'Employee Stock Option Plan 2026',
                grant_letter_number: 'QLI/ESOP/2026/089',
                grant_date: new Date().toISOString().split('T')[0],
                effective_date: new Date().toISOString().split('T')[0],
                employee_name: 'Aditya Sharma',
                employee_id: 'QLI-908',
                designation: 'Lead Software Engineer',
                department: 'Engineering',
                employment_type: 'Full-Time',
                office_location: 'Bangalore Office',
                board_or_committee_approval_reference: 'Board Meeting held on May 10, 2026',
                total_options_granted: '5,000',
                option_type: 'Equity Stock Option',
                exercise_price: 'INR 150 per share',
                currency: 'INR',
                fair_market_value: 'INR 180 per share',
                vesting_start_date: new Date().toISOString().split('T')[0],
                cliff_period: '12 months from Effective Date',
                vesting_frequency: 'Equal monthly installments over 36 months following cliff',
                vesting_schedule: 'Total vesting over 48 months: 25% vests at the end of the cliff period, and the remaining 75% vests in equal monthly increments over the next 36 months.',
                performance_conditions: 'N/A',
                accelerated_vesting: 'Accelerated vesting of 100% of unvested options in the event of an Acquisition or Merger of the Company.',
                exercise_window: 'Within five (5) years from the date of vesting of the respective Options.',
                exercise_method: 'Submission of physical Option Exercise Form along with payment of the aggregate exercise price.',
                payment_method: 'NEFT/RTGS bank transfer or Demand Draft.',
                lapse_rules: '1. Resignation / Good Leaver: Vested options must be exercised within 30 days of last working day.\n2. Termination for Cause / Bad Leaver: All options (vested and unvested) lapse immediately.\n3. Death or Permanent Disability: Nominee has 6 months to exercise vested options.',
                transfer_restrictions: 'Options are strictly personal, non-transferable, and cannot be pledged, mortgaged, or encumbered in any manner.',
                taxation_clause: 'The option holder shall be solely responsible for all tax liabilities, including perquisite tax upon exercise and capital gains tax upon sale of shares.',
                confidentiality_required: true,
                listed_company: false,
                dpiit_startup: true,
                foreign_employee: false,
                cashless_exercise: false,
                rsu_grant: false,
                authorized_signatory: 'For Quantum Leap Innovations: Mr. Arvind Swamy (Director)',
                employee_acceptance_required: true,
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'Any options that lapse or are forfeited shall be added back to the ESOP pool and remain available for future grants.'
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
                    <CardDescription>Enter details of the company issuing this grant letter</CardDescription>
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
                                    <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.company_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.company_type}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cin" className={errors?.cin ? "text-red-500" : ""}>
                                CIN (Corporate Identification Number) *
                            </Label>
                            <Input
                                id="cin"
                                name="cin"
                                placeholder="e.g. U72900KA2022PTC123987"
                                value={formData.cin || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('cin')}
                            />
                            {errors?.cin && (
                                <p className="text-xs text-red-500 font-medium">{errors.cin}</p>
                            )}
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
                    <CardDescription>Enter details of the employee receiving this grant</CardDescription>
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
                            <Label htmlFor="employee_id" className={errors?.employee_id ? "text-red-500" : ""}>
                                Employee ID *
                            </Label>
                            <Input
                                id="employee_id"
                                name="employee_id"
                                placeholder="e.g. QLI-908"
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
                                Designation *
                            </Label>
                            <Input
                                id="designation"
                                name="designation"
                                placeholder="e.g. Lead Software Engineer"
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
                        <div className="space-y-2">
                            <Label htmlFor="employment_type" className={errors?.employment_type ? "text-red-500" : ""}>
                                Employment Type *
                            </Label>
                            <Select
                                value={formData.employment_type || 'Full-Time'}
                                onValueChange={(v) => handleSelectChange('employment_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('employment_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-Time">Full-Time Employee</SelectItem>
                                    <SelectItem value="Part-Time">Part-Time Employee</SelectItem>
                                    <SelectItem value="Contractor">Contractor / Consultant</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.employment_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.employment_type}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="office_location" className={errors?.office_location ? "text-red-500" : ""}>
                                Office Location *
                            </Label>
                            <Input
                                id="office_location"
                                name="office_location"
                                placeholder="e.g. Bangalore Office"
                                value={formData.office_location || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('office_location')}
                            />
                            {errors?.office_location && (
                                <p className="text-xs text-red-500 font-medium">{errors.office_location}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Grant Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Award className="h-5 w-5" />
                        Grant & Option Details
                    </CardTitle>
                    <CardDescription>Enter details of options granted and approved ESOP scheme</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="plan_name" className={errors?.plan_name ? "text-red-500" : ""}>
                                ESOP Plan Name *
                            </Label>
                            <Input
                                id="plan_name"
                                name="plan_name"
                                placeholder="e.g. Employee Stock Option Plan 2026"
                                value={formData.plan_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('plan_name')}
                            />
                            {errors?.plan_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.plan_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grant_letter_number">Grant Letter Number (Optional)</Label>
                            <Input
                                id="grant_letter_number"
                                name="grant_letter_number"
                                placeholder="e.g. QLI/ESOP/2026/089"
                                value={formData.grant_letter_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total_options_granted" className={errors?.total_options_granted ? "text-red-500" : ""}>
                                Total Options Granted *
                            </Label>
                            <Input
                                id="total_options_granted"
                                name="total_options_granted"
                                placeholder="e.g. 5,000"
                                value={formData.total_options_granted || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('total_options_granted')}
                            />
                            {errors?.total_options_granted && (
                                <p className="text-xs text-red-500 font-medium">{errors.total_options_granted}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="option_type" className={errors?.option_type ? "text-red-500" : ""}>
                                Option Type *
                            </Label>
                            <Select
                                value={formData.option_type || 'Equity Stock Option'}
                                onValueChange={(v) => handleSelectChange('option_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('option_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Equity Stock Option">Equity Stock Option</SelectItem>
                                    <SelectItem value="Restricted Stock Unit (RSU)">Restricted Stock Unit (RSU)</SelectItem>
                                    <SelectItem value="SARs">Stock Appreciation Right (SAR)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.option_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.option_type}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency" className={errors?.currency ? "text-red-500" : ""}>
                                Currency *
                            </Label>
                            <Select
                                value={formData.currency || 'INR'}
                                onValueChange={(v) => handleSelectChange('currency', v)}
                            >
                                <SelectTrigger className={getErrorClass('currency')}>
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR (₹)</SelectItem>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.currency && (
                                <p className="text-xs text-red-500 font-medium">{errors.currency}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exercise_price" className={errors?.exercise_price ? "text-red-500" : ""}>
                                Exercise Price *
                            </Label>
                            <Input
                                id="exercise_price"
                                name="exercise_price"
                                placeholder="e.g. INR 150 per share"
                                value={formData.exercise_price || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('exercise_price')}
                            />
                            {errors?.exercise_price && (
                                <p className="text-xs text-red-500 font-medium">{errors.exercise_price}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fair_market_value">Fair Market Value (Optional)</Label>
                            <Input
                                id="fair_market_value"
                                name="fair_market_value"
                                placeholder="e.g. INR 180 per share"
                                value={formData.fair_market_value || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="board_or_committee_approval_reference" className={errors?.board_or_committee_approval_reference ? "text-red-500" : ""}>
                                Board/Committee Approval *
                            </Label>
                            <Input
                                id="board_or_committee_approval_reference"
                                name="board_or_committee_approval_reference"
                                placeholder="e.g. Board Meeting held on May 10, 2026"
                                value={formData.board_or_committee_approval_reference || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('board_or_committee_approval_reference')}
                            />
                            {errors?.board_or_committee_approval_reference && (
                                <p className="text-xs text-red-500 font-medium">{errors.board_or_committee_approval_reference}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grant_date" className={errors?.grant_date ? "text-red-500" : ""}>
                                Grant Date *
                            </Label>
                            <Input
                                id="grant_date"
                                name="grant_date"
                                type="date"
                                value={formData.grant_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('grant_date')}
                            />
                            {errors?.grant_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.grant_date}</p>
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
                </CardContent>
            </Card>

            {/* Section 4: Vesting Schedule */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Vesting Schedule
                    </CardTitle>
                    <CardDescription>Enter details of cliffs, frequencies, and milestones</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vesting_start_date" className={errors?.vesting_start_date ? "text-red-500" : ""}>
                                Vesting Start Date *
                            </Label>
                            <Input
                                id="vesting_start_date"
                                name="vesting_start_date"
                                type="date"
                                value={formData.vesting_start_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('vesting_start_date')}
                            />
                            {errors?.vesting_start_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.vesting_start_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cliff_period" className={errors?.cliff_period ? "text-red-500" : ""}>
                                Cliff Period *
                            </Label>
                            <Input
                                id="cliff_period"
                                name="cliff_period"
                                placeholder="e.g. 12 months from Effective Date"
                                value={formData.cliff_period || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('cliff_period')}
                            />
                            {errors?.cliff_period && (
                                <p className="text-xs text-red-500 font-medium">{errors.cliff_period}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vesting_frequency" className={errors?.vesting_frequency ? "text-red-500" : ""}>
                                Vesting Frequency *
                            </Label>
                            <Input
                                id="vesting_frequency"
                                name="vesting_frequency"
                                placeholder="e.g. Monthly, Quarterly, Annually"
                                value={formData.vesting_frequency || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('vesting_frequency')}
                            />
                            {errors?.vesting_frequency && (
                                <p className="text-xs text-red-500 font-medium">{errors.vesting_frequency}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vesting_schedule" className={errors?.vesting_schedule ? "text-red-500" : ""}>
                            Vesting Schedule & Percentage Details *
                        </Label>
                        <Textarea
                            id="vesting_schedule"
                            name="vesting_schedule"
                            placeholder="Detail standard vesting percentages and cliff conditions..."
                            rows={3}
                            value={formData.vesting_schedule || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('vesting_schedule')}
                        />
                        {errors?.vesting_schedule && (
                            <p className="text-xs text-red-500 font-medium">{errors.vesting_schedule}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="performance_conditions">Performance Vesting Conditions (Optional)</Label>
                        <Textarea
                            id="performance_conditions"
                            name="performance_conditions"
                            placeholder="Detail any target metrics or performance conditions contingency..."
                            rows={2}
                            value={formData.performance_conditions || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accelerated_vesting">Accelerated Vesting Triggers (Optional)</Label>
                        <Textarea
                            id="accelerated_vesting"
                            name="accelerated_vesting"
                            placeholder="e.g. Accelerated vesting on change of control or IPO..."
                            rows={2}
                            value={formData.accelerated_vesting || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Exercise & Lapse */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Exercise & Lapse Terms
                    </CardTitle>
                    <CardDescription>Enter exercise procedures, windows, payment methods, and lapse rules</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="exercise_window" className={errors?.exercise_window ? "text-red-500" : ""}>
                                Exercise Window *
                            </Label>
                            <Input
                                id="exercise_window"
                                name="exercise_window"
                                placeholder="e.g. Within 5 years from date of vesting"
                                value={formData.exercise_window || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('exercise_window')}
                            />
                            {errors?.exercise_window && (
                                <p className="text-xs text-red-500 font-medium">{errors.exercise_window}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_method" className={errors?.payment_method ? "text-red-500" : ""}>
                                Payment Method *
                            </Label>
                            <Input
                                id="payment_method"
                                name="payment_method"
                                placeholder="e.g. Bank Draft, NEFT/RTGS, or Cheque"
                                value={formData.payment_method || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('payment_method')}
                            />
                            {errors?.payment_method && (
                                <p className="text-xs text-red-500 font-medium">{errors.payment_method}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="exercise_method" className={errors?.exercise_method ? "text-red-500" : ""}>
                            Exercise Method / Procedure *
                        </Label>
                        <Textarea
                            id="exercise_method"
                            name="exercise_method"
                            placeholder="Detail steps for option holders to exercise vested options..."
                            rows={2}
                            value={formData.exercise_method || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('exercise_method')}
                        />
                        {errors?.exercise_method && (
                            <p className="text-xs text-red-500 font-medium">{errors.exercise_method}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lapse_rules" className={errors?.lapse_rules ? "text-red-500" : ""}>
                            Lapse Rules & Treatment *
                        </Label>
                        <Textarea
                            id="lapse_rules"
                            name="lapse_rules"
                            placeholder="Provide rules for resignation, termination, death, or disability..."
                            rows={3}
                            value={formData.lapse_rules || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('lapse_rules')}
                        />
                        {errors?.lapse_rules && (
                            <p className="text-xs text-red-500 font-medium">{errors.lapse_rules}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Restrictions & Taxation */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Restrictions & Taxation
                    </CardTitle>
                    <CardDescription>Transfer limitations, tax responsibilities, and execution place</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transfer_restrictions" className={errors?.transfer_restrictions ? "text-red-500" : ""}>
                            Transfer Restrictions *
                        </Label>
                        <Textarea
                            id="transfer_restrictions"
                            name="transfer_restrictions"
                            placeholder="Specify non-transferability, encumbrances, or lock-in rules..."
                            rows={2}
                            value={formData.transfer_restrictions || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('transfer_restrictions')}
                        />
                        {errors?.transfer_restrictions && (
                            <p className="text-xs text-red-500 font-medium">{errors.transfer_restrictions}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="taxation_clause" className={errors?.taxation_clause ? "text-red-500" : ""}>
                            Taxation Obligations *
                        </Label>
                        <Textarea
                            id="taxation_clause"
                            name="taxation_clause"
                            placeholder="State responsibilities for perquisite tax and capital gains tax..."
                            rows={2}
                            value={formData.taxation_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('taxation_clause')}
                        />
                        {errors?.taxation_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.taxation_clause}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Execution & Signatures */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Execution Details
                    </CardTitle>
                    <CardDescription>Execution credentials and authorized signatory representatives</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatory" className={errors?.authorized_signatory ? "text-red-500" : ""}>
                                Authorized Signatory Representative *
                            </Label>
                            <Textarea
                                id="authorized_signatory"
                                name="authorized_signatory"
                                placeholder="Designations and names of officers executing on behalf of company..."
                                rows={2}
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

            {/* Section 8: Specific Scheme Flags */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Specific Scheme Flags
                    </CardTitle>
                    <CardDescription>Regulatory guidelines modifying the plan terms</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="listed_company"
                                checked={formData.listed_company || false}
                                onCheckedChange={(checked) => handleSelectChange('listed_company', !!checked)}
                            />
                            <Label htmlFor="listed_company" className="text-sm font-normal cursor-pointer">Listed Company (SEBI)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="dpiit_startup"
                                checked={formData.dpiit_startup || false}
                                onCheckedChange={(checked) => handleSelectChange('dpiit_startup', !!checked)}
                            />
                            <Label htmlFor="dpiit_startup" className="text-sm font-normal cursor-pointer">DPIIT Registered Startup</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="foreign_employee"
                                checked={formData.foreign_employee || false}
                                onCheckedChange={(checked) => handleSelectChange('foreign_employee', !!checked)}
                            />
                            <Label htmlFor="foreign_employee" className="text-sm font-normal cursor-pointer">Include Foreign Employees</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="cashless_exercise"
                                checked={formData.cashless_exercise || false}
                                onCheckedChange={(checked) => handleSelectChange('cashless_exercise', !!checked)}
                            />
                            <Label htmlFor="cashless_exercise" className="text-sm font-normal cursor-pointer">Cashless Settlement</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="rsu_grant"
                                checked={formData.rsu_grant || false}
                                onCheckedChange={(checked) => handleSelectChange('rsu_grant', !!checked)}
                            />
                            <Label htmlFor="rsu_grant" className="text-sm font-normal cursor-pointer">Restricted Stock Units (RSUs)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="confidentiality_required"
                                checked={formData.confidentiality_required || false}
                                onCheckedChange={(checked) => handleSelectChange('confidentiality_required', !!checked)}
                            />
                            <Label htmlFor="confidentiality_required" className="text-sm font-normal cursor-pointer">Confidentiality Clauses</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="employee_acceptance_required"
                                checked={formData.employee_acceptance_required || false}
                                onCheckedChange={(checked) => handleSelectChange('employee_acceptance_required', !!checked)}
                            />
                            <Label htmlFor="employee_acceptance_required" className="text-sm font-normal cursor-pointer">Employee Signatures Required</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ESOPGrantLetterForm;
