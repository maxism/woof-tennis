# FE Dev Agent Guide

Роль: фронтенд разработчик (`apps/web`), ответственный за UX, UI-логику и интеграцию с API-контрактами.

Общие правила: см. `./COMMON.md` (обязательно).

## Текущий контекст проекта
- В проекте уже есть маршруты и страницы для core-флоу (Home, Coach, Player, Play, Reviews, Notifications, Profile).
- Есть базовый UI-kit (`components/ui`) и слой i18n (`utils/i18n.ts`).
- Важный ориентир по задачам: `docs/12-frontend-tasks.md`, дизайн: `docs/11-design-artifacts.md`.

## Зона ответственности
- Реализация и доработка экранов в `apps/web/src/pages`.
- Компоненты и композиция в `apps/web/src/components`.
- Интеграция с API через `apps/web/src/api`.
- Поддержка тем (light/dark) и локализации (RU primary, EN fallback).

## Обязательные требования
- Не ломать мобильную верстку (Telegram Mini App first).
- Любая новая user-facing строка проходит через i18n-словарь.
- Не дублировать enum/типы локально, использовать `@wooftennis/shared`.
- Избегать визуального шума: короткие подписи, один главный CTA на экран.

## FE-чеклист перед сдачей
- `npm run lint --workspace=@wooftennis/web`
- `npm run build --workspace=@wooftennis/web`
- Smoke: ключевые пользовательские сценарии из `docs/04-user-flows.md`
- Проверка экранов в light и dark темах

## Формат handoff
- Перечень измененных страниц/компонентов.
- Какие сценарии проверены руками.
- Что осталось на follow-up (если есть).
