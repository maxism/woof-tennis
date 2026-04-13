# WoofTennis — Набор задач для Frontend (monorepo)

## Цель

Подготовить `apps/web` к реализации обновленного UI/UX:
- русский интерфейс как основной;
- английский как комплиментарный (через словарь);
- полная поддержка light/dark;
- минималистичный визуальный стиль без перегрузки.

## Область работ в монорепозитории

- `apps/web` — реализация UI, страниц, компонентов, тем, локализации.
- `packages/shared` — общие типы/enum/константы, которые нужны фронтенду.
- `apps/api` — не в прямом скоупе фронтенд-задач, но учитывать контрактные зависимости.

---

## Эпик A — Foundation UI (apps/web)

### A1. Theme layer (light/dark)
**Файлы:**
- `apps/web/src/styles/globals.css`
- `apps/web/tailwind.config.ts`

**Задачи:**
- Добавить дизайн-токены для двух тем (фон, текст, secondary, border, success/warn/danger).
- Привязать токены к `themeParams` Telegram и предусмотреть fallback.
- Проверить контрастность текста и интерактивных элементов в обеих темах.

**Критерий готовности:**
- Любой экран корректно отображается и в светлой, и в темной теме без ручных правок на уровне компонентов.

### A2. Базовый UI-kit в минималистичном стиле
**Файлы:**
- `apps/web/src/components/ui/Button.tsx`
- `apps/web/src/components/ui/Card.tsx`
- `apps/web/src/components/ui/Input.tsx`
- `apps/web/src/components/ui/Badge.tsx`
- `apps/web/src/components/ui/PageHeader.tsx`

**Задачи:**
- Обновить варианты компонентов под минималистичный стиль (без тяжелых теней/шумных обводок).
- Унифицировать размеры, отступы, радиусы.
- Добавить состояния: default/hover/active/disabled/error.

**Критерий готовности:**
- Компоненты единообразно выглядят на всех ключевых экранах.

### A3. Navigation shell
**Файлы:**
- `apps/web/src/components/layout/AppLayout.tsx`
- `apps/web/src/components/layout/TabBar.tsx`
- `apps/web/src/components/layout/RoleSwitch.tsx`

**Задачи:**
- Привести таб-бар и переключатель ролей к новым макетам.
- Обеспечить визуальную простоту: не более 1 активного акцента на экран.
- Проверить читаемость русских лейблов в узких ширинах.

---

## Эпик B — Локализация (RU primary, EN complementary)

### B1. Единый словарь UI-строк
**Файлы:**
- `apps/web/src/utils/i18n.ts`

**Задачи:**
- Разделить словари на `ru` (основной) и `en` (комплиментарный).
- Зафиксировать нейминг ключей по доменам (`nav`, `booking`, `review`, `notification` и т.д.).
- Добавить fallback стратегию: `requested locale -> ru -> key`.

### B2. Миграция hardcoded-строк
**Файлы:**
- Все страницы/компоненты в `apps/web/src/pages/**` и `apps/web/src/components/**`

**Задачи:**
- Убрать hardcoded UI-строки, заменить на обращения к словарю.
- Проверить, что ошибки, empty-state и подписи кнопок берутся из i18n.

**Критерий готовности:**
- В `apps/web` не осталось пользовательских строк вне i18n (кроме test fixtures).

---

## Эпик C — Реализация ключевых экранов из артефактов

### C1. Dashboard
**Файлы:**
- `apps/web/src/pages/Home/HomePage.tsx`
- `apps/web/src/components/booking/BookingCard.tsx`

**Задачи:**
- Привести экран к `docs/11-design-artifacts.md` (`wooftennis-dashboard-v2.png`).
- Поддержать компактные карточки, короткие статусы, минимальный шум.
- Добавить корректные empty/loading/error состояния.

### C2. Coach Profile + Slot Picker
**Файлы:**
- `apps/web/src/pages/Player/CoachProfilePage.tsx`
- `apps/web/src/components/booking/SlotPicker.tsx`

**Задачи:**
- Реализовать простую сетку слотов и статусы (`свободен`, `занят`, `сплит`).
- Сохранить фокус на выборе слота без перегруженных элементов.

### C3. Review Form
**Файлы:**
- `apps/web/src/pages/Reviews/ReviewFormPage.tsx`
- `apps/web/src/components/review/RatingPicker.tsx`

**Задачи:**
- Привести форму оценки к минималистичной структуре.
- Сделать выбор рейтингов интуитивным и доступным (a11y labels).

### C4. New Play Session
**Файлы:**
- `apps/web/src/pages/Play/NewSessionPage.tsx`
- `apps/web/src/components/play/InviteLinkShare.tsx`

**Задачи:**
- Линейная форма без лишних блоков.
- Ясная воронка: ввод данных -> создание -> шаринг ссылки.

### C5. Coach Schedule
**Файлы:**
- `apps/web/src/pages/Coach/SchedulePage.tsx`
- `apps/web/src/components/schedule/WeekView.tsx`
- `apps/web/src/components/schedule/SlotCard.tsx`

**Задачи:**
- Компактная недельная сетка + легенда статусов.
- Проверить скролл/читаемость на узких экранах.

### C6. Notifications
**Файлы:**
- `apps/web/src/pages/Notifications/NotificationsPage.tsx`
- `apps/web/src/components/notification/NotificationCard.tsx`

**Задачи:**
- Реализовать ultra-clean список уведомлений.
- Упростить визуал, оставить только приоритетную информацию.

---

## Эпик D — Shared contracts (packages/shared)

### D1. UI-константы статусов и лейблов
**Файлы:**
- `packages/shared/src/constants/*`
- `packages/shared/src/index.ts`

**Задачи:**
- Добавить/актуализировать константы для статусов, которые повторяются в web/api.
- Переиспользовать enum из shared в компонентных маппингах фронта.

### D2. Типы DTO для экранов
**Файлы:**
- `packages/shared/src/types/*`

**Задачи:**
- Проверить, что типы покрывают новые UI-представления (dashboard cards, notifications item model, review form state).
- При расширении типов обновить barrel export.

---

## Эпик E — Качество и приемка

### E1. Проверки перед merge
- `npm run lint --workspace=@wooftennis/web`
- `npm run build --workspace=@wooftennis/web`
- Smoke-проверка главных сценариев из `docs/04-user-flows.md`.

### E2. UI QA checklist
- Все ключевые экраны совпадают с артефактами из `docs/11-design-artifacts.md`.
- Для light/dark нет "сломанных" контрастов.
- Русская локаль полная; английская доступна как fallback.
- Нет визуальной перегрузки: один главный action, читаемые отступы, короткие подписи.

---

## Предлагаемый порядок выполнения

1. A1 -> A2 -> B1  
2. C1/C2/C6 (основные пользовательские потоки)  
3. C3/C4/C5  
4. B2 + D1/D2  
5. E1/E2

## Зависимости от архитектора/бэкенда

- Подтверждение финальных enum/DTO в `@wooftennis/shared`.
- Подтверждение формата серверных ошибок на русском (без регрессий в API).
- Согласование, какие строки остаются в TG MainButton, а какие дублируются в интерфейсе.
