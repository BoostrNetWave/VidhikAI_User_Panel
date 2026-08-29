import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, UserMinus, Sparkles, UserCheck, Calendar, FileText, Handshake } from "lucide-react";

interface DirectorResignationFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormData?: (data: any) => void;
}

const DirectorResignationForm: React.FC<DirectorResignationFormProps> = ({
    formData,
    handleInputChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'Vidhik AI Solutions Private Limited',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                directorName: 'Mr. Arvind Kejriwal',
                din: '01234567',
                designation: 'Independent Director',
                resignationDate: new Date().toISOString().split('T')[0],
                effectiveDate: new Date().toISOString().split('T')[0],
                reason: 'Due to personal reasons and other professional commitments.',
                transitionSupportRequired: true,
                additionalStatements: 'I confirm that there are no outstanding claims or disputes with the company.'
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
                        <p className="text-sm text-primary">Test the generator with sample resignation data</p>
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
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address (Optional)</Label>
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
                    <UserMinus className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Director Information</h3>
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
                        <Label>DIN (Optional)</Label>
                        <Input
                            name="din"
                            value={formData.din}
                            onChange={handleInputChange}
                            placeholder="e.g. 01234567"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            placeholder="e.g. Managing Director, Independent Director"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Resignation Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Resignation Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Resignation Letter Date</Label>
                        <Input
                            name="resignationDate"
                            value={formData.resignationDate}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Effective Date of Resignation</Label>
                        <Input
                            name="effectiveDate"
                            value={formData.effectiveDate}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Reason for Resignation (Optional)</Label>
                        <Textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            placeholder="e.g. Personal reasons, professional commitments..."
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox
                            id="transitionSupportRequired"
                            checked={formData.transitionSupportRequired || false}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, transitionSupportRequired: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="transitionSupportRequired" className="cursor-pointer font-normal flex items-center gap-2">
                            <Handshake className="h-4 w-4 text-muted-foreground" />
                            Will provide support during transition period
                        </Label>
                    </div>
                </div>
            </section>

            {/* Additional Statements */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Additional Statements</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Additional Statements (Optional)</Label>
                        <Textarea
                            name="additionalStatements"
                            value={formData.additionalStatements}
                            onChange={handleInputChange}
                            placeholder="e.g. Confirmation of no dues, gratefulness to the Board, etc."
                        />
                        <p className="text-xs text-muted-foreground">
                            Use this for any specific legal confirmations or professional closing remarks.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DirectorResignationForm;
