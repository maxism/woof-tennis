# Backlog Grooming and Archive Policy

Цель: держать активный контур компактным, а исторический контекст — доступным, но вынесенным в архив.

## 1) Активный контур (что должно быть "на виду")
- `/.agents/issues/ISSUES.md` содержит только `OPEN`, `IN_PROGRESS`, `BLOCKED`.
- `/.agents/tasks/` содержит только:
  - активные задачи;
  - handoff текущего релизного цикла.

## 2) Что архивируем
- Любые `CLOSED` issues старше 7 дней (или сразу после релизного среза).
- Task-файлы, по которым issue уже закрыт и нет открытых follow-up.
- Handoff-файлы, если решения уже отражены в code/docs/issues.

## 3) Куда архивируем
- Задачи: `/.agents/archive/tasks/<YYYY-MM>/`
- Снапшоты реестра: `/.agents/archive/issues/ISSUES-<YYYY-MM-DD>.md`
- Короткие отчеты груминга: `/.agents/archive/reports/<YYYY-MM-DD>-grooming-report.md`

## 4) Периодичность груминга
- Минимум 1 раз в неделю.
- Обязательно после каждого крупного P0/P1 batch.

## 5) Алгоритм груминга (PM Coordinator)
1. Сделать snapshot `ISSUES.md` в `archive/issues`.
2. Перенести закрытые/устаревшие task-файлы в `archive/tasks/<YYYY-MM>/`.
3. Обновить `ISSUES.md`: оставить только активные статусы.
4. Добавить grooming report:
   - сколько задач архивировано;
   - какие issue закрыты и убраны из активного списка;
   - какие риски остались в активном контуре.

## 6) Формат grooming report
```md
# Grooming Report <YYYY-MM-DD>

- Snapshot: `.agents/archive/issues/ISSUES-<date>.md`
- Archived tasks: <N>
- Active issues after grooming: <N>
- Open risks:
  - ...
```

## 7) Важные правила
- Ничего не удаляем безвозвратно: только перенос в архив.
- Если закрытый issue важен для аудита, оставляем в `ISSUES.md` одной строкой с ссылкой на архивный snapshot.
- При споре о "можно ли архивировать" — не архивируем до решения PM.
