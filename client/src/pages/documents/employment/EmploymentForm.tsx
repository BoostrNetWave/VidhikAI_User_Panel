import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Briefcase, DollarSign, Gavel, FileText, Sparkles } from "lucide-react";

interface EmploymentFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const EmploymentForm: React.FC<EmploymentFormProps> = ({ formData, handleInputChange, handleSelectChange, setFormData }) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                employerName: 'Vidhik AI Technologies Pvt Ltd',
                employerRegNumber: 'U72900MH2024PTC123456',
                employerAddress: 'Level 4, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
                employeeName: 'Rahul Deshmukh',
                employeeEmail: 'rahul.d@example.com',
                employeePhone: '+91 9820012345',
                employeeAddress: 'Flat 202, Silver Oaks Apartments, Powai, Mumbai 400076',
                jobTitle: 'Senior Software Engineer',
                department: 'Engineering',
                reportingManager: 'Vikas Mehta (CTO)',
                startDate: '2024-04-01',
                employmentType: 'Permanent',
                workLocation: 'Mumbai Office',
                salaryAmount: '2,400,000',
                salaryFrequency: 'Annually',
                salaryBreakdown: 'Basic: 50%, HRA: 20%, Special Allowance: 30%',
                leaveEntitlements: '24 Earned Leaves, 12 Sick Leaves',
                insuranceBenefits: 'Group Health Insurance (₹5 Lakhs cover)',
                probationApplicable: 'Yes',
                probationDuration: '6 Months',
                confidentialityScope: 'All trade secrets, source code, client data, and business strategies.',
                ipOwnership: 'Company owns all IP created during employment.',
                nonCompete: 'Yes',
                noticePeriodEmployee: '90 Days',
                noticePeriodEmployer: '30 Days',
                terminationGrounds: 'Misconduct, Breach of Contract, Underperformance',
                governingLaw: 'Laws of India',
                jurisdiction: 'Courts in Mumbai',
                placeSigning: 'Mumbai',
                dateSigning: new Date().toISOString().split('T')[0],
                authSignatoryName: 'Vikas Mehta',
                authSignatoryDesignation: 'Director'
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
            {/* Employer Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Employer Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Legal Name</Label>
                        <Input name="employerName" value={formData.employerName} onChange={handleInputChange} placeholder="e.g. Acme Corp LLC" />
                    </div>
                    <div className="space-y-2">
                        <Label>Registration Number</Label>
                        <Input name="employerRegNumber" value={formData.employerRegNumber} onChange={handleInputChange} placeholder="CIN / LLPIN / Reg No." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Address</Label>
                        <Textarea
                            name="employerAddress"
                            value={formData.employerAddress}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Full registered address"
                        />
                    </div>
                </div>
            </section>

            {/* Employee Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Employee Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input name="employeeName" value={formData.employeeName} onChange={handleInputChange} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input name="employeeEmail" value={formData.employeeEmail} onChange={handleInputChange} placeholder="john@example.com" type="email" />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input name="employeePhone" value={formData.employeePhone} onChange={handleInputChange} placeholder="+91 9876543210" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Residential Address</Label>
                        <Textarea
                            name="employeeAddress"
                            value={formData.employeeAddress}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Full residential address"
                        />
                    </div>
                </div>
            </section>

            {/* Employment Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Employment Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="Senior Software Engineer" />
                    </div>
                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="Engineering" />
                    </div>
                    <div className="space-y-2">
                        <Label>Reporting Manager</Label>
                        <Input name="reportingManager" value={formData.reportingManager} onChange={handleInputChange} placeholder="CTO" />
                    </div>
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Employment Type</Label>
                        <Select value={formData.employmentType} onValueChange={(val: any) => handleSelectChange('employmentType', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Permanent">Permanent</SelectItem>
                                <SelectItem value="Fixed-term">Fixed-term</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Work Location</Label>
                        <Input name="workLocation" value={formData.workLocation} onChange={handleInputChange} placeholder="Bangalore Office / Remote" />
                    </div>
                </div>
            </section>

            {/* Compensation */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Compensation</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Salary Amount</Label>
                        <Input name="salaryAmount" value={formData.salaryAmount} onChange={handleInputChange} placeholder="e.g. 1,500,000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select value={formData.salaryFrequency} onValueChange={(val: any) => handleSelectChange('salaryFrequency', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Annually">Annually</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Salary Breakdown</Label>
                        <Textarea
                            name="salaryBreakdown"
                            value={formData.salaryBreakdown}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Basic, HRA, Special Allowance, etc."
                        />
                    </div>
                </div>
            </section>

            {/* Benefits & Probation */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Benefits & Probation</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Leave Entitlements</Label>
                        <Input name="leaveEntitlements" value={formData.leaveEntitlements} onChange={handleInputChange} placeholder="e.g. 18 Earned Leaves, 12 Sick Leaves" />
                    </div>
                    <div className="space-y-2">
                        <Label>Insurance Benefits</Label>
                        <Input name="insuranceBenefits" value={formData.insuranceBenefits} onChange={handleInputChange} placeholder="Health Insurance details" />
                    </div>
                    <div className="space-y-2">
                        <Label>Probation Applicable?</Label>
                        <Select value={formData.probationApplicable} onValueChange={(val: any) => handleSelectChange('probationApplicable', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.probationApplicable === 'Yes' && (
                        <div className="space-y-2">
                            <Label>Probation Duration</Label>
                            <Input name="probationDuration" value={formData.probationDuration} onChange={handleInputChange} placeholder="e.g. 6 Months" />
                        </div>
                    )}
                </div>
            </section>

            {/* Confidentiality & IP */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Confidentiality & Intellectual Property</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Confidentiality Scope</Label>
                        <Textarea
                            name="confidentialityScope"
                            value={formData.confidentialityScope}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Define what constitutes confidential information"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>IP Ownership Terms</Label>
                        <Input name="ipOwnership" value={formData.ipOwnership} onChange={handleInputChange} placeholder="Company owns all IP created..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Non-Compete Applicable?</Label>
                        <Select value={formData.nonCompete} onValueChange={(val: any) => handleSelectChange('nonCompete', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Termination & Legal */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Termination & Legal</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Notice Period (Employee)</Label>
                        <Input name="noticePeriodEmployee" value={formData.noticePeriodEmployee} onChange={handleInputChange} placeholder="e.g. 30 Days" />
                    </div>
                    <div className="space-y-2">
                        <Label>Notice Period (Employer)</Label>
                        <Input name="noticePeriodEmployer" value={formData.noticePeriodEmployer} onChange={handleInputChange} placeholder="e.g. 30 Days" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Termination Grounds</Label>
                        <Textarea
                            name="terminationGrounds"
                            value={formData.terminationGrounds}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Misconduct, Fraud, Breach of Contract..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input name="governingLaw" value={formData.governingLaw} onChange={handleInputChange} placeholder="e.g. Laws of India" />
                    </div>
                    <div className="space-y-2">
                        <Label>Jurisdiction</Label>
                        <Input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. Courts in Bangalore" />
                    </div>
                </div>
            </section>

            {/* Execution Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Execution Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Place of Signing</Label>
                        <Input name="placeSigning" value={formData.placeSigning} onChange={handleInputChange} placeholder="City, State" />
                    </div>
                    <div className="space-y-2">
                        <Label>Date of Signing</Label>
                        <Input name="dateSigning" value={formData.dateSigning} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Authorized Signatory Name</Label>
                        <Input name="authSignatoryName" value={formData.authSignatoryName} onChange={handleInputChange} placeholder="Name of Employer Rep" />
                    </div>
                    <div className="space-y-2">
                        <Label>Authorized Signatory Designation</Label>
                        <Input name="authSignatoryDesignation" value={formData.authSignatoryDesignation} onChange={handleInputChange} placeholder="e.g. Director / HR Head" />
                    </div>
                </div>
            </section>
        </div>
    );
};
