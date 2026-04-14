# [FE TASK] P0: runtime contract sync + safe query builder

## Meta
- Role: FE
- Priority: P0
- Owner: FE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Runtime smoke выявил `400/403` из-за расхождения FE query-параметров с реальным API-контрактом. Нужно синхронизировать клиент с контрактом и стабилизировать user-facing error states.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/FE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
  - output architect task: `.agents/tasks/2026-04-14-architect-list-endpoints-contract-alignment.md`
- Синхронизировать FE API-клиенты:
  - `play-sessions/my` — отправлять только поддерживаемые query параметры;
  - `bookings/coach` — формировать только валидные фильтры.
- Добавить defensive query normalization:
  - исключить `undefined`/пустые/лишние параметры из URL.
- Добавить предсказуемый UX для role-gated/validation ошибок (403/400).

## Out of Scope
- Изменения BE validation logic (отдельная BE задача).

## Inputs
- apps/web/src/api/
- apps/web/src/pages/Coach/
- apps/web/src/pages/Play/
- apps/web/src/utils/apiError.ts

## Deliverables
- FE sync с согласованным runtime контрактом.
- Safe query builder/normalizer в местах list fetch.
- Рекомендация по статусу WT-019.

## Acceptance Criteria
- [x] FE не отправляет гарантированно невалидные query.
- [x] Ошибки 400/403 отображаются предсказуемо и не как "тихий сбой".
- [x] Поведение FE соответствует решению Architect + BE API.

## Validation
- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Прогон list endpoint user flow с валидными/невалидными фильтрами.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-019)
