#!/usr/bin/env bash
# Commit dashboard changes and push to main → GitHub Actions publishes Pages.
set -euo pipefail
cd "$(dirname "$0")"

MSG="${1:-Update VOR 2026 dashboard}"

# Keep index.html in sync for local preview / fallback
if [ -f "VOR2026_team_map_v14_3.html" ]; then
  cp "VOR2026_team_map_v14_3.html" index.html
fi

git add -A
if git diff --cached --quiet; then
  echo "Нет изменений для коммита."
  exit 0
fi

git commit -m "$MSG"
git push origin main
echo ""
echo "Запушено. Деплой: https://github.com/rom5075/vor2026-dashboard/actions"
echo "Сайт (через 1–2 мин): https://rom5075.github.io/vor2026-dashboard/"
