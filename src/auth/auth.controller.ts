import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  UpdatePassword,
} from './dto';
import { AuthGuard } from '@nestjs/passport';

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
  activateAccount(@Param('token') token: string) {
    //TODO: Modificar después para que en lugar de que se vea la respuesta cruda al usuario, le salga un diseño más bonito

    return this.authService.activateAccount(token);
  }
}
