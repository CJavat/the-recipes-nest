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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer } from 'src/files/helpers/fileNamer.helper';
import { fileFilter } from 'src/files/helpers/fileFilter.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Delete('cancel-account')
  @UseGuards(AuthGuard())
  cancelAccount(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.usersService.cancelAccount(userId);
  }

  @Post('reactivate-account')
  reactivateAccount(@Body() body: { email: string }) {
    return this.usersService.reactivateAccount(body);
  }

  @Delete('permanently-delete')
  @UseGuards(AuthGuard())
  permanentlyDelete(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.usersService.permanentlyDelete(userId);
  }

  @Patch('change-image')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './public',
        filename: fileNamer,
      }),
    }),
  )
  changeImage(
    @Req() request: Express.Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['id'];

    return this.usersService.changeImage(userId, file);
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
}
