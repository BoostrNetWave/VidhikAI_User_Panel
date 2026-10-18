import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, IndianRupee, Gavel, Sparkles, Shield, Clock } from "lucide-react";

interface ServiceAgreementFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const ServiceAgreementForm: React.FC<ServiceAgreementFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {
    const fillDummyData = () => {
        if (setFormData) {
            const today = new Date().toISOString().split('T')[0];
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            const expiryDate = nextYear.toISOString().split('T')[0];

            setFormData({
                ...formData,
                providerName: 'CloudScale Solutions LLP',
                providerType: 'LLP',
                providerAddress: 'No. 12, HSR Layout, Sector 7, Bangalore, Karnataka 560102',
                providerID: 'AAA-1234-LLP / GSTIN: 29AABCC1234D1Z5',
                clientName: 'NexGen Robotics Technologies Pvt Ltd',
                clientType: 'Company',
                clientAddress: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
                clientID: 'U72900KA2023PTC198273',
                effectiveDate: today,
                expiryDate: expiryDate,
                servicesDescription: 'Comprehensive Cloud Infrastructure Management, DevOps Automation, 24/7 Site Reliability Engineering (SRE), and quarterly security compliance audits.',
                milestones: 'Phase 1: Architecture Audit & Strategy (Month 1)\nPhase 2: Kubernetes Migration & CI/CD Pipeline Setup (Month 3)\nPhase 3: Automated Failover & Disaster Recovery Drills (Month 6)',
                fees: 'INR 2,50,000 per month (exclusive of GST)',
                paymentTerms: 'Payment within 15 calendar days from the date of invoice submission',
                latePaymentPenalty: '1.5% interest per month on overdue balances exceeding 30 days',
                ipOwnership: 'Client',
                confidentialityPeriod: '3 Years from agreement termination',
                terminationNotice: '30 Days written notice for convenience; 15 days cure period for breach',
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
                        Contracting Parties
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Service Provider Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="providerName">Service Provider Legal Name</Label>
                                <Input
                                    id="providerName"
                                    name="providerName"
                                    value={formData.providerName || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. CloudScale Solutions LLP"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="providerType">Entity Type</Label>
                                <Select
                                    value={formData.providerType || 'LLP'}
                                    onValueChange={(value) => handleSelectChange('providerType', value)}
                                >
                                    <SelectTrigger id="providerType">
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
                                <Label htmlFor="providerAddress">Registered Office Address</Label>
                                <Input
                                    id="providerAddress"
                                    name="providerAddress"
                                    value={formData.providerAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Full street address, city, state, pin code"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="providerID">Provider Identifier (CIN / LLPIN / GSTIN)</Label>
                                <Input
                                    id="providerID"
                                    name="providerID"
                                    value={formData.providerID || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. GSTIN 29AABCC1234D1Z5"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Client Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Client Legal Name</Label>
                                <Input
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. NexGen Robotics Technologies Pvt Ltd"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientType">Client Entity Type</Label>
                                <Select
                                    value={formData.clientType || 'Company'}
                                    onValueChange={(value) => handleSelectChange('clientType', value)}
                                >
                                    <SelectTrigger id="clientType">
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
                                <Label htmlFor="clientAddress">Client Business Address</Label>
                                <Input
                                    id="clientAddress"
                                    name="clientAddress"
                                    value={formData.clientAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Full office address, city, state, pin code"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientID">Client Identifier (CIN / GSTIN)</Label>
                                <Input
                                    id="clientID"
                                    name="clientID"
                                    value={formData.clientID || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. U72900KA2023PTC198273"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Scope of Work */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        Scope of Services & Timelines
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
                            <Label htmlFor="expiryDate">Expiration Date (Optional)</Label>
                            <Input
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate || ''}
                                onChange={handleInputChange}
                                type="date"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="servicesDescription">Detailed Description of Services</Label>
                            <Textarea
                                id="servicesDescription"
                                name="servicesDescription"
                                value={formData.servicesDescription || ''}
                                onChange={handleInputChange}
                                placeholder="Detail the technical responsibilities, deliverables, and service scope..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="milestones">Milestones & Key Deliverables</Label>
                            <Textarea
                                id="milestones"
                                name="milestones"
                                value={formData.milestones || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Milestone 1: Initial Discovery (Month 1)..."
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Commercials */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <IndianRupee className="h-5 w-5" />
                        Commercial Terms & Intellectual Property
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fees">Service Fees</Label>
                            <Input
                                id="fees"
                                name="fees"
                                value={formData.fees || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. INR 2,50,000 per month (exclusive of taxes)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentTerms">Payment Terms</Label>
                            <Input
                                id="paymentTerms"
                                name="paymentTerms"
                                value={formData.paymentTerms || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Net 15 days from invoice date"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="latePaymentPenalty">Late Payment Interest / Penalty</Label>
                            <Input
                                id="latePaymentPenalty"
                                name="latePaymentPenalty"
                                value={formData.latePaymentPenalty || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 1.5% interest per month for overdue payments"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ipOwnership">IP Ownership of Deliverables</Label>
                            <Select
                                value={formData.ipOwnership || 'Client'}
                                onValueChange={(value) => handleSelectChange('ipOwnership', value)}
                            >
                                <SelectTrigger id="ipOwnership">
                                    <SelectValue placeholder="Who owns the IP?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Client">Client Owns (Work-for-Hire)</SelectItem>
                                    <SelectItem value="Provider">Provider Owns (Licensed to Client)</SelectItem>
                                    <SelectItem value="Joint">Joint Ownership</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legal & Governance */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Gavel className="h-5 w-5" />
                        Termination, Confidentiality & Jurisdiction
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="terminationNotice">Termination Notice Period</Label>
                            <Input
                                id="terminationNotice"
                                name="terminationNotice"
                                value={formData.terminationNotice || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 30 Days written notice"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confidentialityPeriod">Confidentiality Duration</Label>
                            <Input
                                id="confidentialityPeriod"
                                name="confidentialityPeriod"
                                value={formData.confidentialityPeriod || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 3 Years from termination"
                            />
                        </div>
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
                            <Label htmlFor="jurisdiction">Exclusive Jurisdiction (City)</Label>
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

