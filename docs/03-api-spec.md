# WoofTennis — REST API спецификация

**Base URL:** `/api/v1`

## Implementation Baseline (one-pager runtime contract)

Для IA vNext (`docs/18-pm-one-pager.md`) FE и BE работают по единому event-centric контракту в рантайме:
- read: `GET /events/my`, `GET /events/:eventId`, `GET /invites/:code`;
- create/assign: `POST /events`, `POST /events/:eventId/attach-player`, `POST /events/:eventId/invite`;
- invite actions: `POST /invites/:inviteId/accept`, `POST /invites/:inviteId/decline`;
- lifecycle: `PATCH /events/:eventId/cancel`, `PATCH /events/:eventId/reschedule`, `PATCH /events/:eventId/complete`.

Совместимость с существующими модулями:
- `slots/bookings/play-sessions` остаются внутренней доменной реализацией;
- event-эндпоинты являются обязательным публичным API для one-pager;
- клиент не агрегирует one-pager события из legacy read endpoint-ов.

Единая ошибка event-флоу:
- все ошибки возвращают `statusCode`, RU `message`, `error` и машинный `code`;
- обязательные коды для one-pager: `EVENT_TIME_CONFLICT`, `INVITE_EXPIRED`, `INVITE_INVALID`, `EVENT_ALREADY_FULL`, `EVENT_NOT_AVAILABLE`, `ROLE_FORBIDDEN`, `EVENT_NOT_FOUND`, `INVITE_ALREADY_RESOLVED`.

Все эндпоинты (кроме публичных `POST /auth/telegram` и `POST /auth/telegram/widget`) требуют JWT-токен в заголовке:

```
Authorization: Bearer <jwt_token>
```

Эндпоинты, отмеченные `[Coach]`, требуют `user.isCoach === true`.

---

## 0. Events & Invites (one-pager)

### Entity: Event (runtime DTO)

```json
{
  "id": "uuid",
  "coachId": "uuid",
  "playerId": "uuid | null",
  "locationId": "uuid",
  "startsAt": "2026-04-20T09:00:00Z",
  "endsAt": "2026-04-20T10:00:00Z",
  "status": "draft | invited | attached | accepted | declined | cancelled | rescheduled | completed",
  "inviteId": "uuid | null",
  "inviteExpiresAt": "2026-04-19T09:00:00Z | null",
  "source": "manual | template",
  "createdAt": "2026-04-14T10:00:00Z",
  "updatedAt": "2026-04-14T10:00:00Z"
}
```

### GET `/events/my`

Единый источник данных для Главной (оба контекста роли).

**Query params (required contract):**
- `role` (`player` | `coach`, required)
- `dateFrom` (ISO datetime, required)
- `dateTo` (ISO datetime, required)
- `locationId` (uuid, optional)

**Response 200:** `{ "items": Event[], "total": number }`

### GET `/events/:eventId`

Детали одного события для карточки/экрана.

**Errors:**
- `404` + `code=EVENT_NOT_FOUND` — событие не найдено/недоступно.

### POST `/events` `[Coach]`

Создать событие тренировки.

**Request Body:**

```json
{
  "location": {
    "mode": "existing",
    "locationId": "uuid"
  },
  "startsAtLocal": "2026-04-20T12:00",
  "timezone": "Europe/Moscow",
  "durationMinutes": 60,
  "recurrence": null
}
```

**Response 201:** `Event` со статусом `draft`.

**Location selector contract:**
- `location.mode = existing` + `locationId` — выбор существующей локации тренера;
- `location.mode = create` + `name/address` — inline-создание локации в том же flow, без отдельного перехода на экран локаций;
- при `mode=create` backend сначала создает `Location`, затем создает `Event`, и в ответе `Event.locationId` уже содержит новый `id`.

**Datetime & calendar semantics:**
- FE отправляет `startsAtLocal` (без `Z`) и `timezone`; backend конвертирует в UTC (`startsAt`, `endsAt`) и хранит UTC;
- `durationMinutes` обязательный (`30 | 60 | 90 | 120 | 150 | 180`), `endsAt` вычисляется сервером;
- событие не может начинаться в прошлом относительно `timezone`;
- если слот пересекается с другим событием тренера/игрока, backend возвращает `409` + `code=EVENT_TIME_CONFLICT`.

**Recurrence (MVP):**
- `recurrence = null` — разовое событие;
- для периодического события:

