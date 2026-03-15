import { api } from '@/lib/api';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED'
}

export interface Booking {
    id: string;
    serviceOfferId: string;
    userId?: string;
    bookingDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
    status: BookingStatus;
    adminNotes?: string;
    deliveryUrl?: string;
    previewUrls?: string[];
    serviceOffer?: {
        title: string;
        price?: number;
    };
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export const bookingsService = {
    getAll: async (params?: {
        status?: string;
        serviceOfferId?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.get('/bookings', { params });
        return response.data;
    },

    getCalendar: async (month: number, year: number) => {
        const response = await api.get('/bookings/calendar', {
            params: { month, year },
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    update: async (id: string, data: Partial<Booking>) => {
        const response = await api.patch(`/bookings/${id}`, data);
        return response.data;
    },

    updateStatus: async (id: string, status: BookingStatus) => {
        const response = await api.put(`/bookings/${id}/status`, { status });
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    }
};
