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

**Связка WT-004 / WT-007:** реализация env (корневой `.env` только, fail-fast, миграции/CLI, лог источника конфига) — **главный носитель WT-004**. Закрытие **WT-007** для PM возможно только после QA-приемки по средам; см. `.agents/tasks/2026-04-13-architect-env-loading-strategy.md` (`## Updates` 2026-04-14) и `.agents/issues/ISSUES.md`.

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
- В начале работ по env предложить PM перевести **WT-007** в `IN_PROGRESS` (Owner: BE) в `.agents/issues/ISSUES.md`.
- В конце предложить PM обновление статусов WT-003..WT-006 и **согласованное** обновление WT-004 / WT-007 (после QA sign-off по WT-007).

## Out of Scope
- FE UX-изменения.
- Повторное проектирование env strategy сверх уже зафиксированного Architect handoff (см. `architect-env-loading-strategy.md`, Updates).

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-13-architect-env-loading-strategy.md
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
- [ ] Есть предложение по статусам WT-003..WT-006 и по WT-004 / WT-007 согласно правилам в issue-реестре.

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
- Предложение по статусам issue-ID (WT-003..WT-006, WT-004, WT-007)

## Updates
- 2026-04-14: Уточнена связка WT-004/WT-007, вход Architect task, lifecycle WT-007 → IN_PROGRESS при старте BE.
