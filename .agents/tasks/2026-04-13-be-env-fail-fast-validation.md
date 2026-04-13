# [BE TASK] Fail-fast валидация обязательных env для API

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, docs/14-onboarding-setup.md

## Context
Сервис API может стартовать без критичных переменных окружения и падать позже в рантайме (например, в auth). Это приводит к 401/500 в пользовательском трафике вместо явной ошибки старта.

## Scope
- Внедрить fail-fast валидацию обязательных env при запуске API.
- Обязательные переменные минимум: `TELEGRAM_BOT_TOKEN`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.
- Ошибки валидации сделать читаемыми и пригодными для диагностики.
- Зафиксировать единое имя переменной Telegram токена: `TELEGRAM_BOT_TOKEN`.

## Out of Scope
- Рефакторинг бизнес-логики авторизации.
- Изменение контрактов API.
- Изменения фронтенда.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- docs/14-onboarding-setup.md
- docs/03-api-spec.md
- apps/api/src/app.module.ts
- apps/api/src/main.ts

## Deliverables
- Реализация fail-fast проверки env в API startup flow.
- Явная ошибка старта при отсутствии обязательных env.
- Обновление документации запуска (если поведение изменилось).

## Acceptance Criteria
- [ ] API не стартует при отсутствии любой обязательной переменной.
- [ ] Текст ошибки содержит список отсутствующих env.
- [ ] При корректном env API стартует без регрессий.
- [ ] В коде и доках используется `TELEGRAM_BOT_TOKEN` без альтернативных имен.

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/api`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - Запустить API без `TELEGRAM_BOT_TOKEN` и убедиться, что старт останавливается с понятной ошибкой.
  - Вернуть переменную и убедиться, что API стартует и endpoint auth доступен.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Добавлено поле `Proposed by: QA` в Meta для прозрачности источника инициативы.
