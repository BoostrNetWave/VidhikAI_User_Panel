import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface CodeOfConductFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const CodeOfConductForm: React.FC<CodeOfConductFormProps> = ({
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
                document_version: '2.0',
                effective_date: new Date().toISOString().split('T')[0],
                approved_by: 'Board of Directors & Chief Compliance Officer',
                policy_owner: 'Compliance & Ethics Department',
                review_cycle: 'Annually',
                company_values: '1. Integrity: We execute our tasks with honesty and transparency.\n2. Respect: We value diversity and treat all stakeholders with dignity.\n3. Accountability: We take responsibility for our actions and code outputs.',
                applicability: 'All full-time employees, directors, officers, interns, independent contractors, and consultants engaged by the company.',
                definitions: 'Covered Persons: All employees, officers, directors, and external contractors.\nCompany Assets: All physical workspaces, laptops, network systems, proprietary software codes, and repositories.',
                professional_conduct_policy: 'Covered persons must act with high professionalism, avoid conflict of interest, perform tasks diligently, and represent the organization ethically in all public forums.',
                workplace_behaviour_policy: 'Commitment to a safe, productive, and collaborative work environment. Harassment, verbal abuse, and workplace violence are strictly prohibited.',
                equal_opportunity_policy: 'Providing equal employment opportunities to all candidates and employees without regard to race, gender, religion, sexual orientation, disability, or age.',
                anti_harassment_policy: 'Zero-tolerance policy for harassment, including sexual harassment (POSH compliance) and bullying. Mandatory POSH training for all employees.',
                legal_compliance_policy: 'Compliance with all central, state, and local laws, including labor standards, environmental codes, and tax obligations.',
                conflict_of_interest_policy: 'Employees must disclose any personal, financial, or familial relationships that may conflict with the performance of company duties.',
                gifts_hospitality_policy: 'No employee may accept gifts, hospitality, or favors exceeding INR 2,000 from clients, vendors, or competitors without compliance sign-off.',
                anti_bribery_policy: 'Strict compliance with the Prevention of Corruption Act 1988. Giving or receiving bribes, kickbacks, or facilitation payments is completely banned.',
                confidentiality_policy: 'Employees must protect proprietary codebase, database schemas, financial reports, customer datasets, and business plans during and after employment.',
                information_security_policy: 'Compulsory password updates every 90 days. Use of corporate VPN on public networks. Strictly no sharing of login credentials.',
                intellectual_property_policy: 'All source code, designs, UI elements, documentation, patents, and innovations developed during work vest exclusively with the Company.',
                company_property_policy: 'Corporate laptops, licenses, and networks must be used only for authorized business tasks and handled with care.',
                social_media_policy: 'Employees must not post proprietary information, confidential code, or make defamatory statements about the company on social media.',
                data_privacy_policy: 'Strict processing guidelines for customer and employee personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
                reporting_misconduct_policy: 'Report any violation of the Code immediately to the Compliance Officer or via the Whistleblower hotline (compliance@apexai.com).',
                whistleblower_policy: 'Anonymous reporting channels are provided. The company guarantees absolute protection against retaliation or adverse employment actions for good-faith reports.',
                disciplinary_policy: 'Progressive disciplinary procedures: Written warnings, suspension, and immediate termination for gross misconduct, data theft, or corruption.',
                acknowledgment_text: 'I acknowledge that I have received, read, and understood the Apex AI Code of Conduct, and I agree to comply with all its rules and ethical guidelines.',
                industry_type: 'Information Technology',
                listed_company: true,
                global_operations: false,
                government_contractor: false,
                authorized_signatory: 'Mr. Aniket Sen (Chief Compliance Officer)',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                additional_policies: 'This code overrides all previous ethical policies and employee booklets.'
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

            {/* Section 1: Company Profile & Controls */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Company & Control Details
                    </CardTitle>
                    <CardDescription>Enter company details, version, and document control properties</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name" className={errors?.company_name ? "text-red-500" : ""}>
                                Company Legal Name *
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
                            <Label htmlFor="document_version" className={errors?.document_version ? "text-red-500" : ""}>
                                Document Version *
                            </Label>
                            <Input
                                id="document_version"
                                name="document_version"
                                placeholder="e.g. 2.0"
                                value={formData.document_version || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('document_version')}
                            />
                            {errors?.document_version && (
                                <p className="text-xs text-red-500 font-medium">{errors.document_version}</p>
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
                            <Label htmlFor="approved_by" className={errors?.approved_by ? "text-red-500" : ""}>
                                Approved By *
                            </Label>
                            <Input
                                id="approved_by"
                                name="approved_by"
                                placeholder="e.g. Board of Directors & CHRO"
                                value={formData.approved_by || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('approved_by')}
                            />
                            {errors?.approved_by && (
                                <p className="text-xs text-red-500 font-medium">{errors.approved_by}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="policy_owner" className={errors?.policy_owner ? "text-red-500" : ""}>
                                Policy Owner *
                            </Label>
                            <Input
                                id="policy_owner"
                                name="policy_owner"
                                placeholder="Compliance & Ethics Department"
                                value={formData.policy_owner || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('policy_owner')}
                            />
                            {errors?.policy_owner && (
                                <p className="text-xs text-red-500 font-medium">{errors.policy_owner}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="review_cycle" className={errors?.review_cycle ? "text-red-500" : ""}>
                                Review Cycle *
                            </Label>
                            <Input
                                id="review_cycle"
                                name="review_cycle"
                                placeholder="e.g. Annually, Bi-annually"
                                value={formData.review_cycle || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('review_cycle')}
                            />
                            {errors?.review_cycle && (
                                <p className="text-xs text-red-500 font-medium">{errors.review_cycle}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="industry_type">Industry Type</Label>
                            <Input
                                id="industry_type"
                                name="industry_type"
                                placeholder="e.g. Information Technology"
                                value={formData.industry_type || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Values & Scope */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        Company Values & Applicability
                    </CardTitle>
                    <CardDescription>Define organization values, coverage, and terms</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company_values" className={errors?.company_values ? "text-red-500" : ""}>
                            Company Core Values *
                        </Label>
                        <Textarea
                            id="company_values"
                            name="company_values"
                            placeholder="Integrity, respect, accountability..."
                            rows={3}
                            value={formData.company_values || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('company_values')}
                        />
                        {errors?.company_values && (
                            <p className="text-xs text-red-500 font-medium">{errors.company_values}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="applicability" className={errors?.applicability ? "text-red-500" : ""}>
                            Applicability Covenants *
                        </Label>
                        <Textarea
                            id="applicability"
                            name="applicability"
                            placeholder="List all covered persons (employees, directors, contractors)..."
                            rows={2}
                            value={formData.applicability || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('applicability')}
                        />
                        {errors?.applicability && (
                            <p className="text-xs text-red-500 font-medium">{errors.applicability}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="definitions">Key Definitions (Optional)</Label>
                        <Textarea
                            id="definitions"
                            name="definitions"
                            placeholder="Define Covered Persons, Company Assets, etc..."
                            rows={2}
                            value={formData.definitions || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Professional & Workplace Behavior */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Award className="h-5 w-5" />
                        Professional & Workplace Behavior
                    </CardTitle>
                    <CardDescription>Ethics, anti-discrimination, equal opportunities and harassment rules</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="professional_conduct_policy" className={errors?.professional_conduct_policy ? "text-red-500" : ""}>
                            Professional Conduct Covenants *
                        </Label>
                        <Textarea
                            id="professional_conduct_policy"
                            name="professional_conduct_policy"
                            placeholder="Duties of diligence, honesty, avoiding conflicts..."
                            rows={3}
                            value={formData.professional_conduct_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('professional_conduct_policy')}
                        />
                        {errors?.professional_conduct_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.professional_conduct_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="workplace_behaviour_policy" className={errors?.workplace_behaviour_policy ? "text-red-500" : ""}>
                            Workplace Behaviour Policy *
                        </Label>
                        <Textarea
                            id="workplace_behaviour_policy"
                            name="workplace_behaviour_policy"
                            placeholder="Safe office behavior, anti-violence, collaboration rules..."
                            rows={2}
                            value={formData.workplace_behaviour_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('workplace_behaviour_policy')}
                        />
                        {errors?.workplace_behaviour_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.workplace_behaviour_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="equal_opportunity_policy" className={errors?.equal_opportunity_policy ? "text-red-500" : ""}>
                            Equal Opportunity & Non-Discrimination *
                        </Label>
                        <Textarea
                            id="equal_opportunity_policy"
                            name="equal_opportunity_policy"
                            placeholder="Diversity commitments, non-discrimination on race, gender, disability..."
                            rows={2}
                            value={formData.equal_opportunity_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('equal_opportunity_policy')}
                        />
                        {errors?.equal_opportunity_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.equal_opportunity_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="anti_harassment_policy" className={errors?.anti_harassment_policy ? "text-red-500" : ""}>
                            Anti-Harassment & Bullying *
                        </Label>
                        <Textarea
                            id="anti_harassment_policy"
                            name="anti_harassment_policy"
                            placeholder="POSH Act compliance, bullying prohibitions, investigation details..."
                            rows={2}
                            value={formData.anti_harassment_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('anti_harassment_policy')}
                        />
                        {errors?.anti_harassment_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.anti_harassment_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="legal_compliance_policy" className={errors?.legal_compliance_policy ? "text-red-500" : ""}>
                            Legal & Regulatory Compliance Obligations *
                        </Label>
                        <Textarea
                            id="legal_compliance_policy"
                            name="legal_compliance_policy"
                            placeholder="Compliance with labor codes, tax standards, state-specific shops laws..."
                            rows={2}
                            value={formData.legal_compliance_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('legal_compliance_policy')}
                        />
                        {errors?.legal_compliance_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.legal_compliance_policy}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Conflict of Interest & Anti-Bribery */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Conflicts, Gifts & Anti-Corruption
                    </CardTitle>
                    <CardDescription>Disclose conflicts, gift limitations, and anti-bribery standards</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="conflict_of_interest_policy" className={errors?.conflict_of_interest_policy ? "text-red-500" : ""}>
                            Conflict of Interest Policy *
                        </Label>
                        <Textarea
                            id="conflict_of_interest_policy"
                            name="conflict_of_interest_policy"
                            placeholder="Guidelines on disclosing financial or familial conflicting interests..."
                            rows={2}
                            value={formData.conflict_of_interest_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('conflict_of_interest_policy')}
                        />
                        {errors?.conflict_of_interest_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.conflict_of_interest_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gifts_hospitality_policy" className={errors?.gifts_hospitality_policy ? "text-red-500" : ""}>
                            Gifts & Hospitality policy *
                        </Label>
                        <Textarea
                            id="gifts_hospitality_policy"
                            name="gifts_hospitality_policy"
                            placeholder="Strict limits on gift valuations (e.g. max INR 2,000)..."
                            rows={2}
                            value={formData.gifts_hospitality_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('gifts_hospitality_policy')}
                        />
                        {errors?.gifts_hospitality_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.gifts_hospitality_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="anti_bribery_policy" className={errors?.anti_bribery_policy ? "text-red-500" : ""}>
                            Anti-Bribery & Corruption Covenants *
                        </Label>
                        <Textarea
                            id="anti_bribery_policy"
                            name="anti_bribery_policy"
                            placeholder="Compliance under the Prevention of Corruption Act 1988..."
                            rows={2}
                            value={formData.anti_bribery_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('anti_bribery_policy')}
                        />
                        {errors?.anti_bribery_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.anti_bribery_policy}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Data Security & Intellectual Property */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Assets, Confidentiality & DPDP
                    </CardTitle>
                    <CardDescription>Intellectual property assignment, IT usage, and personal data rules</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confidentiality_policy" className={errors?.confidentiality_policy ? "text-red-500" : ""}>
                            Confidentiality Obligations *
                        </Label>
                        <Textarea
                            id="confidentiality_policy"
                            name="confidentiality_policy"
                            placeholder="Protection of source codes, database logins, client portfolios..."
                            rows={2}
                            value={formData.confidentiality_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidentiality_policy')}
                        />
                        {errors?.confidentiality_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidentiality_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="information_security_policy" className={errors?.information_security_policy ? "text-red-500" : ""}>
                            Information Security & IT usage *
                        </Label>
                        <Textarea
                            id="information_security_policy"
                            name="information_security_policy"
                            placeholder="VPN rules, password rotation schedules, device allocations..."
                            rows={2}
                            value={formData.information_security_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('information_security_policy')}
                        />
                        {errors?.information_security_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.information_security_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_policy" className={errors?.intellectual_property_policy ? "text-red-500" : ""}>
                            Intellectual Property Policy *
                        </Label>
                        <Textarea
                            id="intellectual_property_policy"
                            name="intellectual_property_policy"
                            placeholder="Immediate vesting of all source codes, patent designs created during employment..."
                            rows={2}
                            value={formData.intellectual_property_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intellectual_property_policy')}
                        />
                        {errors?.intellectual_property_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.intellectual_property_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company_property_policy" className={errors?.company_property_policy ? "text-red-500" : ""}>
                            Company Property Usage *
                        </Label>
                        <Textarea
                            id="company_property_policy"
                            name="company_property_policy"
                            placeholder="Care and handling of company laptops, workspaces, networks..."
                            rows={2}
                            value={formData.company_property_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('company_property_policy')}
                        />
                        {errors?.company_property_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.company_property_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data_privacy_policy" className={errors?.data_privacy_policy ? "text-red-500" : ""}>
                            Data Privacy & DPDP compliance *
                        </Label>
                        <Textarea
                            id="data_privacy_policy"
                            name="data_privacy_policy"
                            placeholder="Rules regarding handling of personal data under the DPDP Act 2023..."
                            rows={2}
                            value={formData.data_privacy_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('data_privacy_policy')}
                        />
                        {errors?.data_privacy_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.data_privacy_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="social_media_policy">Social Media Covenants (Optional)</Label>
                        <Textarea
                            id="social_media_policy"
                            name="social_media_policy"
                            placeholder="Prohibition on sharing internal codes or comments on public platforms..."
                            rows={2}
                            value={formData.social_media_policy || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Exits & Governance */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Grievances & Enforcement
                    </CardTitle>
                    <CardDescription>Misconduct reporting, whistleblowers, and disciplinary structures</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reporting_misconduct_policy" className={errors?.reporting_misconduct_policy ? "text-red-500" : ""}>
                            Reporting Misconduct Procedures *
                        </Label>
                        <Textarea
                            id="reporting_misconduct_policy"
                            name="reporting_misconduct_policy"
                            placeholder="How and to whom employees report violations..."
                            rows={2}
                            value={formData.reporting_misconduct_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('reporting_misconduct_policy')}
                        />
                        {errors?.reporting_misconduct_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.reporting_misconduct_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whistleblower_policy">Whistleblower protection policy (Optional)</Label>
                        <Textarea
                            id="whistleblower_policy"
                            name="whistleblower_policy"
                            placeholder="Anonymous submission rules, protection against retaliation..."
                            rows={2}
                            value={formData.whistleblower_policy || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="disciplinary_policy" className={errors?.disciplinary_policy ? "text-red-500" : ""}>
                            Disciplinary Actions Policy *
                        </Label>
                        <Textarea
                            id="disciplinary_policy"
                            name="disciplinary_policy"
                            placeholder="Warnings, suspension, termination parameters..."
                            rows={2}
                            value={formData.disciplinary_policy || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('disciplinary_policy')}
                        />
                        {errors?.disciplinary_policy && (
                            <p className="text-xs text-red-500 font-medium">{errors.disciplinary_policy}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="acknowledgment_text" className={errors?.acknowledgment_text ? "text-red-500" : ""}>
                            Acknowledgment Text *
                        </Label>
                        <Textarea
                            id="acknowledgment_text"
                            name="acknowledgment_text"
                            placeholder="Verification statement employees sign..."
                            rows={2}
                            value={formData.acknowledgment_text || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('acknowledgment_text')}
                        />
                        {errors?.acknowledgment_text && (
                            <p className="text-xs text-red-500 font-medium">{errors.acknowledgment_text}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatory" className={errors?.authorized_signatory ? "text-red-500" : ""}>
                                Authorized Signatory Name/Designation *
                            </Label>
                            <Input
                                id="authorized_signatory"
                                name="authorized_signatory"
                                placeholder="e.g. Mr. Aniket Sen (Chief Compliance Officer)"
                                value={formData.authorized_signatory || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatory')}
                            />
                            {errors?.authorized_signatory && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatory}</p>
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

            {/* Section 7: Configuration Setup Flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific listed, global, or government-linked behaviors</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="listed_company"
                                checked={formData.listed_company || false}
                                onCheckedChange={(checked) => handleSelectChange('listed_company', !!checked)}
                            />
                            <Label htmlFor="listed_company" className="text-sm font-normal cursor-pointer">SEBI governance rules (Listed)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="global_operations"
                                checked={formData.global_operations || false}
                                onCheckedChange={(checked) => handleSelectChange('global_operations', !!checked)}
                            />
                            <Label htmlFor="global_operations" className="text-sm font-normal cursor-pointer">Global operations policies</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="government_contractor"
                                checked={formData.government_contractor || false}
                                onCheckedChange={(checked) => handleSelectChange('government_contractor', !!checked)}
                            />
                            <Label htmlFor="government_contractor" className="text-sm font-normal cursor-pointer">Government contractor codes</Label>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="additional_policies">Additional policies / Appendices (Optional)</Label>
                        <Textarea
                            id="additional_policies"
                            name="additional_policies"
                            placeholder="Add any specific guidelines, special allowances, etc..."
                            rows={3}
                            value={formData.additional_policies || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CodeOfConductForm;
