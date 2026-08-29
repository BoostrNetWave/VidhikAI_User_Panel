import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Briefcase, DollarSign, Gavel, Calendar, Sparkles } from "lucide-react";

interface ConsultantFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const ConsultantForm: React.FC<ConsultantFormProps> = ({ formData, handleInputChange, handleSelectChange, setFormData }) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                clientName: 'Digital Flow Innovations Pvt Ltd',
                clientAddress: 'Third Floor, Cyber Hub, DLF Phase 3, Gurgaon, Haryana 122002',
                clientRegNumber: 'U74140HR2023PTC654321',
                consultantName: 'Kaveri Analytics & Advisory',
                consultantAddress: '15th Main, Sector 7, HSR Layout, Bangalore 560102',
                consultantPAN: 'AAACK1234L',
                consultantGST: '29AAACK1234L1Z5',
                effectiveDate: new Date().toISOString().split('T')[0],
                term: '6 Months',
                autoRenewal: 'No',
                servicesDescription: 'Strategic market analysis for FinTech expansion in Southeast Asia. Includes competitor bench-marking and product-market fit reports.',
                deliverables: 'Bi-weekly strategic reports and one final expansion blueprint.',
                milestones: 'Phase 1: Market Analysis (Month 2); Phase 2: Competitor Review (Month 4); Phase 3: Final Blueprint (Month 6)',
                consultancyFee: '2,50,000',
                paymentTerms: 'Within 7 days of milestone completion',
                paymentSchedule: 'Milestone-based (30% on start, 40% on mid-term, 30% on completion)',
                expenseReimbursement: 'Yes',
                confidentiality: 'Strict non-disclosure of all Client business models and expansion strategies.',
                ipOwnership: 'Full assignment of all report contents to Client upon full payment of fees.',
                terminationNotice: '15 Days',
                governingLaw: 'Laws of India',
                jurisdiction: 'Delhi, India'
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
            {/* Parties: Client */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Client Details (Entity/Person hiring)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Client Legal Name</Label>
                        <Input name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="e.g. Acme Tech Solutions Pvt Ltd" />
                    </div>
                    <div className="space-y-2">
                        <Label>Client Registration Number (Optional)</Label>
                        <Input name="clientRegNumber" value={formData.clientRegNumber} onChange={handleInputChange} placeholder="CIN / LLPIN" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Client Registered Address</Label>
                        <Textarea
                            name="clientAddress"
                            value={formData.clientAddress}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Full registered address of the client company"
                        />
                    </div>
                </div>
            </section>

            {/* Parties: Consultant */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Consultant Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Consultant Full Name / Firm Name</Label>
                        <Input name="consultantName" value={formData.consultantName} onChange={handleInputChange} placeholder="John Doe or JD Consulting" />
                    </div>
                    <div className="space-y-2">
                        <Label>Consultant PAN</Label>
                        <Input name="consultantPAN" value={formData.consultantPAN} onChange={handleInputChange} placeholder="ABCDE1234F" />
                    </div>
                    <div className="space-y-2">
                        <Label>Consultant GSTIN (Optional)</Label>
                        <Input name="consultantGST" value={formData.consultantGST} onChange={handleInputChange} placeholder="29XXXXX..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Consultant Address</Label>
                        <Textarea
                            name="consultantAddress"
                            value={formData.consultantAddress}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Full address of the consultant"
                        />
                    </div>
                </div>
            </section>

            {/* Scope of Work */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Scope of Services</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Description of Services</Label>
                        <Textarea
                            name="servicesDescription"
                            value={formData.servicesDescription}
                            onChange={handleInputChange}
                            className="min-h-[100px]"
                            placeholder="Detailed description of the consulting services to be provided..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Key Deliverables</Label>
                            <Input name="deliverables" value={formData.deliverables} onChange={handleInputChange} placeholder="e.g. Monthly reports, Software code, Design docs" />
                        </div>
                        <div className="space-y-2">
                            <Label>Milestones (Optional)</Label>
                            <Input name="milestones" value={formData.milestones} onChange={handleInputChange} placeholder="Specific dates or events for delivery" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Agreement Terms */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Agreement Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Effective Date</Label>
                        <Input name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Term (Duration)</Label>
                        <Input name="term" value={formData.term} onChange={handleInputChange} placeholder="e.g. 6 Months, 1 Year, Until Project Completion" />
                    </div>
                    <div className="space-y-2">
                        <Label>Auto-Renewal?</Label>
                        <Select value={formData.autoRenewal} onValueChange={(val: any) => handleSelectChange('autoRenewal', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Termination Notice Period</Label>
                        <Input name="terminationNotice" value={formData.terminationNotice} onChange={handleInputChange} placeholder="e.g. 15 Days, 1 Month" />
                    </div>
                </div>
            </section>

            {/* Compensation */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Compensation & Payment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Consultancy Fee</Label>
                        <Input name="consultancyFee" value={formData.consultancyFee} onChange={handleInputChange} placeholder="e.g. ₹50,000 per month or ₹5,00,000 fixed" />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Input name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} placeholder="e.g. Within 7 days of invoice" />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Schedule</Label>
                        <Input name="paymentSchedule" value={formData.paymentSchedule} onChange={handleInputChange} placeholder="e.g. Monthly, Bi-weekly, Milestone-based" />
                    </div>
                    <div className="space-y-2">
                        <Label>Expense Reimbursement?</Label>
                        <Select value={formData.expenseReimbursement} onValueChange={(val: any) => handleSelectChange('expenseReimbursement', val)}>
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

            {/* Legal Clauses */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Legal & Compliance</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Confidentiality Obligations</Label>
                        <Textarea
                            name="confidentiality"
                            value={formData.confidentiality}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="e.g. Standard non-disclosure of all client proprietary data"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Intellectual Property Ownership</Label>
                        <Textarea
                            name="ipOwnership"
                            value={formData.ipOwnership}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="e.g. All work product belongs to Client upon payment"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input name="governingLaw" value={formData.governingLaw} onChange={handleInputChange} placeholder="e.g. Laws of India" />
                    </div>
                    <div className="space-y-2">
                        <Label>Jurisdiction</Label>
                        <Input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. Courts in Delhi" />
                    </div>
                </div>
            </section>
        </div>
    );
};
