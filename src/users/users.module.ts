import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { UsersService } from './users.service';

// Entities
import { User } from './entities/user.entity';

// Validation
import { UserEmailNotExists } from './validation/UserEmailNotExists';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserEmailNotExists],
  exports: [UsersService],
})
export class UsersModule {}
