import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Calendar, Clock, Sparkles, Scale, UserCheck, Shield, Users, Award, FileText } from "lucide-react";

interface IPAssignmentFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: any) => void;
    setFormData?: (data: any) => void;
    errors?: Record<string, string>;
}

const IPAssignmentForm: React.FC<IPAssignmentFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData,
    errors
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                agreement_number: 'APEX/IPAA/2026/104',
                effective_date: new Date().toISOString().split('T')[0],
                commercial_purpose: 'Securing full intellectual property ownership, patent applications, software rights, and brand assets transfer from founder to corporate entity Apex AI.',
                assignor: 'Mr. Rajesh Kumar, an individual tech founder residing at Flat 101, Sunshine Apartments, Indiranagar, Bangalore, Karnataka 560038',
                assignee: 'Apex AI Software Technologies Private Limited, a company incorporated under the laws of India, with its registered office at Block A, Outer Ring Road, Bangalore 560103',
                authorized_representatives: 'Assignor: Mr. Rajesh Kumar; Assignee: Mr. Aniket Sen (Director)',
                assigned_ip_assets: '1. Patent Application No. 202441012345 (System and Method for AI-Based Drone Collision Avoidance).\n2. Trademark "ApexAir" under Class 9 and Class 12.\n3. Autonomous Drone Navigation Software (v2.1) source code and models.\n4. Domain Name apexairdrone.com and associated brand logo assets.',
                ip_categories: 'Patents, Trademarks, Software Source Code, Domain Names, Trade Secrets, and AI Models.',
                intellectual_property_definition: 'Intellectual Property shall mean all patents, patent applications, trademarks, service marks, registered designs, copyrights, database rights, trade secrets, know-how, domain names, and AI models.',
                assigned_rights: 'All rights, title, interest, ownership, exploitation, licensing, sub-licensing, registration, and enforcement rights worldwide.',
                retained_rights: 'The Assignor retains the non-exclusive right to use the underlying general programming algorithms for non-commercial academic research.',
                assignment_type: 'Exclusive',
                territory: 'Worldwide',
                assignment_duration: 'Perpetual / Full statutory duration of respective IP protections',
                effective_assignment_date: new Date().toISOString().split('T')[0],
                commercialization_rights: 'Absolute right to monetize, license, commercialize, sub-license, distribute, and exploit in any physical or digital medium globally.',
                registration_rights: 'Right to prosecute patent applications, register trademarks, record assignment deeds in IP Offices, and maintain renewals in the name of Assignee.',
                enforcement_rights: 'Right to institute legal proceedings, sue for past infringement, seek damages, and obtain injunctions against third-party infringers.',
                consideration: 'A one-time consolidated lump sum payment of INR 10,00,000 (Rupees Ten Lakhs Only) payable within 15 days of execution.',
                moral_rights_clause: 'The Assignor hereby waives all moral rights of attribution and integrity under Copyright Act, 1957 or other statutes to the maximum extent permitted by law.',
                representations_and_warranties: 'The Assignor represents that he is the sole owner of the Assigned IP, the assets are free of any liens, encumbrances, or prior assignments, and do not infringe third-party rights.',
                further_assurances: 'The Assignor agrees to execute all assignment deeds, patent transfer forms, trademark recordals, and assist in hearings to complete transfer registration.',
                confidentiality_clause: 'The parties agree to keep the terms of this assignment and proprietary details of the Assigned IP strictly confidential.',
                indemnity_clause: 'The Assignor agrees to indemnify and hold harmless the Assignee from any losses, damages, or liabilities arising from third-party IP infringement claims related to the Assigned IP.',
                limitation_of_liability: 'The maximum aggregate liability of the Assignor under this agreement shall be capped at the total consideration amount received.',
                termination_clause: 'This agreement represents an absolute and irrevocable transfer of IP ownership and cannot be terminated once executed.',
                notice_details: 'Assignor: rajesh.k@email.com, Indiranagar, Bangalore; Assignee: legal@apexai.com, Block A, Outer Ring Road, Bangalore.',
                governing_law: 'Laws of India',
                dispute_resolution: 'Amicable settlement failing which dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.',
                arbitration_details: 'Sole arbitrator appointed mutually, proceedings conducted in English language, seat of arbitration at Bangalore.',
                jurisdiction: 'Courts in Bangalore, Karnataka',
                miscellaneous_clauses: 'This agreement constitutes the entire understanding, is severable, cannot be assigned without consent, and may be executed in counterparts.',
                software_ip: true,
                employee_assignment: false,
                founder_assignment: true,
                startup_investment: false,
                patent_assignment: true,
                trademark_assignment: true,
                research_ip: false,
                cross_border_transaction: false,
                witnesses: '1. Mr. Dinesh Kumar (Bangalore)\n2. Ms. Sarah Mathews (Pune)',
                authorized_signatories: 'Signed for Assignor: Mr. Rajesh Kumar; Signed for Assignee: Mr. Aniket Sen',
                execution_place: 'Bangalore',
                execution_date: new Date().toISOString().split('T')[0],
                annexures: 'Annexure A: Schedule of Patents & Trademark Certificates'
            });
        }
    };

    const getErrorClass = (fieldName: string) => {
        return errors?.[fieldName] ? "border-red-500 focus-visible:ring-red-500" : "";
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end pt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillDummyData}
                    className="gap-2 text-primary border-primary/20 hover:bg-secondary"
                >
                    <Sparkles className="h-4 w-4" />
                    Fill Dummy Data
                </Button>
            </div>

            {/* Section 1: Agreement Profile & Parties */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Building2 className="h-5 w-5" />
                        Agreement Profile & Parties
                    </CardTitle>
                    <CardDescription>Configure IP assignment reference, date, and Party legal details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="effective_date" className={errors?.effective_date ? "text-red-500" : ""}>
                                Effective Date *
                            </Label>
                            <Input
                                id="effective_date"
                                name="effective_date"
                                type="date"
                                value={formData.effective_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('effective_date')}
                            />
                            {errors?.effective_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.effective_date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agreement_number">Agreement Reference Number (Optional)</Label>
                            <Input
                                id="agreement_number"
                                name="agreement_number"
                                placeholder="e.g. APEX/IPAA/2026/104"
                                value={formData.agreement_number || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_representatives" className={errors?.authorized_representatives ? "text-red-500" : ""}>
                                Authorized Representatives *
                            </Label>
                            <Input
                                id="authorized_representatives"
                                name="authorized_representatives"
                                placeholder="e.g. Assignor: Mr. Rajesh Kumar; Assignee: Mr. Aniket Sen"
                                value={formData.authorized_representatives || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_representatives')}
                            />
                            {errors?.authorized_representatives && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_representatives}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="assignor" className={errors?.assignor ? "text-red-500" : ""}>
                                Assignor Legal Details *
                            </Label>
                            <Textarea
                                id="assignor"
                                name="assignor"
                                placeholder="Full legal name, address, and credentials of Assignor (Transferor)..."
                                rows={2}
                                value={formData.assignor || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('assignor')}
                            />
                            {errors?.assignor && (
                                <p className="text-xs text-red-500 font-medium">{errors.assignor}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="assignee" className={errors?.assignee ? "text-red-500" : ""}>
                                Assignee Legal Details *
                            </Label>
                            <Textarea
                                id="assignee"
                                name="assignee"
                                placeholder="Full legal name, registered address, and credentials of Assignee (Transferee)..."
                                rows={2}
                                value={formData.assignee || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('assignee')}
                            />
                            {errors?.assignee && (
                                <p className="text-xs text-red-500 font-medium">{errors.assignee}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Commercial Purpose & IP Details */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        Assigned IP Assets & Categories
                    </CardTitle>
                    <CardDescription>Define the IP assets, software repositories, patents, or trademarks to be assigned</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="commercial_purpose" className={errors?.commercial_purpose ? "text-red-500" : ""}>
                            Commercial Purpose *
                        </Label>
                        <Textarea
                            id="commercial_purpose"
                            name="commercial_purpose"
                            placeholder="State the purpose of this IP assignment..."
                            rows={2}
                            value={formData.commercial_purpose || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('commercial_purpose')}
                        />
                        {errors?.commercial_purpose && (
                            <p className="text-xs text-red-500 font-medium">{errors.commercial_purpose}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ip_categories" className={errors?.ip_categories ? "text-red-500" : ""}>
                                IP Categories *
                            </Label>
                            <Input
                                id="ip_categories"
                                name="ip_categories"
                                placeholder="e.g. Patents, Trademarks, Software Code, Designs"
                                value={formData.ip_categories || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('ip_categories')}
                            />
                            {errors?.ip_categories && (
                                <p className="text-xs text-red-500 font-medium">{errors.ip_categories}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignment_type" className={errors?.assignment_type ? "text-red-500" : ""}>
                                Assignment Nature *
                            </Label>
                            <Select
                                value={formData.assignment_type || 'Exclusive'}
                                onValueChange={(v) => handleSelectChange('assignment_type', v)}
                            >
                                <SelectTrigger className={getErrorClass('assignment_type')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Exclusive">Exclusive Assignment</SelectItem>
                                    <SelectItem value="Non-Exclusive">Non-Exclusive Assignment</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.assignment_type && (
                                <p className="text-xs text-red-500 font-medium">{errors.assignment_type}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assigned_ip_assets" className={errors?.assigned_ip_assets ? "text-red-500" : ""}>
                            Description of Assigned IP Assets *
                        </Label>
                        <Textarea
                            id="assigned_ip_assets"
                            name="assigned_ip_assets"
                            placeholder="Detail patent application numbers, trademark details, software files, domain names..."
                            rows={3}
                            value={formData.assigned_ip_assets || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('assigned_ip_assets')}
                        />
                        {errors?.assigned_ip_assets && (
                            <p className="text-xs text-red-500 font-medium">{errors.assigned_ip_assets}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intellectual_property_definition" className={errors?.intellectual_property_definition ? "text-red-500" : ""}>
                            Definition of Intellectual Property *
                        </Label>
                        <Textarea
                            id="intellectual_property_definition"
                            name="intellectual_property_definition"
                            placeholder="Definition of IP assets and rights transfer covenants..."
                            rows={2}
                            value={formData.intellectual_property_definition || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('intellectual_property_definition')}
                        />
                        {errors?.intellectual_property_definition && (
                            <p className="text-xs text-red-500 font-medium">{errors.intellectual_property_definition}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Assignment Covenants & Consideration */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Assignment Scope & Consideration
                    </CardTitle>
                    <CardDescription>Determine territory, duration, consideration payment, and rights scopes</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="territory" className={errors?.territory ? "text-red-500" : ""}>
                                Territory *
                            </Label>
                            <Input
                                id="territory"
                                name="territory"
                                placeholder="e.g. Worldwide"
                                value={formData.territory || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('territory')}
                            />
                            {errors?.territory && (
                                <p className="text-xs text-red-500 font-medium">{errors.territory}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignment_duration" className={errors?.assignment_duration ? "text-red-500" : ""}>
                                Assignment Duration *
                            </Label>
                            <Input
                                id="assignment_duration"
                                name="assignment_duration"
                                placeholder="e.g. Perpetual"
                                value={formData.assignment_duration || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('assignment_duration')}
                            />
                            {errors?.assignment_duration && (
                                <p className="text-xs text-red-500 font-medium">{errors.assignment_duration}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effective_assignment_date" className={errors?.effective_assignment_date ? "text-red-500" : ""}>
                                Effective Assignment Date *
                            </Label>
                            <Input
                                id="effective_assignment_date"
                                name="effective_assignment_date"
                                type="date"
                                value={formData.effective_assignment_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('effective_assignment_date')}
                            />
                            {errors?.effective_assignment_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.effective_assignment_date}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assigned_rights" className={errors?.assigned_rights ? "text-red-500" : ""}>
                            Assigned Rights & Transfer Scope *
                        </Label>
                        <Textarea
                            id="assigned_rights"
                            name="assigned_rights"
                            placeholder="All rights, title, interest, ownership, exploitation, licensing, sub-licensing..."
                            rows={2}
                            value={formData.assigned_rights || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('assigned_rights')}
                        />
                        {errors?.assigned_rights && (
                            <p className="text-xs text-red-500 font-medium">{errors.assigned_rights}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="commercialization_rights" className={errors?.commercialization_rights ? "text-red-500" : ""}>
                                Commercialization Rights *
                            </Label>
                            <Input
                                id="commercialization_rights"
                                name="commercialization_rights"
                                placeholder="Monetize, license, commercialize globally..."
                                value={formData.commercialization_rights || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('commercialization_rights')}
                            />
                            {errors?.commercialization_rights && (
                                <p className="text-xs text-red-500 font-medium">{errors.commercialization_rights}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registration_rights" className={errors?.registration_rights ? "text-red-500" : ""}>
                                Registration Rights *
                            </Label>
                            <Input
                                id="registration_rights"
                                name="registration_rights"
                                placeholder="Prosecute patents, register trademarks in IP Office..."
                                value={formData.registration_rights || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('registration_rights')}
                            />
                            {errors?.registration_rights && (
                                <p className="text-xs text-red-500 font-medium">{errors.registration_rights}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="enforcement_rights" className={errors?.enforcement_rights ? "text-red-500" : ""}>
                                Enforcement Rights *
                            </Label>
                            <Input
                                id="enforcement_rights"
                                name="enforcement_rights"
                                placeholder="Institute proceedings, sue for past infringement..."
                                value={formData.enforcement_rights || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('enforcement_rights')}
                            />
                            {errors?.enforcement_rights && (
                                <p className="text-xs text-red-500 font-medium">{errors.enforcement_rights}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consideration" className={errors?.consideration ? "text-red-500" : ""}>
                            Consideration Payment Details *
                        </Label>
                        <Textarea
                            id="consideration"
                            name="consideration"
                            placeholder="Lump Sum, Royalty schedules, equity shares, payable timelines..."
                            rows={2}
                            value={formData.consideration || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('consideration')}
                        />
                        {errors?.consideration && (
                            <p className="text-xs text-red-500 font-medium">{errors.consideration}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="retained_rights">Retained Rights (Optional)</Label>
                            <Input
                                id="retained_rights"
                                name="retained_rights"
                                placeholder="e.g. Non-exclusive right for academic research"
                                value={formData.retained_rights || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moral_rights_clause">Moral Rights Clause (Optional)</Label>
                            <Input
                                id="moral_rights_clause"
                                name="moral_rights_clause"
                                placeholder="Waiver of attribution/integrity under Copyright Act..."
                                value={formData.moral_rights_clause || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Warranties, Indemnities & Exits */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Warranties, Indemnities & Exits
                    </CardTitle>
                    <CardDescription>Set representations, IP protections, liabilities, and notices</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="representations_and_warranties" className={errors?.representations_and_warranties ? "text-red-500" : ""}>
                            Representations & Warranties *
                        </Label>
                        <Textarea
                            id="representations_and_warranties"
                            name="representations_and_warranties"
                            placeholder="Sole ownership, free from liens/encumbrances, validity of patents, non-infringement..."
                            rows={3}
                            value={formData.representations_and_warranties || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('representations_and_warranties')}
                        />
                        {errors?.representations_and_warranties && (
                            <p className="text-xs text-red-500 font-medium">{errors.representations_and_warranties}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="further_assurances">Further Assurances (Optional)</Label>
                        <Textarea
                            id="further_assurances"
                            name="further_assurances"
                            placeholder="Obligation to execute transfer forms, patents deeds, trademark recordals..."
                            rows={2}
                            value={formData.further_assurances || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="indemnity_clause">Indemnity Covenants (Optional)</Label>
                        <Textarea
                            id="indemnity_clause"
                            name="indemnity_clause"
                            placeholder="Hold harmless assignee from third-party IP infringement claims..."
                            rows={2}
                            value={formData.indemnity_clause || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="limitation_of_liability">Limitation of Liability (Optional)</Label>
                            <Input
                                id="limitation_of_liability"
                                name="limitation_of_liability"
                                placeholder="Capping liability to total consideration amount..."
                                value={formData.limitation_of_liability || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confidentiality_clause">Confidentiality (Optional)</Label>
                            <Input
                                id="confidentiality_clause"
                                name="confidentiality_clause"
                                placeholder="Confidentiality covenants for transaction terms..."
                                value={formData.confidentiality_clause || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="termination_clause">Termination Clause (Optional)</Label>
                        <Textarea
                            id="termination_clause"
                            name="termination_clause"
                            placeholder="Irrevocable transfer nature, exit/termination details..."
                            rows={2}
                            value={formData.termination_clause || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notice_details" className={errors?.notice_details ? "text-red-500" : ""}>
                            Notice Address Details *
                        </Label>
                        <Textarea
                            id="notice_details"
                            name="notice_details"
                            placeholder="Emails and physical addresses where notices should be sent..."
                            rows={2}
                            value={formData.notice_details || ''}
                            onChange={handleInputChange}
                            className={getErrorClass('notice_details')}
                        />
                        {errors?.notice_details && (
                            <p className="text-xs text-red-500 font-medium">{errors.notice_details}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Governing Law & Dispute Resolution */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Scale className="h-5 w-5" />
                        Jurisdiction & Dispute Arbitration
                    </CardTitle>
                    <CardDescription>Determine governing law, arbitration codes, and court seats</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="governing_law" className={errors?.governing_law ? "text-red-500" : ""}>
                                Governing Law *
                            </Label>
                            <Input
                                id="governing_law"
                                name="governing_law"
                                placeholder="e.g. Laws of India"
                                value={formData.governing_law || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('governing_law')}
                            />
                            {errors?.governing_law && (
                                <p className="text-xs text-red-500 font-medium">{errors.governing_law}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jurisdiction" className={errors?.jurisdiction ? "text-red-500" : ""}>
                                Court Jurisdiction *
                            </Label>
                            <Input
                                id="jurisdiction"
                                name="jurisdiction"
                                placeholder="e.g. Courts in Bangalore, Karnataka"
                                value={formData.jurisdiction || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('jurisdiction')}
                            />
                            {errors?.jurisdiction && (
                                <p className="text-xs text-red-500 font-medium">{errors.jurisdiction}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dispute_resolution" className={errors?.dispute_resolution ? "text-red-500" : ""}>
                                Dispute Resolution Procedure *
                            </Label>
                            <Textarea
                                id="dispute_resolution"
                                name="dispute_resolution"
                                placeholder="Details on amicable settlement, mediation, or arbitration tracks..."
                                rows={2}
                                value={formData.dispute_resolution || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('dispute_resolution')}
                            />
                            {errors?.dispute_resolution && (
                                <p className="text-xs text-red-500 font-medium">{errors.dispute_resolution}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="arbitration_details">Arbitration Details (Optional)</Label>
                            <Textarea
                                id="arbitration_details"
                                name="arbitration_details"
                                placeholder="Details regarding number of arbitrators, language, seat, and venue..."
                                rows={2}
                                value={formData.arbitration_details || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Exits & Execution Coordinates */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Execution Coordinates
                    </CardTitle>
                    <CardDescription>Specify signatories, execution places, dates, and annexures</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="authorized_signatories" className={errors?.authorized_signatories ? "text-red-500" : ""}>
                                Authorized Signatories Details *
                            </Label>
                            <Textarea
                                id="authorized_signatories"
                                name="authorized_signatories"
                                placeholder="e.g. Signed for Assignor: Mr. Rajesh Kumar; Signed for Assignee: Mr. Aniket Sen"
                                rows={2}
                                value={formData.authorized_signatories || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('authorized_signatories')}
                            />
                            {errors?.authorized_signatories && (
                                <p className="text-xs text-red-500 font-medium">{errors.authorized_signatories}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="execution_place" className={errors?.execution_place ? "text-red-500" : ""}>
                                Execution Place *
                            </Label>
                            <Input
                                id="execution_place"
                                name="execution_place"
                                placeholder="e.g. Bangalore"
                                value={formData.execution_place || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('execution_place')}
                            />
                            {errors?.execution_place && (
                                <p className="text-xs text-red-500 font-medium">{errors.execution_place}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="execution_date" className={errors?.execution_date ? "text-red-500" : ""}>
                                Execution Date *
                            </Label>
                            <Input
                                id="execution_date"
                                name="execution_date"
                                type="date"
                                value={formData.execution_date || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('execution_date')}
                            />
                            {errors?.execution_date && (
                                <p className="text-xs text-red-500 font-medium">{errors.execution_date}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="miscellaneous_clauses" className={errors?.miscellaneous_clauses ? "text-red-500" : ""}>
                                Miscellaneous Clauses *
                            </Label>
                            <Textarea
                                id="miscellaneous_clauses"
                                name="miscellaneous_clauses"
                                placeholder="Entire agreement, severability, waiver, amendments..."
                                rows={2}
                                value={formData.miscellaneous_clauses || ''}
                                onChange={handleInputChange}
                                className={getErrorClass('miscellaneous_clauses')}
                            />
                            {errors?.miscellaneous_clauses && (
                                <p className="text-xs text-red-500 font-medium">{errors.miscellaneous_clauses}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="witnesses">Witness Details (Optional)</Label>
                            <Textarea
                                id="witnesses"
                                name="witnesses"
                                placeholder="Names and addresses of signing witnesses..."
                                rows={2}
                                value={formData.witnesses || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="annexures">Annexures (Optional)</Label>
                            <Input
                                id="annexures"
                                name="annexures"
                                placeholder="e.g. Annexure A: Schedule of Patents & Trademark Certificates"
                                value={formData.annexures || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Configuration Setup Flags */}
            <Card className="border-border shadow-sm">
                <CardHeader className="bg-secondary/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Specific Configuration Flags
                    </CardTitle>
                    <CardDescription>Toggle specific creator, asset, or transaction options</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="software_ip"
                                checked={formData.software_ip || false}
                                onCheckedChange={(checked) => handleSelectChange('software_ip', !!checked)}
                            />
                            <Label htmlFor="software_ip" className="text-sm font-normal cursor-pointer">Software / Code IP</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="employee_assignment"
                                checked={formData.employee_assignment || false}
                                onCheckedChange={(checked) => handleSelectChange('employee_assignment', !!checked)}
                            />
                            <Label htmlFor="employee_assignment" className="text-sm font-normal cursor-pointer">Employee IP Assignment</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="founder_assignment"
                                checked={formData.founder_assignment || false}
                                onCheckedChange={(checked) => handleSelectChange('founder_assignment', !!checked)}
                            />
                            <Label htmlFor="founder_assignment" className="text-sm font-normal cursor-pointer">Founder IP Assignment</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="startup_investment"
                                checked={formData.startup_investment || false}
                                onCheckedChange={(checked) => handleSelectChange('startup_investment', !!checked)}
                            />
                            <Label htmlFor="startup_investment" className="text-sm font-normal cursor-pointer">Startup Investment Assignment</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="patent_assignment"
                                checked={formData.patent_assignment || false}
                                onCheckedChange={(checked) => handleSelectChange('patent_assignment', !!checked)}
                            />
                            <Label htmlFor="patent_assignment" className="text-sm font-normal cursor-pointer">Patent Assignment</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="trademark_assignment"
                                checked={formData.trademark_assignment || false}
                                onCheckedChange={(checked) => handleSelectChange('trademark_assignment', !!checked)}
                            />
                            <Label htmlFor="trademark_assignment" className="text-sm font-normal cursor-pointer">Trademark Assignment</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="research_ip"
                                checked={formData.research_ip || false}
                                onCheckedChange={(checked) => handleSelectChange('research_ip', !!checked)}
                            />
                            <Label htmlFor="research_ip" className="text-sm font-normal cursor-pointer">Research / University IP</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id="cross_border_transaction"
                                checked={formData.cross_border_transaction || false}
                                onCheckedChange={(checked) => handleSelectChange('cross_border_transaction', !!checked)}
                            />
                            <Label htmlFor="cross_border_transaction" className="text-sm font-normal cursor-pointer">Cross-Border Transaction</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IPAssignmentForm;
