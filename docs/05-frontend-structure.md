# WoofTennis — Фронтенд архитектура

## Tech Stack

| Технология | Версия | Назначение |
|---|---|---|
| React | 18+ | UI-фреймворк |
| Vite | 5+ | Сборщик, dev server |
| TypeScript | 5+ | Типизация |
| `@telegram-apps/sdk-react` | latest | Telegram Mini App SDK |
| React Router | v6 | Маршрутизация (BrowserRouter) |
| Zustand | 4+ | Глобальный стейт (auth, UI) |
| TanStack Query | 5+ | Серверный стейт, кэширование |
| Tailwind CSS | 3+ | Utility-first стилизация |
| Axios | latest | HTTP-клиент |
| date-fns | latest | Работа с датами |
| react-hot-toast | latest | Тост-нотификации |

## Расположение в монорепозитории

Фронтенд живёт в `apps/web/`. Типы, enum'ы и константы импортируются из `@wooftennis/shared` (см. `10-monorepo-structure.md`).

## Структура проекта

```
apps/web/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json                   # extends ../../tsconfig.base.json
├── package.json                    # name: @wooftennis/web
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                    # Entry point
    ├── App.tsx                     # Root: providers, router
    ├── api/                        # API layer
    │   ├── client.ts               # Axios instance с JWT interceptor
    │   ├── auth.ts                 # POST /auth/telegram (Mini App), /auth/telegram/widget (веб)
    │   ├── users.ts                # Users API calls
    │   ├── locations.ts            # Locations API calls
    │   ├── schedule-templates.ts   # Schedule Templates API calls
    │   ├── slots.ts                # Slots API calls
    │   ├── bookings.ts             # Bookings API calls
    │   ├── events.ts               # Event-centric API calls (/events/*)
    │   ├── invites.ts              # Invite API calls (/invites/*)
    │   ├── play-sessions.ts        # Play sessions (вне core one-pager)
    │   ├── reviews.ts              # Reviews API calls
    │   ├── makeup-debts.ts         # Makeup Debts API calls
    │   └── notifications.ts        # Notifications API calls
    ├── hooks/                      # React Query hooks
    │   ├── useAuth.ts
    │   ├── useUser.ts
    │   ├── useLocations.ts
    │   ├── useScheduleTemplates.ts
    │   ├── useSlots.ts
    │   ├── useBookings.ts
    │   ├── usePlaySessions.ts
    │   ├── useReviews.ts
    │   ├── useMakeupDebts.ts
    │   └── useNotifications.ts
    ├── stores/                     # Zustand stores
    │   ├── authStore.ts            # JWT, user, isAuthenticated
    │   └── uiStore.ts             # activeTab (player/coach), modals
    ├── pages/                      # Страницы (по роутам)
    │   ├── Home/
    │   │   └── HomePage.tsx        # Дашборд — сетка тренировок
    │   ├── Profile/
    │   │   └── ProfilePage.tsx     # Профиль, переключатель coach
    │   ├── Coach/
    │   │   ├── LocationsPage.tsx   # Управление локациями
    │   │   ├── LocationFormPage.tsx# Создание/редактирование локации
    │   │   ├── SchedulePage.tsx    # Управление расписанием
    │   │   ├── TemplateFormPage.tsx# Создание/редактирование шаблона
    │   │   ├── SlotDetailPage.tsx  # Детали слота (бронирования)
    │   │   └── ManualSlotPage.tsx  # Ручное создание слота
    │   ├── Player/
    │   │   ├── InviteAcceptPage.tsx # Принятие приглашения по инвайту
    │   │   ├── EventDetailPage.tsx  # Детали события (игрок)
    │   │   └── MyGamesPage.tsx      # Самостоятельные игры игрока (лист/архив)
    │   ├── Play/
    │   │   ├── CreateEventPage.tsx # Универсальный сценарий создания через CTA
    │   │   └── JoinSessionPage.tsx # Присоединение по play-session deep link
    │   ├── Reviews/
    │   │   └── ReviewFormPage.tsx  # Оценка после тренировки
    │   └── Notifications/
    │       └── NotificationsPage.tsx # Архив в профиле (без отдельного таба)
    ├── components/                 # Переиспользуемые компоненты
    │   ├── auth/
    │   │   └── TelegramLoginWidget.tsx  # Login Widget (веб-канал)
    │   ├── ui/                     # Базовый UI-кит
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Avatar.tsx
    │   │   ├── Spinner.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── PageHeader.tsx
    │   ├── layout/
    │   │   ├── AppLayout.tsx       # Обёртка: навигация + контент
    │   │   ├── TabBar.tsx          # Нижняя навигация
    │   │   └── RoleSwitch.tsx      # Переключатель Игрок/Тренер
    │   ├── booking/
    │   │   ├── BookingCard.tsx     # Карточка бронирования
    │   │   ├── BookingList.tsx     # Список бронирований
    │   │   └── SlotPicker.tsx      # Выбор слота (сетка)
    │   ├── schedule/
    │   │   ├── WeekView.tsx        # Недельное представление
    │   │   ├── DayColumn.tsx       # Колонка одного дня
    │   │   └── SlotCard.tsx        # Карточка слота
    │   ├── review/
    │   │   ├── RatingPicker.tsx    # Единая оценка 1-3 (визуально: какашки/звёзды)
    │   │   ├── ReviewCard.tsx      # Карточка отзыва
    │   │   └── ReviewList.tsx
    │   ├── play/
    │   │   ├── SessionCard.tsx     # Карточка игровой сессии
    │   │   └── InviteLinkShare.tsx # Кнопка "Поделиться ссылкой"
    │   └── notification/
    │       ├── NotificationCard.tsx
    │       └── NotificationBadge.tsx # Индикатор непрочитанных
    ├── utils/
    │   ├── telegram.ts             # Хелперы для TG Mini App SDK
    │   ├── date.ts                 # Форматирование дат
    │   ├── invite.ts               # Генерация и парсинг инвайт-ссылок
    │   ├── constants.ts            # Маршруты
    │   └── i18n.ts                 # Словарь UI-строк (русский — основной язык)
    └── styles/
        └── globals.css             # Tailwind directives, TG theme vars
```

