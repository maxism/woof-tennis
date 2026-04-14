# [QA TASK] P0: regression pack по player/coach/play багам (WT-009..WT-015)

## Meta
- Role: QA
- Priority: P0
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Пользователь передал 8 критичных дефектов в player/coach/play потоках. Нужен единый QA-прогон после FE/BE фиксов с финальной рекомендацией по релизу.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/QA.md`
  - `.agents/ISSUES-TRACKER.md`
- Провалидировать исправления по:
  - WT-009, WT-011, WT-012, WT-015 (из FE play/role задачи);
  - WT-013, WT-014 (из FE coach задаче);
  - WT-010 (из BE search задаче).
- Для каждого пункта зафиксировать expected/actual и reproduce steps.

## Out of Scope
- Самостоятельные правки FE/BE кода.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/QA.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-14-fe-play-navigation-tabbar-and-role-routing.md
- .agents/tasks/2026-04-14-fe-coach-locations-form-and-slots-surface.md
- .agents/tasks/2026-04-14-be-player-search-by-telegram-username.md

## Deliverables
- QA отчет: PASS / PASS WITH RISKS / FAIL.
- Матрица проверок по 8 пунктам пользователя.
- Рекомендации по статусам WT-009..WT-016.

## Acceptance Criteria
- [ ] Все 8 пользовательских пунктов перепроверены.
- [ ] Для каждого issue WT-009..WT-015 есть четкий verdict (fixed/not fixed/partial).
- [ ] Есть финальная рекомендация PM по закрытию/переоткрытию issue.

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/web`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - Player flow: play/new -> share -> back, deep-link join, visibility in lists.
  - Coach flow: role switch, `coach/locations/new`, schedule/slots visibility.
  - Search flow: поиск по Telegram username.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-009..WT-016)
