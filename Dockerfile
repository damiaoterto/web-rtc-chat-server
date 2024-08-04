FROM node:20-alpine3.19

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}}

WORKDIR /urs/app/src

COPY package*.json ./

RUN npm ci --silent

COPY ./ ./

EXPOSE 3000 9090

CMD [ "node", "-r", "dotenv/config", "src/main.mjs" ]
