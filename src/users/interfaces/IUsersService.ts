import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from '../entities/user.entity';

export interface IUsersService {
  findOneByEmail(email: string): Promise<User | null>;
  register(createUserDto: RegisterDto): Promise<User>;
}
