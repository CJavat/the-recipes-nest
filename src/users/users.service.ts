import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

import { UpdateUserDto } from './dto/update-user.dto';
import { isMoreThan30DaysOld } from './helpers/isMoreThan60DaysOld.helper';

@Injectable()
export class UsersService {
  private prismaClient = new PrismaClient();

  async findAll() {
    try {
      const users = await this.prismaClient.user.findMany();
      if (!users || users.length === 0)
        throw new NotFoundException('Users not found');

      return {
        users,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id: id },
      });
      if (!user || !user.isActive) {
        throw new NotFoundException('User not found');
      }

      return {
        user,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { user } = await this.findOne(id);
      if (user.id !== id)
        throw new UnauthorizedException(
          'No tienes permitido actualizar esta cuenta',
        );

      if (updateUserDto.password) {
        updateUserDto.password = bcryptjs.hashSync(updateUserDto.password, 10);
      }

      const updatedUser = await this.prismaClient.user.update({
        where: { id: id },
        data: {
          ...updateUserDto,
          updatedAt: new Date(),
        },
      });

      return {
        user: updatedUser,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async cancelAccount(id: string) {
    try {
      const { user } = await this.findOne(id);

      if (user.id !== id)
        throw new UnauthorizedException(
          'No tienes permitido borrar esta cuenta',
        );

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

      if (user.isActive) return;

      if (user.email !== email)
        throw new UnauthorizedException(
          'No tienes permitido reactivar esta cuenta',
        );

      if (isMoreThan30DaysOld(user.updatedAt))
        throw new UnauthorizedException('User has been deleted permanently');

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
      const { user } = await this.findOne(id);
      if (user.id !== id)
        throw new UnauthorizedException(
          'No tienes permitido borrar esta cuenta',
        );

      await this.prismaClient.user.delete({ where: { id } });

      return {
        message: `User with id ${id} has been deleted permanently`,
      };
    } catch (error) {
      throw error;
    }
  }
}
