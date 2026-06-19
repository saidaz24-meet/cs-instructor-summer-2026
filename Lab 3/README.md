# Lab 3 — Build a Goal-Based AI Agent

Transform the freeform chatbot into a purposeful agent with a clear role, structured output, and consistent behavior. This is **Mini Project 1**.

## What you learn

- How to write a goal-focused system prompt
- How structured output (format rules) shapes agent responses
- How to test and refine an agent's behavior through conversation
- How to give the agent a session goal it remembers throughout

## The agent: Maya — Interview Coach

Maya helps students and professionals prepare for job interviews. She gives specific feedback, scores answers, and never goes off-topic.

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
| Any message | Practice and get coached |
| `/summary` | Get a structured summary of the session |
| `exit` | End the session and see your average score |

## Sample session

```
What is your goal for today's session?
> prepare for a software engineering interview at Google

[Turn 1] You: I have no idea how to approach system design questions.

Maya: You're feeling uncertain about how to tackle system design questions.
That's one of the most common challenges — let's fix it. System design
questions test your ability to think out loud and make trade-offs, not
to give a perfect answer. Start every answer with: clarify the requirements.
Score: N/A (observation, not an answer)
What system would you like to practice designing first — a URL shortener, a chat app, or something else?
```

## Bonuses implemented

- **Bonus 1** — Session goal captured at startup, injected into every API call
- **Bonus 2** — `/summary` command triggers a structured recap of the session
- **Bonus 3** — Each scored answer is parsed from the reply; running average printed live; final average shown on exit
