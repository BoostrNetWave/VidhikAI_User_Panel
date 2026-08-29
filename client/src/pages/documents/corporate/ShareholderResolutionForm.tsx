import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building, FileText, Sparkles, Clock, MapPin, UserCheck, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";


interface ShareholderResolutionFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const ShareholderResolutionForm: React.FC<ShareholderResolutionFormProps> = ({
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
                cin: 'U74999KA2022PTC158273',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                meetingType: 'Extra-Ordinary General Meeting',
                meetingDate: '2024-05-15',
                meetingTime: '11:00 AM',
                meetingVenue: 'Registered Office at Bangalore',
                chairpersonName: 'Amit Shah',
                quorumPresent: true,
                resolutionType: 'Special Resolution',
                subjectMatter: 'Increase in Authorized Share Capital',
                resolutionDetails: 'Approval for the issuance of 10,000 Equity Shares of INR 10 each at a premium of INR 90 per share to existing shareholders on a rights basis.',
                statutoryReference: 'Section 61 of the Companies Act, 2013',
                authorizedPersonDetails: 'Vikram Singh (Director, DIN: 01234567)',
                certificationSignatory: 'Amit Shah (Director, DIN: 08765432)',
                placeOfSigning: 'Bangalore',
                proxies: 'Mr. Rahul Dravid (Proxy for Mr. Sachin Tendulkar)'
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
                        <p className="text-sm text-primary">Test the generator with sample data</p>
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

            {/* Company & Meeting Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Company & Meeting Details</h3>
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
                        <Label>CIN (Corporate Identity Number)</Label>
                        <Input
                            name="cin"
                            value={formData.cin}
                            onChange={handleInputChange}
                            placeholder="e.g. U12345KA2023PTC123456"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address</Label>
                        <Input
                            name="registeredOffice"
                            value={formData.registeredOffice}
                            onChange={handleInputChange}
                            placeholder="Complete address as per MCA"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Type</Label>
                        <Select
                            value={formData.meetingType || ''}
                            onValueChange={(value) => handleSelectChange('meetingType', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select meeting type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Annual General Meeting">Annual General Meeting (AGM)</SelectItem>
                                <SelectItem value="Extra-Ordinary General Meeting">Extra-Ordinary General Meeting (EGM)</SelectItem>
                                <SelectItem value="Class Meeting">Class Meeting</SelectItem>
                                <SelectItem value="Resolution by Circulation">Resolution by Circulation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Date</Label>
                        <Input
                            name="meetingDate"
                            value={formData.meetingDate}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Time</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="meetingTime"
                                className="pl-9"
                                value={formData.meetingTime}
                                onChange={handleInputChange}
                                placeholder="e.g. 11:00 AM"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Meeting Venue / Details</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="meetingVenue"
                                className="pl-9"
                                value={formData.meetingVenue}
                                onChange={handleInputChange}
                                placeholder="Full address or 'through electronic means'"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Chairperson Name</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="chairpersonName"
                                className="pl-9"
                                value={formData.chairpersonName}
                                onChange={handleInputChange}
                                placeholder="Name of person chairing"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                            id="quorumPresent"
                            checked={formData.quorumPresent !== false}
                            onCheckedChange={(checked) => handleSelectChange('quorumPresent', checked as string)}
                        />
                        <Label htmlFor="quorumPresent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Quorum was present throughout the meeting
                        </Label>
                    </div>
                </div>
            </section>

            {/* Resolution Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Resolution Content</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Resolution Type</Label>
                        <Select
                            value={formData.resolutionType || ''}
                            onValueChange={(value) => handleSelectChange('resolutionType', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Ordinary or Special" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ordinary Resolution">Ordinary Resolution</SelectItem>
                                <SelectItem value="Special Resolution">Special Resolution</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Subject Matter</Label>
                        <Input
                            name="subjectMatter"
                            value={formData.subjectMatter}
                            onChange={handleInputChange}
                            placeholder="e.g. Appointment of Director, Amendment of MOA"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Statutory Reference (Optional)</Label>
                        <Input
                            name="statutoryReference"
                            value={formData.statutoryReference}
                            onChange={handleInputChange}
                            placeholder="e.g. Section 13, Section 149 of Companies Act, 2013"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Resolution Details / Specific Action</Label>
                        <Textarea
                            name="resolutionDetails"
                            value={formData.resolutionDetails}
                            onChange={handleInputChange}
                            placeholder="Describe the decision or action being approved by shareholders..."
                            className="min-h-[120px]"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Authorized Person(s) Details</Label>
                        <Input
                            name="authorizedPersonDetails"
                            value={formData.authorizedPersonDetails}
                            onChange={handleInputChange}
                            placeholder="e.g. Rahul Varma (Director, DIN: 09871234)"
                        />
                    </div>
                </div>
            </section>

            {/* Certification & Signing */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Certification & Signing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Place of Signing</Label>
                        <Input
                            name="placeOfSigning"
                            value={formData.placeOfSigning}
                            onChange={handleInputChange}
                            placeholder="e.g. Mumbai, Bangalore"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Certification Signatory (Who signs the CTC?)</Label>
                        <Input
                            name="certificationSignatory"
                            value={formData.certificationSignatory}
                            onChange={handleInputChange}
                            placeholder="e.g. Amit Shah (Director, DIN: 1234)"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Proxies (Optional)</Label>
                        <Textarea
                            name="proxies"
                            value={formData.proxies}
                            onChange={handleInputChange}
                            placeholder="Details of any proxies present and the shareholders they represent..."
                            className="min-h-[80px]"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShareholderResolutionForm;