**Что не хранится в apps/web:**
- Типы сущностей (`User`, `Booking`, `Slot` и т.д.) — в `@wooftennis/shared`
- Enum'ы (`BookingStatus`, `SlotStatus` и т.д.) — в `@wooftennis/shared`
- Константы (`DAYS_OF_WEEK`, `ALLOWED_SLOT_DURATIONS`) — в `@wooftennis/shared`

## Маршрутизация

```tsx
<BrowserRouter>
  <Routes>
    {/* Общие */}
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="profile/notifications" element={<NotificationsPage />} />

      {/* Тренер (guard: isCoach) */}
      <Route path="coach">
        <Route path="locations" element={<LocationsPage />} />
        <Route path="locations/new" element={<LocationFormPage />} />
        <Route path="locations/:id/edit" element={<LocationFormPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="schedule/template/new" element={<TemplateFormPage />} />
        <Route path="schedule/template/:id/edit" element={<TemplateFormPage />} />
        <Route path="schedule/slot/new" element={<ManualSlotPage />} />
        <Route path="slot/:id" element={<SlotDetailPage />} />
      </Route>

      {/* Игрок */}
      <Route path="player">
        <Route path="invite/:code" element={<InviteAcceptPage />} />
        <Route path="event/:id" element={<EventDetailPage />} />
        <Route path="games" element={<MyGamesPage />} />
      </Route>

      {/* Создание через CTA на Главной */}
      <Route path="play">
        <Route path="create" element={<CreateEventPage />} />
        <Route path=":inviteCode" element={<JoinSessionPage />} />
      </Route>

      {/* Отзывы */}
      <Route path="review/:bookingId" element={<ReviewFormPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Routing contract fix (coach cabinet):**
- пункт `Локации` в `Профиль -> Кабинет тренера` всегда ведет на `/coach/locations`;
- переход на `/profile/coach/locations` считается legacy и должен редиректиться на `/coach/locations`;
- FE не должен собирать путь вручную строкой, только через централизованную константу route.

## Нижняя навигация (TabBar)

Для MVP навигация упрощена и не меняется по роли:

| Иконка | Лейбл | Маршрут |
|---|---|---|
| Calendar | Главная | `/` |
| User | Профиль | `/profile` |

Ключевые правила:
- На `Главной` всегда есть primary CTA `Создать`.
- `Игра` и `Тренеры` убраны из tabbar: создание/назначение теперь идет через CTA и сценарии invite/direct-attach.
- `Уведомления` перенесены в `Профиль -> Уведомления` (`/profile/notifications`) и дублируются в Telegram.
- Для dual-role пользователей сохраняется сегментированный контрол "Как игрок" / "Как тренер" на Главной.

## Стейт-менеджмент

### Auth Store (Zustand)

```typescript
import type { UserWithStats } from '@wooftennis/shared';
import type { TelegramWidgetAuthPayload } from './api/auth';

