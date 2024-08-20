import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends PrismaClient {
  //TODO: Después cambiar para que en lugar de pedir el ID por los params, mejor obtener el ID desde los headers con el JWT.

  async findAll() {
    //TODO: Comprobar el ID mediante el JWT en los Headers.
    try {
      const users = await this.user.findMany();
      if (!users || users.length === 0)
        throw new NotFoundException('Users not found');

      return {
        users,
        ok: true,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.user.findUnique({ where: { id: id } });
      if (!user || !user.isActive) {
        throw new NotFoundException('User not found');
      }

      return {
        user,
        ok: true,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //TODO: Comprobar el ID mediante el JWT en los Headers.

    try {
      const { user } = await this.findOne(id);
      if (user.id !== id)
        throw new UnauthorizedException(
          'No tienes permitido actualizar esta cuenta',
        );

      if (updateUserDto.password) {
        updateUserDto.password = bcryptjs.hashSync(updateUserDto.password, 10);
      }

      const updatedUser = await this.user.update({
        where: { id: id },
        data: updateUserDto,
      });

      return {
        user: updatedUser,
        ok: true,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  async cancelAccount(id: string) {
    //TODO: Comprobar el ID mediante el JWT en los Headers.

    try {
      const { user } = await this.findOne(id);
      if (user.id !== id)
        throw new UnauthorizedException(
          'No tienes permitido borrar esta cuenta',
        );

      // await this.user.delete({ where: { id: id } });
      await this.user.update({ where: { id: id }, data: { isActive: false } });

      return {
        message: `User with id ${id} has been deleted succesfully`,
        ok: true,
      };
    } catch (error) {
      throw error.response ?? error;
    }
  }

  //TODO: Hacer otro para reactivar la cuenta.
  // Hacer que se pueda reactivar si la cuenta tiene menos de 3 meses inactiva
  async reactivateAccount() {
    throw new Error('Method not implemented');
  }

  //TODO: Hacer otro para eliminar la cuenta permanentemente.
  // Si la cuenta tiene más de 3 meses inactiva. Condición: (isActive = false && updatedAt > 3Meses  )  borrarla
  async permanentlyDelete() {
    throw new Error('Method not implemented');
  }
}
