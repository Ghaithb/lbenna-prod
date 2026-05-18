import { api } from '../lib/api';

export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const reviewsService = {
    async getAll() {
        const response = await api.get<Review[]>('/reviews/admin');
        return response.data;
    },

    async getPublic() {
        const response = await api.get<Review[]>('/reviews');
        return response.data;
    },

    async create(data: Partial<Review>) {
        const response = await api.post<Review>('/reviews', data);
        return response.data;
    },

    async update(id: string, data: Partial<Review>) {
        const response = await api.patch<Review>(`/reviews/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};
