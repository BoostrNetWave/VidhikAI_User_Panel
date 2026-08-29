import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, UserPlus, MapPin, Sparkles, UserCheck, Shield, FileText, TrendingUp } from "lucide-react";

interface DirectorAppointmentFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const DirectorAppointmentForm: React.FC<DirectorAppointmentFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'Vidhik AI Solutions Private Limited',
                companyCin: 'U74999KA2022PTC158273',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                directorName: 'Mr. Arvind Kejriwal',
                directorAddress: '7th Cross, Koramangala, Bangalore - 560034',
                din: 'DIN: 01234567',
                appointmentType: 'Independent',
                designation: 'Independent Director',
                effectiveDate: '2024-06-21',
                termDuration: '5 Years',
                remunerationDetails: 'Sitting fees of INR 20,000 per meeting plus reimbursement of actual travel expenses.',
                boardResolutionDate: '2024-06-15',
                shareholderApprovalRequired: true,
                additionalTerms: 'The director shall also serve on the Audit Committee.'
            });
        }
    };

    return (
        <div className="space-y-8 pt-6">
            <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/90 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">Quick Fill</h4>
                        <p className="text-sm text-primary">Test the generator with sample director data</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={fillDummyData}
                    className="bg-white hover:bg-secondary border-primary/20 text-primary gap-2 shadow-sm"
                >
                    Fill Dummy Data
                </Button>
            </div>

            {/* Company Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Company Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Company Name</Label>
                        <Input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Full legal name of the company"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company CIN</Label>
                        <Input
                            name="companyCin"
                            value={formData.companyCin}
                            onChange={handleInputChange}
                            placeholder="e.g. U74999KA2022PTC158273"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address</Label>
                        <Input
                            name="registeredOffice"
                            value={formData.registeredOffice}
                            onChange={handleInputChange}
                            placeholder="Full registered address"
                        />
                    </div>
                </div>
            </section>

            {/* Director Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Director to be Appointed</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Director Full Name</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="directorName"
                                value={formData.directorName}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. Mr. Amit Singh"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>DIN (Director Identification Number)</Label>
                        <Input
                            name="din"
                            value={formData.din}
                            onChange={handleInputChange}
                            placeholder="e.g. 01234567"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Director Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="directorAddress"
                                value={formData.directorAddress}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Full residential address"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Appointment Terms */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Appointment Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Appointment Type</Label>
                        <Select
                            value={formData.appointmentType || 'Non-Executive'}
                            onValueChange={(value) => handleSelectChange('appointmentType', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Executive">Executive Director</SelectItem>
                                <SelectItem value="Non-Executive">Non-Executive Director</SelectItem>
                                <SelectItem value="Independent">Independent Director</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            placeholder="e.g. Managing Director, Additional Director"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Effective Date</Label>
                        <Input
                            name="effectiveDate"
                            value={formData.effectiveDate}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Term Duration</Label>
                        <Input
                            name="termDuration"
                            value={formData.termDuration}
                            onChange={handleInputChange}
                            placeholder="e.g. 5 Years, Retirement by Rotation"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Board Resolution Date</Label>
                        <Input
                            name="boardResolutionDate"
                            value={formData.boardResolutionDate}
                            onChange={handleInputChange}
                            type="date"
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                            id="shareholderApprovalRequired"
                            checked={formData.shareholderApprovalRequired || false}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, shareholderApprovalRequired: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="shareholderApprovalRequired" className="cursor-pointer font-normal">
                            Subject to Shareholder Approval at General Meeting
                        </Label>
                    </div>
                </div>
            </section>

            {/* Compensation & Extras */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Remuneration & Remit</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Remuneration Details</Label>
                        <Textarea
                            name="remunerationDetails"
                            value={formData.remunerationDetails}
                            onChange={handleInputChange}
                            placeholder="Details of salary, commission, or sitting fees..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Additional Terms (Optional)</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                name="additionalTerms"
                                value={formData.additionalTerms}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Committee memberships, specific duties, etc."
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DirectorAppointmentForm;
