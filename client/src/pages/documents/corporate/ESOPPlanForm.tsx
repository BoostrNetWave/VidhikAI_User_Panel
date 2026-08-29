import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Building,
    Sparkles,
    Users,
    Clock,
    TrendingUp,
    Percent,
    ShieldCheck,
    Briefcase
} from "lucide-react";

interface ESOPPlanFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormData?: (data: any) => void;
}

const ESOPPlanForm: React.FC<ESOPPlanFormProps> = ({
    formData,
    handleInputChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                company_name: 'Quantum Leap Innovations Private Limited',
                company_cin: 'U72900KA2022PTC123987',
                registered_office: '12th Floor, Tower B, Prestige Tech Park, Marathahalli, Bangalore 560103',
                effective_date: new Date().toISOString().split('T')[0],
                total_option_pool: '50,000',
                percentage_of_capital: '10',
                eligibility_criteria: 'All permanent employees of the Company and its subsidiaries who have completed at least 6 months of continuous service.',
                vesting_schedule: '48 months with a 1-year cliff. 25% vests after 12 months, and the remaining 75% vests in equal monthly installments over the next 36 months.',
                exercise_price_mechanism: 'The exercise price shall be the Fair Market Value (FMV) as determined by a Registered Valuer at the time of grant.',
                exercise_period: '5 years from the date of vesting or 10 years from the date of grant, whichever is earlier.',
                lock_in_period: '1 year from the date of allotment of shares upon exercise.',
                accelerated_vesting: true,
                governing_law: 'Laws of India',
                listed_company: false,
                advisors_included: true,
                foreign_employees: false,
                additional_conditions: 'Options granted under this plan are non-transferable except in the event of death of the option holder.'
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
                        <h4 className="font-semibold text-foreground">Plan Assistant</h4>
                        <p className="text-sm text-primary">Pre-fill with standard startup ESOP terms</p>
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

            {/* Company Identification */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Company Identification</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Company Name</Label>
                        <Input
                            name="company_name"
                            value={formData.company_name || ''}
                            onChange={handleInputChange}
                            placeholder="Full Name as per Incorporation Certificate"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company CIN</Label>
                        <Input
                            name="company_cin"
                            value={formData.company_cin || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. U72200..."
                            required
                        />
                    </div>
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
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Office Address</Label>
                        <Input
                            name="registered_office"
                            value={formData.registered_office || ''}
                            onChange={handleInputChange}
                            placeholder="Complete registered address"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Plan Pool & Financials */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Plan Pool & Financials</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Total Option Pool (Number of Options)</Label>
                        <Input
                            name="total_option_pool"
                            value={formData.total_option_pool || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. 1,00,000"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Percentage of Paid-up Capital (%)</Label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="percentage_of_capital"
                                value={formData.percentage_of_capital || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. 10"
                                required
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Exercise Price Mechanism</Label>
                        <Textarea
                            name="exercise_price_mechanism"
                            value={formData.exercise_price_mechanism || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Fair Market Value as determined by Registered Valuer"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Exercise Period (after vesting)</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="exercise_period"
                                value={formData.exercise_period || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. 5 years from vesting date"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Lock-in Period (if any)</Label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="lock_in_period"
                                value={formData.lock_in_period || ''}
                                onChange={handleInputChange}
                                className="pl-9"
                                placeholder="e.g. 1 year from allotment"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligibility & Vesting */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Eligibility & Vesting</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Eligibility Criteria</Label>
                        <Textarea
                            name="eligibility_criteria"
                            value={formData.eligibility_criteria || ''}
                            onChange={handleInputChange}
                            placeholder="Who is eligible? (Employees, Directors, etc.)"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Vesting Schedule</Label>
                        <Textarea
                            name="vesting_schedule"
                            value={formData.vesting_schedule || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. 4-year vesting with 1-year cliff"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="accelerated_vesting"
                                checked={formData.accelerated_vesting === true}
                                onCheckedChange={(checked) => {
                                    if (setFormData) {
                                        setFormData({ ...formData, accelerated_vesting: !!checked });
                                    }
                                }}
                            />
                            <Label htmlFor="accelerated_vesting" className="cursor-pointer font-normal">
                                Allow Accelerated Vesting (upon acquisition/IPO)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="advisors_included"
                                checked={formData.advisors_included === true}
                                onCheckedChange={(checked) => {
                                    if (setFormData) {
                                        setFormData({ ...formData, advisors_included: !!checked });
                                    }
                                }}
                            />
                            <Label htmlFor="advisors_included" className="cursor-pointer font-normal">
                                Include Advisors/Consultants
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="foreign_employees"
                                checked={formData.foreign_employees === true}
                                onCheckedChange={(checked) => {
                                    if (setFormData) {
                                        setFormData({ ...formData, foreign_employees: !!checked });
                                    }
                                }}
                            />
                            <Label htmlFor="foreign_employees" className="cursor-pointer font-normal">
                                Include Foreign Employees (FEMA compliance)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="listed_company"
                                checked={formData.listed_company === true}
                                onCheckedChange={(checked) => {
                                    if (setFormData) {
                                        setFormData({ ...formData, listed_company: !!checked });
                                    }
                                }}
                            />
                            <Label htmlFor="listed_company" className="cursor-pointer font-normal">
                                Company is Listed (requires SEBI compliance)
                            </Label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Administration & Compliance */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Administration & Compliance</h3>
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
                    <div className="md:col-span-2 space-y-2">
                        <Label>Additional Conditions or Restrictions (Optional)</Label>
                        <Textarea
                            name="additional_conditions"
                            value={formData.additional_conditions || ''}
                            onChange={handleInputChange}
                            placeholder="Any specific repurchase rights, transfer restrictions, etc."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ESOPPlanForm;
