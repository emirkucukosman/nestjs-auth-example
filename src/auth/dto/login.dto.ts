import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Geçersiz E-posta adresi' })
  @IsNotEmpty({ message: 'E-posta adresi boş bırakılamaz' })
  @IsString({ message: 'E-posta adresi metinsel bir değer olmalıdır' })
  email: string;

  @IsNotEmpty({ message: 'Şifre boş bırakılamaz' })
  @IsString({ message: 'Şife metinsel bir değer olmalıdır' })
  password: string;
}
