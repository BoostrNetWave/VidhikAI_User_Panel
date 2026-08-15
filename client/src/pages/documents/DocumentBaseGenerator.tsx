import { useState, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Loader2, FileText, Download, Eye, Edit, Save, CheckCircle } from "lucide-react";
import api from '@/lib/api';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";
import DashboardLayout from '@/layout/DashboardLayout';
import { UserNav } from "@/components/dashboard/UserNav";
import { DocumentGeneratorLoader } from '@/components/documents/DocumentGeneratorLoader';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentInfoBar } from '@/components/documents/DocumentInfoBar';
import { DocumentSidebar } from '@/components/documents/DocumentSidebar';
import { parseHtmlToDocx } from '@/lib/docxUtils';

interface DocumentBaseGeneratorProps {
    title: string;
    description: string;
    documentType: string;
    initialFormData: any;
    renderForm: (formData: any, handleInputChange: (e: any) => void, handleSelectChange: (name: string, value: string) => void, setFormData?: (data: any) => void) => ReactNode;


    sidebarTips: { title: string; content: string }[];
    sidebarDescription: string;
    docxFilename: string;
}

export default function DocumentBaseGenerator({
    title,
    description,
    documentType,
    initialFormData,
    renderForm,
    sidebarTips,
    sidebarDescription,
    docxFilename
}: DocumentBaseGeneratorProps) {
    const [isFormCollapsed, setIsFormCollapsed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generatedDocument, setGeneratedDocument] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleGenerateDocument = async () => {
        setIsGenerating(true);
        setGenerationProgress(0);

        const progressInterval = setInterval(() => {
            setGenerationProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            const response = await api.post('/documents/generate', {
                documentType,
                formData
            });

            clearInterval(progressInterval);
            setGenerationProgress(100);

            setTimeout(() => {
                setGeneratedDocument(response.data.document);
                setIsFormCollapsed(true);
                setGenerationProgress(0);
            }, 500);
        } catch (error: any) {
            clearInterval(progressInterval);
            setGenerationProgress(0);
            console.error('Error generating document:', error);
            if (error.response?.status === 403 && error.response?.data?.error === 'limit_reached') {
                toast.error('Subscription limit reached', {
                    description: error.response.data.message || 'You have reached the monthly document generation limit for your plan.',
                    action: {
                        label: 'Upgrade Plan',
                        onClick: () => window.location.href = '/user/billing'
                    }
                });
            } else {
                toast.error(error.response?.data?.message || 'Failed to generate document. Please try again.');
            }
        } finally {
            setTimeout(() => {
                setIsGenerating(false);
            }, 600);
        }
    };

    const handleDownloadDOCX = async () => {
        try {
            console.log('Starting DOCX generation...');

            if (!generatedDocument) {
                console.error('No document content found');
                toast.error('No document content to download. Please generate the document first.');
                return;
            }

            const docChildren = parseHtmlToDocx(generatedDocument);
            console.log('Parsed document children:', docChildren.length);

            if (docChildren.length === 0) {
                console.warn('Docx parser returned no children elements, adding a placeholder');
                docChildren.push(new Paragraph({ children: [new TextRun("Document content is empty.")] }));
            }

            const doc = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: "Calibri",
                            },
                        },
                    },
                },
                sections: [{
                    properties: {
                        page: {
                            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                        },
                    },
                    children: docChildren,
                }],
            });

            console.log('Packing document to blob...');
            const blob = await Packer.toBlob(doc);
            console.log('Blob created:', blob.size, 'bytes', 'type:', blob.type);

            // Primary method: file-saver
            try {
                saveAs(blob, docxFilename);
                console.log('Download triggered via file-saver for:', docxFilename);
            } catch (saveError) {
                console.warn('file-saver failed, trying manual download link...', saveError);
                // Fallback method: manual link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = docxFilename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);
                console.log('Download triggered via manual link for:', docxFilename);
            }

        } catch (error) {
            console.error('Error in handleDownloadDOCX:', error);
            toast.error(`Failed to generate DOCX: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleSaveToWorkspace = async () => {
        if (!generatedDocument) return;

        setIsSaving(true);
        setSaveStatus('saving');

        try {
            const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = user._id || user.id;

            if (!userId) {
                toast.error('You must be logged in to save documents.');
                setIsSaving(false);
                setSaveStatus('idle');
                return;
            }

            await api.post('/documents/save', {
                userId,
                title,
                documentType,
                content: generatedDocument,
                formData
            });

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Error saving document:', error);
            toast.error('Failed to save document to workspace.');
            setSaveStatus('idle');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-l-4 border-l-violet-600">
                        <CardHeader className="flex flex-row gap-4 space-y-0">
                            <div className="h-12 w-12 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center shrink-0">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl">{title}</CardTitle>
                                <CardDescription>{description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        {isGenerating ? (
                            <DocumentGeneratorLoader progress={generationProgress} />
                        ) : (
                            <>
                                <CardHeader
                                    className="cursor-pointer hover:bg-muted/50 transition-colors flex flex-row items-center justify-between"
                                    onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                                >
                                    <CardTitle className="text-lg">Contract Details</CardTitle>
                                    {isFormCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                                </CardHeader>

                                {!isFormCollapsed && (
                                    <div className="p-6 pt-0 space-y-8">
                                        {renderForm(formData, handleInputChange, handleSelectChange, setFormData)}

                                        <div className="pt-4 border-t space-y-4">
                                            <Button
                                                className="w-full gap-2 py-6 text-base font-semibold"
                                                onClick={handleGenerateDocument}
                                                disabled={isGenerating}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Generating Document...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText className="h-5 w-5" />
                                                        Generate {title}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>

                    {generatedDocument && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle>Generated Agreement</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)} className="gap-2">
                                        {isEditMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                                        {isEditMode ? 'Preview' : 'Edit'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDownloadDOCX} className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Download DOCX
                                    </Button>
                                    <Button
                                        variant={saveStatus === 'saved' ? "ghost" : "default"}
                                        size="sm"
                                        onClick={handleSaveToWorkspace}
                                        disabled={isSaving || saveStatus === 'saved'}
                                        className={`gap-2 ${saveStatus === 'saved' ? 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200' : ''}`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : saveStatus === 'saved' ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Saved to Workspace
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                Save to Workspace
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-hidden">
                                {isEditMode ? (
                                    <div className="p-8 w-full max-w-[210mm] mx-auto">
                                        <ReactQuill
                                            value={generatedDocument}
                                            onChange={setGeneratedDocument}
                                            theme="snow"
                                            className="min-h-[600px] bg-white shadow-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full h-full">
                                        <DocumentInfoBar content={generatedDocument} />
                                        <DocumentPreview content={generatedDocument} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <DocumentSidebar
                        description={sidebarDescription}
                        tips={sidebarTips}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
