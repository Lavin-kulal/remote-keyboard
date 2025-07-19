# FROM node:18.18.2-alpine

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./

# RUN apk add chromium

# RUN npm install

# COPY . ./

# RUN npm run build

# EXPOSE 3002

# CMD ["npm","start"]
# --------- Build React Frontend ---------
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY ../Client/package*.json ./
RUN npm install
COPY ../Client ./
RUN npm run build

# --------- Build Backend + Inject Frontend Build ---------
FROM node:18-alpine
WORKDIR /usr/src/app

# Optional: if using chromium inside backend
RUN apk add --no-cache chromium

COPY package*.json ./
RUN npm install

COPY . .

# ⬇️ Copy frontend build into backend static serving dir
COPY --from=frontend /app/frontend/build ./public

# Port exposed by backend (you wrote EXPOSE 3002)
EXPOSE 3002

CMD ["npm", "start"]
