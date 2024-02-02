import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Res,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/users/users.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const storage = {
  storage: diskStorage({
    destination: path.join(process.cwd(), './src/images/uploads/'),
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('images')
@ApiTags('images')
@ApiBearerAuth()
export class ImagesController {
  constructor(private imagesService: ImagesService) { }

  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updated user avatar. Set profile photo',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    description: 'Photo not found',
  })
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', storage))
  async setProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Users> {
    return this.imagesService.setProfilePhoto(file, req.user.id);
  }

  @Get('/avatar')
  @ApiOkResponse({
    description: 'Get avatar. User profile photo',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'Photo not found at profile',
  })
  @UseGuards(AuthGuard())
  async getProfilePhoto(
    @Res() res: any,
    @Req() req: any,
  ): Promise<Observable<unknown>> {
    return this.imagesService.getProfilePhoto(res, req.user.id);
  }

  @Delete('/avatar')
  @ApiOkResponse({
    description: 'Updated user. Deleted url to profile inage url',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard())
  async deleteProfilePhoto(@Req() req: any): Promise<Users> {
    return this.imagesService.deleteProfilePhoto(req.user.id);
  }

  @Post('/background')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updated user background. Set profile background',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    description: 'Photo not found',
  })
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', storage))
  async setBackgroundPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Users> {
    return this.imagesService.setBackgroundPhoto(file, req.user.id);
  }

  @Get('/background')
  @ApiOkResponse({
    description: 'Get background photo',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'Photo not found at profile',
  })
  @UseGuards(AuthGuard())
  async getBackgroundPhoto(
    @Res() res: any,
    @Req() req: any,
  ): Promise<Observable<unknown>> {
    return this.imagesService.getBackgroundPhoto(res, req.user.id);
  }

  @Delete('/background')
  @ApiOkResponse({
    description: 'Updated user. Deleted url to background inage url',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard())
  async deleteBackgroundPhoto(@Req() req: any): Promise<Users> {
    return this.imagesService.deleteBackgroundPhoto(req.user.id);
  }
}
