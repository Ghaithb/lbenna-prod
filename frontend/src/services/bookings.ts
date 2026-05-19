import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
    eventType?: string;
    duration?: string;
    location?: string;
    budget?: string;
    guests?: string;
    companyName?: string;
    dynamicDetails?: any;
}

export const bookingsService = {
    getAll: async (): Promise<Booking[]> => {
        const response = await axios.get(`${getApiUrl()}/bookings`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    create: async (data: CreateBookingDto) => {
        const response = await axios.post(`${getApiUrl()}/bookings`, data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axios.patch(`${getApiUrl()}/bookings/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },

    getMyBookings: async (): Promise<Booking[]> => {
        const response = await axios.get(`${getApiUrl()}/bookings/my`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};
