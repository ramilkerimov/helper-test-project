import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) { }

  async setProfilePhoto(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new BadRequestException('Photo not found');
    }
    const user = await this.usersRepository.findOneBy({ id: userId });

    user.imageProfileUrl = file.path;

    await this.usersRepository.save(user);

    of({ imagePath: file.path });

    return user;
  }

  async getProfilePhoto(res: any, userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    console.log(typeof user.imageProfileUrl);

    if (typeof user.imageProfileUrl === 'string') {
      return of({
        imagePath: res.sendFile(user.imageProfileUrl),
      });
    } else {
      throw new NotFoundException();
    }
  }

  async deleteProfilePhoto(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (user.imageProfileUrl !== null) {
      fs.unlink(user.imageProfileUrl, (err) => {
        if (err) {
          throw new InternalServerErrorException();
        }
      });
    }

    user.imageProfileUrl = null;

    await this.usersRepository.save(user);

    return user;
  }

  async setBackgroundPhoto(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new BadRequestException('Photo not found');
    }
    const user = await this.usersRepository.findOneBy({ id: userId });

    user.imageBackgroundUrl = file.path;

    await this.usersRepository.save(user);

    of({ imagePath: file.path });

    return user;
  }

  async getBackgroundPhoto(res: any, userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (user.imageBackgroundUrl !== null) {
      return of({
        imagePath: res.sendFile(user.imageBackgroundUrl),
      });
    } else {
      throw new NotFoundException();
    }
  }

  async deleteBackgroundPhoto(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (user.imageBackgroundUrl !== null) {
      fs.unlink(user.imageBackgroundUrl, (err) => {
        if (err) {
          throw new InternalServerErrorException();
        }
      });
    }

    user.imageBackgroundUrl = null;

    await this.usersRepository.save(user);

    return user;
  }
}
