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
    Clock
} from "lucide-react";

interface CorporateAuthorizationLetterFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormData?: (data: any) => void;
}

const CorporateAuthorizationLetterForm: React.FC<CorporateAuthorizationLetterFormProps> = ({
    formData,
    handleInputChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'Vidhik AI Solutions Private Limited',
                companyCin: 'U74999KA2023PTC123456',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                authorizedPersonName: 'Mr. Rajesh Kumar',
                authorizedPersonDesignation: 'Vice President - Operations',
                idDetails: 'PAN: ABCPK1234L',
                authorityRecipient: 'The Branch Manager, HDFC Bank, MG Road Branch, Bangalore',
                purposeOfAuthorization: 'To represent the company for opening and operating a new current account.',
                scopeDetails: 'To sign all necessary documents, KYC forms, and account opening mandates on behalf of the company.',
                monetaryLimit: 'No specific monetary limit for account opening.',
                validityStartDate: new Date().toISOString().split('T')[0],
                validityEndDate: '',
                boardResolutionDate: '2024-02-15',
                revocable: true,
                additionalConditions: 'This authorization is specific to the HDFC Bank MG Road branch and shall not be used elsewhere.'
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
                        <p className="text-sm text-primary">Test the generator with sample authorization data</p>
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
                        <Label>Company CIN</Label>
                        <Input
                            name="companyCin"
                            value={formData.companyCin}
                            onChange={handleInputChange}
                            placeholder="e.g. U74999KA2023PTC123456"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address</Label>
                        <Input
                            name="registeredOffice"
                            value={formData.registeredOffice}
                            onChange={handleInputChange}
                            placeholder="Full registered address"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Authorized Person Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Authorized Person</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                            name="authorizedPersonName"
                            value={formData.authorizedPersonName}
                            onChange={handleInputChange}
                            placeholder="e.g. Mr. Rajesh Kumar"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input
                            name="authorizedPersonDesignation"
                            value={formData.authorizedPersonDesignation}
                            onChange={handleInputChange}
                            placeholder="e.g. Vice President, Manager"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>ID Details / Contact (Optional)</Label>
                        <Input
                            name="idDetails"
                            value={formData.idDetails}
                            onChange={handleInputChange}
                            placeholder="e.g. PAN: ABCPK1234L, Mobile: +91 98765 43210"
                        />
                    </div>
                </div>
            </section>

            {/* Authorization Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Authorization Scope</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Authority Recipient (Optional)</Label>
                        <Input
                            name="authorityRecipient"
                            value={formData.authorityRecipient}
                            onChange={handleInputChange}
                            placeholder="e.g. The Branch Manager, HDFC Bank, MG Road Branch"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Purpose of Authorization</Label>
                        <Textarea
                            name="purposeOfAuthorization"
                            value={formData.purposeOfAuthorization}
                            onChange={handleInputChange}
                            placeholder="e.g. Signing agreement, Bank account operation, Filing documents..."
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Scope & Specific Acts</Label>
                        <Textarea
                            name="scopeDetails"
                            value={formData.scopeDetails}
                            onChange={handleInputChange}
                            placeholder="Specify exact acts the person is authorized to do..."
                            required
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Monetary Limit (If any)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="monetaryLimit"
                                value={formData.monetaryLimit}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. Up to INR 5,00,000 per transaction"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Validity & Resolution */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Validity & Reference</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Validity Start Date</Label>
                        <Input
                            name="validityStartDate"
                            value={formData.validityStartDate}
                            onChange={handleInputChange}
                            type="date"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Validity Expiry Date (Optional)</Label>
                        <Input
                            name="validityEndDate"
                            value={formData.validityEndDate}
                            onChange={handleInputChange}
                            type="date"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Board Resolution Date (Optional)</Label>
                        <Input
                            name="boardResolutionDate"
                            value={formData.boardResolutionDate}
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
                            Authorization is revocable at the discretion of the Company
                        </Label>
                    </div>
                </div>
            </section>

            {/* Additional Conditions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Additional Conditions</h3>
                </div>
                <div className="space-y-2">
                    <Label>Additional Conditions (Optional)</Label>
                    <Textarea
                        name="additionalConditions"
                        value={formData.additionalConditions}
                        onChange={handleInputChange}
                        placeholder="Any other specific restrictions or conditions..."
                    />
                </div>
            </section>
        </div>
    );
};

export default CorporateAuthorizationLetterForm;
