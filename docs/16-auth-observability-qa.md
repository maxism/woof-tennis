# Auth pipeline — чтение логов (QA / поддержка)

## Correlation

- В ответах API на ошибках в JSON может быть поле `requestId` (дублируется в заголовке `X-Request-Id`).
- В логах Nest ищите строки **JSON** с полем `"event":"auth"` — по ним строится трассировка одного запроса.

## Поля structured-log (auth)

| Поле | Смысл |
|------|--------|
| `event` | всегда `auth` |
| `channel` | `widget` или `mini_app` |
| `requestId` | совпадает с HTTP `X-Request-Id`, если middleware отработал |
| `outcome` | `failure` (успех без отдельной строки JSON) |
| `code` | нормализованная причина: `env_missing`, `widget_signature_invalid`, `mini_app_invalid`, `db_upsert_failed` |
| `stage` | этап: `resolve_bot_token`, `validate_widget_hash`, `validate_init_data`, `upsert_user` |

## Что не попадает в логи

- Значение `TELEGRAM_BOT_TOKEN`, JWT-секреты.
- Сырой `hash` виджета и прочие секреты Telegram.

## Readiness БД

- `GET /health` — liveness.
- `GET /health/ready` — БД + отсутствие неприменённых миграций; при проблеме **503** и поле `reason` в теле (`pending_migrations`, `database_unavailable`, …).
