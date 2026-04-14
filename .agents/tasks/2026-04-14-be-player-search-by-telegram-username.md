# [BE TASK] P0: player search по Telegram username вместо UUID

## Meta
- Role: BE
- Priority: P0
- Owner: BE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/BE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Текущий player/search в пользовательском сценарии не работает ожидаемо: поиск ориентирован на UUID, а продуктово нужен поиск тренера/игрока по Telegram nickname (username).

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/BE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
- Внести изменения в API поиска:
  - основной критерий поиска: `username` (Telegram nickname);
  - сохранить безопасное поведение при отсутствии/скрытом username;
  - вернуть понятные ошибки/empty-result без утечки данных.
- При необходимости предложить FE минимальные изменения контракта.

## Out of Scope
- Полный редизайн search ranking.
- Массовый рефакторинг user-domain.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/BE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- apps/api/src/modules/users/
- apps/api/src/modules/auth/
- docs/03-api-spec.md

## Deliverables
- API/сервис поиска по username.
- Тесты на позитивные/негативные кейсы.
- Handoff с рекомендацией статуса WT-010.

## Acceptance Criteria
- [ ] Поиск по Telegram username работает в основном сценарии.
- [ ] UUID как единственный обязательный вход больше не требуется для user-facing search.
- [ ] Для несуществующего username возвращается корректный empty/404 по контракту.
- [ ] Тесты покрывают новый путь.

## Validation
- Commands:
  - `npm run test --workspace=@wooftennis/api`
  - `npm run build --workspace=@wooftennis/api`
- Manual checks:
  - Проверить поиск по существующему username.
  - Проверить поведение по несуществующему username.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-010)
