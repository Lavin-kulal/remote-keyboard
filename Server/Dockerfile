FROM node:18.18.2-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN apk add chromium

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3002

CMD ["npm","start"]