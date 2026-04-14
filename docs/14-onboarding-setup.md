# WoofTennis — с чего начать: настройка и Telegram

Этот документ для того, кто получил уже собранный код и хочет понять: **что куда положить**, **как зарегистрировать бота и Mini App**, **какие URL должны совпадать**.

## 1. Что из чего состоит


| Часть            | Где в репо        | Зачем                                   |
| ---------------- | ----------------- | --------------------------------------- |
| Фронт (Mini App) | `apps/web`        | React, открывается внутри Telegram      |
| Бэкенд           | `apps/api`        | API: Mini App (`initData`), в перспективе Login Widget; бот; БД |
| Общие типы       | `packages/shared` | Не настраивается отдельно               |
| База             | PostgreSQL        | Через Docker или свой инстанс           |


Поток: **Telegram** открывает **Mini App по HTTPS** → фронт дергает **API** → API проверяет подпись через **тот же токен бота**, что выдала Telegram.

## 2. Регистрация в Telegram (BotFather)

Делайте в [@BotFather](https://t.me/BotFather) в Telegram.

### 2.1 Создать бота

1. Команда `/newbot`
2. Имя и username бота (например `@WoofTennisBot`)
3. Скопируйте **токен** вида `123456789:AAH...` — это `TELEGRAM_BOT_TOKEN` в `.env`

### 2.2 Подключить Mini App к боту

1. Команда `/newapp` (или в меню бота: **Bot Settings → Configure Mini App**)
2. Укажите бота, название, описание, картинку
3. **URL Mini App** — публичный **HTTPS**-адрес, по которому открывается **собранный фронт** (корень сайта, где лежит `index.html`)
  - Локально без HTTPS Telegram Mini App **нормально не откроет** — для теста в TG нужен туннель (ngrok, cloudflared) или деплой на сервер с HTTPS.
4. Запомните **short name** Mini App — он участвует в ссылке вида `https://t.me/YourBot/shortname`

### 2.3 Кнопка меню (опционально, но удобно)

`/setmenubutton` → выберите бота → **Web App** → тот же **HTTPS URL**, что и у Mini App.

### 2.4 Команды

`/setcommands` → например: `start - Открыть приложение`

### 2.5 Домен для Login Widget (веб-вход в браузере)

Если на **обычном сайте** используется [Telegram Login Widget](https://core.telegram.org/widgets/login), Telegram проверяет **домен** страницы, с которой вызван виджет. Его нужно привязать к боту:

1. В [@BotFather](https://t.me/BotFather): `/setdomain`
2. Выберите бота
3. Укажите **домен без схемы и пути**, например `app.example.com` или `wooftennis.com`

Правила Telegram: только то, что допускает BotFather (обычно публичный домен с HTTPS на стороне сайта). Локальный `localhost` виджетом **не** подключают к прод-боту так же, как прод-домен — для разработки используют отдельного тестового бота, туннель с постоянным поддоменом или см. обсуждения в документации Telegram.

Двухканальная авторизация (виджет + Mini App) и контракт API: `docs/03-api-spec.md`, `docs/15-auth-dual-channel-architecture.md`.

---

**Куда вписать токен:** в корневой `.env` (см. ниже) переменная `TELEGRAM_BOT_TOKEN`.

**Куда вписать URL приложения:**

- `TELEGRAM_MINI_APP_URL` (корневой `.env`) — тот же базовый URL, что в BotFather для Mini App (без лишнего слэша в конце), например `https://app.example.com`
- Для **веб-входа в браузере** (Login Widget) см. `apps/web/.env.example` — переменная `VITE_TELEGRAM_BOT_USERNAME` (имя бота **без** `@`). Домен страницы с виджетом должен быть зарегистрирован через `/setdomain` у @BotFather (см. раздел про виджет в этом документе).

## 3. Файлы окружения: куда что класть

### 3.1 Корень репозитория — `.env`

Скопируйте `.env.example` → `.env` в **корне** монорепо. Сюда смотрит Docker Compose и типичный запуск API.

**Fail-fast (API и CLI миграций):** при старте проверяются обязательные переменные: `TELEGRAM_BOT_TOKEN`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`. Если чего-то нет в окружении процесса, приложение **не поднимает HTTP** и завершается с сообщением со списком отсутствующих ключей (а не «тихим» `401` на `/auth`). Отдельный `apps/api/.env` **не требуется**: достаточно корневого `.env` или переменных CI. В логах старта есть безопасная строка об **источнике** конфигурации (путь к загруженному корневому `.env` или маркер, что используется только env процесса), без значений секретов.

Правила `DB_HOST`/`DB_PORT`:
- local host run (API запущен на вашей машине): `DB_HOST=localhost`, `DB_PORT=5432` (если локальная БД на стандартном порту);
- docker compose run (API внутри compose): `DB_HOST=postgres`, `DB_PORT=5432`.


| Переменная                    | Откуда взять                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `DB_*`                        | Свой PostgreSQL или как в `docker-compose.yml`                                     |
| `JWT_SECRET`                  | Случайная длинная строка (секрет подписи JWT)                                      |
| `JWT_EXPIRES_IN`              | Опционально, например `7d`                                                         |
| `TELEGRAM_BOT_TOKEN`      | Токен из BotFather                                                                 |
| `TELEGRAM_MINI_APP_URL`   | HTTPS URL фронта (как в BotFather)                                                 |
| `TELEGRAM_WEBHOOK_URL`    | `https://ваш-домен/bot/webhook` — куда Telegram шлёт апдейты бота                  |
| `TELEGRAM_WEBHOOK_SECRET` | Сами придумайте секрет; тот же должен быть в настройках webhook (если используете) |
| `PORT`                        | Обычно `3000` для API                                                              |


Для базы данных:
- локальный запуск API напрямую: `DB_HOST=localhost`, `DB_PORT=5432` (или ваш порт);
- запуск API внутри `docker compose`: `DB_HOST=postgres`, `DB_PORT=5432`.

**Важно:** `TELEGRAM_WEBHOOK_URL` должен быть **доступен из интернета** по HTTPS и проксироваться на ваш Nest (путь `/bot/webhook`). В проде это обычно Nginx из `docker-compose`.

### 3.2 Фронт — `apps/web/.env`

Скопируйте `apps/web/.env.example` → `apps/web/.env`.


| Переменная                  | Значение                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL`          | Базовый URL API **без** `/api/v1` на конце. Локально с Vite proxy часто оставляют пустым `VITE_API_URL=` |
| `VITE_UI_LOCALE`            | `ru` или `en`                                                                                            |
| `VITE_TELEGRAM_BOT_USERNAME` | Имя бота без `@` для [Login Widget](https://core.telegram.org/widgets/login) на сайте; домен — через `/setdomain` |


При **сборке** фронта для продакшена задайте `VITE_API_URL=https://ваш-домен` (тот же хост, с которого доступен API, например через тот же Nginx).

## 4. Локальный запуск «всё вместе» (кратко)

Подробнее: `docs/13-build-stages.md`.

```bash
# из корня репозитория
cp .env.example .env
# заполните .env (минимум DB_*, JWT_SECRET, TELEGRAM_BOT_TOKEN)

cp apps/web/.env.example apps/web/.env

npm install
docker compose up -d postgres
npm run db:migration:run   # или как в вашем package.json
npm run dev                # или dev:api + dev:web отдельно
```

- API: обычно `http://localhost:3000`
- Web: обычно `http://localhost:5173` (Vite)

**Проверка без Telegram:** если в проекте есть `GET /health` — откройте в браузере.

**Проверка Mini App в Telegram:** нужен HTTPS на фронт и чтобы `TELEGRAM_BOT_TOKEN` и домен в BotFather совпадали с реальностью.

## 5. Продакшен: порядок мыслей

1. Поднять PostgreSQL, API, раздать статику фронта и проксировать `/api` → API (см. `docs/08-deployment.md`).
2. В `.env` на сервере: реальные `TELEGRAM_*`, `JWT_SECRET`, `DB_*`.
3. Собрать фронт с правильным `VITE_API_URL`.
4. В BotFather указать **тот же** URL Mini App, что отдаёт пользователям.
5. Убедиться, что `TELEGRAM_WEBHOOK_URL` совпадает с тем, что реально открывается снаружи, и что секрет webhook совпадает с `TELEGRAM_WEBHOOK_SECRET`.
6. Для Login Widget на сайте: домен зарегистрирован через `/setdomain` (п. 2.5).

## 6. Если что-то не работает


| Симптом                       | Куда смотреть                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------- |
| 401 при логине из Mini App    | Токен бота в `.env` не тот, что у бота в BotFather; или часы сервера сильно сбиты |
| CORS                          | `TELEGRAM_MINI_APP_URL` в `main.ts` API должен совпадать с origin Mini App        |
| Бот не отвечает / нет webhook | `TELEGRAM_WEBHOOK_URL`, HTTPS, Nginx, firewall                                    |
| Фронт не видит API            | `VITE_API_URL` при сборке, proxy в dev, один ли хост в проде                      |
| Виджет Telegram не грузится / ошибка домена | Для прод-сайта выполнен `/setdomain` для того же хоста, что в адресной строке |


Детали по Telegram: `docs/07-telegram-integration.md`.  
Детали по сборке: `docs/13-build-stages.md`.  
Деплой: `docs/08-deployment.md`.