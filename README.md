# The Recipes Nest - BACKEND

<p align="center">
  <a href="#" target="blank"><img src="./public/the-recipes-logo.png" width="200" style="margin: 0 30px" alt="The Recipes Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" style="margin: 0 30px" /></a>
</p>

## Dev

1. Copiar el archivo `.env.template` a `.env` y configurar las variables de entorno.
2. Ejecutar `docker compose up -d` para inicializar contenedor de docker.
3. Ejecutar `yarn install` para instalar las dependencias.
4. Ejecutar `npx prisma migrate deploy` para aplicar las migraciones pendientes.
5. Iniciar el servidor con `yarn start:dev`.

### Prisma

1. Ejecutar `npx prisma migrate deploy` para obtener los nuevos datos de las migraciones.
2. Ejecutar `npx prisma migrate dev` cuando se haga un cambio en el `schema.prisma`.
3. Cuando se haya un cambio en el esquema de prisma, ejecutar `npx prisma generate` para actualizar el cliente de prisma.
