# [QA HANDOFF] WT-016 gate: player/coach/play regression batch

## Meta
- Role: QA
- Priority: P0
- Owner: QA agent
- Requested by: PM Coordinator
- Date: 2026-04-14
- Related: `.agents/tasks/2026-04-14-qa-player-coach-play-regression-pack.md`, `.agents/issues/ISSUES.md`

## Final Verdict
- **FAIL**

## What Was Verified
- `npm run build --workspace=@wooftennis/web` — PASS
- `npm run test --workspace=@wooftennis/api` — PASS (5 suites / 15 tests)
- Кодовый regression-review по обязательным сценариям Player / Coach / Search.

## Matrix WT-009..WT-015

| ID | Verdict | Короткие шаги воспроизведения / проверки |
|----|---------|------------------------------------------|
| WT-009 | fixed | Открыть `/play/new` -> создать -> share-step -> back. Проверено: back path есть, TabBar не скрывается на `/play/new` и `/play/:inviteCode`. |
| WT-010 | partial | Expected: поиск по Telegram username (found/not found) в user flow. Fact: BE `/users/search?username=` реализован, но FE `SearchPage` остается `openById` без интеграции username-search. |
| WT-011 | fixed | Открыть deep-link `/play/:inviteCode` в новой сессии. Проверено: валидные состояния loading/error/empty/data, не пустой экран. |
| WT-012 | partial | Создать play session и проверить появление в релевантных списках. Есть invalidate query, но отсутствие явного списка play-сессий в основном UI оставляет риск «создано, но не видно» на реальных данных. |
| WT-013 | fixed | `coach/locations/new`: есть инпуты + action-кнопки + submit flow. |
| WT-014 | fixed (risk) | `coach/schedule`: surface слотов/кнопки управления присутствуют. Риск остается до ручного прогона на непустых реальных данных. |
| WT-015 | fixed | Переключение роли (`RoleSwitch`) + route gating (`PlayerRoute`/`CoachRoute`) соответствует ожиданию. |

## Risks
- **High:** WT-010 не закрыт end-to-end (backend готов, frontend user flow не подключен к username-search).
- **High:** WT-012 не подтвержден на реальных данных; возможна регрессия «сущность создана, но не отображается в ожидаемом списке».
- **Medium:** WT-014 требует ручного smoke на непустой неделе/реальных слотах.

## Proposed Status Updates for `.agents/issues/ISSUES.md`
- WT-009 -> **CLOSED**
- WT-010 -> **IN_PROGRESS**
- WT-011 -> **CLOSED**
- WT-012 -> **IN_PROGRESS**
- WT-013 -> **CLOSED**
- WT-014 -> **IN_PROGRESS** (до ручного smoke на реальных данных)
- WT-015 -> **CLOSED**
- WT-016 -> **IN_PROGRESS** (общий gate не пройден, текущий verdict = FAIL)

## Recommendation to PM
- Не закрывать батч WT-016 до доработки/подтверждения WT-010 и WT-012.
- После FE-интеграции username-search и ручного smoke на реальных данных повторить QA gate по WT-016.
