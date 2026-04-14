# [ARCHITECT TASK] Coordination batch 1: env strategy for auth hardening

## Meta
- Role: Architect
- Priority: P0
- Owner: Architect agent
- Requested by: PM Coordinator
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/ARCHITECT.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Для стабильного закрытия backend auth-задач нужен однозначный архитектурный baseline по env loading strategy.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/ARCHITECT.md`
  - `.agents/ISSUES-TRACKER.md`
- Выполнить задачу:
  - `.agents/tasks/2026-04-13-architect-env-loading-strategy.md` (WT-007)
- Сформировать четкие входы для BE и критерии валидации для QA.
- В конце предложить PM обновление статуса WT-007.

## Out of Scope
- Непосредственная реализация в коде.
- Изменения FE UX.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/ARCHITECT.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- .agents/tasks/2026-04-13-architect-env-loading-strategy.md

## Deliverables
- Архитектурное решение по env source-of-truth.
- Приоритеты резолва env по средам (local/docker/CI).
- План внедрения для BE и критерии приемки для QA.

## Acceptance Criteria
- [ ] Есть однозначная стратегия env loading.
- [ ] Определен пошаговый план внедрения без простоя.
- [ ] Зафиксированы риски и меры снижения.
- [ ] Есть предложение по статусу WT-007.

## Validation
- Commands:
  - `N/A (архитектурная задача)`
- Manual checks:
  - Совместное ревью решения с BE и PM Coordinator.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусу issue-ID (WT-007)

## Updates
- 2026-04-14: Если Architect уже отдал handoff — зафиксированное решение см. в `.agents/tasks/2026-04-13-architect-env-loading-strategy.md` (`## Updates`). Дальнейшая работа — BE + QA + PM по правилам в `.agents/PM-COORDINATOR.md` и `.agents/issues/ISSUES.md`.
