import { api } from '@/lib/api';

export interface Certificate {
    id: string;
    userId: string;
    title: string;
    code: string;
    issuedAt: string;
    pdfUrl?: string;
    user?: {
        firstName: string;
        lastName: string;
    };
}

export const certificatesService = {
    async getAll() {
        const response = await api.get('/certificates');
        return response.data;
    },

    async issue(userId: string, title: string) {
        const response = await api.post('/certificates', { userId, title });
        return response.data;
    },

    async verify(code: string) {
        const response = await api.get(`/certificates/verify/${code}`);
        return response.data;
    }
};
