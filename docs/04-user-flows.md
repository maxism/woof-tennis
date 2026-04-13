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

## 3. Игрок: поиск тренера и бронирование

```mermaid
sequenceDiagram
    actor P as Игрок
    participant MA as Mini App
    participant API as Backend
    participant DB as PostgreSQL
    participant Bot as TG Bot

    P->>MA: Экран "Поиск тренеров"
    MA->>API: GET /users/:coachId/public
    API-->>MA: Профиль тренера + локации

    P->>MA: Выбирает локацию и дату
    MA->>API: GET /slots?coachId=X&locationId=Y&dateFrom=...&dateTo=...
    API-->>MA: Список доступных слотов

    P->>MA: Выбирает слот, нажимает "Забронировать"
    MA->>API: POST /bookings { slotId }
    API->>DB: Проверка доступности
    API->>DB: INSERT Booking
    API->>DB: UPDATE Slot status (если maxPlayers достигнут)
    API-->>MA: Booking created
    MA-->>P: Бронирование подтверждено

    API->>Bot: Отправить нотификацию тренеру
    Bot-->>C: "Новое бронирование: Иван, 14 апреля 09:00"
    API->>DB: INSERT Notification (тренеру)
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

## 5. Самостоятельная игра (инвайт-ссылка)

```mermaid
sequenceDiagram
    actor P1 as Игрок 1
    actor P2 as Игрок 2 (друг)
    participant MA as Mini App
    participant API as Backend
    participant TG as Telegram

    P1->>MA: Экран "Новая игра"
    P1->>MA: Вводит локацию, дату, время, комментарий
    MA->>API: POST /play-sessions
    API-->>MA: PlaySession { inviteCode: "abc123" }
    MA->>MA: Формирует ссылку: t.me/WoofTennisBot?startapp=play_abc123

    P1->>TG: Отправляет ссылку другу через Telegram
    TG-->>P2: Получает ссылку

    P2->>TG: Нажимает на ссылку
    TG->>MA: Открывает Mini App с параметром startapp=play_abc123
    MA->>MA: Парсит invite code из startapp
    MA->>API: GET /play-sessions/by-invite/abc123
    API-->>MA: PlaySession details

    P2->>MA: Нажимает "Присоединиться"
    MA->>API: POST /play-sessions/:id/join
    API-->>MA: Updated PlaySession

    API->>P1: Нотификация: "Друг присоединился к игре"
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
        C->>MA: Ставит рейтинг (какашки + звёзды)
        C->>MA: Пишет рекомендацию и комментарий
        MA->>API: POST /reviews { bookingId, targetId=player, poopRating, starRating, ... }
        API-->>MA: Review created
        API->>Bot: Нотификация игроку: "Тренер оставил отзыв"
    and Игрок оценивает
        P->>MA: Открывает экран оценки
        P->>MA: Ставит рейтинг тренеру
        MA->>API: POST /reviews { bookingId, targetId=coach, poopRating, starRating, ... }
        API-->>MA: Review created
        API->>Bot: Нотификация тренеру: "Игрок оставил отзыв"
    end
```

---

## 9. Дашборд — сетка тренировок

```mermaid
flowchart TD
    A[Пользователь открывает дашборд] --> B{Какие роли активны?}
    
    B -->|Только игрок| C[Показать тренировки как игрок]
    B -->|Только тренер| D[Показать расписание как тренер]
    B -->|Обе роли| E[Табы: Игрок / Тренер]
    
    C --> F["GET /bookings/my?dateFrom=today"]
    D --> G["GET /bookings/coach?dateFrom=today"]
    E --> F
    E --> G
    
    F --> H[Карточки бронирований]
    G --> I[Карточки слотов с бронированиями]
    
    H --> J[Каждая карточка: дата, время, тренер, локация, статус]
    I --> K["Каждая карточка: дата, время, игрок(и), локация, статус"]
    
    J --> L[Действия: отменить, оценить, посмотреть отзыв]
    K --> M["Действия: отменить, завершить, отметить 'не пришёл', назначить отыгрыш"]
```

---

## 10. Сводная таблица экранов и действий

| Экран | Роль | Ключевые действия |
|---|---|---|
| Мои тренировки (дашборд) | Игрок + Тренер | Просмотр ближайших тренировок, переход к деталям |
| Поиск тренеров | Игрок | Просмотр списка тренеров, переход к профилю |
| Профиль тренера | Игрок | Просмотр локаций, выбор слотов, бронирование |
| Детали бронирования | Игрок | Отмена, открытие сплита, оценка |
| Мои локации | Тренер | Добавление, редактирование, деактивация локаций |
| Расписание | Тренер | Добавление и редактирование шаблонов, ручное создание слотов |
| Детали слота | Тренер | Просмотр бронирований, отмена слота, завершение, отметка "не пришёл" |
| Новая игра | Игрок | Создание игровой сессии, отправка ссылки другу |
| Присоединение к игре | Игрок | Просмотр игровой сессии по инвайту, присоединение |
| Оценка | Оба | Выставление рейтинга (какашки + звёзды) и комментариев |
| Уведомления | Оба | Лента уведомлений, отметка прочитанных |
| Профиль | Оба | Просмотр профиля, переключение "стать тренером", просмотр отыгрышей |
