import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Other imports
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createHash, generateKeySync } from 'crypto';
import * as dayjs from 'dayjs';

// Services
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

// Entities
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/users/entities/user.entity';

// DTOs
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Interfaces
import { IAuthService } from './interfaces/IAuthService';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    const isPasswordMatch = user ? await compare(pass, user.password) : false;
    if (user && isPasswordMatch) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.register(registerDto);
  }

  async login(user: User) {
    const plainUser = instanceToPlain(user);

    // Generate fingerprint
    const fingerprint = uuidv4();
    const fingerprintHash = createHash('sha256')
      .update(fingerprint, 'utf-8')
      .digest('hex');

    // Generate refresh token
    const refreshToken = generateKeySync('hmac', { length: 64 })
      .export()
      .toString('hex');
    const refreshTokenExpiration = dayjs().add(1, 'day').toDate();

    const userRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (userRefreshToken) {
      await this.refreshTokenRepository.delete(userRefreshToken.id);
    }

    const refreshTokenEntity = this.refreshTokenRepository.create({
      refreshToken,
      user,
      expiresAt: refreshTokenExpiration,
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    // Return JWT, Refresh Token and Fingerprint
    return {
      accessToken: this.jwtService.sign({
        ...plainUser,
        fingerprintHash,
      }),
      refreshToken,
      fingerprint,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const userRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        refreshToken: refreshTokenDto.refreshToken,
      },
    });

    if (dayjs(userRefreshToken.expiresAt).isBefore(dayjs())) {
      await this.refreshTokenRepository.delete(userRefreshToken.id);
      throw new UnauthorizedException(null, 'Session expired');
    }

    const plainUser = instanceToPlain(userRefreshToken.user);

    return {
      accessToken: this.jwtService.sign({
        ...plainUser,
        fingerprintHash: refreshTokenDto.fingerprintHash,
      }),
    };
  }

  async logout(user: User) {
    const userRefreshToken = await this.refreshTokenRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (userRefreshToken) {
      await this.refreshTokenRepository.delete(userRefreshToken.id);
    }
  }
}
