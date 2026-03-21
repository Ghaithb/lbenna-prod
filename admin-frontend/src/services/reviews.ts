import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
        const response = await axios.get<Review[]>(`${API_URL}/reviews/admin`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    async getPublic() {
        const response = await axios.get<Review[]>(`${API_URL}/reviews`);
        return response.data;
    },

    async create(data: Partial<Review>) {
        const response = await axios.post<Review>(`${API_URL}/reviews`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    async update(id: string, data: Partial<Review>) {
        const response = await axios.patch<Review>(`${API_URL}/reviews/${id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    async delete(id: string) {
        const response = await axios.delete(`${API_URL}/reviews/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};
