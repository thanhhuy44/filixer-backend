import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty({
    default: 'Thanh Huy',
  })
  fullName: string;

  @IsEmail()
  @ApiProperty({
    default: 'user@gmail.com',
  })
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    default: '12345678x@X',
  })
  password: string;
}
