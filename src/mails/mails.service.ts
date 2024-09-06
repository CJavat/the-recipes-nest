import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaClient } from '@prisma/client';

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
        throw new InternalServerErrorException([
          'An unknown error has occurred',
        ]);

      // Agregar el token a la db
      await this.prismaClient.user.update({
        where: { id: user.id },
        data: { activationToken: token },
      });

      await this.mailerService.sendMail({
        to: user.email,
        from: { name: 'The Recipes', address: process.env.MAILER_EMAIL },
        subject: 'Activa tu cuenta de The Recipes',
        html: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Activa tu cuenta de The Recipes</title>
              <style>
                body {
                  background-color: #f6f6f6;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  width: 500px;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                }
                .img-logo {
                  width: 200px;
                  height: 200px;
                  margin-bottom: 20px;
                  border-radius: 10px;
                }
                .content {
                  text-align: start;
                  /* padding: 10px; */
                }
                .button {
                  display: inline-block;
                  width: fit-content;
                  border: 1px solid #0ea5e9;
                  border-radius: 6px;
                  padding: 12px;
                  font-weight: 600;
                  background-color: #ffffff;
                  text-decoration: none;
                  text-align: center;
                  margin: 0 auto;
                }
                .button:hover {
                  background-color: #082f49;
                }
                .button:hover > .text {
                  color: #fff;
                }
                .text {
                  color: #000000;
                  text-decoration: none;
                }
                .warning {
                  color: #0ea5e9;
                  margin-top: 10px;
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>The Recipes</h1>
                <img
                  src="${process.env.HOST_API}/the-recipes-logo.png"
                  alt="Logo The Recipes"
                  class="img-logo"
                />

                <div class="content">
                  <h3>¡Bienvenido a The Recipes!</h3>

                  <p>Por favor, activa tu cuenta para poder iniciar sesión</p>
                  <p>Has click en el siguiente botón</p>

                  <a
                    href="${process.env.HOST_API}/api/auth/activate-account/${token}"
                    class="button"
                  >
                    <span class="text">ACTIVAR MI CUENTA</span>
                  </a>
                  <p class="warning">
                    Si no tú no creaste esta cuenta, por favor ignora el correo, no es
                    necesario reportarlo.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      return 'Se envió tu token de activación a tu correo electrónico, por favor revisa tu bandeja de entrada, no olvides revisar también tu bandeja de correos no deseados';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendEmailToUpdatePassword(email: string, token: string) {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: { email },
      });
      if (!user)
        throw new InternalServerErrorException([
          'An unknown error has occurred',
        ]);

      await this.mailerService.sendMail({
        to: email,
        from: { name: 'The Recipes', address: process.env.MAILER_EMAIL },
        subject: 'Actualiza tu contraseña - The Recipes',
        html: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Actualiza tu contraseña - The Recipes</title>
              <style>
                body {
                  background-color: #f6f6f6;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  width: 500px;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                }
                .img-logo {
                  width: 200px;
                  height: 200px;
                  margin-bottom: 20px;
                  border-radius: 10px;
                }
                .content {
                  text-align: start;
                  /* padding: 10px; */
                }
                .button {
                  display: inline-block;
                  width: fit-content;
                  border: 1px solid #0ea5e9;
                  border-radius: 6px;
                  padding: 12px;
                  font-weight: 600;
                  background-color: #ffffff;
                  text-decoration: none;
                  text-align: center;
                  margin: 0 auto;
                }
                .button:hover {
                  background-color: #082f49;
                }
                .button:hover > .text {
                  color: #fff;
                }
                .text {
                  color: #000000;
                  text-decoration: none;
                }
                .warning {
                  color: #0ea5e9;
                  margin-top: 10px;
                  margin-bottom: 10px;
                }
              </style>
              </style>
            </head>
            <body>
              <div class="container">
                <h1>The Recipes</h1>
                <img
                  src="http://localhost:3000/the-recipes-logo.png"
                  alt="Logo The Recipes"
                  class="img-logo"
                />

                <div class="content">
                  <h3>Tu contraseña está a punto de actualizarse</h3>

                  <p>Lamentamos saber que tu contraseña se ha perdido.</p>
                  <p>Para poder actualizar tu contraseña por favor</p>
                  <p>Has click en el siguiente botón:</p>

                  <a
                    href="${process.env.FRONTEND_URL}/auth/forgot-password/${token}"
                    class="button"
                  >
                    <span class="text">ACTUALIZAR CONTRASEÑA</span>
                  </a>

                  <p class="warning">
                    Si no tú no creaste esta cuenta, por favor ignora el correo, no es
                    necesario reportarlo.
                  </p>

                  <p>¡Muchas Gracias!</p>
                </div>
              </div>
            </body>
          </html>
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
        throw new InternalServerErrorException([
          'An unknown error has occurred',
        ]);

      await this.mailerService.sendMail({
        to: email,
        from: { name: 'The Recipes', address: process.env.MAILER_EMAIL },
        subject: 'Tu contraseña se ha actualizado - The Recipes',
        html: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Tu contraseña se ha actualizado - The Recipes</title>
              <style>
                body {
                  background-color: #f6f6f6;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  width: 500px;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                }
                .img-logo {
                  width: 200px;
                  height: 200px;
                  margin-bottom: 20px;
                  border-radius: 10px;
                }
                .content {
                  text-align: start;
                  /* padding: 10px; */
                }
                .button {
                  display: inline-block;
                  width: fit-content;
                  border: 1px solid #0ea5e9;
                  border-radius: 6px;
                  padding: 12px;
                  font-weight: 600;
                  background-color: #ffffff;
                  text-decoration: none;
                  text-align: center;
                  margin: 0 auto;
                }
                .button:hover {
                  background-color: #082f49;
                }
                .button:hover > .text {
                  color: #fff;
                }
                .text {
                  color: #000000;
                  text-decoration: none;
                }
                .warning {
                  color: #0ea5e9;
                  margin-top: 10px;
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>The Recipes</h1>
                <img
                  src="${process.env.HOST_API}/the-recipes-logo.png"
                  alt="Logo The Recipes"
                  class="img-logo"
                />

                <div class="content">
                  <h3>Se actualizó tu contraseña correctamente</h3>

                  <p class="warning">
                    Si no tú no solicitaste este cambio de contraseña, por favor ponte en
                    contacto con nuestro equipo de IT.
                  </p>

                  <p>¡Muchas Gracias!</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
