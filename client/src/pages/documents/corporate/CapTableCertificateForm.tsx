import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, Plus, Trash2 } from "lucide-react";

interface CapTableCertificateFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const CapTableCertificateForm: React.FC<CapTableCertificateFormProps> = ({
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
                company_name: 'StellarAI Technologies Private Limited',
                company_type: 'Private Limited',
                cin: 'U72200KA2023PTC987654',
                registered_office: 'Level 5, Sector 6, HSR Layout, Bangalore, Karnataka 560102',
                certificate_date: new Date().toISOString().split('T')[0],
                effective_date: new Date().toISOString().split('T')[0],
                reference_number: 'CTC/2026/04',
                authorized_share_capital: 'INR 15,00,000',
                authorized_shares: '1,50,000',
                face_value: 'INR 10',
                share_classes: 'Equity Shares of INR 10 each',
                issued_share_capital: 'INR 10,00,000',
                subscribed_share_capital: 'INR 10,00,000',
                paid_up_share_capital: 'INR 10,00,000',
                shareholders: [
                    { shareholder_name: 'Founder A', shareholder_type: 'Promoter', security_type: 'Equity', share_class: 'Equity', number_of_securities: '45,000', ownership_percentage: '45', fully_diluted_percentage: '37.5' },
                    { shareholder_name: 'Founder B', shareholder_type: 'Promoter', security_type: 'Equity', share_class: 'Equity', number_of_securities: '45,000', ownership_percentage: '45', fully_diluted_percentage: '37.5' },
                    { shareholder_name: 'Nexus Ventures LLP', shareholder_type: 'Investor', security_type: 'CCPS', share_class: 'Series A', number_of_securities: '10,000', ownership_percentage: '10', fully_diluted_percentage: '8.33' }
                ],
                esop_pool: 'Total ESOP Pool: 15,000 options (10% of fully diluted capital). Granted: 5,000 options. Unallocated: 10,000 options.',
                convertible_securities: 'Series A CCPS: 10,000 shares convertible to Equity on a 1:1 basis.\nConvertible Notes: Nexus Ventures holds a note of INR 25,00,000 convertible at next round.',
                fully_diluted_summary: 'Existing Equity: 90,000 shares (75.00%). Series A CCPS: 10,000 shares (8.33%). ESOP Pool: 20,000 options/shares (16.67%). Total Fully Diluted: 1,20,000 shares (100.00%).',
                transfer_restrictions: 'Right of First Refusal (ROFR) and Tag-Along rights apply to transfers as per the Shareholders Agreement dated June 15, 2024.',
                notes: 'All shareholdings certified as per statutory filings and Ben-2 returns.',
                startup: true,
                listed_company: false,
                foreign_investors: false,
                shareholders_agreement_exists: true,
                company_secretary: 'Mr. Ritesh Sen, FCS 9087',
                authorized_signatory: 'For StellarAI Technologies: Mr. Arvind Swamy (Director)',
                company_seal_required: true,
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'This certificate is issued to Nexus Ventures for due diligence purposes.'
            });
        }
    };

    const getErrorClass = (fieldName: string) => {
        return errors?.[fieldName] ? "border-red-500 focus-visible:ring-red-500" : "";
    };

    // Add shareholder row
    const addShareholder = () => {
        if (setFormData) {
            const currentList = formData.shareholders || [];
            setFormData({
                ...formData,
                shareholders: [
                    ...currentList,
                    { shareholder_name: '', shareholder_type: 'Investor', security_type: 'Equity', share_class: 'Equity', number_of_securities: '', ownership_percentage: '', fully_diluted_percentage: '' }
                ]
            });
        }
    };

    // Remove shareholder row
    const removeShareholder = (index: number) => {
        if (setFormData) {
            const currentList = [...(formData.shareholders || [])];
            currentList.splice(index, 1);
            setFormData({
                ...formData,
                shareholders: currentList
            });
        }
    };

    // Update shareholder row value
    const updateShareholderValue = (index: number, key: string, value: string) => {
        if (setFormData) {
            const currentList = [...(formData.shareholders || [])];
            currentList[index] = {
                ...currentList[index],
                [key]: value
            };
            setFormData({
                ...formData,
                shareholders: currentList
            });
        }
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
                    <CardDescription>Enter details of the company adopting this certificate</CardDescription>
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
                                placeholder="e.g. StellarAI Technologies Private Limited"
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
                                placeholder="e.g. U72200KA2023PTC987654"
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

            {/* Section 2: Capital Structure Detail */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Award className="h-5 w-5" />
                        Capital Structure Summary
                    </CardTitle>
                    <CardDescription>Authorized, issued, and paid-up share capital figures</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorized_share_capital" className={errors?.authorized_share_capital ? "text-red-500" : ""}>
                                Authorized Capital *
                            </Label>
                            <Input
                                id="authorized_share_capital"
                                name="authorized_share_capital"
                                placeholder="e.g. INR 15,00,000"
                                value={formData.authorized_share_capital || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_share_capital')}
                            />
                            {errors?.authorized_share_capital && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_share_capital}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="authorized_shares" className={errors?.authorized_shares ? "text-red-500" : ""}>
                                Total Authorized Shares *
                            </Label>
                            <Input
                                id="authorized_shares"
                                name="authorized_shares"
                                placeholder="e.g. 1,50,000"
                                value={formData.authorized_shares || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_shares')}
                            />
                            {errors?.authorized_shares && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_shares}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="face_value" className={errors?.face_value ? "text-red-500" : ""}>
                                Face Value per Share *
                            </Label>
                            <Input
                                id="face_value"
                                name="face_value"
                                placeholder="e.g. INR 10"
                                value={formData.face_value || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('face_value')}
                            />
                            {errors?.face_value && (
                                <p className="text-xs text-red-500 font-medium">{errors.face_value}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="issued_share_capital" className={errors?.issued_share_capital ? "text-red-500" : ""}>
                                Issued Share Capital *
                            </Label>
                            <Input
                                id="issued_share_capital"
                                name="issued_share_capital"
                                placeholder="e.g. INR 10,00,000"
                                value={formData.issued_share_capital || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('issued_share_capital')}
                            />
                            {errors?.issued_share_capital && (
                                <p className="text-xs text-red-500 font-medium">{errors.issued_share_capital}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscribed_share_capital" className={errors?.subscribed_share_capital ? "text-red-500" : ""}>
                                Subscribed Share Capital *
                            </Label>
                            <Input
                                id="subscribed_share_capital"
                                name="subscribed_share_capital"
                                placeholder="e.g. INR 10,00,000"
                                value={formData.subscribed_share_capital || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('subscribed_share_capital')}
                            />
                            {errors?.subscribed_share_capital && (
                                <p className="text-xs text-red-500 font-medium">{errors.subscribed_share_capital}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paid_up_share_capital" className={errors?.paid_up_share_capital ? "text-red-500" : ""}>
                                Paid-up Share Capital *
                            </Label>
                            <Input
                                id="paid_up_share_capital"
                                name="paid_up_share_capital"
                                placeholder="e.g. INR 10,00,000"
                                value={formData.paid_up_share_capital || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('paid_up_share_capital')}
                            />
                            {errors?.paid_up_share_capital && (
                                <p className="text-xs text-red-500 font-medium">{errors.paid_up_share_capital}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="share_classes" className={errors?.share_classes ? "text-red-500" : ""}>
                                Share Classes Details *
                            </Label>
                            <Input
                                id="share_classes"
                                name="share_classes"
                                placeholder="e.g. Equity Shares and Series A Preference Shares..."
                                value={formData.share_classes || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('share_classes')}
                            />
                            {errors?.share_classes && (
                                <p className="text-xs text-red-500 font-medium">{errors.share_classes}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Shareholder Registry List */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <Users className="h-5 w-5" />
                            Shareholder Registry
                        </CardTitle>
                        <CardDescription>Add, edit, or remove shareholders and securities holdings</CardDescription>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={addShareholder}
                        className="gap-1 bg-primary hover:bg-primary text-white"
                    >
                        <Plus className="h-4 w-4" /> Add Row
                    </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="p-3 text-left font-semibold text-slate-700">Name *</th>
                                    <th className="p-3 text-left font-semibold text-slate-700">Type</th>
                                    <th className="p-3 text-left font-semibold text-slate-700">Security</th>
                                    <th className="p-3 text-left font-semibold text-slate-700">Class</th>
                                    <th className="p-3 text-right font-semibold text-slate-700">Count *</th>
                                    <th className="p-3 text-right font-semibold text-slate-700">Hold % *</th>
                                    <th className="p-3 text-right font-semibold text-slate-700">Diluted % *</th>
                                    <th className="p-3 text-center font-semibold text-slate-700 w-16">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(formData.shareholders || []).map((sh: any, index: number) => (
                                    <tr key={index} className="border-b hover:bg-slate-50/50">
                                        <td className="p-2">
                                            <Input
                                                value={sh.shareholder_name || ''}
                                                placeholder="Shareholder Name"
                                                onChange={(e) => updateShareholderValue(index, 'shareholder_name', e.target.value)}
                                                className="h-8 py-1"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Select
                                                value={sh.shareholder_type || 'Investor'}
                                                onValueChange={(v) => updateShareholderValue(index, 'shareholder_type', v)}
                                            >
                                                <SelectTrigger className="h-8 py-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Promoter">Promoter</SelectItem>
                                                    <SelectItem value="Investor">Investor</SelectItem>
                                                    <SelectItem value="Employee">Employee</SelectItem>
                                                    <SelectItem value="Trust">Trust</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-2">
                                            <Select
                                                value={sh.security_type || 'Equity'}
                                                onValueChange={(v) => updateShareholderValue(index, 'security_type', v)}
                                            >
                                                <SelectTrigger className="h-8 py-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Equity">Equity</SelectItem>
                                                    <SelectItem value="CCPS">CCPS</SelectItem>
                                                    <SelectItem value="CCDs">CCDs</SelectItem>
                                                    <SelectItem value="Warrants">Warrants</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                value={sh.share_class || 'Equity'}
                                                placeholder="Class"
                                                onChange={(e) => updateShareholderValue(index, 'share_class', e.target.value)}
                                                className="h-8 py-1"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                value={sh.number_of_securities || ''}
                                                placeholder="e.g. 10,000"
                                                onChange={(e) => updateShareholderValue(index, 'number_of_securities', e.target.value)}
                                                className="h-8 py-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                value={sh.ownership_percentage || ''}
                                                placeholder="e.g. 10"
                                                onChange={(e) => updateShareholderValue(index, 'ownership_percentage', e.target.value)}
                                                className="h-8 py-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                value={sh.fully_diluted_percentage || ''}
                                                placeholder="e.g. 8.33"
                                                onChange={(e) => updateShareholderValue(index, 'fully_diluted_percentage', e.target.value)}
                                                className="h-8 py-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeShareholder(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {(formData.shareholders || []).length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                            No shareholders added yet. Click "Add Row" or "Fill Dummy Data" above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Timelines & Fully Diluted Summary */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Timelines & Dilution Summaries
                    </CardTitle>
                    <CardDescription>Enter dates, ESOP pool descriptions, and fully diluted capitalization summaries</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="certificate_date" className={errors?.certificate_date ? "text-red-500" : ""}>
                                Certificate Date *
                            </Label>
                            <Input
                                id="certificate_date"
                                name="certificate_date"
                                type="date"
                                value={formData.certificate_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('certificate_date')}
                            />
                            {errors?.certificate_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.certificate_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effective_date" className={errors?.effective_date ? "text-red-500" : ""}>
                                Effective Capitalization Date *
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
                            <Label htmlFor="reference_number">Reference Number (Optional)</Label>
                            <Input
                                id="reference_number"
                                name="reference_number"
                                placeholder="e.g. CTC/2026/04"
                                value={formData.reference_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="esop_pool">ESOP Option Pool Detail (Optional)</Label>
                        <Textarea
                            id="esop_pool"
                            name="esop_pool"
                            placeholder="Describe ESOP pool size, unallocated, and granted options..."
                            rows={2}
                            value={formData.esop_pool || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="convertible_securities">Convertible Securities Details (Optional)</Label>
                        <Textarea
                            id="convertible_securities"
                            name="convertible_securities"
                            placeholder="Describe CCPS, notes, warrants conversion terms..."
                            rows={2}
                            value={formData.convertible_securities || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fully_diluted_summary" className={errors?.fully_diluted_summary ? "text-red-500" : ""}>
                            Fully Diluted Capitalization Summary *
                        </Label>
                        <Textarea
                            id="fully_diluted_summary"
                            name="fully_diluted_summary"
                            placeholder="Detail total shares, options, and dilution schedules..."
                            rows={3}
                            value={formData.fully_diluted_summary || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('fully_diluted_summary')}
                        />
                        {errors?.fully_diluted_summary && (
                            <p className="text-xs text-red-500 font-medium">{errors.fully_diluted_summary}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Restrictions, Notes & Execution */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Restrictions, Notes & Execution
                    </CardTitle>
                    <CardDescription>Lock-ins, notes, and signing details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transfer_restrictions">Share Transfer Restrictions (Optional)</Label>
                        <Textarea
                            id="transfer_restrictions"
                            name="transfer_restrictions"
                            placeholder="Enter Tag-along, Drag-along, ROFR, lock-in details..."
                            rows={2}
                            value={formData.transfer_restrictions || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Any additional notes or statutory explanations..."
                            rows={2}
                            value={formData.notes || ''}
                            onChange={handleInputChange}
                        />
                    </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="company_secretary">Company Secretary details (Optional)</Label>
                            <Input
                                id="company_secretary"
                                name="company_secretary"
                                placeholder="e.g. Mr. Ritesh Sen, FCS 9087"
                                value={formData.company_secretary || ''}
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

            {/* Section 6: Specific Scheme Flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Setup Flags
                    </CardTitle>
                    <CardDescription>Regulatory guidelines modifying the plan terms</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="startup"
                                checked={formData.startup || false}
                                onCheckedChange={(checked) => handleSelectChange('startup', !!checked)}
                            />
                            <Label htmlFor="startup" className="text-sm font-normal cursor-pointer">Startup (Venture Capital format)</Label>
                        </div>
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
                                id="foreign_investors"
                                checked={formData.foreign_investors || false}
                                onCheckedChange={(checked) => handleSelectChange('foreign_investors', !!checked)}
                            />
                            <Label htmlFor="foreign_investors" className="text-sm font-normal cursor-pointer">Include Foreign Investors (FEMA)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="shareholders_agreement_exists"
                                checked={formData.shareholders_agreement_exists || false}
                                onCheckedChange={(checked) => handleSelectChange('shareholders_agreement_exists', !!checked)}
                            />
                            <Label htmlFor="shareholders_agreement_exists" className="text-sm font-normal cursor-pointer">Shareholders Agreement References</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="company_seal_required"
                                checked={formData.company_seal_required || false}
                                onCheckedChange={(checked) => handleSelectChange('company_seal_required', !!checked)}
                            />
                            <Label htmlFor="company_seal_required" className="text-sm font-normal cursor-pointer">Company Seal Required</Label>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
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
                </CardContent>
            </Card>
        </div>
    );
};

export default CapTableCertificateForm;