interface AuthState {
  token: string | null;
  user: UserWithStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (initData: string) => Promise<void>;
  loginWithWidget: (payload: TelegramWidgetAuthPayload) => Promise<void>;
  setSession: (token: string, user: UserWithStats) => void;
  logout: () => void;
  updateUser: (data: Partial<UserWithStats>) => void;
  setLoading: (v: boolean) => void;
}
```

### UI Store (Zustand)

```typescript
interface UIState {
  activeRole: 'player' | 'coach';
  setActiveRole: (role: 'player' | 'coach') => void;
}
```

**Coach mode toggle contract (copy + behavior):**
- label: `Режим тренера` (вместо action-copy `Стать тренером`);
- toggle `off -> on` отправляет `PATCH /users/me { isCoach: true }`, после успеха переключает `activeRole='coach'`;
- toggle `on -> off` меняет только UI контекст (`activeRole='player'`) и не отправляет `isCoach:false` для MVP;
- если у пользователя `isCoach=false`, coach-секции в профиле показывают CTA `Включить режим тренера`.

### Server State (TanStack Query)

Все данные с сервера (слоты, бронирования, нотификации и т.д.) управляются через TanStack Query:

- **Query keys** конвенция: `['entity', params]`, например `['bookings', 'my', { dateFrom, status }]`
- **Stale time**: 30 секунд для часто меняющихся данных (слоты, бронирования), 5 минут для статических (локации, шаблоны)
- **Invalidation**: при мутациях (бронирование, отмена) автоматическая инвалидация связанных query keys
- **Optimistic updates**: для быстрых действий (отметить нотификацию прочитанной, отмена бронирования)

## API-клиент (Axios)

```typescript
import type { ApiError } from '@wooftennis/shared';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### Runtime Contract Baseline: one-pager endpoints

Для one-pager FE работает через `GET /events/my`, `GET /events/:eventId`, `POST /events`, `POST /events/:eventId/attach-player`, `POST /events/:eventId/invite`, `GET /invites/:code`, `POST /invites/:inviteId/accept`, `POST /invites/:inviteId/decline` (см. `docs/03-api-spec.md`).

Для `GET /bookings/coach`, `GET /play-sessions/my`, `GET /locations` фронт также соблюдает строгий контракт query/roles там, где используются соответствующие экраны:

- **Safe query builder:** отправлять только whitelisted ключи для конкретного endpoint.
- **Ожидаемый `400`:** невалидный формат query или неподдерживаемый ключ.
- **Ожидаемый `403`:** role-gated запрет (например, вызов coach-only endpoint из player-контекста).
- **Ожидаемый `409`/`410` c `code`:** бизнес-конфликт в event/invite сценариях (`EVENT_TIME_CONFLICT`, `INVITE_EXPIRED`, `INVITE_INVALID` и др.).

Практические правила:

- `bookings/coach` — вызывать только при `activeRole === 'coach'`; query: `status`, `dateFrom`, `dateTo`, `page`, `limit`.
- `locations` — вызывать только при `activeRole === 'coach'`; query: только `isActive` (если нужен фильтр).
- `play-sessions/my` — всегда использовать контракт пагинации (`page`, `limit`) и ожидать `PaginatedResponse` (`items`, `total`, `page`, `limit`) как в `docs/03-api-spec.md`.
- `events/my` — всегда передавать `role`, `dateFrom`, `dateTo`; для фильтра локации использовать только `locationId`.

