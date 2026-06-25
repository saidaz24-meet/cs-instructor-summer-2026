import json
import os

HISTORY_FILE = 'history.json'


def save_history(history, session_name=None):
    """Save conversation history to a JSON file.
    If session_name is provided, saves to a separate file per session (Bonus 2).
    """
    filename = f"history_{session_name}.json" if session_name else HISTORY_FILE
    with open(filename, 'w') as f:
        json.dump(history, f, indent=2)


def load_history(session_name=None):
    """Load conversation history from a JSON file.
    Returns an empty list if no file exists yet.
    If session_name is provided, loads from the session-specific file (Bonus 2).
    """
    filename = f"history_{session_name}.json" if session_name else HISTORY_FILE
    if not os.path.exists(filename):
        return []
    with open(filename, 'r') as f:
        return json.load(f)


def print_recent_history(history, n=5):
    """Print the last n messages in a readable format (Bonus 1: /history command)."""
    recent = history[-n:] if len(history) >= n else history
    if not recent:
        print("No history yet.")
        return
    print(f"\n--- Last {len(recent)} messages ---")
    for msg in recent:
        label = "You" if msg["role"] == "user" else "Maya"
        print(f"  [{label}]: {msg['content'][:120]}{'...' if len(msg['content']) > 120 else ''}")
    print("---\n")


def list_sessions():
    """List all saved session files in the current directory (Bonus 2)."""
    sessions = [
        f.replace("history_", "").replace(".json", "")
        for f in os.listdir(".")
        if f.startswith("history_") and f.endswith(".json")
    ]
    return sessions
