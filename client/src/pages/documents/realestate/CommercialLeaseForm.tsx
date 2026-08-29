import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Home, Calendar, IndianRupee, Gavel, ShieldCheck, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CommercialLeaseFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const CommercialLeaseForm: React.FC<CommercialLeaseFormProps> = ({ formData, handleInputChange, handleSelectChange, setFormData }) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                lessorName: 'Real Estate Ventures Pvt Ltd',
                lessorPAN: 'ABCDE1234F',
                lessorAddress: 'Basement, Unit 4, Commercial Plaza, Bandra East, Mumbai 400051',
                lesseeName: 'Tech Innovate Solutions LLC',
                lesseePAN: 'FGHIJ5678K',
                lesseeAddress: 'Floor 12, Tower B, Cyber City, Gurgaon 122002',
                propertyAddress: 'Unit 502, 5th Floor, Corporate Park, MG Road, Bangalore 560001',
                propertyType: 'Office Space',
                leaseArea: '2,500 Sq. Ft.',
                leaseTerm: '36 Months',
                commencementDate: new Date().toISOString().split('T')[0],
                monthlyRent: '1,50,000',
                securityDeposit: '4,50,000',
                maintenanceCharges: '15,000',
                gstApplicable: true,
                lockInPeriod: '12 Months',
                noticePeriod: '3 Months',
                escalationRate: '5% annually',
                permittedUse: 'Commercial Office related to IT/ITES services.'
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
            {/* Parties Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Parties Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Lessor (Landlord) Name</Label>
                        <Input name="lessorName" value={formData.lessorName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Lessor PAN</Label>
                        <Input name="lessorPAN" value={formData.lessorPAN} onChange={handleInputChange} placeholder="e.g. ABCDE1234F" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Lessor Address</Label>
                        <Input name="lessorAddress" value={formData.lessorAddress} onChange={handleInputChange} placeholder="Residential or Office address" />
                    </div>

                    <div className="md:col-span-2 pt-4 border-t"></div>

                    <div className="space-y-2">
                        <Label>Lessee (Tenant) Company Name</Label>
                        <Input name="lesseeName" value={formData.lesseeName} onChange={handleInputChange} placeholder="Full legal company name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Lessee CIN</Label>
                        <Input name="lesseeID" value={formData.lesseeID} onChange={handleInputChange} placeholder="e.g. U72900..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Lessee Registered Office</Label>
                        <Input name="lesseeAddress" value={formData.lesseeAddress} onChange={handleInputChange} placeholder="Company registered office" />
                    </div>
                </div>
            </section>

            {/* Property Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Property (Demised Premises)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Full Property Address</Label>
                        <Input name="propertyAddress" value={formData.propertyAddress} onChange={handleInputChange} placeholder="Complete address of the premises" />
                    </div>
                    <div className="space-y-2">
                        <Label>Unit / Floor Details</Label>
                        <Input name="unitDetails" value={formData.unitDetails} onChange={handleInputChange} placeholder="e.g. Unit 301, 3rd Floor" />
                    </div>
                    <div className="space-y-2">
                        <Label>Super Built-up Area (Sq. Ft.)</Label>
                        <Input name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g. 2,500 Sq. Ft." />
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
                        <Label>Lease Term (Years/Months)</Label>
                        <Input name="leaseTerm" value={formData.leaseTerm} onChange={handleInputChange} placeholder="e.g. 3 Years" />
                    </div>
                    <div className="space-y-2">
                        <Label>Lock-in Period</Label>
                        <Input name="lockInPeriod" value={formData.lockInPeriod} onChange={handleInputChange} placeholder="e.g. 1 Year" />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <Label>Permitted Use</Label>
                        <Input name="permittedUse" value={formData.permittedUse} onChange={handleInputChange} placeholder="e.g. IT Office / Retail Showroom" />
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
                        <Label>Monthly Rent (Excluding GST)</Label>
                        <Input name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} placeholder="e.g. INR 1,50,000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Security Deposit (Refundable)</Label>
                        <Input name="securityDepositAmount" value={formData.securityDepositAmount} onChange={handleInputChange} placeholder="e.g. INR 9,00,000 (6 Months)" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Rent Escalation Terms</Label>
                        <Input name="escalationTerms" value={formData.escalationTerms} onChange={handleInputChange} placeholder="e.g. 5% increase every year" />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox
                            id="gstApplicable"
                            checked={formData.gstApplicable}
                            onCheckedChange={(checked: any) => handleSelectChange('gstApplicable', checked)}
                        />
                        <Label htmlFor="gstApplicable">GST Applicable on Rent</Label>
                    </div>
                </div>
            </section>

            {/* Operations & Maintenance */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Maintenance & Operations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Maintenance Responsibility (CAM)</Label>
                        <Input name="maintenanceStructure" value={formData.maintenanceStructure} onChange={handleInputChange} placeholder="e.g. Lessee pays CAM and Utilities; Lessor pays Property Tax" />
                    </div>
                    <div className="space-y-2">
                        <Label>Termination Notice Period</Label>
                        <Input name="terminationNoticePeriod" value={formData.terminationNoticePeriod} onChange={handleInputChange} placeholder="e.g. 3 Months" />
                    </div>
                    <div className="space-y-2">
                        <Label>Registration Responsibility</Label>
                        <Input name="registrationResponsibility" value={formData.registrationResponsibility} onChange={handleInputChange} placeholder="e.g. Shared equally (50:50)" />
                    </div>
                </div>
            </section>

            {/* Dispute */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Dispute Resolution</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <Label>Arbitration & Jurisdiction</Label>
                        <Input name="disputeResolutionDetails" value={formData.disputeResolutionDetails} onChange={handleInputChange} placeholder="e.g. Arbitration in Pune; Jurisdiction of Pune Courts" />
                    </div>
                </div>
            </section>
        </div>
    );
};
