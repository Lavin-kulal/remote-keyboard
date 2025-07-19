# FROM node:18.18.2-alpine

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./

# RUN apk add chromium

# RUN npm install

# COPY . ./

# RUN npm run build

# EXPOSE 3002

# CMD ["npm","start"]
# ─── Build React Frontend ───
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY Client/package*.json ./
RUN npm install
COPY Client ./
RUN npm run build

# ─── Build Backend ───
FROM node:18-alpine AS backend
WORKDIR /usr/src/app
RUN apk add --no-cache chromium

COPY Server/package*.json ./
RUN npm install
COPY Server .

# Compile TypeScript to JavaScript
RUN npm run build

# Copy frontend into backend's public folder
COPY --from=frontend /app/frontend/build ./public

# Port
EXPOSE 3002

# ✅ Run compiled backend
CMD ["node", "dist/app.js"]

