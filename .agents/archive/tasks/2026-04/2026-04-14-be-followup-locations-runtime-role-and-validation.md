# [BE TASK] P0 follow-up: `/locations` runtime role resolution and validation order

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md, .agents/tasks/2026-04-14-qa-live-smoke-close-wt020.md

## Context
Live smoke по WT-020 вернулся с FAIL:
- `/locations` дает `403` даже в coach-сценарии после `PATCH /users/me { isCoach: true }`.
- `/locations?foo=1` дает `403` вместо ожидаемого `400` invalid-query semantics.

Это нарушает baseline `docs/03` / `docs/06` и держит WT-018/WT-020 открытыми.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/BE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
  - `docs/03-api-spec.md`
  - `docs/06-backend-structure.md`
- Найти и исправить причину `403` в coach-сценарии `/locations`:
  - проверить источник role truth (JWT claims vs DB state),
  - синхронизацию `isCoach` после PATCH,
  - корректность guard chain на `LocationsController`.
- Обеспечить контрактную семантику ошибок:
  - coach + валидный запрос -> `200`,
  - coach + invalid query key -> `400`,
  - player -> `403`.
- Добавить/уточнить тесты (интеграционные/e2e), чтобы регрессия ловилась до live smoke.

## Out of Scope
- FE-изменения.
- Рефакторинг не относящихся контроллеров.

## Inputs
- apps/api/src/modules/locations/
- apps/api/src/common/guards/coach.guard.ts
- apps/api/src/common/guards/jwt-auth.guard.ts
- apps/api/src/main.ts
- apps/api/src/modules/users/
- apps/api/src/modules/auth/

## Deliverables
- BE fix для `/locations` runtime role/validation поведения.
- Тесты на контрактную матрицу 200/400/403.
- Handoff с clear repro-before/repro-after.

## Acceptance Criteria
- [ ] `/locations` в coach-сценарии дает `200`.
- [ ] `/locations?foo=1` в coach-сценарии дает `400` с валидаторным message.
- [ ] `/locations` в player-сценарии дает `403`.
- [ ] Тесты покрывают матрицу и проходят локально.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Повторить QA-сценарии для `/locations` с реальным токеном и role switch.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-018, WT-020)
