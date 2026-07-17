# VOR 2026 — карта работ команды

Интерактивный дашборд (план v14): кто на каких доработках, календарная карта июль–декабрь 2026, линия «сегодня».

**Сайт:** https://rom5075.github.io/vor2026-dashboard/

## Как обновить и опубликовать

1. Правите **исходник**: `VOR2026_team_map_v14_3.html`
2. Закоммитьте и запушьте в `main`:

```bash
git add VOR2026_team_map_v14_3.html
git commit -m "Update dashboard"
git push
```

Или одной командой:

```bash
./publish.sh "краткое описание изменений"
```

3. GitHub Actions сам соберёт сайт и зальёт на Pages (1–2 минуты).  
   Статус: вкладка **Actions** в репозитории.

## Что деплоится

| Файл | Роль |
|------|------|
| `VOR2026_team_map_v14_3.html` | **Источник правды** — правьте его |
| `index.html` | Локальная копия для превью (обновляется скриптом `publish.sh`) |
| `.github/workflows/deploy-pages.yml` | Пайплайн: push → Pages |

Пайплайн кладёт исходник в `_site/index.html` и публикует через GitHub Pages (Actions).

## Локальный просмотр

Откройте `VOR2026_team_map_v14_3.html` или `index.html` в браузере (двойной клик или Live Server).
