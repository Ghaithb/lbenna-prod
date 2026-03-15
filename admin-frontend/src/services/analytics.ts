import { api } from '@/lib/api';

export const analyticsService = {
    getSummary: async () => {
        const response = await api.get('/analytics/summary');
        return response.data;
    },
    getRevenueByMonth: async () => {
        const response = await api.get('/analytics/revenue');
        return response.data;
    }
};
