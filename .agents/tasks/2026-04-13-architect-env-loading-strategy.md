# [ARCHITECT TASK] Единая стратегия загрузки env в монорепо

## Meta
- Role: Architect
- Priority: P0
- Owner: Architect agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/ARCHITECT.md, .agents/TASKS-FORMAT.md

## Context
Наблюдается рассинхрон между ожидаемым источником env (корневой `.env`) и фактическим поведением API. Требуется единая архитектурная стратегия загрузки конфигурации для всех режимов запуска.

## Scope
- Спроектировать source of truth для env в монорепо (`root .env` vs `apps/api/.env` vs гибрид).
- Определить приоритеты и порядок резолва переменных для local dev, docker compose и CI.
- Описать требования к bootstrap и к документации.
- Дать план миграции без простоя и без дублирования секретов.

## Out of Scope
- Непосредственная реализация в коде (выполняет BE).
- UI/UX изменения.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/ARCHITECT.md
- docs/14-onboarding-setup.md
- docs/08-deployment.md
- docker-compose.yml
- apps/api/src/app.module.ts
- apps/api/src/config/data-source.ts

## Deliverables
- Архитектурное решение с выбранной стратегией env.
- Таблица приоритетов/резолва env по средам.
- План внедрения для BE/DevOps/QA.
- Список обновлений в документации.

## Acceptance Criteria
- [ ] Есть однозначный источник env и правило приоритетов.
- [ ] Стратегия покрывает local, docker, CI.
- [ ] Указаны риски и способ их снижения.
- [ ] Есть четкие входы/выходы задач для BE и QA.

## Validation
- Commands:
  - `N/A (архитектурная задача)`
- Manual checks:
  - Ревью решения с BE и PM Coordinator.
  - Подтверждение, что решение применимо без изменения продуктовых контрактов.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Добавлено поле `Proposed by: QA` в Meta для прозрачности источника инициативы.
