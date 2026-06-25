# Lab 8 — Plan and Architect Your Final Project

> This session is about thinking clearly before you write a single prompt. Nothing is built yet.

## What you produce

By the end of this session your team has:
1. Written project definition (problem, user, agents)
2. Architecture diagram (photographed)
3. First draft of all four system prompts
4. Task list with owners and priorities

---

## Step 1: Project definition

Answer these as a team:

1. What does your app do? (1-2 sentences)
2. Who is the user?
3. How many agents does it have, and what does each one do?
4. What would a bad version look like? What makes yours better?

---

## Step 2: Agent design (one per team member)

For your agent, write down:
- Agent name and role
- What the user says to it
- What it always does / what it never does
- What format it responds in

Write a first draft system prompt. You will refine it in Session 9.

---

## Step 3: Architecture diagram

On paper or whiteboard, draw:
- One box: Bolt frontend
- One box per agent (system prompt inside)
- One box: database (if using Supabase)
- Arrows showing data flow

Photograph it and keep it for Session 9.

---

## Planning template

Fill this in as a team. Keep it in your project notes.

```python
# PROJECT DEFINITION
PROJECT_NAME = ''
PROBLEM      = ''   # What problem does this solve?
USER         = ''   # Who uses this?

# AGENTS
# Agent 1:
#   Name:
#   Role:
#   System prompt draft:

# Agent 2:
#   Name:
#   Role:
#   System prompt draft:

# Agent 3:
#   Name:
#   Role:
#   System prompt draft:

# Agent 4:
#   Name:
#   Role:
#   System prompt draft:

# ARCHITECTURE
# Frontend:   Bolt.new (UI + deployment)
# AI:         Anthropic Claude API via Bolt
# Database:   JSON (local) / Supabase (cloud) / none

# TASK LIST
tasks = [
  {'task': 'Write system prompt — Agent 1', 'owner': '', 'priority': 'MVP'},
  {'task': 'Write system prompt — Agent 2', 'owner': '', 'priority': 'MVP'},
  {'task': 'Write system prompt — Agent 3', 'owner': '', 'priority': 'MVP'},
  {'task': 'Write system prompt — Agent 4', 'owner': '', 'priority': 'MVP'},
  {'task': 'Build Bolt app with all agent tabs', 'owner': '', 'priority': 'MVP'},
  {'task': 'Test and refine each agent', 'owner': '', 'priority': 'MVP'},
  {'task': 'Add Supabase persistence', 'owner': '', 'priority': 'nice-to-have'},
  {'task': 'Polish UI and deploy', 'owner': '', 'priority': 'MVP'},
]
```

---

## Bonuses

**Bonus 1** — Write a 2-sentence elevator pitch. Read it out loud to another team.

**Bonus 2** — Sketch a UI wireframe. Label every element on screen.

**Bonus 3** — Failure pre-mortem: imagine your project fails completely.
Write 3 specific reasons why, then write what you will do to prevent each one.
