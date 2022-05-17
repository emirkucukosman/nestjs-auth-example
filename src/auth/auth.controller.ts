import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

// Services
import { AuthService } from './auth.service';

// Guards
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJWTGuard } from './guards/refresht-jwt.guard';

// DTOs
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Constants
import { FINGERPRINT_COOKIE_NAME } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
    @Body() _loginDto: LoginDto,
  ) {
    // Login user
    const { accessToken, refreshToken, fingerprint } =
      await this.authService.login(req.user);

    // Set cookie
    response.cookie(FINGERPRINT_COOKIE_NAME, fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Response
    return { accessToken, refreshToken, user: req.user };
  }

  @HttpCode(200)
  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    // Register user
    const user = await this.authService.register(registerDto);

    // Login user
    const { accessToken, refreshToken, fingerprint } =
      await this.authService.login(user);

    // Set cookie
    response.cookie(FINGERPRINT_COOKIE_NAME, fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Response
    return { accessToken, refreshToken, user };
  }

  @UseGuards(RefreshJWTGuard)
  @Post('refresh_token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req, @Res({ passthrough: true }) response: Response) {
    // Logout user
    await this.authService.logout(req.user);

    // Set cookie
    response.cookie(FINGERPRINT_COOKIE_NAME, '', {
      maxAge: -1,
    });

    // Response
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
