import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, FileText, Landmark, Users, Sparkles, MapPin, Globe } from 'lucide-react';

interface MOAFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const MOAForm: React.FC<MOAFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                company_name: 'Vidhik AI Solutions Private Limited',
                company_type: 'Private Limited',
                cin: 'U72900KA2023PTC198273',
                date_of_incorporation: '2023-04-15',
                registered_office_state: 'Karnataka',
                main_objects: 'To carry on the business of providing artificial intelligence based legal technology solutions, document automation, and legal research services.',
                ancillary_objects: 'To acquire, build, and maintain software infrastructure, data centers, and related technologies for the fulfillment of main objects.',
                liability_type: 'Limited by Shares',
                authorized_share_capital: '10,00,000',
                number_of_equity_shares: '1,00,000',
                face_value_per_share: '10',
                preference_shares_details: 'None',
                subscriber_details: 'Rahul Sharma, S/o Sunil Sharma, R/o Mumbai, Occupation: Business, Nationality: Indian - 5,000 shares.\nPriya Singh, D/o Anand Singh, R/o Delhi, Occupation: Professional, Nationality: Indian - 5,000 shares.',
                witness_details: 'Mr. X, S/o Mr. Y, residing at 123, Main Street, Bangalore.',
                foreign_subscribers: false,
                section8_objectives: ''
            });
        }
    };

    return (
        <div className="space-y-8">
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

            {/* Section 1: Company Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Company Identification
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Proposed Company Name</Label>
                            <Input
                                id="company_name"
                                name="company_name"
                                placeholder="e.g. Vidhik AI Solutions Private Limited"
                                value={formData.company_name || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_type">Company Type</Label>
                            <Select
                                value={formData.company_type || 'Private Limited'}
                                onValueChange={(v: any) => handleSelectChange('company_type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited</SelectItem>
                                    <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                                    <SelectItem value="Section 8 Company">Section 8 Company</SelectItem>
                                    <SelectItem value="Producer Company">Producer Company</SelectItem>
                                    <SelectItem value="Nidhi Company">Nidhi Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cin">CIN (If allotted)</Label>
                            <Input
                                id="cin"
                                name="cin"
                                placeholder="e.g. U72900KA2023PTC198273"
                                value={formData.cin || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date_of_incorporation">Date of Incorporation</Label>
                            <Input
                                id="date_of_incorporation"
                                name="date_of_incorporation"
                                type="date"
                                value={formData.date_of_incorporation || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="registered_office_state">State of Registered Office</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="registered_office_state"
                                    name="registered_office_state"
                                    className="pl-9"
                                    placeholder="e.g. Karnataka"
                                    value={formData.registered_office_state || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Objects Clause */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        Objects Clause
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="main_objects">Main Objects to be pursued (on incorporation)</Label>
                        <Textarea
                            id="main_objects"
                            name="main_objects"
                            placeholder="State the primary business activities..."
                            className="min-h-[120px]"
                            value={formData.main_objects || ''}
                            onChange={handleInputChange}
                        />
                        <p className="text-xs text-muted-foreground italic">
                            Tip: Describe the core business activities the company will undertake.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ancillary_objects">Ancillary/Other Objects</Label>
                        <Textarea
                            id="ancillary_objects"
                            name="ancillary_objects"
                            placeholder="Matters necessary for furtherance of objects..."
                            value={formData.ancillary_objects || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    {formData.company_type === 'Section 8 Company' && (
                        <div className="space-y-2">
                            <Label htmlFor="section8_objectives">Section 8 Specific Objectives (Non-Profit)</Label>
                            <Textarea
                                id="section8_objectives"
                                name="section8_objectives"
                                placeholder="Promote commerce, art, science, sports, education, research, social welfare..."
                                value={formData.section8_objectives || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section 3: Liability & Capital */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Landmark className="h-5 w-5" />
                        Liability & Capital Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="liability_type">Liability of Members</Label>
                            <Select
                                value={formData.liability_type || 'Limited by Shares'}
                                onValueChange={(v: any) => handleSelectChange('liability_type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select liability type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Limited by Shares">Limited by Shares</SelectItem>
                                    <SelectItem value="Limited by Guarantee">Limited by Guarantee</SelectItem>
                                    <SelectItem value="Unlimited Company">Unlimited Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="authorized_share_capital">Total Authorized Capital (INR)</Label>
                            <Input
                                id="authorized_share_capital"
                                name="authorized_share_capital"
                                placeholder="e.g. 10,00,000"
                                value={formData.authorized_share_capital || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="number_of_equity_shares">Total Number of Shares</Label>
                            <Input
                                id="number_of_equity_shares"
                                name="number_of_equity_shares"
                                placeholder="e.g. 1,00,000"
                                value={formData.number_of_equity_shares || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="face_value_per_share">Face Value per Share (INR)</Label>
                            <Input
                                id="face_value_per_share"
                                name="face_value_per_share"
                                placeholder="e.g. 10"
                                value={formData.face_value_per_share || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preference_shares_details">Preference Shares Details (if any)</Label>
                            <Input
                                id="preference_shares_details"
                                name="preference_shares_details"
                                placeholder="e.g. 1,000 8% Non-Cumulative Preference Shares of 100 each"
                                value={formData.preference_shares_details || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Subscription */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        Subscriber Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subscriber_details">Subscribers (Name, Father's Name, Address, Occupation, Shares)</Label>
                        <Textarea
                            id="subscriber_details"
                            name="subscriber_details"
                            placeholder="Rahul Sharma, S/o Sunil Sharma, R/o Mumbai, Business - 5,000 shares."
                            className="min-h-[100px]"
                            value={formData.subscriber_details || ''}
                            onChange={handleInputChange}
                        />
                        <p className="text-xs text-muted-foreground italic">
                            Example: Rahul Sharma, S/o Sunil Sharma, R/o Mumbai, Business - 5,000 shares.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="witness_details">Witness Details</Label>
                        <Input
                            id="witness_details"
                            name="witness_details"
                            placeholder="e.g. Mr. X, S/o Mr. Y, residing at 123, Main Street, Bangalore."
                            value={formData.witness_details || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-border transition-colors mt-4">
                        <Checkbox
                            id="foreign_subscribers"
                            checked={formData.foreign_subscribers || false}
                            onCheckedChange={(checked) => handleSelectChange('foreign_subscribers', checked as string)}
                        />
                        <Label htmlFor="foreign_subscribers" className="text-sm font-normal cursor-pointer flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            Foreign Subscribers Present (Triggers FEMA/RBI Compliance)
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MOAForm;
