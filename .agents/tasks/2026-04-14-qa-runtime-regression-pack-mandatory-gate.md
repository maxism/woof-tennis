# [QA TASK] P0: Runtime Regression Pack (Mandatory Gate)

## Meta
- Role: QA
- Priority: P0
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Build/test без runtime smoke не ловят критичные role/validation сбои. Требуется обязательный runtime gate для ключевых endpoint-ов и user flows перед merge/release.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/QA.md`
  - `.agents/ISSUES-TRACKER.md`
- Выполнить повторяемый runtime regression pack:
  - `GET /bookings/coach` (coach/player + query variants),
  - `GET /play-sessions/my` (with/without pagination params),
  - `GET /locations` (coach/player),
  - критичные player/coach/play флоу.
- Для каждого failure фиксировать:
  - endpoint,
  - роль пользователя,
  - query/body,
  - response: `status + message`.

## Out of Scope
- Кодовые правки FE/BE.

## Inputs
- .agents/tasks/2026-04-14-architect-list-endpoints-contract-alignment.md
- .agents/tasks/2026-04-14-be-api-hardening-and-e2e-list-endpoints.md
- .agents/tasks/2026-04-14-fe-runtime-contract-sync-safe-query-builder.md
- docs/03-api-spec.md

## Deliverables
- Runtime QA отчет: PASS / PASS WITH RISKS / FAIL.
- Воспроизводимый checklist + evidence по 400/403 кейсам.
- Предложение по статусу WT-020.

## Acceptance Criteria
- [ ] Каждый 400/403 кейс имеет зафиксированную причину (`message`) и роль/запрос.
- [ ] Репорт воспроизводим в следующем запуске.
- [ ] PM получает четкий gate verdict для merge/release.

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/web`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - Runtime smoke на стенде/локально по обязательным endpoint-ам.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-020)
