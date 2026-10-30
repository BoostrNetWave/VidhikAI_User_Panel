import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Briefcase, 
    Search, 
    Sparkles, 
    Check, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Download, 
    ShieldCheck, 
    User, 
    ChevronRight,
    X,
    Filter,
    AlertCircle
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { getFileUrl } from '@/lib/fileUtils';

interface AdminCasesProps {
    cases: any[];
    onRefresh?: () => void;
}

export function AdminCases({ cases = [], onRefresh }: AdminCasesProps) {
    const [selectedCase, setSelectedCase] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [lawyersList, setLawyersList] = useState<any[]>([]);
    
    // Admin Recommendation states
    const [recommendedLawyerId, setRecommendedLawyerId] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [isSavingRecommendation, setIsSavingRecommendation] = useState(false);

    // Fetch verified lawyers list for recommendations
    useEffect(() => {
        const fetchLawyers = async () => {
            try {
                const users = await adminService.getAllUsers();
                const lawyers = users.filter((u: any) => u.role === 'lawyer' || u.role === 'advocate' || u.title || u.expertise);
                setLawyersList(lawyers);
            } catch (err) {
                console.warn('Failed to fetch lawyers for recommendation dropdown', err);
            }
        };
        fetchLawyers();
    }, []);

    // Sync selected case with updated cases prop
    useEffect(() => {
        if (selectedCase) {
            const updated = cases.find(c => c._id === selectedCase._id);
            if (updated) {
                setSelectedCase(updated);
                setRecommendedLawyerId(updated.adminRecommendedLawyer?._id || updated.adminRecommendedLawyer || '');
                setAdminNote(updated.adminRecommendationNote || '');
            }
        } else if (cases.length > 0) {
            setSelectedCase(cases[0]);
            setRecommendedLawyerId(cases[0].adminRecommendedLawyer?._id || cases[0].adminRecommendedLawyer || '');
            setAdminNote(cases[0].adminRecommendationNote || '');
        }
    }, [cases]);

    const handleSelectCase = (c: any) => {
        setSelectedCase(c);
        setRecommendedLawyerId(c.adminRecommendedLawyer?._id || c.adminRecommendedLawyer || '');
        setAdminNote(c.adminRecommendationNote || '');
    };

    const handleSaveAdminRecommendation = async () => {
        if (!selectedCase) return;
        if (!recommendedLawyerId) {
            toast.error('Please select a lawyer to recommend.');
            return;
        }

        setIsSavingRecommendation(true);
        try {
            const res = await adminService.recommendLawyer(selectedCase._id, recommendedLawyerId, adminNote);
            toast.success('Admin recommendation saved! Client will see the verified recommendation.');
            if (res?.kase) {
                setSelectedCase(res.kase);
                setRecommendedLawyerId(res.kase.adminRecommendedLawyer?._id || res.kase.adminRecommendedLawyer || '');
                setAdminNote(res.kase.adminRecommendationNote || '');
            }
            if (onRefresh) onRefresh();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save recommendation');
        } finally {
            setIsSavingRecommendation(false);
        }
    };

    const handleApprovePayout = async (caseId: string, milestoneIndex: number) => {
        try {
            await adminService.approvePayout(caseId, milestoneIndex);
            toast.success('Milestone payout approved and released to advocate!');
            if (onRefresh) onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to approve payout');
        }
    };

    const handleRejectPayout = async (caseId: string, milestoneIndex: number) => {
        try {
            await adminService.rejectPayout(caseId, milestoneIndex);
            toast.info('Milestone payout request rejected.');
            if (onRefresh) onRefresh();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reject payout');
        }
    };

    const filteredCases = cases.filter(c => {
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesQuery = 
            (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.client?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.lawyer?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesQuery;
    });

    const statusCounts = {
        all: cases.length,
        open: cases.filter(c => c.status === 'open').length,
        pending_lawyer: cases.filter(c => c.status === 'pending_lawyer').length,
        pending_payment: cases.filter(c => c.status === 'pending_payment').length,
        active: cases.filter(c => c.status === 'active').length,
        completed: cases.filter(c => c.status === 'completed').length,
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            {/* Top Overview & KPI Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-extrabold text-foreground tracking-tight">Case Management & Marketplace Control</h3>
                    <p className="text-sm text-muted-foreground">
                        Supervise live case briefs, audit AI summaries, review interested advocate applications, and suggest recommendations.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onRefresh && onRefresh()}
                        className="rounded-xl text-xs font-bold"
                    >
                        ↻ Refresh Cases
                    </Button>
                </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {[
                        { id: 'all', label: 'All Cases', count: statusCounts.all },
                        { id: 'open', label: 'Open Marketplace', count: statusCounts.open },
                        { id: 'pending_lawyer', label: 'Pending Lawyer', count: statusCounts.pending_lawyer },
                        { id: 'pending_payment', label: 'Pending Payment', count: statusCounts.pending_payment },
                        { id: 'active', label: 'Active', count: statusCounts.active },
                        { id: 'completed', label: 'Completed', count: statusCounts.completed }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                                statusFilter === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'bg-muted/40 text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative sm:w-72 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cases, clients, advocates..."
                        className="pl-9 h-9 text-xs rounded-xl font-semibold bg-muted/20"
                    />
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Cases List (5 Cols) */}
                <Card className="lg:col-span-5 border-border shadow-xs">
                    <CardHeader className="p-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span>Cases Queue ({filteredCases.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        {filteredCases.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground text-xs font-semibold">
                                No cases found for the selected filter.
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                                {filteredCases.map(c => {
                                    const isSelected = selectedCase?._id === c._id;
                                    const appliedCount = c.interestedLawyers?.length || 0;

                                    return (
                                        <div
                                            key={c._id}
                                            onClick={() => handleSelectCase(c)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                                                isSelected 
                                                    ? 'border-primary bg-primary/5 shadow-xs' 
                                                    : 'border-border/60 hover:border-slate-300 bg-card'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                <h4 className="font-extrabold text-foreground text-xs leading-snug line-clamp-1">
                                                    {c.title}
                                                </h4>
                                                <Badge className={`text-[9px] font-black uppercase px-2 py-0.2 shrink-0 border-none ${
                                                    c.status === 'open' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : c.status === 'pending_lawyer'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : c.status === 'pending_payment'
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : c.status === 'active'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                    {c.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                                                <span>Client: <strong className="text-foreground">{c.client?.fullName || 'Client'}</strong></span>
                                                <span className="font-mono text-primary font-bold">₹{(c.totalFee || c.budget || 0).toLocaleString()}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                                                <span>{c.category || 'General Legal'}</span>
                                                <span className="font-bold text-slate-700">
                                                    {c.status === 'open' ? `${appliedCount} Advocates Applied` : (c.lawyer?.fullName ? `Adv. ${c.lawyer.fullName}` : 'Unassigned')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right Side: Case Control & Recommendation Detail (7 Cols) */}
                <div className="lg:col-span-7">
                    {selectedCase ? (
                        <div className="space-y-6">
                            <Card className="border-border shadow-xs overflow-hidden">
                                <CardHeader className="bg-muted/20 border-b border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold">
                                                {selectedCase.category || 'General Legal'}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono">ID: {selectedCase._id}</span>
                                        </div>
                                        <h3 className="text-lg font-extrabold text-foreground tracking-tight leading-snug">
                                            {selectedCase.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Client: <strong className="text-foreground">{selectedCase.client?.fullName}</strong> ({selectedCase.client?.email})
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Case Fee</span>
                                        <span className="text-xl font-black text-primary">
                                            ₹{(selectedCase.totalFee || selectedCase.budget || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {/* AI CASE SUMMARY AUDIT */}
                                    {selectedCase.aiSummary && (() => {
                                        const isNonLegal = selectedCase.isLegalDocument === false || 
                                            selectedCase.aiSummary.startsWith('⚠️') || 
                                            selectedCase.aiSummary.includes('Non-Legal Document Detected');

                                        return (
                                            <div className={`border rounded-2xl p-5 space-y-3 ${
                                                isNonLegal 
                                                    ? 'bg-amber-50/90 border-amber-300' 
                                                    : 'bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border-primary/20'
                                            }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {isNonLegal ? <AlertCircle className="w-4 h-4 text-amber-600" /> : <Sparkles className="w-4 h-4 text-primary" />}
                                                        <span className={`text-xs font-extrabold ${isNonLegal ? 'text-amber-950' : 'text-foreground'}`}>
                                                            {isNonLegal ? '⚠️ Non-Legal Document Detected' : 'AI Legal Brief & Issue Summary'}
                                                        </span>
                                                    </div>
                                                    <Badge className={`border-none text-[9px] font-bold ${
                                                        isNonLegal ? 'bg-amber-100 text-amber-800' : 'bg-primary/10 text-primary'
                                                    }`}>
                                                        {isNonLegal ? 'Validation Alert' : 'Platform AI'}
                                                    </Badge>
                                                </div>

                                                <p className={`text-xs leading-relaxed font-medium border rounded-xl p-3 ${
                                                    isNonLegal ? 'text-amber-950 bg-amber-100/50 border-amber-200' : 'text-slate-700 bg-white/80 border-slate-150'
                                                }`}>
                                                    {selectedCase.aiSummary}
                                                </p>

                                                {selectedCase.aiKeyFacts && selectedCase.aiKeyFacts.length > 0 && (
                                                    <div className="space-y-1.5 pt-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                            {isNonLegal ? 'Validation Findings' : 'Identified Key Claims & Facts'}
                                                        </span>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                            {selectedCase.aiKeyFacts.map((fact: string, idx: number) => (
                                                                <div key={idx} className={`border rounded-lg p-2 text-xs font-semibold flex items-start gap-1.5 ${
                                                                    isNonLegal ? 'bg-amber-100/50 border-amber-200 text-amber-900' : 'bg-white/90 border-slate-150 text-slate-800'
                                                                }`}>
                                                                    {isNonLegal ? <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> : <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />}
                                                                    <span>{fact}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* ATTACHED DOCUMENTS */}
                                    {selectedCase.documents && selectedCase.documents.length > 0 && (
                                        <div className="space-y-2.5">
                                            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                <FileText className="w-4 h-4 text-primary" />
                                                Client Case Documentation ({selectedCase.documents.length})
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {selectedCase.documents.map((doc: any, idx: number) => (
                                                    <a 
                                                        key={idx}
                                                        href={getFileUrl(doc.url)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="bg-muted/30 hover:bg-muted/60 border border-border rounded-xl p-2.5 flex items-center justify-between text-xs font-bold transition-all"
                                                    >
                                                        <span className="truncate max-w-[200px]">{doc.name}</span>
                                                        <Download className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ADMIN RECOMMENDATION CONTROL PANEL */}
                                    <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-amber-700" />
                                                <h4 className="font-extrabold text-amber-950 text-sm">Admin Advocate Recommendation Control</h4>
                                            </div>
                                            {selectedCase.adminRecommendedLawyer && (
                                                <Badge className="bg-amber-600 text-white text-[9px] font-black uppercase">
                                                    Currently Recommended: {selectedCase.adminRecommendedLawyer?.fullName}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-xs text-amber-900 font-medium leading-relaxed">
                                            The Admin team can recommend the most qualified advocate for this case. The client will see your recommendation highlighted with the verified Admin Recommendation badge.
                                        </p>

                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Select Advocate</label>
                                                <select
                                                    value={recommendedLawyerId}
                                                    onChange={(e) => setRecommendedLawyerId(e.target.value)}
                                                    className="w-full h-10 rounded-xl border border-amber-300 bg-white px-3 text-xs font-bold text-slate-900 focus-visible:outline-none"
                                                >
                                                    <option value="">-- Choose verified advocate to recommend --</option>
                                                    {lawyersList.map((lawyer) => (
                                                        <option key={lawyer._id} value={lawyer._id}>
                                                            Adv. {lawyer.fullName} ({lawyer.expertise || 'General'} • {lawyer.location || 'India'})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Recommendation Rationale / Note</label>
                                                <Input
                                                    value={adminNote}
                                                    onChange={(e) => setAdminNote(e.target.value)}
                                                    placeholder="e.g. Verified Senior Advocate with 15+ years experience and 90%+ success rate in High Court disputes."
                                                    className="h-10 rounded-xl text-xs bg-white border-amber-300 font-medium"
                                                />
                                            </div>

                                            <div className="flex justify-end pt-1">
                                                <Button
                                                    disabled={isSavingRecommendation || !recommendedLawyerId}
                                                    onClick={handleSaveAdminRecommendation}
                                                    className="rounded-xl font-bold text-xs h-9 px-5 bg-amber-700 hover:bg-amber-800 text-white"
                                                >
                                                    {isSavingRecommendation ? 'Saving...' : 'Set Admin Recommendation'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INTERESTED ADVOCATES AUDIT */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center justify-between">
                                            <span>Advocate Applications ({selectedCase.interestedLawyers?.length || 0})</span>
                                        </h4>

                                        {(!selectedCase.interestedLawyers || selectedCase.interestedLawyers.length === 0) ? (
                                            <div className="p-4 bg-muted/20 border border-border rounded-xl text-center text-xs text-muted-foreground font-semibold">
                                                No advocates have applied yet.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedCase.interestedLawyers.map((item: any, idx: number) => {
                                                    const lawyer = item.lawyer;
                                                    if (!lawyer) return null;
                                                    const isAiRec = selectedCase.aiRecommendedLawyer?._id === lawyer._id;
                                                    const isAdminRec = selectedCase.adminRecommendedLawyer?._id === lawyer._id;

                                                    return (
                                                        <div key={idx} className="bg-muted/20 border border-border rounded-xl p-3 space-y-1.5 text-xs">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-extrabold text-foreground">Adv. {lawyer.fullName}</span>
                                                                    {isAiRec && <Badge className="bg-primary text-white text-[8px] font-black uppercase">⭐ AI Match</Badge>}
                                                                    {isAdminRec && <Badge className="bg-amber-600 text-white text-[8px] font-black uppercase">🛡️ Admin Rec</Badge>}
                                                                </div>
                                                                <span className="font-black text-foreground">₹{(item.proposedFee || selectedCase.totalFee).toLocaleString()}</span>
                                                            </div>
                                                            {item.proposalNote && (
                                                                <p className="text-[11px] text-muted-foreground font-medium">{item.proposalNote}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* MILESTONES & PAYOUTS ESCROW CONTROLS */}
                                    {selectedCase.milestones && selectedCase.milestones.length > 0 && (
                                        <div className="space-y-3 pt-2 border-t border-border">
                                            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                                                Milestones & Escrow Release
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedCase.milestones.map((m: any, mIdx: number) => (
                                                    <div key={mIdx} className="border border-border rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/10 text-xs">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-foreground">{mIdx + 1}. {m.title}</span>
                                                                <Badge className="text-[9px] font-bold uppercase">{m.status}</Badge>
                                                                <Badge className={`text-[9px] font-bold uppercase ${
                                                                    m.payoutStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : m.payoutStatus === 'requested' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                    Payout: {m.payoutStatus}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-[11px] text-muted-foreground mt-0.5">{m.description}</p>
                                                        </div>

                                                        {m.payoutStatus === 'requested' && (
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleApprovePayout(selectedCase._id, mIdx)}
                                                                    className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                                                >
                                                                    Release Payout
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleRejectPayout(selectedCase._id, mIdx)}
                                                                    className="h-8 rounded-lg border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold"
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="bg-muted/20 border border-border rounded-3xl p-16 text-center text-muted-foreground">
                            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/60 mb-2" />
                            <p className="font-bold text-sm">Select a case from the queue to view full audit details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
