# WoofTennis — Пользовательские сценарии

## 1. Первый вход и авторизация через Telegram

```mermaid
sequenceDiagram
    actor U as Пользователь
    participant TG as Telegram
    participant MA as Mini App (React)
    participant API as Backend (NestJS)
    participant DB as PostgreSQL

    U->>TG: Нажимает кнопку бота / ссылку на Mini App
    TG->>MA: Открывает WebView, передаёт initData
    MA->>MA: Извлекает initData из window.Telegram.WebApp
    MA->>API: POST /auth/telegram { initData }
    API->>API: Валидация HMAC-SHA256 подписи
    API->>DB: UPSERT User по telegramId
    DB-->>API: User
    API->>API: Генерация JWT
    API-->>MA: { accessToken, user }
    MA->>MA: Сохраняет JWT, рендерит дашборд
    MA-->>U: Главный экран приложения
```

---

## 2. Тренер: добавление локации и настройка расписания

```mermaid
sequenceDiagram
    actor C as Тренер
    participant MA as Mini App
    participant API as Backend
    participant DB as PostgreSQL

    Note over C,MA: Тренер активирует роль в профиле
    C->>MA: Переключает isCoach = true
    MA->>API: PATCH /users/me { isCoach: true }
    API->>DB: UPDATE User SET isCoach = true
    API-->>MA: User updated
    MA-->>C: Появляется тренерское меню

    Note over C,MA: Добавление локации
    C->>MA: Экран "Мои локации" → "Добавить"
    C->>MA: Вводит название, адрес, загружает фото
    MA->>API: POST /locations (multipart)
    API->>DB: INSERT Location
    API-->>MA: Location created
    MA-->>C: Локация добавлена

    Note over C,MA: Настройка расписания
    C->>MA: Экран "Расписание" → "Добавить шаблон"
    C->>MA: Выбирает локацию, день, время, длительность, макс.игроков
    MA->>API: POST /schedule-templates
    API->>DB: INSERT ScheduleTemplate
    API-->>MA: Template created
    MA-->>C: Шаблон добавлен

    Note over C,DB: Автогенерация слотов (cron)
    API->>DB: SELECT active templates
    API->>DB: INSERT Slots для следующих 2 недель
    Note over API,DB: Пропускает уже существующие слоты
```

---

## 3. Тренер создаёт тренировку и назначает игрока (direct-attach)

```mermaid
sequenceDiagram
    actor C as Тренер
    participant MA as Mini App
    participant API as Backend
    participant DB as PostgreSQL
    participant Bot as TG Bot

    C->>MA: Нажимает "Создать" на Главной
    C->>MA: Выбирает тип (разовая/периодическая), время, локацию
    MA->>API: POST /coach/events
    API->>DB: INSERT Slot/Event
    API-->>MA: Event created

    C->>MA: Выбирает игрока из базы
    MA->>API: POST /coach/events/:id/attach-player { playerId }
    API->>DB: INSERT Booking (status: confirmed)
    API-->>MA: Booking created

    API->>Bot: Отправить уведомление игроку
    Bot-->>P: "Тренер назначил вам тренировку: 14 апреля 09:00"
    API->>DB: INSERT Notification (игроку)
```

---

## 4. Сплит-тренировка

```mermaid
flowchart TD
    A[Игрок 1 бронирует слот с maxPlayers >= 2] --> B[Booking создан, слот status = booked]
    B --> C{Игрок 1 хочет сплит?}
    C -->|Да| D["POST /bookings/:id/open-split"]
    C -->|Нет| E[Индивидуальная тренировка]
    D --> F["isSplitOpen = true, слот виден другим как 'доступен для сплита'"]
    F --> G[Игрок 2 видит слот в поиске]
    G --> H["POST /bookings { slotId }"]
    H --> I{maxPlayers достигнут?}
    I -->|Да| J["Slot status = full"]
    I -->|Нет| K["Slot status = booked, ещё есть места"]
    J --> L["Оба игрока + тренер получают нотификации"]
    K --> L
```

### Sequence-диаграмма сплит-тренировки

