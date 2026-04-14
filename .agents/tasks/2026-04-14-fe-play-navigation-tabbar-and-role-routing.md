# [FE TASK] P0: play navigation/back, tabbar visibility, deep-link rendering, role routing

## Meta
- Role: FE
- Priority: P0
- Owner: FE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
Пользователь сообщил критичные дефекты в player/play flow: нет пути назад, исчезает tabbar, deep-link в play не отображает контент, созданная сессия не появляется в списках, переключение в coach-mode визуально включено, но интерфейс остается player.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/FE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
- Исправить и покрыть регрессией:
  - WT-009: `/play/new` и share-шаг — рабочий back path + корректная видимость TabBar.
  - WT-011: `/play/:inviteCode` должен показывать валидный экран (data/empty/error), не пустой холст.
  - WT-012: после создания play/training сущность появляется в соответствующих списках/дашборде без «невидимого» состояния.
  - WT-015: role switch «Стать тренером» корректно переключает доступный UI и маршруты.

## Out of Scope
- Изменение backend контрактов поиска пользователей (см. отдельную BE задачу WT-010).
- Изменения бизнес-логики бэкенда за пределами точечных совместимых правок.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/FE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- apps/web/src/components/layout/AppLayout.tsx
- apps/web/src/components/layout/TabBar.tsx
- apps/web/src/pages/Play/NewSessionPage.tsx
- apps/web/src/pages/Play/JoinSessionPage.tsx
- apps/web/src/stores/authStore.ts
- apps/web/src/hooks/useBootstrapAuth.ts

## Deliverables
- FE-правки для WT-009/WT-011/WT-012/WT-015.
- Единый описанный подход к back-навигации и TabBar visibility в play/coach/player переходах.
- Handoff с рекомендацией по статусам этих issue.

## Acceptance Criteria
- [x] На `/play/new` и share-шаге пользователь может вернуться назад через UI.
- [x] TabBar не исчезает неожиданно; правила скрытия/показа консистентны и документированы в коде.
- [x] Прямой переход по `/play/:inviteCode` отрисовывает осмысленный экран (данные или понятный empty/error).
- [x] Созданная сессия/тренировка отображается в релевантных списках.
- [x] После переключения в coach-mode интерфейс и маршруты соответствуют роли.

## Validation
- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Пройти `play/new` -> share -> back.
  - Открыть deep-link `/play/<inviteCode>` в новой сессии.
  - Создать сущность и проверить отображение в списках.
  - Переключить «Стать тренером» и проверить доступные экраны.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-009, WT-011, WT-012, WT-015)
