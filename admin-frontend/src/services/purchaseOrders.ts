import { api } from '@/lib/api';

export type PurchaseOrderStatus = 'DRAFT' | 'ORDERED' | 'RECEIVED_PARTIAL' | 'RECEIVED_FULL' | 'CANCELLED';

export interface PurchaseOrderItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    sku?: string;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplierId: string;
    status: PurchaseOrderStatus;
    totalAmount: number;
    expectedDate?: string;
    notes?: string;
    createdAt: string;
    supplier?: { name: string };
    items?: PurchaseOrderItem[];
}

export const purchaseOrdersService = {
    getAll: async (params?: { supplierId?: string }) => {
        const response = await api.get<PurchaseOrder[]>('/purchase-orders', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<PurchaseOrder>(`/purchase-orders/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post<PurchaseOrder>('/purchase-orders', data);
        return response.data;
    },

    updateStatus: async (id: string, status: PurchaseOrderStatus) => {
        const response = await api.patch<PurchaseOrder>(`/purchase-orders/${id}/status`, { status });
        return response.data;
    }
};
