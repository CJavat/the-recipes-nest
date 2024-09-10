FROM node:21-alpine3.19

WORKDIR /usr/src/app
COPY package.json ./

RUN yarn install

COPY . .

# Copia el script de inicialización
COPY init.sh /usr/src/app/init.sh
RUN chmod +x /usr/src/app/init.sh

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/init.sh"]
CMD ["yarn", "start:dev"]