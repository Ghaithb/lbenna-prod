import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class ClientGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Autoriser les CLIENTS et les ADMINS
        return user && (user.role === UserRole.CLIENT || user.role === UserRole.ADMIN);
    }
}
