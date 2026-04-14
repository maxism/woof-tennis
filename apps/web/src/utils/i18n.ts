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
    home: 'Главная',
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
    retryLogin: 'Повторить вход',
    retryAction: 'Повторить',
    miniAppHint:
      'Вход из Mini App не выполнен автоматически. Нажмите «Повторить вход» или откройте приложение заново из Telegram.',
    webLoginIntro:
      'Войдите через официальный виджет Telegram ниже. Домен сайта должен быть добавлен у бота командой /setdomain (см. docs/14-onboarding-setup.md).',
    widgetLegal: 'Авторизация обрабатывается Telegram; мы получаем только подтверждённые данные профиля.',
    missingBotUsername:
      'Задайте в apps/web/.env имя бота без @: VITE_TELEGRAM_BOT_USERNAME=YourBot (для Login Widget).',
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
    authFailedTitle: 'Не удалось войти',
    authUnauthorized:
      'Не удалось подтвердить вход. Откройте приложение из Telegram или выполните вход через виджет.',
    authRateLimited: 'Слишком много попыток входа. Подождите немного и попробуйте снова.',
    authServer: 'Сервер временно недоступен. Повторите попытку позже.',
    authNetwork: 'Нет соединения с сервером. Проверьте интернет и попробуйте снова.',
    authClient: 'Запрос отклонён. Повторите вход.',
    authUnknown: 'Не удалось выполнить вход. Попробуйте ещё раз.',
    notFound: 'Не найдено',
    sessionFull: 'Все места заняты',
    forbidden: 'Недостаточно прав для этого действия',
    invalidFilters: 'Неверные параметры фильтра. Проверьте ввод.',
    coachContextRequired: 'Откройте раздел тренера, чтобы продолжить.',
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
      'Для отладки без виджета можно задать VITE_DEV_ACCESS_TOKEN (JWT) в apps/web/.env — только для разработки.',
  },
  home: {
    titlePlayer: 'Главная',
    titleCoach: 'Главная',
    subtitle: 'Единая сетка событий',
    emptyTitle: 'Пока нет событий',
    emptyAction: 'Создать событие',
    create: 'Создать',
    createEvent: 'Создать событие',
    eventStatus: 'Статус события',
    roleHint: 'Переключайте роль для просмотра своего контекста',
  },
  profile: {
    title: 'Профиль',
    coachMode: 'Режим тренера',
    statsBookings: 'Бронирований',
    accountRole: 'Аккаунт и роль',
    coachCabinet: 'Кабинет тренера',
    notificationsArchive: 'Архив уведомлений',
    coachToolsHint: 'Локации, расписание и управление событиями',
  },
  event: {
    timelineRolePlayer: 'Как игрок',
    timelineRoleCoach: 'Как тренер',
    createTitle: 'Создание события',
    locationId: 'ID локации',
    startsAt: 'Начало (ISO)',
    endsAt: 'Окончание (ISO)',
    playerId: 'ID игрока для direct-attach',
    actionAttach: 'Назначить игрока',
    actionInvite: 'Создать invite',
    attachSuccess: 'Игрок назначен',
    attachCta: 'К событию',
    inviteSuccess: 'Ссылка-приглашение готова',
    inviteCta: 'Поделиться',
    inviteExpired: 'Срок приглашения истек',
    inviteExpiredCta: 'Запросить новый инвайт',
    inviteInvalid: 'Приглашение недействительно',
    inviteInvalidCta: 'На Главную',
    timeConflict: 'Это время уже занято',
    timeConflictCta: 'Выбрать другое время',
    cancelled: 'Событие отменено',
    accept: 'Принять приглашение',
    decline: 'Отклонить приглашение',
  },
  search: {
    title: 'Тренеры',
    empty: 'Каталог тренеров появится позже. Пока можно открыть профиль по UUID.',
    usernameLabel: 'Поиск по Telegram username',
    usernamePlaceholder: '@username',
    searchError: 'Не удалось выполнить поиск. Попробуйте снова.',
    notFound: 'Тренер с таким username не найден',
    notFoundHelp: 'Проверьте написание и попробуйте снова.',
    openCoach: 'Открыть профиль',
  },
};

const enPatch: Record<string, unknown> = {
  nav: {
    home: 'Home',
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
    retryLogin: 'Try again',
    retryAction: 'Retry',
    miniAppHint:
      'Mini App login did not complete. Tap retry or reopen the app from Telegram.',
    webLoginIntro:
      'Sign in with the official Telegram widget below. Register this site domain with /setdomain (see docs/14-onboarding-setup.md).',
    widgetLegal: 'Telegram handles sign-in; we only receive verified profile data.',
    missingBotUsername:
      'Set VITE_TELEGRAM_BOT_USERNAME in apps/web/.env (bot username without @).',
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
      'For debugging without the widget you may set VITE_DEV_ACCESS_TOKEN (JWT) in apps/web/.env — development only.',
  },
  home: {
    titlePlayer: 'Home',
    titleCoach: 'Home',
    subtitle: 'Unified event timeline',
    emptyTitle: 'No events yet',
    emptyAction: 'Create event',
    create: 'Create',
    createEvent: 'Create event',
    eventStatus: 'Event status',
    roleHint: 'Switch role context to view your timeline',
  },
  profile: {
    title: 'Profile',
    coachMode: 'Coach mode',
    statsBookings: 'Bookings',
    accountRole: 'Account and role',
    coachCabinet: 'Coach cabinet',
    notificationsArchive: 'Notifications archive',
    coachToolsHint: 'Locations, schedule, and event operations',
  },
  event: {
    timelineRolePlayer: 'As player',
    timelineRoleCoach: 'As coach',
    createTitle: 'Create event',
    locationId: 'Location ID',
    startsAt: 'Starts at (ISO)',
    endsAt: 'Ends at (ISO)',
    playerId: 'Player ID for direct attach',
    actionAttach: 'Attach player',
    actionInvite: 'Create invite',
    attachSuccess: 'Player attached',
    attachCta: 'Open event',
    inviteSuccess: 'Invite link is ready',
    inviteCta: 'Share',
    inviteExpired: 'Invite has expired',
    inviteExpiredCta: 'Request new invite',
    inviteInvalid: 'Invite is invalid',
    inviteInvalidCta: 'Go home',
    timeConflict: 'This time is already occupied',
    timeConflictCta: 'Choose another time',
    cancelled: 'Event cancelled',
    accept: 'Accept invite',
    decline: 'Decline invite',
  },
  search: {
    title: 'Coaches',
    empty: 'Coach directory is coming soon. You can open a profile by UUID for now.',
    usernameLabel: 'Search by Telegram username',
    usernamePlaceholder: '@username',
    searchError: 'Could not run search. Try again.',
    notFound: 'Coach with this username was not found',
    notFoundHelp: 'Check the spelling and try again.',
    openCoach: 'Open profile',
  },
  error: {
    authFailedTitle: 'Sign-in failed',
    authUnauthorized:
      'Could not verify sign-in. Open the app from Telegram or use the login widget.',
    authRateLimited: 'Too many sign-in attempts. Wait a bit and try again.',
    authServer: 'The server is temporarily unavailable. Try again later.',
    authNetwork: 'Cannot reach the server. Check your connection and try again.',
    authClient: 'The request was rejected. Sign in again.',
    authUnknown: 'Sign-in failed. Please try again.',
    forbidden: 'You do not have access to this action',
    invalidFilters: 'Invalid filter parameters. Check your input.',
    coachContextRequired: 'Open coach mode to continue.',
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
