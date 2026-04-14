# [QA TASK] Re-run live smoke WT-020 after `/locations` BE follow-up

## Meta
- Role: QA
- Priority: P0
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Предыдущий live smoke WT-020 завершился FAIL из-за `/locations`. После BE follow-up нужен повторный короткий live прогон только для gate closure.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/QA.md`
  - `.agents/ISSUES-TRACKER.md`
  - `.agents/tasks/2026-04-14-qa-live-smoke-close-wt020.md`
  - `.agents/tasks/2026-04-14-be-followup-locations-runtime-role-and-validation.md`
- Повторить live capture по:
  - `/locations` (player -> 403, coach -> 200, coach+invalid query -> 400),
  - контрольные `/bookings/coach` и `/play-sessions/my` (для полноты gate).

## Out of Scope
- Code changes FE/BE.

## Inputs
- docs/03-api-spec.md
- docs/05-frontend-structure.md
- docs/06-backend-structure.md

## Deliverables
- Обновленный live smoke report.
- Итоговый verdict WT-020: PASS / PASS WITH RISKS / FAIL.
- Рекомендация по статусам WT-018 и WT-020.

## Acceptance Criteria
- [ ] По `/locations` матрица 200/400/403 соответствует baseline.
- [ ] Есть полный capture endpoint/role/query/status/message.
- [ ] Есть однозначная рекомендация по закрытию WT-020.

## Validation
- Commands:
  - `N/A (live smoke)`
- Manual checks:
  - Сценарии role+query на живом стенде.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-018, WT-020)
