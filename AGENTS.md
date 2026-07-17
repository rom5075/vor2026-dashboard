# AGENTS — VOR 2026 Dashboard

## Definition of done

**Done = pushed to `origin/main`**, not “files saved on disk”.

The live site is GitHub Pages: https://rom5075.github.io/vor2026-dashboard/

Local HTML edits do **not** update the public page until:

```bash
./publish.sh "short description of changes"
```

That script: syncs `index.html` ← `VOR2026_team_map_v14_3.html`, commits, pushes. Actions deploys in ~1–2 min.

## After every UI change

1. Edit dashboard HTML.
2. Run `./publish.sh "…"` in the same turn (unless user said local-only).
3. Report: commit SHA, Actions URL, site URL.

Do not stop at “готово, открой файл локально” when the user is looking at the published site.

## Contrast with TS/PIMS

Corporate TurkStream checkouts under `Desktop/Ts` / vor5 worktrees: **no push**.  
This personal dashboard repo: **push is the product.**
