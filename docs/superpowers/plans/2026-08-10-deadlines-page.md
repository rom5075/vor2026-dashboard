# VOR 2026 Deadlines Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a separate, mobile-friendly page showing the five VOR 2026 enhancements and their three Prod deadlines with the exact risk labels from `VOR2026_DEADLINES_MATRIX.md`.

**Architecture:** Add a static semantic `deadlines.html` so the dates remain visible without JavaScript. Protect its content with a standard-library Python DOM contract test, move the Pages assembly into a directly executable build script, and regression-test the service worker with Node's built-in test runner so each navigation is cached under its own URL.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, Python 3 `unittest`/`html.parser`, Node.js `node:test`, Bash, GitHub Actions.

## Global Constraints

- Show Prod finish dates only; do not add UAT or bug-fix windows.
- Preserve all 15 dates and all ten red/yellow/green labels from `VOR2026_DEADLINES_MATRIX.md` exactly.
- Sort rows by operational Prod date: D4, D5, D2, D1, D3.
- Preserve the warning that D1 exceeds the client date by 14 days.
- Preserve the caveat that D2 and D3 operational dates are stale until recalculation after the Java developer's departure.
- Do not modify dashboard tasks, dependencies, workload, or calculated deadlines.
- Keep light/dark theme behavior and the existing `vor_theme` localStorage key.
- Done means pushed to `origin/main` and verified on GitHub Pages.

---

### Task 1: Static deadline ledger with exact matrix data

**Files:**
- Create: `tests/test_deadlines_page.py`
- Create: `deadlines.html`

**Interfaces:**
- Consumes: literal dates and labels from `VOR2026_DEADLINES_MATRIX.md`.
- Produces: semantic rows identified by `tr[data-block]`; date cells identified by `td[data-plan]`; navigation links to `./` and `deadlines.html`.

- [ ] **Step 1: Write the failing page contract test**

Create `tests/test_deadlines_page.py` with a small `HTMLParser` that collects `tr[data-block]`, the text of each `td[data-plan]`, and anchor destinations. Assert this literal contract:

```python
EXPECTED = {
    "D4": ("18.08.2026", "14.08.2026", "24.09.2026", "+4 дн", "+37 дн"),
    "D5": ("27.08.2026", "25.08.2026", "29.09.2026", "+2 дн", "+33 дн"),
    "D2": ("16.10.2026", "16.10.2026", "29.12.2026", "0 дн", "+74 дн"),
    "D1": ("12.11.2026", "21.10.2026", "29.10.2026", "+22 дн", "−14 дн"),
    "D3": ("24.12.2026", "01.12.2026", "26.02.2027", "+23 дн", "+64 дн"),
}
```

Tests must assert the row order, all three dates per row, both delta fragments, the D1 customer-overrun text, the D2/D3 stale-date caveat, source date `10.08.2026`, and the `./` back link.

- [ ] **Step 2: Run the page contract to verify RED**

Run: `python3 -m unittest tests.test_deadlines_page -v`

Expected: FAIL because `deadlines.html` does not exist.

- [ ] **Step 3: Build the minimal static page**

Create `deadlines.html` as a standalone Russian HTML5 document. Use a real `<table>` on desktop and CSS `display:block` cards below 640 px. Each row must use `data-block="D4"` etc.; date cells must use `data-plan="operational"`, `data-plan="v14"`, and `data-plan="client"`.

Use these exact visual tokens:

```css
:root {
  --bg:#F5F6FA; --card:#FFFFFF; --text:#222222; --muted:#666666;
  --border:#DADDE5; --accent:#2F5496; --late:#C62828;
  --warn:#9A6700; --ok:#2E7D32;
  --b1:#4472C4; --b2:#548235; --b3:#BF8F00; --b4:#C55A11; --b5:#7F7F7F;
}
```

Body typography is `"Segoe UI", Arial, sans-serif`; large dates use `Bahnschrift, "Arial Narrow", Arial, sans-serif` with `font-variant-numeric: tabular-nums`. The signature element is a disciplined three-column row of large date stamps, with one block-colored rail per enhancement. Do not add charts, gradients, decorative animation, or external assets.

Keep the table, warnings, source note, theme toggle, and back link visible and keyboard accessible. Theme JavaScript catches localStorage failures and registers `./sw.js` only on HTTP(S).

- [ ] **Step 4: Run the page contract to verify GREEN**

Run: `python3 -m unittest tests.test_deadlines_page -v`

Expected: all page contract tests PASS.

- [ ] **Step 5: Commit the self-contained page task**

```bash
git add deadlines.html tests/test_deadlines_page.py
git commit -m "Add VOR deadline comparison page"
```

### Task 2: Dashboard navigation, deploy build, and safe PWA caching

**Files:**
- Modify: `tests/test_deadlines_page.py`
- Create: `tests/service_worker.test.mjs`
- Create: `scripts/build_site.sh`
- Modify: `VOR2026_team_map_v14_3.html` header
- Modify: `.github/workflows/deploy-pages.yml` build step
- Modify: `sw.js`

