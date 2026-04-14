# [BE TASK] P0: API hardening + e2e coverage for critical list endpoints

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
В рантайме критичные endpoint-ы дают `400/403` в базовых сценариях (`bookings/coach`, `play-sessions/my`, `locations`). Нужна стабилизация API-поведения и e2e API-защита от регрессий.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/BE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
  - output architect task: `.agents/tasks/2026-04-14-architect-list-endpoints-contract-alignment.md`
- Привести API к согласованному контракту:
  - `GET /play-sessions/my` (`limit/page` поддерживаются или явно запрещены по контракту),
  - `GET /bookings/coach` (валидный validation-path и прозрачные `400` причины),
  - `GET /locations` (coach-only поведение по контракту).
- Добавить e2e API тесты для role/query сценариев.

## Out of Scope
- FE UX/обработчики (отдельная FE задача).

## Inputs
- apps/api/src/modules/bookings/
- apps/api/src/modules/play-sessions/
- apps/api/src/modules/locations/
- apps/api/src/main.ts
- apps/api/src/common/

## Deliverables
- Исправленное/уточненное API поведение по трем endpoint-ам.
- E2E API тесты по role/query комбинациям.
- Рекомендация по статусу WT-018.

## Acceptance Criteria
- [ ] `bookings/coach`: coach+valid query -> expected success; player -> expected 403; invalid query -> expected 400 с понятным message.
- [ ] `play-sessions/my`: поведение с pagination params соответствует согласованному контракту.
- [ ] `locations`: role behavior предсказуем и согласован с контрактом.
- [ ] E2E API suite падает при регрессии этих сценариев.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Capture и приложить `status + message` для key 400/403 cases.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-018)
