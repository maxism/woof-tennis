# WoofTennis Multi-Agent Entry Point

Этот файл — точка входа для всех агентных сессий в проекте.

## Обязательный порядок чтения
1. Прочитать `.agents/README.md`
2. Прочитать `.agents/COMMON.md`
3. Прочитать ролевой файл:
   - PM Coordinator: `.agents/PM-COORDINATOR.md`
   - FE: `.agents/FE-DEV.md`
   - BE: `.agents/BE-DEV.md`
   - Architect: `.agents/ARCHITECT.md`
   - Designer: `.agents/DESIGNER.md`
   - QA: `.agents/QA.md`
   - DevOps (если выделена роль): `.agents/DEVOPS-DEV.md`

## Обязательные правила для всех агентов
- Работать только в рамках своей роли и скоупа задачи.
- Следовать Definition of Done и handoff-формату из `.agents/COMMON.md`.
- Не менять несвязанные участки кода.
- При изменении контрактов синхронизировать `packages/shared` и явно отмечать влияние на FE/BE/QA.

## Режим оркестрации в чате
- Пользователь ставит задачу напрямую в чат PM-агенту.
- PM анализирует и запускает **сначала `Architect`, затем `Designer`** (см. перекрёстную проверку в `docs/19-chat-orchestration-workflow.md`).
- После подтверждения пользователем запускаются `FE + BE`.
- Затем запускается `QA`.
- Если QA дает `FAIL`, цикл повторяется с уточненным scope.
- Если `PASS`, PM выдает краткий итоговый отчет.
- Подробная логика процесса: `docs/19-chat-orchestration-workflow.md`.

## Шаблон задачи от менеджера
Используй такой префикс при постановке задач любому агенту:

```text
Прочитай AGENTS.md, затем .agents/README.md, .agents/COMMON.md и профильный файл роли.
После этого выполни задачу: <описание>.
В ответе дай: что сделано, как проверить, риски/блокеры.
```
