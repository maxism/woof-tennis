# [PM TASK] Контроль env-синхронизации и QA gate по 3 средам

## Meta
- Role: PM Coordinator
- Priority: P0
- Owner: PM Coordinator
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/PM-COORDINATOR.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
QA выявил рассинхрон env-шаблонов после перехода на root `.env`. Нужно управленчески закрепить изменения и проконтролировать приемку по local/docker/CI.

## Scope
- Обновить Notes/статусы в `.agents/issues/ISSUES.md` по WT-004, WT-007, WT-008 с явной привязкой к env-sync.
- Выдать и проконтролировать выполнение BE-задачи:
  - `.agents/tasks/2026-04-14-be-env-template-sync-root-env.md`
- После handoff от BE запустить QA-проверку по 3 средам и зафиксировать результат.

## Out of Scope
- Самостоятельные кодовые правки API/FE.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/PM-COORDINATOR.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-14-be-env-template-sync-root-env.md
- .agents/tasks/2026-04-13-qa-auth-smoke-and-regression-pack.md

## Deliverables
- Актуализированный issue-реестр по env-треку.
- Подтвержденный QA-gate по средам (local/docker/CI или явное исключение CI).
- Рекомендация по закрытию WT-004/WT-007/WT-008.

## Acceptance Criteria
- [ ] В реестре нет двусмысленности по владельцу и стадии WT-004/WT-007.
- [ ] BE-task по env-sync выполнен и проверен.
- [ ] QA отчет по 3 средам получен и зафиксирован.
- [ ] Решение по закрытию issue оформлено в `.agents/issues/ISSUES.md`.

## Validation
- Commands:
  - `N/A (управленческая задача)`
- Manual checks:
  - Сверить Notes в issue-реестре с фактическими handoff BE/QA.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
