# [BE TASK] Наблюдаемость auth pipeline и классификация ошибок

## Meta
- Role: BE
- Priority: P1
- Owner: BE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, docs/03-api-spec.md

## Context
Разбор инцидентов по auth затруднен из-за недостатка структурированных логов и явной классификации причин отказа.

## Scope
- Ввести структурированные логи для `POST /auth/telegram/widget`.
- Добавить классификацию стадий/ошибок (`env_missing`, `widget_signature_invalid`, `db_upsert_failed` и т.п.).
- Пробросить `requestId`/correlation id через ключевые логи.
- Обеспечить отсутствие утечки секретов и чувствительных данных.

## Out of Scope
- Изменение бизнес-алгоритма Telegram валидации.
- Внедрение внешней observability-платформы, если это отдельный проект.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- apps/api/src/modules/auth/auth.service.ts
- apps/api/src/common/filters/http-exception.filter.ts
- docs/03-api-spec.md

## Deliverables
- Структурированные логи auth flow.
- Перечень кодов причин отказа и где они логируются.
- Краткая инструкция для QA/поддержки по чтению логов.

## Acceptance Criteria
- [ ] По `requestId` можно отследить весь путь auth-запроса.
- [ ] Для каждого отказа логируется нормализованная причина.
- [ ] Секреты (`TELEGRAM_BOT_TOKEN`, hash-сырые данные) не попадают в логи.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Спровоцировать `401` и `500` и убедиться, что логи содержат корректную классификацию причины.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Добавлено поле `Proposed by: QA` в Meta для прозрачности источника инициативы.
