# [BE TASK] Execution batch 1: auth hardening and reliability

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Нужно устранить критичные backend-риски auth pipeline и повысить надежность старта/готовности API.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/BE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
- Выполнить задачи:
  - `.agents/tasks/2026-04-13-be-auth-widget-integration-tests.md` (WT-003)
  - `.agents/tasks/2026-04-13-be-env-fail-fast-validation.md` (WT-004)
  - `.agents/tasks/2026-04-13-be-db-readiness-and-migrations-gate.md` (WT-005)
  - `.agents/tasks/2026-04-13-be-auth-observability-and-error-classification.md` (WT-006)
- В конце предложить PM обновление статусов WT-003..WT-006 в issue-реестре.

## Out of Scope
- FE UX-изменения.
- Архитектурное RFC по env strategy (отдельная задача архитектора).

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-13-be-auth-widget-integration-tests.md
- .agents/tasks/2026-04-13-be-env-fail-fast-validation.md
- .agents/tasks/2026-04-13-be-db-readiness-and-migrations-gate.md
- .agents/tasks/2026-04-13-be-auth-observability-and-error-classification.md

## Deliverables
- Реальные изменения в `apps/api` по четырем BE задачам.
- Локальные проверки (`test`, `build`, при необходимости `lint`).
- Handoff с предложением статуса issue-ID.

## Acceptance Criteria
- [ ] Реализованы все 4 BE задачи или зафиксированы четкие блокеры.
- [ ] Тесты и сборка проходят.
- [ ] Логи auth pipeline структурированы, без утечки секретов.
- [ ] Есть предложение по статусам WT-003..WT-006.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Проверка старта API без обязательных env.
  - Проверка readiness до/после миграций.
  - Проверка классификации `401/500` в логах.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-003..WT-006)
