import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award } from "lucide-react";

interface NonCompeteFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const NonCompeteForm: React.FC<NonCompeteFormProps> = ({
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
                first_party_name: 'Stark Enterprises Private Limited',
                first_party_type: 'Private Limited',
                first_party_address: '10th Floor, Arc Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
                second_party_name: 'Dr. Bruce Banner',
                second_party_type: 'Individual',
                second_party_address: 'Flat 702, Gamma Residences, Green Avenue, Pune, Maharashtra 411007',
                relationship_type: 'Employee',
                purpose: 'To protect the proprietary research, confidential trade secrets, and market goodwill of Stark Enterprises in relation to quantum computing and bio-technology projects.',
                business_interests: 'Confidential Information, Trade Secrets, Customer Relationships, Proprietary Technology, and Goodwill.',
                confidential_information_definition: 'All technical data, source codes, hardware designs, quantum formulas, bio-molecular structures, client lists, and strategic business plans shared by the First Party.',
                trade_secret_definition: 'The proprietary biochemical formulas and quantum simulation algorithms developed during the project.',
                restricted_activities: 'Engaging, advising, or working with any competitor developing quantum computing software or bio-technology solutions.',
                restricted_period: '12 Months post-separation',
                restricted_territory: 'Republic of India',
                non_solicitation: 'Second Party shall not solicit or hire First Party employees, nor solicit First Party active clients for a period of 12 months post-separation.',
                intellectual_property_clause: 'All intellectual property rights, discoveries, patents, and copyrightable works created during the engagement shall vest solely with Stark Enterprises.',
                consideration: 'The mutual covenants contained herein, the offer of employment, and access to highly confidential research tools.',
                exceptions: 'Academic publishing of general quantum theories that do not contain any proprietary or confidential Stark Enterprises data.',
                confidentiality_required: true,
                term: 'Co-terminus with the employment contract, with confidentiality and IP clauses surviving indefinitely.',
                termination_conditions: 'Upon termination of the underlying employment agreement or by mutual written consent of both parties.',
                notices: 'First Party: legal@starkenterprises.com, Arc Tower, Mumbai.\nSecond Party: bruce@gammaresidences.com, Gamma Residences, Pune.',
                governing_law: 'Laws of India',
                dispute_resolution: 'Arbitration under the Arbitration and Conciliation Act, 1996 in Mumbai by a sole arbitrator.',
                cross_border: false,
                founder_agreement: false,
                business_sale: false,
                employee_agreement: true,
                consultant_agreement: false,
                authorized_signatories: 'First Party Signatory: Mr. Pepper Potts (Chief Executive Officer)\nSecond Party Signatory: Dr. Bruce Banner',
                witness_details: 'Witness 1: Mr. Happy Hogan, Mumbai\nWitness 2: Ms. Natasha Romanoff, Mumbai',
                execution_place: 'Mumbai',
                execution_date: new Date().toISOString().split('T')[0],
                additional_conditions: 'This agreement is executed in two counterparts, each of which shall be deemed an original.'
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

            {/* Section 1: First Party (Employer/Client) */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        First Party details
                    </CardTitle>
                    <CardDescription>Enter details of the party seeking protection (e.g. Employer / Company)</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_party_name" className={errors?.first_party_name ? "text-red-500" : ""}>
                                First Party Name *
                            </Label>
                            <Input
                                id="first_party_name"
                                name="first_party_name"
                                placeholder="e.g. Stark Enterprises Private Limited"
                                value={formData.first_party_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('first_party_name')}
                            />
                            {errors?.first_party_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.first_party_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="first_party_type" className={errors?.first_party_type ? "text-red-500" : ""}>
                                First Party Entity Type *
                            </Label>
                            <Select
                                value={formData.first_party_type || 'Private Limited'}
                                onValueChange={(v) => handleSelectChange('first_party_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('first_party_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited Company</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited Company</SelectItem>
                                    <SelectItem value="LLP">LLP</SelectItem>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.first_party_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.first_party_type}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="first_party_address" className={errors?.first_party_address ? "text-red-500" : ""}>
                                First Party Registered Address *
                            </Label>
                            <Input
                                id="first_party_address"
                                name="first_party_address"
                                placeholder="Complete principal address..."
                                value={formData.first_party_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('first_party_address')}
                            />
                            {errors?.first_party_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.first_party_address}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Second Party (Restricted Person) */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <UserCheck className="h-5 w-5" />
                        Second Party details
                    </CardTitle>
                    <CardDescription>Enter details of the restricted person (e.g. Employee / Consultant / Founder)</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="second_party_name" className={errors?.second_party_name ? "text-red-500" : ""}>
                                Second Party Name *
                            </Label>
                            <Input
                                id="second_party_name"
                                name="second_party_name"
                                placeholder="e.g. Dr. Bruce Banner"
                                value={formData.second_party_name || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('second_party_name')}
                            />
                            {errors?.second_party_name && (
                                <p className="text-xs text-red-500 font-medium">{errors.second_party_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="second_party_type" className={errors?.second_party_type ? "text-red-500" : ""}>
                                Second Party Entity Type *
                            </Label>
                            <Select
                                value={formData.second_party_type || 'Individual'}
                                onValueChange={(v) => handleSelectChange('second_party_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('second_party_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                    <SelectItem value="Company">Private Limited Company</SelectItem>
                                    <SelectItem value="LLP">LLP</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.second_party_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.second_party_type}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="second_party_address" className={errors?.second_party_address ? "text-red-500" : ""}>
                                Second Party Address *
                            </Label>
                            <Input
                                id="second_party_address"
                                name="second_party_address"
                                placeholder="Complete principal address..."
                                value={formData.second_party_address || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('second_party_address')}
                            />
                            {errors?.second_party_address && (
                                <p className="text-xs text-red-500 font-medium">{errors.second_party_address}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Relationship & Purpose */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        Engagement Relationship & Legitimate Interests
                    </CardTitle>
                    <CardDescription>Select relationship type and specify interests being protected</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="relationship_type" className={errors?.relationship_type ? "text-red-500" : ""}>
                                Relationship Type *
                            </Label>
                            <Select
                                value={formData.relationship_type || 'Employee'}
                                onValueChange={(v) => handleSelectChange('relationship_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('relationship_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employee">Employee Relationship</SelectItem>
                                    <SelectItem value="Consultant">Consultant Engagement</SelectItem>
                                    <SelectItem value="Founder">Founder Agreement</SelectItem>
                                    <SelectItem value="Business Sale">Business Sale Acquisition</SelectItem>
                                    <SelectItem value="Other">Other Commercial Partnership</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.relationship_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.relationship_type}</p>
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="purpose" className={errors?.purpose ? "text-red-500" : ""}>
                                Legitimate business interest purpose *
                            </Label>
                            <Textarea
                                id="purpose"
                                name="purpose"
                                placeholder="Describe why this restriction is necessary..."
                                rows={2}
                                value={formData.purpose || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('purpose')}
                            />
                            {errors?.purpose && (
                                <p className="text-xs text-red-500 font-medium">{errors.purpose}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="business_interests" className={errors?.business_interests ? "text-red-500" : ""}>
                                Business Interests protected *
                            </Label>
                            <Input
                                id="business_interests"
                                name="business_interests"
                                placeholder="e.g. Confidential Information, Trade Secrets, Customer Goodwill"
                                value={formData.business_interests || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('business_interests')}
                            />
                            {errors?.business_interests && (
                                <p className="text-xs text-red-500 font-medium">{errors.business_interests}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Covenants & Restrictions */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Restrictive Covenants
                    </CardTitle>
                    <CardDescription>Tailor restricted activities, territories, periods, and solicitation limits</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="restricted_activities" className={errors?.restricted_activities ? "text-red-500" : ""}>
                            Restricted Activities & Business Scope *
                        </Label>
                        <Textarea
                            id="restricted_activities"
                            name="restricted_activities"
                            placeholder="Detail restricted business scopes or product lines..."
                            rows={3}
                            value={formData.restricted_activities || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('restricted_activities')}
                        />
                        {errors?.restricted_activities && (
                            <p className="text-xs text-red-500 font-medium">{errors.restricted_activities}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="restricted_period">Restricted Duration (Optional)</Label>
                            <Input
                                id="restricted_period"
                                name="restricted_period"
                                placeholder="e.g. 12 Months post-separation"
                                value={formData.restricted_period || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="restricted_territory">Restricted Territory (Optional)</Label>
                            <Input
                                id="restricted_territory"
                                name="restricted_territory"
                                placeholder="e.g. Republic of India"
                                value={formData.restricted_territory || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="non_solicitation">Non-Solicitation Details (Optional)</Label>
                        <Textarea
                            id="non_solicitation"
                            name="non_solicitation"
                            placeholder="State separate limits on soliciting clients, partners, or hiring employees..."
                            rows={2}
                            value={formData.non_solicitation || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consideration" className={errors?.consideration ? "text-red-500" : ""}>
                            Consideration supporting Covenants *
                        </Label>
                        <Textarea
                            id="consideration"
                            name="consideration"
                            placeholder="Salary payments, options grants, access to trade secrets, or business purchase sum..."
                            rows={2}
                            value={formData.consideration || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('consideration')}
                        />
                        {errors?.consideration && (
                            <p className="text-xs text-red-500 font-medium">{errors.consideration}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="exceptions">Exceptions / Permitted Activities (Optional)</Label>
                        <Textarea
                            id="exceptions"
                            name="exceptions"
                            placeholder="Academic reviews, writing textbooks, non-commercial research..."
                            rows={2}
                            value={formData.exceptions || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Intellectual Property & Information Security */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Confidentiality & IP
                    </CardTitle>
                    <CardDescription>Provide descriptions of IP covenants, trade secrets, and privacy protocols</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confidential_information_definition" className={errors?.confidential_information_definition ? "text-red-500" : ""}>
                            Confidential Information definition *
                        </Label>
                        <Textarea
                            id="confidential_information_definition"
                            name="confidential_information_definition"
                            placeholder="Describe technical data, codes, financials, or lists covered..."
                            rows={2}
                            value={formData.confidential_information_definition || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('confidential_information_definition')}
                        />
                        {errors?.confidential_information_definition && (
                            <p className="text-xs text-red-500 font-medium">{errors.confidential_information_definition}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trade_secret_definition">Trade Secrets description (Optional)</Label>
                        <Textarea
                            id="trade_secret_definition"
                            name="trade_secret_definition"
                            placeholder="Proprietary formulas, databases, codes, or processes..."
                            rows={2}
                            value={formData.trade_secret_definition || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_clause" className={errors?.intellectual_property_clause ? "text-red-500" : ""}>
                            Intellectual Property Assignment *
                        </Label>
                        <Textarea
                            id="intellectual_property_clause"
                            name="intellectual_property_clause"
                            placeholder="Define how work product, research findings, and inventions vest with First Party..."
                            rows={2}
                            value={formData.intellectual_property_clause || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intellectual_property_clause')}
                        />
                        {errors?.intellectual_property_clause && (
                            <p className="text-xs text-red-500 font-medium">{errors.intellectual_property_clause}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Terms & Governance */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Terms & Governance
                    </CardTitle>
                    <CardDescription>Governing laws, dispute seats, and notice details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="term" className={errors?.term ? "text-red-500" : ""}>
                                Agreement Term *
                            </Label>
                            <Input
                                id="term"
                                name="term"
                                placeholder="e.g. Co-terminus with employment contract"
                                value={formData.term || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('term')}
                            />
                            {errors?.term && (
                                <p className="text-xs text-red-500 font-medium">{errors.term}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="termination_conditions" className={errors?.termination_conditions ? "text-red-500" : ""}>
                                Termination Conditions *
                            </Label>
                            <Input
                                id="termination_conditions"
                                name="termination_conditions"
                                placeholder="e.g. Upon termination of the employment contract"
                                value={formData.termination_conditions || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('termination_conditions')}
                            />
                            {errors?.termination_conditions && (
                                <p className="text-xs text-red-500 font-medium">{errors.termination_conditions}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notices" className={errors?.notices ? "text-red-500" : ""}>
                                Notice Address details *
                            </Label>
                            <Textarea
                                id="notices"
                                name="notices"
                                placeholder="Contact info, designations, and email domains for notices..."
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
                                placeholder="Arbitration terms, court jurisdictions, seats..."
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

            {/* Section 7: Signatures & Witnesses */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Execution Credentials
                    </CardTitle>
                    <CardDescription>Signatories and witness details</CardDescription>
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
                                placeholder="e.g. Mumbai"
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

            {/* Section 8: specific layout flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific layout variations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="cross_border"
                                checked={formData.cross_border || false}
                                onCheckedChange={(checked) => handleSelectChange('cross_border', !!checked)}
                            />
                            <Label htmlFor="cross_border" className="text-sm font-normal cursor-pointer">Cross Border arrangement</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="founder_agreement"
                                checked={formData.founder_agreement || false}
                                onCheckedChange={(checked) => handleSelectChange('founder_agreement', !!checked)}
                            />
                            <Label htmlFor="founder_agreement" className="text-sm font-normal cursor-pointer">Founder Non-Compete</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="business_sale"
                                checked={formData.business_sale || false}
                                onCheckedChange={(checked) => handleSelectChange('business_sale', !!checked)}
                            />
                            <Label htmlFor="business_sale" className="text-sm font-normal cursor-pointer">Business Sale / Acquisition</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="employee_agreement"
                                checked={formData.employee_agreement || false}
                                onCheckedChange={(checked) => handleSelectChange('employee_agreement', !!checked)}
                            />
                            <Label htmlFor="employee_agreement" className="text-sm font-normal cursor-pointer">Employee covenants</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="consultant_agreement"
                                checked={formData.consultant_agreement || false}
                                onCheckedChange={(checked) => handleSelectChange('consultant_agreement', !!checked)}
                            />
                            <Label htmlFor="consultant_agreement" className="text-sm font-normal cursor-pointer">Consultant independent contractor</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="confidentiality_required"
                                checked={formData.confidentiality_required || false}
                                onCheckedChange={(checked) => handleSelectChange('confidentiality_required', !!checked)}
                            />
                            <Label htmlFor="confidentiality_required" className="text-sm font-normal cursor-pointer">Confidentiality compliance required</Label>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="additional_conditions">Additional Conditions / Board instructions (Optional)</Label>
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

export default NonCompeteForm;