```json
{
  "frequency": "weekly",
  "interval": 1,
  "byWeekday": [1, 3],
  "untilDate": "2026-06-30"
}
```

- поддерживается только `frequency=weekly`, `interval` 1..4, `byWeekday` 0..6;
- backend materializes серию как набор независимых Event, связанные `recurrenceGroupId`;
- если часть серии конфликтует, backend создает только валидные экземпляры и возвращает `warnings` с датами пропуска (не 4xx).

### POST `/events/:eventId/attach-player` `[Coach]`

Прямое назначение игрока.

**Request Body:**

```json
{
  "playerId": "uuid"
}
```

**Response 200:** `Event` со статусом `attached`.

**Errors:**
- `409` + `code=EVENT_TIME_CONFLICT`
- `409` + `code=EVENT_NOT_AVAILABLE`
- `409` + `code=EVENT_ALREADY_FULL`

### POST `/events/:eventId/invite` `[Coach]`

Создать или переиздать инвайт.

**Request Body:**

```json
{
  "targets": [
    { "telegramName": "@known_player" },
    { "telegramName": "@new_player" }
  ],
  "expiresInHours": 24
}
```

**Response 200:**

```json
{
  "invites": [
    {
      "inviteId": "uuid",
      "code": "abc123",
      "expiresAt": "2026-04-19T09:00:00Z",
      "telegramName": "@known_player",
      "resolvedUserId": "uuid"
    },
    {
      "inviteId": "uuid",
      "code": "def456",
      "expiresAt": "2026-04-19T09:00:00Z",
      "telegramName": "@new_player",
      "resolvedUserId": null
    }
  ]
}
```

**Invite by Telegram name semantics:**
- `telegramName` нормализуется: trim + lowercase, допустим ввод с `@` или без;
- для известных пользователей (`resolvedUserId != null`) FE может дополнительно показывать avatar/name из autosuggest;
- для неизвестных `telegramName` invite все равно создается (`resolvedUserId = null`) и отрабатывает через TG bot flow при первом открытии ссылки; **FE не обязан** показывать отдельный CTA «пригласить через бота» — достаточно отправки списка целей на API, доставка приглашения — в Telegram;
- дубли внутри `targets` после нормализации запрещены (`400`).

### GET `/invites/:code`

Проверка invite-ссылки и preview события для игрока.

**Response 200:** `{ "inviteId": "uuid", "event": Event, "status": "pending | accepted | declined | expired" }`

**Errors:**
- `404` + `code=INVITE_INVALID`
- `410` + `code=INVITE_EXPIRED`

### POST `/invites/:inviteId/accept`

Принять приглашение.

**Response 200:** `Event` со статусом `accepted`.

**Errors:**
- `404` + `code=INVITE_INVALID`
- `410` + `code=INVITE_EXPIRED`
- `409` + `code=INVITE_ALREADY_RESOLVED`
- `409` + `code=EVENT_TIME_CONFLICT`

### POST `/invites/:inviteId/decline`

Отклонить приглашение.

**Response 200:** `Event` со статусом `declined`.

### PATCH `/events/:eventId/cancel` `[Coach]`

Отмена события.

**Response 200:** `Event` со статусом `cancelled`.

### PATCH `/events/:eventId/reschedule` `[Coach]`

Перенос события на новый слот.

**Request Body:**

```json
{
  "startsAt": "2026-04-21T09:00:00Z",
  "endsAt": "2026-04-21T10:00:00Z"
}
```

**Response 200:** `Event` со статусом `rescheduled`.

### PATCH `/events/:eventId/complete` `[Coach]`

Завершить событие.

**Response 200:** `Event` со статусом `completed`.

### FE/BE responsibility split (event create + invite)

- FE отвечает за UX (autocomplete, chips, calendar controls) и отправляет только контрактные поля без локальной бизнес-валидации конфликтов.
- BE отвечает за источник истины по времени/таймзоне/пересечениям, нормализацию `telegramName`, резолв известных пользователей и создание invite для неизвестных.
- FE может делать pre-check UX (например disabled submit), но любой окончательный reject/accept определяется ответом API.

---

## 1. Auth

### POST `/auth/telegram`

Авторизация через Telegram Mini App initData.

**Request Body:**

```json
{
  "initData": "query_id=...&user=...&auth_date=...&hash=..."
}
```

