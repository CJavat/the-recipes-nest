#!/bin/sh
set -e

# Esperar a que la base de datos esté disponible
until nc -z recipes-db 5432; do
  echo "Waiting for database..."
  sleep 1
done

# Ejecutar migraciones y generar el cliente de Prisma
npx prisma migrate deploy
npx prisma generate

# Iniciar la aplicación
exec "$@"
