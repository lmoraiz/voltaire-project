# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./
RUN npm ci
RUN npm run build

# Stage 2: Build backend
FROM node:22-alpine AS backend-build
WORKDIR /app/backend
COPY backend/ ./
RUN npm ci
RUN npm run build

# Stage 3: Production image
FROM node:22-alpine AS production
WORKDIR /app

COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]
