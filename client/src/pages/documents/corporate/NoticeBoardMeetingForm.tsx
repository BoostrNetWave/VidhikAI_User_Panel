import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MapPin, ListChecks, Sparkles, Clock, Shield, UserCheck, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NoticeBoardMeetingFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const NoticeBoardMeetingForm: React.FC<NoticeBoardMeetingFormProps> = ({
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
                noticeDate: new Date().toISOString().split('T')[0],
                meetingDate: '2024-06-20',
                meetingDay: 'Thursday',
                meetingTime: '11:00 AM',
                meetingVenue: 'Registered Office at Bangalore',
                modeOfMeeting: 'physical',
                agenda: '1. To confirm minutes of previous meeting\n2. To consider and approve financial statements\n3. To approve appointment of new director\n4. Opening of new bank account\n5. Any other business with permission of chair',
                directorsList: 'Anand Sharma, Rahul Varma, Aditi Nair',
                issuingAuthorityName: 'Amit Shah',
                issuingAuthorityDesignation: 'Director',
                virtualOption: true
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
                        <Label>CIN (Corporate Identity Number)</Label>
                        <Input
                            name="cin"
                            value={formData.cin}
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
                            placeholder="Complete address as per MCA"
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
                        <Label>Notice Date</Label>
                        <Input
                            name="noticeDate"
                            value={formData.noticeDate}
                            onChange={handleInputChange}
                            type="date"
                        />
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
                        <Label>Meeting Day</Label>
                        <Input
                            name="meetingDay"
                            value={formData.meetingDay}
                            onChange={handleInputChange}
                            placeholder="e.g. Monday, Tuesday"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Meeting Time</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="meetingTime"
                                value={formData.meetingTime || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. 11:30 AM"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Mode of Meeting</Label>
                        <Select
                            value={formData.modeOfMeeting || 'physical'}
                            onValueChange={(value) => handleSelectChange('modeOfMeeting', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="physical">Physical Meeting</SelectItem>
                                <SelectItem value="virtual">Through Electronic Means (VC)</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="circulation">Resolution by Circulation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Meeting Venue / Link Details</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="meetingVenue"
                                value={formData.meetingVenue}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Full address or VC link"
                                required
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Directors List (Optional)</Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="directorsList"
                                value={formData.directorsList}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. Amit Shah, Rahul Varma (separated by commas)"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Issuing Authority */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Authority & Signing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Issuing Authority Name</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="issuingAuthorityName"
                                value={formData.issuingAuthorityName}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="Name of person signing"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Issuing Authority Designation</Label>
                        <Select
                            value={formData.issuingAuthorityDesignation || ''}
                            onValueChange={(value) => handleSelectChange('issuingAuthorityDesignation', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select designation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Director">Director</SelectItem>
                                <SelectItem value="Company Secretary">Company Secretary</SelectItem>
                                <SelectItem value="Authorised Signatory">Authorised Signatory</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Agenda Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <ListChecks className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Agenda of the Meeting</h3>
                </div>
                <div className="space-y-2">
                    <Label>Agenda Items</Label>
                    <Textarea
                        name="agenda"
                        value={formData.agenda}
                        onChange={handleInputChange}
                        placeholder="List the matters to be discussed at the meeting..."
                        className="min-h-[150px]"
                        required
                    />
                    <p className="text-xs text-muted-foreground">Tip: Number each agenda item for better clarity.</p>
                </div>
            </section>
        </div>
    );
};

export default NoticeBoardMeetingForm;
