import { api } from '@/lib/api';

export type AppSettings = {
  paymentEnabled: boolean;
  subscriptionPrice: number;
  promoFreeUntil: string | null;
  marketing_anniversary_automation_enabled: boolean;
  marketing_anniversary_coupon_value: number;
  marketing_anniversary_coupon_validity_days: number;
};

export const settingsService = {
  async getAll(): Promise<AppSettings> {
    const res = await api.get('/settings');
    return res.data as AppSettings;
  },
  async update(patch: Partial<AppSettings>): Promise<AppSettings> {
    const res = await api.put('/settings', patch);
    return res.data as AppSettings;
  },
};
