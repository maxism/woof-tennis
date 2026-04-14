# [BE TASK] P0: синхронизация root env шаблонов и документации

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
После рефакторинга env-loading (`root .env` как source of truth) остался дрейф между `/.env`, `/.env.example` и документацией. Нужна синхронизация обязательных переменных и правил по средам.

## Scope
- Синхронизировать обязательные env в:
  - корневом `.env.example`;
  - корневом `.env` (локальный рабочий файл команды);
  - релевантных docs с таблицами env.
- Проверить и явно зафиксировать правила для `DB_HOST`/`DB_PORT`:
  - local host run;
  - docker compose run.
- Убедиться, что Naming/обязательность совпадают с fail-fast в API и TypeORM CLI.

## Out of Scope
- Изменение продуктовой логики auth.
- Добавление новых env-переменных без архитектурной необходимости.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .env.example
- .env
- docs/14-onboarding-setup.md
- docs/08-deployment.md
- docs/06-backend-structure.md

## Deliverables
- Обновленные `.env` и `.env.example` без рассинхрона обязательных ключей.
- Обновленные docs с едиными правилами env.
- Handoff с перечнем измененных env-полей и таблицей local/docker правил.

## Acceptance Criteria
- [ ] `/.env` и `/.env.example` содержат одинаковый набор обязательных ключей.
- [ ] В docs явно описаны правила `DB_HOST`/`DB_PORT` для local и docker compose.
- [ ] Описание env не противоречит правилам fail-fast и WT-007.
- [ ] QA может пройти env-checklist по 3 средам без дополнительных догадок.

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Визуально сверить `.env` vs `.env.example` по обязательным ключам.
  - Проверить соответствие docs фактической конфигурации запуска.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-004, WT-007, WT-008)
