import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class OperatorGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Autoriser les OPERATORS et les ADMINS
        return user && (user.role === UserRole.OPERATOR || user.role === UserRole.ADMIN);
    }
}
