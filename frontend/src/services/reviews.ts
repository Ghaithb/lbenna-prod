import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
        const response = await axios.get<Review[]>(`${getApiUrl()}/reviews`);
        return response.data;
    }
};
