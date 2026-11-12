import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    Gavel, 
    Send, 
    ShieldCheck, 
    Clock, 
    Sparkles, 
    Phone, 
    FileText, 
    AlertCircle, 
    CheckCircle2, 
    Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { documentReviewService, IDocumentReviewRequest } from '@/services/documentReviewService';

interface RequestLawyerReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentTitle: string;
    documentType: string;
    originalContent: string;
    documentId?: string;
    onRequestSubmitted?: (request: IDocumentReviewRequest) => void;
}

export function RequestLawyerReviewModal({
    isOpen,
    onClose,
    documentTitle,
    documentType,
    originalContent,
    documentId,
    onRequestSubmitted
}: RequestLawyerReviewModalProps) {
    const [userNotes, setUserNotes] = useState('');
    const [userPhone, setUserPhone] = useState(() => {
        try {
            const u = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
            return u.phone || '';
        } catch {
            return '';
        }
    });
    const [urgency, setUrgency] = useState<'standard' | 'urgent'>('standard');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userNotes.trim()) {
            toast.error('Please describe what specific clauses or changes you want the lawyer to review.');
            return;
        }

        if (!originalContent || !originalContent.trim()) {
            toast.error('Document content is empty. Please generate the document first.');
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await documentReviewService.createRequest({
                documentTitle,
                documentType,
                originalContent,
                userNotes: userNotes.trim(),
                urgency,
                documentId,
                userPhone: userPhone.trim()
            });

            if (res.success && res.data) {
                toast.success('Lawyer review request submitted! Our legal desk will examine your document and provide a quote.');
                if (onRequestSubmitted) {
                    onRequestSubmitted(res.data);
                }
                setUserNotes('');
                onClose();
            } else {
                toast.error(res.message || 'Failed to submit review request.');
            }
        } catch (error: any) {
            console.error('Error submitting review request:', error);
            toast.error(error?.response?.data?.message || 'Failed to submit review request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader className="space-y-2 border-b pb-4">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Gavel className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                                Request Expert Lawyer Review
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Have a verified advocate review, amend, and legally validate your generated contract.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">
                    {/* Document summary badge */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-foreground line-clamp-1">{documentTitle}</p>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{documentType}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold bg-white text-indigo-700 border-indigo-200">
                            AI Generated Draft
                        </Badge>
                    </div>

                    {/* How It Works Explainer */}
                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                            <Sparkles className="h-4 w-4 text-amber-600" />
                            How the Lawyer Review Workflow Works:
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-amber-900/90">
                            1. You submit your specific requirements &amp; clauses to check.<br/>
                            2. Our legal panel reviews the draft and proposes a customized review fee.<br/>
                            3. You confirm &amp; pay securely via Razorpay in your dashboard.<br/>
                            4. The advocate reviews, modifies the contract, and delivers the finalized version.
                        </p>
                    </div>

                    {/* Review Instructions */}
                    <div className="space-y-2">
                        <Label htmlFor="review-notes" className="text-xs font-bold text-foreground flex items-center justify-between">
                            <span>Specific Instructions &amp; What to Review / Change *</span>
                            <span className="text-[10px] text-muted-foreground font-normal">Required</span>
                        </Label>
                        <Textarea
                            id="review-notes"
                            rows={4}
                            required
                            value={userNotes}
                            onChange={(e) => setUserNotes(e.target.value)}
                            placeholder="e.g. Please check if the non-compete clause is legally enforceable in Karnataka, add an intellectual property assignment provision for software code, and ensure liability is capped at 6 months of fees."
                            className="text-xs resize-none rounded-xl bg-white border-slate-200 focus:border-indigo-500"
                        />
                    </div>

                    {/* Contact Phone & Urgency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="user-phone" className="text-xs font-bold text-foreground flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5 text-indigo-600" />
                                Contact Phone
                            </Label>
                            <Input
                                id="user-phone"
                                type="tel"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="h-10 text-xs rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="review-urgency" className="text-xs font-bold text-foreground flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-indigo-600" />
                                Timeline Preference
                            </Label>
                            <select
                                id="review-urgency"
                                value={urgency}
                                onChange={(e: any) => setUrgency(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="standard">Standard (24–48 Hours)</option>
                                <option value="urgent">Express Priority (Within 12–24 Hours)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>No immediate payment needed. Review fee quote will be sent to your dashboard.</span>
                    </div>

                    <DialogFooter className="pt-3 border-t flex flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl text-xs h-10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl text-xs h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Submit for Lawyer Review
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

