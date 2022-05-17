import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

// Services
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'userEmailNotExists', async: true })
@Injectable()
export class UserEmailNotExists implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(text: string): Promise<boolean> {
    const userExists = await this.usersService.findOneByEmail(text);
    return !userExists;
  }

  defaultMessage(args: ValidationArguments) {
    return `This e-mail address (${args.value}) is already taken.`;
  }
}
