import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Booking {
    id: string;
    serviceOfferId: string;
    bookingDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
    deliveryUrl?: string;
    transferFileUrl?: string;
    transferToken?: string;
    previewUrls?: string[];
    serviceOffer?: {
        title: string;
    };
}

export interface CreateBookingDto {
    serviceOfferId: string;
    userId?: string;
    bookingDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
}

export const bookingsService = {
    getAll: async (): Promise<Booking[]> => {
        const response = await axios.get(`${API_URL}/bookings`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    create: async (data: CreateBookingDto) => {
        const response = await axios.post(`${API_URL}/bookings`, data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axios.patch(`${API_URL}/bookings/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getMyBookings: async (): Promise<Booking[]> => {
        const response = await axios.get(`${API_URL}/bookings/my`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};
