# [QA TASK] Re-run WT-016 after FE follow-up (WT-010, WT-012)

## Meta
- Role: QA
- Priority: P0
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Первый прогон WT-016 завершился `FAIL` из-за partial по WT-010 и WT-012. После FE follow-up нужен повторный regression gate.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/QA.md`
  - `.agents/ISSUES-TRACKER.md`
  - `.agents/tasks/2026-04-14-qa-player-coach-play-regression-pack-handoff.md`
- Проверить результаты FE follow-up задачи:
  - `.agents/tasks/2026-04-14-fe-followup-username-search-and-session-visibility.md`
- Повторно прогнать релевантные сценарии WT-010 и WT-012, затем дать итог по WT-016.

## Out of Scope
- Самостоятельные код-правки FE/BE.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/QA.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-14-qa-player-coach-play-regression-pack-handoff.md
- .agents/tasks/2026-04-14-fe-followup-username-search-and-session-visibility.md

## Deliverables
- QA verdict по повторному gate: PASS / PASS WITH RISKS / FAIL.
- Обновленный matrix для WT-010 и WT-012.
- Предложение по статусам WT-010, WT-012, WT-016.

## Acceptance Criteria
- [ ] Проверены сценарии found/not found для username-search (WT-010).
- [ ] Проверен сценарий «создал -> вижу в ожидаемом списке» на реальных/валидных данных (WT-012).
- [ ] Есть итоговое решение по WT-016.

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/web`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - Username search в user-facing потоке.
  - Создание сущности и подтверждение видимости в UI.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-010, WT-012, WT-016)
