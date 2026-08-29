import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MapPin, Users, ListChecks, Sparkles, UserCheck, FileText, Clock, Shield } from "lucide-react";

interface MinutesBoardMeetingFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const MinutesBoardMeetingForm: React.FC<MinutesBoardMeetingFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange: _handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'Vidhik AI Solutions Private Limited',
                cin: 'U72900KA2024PTC123456',
                registeredOffice: 'No. 12, MG Road, Bangalore - 560001, Karnataka, India',
                meetingNumber: '02/2024-25',
                meetingDate: '2024-06-20',
                meetingTime: '11:00 AM',
                meetingVenue: 'Registered Office of the Company',
                chairpersonName: 'Mr. Rajesh Kumar',
                directorsPresent: 'Mr. Rajesh Kumar, Ms. Priya Sharma, Mr. Amit Singh',
                directorsAbsent: 'None',
                directorsOnLeave: 'Mr. Sunil Varma',
                invitees: 'Mr. Suresh (Statutory Auditor)',
                resolutionsPassed: '1. Noted the minutes of the previous board meeting held on April 15, 2024.\n2. Approved the quarterly financial results for the period ended March 31, 2024.\n3. Ratified the appointment of Mr. Sunil as the Internal Auditor.\n4. Authorized the opening of a new bank account with HDFC Bank.',
                interestedDirectors: 'None',
                conclusionTime: '12:30 PM',
                authorizedSignatory: 'Mr. Rajesh Kumar',
                otherBusiness: 'The Board discussed the expansion plans into the Middle East market.',
                nextMeetingInfo: 'The next meeting is tentatively scheduled for September 2024.'
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
                        <p className="text-sm text-primary">Test the generator with sample board minutes data</p>
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
                    <h3 className="font-semibold text-lg">Company Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label>CIN (Optional)</Label>
                        <Input
                            name="cin"
                            value={formData.cin}
                            onChange={handleInputChange}
                            placeholder="Corporate Identification Number"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Number (Optional)</Label>
                        <Input
                            name="meetingNumber"
                            value={formData.meetingNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. 02/2024-25"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office</Label>
                        <Input
                            name="registeredOffice"
                            value={formData.registeredOffice}
                            onChange={handleInputChange}
                            placeholder="Registered office address of the company"
                        />
                    </div>
                </div>
            </section>

            {/* Meeting Logistics */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Meeting Logistics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Input
                            name="meetingTime"
                            value={formData.meetingTime}
                            onChange={handleInputChange}
                            placeholder="e.g. 11:30 AM"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Meeting Venue</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="meetingVenue"
                                value={formData.meetingVenue}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Complete address of the meeting venue"
                                required
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Attendance & Leadership */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Attendance & Leadership</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Chairperson Name</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="chairpersonName"
                                value={formData.chairpersonName}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Name of the person who chaired the meeting"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Directors Present (Comma separated)</Label>
                        <Textarea
                            name="directorsPresent"
                            value={formData.directorsPresent}
                            onChange={handleInputChange}
                            placeholder="e.g. Mr. A, Ms. B, Dr. C"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Directors Absent (Optional)</Label>
                            <Input
                                name="directorsAbsent"
                                value={formData.directorsAbsent}
                                onChange={handleInputChange}
                                placeholder="Names of directors who were absent"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Directors on Leave (Optional)</Label>
                            <Input
                                name="directorsOnLeave"
                                value={formData.directorsOnLeave}
                                onChange={handleInputChange}
                                placeholder="Names of directors granted leave of absence"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Invitees (Optional)</Label>
                            <Input
                                name="invitees"
                                value={formData.invitees}
                                onChange={handleInputChange}
                                placeholder="e.g. Auditors, CFO, etc."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Conclusion Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="conclusionTime"
                                    value={formData.conclusionTime}
                                    onChange={handleInputChange}
                                    className="pl-9"
                                    placeholder="e.g. 12:30 PM"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proceedings & Resolutions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <ListChecks className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Proceedings & Resolutions</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Resolutions Passed</Label>
                        <Textarea
                            name="resolutionsPassed"
                            value={formData.resolutionsPassed}
                            onChange={handleInputChange}
                            placeholder="Detail the resolutions passed during the meeting..."
                            className="min-h-[150px]"
                            required
                        />
                        <p className="text-xs text-muted-foreground">Tip: Number each resolution for better clarity.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Interested Directors (if any)</Label>
                        <Input
                            name="interestedDirectors"
                            value={formData.interestedDirectors}
                            onChange={handleInputChange}
                            placeholder="e.g. Mr. X (interested in Item 4)"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Authorized Signatory (for filing/execution)</Label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="authorizedSignatory"
                                value={formData.authorizedSignatory}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Name of person authorized"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Other Business (Optional)</Label>
                        <Textarea
                            name="otherBusiness"
                            value={formData.otherBusiness}
                            onChange={handleInputChange}
                            placeholder="Any other matters discussed..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Next Meeting Info (Optional)</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="nextMeetingInfo"
                                value={formData.nextMeetingInfo}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Information about the next board meeting"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MinutesBoardMeetingForm;
