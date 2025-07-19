# FROM node:18.18.2-alpine

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./

# RUN apk add chromium

# RUN npm install

# COPY . ./

# RUN npm run build

# EXPOSE 3002

# CMD ["npm","start"]
# Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY Client/package*.json ./
RUN npm install
COPY Client ./
RUN npm run build

# Build backend
FROM node:18-alpine AS backend
WORKDIR /usr/src/app
RUN apk add --no-cache chromium

COPY Server/package*.json ./
RUN npm install
COPY Server .

# Copy frontend build into backend public dir
COPY --from=frontend /app/frontend/build ./public

EXPOSE 3002
CMD ["npm", "start"]
