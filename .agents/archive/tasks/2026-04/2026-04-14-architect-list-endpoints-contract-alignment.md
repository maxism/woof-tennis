# [ARCHITECT TASK] P0: Contract Alignment for List Endpoints

## Meta
- Role: Architect
- Priority: P0
- Owner: Architect agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/ARCHITECT.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
На runtime зафиксированы `400/403` в критичных list endpoint-ах (`bookings/coach`, `play-sessions/my`, `locations`). Локальные build/test проходят, но контракт и role expectations между FE/BE/QA расходятся.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/ARCHITECT.md`
  - `.agents/ISSUES-TRACKER.md`
- Зафиксировать единый контракт для:
  - `GET /bookings/coach` (валидные query params и expected error semantics),
  - `GET /play-sessions/my` (поддержка `limit/page` или явный запрет),
  - `GET /locations` (coach/player role behavior).
- Синхронизировать и документировать contract baseline для FE/BE/QA.

## Out of Scope
- Непосредственная код-реализация (делают BE/FE).

## Inputs
- docs/03-api-spec.md
- docs/06-backend-structure.md
- apps/api/src/modules/bookings/
- apps/api/src/modules/play-sessions/
- apps/api/src/modules/locations/

## Deliverables
- Четкий contract decision по трем endpoint-ам.
- Краткий handoff для BE/FE/QA с конкретными правилами.
- Предложение по статусу WT-017.

## Acceptance Criteria
- [ ] Нет неоднозначности по query-параметрам и role expectations.
- [ ] Docs и handoff согласованы с текущим кодом или целевыми изменениями.
- [ ] FE/BE/QA могут работать по одному source of truth.

## Validation
- Commands:
  - `N/A (архитектурная задача)`
- Manual checks:
  - Ревью решения с BE + FE + PM.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-017)
