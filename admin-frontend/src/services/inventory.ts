import { api } from '@/lib/api';

export interface Warehouse {
    id: string;
    name: string;
    location?: string;
    isDefault: boolean;
}

export interface StockLevel {
    id: string;
    warehouseId: string;
    productId: string;
    quantity: number;
    minQuantity: number;
    product?: { title: string; sku?: string };
    warehouse?: Warehouse;
}

export interface StockMovement {
    id: string;
    type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER';
    quantity: number; // Signed or absolute depending on API? Service expect absolute + type.
    reason?: string;
    createdAt: string;
    product?: { title: string };
    warehouse?: { name: string };
    user?: { firstName: string; lastName: string };
}

export const inventoryService = {
    getWarehouses: async () => {
        const response = await api.get<Warehouse[]>('/inventory/warehouses');
        return response.data;
    },

    createWarehouse: async (data: { name: string; location?: string; isDefault?: boolean }) => {
        const response = await api.post<Warehouse>('/inventory/warehouses', data);
        return response.data;
    },

    addMovement: async (data: { productId: string; warehouseId: string; type: string; quantity: number; reason?: string }) => {
        const response = await api.post('/inventory/movements', data);
        return response.data;
    },

    getAlerts: async () => {
        const response = await api.get<StockLevel[]>('/inventory/alerts');
        return response.data;
    },

    getProductStock: async (productId: string) => {
        const response = await api.get<{ total: number, breakdown: StockLevel[] }>(`/inventory/stock/${productId}`);
        return response.data;
    },

    getMovements: async (params?: { productId?: string; warehouseId?: string }) => {
        const response = await api.get<StockMovement[]>('/inventory/movements', { params });
        return response.data;
    }
};
