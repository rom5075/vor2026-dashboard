# HANDOFF — VOR 2026 Dashboard

> Current multi-AI status. Standing rules: `AGENTS.md`.

**Updated:** 2026-07-18  
**By:** Claude  
**Session goal:** Адаптивная вёрстка под iPhone

---

## Goal now

Maintain the public VOR 2026 team map dashboard on GitHub Pages.

## Done since last handoff

- Root `HANDOFF.md` created for multi-AI continuity
- Live product path: edit HTML → `./publish.sh "…"` → origin/main
- Мобильная вёрстка (iPhone): media-блок ≤640px; sticky-колонка имён в гантте (`--gnamew`);
  автоскролл ганттов к линии «сегодня»; тач-тултипы (тап = закрепить, мимо/скролл = закрыть,
  кламп к вьюпорту); таблица «кто на чём» в `.tscroll`; табы горизонтальным скролл-рядом;
  KPI 2 колонки; theme-color меняется с темой

## In progress

- (fill at next UI/content change)

## Blockers

- None recorded

## Next 3 actions

1. Read `AGENTS.md` before any UI edit
2. Edit source HTML (see `VOR2026_team_map_v14_3.html` / publish flow)
3. Run `./publish.sh "short description"` and report SHA + Actions + site URL

## Key paths

| Path | Why |
|------|-----|
| `AGENTS.md` | Definition of done = push |
| `VOR2026_team_map_v14_3.html` | Primary dashboard source (publish syncs → `index.html`) |
| `index.html` | Published entry (synced by publish.sh) |
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
