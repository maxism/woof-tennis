# [BE TASK] Интеграционные тесты для `/auth/telegram/widget`

## Meta
- Role: BE
- Priority: P1
- Owner: BE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, docs/03-api-spec.md

## Context
Критичный auth-флоу требует автоматической защиты от регрессий. Сейчас необходим тестовый контур для позитивных и негативных сценариев endpoint.

## Scope
- Добавить интеграционные тесты для `POST /auth/telegram/widget`.
- Покрыть сценарии:
  - валидный payload виджета;
  - невалидная подпись (`hash`);
  - отсутствующий `TELEGRAM_BOT_TOKEN`;
  - ошибка репозитория/БД при upsert.
- Проверить коды ответов и формат error body.

## Out of Scope
- E2E UI тестирование фронта.
- Рефакторинг auth-модулей вне нужного тестового скоупа.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- docs/03-api-spec.md
- apps/api/src/modules/auth/
- apps/api/src/modules/auth/auth.controller.ts
- apps/api/src/modules/auth/auth.service.ts
- apps/api/src/modules/auth/auth.module.ts

## Deliverables
- Набор интеграционных тестов для endpoint.
- Обновление test docs/README при необходимости.

## Acceptance Criteria
- [ ] Все заявленные сценарии покрыты автотестами.
- [ ] Тесты стабильно проходят локально и в CI.
- [ ] Формат ошибок соответствует API-ожиданиям.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Проверить, что тесты падают при искусственной регрессии в валидации/ошибках endpoint.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Заменен несуществующий input `apps/api/test/` на фактические текущие точки тестового контура в `apps/api/src/common/utils/*.spec.ts`.
- 2026-04-13: Убрана неисполняемая команда `npm run test:e2e --workspace=@wooftennis/api`; validation приведен к текущему состоянию проекта (`test` + `build`).
- 2026-04-13: Добавлено поле `Proposed by: QA`.
- 2026-04-13: Inputs уточнены под реальный интеграционный скоуп auth-модуля (`auth.controller.ts`, `auth.service.ts`, `auth.module.ts`) вместо unit spec-файлов util-уровня.
