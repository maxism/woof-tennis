# [QA TASK] Validation batch 1: auth hardening sign-off

## Meta

- Role: QA
- Priority: P1
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context

После выполнения FE/BE/Architect задач нужен единый QA sign-off по auth hardening и рекомендация на merge/release.

## Scope

- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/QA.md`
  - `.agents/ISSUES-TRACKER.md`
- Выполнить задачу:
  - `.agents/tasks/2026-04-13-qa-auth-smoke-and-regression-pack.md` (WT-008)
- Провалидировать результаты execution-batch задач:
  - `.agents/tasks/2026-04-13-fe-auth-hardening-execution-batch-1.md`
  - `.agents/tasks/2026-04-13-be-auth-hardening-execution-batch-1.md`
  - `.agents/tasks/2026-04-13-architect-auth-hardening-coordination-batch-1.md`
- В конце предложить PM обновление статусов WT-001..WT-008.

## Out of Scope

- Самостоятельное исправление FE/BE дефектов.

## Inputs

- AGENTS.md
- .agents/COMMON.md
- .agents/QA.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-13-qa-auth-smoke-and-regression-pack.md
- .agents/tasks/2026-04-13-fe-auth-hardening-execution-batch-1.md
- .agents/tasks/2026-04-13-be-auth-hardening-execution-batch-1.md
- .agents/tasks/2026-04-13-architect-auth-hardening-coordination-batch-1.md

## Deliverables

- QA отчет: PASS / PASS WITH RISKS / FAIL.
- Дефекты с приоритетом и шагами воспроизведения.
- Рекомендации по статусам issue-ID WT-001..WT-008.

## Acceptance Criteria

- Пройден smoke/regression auth pack.
- Верифицированы критичные негативные сценарии.
- Есть четкая рекомендация для PM по merge/release.
- Есть предложение по статусам issue-ID WT-001..WT-008.

## Validation

- Commands:
  - `npm run build --workspace=@wooftennis/web`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - E2E auth flow + негативные сценарии (`401`, `500`, invalid signature, env issue behavior).

## Handoff Format

- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-001..WT-008)