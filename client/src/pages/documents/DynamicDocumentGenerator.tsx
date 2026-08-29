import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import DocumentBaseGenerator from './DocumentBaseGenerator';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Info, ListTodo, FileCheck2 } from 'lucide-react';

interface DocumentType {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: string;
    requiredFields: string[];
    optionalFields: string[];
    complexity: string;
    applicableLaws: string[];
}

export default function DynamicDocumentGenerator() {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const [docConfig, setDocConfig] = useState<DocumentType | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (docId) {
            fetchDocConfig();
        }
    }, [docId]);

    const fetchDocConfig = async () => {
        try {
            setLoading(true);
            const response = await api.get('/documents/types');
            const configs: DocumentType[] = response.data.data;
            const current = configs.find(c => c.id === docId);
            
            if (current) {
                setDocConfig(current);
                // Initialize form state
                const initial: Record<string, any> = {};
                const allFields = [...current.requiredFields, ...current.optionalFields];
                allFields.forEach(field => {
                    if (isBooleanField(field)) {
                        initial[field] = false;
                    } else {
                        initial[field] = '';
                    }
                });
                setFormData(initial);
            } else {
                console.error('Document configuration not found for:', docId);
            }
        } catch (error) {
            console.error('Error fetching document configuration:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to identify if field name is a boolean type
    const isBooleanField = (name: string): boolean => {
        const lower = name.toLowerCase();
        return (
            lower.includes('applicable') ||
            lower.includes('allowed') ||
            lower.includes('required') ||
            lower.includes('included') ||
            lower.includes('enabled') ||
            lower.includes('active') ||
            lower.includes('is_') ||
            lower.startsWith('has_') ||
            lower === 'revocable' ||
            lower === 'registration_required' ||
            lower === 'foreign_investor' ||
            lower === 'listed_company' ||
            lower === 'advisors_included' ||
            lower === 'foreign_employees' ||
            lower === 'accelerated_vesting' ||
            lower === 'exclusivity' ||
            lower === 'delegation_allowed' ||
            lower === 'repayment_on_maturity'
        );
    };

    // Helper to identify if field is a date type
    const isDateField = (name: string): boolean => {
        const lower = name.toLowerCase();
        return (
            lower.includes('date') || 
            lower.includes('timeline') || 
            lower.includes('deadline') ||
            lower.endsWith('_at')
        );
    };

    // Helper to identify if field should render as textarea (long description)
    const isTextareaField = (name: string): boolean => {
        const lower = name.toLowerCase();
        return (
            lower.includes('criteria') ||
            lower.includes('schedule') ||
            lower.includes('mechanism') ||
            lower.includes('conditions') ||
            lower.includes('restriction') ||
            lower.includes('description') ||
            lower.includes('details') ||
            lower.includes('specs') ||
            lower.includes('grievance') ||
            lower.includes('demand') ||
            lower.includes('purpose') ||
            lower.includes('roles') ||
            lower.includes('scope') ||
            lower.includes('clauses') ||
            lower.includes('rules') ||
            lower.includes('list') ||
            lower.includes('terms') ||
            lower.includes('remedy') ||
            lower.includes('deliverables')
        );
    };

    // Translate snake_case and camelCase to Title Case
    const formatFieldLabel = (name: string): string => {
        // Handle camelCase
        let result = name.replace(/([A-Z])/g, " $1");
        // Handle snake_case
        result = result.replace(/_/g, " ");
        // Capitalize first letters
        return result
            .trim()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Generate dummy data based on field name
    const fillDummyData = () => {
        if (!docConfig) return;
        
        const dummy: Record<string, any> = {};
        const allFields = [...docConfig.requiredFields, ...docConfig.optionalFields];
        
        allFields.forEach(field => {
            const lower = field.toLowerCase();
            
            if (isBooleanField(field)) {
                dummy[field] = !lower.includes('listed') && !lower.includes('foreign');
            } else if (isDateField(field)) {
                if (lower.includes('due') || lower.includes('end') || lower.includes('expiry') || lower.includes('maturity')) {
                    const future = new Date();
                    future.setDate(future.getDate() + 30);
                    dummy[field] = future.toISOString().split('T')[0];
                } else {
                    dummy[field] = new Date().toISOString().split('T')[0];
                }
            } else if (isTextareaField(field)) {
                if (lower.includes('criteria')) {
                    dummy[field] = "All permanent employees who have completed the initial probation period of 6 months.";
                } else if (lower.includes('schedule')) {
                    dummy[field] = "Vesting over a period of 4 years, with a 1-year cliff (25% vesting at the end of Year 1, and monthly equal vesting thereafter).";
                } else if (lower.includes('mechanism')) {
                    dummy[field] = "The exercise price shall be equal to the Fair Market Value (FMV) as determined by a Registered Valuer.";
                } else if (lower.includes('scope') || lower.includes('purpose')) {
                    dummy[field] = "Evaluation of a prospective business relationship and provision of technology consultancy services.";
                } else if (lower.includes('description') || lower.includes('details') || lower.includes('specs')) {
                    dummy[field] = "Creation and delivery of custom SaaS software components as defined in Section 1 of the Statement of Work.";
                } else if (lower.includes('terms') || lower.includes('conditions')) {
                    dummy[field] = "All actions under this plan must comply with applicable corporate laws. Standard lock-in restriction applies for 12 months.";
                } else if (lower.includes('list')) {
                    dummy[field] = "1. Audited Financial Statements, 2. Incorporation Documents, 3. Capitalization Table, 4. Material Contracts.";
                } else {
                    dummy[field] = `Standard ${formatFieldLabel(field)} details and conditions as followed in standard Indian legal practices.`;
                }
            } else {
                // Text Inputs
                if (lower.includes('company_name') || lower.includes('companyname') || lower.includes('employername')) {
                    dummy[field] = "Vidhik Tech Labs Private Limited";
                } else if (lower.includes('cin')) {
                    dummy[field] = "U72900KA2023PTC174829";
                } else if (lower.includes('registered') || lower.includes('office') || lower.includes('address')) {
                    dummy[field] = "Indiqube Alpha, Plot No. 19, 4th Cross Road, HSR Layout, Sector 6, Bangalore 560102";
                } else if (lower.includes('email')) {
                    dummy[field] = "legal@vidhik.ai";
                } else if (lower.includes('name') && (lower.includes('employee') || lower.includes('candidate') || lower.includes('consultant') || lower.includes('partner') || lower.includes('valuer') || lower.includes('signatory') || lower.includes('person') || lower.includes('attorney') || lower.includes('investor') || lower.includes('guarantor') || lower.includes('lender') || lower.includes('borrower') || lower.includes('seller') || lower.includes('buyer') || lower.includes('lessor') || lower.includes('lessee') || lower.includes('landlord') || lower.includes('tenant'))) {
                    dummy[field] = "Aarav Mehta";
                } else if (lower.includes('title') || lower.includes('position') || lower.includes('designation')) {
                    dummy[field] = "Principal Consultant";
                } else if (lower.includes('amount') || lower.includes('fee') || lower.includes('salary') || lower.includes('rate') || lower.includes('price') || lower.includes('consideration') || lower.includes('capital') || lower.includes('funds')) {
                    dummy[field] = "5,0,000";
                } else if (lower.includes('period') || lower.includes('duration') || lower.includes('term') || lower.includes('tenure') || lower.includes('timeline')) {
                    dummy[field] = "12 months";
                } else if (lower.includes('state') || lower.includes('region')) {
                    dummy[field] = "Karnataka";
                } else if (lower.includes('law') || lower.includes('governing')) {
                    dummy[field] = "Laws of India";
                } else if (lower.includes('jurisdiction')) {
                    dummy[field] = "Bangalore, India";
                } else if (lower.includes('capital') && lower.includes('percentage')) {
                    dummy[field] = "15";
                } else if (lower.includes('pool') || lower.includes('shares')) {
                    dummy[field] = "10,000";
                } else {
                    dummy[field] = `Sample ${formatFieldLabel(field)}`;
                }
            }
        });
        setFormData(dummy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    if (loading) {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-sm">Loading template configurations...</p>
            </div>
        );
    }

    if (!docConfig) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <Info className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Configuration Not Found</h3>
                <p className="text-slate-600 mb-6 max-w-sm">
                    We could not find the configuration details for this template ID. Please go back to the hub.
                </p>
                <Button onClick={() => navigate('/documents')}>Back to Document Hub</Button>
            </div>
        );
    }

    const allFields = [...docConfig.requiredFields, ...docConfig.optionalFields];
    const textFields = allFields.filter(f => !isBooleanField(f));
    const checkboxFields = allFields.filter(f => isBooleanField(f));

    const sidebarTips = [
        {
            title: "Compliance Checklist",
            content: `This ${docConfig.name} is configured to comply with ${docConfig.applicableLaws?.join(', ') || 'Indian Corporate Laws'}.`
        },
        {
            title: "Required Inputs",
            content: `Please ensure all ${docConfig.requiredFields.length} mandatory fields are filled out. Required fields are highlighted for validation.`
        },
        {
            title: "Optional Customization",
            content: "You can customize or leave optional fields empty. If optional definitions or sections are left blank, the generator uses standard legal defaults."
        }
    ];

    return (
        <DocumentBaseGenerator
            title={docConfig.name}
            description={docConfig.description}
            documentType={docConfig.id}
            initialFormData={formData}
            sidebarTips={sidebarTips}
            sidebarDescription={`This dynamic drafting engine automates the creation of a professional ${docConfig.name} matching standard lawyer formats.`}
            docxFilename={`${docConfig.name.replace(/[^a-z0-9]/gi, '_')}.docx`}
            renderForm={(currentFormData, onTextChange, _onSelectChange, setFormDataCallback) => (
                <div className="space-y-8 pt-6">
                    {/* Pre-fill assistant */}
                    <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/90 rounded-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">Form Assistant</h4>
                                <p className="text-sm text-primary">Pre-fill the drafting parameters with standard legal dummy data</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                fillDummyData();
                                if (setFormDataCallback) {
                                    const dummy: Record<string, any> = {};
                                    allFields.forEach(field => {
                                        const lower = field.toLowerCase();
                                        if (isBooleanField(field)) {
                                            dummy[field] = !lower.includes('listed') && !lower.includes('foreign');
                                        } else if (isDateField(field)) {
                                            if (lower.includes('due') || lower.includes('end') || lower.includes('expiry') || lower.includes('maturity')) {
                                                const future = new Date();
                                                future.setDate(future.getDate() + 30);
                                                dummy[field] = future.toISOString().split('T')[0];
                                            } else {
                                                dummy[field] = new Date().toISOString().split('T')[0];
                                            }
                                        } else if (isTextareaField(field)) {
                                            if (lower.includes('criteria')) {
                                                dummy[field] = "All permanent employees who have completed the initial probation period of 6 months.";
                                            } else if (lower.includes('schedule')) {
                                                dummy[field] = "Vesting over a period of 4 years, with a 1-year cliff (25% vesting at the end of Year 1, and monthly equal vesting thereafter).";
                                            } else if (lower.includes('mechanism')) {
                                                dummy[field] = "The exercise price shall be equal to the Fair Market Value (FMV) as determined by a Registered Valuer.";
                                            } else if (lower.includes('scope') || lower.includes('purpose')) {
                                                dummy[field] = "Evaluation of a prospective business relationship and provision of technology consultancy services.";
                                            } else if (lower.includes('description') || lower.includes('details') || lower.includes('specs')) {
                                                dummy[field] = "Creation and delivery of custom SaaS software components as defined in Section 1 of the Statement of Work.";
                                            } else if (lower.includes('terms') || lower.includes('conditions')) {
                                                dummy[field] = "All actions under this plan must comply with applicable corporate laws. Standard lock-in restriction applies for 12 months.";
                                            } else if (lower.includes('list')) {
                                                dummy[field] = "1. Audited Financial Statements, 2. Incorporation Documents, 3. Capitalization Table, 4. Material Contracts.";
                                            } else {
                                                dummy[field] = `Standard ${formatFieldLabel(field)} details and conditions as followed in standard Indian legal practices.`;
                                            }
                                        } else {
                                            if (lower.includes('company_name') || lower.includes('companyname') || lower.includes('employername')) {
                                                dummy[field] = "Vidhik Tech Labs Private Limited";
                                            } else if (lower.includes('cin')) {
                                                dummy[field] = "U72900KA2023PTC174829";
                                            } else if (lower.includes('registered') || lower.includes('office') || lower.includes('address')) {
                                                dummy[field] = "Indiqube Alpha, Plot No. 19, 4th Cross Road, HSR Layout, Sector 6, Bangalore 560102";
                                            } else if (lower.includes('email')) {
                                                dummy[field] = "legal@vidhik.ai";
                                            } else if (lower.includes('name') && (lower.includes('employee') || lower.includes('candidate') || lower.includes('consultant') || lower.includes('partner') || lower.includes('valuer') || lower.includes('signatory') || lower.includes('person') || lower.includes('attorney') || lower.includes('investor') || lower.includes('guarantor') || lower.includes('lender') || lower.includes('borrower') || lower.includes('seller') || lower.includes('buyer') || lower.includes('lessor') || lower.includes('lessee') || lower.includes('landlord') || lower.includes('tenant'))) {
                                                dummy[field] = "Aarav Mehta";
                                            } else if (lower.includes('title') || lower.includes('position') || lower.includes('designation')) {
                                                dummy[field] = "Principal Consultant";
                                            } else if (lower.includes('amount') || lower.includes('fee') || lower.includes('salary') || lower.includes('rate') || lower.includes('price') || lower.includes('consideration') || lower.includes('capital') || lower.includes('funds')) {
                                                dummy[field] = "5,0,000";
                                            } else if (lower.includes('period') || lower.includes('duration') || lower.includes('term') || lower.includes('tenure') || lower.includes('timeline')) {
                                                dummy[field] = "12 months";
                                            } else if (lower.includes('state') || lower.includes('region')) {
                                                dummy[field] = "Karnataka";
                                            } else if (lower.includes('law') || lower.includes('governing')) {
                                                dummy[field] = "Laws of India";
                                            } else if (lower.includes('jurisdiction')) {
                                                dummy[field] = "Bangalore, India";
                                            } else if (lower.includes('capital') && lower.includes('percentage')) {
                                                dummy[field] = "15";
                                            } else if (lower.includes('pool') || lower.includes('shares')) {
                                                dummy[field] = "10,000";
                                            } else {
                                                dummy[field] = `Sample ${formatFieldLabel(field)}`;
                                            }
                                        }
                                    });
                                    setFormDataCallback(dummy);
                                }
                            }}
                            className="bg-white hover:bg-secondary border-primary/20 text-primary gap-2 shadow-sm"
                        >
                            Fill Dummy Data
                        </Button>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <ListTodo className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">Drafting Parameters</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {textFields.map(field => {
                                const isRequired = docConfig.requiredFields.includes(field);
                                const label = formatFieldLabel(field);
                                
                                return (
                                    <div 
                                        key={field} 
                                        className={`${isTextareaField(field) ? 'md:col-span-2' : ''} space-y-2`}
                                    >
                                        <Label className="flex items-center gap-1 font-medium text-slate-900">
                                            {label}
                                            {isRequired && <span className="text-red-500">*</span>}
                                        </Label>
                                        
                                        {isTextareaField(field) ? (
                                            <Textarea
                                                name={field}
                                                value={currentFormData[field] || ''}
                                                onChange={onTextChange || handleInputChange}
                                                placeholder={`Enter details for ${label.toLowerCase()}`}
                                                className="min-h-[100px]"
                                                required={isRequired}
                                            />
                                        ) : (
                                            <Input
                                                name={field}
                                                type={isDateField(field) ? 'date' : 'text'}
                                                value={currentFormData[field] || ''}
                                                onChange={onTextChange || handleInputChange}
                                                placeholder={`Enter ${label.toLowerCase()}`}
                                                required={isRequired}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Boolean Options Checkboxes */}
                    {checkboxFields.length > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-2 pb-2">
                                <FileCheck2 className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">Special Clauses & Setup</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {checkboxFields.map(field => {
                                    const label = formatFieldLabel(field);
                                    
                                    return (
                                        <div key={field} className="flex items-center space-x-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                            <Checkbox
                                                id={field}
                                                checked={currentFormData[field] === true}
                                                onCheckedChange={(checked) => {
                                                    handleCheckboxChange(field, !!checked);
                                                    if (setFormDataCallback) {
                                                        setFormDataCallback({
                                                            ...currentFormData,
                                                            [field]: !!checked
                                                        });
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={field} className="cursor-pointer font-normal text-slate-700 flex-1">
                                                {label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        />
    );
}