```mermaid
sequenceDiagram
    actor P1 as Игрок 1
    actor P2 as Игрок 2
    participant MA as Mini App
    participant API as Backend
    participant Bot as TG Bot

    P1->>MA: Бронирует слот (maxPlayers=2)
    MA->>API: POST /bookings { slotId }
    API-->>MA: Booking created

    P1->>MA: Нажимает "Открыть для сплита"
    MA->>API: POST /bookings/:id/open-split
    API-->>MA: isSplitOpen = true

    Note over P2,MA: Позже
    P2->>MA: Ищет слоты тренера, видит "доступен для сплита"
    P2->>MA: Нажимает "Присоединиться"
    MA->>API: POST /bookings { slotId }
    API-->>MA: Booking created, slot status = full

    API->>Bot: Нотификация Игроку 1 ("Игрок 2 присоединился")
    API->>Bot: Нотификация тренеру ("Слот заполнен")
```

---

## 5. Приглашение по ссылке (invite)

```mermaid
sequenceDiagram
    actor C as Тренер
    actor P as Игрок
    participant MA as Mini App
    participant API as Backend
    participant TG as Telegram

    C->>MA: Создаёт тренировку на Главной
    C->>MA: Нажимает "Поделиться инвайтом"
    MA->>API: POST /coach/events/:id/invite
    API-->>MA: Invite { code: "abc123" }
    MA->>MA: Формирует ссылку: t.me/WoofTennisBot?startapp=play_abc123

    C->>TG: Отправляет ссылку игроку
    TG-->>P: Игрок получает ссылку

    P->>TG: Нажимает на ссылку
    TG->>MA: Открывает Mini App с параметром startapp=play_abc123
    MA->>MA: Парсит invite code из startapp
    MA->>API: GET /invites/by-code/abc123
    API-->>MA: Event details + coach + location

    P->>MA: Нажимает "Принять приглашение"
    MA->>API: POST /invites/:id/accept
    API-->>MA: Booking created

    API->>C: Нотификация: "Игрок принял приглашение"
```

---

## 6. Отмена и перенос тренировки

```mermaid
flowchart TD
    A[Игрок хочет отменить бронирование] --> B{До тренировки > 24ч?}
    B -->|Да| C["PATCH /bookings/:id/cancel"]
    B -->|Нет| D{Кто отменяет?}
    D -->|Игрок| E["400: Отмена запрещена менее чем за 24ч"]
    D -->|Тренер| F["Тренер может отменить в любое время"]
    
    C --> G[Booking status = cancelled]
    F --> G
    
    G --> H[Пересчёт статуса слота]
    H --> I{Был full?}
    I -->|Да| J["Slot status → booked или available"]
    I -->|Нет| K["Slot status без изменений"]
    
    G --> L[Нотификация другой стороне]
    
    Note over E: Игрок может связаться с тренером
    Note over E: для согласования переноса
```

### Перенос тренировки

```mermaid
sequenceDiagram
    actor P as Игрок
    participant MA as Mini App
    participant API as Backend

    Note over P,API: Перенос = отмена + новое бронирование
    P->>MA: Открывает бронирование
    P->>MA: Нажимает "Отменить" (если > 24ч)
    MA->>API: PATCH /bookings/:id/cancel
    API-->>MA: Cancelled

    P->>MA: Ищет новый подходящий слот
    MA->>API: GET /slots?coachId=X&dateFrom=...
    API-->>MA: Available slots

    P->>MA: Бронирует новый слот
    MA->>API: POST /bookings { slotId }
    API-->>MA: New booking created
```

---

## 7. Тренер назначает отыгрыш

