import api from '../lib/api';

export const adminService = {
    async getConfigs() {
        const response = await api.get('/admin/config');
        return response.data;
    },

    async updateConfig(key: string, value: any, category?: string, description?: string) {
        const response = await api.put('/admin/config', { key, value, category, description });
        return response.data;
    },

    async bulkUpdateConfigs(configs: Array<{ key: string; value: any; category?: string; description?: string }>) {
        const response = await api.post('/admin/config/bulk', { configs });
        return response.data;
    },

    async getAllUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    async getPendingLawyers() {
        const response = await api.get('/admin/pending-lawyers');
        return response.data;
    },

    async approveLawyer(id: string) {
        const response = await api.post(`/admin/approve-lawyer/${id}`);
        return response.data;
    },

    async verifyUser(id: string) {
        const response = await api.post(`/admin/verify-user/${id}`);
        return response.data;
    },

    async getAllCases() {
        const response = await api.get('/admin/cases');
        return response.data;
    },

    async approvePayout(caseId: string, milestoneIndex: number) {
        const response = await api.post(`/admin/cases/${caseId}/milestones/${milestoneIndex}/approve-payout`);
        return response.data;
    },

    async rejectPayout(caseId: string, milestoneIndex: number) {
        const response = await api.post(`/admin/cases/${caseId}/milestones/${milestoneIndex}/reject-payout`);
        return response.data;
    },

    async getAllTickets() {
        const response = await api.get('/admin/tickets');
        return response.data;
    },

    async replyToTicket(id: string, adminReply: string, status: string) {
        const response = await api.post(`/admin/tickets/${id}/reply`, { adminReply, status });
        return response.data;
    },

    async updateTicketStatus(id: string, status: string) {
        const response = await api.post(`/admin/tickets/${id}/reply`, { adminReply: '', status });
        return response.data;
    },

    async getAllDocuments() {
        const response = await api.get('/admin/documents');
        return response.data;
    },

    async getUserDetails(id: string) {
        const response = await api.get(`/admin/users/${id}/details`);
        return response.data;
    },

    async updateUserSubscription(id: string, subscription: string) {
        const response = await api.post(`/admin/users/${id}/subscription`, { subscription });
        return response.data;
    },

    async suspendUser(id: string, isSuspended: boolean) {
        const response = await api.post(`/admin/users/${id}/suspend`, { isSuspended });
        return response.data;
    },

    async sendEmail(id: string, subject: string, body: string) {
        const response = await api.post(`/admin/users/${id}/send-email`, { subject, body });
        return response.data;
    },

    async reverifyUser(id: string) {
        const response = await api.post(`/admin/users/${id}/reverify`);
        return response.data;
    },

    async getAllConsultations() {
        const response = await api.get('/admin/consultations');
        return response.data;
    },

    async getLoginHistory() {
        const response = await api.get('/admin/login-history');
        return response.data;
    },

    async toggleConsultantVisibility(id: string, showInConsultants: boolean) {
        const response = await api.post(`/admin/lawyers/${id}/toggle-consultant`, { showInConsultants });
        return response.data;
    },

    async getAllPayouts() {
        const response = await api.get('/admin/payouts');
        return response.data;
    },

    async approveConsultationPayout(id: string) {
        const response = await api.post(`/admin/consultations/${id}/approve-payout`);
        return response.data;
    },

    async rejectConsultationPayout(id: string) {
        const response = await api.post(`/admin/consultations/${id}/reject-payout`);
        return response.data;
    },

    async getLLMMetrics() {
        const response = await api.get('/admin/llm/metrics');
        return response.data;
    },

    async testLLMConfig(configData: { provider: string; model: string; apiKey?: string; baseUrl?: string; temperature?: number; maxTokens?: number; systemPrompt?: string; prompt?: string }) {
        const response = await api.post('/admin/llm/test', configData);
        return response.data;
    },

    async createLLMFeatureConfig(featureData: any) {
        const response = await api.post('/admin/llm/feature-config', featureData);
        return response.data;
    }
};
