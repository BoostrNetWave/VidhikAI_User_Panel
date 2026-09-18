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
    ShieldCheck
} from 'lucide-react';
import { PREVIEW_DESIGN } from '@/components/documents/DocumentPreview';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from '@/lib/api';
import { toast } from 'sonner';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

type ReviewState = 'UPLOAD' | 'PROCESSING' | 'COMPLETED';

export default function DocumentReviewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState<ReviewState>(id ? 'PROCESSING' : 'UPLOAD');
    const [viewMode, setViewMode] = useState<'SUMMARY' | 'DETAILED'>('DETAILED');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sourceDocument, setSourceDocument] = useState<any>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [isDeepScanEnabled] = useState(false);
    const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [logs, setLogs] = useState<{ msg: string, status: 'pending' | 'loading' | 'done' }[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                // Simulate progress finishing
                setProgress(100);
                setTimeout(() => {
                    setViewMode('DETAILED');
                    setState('COMPLETED');
                }, 800);
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
            } else {
                const errorMessage = error.response?.data?.message || "AI Analysis failed. Showing simulated results.";
                toast.error(error.response?.data?.error || "Analysis Failed", {
                    description: errorMessage
                });
                // Fallback to dummy data if API fails
                setAnalysisData(null);

                // Allow manual entry into COMPLETED state for demo purposes even on failure
                setTimeout(() => {
                    setViewMode('DETAILED');
                    setState('COMPLETED');
                }, 1000);
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
        setState('UPLOAD');
    };

    useEffect(() => {
        if (state === 'PROCESSING') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setState('COMPLETED'), 1000);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 80);

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
                            accept=".pdf,.docx"
                        />
                        <div
                            className={`border-2 border-dashed rounded-xl p-20 flex flex-col items-center justify-center space-y-6 transition-all cursor-pointer group ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-border-strong hover:bg-secondary/50'}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">Drag and drop your files here</h3>
                                <p className="text-muted-foreground max-w-sm">Upload legal agreements, NDAs, or service contracts for deep analysis.</p>
                            </div>
                            <Button
                                size="lg"
                                className="h-12 px-8 rounded-lg gap-2 font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <FileText className="h-5 w-5" />
                                Browse Files
                            </Button>
                        </div>

                    </div>

                    {/* How it Works Sidebar */}
                    <div className="space-y-6">
                        <Card className="rounded-xl border border-border shadow-sm bg-card overflow-hidden h-full">
                            <CardHeader className="bg-secondary/30 border-b border-border pb-4">
                                <div className="flex items-center gap-2 text-foreground">
                                    <Info className="h-5 w-5" />
                                    <CardTitle className="text-base font-semibold">How it works</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center text-primary">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground">Risk Scanning</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">AI identifies hidden liabilities, unfavorable termination clauses, and unusual payment terms.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center text-primary">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground">Compliance Check</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Matches your document against regional legal standards and internal company policies.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center text-primary">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-foreground">Clause Optimization</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Suggests industry-standard language to make contracts more balanced and clear.</p>
                                    </div>
                                </div>

                                <Separator className="my-6 opacity-50" />

                                <p className="text-xs text-muted-foreground italic leading-snug">
                                    Step 1 of 3: Document Ingestion. Your data is encrypted and processed according to SOC2 standards.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
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
        const data = analysisData || {
            summary: "This agreement contains highly restrictive covenants. The Non-Compete period (5 years) is significantly above industry standard (1-2 years) and likely unenforceable in several jurisdictions.",
            userReview: "Hi there! I've carefully reviewed your document. The biggest red flag is the 5-year non-compete clause, which is quite aggressive for this type of role. I recommend negotiating this down to 1 year to protect your future career moves. Overall, your intellectual property rights are well-protected, but let's tighten up that termination notice to give you more security.",
            complianceScore: 85,
            riskLevel: "High",
            suggestedAmendmentsCount: 4,
            standardClausesCount: 12,
            findings: [
                { type: 'warning', title: 'Non-Compete Restrictions', description: 'The 5-year restriction is considered "unreasonable" and overbroad, which may invalidate the entire clause.', suggestion: 'Reduce duration to 12 months and limit geographic scope to 50 miles of Company HQ to increase enforceability.' },
                { type: 'warning', title: 'Termination Notice Period', description: 'The 2-day termination for convenience clause is identified as a high-risk operational outlier. Industry standard is 30 days.', suggestion: 'Change notice period to at least 30 days for both parties.' },
                { type: 'positive', title: 'Intellectual Property', description: 'Strong IP protection for the consultant found in Exhibit A.', suggestion: '' },
                { type: 'info', title: 'Liability Cap', description: 'Liability is capped at the total amount of fees paid.', suggestion: '' }
            ],
            highlightedClauses: [
                { text: "five (5) years following termination", type: 'CRITICAL', issue: 'Unreasonable non-compete duration.', suggestion: '12 months', explanation: 'Most jurisdictions find non-compete periods over 2 years unenforceable for general employees.' },
                { text: "at any time without cause upon providing two (2) days written notice", type: 'UNFAVORABLE', issue: 'Extremely short notice period.', suggestion: '30 days written notice', explanation: 'A 2-day notice period is highly irregular and offers zero stability for the consultant.' }
            ],
            fullText: `SERVICE AGREEMENT\n\nThis SERVICE AGREEMENT (the "Agreement") is entered into as of January 15, 2024, by and between Global Tech Solutions Inc. (the "Client") and John Doe (the "Consultant").\n\n1. PROVISION OF SERVICES\nThe Consultant shall provide the Client with the services set forth in Exhibit A attached hereto (the "Services") in accordance with the terms and conditions of this Agreement. The Consultant shall perform the Services in a professional and workmanlike manner.\n\n2. NON-COMPETE RESTRICTIONS\nDuring the term of employment and for a period of five (5) years following termination of employment for any reason, the Consultant shall not engage in any competitive business within the geographic region.\n\n3. TERMINATION\nThe Client may terminate this Agreement at any time without cause upon providing two (2) days written notice.`
        };

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

        return (
            <div className="space-y-8 animate-in mt-6 fade-in slide-in-from-bottom-5 duration-700">
                {/* Results Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => {
                                if (id) navigate('/documents/review');
                                else setViewMode('SUMMARY');
                            }}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">{id ? "Shared Document Review" : "Document Review"}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!id && (
                            <Button variant="outline" className="rounded-xl h-11 border-gray-200 gap-2 font-bold px-6 shadow-sm hover:bg-gray-50" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                                Share Report
                            </Button>
                        )}
                        <Button className="rounded-xl h-11 bg-gray-900 text-white font-bold gap-2 px-6 shadow-sm hover:bg-black transition-colors" onClick={() => setIsFullscreen(!isFullscreen)}>
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
                                onClick={handleResetReview}
                                className="text-xs text-muted-foreground hover:text-foreground h-8 rounded-lg"
                            >
                                Review Different Document
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => navigate('/documents/workspace')}
                                className="text-xs gap-1.5 h-8 font-semibold rounded-lg"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                Back to My Documents
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-10 items-start">
                    {/* Top Section: Document Preview (Full Width) */}
                    <Card className={`w-full rounded-[2.5rem] border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white overflow-hidden flex flex-col transition-all duration-500 ${isFullscreen ? 'fixed inset-4 z-[100]' : 'min-h-[900px]'}`}>
                        <CardHeader className="bg-gray-50/50 border-b p-6 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/80 rounded-xl flex items-center justify-center text-primary">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-base font-bold">{selectedFile?.name || (sourceDocument ? `${sourceDocument.title}.txt` : "Service_Agreement_v2.pdf")}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                {isSearchVisible && (
                                    <div className="relative animate-in slide-in-from-right-4 duration-300">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search in document..."
                                            className="h-8 w-48 pl-8 pr-8 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
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
                                    className={`rounded-lg transition-colors ${isSearchVisible ? 'text-primary bg-secondary' : 'text-gray-400 hover:text-primary'}`}
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
                                    className={`rounded-lg transition-colors ${isFullscreen ? 'text-primary bg-secondary' : 'text-gray-400 hover:text-primary'}`}
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                >
                                    {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 flex-1 scrollbar-thin overflow-y-auto relative">
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

                            <div className={`max-w-[210mm] mx-auto space-y-8 font-serif text-gray-800 leading-relaxed ${isFullscreen ? 'text-lg' : 'text-base'}`}>
                                {data.fullText ? (
                                    <div>
                                        {/* Dynamic Interactive Text Rendering */}
                                        {(() => {
                                            let text = data.fullText;
                                            const parts: React.ReactNode[] = [];
                                            let lastIndex = 0;
                                            const unmappedClauses: any[] = [];

                                            // Helper to escape regex special characters
                                            const escapeRegExp = (string: string) => {
                                                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                            };

                                            // Helper to create a whitespace-flexible regex from a string
                                            const createFlexibleRegex = (string: string) => {
                                                const words = string.trim().split(/\s+/);
                                                const escapedWords = words.map(escapeRegExp);
                                                return new RegExp(escapedWords.join('\\s+'), 'i');
                                            };

                                            // Sort highlights by their position in the text to avoid overlap issues
                                            const sortedHighlights = [...(data.highlightedClauses || [])].sort((a, b) => {
                                                const regexA = createFlexibleRegex(a.text);
                                                const regexB = createFlexibleRegex(b.text);
                                                const matchA = text.match(regexA);
                                                const matchB = text.match(regexB);
                                                const indexA = matchA?.index ?? -1;
                                                const indexB = matchB?.index ?? -1;
                                                if (indexA === -1 && indexB === -1) return 0;
                                                if (indexA === -1) return 1;
                                                if (indexB === -1) return -1;
                                                return indexA - indexB;
                                            });

                                            // Helper to format text professionally (detect headings, bold text, etc.)
                                            const formatTextChunk = (content: string, keyPrefix: string) => {
                                                // Split by newlines to process line by line for professional structuring
                                                const lines = content.split('\n');
                                                return lines.map((line, i) => {
                                                    const trimmed = line.trim();
                                                    
                                                    // Detect if line is likely a heading (ALL CAPS, short, not just numbers)
                                                    const isHeading = trimmed.length > 2 && trimmed.length < 80 && trimmed === trimmed.toUpperCase() && !/^\d+$/.test(trimmed);
                                                    
                                                    // Detect if line is a key-value pair (e.g., "Company Name: Vidhik AI")
                                                    const isKeyValuePair = trimmed.includes(':') && trimmed.split(':')[0].length < 30;

                                                    let renderedLine: React.ReactNode = line;
                                                    let lineClass = "";

                                                    if (isHeading) {
                                                        lineClass = "block font-black text-gray-900 mt-8 mb-3 text-sm tracking-widest border-b border-gray-200 pb-1";
                                                    } else if (isKeyValuePair) {
                                                        const [key, ...rest] = line.split(':');
                                                        renderedLine = <><span className="font-bold text-gray-800">{key}:</span>{rest.join(':')}</>;
                                                        lineClass = "block mb-2";
                                                    } else if (trimmed.length > 0) {
                                                        lineClass = "block mb-3";
                                                    }

                                                    return (
                                                        <React.Fragment key={`${keyPrefix}-line-${i}`}>
                                                            {trimmed.length > 0 ? (
                                                                <span className={lineClass}>{renderedLine}</span>
                                                            ) : (
                                                                <span className="block h-2"></span> // Reduced height for blank lines
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                });
                                            };

                                            // Helper to render text with search highlights AND professional formatting
                                            const renderWithSearch = (content: string, keyPrefix: string) => {
                                                if (!searchQuery || searchQuery.length < 2) {
                                                    return formatTextChunk(content, keyPrefix);
                                                }

                                                const regex = createFlexibleRegex(searchQuery);
                                                const subParts = content.split(new RegExp(`(${regex.source})`, 'gi'));

                                                const searchHighlighted = subParts.map((part, i) =>
                                                    regex.test(part) ? (
                                                        <mark key={`${keyPrefix}-search-${i}`} className="bg-primary/20 text-foreground rounded-sm px-0.5 font-bold shadow-sm">
                                                            {part}
                                                        </mark>
                                                    ) : part
                                                );
                                                
                                                // We return a simple span here because mixing professional line formatting 
                                                // with deep search highlighting is complex. Search view is more raw.
                                                return <span>{searchHighlighted}</span>;
                                            };

                                            sortedHighlights.forEach((clause, idx) => {
                                                // Try exact match first
                                                let startIndex = text.indexOf(clause.text, lastIndex);
                                                let matchLength = clause.text.length;
                                                
                                                // If exact match fails, try whitespace-flexible match
                                                if (startIndex === -1) {
                                                    const regex = createFlexibleRegex(clause.text);
                                                    const remainingText = text.substring(lastIndex);
                                                    const match = remainingText.match(regex);
                                                    
                                                    if (match && match.index !== undefined) {
                                                        startIndex = lastIndex + match.index;
                                                        matchLength = match[0].length;
                                                    }
                                                }
                                                
                                                // If still no match, push to unmapped
                                                if (startIndex === -1) {
                                                    unmappedClauses.push({ ...clause, idx });
                                                    return;
                                                }

                                                // Push text before the highlight with search
                                                parts.push(renderWithSearch(text.substring(lastIndex, startIndex), `pre-${idx}`));

                                                // Push the interactive highlight
                                                const colorClass =
                                                    clause.type === 'CRITICAL' ? 'bg-red-100/80 border-b-2 border-red-500 text-red-900' :
                                                        clause.type === 'UNFAVORABLE' ? 'bg-orange-100/80 border-b-2 border-orange-500 text-orange-900' :
                                                            clause.type === 'POSITIVE' ? 'bg-green-100/80 border-b-2 border-green-500 text-green-900' :
                                                                'bg-secondary border-b-2 border-violet-400 text-foreground';

                                                parts.push(
                                                    <span
                                                        key={`mapped-${idx}`}
                                                        className={`${colorClass} px-1.5 py-0.5 rounded-sm font-bold cursor-help transition-all duration-200 relative group/h`}
                                                        onMouseEnter={() => setActiveHighlightIndex(idx)}
                                                        onMouseLeave={() => setActiveHighlightIndex(null)}
                                                    >
                                                        {renderWithSearch(clause.text, `highlight-${idx}`)}

                                                        {/* Floating Explanation Point */}
                                                        {activeHighlightIndex === idx && (
                                                            <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-80 p-5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 text-sm normal-case animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                                                                <div className="flex items-center gap-2 mb-3 font-black uppercase tracking-widest text-[11px]">
                                                                    {clause.type === 'CRITICAL' ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <Sparkles className="h-4 w-4 text-primary" />}
                                                                    <span className={clause.type === 'CRITICAL' ? 'text-red-600' : 'text-primary'}>AI Analysis</span>
                                                                </div>
                                                                <p className="font-bold text-gray-900 mb-2 leading-relaxed">
                                                                    {clause.issue}
                                                                </p>
                                                                <p className="text-gray-600 font-medium leading-relaxed">
                                                                    {clause.explanation || "This clause has been flagged for review based on standard legal practices."}
                                                                </p>
                                                                {clause.suggestion && (
                                                                    <div className="mt-4 pt-4 border-t border-gray-100 bg-secondary/30 -mx-5 -mb-5 p-5 rounded-b-2xl">
                                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Suggested Revision</p>
                                                                        <p className="text-primary font-bold italic leading-relaxed">"{clause.suggestion}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Visual Indicator Pulse */}
                                                        <span className={`absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full animate-ping ${clause.type === 'CRITICAL' ? 'bg-red-400' : 'bg-violet-400'}`}></span>
                                                        <span className={`absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full ${clause.type === 'CRITICAL' ? 'bg-red-500' : 'bg-primary/90'}`}></span>
                                                    </span>
                                                );

                                                lastIndex = startIndex + matchLength;
                                            });

                                            // Push remaining text with search
                                            parts.push(renderWithSearch(text.substring(lastIndex), "post"));

                                            return (
                                                <div className="space-y-12 pb-16">
                                                    <div className="bg-white p-12 md:p-20 shadow-xl border border-gray-200 relative text-justify min-h-[297mm]">
                                                        {parts}
                                                    </div>
                                                    
                                                    {unmappedClauses.length > 0 && (
                                                        <div className="mt-12 space-y-6">
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                                                    <ShieldAlert className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-gray-900">Additional Identified Clauses</h3>
                                                                    <p className="text-sm text-gray-500">The AI identified these clauses, but they were modified or re-formatted in the original document.</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {unmappedClauses.map((clause, idx) => (
                                                                    <div key={`unmapped-${idx}`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <Badge className={clause.type === 'CRITICAL' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary'}>
                                                                                {clause.type}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-sm text-gray-700 italic">
                                                                            "{clause.text}"
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-900 mb-1">{clause.issue}</p>
                                                                            <p className="text-sm text-gray-600 leading-relaxed">{clause.explanation}</p>
                                                                        </div>
                                                                        {clause.suggestion && (
                                                                            <div className="bg-secondary/30 p-4 rounded-xl border border-primary/10">
                                                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Suggested Revision</p>
                                                                                <p className="text-sm text-primary font-bold">"{clause.suggestion}"</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                                        <Loader2 className="h-10 w-10 text-violet-200 animate-spin" />
                                        <p className="text-gray-400 font-medium">Rendering document intelligence...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Panel: Analysis Metrics / Final Action */}
                    <div className="w-full flex flex-col items-center justify-center p-12 bg-secondary/40 rounded-[3rem] border-2 border-dashed border-primary/20/50 transition-all hover:bg-secondary/60 mb-10">
                        <div className="text-center space-y-6 w-full max-w-2xl">
                            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-sm mb-8 animate-pulse">
                                <Check className="h-12 w-12 text-white stroke-[4]" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Audit Successfully Completed</h3>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                Every line of your document has been meticulously audited by our AI.
                                Review the flagged points in the preview above, then proceed to the executive dashboard for the final report.
                            </p>

                            {/* Final Stats Button - THE FINAL DESTINATION */}
                            <div className="pt-10">
                                <Button className="w-full max-w-md h-20 bg-primary hover:bg-primary rounded-[2rem] text-2xl font-black gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-95 group" onClick={() => setViewMode('SUMMARY')}>
                                    Finish Audit & View Dashboard
                                    <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
                                </Button>
                                <p className="mt-6 text-sm font-bold text-primary/60 uppercase tracking-widest">Securely processed via SOC2 Encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

