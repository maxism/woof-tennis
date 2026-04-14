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
- 2026-04-14: **Зафиксированное решение для BE/QA/PM (handoff Architect):**
  - Source of truth для секретов API: **корневой** `.env` репозитория; `apps/api/.env` **не обязателен**.
  - **WT-007** закрывается после приемки QA в **local + docker compose + CI** (если CI-джоба отсутствует — явное исключение в `.agents/issues/ISSUES.md`).
  - **WT-004** и **WT-007**: одна реализация/PR от BE (fail-fast + единый путь загрузки + лог источника без секретов) или явный порядок merge, зафиксированный PM в Notes issue.
  - **FE:** не ожидать общий `.env` с бэком; публичные переменные только `VITE_*` в `apps/web/.env` (секреты бота/JWT только на сервере).
  - **DevOps/CI:** секреты из variables CI; корневой `.env` не коммитится; compose локально подхватывает root `.env` по текущей модели.
