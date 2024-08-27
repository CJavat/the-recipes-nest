import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';
@Injectable()
export class AuthService {
  private prismaClient = new PrismaClient();

  constructor(private readonly jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, ...user } = createUserDto;

    try {
      const newEmail = email.toLowerCase();
      const newPassword = bcryptjs.hashSync(password, 10);

      const newUser = await this.prismaClient.user.create({
        data: {
          email: newEmail,
          password: newPassword,
          ...user,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
          createdAt: true,
        },
      });

      return {
        ...newUser,
        token: this.checkJwt({ userId: newUser.id }),
      };
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Email already exists');

      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (!user || (user && !user.isActive))
        throw new NotFoundException('User not found');
      if (!bcryptjs.compareSync(password, user.password))
        throw new BadRequestException('Invalid password');

      const { password: encryptedPassword, ...userWithNoPassword } = user;

      return {
        ...userWithNoPassword,
        token: this.checkJwt({ userId: user.id }),
      };
    } catch (error) {
      throw error;
    }
  }

  checkJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  async checkToken(payload: JwtPayload) {
    try {
      const token = this.jwtService.sign(payload);

      const user = await this.prismaClient.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) throw new NotFoundException('User not found');

      return {
        ...user,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
