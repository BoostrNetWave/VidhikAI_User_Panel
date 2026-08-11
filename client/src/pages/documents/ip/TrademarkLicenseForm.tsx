import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Sparkles, Scale, UserCheck, Shield, Award, FileText, Tag, DollarSign, Store, Globe } from "lucide-react";

interface TrademarkLicenseFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const TrademarkLicenseForm: React.FC<TrademarkLicenseFormProps> = ({
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
                agreement_number: 'TML-2026/042',
                effective_date: new Date().toISOString().split('T')[0],
                commercial_purpose: 'Grant of exclusive trademark license for manufacturing, marketing, distributing, and selling premium consumer lifestyle products and apparel under the licensed brand name across India.',
                licensor: 'Acme Brand Holdings Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Landmark Towers, Bandra-Kurla Complex, Mumbai, Maharashtra 400051, India',
                licensee: 'Vanguard Retail Enterprises Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at Brigade Gateway, Rajajinagar, Bangalore, Karnataka 560055, India',
                authorized_representatives: 'Licensor: Mr. Vikram Shah (Director); Licensee: Ms. Deepal Parekh (Managing Director)',
                trademark_details: 'Registered Word Mark "NEXUS LIFE" and Formative Logo Device (Class 25 & Class 35)',
                trademark_registration_numbers: 'Trademark Registration No. 4812904 in Class 25 (Apparel) and Registration No. 5102938 in Class 35 (Retail Services)',
                pending_trademark_applications: 'Application No. 6102948 in Class 18 (Footwear & Leather Accessories)',
                licensed_goods_services: 'Apparel, Footwear, Fashion Accessories, Retail Store Operations, and E-commerce Brand Outlets',
                license_type: 'Exclusive',
                territory: 'Territory of India and SAARC Member States',
                license_duration: '5 (Five) Years from the Effective Date, renewable upon mutual consent',
                permitted_use: 'Use of the Licensed Mark exclusively on approved products, packaging, point-of-sale displays, marketing collateral, and official brand website.',
                quality_control_requirements: 'Strict compliance with Licensor Brand Manual (v3.0), mandatory sample approval prior to production batches, quarterly quality inspections, and immediate recall of non-conforming items.',
                royalty_structure: 'Royalty rate of 6% (six percent) of Quarterly Net Sales, subject to an Annual Minimum Guarantee of INR 20,00,000 (Rupees Twenty Lakhs Only).',
                payment_terms: 'Royalties payable within 30 (thirty) days following the end of each calendar quarter along with Net Sales certified statement.',
                taxes: 'All payments subject to applicable Goods and Services Tax (GST) and Tax Deducted at Source (TDS) as per Indian Income Tax Act, 1961.',
                audit_rights: 'Licensor retains right to appoint an independent Chartered Accountant to audit Licensee books and sales records once per financial year upon 14 days notice.',
                restrictions: 'No sub-licensing, assignment, alteration of trademark geometry or color codes, domain registration containing the Mark, or anti-competitive brand dilution.',
                representations_and_warranties: 'Licensor represents sole ownership of valid trademark registrations; Licensee warrants compliance with quality standards and statutory laws.',
                infringement_clause: 'Licensee shall promptly notify Licensor of any unauthorized third-party trademark infringement; Licensor retains primary right to institute enforcement actions.',
                confidentiality_clause: 'Both parties agree to preserve confidentiality of royalty figures, sales statements, brand manuals, and technical specifications.',
                termination_clause: 'Licensor may terminate upon 30 days written notice for uncured material breach, insolvency, quality failure, or non-payment of royalties.',
                post_termination_obligations: 'Licensee shall immediately cease brand usage, destroy or return point-of-sale displays, and sell off existing stock within a 90-day sell-off period.',
                notice_details: 'Licensor: legal@acmebrands.com, BKC Mumbai; Licensee: compliance@vanguardretail.in, Rajajinagar Bangalore.',
                governing_law: 'Laws of India (including Trade Marks Act, 1999 & Indian Contract Act, 1872)',
                dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 by a sole arbitrator appointed by mutual agreement.',
                arbitration_details: 'Seat and venue of arbitration at Mumbai, Maharashtra, conducted in the English language.',
                jurisdiction: 'Courts at Mumbai, Maharashtra, India',
                miscellaneous_clauses: 'Entire Agreement, Amendments in writing only, Severability, Counterparts, and Electronic Signatures under IT Act, 2000.',
                franchise_license: false,
                brand_license: true,
                software_branding: false,
                merchandise_license: true,
                international_license: false,
                co_branding: false,
                ecommerce_distribution: true,
                witnesses: '1. Mr. Rohan Kapoor (Mumbai); 2. Ms. Swati Nair (Bangalore)',
                authorized_signatories: 'Licensor: Mr. Vikram Shah (Director); Licensee: Ms. Deepal Parekh (MD)',
                execution_place: 'Mumbai',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure A: Schedule of Licensed Trademarks & Certificates; Annexure B: Brand Quality Guidelines Manual.'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
                <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Trademark License Agreement Form</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Grant trademark usage rights while preserving brand ownership, goodwill, and quality standards under Trade Marks Act, 1999.</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={fillDummyData}
                    className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border-blue-200 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-600 dark:hover:bg-slate-700 shadow-sm transition-all"
                >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Auto-Fill Demo Data
                </Button>
            </div>

            {/* Section 1: Agreement Details & Recitals */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        1. Agreement Reference & Commercial Purpose
                    </CardTitle>
                    <CardDescription>Specify reference details, effective dates, and brand licensing purpose.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="agreement_number">Agreement Reference Number (Optional)</Label>
                            <Input
                                id="agreement_number"
                                name="agreement_number"
                                value={formData.agreement_number || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. TML-2026/042"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effective_date" className="flex items-center gap-1">
                                Effective Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="effective_date"
                                name="effective_date"
                                type="date"
                                value={formData.effective_date || ''}
                                onChange={handleInputChange}
                                className={errors?.effective_date ? "border-red-500" : ""}
                            />
                            {errors?.effective_date && <p className="text-xs text-red-500">{errors.effective_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="commercial_purpose" className="flex items-center gap-1">
                            Commercial Purpose & Recitals <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="commercial_purpose"
                            name="commercial_purpose"
                            rows={3}
                            value={formData.commercial_purpose || ''}
                            onChange={handleInputChange}
                            placeholder="Describe brand licensing goals, market expansion, or franchise usage..."
                            className={errors?.commercial_purpose ? "border-red-500" : ""}
                        />
                        {errors?.commercial_purpose && <p className="text-xs text-red-500">{errors.commercial_purpose}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Parties Details */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        2. Licensor & Licensee Details
                    </CardTitle>
                    <CardDescription>Licensor (brand owner) and Licensee (permitted user) details.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="licensor" className="flex items-center gap-1">
                                Licensor Details (Brand Owner) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="licensor"
                                name="licensor"
                                rows={3}
                                value={formData.licensor || ''}
                                onChange={handleInputChange}
                                placeholder="Licensor Entity Name, Legal Status, Registered Address..."
                                className={errors?.licensor ? "border-red-500" : ""}
                            />
                            {errors?.licensor && <p className="text-xs text-red-500">{errors.licensor}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="licensee" className="flex items-center gap-1">
                                Licensee Details (Authorized User) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="licensee"
                                name="licensee"
                                rows={3}
                                value={formData.licensee || ''}
                                onChange={handleInputChange}
                                placeholder="Licensee Entity Name, Legal Status, Registered Address..."
                                className={errors?.licensee ? "border-red-500" : ""}
                            />
                            {errors?.licensee && <p className="text-xs text-red-500">{errors.licensee}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="authorized_representatives" className="flex items-center gap-1">
                            Authorized Representatives <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="authorized_representatives"
                            name="authorized_representatives"
                            value={formData.authorized_representatives || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Licensor: Mr. Vikram Shah; Licensee: Ms. Deepal Parekh"
                            className={errors?.authorized_representatives ? "border-red-500" : ""}
                        />
                        {errors?.authorized_representatives && <p className="text-xs text-red-500">{errors.authorized_representatives}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Trademark Details & License Scope */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-600" />
                        3. Licensed Trademarks & License Scope
                    </CardTitle>
                    <CardDescription>Specify marks, classes, registration numbers, duration, and territory.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="trademark_details" className="flex items-center gap-1">
                                Trademark Details <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="trademark_details"
                                name="trademark_details"
                                value={formData.trademark_details || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Word Mark NEXUS LIFE & Logo Device (Class 25 & Class 35)"
                                className={errors?.trademark_details ? "border-red-500" : ""}
                            />
                            {errors?.trademark_details && <p className="text-xs text-red-500">{errors.trademark_details}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="trademark_registration_numbers" className="flex items-center gap-1">
                                Registration Numbers <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="trademark_registration_numbers"
                                name="trademark_registration_numbers"
                                value={formData.trademark_registration_numbers || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Trademark No. 4812904 in Class 25; No. 5102938 in Class 35"
                                className={errors?.trademark_registration_numbers ? "border-red-500" : ""}
                            />
                            {errors?.trademark_registration_numbers && <p className="text-xs text-red-500">{errors.trademark_registration_numbers}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pending_trademark_applications">Pending Trademark Applications (Optional)</Label>
                            <Input
                                id="pending_trademark_applications"
                                name="pending_trademark_applications"
                                value={formData.pending_trademark_applications || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Application No. 6102948 in Class 18"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="license_type" className="flex items-center gap-1">
                                License Exclusivity Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.license_type || 'Non-Exclusive'}
                                onValueChange={(val) => handleSelectChange('license_type', val)}
                            >
                                <SelectTrigger className={errors?.license_type ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select license type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Exclusive">Exclusive License</SelectItem>
                                    <SelectItem value="Non-Exclusive">Non-Exclusive License</SelectItem>
                                    <SelectItem value="Sole">Sole License</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.license_type && <p className="text-xs text-red-500">{errors.license_type}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="licensed_goods_services" className="flex items-center gap-1">
                                Licensed Goods / Services <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="licensed_goods_services"
                                name="licensed_goods_services"
                                rows={2}
                                value={formData.licensed_goods_services || ''}
                                onChange={handleInputChange}
                                placeholder="Apparel, footwear, retail outlets..."
                                className={errors?.licensed_goods_services ? "border-red-500" : ""}
                            />
                            {errors?.licensed_goods_services && <p className="text-xs text-red-500">{errors.licensed_goods_services}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="territory" className="flex items-center gap-1">
                                Territory <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="territory"
                                name="territory"
                                value={formData.territory || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. India and SAARC Member States"
                                className={errors?.territory ? "border-red-500" : ""}
                            />
                            {errors?.territory && <p className="text-xs text-red-500">{errors.territory}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="license_duration" className="flex items-center gap-1">
                                License Duration <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="license_duration"
                                name="license_duration"
                                value={formData.license_duration || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 5 (Five) Years"
                                className={errors?.license_duration ? "border-red-500" : ""}
                            />
                            {errors?.license_duration && <p className="text-xs text-red-500">{errors.license_duration}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="permitted_use" className="flex items-center gap-1">
                                Permitted Use <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="permitted_use"
                                name="permitted_use"
                                rows={2}
                                value={formData.permitted_use || ''}
                                onChange={handleInputChange}
                                placeholder="Approved product lines, packaging, store signs, website..."
                                className={errors?.permitted_use ? "border-red-500" : ""}
                            />
                            {errors?.permitted_use && <p className="text-xs text-red-500">{errors.permitted_use}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quality_control_requirements" className="flex items-center gap-1">
                                Quality Control Standards <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="quality_control_requirements"
                                name="quality_control_requirements"
                                rows={2}
                                value={formData.quality_control_requirements || ''}
                                onChange={handleInputChange}
                                placeholder="Brand manual compliance, sample approvals, inspection rights..."
                                className={errors?.quality_control_requirements ? "border-red-500" : ""}
                            />
                            {errors?.quality_control_requirements && <p className="text-xs text-red-500">{errors.quality_control_requirements}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Royalty & Commercial Considerations */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        4. Royalty Structure & Financial Terms
                    </CardTitle>
                    <CardDescription>Royalty percentages, fixed fees, payment terms, taxes, and audit rights.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="royalty_structure" className="flex items-center gap-1">
                                Royalty Structure <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="royalty_structure"
                                name="royalty_structure"
                                rows={2}
                                value={formData.royalty_structure || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 6% of Net Sales subject to INR 20 Lakhs Annual Minimum Guarantee..."
                                className={errors?.royalty_structure ? "border-red-500" : ""}
                            />
                            {errors?.royalty_structure && <p className="text-xs text-red-500">{errors.royalty_structure}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_terms" className="flex items-center gap-1">
                                Payment Schedule <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="payment_terms"
                                name="payment_terms"
                                rows={2}
                                value={formData.payment_terms || ''}
                                onChange={handleInputChange}
                                placeholder="Quarterly within 30 days of quarter end..."
                                className={errors?.payment_terms ? "border-red-500" : ""}
                            />
                            {errors?.payment_terms && <p className="text-xs text-red-500">{errors.payment_terms}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxes" className="flex items-center gap-1">
                                Taxes & TDS <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="taxes"
                                name="taxes"
                                rows={2}
                                value={formData.taxes || ''}
                                onChange={handleInputChange}
                                placeholder="GST and TDS compliance..."
                                className={errors?.taxes ? "border-red-500" : ""}
                            />
                            {errors?.taxes && <p className="text-xs text-red-500">{errors.taxes}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="audit_rights">Audit Rights (Optional)</Label>
                        <Input
                            id="audit_rights"
                            name="audit_rights"
                            value={formData.audit_rights || ''}
                            onChange={handleInputChange}
                            placeholder="Right to audit financial records once per year upon notice..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Restrictions & Termination */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-600" />
                        5. Restrictions, Infringement & Termination
                    </CardTitle>
                    <CardDescription>Brand protection covenants, infringement procedures, and sell-off rules.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="restrictions" className="flex items-center gap-1">
                                Trademark Usage Restrictions <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="restrictions"
                                name="restrictions"
                                rows={3}
                                value={formData.restrictions || ''}
                                onChange={handleInputChange}
                                placeholder="No sub-licensing, alteration, domain registration..."
                                className={errors?.restrictions ? "border-red-500" : ""}
                            />
                            {errors?.restrictions && <p className="text-xs text-red-500">{errors.restrictions}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="infringement_clause" className="flex items-center gap-1">
                                Infringement Enforcement <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="infringement_clause"
                                name="infringement_clause"
                                rows={3}
                                value={formData.infringement_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Reporting procedures, litigation rights, damages allocation..."
                                className={errors?.infringement_clause ? "border-red-500" : ""}
                            />
                            {errors?.infringement_clause && <p className="text-xs text-red-500">{errors.infringement_clause}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="termination_clause" className="flex items-center gap-1">
                                Termination Provisions <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="termination_clause"
                                name="termination_clause"
                                rows={2}
                                value={formData.termination_clause || ''}
                                onChange={handleInputChange}
                                placeholder="Material breach, quality failure, non-payment..."
                                className={errors?.termination_clause ? "border-red-500" : ""}
                            />
                            {errors?.termination_clause && <p className="text-xs text-red-500">{errors.termination_clause}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="post_termination_obligations" className="flex items-center gap-1">
                                Post-Termination Sell-off & Obligations <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="post_termination_obligations"
                                name="post_termination_obligations"
                                rows={2}
                                value={formData.post_termination_obligations || ''}
                                onChange={handleInputChange}
                                placeholder="Ceasing brand use, inventory disposal, 90-day sell-off..."
                                className={errors?.post_termination_obligations ? "border-red-500" : ""}
                            />
                            {errors?.post_termination_obligations && <p className="text-xs text-red-500">{errors.post_termination_obligations}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Special Licensing Categories */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        6. Licensing Context Flags
                    </CardTitle>
                    <CardDescription>Toggle specific brand licensing frameworks.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="franchise_license"
                                checked={formData.franchise_license || false}
                                onCheckedChange={(checked) => handleSelectChange('franchise_license', checked)}
                            />
                            <Label htmlFor="franchise_license" className="text-sm font-normal cursor-pointer">
                                Franchise License
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="brand_license"
                                checked={formData.brand_license || false}
                                onCheckedChange={(checked) => handleSelectChange('brand_license', checked)}
                            />
                            <Label htmlFor="brand_license" className="text-sm font-normal cursor-pointer">
                                Enterprise Brand License
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="merchandise_license"
                                checked={formData.merchandise_license || false}
                                onCheckedChange={(checked) => handleSelectChange('merchandise_license', checked)}
                            />
                            <Label htmlFor="merchandise_license" className="text-sm font-normal cursor-pointer">
                                Consumer Merchandise
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <Checkbox
                                id="ecommerce_distribution"
                                checked={formData.ecommerce_distribution || false}
                                onCheckedChange={(checked) => handleSelectChange('ecommerce_distribution', checked)}
                            />
                            <Label htmlFor="ecommerce_distribution" className="text-sm font-normal cursor-pointer">
                                E-Commerce Distribution
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Legal Framework & Signatories */}
            <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                        7. Governing Law, Jurisdiction & Execution
                    </CardTitle>
                    <CardDescription>Dispute resolution, governing courts, and authorized signatories.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="governing_law" className="flex items-center gap-1">
                                Governing Law <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="governing_law"
                                name="governing_law"
                                value={formData.governing_law || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Laws of India (including Trade Marks Act, 1999)"
                                className={errors?.governing_law ? "border-red-500" : ""}
                            />
                            {errors?.governing_law && <p className="text-xs text-red-500">{errors.governing_law}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction" className="flex items-center gap-1">
                                Jurisdiction Courts <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="jurisdiction"
                                name="jurisdiction"
                                value={formData.jurisdiction || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Courts at Mumbai, Maharashtra, India"
                                className={errors?.jurisdiction ? "border-red-500" : ""}
                            />
                            {errors?.jurisdiction && <p className="text-xs text-red-500">{errors.jurisdiction}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dispute_resolution" className="flex items-center gap-1">
                                Dispute Resolution <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="dispute_resolution"
                                name="dispute_resolution"
                                rows={2}
                                value={formData.dispute_resolution || ''}
                                onChange={handleInputChange}
                                placeholder="Arbitration under the Arbitration and Conciliation Act, 1996..."
                                className={errors?.dispute_resolution ? "border-red-500" : ""}
                            />
                            {errors?.dispute_resolution && <p className="text-xs text-red-500">{errors.dispute_resolution}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="miscellaneous_clauses" className="flex items-center gap-1">
                                Miscellaneous & Boilerplate <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="miscellaneous_clauses"
                                name="miscellaneous_clauses"
                                rows={2}
                                value={formData.miscellaneous_clauses || ''}
                                onChange={handleInputChange}
                                placeholder="Entire Agreement, Amendments, Severability..."
                                className={errors?.miscellaneous_clauses ? "border-red-500" : ""}
                            />
                            {errors?.miscellaneous_clauses && <p className="text-xs text-red-500">{errors.miscellaneous_clauses}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorized_signatories" className="flex items-center gap-1">
                                Authorized Signatories <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="authorized_signatories"
                                name="authorized_signatories"
                                value={formData.authorized_signatories || ''}
                                onChange={handleInputChange}
                                placeholder="Licensor: Mr. Vikram Shah; Licensee: Ms. Deepal Parekh"
                                className={errors?.authorized_signatories ? "border-red-500" : ""}
                            />
                            {errors?.authorized_signatories && <p className="text-xs text-red-500">{errors.authorized_signatories}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="execution_place" className="flex items-center gap-1">
                                Execution Place <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="execution_place"
                                name="execution_place"
                                value={formData.execution_place || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Mumbai"
                                className={errors?.execution_place ? "border-red-500" : ""}
                            />
                            {errors?.execution_place && <p className="text-xs text-red-500">{errors.execution_place}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="execution_date" className="flex items-center gap-1">
                                Execution Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="execution_date"
                                name="execution_date"
                                type="date"
                                value={formData.execution_date || ''}
                                onChange={handleInputChange}
                                className={errors?.execution_date ? "border-red-500" : ""}
                            />
                            {errors?.execution_date && <p className="text-xs text-red-500">{errors.execution_date}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TrademarkLicenseForm;
