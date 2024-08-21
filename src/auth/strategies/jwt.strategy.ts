import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

import { User, JwtPayload } from '../interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly prismaClient = new PrismaClient();

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;

    const user = await this.prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException(`Token not valid`);

    if (!user.isActive)
      throw new UnauthorizedException(`User is not active. Talk with an admin`);

    return user;
  }
}
