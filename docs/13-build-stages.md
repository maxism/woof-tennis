# WoofTennis — Этапы сборки проекта

Документ фиксирует полный pipeline сборки для локальной разработки, CI и production-деплоя.  
Цель: дать архитектору и команде единый источник правды для обновления `README`.

## 1) Подготовка окружения

### Требования
- Node.js `20+`
- npm `11+`
- Docker + Docker Compose
- PostgreSQL (или контейнер `postgres` из `docker-compose.yml`)

### Проверка версий
```bash
node -v
npm -v
docker --version
docker compose version
```

## 2) Инициализация проекта

### Установка зависимостей монорепо
```bash
npm install
```

Что происходит:
- npm workspaces устанавливает зависимости корня и пакетов (`apps/*`, `packages/*`)
- формируется единый `node_modules` в корне
- готовится Turborepo pipeline (`turbo.json`)

### Настройка переменных окружения
```bash
cp .env.example .env
```

Минимально заполнить:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_URL`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_MINI_APP_URL`

## 3) Локальная сборка пакетов

### Полная сборка монорепозитория
```bash
npm run build
```

Эквивалент:
```bash
npx turbo build
```

Порядок сборки:
1. `@wooftennis/shared`
2. зависимые пакеты (сейчас: `@wooftennis/api`, позже также `@wooftennis/web`)

### Точечная сборка API
```bash
npm run build:api
```

### Точечная сборка web (когда пакет подключен)
```bash
npm run build:web
```

## 4) Локальный запуск разработки

### Запуск БД
```bash
docker compose up -d postgres
```

### Запуск dev-режима
```bash
npm run dev
```

Или отдельно:
```bash
npm run dev:api
npm run dev:web
```

## 5) Проверка качества перед merge

### TypeScript/линт/тесты
```bash
npm run lint
npm run test
```

### Быстрая проверка сборки критических пакетов
```bash
npx turbo build --filter=@wooftennis/shared --filter=@wooftennis/api
```

## 6) Миграции базы данных

Из корня:
```bash
npm run db:migration:generate -- -n MigrationName
npm run db:migration:run
npm run db:migration:revert
```

Или напрямую через workspace API:
```bash
npm run migration:generate --workspace=@wooftennis/api -- -n MigrationName
npm run migration:run --workspace=@wooftennis/api
npm run migration:revert --workspace=@wooftennis/api
```

## 7) Сборка Docker-образов

### Сборка backend-образа
```bash
docker compose build api
```

Внутри `apps/api/Dockerfile`:
1. Установка зависимостей в контексте корня монорепо
2. Сборка через `npx turbo build --filter=@wooftennis/api`
3. Копирование `dist` и runtime-зависимостей в финальный слой

### Запуск всего стека
```bash
docker compose up -d
```

Сервисы:
- `postgres`
- `api`
- `nginx`
- `certbot`

## 8) Production деплой (ручной сценарий)

```bash
git pull origin main
npm install
docker compose build api
docker compose up -d api
docker compose exec api npm run migration:run
```

Если менялся frontend:
```bash
VITE_API_URL=https://wooftennis.com npx turbo build --filter=@wooftennis/web
```

## 9) CI pipeline (GitHub Actions)

Файл: `.github/workflows/ci.yml`

Основные этапы:
1. `checkout`
2. `setup-node`
3. `npm ci`
4. `turbo build` (минимум shared + api)
5. (на `main`) deploy по SSH:
   - `git pull`
   - `npm ci`
   - `docker compose build api`
   - `docker compose up -d api`
   - `docker compose exec -T api npm run migration:run`

## 10) Чеклист готовности сборки

- `npm install` завершился без ошибок
- `npm run build` проходит локально
- миграции применяются (`npm run db:migration:run`)
- `docker compose build api` успешен
- `docker compose up -d` поднимает стек
- `GET /health` возвращает `status: ok`

## 11) Частые проблемы

### Turborepo: `Missing packageManager field`
Решение: убедиться, что в корневом `package.json` задано поле:
```json
"packageManager": "npm@11.9.0"
```

### Ошибки миграций в контейнере
- проверить `DB_*` переменные в `.env`
- убедиться, что `postgres` healthcheck в статусе `healthy`
- запускать миграции после поднятия `api` контейнера

### Telegram webhook не работает
- проверить `TELEGRAM_WEBHOOK_URL` и `TELEGRAM_WEBHOOK_SECRET`
- убедиться, что путь `/bot/webhook` доступен извне через Nginx
