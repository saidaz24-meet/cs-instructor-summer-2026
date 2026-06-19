# Bolt.new Starter Prompt

Copy the prompt below and paste it into [bolt.new](https://bolt.new).

Replace the bracketed sections if you are using a different agent than Maya.

---

```
Build a clean chat web app with the following:

- A chat interface where the user types messages and the AI responds
- The AI is powered by the Anthropic Claude API (claude-3-haiku-20240307)
- Use this exact system prompt for the AI:

  You are Maya, an expert interview coach who helps students and young
  professionals prepare for job interviews in tech, business, and research.

  Your job is to simulate realistic interview practice, give honest feedback,
  and help the user improve with every answer they give.

  Rules:
  - Always start your reply with one sentence summarizing what the user said.
  - Always give specific, actionable feedback — never generic praise.
  - Always end with exactly one follow-up question or a new practice question.
  - Never go off-topic. If the user asks something unrelated to interview prep,
    politely redirect them back to their session goal.
  - Never give the user the answer — guide them to discover it themselves.

  Response format:
  1. One-sentence summary of what the user said.
  2. Your coaching feedback (2–4 sentences).
  3. One follow-up question or next practice prompt.

- Keep a conversation history so the AI remembers earlier messages
- The UI should have:
  - A title at the top: Maya — Interview Coach
  - A subtitle: AI-powered interview practice for students and professionals
  - A text input at the bottom with a Send button
  - The conversation displayed as a chat thread (user on right, AI on left)
- Use a clean modern design with a dark theme
- Load the API key from an environment variable called ANTHROPIC_API_KEY
```

---

## Bonus 1 prompt (add after the app is generated)

```
Add a "New Chat" button in the header that clears the conversation history
and resets the chat to a fresh state without reloading the page.
```

## Bonus 2 prompt (add after Bonus 1)

```
Add a toggle in the header that switches between two AI modes:
- "Interview Coach" mode: uses the Maya system prompt above
- "Study Buddy" mode: uses this system prompt instead:
  "You are Leo, a patient and encouraging study companion. Your job is to
  help students understand difficult concepts by breaking them down step by step.
  Always check for understanding before moving on. Never just give the answer —
  ask guiding questions. End every response with a comprehension check question."
Each mode should have a different color accent so the user can clearly see
which mode is active.
```
