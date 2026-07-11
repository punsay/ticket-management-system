#!/usr/bin/env python3
"""Append Cursor chat prompts and replies to prompt-history/history.md."""

import json
import sys
from datetime import datetime
from pathlib import Path


def project_root(data):
    roots = data.get("workspace_roots") or []
    if roots:
        return Path(roots[0])
    return Path(__file__).resolve().parent.parent


def write_entry(history_file, timestamp, role, text, conversation_id):
    entry = f"\n## {timestamp} — {role}\n\n"
    if conversation_id:
        entry += f"**Conversation:** `{conversation_id}`\n\n"
    entry += f"{text}\n\n---\n"
    with history_file.open("a", encoding="utf-8") as handle:
        handle.write(entry)


def main():
    event = ""
    try:
        data = json.load(sys.stdin)
        event = data.get("hook_event_name", "")

        if event == "beforeSubmitPrompt":
            role = "User"
            text = data.get("prompt", "")
        elif event == "afterAgentResponse":
            role = "Assistant"
            text = data.get("text", "")
        else:
            text = ""

        if text:
            root = project_root(data)
            history_dir = root / "prompt-history"
            history_dir.mkdir(parents=True, exist_ok=True)
            history_file = history_dir / "history.md"
            timestamp = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
            conversation_id = data.get("conversation_id", "")
            write_entry(history_file, timestamp, role, text, conversation_id)
    except Exception:
        pass

    if event == "beforeSubmitPrompt":
        print(json.dumps({"continue": True}))
    else:
        print("{}")


if __name__ == "__main__":
    main()
