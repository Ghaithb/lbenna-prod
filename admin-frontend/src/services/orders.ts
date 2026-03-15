import { api } from '@/lib/api';

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PROCESSING = 'PROCESSING',
    PREFLIGHT = 'PREFLIGHT',
    PRINTING = 'PRINTING',
    READY = 'READY',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    total: number;
    shippingCost: number;
    shippingMethod: string;
    customerNotes?: string;
    adminNotes?: string;
    createdAt: string;
    user?: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    address?: {
        street: string;
        city: string;
        state?: string;
        zipCode: string;
        country: string;
    };
    items?: any[];
}

export const ordersService = {
    getAll: async (params?: { status?: string; skip?: number; take?: number }) => {
        const response = await api.get('/orders', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: OrderStatus, notes?: string) => {
        const response = await api.put(`/orders/${id}/status`, { status, notes });
        return response.data;
    },

    updateTracking: async (id: string, trackingNumber: string, carrier?: string) => {
        const response = await api.put(`/orders/${id}/tracking`, { trackingNumber, carrier });
        return response.data;
    },

    updateInternalStatus: async (id: string, status: string) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },

    addAdminNotes: async (id: string, adminNotes: string) => {
        const response = await api.put(`/orders/${id}/notes`, { adminNotes });
        return response.data;
    },

    cancel: async (id: string, reason?: string) => {
        const response = await api.put(`/orders/${id}/cancel`, { reason });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/orders/stats');
        return response.data;
    },

    generateInvoice: async (orderId: string) => {
        const response = await api.post(`/invoices/order/${orderId}/generate`, {});
        return response.data;
    },

};
