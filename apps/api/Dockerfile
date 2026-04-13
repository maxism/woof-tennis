FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci

COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/

RUN npx turbo build --filter=@wooftennis/api

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "dist/main.js"]
