import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Gavel,
    Search,
    FileText,
    Clock,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    User,
    Mail,
    Phone,
    Send,
    Download,
    Eye,
    Upload,
    Sparkles,
    RefreshCw,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    ShieldAlert,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { documentReviewService, IDocumentReviewRequest } from "@/services/documentReviewService";

export function AdminDocumentReviews() {
    const [requests, setRequests] = useState<IDocumentReviewRequest[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        pendingQuote: 0,
        paymentPending: 0,
        inReview: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState<IDocumentReviewRequest | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Quote Form state
    const [quoteAmount, setQuoteAmount] = useState<string>('999');
    const [quoteNotes, setQuoteNotes] = useState('');
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

    // Complete Review Form state
    const [reviewedContent, setReviewedContent] = useState('');
    const [reviewSummary, setReviewSummary] = useState('');
    const [reviewFile, setReviewFile] = useState<File | null>(null);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [activeTabInModal, setActiveTabInModal] = useState<'original' | 'reviewed'>('original');

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await documentReviewService.getAllAdminRequests({
                status: statusFilter,
                search: searchQuery
            });

            if (res.success) {
                setRequests(res.data);
                if (res.stats) {
                    setStats(res.stats);
                }
            }
        } catch (error) {
            console.error('Error fetching admin reviews:', error);
            toast.error('Failed to load document review requests');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRequests();
    };

    const handleOpenModal = (req: IDocumentReviewRequest) => {
        setSelectedRequest(req);
        setQuoteAmount(req.quoteAmount && req.quoteAmount > 0 ? req.quoteAmount.toString() : '999');
        setQuoteNotes(req.quoteNotes || '');
        setReviewedContent(req.reviewedContent || req.originalContent);
        setReviewSummary(req.reviewSummary || '');
        setReviewFile(null);
        setActiveTabInModal(req.status === 'completed' && req.reviewedContent ? 'reviewed' : 'original');
        setIsDetailModalOpen(true);
    };

    const handleSendQuote = async () => {
        if (!selectedRequest) return;
        const amount = Number(quoteAmount);
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid review fee in INR (greater than 0).');
            return;
        }

        try {
            setIsSubmittingQuote(true);
            const res = await documentReviewService.sendQuoteAdmin(selectedRequest._id, {
                quoteAmount: amount,
                quoteNotes: quoteNotes.trim()
            });

            if (res.success && res.data) {
                toast.success(`Fee quote of ₹${amount.toLocaleString('en-IN')} sent to client successfully!`);
                setSelectedRequest(res.data);
                fetchRequests();
            }
        } catch (error: any) {
            console.error('Error sending quote:', error);
            toast.error(error?.response?.data?.message || 'Failed to send quote.');
        } finally {
            setIsSubmittingQuote(false);
        }
    };

    const handleSubmitCompletedReview = async () => {
        if (!selectedRequest) return;
        if (!reviewSummary.trim()) {
            toast.error('Please provide a summary of legal changes and recommendations.');
            return;
        }

        try {
            setIsSubmittingReview(true);
            const formData = new FormData();
            formData.append('reviewedContent', reviewedContent);
            formData.append('reviewSummary', reviewSummary.trim());
            if (reviewFile) {
                formData.append('file', reviewFile);
            }

            const res = await documentReviewService.submitCompletedReviewAdmin(selectedRequest._id, formData);
            if (res.success && res.data) {
                toast.success('Document review finalized and delivered to client!');
                setSelectedRequest(res.data);
                fetchRequests();
            }
        } catch (error: any) {
            console.error('Error completing review:', error);
            toast.error(error?.response?.data?.message || 'Failed to deliver completed review.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_quote':
                return <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">Pending Quote</Badge>;
            case 'payment_pending':
                return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-100">Payment Pending</Badge>;
            case 'in_review':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100">In Review (Paid)</Badge>;
            case 'completed':
                return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100">Completed</Badge>;
            case 'cancelled':
                return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Gavel className="h-6 w-6 text-indigo-600" />
                        Lawyer Document Reviews
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage user review requests for AI-generated contracts, propose fees, and deliver reviewed drafts.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchRequests}
                        disabled={loading}
                        className="gap-1.5 text-xs h-9"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <Card className="rounded-2xl border bg-card p-4 cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setStatusFilter('all')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Total Requests</span>
                        <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground mt-2">{stats.total}</div>
                </Card>

                <Card className="rounded-2xl border bg-card p-4 cursor-pointer hover:border-amber-300 transition-colors" onClick={() => setStatusFilter('pending_quote')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-600">Pending Quote</span>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-amber-700 mt-2">{stats.pendingQuote}</div>
                </Card>

                <Card className="rounded-2xl border bg-card p-4 cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setStatusFilter('payment_pending')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-600">Payment Pending</span>
                        <CreditCard className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-indigo-700 mt-2">{stats.paymentPending}</div>
                </Card>

                <Card className="rounded-2xl border bg-card p-4 cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setStatusFilter('in_review')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-600">In Review (Paid)</span>
                        <Sparkles className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-blue-700 mt-2">{stats.inReview}</div>
                </Card>

                <Card className="rounded-2xl border bg-card p-4 cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => setStatusFilter('completed')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600">Completed</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700 mt-2">{stats.completed}</div>
                </Card>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                        { id: 'all', label: 'All Reviews' },
                        { id: 'pending_quote', label: `Pending Quote (${stats.pendingQuote})` },
                        { id: 'payment_pending', label: `Awaiting Payment (${stats.paymentPending})` },
                        { id: 'in_review', label: `In Review (${stats.inReview})` },
                        { id: 'completed', label: `Completed (${stats.completed})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                statusFilter === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, client, document..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 pl-8 text-xs rounded-xl"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs rounded-xl">
                        Search
                    </Button>
                </form>
            </div>

            {/* Requests Table */}
            <Card className="rounded-2xl border shadow-xs overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="text-xs font-bold">Request ID</TableHead>
                                <TableHead className="text-xs font-bold">Client</TableHead>
                                <TableHead className="text-xs font-bold">Document Title</TableHead>
                                <TableHead className="text-xs font-bold">Urgency</TableHead>
                                <TableHead className="text-xs font-bold">Fee Quote</TableHead>
                                <TableHead className="text-xs font-bold">Status</TableHead>
                                <TableHead className="text-xs font-bold">Date</TableHead>
                                <TableHead className="text-right text-xs font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="text-xs">Loading review requests...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <FileText className="h-8 w-8 text-slate-300" />
                                            <p className="text-sm font-semibold text-foreground">No review requests found</p>
                                            <p className="text-xs text-muted-foreground">Review requests submitted from the document generator will appear here.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((req) => (
                                    <TableRow key={req._id} className="hover:bg-muted/40 transition-colors">
                                        <TableCell className="font-mono text-xs font-bold text-indigo-700">
                                            {req.requestId}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-semibold text-foreground">{req.userName}</div>
                                            <div className="text-[11px] text-muted-foreground">{req.userEmail}</div>
                                            {req.userPhone && (
                                                <div className="text-[10px] text-slate-500">{req.userPhone}</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-semibold text-foreground line-clamp-1 max-w-[200px]" title={req.documentTitle}>
                                                {req.documentTitle}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase">{req.documentType}</span>
                                        </TableCell>
                                        <TableCell>
                                            {req.urgency === 'urgent' ? (
                                                <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 font-semibold">
                                                    Urgent (12h)
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Standard</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {req.quoteAmount && req.quoteAmount > 0 ? (
                                                <div className="text-xs font-bold text-foreground">
                                                    ₹{req.quoteAmount.toLocaleString('en-IN')}
                                                    {req.paymentDetails?.paidAt && (
                                                        <span className="block text-[10px] text-emerald-600 font-semibold">Paid</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Not Quoted</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(req.status)}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(req.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                onClick={() => handleOpenModal(req)}
                                                className={`text-xs h-8 rounded-xl px-3 font-semibold ${
                                                    req.status === 'pending_quote'
                                                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                                        : req.status === 'in_review'
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                                }`}
                                            >
                                                {req.status === 'pending_quote' ? 'Quote Fee' : req.status === 'in_review' ? 'Deliver Review' : 'View Details'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail / Action Modal */}
            {selectedRequest && (
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6">
                        <DialogHeader className="border-b pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <DialogTitle className="text-xl font-bold text-foreground">
                                            {selectedRequest.documentTitle}
                                        </DialogTitle>
                                        {getStatusBadge(selectedRequest.status)}
                                    </div>
                                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                        Request ID: <strong>{selectedRequest.requestId}</strong> &bull; Client: <strong>{selectedRequest.userName}</strong> ({selectedRequest.userEmail}) {selectedRequest.userPhone ? `&bull; Phone: ${selectedRequest.userPhone}` : ''}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 py-2">
                            {/* Client's Specific Instructions */}
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                                <div className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    Client's Review Instructions &amp; Requirements
                                </div>
                                <p className="text-xs text-amber-950/90 whitespace-pre-wrap leading-relaxed">
                                    {selectedRequest.userNotes}
                                </p>
                            </div>

                            {/* WORKFLOW ACTIONS BASED ON CURRENT STATUS */}
                            {selectedRequest.status === 'pending_quote' && (
                                <Card className="border-amber-300 bg-amber-50/40 rounded-2xl p-5 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-amber-600" />
                                        <h3 className="font-bold text-sm text-foreground">Step 1: Propose Review Fee Quote</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Enter the fee in INR that the client needs to pay for this document review. The quote will be sent directly to the client's dashboard and email.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="quote-amount" className="text-xs font-bold text-foreground">
                                                Review Fee (INR ₹) *
                                            </Label>
                                            <Input
                                                id="quote-amount"
                                                type="number"
                                                value={quoteAmount}
                                                onChange={(e) => setQuoteAmount(e.target.value)}
                                                placeholder="999"
                                                className="h-10 text-sm font-bold rounded-xl"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 space-y-1.5">
                                            <Label htmlFor="quote-notes" className="text-xs font-bold text-foreground">
                                                Review Scope / Notes for Client (Optional)
                                            </Label>
                                            <Input
                                                id="quote-notes"
                                                value={quoteNotes}
                                                onChange={(e) => setQuoteNotes(e.target.value)}
                                                placeholder="e.g. Includes full clause review, legal liability audit, and redline amendments."
                                                className="h-10 text-xs rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSendQuote}
                                        disabled={isSubmittingQuote}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 shadow-xs"
                                    >
                                        {isSubmittingQuote ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Sending Quote...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Send Payment Request to Client
                                            </>
                                        )}
                                    </Button>
                                </Card>
                            )}

                            {selectedRequest.status === 'payment_pending' && (
                                <Card className="border-indigo-200 bg-indigo-50/50 rounded-2xl p-5 shadow-xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-indigo-600" />
                                            <h3 className="font-bold text-sm text-foreground">Awaiting Client Payment via Razorpay</h3>
                                        </div>
                                        <Badge className="bg-indigo-600 text-white text-xs font-bold">
                                            Quoted: ₹{selectedRequest.quoteAmount?.toLocaleString('en-IN')}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Payment request has been dispatched to client {selectedRequest.userEmail}. As soon as the client confirms payment through Razorpay, this request will automatically move to "In Review".
                                    </p>
                                    {selectedRequest.quoteNotes && (
                                        <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                                            <strong>Sent Scope:</strong> {selectedRequest.quoteNotes}
                                        </div>
                                    )}
                                </Card>
                            )}

                            {selectedRequest.status === 'in_review' && (
                                <Card className="border-blue-300 bg-blue-50/40 rounded-2xl p-5 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-blue-600" />
                                            <h3 className="font-bold text-sm text-foreground">Step 2: Lawyer Review &amp; Document Delivery</h3>
                                        </div>
                                        <Badge className="bg-emerald-600 text-white text-xs">
                                            Paid ₹{selectedRequest.quoteAmount?.toLocaleString('en-IN')} via Razorpay
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 pt-1">
                                        {/* Review Summary */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="review-summary" className="text-xs font-bold text-foreground">
                                                Lawyer Review Summary &amp; Recommendations *
                                            </Label>
                                            <Textarea
                                                id="review-summary"
                                                rows={3}
                                                required
                                                value={reviewSummary}
                                                onChange={(e) => setReviewSummary(e.target.value)}
                                                placeholder="Explain the changes made, risks mitigated, and practical legal advice for the client."
                                                className="text-xs rounded-xl bg-white resize-none"
                                            />
                                        </div>

                                        {/* Modified Document Content */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="reviewed-content" className="text-xs font-bold text-foreground">
                                                Revised Document HTML / Text
                                            </Label>
                                            <Textarea
                                                id="reviewed-content"
                                                rows={8}
                                                value={reviewedContent}
                                                onChange={(e) => setReviewedContent(e.target.value)}
                                                placeholder="Paste or edit the modified legal text here..."
                                                className="font-serif text-xs rounded-xl bg-white"
                                            />
                                        </div>

                                        {/* Optional File Upload */}
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-foreground">
                                                Upload Revised Word (.docx) or PDF File (Optional)
                                            </Label>
                                            <Input
                                                type="file"
                                                accept=".docx,.pdf,.doc"
                                                onChange={(e) => setReviewFile(e.target.files?.[0] || null)}
                                                className="text-xs rounded-xl bg-white"
                                            />
                                            {reviewFile && (
                                                <p className="text-[11px] text-emerald-600 font-semibold">Selected file: {reviewFile.name}</p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={handleSubmitCompletedReview}
                                            disabled={isSubmittingReview}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl gap-2 shadow-xs"
                                        >
                                            {isSubmittingReview ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Delivering to Client...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Submit Review &amp; Deliver to Client
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            {selectedRequest.status === 'completed' && (
                                <Card className="border-emerald-300 bg-emerald-50/50 rounded-2xl p-5 shadow-xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                            Review Delivered &amp; Completed
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            Advocate: <strong>{selectedRequest.assignedLawyerName || 'Legal Ops'}</strong>
                                        </span>
                                    </div>

                                    {selectedRequest.reviewSummary && (
                                        <div className="bg-white/80 border border-emerald-200 rounded-xl p-3 text-xs text-slate-800 space-y-1">
                                            <span className="font-bold text-emerald-950 uppercase text-[10px] tracking-wider block">Delivered Advice:</span>
                                            <p className="whitespace-pre-wrap leading-relaxed text-[12px]">{selectedRequest.reviewSummary}</p>
                                        </div>
                                    )}

                                    {selectedRequest.reviewedDocumentFile && (
                                        <div className="pt-1">
                                            <a
                                                href={selectedRequest.reviewedDocumentFile}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Download Attached File ({selectedRequest.reviewedDocumentFileName || 'document'})
                                            </a>
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground pt-1">
                                        Client Acceptance Status: {selectedRequest.userFeedback?.accepted ? (
                                            <span className="text-emerald-700 font-bold">&bull; Accepted by Client</span>
                                        ) : (
                                            <span className="text-slate-500 italic">&bull; Awaiting Client Confirmation</span>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Document Viewer Tabs */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setActiveTabInModal('original')}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                                activeTabInModal === 'original'
                                                    ? 'bg-slate-900 text-white'
                                                    : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                        >
                                            Original Generated Document
                                        </button>
                                        {selectedRequest.reviewedContent && (
                                            <button
                                                onClick={() => setActiveTabInModal('reviewed')}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                                    activeTabInModal === 'reviewed'
                                                        ? 'bg-emerald-700 text-white'
                                                        : 'text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                Lawyer Reviewed Version
                                            </button>
                                        )}
                                    </div>

                                    <span className="text-[11px] text-muted-foreground">
                                        Word Count: ~{(activeTabInModal === 'reviewed' ? selectedRequest.reviewedContent : selectedRequest.originalContent)?.split(/\s+/).length || 0} words
                                    </span>
                                </div>

                                <div className="bg-slate-50/70 border rounded-2xl p-5 max-h-[380px] overflow-y-auto text-xs leading-relaxed font-serif text-slate-900">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: activeTabInModal === 'reviewed' && selectedRequest.reviewedContent
                                                ? selectedRequest.reviewedContent
                                                : selectedRequest.originalContent
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-3 border-t">
                            <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl text-xs">
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

