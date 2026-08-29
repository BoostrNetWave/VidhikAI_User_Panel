import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, User, TrendingUp, Calendar, Sparkles } from "lucide-react";

interface ShareSubscriptionFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

export const ShareSubscriptionForm: React.FC<ShareSubscriptionFormProps> = ({ formData, handleInputChange, handleSelectChange, setFormData }) => {
    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'NexGen Robotics Technologies Pvt Ltd',
                jurisdiction: 'Maharashtra, India',
                investorName: 'Blue Chip Ventures LLP',
                investorType: 'Institutional',
                shareClass: 'CCPS',
                numberOfShares: '5000',
                pricePerShare: '2000',
                closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                preMoneyValuation: '40,00,00,000'
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
            {/* Company Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Company Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Legal name of the company" />
                    </div>
                    <div className="space-y-2">
                        <Label>Incorporation Jurisdiction</Label>
                        <Input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. Karnataka, India" />
                    </div>
                </div>
            </section>

            {/* Investor Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Investor Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Investor Name</Label>
                        <Input name="investorName" value={formData.investorName} onChange={handleInputChange} placeholder="Full name or Entity name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Investor Type</Label>
                        <Select value={formData.investorType || 'Individual'} onValueChange={(value: any) => handleSelectChange('investorType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select investor type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Institutional">Institutional (VC/Entity)</SelectItem>
                                <SelectItem value="Angel">Angel Investor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Subscription Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Subscription Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Share Class</Label>
                        <Select value={formData.shareClass || 'Equity'} onValueChange={(value: any) => handleSelectChange('shareClass', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select share class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Equity">Equity Shares</SelectItem>
                                <SelectItem value="CCPS">Compulsorily Convertible Preference Shares (CCPS)</SelectItem>
                                <SelectItem value="OCPS">Optionally Convertible Preference Shares (OCPS)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Number of Shares</Label>
                        <Input name="numberOfShares" value={formData.numberOfShares} onChange={handleInputChange} type="number" placeholder="e.g. 1000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Price Per Share (₹)</Label>
                        <Input name="pricePerShare" value={formData.pricePerShare} onChange={handleInputChange} placeholder="e.g. 100" />
                    </div>
                    <div className="space-y-2">
                        <Label>Total Investment (₹)</Label>
                        <Input
                            name="totalInvestment"
                            disabled
                            value={formData.numberOfShares && formData.pricePerShare ? (parseFloat(formData.numberOfShares) * parseFloat(formData.pricePerShare)).toLocaleString('en-IN') : '0'}
                            placeholder="Calculated automatically"
                        />
                    </div>
                </div>
            </section>

            {/* Timelines & Rights */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Timeline & Conditions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Closing Date</Label>
                        <Input name="closingDate" value={formData.closingDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Pre-Money Valuation (₹)</Label>
                        <Input name="preMoneyValuation" value={formData.preMoneyValuation} onChange={handleInputChange} placeholder="e.g. 10,00,00,000" />
                    </div>
                </div>
            </section>
        </div>
    );
};
