import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, IndianRupee, Calendar, Sparkles, Building2 } from "lucide-react";

interface OfferLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange?: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const OfferLetterForm: React.FC<OfferLetterFormProps> = ({
    formData,
    handleInputChange,
    setFormData
}) => {
    const fillDummyData = () => {
        if (setFormData) {
            const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            setFormData({
                ...formData,
                companyName: 'Vidhik AI Technologies Pvt Ltd',
                companyAddress: 'Level 4, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
                candidateName: 'Aditi Nair',
                candidateAddress: 'Flat 405, Skyview Residency, Whitefield, Bangalore, Karnataka 560066',
                position: 'Senior UI/UX Designer',
                department: 'Product Design',
                reportingManager: 'Vikas Mehta (Head of Design)',
                workLocation: 'Bangalore Office (Hybrid - 3 days in office)',
                salary: '₹22,00,000 (Twenty-Two Lakhs) per annum CTC',
                probationPeriod: '6 Months',
                noticePeriod: '60 Days',
                joiningDate: oneMonthLater,
                expiryDate: twoWeeksLater
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

            {/* Employer Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Employer / Company Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="companyName">Employing Entity Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                value={formData.companyName || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Vidhik AI Technologies Pvt Ltd"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="companyAddress">Company Registered Address</Label>
                            <Input
                                id="companyAddress"
                                name="companyAddress"
                                value={formData.companyAddress || ''}
                                onChange={handleInputChange}
                                placeholder="Registered office / headquarters address"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Candidate Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <User className="h-5 w-5" />
                        Candidate Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="candidateName">Candidate Full Name</Label>
                            <Input
                                id="candidateName"
                                name="candidateName"
                                value={formData.candidateName || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Aditi Nair"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="candidateAddress">Candidate Residential Address</Label>
                            <Textarea
                                id="candidateAddress"
                                name="candidateAddress"
                                value={formData.candidateAddress || ''}
                                onChange={handleInputChange}
                                placeholder="Residential street address, city, state, postal code"
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Position Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Briefcase className="h-5 w-5" />
                        Position & Reporting
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="position">Position / Job Designation</Label>
                            <Input
                                id="position"
                                name="position"
                                value={formData.position || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Senior UI/UX Designer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                name="department"
                                value={formData.department || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Product Design"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reportingManager">Reporting Manager & Designation</Label>
                            <Input
                                id="reportingManager"
                                name="reportingManager"
                                value={formData.reportingManager || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Vikas Mehta (Head of Design)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workLocation">Work Location & Mode</Label>
                            <Input
                                id="workLocation"
                                name="workLocation"
                                value={formData.workLocation || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Bangalore Office (Hybrid - 3 days in office)"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Compensation & Terms */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <IndianRupee className="h-5 w-5" />
                        Compensation, Probation & Notice
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salary">Annual CTC / Compensation Structure</Label>
                            <Input
                                id="salary"
                                name="salary"
                                value={formData.salary || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. ₹22,00,000 per annum CTC"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="probationPeriod">Probationary Period</Label>
                            <Input
                                id="probationPeriod"
                                name="probationPeriod"
                                value={formData.probationPeriod || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 6 Months"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="noticePeriod">Notice Period</Label>
                            <Input
                                id="noticePeriod"
                                name="noticePeriod"
                                value={formData.noticePeriod || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 60 Days"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timelines */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Key Dates
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="joiningDate">Expected Joining Date</Label>
                            <Input
                                id="joiningDate"
                                name="joiningDate"
                                value={formData.joiningDate || ''}
                                onChange={handleInputChange}
                                type="date"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Offer Acceptance Deadline</Label>
                            <Input
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate || ''}
                                onChange={handleInputChange}
                                type="date"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

