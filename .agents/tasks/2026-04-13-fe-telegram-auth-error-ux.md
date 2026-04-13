# [FE TASK] UX-обработка ошибок Telegram авторизации (401/500)

## Meta
- Role: FE
- Priority: P0
- Owner: FE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md, docs/05-frontend-structure.md

## Context
При сбоях Telegram авторизации пользователь может получить неочевидное поведение (ошибка только в консоли/непонятный отказ). Нужно обеспечить понятный UX с возможностью повторной попытки.

## Scope
- Реализовать пользовательские UI-стейты для ошибок auth (`401`, `500`) поверх централизованного handler из задачи `2026-04-13-fe-auth-error-handler-and-telemetry.md`.
- Показать понятные русские сообщения и действие `Повторить`.
- Сохранить консистентность поведения в light/dark теме.

## Out of Scope
- Изменения backend логики.
- Изменения API-контракта.
- Изменение инфраструктуры сетевого слоя и телеметрии (выполняется в `2026-04-13-fe-auth-error-handler-and-telemetry.md`).

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/FE-DEV.md
- docs/05-frontend-structure.md
- apps/web/src/api/auth.ts
- apps/web/src/stores/authStore.ts
- apps/web/src/hooks/useBootstrapAuth.ts
- apps/web/src/components/auth/TelegramLoginWidget.tsx
- .agents/tasks/2026-04-13-fe-auth-error-handler-and-telemetry.md

## Deliverables
- UI-состояния ошибок Telegram login.
- Ретраи/повторный запуск auth-попытки.
- Тест-кейсы/проверки для новых error states.

## Acceptance Criteria
- [ ] При `401` пользователь видит понятный сценарий ошибки авторизации.
- [ ] При `500` пользователь видит сценарий временной недоступности + retry.
- [ ] Ошибка не остается только в dev-консоли.
- [ ] Тексты user-facing сообщений на русском.

## Validation
- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Смоделировать `401` и `500` на auth endpoint и проверить UI-поведение.
  - Проверить отображение в light/dark на ключевом auth-экране.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Исправлены Inputs-пути на существующие файлы auth-потока.
- 2026-04-13: Явно зафиксирована зависимость от `2026-04-13-fe-auth-error-handler-and-telemetry.md` и разграничен ownership (эта задача только UI/копирайтинг/states).
- 2026-04-13: Добавлено поле `Proposed by: QA`.
