import { api } from '@/lib/api';

export interface User {
    email: string;
    role: string;
}

export interface Employee {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    department: 'MANAGEMENT' | 'SALES' | 'FINANCE' | 'HR' | 'LOGISTICS' | 'PRODUCTION' | 'IT';
    hireDate: string;
    salary?: number;
    contractType?: string;
    status: 'ACTIVE' | 'LEAVE' | 'TERMINATED';
    notes?: string;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    salary?: number;
    contractType?: string;
    status?: string;
    notes?: string;
    // For creating the linked user account
    password?: string;
    role?: string;
}

export const employeesService = {
    getAll: async (params?: { skip?: number; take?: number; department?: string }) => {
        const response = await api.get('/employees', { params });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/employees/stats');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/employees/${id}`);
        return response.data;
    },

    create: async (data: CreateEmployeeDto) => {
        const response = await api.post('/employees', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateEmployeeDto>) => {
        const response = await api.patch(`/employees/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    },

    getLeaves: async (params?: { employeeId?: string }) => {
        const response = await api.get('/leaves', { params });
        return response.data;
    },

    createLeave: async (data: any) => {
        const response = await api.post('/leaves', data);
        return response.data;
    },

    updateLeaveStatus: async (id: string, data: { status: string, adminNotes?: string }) => {
        const response = await api.patch(`/leaves/${id}/status`, data);
        return response.data;
    }
};
