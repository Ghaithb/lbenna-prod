import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('registration-status')
  @ApiOperation({ summary: 'Whether public admin signup is allowed (first admin only)' })
  getRegistrationStatus() {
    return this.authService.getRegistrationStatus();
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new client account' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('register-admin')
  @ApiOperation({ summary: 'Register admin (first account or with ADMIN_REGISTRATION_SECRET)' })
  async registerAdmin(@Body() body: RegisterAdminDto) {
    return this.authService.registerAdmin(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('client/login')
  @ApiOperation({ summary: 'Client login' })
  async clientLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  async adminLogin(@Request() req, @Body() loginDto: LoginDto) {
    console.log('[AUTH] Admin login success for:', req.user.email);
    return this.authService.loginAdmin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('client/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current client profile' })
  async getClientProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin profile' })
  async getAdminProfile(@Request() req) {
    return req.user;
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify JWT token' })
  async verifyToken(@Body() body: { token: string }) {
    return this.authService.verifyToken(body.token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() body: { token: string; password: any }) {
    // Note: Utilisation de password car auth.dto n'a pas forcément ResetPasswordDto
    return this.authService.resetPassword(body.token, body.password);
  }
}
