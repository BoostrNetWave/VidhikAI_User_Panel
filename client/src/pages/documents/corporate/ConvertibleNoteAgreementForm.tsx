import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Building,
    User,
    Sparkles,
    IndianRupee,
    TrendingUp,
    Percent,
    Scale
} from "lucide-react";

interface ConvertibleNoteAgreementFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const ConvertibleNoteAgreementForm: React.FC<ConvertibleNoteAgreementFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                company_name: 'StellarAI Technologies Private Limited',
                company_cin: 'U72200KA2023PTC987654',
                registered_office: 'Level 5, HSR Layout, Sector 6, Bangalore, Karnataka 560102',
                investor_name: 'Nexus Ventures LLP',
                investor_address: '22nd Floor, Nariman Point, Mumbai, Maharashtra 400021',
                principal_amount: '25,00,000',
                interest_rate: '8% per annum',
                issue_date: new Date().toISOString().split('T')[0],
                maturity_date: '2026-03-31',
                valuation_cap: '15,00,00,000',
                discount_rate: '20',
                qualified_financing_threshold: '1,00,00,000',
                conversion_type: 'automatic',
                repayment_on_maturity: true,
                governing_law: 'Laws of India',
                arbitration_clause: 'The seat of arbitration shall be Bangalore, conducted under the rules of SIAC.',
                foreign_investor: false,
                additional_rights: 'The Investor shall be entitled to one Board Observer position until the completion of the Qualified Financing.'
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
                        <p className="text-sm text-primary">Test the generator with sample investment data</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Company Name</Label>
                        <Input
                            name="company_name"
                            value={formData.company_name || ''}
                            onChange={handleInputChange}
                            placeholder="Full legal name of the company"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company CIN</Label>
                        <Input
                            name="company_cin"
                            value={formData.company_cin || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. U74999KA2023PTC123456"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address</Label>
                        <Input
                            name="registered_office"
                            value={formData.registered_office || ''}
                            onChange={handleInputChange}
                            placeholder="Full registered address"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Investor Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Investor Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Investor Name</Label>
                        <Input
                            name="investor_name"
                            value={formData.investor_name || ''}
                            onChange={handleInputChange}
                            placeholder="Name of individual or entity"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                            id="foreign_investor"
                            checked={formData.foreign_investor === true}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, foreign_investor: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="foreign_investor" className="cursor-pointer font-normal">
                            This is a Foreign Investor (requires FEMA compliance)
                        </Label>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Investor Address</Label>
                        <Input
                            name="investor_address"
                            value={formData.investor_address || ''}
                            onChange={handleInputChange}
                            placeholder="Full address of the investor"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Financial Terms */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Financial Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Principal Amount</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="principal_amount"
                                value={formData.principal_amount || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. 5,00,000"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Interest Rate (Optional)</Label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="interest_rate"
                                value={formData.interest_rate || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. 8% per annum (or leave blank for interest-free)"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Issue Date</Label>
                        <Input
                            name="issue_date"
                            value={formData.issue_date || ''}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Maturity Date</Label>
                        <Input
                            name="maturity_date"
                            value={formData.maturity_date || ''}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Conversion Mechanics */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Conversion Mechanics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Conversion Type</Label>
                        <Select
                            value={formData.conversion_type || ''}
                            onValueChange={(value) => handleSelectChange('conversion_type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="automatic">Automatic upon Qualified Financing</SelectItem>
                                <SelectItem value="optional">Optional at Maturity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Valuation Cap (Optional)</Label>
                        <Input
                            name="valuation_cap"
                            value={formData.valuation_cap || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. 10,00,00,000"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Discount Rate (Optional %)</Label>
                        <Input
                            name="discount_rate"
                            value={formData.discount_rate || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. 20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Qualified Financing Threshold (Optional)</Label>
                        <Input
                            name="qualified_financing_threshold"
                            value={formData.qualified_financing_threshold || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. 2,00,00,000"
                        />
                    </div>
                </div>
            </section>

            {/* Legal & Governance */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Scale className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Legal & Governance</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input
                            name="governing_law"
                            value={formData.governing_law || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Laws of India"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                            id="repayment_on_maturity"
                            checked={formData.repayment_on_maturity !== false}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, repayment_on_maturity: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="repayment_on_maturity" className="cursor-pointer font-normal">
                            Principal is repayable at maturity if no conversion occurs
                        </Label>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Arbitration & Dispute Resolution (Optional)</Label>
                        <Textarea
                            name="arbitration_clause"
                            value={formData.arbitration_clause || ''}
                            onChange={handleInputChange}
                            placeholder="Details of arbitration seat, rules, etc."
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Additional Rights/Conditions (Optional)</Label>
                        <Textarea
                            name="additional_rights"
                            value={formData.additional_rights || ''}
                            onChange={handleInputChange}
                            placeholder="Observer rights, information rights, or specific milestones..."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ConvertibleNoteAgreementForm;
