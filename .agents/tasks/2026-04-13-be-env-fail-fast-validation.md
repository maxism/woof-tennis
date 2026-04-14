# [BE TASK] Fail-fast валидация обязательных env для API

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Proposed by: QA
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, docs/14-onboarding-setup.md

## Context
Сервис API может стартовать без критичных переменных окружения и падать позже в рантайме (например, в auth). Это приводит к 401/500 в пользовательском трафике вместо явной ошибки старта.

## Scope
- Внедрить fail-fast валидацию обязательных env при запуске API.
- Обязательные переменные минимум: `TELEGRAM_BOT_TOKEN`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.
- Ошибки валидации сделать читаемыми и пригодными для диагностики.
- Зафиксировать единое имя переменной Telegram токена: `TELEGRAM_BOT_TOKEN`.
- **Единый источник env для API и миграций:** после правок Nest API и TypeORM CLI (`migration:*` через `src/config/data-source.ts`) должны читать конфигурацию из **одного** файла — **корневого** `.env` репозитория. Файл `apps/api/.env` **не обязателен** и не должен требоваться для старта.
- При старте API один раз залогировать **откуда загружен конфиг** (например абсолютный путь к загруженному `.env` или маркер `repo_root`), **без** значений секретов и без дампа переменных.

## Out of Scope
- Рефакторинг бизнес-логики авторизации.
- Изменение контрактов API.
- Изменения фронтенда.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- docs/14-onboarding-setup.md
- docs/03-api-spec.md
- apps/api/src/app.module.ts
- apps/api/src/main.ts
- apps/api/src/config/data-source.ts

## Deliverables
- Реализация fail-fast проверки env в API startup flow.
- Явная ошибка старта при отсутствии обязательных env.
- Обновление документации запуска (если поведение изменилось).

## Definition of Done (сузить по решению Architect)
- [ ] API успешно стартует, когда заполнен **только** корневой `.env` репозитория, а `apps/api/.env` **отсутствует** или пустой/не используется.
- [ ] Команды миграций (`npm run migration:* --workspace=@wooftennis/api`) читают те же переменные из того же корневого `.env` (без обязательного дублирования в `apps/api/.env`).

## Acceptance Criteria
- [ ] API не стартует при отсутствии любой обязательной переменной.
- [ ] Текст ошибки содержит список отсутствующих env.
- [ ] При корректном env API стартует без регрессий.
- [ ] В коде и доках используется `TELEGRAM_BOT_TOKEN` без альтернативных имен.
- [ ] В логах старта есть безопасная строка о **источнике** загрузки конфигурации (путь/метка), без секретов.
- [ ] Сценарий «только root `.env`» проверяемо документирован в `docs/14-onboarding-setup.md` (или согласованном месте).

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/api`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - Убедиться, что при **отсутствии** `apps/api/.env` и наличии только корневого `.env` API стартует и auth доступен.
  - Запустить API без `TELEGRAM_BOT_TOKEN` в целевом env и убедиться, что процесс **не принимает HTTP-трафик**: fail-fast при старте (а не `401` на запросе).
  - Вернуть переменную и убедиться, что API стартует и endpoint auth доступен.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-13: Добавлено поле `Proposed by: QA` в Meta для прозрачности источника инициативы.
- 2026-04-14: Согласовано с Architect/PM: DoD про **только корневой `.env`**, выравнивание `data-source.ts` для миграций, лог источника конфига без секретов, негативный кейс `TELEGRAM_BOT_TOKEN` = fail-fast при старте. Связь закрытия с WT-007 — через QA по средам (см. QA tasks).
