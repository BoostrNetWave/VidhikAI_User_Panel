import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Briefcase, DollarSign, Calendar, Sparkles } from "lucide-react";

interface OfferLetterFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const OfferLetterForm: React.FC<OfferLetterFormProps> = ({ formData, handleInputChange, setFormData }) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                candidateName: 'Anita Sharma',
                candidateAddress: 'House No. 45, Green Park Extension, New Delhi 110016',
                position: 'Lead Designer',
                department: 'Product Design',
                reportingManager: 'Arjun Kapoor (VP Product)',
                workLocation: 'New Delhi Office (Hybrid)',
                salary: '₹22,00,000 per annum',
                probationPeriod: '3 Months',
                noticePeriod: '30 Days',
                joiningDate: '2024-05-15',
                expiryDate: '2024-04-15'
            });
        }
    };

    return (
        <div className="space-y-8 pt-6">
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
            {/* Candidate Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Candidate Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Candidate Name</Label>
                        <Input name="candidateName" value={formData.candidateName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Candidate Address</Label>
                        <Textarea
                            name="candidateAddress"
                            value={formData.candidateAddress}
                            onChange={handleInputChange}
                            placeholder="Residential address"
                            className="min-h-[80px]"
                        />
                    </div>
                </div>
            </section>

            {/* Employment Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Position & Reporting</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Position / Job Title</Label>
                        <Input name="position" value={formData.position} onChange={handleInputChange} placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Engineering" />
                    </div>
                    <div className="space-y-2">
                        <Label>Reporting Manager</Label>
                        <Input name="reportingManager" value={formData.reportingManager} onChange={handleInputChange} placeholder="e.g. Director of Engineering" />
                    </div>
                    <div className="space-y-2">
                        <Label>Work Location</Label>
                        <Input name="workLocation" value={formData.workLocation} onChange={handleInputChange} placeholder="e.g. Bangalore (WFH/Office)" />
                    </div>
                </div>
            </section>

            {/* Compensation */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Compensation & Probation</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Annual CTC / Salary</Label>
                        <Input name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. ₹18,00,000 per annum" />
                    </div>
                    <div className="space-y-2">
                        <Label>Probation Period</Label>
                        <Input name="probationPeriod" value={formData.probationPeriod} onChange={handleInputChange} placeholder="e.g. 6 Months" />
                    </div>
                    <div className="space-y-2">
                        <Label>Notice Period</Label>
                        <Input name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} placeholder="e.g. 90 Days" />
                    </div>
                </div>
            </section>

            {/* Timelines */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Timelines</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Joining Date</Label>
                        <Input name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Offer Expiry Date</Label>
                        <Input name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} type="date" />
                    </div>
                </div>
            </section>
        </div>
    );
};
