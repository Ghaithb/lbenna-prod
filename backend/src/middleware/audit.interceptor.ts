import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private auditLogsService: AuditLogsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user } = request;

        // Only log non-GET requests for Admin/Operator users
        if (method !== 'GET' && user && (user.role === 'ADMIN' || user.role === 'OPERATOR')) {
            return next.handle().pipe(
                tap(() => {
                    this.auditLogsService.create(
                        user.userId || user.id,
                        method,
                        url,
                        method === 'DELETE' ? { url } : body
                    ).catch(err => console.error('Audit Log failed', err));
                }),
            );
        }

        return next.handle();
    }
}
