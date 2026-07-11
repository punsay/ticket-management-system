
## 2026-07-11 18:33:38 +0530 — Assistant

**Conversation:** `8f641c14-7cf8-4ea5-aac5-8088f9f135ed`

Automatic prompt history is set up for this repo. Here is what was added:

## What was created

| File | Purpose |
|------|---------|
| `.cursor/hooks.json` | Registers hooks on prompt submit and assistant reply |
| `prompt-history/log-prompt-history.sh` | Bash entrypoint (fail open) |
| `prompt-history/log-prompt-history.py` | Appends labeled entries to `history.md` |
| `prompt-history/README.md` | Documents what is captured and limitations |
| `setup-prompt-history-hooks.sh` | One-time installer for `.cursor/hooks.json` |

## How it works

1. **`beforeSubmitPrompt`** — when you send a message, the full prompt is appended as **User** with a timestamp.
2. **`afterAgentResponse`** — when the agent finishes a reply, the response text is appended as **Assistant**.

All entries go into a single append-only file: `prompt-history/history.md`.

Example entry format:

```markdown
## 2026-07-11 18:33:21 +0530 — User

**Conversation:** `abc-123`

Your prompt text here...

---
```

## Behavior

- Append only — never overwrites `history.md`
- Bash + python3 only — no extra dependencies
- Fail open — logging errors are swallowed; Cursor is never blocked
- Full prompt and reply text are included in the log

## Activate it

`.cursor/hooks.json` is already installed. **Restart Cursor** (or reload the window) so hooks are picked up.

If hooks are missing on another machine, run:

```bash
./setup-prompt-history-hooks.sh
```

Then restart Cursor. You can verify in **Settings → Hooks** or the **Hooks** output channel.

`history.md` is created on your first logged message — send a prompt in Agent chat to start the trail.

---