**Response 200:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "telegramId": 123456789,
    "firstName": "Иван",
    "lastName": "Петров",
    "username": "ivantennis",
    "photoUrl": "https://t.me/...",
    "isCoach": false,
    "createdAt": "2026-04-13T10:00:00Z"
  }
}
```

**Логика:**
1. Валидация HMAC-SHA256 подписи `initData` с использованием bot token.
2. Upsert пользователя по `telegramId`.
3. Генерация JWT с payload `{ sub: user.id, telegramId: user.telegramId }`.

**Errors:**
- `401` — невалидная подпись initData

### POST `/auth/telegram/widget`

Авторизация через [Telegram Login Widget](https://core.telegram.org/widgets/login) в обычном браузере. Подпись проверяется **отдельным** алгоритмом от Mini App `initData` ([Checking authorization](https://core.telegram.org/widgets/login#checking-authorization)).

**Контракт тела запроса:** JSON с **теми же именами полей (snake_case), что возвращает виджет** в `data-onauth(user)` или в query при редирект-режиме. Фронт передаёт объект **без переименования ключей** и **без добавления произвольных полей** — иначе вычисленный на сервере `hash` не совпадёт с переданным.

**Обязательные поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | Telegram user id |
| `first_name` | string | Имя |
| `auth_date` | integer | Unix time выдачи авторизации |
| `hash` | string | HMAC-подпись (hex), см. документацию Telegram |

**Опциональные поля** (включать в тело и в расчёт подписи **только если** они пришли от виджета):

| Поле | Тип |
|------|-----|
| `last_name` | string |
| `username` | string |
| `photo_url` | string |

**Пример Request Body:**

```json
{
  "id": 123456789,
  "first_name": "Иван",
  "last_name": "Петров",
  "username": "ivantennis",
  "photo_url": "https://t.me/i/userpic/320/....jpg",
  "auth_date": 1713000000,
  "hash": "abcdef0123..."
}
```

Минимально допустимый набор:

```json
{
  "id": 123456789,
  "first_name": "Иван",
  "auth_date": 1713000000,
  "hash": "..."
}
```

**Логика (сервер):**

1. Проверить типы и наличие обязательных полей.
2. Собрать `data_check_string` и проверить `hash` по алгоритму Login Widget (не смешивать с `initData`).
3. Проверить актуальность `auth_date` (рекомендуется тот же порядок величины, что и для Mini App, например не старше 24 ч — точное окно зафиксировать в коде и здесь при необходимости).
4. Upsert пользователя по `id` → `telegramId`, маппинг имён в доменную модель (`firstName`, `photoUrl` и т.д.).
5. Выдать тот же JWT и DTO `user`, что и для `POST /auth/telegram`.

**Response 200:** идентичен `POST /auth/telegram` (`accessToken`, `user`).

**Errors:**

- `400` — невалидное тело (типы, отсутствуют обязательные поля)
- `401` — невалидная подпись `hash` или отклонённый `auth_date`
- `429` — превышен лимит запросов на auth-эндпоинты (rate limiting; пороги — конфигурация сервера)

**Примечание:** домен страницы, на которой встроен виджет, должен быть зарегистрирован у бота через BotFather (`/setdomain`), см. `docs/14-onboarding-setup.md`.

---

## 2. Users

### GET `/users/me`

Получить профиль текущего пользователя.

**Response 200:**

```json
{
  "id": "uuid",
  "telegramId": 123456789,
  "firstName": "Иван",
  "lastName": "Петров",
  "username": "ivantennis",
  "photoUrl": "https://t.me/...",
  "isCoach": true,
  "createdAt": "2026-04-13T10:00:00Z",
  "stats": {
    "totalBookingsAsPlayer": 15,
    "totalBookingsAsCoach": 42,
    "avgRatingAsPlayer": 2.5,
    "avgRatingAsCoach": 2.8,
    "pendingMakeupDebts": 1
  }
}
```

### PATCH `/users/me`

Обновить профиль (переключение режима тренера).

**Request Body:**

```json
{
  "isCoach": true
}
```

**Response 200:** обновлённый объект User.

### GET `/users/:id/public`

Публичный профиль другого пользователя (для просмотра тренера).

**Response 200:**

```json
{
  "id": "uuid",
  "firstName": "Мария",
  "username": "masha_coach",
  "photoUrl": "...",
  "isCoach": true,
  "locations": [ ... ],
  "stats": {
    "totalStudents": 23,
    "avgRating": 2.7,
    "totalReviews": 45
  }
}
```

### GET `/users/search`

Поиск пользователя по Telegram username (nickname).  
Основной user-facing сценарий: фронт передаёт nickname, а не UUID.

**Query params:**
- `query` (string, required) — префикс поиска по `username`/telegram name, можно с `@` или без (`@ivan_tennis` / `ivan_tennis`)
- `limit` (number, optional, default `10`, max `20`)

**Response 200:**

```json
[
  {
    "id": "uuid",
    "firstName": "Иван",
    "lastName": "Петров",
    "username": "ivan_tennis",
    "photoUrl": "https://...",
    "isCoach": false
  }
]
```

**Поведение:**
- если username не найден/скрыт у пользователя — возвращается пустой массив `[]`;
- в выдаче только публичные поля (без `telegramId` и внутренних данных).
- endpoint используется для autosuggest при мультивыборе invite targets; FE не блокирует отправку неизвестных имен, даже если endpoint вернул `[]`.

---

## 3. Locations `[Coach]`

### GET `/locations`

Получить локации текущего тренера.

**Role expectation (baseline):**
- endpoint доступен **только тренеру**;
- при `user.isCoach === false` ожидаемый ответ: `403` (`Требуется доступ тренера`);
- `403` в этом сценарии считается корректным контрактным поведением, а не ошибкой валидации.

**Query params:**
- `isActive` (boolean, optional) — фильтр по активности

**Response 200:**

```json
[
  {
    "id": "uuid",
    "name": "Корт на Парке Горького",
    "address": "ул. Крымский Вал, 9",
    "photoUrl": "https://...",
    "isActive": true,
    "createdAt": "2026-04-13T10:00:00Z"
  }
]
```

### POST `/locations`

Создать локацию.

**Request Body (multipart/form-data):**

```
name: "Корт на Парке Горького"
address: "ул. Крымский Вал, 9"
photo: <file>  (optional)
```

**Response 201:** объект Location.

### PATCH `/locations/:id`

Обновить локацию.

**Request Body (multipart/form-data):**

```
name: "Обновлённое название"  (optional)
address: "Новый адрес"  (optional)
photo: <file>  (optional)
isActive: false  (optional)
```

**Response 200:** обновлённый объект Location.

### DELETE `/locations/:id`

Деактивировать локацию (soft delete — ставит `isActive = false`).

**Response 200:**

```json
{ "message": "Локация деактивирована" }
```

---

## 4. Schedule Templates `[Coach]`

### GET `/schedule-templates`

Получить шаблоны расписания текущего тренера.

**Query params:**
- `locationId` (uuid, optional)

**Response 200:**

```json
[
  {
    "id": "uuid",
    "locationId": "uuid",
    "location": { "id": "uuid", "name": "Корт на Парке Горького" },
    "dayOfWeek": 0,
    "startTime": "09:00",
    "endTime": "12:00",
    "slotDurationMinutes": 60,
    "maxPlayers": 1,
    "isActive": true
  }
]
```

### POST `/schedule-templates`

Создать шаблон расписания.

**Request Body:**

```json
{
  "locationId": "uuid",
  "dayOfWeek": 0,
  "startTime": "09:00",
  "endTime": "12:00",
  "slotDurationMinutes": 60,
  "maxPlayers": 2
}
```

**Validation:**
- `dayOfWeek`: 0-6
- `startTime` < `endTime`
- `slotDurationMinutes`: 30 | 60 | 90 | 120
- `maxPlayers`: 1-4
- Не должен пересекаться с существующими шаблонами на тот же день и локацию

**Response 201:** объект ScheduleTemplate.

### PATCH `/schedule-templates/:id`

Обновить шаблон.

**Request Body:**

```json
{
  "startTime": "10:00",
  "maxPlayers": 3,
  "isActive": false
}
```

**Response 200:** обновлённый объект.

### DELETE `/schedule-templates/:id`

Удалить шаблон. Уже сгенерированные слоты не удаляются.

**Response 204**

---

## 5. Slots

### GET `/slots`

Получить слоты тренера. Доступен всем авторизованным пользователям (для бронирования).

**Query params:**
- `coachId` (uuid, required)
- `locationId` (uuid, optional)
- `dateFrom` (date, required) — напр. `2026-04-14`
- `dateTo` (date, required) — напр. `2026-04-20`
- `status` (string, optional) — фильтр по статусу

**Response 200:**

```json
[
  {
    "id": "uuid",
    "coachId": "uuid",
    "locationId": "uuid",
    "location": { "id": "uuid", "name": "...", "address": "..." },
    "date": "2026-04-14",
    "startTime": "09:00",
    "endTime": "10:00",
    "maxPlayers": 2,
    "status": "available",
    "source": "template",
    "currentBookings": 0,
    "hasSplitOpen": false
  }
]
```

### POST `/slots` `[Coach]`

Ручное создание слота.

**Request Body:**

```json
{
  "locationId": "uuid",
  "date": "2026-04-15",
  "startTime": "14:00",
  "endTime": "15:00",
  "maxPlayers": 1
}
```

**Validation:**
- Дата не в прошлом
- Не пересекается с существующими слотами тренера на эту дату
- `startTime` < `endTime`

**Response 201:** объект Slot.

### PATCH `/slots/:id` `[Coach]`

Обновить/отменить слот.

**Request Body:**

```json
{
  "status": "cancelled",
  "startTime": "15:00",
  "endTime": "16:00"
}
```

**Бизнес-логика:**
- При отмене слота все активные бронирования переводятся в `cancelled`.
- Отправляются нотификации всем затронутым игрокам.

**Response 200:** обновлённый объект Slot.

### POST `/slots/generate` `[Coach]`

Принудительная генерация слотов из шаблонов на указанный период.

**Request Body:**

```json
{
  "dateFrom": "2026-04-14",
  "dateTo": "2026-04-27"
}
```

**Response 201:**

```json
{
  "generated": 24,
  "skipped": 3
}
```

---

## 6. Bookings

### GET `/bookings/my`

Получить мои бронирования (как игрок).

**Query params:**
- `status` (string, optional)
- `dateFrom` (date, optional)
- `dateTo` (date, optional)
- `page` (number, default 1)
- `limit` (number, default 20)

**Response 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "slot": {
        "id": "uuid",
        "date": "2026-04-14",
        "startTime": "09:00",
        "endTime": "10:00",
        "location": { "id": "uuid", "name": "...", "address": "..." }
      },
      "coach": { "id": "uuid", "firstName": "Мария", "photoUrl": "..." },
      "status": "confirmed",
      "isSplitOpen": false,
      "splitPartners": [],
      "review": null,
      "createdAt": "2026-04-13T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

### GET `/bookings/coach` `[Coach]`

Получить бронирования моих слотов (как тренер).

**Role expectation (baseline):**
- endpoint доступен **только тренеру**;
- при `user.isCoach === false` ожидаемый ответ: `403`.

**Query params:**
- `status` (`confirmed` | `cancelled` | `completed` | `no_show`, optional)
- `dateFrom` (date, optional)
- `dateTo` (date, optional)
- `page` (number, default `1`)
- `limit` (number, default `20`, max `100`)

**Validation semantics:**
- невалидный формат/значение query-параметров → `400`;
- лишние (неподдерживаемые) query-ключи → `400` (strict DTO whitelist).

**Response 200:** аналогичная структура с `player` вместо `coach`.

### POST `/bookings`

Создать бронирование.

**Request Body:**

```json
{
  "slotId": "uuid"
}
```

**Validation:**
- Слот существует и имеет статус `available` или `booked` (если сплит).
- Количество активных бронирований < `slot.maxPlayers`.
- Игрок не бронировал этот слот ранее.
- Дата слота не в прошлом.
- Нет конфликтов с другими бронированиями игрока на это время.

**Response 201:** объект Booking.

**Side effects:**
- Если достигнут `maxPlayers`, статус слота → `full`.
- Нотификация тренеру о новом бронировании.

### PATCH `/bookings/:id/cancel`

Отменить бронирование.

**Request Body:**

```json
{
  "reason": "причина отмены (необязательно)"
}
```

**Validation:**
- Если до начала тренировки < 24 часов, отмена запрещена (ответ `400`).
  - Исключение: тренер может отменить в любое время.

**Response 200:** обновлённый объект Booking со статусом `cancelled`.

**Side effects:**
- Статус слота пересчитывается (если был `full`, становится `booked` или `available`).
- Нотификация другой стороне.

### POST `/bookings/:id/open-split`

Открыть существующее бронирование для сплита.

**Response 200:**

```json
{
  "id": "uuid",
  "isSplitOpen": true
}
```

**Validation:**
- `slot.maxPlayers` > 1
- Бронирование принадлежит текущему пользователю
- Бронирование в статусе `confirmed`

### POST `/bookings/:id/close-split`

Закрыть бронирование для сплита.

**Response 200:** обновлённый объект с `isSplitOpen: false`.

### PATCH `/bookings/:id/complete` `[Coach]`

Отметить бронирование как завершённое.

**Response 200:** обновлённый объект со статусом `completed`.

### PATCH `/bookings/:id/no-show` `[Coach]`

Отметить игрока как не пришедшего.

**Response 200:** обновлённый объект со статусом `no_show`.

---

## 7. Play Sessions

### POST `/play-sessions`

Создать самостоятельную игровую сессию.

**Request Body:**

```json
{
  "locationText": "Лужники, корт №3",
  "date": "2026-04-16",
  "startTime": "18:00",
  "endTime": "20:00",
  "comment": "Играем на среднем уровне, нужен 4й",
  "maxPlayers": 4
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "creatorId": "uuid",
  "locationText": "Лужники, корт №3",
  "date": "2026-04-16",
  "startTime": "18:00",
  "endTime": "20:00",
  "comment": "Играем на среднем уровне, нужен 4й",
  "inviteCode": "abc123xyz",
  "inviteLink": "https://t.me/WoofTennisBot?startapp=play_abc123xyz",
  "status": "open",
  "maxPlayers": 4,
  "participants": [
    { "id": "uuid", "firstName": "Иван", "status": "confirmed" }
  ]
}
```

### GET `/play-sessions/my`

Мои игровые сессии (созданные мной и где я участник).

**Query params (целевой baseline для FE/BE/QA):**
- `dateFrom` (date, optional)
- `dateTo` (date, optional)
- `page` (number, default `1`)
- `limit` (number, default `20`, max `100`)

**Response 200 (целевой):**

```json
{
  "items": [
    {
      "id": "uuid",
      "creatorId": "uuid",
      "locationText": "Лужники, корт №3",
      "date": "2026-04-16",
      "startTime": "18:00",
      "endTime": "20:00",
      "comment": "Играем на среднем уровне, нужен 4й",
      "inviteCode": "abc123xyz",
      "status": "open",
      "maxPlayers": 4,
      "participants": [
        { "id": "uuid", "firstName": "Иван", "status": "confirmed" }
      ]
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}
```

### GET `/play-sessions/by-invite/:inviteCode`

Получить сессию по инвайт-коду (для присоединения по ссылке).

**Response 200:** объект PlaySession.

**Errors:**
- `404` — сессия не найдена или неактивна

### POST `/play-sessions/:id/join`

Присоединиться к игровой сессии.

**Response 201:** обновлённый объект PlaySession с новым участником.

**Validation:**
- Сессия в статусе `open`.
- Количество участников < `maxPlayers`.
- Пользователь ещё не является участником.

### POST `/play-sessions/:id/leave`

Покинуть игровую сессию.

**Response 200:** обновлённый объект PlaySession.

**Validation:**
- Создатель не может покинуть сессию (только отменить).

### PATCH `/play-sessions/:id/cancel`

Отменить сессию (только создатель).

**Response 200:** объект со статусом `cancelled`.

---

## 8. Reviews

### POST `/reviews`

Создать отзыв после тренировки.

**Request Body:**

```json
{
  "bookingId": "uuid",
  "targetId": "uuid",
  "ratingValue": 3,
  "ratingStyle": "star",
  "recommendation": "Работай над бэкхендом, замах слишком широкий",
  "comment": "Хорошая тренировка, прогресс есть"
}
```

**Validation:**
- Бронирование в статусе `completed`.
- `reviewerId` (из JWT) — участник бронирования (игрок или тренер слота).
- `targetId` — другой участник бронирования.
- Отзыв от этого автора на это бронирование ещё не существует.
- `ratingValue`: 1-3.
- `ratingStyle`: `poop` или `star` (только визуальный формат).
- Семантика единая: независимо от `ratingStyle`, 1 = слабая игра, 3 = сильная игра.

**Response 201:** объект Review.

### GET `/reviews`

Получить отзывы.

**Query params:**
- `targetId` (uuid, optional) — отзывы о конкретном пользователе
- `reviewerId` (uuid, optional) — отзывы от конкретного пользователя
- `page` (number, default 1)
- `limit` (number, default 20)

**Response 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "reviewer": { "id": "uuid", "firstName": "Мария", "photoUrl": "..." },
      "target": { "id": "uuid", "firstName": "Иван", "photoUrl": "..." },
      "ratingValue": 3,
      "ratingStyle": "star",
      "recommendation": "Работай над бэкхендом...",
      "comment": "Хорошая тренировка",
      "createdAt": "2026-04-14T12:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

---

## 9. Makeup Debts

### POST `/makeup-debts` `[Coach]`

Назначить отыгрыш игроку.

**Request Body:**

```json
{
  "playerId": "uuid",
  "originalBookingId": "uuid",
  "reason": "Не пришёл без предупреждения"
}
```

**Validation:**
- Бронирование принадлежит слоту текущего тренера.
- Бронирование в статусе `no_show` или `cancelled`.

**Response 201:** объект MakeupDebt.

### GET `/makeup-debts`

Получить отыгрыши.

**Query params:**
- `playerId` (uuid, optional) — для тренера: конкретного игрока
- `status` (string, optional)
- `role` ("coach" | "player") — от чьего лица

Если `role=player`, возвращает долги текущего пользователя. Если `role=coach`, возвращает назначенные текущим тренером.

**Response 200:**

```json
[
  {
    "id": "uuid",
    "coach": { "id": "uuid", "firstName": "Мария" },
    "player": { "id": "uuid", "firstName": "Иван" },
    "originalBooking": { ... },
    "makeupBooking": null,
    "reason": "Не пришёл без предупреждения",
    "status": "pending",
    "createdAt": "2026-04-13T10:00:00Z"
  }
]
```

### PATCH `/makeup-debts/:id/resolve` `[Coach]`

Закрыть отыгрыш (привязать к конкретному бронированию).

**Request Body:**

```json
{
  "makeupBookingId": "uuid"
}
```

**Response 200:** обновлённый объект со статусом `resolved`.

### PATCH `/makeup-debts/:id/cancel` `[Coach]`

Отменить отыгрыш.

**Response 200:** обновлённый объект со статусом `cancelled`.

---

## 10. Notifications

### GET `/notifications`

Получить нотификации текущего пользователя.

**Query params:**
- `isRead` (boolean, optional)
- `page` (number, default 1)
- `limit` (number, default 30)

**Response 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "type": "booking_created",
      "title": "Новое бронирование",
      "body": "Иван забронировал тренировку на 14 апреля в 09:00",
      "isRead": false,
      "metadata": { "bookingId": "uuid", "slotId": "uuid" },
      "createdAt": "2026-04-13T10:00:00Z"
    }
  ],
  "total": 25,
  "unreadCount": 3,
  "page": 1,
  "limit": 30
}
```

### PATCH `/notifications/:id/read`

Пометить нотификацию как прочитанную.

**Response 200:**

```json
{ "id": "uuid", "isRead": true }
```

### POST `/notifications/read-all`

Пометить все нотификации как прочитанные.

**Response 200:**

```json
{ "updated": 3 }
```

---

## Общие паттерны

### Пагинация

Эндпоинты со списками поддерживают offset-пагинацию:

```
?page=1&limit=20
```

Ответ всегда содержит:

```json
{ "items": [...], "total": 100, "page": 1, "limit": 20 }
```

### Ошибки

Все сообщения об ошибках возвращаются **на русском языке**. Формат единый:

```json
{
  "statusCode": 400,
  "message": "Нельзя отменить бронирование менее чем за 24 часа до тренировки",
  "error": "Ошибка валидации",
  "code": "BOOKING_CANCEL_NOT_ALLOWED"
}
```

`code` обязателен для всех endpoint-ов из раздела `Events & Invites` и рекомендуется для остальных модулей.

Для list endpoint-ов действует разделение причин:
- `400` — невалидный query (тип/формат/неподдерживаемый ключ);
- `403` — role-gated запрет доступа (например, coach-only endpoint вызван игроком).

### Стандартные HTTP-коды

| Код | Использование |
|---|---|
| `200` | Успешное обновление / получение |
| `201` | Успешное создание |
| `204` | Успешное удаление без тела ответа |
| `400` | Ошибка валидации / бизнес-логики |
| `401` | Не авторизован |
| `403` | Нет прав (не тренер, не владелец ресурса) |
| `404` | Ресурс не найден |
| `409` | Конфликт (дублирование, пересечение слотов) |
