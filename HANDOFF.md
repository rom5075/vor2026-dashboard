# HANDOFF — VOR 2026 Dashboard

> Current multi-AI status. Standing rules: `AGENTS.md`.

**Updated:** 2026-08-10
**By:** Codex
**Session goal:** отдельная страница Prod-дедлайнов по оперативному, v14 и клиентскому планам

---

## Goal now

Maintain the public VOR 2026 team map dashboard on GitHub Pages.

## Done since last handoff

- Отдельная `deadlines.html`: пять доработок в порядке ближайшего оперативного Prod (Д4→Д5→Д2→Д1→Д3), три версии плана и пометки запаса/просрочки из `VOR2026_DEADLINES_MATRIX.md`
- На странице сохранены предупреждения: Д1 превышает клиентский срок на 14 дней; даты Д2/Д3 устарели до пересчёта после ухода Java-разработчика
- Основной дашборд содержит ссылку «Дедлайны»; страница дедлайнов — обратную ссылку
- GitHub Pages собирается через `scripts/build_site.sh`; deploy включает обе HTML-страницы
- PWA cache `v2` хранит навигации по собственным URL, поэтому `deadlines.html` больше не может подменить офлайн-копию главной
- Добавлены Python/Node-контракты данных, сборки, темы и service worker
- PWA: `manifest.webmanifest`, `sw.js` (страница network-first + офлайн из кэша, статика
  stale-while-revalidate), иконки `icon-192/512/maskable` из favicon.svg; регистрация SW
  только на http(s). Файлы добавлены в deploy-pages.yml
- Переключатель горизонта гантта «Квартал / Полгода / Весь план» (ряд «Горизонт»,
  localStorage `vor_zoom`, default полгода): D0/D1/MONTHS динамические, окно клампится
  к границам плана, бары вне окна не рисуются, заголовок карты и тултипы кнопок — по окну.
  Панели пересобираются через renderAll()
- Строка «данные от» в шапке = `DATA.meta.updated` (обновлять при каждой правке данных)
- Ранее: root `HANDOFF.md` для multi-AI; путь публикации edit HTML → `./publish.sh` → origin/main;
  мобильная вёрстка (iPhone): media ≤640px, sticky имена в гантте, автоскролл к «сегодня»,
  тач-тултипы, `.tscroll`, табы скролл-рядом, KPI 2 колонки, theme-color по теме

## In progress

- Перенос задач Тимофеева (SQL Developer 2) на Егорову (2026-07-21):
  порядок у Анны B4→B5→B2 (срочные, блокируют других), затем остаток B1→B3, 8ч/день без буфера;
  каскад дат по зависимостям для остальных; дедлайны пересчитались:
  Д1 21.10→12.11, Д4 14.08→18.08, Д5 25.08→27.08, Д2 16.10 без изменений, Д3 01.12→24.12.
  **Финиш плана уехал 01.12→24.12** — критический путь: хвост B3 (1.3.2.1 аналитика 150ч ждёт
  finish B1-деплоя 1.1.1.11 → 1.3.2.2 → UAT 1.3.4.x). Рычаг: ранний старт 1.3.2.1.
  MS Project XML НЕ обновлён — дашборд теперь опережает план v14.

## Blockers

- None recorded

## Next 3 actions

1. При изменении дедлайнов сначала обновить и перепроверить `VOR2026_DEADLINES_MATRIX.md`
2. Запустить `python3 -m unittest discover -s tests -v` и Node-тесты service worker
3. Выполнить `./publish.sh "short description"` и проверить обе публичные страницы

## Key paths

| Path | Why |
|------|-----|
| `AGENTS.md` | Definition of done = push |
| `VOR2026_team_map_v14_3.html` | Primary dashboard source (publish syncs → `index.html`) |
| `index.html` | Published entry (synced by publish.sh) |
| `deadlines.html` | Three-plan Prod deadline page |
| `VOR2026_DEADLINES_MATRIX.md` | Deadline values, deltas and caveats |
| `scripts/build_site.sh` | GitHub Pages artifact assembly |
| `publish.sh` | commit + push pipeline |
| Site | https://rom5075.github.io/vor2026-dashboard/ |

## Decisions this session

- Local-only edits are **not** done for this repo

## Do not

- Stop at “open the local file” when the user looks at the published site
- Confuse with TS corporate no-push policy

## Latest detailed handoff

- n/a (use this file)

## Git / publish note

- Remote: `https://github.com/rom5075/vor2026-dashboard.git`
- **Done = pushed to `origin/main`** via `./publish.sh "…"`
