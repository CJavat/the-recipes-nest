import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

import { UpdateUserDto } from './dto/update-user.dto';
import { isMoreThan30DaysOld } from './helpers/isMoreThan60DaysOld.helper';
import { FilesService } from '../files/files.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UsersService {
  private prismaClient = new PrismaClient();

  constructor(private readonly filesService: FilesService) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const totalUsers = await this.prismaClient.user.count();
      const users = await this.prismaClient.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
        },
        skip: offset,
        take: limit,
      });
      if (!users || users.length === 0)
        throw new NotFoundException(['Users not found']);

      return {
        users,
        totalUsers,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalUsers / limit),
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
        },
      });
      if (!user || !user.isActive) {
        throw new NotFoundException(['User not found']);
      }

      return user;
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userExists = await this.findOne(id);
      if (userExists.id !== id)
        throw new UnauthorizedException([
          'You are not allowed to update this account',
        ]);

      if (updateUserDto.password) {
        updateUserDto.password = bcryptjs.hashSync(updateUserDto.password, 10);
      }

      const user = await this.prismaClient.user.update({
        where: { id: id },
        data: {
          ...updateUserDto,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async cancelAccount(id: string) {
    try {
      const user = await this.findOne(id);

      if (user.id !== id)
        throw new UnauthorizedException([
          'You are not allowed to delete this account',
        ]);

      // await this.user.delete({ where: { id: id } });
      await this.prismaClient.user.update({
        where: { id: id },
        data: { isActive: false, updatedAt: new Date() },
      });

      return {
        message: `User with id ${id} has been deleted succesfully`,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async reactivateAccount(body: { email: string }) {
    const { email } = body;

    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });

      if (user.isActive)
        return {
          message: `User with email ${email} is already active`,
        };

      if (user.email !== email)
        throw new UnauthorizedException([
          'You are not allowed to reactivate this account',
        ]);

      if (isMoreThan30DaysOld(user.updatedAt))
        throw new UnauthorizedException(['User has been deleted permanently']);

      await this.prismaClient.user.update({
        where: { email },
        data: { isActive: true, updatedAt: new Date() },
      });

      return {
        message: `User with email ${email} has been reactivated succesfully`,
      };
    } catch (error) {
      throw error;
    }
  }

  async permanentlyDelete(id: string) {
    //TODO: Si la cuenta tiene más de 3 meses inactiva borrarla. Condición: (isActive = false && updatedAt > 3Meses)
    try {
      const user = await this.findOne(id);
      if (user.id !== id)
        throw new UnauthorizedException([
          'You are not allowed to delete this account',
        ]);

      await this.prismaClient.user.delete({ where: { id } });

      return {
        message: `User with id ${id} has been deleted permanently`,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeImage(userId: string, file: UploadApiResponse) {
    const { url } = file;

    try {
      const user = await this.findOne(userId);
      if (user.id !== userId)
        throw new UnauthorizedException([
          'You are not allowed to update this account',
        ]);

      if (!file) throw new BadRequestException([`Image ${file} is not valid`]);

      const updatedUser = await this.prismaClient.user.update({
        where: { id: userId },
        data: {
          avatar: url.replace('http', 'https'),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
