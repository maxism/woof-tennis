# WoofTennis — Chat Orchestration Workflow

## Purpose
Упростить управление задачами: без тяжелого task-tracking в файлах, с оркестрацией через чат.

## Core Principle
Каждое новое сообщение пользователя в чате рассматривается как активная задача.

## Execution Cycle
1. **PM intake**  
   PM принимает задачу в чате, формулирует scope и критерии результата.

2. **Pre-implementation review (`Designer + Architect`)**  
   - Designer проверяет UX/IA/копирайт/состояния.
   - Architect проверяет контракт, модель данных, риски интеграции.
   - PM возвращает пользователю краткий апдейт и согласует следующий шаг.

3. **Implementation (`FE + BE`)**  
   FE/BE вносят изменения в код по согласованному baseline.

4. **Validation (`QA`)**  
   QA выполняет проверку и выдает вердикт: `PASS` / `PASS WITH RISKS` / `FAIL`.

5. **Loop or Close**  
   - Если `FAIL`: PM запускает следующий цикл с уточненным scope.
   - Если `PASS`/приемлемый `PASS WITH RISKS`: PM формирует финальный отчет.

## Communication Format
- PM пользователю: коротко, по делу, в основном:
  - готовые промпты для агентов,
  - краткий статус прогресса,
  - финальный отчет по результату.

## Persistence Policy
- Храним только:
  - описание ролей в `.agents/*.md`,
  - системную логику в `docs/*.md`,
  - код и docs изменений проекта.
- Не ведем обязательный backlog/queue/task-tracker в отдельных служебных markdown-файлах.
