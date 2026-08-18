#!/usr/bin/env bash
# ==============================================================================
# SheraTutor Remote GPU Ingestion Helper (Kaggle CLI)
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KAGGLE_DIR="$SCRIPT_DIR/kaggle"
KERNEL_SLUG="syed181/sheratutor-physics-ingest"

echo "=== [1/3] Pushing Kaggle GPU Ingestion Kernel ==="
kaggle kernels push -p "$KAGGLE_DIR"

echo "=== [2/3] Streaming Remote Ingestion Status ==="
while true; do
    STATUS=$(kaggle kernels status "$KERNEL_SLUG" || echo "unknown")
    echo "[$(date +'%T')] $STATUS"
    if [[ "$STATUS" == *"complete"* ]] || [[ "$STATUS" == *"error"* ]] || [[ "$STATUS" == *"cancel"* ]]; then
        break
    fi
    sleep 20
done

echo "=== [3/3] Fetching Output Logs ==="
mkdir -p "$SCRIPT_DIR/output"
kaggle kernels output "$KERNEL_SLUG" -p "$SCRIPT_DIR/output"
echo "Done! Outputs written to ingestion/output"
