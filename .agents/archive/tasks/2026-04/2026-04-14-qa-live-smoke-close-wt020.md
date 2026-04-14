# [QA TASK] P0: live smoke на стенде для закрытия WT-020

## Meta
- Role: QA
- Priority: P0
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md, .agents/tasks/2026-04-14-qa-runtime-regression-pack-mandatory-gate.md

## Context
WT-020 в статусе `IN_PROGRESS` с verdict `PASS WITH RISKS`. Для финального закрытия нужен один короткий live-прогон на стенде по той же контрактной матрице.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/QA.md`
  - `.agents/ISSUES-TRACKER.md`
- Выполнить live smoke по endpoint-ам:
  - `GET /bookings/coach`
  - `GET /play-sessions/my`
  - `GET /locations`
- Для каждого запроса зафиксировать:
  - endpoint,
  - роль пользователя,
  - query/body,
  - status,
  - message (если есть).

## Out of Scope
- Любые code-изменения FE/BE.

## Inputs
- docs/03-api-spec.md
- docs/05-frontend-structure.md
- docs/06-backend-structure.md
- .agents/tasks/2026-04-14-qa-runtime-regression-pack-mandatory-gate.md

## Deliverables
- Короткий live smoke report по 3 endpoint-ам.
- Финальный verdict: PASS / PASS WITH RISKS / FAIL.
- Рекомендация по статусу WT-020 (закрыть/не закрывать).

## Acceptance Criteria
- [ ] Есть capture `endpoint + role + query/body + status + message` по всем 3 endpoint-ам.
- [ ] Статусы соответствуют baseline (`200/400/403`) по role/query матрице.
- [ ] Есть однозначная рекомендация PM по закрытию WT-020.

## Validation
- Commands:
  - `N/A (live smoke on runtime stand)`
- Manual checks:
  - Прогнать ключевые role/query сценарии на стенде.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-020)
