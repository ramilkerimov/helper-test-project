import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'jwt token as response',
  })
  @ApiConflictResponse({
    description: 'This email already exists',
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @ApiCreatedResponse({
    description: 'jwt token as response',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password or email',
  })
  async signIn(@Body() signInDto: SignInDto): Promise<{ token: string }> {
    return this.authService.signIn(signInDto);
  }
}
