import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Minimum password length is 8' })
  password: string;
}
