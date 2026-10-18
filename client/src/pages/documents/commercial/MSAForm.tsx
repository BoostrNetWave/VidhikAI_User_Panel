import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Calendar, ClipboardCheck, Scale, Sparkles, Shield, Clock } from "lucide-react";

interface MSAFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const MSAForm: React.FC<MSAFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {
    const fillDummyData = () => {
        if (setFormData) {
            const today = new Date().toISOString().split('T')[0];

            setFormData({
                ...formData,
                partyAName: 'CloudScale Solutions LLP',
                partyAType: 'LLP',
                partyAAddress: 'No. 12, HSR Layout, Sector 7, Bangalore, Karnataka 560102',
                partyAID: 'AAA-1234-LLP / GSTIN: 29AABCC1234D1Z5',
                partyBName: 'NexGen Robotics Technologies Pvt Ltd',
                partyBType: 'Company',
                partyBAddress: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
                partyBID: 'U72900KA2023PTC198273',
                effectiveDate: today,
                initialTerm: '36 Months',
                renewalTerms: 'Automatic 12-month renewal periods unless written notice of non-renewal is delivered at least 60 days prior to term expiration.',
                sowMechanism: 'Individual Statements of Work (SOWs) executed mutually from time to time, specifying deliverables, fees, and timelines.',
                serviceCategories: 'Cloud Engineering, DevOps Automation, Security Audits, Infrastructure Management, and SRE Support.',
                billingCycle: 'Monthly Net-15 days from submission of validated invoice',
                lateInterestRate: '18% Per Annum on delayed payments exceeding 30 days',
                liabilityCap: '100% of the aggregate fees paid by Client to Provider in the 12 months immediately preceding the event giving rise to liability',
                confidentialityTerm: '5 Years post termination or perpetual for Trade Secrets',
                terminationNotice: '60 Days written notice for convenience; 30 days cure period for material breach',
                nonSolicitationPeriod: '24 Months post termination covering key engineering personnel',
                governingLaw: 'India',
                jurisdiction: 'Bangalore, Karnataka'
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fillDummyData}
                    className="gap-2 text-primary border-primary/20 hover:bg-secondary"
                >
                    <Sparkles className="h-4 w-4" />
                    Fill Dummy Data
                </Button>
            </div>

            {/* Parties Section */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Master Contracting Parties
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Service Provider (Party A)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="partyAName">Service Provider Legal Name</Label>
                                <Input
                                    id="partyAName"
                                    name="partyAName"
                                    value={formData.partyAName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Full legal entity name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="partyAType">Provider Entity Type</Label>
                                <Select
                                    value={formData.partyAType || 'LLP'}
                                    onValueChange={(value) => handleSelectChange('partyAType', value)}
                                >
                                    <SelectTrigger id="partyAType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Company">Private Limited Company</SelectItem>
                                        <SelectItem value="LLP">Limited Liability Partnership (LLP)</SelectItem>
                                        <SelectItem value="Proprietorship">Sole Proprietorship</SelectItem>
                                        <SelectItem value="Partnership">Partnership Firm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="partyAAddress">Provider Registered Address</Label>
                                <Input
                                    id="partyAAddress"
                                    name="partyAAddress"
                                    value={formData.partyAAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Registered office address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="partyAID">Provider CIN / LLPIN / GSTIN</Label>
                                <Input
                                    id="partyAID"
                                    name="partyAID"
                                    value={formData.partyAID || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. GSTIN 29AABCC1234D1Z5"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Client (Party B)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="partyBName">Client Legal Name</Label>
                                <Input
                                    id="partyBName"
                                    name="partyBName"
                                    value={formData.partyBName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Full legal entity name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="partyBType">Client Entity Type</Label>
                                <Select
                                    value={formData.partyBType || 'Company'}
                                    onValueChange={(value) => handleSelectChange('partyBType', value)}
                                >
                                    <SelectTrigger id="partyBType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Company">Private Limited Company</SelectItem>
                                        <SelectItem value="Public Limited">Public Limited Company</SelectItem>
                                        <SelectItem value="LLP">Limited Liability Partnership (LLP)</SelectItem>
                                        <SelectItem value="Proprietorship">Sole Proprietorship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="partyBAddress">Client Principal Business Address</Label>
                                <Input
                                    id="partyBAddress"
                                    name="partyBAddress"
                                    value={formData.partyBAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Principal business address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="partyBID">Client CIN / GSTIN</Label>
                                <Input
                                    id="partyBID"
                                    name="partyBID"
                                    value={formData.partyBID || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. U72900KA2023PTC198273"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Framework Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Framework Term, Scope & SOW Mechanism
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="effectiveDate">Effective Date</Label>
                            <Input
                                id="effectiveDate"
                                name="effectiveDate"
                                value={formData.effectiveDate || ''}
                                onChange={handleInputChange}
                                type="date"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="initialTerm">Initial Term</Label>
                            <Input
                                id="initialTerm"
                                name="initialTerm"
                                value={formData.initialTerm || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 36 Months / 3 Years"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="renewalTerms">Renewal Terms</Label>
                            <Input
                                id="renewalTerms"
                                name="renewalTerms"
                                value={formData.renewalTerms || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Automatic 12-month renewal unless 60 days written notice..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="serviceCategories">High-Level Service Categories Covered</Label>
                            <Input
                                id="serviceCategories"
                                name="serviceCategories"
                                value={formData.serviceCategories || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Cloud Infrastructure, DevOps Automation, Security Engineering"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="sowMechanism">Statement of Work (SOW) Execution Protocol</Label>
                            <Textarea
                                id="sowMechanism"
                                name="sowMechanism"
                                value={formData.sowMechanism || ''}
                                onChange={handleInputChange}
                                placeholder="Describe how SOWs will be issued, signed, and prioritized over conflicting clauses..."
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Commercials & Liability */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <ClipboardCheck className="h-5 w-5" />
                        Financial Terms, Liability Cap & IP Framework
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="billingCycle">Standard Billing Cycle</Label>
                            <Input
                                id="billingCycle"
                                name="billingCycle"
                                value={formData.billingCycle || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Monthly Net-15 days"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lateInterestRate">Late Payment Interest Rate</Label>
                            <Input
                                id="lateInterestRate"
                                name="lateInterestRate"
                                value={formData.lateInterestRate || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 18% per annum"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="liabilityCap">Overall Liability Cap</Label>
                            <Input
                                id="liabilityCap"
                                name="liabilityCap"
                                value={formData.liabilityCap || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 100% of fees paid in the last 12 months preceding the claim"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="terminationNotice">Termination Notice (Convenience)</Label>
                            <Input
                                id="terminationNotice"
                                name="terminationNotice"
                                value={formData.terminationNotice || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 60 Days written notice"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confidentialityTerm">Confidentiality Obligation Duration</Label>
                            <Input
                                id="confidentialityTerm"
                                name="confidentialityTerm"
                                value={formData.confidentialityTerm || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 5 Years post termination"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="nonSolicitationPeriod">Non-Solicitation Restrictive Covenant</Label>
                            <Input
                                id="nonSolicitationPeriod"
                                name="nonSolicitationPeriod"
                                value={formData.nonSolicitationPeriod || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 24 Months post termination"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legal */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Dispute Resolution & Jurisdiction
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="governingLaw">Governing Law</Label>
                            <Input
                                id="governingLaw"
                                name="governingLaw"
                                value={formData.governingLaw || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Laws of India"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction">Exclusive Jurisdiction Court</Label>
                            <Input
                                id="jurisdiction"
                                name="jurisdiction"
                                value={formData.jurisdiction || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Bangalore, Karnataka"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

