import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, User, Calendar, IndianRupee, Gavel, ShieldCheck, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResidentialLeaseFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const ResidentialLeaseForm: React.FC<ResidentialLeaseFormProps> = ({ formData, handleInputChange, handleSelectChange, setFormData }) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                landlordName: 'Suresh Kumar',
                landlordPAN: 'ABCDE1234F',
                landlordAddress: 'Flat 102, Blue Bell Apartments, Indiranagar, Bangalore 560038',
                tenantName: 'Amitabh Bachchan',
                tenantPAN: 'FGHIJ5678K',
                tenantAddress: 'Jalsa, Juhu, Mumbai 400049',
                propertyAddress: 'Villa 45, Palm Meadows, Whitefield, Bangalore 560066',
                propertyType: 'Villa',
                leaseArea: '4,000 Sq. Ft.',
                leaseTerm: '11 Months',
                commencementDate: new Date().toISOString().split('T')[0],
                monthlyRent: '85,000',
                securityDeposit: '4,00,000',
                maintenanceCharges: '7,500',
                lockInPeriod: '6 Months',
                noticePeriod: '1 Month',
                permittedUse: 'Residential purposes for self and family.'
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
            {/* Landlord & Tenant Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Parties Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Landlord Full Name</Label>
                        <Input name="landlordName" value={formData.landlordName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Landlord PAN (Optional)</Label>
                        <Input name="landlordPAN" value={formData.landlordPAN} onChange={handleInputChange} placeholder="e.g. ABCDE1234F" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Landlord Permanent Address</Label>
                        <Input name="landlordAddress" value={formData.landlordAddress} onChange={handleInputChange} placeholder="Current residential address of Landlord" />
                    </div>

                    <div className="md:col-span-2 pt-4 border-t"></div>

                    <div className="space-y-2">
                        <Label>Tenant Full Name</Label>
                        <Input name="tenantName" value={formData.tenantName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Tenant ID Proof Details</Label>
                        <Input name="tenantID" value={formData.tenantID} onChange={handleInputChange} placeholder="e.g. Aadhaar / PASSPORT Number" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Tenant Permanent Address</Label>
                        <Input name="tenantAddress" value={formData.tenantAddress} onChange={handleInputChange} placeholder="Permanent home address of Tenant" />
                    </div>
                </div>
            </section>

            {/* Property Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Property Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Full Property Address</Label>
                        <Input name="propertyAddress" value={formData.propertyAddress} onChange={handleInputChange} placeholder="Complete address of the rented premises" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Detailed Property Description</Label>
                        <Input name="propertyDescription" value={formData.propertyDescription} onChange={handleInputChange} placeholder="e.g. 2 BHK Apartment with 2 Bathrooms, 1 Balcony" />
                    </div>
                    <div className="space-y-2">
                        <Label>Furnishing Details (Optional)</Label>
                        <Input name="furnishingDetails" value={formData.furnishingDetails} onChange={handleInputChange} placeholder="e.g. Semi-furnished with Wardrobes, Fans, and Geysers" />
                    </div>
                    <div className="space-y-2">
                        <Label>Parking Details (Optional)</Label>
                        <Input name="parkingDetails" value={formData.parkingDetails} onChange={handleInputChange} placeholder="e.g. 1 Covered Four-Wheeler Parking" />
                    </div>
                </div>
            </section>

            {/* Lease Term */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Lease Term</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Commencement Date</Label>
                        <Input name="commencementDate" value={formData.commencementDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Lease Duration</Label>
                        <Input name="leaseDuration" value={formData.leaseDuration} onChange={handleInputChange} placeholder="e.g. 11 Months" />
                    </div>
                    <div className="space-y-2">
                        <Label>Lock-in Period (Optional)</Label>
                        <Input name="lockInPeriod" value={formData.lockInPeriod} onChange={handleInputChange} placeholder="e.g. 6 Months" />
                    </div>
                </div>
            </section>

            {/* Financials */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Rent & Security Deposit</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Monthly Rent Amount</Label>
                        <Input name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} placeholder="e.g. INR 25,000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Rent Due Date (Day of Month)</Label>
                        <Input name="rentDueDate" value={formData.rentDueDate} onChange={handleInputChange} placeholder="e.g. 5th of every month" />
                    </div>
                    <div className="space-y-2">
                        <Label>Security Deposit Amount</Label>
                        <Input name="securityDepositAmount" value={formData.securityDepositAmount} onChange={handleInputChange} placeholder="e.g. INR 50,000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Rent Escalation Terms (Optional)</Label>
                        <Input name="escalationTerms" value={formData.escalationTerms} onChange={handleInputChange} placeholder="e.g. 5% upon renewal" />
                    </div>
                </div>
            </section>

            {/* Rules & Maintenance */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Rules & Maintenance</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Notice Period for Termination</Label>
                        <Input name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} placeholder="e.g. 1 Month" />
                    </div>
                    <div className="space-y-2">
                        <Label>Registration Responsibility</Label>
                        <Input name="registrationResponsibility" value={formData.registrationResponsibility} onChange={handleInputChange} placeholder="e.g. Shared equally (50:50)" />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox
                            id="societyRulesApplicable"
                            checked={formData.societyRulesApplicable}
                            onCheckedChange={(checked: any) => handleSelectChange('societyRulesApplicable', checked)}
                        />
                        <Label htmlFor="societyRulesApplicable">Housing Society Rules Applicable</Label>
                    </div>
                </div>
            </section>

            {/* Dispute */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Dispute Resolution</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Resolution Preference</Label>
                        <Select value={formData.disputeResolutionPreference} onValueChange={(value: any) => handleSelectChange('disputeResolutionPreference', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="court">Local Courts Jurisdiction</SelectItem>
                                <SelectItem value="arbitration">Arbitration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
        </div>
    );
};
