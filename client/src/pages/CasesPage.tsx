import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    Briefcase, 
    AlertCircle, 
    Clock, 
    User, 
    Coins, 
    FileText, 
    ExternalLink,
    Search, 
    Calendar, 
    MapPin, 
    ShieldCheck, 
    ArrowRight, 
    Star, 
    ArrowLeft, 
    Lock, 
    Video, 
    Download, 
    CheckCircle2, 
    Sparkles, 
    Upload, 
    X, 
    HelpCircle,
    Check,
    ChevronRight,
    Send
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { caseService, ICase } from "@/services/caseService";
import { launchRazorpayCheckout, createSimulatedTestResponse } from "@/services/razorpayHelper";
import { toast } from "sonner";
import { getFileUrl, isImageFile, isPdfFile } from "@/lib/fileUtils";

export default function CasesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cases, setCases] = useState<ICase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCase, setSelectedCase] = useState<ICase | null>(null);
    const [caseSearchQuery, setCaseSearchQuery] = useState("");

    // Start New Case Flow States
    const [showNewCaseFlow, setShowNewCaseFlow] = useState<boolean>(false);
    const [caseTitle, setCaseTitle] = useState("");
    const [caseCategory, setCaseCategory] = useState("Corporate");
    const [casePriority, setCasePriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
    const [targetBudget, setTargetBudget] = useState("");
    const [caseDescription, setCaseDescription] = useState("");
    const [courtName, setCourtName] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmittingCase, setIsSubmittingCase] = useState(false);

    // Selection & Action states
    const [isSelectingLawyer, setIsSelectingLawyer] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const categories = [
        "Corporate",
        "Criminal",
        "Family & Divorce",
        "Civil Litigation",
        "Real Estate & Property",
        "IP & Copyright",
        "Taxation",
        "Labor & Employment",
        "General Legal"
    ];

    const fetchCases = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const data = await caseService.getClientCases();
            setCases(data);
            setSelectedCase(prevSelected => {
                if (!prevSelected) {
                    return data.length > 0 ? data[0] : null;
                }
                const updated = data.find(c => c._id === prevSelected._id);
                return updated || prevSelected;
            });
        } catch (err: any) {
            console.error(err);
            if (!isSilent) {
                toast.error(err.response?.data?.message || "Failed to load cases");
            }
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCases();
        const interval = setInterval(() => {
            fetchCases(true);
        }, 4000);
        return () => clearInterval(interval);
    }, [fetchCases]);

    useEffect(() => {
        if (location.state?.startBookingFlow) {
            setShowNewCaseFlow(true);
            setSelectedCase(null);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const validFiles = filesArray.filter(f => f.size <= 25 * 1024 * 1024);
            if (validFiles.length < filesArray.length) {
                toast.error("Some files exceeded the 25MB limit and were skipped.");
            }
            setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateCaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caseTitle.trim()) {
            toast.error("Please enter a case title");
            return;
        }
        if (!caseDescription.trim() && selectedFiles.length === 0) {
            toast.error("Please provide either a case brief or upload case documents.");
            return;
        }

        setIsSubmittingCase(true);
        try {
            const formData = new FormData();
            formData.append("title", caseTitle.trim());
            formData.append("description", caseDescription.trim() || "Brief uploaded in attached documents.");
            formData.append("category", caseCategory);
            formData.append("priority", casePriority);
            if (targetBudget) formData.append("budget", targetBudget);
            if (courtName) formData.append("court", courtName.trim());

            selectedFiles.forEach(file => {
                formData.append("documents", file);
            });

            toast.info("Analyzing brief with AI & broadcasting to lawyers...");
            const created = await caseService.createCaseWithFiles(formData);

            toast.success("Case posted successfully! Lawyers can now review and approve.");
            setShowNewCaseFlow(false);
            setCaseTitle("");
            setCaseDescription("");
            setTargetBudget("");
            setCourtName("");
            setSelectedFiles([]);
            await fetchCases();
            setSelectedCase(created);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit case.");
        } finally {
            setIsSubmittingCase(false);
        }
    };

    const handleSelectLawyer = async (lawyerId: string, lawyerName: string) => {
        if (!selectedCase) return;
        setIsSelectingLawyer(true);
        try {
            const updated = await caseService.selectLawyer(selectedCase._id, lawyerId);
            toast.success(`Approval request sent to Adv. ${lawyerName}! Awaiting confirmation.`);
            setSelectedCase(updated);
            fetchCases(true);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to select lawyer");
        } finally {
            setIsSelectingLawyer(false);
        }
    };

    const handleApprovePlan = async () => {
        if (!selectedCase) return;
        try {
            const updated = await caseService.approvePlan(selectedCase._id);
            toast.success("Action Roadmap approved! Work has commenced.");
            setSelectedCase(updated);
            fetchCases(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to approve roadmap");
        }
    };

    const handleCheckoutPayment = async (targetCaseId?: string, simulateDirect = false) => {
        const cId = targetCaseId || selectedCase?._id;
        if (!cId) return;
        setIsProcessingPayment(true);
        try {
            const orderRes = await caseService.createPaymentOrder(cId);
            const { order } = orderRes;

            const completeCasePayment = async (paymentResp: any) => {
                await caseService.payAndConfirm(cId, paymentResp);
                toast.success("Payment completed & Engagement Confirmed!");
                fetchCases();
            };

            if (simulateDirect) {
                const simResp = createSimulatedTestResponse(order.id);
                await completeCasePayment(simResp);
                setIsProcessingPayment(false);
                return;
            }

            const launched = await launchRazorpayCheckout({
                order,
                onSuccess: async (paymentResp) => {
                    await completeCasePayment(paymentResp);
                    setIsProcessingPayment(false);
                },
                onError: (err) => {
                    console.error("Razorpay error:", err);
                    toast.error(err?.message || "Payment encountered an error.");
                    setIsProcessingPayment(false);
                },
                onDismiss: () => {
                    setIsProcessingPayment(false);
                    toast.info("Payment was dismissed. You can pay anytime from your case view.");
                }
            });

            if (!launched) {
                setIsProcessingPayment(false);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Payment processing failed.");
            setIsProcessingPayment(false);
        }
    };

    const filteredCases = cases.filter(c => 
        (c.title || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.category || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.lawyer?.fullName || "").toLowerCase().includes(caseSearchQuery.toLowerCase())
    );

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Case Management</h1>
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-primary/20">
                                AI-Powered Open Marketplace
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">
                            Upload your legal case brief, get instant AI analysis, receive lawyer approvals in real-time, and track execution milestones.
                        </p>
                    </div>
                    {!showNewCaseFlow && (
                        <Button 
                            onClick={() => {
                                setShowNewCaseFlow(true);
                                setSelectedCase(null);
                            }}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-6 py-5 shadow-sm flex items-center gap-2 transition-all duration-200"
                        >
                            <Upload className="w-4 h-4" />
                            <span>+ Post New Case with Documents</span>
                        </Button>
                    )}
                </div>

                {showNewCaseFlow ? (
                    /* POST NEW CASE WIZARD */
                    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <button 
                                onClick={() => setShowNewCaseFlow(false)}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Cancel & Back to Cases
                            </button>
                            <div className="text-right">
                                <h2 className="text-xl font-black text-slate-900">Post Case to Legal Marketplace</h2>
                                <p className="text-xs text-slate-400 font-semibold">Upload documentation for automatic AI summarization</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateCaseSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Case Title *</Label>
                                    <Input 
                                        required
                                        value={caseTitle}
                                        onChange={(e) => setCaseTitle(e.target.value)}
                                        placeholder="e.g., Commercial Contract Breach & Recovery or Property Partition Dispute"
                                        className="h-11 rounded-xl text-sm font-semibold bg-slate-50/50"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Legal Category</Label>
                                    <select
                                        value={caseCategory}
                                        onChange={(e) => setCaseCategory(e.target.value)}
                                        className="w-full h-11 rounded-xl border border-input bg-slate-50/50 px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Urgency Level</Label>
                                    <select
                                        value={casePriority}
                                        onChange={(e) => setCasePriority(e.target.value as any)}
                                        className="w-full h-11 rounded-xl border border-input bg-slate-50/50 px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                        <option value="low">Standard / Low</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                        <option value="urgent">Urgent / Immediate Hearing</option>
                                    </select>
                                </div>

                                {/* Estimated Budget */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estimated Budget (₹)</Label>
                                    <Input 
                                        type="number"
                                        value={targetBudget}
                                        onChange={(e) => setTargetBudget(e.target.value)}
                                        placeholder="e.g. 5000"
                                        className="h-11 rounded-xl text-sm font-semibold bg-slate-50/50"
                                    />
                                </div>

                                {/* Court / Forum */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Jurisdiction / Court (Optional)</Label>
                                    <Input 
                                        value={courtName}
                                        onChange={(e) => setCourtName(e.target.value)}
                                        placeholder="e.g. District Court Bangalore or High Court Delhi"
                                        className="h-11 rounded-xl text-sm font-semibold bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            {/* Description / Summary Input */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Case Summary / Background Details
                                </Label>
                                <textarea
                                    rows={4}
                                    value={caseDescription}
                                    onChange={(e) => setCaseDescription(e.target.value)}
                                    placeholder="Describe the background of your dispute, key timeline events, specific legal relief sought, or opposing parties..."
                                    className="w-full rounded-2xl border border-input bg-slate-50/50 p-4 text-sm font-medium leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                            </div>

                            {/* Document Upload Area */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                    Upload Case Documents (PDF, Word DOCX/DOC, TXT)
                                </Label>
                                
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer space-y-2"
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-extrabold text-slate-900">
                                        Click to browse or drag & drop case briefs or contracts
                                    </p>
                                    <p className="text-xs text-slate-500 font-semibold">
                                        PDF, Word (.docx, .doc), or text documents up to 25MB each (Max 5 files)
                                    </p>
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        multiple 
                                        accept=".pdf,.doc,.docx,.txt,image/*" 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* Selected files list */}
                                {selectedFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {selectedFiles.map((file, idx) => (
                                            <div 
                                                key={idx}
                                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xs text-xs font-bold text-slate-800"
                                            >
                                                <FileText className="w-4 h-4 text-primary shrink-0" />
                                                <span className="truncate max-w-[200px]">{file.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">({(file.size / 1024).toFixed(0)} KB)</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveFile(idx)}
                                                    className="text-slate-400 hover:text-red-500 ml-1"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* AI Processing Note */}
                            <div className="bg-gradient-to-r from-primary/10 via-indigo-50 to-secondary/30 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-xs text-slate-700 leading-relaxed">
                                    <span className="font-extrabold text-slate-900 block">AI Automated Case Summarization & Lawyer Matching</span>
                                    Upon submission, Vidhik AI will securely parse your uploaded document, generate an executive legal analysis, and highlight the case to verified advocates. Multiple lawyers will review and submit their approval.
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNewCaseFlow(false)}
                                    className="rounded-xl font-bold h-11 px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmittingCase}
                                    className="rounded-xl font-bold h-11 px-8 bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center gap-2"
                                >
                                    {isSubmittingCase ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Analyzing with AI & Posting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Post Case to Marketplace</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* CASES LIST & DETAIL VIEWS */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Cases List */}
                        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="font-extrabold text-slate-900 text-lg">My Cases</h3>
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-black border-none px-2 py-0.5 rounded">
                                    {cases.length} Total
                                </Badge>
                            </div>

                            {/* Search bar inside sidebar */}
                            {cases.length > 0 && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input 
                                        className="pl-9 h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary font-semibold"
                                        placeholder="Search cases or categories..."
                                        value={caseSearchQuery}
                                        onChange={(e) => setCaseSearchQuery(e.target.value)}
                                    />
                                </div>
                            )}

                            {loading && cases.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2 text-xs text-slate-400 font-bold">Loading engagements...</p>
                                </div>
                            ) : cases.length === 0 ? (
                                <div className="py-16 text-center text-slate-400 border border-dashed border-border rounded-2xl bg-slate-50/50 p-6">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 border border-border shadow-sm">
                                        <Briefcase size={24} />
                                    </div>
                                    <p className="font-extrabold text-slate-900 text-base">No active cases</p>
                                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto mt-2 leading-relaxed font-semibold">
                                        Post a case with documents to receive proposals from top advocates.
                                    </p>
                                    <Button
                                        onClick={() => setShowNewCaseFlow(true)}
                                        className="mt-5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs h-10 px-6 shadow-sm"
                                    >
                                        + Post First Case
                                    </Button>
                                </div>
                            ) : filteredCases.length === 0 ? (
                                <div className="py-12 text-center text-slate-400">
                                    <Briefcase size={28} className="mx-auto mb-2 text-slate-300" />
                                    <p className="font-bold text-sm text-slate-500">No matching cases</p>
                                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                                    {filteredCases.map((c) => {
                                        const interestedCount = c.interestedLawyers?.length || 0;
                                        return (
                                            <div
                                                key={c._id}
                                                onClick={() => setSelectedCase(c)}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                    selectedCase?._id === c._id
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border bg-card hover:border-slate-300 hover:shadow-xs"
                                                }`}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                                                            {c.title}
                                                        </h4>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                                                        <span>{c.category || "General Legal"}</span>
                                                        <span className="font-bold text-slate-900">
                                                            ₹{(c.totalFee || c.budget || 0).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-1">
                                                        <Badge 
                                                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-none shadow-none ${
                                                                c.status === 'open'
                                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                                    : c.status === 'pending_lawyer' 
                                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                                        : c.status === 'pending_payment' 
                                                                            ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                                                                            : c.status === 'active'
                                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                                : 'bg-slate-100 text-slate-700'
                                                            }`}
                                                        >
                                                            {c.status === 'open' 
                                                                ? `Open (${interestedCount} Applied)`
                                                                : c.status === 'pending_lawyer' 
                                                                    ? 'Awaiting Lawyer' 
                                                                    : c.status === 'pending_payment' 
                                                                        ? 'Awaiting Payment' 
                                                                        : c.status}
                                                        </Badge>

                                                        {c.documents && c.documents.length > 0 && (
                                                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                                <FileText className="w-3 h-3 text-slate-400" />
                                                                {c.documents.length} doc{c.documents.length > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Progress bar if active */}
                                                    {c.status === 'active' && (
                                                        <div className="pt-2 border-t border-slate-100">
                                                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                                <span>Progress</span>
                                                                <span className="text-primary">{c.currentProgress}%</span>
                                                            </div>
                                                            <Progress value={c.currentProgress} className="h-1.5 bg-slate-100" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Case Details */}
                        <div className="lg:col-span-8">
                            {selectedCase ? (
                                <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                                    <CardContent className="p-6 md:p-8 space-y-8">
                                        
                                        {/* Case Header */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold">
                                                        {selectedCase.category || "General Legal"}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 font-mono font-semibold">
                                                        Ref: {selectedCase.filingNumber || selectedCase._id}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mt-1">
                                                    {selectedCase.title}
                                                </h2>
                                                <p className="text-xs text-slate-400 font-semibold">
                                                    Posted on {new Date(selectedCase.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                                    <Badge 
                                                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border-none shadow-none mt-1 ${
                                                            selectedCase.status === 'open' 
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : selectedCase.status === 'pending_lawyer' 
                                                                    ? 'bg-amber-100 text-amber-800' 
                                                                    : selectedCase.status === 'pending_payment' 
                                                                        ? 'bg-orange-100 text-orange-800' 
                                                                        : selectedCase.status === 'active'
                                                                            ? 'bg-emerald-100 text-emerald-800'
                                                                            : 'bg-slate-100 text-slate-800'
                                                        }`}
                                                    >
                                                        {selectedCase.status === 'open' ? 'Open for Lawyers' : selectedCase.status === 'pending_lawyer' ? 'Awaiting Confirmation' : selectedCase.status === 'pending_payment' ? 'Awaiting Payment' : selectedCase.status}
                                                    </Badge>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contract Fee</p>
                                                    <p className="text-base font-black text-primary mt-0.5">
                                                        ₹{(selectedCase.totalFee || selectedCase.budget || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI LEGAL SUMMARY & ANALYSIS CARD */}
                                        {selectedCase.aiSummary && (
                                            <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-primary/20 rounded-2xl p-6 space-y-4 shadow-xs">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center">
                                                            <Sparkles className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-extrabold text-slate-900 text-sm">Vidhik AI Case Intelligence Summary</h4>
                                                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Executive Legal Brief & Issue Extraction</p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold">
                                                        AI Verified
                                                    </Badge>
                                                </div>

                                                <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line bg-white/70 border border-slate-150 rounded-xl p-4">
                                                    {selectedCase.aiSummary}
                                                </p>

                                                {selectedCase.aiKeyFacts && selectedCase.aiKeyFacts.length > 0 && (
                                                    <div className="space-y-2 pt-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Key Legal Facts & Disputed Points</span>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {selectedCase.aiKeyFacts.map((fact, idx) => (
                                                                <div key={idx} className="bg-white/90 border border-slate-150 rounded-lg p-2.5 flex items-start gap-2 text-xs font-semibold text-slate-800">
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                                                    <span>{fact}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* UPLOADED CASE DOCUMENTS */}
                                        {selectedCase.documents && selectedCase.documents.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                    Attached Case Documents ({selectedCase.documents.length})
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {selectedCase.documents.map((doc, idx) => (
                                                        <a 
                                                            key={idx}
                                                            href={getFileUrl(doc.url)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between group transition-all"
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                                                        {doc.name}
                                                                    </p>
                                                                    <span className="text-[10px] text-slate-400 font-semibold">{doc.docType || "Case Document"}</span>
                                                                </div>
                                                            </div>
                                                            <Download className="w-4 h-4 text-slate-400 group-hover:text-primary shrink-0 ml-2" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* INTERESTED LAWYERS & APPROVALS (MARKETPLACE FLOW) */}
                                        {selectedCase.status === 'open' && (
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                                            Lawyer Approvals & Expressions of Interest
                                                        </h3>
                                                        <p className="text-xs text-slate-500 font-semibold">
                                                            Review advocates who have approved and applied to represent your case. Choose your preferred lawyer.
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-primary text-white text-xs font-bold px-3 py-1">
                                                        {selectedCase.interestedLawyers?.length || 0} Applied
                                                    </Badge>
                                                </div>

                                                {(!selectedCase.interestedLawyers || selectedCase.interestedLawyers.length === 0) ? (
                                                    <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 text-center space-y-2">
                                                        <Clock className="w-8 h-8 text-blue-600 mx-auto animate-pulse" />
                                                        <h4 className="font-extrabold text-slate-900 text-sm">Your Case is Active on the Lawyer Marketplace</h4>
                                                        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                                                            Verified advocates in our network are reviewing your case documentation. As soon as lawyers approve your case, their proposals and rates will appear here in real-time.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {selectedCase.interestedLawyers.map((item, idx) => {
                                                            const lawyer = item.lawyer;
                                                            if (!lawyer) return null;
                                                            const isAiMatch = selectedCase.aiRecommendedLawyer?._id === lawyer._id;
                                                            const isAdminRec = selectedCase.adminRecommendedLawyer?._id === lawyer._id;

                                                            return (
                                                                <div 
                                                                    key={idx}
                                                                    className={`rounded-2xl border p-5 transition-all space-y-3 ${
                                                                        isAiMatch 
                                                                            ? "bg-gradient-to-r from-purple-50/70 to-indigo-50/40 border-primary shadow-xs" 
                                                                            : isAdminRec 
                                                                                ? "bg-amber-50/50 border-amber-300"
                                                                                : "bg-white border-slate-200 hover:border-slate-300"
                                                                    }`}
                                                                >
                                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                        <div className="flex items-center gap-3.5">
                                                                            <Avatar className="h-12 w-12 rounded-xl border border-border shrink-0">
                                                                                <AvatarImage 
                                                                                    src={lawyer.avatar ? (lawyer.avatar.startsWith('http') ? lawyer.avatar : `/lawyer${lawyer.avatar}`) : ""} 
                                                                                    alt={lawyer.fullName} 
                                                                                />
                                                                                <AvatarFallback className="rounded-xl bg-slate-100 font-bold">
                                                                                    {lawyer.fullName?.charAt(0) || "A"}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <h4 className="font-extrabold text-slate-900 text-sm">{lawyer.fullName}</h4>
                                                                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                                                                    {isAiMatch && (
                                                                                        <Badge className="bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                                                                                            ⭐ AI Best Match
                                                                                        </Badge>
                                                                                    )}
                                                                                    {isAdminRec && (
                                                                                        <Badge className="bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider">
                                                                                            🛡️ Admin Recommended
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-xs text-slate-500 font-semibold">
                                                                                    {lawyer.expertise || "Specialist Advocate"} • {lawyer.experience || "10+ Yrs"} Experience • {lawyer.location || "High Court"}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                                            <div className="text-right">
                                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Proposed Fee</span>
                                                                                <span className="text-base font-black text-slate-900">
                                                                                    ₹{(item.proposedFee || selectedCase.budget || selectedCase.totalFee).toLocaleString()}
                                                                                </span>
                                                                            </div>

                                                                            <Button
                                                                                disabled={isSelectingLawyer}
                                                                                onClick={() => handleSelectLawyer(lawyer._id, lawyer.fullName)}
                                                                                className="rounded-xl font-bold text-xs h-10 px-5 bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 shadow-xs"
                                                                            >
                                                                                <span>Select Advocate</span>
                                                                                <ChevronRight className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Proposal note / AI Reason */}
                                                                    {item.proposalNote && (
                                                                        <div className="bg-white/80 border border-slate-150 rounded-xl p-3 text-xs text-slate-700 font-medium">
                                                                            <span className="font-bold text-slate-900 mr-1.5">Advocate Pitch:</span>
                                                                            {item.proposalNote}
                                                                        </div>
                                                                    )}

                                                                    {isAiMatch && selectedCase.aiRecommendationReason && (
                                                                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-2.5 text-xs text-primary font-semibold flex items-center gap-2">
                                                                            <Sparkles className="w-4 h-4 shrink-0" />
                                                                            <span><strong>Why AI Recommends:</strong> {selectedCase.aiRecommendationReason}</span>
                                                                        </div>
                                                                    )}

                                                                    {isAdminRec && selectedCase.adminRecommendationNote && (
                                                                        <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900 font-semibold flex items-center gap-2">
                                                                            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-700" />
                                                                            <span><strong>Admin Note:</strong> {selectedCase.adminRecommendationNote}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* AWAITING LAWYER CONFIRMATION */}
                                        {selectedCase.status === 'pending_lawyer' && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                                                <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                                                <div className="space-y-1.5 flex-1">
                                                    <h4 className="font-extrabold text-amber-900 text-sm">
                                                        Awaiting Confirmation from Adv. {selectedCase.lawyer?.fullName || "Selected Advocate"}
                                                    </h4>
                                                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                                        You have selected Advocate <strong>{selectedCase.lawyer?.fullName}</strong>. We have sent the confirmation request to their portal. Once accepted, payment will be enabled to activate the roadmap.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* PENDING PAYMENT - PROCEED TO RAZORPAY */}
                                        {selectedCase.status === 'pending_payment' && (
                                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-extrabold text-orange-950 text-base">
                                                            Adv. {selectedCase.lawyer?.fullName} Accepted Your Case!
                                                        </h4>
                                                        <p className="text-xs text-orange-800 font-medium">
                                                            Please complete the consultation and retainer fee payment. Funds remain securely escrowed under admin supervision until milestone verification.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-orange-200/60">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest block">Amount Payable</span>
                                                        <span className="text-2xl font-black text-slate-900">
                                                            ₹{selectedCase.totalFee.toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                                        <Button
                                                            disabled={isProcessingPayment}
                                                            onClick={() => handleCheckoutPayment(selectedCase._id, true)}
                                                            variant="outline"
                                                            className="rounded-xl font-bold text-xs h-11 px-4 border-orange-300 text-orange-900 hover:bg-orange-100"
                                                        >
                                                            Test / Instant Pay
                                                        </Button>
                                                        <Button
                                                            disabled={isProcessingPayment}
                                                            onClick={() => handleCheckoutPayment(selectedCase._id, false)}
                                                            className="rounded-xl font-bold text-xs h-11 px-6 bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none flex items-center justify-center gap-2 shadow-sm"
                                                        >
                                                            <Lock className="w-4 h-4" />
                                                            <span>Pay via Razorpay Secure</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ACTIVE CASE - VIDEO CONSULTATION & ACTION ROADMAP */}
                                        {selectedCase.status === 'active' && (
                                            <div className="space-y-8">
                                                {/* Meeting link card */}
                                                {selectedCase.meetingLink && (
                                                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                                                <Video className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-extrabold text-emerald-950 text-sm">Case Consultation Suite Active</h4>
                                                                <p className="text-xs text-emerald-700 font-medium">Join the secure video consultation room with your advocate.</p>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            onClick={() => navigate(`/cases/${selectedCase._id}/consultation`)}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs h-10 px-5 flex items-center gap-2 shrink-0 shadow-xs"
                                                        >
                                                            <Video className="w-4 h-4" />
                                                            <span>Join Video Meeting</span>
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* ACTION ROADMAP & MILESTONES */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-extrabold text-slate-900 text-base">Case Action Roadmap & Milestones</h3>
                                                            <p className="text-xs text-slate-500 font-semibold">
                                                                Track step-by-step progress submitted by your lawyer.
                                                            </p>
                                                        </div>
                                                        <Badge className="bg-primary/10 text-primary border-none text-xs font-bold">
                                                            {selectedCase.currentProgress}% Completed
                                                        </Badge>
                                                    </div>

                                                    {!selectedCase.planSubmitted ? (
                                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                                                            <Clock className="w-7 h-7 text-slate-400 mx-auto" />
                                                            <h4 className="font-bold text-slate-800 text-sm">Lawyer Preparing Action Roadmap</h4>
                                                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                                                Advocate {selectedCase.lawyer?.fullName} is outlining the milestone action plan. Once submitted, you will review and approve it here.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {!selectedCase.planApproved && (
                                                                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                                                                    <div className="text-xs text-slate-800">
                                                                        <span className="font-extrabold block text-slate-900">Roadmap Ready for Your Approval</span>
                                                                        Please review the milestones below and click approve to authorize work.
                                                                    </div>
                                                                    <Button
                                                                        onClick={handleApprovePlan}
                                                                        className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs h-9 px-4 shrink-0"
                                                                    >
                                                                        Approve Roadmap
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            <div className="space-y-3">
                                                                {selectedCase.milestones.map((m, mIdx) => (
                                                                    <div 
                                                                        key={mIdx}
                                                                        className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2"
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                                                    m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                                                }`}>
                                                                                    {mIdx + 1}
                                                                                </div>
                                                                                <h5 className="font-extrabold text-slate-900 text-sm">{m.title}</h5>
                                                                            </div>
                                                                            <Badge className={`text-[9px] font-bold uppercase ${
                                                                                m.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                                                            }`}>
                                                                                {m.status}
                                                                            </Badge>
                                                                        </div>
                                                                        <p className="text-xs text-slate-600 font-medium pl-8">{m.description}</p>
                                                                        
                                                                        {/* Proof docs if any */}
                                                                        {m.proofDocs && m.proofDocs.length > 0 && (
                                                                            <div className="pl-8 pt-2 flex flex-wrap gap-2">
                                                                                {m.proofDocs.map((doc, dIdx) => (
                                                                                    <a
                                                                                        key={dIdx}
                                                                                        href={getFileUrl(doc.url)}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-700 flex items-center gap-1.5"
                                                                                    >
                                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                                                        <span>Proof: {doc.name}</span>
                                                                                    </a>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="bg-card border border-border rounded-3xl p-12 text-center text-slate-400">
                                    <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                    <h3 className="font-bold text-slate-700 text-base">Select a case to view details</h3>
                                    <p className="text-xs text-slate-400 mt-1">Pick a case from the list on the left to view documentation, AI analysis, and advocate proposals.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
