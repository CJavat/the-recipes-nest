import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaClient } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailsService {
  private prismaClient = new PrismaClient();

  constructor(private readonly mailerService: MailerService) {}

  async sendActivationToken(userId: string, token: string) {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!user)
        throw new InternalServerErrorException('An unknown error has occurred');

      // Agregar el token a la db
      await this.prismaClient.user.update({
        where: { id: user.id },
        data: { activationToken: token },
      });

      await this.mailerService.sendMail({
        to: user.email,
        from: { name: 'The Recipes', address: process.env.MAILER_EMAIL },
        subject: 'ACTIVA TU CUENTA',
        html: `
          <style>
            .button {
              width: 100%;
              border: 1px solid black;
              border-radius: 6px;
              padding: 6px 12px;
              font-weight: 600;
              background-color: #FFFFFF;
              text-decoration: none;
            }
            .text {
              color: #000000;
              text-decoration: none;
            }
          </style>

          <h1>The Recipes</h1>
          <h3>Gracias por registrarte</h3>
          
          <p>Por favor, activa tu cuenta para poder iniciar sesión</p>
          <p>Has click en el siguiente botón</p>
          
          <a href="${process.env.HOST_API}/api/auth/activate-account/${token}" class="button">
            <span class="">ACTIVAR MI CUENTA</span>
          </a>
          <p>Si no tú no creaste esta cuenta, por favor ignora el correo, no es necesario reportarlo.</p>
          
          
          <p>¡Muchas Gracias!</p>
        `,
      });

      return 'Se envió tu token de activación a tu correo electrónico, por favor revisa tu bandeja de entrada, no olvides revisar también tu bandeja de correos no deseados';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendEmailToUpdatePassword(email: string, token: string) {
    //TODO: Agregar el domino del link para la de angular o alguna pagina subida
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (!user)
        throw new InternalServerErrorException('An unknown error has occurred');

      await this.mailerService.sendMail({
        to: email,
        from: { name: 'The Recipes', address: process.env.MAILER_EMAIL },
        subject: 'ACTUALIZA TU CLAVE',
        html: `
          <style>
            .button {
              width: 100%;
              border: 1px solid black;
              border-radius: 6px;
              padding: 6px 12px;
              font-weight: 600;
              color: white;
              text-decoration: none;
            }
            .text {
              color: #fff;
              text-decoration: none;
            }
          </style>

          <h1>The Recipes</h1>
          
          <p>Para poder actualizar tu contraseña por favor</p>
          <p>Has click en el siguiente botón</p>
          
          <a href="${process.env.HOST_API}/api/auth/forgot-password/${token}" class="button">
            <span class="">ACTUALIZAR CONTRASEÑA</span>
          </a>

          <p>Si no tú no creaste esta cuenta, por favor ignora el correo, no es necesario reportarlo.</p>
          
          
          <p>¡Muchas Gracias!</p>
        `,
      });

      return 'Se envió un enlace a tu correo electrónico para que puedas actualizar tu contraseña, por favor revisa tu bandeja de entrada, no olvides revisar también tu bandeja de correos no deseados';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async passwordUpdatedSuccesfully(email: string) {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (!user)
        throw new InternalServerErrorException('An unknown error has occurred');

      await this.mailerService.sendMail({
        to: email,
        from: { name: 'The Recipes', address: process.env.MAILER_EMAIL },
        subject: '¡CLAVE ACTUALIZADO!',
        html: `
          <h1>The Recipes</h1>
          <h3>Se actualizó tu contraseña correctamente</h3>
          
          <p>Si no tú no solicitaste este cambio de contraseña, por favor ponte en contacto con nuestro equipo de IT.</p>

          <p>¡Muchas Gracias!</p>
        `,
      });

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
