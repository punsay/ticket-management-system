#!/usr/bin/env bash
# Fail open: logging must never block Cursor.
exec python3 "$(dirname "$0")/log-prompt-history.py"
