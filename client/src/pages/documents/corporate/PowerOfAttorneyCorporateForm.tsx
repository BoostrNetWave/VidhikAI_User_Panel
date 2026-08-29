import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Building,
    UserCheck,
    Sparkles,
    Shield,
    Target,
    IndianRupee,
    Clock,
    Gavel,
    MapPin
} from "lucide-react";

interface PowerOfAttorneyCorporateFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormData?: (data: any) => void;
}

const PowerOfAttorneyCorporateForm: React.FC<PowerOfAttorneyCorporateFormProps> = ({
    formData,
    handleInputChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                company_name: 'TechFlow Solutions Private Limited',
                company_cin: 'U72900KA2022PTC123456',
                registered_office: '12th Floor, Cyber Hub, Outer Ring Road, Bangalore, Karnataka 560103',
                authorized_signatory_name: 'Mr. Arvind Swamy',
                authorized_signatory_designation: 'Managing Director',
                board_resolution_date: '2024-03-01',
                attorney_name: 'Mr. Kavita Rao',
                attorney_address: 'No. 45, Residency Road, Bangalore, Karnataka 560025',
                attorney_id_details: 'PAN: ABCPR1234M, Aadhar: 1234 5678 9012',
                purpose_of_poa: 'To represent the Company before the Registrar of Companies and other statutory authorities for the purpose of filing annual returns and corporate governance compliance.',
                specific_powers: [
                    'To sign and file Form MGT-7 and AOC-4 with the MCA.',
                    'To represent the Company before the Regional Director and Registrar of Companies.',
                    'To execute declarations and affidavits required for ROC filings.',
                    'To appoint professionals for assisted filings.'
                ],
                monetary_limit: 'Limited to payment of statutory filing fees up to INR 50,000.',
                geographic_limit: 'Within the jurisdiction of RoC Bangalore and RD Southeast Region.',
                delegation_allowed: false,
                effective_date: new Date().toISOString().split('T')[0],
                expiry_date: '2025-03-31',
                revocable: true,
                registration_required: false,
                additional_clauses: 'The attorney shall provide a monthly report of all filings done under this Power of Attorney.'
            });
        }
    };

    const handleSpecificPowersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const powers = e.target.value.split('\n').filter(p => p.trim() !== '');
        if (setFormData) {
            setFormData({
                ...formData,
                specific_powers: powers
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
                        <p className="text-sm text-primary">Test the generator with sample PoA data</p>
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
                    <h3 className="font-semibold text-lg">Company Info (Executant)</h3>
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
                    <div className="space-y-2">
                        <Label>Board Resolution Date</Label>
                        <Input
                            name="board_resolution_date"
                            value={formData.board_resolution_date || ''}
                            onChange={handleInputChange}
                            type="date"
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

            {/* Authorized Signatory Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Authorized Signatory</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                            name="authorized_signatory_name"
                            value={formData.authorized_signatory_name || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Mr. Rajesh Kumar"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input
                            name="authorized_signatory_designation"
                            value={formData.authorized_signatory_designation || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Managing Director, CEO"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Attorney Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Attorney Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Attorney Full Name</Label>
                        <Input
                            name="attorney_name"
                            value={formData.attorney_name || ''}
                            onChange={handleInputChange}
                            placeholder="Full name of the person being appointed"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Attorney ID Details (Optional)</Label>
                        <Input
                            name="attorney_id_details"
                            value={formData.attorney_id_details || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. PAN: ABCPK1234L, Aadhar details"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Attorney Address</Label>
                        <Input
                            name="attorney_address"
                            value={formData.attorney_address || ''}
                            onChange={handleInputChange}
                            placeholder="Permanent/Current address of the attorney"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Scope of Authority */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Scope of Authority</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Purpose of Power of Attorney</Label>
                        <Textarea
                            name="purpose_of_poa"
                            value={formData.purpose_of_poa || ''}
                            onChange={handleInputChange}
                            placeholder="General purpose for which this PoA is being executed..."
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Specific Powers (One per line)</Label>
                        <Textarea
                            name="specific_powers"
                            value={Array.isArray(formData.specific_powers) ? formData.specific_powers.join('\n') : ''}
                            onChange={handleSpecificPowersChange}
                            placeholder="Enter each specific power granted on a new line..."
                            className="min-h-[150px]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Monetary Limit (If any)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="monetary_limit"
                                value={formData.monetary_limit || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. INR 5,00,000"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Geographic Limit (If any)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="geographic_limit"
                                value={formData.geographic_limit || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. Pan-India, Bangalore only"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Validity & Options */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Validity & Legal Options</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Effective Date</Label>
                        <Input
                            name="effective_date"
                            value={formData.effective_date || ''}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Expiry Date (Optional)</Label>
                        <Input
                            name="expiry_date"
                            value={formData.expiry_date || ''}
                            onChange={handleInputChange}
                            type="date"
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox
                            id="revocable"
                            checked={formData.revocable !== false}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, revocable: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="revocable" className="cursor-pointer font-normal">
                            PoA is revocable by the Company
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox
                            id="delegation_allowed"
                            checked={formData.delegation_allowed === true}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, delegation_allowed: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="delegation_allowed" className="cursor-pointer font-normal">
                            Further delegation is allowed
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 pt-4 md:col-span-2">
                        <Checkbox
                            id="registration_required"
                            checked={formData.registration_required === true}
                            onCheckedChange={(checked) => {
                                if (setFormData) {
                                    setFormData({ ...formData, registration_required: !!checked });
                                }
                            }}
                        />
                        <Label htmlFor="registration_required" className="cursor-pointer font-normal text-muted-foreground font-semibold">
                            Registration is required (mandatory for property and high-value transactions)
                        </Label>
                    </div>
                </div>
            </section>

            {/* Additional Provisions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Additional Clauses</h3>
                </div>
                <div className="space-y-2">
                    <Label>Additional Clauses (Optional)</Label>
                    <Textarea
                        name="additional_clauses"
                        value={formData.additional_clauses || ''}
                        onChange={handleInputChange}
                        placeholder="Any other specific conditions, indemnity clauses, or restrictions..."
                    />
                </div>
            </section>
        </div>
    );
};

export default PowerOfAttorneyCorporateForm;
