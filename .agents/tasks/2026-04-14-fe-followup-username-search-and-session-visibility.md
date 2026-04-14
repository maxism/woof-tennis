# [FE TASK] P0 follow-up: закрыть WT-010 и WT-012 после QA FAIL

## Meta
- Role: FE
- Priority: P0
- Owner: FE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md, .agents/tasks/2026-04-14-qa-player-coach-play-regression-pack-handoff.md

## Context
QA gate `WT-016` вернулся с `FAIL`: два пункта остались частично закрытыми.
- WT-010: backend username search реализован, но FE search flow продолжает работать через id-путь.
- WT-012: invalidation есть, но в UI нет надежного подтверждаемого сценария «создал -> вижу» на реальных данных.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/FE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
  - `.agents/tasks/2026-04-14-qa-player-coach-play-regression-pack-handoff.md`
- Доработать WT-010:
  - интегрировать FE `SearchPage` с username-based API;
  - закрыть сценарии found/not found в user-facing UI.
- Доработать WT-012:
  - обеспечить в UI однозначный путь проверки, что созданная play-session/тренировка видна пользователю;
  - минимизировать риск «создал, но не вижу» (query keys, refetch trigger, destination list, empty states).

## Out of Scope
- Новые backend-контракты (использовать уже реализованный BE endpoint).
- Полный редизайн player/search.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/FE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-14-qa-player-coach-play-regression-pack-handoff.md
- apps/web/src/pages/Player/SearchPage.tsx
- apps/web/src/pages/Play/NewSessionPage.tsx
- apps/web/src/pages/Play/JoinSessionPage.tsx
- apps/web/src/api/

## Deliverables
- FE fix для username-search flow (WT-010).
- FE fix/UX-path для гарантированной видимости созданной сущности (WT-012).
- Handoff с шагами ручной проверки для QA.

## Acceptance Criteria
- [x] Пользовательский search flow работает по Telegram username (found/not found).
- [x] После создания сущности есть надежный пользовательский сценарий, где она отображается.
- [x] Команды `lint` и `build` web проходят.

## Validation
- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Поиск по существующему username и по несуществующему.
  - Создание сессии/тренировки и проверка отображения в целевом списке.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-010, WT-012, WT-016)
