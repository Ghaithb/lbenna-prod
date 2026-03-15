import { api } from '@/lib/api';

export interface Supplier {
    id: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    category?: string;
    paymentTerms?: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
    purchaseOrders?: any[];
}

export interface CreateSupplierDto {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    category?: string;
    paymentTerms?: string;
    notes?: string;
}

export const suppliersService = {
    getAll: async (params?: { query?: string }) => {
        const response = await api.get('/suppliers', { params });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/suppliers/stats');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/suppliers/${id}`);
        return response.data;
    },

    create: async (data: CreateSupplierDto) => {
        const response = await api.post('/suppliers', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateSupplierDto>) => {
        const response = await api.patch(`/suppliers/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    }
};
