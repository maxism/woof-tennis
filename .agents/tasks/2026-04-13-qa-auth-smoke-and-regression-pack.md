# [QA TASK] Smoke + regression pack для Telegram auth

## Meta
- Role: QA
- Priority: P1
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-13
- Related: AGENTS.md, .agents/COMMON.md, .agents/QA.md, docs/04-user-flows.md

## Context
После стабилизации auth-ветки нужен воспроизводимый набор проверок, который быстро выявляет критичные регрессии и дает релизный статус.

## Scope
- Подготовить smoke/regression набор для Telegram auth (Mini App + Widget, где применимо).
- Покрыть позитивные и негативные сценарии:
  - валидный вход;
  - невалидная подпись;
  - отсутствующий bot token (на тестовом окружении);
  - backend 500 и поведение FE.
- Проверить консистентность пользовательских ошибок и retry-поведения.
- **Конфигурация env (по решению Architect):**
  - Позитив: **`apps/api/.env` отсутствует**, все нужные переменные только в **корневом** `.env` репозитория → auth Mini App + widget **PASS**.
  - Негатив: в целевом env **пустой/отсутствует** `TELEGRAM_BOT_TOKEN` → ожидается **fail-fast при старте API** (процесс не слушает порт / не healthy), **не** ответ `401` на HTTP-запросе как основной симптом.
- **Три среды:** один и тот же чеклист применить к **local**, **docker compose**, **CI job** (где применимо). Если в CI нет подходящего job — явно отметить `N/A` в отчете с обоснованием и завести follow-up для PM.

## Out of Scope
- Исправление дефектов.
- Нагрузочное тестирование.

## Inputs
- AGENTS.md
- .agents/COMMON.md
- .agents/QA.md
- docs/04-user-flows.md
- docs/03-api-spec.md
- .agents/tasks/2026-04-13-fe-telegram-auth-error-ux.md
- .agents/tasks/2026-04-13-be-auth-widget-integration-tests.md

## Deliverables
- Тест-матрица сценариев auth.
- Отчет в формате PASS / PASS WITH RISKS / FAIL.
- Дефекты с приоритетом, шагами воспроизведения и фактическим результатом.

## Acceptance Criteria
- [ ] Есть воспроизводимый checklist для smoke/regression auth.
- [ ] Все критичные негативные сценарии проверены и задокументированы.
- [ ] По результатам дана четкая рекомендация к merge/release.
- [ ] Проверены сценарии **только root `.env`** и **fail-fast по `TELEGRAM_BOT_TOKEN`** согласованы с фактическим поведением BE.
- [ ] Таблица прохождения чеклиста есть минимум для local и docker compose; для CI — выполнено или зафиксировано исключение.

## Validation
- Commands:
  - `npm run build --workspace=@wooftennis/web`
  - `npm run test --workspace=@wooftennis/api`
- Manual checks:
  - Пройти auth flow end-to-end и ключевые негативные сценарии.
  - Проверить соответствие фактических ошибок API/FE ожидаемому поведению.

## Handoff Format
- Что сделано
- Что не сделано/блокеры
- Как проверить
- Риски/долг

## Updates
- 2026-04-14: Расширен scope под env strategy (root `.env` only, негатив fail-fast token, три среды local/docker/CI).
