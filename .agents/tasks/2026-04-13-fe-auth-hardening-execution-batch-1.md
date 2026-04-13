# [FE TASK] Execution batch 1: auth hardening (infra + UX)

## Meta

- Role: FE
- Priority: P0
- Owner: FE agent
- Requested by: PM Coordinator
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context

Нужно приступить к реальным правкам по auth hardening на фронтенде и закрыть критичные UX/infra пробелы.

## Scope

- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/FE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
- Выполнить задачи:
  - `.agents/tasks/2026-04-13-fe-auth-error-handler-and-telemetry.md` (WT-001)
  - `.agents/tasks/2026-04-13-fe-telegram-auth-error-ux.md` (WT-002)
- В конце предложить PM обновление статусов WT-001/WT-002 в issue-реестре.

## Out of Scope

- Изменения backend API.
- Изменения бизнес-логики на стороне NestJS.

## Inputs

- AGENTS.md
- .agents/COMMON.md
- .agents/FE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-13-fe-auth-error-handler-and-telemetry.md
- .agents/tasks/2026-04-13-fe-telegram-auth-error-ux.md

## Deliverables

- Реальные изменения в `apps/web` по двум FE auth-задачам.
- Проверки lint/build + ручные проверки error states.
- Handoff с предложением статуса issue-ID (OPEN -> IN_PROGRESS/CLOSED).

## Acceptance Criteria

- Обе FE auth-задачи реализованы или четко декомпозированы с блокерами.
- Локальные проверки успешны (`lint`, `build`).
- Есть предложение по обновлению статусов WT-001 и WT-002.

## Validation

- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Смоделировать `401`, `500`, network error.
  - Проверить retry и русские тексты ошибок.

## Handoff Format

- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-001, WT-002)