import api from '../lib/api';

export const authService = {
    async register(userData: any) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async login(credentials: any) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async updateProfile(profileData: any) {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    async verifyOTP(data: { email: string; otp: string }) {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    async resendOTP(data: { email: string }) {
        const response = await api.post('/auth/resend-otp', data);
        return response.data;
    }
};
