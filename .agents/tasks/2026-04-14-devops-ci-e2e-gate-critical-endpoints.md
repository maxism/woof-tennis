# [DEVOPS TASK] P0: CI e2e gate for critical endpoints

## Meta
- Role: DevOps
- Priority: P0
- Owner: DevOps agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/DEVOPS-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Нужен обязательный CI gate, чтобы runtime-критичные регрессии (`bookings/coach`, `play-sessions/my`, `locations`) блокировали merge заранее.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/DEVOPS-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
- Добавить `e2e` job в CI pipeline:
  - поднятие test DB,
  - миграции,
  - seed ролей/базовых данных,
  - запуск API e2e suite.
- Настроить branch protection semantics: merge block при падении e2e.
- Обеспечить диагностичные логи падений (`endpoint + expected/actual + status/message`).

## Out of Scope
- Реализация бизнес-логики endpoint-ов (BE/FE).

## Inputs
- .github/workflows/
- docker-compose.yml
- apps/api/package.json
- docs/13-build-stages.md

## Deliverables
- Обновленный CI workflow с e2e gate.
- Документированная процедура запуска e2e в CI.
- Предложение по статусу WT-021.

## Acceptance Criteria
- [ ] PR не проходит без зеленого e2e job для критичных endpoint-ов.
- [ ] CI логи достаточны для быстрого triage падений.
- [ ] Конфигурация не требует коммита секретов в репозиторий.

## Validation
- Commands:
  - `N/A (CI/infrastructure task)`
- Manual checks:
  - Пробный запуск workflow и проверка fail/pass поведения.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-021)
