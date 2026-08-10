#!/usr/bin/env bash
# Assemble the static GitHub Pages artifact into the requested directory.
set -euo pipefail

cd "$(dirname "$0")/.."
DESTINATION="${1:-_site}"
mkdir -p "$DESTINATION"

if [ -f "VOR2026_team_map_v14_3.html" ]; then
  cp "VOR2026_team_map_v14_3.html" "$DESTINATION/index.html"
elif [ -f "index.html" ]; then
  cp "index.html" "$DESTINATION/index.html"
else
  echo "No dashboard HTML found" >&2
  exit 1
fi

if [ ! -f "deadlines.html" ]; then
  echo "No deadlines HTML found" >&2
  exit 1
fi
cp "deadlines.html" "$DESTINATION/deadlines.html"

for asset in favicon.ico favicon.svg favicon-16.png favicon-32.png apple-touch-icon.png robots.txt \
             manifest.webmanifest sw.js icon-192.png icon-512.png icon-maskable-512.png; do
  [ -f "$asset" ] && cp "$asset" "$DESTINATION/"
done
