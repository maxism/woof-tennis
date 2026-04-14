# WoofTennis — Набор задач для Frontend (IA vNext)

## Цель

Подготовить `apps/web` к новой модели UX:
- нижняя навигация: `Главная` + `Профиль`;
- основной сценарий создания через CTA `Создать` на Главной;
- назначение игрока в тренировку через `direct-attach` или `invite`;
- локации как сквозная сущность с фильтром в сетке.

## Scope (монорепо)

- `apps/web` — UI, страницы, состояние, маршруты и взаимодействия.
- `packages/shared` — новые DTO/enum для event-centric модели.
- `apps/api` — контрактная зависимость (вне прямого FE-скоупа).

---

## Единый FE scope (реализуется целиком)

### FE-1. Обновить shell навигации
**Файлы:**
- `apps/web/src/components/layout/AppLayout.tsx`
- `apps/web/src/components/layout/TabBar.tsx`
- `apps/web/src/components/layout/RoleSwitch.tsx`

**Задачи:**
- Перевести tabbar на 2 пункта: `Главная`, `Профиль`.
- Удалить отдельные tab-входы `Тренеры`, `Игра`, `Уведомления`.
- Добавить primary CTA `Создать` на `HomePage`.

### FE-2. Главная как единая сетка событий
**Файлы:**
- `apps/web/src/pages/Home/HomePage.tsx`
- `apps/web/src/components/booking/BookingList.tsx`
- `apps/web/src/components/booking/BookingCard.tsx`

**Задачи:**
- Показ событий по времени для контекста игрока/тренера.
- Сегмент `Как игрок` / `Как тренер` для dual-role.
- Фильтр по локациям (owned + shared).

### FE-3. Сценарий создания события
**Файлы:**
- `apps/web/src/pages/Play/CreateEventPage.tsx`
- `apps/web/src/components/play/SessionCard.tsx`
- `apps/web/src/components/play/InviteLinkShare.tsx`

**Задачи:**
- Универсальная форма: разовое или периодическое событие.
- Выбор локации только через selector (человекочитаемые опции, без raw `locationId`).
- Если локации нет — entry-point `Создать локацию` прямо из selector.
- Inline/create-flow локации с обязательными полями: `name`, `address`, `description`, `photo`, `website`.
- User-friendly поля `Начало` и `Окончание` (date + time pickers) по паттерну Google/Apple Calendar.
- Явный toggle `Повторять событие` (`isRecurring`).
- Назначение игроков через multiselect с вводом TG username и autosuggest по базе.
- Если игрок не найден, инвайт всё равно уходит в бэкенд; доставка в Telegram — на стороне бота/нотификатора, **без обязательного отдельного действия в UI**.
- Два исхода после создания: `direct-attach` или генерация invite.

### FE-4. Профиль как хаб вторичных сценариев
**Файлы:**
- `apps/web/src/pages/Profile/ProfilePage.tsx`
- `apps/web/src/pages/Notifications/NotificationsPage.tsx`

**Задачи:**
- Раздел `Кабинет тренера` (локации, расписание, отыгрыши).
- Раздел `Уведомления` внутри профиля.
- Ясные ссылки на вторичные экраны без дублирования главной логики.
- Переименовать coach toggle в `Режим тренера` и оформить как очевидный switch.
- Исправить роут кнопки `Локации`: переход на `/coach/locations` (не `/play/create`).

### FE-5. Базовые состояния и локализация
**Файлы:**
- `apps/web/src/utils/i18n.ts`
- `apps/web/src/components/ui/*`

**Задачи:**
- Добавить ключи для новых статусов и CTA.
- Выдержать RU-primary, EN-fallback.
- Проверить light/dark на обновленных экранах.
- Ввести единый UI-мэппинг статусов из `docs/18-pm-one-pager.md` (включая `invite_expired`, `invite_invalid`, `time_conflict`).

### FE-6. Обработка edge-cases invite/direct-attach
**Файлы:**
- `apps/web/src/pages/Player/InviteAcceptPage.tsx`
- `apps/web/src/pages/Player/EventDetailPage.tsx`
- `apps/web/src/hooks/useBookings.ts`

**Задачи:**
- Невалидный/просроченный invite.
- Конфликт времени при принятии.
- Игрок уже прикреплен к другому событию.

### FE-7. Модели и типы shared
**Файлы:**
- `packages/shared/src/types/*`
- `packages/shared/src/enums/*`
- `packages/shared/src/index.ts`

**Задачи:**
- Зафиксировать event-centric DTO: EventCard, InviteState, AttachStatus.
- Привести UI маппинги к enum/shared-константам.

### FE-8. QA-ready polish
**Файлы:**
- `apps/web/src/pages/**`
- `apps/web/src/components/**`

**Задачи:**
- Empty/loading/error на каждом критичном экране.
- Ревью доступности CTA и коротких русских лейблов.
- Смоук по главным сценариям из `docs/04-user-flows.md`.
- Зафиксировать явный `success` state и terminal views для invite/direct-attach кейсов.

### FE-9. Обязательные тексты terminal/empty состояний
**Файлы:**
- `apps/web/src/utils/i18n.ts`
- `apps/web/src/pages/Home/HomePage.tsx`
- `apps/web/src/pages/Player/InviteAcceptPage.tsx`

**Задачи:**
- Главная empty: `Пока нет событий` + CTA `Создать событие`.
- `invite_expired`: `Срок приглашения истек` + CTA `Запросить новый инвайт`.
- `invite_invalid`: `Приглашение недействительно` + CTA `На Главную`.
- `time_conflict`: `Это время уже занято` + CTA `Выбрать другое время`.
- Успех `direct-attach` и `invite`: отдельные success-экраны с явным следующим действием (`К событию` / `Поделиться`).

---

## Критерии приемки

- Пользователь без обучения понимает разницу: `Главная = видеть и управлять текущим`, `Создать = инициировать новое`.
- Сценарии `direct-attach` и `invite` работают предсказуемо и имеют понятные статусы.
- Уведомления доступны в профиле и дублируются в Telegram без потери информации.
- Для dual-role не возникает переключений навигации и потери контекста.
- Для всех критичных экранов реализованы `loading/empty/error/success`; для invite/direct-attach реализованы terminal states (`invite_expired`, `invite_invalid`, `time_conflict`, `cancelled`).

## Зависимости от API/архитектуры

- FE реализуется строго на event/invite API (`/events/*`, `/invites/*`) из `docs/03-api-spec.md`.
- Ошибки event/invite обрабатываются по полному формату `statusCode + message + error + code`.
- Обязательные machine codes в UI: `EVENT_TIME_CONFLICT`, `INVITE_EXPIRED`, `INVITE_INVALID`, `INVITE_ALREADY_RESOLVED`, `ROLE_FORBIDDEN`.
- DTO/enum в `@wooftennis/shared` синхронизированы со статусной моделью из `docs/18-pm-one-pager.md`.
