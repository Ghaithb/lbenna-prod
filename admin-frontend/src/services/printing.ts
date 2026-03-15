import { api } from '@/lib/api';

export interface PrintOrder {
    id: string;
    orderNumber: string;
    userId: string;
    status: string;
    subtotal: number;
    total: number;
    createdAt: string;
    user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    items: Array<{
        id: string;
        productId: string;
        quantity: number;
        options: any;
        files: Array<{
            url: string;
            filename: string;
            dpi: number;
            width: number;
            height: number;
        }>;
        unitPrice: number;
        totalPrice: number;
        product?: any;
    }>;
}

export const printingService = {
    // Client endpoints
    createOrder: async (data: any) => {
        const response = await api.post('/printing/orders', data);
        return response.data;
    },

    getUserOrders: async () => {
        const response = await api.get('/printing/orders');
        return response.data;
    },

    getOrderById: async (id: string) => {
        const response = await api.get(`/printing/orders/${id}`);
        return response.data;
    },

    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/printing/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Admin endpoints
    getAllOrders: async (status?: string) => {
        const response = await api.get('/printing/admin/orders', {
            params: { status },
        });
        return response.data;
    },

    getPrintQueue: async () => {
        const response = await api.get('/printing/admin/queue');
        return response.data;
    },

    updateStatus: async (id: string, data: { status: string; notes?: string }) => {
        const response = await api.patch(`/printing/admin/orders/${id}/status`, data);
        return response.data;
    },
};
