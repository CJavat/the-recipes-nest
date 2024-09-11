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
import { fileFilter } from 'src/files/helpers/fileFilter.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  async changeImage(
    @Req() request: Express.Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['id'];

    const fileName = await this.cloudinaryService.uploadImage(file, 'users');

    if ('error' in fileName)
      throw new Error('Ha ocurrido un error al subir la foto');

    return this.usersService.changeImage(userId, fileName as UploadApiResponse);
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
