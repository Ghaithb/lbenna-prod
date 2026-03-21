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
    async getPublic() {
        const response = await axios.get<Review[]>(`${API_URL}/reviews`);
        return response.data;
    }
};
