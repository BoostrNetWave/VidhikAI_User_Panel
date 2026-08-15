import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Landmark, Sparkles, Users, Shield, Scale, Calendar, FileText } from 'lucide-react';

interface ArticlesOfAssociationFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const ArticlesOfAssociationForm: React.FC<ArticlesOfAssociationFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'Vidhik AI Solutions Private Limited',
                companyType: 'Private Limited',
                cin: 'U72900KA2023PTC198273',
                registeredOfficeState: 'Karnataka',
                effectiveDate: new Date().toISOString().split('T')[0],
                authorizedCapital: '10,00,000',
                paidUpShareCapital: '5,00,000',
                shareClasses: 'Equity Shares with voting rights, Class B Preference Shares',
                numberOfDirectors: '3',
                directorCategories: 'Managing Director, Independent Director, Nominee Director',
                quorumRequirements: '2 Directors or 1/3rd of total strength, whichever is higher',
                votingRights: 'One vote per equity share. E-voting permitted for general meetings.',
                dividendPolicy: 'Final dividend recommended by Board and declared by shareholders.',
                transferRestrictionsRequired: true,
                nomineeDirectorAllowed: true,
                retirementByRotationApplicable: false,
                commonSealRequired: false,
                listedCompany: false,
                section8Company: false,
                opcCompany: false,
                foreignShareholders: true,
                arbitrationClause: true,
                borrowingLimit: '50,00,000',
                additionalGovernanceClauses: 'The Board shall have the power to appoint an Advisory Committee for strategic decisions. Any dispute between shareholders shall be settled via arbitration in Mumbai.'
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
                    className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50"
                >
                    <Sparkles className="h-4 w-4" />
                    Fill Dummy Data
                </Button>
            </div>

            {/* Section 1: Company Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Building2 className="h-5 w-5" />
                        Company Identification
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                placeholder="e.g. Vidhik AI Solutions Private Limited"
                                value={formData.companyName || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyType">Company Type</Label>
                            <Select
                                value={formData.companyType || 'Private Limited'}
                                onValueChange={(v) => handleSelectChange('companyType', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited</SelectItem>
                                    <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                                    <SelectItem value="Section 8 Company">Section 8 Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cin">CIN (Optional)</Label>
                            <Input
                                id="cin"
                                name="cin"
                                placeholder="e.g. U72900KA2023PTC198273"
                                value={formData.cin || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registeredOfficeState">Registered Office State</Label>
                            <Input
                                id="registeredOfficeState"
                                name="registeredOfficeState"
                                placeholder="e.g. Karnataka"
                                value={formData.registeredOfficeState || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effectiveDate">Effective Date</Label>
                            <Input
                                id="effectiveDate"
                                name="effectiveDate"
                                type="date"
                                value={formData.effectiveDate || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Capital & Borrowing */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Landmark className="h-5 w-5" />
                        Capital, Shares & Borrowing
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorizedCapital">Authorized Share Capital (INR)</Label>
                            <Input
                                id="authorizedCapital"
                                name="authorizedCapital"
                                placeholder="e.g. 10,00,000"
                                value={formData.authorizedCapital || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paidUpShareCapital">Paid-up Share Capital (INR)</Label>
                            <Input
                                id="paidUpShareCapital"
                                name="paidUpShareCapital"
                                placeholder="e.g. 5,00,000"
                                value={formData.paidUpShareCapital || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="shareClasses">Classes of Shares</Label>
                            <Textarea
                                id="shareClasses"
                                name="shareClasses"
                                placeholder="e.g. Equity Shares with voting rights, Preference Shares..."
                                value={formData.shareClasses || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="borrowingLimit">Borrowing Limit (INR)</Label>
                            <Input
                                id="borrowingLimit"
                                name="borrowingLimit"
                                placeholder="e.g. 50,00,000"
                                value={formData.borrowingLimit || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Board Structure & Governance */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Users className="h-5 w-5" />
                        Board of Directors & Meetings
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numberOfDirectors">Board Size (No. of Directors)</Label>
                            <Input
                                id="numberOfDirectors"
                                name="numberOfDirectors"
                                type="number"
                                placeholder="e.g. 3"
                                value={formData.numberOfDirectors || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="directorCategories">Director Categories</Label>
                            <Input
                                id="directorCategories"
                                name="directorCategories"
                                placeholder="e.g. Managing, Independent, Nominee"
                                value={formData.directorCategories || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="quorumRequirements">Quorum Requirements</Label>
                            <Input
                                id="quorumRequirements"
                                name="quorumRequirements"
                                placeholder="e.g. 2 Directors or 1/3rd of total strength"
                                value={formData.quorumRequirements || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="votingRights">Voting Rights</Label>
                            <Textarea
                                id="votingRights"
                                name="votingRights"
                                placeholder="e.g. One vote per share, poll voting..."
                                value={formData.votingRights || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dividendPolicy">Dividend Policy</Label>
                            <Textarea
                                id="dividendPolicy"
                                name="dividendPolicy"
                                placeholder="e.g. Declared by shareholders upon Board recommendation"
                                value={formData.dividendPolicy || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="nomineeDirectorAllowed"
                                checked={formData.nomineeDirectorAllowed || false}
                                onCheckedChange={(checked) => handleSelectChange('nomineeDirectorAllowed', checked as string)}
                            />
                            <Label htmlFor="nomineeDirectorAllowed" className="text-sm font-normal cursor-pointer">Allow Nominee Directors</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="retirementByRotationApplicable"
                                checked={formData.retirementByRotationApplicable || false}
                                onCheckedChange={(checked) => handleSelectChange('retirementByRotationApplicable', checked as string)}
                            />
                            <Label htmlFor="retirementByRotationApplicable" className="text-sm font-normal cursor-pointer">Retirement by Rotation</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Special Clauses & Options */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Special Clauses & Restrictions
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="transferRestrictionsRequired"
                                checked={formData.transferRestrictionsRequired !== false}
                                onCheckedChange={(checked) => handleSelectChange('transferRestrictionsRequired', checked as string)}
                            />
                            <Label htmlFor="transferRestrictionsRequired" className="text-sm font-normal cursor-pointer">Include Share Transfer Restrictions</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="commonSealRequired"
                                checked={formData.commonSealRequired || false}
                                onCheckedChange={(checked) => handleSelectChange('commonSealRequired', checked as string)}
                            />
                            <Label htmlFor="commonSealRequired" className="text-sm font-normal cursor-pointer">Common Seal Required</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="listedCompany"
                                checked={formData.listedCompany || false}
                                onCheckedChange={(checked) => handleSelectChange('listedCompany', checked as string)}
                            />
                            <Label htmlFor="listedCompany" className="text-sm font-normal cursor-pointer">Listed Company (SEBI Compliance)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="foreignShareholders"
                                checked={formData.foreignShareholders || false}
                                onCheckedChange={(checked) => handleSelectChange('foreignShareholders', checked as string)}
                            />
                            <Label htmlFor="foreignShareholders" className="text-sm font-normal cursor-pointer">Foreign Shareholders (FEMA)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="arbitrationClause"
                                checked={formData.arbitrationClause || false}
                                onCheckedChange={(checked) => handleSelectChange('arbitrationClause', checked as string)}
                            />
                            <Label htmlFor="arbitrationClause" className="text-sm font-normal cursor-pointer">Include Arbitration Clause</Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="additionalGovernanceClauses" className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-violet-600" />
                            Additional Governance Clauses (Optional)
                        </Label>
                        <Textarea
                            id="additionalGovernanceClauses"
                            name="additionalGovernanceClauses"
                            placeholder="Enter any specific governance rules, dispute resolution clauses, etc..."
                            className="min-h-[120px]"
                            value={formData.additionalGovernanceClauses || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArticlesOfAssociationForm;
