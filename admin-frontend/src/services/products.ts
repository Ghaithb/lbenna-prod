import { api } from '@/lib/api';

export interface Product {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    categoryId?: string;
    cat?: {
        name: string;
        slug: string;
    };
    basePrice: number;
    isActive: boolean;
    stockQuantity: number;
    lowStockAlert: number;
    imageUrl?: string;
    productionTime?: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    availableSizes?: any;
    availablePapers?: any;
    availablePacks?: any;
    availableFrames?: any;
    purchaseExperience?: 'SIMPLE' | 'UPLOAD_ONLY' | 'DESIGNER';
    customizationConfig?: any;
}

export interface CreateProductDto {
    title: string;
    slug: string;
    category: string;
    categoryId?: string;
    productType?: 'PHYSICAL' | 'SERVICE';
    purchaseExperience?: 'SIMPLE' | 'UPLOAD_ONLY' | 'DESIGNER';
    customizationConfig?: any;
    basePrice: number;
    description?: string;
    stockQuantity?: number;
    lowStockAlert?: number;
    availableSizes: any;
    availablePapers: any;
    availablePacks?: any;
    availableFrames?: any;
}

export const productsService = {
    getAll: async (params?: {
        category?: string;
        productType?: 'PHYSICAL' | 'SERVICE' | 'DIGITAL';
        purchaseExperience?: 'SIMPLE' | 'UPLOAD_ONLY' | 'DESIGNER';
        skip?: number;
        take?: number;
        isAdmin?: boolean
    }) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    create: async (data: CreateProductDto) => {
        const response = await api.post('/products', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateProductDto>) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    updateStock: async (id: string, quantity: number) => {
        const response = await api.put(`/products/${id}/stock`, { quantity });
        return response.data;
    },

    getLowStock: async () => {
        const response = await api.get('/products/admin/low-stock');
        return response.data;
    }
};
