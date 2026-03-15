import { api } from '@/lib/api';

export interface Expense {
    id: string;
    amount: number;
    category: 'RENT' | 'SALARY' | 'UTILITIES' | 'MARKETING' | 'SOFTWARE' | 'EQUIPMENT' | 'TAXES' | 'OTHER';
    date: string;
    description?: string;
    reference?: string;
    paymentMethod: string;
    createdAt: string;
}

export interface CreateExpenseDto {
    amount: number;
    category: string;
    date?: string;
    description?: string;
    reference?: string;
    paymentMethod?: string;
}

export const expensesService = {
    getAll: async (params?: any) => {
        const response = await api.get('/expenses', { params });
        return response.data;
    },

    create: async (data: CreateExpenseDto) => {
        const response = await api.post('/expenses', data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    },

    getStats: async (start?: Date, end?: Date) => {
        const response = await api.get('/expenses/stats', {
            params: {
                start: start?.toISOString(),
                end: end?.toISOString()
            }
        });
        return response.data;
    }
};
