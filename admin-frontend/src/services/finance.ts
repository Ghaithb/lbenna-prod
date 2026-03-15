import { api } from '@/lib/api';

export interface FinanceOverview {
    totalRevenue: number;
    netSales: number;
    totalTax: number;
    totalPurchases: number;
    grossProfit: number;
    margin: number;
}

export interface MonthlyStat {
    revenue: number;
    pos: number;
    online: number;
}

export interface FinanceDashboardData {
    overview: FinanceOverview;
    charts: {
        monthly: MonthlyStat[];
    };
}

export const financeService = {
    getDashboard: async (start?: Date, end?: Date) => {
        const response = await api.get('/finance/dashboard', {
            params: {
                start: start?.toISOString(),
                end: end?.toISOString()
            }
        });
        return response.data;
    },

    getTransactions: async (start: Date, end: Date) => {
        const response = await api.get('/finance/transactions', {
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        });
        return response.data;
    }
};
