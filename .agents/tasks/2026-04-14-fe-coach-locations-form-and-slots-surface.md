# [FE TASK] P0: восстановить coach location form и surface слотов

## Meta
- Role: FE
- Priority: P0
- Owner: FE agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: AGENTS.md, .agents/COMMON.md, .agents/FE-DEV.md, .agents/ISSUES-TRACKER.md, .agents/issues/ISSUES.md

## Context
В coach flow критичные блокеры: страница `coach/locations/new` открывается без инпутов/кнопок, тренер не видит свою сетку слотов и не может управлять расписанием.

## Scope
- Обязательно перечитать:
  - `AGENTS.md`
  - `.agents/COMMON.md`
  - `.agents/FE-DEV.md`
  - `.agents/ISSUES-TRACKER.md`
- Исправить:
  - WT-013: `coach/locations/new` должен отображать рабочую форму (инпуты + submit/cancel).
  - WT-014: тренерский Schedule/Slots UI должен отображаться и быть доступным по ожидаемому маршруту.
- Проверить связь с role-gating (coach-only) на фронте.

## Out of Scope
- Изменение бизнес-правил BE по слотам.
- Рефакторинг дизайн-системы вне нужного скоупа.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/FE-DEV.md
- .agents/ISSUES-TRACKER.md
- .agents/issues/ISSUES.md
- apps/web/src/pages/Coach/LocationFormPage.tsx
- apps/web/src/pages/Coach/LocationsPage.tsx
- apps/web/src/pages/Coach/SchedulePage.tsx
- apps/web/src/components/schedule/WeekView.tsx
- apps/web/src/components/schedule/SlotCard.tsx
- apps/web/src/components/layout/RoleSwitch.tsx

## Deliverables
- FE-правки для WT-013/WT-014.
- Гарантированный coach-path для создания локации и просмотра сетки слотов.
- Handoff с рекомендацией по статусам issue.

## Acceptance Criteria
- [x] На `coach/locations/new` видна и работает форма (минимум базовые инпуты + кнопка действия).
- [x] Тренер видит свою сетку слотов/расписание в coach-разделе.
- [x] Нет пустых «немых» экранов без actionable UI в coach flow.

## Validation
- Commands:
  - `npm run lint --workspace=@wooftennis/web`
  - `npm run build --workspace=@wooftennis/web`
- Manual checks:
  - Открыть `coach/locations/new`, заполнить форму и отправить.
  - Открыть coach schedule и убедиться, что слоты/сетка отображаются.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
- Предложение по статусам issue-ID (WT-013, WT-014)
