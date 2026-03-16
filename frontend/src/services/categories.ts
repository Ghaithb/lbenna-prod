import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    _count?: {
        serviceOffers: number;
        portfolioItems: number;
    };
}

export const categoriesService = {
    getAll: async () => {
        const res = await axios.get(`${API_URL}/categories`);
        return res.data;
    },


    create: async (data: any) => {
        const res = await axios.post(`${API_URL}/categories`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    },

    update: async (id: string, data: any) => {
        const res = await axios.patch(`${API_URL}/categories/${id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    },

    delete: async (id: string) => {
        const res = await axios.delete(`${API_URL}/categories/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    }
};
