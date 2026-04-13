# [BE TASK] Readiness-check БД и контроль миграций до приема трафика

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, docs/13-build-stages.md

## Context
Инцидент: endpoint auth возвращал 500 из-за непримененных миграций. Нужен технический барьер, который не позволит API считаться готовым при неактуальной схеме БД.

## Scope
- Добавить readiness-проверку доступности БД и валидности схемы/миграций.
- Внедрить pre-traffic gate: инстанс не должен переходить в ready при проблеме миграций.
- Обеспечить диагностичное сообщение в логах.

## Out of Scope
- Редизайн существующих миграций.
- Изменение бизнес-правил авторизации.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- docs/13-build-stages.md
- apps/api/src/health.controller.ts
- apps/api/src/config/data-source.ts
- apps/api/src/migrations/

## Deliverables
- Реализованный readiness-check по БД/схеме.
- Механизм блокировки ready-состояния при проблеме миграций.
- Документация ручной проверки состояния.

## Acceptance Criteria
- [ ] При непримененных миграциях сервис не считается ready.
- [ ] В логах есть понятная причина (migration/schema issue).
- [ ] При актуальной схеме readiness проходит успешно.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Запустить API на базе без миграций и убедиться, что readiness не проходит.
  - Применить миграции и убедиться, что readiness становится healthy.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Добавлено поле `Proposed by: QA` в Meta для прозрачности источника инициативы.
