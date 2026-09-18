import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Paperclip, X, FileText, UploadCloud, Loader2 } from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SupportTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultCategory?: string;
    onSuccess?: (ticket: any) => void;
}

export function SupportTicketModal({
    isOpen,
    onClose,
    defaultCategory = "Billing & Payments",
    onSuccess
}: SupportTicketModalProps) {
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState(defaultCategory);
    const [priority, setPriority] = useState("High");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (selected.size > 15 * 1024 * 1024) {
                toast.error("File size cannot exceed 15MB");
                return;
            }
            setFile(selected);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selected = e.dataTransfer.files[0];
            if (selected.size > 15 * 1024 * 1024) {
                toast.error("File size cannot exceed 15MB");
                return;
            }
            setFile(selected);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim()) {
            toast.error("Please enter a ticket subject.");
            return;
        }
        if (!description.trim()) {
            toast.error("Please enter a ticket description.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('subject', subject.trim());
            formData.append('category', category);
            formData.append('priority', priority);
            formData.append('description', description.trim());
            if (file) {
                formData.append('attachment', file);
            }

            const response = await api.post('/support', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const createdTicket = response.data.data;
                toast.success("Support ticket submitted successfully!", {
                    description: `Ticket ID: ${createdTicket.ticketId}`,
                    action: {
                        label: "View Tickets",
                        onClick: () => navigate('/support')
                    }
                });

                // Reset form
                setSubject("");
                setCategory(defaultCategory);
                setPriority("High");
                setDescription("");
                setFile(null);
                onClose();

                if (onSuccess) {
                    onSuccess(createdTicket);
                }
            }
        } catch (error: any) {
            console.error("Failed to submit ticket:", error);
            toast.error(error.response?.data?.message || "Failed to submit support ticket");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-[95vw] rounded-3xl p-6 sm:p-7 shadow-2xl bg-white border border-slate-100 overflow-hidden">
                <DialogHeader className="pb-1">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-slate-900">
                        <HelpCircle className="h-6 w-6 text-slate-700 shrink-0" />
                        <span>Open Support Ticket</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Subject */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Billing inquiry or payment discrepancy"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 transition-all font-medium"
                            required
                        />
                    </div>

                    {/* Category & Priority Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1.5">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                            >
                                <option value="Billing & Payments">Billing & Payments</option>
                                <option value="Technical Support">Technical Support</option>
                                <option value="Legal Research">Legal Research</option>
                                <option value="Case Management">Case Management</option>
                                <option value="Consultations">Consultations</option>
                                <option value="General">General Inquiry</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1.5">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Provide details about your issue..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 transition-all resize-none font-medium"
                            required
                        />
                    </div>

                    {/* Upload File Attachment Section */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Attachment (Optional)
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                            className="hidden"
                        />

                        {!file ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-3.5 flex items-center justify-center gap-2.5 cursor-pointer transition-all group"
                            >
                                <UploadCloud className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                <div className="text-xs text-slate-600 font-medium">
                                    <span className="font-bold text-primary">Click to upload</span> or drag and drop
                                </div>
                                <span className="text-[10px] text-slate-400 hidden sm:inline">(PDF, PNG, JPG, DOC up to 15MB)</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/20 rounded-xl">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="p-1.5 bg-white text-primary rounded-lg shadow-xs shrink-0">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[240px]">
                                            {file.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Remove file"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl px-5 h-10 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-slate-950 hover:bg-slate-900 text-white rounded-xl px-6 h-10 text-xs font-bold shadow-md transition-all gap-1.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Ticket"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
