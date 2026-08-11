#!/usr/bin/env bash
# Downloads a Google Drive file by ID, handling the large-file virus-scan
# confirm-token interstitial that plain curl/wget hit above ~25MB.
set -euo pipefail
FILE_ID="$1"
OUT="$2"
COOKIES=$(mktemp)

curl -sL -c "$COOKIES" "https://drive.google.com/uc?export=download&id=${FILE_ID}" -o /tmp/gdrive_page.html

CONFIRM=$(grep -oE 'confirm=[A-Za-z0-9_-]+' /tmp/gdrive_page.html | head -1 | cut -d= -f2 || true)

if [ -n "${CONFIRM:-}" ]; then
  curl -sL -b "$COOKIES" "https://drive.google.com/uc?export=download&confirm=${CONFIRM}&id=${FILE_ID}" -o "$OUT"
else
  # Small file: the first response might already be the PDF, or use the docs.google.com uc endpoint fallback
  if file /tmp/gdrive_page.html | grep -qi 'PDF'; then
    cp /tmp/gdrive_page.html "$OUT"
  else
    curl -sL -b "$COOKIES" "https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download&confirm=t" -o "$OUT"
  fi
fi
rm -f "$COOKIES"

SIZE=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
TYPE=$(file -b --mime-type "$OUT" 2>/dev/null || echo unknown)
echo "$OUT : ${SIZE} bytes, ${TYPE}"
