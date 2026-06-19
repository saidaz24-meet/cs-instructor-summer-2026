# Lab 1 — Build Your First AI Agent

Build a terminal chat agent using the Anthropic API with a custom personality, conversation memory, and interactive commands.

## What you learn

- How to call the Anthropic API from Python
- What a system prompt does and how to change it
- How conversation history works (the `messages` list)
- How to build a simple interactive chat loop

## How to run

```bash
cd agent
pip install anthropic python-dotenv
# add your API key to .env
python app.py
```

## Commands

| Input | What it does |
|-------|--------------|
| Any message | Chat with the AI |
| `reset` | Clear conversation history |
| `exit` | Quit the program |

## Bonuses implemented

- **Bonus 1** — Turn counter shown before each message (`[Turn 3] You: ...`)
- **Bonus 2** — `reset` command clears history without restarting
- **Bonus 3** — Choose the AI's personality at startup
