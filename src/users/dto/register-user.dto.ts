import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Validate,
} from 'class-validator';

// Custom Validation
import { UserEmailNotExists } from '../validation/UserEmailNotExists';

export class RegisterUserDto {
  @Validate(UserEmailNotExists)
  @IsEmail({}, { message: 'Invalid e-mail address' })
  @MaxLength(255, {
    message: 'E-mail must be less than 255 characters',
  })
  @IsNotEmpty({ message: 'E-mail can not be empty' })
  @IsString({ message: 'E-mail must be a string' })
  email: string;

  @Length(8, 16, {
    message: 'Password must be minimum 8 and maximum 16 characters long',
  })
  @IsNotEmpty({ message: 'Password can not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
