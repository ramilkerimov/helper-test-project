import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @ApiOkResponse({
    description: '[]',
    type: [Users],
  })
  async getAllUsers(): Promise<Array<Users>> {
    return this.usersService.getAllUsers();
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({
    description: 'get current auth user',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async getCurrentUser(@Req() req): Promise<Users> {
    return this.usersService.getCurrentUser(req);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiOkResponse({
    description: 'get user by username or id',
    type: Users,
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  async getUserById(@Param('id') userId: number | string): Promise<Users> {
    return this.usersService.getUserById(userId);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({
    description: 'updated user',
    type: Users,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<Users> {
    return this.usersService.updateUser(updateUserDto, req.user.id);
  }
}
