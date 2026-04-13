# WoofTennis — Roadmap

## Фазы разработки

```mermaid
gantt
    title WoofTennis Development Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %Y

    section MVP
    Backend: auth, users, locations     :mvp1, 2026-04-14, 7d
    Backend: schedule, slots, bookings  :mvp2, after mvp1, 10d
    Backend: reviews, makeup, notifs    :mvp3, after mvp2, 7d
    Frontend: auth, layout, dashboard   :mvp4, 2026-04-14, 10d
    Frontend: coach flows               :mvp5, after mvp4, 10d
    Frontend: player flows, booking     :mvp6, after mvp5, 7d
    Frontend: reviews, notifications    :mvp7, after mvp6, 5d
    TG Bot: webhook, notifications      :mvp8, after mvp3, 5d
    Integration testing                 :mvp9, after mvp8, 5d
    Deploy MVP                          :milestone, after mvp9, 0d

    section v1.1 Play Sessions
    Backend: play sessions API          :ps1, after mvp9, 5d
    Frontend: create session, invite    :ps2, after ps1, 5d
    Deep linking integration            :ps3, after ps2, 3d

    section v1.2 Venues
    Backend: venues module              :v1, after ps3, 10d
    Frontend: venue management          :v2, after v1, 7d

    section v2.0 Marketplace
    Backend: player matching, search    :m1, after v2, 14d
    Frontend: player feed, filters      :m2, after m1, 10d
```

---

## Phase 1: MVP

Минимально жизнеспособный продукт. Покрывает основной цикл: тренер настраивает расписание, игрок бронирует тренировку.

### Включает

- Авторизация через Telegram
- Профиль пользователя с переключением тренер/игрок
- Тренер: управление локациями
- Тренер: шаблоны расписания + ручные слоты
- Тренер: просмотр бронирований своих слотов
- Игрок: просмотр профиля тренера и доступных слотов
- Игрок: бронирование индивидуальной тренировки
- Сплит-тренировки (открытие для присоединения)
- Отмена бронирования (правило 24ч)
- Оценки после тренировки (единая оценка 1-3 с визуальным стилем 💩/⭐ + рекомендации)
- Отыгрыши (makeup debts)
- Дашборд — сетка тренировок для обеих ролей
- Нотификации: in-app + push через TG-бот
- Напоминания за 2 часа до тренировки

### Не включает

- Самостоятельные игровые сессии
- Поиск тренеров (в MVP — по прямой ссылке/инвайту)
- Регистрация площадок
- Биржа игроков

---

## Phase 2: Play Sessions (v1.1)

Самостоятельная игра между игроками через инвайт-ссылки.

### Новая функциональность

- Создание игровой сессии (локация, дата, время, комментарий)
- Генерация инвайт-кода и deep link
- Шаринг ссылки через Telegram (shareUrl)
- Присоединение по ссылке
- Управление сессией (отмена, уход участника)
- Нотификации о присоединении

### Изменения в модели данных

Новые сущности: `PlaySession`, `PlaySessionParticipant` (уже спроектированы).

---

## Phase 3: Venues (v1.2)

Площадки регистрируются в системе и могут предлагать свои корты для бронирования.

### Новая функциональность

- **Venue** — новая сущность: организация-площадка (название, адрес, фото, описание, контакты)
- Venue admin — отдельная роль пользователя (аналогично isCoach, флаг isVenueAdmin)
- Venue может иметь несколько **Courts** (кортов) с характеристиками (покрытие, крытый/открытый)
- Venue может управлять расписанием кортов (аналогично тренерским слотам)
- Тренер при создании локации может привязать её к зарегистрированной Venue
- Игрок может бронировать корт напрямую (без тренера) — для самостоятельной игры

### Новые сущности

```
Venue
├── id, name, address, description, photoUrl, contactPhone, contactTelegram
├── adminId (FK → User)
└── isActive, createdAt

Court
├── id, venueId (FK → Venue)
├── name (e.g. "Корт 1"), surface (hard/clay/grass/indoor)
├── isIndoor, photoUrl
└── isActive

VenueSlot
├── id, courtId (FK → Court), date, startTime, endTime
├── priceInfo (text, информационно), status, source
└── createdAt
```

### Влияние на существующие модули

- `Location` получает опциональную привязку: `venueId` FK
- Поиск расширяется: тренеры + площадки
- PlaySession может привязываться к конкретному корту Venue

---

## Phase 4: Player Marketplace (v2.0)

Биржа поиска партнёров для игры.

### Новая функциональность

- **Player Profile** расширяется: уровень игры (beginner/intermediate/advanced/pro), предпочитаемое покрытие, район города
- **Match Request** — публичный запрос на поиск партнёра:
  - Локация (текст или привязка к Venue)
  - Дата / диапазон дат
  - Время / диапазон времени
  - Желаемый уровень партнёра
  - Тип: одиночная / парная
  - Комментарий
- Лента запросов с фильтрами (по дате, локации, уровню)
- Отклик на запрос (кнопка "Хочу играть")
- Создатель подтверждает или отклоняет
- Чат между игроками (или переход в TG-чат)

### Новые сущности

```
PlayerProfile
├── userId (FK), skillLevel, preferredSurface, cityArea, bio

MatchRequest
├── id, creatorId, locationText, venueId (optional)
├── dateFrom, dateTo, timeFrom, timeTo
├── desiredLevel, matchType (singles/doubles)
├── comment, status (open/matched/expired/cancelled)
├── maxRespondents

MatchResponse
├── id, matchRequestId, responderId
├── message, status (pending/accepted/rejected)
```

---

## Phase 5: Будущие идеи

| Фича | Описание | Приоритет |
|---|---|---|
| Платежная интеграция | Оплата тренировок/аренды через приложение (Telegram Payments или внешние) | Средний |
| Групповые тренировки | Тренер создаёт групповое занятие (4-8 человек), публичная запись | Средний |
| Статистика и прогресс | Графики прогресса игрока на основе оценок тренера | Низкий |
| Турниры | Мини-турниры между игроками площадки | Низкий |
| Видео-рекомендации | Тренер может прикрепить видео к отзыву | Низкий |
| i18n | Мультиязычность (рус/англ) | Средний |
| PWA offline | Оффлайн-просмотр расписания | Низкий |
| Admin panel | Веб-панель для модерации и аналитики | Средний |

---

## Технический долг (отслеживать)

| Задача | Когда возникнет | Описание |
|---|---|---|
| S3 для файлов | Phase 1+ | Перенести загрузку фото из локального `uploads/` в S3/MinIO |
| Rate limiting | Phase 1 | Добавить rate limiting на API (throttler) |
| Swagger docs | Phase 1 | Автогенерация OpenAPI из декораторов NestJS |
| E2E тесты | Phase 1+ | Покрытие критических флоу интеграционными тестами |
| WebSocket | Phase 4 | Real-time обновления для чата и мгновенных нотификаций |
| Database indexing audit | Phase 3+ | Анализ slow queries, добавление индексов |
| Soft deletes | Phase 2+ | Внедрить soft delete для всех сущностей (deletedAt) |
