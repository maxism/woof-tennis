# WoofTennis

Telegram Mini App для букинга теннисных тренировок (игроки + тренеры) в формате монорепозитория.

## Навигация по документации

### Архитектура
- [01 — Обзор проекта](docs/01-overview.md)
- [02 — Модель данных](docs/02-data-model.md)
- [03 — REST API спецификация](docs/03-api-spec.md)
- [04 — Пользовательские сценарии](docs/04-user-flows.md)
- [05 — Фронтенд архитектура](docs/05-frontend-structure.md)
- [06 — Бэкенд архитектура](docs/06-backend-structure.md)
- [07 — Интеграция с Telegram](docs/07-telegram-integration.md)
- [08 — Деплой и инфраструктура](docs/08-deployment.md)
- [09 — Roadmap](docs/09-roadmap.md)
- [10 — Структура монорепозитория](docs/10-monorepo-structure.md)
- [13 — Этапы сборки проекта](docs/13-build-stages.md)

### Дизайн и задачи
- [11 — Дизайн-артефакты](docs/11-design-artifacts.md)
- [12 — Набор задач для Frontend](docs/12-frontend-tasks.md)
- [13 — Этапы сборки проекта](docs/13-build-stages.md)

## Ключевые принципы
- Монорепозиторий: `apps/web`, `apps/api`, `packages/shared`
- Mobile-first внутри Telegram
- Русский язык — основной для пользовательского интерфейса
- Без оплаты на текущем этапе (только букинг)

## Следующий шаг

После согласования документации можно переходить к реализации кода по задачам из `docs/12-frontend-tasks.md` и аналогичному бэкенд-плану.

## Сборка в двух командах

```bash
npm install
npm run build
```

Полный пайплайн сборки и деплоя: `docs/13-build-stages.md`.
