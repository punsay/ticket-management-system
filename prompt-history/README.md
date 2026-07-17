# Prompt history

This folder stores an append-only log of Cursor Agent chat activity for this repository.

## What gets captured

Hooks in `.cursor/hooks.json` write to `history.md` when you:

- **Submit a prompt** — logged as `User` with the full prompt text
- **Receive an assistant reply** — logged as `Assistant` with the final response text

Each entry includes a local timestamp and, when available, a conversation ID.

## What is not captured

- Tab inline completions
- Tool calls, terminal output, MCP calls, or file edits
- Agent thinking blocks (`afterAgentThought`)
- Attachment metadata (only the prompt/response text is saved)
- Sessions outside this workspace

## Limitations

- Logging is best-effort. If a write fails, Cursor continues normally (fail open).
- `history.md` is never overwritten; new entries are appended only.
- The initial prompt-history setup conversation was not captured automatically because the hooks did not exist yet. It was manually appended to `history.md` for completeness.
- Very long chats produce a single growing file.
- Timestamps use the machine's local timezone when the hook runs.

## Setup

Hooks are configured in `.cursor/hooks.json`. If that file is missing, run from the repo root:

```bash
./setup-prompt-history-hooks.sh
```

Restart Cursor (or reload the window) after installing hooks so they are picked up. Check **Settings → Hooks** or the **Hooks** output channel if logging does not appear.

## Files

| File | Purpose |
|------|---------|
| `history.md` | Append-only chat log (created on first logged message) |
| `log-prompt-history.sh` | Hook entrypoint (bash) |
| `log-prompt-history.py` | Appends entries to `history.md` |
| `README.md` | This file |
