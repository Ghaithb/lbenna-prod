import { api } from '@/lib/api';

export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    createdAt: string;
    _count?: {
        bookings: number;
        projects: number;
    };
    addresses?: any[];
    bookings?: any[];
    projects?: any[];
}

export const usersService = {
    async getAll(params: { page?: number, limit?: number, group?: 'client' | 'staff' } = {}) {
        const skip = params.page && params.limit ? (params.page - 1) * params.limit : 0;
        const take = params.limit || 20;
        const response = await api.get('/users', {
            params: {
                skip,
                take,
                group: params.group
            }
        });
        return response.data;
    },

    async getById(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async updateRole(id: string, role: string) {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
