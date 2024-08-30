import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  UpdatePassword,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-token')
  @UseGuards(AuthGuard())
  checkToken(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.authService.checkToken({ userId });
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('forgot-password/:token')
  updateMyPassword(
    @Param('token') token: string,
    @Body() updatePassword: UpdatePassword,
  ) {
    return this.authService.updateMyPassword(token, updatePassword);
  }

  @Get('activate-account/:token')
  async activateAccount(@Param('token') token: string, @Res() res: Response) {
    const { ok, message } = await this.authService.activateAccount(token);
    if (!ok) return { ok, message };

    return res.sendFile('activateAccountTemplate.html', { root: 'public' });
  }
}
