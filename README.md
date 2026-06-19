# CS Instructor Summer 2026

Labs for the MEET CS summer 2026 course — building AI agents with Python and the Anthropic API.

Each lab builds on the one before it. Start from Lab 1 and work your way forward.

---

## Labs

| # | Title | Topics |
|---|-------|--------|
| [Lab 1](Lab%201/) | Build Your First AI Agent | Anthropic client, system prompts, conversation history, chat loop |
| [Lab 2](Lab%202/) | Understand the Backend & the API | API response structure, tokens, temperature, history inspection, cost |
| [Lab 3](Lab%203/) | Build a Goal-Based AI Agent *(Mini Project 1)* | System prompt design, structured output, session goals, scoring, /summary |

---

## Setup (do this once)

```bash
pip install anthropic python-dotenv
```

Create a `.env` file inside each lab's folder:

```
ANTHROPIC_API_KEY=your-key-here
```

The `.env` file is listed in `.gitignore` — it will never be pushed to GitHub.

---

## How to run a lab

```bash
cd "Lab 1/agent"
python app.py
```

Replace `Lab 1` with the lab you want to run.
