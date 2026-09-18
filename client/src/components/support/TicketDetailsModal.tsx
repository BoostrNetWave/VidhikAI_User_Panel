import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    HelpCircle,
    Paperclip,
    Send,
    User,
    ShieldCheck,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    FileText,
    Image,
    X,
    Loader2,
    ArrowRight
} from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';
import { getSocket } from '@/lib/socket';

interface TicketDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string | null;
    onTicketUpdated?: (updatedTicket: any) => void;
}

const WORKFLOW_STEPS = [
    { key: 'Open', label: 'Open', description: 'Ticket submitted & queued' },
    { key: 'In Progress', label: 'In Progress', description: 'Under review by support' },
    { key: 'Waiting for Customer', label: 'Waiting for You', description: 'Action/reply needed from client' },
    { key: 'Resolved', label: 'Resolved', description: 'Issue solution provided' },
    { key: 'Closed', label: 'Closed', description: 'Ticket completed' }
];

export function TicketDetailsModal({
    isOpen,
    onClose,
    ticketId,
    onTicketUpdated
}: TicketDetailsModalProps) {
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [replyFile, setReplyFile] = useState<File | null>(null);
    const [isSendingReply, setIsSendingReply] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const replyFileInputRef = useRef<HTMLInputElement>(null);

    const fetchTicketDetails = async (id: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/support/${id}`);
            if (res.data.success) {
                setTicket(res.data.data);
            }
        } catch (err: any) {
            console.error("Error fetching ticket details:", err);
            toast.error("Failed to load ticket details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicketDetails(ticketId);
        } else {
            setTicket(null);
            setReplyMessage("");
            setReplyFile(null);
        }
    }, [isOpen, ticketId]);

    // Real-time socket updates
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleTicketUpdated = (updated: any) => {
            if (ticket && (updated._id === ticket._id || updated.ticketId === ticket.ticketId)) {
                setTicket(updated);
                onTicketUpdated?.(updated);
                toast.info("Ticket updated by Support Team", {
                    description: `Status: ${updated.status}`
                });
            }
        };

        socket.on('TICKET_UPDATED', handleTicketUpdated);
        return () => {
            socket.off('TICKET_UPDATED', handleTicketUpdated);
        };
    }, [ticket, onTicketUpdated]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket?.messages]);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() && !replyFile) {
            toast.error("Please enter a reply message.");
            return;
        }

        setIsSendingReply(true);
        try {
            const formData = new FormData();
            formData.append('message', replyMessage.trim());
            if (replyFile) {
                formData.append('attachment', replyFile);
            }

            const res = await api.post(`/support/${ticket._id}/reply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                const updated = res.data.data;
                setTicket(updated);
                setReplyMessage("");
                setReplyFile(null);
                onTicketUpdated?.(updated);
                toast.success("Reply sent successfully.");
            }
        } catch (err: any) {
            console.error("Failed to send reply:", err);
            toast.error(err.response?.data?.message || "Failed to send reply.");
        } finally {
            setIsSendingReply(false);
        }
    };

    const getStatusStepIndex = (status: string) => {
        switch (status) {
            case 'Open': return 0;
            case 'In Progress': return 1;
            case 'Waiting for Customer': return 2;
            case 'Resolved': return 3;
            case 'Closed': return 4;
            default: return 0;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Urgent':
                return <Badge className="bg-red-500/10 text-red-600 border-red-200 font-bold">Urgent</Badge>;
            case 'High':
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 font-bold">High</Badge>;
            case 'Medium':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 font-bold">Medium</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-bold">Low</Badge>;
        }
    };

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isClosed = ticket?.status === 'Closed';
    const currentStepIndex = getStatusStepIndex(ticket?.status || 'Open');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[96vw] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-2xl shrink-0 mt-1 sm:mt-0">
                            <HelpCircle className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-mono font-bold text-xs bg-slate-200/70 text-slate-800 px-2.5 py-0.5 rounded-md">
                                    {ticket?.ticketId || 'TICKET'}
                                </span>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-lg">
                                    {ticket?.subject || 'Loading ticket...'}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                                <span>Category: <strong className="text-slate-700">{ticket?.category}</strong></span>
                                <span>•</span>
                                <span>Priority: {getPriorityBadge(ticket?.priority)}</span>
                                <span>•</span>
                                <span>Submitted: {formatDate(ticket?.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && !ticket ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Loading ticket conversation...</p>
                    </div>
                ) : (
                    <>
                        {/* Status Stepper Workflow */}
                        <div className="bg-white border-b border-slate-100 px-6 py-4 overflow-x-auto shrink-0">
                            <div className="flex items-center justify-between min-w-[580px] relative">
                                {/* Connecting line */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-0.5 bg-slate-100 z-0" />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 left-6 h-0.5 bg-primary transition-all duration-500 z-0"
                                    style={{ width: `${(currentStepIndex / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
                                />

                                {WORKFLOW_STEPS.map((step, idx) => {
                                    const isPassed = idx < currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    return (
                                        <div key={step.key} className="flex flex-col items-center relative z-10">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                                    isCurrent
                                                        ? 'bg-primary text-white ring-4 ring-primary/20'
                                                        : isPassed
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                }`}
                                            >
                                                {isPassed ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : (
                                                    <span>{idx + 1}</span>
                                                )}
                                            </div>
                                            <span
                                                className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                                                    isCurrent
                                                        ? 'text-primary'
                                                        : isPassed
                                                        ? 'text-slate-800'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Thread View & Messages Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 space-y-4">
                            {/* Original Ticket Description Card */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                {ticket?.userName || 'You (Customer)'}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Ticket Creator • {formatDate(ticket?.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-bold text-slate-500 bg-slate-50 border-slate-200">
                                        Original Request
                                    </Badge>
                                </div>

                                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                    {ticket?.description}
                                </p>

                                {/* Original Attachment */}
                                {ticket?.attachment && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                                        <a
                                            href={ticket.attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                                        >
                                            <FileText className="h-3.5 w-3.5 text-primary" />
                                            <span>{ticket.attachmentName || 'View Attached File'}</span>
                                            <Download className="h-3 w-3 text-slate-400 ml-1" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Thread Messages */}
                            {ticket?.messages && ticket.messages.length > 1 && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-center">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">
                                            Conversation History
                                        </span>
                                    </div>

                                    {ticket.messages.slice(1).map((msg: any, i: number) => {
                                        const isAdmin = msg.sender === 'admin';
                                        return (
                                            <div
                                                key={i}
                                                className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                                            >
                                                <div className="flex items-center gap-2 mb-1 px-1">
                                                    {isAdmin ? (
                                                        <>
                                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                                <ShieldCheck className="h-3 w-3" />
                                                            </div>
                                                            <span className="text-xs font-bold text-primary">
                                                                {msg.senderName || 'Support Team'}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs font-bold text-slate-700">
                                                                {msg.senderName || 'You'}
                                                            </span>
                                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                                                <User className="h-3 w-3" />
                                                            </div>
                                                        </>
                                                    )}
                                                    <span className="text-[10px] text-slate-400">
                                                        {formatDate(msg.createdAt)}
                                                    </span>
                                                </div>

                                                <div
                                                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-xs ${
                                                        isAdmin
                                                            ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                                                            : 'bg-primary text-white rounded-tr-sm font-medium'
                                                    }`}
                                                >
                                                    {msg.message}

                                                    {/* Reply Attachment */}
                                                    {msg.attachment && (
                                                        <div className={`mt-3 pt-2.5 border-t ${isAdmin ? 'border-slate-100' : 'border-white/20'}`}>
                                                            <a
                                                                href={msg.attachment}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                                    isAdmin
                                                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                                                }`}
                                                            >
                                                                <FileText className="h-3.5 w-3.5" />
                                                                <span>{msg.attachmentName || 'Attachment'}</span>
                                                                <Download className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Backwards compatibility for single adminReply if messages array not populated */}
                            {(!ticket?.messages || ticket.messages.length <= 1) && ticket?.adminReply && (
                                <div className="flex flex-col items-start pt-2">
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <ShieldCheck className="h-3 w-3" />
                                        </div>
                                        <span className="text-xs font-bold text-primary">Support Team</span>
                                        <span className="text-[10px] text-slate-400">Admin Response</span>
                                    </div>
                                    <div className="max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl rounded-tl-sm bg-white border border-slate-200 text-slate-900 text-sm whitespace-pre-wrap leading-relaxed shadow-xs">
                                        {ticket.adminReply}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Customer Reply Section */}
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
                            {isClosed ? (
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
                                    This support ticket is marked as <strong className="text-slate-800">Closed</strong>. If you need further assistance, please open a new ticket.
                                </div>
                            ) : (
                                <form onSubmit={handleSendReply} className="space-y-3">
                                    <input
                                        type="file"
                                        ref={replyFileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setReplyFile(e.target.files[0]);
                                            }
                                        }}
                                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                                        className="hidden"
                                    />

                                    {replyFile && (
                                        <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText className="h-4 w-4 text-primary shrink-0" />
                                                <span className="text-xs font-bold text-slate-800 truncate max-w-sm">
                                                    {replyFile.name}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    ({(replyFile.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setReplyFile(null)}
                                                className="text-slate-400 hover:text-red-500 p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-end gap-2">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                rows={2}
                                                placeholder="Type your reply to Support Team..."
                                                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 resize-none font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => replyFileInputRef.current?.click()}
                                                className="absolute right-2.5 bottom-3.5 p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Attach document or screenshot"
                                            >
                                                <Paperclip className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSendingReply || (!replyMessage.trim() && !replyFile)}
                                            className="bg-primary hover:bg-primary/90 text-white font-bold h-[54px] px-5 rounded-xl shadow-md shrink-0 gap-1.5"
                                        >
                                            {isSendingReply ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Send</span>
                                                    <Send className="h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
