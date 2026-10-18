import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, FileText, Globe, Sparkles, Scale, IndianRupee } from "lucide-react";

interface CopyrightAssignmentFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const CopyrightAssignmentForm: React.FC<CopyrightAssignmentFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                assignorName: 'Rajesh Kumar',
                assignorType: 'Individual',
                assignorAddress: 'Flat 101, Sunshine Apartments, Indiranagar, Bangalore, Karnataka 560038',
                assignorID: 'ABCDE1234F',
                assigneeName: 'NexGen Robotics Technologies Pvt Ltd',
                assigneeType: 'Company',
                assigneeAddress: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
                assigneeID: 'U72900KA2023PTC198273',
                workTitle: 'Autonomous Drone Navigation Software (v2.1)',
                workType: 'Software/Code',
                workDescription: 'Complete source code, mathematical models, collision avoidance neural networks, and path planning algorithms used in the NexGen Alpha Drone series.',
                creationDate: 'February 2024',
                effectiveDate: new Date().toISOString().split('T')[0],
                considerationAmount: 'INR 5,00,000 (Rupees Five Lakhs Only)',
                territory: 'Worldwide',
                duration: 'Perpetual & Irrevocable',
                rightsAssigned: 'All exclusive rights under Section 14 of the Indian Copyright Act, 1957, including reproduction, translation, adaptation, public performance, publication, and commercial distribution worldwide.',
                governingLaw: 'Laws of India',
                jurisdiction: 'Mumbai, Maharashtra'
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

            {/* Assignor & Assignee Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <User className="h-5 w-5" />
                        Parties Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Assignor (Transferor / Creator)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assignorName">Assignor Legal Name</Label>
                                <Input
                                    id="assignorName"
                                    name="assignorName"
                                    value={formData.assignorName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Full legal name of creator / copyright holder"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assignorType">Assignor Entity Type</Label>
                                <Select
                                    value={formData.assignorType || 'Individual'}
                                    onValueChange={(value) => handleSelectChange('assignorType', value)}
                                >
                                    <SelectTrigger id="assignorType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Individual">Individual (Author / Creator)</SelectItem>
                                        <SelectItem value="Company">Private Limited Company</SelectItem>
                                        <SelectItem value="Firm">Partnership Firm / LLP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="assignorAddress">Assignor Residential / Registered Address</Label>
                                <Input
                                    id="assignorAddress"
                                    name="assignorAddress"
                                    value={formData.assignorAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Complete residential or registered office address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assignorID">Assignor ID (PAN / Aadhaar / CIN)</Label>
                                <Input
                                    id="assignorID"
                                    name="assignorID"
                                    value={formData.assignorID || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. PAN: ABCDE1234F"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Assignee (Transferee / Acquirer)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assigneeName">Assignee Legal Name</Label>
                                <Input
                                    id="assigneeName"
                                    name="assigneeName"
                                    value={formData.assigneeName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Full legal name of acquiring entity"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assigneeType">Assignee Entity Type</Label>
                                <Select
                                    value={formData.assigneeType || 'Company'}
                                    onValueChange={(value) => handleSelectChange('assigneeType', value)}
                                >
                                    <SelectTrigger id="assigneeType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Individual">Individual</SelectItem>
                                        <SelectItem value="Company">Private Limited Company</SelectItem>
                                        <SelectItem value="Firm">Partnership Firm / LLP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="assigneeAddress">Assignee Registered Address</Label>
                                <Input
                                    id="assigneeAddress"
                                    name="assigneeAddress"
                                    value={formData.assigneeAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Complete business or registered address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assigneeID">Assignee Identifier (CIN / PAN / GSTIN)</Label>
                                <Input
                                    id="assigneeID"
                                    name="assigneeID"
                                    value={formData.assigneeID || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. CIN: U72900KA2023PTC198273"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Work Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        Creative Work & Subject Matter Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="workTitle">Title / Name of the Work</Label>
                            <Input
                                id="workTitle"
                                name="workTitle"
                                value={formData.workTitle || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Autonomous Drone Navigation Software (v2.1)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workType">Statutory Work Classification</Label>
                            <Select
                                value={formData.workType || 'Software/Code'}
                                onValueChange={(value) => handleSelectChange('workType', value)}
                            >
                                <SelectTrigger id="workType">
                                    <SelectValue placeholder="Select work category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Software/Code">Software / Computer Program Code</SelectItem>
                                    <SelectItem value="Literary">Literary Work (Documentation, Articles, Books)</SelectItem>
                                    <SelectItem value="Artistic">Artistic Work (Logos, UI/UX, Graphic Design)</SelectItem>
                                    <SelectItem value="Musical">Musical Work</SelectItem>
                                    <SelectItem value="Cinematograph Film">Cinematograph Film / Video Production</SelectItem>
                                    <SelectItem value="Sound Recording">Sound Recording</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="workDescription">Detailed Technical Description of Work</Label>
                            <Textarea
                                id="workDescription"
                                name="workDescription"
                                value={formData.workDescription || ''}
                                onChange={handleInputChange}
                                placeholder="Detailed description of files, algorithms, assets, source code repository commits, or creative materials..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="creationDate">Creation Date / Timeframe</Label>
                            <Input
                                id="creationDate"
                                name="creationDate"
                                value={formData.creationDate || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. February 2024"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effectiveDate">Effective Date of Assignment</Label>
                            <Input
                                id="effectiveDate"
                                name="effectiveDate"
                                value={formData.effectiveDate || ''}
                                onChange={handleInputChange}
                                type="date"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="rightsAssigned">Rights Assigned</Label>
                            <Textarea
                                id="rightsAssigned"
                                name="rightsAssigned"
                                value={formData.rightsAssigned || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. All exclusive rights under Section 14 of Copyright Act, 1957, including reproduction, modification, and distribution..."
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignment Terms */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Globe className="h-5 w-5" />
                        Commercial Consideration & Territorial Scope
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="considerationAmount">Assignment Consideration (Fee)</Label>
                            <Input
                                id="considerationAmount"
                                name="considerationAmount"
                                value={formData.considerationAmount || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. INR 5,00,000 (Rupees Five Lakhs Only)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="territory">Territory</Label>
                            <Input
                                id="territory"
                                name="territory"
                                value={formData.territory || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Worldwide"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Assignment Duration</Label>
                            <Input
                                id="duration"
                                name="duration"
                                value={formData.duration || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Perpetual & Irrevocable"
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
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="jurisdiction">Exclusive Legal Jurisdiction (City)</Label>
                            <Input
                                id="jurisdiction"
                                name="jurisdiction"
                                value={formData.jurisdiction || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Mumbai, Maharashtra"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

