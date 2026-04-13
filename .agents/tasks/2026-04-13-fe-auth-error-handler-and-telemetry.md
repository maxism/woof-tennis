# [FE TASK] Централизованный auth error-handler и телеметрия сбоев

## Meta
- Role: FE
- Priority: P1
- Owner: FE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md

## Context
Ошибки авторизации обрабатываются разрозненно, что усложняет диагностику и делает пользовательское поведение непоследовательным.

## Scope
- Вынести обработку ошибок auth в единый frontend слой.
- Нормализовать технические классы ошибок (`401`, `429`, `500`, network) на уровне инфраструктуры (без финальных UX-текстов).
- Добавить телеметрию auth-сбоев (тип, endpoint, http status, trace id если есть).
- Подготовить API/интерфейс для UI-слоя, который будет использоваться в задаче `2026-04-13-fe-telegram-auth-error-ux.md`.

## Out of Scope
- Изменения backend API.
- Полное внедрение новой аналитической платформы.
- Финальные тексты, визуальные компоненты и UX-стейты экрана логина (выполняются в `2026-04-13-fe-telegram-auth-error-ux.md`).

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/FE-DEV.md
- apps/web/src/api/auth.ts
- apps/web/src/stores/authStore.ts
- apps/web/src/hooks/useBootstrapAuth.ts
- apps/web/src/components/auth/TelegramLoginWidget.tsx

## Deliverables
- Централизованный auth error-handler.
- Отправка телеметрии по auth-ошибкам.
- Короткое описание event-схемы для QA/BE.

## Acceptance Criteria
- [ ] Все auth запросы используют единый обработчик ошибок.
- [ ] Нормализация и маппинг классов ошибок для UI-слоя консистентны для всех auth-запросов.
- [ ] Ошибки auth наблюдаемы в телеметрии.

## Validation
- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Смоделировать основные типы auth ошибок и проверить событие телеметрии для каждого.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Исправлены несуществующие Inputs-пути на фактические (`api/auth.ts`, `stores/authStore.ts`, `hooks/useBootstrapAuth.ts`, `components/auth/TelegramLoginWidget.tsx`).
- 2026-04-13: Уточнен split с UX-задачей: эта задача отвечает за инфраструктуру ошибок и телеметрию, без финальных UI-текстов/стейтов.
- 2026-04-13: Добавлено поле `Proposed by: QA`.
- 2026-04-13: Acceptance Criteria уточнен, чтобы убрать пересечение с UX-задачей (фокус на error mapping инфраструктурного уровня).
