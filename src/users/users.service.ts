import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from './entities/user.entity';

// DTOs
import { RegisterUserDto } from './dto/register-user.dto';

// Interfaces
import { IUsersService } from './interfaces/IUsersService';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  register(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = this.userRepository.create(registerUserDto);
    return this.userRepository.save(newUser);
  }
}
