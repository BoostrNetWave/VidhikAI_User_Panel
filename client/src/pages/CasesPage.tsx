import { useEffect, useState, useCallback } from "react";
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
    CheckCircle2, 
    ArrowLeft, 
    Plus, 
    Download, 
    Gavel, 
    Scale, 
    Building, 
    Send, 
    Folder, 
    MessageSquare,
    Tag,
    AlertTriangle
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { caseService, ICase } from "@/services/caseService";
import { lawyerService } from "@/services/lawyerService";
import { toast } from "sonner";

const legalCategories = [
    "Corporate & Commercial",
    "Civil Litigation",
    "Criminal Defense",
    "Family & Matrimonial",
    "Real Estate & Property",
    "Intellectual Property",
    "Taxation & Finance",
    "Employment & Labor",
    "Consumer Disputes",
    "General Legal"
];

const courtForums = [
    "Supreme Court of India",
    "High Court of Delhi",
    "High Court of Bombay",
    "District & Sessions Court",
    "National Company Law Tribunal (NCLT)",
    "National Green Tribunal (NGT)",
    "Debt Recovery Tribunal (DRT)",
    "Consumer Disputes Redressal Commission",
    "Pre-litigation / Out of Court",
    "Other Forum / Tribunal"
];

export default function CasesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Core state
    const [cases, setCases] = useState<ICase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCase, setSelectedCase] = useState<ICase | null>(null);
    const [caseSearchQuery, setCaseSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'documents' | 'hearings' | 'notes'>('overview');

    // Register New Case State
    const [showNewCaseFlow, setShowNewCaseFlow] = useState<boolean>(false);
    const [lawyers, setLawyers] = useState<any[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newCategory, setNewCategory] = useState(legalCategories[0]);
    const [newCourt, setNewCourt] = useState(courtForums[0]);
    const [newFilingNumber, setNewFilingNumber] = useState("");
    const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [newNextHearingDate, setNewNextHearingDate] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newLawyerId, setNewLawyerId] = useState("");
    const [newEstimatedFee, setNewEstimatedFee] = useState("");
    const [isSubmittingNewCase, setIsSubmittingNewCase] = useState(false);

    // Notes State
    const [newNoteText, setNewNoteText] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);

    const fetchCases = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const data = await caseService.getClientCases();
            setCases(data);
            setSelectedCase(prevSelected => {
                if (!prevSelected) return data.length > 0 ? data[0] : null;
                const updated = data.find(c => c._id === prevSelected._id);
                return updated || (data.length > 0 ? data[0] : null);
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

    const fetchLawyers = async () => {
        try {
            const data = await lawyerService.getPublicLawyers();
            setLawyers(data);
        } catch (error) {
            console.error("Failed to fetch lawyers", error);
        }
    };

    useEffect(() => {
        fetchCases();
        fetchLawyers();

        const interval = setInterval(() => {
            fetchCases(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchCases]);

    useEffect(() => {
        if (location.state) {
            if (location.state.openNewCase) {
                setShowNewCaseFlow(true);
                setSelectedCase(null);
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state]);

    const handleCreateCaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) {
            toast.error("Please provide both a case title and case description.");
            return;
        }

        setIsSubmittingNewCase(true);
        try {
            const created = await caseService.createCase({
                title: newTitle.trim(),
                description: newDescription.trim(),
                category: newCategory,
                court: newCourt,
                filingNumber: newFilingNumber.trim() || undefined,
                nextHearingDate: newNextHearingDate || undefined,
                priority: newPriority,
                lawyerId: newLawyerId || undefined,
                totalFee: newEstimatedFee ? Number(newEstimatedFee) : 0
            });

            toast.success("Legal case registered successfully!");
            setShowNewCaseFlow(false);
            setNewTitle("");
            setNewDescription("");
            setNewFilingNumber("");
            setNewNextHearingDate("");
            setNewLawyerId("");
            setNewEstimatedFee("");
            fetchCases();
            setSelectedCase(created);
        } catch (error: any) {
            console.error("Case registration error:", error);
            toast.error(error.response?.data?.message || "Failed to register case");
        } finally {
            setIsSubmittingNewCase(false);
        }
    };

    const handleApprovePlan = async () => {
        if (!selectedCase) return;

        try {
            const updated = await caseService.approvePlan(selectedCase._id);
            toast.success("Procedural roadmap approved successfully! Legal proceedings initiated.");
            fetchCases();
            setSelectedCase(updated);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to approve roadmap");
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase || !newNoteText.trim()) return;

        setIsAddingNote(true);
        try {
            const updated = await caseService.addCaseNote(selectedCase._id, newNoteText.trim());
            toast.success("Case note added successfully");
            setNewNoteText("");
            setSelectedCase(updated);
            fetchCases(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add note");
        } finally {
            setIsAddingNote(false);
        }
    };

    const filteredCases = cases.filter(c => 
        (c.title || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.lawyer?.fullName || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.category || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.court || "").toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
        (c.filingNumber || "").toLowerCase().includes(caseSearchQuery.toLowerCase())
    );

    const getPriorityBadge = (priority?: string) => {
        switch (priority) {
            case 'urgent':
                return <Badge className="bg-red-50 text-red-700 border border-red-200 uppercase text-[9px] font-bold">Urgent</Badge>;
            case 'high':
                return <Badge className="bg-orange-50 text-orange-700 border border-orange-200 uppercase text-[9px] font-bold">High Priority</Badge>;
            case 'low':
                return <Badge className="bg-slate-50 text-slate-600 border border-slate-200 uppercase text-[9px] font-bold">Low Priority</Badge>;
            default:
                return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 uppercase text-[9px] font-bold">Normal</Badge>;
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <Scale className="h-8 w-8 text-primary" />
                            Case Management
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Manage your legal cases, court proceedings, case documents, procedural roadmaps, and hearing dates.
                        </p>
                    </div>
                    {!showNewCaseFlow && (
                        <Button 
                            onClick={() => {
                                setShowNewCaseFlow(true);
                                setSelectedCase(null);
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold px-6 py-5 shadow-sm flex items-center gap-2 transition-all duration-200"
                        >
                            <Plus size={18} />
                            <span>Register New Case</span>
                        </Button>
                    )}
                </div>

                {showNewCaseFlow ? (
                    /* REGISTER NEW LEGAL CASE FORM */
                    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <button 
                                onClick={() => setShowNewCaseFlow(false)}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Cancel & Return to Cases
                            </button>
                            <div className="flex items-center gap-2">
                                <Scale className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-black text-slate-900">Register New Legal Case</h2>
                            </div>
                        </div>

                        <form onSubmit={handleCreateCaseSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Case Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Case Title / Legal Matter Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input 
                                        required
                                        placeholder="e.g. Commercial Contract Breach - TechCorp vs Horizon Media"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="rounded-xl border-slate-200 h-11 text-sm font-semibold"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Practice Area / Category
                                    </Label>
                                    <select
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {legalCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Court / Forum */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Court / Forum / Jurisdiction
                                    </Label>
                                    <select
                                        value={newCourt}
                                        onChange={(e) => setNewCourt(e.target.value)}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {courtForums.map(court => (
                                            <option key={court} value={court}>{court}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filing Reference / Case Number */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Case Filing Ref / Docket No. (Optional)
                                    </Label>
                                    <Input 
                                        placeholder="e.g. CS(COMM) 204/2026 or leave blank to auto-generate"
                                        value={newFilingNumber}
                                        onChange={(e) => setNewFilingNumber(e.target.value)}
                                        className="rounded-xl border-slate-200 h-11 text-sm font-semibold"
                                    />
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Case Priority Level
                                    </Label>
                                    <select
                                        value={newPriority}
                                        onChange={(e) => setNewPriority(e.target.value as any)}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium / Normal</option>
                                        <option value="high">High Priority</option>
                                        <option value="urgent">Urgent Matter</option>
                                    </select>
                                </div>

                                {/* Initial Hearing / Next Date */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Next Court Hearing / Deadline (Optional)
                                    </Label>
                                    <Input 
                                        type="date"
                                        value={newNextHearingDate}
                                        onChange={(e) => setNewNextHearingDate(e.target.value)}
                                        className="rounded-xl border-slate-200 h-11 text-sm font-semibold"
                                    />
                                </div>

                                {/* Assign Lawyer */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Assign Legal Counsel (Optional)
                                    </Label>
                                    <select
                                        value={newLawyerId}
                                        onChange={(e) => setNewLawyerId(e.target.value)}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">Self-Managed / Retain Advocate Later</option>
                                        {lawyers.map(l => (
                                            <option key={l._id} value={l._id}>
                                                Adv. {l.fullName} ({l.expertise || "Specialist"})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estimated Fee / Retainer */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Estimated Legal Retainer / Total Fee (₹) (Optional)
                                    </Label>
                                    <Input 
                                        type="number"
                                        placeholder="e.g. 25000"
                                        value={newEstimatedFee}
                                        onChange={(e) => setNewEstimatedFee(e.target.value)}
                                        className="rounded-xl border-slate-200 h-11 text-sm font-semibold"
                                    />
                                </div>

                                {/* Case Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                                        Case Description, Facts & Relief Sought <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea 
                                        required
                                        rows={4}
                                        placeholder="Describe the essential background facts, opposing party details, contracts involved, and the specific legal relief or action required..."
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="rounded-xl border-slate-200 text-sm font-medium resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNewCaseFlow(false)}
                                    className="rounded-xl font-bold px-6 h-11 border-slate-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmittingNewCase}
                                    className="bg-primary text-white hover:bg-primary/95 rounded-xl font-bold px-8 h-11 shadow-sm flex items-center gap-2"
                                >
                                    {isSubmittingNewCase ? "Registering Case..." : "Register Legal Case"}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* CASES LIST & DETAIL VIEWS */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Column: Case List (4 Cols) */}
                        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="font-extrabold text-slate-900 text-lg">My Legal Cases</h3>
                                <Badge className="bg-secondary text-primary hover:bg-secondary text-[10px] font-black border-none px-2 py-0.5 rounded">
                                    {cases.length} Total
                                </Badge>
                            </div>

                            {/* Search bar inside sidebar */}
                            {cases.length > 0 && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input 
                                        className="pl-9 h-10 text-xs rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary font-semibold"
                                        placeholder="Search cases, court, or filing ref..."
                                        value={caseSearchQuery}
                                        onChange={(e) => setCaseSearchQuery(e.target.value)}
                                    />
                                </div>
                            )}

                            {loading && cases.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2 text-xs text-slate-400 font-bold">Loading cases...</p>
                                </div>
                            ) : cases.length === 0 ? (
                                <div className="py-16 text-center text-slate-400 border border-dashed border-border rounded-2xl bg-slate-50/50 p-6">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary mb-4 border border-border shadow-sm">
                                        <Briefcase size={24} />
                                    </div>
                                    <p className="font-extrabold text-slate-900 text-base">No active legal cases</p>
                                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto mt-2 leading-relaxed font-semibold">
                                        Register a legal case to track proceedings, documents, roadmaps, and hearing dates.
                                    </p>
                                    <Button
                                        onClick={() => setShowNewCaseFlow(true)}
                                        className="mt-5 bg-primary text-white rounded-xl font-bold text-xs h-10 px-6 shadow-sm"
                                    >
                                        + Register First Case
                                    </Button>
                                </div>
                            ) : filteredCases.length === 0 ? (
                                <div className="py-12 text-center text-slate-450">
                                    <Briefcase size={28} className="mx-auto mb-2 text-slate-300" />
                                    <p className="font-bold text-sm text-slate-500">No matching cases</p>
                                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                                    {filteredCases.map((c) => (
                                        <div
                                            key={c._id}
                                            onClick={() => setSelectedCase(c)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                selectedCase?._id === c._id
                                                    ? "border-primary bg-secondary/30 shadow-sm"
                                                    : "border-border bg-card hover:border-slate-300 hover:shadow-sm"
                                            }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug truncate">{c.title}</h4>
                                                    {getPriorityBadge(c.priority)}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                                    <span className="truncate">{c.category || "General Legal"}</span>
                                                    {c.court && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate text-slate-400">{c.court}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-1">
                                                    <span className="text-[10px] font-mono font-bold text-slate-400">
                                                        {c.filingNumber || `CAS-${c._id.slice(-6).toUpperCase()}`}
                                                    </span>
                                                    <Badge 
                                                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-none shadow-none ${
                                                            c.status === 'pending_lawyer' 
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                            : c.status === 'pending_payment' 
                                                                ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                                                                : c.status === 'completed'
                                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                                    : 'bg-secondary text-primary border border-primary/20'
                                                        }`}
                                                    >
                                                        {c.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                            
                                            {/* Progress bar */}
                                            <div className="mt-3 pt-2.5 border-t border-slate-50">
                                                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                    <span>Roadmap Progress</span>
                                                    <span className="text-primary">{c.currentProgress || 0}%</span>
                                                </div>
                                                <Progress value={c.currentProgress || 0} className="h-1.5 bg-slate-100 [&>div]:bg-primary" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Case Details (8 Cols) */}
                        <div className="lg:col-span-8">
                            {selectedCase ? (
                                <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                                    <CardContent className="p-6 md:p-8 space-y-6">
                                        
                                        {/* Case Header Banner */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30">
                                                        {selectedCase.category || "General Legal"}
                                                    </Badge>
                                                    {getPriorityBadge(selectedCase.priority)}
                                                    <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                                        Ref: {selectedCase.filingNumber || `CAS-${selectedCase._id.slice(-6).toUpperCase()}`}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                                                    {selectedCase.title}
                                                </h2>
                                                {selectedCase.court && (
                                                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                                                        <Building size={14} className="text-slate-400" />
                                                        {selectedCase.court}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-row items-center gap-6 shrink-0 bg-slate-50 border border-slate-150/60 rounded-2xl px-6 py-4">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Case Status</p>
                                                    <Badge 
                                                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border-none shadow-none mt-1 ${
                                                            selectedCase.status === 'pending_lawyer' 
                                                            ? 'bg-amber-100 text-amber-800' 
                                                            : selectedCase.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-secondary text-primary'
                                                        }`}
                                                    >
                                                        {selectedCase.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contract Fee</p>
                                                    <p className="text-sm font-black text-primary mt-1">
                                                        {selectedCase.totalFee ? `₹${selectedCase.totalFee.toLocaleString()}` : 'Self-Managed'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assigned Counsel Card */}
                                        <div className="bg-slate-50/70 border border-border p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 rounded-xl border border-primary/20 shrink-0">
                                                    <AvatarImage 
                                                        src={selectedCase.lawyer?.avatar ? (selectedCase.lawyer.avatar.startsWith('http') ? selectedCase.lawyer.avatar : (selectedCase.lawyer.avatar.startsWith('/') ? `/lawyer${selectedCase.lawyer.avatar}` : `/lawyer/${selectedCase.lawyer.avatar}`)) : ""} 
                                                        alt={selectedCase.lawyer?.fullName || "Lawyer"} 
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="rounded-xl bg-secondary text-primary">
                                                        <User className="h-6 w-6 text-primary/80" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-extrabold text-slate-900 text-sm">
                                                            {selectedCase.lawyer ? `Adv. ${selectedCase.lawyer.fullName}` : "No Advocate Assigned"}
                                                        </h4>
                                                        {selectedCase.lawyer && (
                                                            <span className="text-[9px] font-bold text-primary bg-secondary px-1.5 py-0.5 rounded border border-border uppercase tracking-wider">
                                                                ASSIGNED COUNSEL
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                                        {selectedCase.lawyer ? `${selectedCase.lawyer.expertise || "Legal Specialist"} • ${selectedCase.lawyer.location || "Verified"}` : "This legal case is currently being self-managed."}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedCase.lawyer && (
                                                <Button 
                                                    variant="outline" 
                                                    className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-100 h-9 px-4 gap-1.5"
                                                    onClick={() => navigate(`/lawyers/${selectedCase.lawyer?._id}`)}
                                                >
                                                    <span>View Counsel Profile</span>
                                                    <ExternalLink size={12} />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Tab Navigation */}
                                        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
                                            <button
                                                onClick={() => setActiveTab('overview')}
                                                className={`px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
                                                    activeTab === 'overview' 
                                                    ? 'bg-primary text-white shadow-sm' 
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <FileText size={14} />
                                                <span>Case Overview</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('roadmap')}
                                                className={`px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
                                                    activeTab === 'roadmap' 
                                                    ? 'bg-primary text-white shadow-sm' 
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <Briefcase size={14} />
                                                <span>Procedural Roadmap</span>
                                                {selectedCase.milestones && selectedCase.milestones.length > 0 && (
                                                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                                                        {selectedCase.milestones.length}
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('hearings')}
                                                className={`px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
                                                    activeTab === 'hearings' 
                                                    ? 'bg-primary text-white shadow-sm' 
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <Calendar size={14} />
                                                <span>Hearings & Dates</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('documents')}
                                                className={`px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
                                                    activeTab === 'documents' 
                                                    ? 'bg-primary text-white shadow-sm' 
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <Folder size={14} />
                                                <span>Case Documents</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('notes')}
                                                className={`px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
                                                    activeTab === 'notes' 
                                                    ? 'bg-primary text-white shadow-sm' 
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <MessageSquare size={14} />
                                                <span>Case Notes</span>
                                                {selectedCase.notes && selectedCase.notes.length > 0 && (
                                                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                                                        {selectedCase.notes.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {/* TAB CONTENT */}

                                        {/* 1. OVERVIEW */}
                                        {activeTab === 'overview' && (
                                            <div className="space-y-6 animate-in fade-in duration-200">
                                                <div className="space-y-2">
                                                    <h4 className="font-bold text-slate-900 text-sm">Case Facts & Scope of Matter</h4>
                                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 rounded-xl p-5 whitespace-pre-line">
                                                        {selectedCase.description}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-slate-50 border border-border p-4 rounded-xl space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filing / Docket Ref</span>
                                                        <p className="text-xs font-bold text-slate-800 font-mono">
                                                            {selectedCase.filingNumber || `CAS-${selectedCase._id.slice(-6).toUpperCase()}`}
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-50 border border-border p-4 rounded-xl space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jurisdiction & Forum</span>
                                                        <p className="text-xs font-bold text-slate-800">
                                                            {selectedCase.court || "Out of Court / General"}
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-50 border border-border p-4 rounded-xl space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration Date</span>
                                                        <p className="text-xs font-bold text-slate-800">
                                                            {new Date(selectedCase.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. PROCEDURAL ROADMAP */}
                                        {activeTab === 'roadmap' && (
                                            <div className="space-y-6 animate-in fade-in duration-200">
                                                {/* Progress Indicator */}
                                                <div className="bg-slate-50 border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Procedural Progress</p>
                                                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">{selectedCase.currentProgress || 0}% Complete</h3>
                                                    </div>
                                                    <div className="flex-1 max-w-md bg-slate-200 rounded-full h-3 overflow-hidden">
                                                        <div 
                                                            className="bg-primary h-3 rounded-full transition-all duration-700" 
                                                            style={{ width: `${selectedCase.currentProgress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {!selectedCase.planSubmitted ? (
                                                    <div className="bg-slate-50 border border-dashed border-border rounded-2xl p-8 text-center space-y-3">
                                                        <Briefcase size={36} className="text-slate-350 mx-auto" />
                                                        <div className="space-y-1">
                                                            <h4 className="font-bold text-slate-900 text-sm">Action Roadmap in Preparation</h4>
                                                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                                                                {selectedCase.lawyer 
                                                                    ? `Advocate ${selectedCase.lawyer.fullName} will define the step-by-step procedural stages, hearings, and verification milestones for this case.`
                                                                    : "No advocate is currently assigned to this case. Once an advocate is retained, they can propose a formal procedural roadmap."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : !selectedCase.planApproved ? (
                                                    /* ROADMAP REQUIRES CLIENT APPROVAL */
                                                    <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 space-y-6">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 mt-1 shrink-0">
                                                                <AlertTriangle size={20} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className="font-bold text-amber-900 text-sm">Review & Approve Case Action Plan</h4>
                                                                <p className="text-xs text-amber-700 leading-relaxed">
                                                                    Your lawyer has proposed the following milestone breakdown. Review the tasks, progress contributions, and payouts. If they align with your expectations, click **Approve Action Plan** to initiate the legal engagement.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Proposed milestones preview */}
                                                        <div className="space-y-3">
                                                            {selectedCase.milestones.map((m, idx) => (
                                                                <div key={idx} className="bg-white border border-amber-150 p-4 rounded-xl flex justify-between items-center gap-4 shadow-sm">
                                                                    <div>
                                                                        <h5 className="font-bold text-slate-900 text-xs">{idx + 1}. {m.title}</h5>
                                                                        <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
                                                                    </div>
                                                                    <div className="text-right shrink-0">
                                                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">+{m.progressIncrement}% Progress</span>
                                                                        <p className="text-xs font-black text-slate-900 mt-1">₹{m.payoutAmount.toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-end pt-3">
                                                            <Button 
                                                                onClick={handleApprovePlan}
                                                                className="bg-primary hover:bg-primary/90 text-white font-extrabold rounded-xl px-6 py-2 shadow-sm"
                                                            >
                                                                Approve Action Plan
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ACTIVE ROADMAP STEPPER */
                                                    <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 ml-3 py-2">
                                                        {selectedCase.milestones.map((m, idx) => {
                                                            const isCompleted = m.status === 'completed';
                                                            const isInProgress = m.status === 'in_progress';
                                                            
                                                            return (
                                                                <div key={idx} className="relative">
                                                                    {/* Dot */}
                                                                    <div className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white ${
                                                                        isCompleted 
                                                                            ? "bg-green-500 shadow-md ring-4 ring-green-100" 
                                                                            : isInProgress 
                                                                                ? "bg-primary animate-pulse ring-4 ring-violet-100" 
                                                                                : "bg-slate-300"
                                                                    }`} />

                                                                    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition-all duration-200">
                                                                        <div className="flex justify-between items-center gap-4">
                                                                            <div>
                                                                                <span className="font-mono text-[9px] font-black text-slate-400">STAGE {idx + 1} ({m.progressIncrement}%)</span>
                                                                                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{m.title}</h4>
                                                                            </div>
                                                                            <Badge className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-none shadow-none ${
                                                                                isCompleted 
                                                                                ? "bg-green-50 text-green-700 hover:bg-green-50" 
                                                                                : isInProgress 
                                                                                    ? "bg-secondary text-primary hover:bg-secondary" 
                                                                                    : "bg-slate-50 text-slate-400 hover:bg-slate-50"
                                                                            }`}>
                                                                                {m.status.replace('_', ' ')}
                                                                            </Badge>
                                                                        </div>

                                                                        <p className="text-slate-500 text-xs leading-relaxed">{m.description}</p>

                                                                        {/* Proof of Work and verification documents */}
                                                                        {m.proofDocs && m.proofDocs.length > 0 && (
                                                                            <div className="border-t border-border pt-3 mt-2 space-y-2">
                                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Work Verification & Filings</span>
                                                                                <div className="space-y-2">
                                                                                    {m.proofDocs.map((doc, dIdx) => (
                                                                                        <div key={dIdx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                                                                                            <a 
                                                                                                href={`/lawyer${doc.url}`}
                                                                                                target="_blank"
                                                                                                rel="noreferrer"
                                                                                                className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1.5"
                                                                                            >
                                                                                                <FileText size={13} />
                                                                                                <span>{doc.name}</span>
                                                                                                <ExternalLink size={10} />
                                                                                            </a>
                                                                                            <span className="text-[10px] text-slate-400">
                                                                                                {new Date(doc.uploadedAt).toLocaleDateString()}
                                                                                            </span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 3. CASE HEARINGS & DATES */}
                                        {activeTab === 'hearings' && (
                                            <div className="space-y-6 animate-in fade-in duration-200">
                                                <div className="bg-slate-50 border border-border p-6 rounded-2xl space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                                            <Calendar size={16} className="text-primary" />
                                                            Upcoming Hearing & Court Deadlines
                                                        </h4>
                                                    </div>

                                                    {selectedCase.nextHearingDate ? (
                                                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                                                            <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0">
                                                                <span className="text-[10px] font-bold uppercase leading-none">
                                                                    {new Date(selectedCase.nextHearingDate).toLocaleDateString('en-US', { month: 'short' })}
                                                                </span>
                                                                <span className="text-xl font-black mt-0.5 leading-none">
                                                                    {new Date(selectedCase.nextHearingDate).getDate()}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h5 className="font-bold text-slate-900 text-sm">Scheduled Court Proceeding</h5>
                                                                <p className="text-xs text-slate-500 font-semibold">
                                                                    Forum: {selectedCase.court || "Designated Court Bench"}
                                                                </p>
                                                                <p className="text-[11px] text-primary font-bold">
                                                                    {new Date(selectedCase.nextHearingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8 text-slate-400">
                                                            <Calendar size={32} className="mx-auto mb-2 text-slate-300" />
                                                            <p className="text-xs font-bold">No specific hearing date listed currently.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. DOCUMENTS & EVIDENCE */}
                                        {activeTab === 'documents' && (
                                            <div className="space-y-6 animate-in fade-in duration-200">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-bold text-slate-900 text-sm">Case Filings, Evidence & Proof Documents</h4>
                                                    </div>

                                                    {/* Aggregate proofDocs from milestones */}
                                                    {(() => {
                                                        const allDocs: any[] = [];
                                                        if (selectedCase.milestones) {
                                                            selectedCase.milestones.forEach((m, idx) => {
                                                                if (m.proofDocs) {
                                                                    m.proofDocs.forEach(d => {
                                                                        allDocs.push({ ...d, stage: `Stage ${idx + 1}: ${m.title}` });
                                                                    });
                                                                }
                                                            });
                                                        }

                                                        if (allDocs.length === 0) {
                                                            return (
                                                                <div className="border border-dashed border-border rounded-2xl p-8 text-center text-slate-400 space-y-2">
                                                                    <Folder size={32} className="mx-auto text-slate-300" />
                                                                    <p className="text-xs font-bold">No case documents or evidence filings uploaded yet.</p>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {allDocs.map((d, dIdx) => (
                                                                    <div key={dIdx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/50 transition-all flex items-start justify-between gap-3 shadow-sm">
                                                                        <div className="space-y-1 min-w-0">
                                                                            <h5 className="font-bold text-slate-900 text-xs truncate">{d.name}</h5>
                                                                            <p className="text-[10px] text-slate-400">{d.stage}</p>
                                                                            <p className="text-[9px] text-slate-400">Uploaded {new Date(d.uploadedAt).toLocaleDateString()}</p>
                                                                        </div>
                                                                        <a
                                                                            href={`/lawyer${d.url}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="p-2 rounded-lg bg-secondary text-primary hover:bg-primary hover:text-white transition-all shrink-0"
                                                                        >
                                                                            <Download size={14} />
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. CASE NOTES */}
                                        {activeTab === 'notes' && (
                                            <div className="space-y-6 animate-in fade-in duration-200">
                                                {/* Add Note Form */}
                                                <form onSubmit={handleAddNote} className="space-y-3">
                                                    <Label className="font-bold text-xs text-slate-700">Add Case Note or Progress Update</Label>
                                                    <div className="flex gap-3">
                                                        <Textarea 
                                                            rows={2}
                                                            placeholder="Add confidential notes, hearing updates, or key action items for this case..."
                                                            value={newNoteText}
                                                            onChange={(e) => setNewNoteText(e.target.value)}
                                                            className="rounded-xl text-xs font-medium resize-none border-slate-200"
                                                        />
                                                        <Button
                                                            type="submit"
                                                            disabled={isAddingNote || !newNoteText.trim()}
                                                            className="h-auto bg-primary text-white rounded-xl px-5 font-bold text-xs shrink-0 flex items-center gap-1.5"
                                                        >
                                                            <Send size={13} />
                                                            <span>Save Note</span>
                                                        </Button>
                                                    </div>
                                                </form>

                                                <Separator />

                                                {/* Notes List */}
                                                <div className="space-y-3">
                                                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Historical Case Notes</h5>
                                                    {selectedCase.notes && selectedCase.notes.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {selectedCase.notes.map((note, nIdx) => (
                                                                <div key={nIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                                                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                                                                        <span>{note.createdBy || "Client"}</span>
                                                                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                                                        {note.text}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic">No notes recorded yet for this case.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    {/* Stats grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Cases</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                                    <Briefcase size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-slate-900">{cases.filter(c => c.status === 'active').length}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">In Progress</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                                    <Clock size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-slate-900">
                                                    {cases.filter(c => c.status === 'pending_lawyer' || c.status === 'pending_payment').length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-slate-900">{cases.filter(c => c.status === 'completed').length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Select a Case Hero Panel */}
                                    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
                                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto text-primary border border-border shadow-sm">
                                            <Scale size={32} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Select a Case from the Sidebar</h3>
                                            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed font-semibold">
                                                Choose one of your registered legal cases on the left to review court proceedings, milestone roadmaps, case filings, hearing schedules, and case notes.
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-lg mx-auto">
                                            <div className="flex items-start gap-3">
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-primary font-black text-[10px] shrink-0 border border-border shadow-sm">01</span>
                                                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                                                    Review case facts, jurisdiction, and assigned counsel contact details.
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-primary font-black text-[10px] shrink-0 border border-border shadow-sm">02</span>
                                                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                                                    Follow step-by-step procedural stages and approve lawyer roadmap milestones.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
