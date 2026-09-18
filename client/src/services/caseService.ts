import api from '../lib/api';

export interface IMilestone {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    progressIncrement: number;
    payoutAmount: number;
    payoutStatus: 'pending' | 'requested' | 'approved' | 'rejected';
    proofDocs: {
        name: string;
        url: string;
        uploadedAt: string;
        details?: string;
    }[];
    completedAt?: string;
}

export interface ICase {
    _id: string;
    title: string;
    description: string;
    client: string;
    lawyer: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
        location?: string;
        title?: string;
        expertise?: string;
        avatar?: string;
    };
    status: 'pending_lawyer' | 'pending_payment' | 'active' | 'completed' | 'cancelled';
    totalFee: number;
    currentProgress: number;
    planSubmitted: boolean;
    planApproved: boolean;
    milestones: IMilestone[];
    category?: string;
    court?: string;
    filingNumber?: string;
    nextHearingDate?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    notes?: {
        text: string;
        createdAt: string;
        createdBy?: string;
    }[];
    documents?: {
        name: string;
        url: string;
        uploadedAt: string;
        docType?: string;
    }[];
    bookingDate?: string;
    bookingTime?: string;
    meetingLink?: string;
    meetingSummaryUrl?: string;
    meetingSummaryName?: string;
    meetingSummaryUploadedAt?: string;
    meetingJoinedByClient?: boolean;
    meetingJoinedByLawyer?: boolean;
    createdAt: string;
    updatedAt: string;
}

export const caseService = {
    async getClientCases(): Promise<ICase[]> {
        const response = await api.get('/cases/client');
        return response.data;
    },

    async getCaseById(id: string): Promise<ICase> {
        const response = await api.get(`/cases/${id}`);
        return response.data;
    },

    async createCase(data: {
        title: string;
        description: string;
        category?: string;
        court?: string;
        filingNumber?: string;
        nextHearingDate?: string;
        priority?: string;
        lawyerId?: string;
        totalFee?: number;
    }): Promise<ICase> {
        const response = await api.post('/cases', data);
        return response.data;
    },

    async addCaseNote(id: string, text: string): Promise<ICase> {
        const response = await api.post(`/cases/${id}/notes`, { text });
        return response.data;
    },

    async approvePlan(id: string): Promise<ICase> {
        const response = await api.put(`/cases/${id}/approve-plan`);
        return response.data;
    },

    async hireLawyer(data: { lawyerId: string; title: string; description: string; totalFee: number }): Promise<ICase> {
        const response = await api.post('/cases/hire', data);
        return response.data;
    },

    async bookLawyer(data: { lawyerId: string; title: string; description: string; bookingDate: string; bookingTime: string; totalFee: number }): Promise<ICase> {
        const response = await api.post('/cases/book', data);
        return response.data;
    },

    async payAndConfirm(id: string): Promise<ICase> {
        const response = await api.post(`/cases/${id}/pay`);
        return response.data;
    },

    async joinMeeting(id: string): Promise<ICase> {
        const response = await api.post(`/cases/${id}/join-meeting`);
        return response.data;
    },

    async sendSignal(id: string, signalData: { sender: 'client' | 'lawyer'; type: string; sdp?: string; candidate?: any }): Promise<any> {
        const response = await api.post(`/cases/${id}/signal`, signalData);
        return response.data;
    },

    async getSignals(id: string): Promise<any[]> {
        const response = await api.get(`/cases/${id}/signals`);
        return response.data;
    },

    async clearSignals(id: string): Promise<any> {
        const response = await api.post(`/cases/${id}/signals/clear`);
        return response.data;
    }
};
