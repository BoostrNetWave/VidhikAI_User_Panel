import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface IndependentContractorFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const IndependentContractorForm: React.FC<IndependentContractorFormProps> = ({
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
                agreement_date: new Date().toISOString().split('T')[0],
                client_name: 'Alpha Software Solutions Private Limited',
                client_type: 'Private Limited',
                client_address: '7th Floor, Innovation Tower, IT Tech Park, Electronic City, Bangalore, Karnataka 560100',
                contractor_name: 'Vikas Patel',
                contractor_type: 'Individual',
                contractor_address: 'Flat 403, Residency Heights, Whitefield Main Road, Bangalore, Karnataka 560066',
                contractor_registration_details: 'PAN: BPPXP1234F, GSTIN: 29BPPXP1234F1Z5',
                engagement_type: 'Technology Services',
                effective_date: new Date().toISOString().split('T')[0],
                commencement_date: new Date().toISOString().split('T')[0],
                expiry_date: '2027-01-31',
                renewal_terms: 'This agreement may be renewed for successive 6-month periods by mutual written consent at least 30 days prior to expiry.',
                scope_of_services: 'End-to-end cloud infrastructure optimization and architectural redesign of the core enterprise dashboard application. Migration of legacy SQL databases to scalable AWS architectures.',
                deliverables: '1. Complete AWS cloud architecture design schematic.\n2. Finalized cloud migration codebase in GitHub.\n3. Detailed optimization performance benchmark report.',
                milestones: 'Milestone 1: Architecture Blueprint (Month 2) - 30%\nMilestone 2: Database Migration (Month 4) - 40%\nMilestone 3: Performance Benchmarking (Month 6) - 30%',
                acceptance_criteria: 'All deliverables must pass strict security checks, load-testing benchmarks, and be approved in writing by the Client Chief Technology Officer.',
                fee_structure: 'Fixed Project Fee model',
                payment_schedule: '30% upon blueprint sign-off, 40% upon database migration approval, and 30% upon final bench-marking delivery.',
                reimbursement_policy: 'Pre-approved travel, lodging, and out-of-pocket expenses shall be reimbursed at cost within 15 days of invoice validation.',
                gst_applicable: true,
                gst_registration_number: '29BPPXP1234F1Z5',
                tax_responsibility: 'Contractor is solely responsible for all income taxes, professional taxes, and GST compliance. Client will deduct TDS at 10% under Section 194J.',
                client_obligations: 'Provide access to AWS staging console, cloud repositories, and engineering documentation within 3 days of signing.',
                contractor_obligations: 'Ensure all services are performed to industry standards. Maintain adequate backup tools and deliver reports on a weekly basis.',
                intellectual_property_clause: 'Absolute and unconditional assignment of all work product, scripts, database schemas, and documentation to the Client.',
                confidentiality_clause: 'Contractor shall protect and maintain the strict confidentiality of all proprietary source code and client databases shared during the project.',
                data_processing: 'All personal data processed under this agreement shall comply with the Digital Personal Data Protection Act, 2023.',
                non_solicitation: 'Neither party shall solicit or hire employees of the other party during the term and for 12 months post-termination.',
                non_compete: 'Contractor shall not perform similar database migration services for direct cloud competitor entities during the term of this engagement.',
                insurance_requirements: 'Contractor shall maintain professional indemnity insurance covering up to INR 10,00,000.',
                limitation_of_liability: 'The total liability of either party for any claims under this agreement shall be capped at the total professional fees paid to the contractor.',
                indemnity_clause: 'Contractor agrees to indemnify and hold harmless the Client against any third-party claims arising from intellectual property infringement or gross negligence.',
                termination_conditions: 'Either party may terminate for convenience with 30 days written notice, or immediately for material breach that remains uncured for 10 days.',
                notice_period: '30 Days written notice',
                force_majeure: 'Neither party shall be liable for delays caused by acts of God, war, government regulations, or pandemics.',
                governing_law: 'Laws of India',
                dispute_resolution: 'Arbitration in Bangalore under the Arbitration and Conciliation Act, 1996 by a sole arbitrator.',
                electronic_execution: true,
                authorized_signatories: 'Client Signatory: Mr. Rajeev Mehta (Managing Director)\nContractor Signatory: Vikas Patel',
                witness_details: 'Witness 1: Mr. Suresh Kumar, Bangalore\nWitness 2: Ms. Ananya Sen, Bangalore',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'This agreement constitutes the entire understanding between the parties and overrides any prior proposals.'
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

            {/* Section 1: Client details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Client details
                    </CardTitle>
                    <CardDescription>Enter details of the entity hiring the contractor</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client_name" className={errors?.client_name ? "text-red-500" : ""}>
                                Client Legal Name *
                            </Label>
                            <Input
                                id="client_name"
                                name="client_name"
                                placeholder="e.g. Alpha Software Solutions Private Limited"
                                value={formData.client_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('client_name')}
                            />
                            {errors?.client_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.client_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client_type" className={errors?.client_type ? "text-red-500" : ""}>
                                Client Type *
                            </Label>
                            <Select
                                value={formData.client_type || 'Private Limited'}
                                onValueChange={(v) => handleSelectChange('client_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('client_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited Company</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited Company</SelectItem>
                                    <SelectItem value="LLP">LLP</SelectItem>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.client_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.client_type}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="client_address" className={errors?.client_address ? "text-red-500" : ""}>
                                Client Principal address *
                            </Label>
                            <Input
                                id="client_address"
                                name="client_address"
                                placeholder="Registered or principal corporate office..."
                                value={formData.client_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('client_address')}
                            />
                            {errors?.client_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.client_address}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Contractor details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <UserCheck className="h-5 w-5" />
                        Contractor details
                    </CardTitle>
                    <CardDescription>Enter details of the specialized contractor being engaged</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contractor_name" className={errors?.contractor_name ? "text-red-500" : ""}>
                                Contractor Name *
                            </Label>
                            <Input
                                id="contractor_name"
                                name="contractor_name"
                                placeholder="e.g. Vikas Patel"
                                value={formData.contractor_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('contractor_name')}
                            />
                            {errors?.contractor_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.contractor_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contractor_type" className={errors?.contractor_type ? "text-red-500" : ""}>
                                Contractor Type *
                            </Label>
                            <Select
                                value={formData.contractor_type || 'Individual'}
                                onValueChange={(v) => handleSelectChange('contractor_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('contractor_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                    <SelectItem value="LLP">Partnership Firm / LLP</SelectItem>
                                    <SelectItem value="Company">Private Limited Company</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.contractor_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.contractor_type}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="contractor_address" className={errors?.contractor_address ? "text-red-500" : ""}>
                                Contractor Address *
                            </Label>
                            <Input
                                id="contractor_address"
                                name="contractor_address"
                                placeholder="Contractor's residential or office address..."
                                value={formData.contractor_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('contractor_address')}
                            />
                            {errors?.contractor_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.contractor_address}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="contractor_registration_details">Registration Details (PAN, GSTIN) (Optional)</Label>
                            <Input
                                id="contractor_registration_details"
                                name="contractor_registration_details"
                                placeholder="e.g. PAN: BPPXP1234F, GSTIN: 29BPPXP1234F1Z5"
                                value={formData.contractor_registration_details || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Engagement Timelines & SOW */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Award className="h-5 w-5" />
                        Engagement Timelines & SOW
                    </CardTitle>
                    <CardDescription>Select engagement type and define deliverables and milestones</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="engagement_type" className={errors?.engagement_type ? "text-red-500" : ""}>
                                Engagement / Service Type *
                            </Label>
                            <Select
                                value={formData.engagement_type || 'Technology Services'}
                                onValueChange={(v) => handleSelectChange('engagement_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('engagement_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Technology Services">Technology Services</SelectItem>
                                    <SelectItem value="Design Services">Design Services</SelectItem>
                                    <SelectItem value="Marketing Services">Marketing Consultant</SelectItem>
                                    <SelectItem value="Legal/Financial Services">Legal / Financial Consultant</SelectItem>
                                    <SelectItem value="Other Services">Other Specialized Services</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.engagement_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.engagement_type}</p>
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
                            <Label htmlFor="commencement_date" className={errors?.commencement_date ? "text-red-500" : ""}>
                                Commencement Date *
                            </Label>
                            <Input
                                id="commencement_date"
                                name="commencement_date"
                                type="date"
                                value={formData.commencement_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('commencement_date')}
                            />
                            {errors?.commencement_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.commencement_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expiry_date" className={errors?.expiry_date ? "text-red-500" : ""}>
                                Expiry Date *
                            </Label>
                            <Input
                                id="expiry_date"
                                name="expiry_date"
                                type="date"
                                value={formData.expiry_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('expiry_date')}
                            />
                            {errors?.expiry_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.expiry_date}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="renewal_terms">Renewal Terms (Optional)</Label>
                            <Input
                                id="renewal_terms"
                                name="renewal_terms"
                                placeholder="e.g. Renewed for successive 6-month periods by mutual written consent"
                                value={formData.renewal_terms || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scope_of_services" className={errors?.scope_of_services ? "text-red-500" : ""}>
                            Scope of Services *
                        </Label>
                        <Textarea
                            id="scope_of_services"
                            name="scope_of_services"
                            placeholder="Detail technical services and project parameters..."
                            rows={3}
                            value={formData.scope_of_services || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('scope_of_services')}
                        />
                        {errors?.scope_of_services && (
                            <p className="text-xs text-red-500 font-medium">{errors.scope_of_services}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deliverables" className={errors?.deliverables ? "text-red-500" : ""}>
                            Deliverables Description *
                        </Label>
                        <Textarea
                            id="deliverables"
                            name="deliverables"
                            placeholder="Enumerate code repositories, reports, blueprints, or models..."
                            rows={3}
                            value={formData.deliverables || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('deliverables')}
                        />
                        {errors?.deliverables && (
                            <p className="text-xs text-red-500 font-medium">{errors.deliverables}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="milestones">Milestones Schedule (Optional)</Label>
                        <Textarea
                            id="milestones"
                            name="milestones"
                            placeholder="Milestone 1: Design (Month 2)\nMilestone 2: Release (Month 4)..."
                            rows={2}
                            value={formData.milestones || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="acceptance_criteria" className={errors?.acceptance_criteria ? "text-red-500" : ""}>
                            Acceptance Criteria *
                        </Label>
                        <Textarea
                            id="acceptance_criteria"
                            name="acceptance_criteria"
                            placeholder="State how the client CTO or manager signs off on the deliverables..."
                            rows={2}
                            value={formData.acceptance_criteria || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('acceptance_criteria')}
                        />
                        {errors?.acceptance_criteria && (
                            <p className="text-xs text-red-500 font-medium">{errors.acceptance_criteria}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Fees & Payments */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Professional Fees & Taxes
                    </CardTitle>
                    <CardDescription>Define professional fees, billing schedules, and GST compliance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fee_structure" className={errors?.fee_structure ? "text-red-500" : ""}>
                                Fee Structure *
                            </Label>
                            <Input
                                id="fee_structure"
                                name="fee_structure"
                                placeholder="e.g. Fixed Project Fee model, Hourly, or Retainer"
                                value={formData.fee_structure || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('fee_structure')}
                            />
                            {errors?.fee_structure && (
                                <p className="text-xs text-red-500 font-medium">{errors.fee_structure}</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                                id="gst_applicable"
                                checked={formData.gst_applicable || false}
                                onCheckedChange={(checked) => handleSelectChange('gst_applicable', !!checked)}
                            />
                            <Label htmlFor="gst_applicable" className="text-sm font-normal cursor-pointer">GST Applicable on Fees</Label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="gst_registration_number">GSTIN Registration Number (Optional)</Label>
                            <Input
                                id="gst_registration_number"
                                name="gst_registration_number"
                                placeholder="e.g. 29BPPXP1234F1Z5"
                                value={formData.gst_registration_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment_schedule" className={errors?.payment_schedule ? "text-red-500" : ""}>
                            Payment Schedule *
                        </Label>
                        <Textarea
                            id="payment_schedule"
                            name="payment_schedule"
                            placeholder="Invoice timelines, tranches, milestones, or monthly billing dates..."
                            rows={2}
                            value={formData.payment_schedule || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('payment_schedule')}
                        />
                        {errors?.payment_schedule && (
                            <p className="text-xs text-red-500 font-medium">{errors.payment_schedule}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reimbursement_policy">Reimbursement Policy (Optional)</Label>
                        <Textarea
                            id="reimbursement_policy"
                            name="reimbursement_policy"
                            placeholder="Travel, lodging, and out-of-pocket expenses policy..."
                            rows={2}
                            value={formData.reimbursement_policy || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tax_responsibility" className={errors?.tax_responsibility ? "text-red-500" : ""}>
                            Tax Responsibilities *
                        </Label>
                        <Textarea
                            id="tax_responsibility"
                            name="tax_responsibility"
                            placeholder="e.g. Contractor is responsible for income taxes. Client will deduct TDS under Section 194J."
                            rows={2}
                            value={formData.tax_responsibility || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('tax_responsibility')}
                        />
                        {errors?.tax_responsibility && (
                            <p className="text-xs text-red-500 font-medium">{errors.tax_responsibility}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Covenants & Responsibilities */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Obligations & Warranties
                    </CardTitle>
                    <CardDescription>Responsibilities of client and contractor, insurance, and liabilities</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="contractor_obligations" className={errors?.contractor_obligations ? "text-red-500" : ""}>
                            Contractor Obligations & Standards *
                        </Label>
                        <Textarea
                            id="contractor_obligations"
                            name="contractor_obligations"
                            placeholder="Professional standards, compliance with central/state laws, licenses..."
                            rows={3}
                            value={formData.contractor_obligations || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('contractor_obligations')}
                        />
                        {errors?.contractor_obligations && (
                            <p className="text-xs text-red-500 font-medium">{errors.contractor_obligations}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="client_obligations" className={errors?.client_obligations ? "text-red-500" : ""}>
                            Client Obligations *
                        </Label>
                        <Textarea
                            id="client_obligations"
                            name="client_obligations"
                            placeholder="Provide database access, review deliverables, timelines..."
                            rows={2}
                            value={formData.client_obligations || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('client_obligations')}
                        />
                        {errors?.client_obligations && (
                            <p className="text-xs text-red-500 font-medium">{errors.client_obligations}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="insurance_requirements">Insurance Requirements (Optional)</Label>
                        <Textarea
                            id="insurance_requirements"
                            name="insurance_requirements"
                            placeholder="e.g. Professional indemnity insurance details..."
                            rows={2}
                            value={formData.insurance_requirements || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limitation_of_liability" className={errors?.limitation_of_liability ? "text-red-500" : ""}>
                            Limitation of Liability *
                        </Label>
                        <Textarea
                            id="limitation_of_liability"
                            name="limitation_of_liability"
                            placeholder="Caps on claims, exclusion of consequential damages..."
                            rows={2}
                            value={formData.limitation_of_liability || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('limitation_of_liability')}
                        />
                        {errors?.limitation_of_liability && (
                            <p className="text-xs text-red-500 font-medium">{errors.limitation_of_liability}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="indemnity_clause" className={errors?.indemnity_clause ? "text-red-500" : ""}>
                            Indemnity Clauses *
                        </Label>
                        <Textarea
                            id="indemnity_clause"
                            name="indemnity_clause"
                            placeholder="Hold harmless covenants for IP breaches, gross negligence..."
                            rows={2}
                            value={formData.indemnity_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('indemnity_clause')}
                        />
                        {errors?.indemnity_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.indemnity_clause}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: IP & Security */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        IP, Confidentiality & DPDP
                    </CardTitle>
                    <CardDescription>IP assignment covenants, confidentiality, and data protection rules</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_clause" className={errors?.intellectual_property_clause ? "text-red-500" : ""}>
                            Intellectual Property Assignment *
                        </Label>
                        <Textarea
                            id="intellectual_property_clause"
                            name="intellectual_property_clause"
                            placeholder="Assignment of source code, designs, or technical document ownership..."
                            rows={2}
                            value={formData.intellectual_property_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intellectual_property_clause')}
                        />
                        {errors?.intellectual_property_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.intellectual_property_clause}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confidentiality_clause" className={errors?.confidentiality_clause ? "text-red-500" : ""}>
                            Confidentiality Obligations *
                        </Label>
                        <Textarea
                            id="confidentiality_clause"
                            name="confidentiality_clause"
                            placeholder="Definitions and limits of confidential datasets, code, plans..."
                            rows={2}
                            value={formData.confidentiality_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidentiality_clause')}
                        />
                        {errors?.confidentiality_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidentiality_clause}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data_processing">Data Processing & DPDP Act compliance (Optional)</Label>
                        <Textarea
                            id="data_processing"
                            name="data_processing"
                            placeholder="Rules regarding handling and processing of personal datasets..."
                            rows={2}
                            value={formData.data_processing || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Exits & Governance */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Termination & Governance
                    </CardTitle>
                    <CardDescription>Termination events, governing laws, and dispute resolution</CardDescription>
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
                                placeholder="Convenience, breaches, material failure triggers..."
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
                            <Label htmlFor="notice_period" className={errors?.notice_period ? "text-red-500" : ""}>
                                Notice Period *
                            </Label>
                            <Input
                                id="notice_period"
                                name="notice_period"
                                placeholder="e.g. 30 Days written notice"
                                value={formData.notice_period || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('notice_period')}
                            />
                            {errors?.notice_period && (
                                <p className="text-xs text-red-500 font-medium">{errors.notice_period}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="force_majeure" className={errors?.force_majeure ? "text-red-500" : ""}>
                                Force Majeure *
                            </Label>
                            <Input
                                id="force_majeure"
                                name="force_majeure"
                                placeholder="e.g. Acts of God, war, government bans"
                                value={formData.force_majeure || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('force_majeure')}
                            />
                            {errors?.force_majeure && (
                                <p className="text-xs text-red-500 font-medium">{errors.force_majeure}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notices" className={errors?.notices ? "text-red-500" : ""}>
                                Notice Addresses *
                            </Label>
                            <Textarea
                                id="notices"
                                name="notices"
                                placeholder="Notice delivery address coordinates and emails..."
                                rows={2}
                                value={formData.notices || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('notices')}
                            />
                            {errors?.notices && (
                                <p className="text-xs text-red-500 font-medium">{errors.notices}</p>
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
                                placeholder="Arbitration seats, courts jurisdictions, procedures..."
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

            {/* Section 8: Execution & Witnesses */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Execution Credentials
                    </CardTitle>
                    <CardDescription>Designate executants, place, and date of agreement</CardDescription>
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
                                placeholder="Designations and names of officers executing on behalf of both parties..."
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
                            <Label htmlFor="witness_details">Witness Details (Optional)</Label>
                            <Textarea
                                id="witness_details"
                                name="witness_details"
                                placeholder="Names, addresses, and details of witnesses..."
                                rows={2}
                                value={formData.witness_details || ''}
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

            {/* Section 9: Specific Setup Flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Configure specialized contractor setups</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="electronic_execution"
                                checked={formData.electronic_execution || false}
                                onCheckedChange={(checked) => handleSelectChange('electronic_execution', !!checked)}
                            />
                            <Label htmlFor="electronic_execution" className="text-sm font-normal cursor-pointer">Electronic execution permitted</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="non_solicitation"
                                checked={!!formData.non_solicitation}
                                onCheckedChange={(checked) => handleSelectChange('non_solicitation', checked ? 'Contractor shall not solicit client employees or clients for 12 months.' : '')}
                            />
                            <Label htmlFor="non_solicitation" className="text-sm font-normal cursor-pointer">Non-Solicitation covenants</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="non_compete"
                                checked={!!formData.non_compete}
                                onCheckedChange={(checked) => handleSelectChange('non_compete', checked ? 'Contractor shall not perform competing cloud services during term.' : '')}
                            />
                            <Label htmlFor="non_compete" className="text-sm font-normal cursor-pointer">Non-Compete restrictions</Label>
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

export default IndependentContractorForm;
