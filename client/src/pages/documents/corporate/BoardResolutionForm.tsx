import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Building, Users, FileText, Calendar, MapPin, Sparkles, UserCheck } from "lucide-react";

interface BoardResolutionFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const BoardResolutionForm: React.FC<BoardResolutionFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'NexGen Robotics Technologies Pvt Ltd',
                cin: 'U72900KA2023PTC198273',
                registeredOffice: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
                meetingDate: new Date().toISOString().split('T')[0],
                meetingTime: '11:00 AM',
                meetingLocation: 'Registered Office at Mumbai',
                meetingPlaceType: 'Physical',
                quorumPresent: true,
                resolutionSubject: 'Opening of Corporate Bank Account',
                resolutionDetails: 'The Board discussed the requirement of opening a new current account for the company\'s operations in Gujarat and decided to approach HDFC Bank for the same.',
                bankName: 'HDFC Bank',
                bankBranchAddress: 'GIFT City, Gandhinagar, Gujarat',
                accountType: 'Current Account',
                modeOfOperation: 'Severally',
                chairpersonName: 'Anand Sharma',
                authorizedSignatoriesText: 'Rahul Varma (Director, DIN: 09871234), Aditi Nair (Director, DIN: 07654321)',
                directorsPresent: 'Anand Sharma, Rahul Varma, Aditi Nair',
                certificationSignatoryDetails: 'Anand Sharma (Director, DIN: 08765432)'
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
                        <p className="text-sm text-primary">Test the generator with sample board resolution data</p>
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
                    <h3 className="font-semibold text-lg">Company & Meeting Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Company Name</Label>
                        <Input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>CIN (Corporate Identity Number)</Label>
                        <Input name="cin" value={formData.cin} onChange={handleInputChange} placeholder="e.g. U72900KA2023PTC123456" />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Date</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input name="meetingDate" className="pl-9" value={formData.meetingDate} onChange={handleInputChange} type="date" />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address</Label>
                        <Input name="registeredOffice" value={formData.registeredOffice} onChange={handleInputChange} placeholder="Complete address as per MCA" />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Time</Label>
                        <Input name="meetingTime" value={formData.meetingTime} onChange={handleInputChange} placeholder="e.g. 11:30 AM" />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Type</Label>
                        <Select value={formData.meetingPlaceType || 'Physical'} onValueChange={(value) => handleSelectChange('meetingPlaceType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Physical">Physical Meeting</SelectItem>
                                <SelectItem value="Virtual">Video Conferencing / OAVM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Meeting Venue / Link Details</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input name="meetingLocation" className="pl-9" value={formData.meetingLocation} onChange={handleInputChange} placeholder="e.g. Registered Office, Bangalore OR Zoom Link" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
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

            {/* Resolution Subject & Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Resolution Subject & Details</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Resolution Subject</Label>
                        <Input name="resolutionSubject" value={formData.resolutionSubject} onChange={handleInputChange} placeholder="e.g. Opening of Bank Account / Appointment of Auditor" />
                    </div>
                    <div className="space-y-2">
                        <Label>Resolution Background / Details</Label>
                        <Textarea
                            name="resolutionDetails"
                            value={formData.resolutionDetails}
                            onChange={handleInputChange}
                            placeholder="Briefly describe the context and decision taken..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
            </section>

            {/* Bank Details (Conditional or optional for non-bank resolutions) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-muted-foreground">Bank Account Details (Optional)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Leave blank if not a bank resolution" />
                    </div>
                    <div className="space-y-2">
                        <Label>Bank Branch Address</Label>
                        <Input name="bankBranchAddress" value={formData.bankBranchAddress} onChange={handleInputChange} placeholder="Specific branch address" />
                    </div>
                    <div className="space-y-2">
                        <Label>Account Type</Label>
                        <Select value={formData.accountType || 'Current Account'} onValueChange={(value) => handleSelectChange('accountType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Current Account">Current Account</SelectItem>
                                <SelectItem value="Savings Account">Savings Account</SelectItem>
                                <SelectItem value="CC Account">CC Account (Cash Credit)</SelectItem>
                                <SelectItem value="OD Account">OD Account (Overdraft)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Mode of Operation</Label>
                        <Select value={formData.modeOfOperation || 'Severally'} onValueChange={(value) => handleSelectChange('modeOfOperation', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Severally">Severally (Any one)</SelectItem>
                                <SelectItem value="Jointly">Jointly (All Together)</SelectItem>
                                <SelectItem value="Any Two Jointly">Any Two Jointly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Attendance & Signatories */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Signatories & Chairperson</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Chairperson Name</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input name="chairpersonName" className="pl-9" value={formData.chairpersonName} onChange={handleInputChange} placeholder="Name of person chairing" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Authorized Signatories (Names & DIN)</Label>
                        <Input name="authorizedSignatoriesText" value={formData.authorizedSignatoriesText} onChange={handleInputChange} placeholder="e.g. Amit Shah (Director, DIN: 1234), ..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Directors Present (Names)</Label>
                        <Textarea name="directorsPresent" value={formData.directorsPresent} onChange={handleInputChange} placeholder="Names of all directors present (comma separated)" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Certification Details (Who signs the CTC?)</Label>
                        <Input name="certificationSignatoryDetails" value={formData.certificationSignatoryDetails} onChange={handleInputChange} placeholder="e.g. Amit Shah (Director, DIN: 1234)" />
                    </div>
                </div>
            </section>
        </div>
    );
};
