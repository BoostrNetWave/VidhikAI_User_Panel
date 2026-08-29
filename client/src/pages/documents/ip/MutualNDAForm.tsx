import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, Lock } from "lucide-react";

interface MutualNDAFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const MutualNDAForm: React.FC<MutualNDAFormProps> = ({
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
                agreement_number: 'APEX/MNDA/2026/049',
                effective_date: new Date().toISOString().split('T')[0],
                party_a: 'Apex AI Software Technologies Private Limited, a company incorporated under the laws of India, with its registered office at Block A, Outer Ring Road, Bangalore 560103',
                party_b: 'Vertex Innovations Private Limited, a company incorporated under the laws of India, with its registered office at Tech Park Road, Sector 5, Pune 411001',
                authorized_representatives: 'Apex AI: Mr. Aniket Sen (Director); Vertex Innovations: Mr. Rajesh Pillai (VP Engineering)',
                business_purpose: 'Evaluating and discussing a potential joint technological integration, software licensing partnership, and software API development collaboration between the parties.',
                confidential_information_definition: 'Confidential Information shall mean all non-public, proprietary, or trade secret information disclosed by either party (as Disclosing Party) to the other party (as Receiving Party), whether in writing, oral, visual, or digital formats.',
                confidential_information_categories: '1. Technical data, source codes, algorithms, DB schemas, and system architectures.\n2. Business plans, client lists, pricing formulas, and product roadmaps.\n3. Personal data of employees, candidates, and customers processed by the parties.',
                exclusions: '1. Information already in the public domain at the time of disclosure.\n2. Information independently developed by the receiving party without reference to disclosing party materials.\n3. Disclosures required under statutory mandates or court orders.',
                reciprocal_confidentiality_obligations: 'Each party shall maintain strict confidentiality, limit access only to need-to-know representatives, implement reasonable security safeguards, and return/destroy all copies upon request or termination.',
                permitted_disclosures: 'Disclosures to affiliates, legal advisors, auditors, and key employees who have signed confidentiality obligations at least as restrictive as this agreement.',
                intellectual_property_clause: 'All intellectual property, proprietary tools, and source code disclosed under this agreement shall remain the exclusive property of the respective disclosing party, and no license or transfer is granted hereunder.',
                data_privacy_clause: 'The parties agree to process personal data strictly in compliance with the Digital Personal Data Protection (DPDP) Act, 2023, implementing technical and organizational measures to prevent data breaches.',
                term_commencement: 'Effective Date of this Agreement',
                agreement_duration: '3 Years from the date of disclosure of the respective Confidential Information',
                confidentiality_survival_period: '5 Years post the termination of this Agreement',
                remedies: 'The disclosing party shall be entitled to seek injunctive relief, specific performance, and monetary damages in the event of any proven breach.',
                limitation_of_liability: 'Neither party shall be liable for indirect, incidental, or consequential damages, and maximum aggregate liability for proven breaches shall be capped at INR 10,00,000.',
                termination_clause: 'This agreement may be terminated by either party upon giving 30 days prior written notice to the other party.',
                notice_details: 'Apex AI: legal@apexai.com, Block A, Outer Ring Road, Bangalore; Vertex Innovations: legal@vertex.com, Sector 5, Pune.',
                governing_law: 'Laws of India',
                dispute_resolution: 'Amicable settlement failing which dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.',
                arbitration_details: 'Sole arbitrator appointed mutually, proceedings conducted in English language, seat of arbitration at Bangalore.',
                jurisdiction: 'Courts in Bangalore, Karnataka',
                miscellaneous_clauses: 'This agreement constitutes the entire understanding, is severable, cannot be assigned without consent, and may be executed in counterparts.',
                joint_venture: false,
                merger_acquisition: false,
                technology_collaboration: true,
                research_collaboration: false,
                investor_discussions: false,
                vendor_evaluation: false,
                cross_border_transaction: false,
                witnesses: '1. Mr. Dinesh Kumar (Bangalore)\n2. Ms. Sarah Mathews (Pune)',
                authorized_signatories: 'Signed for Apex AI: Mr. Aniket Sen; Signed for Vertex Innovations: Mr. Rajesh Pillai',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure A: Technical Architecture Scope Details'
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

            {/* Section 1: Agreement Profile & Parties */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Agreement Profile & Parties
                    </CardTitle>
                    <CardDescription>Configure Mutual NDA reference, date, and Party legal details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Label htmlFor="agreement_number">Agreement Reference Number (Optional)</Label>
                            <Input
                                id="agreement_number"
                                name="agreement_number"
                                placeholder="e.g. APEX/MNDA/2026/049"
                                value={formData.agreement_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_representatives" className={errors?.authorized_representatives ? "text-red-500" : ""}>
                                Authorized Representatives *
                            </Label>
                            <Input
                                id="authorized_representatives"
                                name="authorized_representatives"
                                placeholder="e.g. Party A: Mr. Aniket Sen (Director); Party B: Mr. Rajesh Pillai (VP)"
                                value={formData.authorized_representatives || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_representatives')}
                            />
                            {errors?.authorized_representatives && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_representatives}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="party_a" className={errors?.party_a ? "text-red-500" : ""}>
                                Party A Legal Details *
                            </Label>
                            <Textarea
                                id="party_a"
                                name="party_a"
                                placeholder="Full legal name, status, and registered office of Party A..."
                                rows={2}
                                value={formData.party_a || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('party_a')}
                            />
                            {errors?.party_a && (
                                <p className="text-xs text-red-500 font-medium">{errors.party_a}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="party_b" className={errors?.party_b ? "text-red-500" : ""}>
                                Party B Legal Details *
                            </Label>
                            <Textarea
                                id="party_b"
                                name="party_b"
                                placeholder="Full legal name, status, and registered office of Party B..."
                                rows={2}
                                value={formData.party_b || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('party_b')}
                            />
                            {errors?.party_b && (
                                <p className="text-xs text-red-500 font-medium">{errors.party_b}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Recitals & Confidentiality Definition */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Lock className="h-5 w-5" />
                        Business Purpose & Reciprocal Scope
                    </CardTitle>
                    <CardDescription>State the context of two-way disclosure and definitions of protected data</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="business_purpose" className={errors?.business_purpose ? "text-red-500" : ""}>
                            Business Purpose *
                        </Label>
                        <Textarea
                            id="business_purpose"
                            name="business_purpose"
                            placeholder="e.g. Evaluating and discussing a potential technological integration and software API development collaboration..."
                            rows={2}
                            value={formData.business_purpose || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('business_purpose')}
                        />
                        {errors?.business_purpose && (
                            <p className="text-xs text-red-500 font-medium">{errors.business_purpose}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confidential_information_definition" className={errors?.confidential_information_definition ? "text-red-500" : ""}>
                            Definition of Confidential Information *
                        </Label>
                        <Textarea
                            id="confidential_information_definition"
                            name="confidential_information_definition"
                            placeholder="Reciprocal proprietary information definition..."
                            rows={3}
                            value={formData.confidential_information_definition || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidential_information_definition')}
                        />
                        {errors?.confidential_information_definition && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidential_information_definition}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confidential_information_categories" className={errors?.confidential_information_categories ? "text-red-500" : ""}>
                            Protected Information Categories *
                        </Label>
                        <Textarea
                            id="confidential_information_categories"
                            name="confidential_information_categories"
                            placeholder="Technical, Financial, Customer, codebase schemas..."
                            rows={3}
                            value={formData.confidential_information_categories || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidential_information_categories')}
                        />
                        {errors?.confidential_information_categories && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidential_information_categories}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="exclusions" className={errors?.exclusions ? "text-red-500" : ""}>
                            Exclusions from Confidential Information *
                        </Label>
                        <Textarea
                            id="exclusions"
                            name="exclusions"
                            placeholder="Public info, independently developed, court ordered..."
                            rows={2}
                            value={formData.exclusions || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('exclusions')}
                        />
                        {errors?.exclusions && (
                            <p className="text-xs text-red-500 font-medium">{errors.exclusions}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Reciprocal Obligations & Intellectual Property */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Reciprocal Obligations & IP Covenants
                    </CardTitle>
                    <CardDescription>Specify two-way confidentiality actions and proprietary rights</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reciprocal_confidentiality_obligations" className={errors?.reciprocal_confidentiality_obligations ? "text-red-500" : ""}>
                            Reciprocal Confidentiality Obligations *
                        </Label>
                        <Textarea
                            id="reciprocal_confidentiality_obligations"
                            name="reciprocal_confidentiality_obligations"
                            placeholder="Reasonable security measures, restricted use, wipe processes..."
                            rows={3}
                            value={formData.reciprocal_confidentiality_obligations || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('reciprocal_confidentiality_obligations')}
                        />
                        {errors?.reciprocal_confidentiality_obligations && (
                            <p className="text-xs text-red-500 font-medium">{errors.reciprocal_confidentiality_obligations}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="permitted_disclosures" className={errors?.permitted_disclosures ? "text-red-500" : ""}>
                            Permitted Disclosures *
                        </Label>
                        <Textarea
                            id="permitted_disclosures"
                            name="permitted_disclosures"
                            placeholder="Affiliates, legal advisors, auditors..."
                            rows={2}
                            value={formData.permitted_disclosures || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('permitted_disclosures')}
                        />
                        {errors?.permitted_disclosures && (
                            <p className="text-xs text-red-500 font-medium">{errors.permitted_disclosures}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_clause" className={errors?.intellectual_property_clause ? "text-red-500" : ""}>
                            Intellectual Property Covenants *
                        </Label>
                        <Textarea
                            id="intellectual_property_clause"
                            name="intellectual_property_clause"
                            placeholder="Ownership preservation of disclosed assets, no license granted..."
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
                        <Label htmlFor="data_privacy_clause">Data Privacy Covenants (Optional)</Label>
                        <Textarea
                            id="data_privacy_clause"
                            name="data_privacy_clause"
                            placeholder="DPDP Act 2023 compliance specifications..."
                            rows={2}
                            value={formData.data_privacy_clause || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Term, Remedies & Termination */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Timelines, Remedies & Termination
                    </CardTitle>
                    <CardDescription>Set term duration, survivals, breach outcomes, and notices</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="term_commencement" className={errors?.term_commencement ? "text-red-500" : ""}>
                                Commencement Event *
                            </Label>
                            <Input
                                id="term_commencement"
                                name="term_commencement"
                                placeholder="e.g. Effective Date of this Agreement"
                                value={formData.term_commencement || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('term_commencement')}
                            />
                            {errors?.term_commencement && (
                                <p className="text-xs text-red-500 font-medium">{errors.term_commencement}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agreement_duration" className={errors?.agreement_duration ? "text-red-500" : ""}>
                                Agreement Duration *
                            </Label>
                            <Input
                                id="agreement_duration"
                                name="agreement_duration"
                                placeholder="e.g. 3 Years from disclosure date"
                                value={formData.agreement_duration || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('agreement_duration')}
                            />
                            {errors?.agreement_duration && (
                                <p className="text-xs text-red-500 font-medium">{errors.agreement_duration}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confidentiality_survival_period" className={errors?.confidentiality_survival_period ? "text-red-500" : ""}>
                                Post-Term Survival *
                            </Label>
                            <Input
                                id="confidentiality_survival_period"
                                name="confidentiality_survival_period"
                                placeholder="e.g. 5 Years post termination"
                                value={formData.confidentiality_survival_period || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('confidentiality_survival_period')}
                            />
                            {errors?.confidentiality_survival_period && (
                                <p className="text-xs text-red-500 font-medium">{errors.confidentiality_survival_period}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="remedies" className={errors?.remedies ? "text-red-500" : ""}>
                            Breach Remedies *
                        </Label>
                        <Textarea
                            id="remedies"
                            name="remedies"
                            placeholder="e.g. Injunctive relief, specific performance, and damages..."
                            rows={2}
                            value={formData.remedies || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('remedies')}
                        />
                        {errors?.remedies && (
                            <p className="text-xs text-red-500 font-medium">{errors.remedies}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limitation_of_liability">Limitation of Liability (Optional)</Label>
                        <Textarea
                            id="limitation_of_liability"
                            name="limitation_of_liability"
                            placeholder="Capping liability or exclusion of indirect damages..."
                            rows={2}
                            value={formData.limitation_of_liability || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="termination_clause" className={errors?.termination_clause ? "text-red-500" : ""}>
                            Termination Clause *
                        </Label>
                        <Textarea
                            id="termination_clause"
                            name="termination_clause"
                            placeholder="30 days written notice to terminate..."
                            rows={2}
                            value={formData.termination_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('termination_clause')}
                        />
                        {errors?.termination_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.termination_clause}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notice_details" className={errors?.notice_details ? "text-red-500" : ""}>
                            Notice Address Details *
                        </Label>
                        <Textarea
                            id="notice_details"
                            name="notice_details"
                            placeholder="Emails and physical addresses where notices should be sent..."
                            rows={2}
                            value={formData.notice_details || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('notice_details')}
                        />
                        {errors?.notice_details && (
                            <p className="text-xs text-red-500 font-medium">{errors.notice_details}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Governing Law & Dispute Resolution */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Jurisdiction & Dispute Arbitration
                    </CardTitle>
                    <CardDescription>Determine governing law, arbitration codes, and court seats</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction" className={errors?.jurisdiction ? "text-red-500" : ""}>
                                Court Jurisdiction *
                            </Label>
                            <Input
                                id="jurisdiction"
                                name="jurisdiction"
                                placeholder="e.g. Courts in Bangalore, Karnataka"
                                value={formData.jurisdiction || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('jurisdiction')}
                            />
                            {errors?.jurisdiction && (
                                <p className="text-xs text-red-500 font-medium">{errors.jurisdiction}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dispute_resolution" className={errors?.dispute_resolution ? "text-red-500" : ""}>
                                Dispute Resolution Procedure *
                            </Label>
                            <Textarea
                                id="dispute_resolution"
                                name="dispute_resolution"
                                placeholder="Details on amicable settlement, mediation, or arbitration tracks..."
                                rows={2}
                                value={formData.dispute_resolution || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('dispute_resolution')}
                            />
                            {errors?.dispute_resolution && (
                                <p className="text-xs text-red-500 font-medium">{errors.dispute_resolution}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="arbitration_details">Arbitration Details (Optional)</Label>
                            <Textarea
                                id="arbitration_details"
                                name="arbitration_details"
                                placeholder="Details regarding number of arbitrators, language, seat, and venue..."
                                rows={2}
                                value={formData.arbitration_details || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Exits & Execution Coordinates */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Execution Coordinates
                    </CardTitle>
                    <CardDescription>Specify signatories, execution places, dates, and annexures</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatories" className={errors?.authorized_signatories ? "text-red-500" : ""}>
                                Authorized Signatories Details *
                            </Label>
                            <Textarea
                                id="authorized_signatories"
                                name="authorized_signatories"
                                placeholder="e.g. Signed for Party A: Mr. Aniket Sen; Signed for Party B: Mr. Rajesh Pillai"
                                rows={2}
                                value={formData.authorized_signatories || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatories')}
                            />
                            {errors?.authorized_signatories && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatories}</p>
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="miscellaneous_clauses" className={errors?.miscellaneous_clauses ? "text-red-500" : ""}>
                                Miscellaneous Clauses *
                            </Label>
                            <Textarea
                                id="miscellaneous_clauses"
                                name="miscellaneous_clauses"
                                placeholder="Entire agreement, severability, waiver, amendments..."
                                rows={2}
                                value={formData.miscellaneous_clauses || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('miscellaneous_clauses')}
                            />
                            {errors?.miscellaneous_clauses && (
                                <p className="text-xs text-red-500 font-medium">{errors.miscellaneous_clauses}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="witnesses">Witness Details (Optional)</Label>
                            <Textarea
                                id="witnesses"
                                name="witnesses"
                                placeholder="Names and addresses of signing witnesses..."
                                rows={2}
                                value={formData.witnesses || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="annexures">Annexures (Optional)</Label>
                            <Input
                                id="annexures"
                                name="annexures"
                                placeholder="e.g. Annexure A: Technical Scope"
                                value={formData.annexures || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Configuration Setup Flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific listed, mutual or cross-border options</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="joint_venture"
                                checked={formData.joint_venture || false}
                                onCheckedChange={(checked) => handleSelectChange('joint_venture', !!checked)}
                            />
                            <Label htmlFor="joint_venture" className="text-sm font-normal cursor-pointer">Joint Venture Discussions</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="merger_acquisition"
                                checked={formData.merger_acquisition || false}
                                onCheckedChange={(checked) => handleSelectChange('merger_acquisition', !!checked)}
                            />
                            <Label htmlFor="merger_acquisition" className="text-sm font-normal cursor-pointer">M&A Due Diligence</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="technology_collaboration"
                                checked={formData.technology_collaboration || false}
                                onCheckedChange={(checked) => handleSelectChange('technology_collaboration', !!checked)}
                            />
                            <Label htmlFor="technology_collaboration" className="text-sm font-normal cursor-pointer">Technology Collaboration</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="research_collaboration"
                                checked={formData.research_collaboration || false}
                                onCheckedChange={(checked) => handleSelectChange('research_collaboration', !!checked)}
                            />
                            <Label htmlFor="research_collaboration" className="text-sm font-normal cursor-pointer">Research Collaboration</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="investor_discussions"
                                checked={formData.investor_discussions || false}
                                onCheckedChange={(checked) => handleSelectChange('investor_discussions', !!checked)}
                            />
                            <Label htmlFor="investor_discussions" className="text-sm font-normal cursor-pointer">Investor Discussions</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="vendor_evaluation"
                                checked={formData.vendor_evaluation || false}
                                onCheckedChange={(checked) => handleSelectChange('vendor_evaluation', !!checked)}
                            />
                            <Label htmlFor="vendor_evaluation" className="text-sm font-normal cursor-pointer">Vendor Evaluation</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="cross_border_transaction"
                                checked={formData.cross_border_transaction || false}
                                onCheckedChange={(checked) => handleSelectChange('cross_border_transaction', !!checked)}
                            />
                            <Label htmlFor="cross_border_transaction" className="text-sm font-normal cursor-pointer">Cross-Border Transaction</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MutualNDAForm;