```mermaid
sequenceDiagram
    actor C as Тренер
    participant MA as Mini App
    participant API as Backend
    participant Bot as TG Bot
    actor P as Игрок

    Note over C: После тренировки, игрок не пришёл
    C->>MA: Открывает бронирование, отмечает "Не пришёл"
    MA->>API: PATCH /bookings/:id/no-show
    API-->>MA: Booking status = no_show

    C->>MA: Нажимает "Назначить отыгрыш"
    MA->>API: POST /makeup-debts { playerId, originalBookingId, reason }
    API-->>MA: MakeupDebt created (status: pending)

    API->>Bot: Нотификация игроку
    Bot-->>P: "Тренер назначил отыгрыш: причина..."
    API->>API: INSERT Notification (in-app)

    Note over C,P: Позже, когда игрок отыгрывает
    P->>MA: Бронирует новый слот у этого тренера
    Note over C: Тренер видит pending отыгрыш у игрока

    C->>MA: Привязывает отыгрыш к новому бронированию
    MA->>API: PATCH /makeup-debts/:id/resolve { makeupBookingId }
    API-->>MA: MakeupDebt status = resolved

    API->>Bot: Нотификация игроку: "Отыгрыш закрыт"
```

---

## 8. Оценка после тренировки (Review flow)

```mermaid
sequenceDiagram
    actor C as Тренер
    actor P as Игрок
    participant MA as Mini App
    participant API as Backend
    participant Bot as TG Bot

    Note over C,P: Тренировка завершена
    C->>MA: Отмечает бронирование как завершённое
    MA->>API: PATCH /bookings/:id/complete
    API-->>MA: Booking status = completed

    API->>Bot: Нотификация игроку: "Оставьте отзыв"
    API->>Bot: Нотификация тренеру: "Оцените ученика"

    par Тренер оценивает
        C->>MA: Открывает экран оценки
        C->>MA: Выбирает визуальный стиль (💩 или ⭐) и ставит оценку 1-3
        C->>MA: Пишет рекомендацию и комментарий
        MA->>API: POST /reviews { bookingId, targetId=player, ratingValue, ratingStyle, ... }
        API-->>MA: Review created
        API->>Bot: Нотификация игроку: "Тренер оставил отзыв"
    and Игрок оценивает
        P->>MA: Открывает экран оценки
        P->>MA: Выбирает визуальный стиль (💩 или ⭐) и ставит оценку 1-3
        MA->>API: POST /reviews { bookingId, targetId=coach, ratingValue, ratingStyle, ... }
        API-->>MA: Review created
        API->>Bot: Нотификация тренеру: "Игрок оставил отзыв"
    end
```

---

## 9. Дашборд — сетка тренировок

```mermaid
flowchart TD
    A[Пользователь открывает Главную] --> B{Какие роли активны?}
    B -->|Игрок| C["GET /events/my?dateFrom=today"]
    B -->|Тренер| D["GET /coach/events?dateFrom=today"]
    B -->|Обе роли| E[Сегмент: Как игрок / Как тренер]
    E --> C
    E --> D

    C --> F[Единая временная сетка игрока]
    D --> G[Единая временная сетка тренера]
    F --> H[Фильтр по локациям]
    G --> H
    H --> I[Карточки событий с единым форматом]

    I --> J[CTA Создать]
    J --> K{Контекст роли}
    K -->|Тренер| L[Создать тренировку/слот]
    K -->|Игрок| M[Создать самостоятельную игру]
```

---

## 10. Сводная таблица экранов и действий

| Экран | Роль | Ключевые действия |
|---|---|---|
| Главная (сетка событий) | Игрок + Тренер | Просмотр событий по времени, фильтр по локациям, CTA "Создать" |
| Детали события | Игрок + Тренер | Подтверждение/отмена/перенос, просмотр локации и участников |
| Мои локации | Тренер | Добавление, редактирование, деактивация локаций |
| Расписание | Тренер | Добавление и редактирование шаблонов, ручное создание слотов |
| Детали слота | Тренер | Просмотр бронирований, отмена слота, завершение, отметка "не пришёл" |
| Создание события (через CTA на Главной) | Игрок + Тренер | Создание игры/тренировки, direct-attach или invite |
| Принятие приглашения | Игрок | Просмотр деталей события по инвайту и подтверждение участия |
| Оценка | Оба | Выставление единой оценки 1-3 (в формате 💩 или ⭐) и комментариев |
| Профиль | Оба | Настройки, переключение "стать тренером", кабинет тренера, архив уведомлений |
