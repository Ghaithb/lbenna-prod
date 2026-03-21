import { Module, NestModule, MiddlewareConsumer, Provider } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AssetsModule } from './assets/assets.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { SettingsModule } from './settings/settings.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServiceOffersModule } from './service-offers/service-offers.module';
import { PortfolioItemsModule } from './portfolio-items/portfolio-items.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PagesModule } from './pages/pages.module';
import { HealthModule } from './health/health.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { MessagesModule } from './messages/messages.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './middleware/audit.interceptor';
import { MarketingModule } from './marketing/marketing.module';
import { FaqModule } from './faq/faq.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    /*
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: 'memory', // Changed from 'redis' for local development reliability
        ttl: 60 * 60, // 1 hour
      }),
      inject: [ConfigService],
    }),
    */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    UploadModule,
    // PaymentModule, // Requires Stripe config + BookingsService circular
    // JobsModule,    // Requires Bull/Redis queue
    FaqModule,
    SearchModule,
    AssetsModule,
    SettingsModule,
    AnalyticsModule,
    // EmployeesModule,
    // FinanceModule,
    BookingsModule,
    ServiceOffersModule,
    PortfolioItemsModule,
    // QuotesModule,
    // ExpensesModule,
    PagesModule,
    HealthModule,
    AnnouncementsModule,
    MessagesModule,
    AuditLogsModule,
    MarketingModule,
    // SuppliersModule,
    CategoriesModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
