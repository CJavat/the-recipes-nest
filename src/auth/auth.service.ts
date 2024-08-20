import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService extends PrismaClient {
  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;

    try {
      const newPassword = bcryptjs.hashSync(password, 10);

      const newUser = await this.user.create({
        data: {
          password: newPassword,
          ...user,
        },
      });

      return {
        newUser,
        ok: true,
      };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002')
        throw new BadRequestException('Email already exists');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.user.findUnique({ where: { email } });
      if (!user || (user && !user.isActive))
        throw new NotFoundException('User not found');
      if (!bcryptjs.compareSync(password, user.password))
        throw new BadRequestException('Invalid password');

      const payload = {
        userId: user.id,
        email: user.email,
      };

      return {
        user,
        ok: true,
        token: jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: '7d',
        }),
      };
    } catch (error) {
      console.log(error);
      return {
        error: error.response ?? error,
        ok: false,
      };
    }
  }

  checkJwt() {
    //TODO: Crear el check-jwt y usarlo en el Guard
  }
}
