# Lab 7 — Add Persistent Memory

> Introduction to the Final Group Project. In this session you will meet your team (groups of 4).

## What you build

Two solutions to the memory problem — local JSON file persistence for your Python agent, and Supabase cloud persistence for your Bolt app.

---

## The problem

In-memory state (`history = []`) only lives while the program is running. Restart the terminal and everything is gone. Real apps need to store state somewhere permanent.

| Solution | Where data lives | Works when |
|----------|-----------------|------------|
| JSON file | Your computer's disk | Single user, local only |
| Supabase | Cloud database | Multiple users, deployed app |

---

## Files

| File | What it does |
|------|-------------|
| [`agent/memory.py`](agent/memory.py) | `save_history()`, `load_history()`, session support, `/history` printer |
| [`agent/app.py`](agent/app.py) | Maya interview coach with full memory persistence + all bonuses |
| [`agent/supabase-queries.sql`](agent/supabase-queries.sql) | SQL queries for Bonus 3 — filter by date, user, date range |

---

## How to run

```bash
cd "Lab 7/agent"
pip install anthropic python-dotenv
python app.py
```

1. Enter a session name (or press Enter for the default)
2. Chat with Maya — history saves after every turn
3. Exit and restart — your conversation is still there
4. Type `/history` to see recent messages
5. Type `/summary` to get a session recap
6. Type `exit` to quit

---

## Bonuses implemented

| Bonus | Feature | Where |
|-------|---------|-------|
| Bonus 1 | `/history` command prints last 5 messages | `memory.py: print_recent_history()`, `app.py` command handler |
| Bonus 2 | Session name at startup — each session has a separate `history_<name>.json` file | `memory.py: save_history(session_name)`, `app.py` session prompt |
| Bonus 3 | Supabase SQL queries — filter by date, user, date range | `agent/supabase-queries.sql` |

---

## Step 3: Add Supabase persistence to your Bolt app

Paste this prompt into your Bolt project:

```
Add Supabase persistence to this app.
Save every message to a Supabase messages table.
Use the SUPABASE_URL and SUPABASE_ANON_KEY environment variables.
Each row should store: user_id, role, content, and a timestamp.
Load the last 20 messages for the current user when the app starts.
```

Then open your Supabase dashboard and watch rows appear in real time as you chat.
See [`agent/supabase-queries.sql`](agent/supabase-queries.sql) for queries to explore your data.

---

## Team discussion (Step 4)

Before Session 8, your team should answer:
- What data will your final project need to save?
- JSON (simple, local) or Supabase (cloud, multi-user)?
- How many tables might you need?