## Event Create UX contract (FE responsibility)

- **Location selector + create path:** в `CreateEventPage` локация выбирается только через selector (без raw ID); при отсутствии нужной локации доступен путь `Создать локацию`.
- **Create location fields:** форма создания локации в этом flow содержит `name`, `address`, `description`, `photo`, `website`.
- **Datetime UX (calendar pattern):** использовать user-friendly поля `Начало` и `Окончание` (дата+время) с поведением в стиле Google/Apple Calendar: выбор даты и старта первым шагом, затем автоподстановка окончания с возможностью ручной корректировки.
- **Recurring option:** в форме есть явный toggle `Повторять событие` (`isRecurring`) и базовые настройки повторов.
- **Invite multiselect:** поле принимает несколько TG-имен, autosuggest строится по БД; для неизвестных имён инвайт всё равно создаётся, **уведомление/доставка — через Telegram**; отдельный per-user CTA в UI не обязателен.

## Двухканальная авторизация (Mini App и веб)

Целевая модель зафиксирована в `docs/15-auth-dual-channel-architecture.md` и `docs/03-api-spec.md`: один пользователь (`telegramId`), один JWT, два способа установить сессию.

| Канал | Условие на фронте | Запрос | Компоненты / хелперы |
|-------|-------------------|--------|----------------------|
| **Mini App** | `isTelegramMiniApp()` === true (непустой `initData`) | `POST /auth/telegram` `{ initData }` | `getTelegramInitData()`, `useBootstrapAuth` → `authStore.login` |
| **Веб (браузер)** | нет `initData` | `POST /auth/telegram/widget` — тело с полями Login Widget **как есть** (snake_case) | `TelegramLoginWidget`, `authStore.loginWithWidget` |

- Хелпер **`isTelegramMiniApp()`** — `apps/web/src/utils/telegram.ts` (наличие непустой строки `initData` от WebApp/SDK).
- Экран без сессии: в Mini App — «Повторить вход» при сбое; в браузере — **только** встроенный Login Widget (без редиректа на `t.me` как замены логина на сайте).
- JWT после обоих каналов хранится в **`authStore`** (persist в `localStorage` для веба; при желании Mini App можно дополнить CloudStorage — см. `docs/07-telegram-integration.md`).
- Переменные окружения фронта: `VITE_TELEGRAM_BOT_USERNAME` (имя бота для виджета, без `@`); опционально `VITE_DEV_ACCESS_TOKEN` только для внутренней отладки, не для пользовательского UI.

## Интеграция с Telegram Mini App

### Инициализация

В `main.tsx`:

```typescript
import { init, miniApp, themeParams, backButton } from '@telegram-apps/sdk-react';

init();
miniApp.mount();
themeParams.mount();
backButton.mount();
```

### Использование TG-фич

| Фича TG | Применение в приложении |
|---|---|
| `themeParams` | Адаптация цветовой схемы к теме Telegram пользователя |
| `backButton` | Показ/скрытие кнопки "Назад" при навигации вглубь |
| `mainButton` | Кнопка "Забронировать" на экране выбора слота |
| `hapticFeedback` | Тактильный отклик при успешных действиях |
| `shareUrl` / `openTelegramLink` | Шаринг инвайт-ссылок на игровые сессии |
| `initData` | Авторизация на бэкенде |
| `cloudStorage` | Кэширование JWT и пользовательских настроек |

### Deep Linking

Обработка `startapp` параметра при открытии Mini App по ссылке:

```typescript
const startParam = miniApp.initDataRaw?.start_param;

if (startParam?.startsWith('play_')) {
  const inviteCode = startParam.replace('play_', '');
  navigate(`/play/${inviteCode}`);
}
```

## Адаптивные стили и TG-тема

CSS-переменные из Telegram привязываются к Tailwind:

