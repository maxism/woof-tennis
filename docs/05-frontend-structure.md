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

## Структура проекта

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                    # Entry point
    ├── App.tsx                     # Root: providers, router
    ├── api/                        # API layer
    │   ├── client.ts               # Axios instance с JWT interceptor
    │   ├── auth.ts                 # POST /auth/telegram
    │   ├── users.ts                # Users API calls
    │   ├── locations.ts            # Locations API calls
    │   ├── schedule-templates.ts   # Schedule Templates API calls
    │   ├── slots.ts                # Slots API calls
    │   ├── bookings.ts             # Bookings API calls
    │   ├── play-sessions.ts        # Play Sessions API calls
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
    │   │   ├── SearchPage.tsx      # Поиск тренеров
    │   │   ├── CoachProfilePage.tsx# Профиль тренера + доступные слоты
    │   │   └── BookingDetailPage.tsx# Детали бронирования
    │   ├── Play/
    │   │   ├── NewSessionPage.tsx  # Создание игровой сессии
    │   │   └── JoinSessionPage.tsx # Просмотр + присоединение по инвайту
    │   ├── Reviews/
    │   │   └── ReviewFormPage.tsx  # Оценка после тренировки
    │   └── Notifications/
    │       └── NotificationsPage.tsx
    ├── components/                 # Переиспользуемые компоненты
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
    │   │   ├── RatingPicker.tsx    # Выбор рейтинга (какашки/звёзды)
    │   │   ├── ReviewCard.tsx      # Карточка отзыва
    │   │   └── ReviewList.tsx
    │   ├── play/
    │   │   ├── SessionCard.tsx     # Карточка игровой сессии
    │   │   └── InviteLinkShare.tsx # Кнопка "Поделиться ссылкой"
    │   └── notification/
    │       ├── NotificationCard.tsx
    │       └── NotificationBadge.tsx # Индикатор непрочитанных
    ├── types/                      # TypeScript типы
    │   ├── user.ts
    │   ├── location.ts
    │   ├── schedule-template.ts
    │   ├── slot.ts
    │   ├── booking.ts
    │   ├── play-session.ts
    │   ├── review.ts
    │   ├── makeup-debt.ts
    │   ├── notification.ts
    │   └── api.ts                  # Общие типы: PaginatedResponse, ApiError
    ├── utils/
    │   ├── telegram.ts             # Хелперы для TG Mini App SDK
    │   ├── date.ts                 # Форматирование дат
    │   ├── invite.ts               # Генерация и парсинг инвайт-ссылок
    │   ├── constants.ts            # Маршруты, enum-маппинги
    │   └── i18n.ts                # Словарь UI-строк (русский — основной язык)
    └── styles/
        └── globals.css             # Tailwind directives, TG theme vars
```

## Маршрутизация

```tsx
<BrowserRouter>
  <Routes>
    {/* Общие */}
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="notifications" element={<NotificationsPage />} />

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
        <Route path="search" element={<SearchPage />} />
        <Route path="coach/:id" element={<CoachProfilePage />} />
        <Route path="booking/:id" element={<BookingDetailPage />} />
      </Route>

      {/* Самостоятельная игра */}
      <Route path="play">
        <Route path="new" element={<NewSessionPage />} />
        <Route path=":inviteCode" element={<JoinSessionPage />} />
      </Route>

      {/* Отзывы */}
      <Route path="review/:bookingId" element={<ReviewFormPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

## Нижняя навигация (TabBar)

Адаптируется в зависимости от роли пользователя:

**Только игрок (isCoach = false):**

| Иконка | Лейбл | Маршрут |
|---|---|---|
| Calendar | Мои трени | `/` |
| Search | Тренеры | `/player/search` |
| Tennis | Игра | `/play/new` |
| Bell | Уведомления | `/notifications` |
| User | Профиль | `/profile` |

**Тренер + Игрок (isCoach = true):**

| Иконка | Лейбл | Маршрут |
|---|---|---|
| Calendar | Расписание | `/` |
| MapPin | Локации | `/coach/locations` |
| Search | Тренеры | `/player/search` |
| Bell | Уведомления | `/notifications` |
| User | Профиль | `/profile` |

На главном экране (дашборде) для dual-role пользователей используется сегментированный контрол (табы): "Как игрок" / "Как тренер".

## Стейт-менеджмент

### Auth Store (Zustand)

```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (initData: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}
```

### UI Store (Zustand)

```typescript
interface UIState {
  activeRole: 'player' | 'coach';
  setActiveRole: (role: 'player' | 'coach') => void;
}
```

### Server State (TanStack Query)

Все данные с сервера (слоты, бронирования, нотификации и т.д.) управляются через TanStack Query:

- **Query keys** конвенция: `['entity', params]`, например `['bookings', 'my', { dateFrom, status }]`
- **Stale time**: 30 секунд для часто меняющихся данных (слоты, бронирования), 5 минут для статических (локации, шаблоны)
- **Invalidation**: при мутациях (бронирование, отмена) автоматическая инвалидация связанных query keys
- **Optimistic updates**: для быстрых действий (отметить нотификацию прочитанной, отмена бронирования)

## API-клиент (Axios)

```typescript
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

💩  [ 💩 ] [ 💩💩 ] [ 💩💩💩 ]
⭐  [ ⭐ ] [ ⭐⭐ ] [ ⭐⭐⭐ ]

Рекомендации тренера:
┌────────────────────────────────────┐
│ Работай над бэкхендом...          │
└────────────────────────────────────┘
```

## Локализация

Основной язык интерфейса — **русский**. Все пользовательские строки (кнопки, заголовки, сообщения об ошибках, placeholder'ы, нотификации) — на русском.

### Словарь UI-строк (utils/i18n.ts)

Все текстовые константы собраны в одном месте для единообразия и будущей поддержки мультиязычности.

```typescript
export const UI = {
  // Навигация
  nav: {
    myTrainings: 'Мои тренировки',
    coaches: 'Тренеры',
    play: 'Игра',
    notifications: 'Уведомления',
    profile: 'Профиль',
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
} as const;
```

### Серверные сообщения об ошибках

Бэкенд также возвращает сообщения об ошибках на русском языке:

```json
{
  "statusCode": 400,
  "message": "Нельзя отменить бронирование менее чем за 24 часа до тренировки",
  "error": "Ошибка валидации"
}
```
