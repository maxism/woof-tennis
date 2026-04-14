# Archive Structure

Архив хранит исторический контекст и не используется как активный task-tracker.

## Paths
- `tasks/<YYYY-MM>/` — завершенные task/handoff markdown.
- `issues/` — snapshot'ы реестра issues.
- `reports/` — отчеты груминга.

## Workflow
- PM делает snapshot issues.
- PM переносит закрытые задачи в `archive/tasks/<YYYY-MM>/`.
- PM пишет короткий отчет в `archive/reports/`.
