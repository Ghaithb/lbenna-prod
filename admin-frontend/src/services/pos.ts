import { api } from '@/lib/api';

export interface PosProduct {
    id: string;
    title: string;
    basePrice: number;
    stockQuantity: number;
    category?: string;
    imageUrl?: string;
}

export interface CartItem extends PosProduct {
    quantity: number;
}

export interface CheckoutDto {
    items: {
        id: string;
        quantity: number;
        price: number;
    }[];
    paymentMethod: 'CASH' | 'CARD_TERMINAL' | 'CHECK' | 'TRANSFER';
    customerEmail?: string;
    discount?: number;
}

export const posService = {
    // Specialized search for POS (faster, lighter)
    searchProducts: async (query: string) => {
        const response = await api.get('/products', {
            params: {
                query,
                take: 20,
                purchaseExperience: 'SIMPLE' // Only sell physical simple products in POS for now
            }
        });
        return response.data;
    },

    processSale: async (data: CheckoutDto) => {
        const response = await api.post('/pos/checkout', data);
        return response.data;
    },

    getDailyStats: async () => {
        const response = await api.get('/pos/stats/daily');
        return response.data;
    }
};
