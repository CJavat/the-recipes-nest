import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @Req() request: Express.Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = request.user['id'];

    return this.usersService.update(userId, updateUserDto);
  }

  @Delete('cancelAccount/:id')
  @UseGuards(AuthGuard())
  cancelAccount(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.usersService.cancelAccount(userId);
  }

  @Post('reactivateAccount')
  reactivateAccount(@Body() body: { email: string }) {
    return this.usersService.reactivateAccount(body);
  }

  @Delete('permanentlyDelete/:id')
  @UseGuards(AuthGuard())
  permanentlyDelete(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.usersService.permanentlyDelete(userId);
  }
}
