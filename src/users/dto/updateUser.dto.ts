import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({})
  @IsNotEmpty()
  @Matches(/^\d*[a-zA-Z][a-zA-Z0-9]*$/, {
    message: 'username must contain at least 1 character',
  })
  @MinLength(3, { message: 'Minimum username length is 3' })
  username: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  description: string;
}
