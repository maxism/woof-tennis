export type Locale = 'ru' | 'en';

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<{ [K in keyof T]: unknown }>,
): T {
  const out = { ...base } as T;
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const pv = patch[key];
    const bv = base[key];
    if (
      pv &&
      typeof pv === 'object' &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === 'object' &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(bv as Record<string, unknown>, pv as Record<string, unknown>) as T[keyof T];
    } else if (pv !== undefined) {
      out[key] = pv as T[keyof T];
    }
  }
  return out;
}

const ru = {
  nav: {
    myTrainings: 'Мои тренировки',
    coaches: 'Тренеры',
    play: 'Игра',
    notifications: 'Уведомления',
    profile: 'Профиль',
    schedule: 'Расписание',
    locations: 'Локации',
  },
  roles: {
    asPlayer: 'Как игрок',
    asCoach: 'Как тренер',
    enableCoach: 'Стать тренером',
  },
  auth: {
    openInTelegram: 'Войти через Telegram',
    miniAppHint:
      'Откроется бот с Mini App в Telegram — там вы автоматически войдёте в аккаунт.',
    missingBotUrl:
      'Укажите в apps/web/.env ссылку на Mini App, например: VITE_TELEGRAM_BOT_APP_URL=https://t.me/ИмяБота/short_name (short name из @BotFather → Bot Settings → Configure Mini App).',
    retryLogin: 'Повторить вход',
  },
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
  slot: {
    available: 'Свободен',
    booked: 'Забронирован',
    full: 'Занят',
    splitOpen: 'Сплит (открыт)',
    cancelSlot: 'Отменить слот',
    complete: 'Завершить',
    markNoShow: 'Отметить как не пришёл',
  },
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
  location: {
    add: 'Добавить локацию',
    name: 'Название',
    address: 'Адрес',
    photo: 'Фото',
    save: 'Сохранить',
    deactivate: 'Деактивировать',
  },
  schedule: {
    addTemplate: 'Добавить шаблон',
    addSlot: 'Добавить слот',
    dayOfWeek: 'День недели',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    duration: 'Длительность',
    maxPlayers: 'Макс. игроков',
  },
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
  makeup: {
    assign: 'Назначить отыгрыш',
    resolve: 'Закрыть отыгрыш',
    cancelDebt: 'Отменить отыгрыш',
    pending: 'Ожидает',
    resolved: 'Закрыт',
    reason: 'Причина',
  },
  notification: {
    markRead: 'Прочитано',
    markAllRead: 'Прочитать все',
  },
  error: {
    cannotCancelLessThan24h:
      'Нельзя отменить менее чем за 24 часа до тренировки',
    slotNotAvailable: 'Слот недоступен для бронирования',
    alreadyBooked: 'Вы уже забронировали этот слот',
    timeConflict: 'Конфликт по времени с другой тренировкой',
    coachRequired: 'Требуется доступ тренера',
    unauthorized: 'Необходима авторизация',
    notFound: 'Не найдено',
    sessionFull: 'Все места заняты',
  },
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
    openById: 'Открыть по ID тренера',
    coachIdPlaceholder: 'UUID тренера',
    open: 'Открыть',
    comingSoon: 'Скоро здесь будет больше возможностей.',
    devNoTelegram:
      'В обычном браузере нет данных Telegram — нажмите кнопку ниже или задайте VITE_DEV_ACCESS_TOKEN (JWT с бэкенда).',
  },
  home: {
    titlePlayer: 'Мои тренировки',
    titleCoach: 'Расписание',
    subtitle: 'Ближайшие занятия',
  },
  profile: {
    title: 'Профиль',
    coachMode: 'Режим тренера',
    statsBookings: 'Бронирований',
  },
  search: {
    title: 'Тренеры',
    empty: 'Каталог тренеров появится позже. Пока можно открыть профиль по UUID.',
  },
};

const enPatch: Record<string, unknown> = {
  nav: {
    myTrainings: 'My trainings',
    coaches: 'Coaches',
    play: 'Play',
    notifications: 'Notifications',
    profile: 'Profile',
    schedule: 'Schedule',
    locations: 'Locations',
  },
  roles: {
    asPlayer: 'As player',
    asCoach: 'As coach',
    enableCoach: 'Become a coach',
  },
  auth: {
    openInTelegram: 'Sign in with Telegram',
    miniAppHint: 'Your bot will open the Mini App in Telegram — you will be signed in there.',
    missingBotUrl:
      'Set VITE_TELEGRAM_BOT_APP_URL in apps/web/.env to your Mini App direct link (from @BotFather).',
    retryLogin: 'Try again',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    loading: 'Loading...',
    empty: 'Nothing here yet',
    retry: 'Try again',
    openById: 'Open coach by ID',
    coachIdPlaceholder: 'Coach UUID',
    open: 'Open',
    comingSoon: 'More features coming soon.',
    devNoTelegram:
      'Open the app in Telegram or set VITE_DEV_ACCESS_TOKEN for local development.',
  },
  home: {
    titlePlayer: 'My trainings',
    titleCoach: 'Schedule',
    subtitle: 'Upcoming sessions',
  },
  profile: {
    title: 'Profile',
    coachMode: 'Coach mode',
    statsBookings: 'Bookings',
  },
  search: {
    title: 'Coaches',
    empty: 'Coach directory is coming soon. You can open a profile by UUID for now.',
  },
};

export const UI = {
  ru,
  en: deepMerge(
    ru as unknown as Record<string, unknown>,
    enPatch,
  ) as typeof ru,
};

type Domain = keyof typeof ru;
type DomainKey<D extends Domain> = keyof (typeof ru)[D];

export function getLocale(): Locale {
  const v = import.meta.env.VITE_UI_LOCALE;
  return v === 'en' ? 'en' : 'ru';
}

export function t<D extends Domain>(domain: D, key: DomainKey<D>): string {
  const locale = getLocale();
  const pack = UI[locale][domain] as Record<string, string>;
  const ruPack = UI.ru[domain] as Record<string, string>;
  const k = key as string;
  const v = pack?.[k] ?? ruPack?.[k];
  return v ?? `${String(domain)}.${k}`;
}