```css
:root {
  --tg-theme-bg-color: var(--tg-theme-bg-color, #ffffff);
  --tg-theme-text-color: var(--tg-theme-text-color, #000000);
  --tg-theme-hint-color: var(--tg-theme-hint-color, #999999);
  --tg-theme-link-color: var(--tg-theme-link-color, #2481cc);
  --tg-theme-button-color: var(--tg-theme-button-color, #2481cc);
  --tg-theme-button-text-color: var(--tg-theme-button-text-color, #ffffff);
  --tg-theme-secondary-bg-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
}
```

В `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color)',
          text: 'var(--tg-theme-text-color)',
          hint: 'var(--tg-theme-hint-color)',
          link: 'var(--tg-theme-link-color)',
          button: 'var(--tg-theme-button-color)',
          'button-text': 'var(--tg-theme-button-text-color)',
          'secondary-bg': 'var(--tg-theme-secondary-bg-color)',
        },
      },
    },
  },
};
```

## Ключевые UI-паттерны

### Карточка бронирования (BookingCard)

```
┌────────────────────────────────────┐
│ 📅 14 апреля, Пн     09:00-10:00  │
│ 📍 Корт на Парке Горького         │
│ 👤 Тренер: Мария К.               │
│ ┌──────────┐  ┌──────────┐        │
│ │ Отменить │  │ Оценить  │        │
│ └──────────┘  └──────────┘        │
└────────────────────────────────────┘
```

### Сетка слотов (SlotPicker)

Горизонтальный скролл по дням недели, вертикальный список слотов внутри дня:

```
┌──── Пн 14 ────┐┌──── Вт 15 ────┐┌──── Ср 16 ────┐
│ 09:00 ✅       ││ 09:00 ✅       ││ 09:00 ⬜       │
│ 10:00 ✅       ││ 10:00 ⬜       ││ 10:00 ✅       │
│ 11:00 🔵 сплит ││ 11:00 ✅       ││ 11:00 ✅       │
│ 14:00 ✅       ││               ││ 14:00 ⬜       │
└────────────────┘└────────────────┘└────────────────┘

✅ — свободен, ⬜ — занят, 🔵 — сплит (открыт)
```

### Рейтинг (RatingPicker)

```
Как прошла тренировка?

Стиль отображения:
[ 💩 ] [ ⭐ ]

Оценка:
[ 1 ] [ 2 ] [ 3 ]

Рекомендации тренера:
┌────────────────────────────────────┐
│ Работай над бэкхендом...          │
└────────────────────────────────────┘
```

`RatingPicker` отправляет в API:
- `ratingValue` (1-3) — единая оценка качества игры
- `ratingStyle` (`poop` | `star`) — только визуальный формат

## Локализация

