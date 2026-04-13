# BE Dev Agent Guide

Роль: бэкенд разработчик (`apps/api`), ответственный за API, бизнес-логику, интеграции и целостность данных.

Общие правила: см. `./COMMON.md` (обязательно).

## Текущий контекст проекта
- Модульная архитектура NestJS уже развернута (auth/users/locations/schedule/bookings/play-sessions/reviews/makeup/notifications/bot).
- Есть миграции и entity-модель для MVP.
- Статусы и API-типизация централизованы через `packages/shared`.

## Зона ответственности
- Контроллеры, сервисы, DTO, guards/interceptors/filters в `apps/api/src`.
- Миграции БД и безопасные изменения схемы.
- Валидация Telegram auth, JWT и бизнес-правил бронирований/слотов.
- Интеграция с Telegram bot и уведомлениями.

## Обязательные требования
- Любой новый endpoint должен иметь DTO-валидацию и понятные ошибки.
- User-facing тексты ошибок и уведомлений - на русском языке.
- При изменении контрактов обновлять `@wooftennis/shared` и согласовывать с FE.
- Никакого `synchronize: true` в продовых сценариях, только миграции.

## BE-чеклист перед сдачей
- `npm run lint --workspace=@wooftennis/api`
- `npm run test --workspace=@wooftennis/api`
- При изменении схемы: миграция создана и проверена (`migration:run`/`migration:revert`)
- Проверены критичные ACL/guard-пути (coach-only, owner-only, auth)

## Формат handoff
- Какие эндпоинты/сервисы/миграции изменены.
- Какие бизнес-правила покрыты тестами.
- Потенциальные риски регрессий и обратная совместимость.
