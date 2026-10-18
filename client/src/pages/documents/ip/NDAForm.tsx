import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, User, Target, Calendar, Gavel, Sparkles } from "lucide-react";

interface NDAFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const NDAForm: React.FC<NDAFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                disclosingPartyName: 'Quantum AI Systems Pvt Ltd',
                disclosingPartyAddress: 'Suite 201, T-Hub 2.0, Knowledge City, Hyderabad, Telangana 500081',
                receivingPartyName: 'BuildFast Ventures LLP',
                receivingPartyAddress: '7th Floor, WeWork Galaxy, Residency Road, Bangalore, Karnataka 560001',
                ndaType: 'Unilateral',
                purpose: 'Evaluation of potential investment and strategic technology partnership, including technical evaluation of Quantum AI\'s proprietary LLM inference engines and fine-tuning datasets.',
                effectiveDate: new Date().toISOString().split('T')[0],
                duration: '5 Years from the date of disclosure',
                confidentialityScope: 'Proprietary AI architectures, model weights, training pipeline datasets, customer metrics, financial valuations, cap table data, and strategic product roadmaps.',
                exceptions: 'Standard legal exceptions including information already in public domain without breach, independently developed without access to disclosed materials, or compelled by applicable regulatory authorities.',
                governingLaw: 'Laws of India',
                jurisdiction: 'Hyderabad, Telangana',
                liquidatedDamages: '₹50,00,000 (Rupees Fifty Lakhs) per proven material breach',
                injunctiveRelief: 'Yes'
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

            {/* Agreement Type */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                        Agreement Structure & Purpose
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ndaType">NDA Structure</Label>
                            <Select value={formData.ndaType || 'Unilateral'} onValueChange={(val) => handleSelectChange('ndaType', val)}>
                                <SelectTrigger id="ndaType">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Unilateral">Unilateral (One-way disclosure)</SelectItem>
                                    <SelectItem value="Mutual">Mutual (Two-way reciprocal disclosure)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose of Disclosure</Label>
                            <Input
                                id="purpose"
                                name="purpose"
                                value={formData.purpose || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Exploring a strategic investment and technology partnership"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Disclosing Party */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <User className="h-5 w-5" />
                        {formData.ndaType === 'Mutual' ? 'Party A (First Discloser)' : 'Disclosing Party'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="disclosingPartyName">Legal Entity Name</Label>
                            <Input
                                id="disclosingPartyName"
                                name="disclosingPartyName"
                                value={formData.disclosingPartyName || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Quantum AI Systems Pvt Ltd"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="disclosingPartyAddress">Registered Office Address</Label>
                            <Textarea
                                id="disclosingPartyAddress"
                                name="disclosingPartyAddress"
                                value={formData.disclosingPartyAddress || ''}
                                onChange={handleInputChange}
                                className="min-h-[80px]"
                                placeholder="Full registered street address, city, state, pin code"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Receiving Party */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <User className="h-5 w-5" />
                        {formData.ndaType === 'Mutual' ? 'Party B (Second Discloser)' : 'Receiving Party'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="receivingPartyName">Legal Entity Name</Label>
                            <Input
                                id="receivingPartyName"
                                name="receivingPartyName"
                                value={formData.receivingPartyName || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. BuildFast Ventures LLP"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="receivingPartyAddress">Principal Address</Label>
                            <Textarea
                                id="receivingPartyAddress"
                                name="receivingPartyAddress"
                                value={formData.receivingPartyAddress || ''}
                                onChange={handleInputChange}
                                className="min-h-[80px]"
                                placeholder="Full principal business address, city, state, pin code"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Confidentiality Scope */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Target className="h-5 w-5" />
                        Scope of Confidential Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="confidentialityScope">Definition & Protected Subject Matter</Label>
                            <Textarea
                                id="confidentialityScope"
                                name="confidentialityScope"
                                value={formData.confidentialityScope || ''}
                                onChange={handleInputChange}
                                className="min-h-[100px]"
                                placeholder="Specify protected assets (e.g. AI model architectures, codebase, financial models, user lists)..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exceptions">Permitted Carve-outs & Exceptions</Label>
                            <Textarea
                                id="exceptions"
                                name="exceptions"
                                value={formData.exceptions || ''}
                                onChange={handleInputChange}
                                className="min-h-[80px]"
                                placeholder="Standard exceptions apply (public domain, independently developed, court-ordered). Add any custom carve-outs."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Duration */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Term & Timelines
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
                            <Label htmlFor="duration">Confidentiality Survival Period</Label>
                            <Input
                                id="duration"
                                name="duration"
                                value={formData.duration || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 5 Years from date of disclosure"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Remedies & Legal */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Gavel className="h-5 w-5" />
                        Remedies, Governing Law & Jurisdiction
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="injunctiveRelief">Right to Injunctive / Equitable Relief</Label>
                            <Select
                                value={formData.injunctiveRelief || 'Yes'}
                                onValueChange={(val) => handleSelectChange('injunctiveRelief', val)}
                            >
                                <SelectTrigger id="injunctiveRelief">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">Yes (Standard under Specific Relief Act)</SelectItem>
                                    <SelectItem value="No">No (Damages only)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="liquidatedDamages">Liquidated Damages (Optional)</Label>
                            <Input
                                id="liquidatedDamages"
                                name="liquidatedDamages"
                                value={formData.liquidatedDamages || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. ₹50,00,000 for any proven material breach"
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
                                placeholder="e.g. Hyderabad, Telangana"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

