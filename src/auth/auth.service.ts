import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) { }

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.usersRepository.save({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: user.id });

      return { token };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('This email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }
}
