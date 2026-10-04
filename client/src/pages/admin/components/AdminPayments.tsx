import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    DollarSign, 
    Video, 
    Briefcase, 
    Building2, 
    FileText, 
    AlertCircle,
    ArrowUpRight,
    Loader2,
    ShieldCheck,
    Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

interface AdminPaymentsProps {
    onRefreshOverview?: () => void;
}

export function AdminPayments({ onRefreshOverview }: AdminPaymentsProps) {
    const [activeTab, setActiveTab] = useState<'consultations' | 'cases'>('consultations');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        consultations: [],
        caseMilestones: [],
        summary: {}
    });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Selected item for payout approval modal
    const [selectedPayout, setSelectedPayout] = useState<{
        type: 'consultation' | 'milestone';
        item: any;
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchPayoutsData();
    }, []);

    const fetchPayoutsData = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllPayouts();
            setData(res);
        } catch (error) {
            console.error('Failed to load payouts data', error);
            toast.error('Failed to load payout data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePayout = async () => {
        if (!selectedPayout) return;
        setIsProcessing(true);
        try {
            if (selectedPayout.type === 'consultation') {
                await adminService.approveConsultationPayout(selectedPayout.item._id);
                toast.success(`Video consultation payout of ₹${selectedPayout.item.totalFee} approved & paid successfully!`);
            } else {
                await adminService.approvePayout(selectedPayout.item.caseId, selectedPayout.item.milestoneIndex);
                toast.success(`Case milestone payout of ₹${selectedPayout.item.payoutAmount} approved & paid successfully!`);
            }
            setSelectedPayout(null);
            await fetchPayoutsData();
            if (onRefreshOverview) onRefreshOverview();
        } catch (error) {
            toast.error('Failed to process payout approval');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRejectPayout = async (type: 'consultation' | 'milestone', item: any) => {
        try {
            if (type === 'consultation') {
                await adminService.rejectConsultationPayout(item._id);
                toast.info('Consultation payout request rejected');
            } else {
                await adminService.rejectPayout(item.caseId, item.milestoneIndex);
                toast.info('Milestone payout request rejected');
            }
            await fetchPayoutsData();
            if (onRefreshOverview) onRefreshOverview();
        } catch (error) {
            toast.error('Failed to reject payout');
        }
    };

    const summary = data.summary || {};

    // Filter consultations
    const filteredConsultations = (data.consultations || []).filter((c: any) => {
        const matchesSearch = 
            (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.lawyer?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.client?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesStatus = true;
        if (statusFilter === 'requested') matchesStatus = c.payoutStatus === 'requested';
        else if (statusFilter === 'approved') matchesStatus = c.payoutStatus === 'approved';
        else if (statusFilter === 'pending') matchesStatus = c.payoutStatus === 'pending' || !c.payoutStatus;
        else if (statusFilter === 'rejected') matchesStatus = c.payoutStatus === 'rejected';

        return matchesSearch && matchesStatus;
    });

    // Filter case milestones
    const filteredMilestones = (data.caseMilestones || []).filter((m: any) => {
        const matchesSearch = 
            (m.caseTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.milestoneTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.lawyer?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.client?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === 'requested') matchesStatus = m.payoutStatus === 'requested';
        else if (statusFilter === 'approved') matchesStatus = m.payoutStatus === 'approved';
        else if (statusFilter === 'pending') matchesStatus = m.payoutStatus === 'pending' || !m.payoutStatus;
        else if (statusFilter === 'rejected') matchesStatus = m.payoutStatus === 'rejected';

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string, isUserPaid?: boolean) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Paid
                    </Badge>
                );
            case 'requested':
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-1 gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> Payout Requested
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-500/10 text-red-600 border border-red-500/20 px-2.5 py-1 gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/20 px-2.5 py-1 gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Request
                    </Badge>
                );
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in-50">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">Financial Operations & Lawyer Payouts</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage dynamic lawyer payout settlements for Video Consultations and Phase-Wise Case Management.
                    </p>
                </div>
                <Button onClick={fetchPayoutsData} variant="outline" size="sm" className="w-fit">
                    Refresh Payout Data
                </Button>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border border-border/60 shadow-sm bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Platform Revenue</p>
                            <h4 className="text-2xl font-bold mt-1 text-foreground">
                                ₹{((summary.totalConsultationFee || 0) + (summary.approvedCasePayoutAmount || 0)).toLocaleString()}
                            </h4>
                            <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-0.5 mt-1">
                                <ArrowUpRight className="w-3 h-3" /> Live user bookings
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/60 shadow-sm bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending VDO Payouts</p>
                            <h4 className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                                ₹{(summary.pendingConsultationPayoutAmount || 0).toLocaleString()}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-1">
                                {summary.pendingConsultationPayoutCount || 0} active VDO payout requests
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Video className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/60 shadow-sm bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Pending Case Phase Payouts</p>
                            <h4 className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                                ₹{(summary.pendingCasePayoutAmount || 0).toLocaleString()}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-1">
                                {summary.pendingCasePayoutCount || 0} case milestone requests
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/60 shadow-sm bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Approved & Settled</p>
                            <h4 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                                ₹{(summary.grandTotalApprovedPayouts || 0).toLocaleString()}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-1">
                                Successfully paid to lawyers
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section Selection Tabs */}
            <div className="border-b border-border">
                <nav className="flex space-x-6" aria-label="Payout Categories">
                    <button
                        onClick={() => setActiveTab('consultations')}
                        className={`pb-3 px-1 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'consultations'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Video className="w-4 h-4" />
                        <span>Video Consultation Payouts</span>
                        {summary.pendingConsultationPayoutCount > 0 && (
                            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                {summary.pendingConsultationPayoutCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('cases')}
                        className={`pb-3 px-1 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'cases'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        <span>Case Management Payouts (Phase-Wise)</span>
                        {summary.pendingCasePayoutCount > 0 && (
                            <span className="bg-purple-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                {summary.pendingCasePayoutCount}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Controls: Search & Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-3 rounded-xl border border-border">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'consultations' ? 'consultations' : 'cases'}, lawyers, clients...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="all">All Payout Statuses</option>
                        <option value="requested">Requested (Action Required)</option>
                        <option value="pending">Pending Request</option>
                        <option value="approved">Approved & Paid</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Tab 1: Video Consultation Payouts Table */}
            {activeTab === 'consultations' && (
                <Card className="border-border shadow-sm">
                    <CardHeader className="bg-muted/20 border-b border-border py-3">
                        <CardTitle className="text-sm font-bold flex items-center justify-between">
                            <span>Video Consultation Payout Queue</span>
                            <span className="text-xs text-muted-foreground font-normal">
                                Total {filteredConsultations.length} records found
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {loading ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground font-medium">Fetching video consultation payouts...</p>
                            </div>
                        ) : filteredConsultations.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                No video consultation payouts matching your filter criteria.
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                        <th className="p-3 pl-4">Consultation Details</th>
                                        <th className="p-3">Client Info</th>
                                        <th className="p-3">Lawyer & Bank Details</th>
                                        <th className="p-3">Fee Amount</th>
                                        <th className="p-3">User Payment</th>
                                        <th className="p-3">Payout Status</th>
                                        <th className="p-3 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredConsultations.map((c: any) => (
                                        <tr key={c._id} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-3 pl-4">
                                                <div className="font-semibold text-foreground">{c.title}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {c.scheduledDate ? new Date(c.scheduledDate).toLocaleDateString() : 'N/A'} at {c.scheduledTime || 'N/A'}
                                                </div>
                                            </td>

                                            <td className="p-3">
                                                <div className="font-medium text-foreground">{c.client?.fullName || 'Client N/A'}</div>
                                                <div className="text-xs text-muted-foreground">{c.client?.email}</div>
                                            </td>

                                            <td className="p-3">
                                                <div className="font-medium text-foreground">{c.lawyer?.fullName || 'Lawyer N/A'}</div>
                                                <div className="text-xs text-muted-foreground flex flex-col mt-0.5 font-mono">
                                                    {c.lawyer?.bankName ? (
                                                        <span>Bank: {c.lawyer.bankName} | A/C: {c.lawyer.accountNumber || 'N/A'} | IFSC: {c.lawyer.ifsc || 'N/A'}</span>
                                                    ) : (
                                                        <span className="text-amber-600 dark:text-amber-400">⚠️ Bank details not added by lawyer</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-3">
                                                <div className="font-bold text-foreground text-base">₹{(c.totalFee || 0).toLocaleString()}</div>
                                            </td>

                                            <td className="p-3">
                                                <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Paid by Client
                                                </Badge>
                                            </td>

                                            <td className="p-3">
                                                {getStatusBadge(c.payoutStatus || (c.isPaidByUser ? 'pending' : 'none'), c.isPaidByUser)}
                                            </td>

                                            <td className="p-3 pr-4 text-right">
                                                {c.payoutStatus !== 'approved' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-8 px-3"
                                                            onClick={() => setSelectedPayout({ type: 'consultation', item: c })}
                                                        >
                                                            Approve & Pay &rarr;
                                                        </Button>
                                                        {c.payoutStatus === 'requested' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs h-8 px-2"
                                                                onClick={() => handleRejectPayout('consultation', c)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Settled
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Tab 2: Case Management Payouts (Phase-Wise) Table */}
            {activeTab === 'cases' && (
                <Card className="border-border shadow-sm">
                    <CardHeader className="bg-muted/20 border-b border-border py-3">
                        <CardTitle className="text-sm font-bold flex items-center justify-between">
                            <span>Phase-Wise Case Milestone Payout Queue</span>
                            <span className="text-xs text-muted-foreground font-normal">
                                Total {filteredMilestones.length} milestone items
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {loading ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground font-medium">Fetching case phase payouts...</p>
                            </div>
                        ) : filteredMilestones.length === 0 ? (
                            <div className="p-12 text-center text-sm text-muted-foreground">
                                No case milestone payouts matching your filter criteria.
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                        <th className="p-3 pl-4">Case & Phase Info</th>
                                        <th className="p-3">Client Info</th>
                                        <th className="p-3">Lawyer & Bank Details</th>
                                        <th className="p-3">Phase Payout Fee</th>
                                        <th className="p-3">Proof of Work</th>
                                        <th className="p-3">Payout Status</th>
                                        <th className="p-3 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredMilestones.map((m: any, idx: number) => (
                                        <tr key={`${m.caseId}-${m.milestoneIndex}-${idx}`} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-3 pl-4">
                                                <div className="font-semibold text-foreground">{m.caseTitle}</div>
                                                <div className="text-xs text-primary font-medium mt-0.5">
                                                    Phase {m.milestoneIndex + 1}: {m.milestoneTitle} ({m.progressIncrement}% progress)
                                                </div>
                                            </td>

                                            <td className="p-3">
                                                <div className="font-medium text-foreground">{m.client?.fullName || 'Client N/A'}</div>
                                                <div className="text-xs text-muted-foreground">{m.client?.email}</div>
                                            </td>

                                            <td className="p-3">
                                                <div className="font-medium text-foreground">{m.lawyer?.fullName || 'Lawyer N/A'}</div>
                                                <div className="text-xs text-muted-foreground flex flex-col mt-0.5 font-mono">
                                                    {m.lawyer?.bankName ? (
                                                        <span>Bank: {m.lawyer.bankName} | A/C: {m.lawyer.accountNumber || 'N/A'} | IFSC: {m.lawyer.ifsc || 'N/A'}</span>
                                                    ) : (
                                                        <span className="text-amber-600 dark:text-amber-400">⚠️ Bank details missing</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-3">
                                                <div className="font-bold text-foreground text-base">₹{(m.payoutAmount || 0).toLocaleString()}</div>
                                            </td>

                                            <td className="p-3">
                                                {m.proofDocs && m.proofDocs.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {m.proofDocs.map((doc: any, dIdx: number) => (
                                                            <a
                                                                key={dIdx}
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                                                            >
                                                                <FileText className="w-3 h-3" /> {doc.name || 'Proof Document'}
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No proof uploaded</span>
                                                )}
                                            </td>

                                            <td className="p-3">
                                                {getStatusBadge(m.payoutStatus || 'pending')}
                                            </td>

                                            <td className="p-3 pr-4 text-right">
                                                {m.payoutStatus !== 'approved' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-8 px-3"
                                                            onClick={() => setSelectedPayout({ type: 'milestone', item: m })}
                                                        >
                                                            Approve & Pay Phase &rarr;
                                                        </Button>
                                                        {m.payoutStatus === 'requested' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs h-8 px-2"
                                                                onClick={() => handleRejectPayout('milestone', m)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Settled
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payout Confirmation Modal */}
            {selectedPayout && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg bg-card border border-border shadow-2xl">
                        <CardHeader className="border-b border-border pb-4 bg-muted/20">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                                <Building2 className="w-5 h-5 text-primary" />
                                Confirm Lawyer Payout Settlement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                                <div className="flex justify-between items-center text-sm font-semibold text-foreground">
                                    <span>Payout Type:</span>
                                    <span className="text-primary font-bold">
                                        {selectedPayout.type === 'consultation' ? 'Video Consultation' : 'Case Management Phase'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-semibold text-foreground">
                                    <span>Item Title:</span>
                                    <span>
                                        {selectedPayout.type === 'consultation'
                                            ? selectedPayout.item.title
                                            : `${selectedPayout.item.caseTitle} — ${selectedPayout.item.milestoneTitle}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-extrabold text-foreground pt-2 border-t border-border">
                                    <span>Settlement Amount:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                        ₹{(selectedPayout.type === 'consultation'
                                            ? selectedPayout.item.totalFee
                                            : selectedPayout.item.payoutAmount
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Lawyer Bank Info */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Lawyer Bank Details for Transfer
                                </h4>
                                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5 text-sm font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Lawyer Name:</span>
                                        <span className="font-bold text-foreground">{selectedPayout.item.lawyer?.fullName || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bank Name:</span>
                                        <span className="font-semibold text-foreground">{selectedPayout.item.lawyer?.bankName || 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Account Number:</span>
                                        <span className="font-semibold text-foreground">{selectedPayout.item.lawyer?.accountNumber || 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">IFSC Code:</span>
                                        <span className="font-semibold text-foreground">{selectedPayout.item.lawyer?.ifsc || 'Not specified'}</span>
                                    </div>
                                    {selectedPayout.item.lawyer?.upiId && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">UPI ID:</span>
                                            <span className="font-semibold text-foreground">{selectedPayout.item.lawyer.upiId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>
                                    Confirming will mark this payout as approved and settled in the system. Ensure bank transfer is processed to the lawyer's account above.
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedPayout(null)}
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                    onClick={handleApprovePayout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Confirm Payout & Mark Paid
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
