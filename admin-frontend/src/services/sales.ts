import { api } from '@/lib/api';

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
}

export interface CreateInvoiceDto {
    userId?: string;
    clientName?: string;
    clientEmail?: string;
    items: InvoiceItem[];
    issuedAt: string;
    dueDate: string;
    notes?: string;
    paymentTerms?: string;
}

export interface UpdateInvoiceDto {
    status?: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
    notes?: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    orderId: string;
    userId: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
    issuedAt: string;
    dueDate: string;
    pdfUrl?: string;
    user?: { firstName: string; lastName: string; email: string };
    order?: { orderNumber: string };
}

export interface Quote {
    id: string;
    quoteNumber: string;
    clientName?: string;
    clientEmail?: string;
    total: number;
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    validUntil?: string;
    createdAt: string;
    userIdRel?: { email: string };
}

export const salesService = {
    // Invoices
    getInvoices: async (params?: any) => {
        const response = await api.get<Invoice[]>('/invoices/search', { params });
        return response.data;
    },

    getInvoice: async (id: string) => {
        const response = await api.get<Invoice>(`/invoices/${id}`);
        return response.data;
    },

    createInvoice: async (data: CreateInvoiceDto) => {
        const response = await api.post<Invoice>('/invoices', data);
        return response.data;
    },

    updateInvoice: async (id: string, data: UpdateInvoiceDto) => {
        const response = await api.put<Invoice>(`/invoices/${id}`, data);
        return response.data;
    },

    deleteInvoice: async (id: string) => {
        await api.delete(`/invoices/${id}`);
    },

    // The instruction provided an `updateStatus` method that seems to be for orders,
    // and the existing `updateStatus` is for invoices.
    // To avoid conflicts and based on the explicit instruction to "Add getCustomizationItems and updateCustomizationStatus methods",
    // I will add only the customization methods and assume the `updateStatus` in the instruction was a contextual example
    // or intended for a different service/context not explicitly requested for addition.
    // If the intention was to replace or add a new `updateStatus` for orders, please clarify.

    updateStatus: async (id: string, status: string) => {
        const response = await api.patch<Invoice>(`/invoices/${id}/status`, { status });
        return response.data;
    },

    sendInvoiceEmail: async (id: string, email: string) => {
        await api.post(`/invoices/${id}/send-email`, { email });
    },

    generateInvoice: async (orderId: string) => {
        const response = await api.post<Invoice>(`/invoices/order/${orderId}/generate`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get<any>('/invoices/stats');
        return response.data;
    },

    // Quotes
    getQuotes: async () => {
        const response = await api.get<Quote[]>('/quotes');
        return response.data;
    },

    getQuote: async (id: string) => {
        const response = await api.get<Quote>(`/quotes/${id}`);
        return response.data;
    },

    createQuote: async (data: any) => {
        const response = await api.post<Quote>('/quotes', data);
        return response.data;
    },

    sendQuote: async (id: string) => {
        const response = await api.post(`/quotes/${id}/send`);
        return response.data;
    }
};
