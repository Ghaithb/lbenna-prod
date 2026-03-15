import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type AppSettings = {
  paymentEnabled: boolean;
  subscriptionPrice: number;
  promoFreeUntil: string | null;
  marketing_anniversary_automation_enabled: boolean;
  marketing_anniversary_coupon_value: number;
  marketing_anniversary_coupon_validity_days: number;
  // Contact settings
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  social_linkedin: string;
};

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private prisma: PrismaService) { }

  async onModuleInit() {
    await this.ensureDefaults();
  }

  private defaultSettings(): AppSettings {
    const envPrice = Number(process.env.SUBSCRIPTION_MONTHLY_PRICE || 29.99);
    return {
      paymentEnabled: true,
      subscriptionPrice: isNaN(envPrice) ? 29.99 : envPrice,
      promoFreeUntil: null,
      marketing_anniversary_automation_enabled: false,
      marketing_anniversary_coupon_value: 15,
      marketing_anniversary_coupon_validity_days: 30,
      contact_phone: '+216 71 000 000',
      contact_email: 'contact@lbennaproduction.tn',
      contact_address: 'Cyberpark, El Ghazala, Tunis',
      social_facebook: 'https://facebook.com',
      social_instagram: 'https://instagram.com',
      social_youtube: 'https://youtube.com',
      social_linkedin: 'https://linkedin.com',
    };
  }

  private async ensureDefaults() {
    const defaults = this.defaultSettings();
    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.prisma.globalSetting.findUnique({ where: { key } });
      if (!existing) {
        await this.prisma.globalSetting.create({
          data: {
            key,
            value: value === null ? '' : String(value),
            group: key.startsWith('social_') ? 'SOCIAL' : key.startsWith('contact_') ? 'CONTACT' : 'GENERAL',
          },
        });
      }
    }
  }

  async getAll(): Promise<AppSettings> {
    const settings = await this.prisma.globalSetting.findMany();
    const defaults = this.defaultSettings();
    const result: any = { ...defaults };

    settings.forEach((s) => {
      const defaultValue = (defaults as any)[s.key];
      if (typeof defaultValue === 'boolean') {
        result[s.key] = s.value === 'true';
      } else if (typeof defaultValue === 'number') {
        result[s.key] = Number(s.value);
      } else {
        result[s.key] = s.value === '' ? null : s.value;
      }
    });

    return result as AppSettings;
  }

  async getPublic() {
    const all = await this.getAll();
    const { paymentEnabled, subscriptionPrice, promoFreeUntil, ...contactInfo } = all;
    return { paymentEnabled, subscriptionPrice, promoFreeUntil, ...contactInfo };
  }

  async update(partial: Partial<AppSettings>): Promise<AppSettings> {
    for (const [key, value] of Object.entries(partial)) {
      await this.prisma.globalSetting.upsert({
        where: { key },
        update: { value: value === null ? '' : String(value) },
        create: {
          key,
          value: value === null ? '' : String(value),
          group: key.startsWith('social_') ? 'SOCIAL' : key.startsWith('contact_') ? 'CONTACT' : 'GENERAL',
        },
      });
    }
    return this.getAll();
  }
}
