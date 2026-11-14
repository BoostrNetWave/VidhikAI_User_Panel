import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Loader2, FileText, Download, Eye, Edit, Save, CheckCircle, CheckCircle2, PenTool, ShieldCheck, Gavel, Clock, Video, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import api from '@/lib/api';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import DashboardLayout from '@/layout/DashboardLayout';
import { UserNav } from "@/components/dashboard/UserNav";
import { DocumentGeneratorLoader } from '@/components/documents/DocumentGeneratorLoader';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentInfoBar } from '@/components/documents/DocumentInfoBar';
import { DocumentSidebar } from '@/components/documents/DocumentSidebar';
import { DigitalSignatureModal } from '@/components/documents/DigitalSignatureModal';
import { RequestLawyerReviewModal } from '@/components/documents/RequestLawyerReviewModal';
import { ReviewStatusBanner } from '@/components/documents/ReviewStatusBanner';
import { documentReviewService, IDocumentReviewRequest } from '@/services/documentReviewService';
import { parseHtmlToDocx } from '@/lib/docxUtils';
import { applyOrReplaceSignature } from '@/lib/signatureUtils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
interface DocumentBaseGeneratorProps {
    title: string;
    description: string;
    documentType: string;
    initialFormData: any;
    renderForm: (formData: any, handleInputChange: (e: any) => void, handleSelectChange: (name: string, value: string) => void, setFormData?: (data: any) => void, validationErrors?: any) => ReactNode;
    requiredFields?: any;
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
    requiredFields,
    sidebarTips,
    sidebarDescription,
    docxFilename
}: DocumentBaseGeneratorProps) {
    const navigate = useNavigate();
    const [isFormCollapsed, setIsFormCollapsed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generatedDocument, setGeneratedDocument] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [activeReviewRequest, setActiveReviewRequest] = useState<IDocumentReviewRequest | null>(null);
    const [activeViewTab, setActiveViewTab] = useState<'document' | 'review'>('document');
    const [reviewSubTab, setReviewSubTab] = useState<'reviewed' | 'original'>('reviewed');
    const quillRef = useRef<any>(null);

    // Fetch existing review request if any for this document
    useEffect(() => {
        documentReviewService.getUserRequests().then(res => {
            if (res.success && Array.isArray(res.data)) {
                const match = res.data.find(r => 
                    r.documentType === documentType && 
                    r.status !== 'cancelled'
                );
                if (match) {
                    setActiveReviewRequest(match);
                }
            }
        }).catch(() => {});
    }, [documentType]);

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

    const handleDownloadPDF = async () => {
        let content = generatedDocument;
        if (isEditMode && quillRef.current) {
            try {
                content = quillRef.current.getEditor().root.innerHTML;
            } catch {
                // use fallback
            }
        }
        if (!content || !content.trim()) {
            toast.error('No document content to download. Please generate the document first.');
            return;
        }

        try {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="utf-8">
                            <title>${docxFilename.replace('.docx', '')}</title>
                            <style>
                                @page {
                                    size: A4;
                                    margin: 20mm 20mm 20mm 20mm;
                                }
                                body { 
                                    font-family: 'Times New Roman', 'Lora', serif; 
                                    padding: 24px; 
                                    line-height: 1.6; 
                                    text-align: justify;
                                    color: #0f172a;
                                    background: #fff;
                                }
                                h1 { font-size: 18pt; text-align: center; margin-bottom: 20px; font-weight: bold; }
                                h2 { font-size: 14pt; margin-top: 18px; margin-bottom: 10px; font-weight: bold; }
                                h3 { font-size: 12pt; margin-top: 14px; margin-bottom: 8px; font-weight: bold; }
                                p { font-size: 11pt; margin-bottom: 12px; }

                                /* Digital Signature in PDF */
                                .vidhik-signature-block {
                                    display: block !important;
                                    min-width: 250px !important;
                                    max-width: 340px !important;
                                    border-top: none !important;
                                    padding-top: 6px !important;
                                    margin-top: 24px !important;
                                    margin-bottom: 16px !important;
                                    margin-left: 0 !important;
                                    margin-right: auto !important;
                                    text-align: left !important;
                                    page-break-inside: avoid !important;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                                }
                                .vidhik-signature-block.align-right {
                                    margin-left: auto !important;
                                    margin-right: 0 !important;
                                    text-align: left !important;
                                }
                                .vidhik-signature-block.align-center {
                                    margin-left: auto !important;
                                    margin-right: auto !important;
                                    text-align: center !important;
                                }
                                .vidhik-signature-block.align-left {
                                    margin-left: 0 !important;
                                    margin-right: auto !important;
                                    text-align: left !important;
                                }
                                .vidhik-signature-block img, .sig-img {
                                    max-height: 65px !important;
                                    max-width: 220px !important;
                                    width: auto !important;
                                    height: auto !important;
                                    object-fit: contain !important;
                                    display: block !important;
                                    margin-bottom: 6px !important;
                                }
                                .vidhik-signature-block.align-center .sig-img,
                                .vidhik-signature-block.align-center img {
                                    margin-left: auto !important;
                                    margin-right: auto !important;
                                }
                                .sig-typed {
                                    font-size: 26px !important;
                                    line-height: 1.3 !important;
                                    color: #1e3a8a !important;
                                    display: block !important;
                                    margin-bottom: 4px !important;
                                }
                                .sig-org {
                                    font-weight: 700 !important;
                                    font-size: 13px !important;
                                    color: #0f172a !important;
                                    margin: 4px 0 2px 0 !important;
                                    text-transform: uppercase !important;
                                    letter-spacing: 0.5px !important;
                                }
                                .sig-name {
                                    font-weight: 600 !important;
                                    font-size: 13px !important;
                                    color: #1e293b !important;
                                    margin: 2px 0 !important;
                                }
                                .sig-title {
                                    font-size: 11.5px !important;
                                    color: #475569 !important;
                                    margin: 2px 0 !important;
                                    text-transform: uppercase !important;
                                    letter-spacing: 0.3px !important;
                                }
                                .sig-date {
                                    font-size: 11px !important;
                                    color: #64748b !important;
                                    margin: 2px 0 !important;
                                }
                                .sig-badge {
                                    display: inline-flex !important;
                                    align-items: center !important;
                                    gap: 4px !important;
                                    font-size: 9.5px !important;
                                    color: #059669 !important;
                                    background-color: #ecfdf5 !important;
                                    border: 1px solid #a7f3d0 !important;
                                    padding: 2px 6px !important;
                                    border-radius: 4px !important;
                                    margin-top: 6px !important;
                                }
                                @media print {
                                    body { padding: 0; }
                                    .vidhik-signature-block { page-break-inside: avoid; }
                                }
                            </style>
                        </head>
                        <body>
                            ${content}
                            <script>
                                window.onload = function() { 
                                    window.print();
                                    setTimeout(function() { window.close(); }, 500);
                                }
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            } else {
                toast.error('Pop-up blocker prevented PDF generation. Please allow pop-ups for this site.');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF.');
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

    const handleInsertSignature = (signatureHtml: string) => {
        let currentContent = generatedDocument || '';
        if (isEditMode && quillRef.current) {
            try {
                currentContent = quillRef.current.getEditor().root.innerHTML;
            } catch {
                // use fallback
            }
        }

        // Guarantees replacement without creating duplicate signatures
        const updatedHtml = applyOrReplaceSignature(currentContent, signatureHtml);
        setGeneratedDocument(updatedHtml);

        if (isEditMode && quillRef.current) {
            try {
                const editor = quillRef.current.getEditor();
                const existingSig = editor.root.querySelector('.vidhik-signature-block');
                if (existingSig) {
                    const temp = document.createElement('div');
                    temp.innerHTML = signatureHtml;
                    const newEl = temp.firstElementChild;
                    if (newEl) existingSig.replaceWith(newEl);
                } else {
                    editor.root.innerHTML = updatedHtml;
                }
            } catch (e) {
                console.error("Failed to update Quill editor directly:", e);
            }
        }
        toast.success("Digital signature applied to agreement!");
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            {/* Top Workspace Tab Switcher when Lawyer Review is active */}
            {activeReviewRequest && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs mb-6">
                    <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl shadow-xs border border-slate-200/70">
                        <button
                            type="button"
                            onClick={() => setActiveViewTab('review')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeViewTab === 'review'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <Gavel className="h-4 w-4" />
                            <span>⚖️ Lawyer Review Workspace</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                                activeViewTab === 'review' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                                {activeReviewRequest.status === 'pending_quote' ? 'Quote Pending' :
                                 activeReviewRequest.status === 'payment_pending' ? 'Payment Due' :
                                 activeReviewRequest.status === 'in_review' ? 'In Review' : 'Completed'}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveViewTab('document')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeViewTab === 'document'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <FileText className="h-4 w-4" />
                            <span>📄 Document Generator &amp; Form</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground px-3">
                        <span className="font-mono text-[11px] font-bold text-slate-800">REQ: {activeReviewRequest.requestId}</span>
                        <span>&bull;</span>
                        <span className="text-[11px] capitalize font-medium text-slate-600">{activeReviewRequest.urgency} Priority</span>
                    </div>
                </div>
            )}

            {/* TAB 1: LAWYER REVIEW WORKSPACE */}
            {activeReviewRequest && activeViewTab === 'review' ? (
                <div className="space-y-6">
                    {/* Visual 5-Step Process Stepper */}
                    <Card className="rounded-2xl border border-slate-200/80 shadow-xs bg-white p-5 overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {/* Step 1 */}
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Step 1</div>
                                    <div className="text-xs font-bold text-slate-800">Requested</div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-center gap-2.5">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                                    activeReviewRequest.quoteAmount ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                                }`}>
                                    {activeReviewRequest.quoteAmount ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Step 2</div>
                                    <div className="text-xs font-bold text-slate-800">
                                        {activeReviewRequest.quoteAmount ? `Fee Quoted (₹${activeReviewRequest.quoteAmount})` : 'Review Quoting'}
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-center gap-2.5">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                                    ['in_review', 'completed'].includes(activeReviewRequest.status)
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : activeReviewRequest.status === 'payment_pending'
                                        ? 'bg-indigo-100 text-indigo-700 animate-pulse'
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {['in_review', 'completed'].includes(activeReviewRequest.status) ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Clock className="h-4 w-4" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Step 3</div>
                                    <div className="text-xs font-bold text-slate-800">
                                        {['in_review', 'completed'].includes(activeReviewRequest.status) ? 'Paid & Verified' : 'Razorpay Payment'}
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-center gap-2.5">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                                    activeReviewRequest.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : activeReviewRequest.status === 'in_review'
                                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {activeReviewRequest.status === 'completed' ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Step 4</div>
                                    <div className="text-xs font-bold text-slate-800">Legal Audit &amp; Edit</div>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex items-center gap-2.5">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                                    activeReviewRequest.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Step 5</div>
                                    <div className="text-xs font-bold text-slate-800">Final Delivered</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Review Action Card / Banner */}
                    <ReviewStatusBanner
                        request={activeReviewRequest}
                        onUpdate={(updated) => setActiveReviewRequest(updated)}
                        onApplyReviewedContent={(content) => {
                            setGeneratedDocument(content);
                            setActiveViewTab('document');
                            toast.success('Loaded lawyer-reviewed draft into the document editor!');
                        }}
                    />

                    {/* Review Details & Document Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Document Viewer Column */}
                        <div className="lg:col-span-8 space-y-4">
                            <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden bg-white">
                                <CardHeader className="p-4 sm:p-5 border-b bg-slate-50/70">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setReviewSubTab('reviewed')}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                    reviewSubTab === 'reviewed'
                                                        ? 'bg-emerald-700 text-white shadow-xs'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                                }`}
                                            >
                                                ⚖️ Lawyer Revised Version
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setReviewSubTab('original')}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                    reviewSubTab === 'original'
                                                        ? 'bg-slate-900 text-white shadow-xs'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                                }`}
                                            >
                                                📄 Original Draft
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {activeReviewRequest.reviewedContent && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setGeneratedDocument(activeReviewRequest.reviewedContent || '');
                                                        setActiveViewTab('document');
                                                        toast.success('Loaded lawyer-reviewed draft into the editor!');
                                                    }}
                                                    className="text-xs h-8 px-3 rounded-xl border-emerald-300 text-emerald-800 bg-white hover:bg-emerald-50 font-semibold gap-1.5 shadow-2xs"
                                                >
                                                    <Edit className="h-3.5 w-3.5 text-emerald-600" />
                                                    Edit in Document Editor
                                                </Button>
                                            )}
                                            {activeReviewRequest.reviewedDocumentFile && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => documentReviewService.downloadReviewFile(
                                                        activeReviewRequest.reviewedDocumentFile!,
                                                        activeReviewRequest.reviewedDocumentFileName || `${title.replace(/\s+/g, '_')}_reviewed.docx`
                                                    )}
                                                    className="text-xs h-8 px-3 rounded-xl border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold gap-1.5 shadow-2xs"
                                                >
                                                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                                                    Download Lawyer File
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    {reviewSubTab === 'reviewed' ? (
                                        activeReviewRequest.reviewedContent ? (
                                            <div className="flex flex-col w-full">
                                                <div className="bg-emerald-50 border-b border-emerald-200/90 px-4 py-2.5 flex items-center justify-between gap-2 text-xs flex-wrap">
                                                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                        Lawyer Revised Version (Amended by {activeReviewRequest.assignedLawyerName || 'Senior Legal Counsel'})
                                                    </span>
                                                    {activeReviewRequest.reviewedDocumentFileName && (
                                                        <span className="text-emerald-700 font-semibold text-[11px] bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                            Source File: {activeReviewRequest.reviewedDocumentFileName}
                                                        </span>
                                                    )}
                                                </div>
                                                <DocumentInfoBar content={activeReviewRequest.reviewedContent} />
                                                <DocumentPreview content={activeReviewRequest.reviewedContent} />
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center space-y-3">
                                                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                                                    <Sparkles className="h-6 w-6 animate-spin" />
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-800">Advocate Is Currently Reviewing</h4>
                                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                                    Your lawyer is reviewing your agreement and drafting the amendments. Once delivered, the finalized legal text will appear here.
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setReviewSubTab('original')}
                                                    className="text-xs rounded-xl"
                                                >
                                                    View Original Draft Meanwhile
                                                </Button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex flex-col w-full">
                                            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 text-xs flex-wrap">
                                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                                    <FileText className="h-4 w-4 text-slate-600" />
                                                    Original Generated Draft (Submitted by You)
                                                </span>
                                                <span className="text-slate-500 font-mono text-[11px]">
                                                    Req: {activeReviewRequest.requestId}
                                                </span>
                                            </div>
                                            <DocumentInfoBar content={activeReviewRequest.originalContent || generatedDocument} />
                                            <DocumentPreview content={activeReviewRequest.originalContent || generatedDocument} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Review Information & Video Consultation Sidebar */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* 1-on-1 Free Consultation Card */}
                            <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 rounded-2xl p-5 shadow-xs space-y-3">
                                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                                    <Video className="h-4 w-4 text-indigo-600" />
                                    1-on-1 Video Consultation
                                </div>
                                <p className="text-xs text-indigo-900/80 leading-relaxed">
                                    Discuss clause changes and ask questions live with your advocate anytime. No extra consultation fees are required.
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => navigate(`/document-reviews/${activeReviewRequest._id}/consultation?role=client`)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 rounded-xl shadow-xs gap-2"
                                >
                                    <Video className="h-4 w-4" />
                                    Join Video Consultation Room
                                </Button>
                            </Card>

                            {/* Client Instructions */}
                            <Card className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-xs space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    <FileText className="h-4 w-4 text-slate-500" />
                                    Your Submitted Instructions
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                                    {activeReviewRequest.userNotes}
                                </div>
                            </Card>

                            {/* Review Metadata */}
                            <Card className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-xs space-y-3">
                                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Review Details
                                </div>
                                <div className="space-y-2 text-xs divide-y divide-slate-100">
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-muted-foreground">Document Type:</span>
                                        <span className="font-semibold capitalize text-slate-800">{activeReviewRequest.documentType}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-muted-foreground">Turnaround Priority:</span>
                                        <span className="font-semibold capitalize text-slate-800">{activeReviewRequest.urgency}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-muted-foreground">Assigned Counsel:</span>
                                        <span className="font-semibold text-slate-800">{activeReviewRequest.assignedLawyerName || 'Senior Legal Advocate'}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-muted-foreground">Requested On:</span>
                                        <span className="font-semibold text-slate-800">
                                            {new Date(activeReviewRequest.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                /* TAB 2: ORIGINAL GENERATOR FORM & GENERATED AGREEMENT */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-l-4 border-l-zinc-900">
                            <CardHeader className="flex flex-row gap-4 space-y-0">
                                <div className="h-12 w-12 bg-secondary text-primary rounded-lg flex items-center justify-center shrink-0">
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
                            <Card className="border border-slate-200/80 shadow-xs rounded-xl overflow-hidden">
                                <CardHeader className="p-4 sm:p-5 border-b bg-white">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                                                Generated Agreement
                                            </CardTitle>
                                            {(generatedDocument.includes('vidhik-signature-block') || generatedDocument.includes('sig-badge') || generatedDocument.includes('Digitally Signed')) && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                                    Digitally Signed
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                                            {activeReviewRequest && ['pending_quote', 'payment_pending', 'in_review'].includes(activeReviewRequest.status) ? (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setActiveViewTab('review')}
                                                    className="gap-1.5 text-xs h-8 px-3 border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold whitespace-nowrap"
                                                >
                                                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                                                    Review: {activeReviewRequest.status === 'pending_quote' ? 'Quote Pending' : activeReviewRequest.status === 'payment_pending' ? 'Payment Due' : 'In Review'}
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => setIsReviewModalOpen(true)}
                                                    className="gap-1.5 text-xs h-8 px-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-xs hover:shadow transition-all whitespace-nowrap"
                                                >
                                                    <Gavel className="h-3.5 w-3.5" />
                                                    Request Lawyer Review
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsSignatureModalOpen(true)}
                                                className="gap-1.5 text-xs h-8 px-3 text-indigo-700 border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 font-semibold whitespace-nowrap"
                                            >
                                                <PenTool className="h-3.5 w-3.5" />
                                                Add Digital Signature
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditMode(!isEditMode)}
                                                className="gap-1.5 text-xs h-8 px-3 text-slate-700 hover:text-slate-900 whitespace-nowrap"
                                            >
                                                {isEditMode ? <Eye className="h-3.5 w-3.5" /> : <Edit className="h-3.5 w-3.5" />}
                                                {isEditMode ? 'Preview' : 'Edit'}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs h-8 px-3 text-slate-700 hover:text-slate-900 whitespace-nowrap">
                                                        <Download className="h-3.5 w-3.5" />
                                                        Download
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={handleDownloadPDF} className="cursor-pointer">
                                                        Download PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={handleDownloadDOCX} className="cursor-pointer">
                                                        Download DOCX
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Button
                                                type="button"
                                                variant={saveStatus === 'saved' ? "ghost" : "default"}
                                                size="sm"
                                                onClick={handleSaveToWorkspace}
                                                disabled={isSaving || saveStatus === 'saved'}
                                                className={`gap-1.5 text-xs h-8 px-3.5 whitespace-nowrap font-medium ${saveStatus === 'saved' ? 'text-green-600 bg-green-50 hover:bg-green-100 border border-green-200' : ''}`}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : saveStatus === 'saved' ? (
                                                    <>
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Saved to Workspace
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-3.5 w-3.5" />
                                                        Save to Workspace
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0 overflow-hidden">
                                    {isEditMode ? (
                                        <div className="p-8 w-full max-w-[210mm] mx-auto">
                                            <ReactQuill
                                                ref={quillRef}
                                                value={generatedDocument}
                                                onChange={setGeneratedDocument}
                                                theme="snow"
                                                className="min-h-[600px] bg-white shadow-md font-serif text-slate-900"
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
            )}

            {/* Digital Signature Modal */}
            <DigitalSignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onInsertSignature={handleInsertSignature}
                defaultName={
                    formData?.authorizedSignatory ||
                    formData?.signatory_name ||
                    formData?.signatoryName ||
                    formData?.employer_name ||
                    formData?.employerName ||
                    formData?.clientName ||
                    formData?.client_name ||
                    formData?.consultantName ||
                    formData?.party1_signatory ||
                    formData?.party2_signatory ||
                    ''
                }
            />

            {/* Request Lawyer Review Modal */}
            <RequestLawyerReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                documentTitle={title}
                documentType={documentType}
                originalContent={generatedDocument}
                onRequestSubmitted={(newReq) => {
                    setActiveReviewRequest(newReq);
                }}
            />
        </DashboardLayout>
    );
}