**Interfaces:**
- Consumes: `deadlines.html`, the existing dashboard source, existing static assets, and service-worker fetch events.
- Produces: `_site/index.html`, `_site/deadlines.html`, a dashboard link to `deadlines.html`, and URL-specific navigation cache entries.

- [ ] **Step 1: Add failing integration tests**

Extend the Python test to assert that `VOR2026_team_map_v14_3.html` contains an anchor whose visible text is `Дедлайны` and whose resolved target is `deadlines.html`.

Add a build-boundary test that runs:

```python
subprocess.run(
    ["bash", "scripts/build_site.sh", str(output_dir)],
    cwd=ROOT,
    check=True,
    capture_output=True,
    text=True,
)
```

and asserts that both `output_dir/index.html` and `output_dir/deadlines.html` exist and contain their correct `<title>` text.

Create `tests/service_worker.test.mjs` using `node:test`, `node:assert/strict`, and `node:vm`. Execute the real `sw.js` with fake `self`, `caches`, `fetch`, and `location`, dispatch a navigation request for `https://example.test/deadlines.html`, and assert:

1. online navigation is cached under the request URL, never under `./`;
2. offline navigation requests `caches.match(req)` and receives the deadline page response.

- [ ] **Step 2: Run integration tests to verify RED**

Run:

```bash
python3 -m unittest tests.test_deadlines_page -v
node --test tests/service_worker.test.mjs
```

Expected: FAIL because the dashboard link/build script are absent and the current service worker stores every navigation under `./`.

- [ ] **Step 3: Implement navigation and build boundary**

Add a normal anchor styled as `.tab` beside the theme button in the dashboard header. It must say `Дедлайны`, point to `deadlines.html`, and have an accessible label.

Create executable `scripts/build_site.sh` accepting the destination as `$1` with `_site` default. It must copy the canonical dashboard source to `index.html`, copy `deadlines.html`, then copy the existing favicon/PWA assets. Replace the inline copy block in `.github/workflows/deploy-pages.yml` with `./scripts/build_site.sh _site` and `ls -la _site`.

- [ ] **Step 4: Implement URL-specific service-worker caching**

Bump `VERSION` from `v1` to `v2`, add `deadlines.html` to `ASSETS`, and change navigation handling to:

```javascript
fetch(req).then(r => {
  if (r && r.ok) {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(req, copy));
  }
  return r;
}).catch(() => caches.match(req).then(hit => hit || caches.match('./')))
```

This preserves a main-page fallback for an uncached route without letting one page overwrite another's cache entry.

- [ ] **Step 5: Run integration tests to verify GREEN**

Run:

```bash
python3 -m unittest tests.test_deadlines_page -v
node --test tests/service_worker.test.mjs
node --check sw.js
```

Expected: all tests PASS and Node syntax check exits 0.

- [ ] **Step 6: Commit the integration task**

```bash
git add tests/test_deadlines_page.py tests/service_worker.test.mjs scripts/build_site.sh VOR2026_team_map_v14_3.html .github/workflows/deploy-pages.yml sw.js
git commit -m "Publish and cache deadlines page"
```

### Task 3: Documentation, visual QA, and production publication

**Files:**
- Modify: `README.md`
- Modify: `HANDOFF.md`
- Add: `VOR2026_DEADLINES_MATRIX.md`
- Generated by publish script: `index.html`

**Interfaces:**
- Consumes: completed page, build script, repository publication rules.
- Produces: documented source lineage, synchronized `index.html`, pushed `origin/main`, and verified public URLs.

- [ ] **Step 1: Update documentation and preserve the matrix**

Document `/deadlines.html`, the matrix as the source for its three Prod dates, and the fact that `scripts/build_site.sh` is the Pages assembly boundary. Update `HANDOFF.md` date/session goal/done list and remove the stale branch note.

- [ ] **Step 2: Run full automated verification**

Run:

```bash
python3 -m unittest discover -s tests -v
node --test tests/service_worker.test.mjs
node --check sw.js
bash scripts/build_site.sh /tmp/vor2026-site-check
git diff --check
```

Expected: all tests PASS, both HTML pages are present in the build output, and diff check reports no whitespace errors.

- [ ] **Step 3: Perform visual and interaction QA**

Serve the repository over HTTP and verify `deadlines.html` at desktop width 1440 px and mobile width 390 px. Check light/dark themes, date order, absence of horizontal page overflow, focus visibility, both navigation links, and the D1/D2/D3 warnings. Save screenshots under `/tmp` only; do not commit them.

- [ ] **Step 4: Publish through the repository's required path**

Run:

```bash
./publish.sh "Add three-plan deadline matrix page"
```

Expected: `index.html` is synchronized, the remaining documentation/matrix changes are committed, and `main` is pushed to `origin`.

- [ ] **Step 5: Verify production deployment**

Confirm the latest GitHub Actions Pages workflow succeeds, then fetch both public URLs:

- `https://rom5075.github.io/vor2026-dashboard/`
- `https://rom5075.github.io/vor2026-dashboard/deadlines.html`

Verify the main page exposes the deadline link and the deadline page contains all five rows and the D1 customer-overrun warning.
