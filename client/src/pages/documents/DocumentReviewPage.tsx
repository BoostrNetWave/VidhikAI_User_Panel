import React, { useState, useEffect, useRef } from 'react';
import {
    Upload,
    FileText,
    Shield,
    Zap,
    Search,
    Share2,
    AlertTriangle,
    Loader2,
    ChevronRight,
    ChevronLeft,
    Activity,
    FileCheck,
    Maximize2,
    Sparkles,
    Check,
    Info,
    X,
    ShieldAlert,
    FileEdit,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    FolderOpen,
    BookmarkCheck,
    Copy,
    CheckCheck,
    FileSearch,
    Sliders,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Save,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import { PREVIEW_DESIGN } from '@/components/documents/DocumentPreview';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import api from '@/lib/api';
import { toast } from 'sonner';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

type ReviewState = 'UPLOAD' | 'PROCESSING' | 'COMPLETED' | 'ERROR';

export default function DocumentReviewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState<ReviewState>(id ? 'PROCESSING' : 'UPLOAD');
    const [viewMode, setViewMode] = useState<'SUMMARY' | 'DETAILED'>('DETAILED');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sourceDocument, setSourceDocument] = useState<any>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDeepScanEnabled] = useState(false);
    const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
    const [selectedClauseIndex, setSelectedClauseIndex] = useState<number | null>(null);
    const [copiedClauseIdx, setCopiedClauseIdx] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [logs, setLogs] = useState<{ msg: string, status: 'pending' | 'loading' | 'done' }[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Workspace Documents Integration State
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
    const [workspaceDocs, setWorkspaceDocs] = useState<any[]>([]);
    const [isFetchingWorkspaceDocs, setIsFetchingWorkspaceDocs] = useState(false);
    const [workspaceSearch, setWorkspaceSearch] = useState("");
    const [isSavingToWorkspace, setIsSavingToWorkspace] = useState(false);
    const [isSavedToWorkspace, setIsSavedToWorkspace] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchSharedReview = async () => {
                try {
                    const response = await api.get(`/documents/shared-review/${id}`);
                    if (response.data.success) {
                        const sharedData = response.data.data;
                        // Construct the expected analysisData format
                        setAnalysisData({
                            ...sharedData.analysisData,
                            fullText: sharedData.fullText
                        });
                        setSelectedFile(new File([], sharedData.fileName));
                        setProgress(100);
                        setState('COMPLETED');
                        setViewMode('DETAILED');
                    }
                } catch (error) {
                    console.error("Failed to load shared document:", error);
                    toast.error("Shared document not found or expired.");
                    navigate('/documents/review');
                }
            };
            fetchSharedReview();
        } else if (location.state && (location.state as any).fileToReview) {
            const file = (location.state as any).fileToReview;
            const doc = (location.state as any).selectedDocument;
            setSelectedFile(file);
            if (doc) {
                setSourceDocument(doc);
                try {
                    sessionStorage.setItem('vidhik_selected_review_doc', JSON.stringify(doc));
                } catch (e) {}
            }
            startAnalysis(file);
            // Clear the state so it doesn't run again on browser back/forward,
            // while sessionStorage preserves the selected review document
            window.history.replaceState({}, document.title);
        } else {
            // Restore preserved document or analysis session from sessionStorage
            try {
                const cachedDocStr = sessionStorage.getItem('vidhik_selected_review_doc');
                const cachedAnalysisStr = sessionStorage.getItem('vidhik_active_review_data');
                if (cachedDocStr) {
                    const cachedDoc = JSON.parse(cachedDocStr);
                    setSourceDocument(cachedDoc);
                    const file = new File(
                        [cachedDoc.content || ''],
                        `${cachedDoc.title || 'Document'}.txt`,
                        { type: 'text/plain' }
                    );
                    setSelectedFile(file);

                    if (cachedAnalysisStr) {
                        const parsedAnalysis = JSON.parse(cachedAnalysisStr);
                        setAnalysisData(parsedAnalysis);
                        setProgress(100);
                        setState('COMPLETED');
                        setViewMode('DETAILED');
                    } else {
                        startAnalysis(file);
                    }
                }
            } catch (e) {
                console.error("Failed to restore preserved review session:", e);
            }
        }
    }, [id, navigate, location.state]);

    // Fetch user workspace documents on mount
    const fetchWorkspaceDocuments = async () => {
        try {
            setIsFetchingWorkspaceDocs(true);
            const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = user._id || user.id;
            if (!userId) return;
            const res = await api.get(`/documents/user/${userId}`);
            if (res.data.success) {
                setWorkspaceDocs(res.data.data || []);
            }
        } catch (e) {
            console.error("Failed to fetch workspace documents:", e);
        } finally {
            setIsFetchingWorkspaceDocs(false);
        }
    };

    useEffect(() => {
        fetchWorkspaceDocuments();
    }, []);

    // Select document from My Documents workspace to review
    const handleSelectWorkspaceDoc = (doc: any) => {
        let cleanContent = '';
        if (doc.content) {
            cleanContent = doc.content
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\/(p|div|h[1-6]|li|tr|blockquote|section|article)>/gi, '\n\n')
                .replace(/<hr\s*[\/]?>/gi, '\n---\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\r\n/g, '\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
        }

        const file = new File(
            [cleanContent || doc.content || ''],
            `${doc.title || 'Workspace_Document'}.txt`,
            { type: 'text/plain' }
        );
        setSourceDocument(doc);
        setSelectedFile(file);
        setIsWorkspaceModalOpen(false);
        startAnalysis(file);
    };

    // Save analyzed report directly to My Documents workspace
    const handleSaveToWorkspace = async () => {
        if (!analysisData) return;
        try {
            setIsSavingToWorkspace(true);
            const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = user._id || user.id;

            const docTitle = `Review - ${selectedFile?.name?.replace(/\.[^/.]+$/, "") || sourceDocument?.title || 'Legal Document'}`;
            
            const formattedContent = `
                <h2>${docTitle}</h2>
                <p><strong>Compliance Score:</strong> ${analysisData.complianceScore || 0}% | <strong>Risk Level:</strong> ${analysisData.riskLevel || 'N/A'}</p>
                <p><strong>Category:</strong> ${analysisData.documentCategory || 'Legal Document'}</p>
                <p><strong>Audit Summary:</strong> ${analysisData.summary || ''}</p>
                <hr />
                <h3>Audited Document Content</h3>
                ${(analysisData.fullText || '').split('\n').map((line: string) => `<p>${line}</p>`).join('')}
            `;

            const response = await api.post('/documents/save', {
                userId,
                title: docTitle,
                documentType: 'reviewed-contract',
                content: formattedContent,
                formData: {
                    reviewAnalysis: analysisData,
                    reviewedAt: new Date().toISOString(),
                    originalFileName: selectedFile?.name || sourceDocument?.title
                }
            });

            if (response.data.success) {
                toast.success("Document Analysis saved to My Documents!", {
                    description: `"${docTitle}" is now available in your workspace.`,
                    action: {
                        label: "View in Workspace",
                        onClick: () => navigate('/documents/workspace')
                    }
                });
                setIsSavedToWorkspace(true);
                fetchWorkspaceDocuments();
            }
        } catch (err: any) {
            console.error("Save to workspace failed:", err);
            toast.error("Failed to save to My Documents", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setIsSavingToWorkspace(false);
        }
    };

    // Copy suggestion to clipboard
    const handleCopySuggestion = async (text: string, idx: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedClauseIdx(idx);
            toast.success("Suggested clause copied to clipboard!");
            setTimeout(() => setCopiedClauseIdx(null), 2000);
        } catch (e) {
            toast.error("Failed to copy to clipboard");
        }
    };

    // Navigate between highlighted clauses
    const handleNavigateClause = (direction: 'next' | 'prev', totalCount: number) => {
        if (totalCount === 0) return;
        let nextIdx = 0;
        if (selectedClauseIndex !== null) {
            if (direction === 'next') {
                nextIdx = (selectedClauseIndex + 1) % totalCount;
            } else {
                nextIdx = (selectedClauseIndex - 1 + totalCount) % totalCount;
            }
        }
        setSelectedClauseIndex(nextIdx);
        const element = document.getElementById(`highlight-clause-${nextIdx}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Simulated Log Steps
    const getAnalysisSteps = (deepScan: boolean) => [
        "Document Ingested Successfully",
        "Extracting Clauses and Metadata",
        "Identifying Parties",
        ...(deepScan ? ["Deep Scan: Running Neural Sensitivity Model", "Deep Scan: Cross-referencing Case Law"] : ["Running Risk Sensitivity Model"]),
        "Cross-referencing Statutes",
        "Generating Optimization Suggestions",
        "Finalizing Compliance Score"
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            startAnalysis(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            startAnalysis(file);
        }
    };

    const startAnalysis = async (file: File) => {
        setState('PROCESSING');
        setProgress(0);
        const currentSteps = getAnalysisSteps(isDeepScanEnabled);
        setLogs(currentSteps.map(step => ({ msg: step, status: 'pending' })));

        try {
            const user = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            const userId = user._id || user.id || "PRO_USER_001";
            
            // Send file via FormData for real server-side parsing
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);
            formData.append('isDeepScanEnabled', String(isDeepScanEnabled));

            const response = await api.post('/documents/review', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setAnalysisData(response.data.data);
                try {
                    sessionStorage.setItem('vidhik_active_review_data', JSON.stringify(response.data.data));
                } catch (e) {}
                setProgress(100);
                setTimeout(() => {
                    setViewMode('DETAILED');
                    setState('COMPLETED');
                }, 500);
            }
        } catch (error: any) {
            console.error('Analysis failed:', error);
            if (error.response?.status === 403 && error.response?.data?.error === 'limit_reached') {
                toast.error('Subscription limit reached', {
                    description: error.response.data.message || 'You have reached the monthly contract review limit for your plan.',
                    action: {
                        label: 'Upgrade Plan',
                        onClick: () => window.location.href = '/user/billing'
                    }
                });
                handleResetReview();
            } else if (error.response?.status === 403 && error.response?.data?.error === 'INSUFFICIENT_CREDITS') {
                toast.error('Insufficient Credits', {
                    description: error.response?.data?.message || 'You do not have enough credits to complete this document review.',
                    action: {
                        label: 'Upgrade Plan',
                        onClick: () => window.location.href = '/user/billing'
                    }
                });
                handleResetReview();
            } else {
                const errorMessage = error.response?.data?.message || "AI Analysis failed. Please verify the document and try again.";
                toast.error(error.response?.data?.error || "Analysis Failed", {
                    description: errorMessage
                });
                setAnalysisData(null);
                setAnalysisError(errorMessage);
                setState('ERROR');
            }
        }
    };

    const handleResetReview = () => {
        try {
            sessionStorage.removeItem('vidhik_selected_review_doc');
            sessionStorage.removeItem('vidhik_active_review_data');
        } catch (e) {}
        setSourceDocument(null);
        setSelectedFile(null);
        setAnalysisData(null);
        setAnalysisError(null);
        setProgress(0);
        setState('UPLOAD');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (state === 'PROCESSING') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 92) {
                        return 92; // Wait at 92% until server response finishes
                    }
                    return prev + 1;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [state]);

    useEffect(() => {
        if (state === 'PROCESSING') {
            const currentSteps = getAnalysisSteps(isDeepScanEnabled);
            const stepDuration = 100 / currentSteps.length;
            const currentStepIndex = Math.floor(progress / stepDuration);

            setLogs(prev => prev.map((log, idx) => {
                if (idx < currentStepIndex) return { ...log, status: 'done' };
                if (idx === currentStepIndex) return { ...log, status: 'loading' };
                return log;
            }));
        }
    }, [progress, state]);

    // Scroll logs to bottom
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleShare = async () => {
        if (!analysisData || !analysisData.fullText) {
            toast.error('No analysis data to share.');
            return;
        }

        try {
            const toastId = toast.loading('Generating shareable link...');
            const response = await api.post('/documents/share-review', {
                fullText: analysisData.fullText,
                analysisData: analysisData,
                fileName: selectedFile?.name || 'Vidhik_AI_Document'
            });

            toast.dismiss(toastId);

            if (response.data.success) {
                const shareId = response.data.id;
                // Generate a URL that works on localhost or deployed depending on where this is running
                const shareUrl = `${window.location.origin}/user/documents/shared/${shareId}`;

                const shareData = {
                    title: 'Vidhik AI Legal Research Report',
                    text: `I've analyzed a legal document using Vidhik AI. Compliance Score: ${analysisData?.complianceScore || 85}%.`,
                    url: shareUrl
                };

                if (navigator.share) {
                    await navigator.share(shareData);
                    toast.success("Report shared successfully!");
                } else {
                    await navigator.clipboard.writeText(`${shareData.text} Check it out here: ${shareData.url}`);
                    toast.success("Share link copied to clipboard!");
                }
            } else {
                toast.error('Failed to generate share link.');
            }
        } catch (error) {
            console.error("Error sharing:", error);
            toast.error("Failed to share report.");
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-[1400px] mx-auto min-h-screen pb-20">
                {state === 'UPLOAD' && renderUploadView()}
                {state === 'PROCESSING' && renderProcessingView()}
                {state === 'COMPLETED' && renderCompletedView()}
                {state === 'ERROR' && renderErrorView()}
            </div>
        </DashboardLayout>
    );

    function renderUploadView() {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analyze New Document</h1>
                    <p className="text-gray-500">Upload your legal contracts for instant AI risk assessment and optimization.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Zone */}
                    <div className="lg:col-span-2 space-y-6">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.doc,.txt,.rtf,.odt,.html,.htm,.md"
                        />
                        <div
                            className={`border-2 border-dashed rounded-xl p-16 md:p-20 flex flex-col items-center justify-center space-y-6 transition-all cursor-pointer group ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-border-strong hover:bg-secondary/50'}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">Drag and drop your files here</h3>
                                <p className="text-muted-foreground max-w-sm text-sm">Upload contracts, agreements, or legal documents. Supports PDF, DOCX, DOC, TXT, RTF, ODT, HTML & MD (Max 25MB).</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                <Button
                                    size="lg"
                                    className="h-12 px-7 rounded-xl gap-2 font-semibold shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <FileText className="h-4 w-4" />
                                    Browse Computer Files
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 px-7 rounded-xl gap-2 font-semibold border-primary/30 text-primary hover:bg-primary/5 hover:border-primary shadow-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWorkspaceModalOpen(true);
                                        fetchWorkspaceDocuments();
                                    }}
                                >
                                    <FolderOpen className="h-4 w-4 text-primary" />
                                    Choose from My Documents
                                </Button>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar: Workspace Documents Quick Access & How it Works */}
                    <div className="space-y-6">
                        {/* Workspace Documents Quick Access Card */}
                        <Card className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/30 shadow-sm overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 py-3.5 px-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                                        <FolderOpen className="h-4 w-4 text-primary" />
                                        <span>My Documents Workspace</span>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] font-bold">
                                        {workspaceDocs.length} Docs
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3.5">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Instantly review legal documents and contracts already saved or generated in your workspace.
                                </p>

                                {isFetchingWorkspaceDocs ? (
                                    <div className="py-6 text-center">
                                        <Loader2 className="h-5 w-5 text-primary animate-spin mx-auto" />
                                    </div>
                                ) : workspaceDocs.length === 0 ? (
                                    <div className="p-4 bg-secondary/30 rounded-xl text-center space-y-1 border border-border">
                                        <p className="text-xs font-semibold text-muted-foreground">No documents in workspace yet</p>
                                        <p className="text-[10px] text-muted-foreground">Generated contracts will be saved here automatically.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {workspaceDocs.slice(0, 3).map((doc) => (
                                            <div 
                                                key={doc._id}
                                                onClick={() => handleSelectWorkspaceDoc(doc)}
                                                className="p-3 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-background transition-all flex items-center justify-between gap-2 cursor-pointer group"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                                        {doc.title || 'Untitled Document'}
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground capitalize">
                                                        {doc.documentType || 'document'}
                                                    </span>
                                                </div>
                                                <Button size="sm" variant="ghost" className="h-7 px-2.5 text-[11px] font-semibold text-primary group-hover:bg-primary group-hover:text-white rounded-lg gap-1 shrink-0">
                                                    <Sparkles className="h-3 w-3" />
                                                    Review
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full h-10 rounded-xl text-xs font-bold border-primary/20 text-primary hover:bg-primary/5 gap-1.5"
                                    onClick={() => {
                                        setIsWorkspaceModalOpen(true);
                                        fetchWorkspaceDocuments();
                                    }}
                                >
                                    <Search className="h-3.5 w-3.5" />
                                    Browse All Workspace Documents
                                </Button>
                            </CardContent>
                        </Card>

                        {/* How it Works Card */}
                        <Card className="rounded-xl border border-border shadow-sm bg-card overflow-hidden">
                            <CardHeader className="bg-secondary/30 border-b border-border pb-4">
                                <div className="flex items-center gap-2 text-foreground">
                                    <Info className="h-5 w-5" />
                                    <CardTitle className="text-base font-semibold">How it works</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center text-primary">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground text-sm">Risk & Gap Scanning</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Identifies hidden liabilities, unfavorable clauses, and missing standard protections.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center text-primary">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground text-sm">Compliance Check</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Matches your document against regional legal standards and statutory provisions.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground text-sm">Clause Optimization</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Provides legal-grade suggestion wording to rewrite unfair clauses directly.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Workspace Document Selector Modal */}
                {renderWorkspaceModal()}
            </div>
        );
    }

    function renderWorkspaceModal() {
        const filteredDocs = workspaceDocs.filter(doc => {
            const q = workspaceSearch.toLowerCase();
            return (doc.title || '').toLowerCase().includes(q) || (doc.documentType || '').toLowerCase().includes(q);
        });

        return (
            <Dialog open={isWorkspaceModalOpen} onOpenChange={setIsWorkspaceModalOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-2xl bg-card border-border">
                    <DialogHeader className="space-y-1.5 pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <FolderOpen className="h-4 w-4" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-foreground">Select from My Documents Workspace</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Select any contract or document saved in your workspace to run instant AI review & risk analysis.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative my-3">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search workspace documents by title or type..."
                            value={workspaceSearch}
                            onChange={(e) => setWorkspaceSearch(e.target.value)}
                            className="pl-10 h-11 rounded-xl bg-background border-border text-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[420px] scrollbar-thin">
                        {isFetchingWorkspaceDocs ? (
                            <div className="py-16 text-center space-y-3">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                <p className="text-xs text-muted-foreground">Loading your workspace documents...</p>
                            </div>
                        ) : filteredDocs.length === 0 ? (
                            <div className="py-14 text-center space-y-3 bg-secondary/30 rounded-2xl border border-dashed border-border p-6">
                                <FileSearch className="h-8 w-8 text-muted-foreground mx-auto" />
                                <p className="text-sm font-semibold text-foreground">No documents found</p>
                                <p className="text-xs text-muted-foreground">
                                    {workspaceSearch ? `No workspace documents match "${workspaceSearch}"` : "You don't have any documents saved in your workspace yet."}
                                </p>
                            </div>
                        ) : (
                            filteredDocs.map((doc) => (
                                <div
                                    key={doc._id}
                                    onClick={() => handleSelectWorkspaceDoc(doc)}
                                    className="p-4 rounded-xl border border-border/80 bg-background hover:border-primary/50 hover:bg-secondary/40 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                                {doc.title || 'Untitled Document'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] px-2 py-0 h-4 capitalize font-semibold border-primary/20 text-primary bg-primary/5">
                                                    {doc.documentType || 'document'}
                                                </Badge>
                                                {doc.updatedAt && (
                                                    <span className="text-[11px] text-muted-foreground">
                                                        Updated {new Date(doc.updatedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5 shrink-0">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Review This
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    function renderProcessingView() {
        return (
            <div className="max-w-6xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">V</div>
                        <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs tracking-wide">
                            <Zap className="h-3 w-3 mr-1" />
                            Analysis in Progress
                        </Badge>
                    </div>
                    <Button variant="ghost" className="text-muted-foreground hover:text-destructive gap-2" onClick={handleResetReview}>
                        Cancel Process
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Progress Circle Section */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-2xl font-bold text-foreground">Processing Document</h2>
                            <p className="text-muted-foreground font-medium text-sm">
                                {selectedFile ? selectedFile.name : (sourceDocument ? `${sourceDocument.title}.txt` : "Service_Agreement_v2.pdf")} •
                                {selectedFile && selectedFile.size > 0 ? (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB" : "Workspace Document"}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
                                Deep Structural Analysis
                            </Badge>
                        </div>

                        {/* Progress Circular Component */}
                        <div className="relative w-64 h-64">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="112"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-secondary"
                                />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="112"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={704}
                                    strokeDashoffset={704 - (704 * progress) / 100}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-300 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                                <span className="text-5xl font-bold">{progress}%</span>
                                <span className="text-xs font-semibold tracking-widest uppercase opacity-80 mt-1">Completion</span>
                            </div>
                        </div>

                        {/* Animated Scanning Beam Effect (Simulation) */}
                        <div className="w-full max-w-sm h-1 bg-secondary rounded-full overflow-hidden relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Live Logs Section */}
                    <Card className="rounded-xl border border-border shadow-sm bg-card overflow-hidden flex flex-col h-[500px]">
                        <CardHeader className="bg-secondary/30 border-b border-border pb-4 px-6">
                            <div className="flex items-center gap-2 text-foreground">
                                <Activity className="h-5 w-5" />
                                <CardTitle className="text-sm font-semibold uppercase tracking-tight">Active Analysis Engine</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                            <div className="flex-1 px-6 py-8 overflow-y-auto" ref={logContainerRef}>
                                <div className="space-y-6">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            {log.status === 'done' ? (
                                                <div className="mt-1 w-5 h-5 rounded-full bg-success flex items-center justify-center text-success-foreground shrink-0">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            ) : log.status === 'loading' ? (
                                                <Loader2 className="mt-1 h-5 w-5 text-primary animate-spin shrink-0" />
                                            ) : (
                                                <div className="mt-1 w-5 h-5 rounded-full border-2 border-border shrink-0" />
                                            )}
                                            <div className="space-y-1">
                                                <p className={`text-sm font-medium ${log.status === 'done' ? 'text-foreground' : log.status === 'loading' ? 'text-primary' : 'text-muted-foreground'}`}>
                                                    {log.msg}
                                                </p>
                                                {log.status === 'done' && i === 1 && <p className="text-[10px] text-muted-foreground font-mono">14 standard clauses identified.</p>}
                                                {log.status === 'loading' && i === 3 && <p className="text-[10px] text-muted-foreground font-mono animate-pulse">Evaluating liability caps...</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-secondary/30 border-t border-border space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                                        <span>PROCESSING POWER</span>
                                        <span className="text-primary">Cloud AI Infrastructure</span>
                                    </div>
                                    <Progress value={75} className="h-1" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col items-center space-y-2 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Estimated time: <span className="text-gray-900">Calculating...</span></p>
                    <Button disabled className="w-full max-w-sm h-14 bg-gray-100 text-gray-400 rounded-2xl text-lg font-bold border-none transition-all">
                        Processing Content...
                    </Button>
                </div>
            </div>
        );
    }

    function renderCompletedView() {
        if (!analysisData) {
            return (
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">No Review Data Available</h2>
                    <p className="text-gray-500">Please upload a document to perform analysis.</p>
                    <Button onClick={handleResetReview} className="mt-4">
                        Upload Document
                    </Button>
                </div>
            );
        }

        if (analysisData.isLegalDocument === false) {
            return renderNonLegalView();
        }

        const data = analysisData;

        if (viewMode === 'SUMMARY') {
            return (
                <div className="flex flex-col items-center justify-center max-w-5xl mx-auto py-12 space-y-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-sm animate-bounce">
                            <Check className="h-10 w-10 text-white stroke-[4]" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mt-6">Analysis Complete</h1>
                        <p className="text-gray-500 text-lg font-medium">Your document '{selectedFile?.name || "Service Agreement_v2.pdf"}' has been fully audited.</p>
                        <div className="flex justify-center gap-2 mt-2">
                            <Badge className={`${data.riskLevel === 'High' ? 'bg-red-500' : data.riskLevel === 'Medium' ? 'bg-orange-500' : 'bg-green-500'} text-white border-none font-bold`}>
                                {data.riskLevel.toUpperCase()} RISK
                            </Badge>
                            <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold">
                                {data.complianceScore}% COMPLIANT
                            </Badge>
                        </div>
                    </div>

                    <Card className="w-full rounded-xl border border-border shadow-sm bg-primary text-primary-foreground overflow-hidden relative group">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="p-10 relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">Review of Your Document</h3>
                            </div>
                            <p className="text-xl leading-relaxed font-medium text-primary-foreground/90">
                                "{data.userReview || data.summary}"
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <Badge variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-none px-4 py-2 rounded-md font-semibold text-xs backdrop-blur-md">
                                    <Activity className="h-3 w-3 mr-2" />
                                    {data.findings.length} Analysis Points
                                </Badge>
                                <Badge variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-none px-4 py-2 rounded-md font-semibold text-xs backdrop-blur-md">
                                    <ShieldCheck className="h-3 w-3 mr-2" />
                                    Vidhik Verified
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Final Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                        <Card className="rounded-xl border border-border shadow-sm bg-card p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Risk Level</p>
                                <p className={`text-2xl font-bold ${data.riskLevel === 'High' ? 'text-destructive' : data.riskLevel === 'Medium' ? 'text-warning' : 'text-success'}`}>{data.riskLevel}</p>
                            </div>
                        </Card>
                        <Card className="rounded-xl border border-border shadow-sm bg-card p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Compliance</p>
                                <p className="text-2xl font-bold text-primary">{data.complianceScore}%</p>
                            </div>
                        </Card>
                        <Card className="rounded-xl border border-border shadow-sm bg-card p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center text-warning">
                                <FileEdit className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Conflicts</p>
                                <p className="text-2xl font-bold text-warning">{data.suggestedAmendmentsCount}</p>
                            </div>
                        </Card>
                        <Card className="rounded-xl border border-border shadow-sm bg-card p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Valid Clauses</p>
                                <p className="text-2xl font-bold text-success">{data.standardClausesCount || '10+'}</p>
                            </div>
                        </Card>
                    </div>

                    <Card className="w-full rounded-xl border border-border shadow-sm bg-card overflow-hidden">
                        <div className="bg-secondary/30 p-6 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold text-foreground tracking-wide text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Key Findings
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            {data.findings.map((finding: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/10 hover:bg-secondary/30 transition-colors border border-gray-100 hover:border-gray-200">
                                    <div className={`mt-1 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${finding.type === 'warning' ? 'bg-destructive/10 text-destructive' : finding.type === 'positive' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                        {finding.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> : finding.type === 'positive' ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                                    </div>
                                    <div className="space-y-3 w-full">
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{finding.title}</p>
                                            <p className="text-sm text-gray-600 leading-relaxed mt-1">{finding.description}</p>
                                        </div>
                                        {finding.suggestion && (
                                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sparkles className="h-3 w-3 text-primary" />
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">AI Suggestion & Improvement</p>
                                                </div>
                                                <p className="text-sm text-primary font-bold italic">"{finding.suggestion}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="flex gap-4 w-full">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50" onClick={handleResetReview}>
                            Upload Another Document
                        </Button>
                        <Button className="flex-[2] h-14 rounded-2xl font-black bg-primary hover:bg-primary text-lg gap-2 shadow-lg shadow-sm" onClick={() => setViewMode('DETAILED')}>
                            View Detailed Analysis
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            );
        }

        // Color themes for different types of legal clause analysis
        const getHighlightTheme = (type?: string) => {
            switch (type?.toUpperCase()) {
                case 'CRITICAL':
                    return {
                        bg: 'bg-rose-100/95 hover:bg-rose-200/90 text-rose-950',
                        border: 'border-b-2 border-rose-500 border-l-4 border-l-rose-600',
                        badgeBg: 'bg-rose-600 text-white',
                        dot: 'bg-rose-500',
                        ping: 'bg-rose-400',
                        label: 'Critical Risk & Liability',
                        cardHeader: 'bg-rose-50 text-rose-900',
                        tag: 'High Risk'
                    };
                case 'UNFAVORABLE':
                    return {
                        bg: 'bg-amber-100/95 hover:bg-amber-200/90 text-amber-950',
                        border: 'border-b-2 border-amber-500 border-l-4 border-l-amber-600',
                        badgeBg: 'bg-amber-600 text-white',
                        dot: 'bg-amber-500',
                        ping: 'bg-amber-400',
                        label: 'Unfavorable / Ambiguous Clause',
                        cardHeader: 'bg-amber-50 text-amber-900',
                        tag: 'Unfavorable'
                    };
                case 'POSITIVE':
                    return {
                        bg: 'bg-emerald-100/95 hover:bg-emerald-200/90 text-emerald-950',
                        border: 'border-b-2 border-emerald-500 border-l-4 border-l-emerald-600',
                        badgeBg: 'bg-emerald-600 text-white',
                        dot: 'bg-emerald-500',
                        ping: 'bg-emerald-400',
                        label: 'Balanced Standard Protection',
                        cardHeader: 'bg-emerald-50 text-emerald-900',
                        tag: 'Balanced'
                    };
                default:
                    return {
                        bg: 'bg-indigo-100/95 hover:bg-indigo-200/90 text-indigo-950',
                        border: 'border-b-2 border-indigo-400 border-l-4 border-l-indigo-500',
                        badgeBg: 'bg-indigo-600 text-white',
                        dot: 'bg-indigo-500',
                        ping: 'bg-indigo-400',
                        label: 'Standard Clause Notice',
                        cardHeader: 'bg-indigo-50 text-indigo-900',
                        tag: 'Notice'
                    };
            }
        };

        const totalClauses = data.highlightedClauses?.length || 0;
        const missingPct = data.missingDataPercentage !== undefined 
            ? data.missingDataPercentage 
            : Math.max(10, Math.min(35, 100 - (data.complianceScore || 80)));

        return (
            <div className="space-y-8 animate-in mt-6 fade-in slide-in-from-bottom-5 duration-700">
                {/* Results Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary" onClick={() => {
                                if (id) navigate('/documents/review');
                                else setViewMode('SUMMARY');
                            }}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight text-foreground">{id ? "Shared Document Review" : "Document Review & Clause Audit"}</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Interactive line-by-line legal analysis with AI suggestions and gap detection.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Save Directly to My Documents Workspace */}
                        <Button
                            variant="outline"
                            className="rounded-xl h-11 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary gap-2 font-bold px-5 shadow-sm transition-all"
                            onClick={handleSaveToWorkspace}
                            disabled={isSavingToWorkspace}
                        >
                            {isSavingToWorkspace ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving to Workspace...
                                </>
                            ) : isSavedToWorkspace ? (
                                <>
                                    <CheckCheck className="h-4 w-4 text-emerald-600" />
                                    Saved in My Documents
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save to My Documents
                                </>
                            )}
                        </Button>

                        {!id && (
                            <Button variant="outline" className="rounded-xl h-11 border-border gap-2 font-bold px-5 shadow-sm hover:bg-secondary" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                                Share Report
                            </Button>
                        )}
                        <Button className="rounded-xl h-11 bg-foreground text-background font-bold gap-2 px-5 shadow-sm hover:bg-foreground/90 transition-colors" onClick={() => setIsFullscreen(!isFullscreen)}>
                            <Maximize2 className="h-4 w-4" />
                            {isFullscreen ? 'Exit Focus Mode' : 'Focus Mode'}
                        </Button>
                    </div>
                </div>

                {/* Source Document Context Bar */}
                {sourceDocument && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3.5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
                            <div className="text-sm">
                                <span className="text-muted-foreground">Reviewing document: </span>
                                <span className="font-bold text-foreground">{sourceDocument.title}</span>
                                {sourceDocument.documentType && (
                                    <span className="ml-2 text-[10px] font-semibold text-primary uppercase px-2 py-0.5 bg-primary/10 rounded-md">
                                        {sourceDocument.documentType}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsWorkspaceModalOpen(true);
                                    fetchWorkspaceDocuments();
                                }}
                                className="text-xs text-primary border-primary/20 hover:bg-primary/5 h-8 rounded-lg gap-1.5"
                            >
                                <FolderOpen className="h-3.5 w-3.5" />
                                Switch Workspace Doc
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleResetReview}
                                className="text-xs text-muted-foreground hover:text-foreground h-8 rounded-lg"
                            >
                                Upload New File
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => navigate('/documents/workspace')}
                                className="text-xs gap-1.5 h-8 font-semibold rounded-lg"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                My Documents
                            </Button>
                        </div>
                    </div>
                )}

                {/* 2-Column Review Layout: Left (Document Viewer) & Right (Review Side Panel) */}
                <div className={`grid grid-cols-1 ${isFullscreen ? '' : 'lg:grid-cols-12'} gap-8 items-start w-full`}>
                    {/* Left Column: Interactive Document Viewer */}
                    <div className={isFullscreen ? 'w-full' : 'lg:col-span-8 space-y-6 w-full'}>
                        <Card className={`w-full rounded-2xl md:rounded-[2rem] border border-border shadow-md bg-card overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-[100] bg-background' : 'min-h-[850px]'}`}>
                            <CardHeader className="bg-secondary/40 border-b border-border p-5 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm md:text-base font-bold text-foreground truncate max-w-xs md:max-w-md">
                                            {selectedFile?.name || (sourceDocument ? `${sourceDocument.title}.txt` : "Legal_Agreement.pdf")}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-muted-foreground">
                                                {totalClauses} highlighted {totalClauses === 1 ? 'clause' : 'clauses'}
                                            </span>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-[11px] text-emerald-600 font-semibold">
                                                Interactive AI Suggestions Enabled
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Clause Navigator Buttons */}
                                    {totalClauses > 0 && (
                                        <div className="flex items-center bg-secondary/80 rounded-xl p-1 border border-border mr-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                                                onClick={() => handleNavigateClause('prev', totalClauses)}
                                                title="Previous Flagged Clause"
                                            >
                                                <ChevronLeft className="h-3.5 w-3.5" />
                                            </Button>
                                            <span className="text-[11px] font-bold px-2 text-foreground">
                                                {selectedClauseIndex !== null ? `${selectedClauseIndex + 1}/${totalClauses}` : `0/${totalClauses}`}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                                                onClick={() => handleNavigateClause('next', totalClauses)}
                                                title="Next Flagged Clause"
                                            >
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    )}

                                    {isSearchVisible && (
                                        <div className="relative animate-in slide-in-from-right-4 duration-300">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Search in document..."
                                                className="h-8 w-44 pl-8 pr-8 rounded-lg border border-border bg-background text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                            />
                                            {searchQuery && (
                                                <button
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                                                    onClick={() => setSearchQuery("")}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-lg h-8 w-8 transition-colors ${isSearchVisible ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => {
                                            setIsSearchVisible(!isSearchVisible);
                                            if (isSearchVisible) setSearchQuery("");
                                        }}
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-lg h-8 w-8 transition-colors ${isFullscreen ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                    >
                                        {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Clause Color Legend Bar */}
                            <div className="bg-secondary/20 border-b border-border/60 px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 text-[11px]">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Clause Legend:</span>
                                    <span className="flex items-center gap-1.5 font-semibold text-rose-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                        Critical Risk
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold text-amber-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        Unfavorable
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        Balanced
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold text-indigo-800">
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                        Standard / Info
                                    </span>
                                </div>
                                <span className="text-muted-foreground italic text-[10px]">
                                    Hover or click any highlighted line for AI suggestions
                                </span>
                            </div>

                            <CardContent className="p-6 md:p-10 flex-1 scrollbar-thin overflow-y-auto relative">
                                {/* Search Results Indicator */}
                                {searchQuery && data.fullText && (
                                    <div className="absolute top-4 right-8 z-20 px-3 py-1 bg-secondary text-foreground rounded-full text-[10px] font-bold border border-border animate-in fade-in slide-in-from-top-2">
                                        {(() => {
                                            try {
                                                const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                                const count = (data.fullText.match(new RegExp(escapedQuery, 'gi')) || []).length;
                                                return `${count} match${count !== 1 ? 'es' : ''} found`;
                                            } catch (e) {
                                                return "0 matches found";
                                            }
                                        })()}
                                    </div>
                                )}

                                <div className={`max-w-[210mm] mx-auto space-y-8 font-serif text-gray-800 dark:text-gray-200 leading-relaxed ${isFullscreen ? 'text-lg' : 'text-base'}`}>
                                    {data.fullText ? (
                                        <div>
                                            {/* Dynamic Interactive Text Rendering */}
                                            {(() => {
                                                // Helper to format unstructured legal text into clean, structured paragraphs and clauses
                                                const formatLegalTextToParagraphs = (raw: string): string => {
                                                    if (!raw) return '';
                                                    let formatted = raw.trim();

                                                    // If the document has few newlines, intelligently restore legal structure
                                                    const newlineCount = (formatted.match(/\n/g) || []).length;
                                                    if (newlineCount < 6) {
                                                        // 1. Separate document title if at the start
                                                        formatted = formatted.replace(/^((?:Memorandum of Association|Articles of Association|Non-Disclosure Agreement|Employment Agreement|Service Agreement|Consulting Agreement|Power of Attorney|Resolution|Contract|Agreement|Deed)[^\n.]{3,120}?)(\s+(?:\d+\.\s+[A-Z]|Clause\s+\d+|Article\s+\d+|WHEREAS|This\s+Agreement))/i, '$1\n\n$2');

                                                        // 2. Insert newlines before numbered main clauses, e.g. " 1. Name Clause", " 2. Registered Office Clause"
                                                        formatted = formatted.replace(/([^\n])\s+(\d+\.\s+[A-Z][a-zA-Z\s]{2,40}\b)/g, '$1\n\n$2');

                                                        // 3. Insert newlines before sub-clauses, e.g. " A. Main Objects", " B. Matters Necessary"
                                                        formatted = formatted.replace(/([^\n])\s+([A-Z]\.\s+[A-Z][a-zA-Z\s]{2,50}\b)/g, '$1\n\n$2');

                                                        // 4. Insert newlines before common formal headings: Clause 1, Section 1, Article I, WHEREAS, etc.
                                                        formatted = formatted.replace(/([^\n])\s+(\b(?:Clause|Section|Article)\s+[\dIVX]+[:\.]?)/gi, '$1\n\n$2');
                                                        formatted = formatted.replace(/([^\n])\s+(\b(?:WHEREAS|NOW THEREFORE|IN WITNESS WHEREOF|SIGNED AND DELIVERED|SCHEDULE|ANNEXURE)\b)/g, '$1\n\n$2');

                                                        // 5. Insert newlines before signatory or subscriber blocks
                                                        formatted = formatted.replace(/([^\n])\s+(Witness to the above signatures:?|Total Shares Subscribed:?|By and Between:?|The following are the subscribers)/gi, '$1\n\n$2');

                                                        // 6. Separate numbered subscriber entries, e.g. ".2.Priya Verma" or " 1.Rahul Sharma"
                                                        formatted = formatted.replace(/([^\n])\s*(\d+\.[A-Z][a-zA-Z\s]+,)/g, '$1\n$2');
                                                    }

                                                    // Normalize excessive empty lines
                                                    return formatted.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
                                                };

                                                const normalizedText = formatLegalTextToParagraphs(data.fullText || '');

                                                // Helper to escape regex special characters
                                                const escapeRegExp = (string: string) => {
                                                    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                                };

                                                // Multi-tier fuzzy matcher to locate clause positions in text
                                                interface MatchInterval {
                                                    start: number;
                                                    end: number;
                                                    clause: any;
                                                    clauseIndex: number;
                                                }

                                                const matchedIntervals: MatchInterval[] = [];
                                                const unmappedClauses: any[] = [];

                                                (data.highlightedClauses || []).forEach((clause: any, idx: number) => {
                                                    const target = (clause.text || '').trim();
                                                    if (!target) return;

                                                    let matchStart = -1;
                                                    let matchEnd = -1;

                                                    // Tier 1: Exact substring match (case-insensitive)
                                                    const lowerDoc = normalizedText.toLowerCase();
                                                    const lowerTarget = target.toLowerCase();
                                                    const exactPos = lowerDoc.indexOf(lowerTarget);
                                                    if (exactPos !== -1) {
                                                        matchStart = exactPos;
                                                        matchEnd = exactPos + target.length;
                                                    }

                                                    // Tier 2: Flexible alphanumeric word-sequence matching (ignores punctuation & spacing differences)
                                                    if (matchStart === -1) {
                                                        const words = target.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/).filter((w: string) => w.length >= 2);
                                                        if (words.length >= 2) {
                                                            try {
                                                                const pattern = words.map(escapeRegExp).join('[^a-zA-Z0-9]+');
                                                                const regex = new RegExp(pattern, 'i');
                                                                const m = regex.exec(normalizedText);
                                                                if (m) {
                                                                    matchStart = m.index;
                                                                    matchEnd = m.index + m[0].length;
                                                                }
                                                            } catch (e) {}

                                                            // Tier 3: Leading phrase match (first 5-7 words)
                                                            if (matchStart === -1 && words.length >= 5) {
                                                                try {
                                                                    const leadPattern = words.slice(0, 6).map(escapeRegExp).join('[^a-zA-Z0-9]+');
                                                                    const regex = new RegExp(leadPattern, 'i');
                                                                    const m = regex.exec(normalizedText);
                                                                    if (m) {
                                                                        matchStart = m.index;
                                                                        matchEnd = Math.min(normalizedText.length, m.index + Math.max(m[0].length, target.length));
                                                                    }
                                                                } catch (e) {}
                                                            }
                                                        }
                                                    }

                                                    if (matchStart !== -1) {
                                                        matchedIntervals.push({
                                                            start: matchStart,
                                                            end: matchEnd,
                                                            clause,
                                                            clauseIndex: idx
                                                        });
                                                    } else {
                                                        unmappedClauses.push({ ...clause, idx });
                                                    }
                                                });

                                                // Sort matches by starting index and eliminate overlaps
                                                matchedIntervals.sort((a, b) => a.start - b.start);
                                                const resolvedIntervals: MatchInterval[] = [];
                                                let currEnd = 0;
                                                matchedIntervals.forEach((interval) => {
                                                    if (interval.start >= currEnd) {
                                                        resolvedIntervals.push(interval);
                                                        currEnd = interval.end;
                                                    }
                                                });

                                                // Split normalized text into segments (plain text and highlighted clauses)
                                                type TextSegment = 
                                                    | { type: 'text'; content: string }
                                                    | { type: 'highlight'; content: string; clause: any; clauseIndex: number };

                                                const segments: TextSegment[] = [];
                                                let segCursor = 0;

                                                resolvedIntervals.forEach((interval) => {
                                                    if (interval.start > segCursor) {
                                                        segments.push({
                                                            type: 'text',
                                                            content: normalizedText.substring(segCursor, interval.start)
                                                        });
                                                    }
                                                    segments.push({
                                                        type: 'highlight',
                                                        content: normalizedText.substring(interval.start, interval.end),
                                                        clause: interval.clause,
                                                        clauseIndex: interval.clauseIndex
                                                    });
                                                    segCursor = interval.end;
                                                });

                                                if (segCursor < normalizedText.length) {
                                                    segments.push({
                                                        type: 'text',
                                                        content: normalizedText.substring(segCursor)
                                                    });
                                                }

                                                // Render text chunk with search query markings
                                                const renderInlineText = (str: string, keyPrefix: string) => {
                                                    if (!searchQuery || searchQuery.trim().length < 2) {
                                                        return str;
                                                    }
                                                    try {
                                                        const escaped = escapeRegExp(searchQuery.trim());
                                                        const regex = new RegExp(`(${escaped})`, 'gi');
                                                        const chunks = str.split(regex);
                                                        return chunks.map((chunk, ci) => 
                                                            regex.test(chunk) ? (
                                                                <mark key={`${keyPrefix}-mark-${ci}`} className="bg-primary/25 text-foreground rounded px-0.5 font-bold shadow-xs">
                                                                    {chunk}
                                                                </mark>
                                                            ) : chunk
                                                        );
                                                    } catch (e) {
                                                        return str;
                                                    }
                                                };

                                                // Group segments into logical paragraph blocks by double newline
                                                interface ParagraphBlock {
                                                    elements: React.ReactNode[];
                                                    rawText: string;
                                                }

                                                const blocks: ParagraphBlock[] = [{ elements: [], rawText: '' }];

                                                segments.forEach((seg, sIdx) => {
                                                    if (seg.type === 'text') {
                                                        const parts = seg.content.split(/\n\n+/);
                                                        parts.forEach((part, pIdx) => {
                                                            if (pIdx > 0) {
                                                                blocks.push({ elements: [], rawText: '' });
                                                            }
                                                            if (part) {
                                                                const currentBlock = blocks[blocks.length - 1];
                                                                currentBlock.elements.push(
                                                                    <React.Fragment key={`text-${sIdx}-${pIdx}`}>
                                                                        {renderInlineText(part, `seg-${sIdx}-${pIdx}`)}
                                                                    </React.Fragment>
                                                                );
                                                                currentBlock.rawText += part;
                                                            }
                                                        });
                                                    } else {
                                                        const currentBlock = blocks[blocks.length - 1];
                                                        const theme = getHighlightTheme(seg.clause.type);
                                                        const isSelected = selectedClauseIndex === seg.clauseIndex;
                                                        const isNearTop = seg.clauseIndex === 0 || blocks.length <= 2;

                                                        currentBlock.elements.push(
                                                            <span
                                                                id={`highlight-clause-${seg.clauseIndex}`}
                                                                key={`highlight-${seg.clauseIndex}`}
                                                                className={`${theme.bg} ${theme.border} ${theme.text} px-2 py-0.5 rounded font-medium cursor-pointer transition-all duration-200 relative inline group/h mx-0.5 shadow-xs ${isSelected ? 'ring-2 ring-primary ring-offset-1 font-bold' : ''}`}
                                                                onClick={() => setSelectedClauseIndex(seg.clauseIndex)}
                                                                onMouseEnter={() => setActiveHighlightIndex(seg.clauseIndex)}
                                                                onMouseLeave={() => setActiveHighlightIndex(null)}
                                                            >
                                                                {renderInlineText(seg.content, `hl-${seg.clauseIndex}`)}

                                                                {/* Category Pill Tag */}
                                                                <span className={`inline-flex items-center ml-1 text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider ${theme.badgeBg} align-middle shadow-xs`}>
                                                                    {theme.tag}
                                                                </span>

                                                                {/* Floating Interactive Suggestion Box */}
                                                                {activeHighlightIndex === seg.clauseIndex && (
                                                                    <div 
                                                                        className={`absolute left-1/2 -translate-x-1/2 ${isNearTop ? 'top-full mt-2' : '-top-3 -translate-y-full'} w-88 sm:w-96 p-0 bg-popover text-popover-foreground rounded-2xl shadow-2xl border border-border z-50 text-sm normal-case animate-in fade-in zoom-in-95 duration-200 overflow-hidden pointer-events-auto cursor-default font-sans`}
                                                                        onMouseEnter={() => setActiveHighlightIndex(seg.clauseIndex)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {/* Header with Type & Index */}
                                                                        <div className={`px-4 py-2.5 flex items-center justify-between ${theme.cardHeader} border-b border-border/70`}>
                                                                            <div className="flex items-center gap-2 font-bold text-xs">
                                                                                <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                                                                                <span>{theme.label}</span>
                                                                            </div>
                                                                            <Badge className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 ${theme.badgeBg}`}>
                                                                                Clause #{seg.clauseIndex + 1}
                                                                            </Badge>
                                                                        </div>

                                                                        {/* Body: Issue + Suggestion */}
                                                                        <div className="p-4 space-y-3 text-left">
                                                                            <div>
                                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Issue Identified</p>
                                                                                <p className="font-bold text-foreground text-xs leading-snug">
                                                                                    {seg.clause.issue}
                                                                                </p>
                                                                                {seg.clause.explanation && (
                                                                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                                                        {seg.clause.explanation}
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* AI Recommended Revision (What it should be) */}
                                                                            {seg.clause.suggestion && (
                                                                                <div className="rounded-xl border border-emerald-300/80 bg-emerald-50/80 p-3 space-y-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                                                                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                                                                            What it should be (AI Suggested Revision)
                                                                                        </span>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="ghost"
                                                                                            className="h-6 px-2 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 rounded-md gap-1"
                                                                                            onClick={() => handleCopySuggestion(seg.clause.suggestion, seg.clauseIndex)}
                                                                                        >
                                                                                            {copiedClauseIdx === seg.clauseIndex ? (
                                                                                                <>
                                                                                                    <CheckCheck className="h-3 w-3 text-emerald-600" />
                                                                                                    Copied
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <Copy className="h-3 w-3" />
                                                                                                    Copy Revision
                                                                                                </>
                                                                                            )}
                                                                                        </Button>
                                                                                    </div>
                                                                                    <p className="text-xs font-semibold text-emerald-950 font-serif leading-relaxed italic bg-white/90 p-2.5 rounded-lg border border-emerald-100">
                                                                                        "{seg.clause.suggestion}"
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-border/50">
                                                                                <span>Click line to pin in side panel</span>
                                                                                <Button 
                                                                                    size="sm" 
                                                                                    variant="outline" 
                                                                                    className="h-6 px-2.5 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/5 rounded-lg"
                                                                                    onClick={() => setSelectedClauseIndex(seg.clauseIndex)}
                                                                                >
                                                                                    Inspect in Side Panel
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Visual Indicator Pulse */}
                                                                <span className={`absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full animate-ping opacity-75 ${theme.ping}`}></span>
                                                                <span className={`absolute -right-1 -top-1 w-2 h-2 rounded-full ${theme.dot}`}></span>
                                                            </span>
                                                        );
                                                        currentBlock.rawText += seg.content;
                                                    }
                                                });

                                                // Render the styled legal document page
                                                return (
                                                    <div className="space-y-8 pb-10">
                                                        {/* Authentic White A4 Legal Paper */}
                                                        <div className="bg-white shadow-[0_12px_45px_-10px_rgba(0,0,0,0.14)] border border-slate-200/90 rounded-xl p-8 sm:p-14 md:p-16 min-h-[297mm] text-slate-900 font-serif relative">
                                                            {blocks.filter(b => b.elements.length > 0).map((block, bIdx) => {
                                                                const trimmedRaw = block.rawText.trim();
                                                                
                                                                // 1. Detect Document Title
                                                                const isDocTitle = bIdx === 0 && (
                                                                    trimmedRaw.length < 120 && (
                                                                        /memorandum|articles of association|agreement|contract|resolution|power of attorney|deed/i.test(trimmedRaw) ||
                                                                        trimmedRaw === trimmedRaw.toUpperCase()
                                                                    )
                                                                );

                                                                if (isDocTitle) {
                                                                    return (
                                                                        <div key={`block-${bIdx}`} className="text-center pb-6 mb-8 border-b-2 border-slate-300">
                                                                            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wider font-serif">
                                                                                {block.elements}
                                                                            </h1>
                                                                        </div>
                                                                    );
                                                                }

                                                                // 2. Detect Main Clause Heading (e.g. "1. Name Clause", "Clause 2: ...")
                                                                const isClauseHeading = /^(?:\d+\.\s+[A-Z]|Clause\s+\d+|Article\s+[\dIVX]+|Section\s+\d+)/i.test(trimmedRaw);
                                                                if (isClauseHeading) {
                                                                    return (
                                                                        <div key={`block-${bIdx}`} className="mt-7 mb-4">
                                                                            <div className="text-justify leading-[1.8] text-slate-800 text-[15px]">
                                                                                {block.elements}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }

                                                                // 3. Detect Sub-clause (e.g. "A. Main Objects", "B. Matters Necessary")
                                                                const isSubClause = /^[A-Z]\.\s+[A-Z]/.test(trimmedRaw);
                                                                if (isSubClause) {
                                                                    return (
                                                                        <div key={`block-${bIdx}`} className="pl-4 ml-1 my-3.5 border-l-2 border-slate-300">
                                                                            <div className="text-justify leading-[1.8] text-slate-800 text-[14.5px]">
                                                                                {block.elements}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }

                                                                // 4. Detect Witness / Signatory Block
                                                                const isSignatory = /witness to the above|subscribers to the memorandum|total shares subscribed|in witness whereof/i.test(trimmedRaw);
                                                                if (isSignatory) {
                                                                    return (
                                                                        <div key={`block-${bIdx}`} className="mt-8 pt-4 border-t border-slate-200/80 bg-slate-50/60 p-4 rounded-xl">
                                                                            <div className="text-sm text-slate-700 leading-relaxed">
                                                                                {block.elements}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }

                                                                // 5. Default Standard Legal Paragraph
                                                                return (
                                                                    <div key={`block-${bIdx}`} className="mb-4 text-justify leading-[1.8] text-slate-800 text-[15px]">
                                                                        {block.elements}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Unmapped clauses if any */}
                                                        {unmappedClauses.length > 0 && (
                                                            <div className="mt-8 space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                                                                        <ShieldAlert className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-base font-bold text-foreground">Additional Identified Clauses</h3>
                                                                        <p className="text-xs text-muted-foreground">The AI identified these clauses, but they were modified or formatted differently in the source text.</p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {unmappedClauses.map((clause, idx) => {
                                                                        const uTheme = getHighlightTheme(clause.type);
                                                                        return (
                                                                            <div key={`unmapped-${idx}`} className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-3">
                                                                                <div className="flex items-start justify-between gap-4">
                                                                                    <Badge className={uTheme.badgeBg}>
                                                                                        {clause.type}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div className="bg-secondary/40 p-3 rounded-xl border border-border font-mono text-xs text-muted-foreground italic">
                                                                                    "{clause.text}"
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-bold text-foreground text-xs">{clause.issue}</p>
                                                                                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{clause.explanation}</p>
                                                                                </div>
                                                                                {clause.suggestion && (
                                                                                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Suggested Revision</p>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="ghost"
                                                                                                className="h-5 px-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                                                                                                onClick={() => handleCopySuggestion(clause.suggestion, 500 + idx)}
                                                                                            >
                                                                                                {copiedClauseIdx === (500 + idx) ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <p className="text-xs text-emerald-950 font-serif leading-relaxed italic">"{clause.suggestion}"</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                            <p className="text-muted-foreground font-medium text-sm">Rendering document intelligence...</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottom Completion Banner */}
                        <div className="w-full flex flex-col items-center justify-center p-8 bg-secondary/30 rounded-2xl border border-dashed border-border transition-all">
                            <div className="text-center space-y-4 w-full max-w-xl">
                                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-md">
                                    <Check className="h-7 w-7 text-white stroke-[3]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Audit Successfully Completed</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                                        Every line has been verified for risks, statutory compliance, and omission gaps.
                                    </p>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Button
                                        className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold bg-primary hover:bg-primary text-sm gap-2 shadow-sm"
                                        onClick={() => setViewMode('SUMMARY')}
                                    >
                                        View Executive Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto h-11 px-5 rounded-xl font-bold text-xs gap-2"
                                        onClick={handleSaveToWorkspace}
                                        disabled={isSavingToWorkspace}
                                    >
                                        <Save className="h-4 w-4" />
                                        Save to My Documents
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Review Side Panel Dashboard */}
                    {!isFullscreen && (
                        <div className="lg:col-span-4 space-y-6 sticky top-6">
                            {/* 1. Save Directly to Workspace Card */}
                            <Card className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Save className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">My Documents Section</h4>
                                            <p className="text-sm font-bold text-foreground">Save Analysis to Workspace</p>
                                        </div>
                                    </div>
                                    {isSavedToWorkspace && (
                                        <Badge className="bg-emerald-600 text-white text-[10px] font-bold gap-1 px-2 py-0.5">
                                            <Check className="h-3 w-3" />
                                            Saved
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Instantly sync this reviewed document, risk flags, and AI suggestions directly to your <strong className="text-foreground">My Documents</strong> workspace.
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                    <Button
                                        onClick={handleSaveToWorkspace}
                                        disabled={isSavingToWorkspace}
                                        className="flex-1 h-10 rounded-xl font-bold text-xs gap-2 shadow-sm"
                                    >
                                        {isSavingToWorkspace ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : isSavedToWorkspace ? (
                                            <>
                                                <CheckCheck className="h-3.5 w-3.5" />
                                                Saved in My Documents
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-3.5 w-3.5" />
                                                Save to My Documents
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-xl border-border hover:bg-secondary shrink-0"
                                        onClick={() => {
                                            setIsWorkspaceModalOpen(true);
                                            fetchWorkspaceDocuments();
                                        }}
                                        title="Browse or upload from workspace"
                                    >
                                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </Card>

                            {/* 2. AI Misses & Gap Analysis Dashboard Card */}
                            <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                <CardHeader className="p-5 pb-3 border-b border-border bg-secondary/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold text-foreground">AI Misses & Gap Analysis</CardTitle>
                                                <p className="text-[11px] text-muted-foreground">Omitted standard protections</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-bold border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40">
                                            {data.missingClauses?.length || data.missingClausesCount || 0} Omissions
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    {/* Percentage Missing Gauge */}
                                    <div className="p-4 rounded-xl bg-secondary/40 border border-border/80 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-foreground">Missing Protections / Data</span>
                                            <span className="font-black text-amber-600 text-sm">{missingPct}%</span>
                                        </div>
                                        <Progress 
                                            value={missingPct} 
                                            className="h-2 bg-secondary"
                                        />
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {missingPct > 20 
                                                ? "Substantial protection gap. Critical standard covenants are absent from this contract."
                                                : "Moderate protection gap. Standard protective covenants recommended below."}
                                        </p>
                                    </div>

                                    {/* AI Misses Report List */}
                                    <div className="space-y-2.5">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                            AI Misses Report (Recommended Additions)
                                        </p>
                                        {data.missingClauses && data.missingClauses.length > 0 ? (
                                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                                                {data.missingClauses.map((mc: any, mIdx: number) => (
                                                    <div key={mIdx} className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 space-y-2 text-xs">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                                                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                                                {mc.clauseName}
                                                            </span>
                                                            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-amber-600 text-white font-bold">
                                                                {mc.risk || 'Medium'} Risk
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                            {mc.description}
                                                        </p>
                                                        {mc.suggestedAddition && (
                                                            <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-amber-200/50">
                                                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 truncate">
                                                                    Suggested insertion ready
                                                                </span>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary/10 gap-1 shrink-0"
                                                                    onClick={() => handleCopySuggestion(mc.suggestedAddition, 1000 + mIdx)}
                                                                >
                                                                    {copiedClauseIdx === (1000 + mIdx) ? (
                                                                        <>
                                                                            <CheckCheck className="h-3 w-3 text-emerald-600" />
                                                                            Copied
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="h-3 w-3" />
                                                                            Copy Addition
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-emerald-900 flex items-center gap-2">
                                                <CheckCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                                <span>All critical standard covenants appear to be present in this agreement.</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 3. Active Clause Inspector Card */}
                            {selectedClauseIndex !== null && data.highlightedClauses && data.highlightedClauses[selectedClauseIndex] && (
                                <Card className="rounded-2xl border border-primary/30 bg-card shadow-sm p-5 space-y-3 animate-in fade-in duration-300">
                                    {(() => {
                                        const activeClause = data.highlightedClauses[selectedClauseIndex];
                                        const clTheme = getHighlightTheme(activeClause.type);
                                        return (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <Badge className={`text-[10px] font-extrabold uppercase ${clTheme.badgeBg}`}>
                                                        {activeClause.type} • Clause #{selectedClauseIndex + 1}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                                        onClick={() => setSelectedClauseIndex(null)}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Original Document Text</p>
                                                    <p className="text-xs font-serif italic text-foreground bg-secondary/50 p-2.5 rounded-lg border border-border mt-1 leading-relaxed">
                                                        "{activeClause.text}"
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Identified Risk</p>
                                                    <p className="text-xs font-bold text-foreground mt-0.5">{activeClause.issue}</p>
                                                    {activeClause.explanation && (
                                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{activeClause.explanation}</p>
                                                    )}
                                                </div>
                                                {activeClause.suggestion && (
                                                    <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                                                <Sparkles className="h-3 w-3 text-emerald-600" />
                                                                What it should be
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 px-2 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 rounded-md gap-1"
                                                                onClick={() => handleCopySuggestion(activeClause.suggestion, selectedClauseIndex)}
                                                            >
                                                                {copiedClauseIdx === selectedClauseIndex ? (
                                                                    <CheckCheck className="h-3 w-3 text-emerald-600" />
                                                                ) : (
                                                                    <Copy className="h-3 w-3" />
                                                                )}
                                                                Copy
                                                            </Button>
                                                        </div>
                                                        <p className="text-xs font-semibold text-emerald-950 font-serif leading-relaxed italic bg-white/90 p-2 rounded border border-emerald-100">
                                                            "{activeClause.suggestion}"
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </Card>
                            )}

                            {/* 4. Audit Metrics & Executive Summary Card */}
                            <Card className="rounded-2xl border border-border bg-card shadow-sm p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Analysis Overview</h4>
                                    <Badge className={`${data.riskLevel === 'High' ? 'bg-rose-500' : data.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'} text-white font-bold text-[10px]`}>
                                        {data.riskLevel?.toUpperCase()} RISK
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="p-3 rounded-xl bg-secondary/40 border border-border">
                                        <p className="text-2xl font-black text-primary">{data.complianceScore}%</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Compliance Score</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/40 border border-border">
                                        <p className="text-2xl font-black text-foreground">{totalClauses}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Flagged Clauses</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-bold text-foreground">Executive Summary</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                                        {data.userReview || data.summary}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function renderNonLegalView() {
        const category = analysisData?.documentCategory || "Non-Legal Document";
        const explanation = analysisData?.nonLegalExplanation || analysisData?.userReview || analysisData?.summary || "This document does not contain legal terms, contractual obligations, or statutory clauses.";
        const fullTextSnippet = analysisData?.fullText ? analysisData.fullText.slice(0, 1000) : "";

        return (
            <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <Button 
                        variant="ghost" 
                        onClick={handleResetReview} 
                        className="text-gray-600 hover:text-gray-900 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Upload
                    </Button>
                    <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-800 px-3 py-1 text-xs font-semibold">
                        Content Rejection Notice
                    </Badge>
                </div>

                {/* Primary Alert Card */}
                <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 shadow-lg rounded-3xl overflow-hidden">
                    <CardContent className="p-8 md:p-10 space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                                <AlertTriangle className="h-9 w-9" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                        This Document Is Not Legal-Related
                                    </h1>
                                    <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border border-amber-300 font-bold px-3 py-1 text-xs uppercase tracking-wider">
                                        Identified: {category}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    Vidhik AI's Legal Analysis Engine audited <span className="font-bold text-gray-900 font-mono text-sm">'{selectedFile?.name || "Uploaded File"}'</span> and determined that this file does not contain legal provisions, contractual covenants, or statutory subject matter. No simulated or artificial results have been generated.
                                </p>
                            </div>
                        </div>

                        {/* AI Rationale Box */}
                        <div className="bg-white border border-amber-200 rounded-2xl p-6 space-y-3 shadow-sm">
                            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-widest">
                                <Sparkles className="h-4 w-4 text-amber-600" />
                                AI Evaluation & Rationale
                            </div>
                            <p className="text-gray-800 leading-relaxed text-sm md:text-base font-medium">
                                {explanation}
                            </p>
                        </div>

                        {/* Two Column Diagnostic Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-6 space-y-3">
                                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                                    <X className="h-4 w-4 text-red-500" />
                                    Why was this flagged as non-legal?
                                </h4>
                                <ul className="text-xs text-gray-700 space-y-2.5 leading-relaxed">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 font-bold text-base leading-none">•</span>
                                        <span>No contractual parties, warranties, or liability covenants detected</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 font-bold text-base leading-none">•</span>
                                        <span>No governing laws, jurisdiction clauses, or legal obligations found</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 font-bold text-base leading-none">•</span>
                                        <span>Document content is classified as: <strong>{category}</strong></span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 space-y-3">
                                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                                    <Check className="h-4 w-4 text-emerald-600" />
                                    Supported Legal Document Types
                                </h4>
                                <ul className="text-xs text-gray-700 space-y-2.5 leading-relaxed">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 font-bold text-base leading-none">•</span>
                                        <span>Commercial Contracts (MSAs, SLAs, Vendor & Client Agreements)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 font-bold text-base leading-none">•</span>
                                        <span>Employment Contracts, NDAs, Non-Competes & Offer Letters</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 font-bold text-base leading-none">•</span>
                                        <span>Leases, Deeds, Affidavits, Legal Notices & Court Pleadings</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Extracted Document Text Preview */}
                        {fullTextSnippet && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="font-semibold uppercase tracking-wider">Analyzed Document Extract</span>
                                    <span>{fullTextSnippet.length} characters shown</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {fullTextSnippet}
                                    {analysisData?.fullText?.length > 1000 && "\n\n... [Content Truncated]"}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleResetReview}
                                className="w-full sm:w-auto h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl gap-2 shadow-lg shadow-amber-600/20"
                            >
                                <Upload className="h-4 w-4" />
                                Upload a Legal Document
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/documents')}
                                className="w-full sm:w-auto h-12 px-6 rounded-xl text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold"
                            >
                                Back to Workspace
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    function renderErrorView() {
        return (
            <div className="max-w-xl mx-auto py-20 space-y-6 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto shadow-sm">
                    <ShieldAlert className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Analysis Could Not Be Completed</h2>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                        {analysisError || "An error occurred while analyzing the document. No simulated or fallback data was generated."}
                    </p>
                </div>
                <div className="pt-4 flex items-center justify-center gap-3">
                    <Button onClick={handleResetReview} className="h-11 px-6 rounded-xl font-semibold gap-2">
                        <Upload className="h-4 w-4" />
                        Try Another Document
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/documents')} className="h-11 px-6 rounded-xl text-gray-700 border-gray-300">
                        Back to Documents
                    </Button>
                </div>
            </div>
        );
    }
}

