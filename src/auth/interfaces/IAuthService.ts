// Entities
import { User } from 'src/users/entities/user.entity';

// DTOs
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';

export interface IAuthService {
  validateUser(email: string, pass: string): Promise<User | null>;
  register(registerDto: RegisterDto): Promise<User>;
  login(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    fingerprint: string;
  }>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
  }>;
  logout(user: User): Promise<void>;
}
