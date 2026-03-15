import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) { }

  async validateUser(email: string, password: string, isAdmin: boolean = false) {
    console.log(`[AUTH] Validating user: ${email} (isAdmin required: ${isAdmin})`);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn(`[AUTH] User not found: ${email}`);
      return null;
    }

    // Si on tente de se connecter en tant qu'admin, vérifier le rôle
    if (isAdmin && user.role !== 'ADMIN') {
      console.warn(`[AUTH] Login attempt as admin failed for ${email}: user has role ${user.role}`);
      return null;
    }

    if (!user.passwordHash) {
      console.warn(`[AUTH] User ${email} has no password hash`);
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      console.warn(`[AUTH] Invalid password for ${email}`);
      return null;
    }

    console.log(`[AUTH] User validated successfully: ${email}`);
    const { passwordHash, ...result } = user;
    return result;
  }

  async loginAdmin(user: any) {
    if (user.role !== 'ADMIN') {
      console.error(`[AUTH] loginAdmin called for non-admin user: ${user.email} (Role: ${user.role})`);
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
  }) {
    console.log('Registering user:', data.email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: (data.role as UserRole) || UserRole.CLIENT,
      },
    });

    const { passwordHash, ...result } = user;
    return this.login(result);
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Pour des raisons de sécurité, on ne dit pas si l'utilisateur existe ou non
      return { message: 'Si un compte existe pour cet email, un lien de réinitialisation sera envoyé.' };
    }

    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 heure de validité


    // Ensure the IDE picks up the newly generated Prisma types
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    // Envoyer l'email via le service de notification
    try {
      await this.notificationService.notifyPasswordReset(email, token);
      console.log(`[AUTH] Password reset email sent to ${email}`);
    } catch (error) {
      console.error(`[AUTH] Failed to send password reset email to ${email}`, error);
    }

    return { message: 'Si un compte existe pour cet email, un lien de réinitialisation sera envoyé.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: hashedPassword },
    });

    // Supprimer tous les tokens de réinitialisation de l'utilisateur après succès
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    return { message: 'Votre mot de passe a été réinitialisé avec succès.' };
  }
}
