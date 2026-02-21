# 1. Установка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Сборка проекта
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Если используете Prisma или другую ORM, раскомментируйте генерацию клиента:
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npm run build

# 3. Production образ
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Копируем только необходимое из standalone сборки
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
# В standalone режиме Next.js создает собственный server.js
CMD ["node", "server.js"]