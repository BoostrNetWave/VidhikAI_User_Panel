import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Gavel, 
    CreditCard, 
    Clock, 
    CheckCircle2, 
    FileText, 
    Download, 
    Video, 
    Sparkles, 
    Loader2, 
    ArrowRight,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { documentReviewService, IDocumentReviewRequest } from '@/services/documentReviewService';
import { launchRazorpayCheckout } from '@/services/razorpayHelper';

interface ReviewStatusBannerProps {
    request: IDocumentReviewRequest;
    onUpdate?: (updated: IDocumentReviewRequest) => void;
    onApplyReviewedContent?: (content: string) => void;
}

export function ReviewStatusBanner({
    request,
    onUpdate,
    onApplyReviewedContent
}: ReviewStatusBannerProps) {
    const navigate = useNavigate();
    const [isPaying, setIsPaying] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

    // Razorpay Checkout handler
    const handlePayFee = async () => {
        try {
            setIsPaying(true);
            toast.info("Initializing secure Razorpay payment gateway...");

            // 1. Request backend to create Razorpay Order
            const orderRes = await documentReviewService.createPaymentOrder(request._id);
            if (!orderRes.success || !orderRes.order) {
                toast.error("Failed to create Razorpay payment order.");
                setIsPaying(false);
                return;
            }

            const userProfile = JSON.parse(localStorage.getItem('user_profile_data') || '{}');

            // 2. Launch Razorpay Checkout Modal
            const launched = await launchRazorpayCheckout({
                order: {
                    id: orderRes.order.id,
                    amount: orderRes.order.amount,
                    currency: orderRes.order.currency || 'INR',
                    keyId: orderRes.keyId,
                    name: 'Vidhik AI',
                    description: `Expert Lawyer Review: ${request.documentTitle} (${request.requestId})`,
                    prefill: {
                        name: userProfile.fullName || userProfile.name || request.userName,
                        email: userProfile.email || request.userEmail,
                        contact: userProfile.phone || request.userPhone || ''
                    },
                    theme: { color: '#4f46e5' }
                },
                onSuccess: async (paymentResp) => {
                    toast.loading("Verifying payment signature with Razorpay...", { id: 'review-verify-payment' });
                    try {
                        const verifyRes = await documentReviewService.verifyPayment(request._id, {
                            razorpay_order_id: paymentResp.razorpay_order_id,
                            razorpay_payment_id: paymentResp.razorpay_payment_id,
                            razorpay_signature: paymentResp.razorpay_signature
                        });

                        toast.dismiss('review-verify-payment');
                        if (verifyRes.success && verifyRes.data) {
                            toast.success("Payment verified! Your document review is now underway.");
                            if (onUpdate) onUpdate(verifyRes.data);
                        } else {
                            toast.error(verifyRes.message || "Payment verification failed.");
                        }
                    } catch (verifyErr: any) {
                        toast.dismiss('review-verify-payment');
                        console.error("Payment verification error:", verifyErr);
                        toast.error(verifyErr?.response?.data?.message || "Failed to verify payment signature.");
                    }
                },
                onError: (err) => {
                    console.error("Razorpay Error:", err);
                    toast.error(err?.message || "Payment cancelled or failed.");
                },
                onDismiss: () => {
                    toast.info("Payment window closed.");
                }
            });

            if (!launched) {
                toast.error("Unable to open Razorpay modal. Please check your internet connection.");
            }
        } catch (error: any) {
            console.error("Error initiating payment:", error);
            toast.error(error?.response?.data?.message || "Failed to initiate payment.");
        } finally {
            setIsPaying(false);
        }
    };

    const handleAccept = async () => {
        try {
            setIsAccepting(true);
            const res = await documentReviewService.acceptReview(request._id, "Client accepted revised draft");
            if (res.success && res.data) {
                toast.success("Thank you! You have accepted the reviewed document. It has been finalized in your workspace.");
                if (onUpdate) onUpdate(res.data);
            }
        } catch (err: any) {
            toast.error("Failed to submit acceptance.");
        } finally {
            setIsAccepting(false);
        }
    };

    const handleJoinConsultation = () => {
        navigate(`/document-reviews/${request._id}/consultation`);
    };

    const handleDownloadFile = async () => {
        if (!request.reviewedDocumentFile) return;
        toast.info("Downloading revised document...");
        const ok = await documentReviewService.downloadReviewFile(
            request.reviewedDocumentFile,
            request.reviewedDocumentFileName || `${request.documentTitle.replace(/\s+/g, '_')}_reviewed.docx`
        );
        if (ok) {
            toast.success("Download started!");
        }
    };

    // Render based on current review status
    if (request.status === 'pending_quote') {
        return (
            <Card className="border-amber-200 bg-amber-50/70 rounded-2xl shadow-xs overflow-hidden">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-amber-950">Lawyer Review Requested</h4>
                                <Badge variant="outline" className="text-[10px] bg-white text-amber-700 border-amber-300">
                                    {request.requestId}
                                </Badge>
                                <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                                    Fee Quote Pending
                                </span>
                            </div>
                            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                                Our legal panel is reviewing your instructions (<strong>"{request.userNotes.slice(0, 90)}..."</strong>). A customized review fee quote will appear here shortly.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (request.status === 'payment_pending') {
        return (
            <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-blue-50/90 rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Gavel className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-indigo-950">Review Fee Quoted by Legal Desk</h4>
                                <Badge className="text-xs font-bold bg-indigo-600 text-white">
                                    ₹{request.quoteAmount?.toLocaleString('en-IN')} INR
                                </Badge>
                                <Badge variant="outline" className="text-[10px] bg-white text-indigo-700 border-indigo-200">
                                    {request.requestId}
                                </Badge>
                            </div>
                            {request.quoteNotes && (
                                <p className="text-xs text-indigo-900 mt-1.5 bg-white/70 border border-indigo-100 rounded-lg p-2 leading-relaxed">
                                    <strong>Advocate's Scope &amp; Remarks:</strong> {request.quoteNotes}
                                </p>
                            )}
                            <p className="text-[11.5px] text-indigo-800/80 mt-1">
                                Complete payment via Razorpay to initiate the review. Our advocate will modify and validate your document.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handlePayFee}
                        disabled={isPaying}
                        className="w-full lg:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md gap-2"
                    >
                        {isPaying ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-4 w-4" />
                                Pay ₹{request.quoteAmount?.toLocaleString('en-IN')} via Razorpay
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (request.status === 'in_review') {
        return (
            <Card className="border-blue-200 bg-blue-50/70 rounded-2xl shadow-xs overflow-hidden">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="h-5 w-5 animate-spin text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-blue-950">Lawyer Review In Progress</h4>
                                <Badge variant="outline" className="text-[10px] bg-white text-blue-700 border-blue-200">
                                    {request.requestId}
                                </Badge>
                                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Payment Confirmed
                                </span>
                            </div>
                            <p className="text-xs text-blue-900/90 mt-1 leading-relaxed">
                                Advocate {request.assignedLawyerName || 'from our legal panel'} is currently editing, proofreading, and amending your agreement. You will be notified the moment the reviewed draft is uploaded.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleJoinConsultation}
                        className="w-full sm:w-auto shrink-0 text-xs rounded-xl border-blue-300 bg-white hover:bg-blue-100 text-blue-800 font-semibold gap-1.5 shadow-2xs"
                    >
                        <Video className="h-3.5 w-3.5 text-blue-600" />
                        Join Video Consultation Room
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (request.status === 'completed') {
        const isAccepted = request.userFeedback?.accepted;

        return (
            <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-bold text-emerald-950">Expert Lawyer Review Completed</h4>
                                    <Badge variant="outline" className="text-[10px] bg-white text-emerald-700 border-emerald-300">
                                        {request.requestId}
                                    </Badge>
                                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                        Advocate: {request.assignedLawyerName || 'Senior Legal Counsel'}
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-900/90 mt-1 leading-relaxed">
                                    Your document has been reviewed and revised according to legal compliance standards.
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                            {request.reviewedContent && onApplyReviewedContent && (
                                <Button
                                    size="sm"
                                    onClick={() => onApplyReviewedContent(request.reviewedContent || '')}
                                    className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl gap-1.5 shadow-2xs font-semibold"
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    Load Reviewed Draft
                                </Button>
                            )}

                            {request.reviewedDocumentFile && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDownloadFile}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition-colors shadow-2xs"
                                >
                                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                                    Download Lawyer File
                                </Button>
                            )}

                            {!isAccepted ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAccept}
                                    disabled={isAccepting}
                                    className="text-xs rounded-xl border-emerald-300 text-emerald-800 bg-white hover:bg-emerald-100 font-semibold gap-1.5 shadow-2xs"
                                >
                                    {isAccepting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                                    Accept &amp; Finalize
                                </Button>
                            ) : (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs py-1 px-2.5 font-bold">
                                    Accepted by You
                                </Badge>
                            )}

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleJoinConsultation}
                                className="text-xs rounded-xl border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold gap-1.5 shadow-2xs"
                            >
                                <Video className="h-3.5 w-3.5 text-indigo-600" />
                                Join Video Consultation Room
                            </Button>
                        </div>
                    </div>

                    {/* Lawyer summary note box */}
                    {request.reviewSummary && (
                        <div className="bg-white/90 border border-emerald-200 rounded-xl p-3.5 text-xs text-slate-800 space-y-1">
                            <span className="font-bold text-emerald-950 uppercase text-[10px] tracking-wider block">
                                Advocate's Review Summary &amp; Recommendations:
                            </span>
                            <p className="whitespace-pre-wrap leading-relaxed text-[12px] text-slate-700">
                                {request.reviewSummary}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return null;
}
