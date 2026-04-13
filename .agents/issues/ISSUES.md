# WoofTennis Issues Registry

| ID | Title | Priority | Status | Owner | Created | Updated | Source Task | Notes |
|----|-------|----------|--------|-------|---------|---------|------------|-------|
| WT-001 | Telegram auth: отсутствует централизованный FE error-handler и телеметрия | P1 | OPEN | FE | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-fe-auth-error-handler-and-telemetry.md` | Нужна унификация обработки `401/429/500/network`. |
| WT-002 | Telegram auth: UX-сценарии ошибок `401/500` не стандартизованы | P0 | OPEN | FE | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-fe-telegram-auth-error-ux.md` | Должны быть понятные RU сообщения и retry. |
| WT-003 | `/auth/telegram/widget`: недостаточное интеграционное покрытие тестами | P1 | OPEN | BE | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-be-auth-widget-integration-tests.md` | Нужна защита от регрессий endpoint. |
| WT-004 | API стартует без обязательных env (нет fail-fast) | P0 | OPEN | BE | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-be-env-fail-fast-validation.md` | Критично для надежности auth/DB. |
| WT-005 | Нет жесткого readiness gate по миграциям/схеме БД | P0 | OPEN | BE | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-be-db-readiness-and-migrations-gate.md` | Инцидентный риск 500 до готовности БД. |
| WT-006 | Недостаточная наблюдаемость auth pipeline | P1 | OPEN | BE | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-be-auth-observability-and-error-classification.md` | Нужен requestId и нормализация причин отказа. |
| WT-007 | Нет согласованной стратегии env-loading в монорепо | P0 | OPEN | Architect | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-architect-env-loading-strategy.md` | Нужен единый source of truth local/docker/CI. |
| WT-008 | Нужен воспроизводимый QA smoke/regression pack для auth | P1 | OPEN | QA | 2026-04-13 | 2026-04-13 | `.agents/tasks/2026-04-13-qa-auth-smoke-and-regression-pack.md` | Финальный релизный статус PASS/PASS WITH RISKS/FAIL. |
