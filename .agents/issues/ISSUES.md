# WoofTennis Issues Registry

Active issues only (`OPEN`, `IN_PROGRESS`, `BLOCKED`).
Historical closed issues archived in `.agents/archive/issues/ISSUES-2026-04-14.md`.

| ID | Title | Priority | Status | Owner | Created | Updated | Source Task | Notes |
|----|-------|----------|--------|-------|---------|---------|------------|-------|
| WT-001 | Telegram auth: отсутствует централизованный FE error-handler и телеметрия | P1 | IN_PROGRESS | QA | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-fe-auth-error-handler-and-telemetry.md` | Готово к QA (handoff FE): централизованный пайплайн ошибок + телеметрия подключены к store/bootstrap/UI. |
| WT-002 | Telegram auth: UX-сценарии ошибок `401/500` не стандартизованы | P0 | IN_PROGRESS | QA | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-fe-telegram-auth-error-ux.md` | Готово к QA (handoff FE): RU/EN тексты, retry, theme-aware states. |
| WT-004 | API стартует без обязательных env (нет fail-fast) | P0 | IN_PROGRESS | BE | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-be-env-fail-fast-validation.md` | До закрытия требуется QA-приемка связки с WT-007 (root env only, fail-fast, migrations/CLI consistency). |
| WT-005 | Нет жесткого readiness gate по миграциям/схеме БД | P0 | IN_PROGRESS | QA | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-be-db-readiness-and-migrations-gate.md` | Готов к QA: expected `503` без миграций, `200` после `migration:run`. |
| WT-006 | Недостаточная наблюдаемость auth pipeline | P1 | IN_PROGRESS | QA | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-be-auth-observability-and-error-classification.md` | Готов к QA: проверка requestId и классификации 401/500 по docs/16. |
| WT-007 | Нет согласованной стратегии env-loading в монорепо | P0 | IN_PROGRESS | BE | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-architect-env-loading-strategy.md` | Решение Architect принято; закрытие после QA по local + docker compose + CI (или CI-exception). |
| WT-008 | Нужен воспроизводимый QA smoke/regression pack для auth | P1 | IN_PROGRESS | QA | 2026-04-13 | 2026-04-14 | `.agents/tasks/2026-04-13-qa-auth-smoke-and-regression-pack.md` | QA gate в работе; финальный статус после полного чеклиста по средам. |
| WT-014 | Тренер не видит сетку слотов/управление слотами | P0 | IN_PROGRESS | QA | 2026-04-14 | 2026-04-14 | `.agents/tasks/2026-04-14-fe-coach-locations-form-and-slots-surface.md` | Нужен ручной smoke на непустой неделе/реальных слотах перед закрытием. |
| WT-021 | CI lacks blocking e2e gate for critical endpoints | P0 | OPEN | DevOps | 2026-04-14 | 2026-04-14 | `.agents/tasks/2026-04-14-devops-ci-e2e-gate-critical-endpoints.md` | Добавить e2e job (DB+migrations+seed) и block merge при падении. |