Основной язык интерфейса — **русский**. Все пользовательские строки (кнопки, заголовки, сообщения об ошибках, placeholder'ы, нотификации) — на русском.
Английский язык используется как **комплиментарный**: fallback-словарь и база для будущего переключения локали без изменений визуальной структуры.

## Темизация и визуальный стиль

- Обязательна поддержка двух тем: **light** и **dark** (на базе Telegram `themeParams`).
- UI должен оставаться **минималистичным**: без перегрузки декоративными элементами, с фокусом на понятные действия.
- На каждом экране — один главный CTA (приоритетно через `Telegram MainButton`), вторичные действия визуально приглушены.
- Для референса экранов использовать `docs/11-design-artifacts.md`.

### Словарь UI-строк (utils/i18n.ts)

Все текстовые константы собраны в одном месте. Формат словаря: `ru` (основной) и `en` (комплиментарный fallback).

```typescript
export const UI = {
  ru: {
  // Навигация
  nav: {
    home: 'Главная',
    profile: 'Профиль',
    notifications: 'Уведомления',
    schedule: 'Расписание',
    locations: 'Локации',
  },

  // Роли
  roles: {
    asPlayer: 'Как игрок',
    asCoach: 'Как тренер',
    enableCoach: 'Стать тренером',
  },

  // Бронирование
  booking: {
    book: 'Забронировать',
    cancel: 'Отменить',
    reschedule: 'Перенести',
    openSplit: 'Открыть для сплита',
    closeSplit: 'Закрыть сплит',
    joinSplit: 'Присоединиться',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
    completed: 'Завершено',
    noShow: 'Не пришёл',
  },

  // Слоты
  slot: {
    available: 'Свободен',
    booked: 'Забронирован',
    full: 'Занят',
    splitOpen: 'Сплит (открыт)',
    cancelSlot: 'Отменить слот',
    complete: 'Завершить',
    markNoShow: 'Отметить как не пришёл',
  },

  // Оценки
  review: {
    title: 'Как прошла тренировка?',
    ratingStyle: 'Стиль оценки',
    ratingStylePoop: 'Какашки',
    ratingStyleStar: 'Звёзды',
    ratingValue: 'Оценка',
    recommendation: 'Рекомендации',
    comment: 'Комментарий',
    submit: 'Отправить оценку',
    rateCoach: 'Оцените тренера',
    rateStudent: 'Оцените ученика',
  },

  // Локации
  location: {
    add: 'Добавить локацию',
    name: 'Название',
    address: 'Адрес',
    photo: 'Фото',
    save: 'Сохранить',
    deactivate: 'Деактивировать',
  },

  // Расписание
  schedule: {
    addTemplate: 'Добавить шаблон',
    addSlot: 'Добавить слот',
    dayOfWeek: 'День недели',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    duration: 'Длительность',
    maxPlayers: 'Макс. игроков',
  },

  // Игровые сессии
  playSession: {
    create: 'Создать игру',
    join: 'Присоединиться',
    leave: 'Покинуть',
    cancelSession: 'Отменить игру',
    share: 'Поделиться ссылкой',
    location: 'Место',
    date: 'Дата',
    time: 'Время',
    comment: 'Комментарий',
    inviteText: 'Присоединяйся к теннису!',
  },

  // Отыгрыши
  makeup: {
    assign: 'Назначить отыгрыш',
    resolve: 'Закрыть отыгрыш',
    cancelDebt: 'Отменить отыгрыш',
    pending: 'Ожидает',
    resolved: 'Закрыт',
    reason: 'Причина',
  },

  // Нотификации
  notification: {
    markRead: 'Прочитано',
    markAllRead: 'Прочитать все',
  },

  // Ошибки
  error: {
    cannotCancelLessThan24h: 'Нельзя отменить менее чем за 24 часа до тренировки',
    slotNotAvailable: 'Слот недоступен для бронирования',
    alreadyBooked: 'Вы уже забронировали этот слот',
    timeConflict: 'Конфликт по времени с другой тренировкой',
    coachRequired: 'Требуется доступ тренера',
    unauthorized: 'Необходима авторизация',
    notFound: 'Не найдено',
    sessionFull: 'Все места заняты',
  },

  // Общие
  common: {
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    edit: 'Редактировать',
    back: 'Назад',
    loading: 'Загрузка...',
    empty: 'Пока ничего нет',
    retry: 'Попробовать снова',
  },

  // Дни недели
  weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  },
  en: {
    // Навигация
    nav: {
      home: 'Home',
      profile: 'Profile',
      notifications: 'Notifications',
      schedule: 'Schedule',
      locations: 'Locations',
    },
    // Остальные домены (booking, slot, review...) повторяют структуру ru
  },
} as const;

type Locale = keyof typeof UI;
type Domain = keyof typeof UI.ru;
type DomainKey<D extends Domain> = keyof typeof UI.ru[D];

export function t<D extends Domain>(locale: Locale, domain: D, key: DomainKey<D>): string {
  return (
    UI[locale]?.[domain]?.[key as never] ??
    UI.ru[domain]?.[key as never] ??
    `${String(domain)}.${String(key)}`
  );
}
```

Fallback-стратегия строго соответствует дизайнерскому документу: `requested locale -> ru -> key`.

### Серверные сообщения об ошибках

Бэкенд также возвращает сообщения об ошибках на русском языке:

```json
{
  "statusCode": 400,
  "message": "Нельзя отменить бронирование менее чем за 24 часа до тренировки",
  "error": "Ошибка валидации"
}
```
