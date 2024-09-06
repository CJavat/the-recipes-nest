import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  UpdatePassword,
} from './dto';
import { JwtPayload } from './interfaces';
import { MailsService } from 'src/mails/mails.service';
@Injectable()
export class AuthService {
  private prismaClient = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
  ) {}

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

      const token = this.checkJwt({ userId: newUser.id });
      const message = await this.mailsService.sendActivationToken(
        newUser.id,
        token,
      );

      return {
        ...newUser,
        token: token,
        message,
      };
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException(['Email already exists']);

      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (!user) throw new NotFoundException(['User not found']);
      if (!user.isActive)
        throw new UnauthorizedException([
          'user is not active, please activate it',
        ]);

      if (!bcryptjs.compareSync(password, user.password))
        throw new BadRequestException(['Invalid password']);

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
      if (!user) throw new NotFoundException(['User not found']);

      return {
        ...user,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async activateAccount(token: string) {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: { activationToken: token },
      });
      if (!user) throw new BadRequestException(['User not found']);

      await this.prismaClient.user.update({
        where: { id: user.id },
        data: { isActive: true, activationToken: '' },
      });

      return {
        ok: true,
        message: 'User activated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (!user)
        throw new NotFoundException([`User with email ${email} not found`]);

      const token = this.checkJwt({ userId: user.id });
      const message = await this.mailsService.sendEmailToUpdatePassword(
        email,
        token,
      );

      return {
        ok: true,
        message,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateMyPassword(token: string, updatePassword: UpdatePassword) {
    const { password } = updatePassword;

    try {
      const { userId }: JwtPayload = this.jwtService.verify(token);

      const user = await this.prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!user)
        throw new NotFoundException([`User with id ${user.id} not found`]);

      const newPassword = bcryptjs.hashSync(password, 10);
      await this.prismaClient.user.update({
        where: { id: user.id },
        data: { password: newPassword, updatedAt: new Date() },
      });

      await this.mailsService.passwordUpdatedSuccesfully(user.email);

      return {
        ok: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
