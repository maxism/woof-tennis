# Role Task Markdown Standard

Все задачи, которые PM выдает другим ролям, оформляются отдельным Markdown-файлом в папке `.agents/tasks/`.

## Именование файлов
- Формат: `YYYY-MM-DD-<role>-<short-slug>.md`
- Примеры:
  - `2026-04-13-fe-dashboard-empty-states.md`
  - `2026-04-13-be-booking-cancel-rule.md`
  - `2026-04-13-qa-smoke-mvp-auth.md`

## Обязательная шапка
```md
# [ROLE TASK] <Короткий заголовок>

## Meta
- Role: <FE|BE|Architect|Designer|QA>
- Priority: <P0|P1|P2>
- Owner: <agent role>
- Requested by: PM Coordinator
- Date: <YYYY-MM-DD>
- Related: <issue/pr/doc links or N/A>
```

## Обязательная структура задачи
```md
## Context
<краткий контекст и зачем это нужно продукту>

## Scope
- ...
- ...

## Out of Scope
- ...

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/<ROLE-FILE>.md
- <релевантные docs/файлы>

## Deliverables
- ...
- ...

## Acceptance Criteria
- [ ] ...
- [ ] ...

## Validation
- Commands:
  - `...`
  - `...`
- Manual checks:
  - ...

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг
```

## Правила публикации
- PM публикует задачу сначала в `.agents/tasks/*.md`, потом отправляет ее роли.
- В тексте задачи всегда есть ссылка на `AGENTS.md` и профиль роли.
- Если задача изменилась, обновляется тот же файл + добавляется секция `## Updates`.
