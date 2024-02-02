import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) { }

  async getAllUsers(): Promise<Array<Users>> {
    return this.usersRepository.find({});
  }

  async getUserById(userId: number | string): Promise<Users> {
    let user: Users;
    console.log(typeof userId);

    if (isNaN(+userId)) {
      userId = String(userId).toLocaleLowerCase();
      user = await this.usersRepository.findOneBy({
        username: String(userId),
      });
    } else {
      user = await this.usersRepository.findOneBy({
        id: Number(userId),
      });
    }

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getCurrentUser(req: any): Promise<Users> {
    return req.user;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<Users> {
    const { description, name, username } = updateUserDto;
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException();
    }

    user.description = description;
    user.name = name;
    user.username = username.toLowerCase();

    await this.usersRepository.save(user);

    return user;
  }
}
