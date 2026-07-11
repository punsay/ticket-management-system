#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$ROOT/.cursor"
cat > "$ROOT/.cursor/hooks.json" << 'EOF'
{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": "prompt-history/log-prompt-history.sh"
      }
    ],
    "afterAgentResponse": [
      {
        "command": "prompt-history/log-prompt-history.sh"
      }
    ]
  }
}
EOF

chmod +x "$ROOT/prompt-history/log-prompt-history.sh" "$ROOT/prompt-history/log-prompt-history.py"
echo "Installed .cursor/hooks.json and made logging scripts executable."
