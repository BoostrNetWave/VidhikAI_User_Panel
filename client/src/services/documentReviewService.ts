import api from '@/lib/api';

export interface IDocumentReviewRequest {
    _id: string;
    requestId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    documentId?: string;
    documentTitle: string;
    documentType: string;
    originalContent: string;
    userNotes: string;
    urgency: 'standard' | 'urgent';
    status: 'pending_quote' | 'payment_pending' | 'in_review' | 'completed' | 'cancelled';
    quoteAmount?: number;
    quoteNotes?: string;
    quotedAt?: string;
    paymentDetails?: {
        orderId?: string;
        paymentId?: string;
        signature?: string;
        amount?: number;
        paidAt?: string;
    };
    reviewedContent?: string;
    reviewSummary?: string;
    reviewedDocumentFile?: string;
    reviewedDocumentFileName?: string;
    assignedLawyerName?: string;
    reviewedAt?: string;
    meetingJoinedByClient?: boolean;
    meetingJoinedByLawyer?: boolean;
    userFeedback?: {
        accepted?: boolean;
        feedbackText?: string;
        updatedAt?: string;
    };
    statusHistory?: Array<{
        status: string;
        changedBy: string;
        changedAt: string;
        note?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export const documentReviewService = {
    // 1. Submit review request
    createRequest: async (payload: {
        documentTitle: string;
        documentType: string;
        originalContent: string;
        userNotes: string;
        urgency?: 'standard' | 'urgent';
        documentId?: string;
        userPhone?: string;
    }): Promise<{ success: boolean; data: IDocumentReviewRequest; message: string }> => {
        const res = await api.post('/document-reviews', payload);
        return res.data;
    },

    // 2. Get user review requests
    getUserRequests: async (): Promise<{ success: boolean; data: IDocumentReviewRequest[] }> => {
        const res = await api.get('/document-reviews/my');
        return res.data;
    },

    // 3. Get request by ID
    getRequestById: async (id: string): Promise<{ success: boolean; data: IDocumentReviewRequest }> => {
        const res = await api.get(`/document-reviews/${id}`);
        return res.data;
    },

    // 4. Create Razorpay Payment Order for Quoted Fee
    createPaymentOrder: async (id: string): Promise<{
        success: boolean;
        order: any;
        keyId: string;
        amount: number;
        currency: string;
    }> => {
        const res = await api.post(`/document-reviews/${id}/payment-order`);
        return res.data;
    },

    // 5. Verify Razorpay Payment Signature
    verifyPayment: async (id: string, payload: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{ success: boolean; data: IDocumentReviewRequest; message: string }> => {
        const res = await api.post(`/document-reviews/${id}/verify-payment`, payload);
        return res.data;
    },

    // 6. User accept review / feedback
    acceptReview: async (id: string, feedbackText?: string): Promise<{ success: boolean; data: IDocumentReviewRequest }> => {
        const res = await api.post(`/document-reviews/${id}/accept`, { feedbackText });
        return res.data;
    },

    // 7. Cancel request
    cancelRequest: async (id: string, reason?: string): Promise<{ success: boolean; data: IDocumentReviewRequest }> => {
        const res = await api.post(`/document-reviews/${id}/cancel`, { reason });
        return res.data;
    },

    // Admin methods
    getAllAdminRequests: async (params?: { status?: string; search?: string }): Promise<{
        success: boolean;
        stats: {
            total: number;
            pendingQuote: number;
            paymentPending: number;
            inReview: number;
            completed: number;
        };
        data: IDocumentReviewRequest[];
    }> => {
        const res = await api.get('/document-reviews/admin/all', { params });
        return res.data;
    },

    sendQuoteAdmin: async (id: string, payload: {
        quoteAmount: number;
        quoteNotes?: string;
        lawyerName?: string;
    }): Promise<{ success: boolean; data: IDocumentReviewRequest; message: string }> => {
        const res = await api.post(`/document-reviews/admin/${id}/quote`, payload);
        return res.data;
    },

        // Video consultation meeting methods
    joinMeeting: async (id: string): Promise<{ success: boolean; data: IDocumentReviewRequest }> => {
        const res = await api.post(`/document-reviews/${id}/join-meeting`);
        return res.data;
    },

    sendSignal: async (id: string, signalData: {
        sender: 'client' | 'lawyer';
        type: string;
        sdp?: string;
        candidate?: any;
    }): Promise<{ success: boolean; data: any }> => {
        const res = await api.post(`/document-reviews/${id}/signal`, signalData);
        return res.data;
    },

    getSignals: async (id: string): Promise<{ success: boolean; data: any[] }> => {
        const res = await api.get(`/document-reviews/${id}/signals`);
        return res.data;
    },

    clearSignals: async (id: string): Promise<{ success: boolean; message: string }> => {
        const res = await api.post(`/document-reviews/${id}/signals/clear`);
        return res.data;
    },

    submitCompletedReviewAdmin: async (id: string, formData: FormData): Promise<{
        success: boolean;
        data: IDocumentReviewRequest;
        message: string;
    }> => {
        const res = await api.post(`/document-reviews/admin/${id}/complete`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    downloadReviewFile: async (fileUrl: string, fileName?: string): Promise<boolean> => {
        try {
            let targetUrl = fileUrl;
            if (targetUrl.startsWith("/uploads/")) {
                targetUrl = "/api" + targetUrl;
            } else if (!targetUrl.startsWith("http") && !targetUrl.startsWith("/api")) {
                targetUrl = "/api/uploads/" + targetUrl.replace(/^\/+/, "");
            }
            const response = await fetch(targetUrl);
            if (!response.ok) throw new Error("Failed to download: " + response.statusText);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = fileName || "reviewed_document.docx";
            document.body.appendChild(anchor);
            anchor.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(anchor);
            return true;
        } catch (error) {
            console.error("downloadReviewFile error:", error);
            const fallback = fileUrl.startsWith("/uploads/") ? "/api" + fileUrl : fileUrl;
            window.open(fallback, "_blank");
            return false;
        }
    }
};
