import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface ShareTransferFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const ShareTransferForm: React.FC<ShareTransferFormProps> = ({
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
                agreement_date: new Date().toISOString().split('T')[0],
                transferor_name: 'Aditya Sharma',
                transferor_address: 'Flat 402, Oakwood Apartments, Jayanagar, Bangalore 560041',
                transferee_name: 'Nexus Ventures LLP',
                transferee_address: '22nd Floor, Nariman Point, Mumbai, Maharashtra 400021',
                company_party: true,
                share_class: 'Equity Shares',
                share_certificate_numbers: 'SEC-0982-ST',
                distinctive_numbers: '10,001 to 20,000',
                number_of_shares: '10,000',
                face_value: 'INR 10',
                paid_up_status: 'Fully Paid-Up',
                purchase_consideration: '15,00,000',
                currency: 'INR',
                payment_method: 'RTGS Bank Transfer',
                payment_schedule: 'The aggregate Purchase Consideration of INR 15,00,000 shall be paid in full by the Transferee to the Transferor on the Closing Date.',
                taxes: 'The Transferor shall be solely responsible for any capital gains tax liabilities arising from the transfer of shares.',
                stamp_duty_responsibility: 'The Transferee shall bear the stamp duty charges (0.015% of the purchase consideration) required for the execution of Form SH-4.',
                conditions_precedent: '1. Approval of the Board of Directors of the Company for the transfer.\n2. Waiver of Right of First Refusal (ROFR) by other shareholders.\n3. Executed share transfer form (Form SH-4).',
                closing_date: new Date().toISOString().split('T')[0],
                closing_deliverables: '1. Original Share Certificate.\n2. Executed Form SH-4.\n3. Resignation letter of Transferor from Board (if applicable).',
                representations_transferor: '1. Transferor is the sole legal and beneficial owner of the shares.\n2. Shares are free from any liens, charges, pledges, or encumbrances.\n3. Transferor has full power and authority to sell the shares.',
                representations_transferee: '1. Transferee has corporate power and authority to enter into this Agreement.\n2. Execution does not violate any material contracts or laws.',
                representations_company: '1. Company is validly incorporated and in good standing.\n2. Board has approved the transfer subject to execution.',
                pre_closing_covenants: '1. Transferor shall not sell, pledge, or encumber the shares pre-closing.\n2. Company shall not issue any new shares pre-closing.',
                post_closing_covenants: '1. Company shall update its Register of Members within 15 days of Closing.\n2. Company shall issue fresh share certificates or endorse existing ones.',
                indemnity_required: true,
                confidentiality_required: true,
                termination_conditions: 'This Agreement may be terminated by mutual written consent or if closing has not occurred within thirty (30) days of execution.',
                governing_law: 'Laws of India',
                dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 in Bangalore by a sole arbitrator appointed by the Company.',
                startup: true,
                private_company: true,
                listed_company: false,
                foreign_investor: false,
                employee_shares: false,
                promoter_shares: true,
                drag_tag_rights: 'Tag-Along rights apply to the transfer in accordance with the Shareholders Agreement.',
                aoa_restrictions: 'Transfer is subject to AOA restrictions and approval of the Board.',
                shareholders_agreement_reference: 'Shareholders Agreement dated June 15, 2024',
                authorized_signatories: 'Transferor: Aditya Sharma\nTransferee: Mr. Rajesh Mehta (Partner, Nexus Ventures)\nCompany: Mr. Arvind Swamy (Director, StellarAI)',
                witness_details: 'Witness 1: Mr. Amit Singh, Bangalore\nWitness 2: Ms. Priya Sen, Bangalore',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'Any modifications to this Agreement must be executed in writing by all parties.'
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
                    <CardDescription>Enter details of the company whose shares are being transferred</CardDescription>
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

            {/* Section 2: Parties Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <UserCheck className="h-5 w-5" />
                        Parties Details
                    </CardTitle>
                    <CardDescription>Enter details of the Transferor and Transferee</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="transferor_name" className={errors?.transferor_name ? "text-red-500" : ""}>
                                Transferor Full Name *
                            </Label>
                            <Input
                                id="transferor_name"
                                name="transferor_name"
                                placeholder="e.g. Aditya Sharma"
                                value={formData.transferor_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('transferor_name')}
                            />
                            {errors?.transferor_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.transferor_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transferee_name" className={errors?.transferee_name ? "text-red-500" : ""}>
                                Transferee Full Name *
                            </Label>
                            <Input
                                id="transferee_name"
                                name="transferee_name"
                                placeholder="e.g. Nexus Ventures LLP"
                                value={formData.transferee_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('transferee_name')}
                            />
                            {errors?.transferee_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.transferee_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transferor_address" className={errors?.transferor_address ? "text-red-500" : ""}>
                                Transferor Address *
                            </Label>
                            <Input
                                id="transferor_address"
                                name="transferor_address"
                                placeholder="Registered or residential address..."
                                value={formData.transferor_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('transferor_address')}
                            />
                            {errors?.transferor_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.transferor_address}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transferee_address" className={errors?.transferee_address ? "text-red-500" : ""}>
                                Transferee Address *
                            </Label>
                            <Input
                                id="transferee_address"
                                name="transferee_address"
                                placeholder="Registered or residential address..."
                                value={formData.transferee_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('transferee_address')}
                            />
                            {errors?.transferee_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.transferee_address}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agreement_date" className={errors?.agreement_date ? "text-red-500" : ""}>
                                Agreement Date *
                            </Label>
                            <Input
                                id="agreement_date"
                                name="agreement_date"
                                type="date"
                                value={formData.agreement_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('agreement_date')}
                            />
                            {errors?.agreement_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.agreement_date}</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                                id="company_party"
                                checked={formData.company_party || false}
                                onCheckedChange={(checked) => handleSelectChange('company_party', !!checked)}
                            />
                            <Label htmlFor="company_party" className="text-sm font-normal cursor-pointer">Company is a Party to this Agreement</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Shares details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Award className="h-5 w-5" />
                        Shares Being Transferred
                    </CardTitle>
                    <CardDescription>Enter distinctive numbers, certificate details, and count</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="share_class" className={errors?.share_class ? "text-red-500" : ""}>
                                Share Class *
                            </Label>
                            <Input
                                id="share_class"
                                name="share_class"
                                placeholder="e.g. Equity Shares"
                                value={formData.share_class || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('share_class')}
                            />
                            {errors?.share_class && (
                                <p className="text-xs text-red-500 font-medium">{errors.share_class}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="share_certificate_numbers" className={errors?.share_certificate_numbers ? "text-red-500" : ""}>
                                Certificate Numbers *
                            </Label>
                            <Input
                                id="share_certificate_numbers"
                                name="share_certificate_numbers"
                                placeholder="e.g. SEC-0982-ST"
                                value={formData.share_certificate_numbers || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('share_certificate_numbers')}
                            />
                            {errors?.share_certificate_numbers && (
                                <p className="text-xs text-red-500 font-medium">{errors.share_certificate_numbers}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="distinctive_numbers" className={errors?.distinctive_numbers ? "text-red-500" : ""}>
                                Distinctive Numbers *
                            </Label>
                            <Input
                                id="distinctive_numbers"
                                name="distinctive_numbers"
                                placeholder="e.g. 10,001 to 20,000"
                                value={formData.distinctive_numbers || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('distinctive_numbers')}
                            />
                            {errors?.distinctive_numbers && (
                                <p className="text-xs text-red-500 font-medium">{errors.distinctive_numbers}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="number_of_shares" className={errors?.number_of_shares ? "text-red-500" : ""}>
                                Number of Shares *
                            </Label>
                            <Input
                                id="number_of_shares"
                                name="number_of_shares"
                                placeholder="e.g. 10,000"
                                value={formData.number_of_shares || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('number_of_shares')}
                            />
                            {errors?.number_of_shares && (
                                <p className="text-xs text-red-500 font-medium">{errors.number_of_shares}</p>
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
                            <Label htmlFor="paid_up_status" className={errors?.paid_up_status ? "text-red-500" : ""}>
                                Paid-Up Status *
                            </Label>
                            <Input
                                id="paid_up_status"
                                name="paid_up_status"
                                placeholder="e.g. Fully Paid-Up"
                                value={formData.paid_up_status || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('paid_up_status')}
                            />
                            {errors?.paid_up_status && (
                                <p className="text-xs text-red-500 font-medium">{errors.paid_up_status}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Purchase Consideration */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Purchase Consideration & Stamp Duty
                    </CardTitle>
                    <CardDescription>Enter pricing details, currency, payment terms, and stamps responsibility</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="purchase_consideration" className={errors?.purchase_consideration ? "text-red-500" : ""}>
                                Purchase Consideration *
                            </Label>
                            <Input
                                id="purchase_consideration"
                                name="purchase_consideration"
                                placeholder="e.g. 15,00,000"
                                value={formData.purchase_consideration || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('purchase_consideration')}
                            />
                            {errors?.purchase_consideration && (
                                <p className="text-xs text-red-500 font-medium">{errors.purchase_consideration}</p>
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
                            <Label htmlFor="payment_method" className={errors?.payment_method ? "text-red-500" : ""}>
                                Payment Method *
                            </Label>
                            <Input
                                id="payment_method"
                                name="payment_method"
                                placeholder="e.g. RTGS Bank Transfer"
                                value={formData.payment_method || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('payment_method')}
                            />
                            {errors?.payment_method && (
                                <p className="text-xs text-red-500 font-medium">{errors.payment_method}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxes" className={errors?.taxes ? "text-red-500" : ""}>
                                Capital Gains Tax responsibility *
                            </Label>
                            <Input
                                id="taxes"
                                name="taxes"
                                placeholder="Who bears capital gains taxes..."
                                value={formData.taxes || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('taxes')}
                            />
                            {errors?.taxes && (
                                <p className="text-xs text-red-500 font-medium">{errors.taxes}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="stamp_duty_responsibility" className={errors?.stamp_duty_responsibility ? "text-red-500" : ""}>
                                Stamp Duty Responsibility *
                            </Label>
                            <Input
                                id="stamp_duty_responsibility"
                                name="stamp_duty_responsibility"
                                placeholder="Who pays stamp duty on Form SH-4..."
                                value={formData.stamp_duty_responsibility || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('stamp_duty_responsibility')}
                            />
                            {errors?.stamp_duty_responsibility && (
                                <p className="text-xs text-red-500 font-medium">{errors.stamp_duty_responsibility}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="payment_schedule" className={errors?.payment_schedule ? "text-red-500" : ""}>
                                Payment Schedule & Terms *
                            </Label>
                            <Textarea
                                id="payment_schedule"
                                name="payment_schedule"
                                placeholder="Detail payment tranches, milestones, or timing..."
                                rows={2}
                                value={formData.payment_schedule || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('payment_schedule')}
                            />
                            {errors?.payment_schedule && (
                                <p className="text-xs text-red-500 font-medium">{errors.payment_schedule}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Conditions Precedent & Closing */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Conditions Precedent & Closing
                    </CardTitle>
                    <CardDescription>Describe closing date, deliverables, and conditions</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="closing_date" className={errors?.closing_date ? "text-red-500" : ""}>
                                Closing Date *
                            </Label>
                            <Input
                                id="closing_date"
                                name="closing_date"
                                type="date"
                                value={formData.closing_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('closing_date')}
                            />
                            {errors?.closing_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.closing_date}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="conditions_precedent" className={errors?.conditions_precedent ? "text-red-500" : ""}>
                            Conditions Precedent *
                        </Label>
                        <Textarea
                            id="conditions_precedent"
                            name="conditions_precedent"
                            placeholder="Approval criteria needed before Closing..."
                            rows={3}
                            value={formData.conditions_precedent || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('conditions_precedent')}
                        />
                        {errors?.conditions_precedent && (
                            <p className="text-xs text-red-500 font-medium">{errors.conditions_precedent}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closing_deliverables" className={errors?.closing_deliverables ? "text-red-500" : ""}>
                            Closing Deliverables *
                        </Label>
                        <Textarea
                            id="closing_deliverables"
                            name="closing_deliverables"
                            placeholder="Items to be handed over on the Closing Date..."
                            rows={2}
                            value={formData.closing_deliverables || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('closing_deliverables')}
                        />
                        {errors?.closing_deliverables && (
                            <p className="text-xs text-red-500 font-medium">{errors.closing_deliverables}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Covenants & Representations */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Representations & Covenants
                    </CardTitle>
                    <CardDescription>Covenants and statutory obligations of both parties</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="representations_transferor" className={errors?.representations_transferor ? "text-red-500" : ""}>
                            Representations & Warranties (Transferor) *
                        </Label>
                        <Textarea
                            id="representations_transferor"
                            name="representations_transferor"
                            placeholder="Enter Transferor's representations..."
                            rows={3}
                            value={formData.representations_transferor || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('representations_transferor')}
                        />
                        {errors?.representations_transferor && (
                            <p className="text-xs text-red-500 font-medium">{errors.representations_transferor}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="representations_transferee" className={errors?.representations_transferee ? "text-red-500" : ""}>
                            Representations & Warranties (Transferee) *
                        </Label>
                        <Textarea
                            id="representations_transferee"
                            name="representations_transferee"
                            placeholder="Enter Transferee's representations..."
                            rows={3}
                            value={formData.representations_transferee || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('representations_transferee')}
                        />
                        {errors?.representations_transferee && (
                            <p className="text-xs text-red-500 font-medium">{errors.representations_transferee}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="representations_company">Representations & Warranties (Company) (Optional)</Label>
                        <Textarea
                            id="representations_company"
                            name="representations_company"
                            placeholder="Enter Company's representations..."
                            rows={2}
                            value={formData.representations_company || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pre_closing_covenants" className={errors?.pre_closing_covenants ? "text-red-500" : ""}>
                            Pre-Closing Covenants *
                        </Label>
                        <Textarea
                            id="pre_closing_covenants"
                            name="pre_closing_covenants"
                            placeholder="Obligations prior to closing date..."
                            rows={2}
                            value={formData.pre_closing_covenants || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('pre_closing_covenants')}
                        />
                        {errors?.pre_closing_covenants && (
                            <p className="text-xs text-red-500 font-medium">{errors.pre_closing_covenants}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="post_closing_covenants" className={errors?.post_closing_covenants ? "text-red-500" : ""}>
                            Post-Closing Covenants *
                        </Label>
                        <Textarea
                            id="post_closing_covenants"
                            name="post_closing_covenants"
                            placeholder="Obligations following closing date..."
                            rows={2}
                            value={formData.post_closing_covenants || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('post_closing_covenants')}
                        />
                        {errors?.post_closing_covenants && (
                            <p className="text-xs text-red-500 font-medium">{errors.post_closing_covenants}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Governance & Terminations */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Scale className="h-5 w-5" />
                        Governance, Disputes & Terminations
                    </CardTitle>
                    <CardDescription>Define dispute seats, arbitration, governing law, and exits</CardDescription>
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
                                placeholder="Describe conditions allowing agreement termination..."
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
                                placeholder="Specify court seats and arbitration terms..."
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

            {/* Section 8: Execution & Signatories */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Clock className="h-5 w-5" />
                        Execution & Reference
                    </CardTitle>
                    <CardDescription>Designate executants, witnesses, and signing places</CardDescription>
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
                                placeholder="Designations and names of officers executing on behalf of company..."
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
                            <Label htmlFor="witness_details" className={errors?.witness_details ? "text-red-500" : ""}>
                                Witness Details *
                            </Label>
                            <Textarea
                                id="witness_details"
                                name="witness_details"
                                placeholder="Names, addresses, and details of executing witnesses..."
                                rows={2}
                                value={formData.witness_details || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('witness_details')}
                            />
                            {errors?.witness_details && (
                                <p className="text-xs text-red-500 font-medium">{errors.witness_details}</p>
                            )}
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

            {/* Section 9: Specific Compliance Flags */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
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
                            <Label htmlFor="startup" className="text-sm font-normal cursor-pointer">Startup (SHA compliance)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="private_company"
                                checked={formData.private_company || false}
                                onCheckedChange={(checked) => handleSelectChange('private_company', !!checked)}
                            />
                            <Label htmlFor="private_company" className="text-sm font-normal cursor-pointer">Private Company (ROFR & AOA)</Label>
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
                                id="foreign_investor"
                                checked={formData.foreign_investor || false}
                                onCheckedChange={(checked) => handleSelectChange('foreign_investor', !!checked)}
                            />
                            <Label htmlFor="foreign_investor" className="text-sm font-normal cursor-pointer">Foreign Investor (FEMA / FCTRS)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="employee_shares"
                                checked={formData.employee_shares || false}
                                onCheckedChange={(checked) => handleSelectChange('employee_shares', !!checked)}
                            />
                            <Label htmlFor="employee_shares" className="text-sm font-normal cursor-pointer">Employee Options/Shares (ESOP)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="promoter_shares"
                                checked={formData.promoter_shares || false}
                                onCheckedChange={(checked) => handleSelectChange('promoter_shares', !!checked)}
                            />
                            <Label htmlFor="promoter_shares" className="text-sm font-normal cursor-pointer">Promoter Shares (Lock-in)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="indemnity_required"
                                checked={formData.indemnity_required || false}
                                onCheckedChange={(checked) => handleSelectChange('indemnity_required', !!checked)}
                            />
                            <Label htmlFor="indemnity_required" className="text-sm font-normal cursor-pointer">Standard Indemnity Clauses</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="confidentiality_required"
                                checked={formData.confidentiality_required || false}
                                onCheckedChange={(checked) => handleSelectChange('confidentiality_required', !!checked)}
                            />
                            <Label htmlFor="confidentiality_required" className="text-sm font-normal cursor-pointer">Confidentiality Obligation</Label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="drag_tag_rights">Drag Along / Tag Along Clauses (Optional)</Label>
                            <Textarea
                                id="drag_tag_rights"
                                name="drag_tag_rights"
                                placeholder="Details of drag or tag rights if applicable..."
                                rows={2}
                                value={formData.drag_tag_rights || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aoa_restrictions">AOA Restrictions details (Optional)</Label>
                            <Textarea
                                id="aoa_restrictions"
                                name="aoa_restrictions"
                                placeholder="Details of AOA board approvals or restrictions..."
                                rows={2}
                                value={formData.aoa_restrictions || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="shareholders_agreement_reference">Shareholders Agreement Reference (Optional)</Label>
                            <Input
                                id="shareholders_agreement_reference"
                                name="shareholders_agreement_reference"
                                placeholder="e.g. Shareholders Agreement dated June 15, 2024"
                                value={formData.shareholders_agreement_reference || ''}
                                onChange={handleInputChange}
                            />
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShareTransferForm;
