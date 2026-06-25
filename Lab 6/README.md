# Lab 6 — Prompt Engineering for Product Builders

**Mini Project 2 — Final submission**

## What this lab covers

Applying 4 prompt engineering techniques to improve an agent's behavior — directly inside the Bolt app — and comparing outputs before and after each change.

---

## Live app

https://ai-interview-coach-c-g1lq.bolt.host

---

## The 4 techniques

| Technique | What it does | File |
|-----------|-------------|------|
| 1. Tight role definition | WHO / WHAT / WHAT NOT — keeps the agent in-role under pressure | [`system-prompts/maya-v2-engineered.md`](system-prompts/maya-v2-engineered.md) |
| 2. Structured output | Forces every reply into `[Summary] / [Response] / [Next Step]` | same file |
| 3. Few-shot example | One perfect input-output pair trains the tone and format | same file |
| 4. Chain-of-thought (hidden) | Agent reasons step-by-step before writing — result only shown | same file |

See [`system-prompts/maya-v1-original.md`](system-prompts/maya-v1-original.md) for the baseline to compare against.

---

## How to apply to the Bolt app

Prompt Bolt with this (one at a time, test after each):

**Technique 1:**
```
Update Maya's system prompt to clearly define:
WHO she is, WHAT she does, and WHAT SHE WILL NOT DO.
Add a redirect message for off-topic questions.
```

**Technique 2:**
```
Update Maya's system prompt so every response uses exactly this format:
[Summary]: one sentence repeating what the user asked
[Response]: coaching feedback (2-4 sentences, specific and actionable)
[Next Step]: one concrete action the user should take right now
```

**Technique 3:**
```
Add this example at the end of Maya's system prompt:
User: I'm preparing for a software engineering interview at Google next week. I struggle with dynamic programming.
Maya:
[Summary]: You have a Google SWE interview next week and dynamic programming is your weak spot.
[Response]: Dynamic programming trips up most candidates because they memorize patterns instead of understanding overlapping subproblems and optimal substructure. Start with coin change, longest common subsequence, and climbing stairs — write the brute-force recursive solution first, then optimize.
[Next Step]: Solve "Climbing Stairs" on LeetCode (problem 70) right now using recursion only, then add memoization. Report back what felt hard.
```

**Technique 4:**
```
Add this instruction to Maya's system prompt:
"Before answering, think step by step: what did the user say, what is the most useful feedback, and what is the best next step. Do not show your thinking. Only output the formatted response."
```

---

## Before vs. After comparison

| Test message | v1 response (before) | v2 response (after) |
|---|---|---|
| "I need help with interviews" | Generic intro, asks what type | `[Summary]` + specific redirect + `[Next Step]` |
| "What's the weather today?" | May go off-topic | Politely redirects: "Let's keep focus on your prep..." |
| Complex question | Direct answer | Structured format, visibly more organized |

---

## Bonuses

| Bonus | What to do |
|-------|------------|
| Bonus 1 | Run the same 3 messages through v1 and v2 side-by-side. Write which responses are more useful and why. |
| Bonus 2 | Add this line at the top of the system prompt: `"You are an expert instruction follower. You always follow the format exactly."` Test if format compliance improves. |
| Bonus 3 | Prompt Bolt to add a toggle in the UI that switches between v1 and v2 system prompts in real time. Use it to A/B test responses. |

---

## Mini Project 2 submission checklist

- [ ] Two agent tabs working (Maya + Alex or your own agents)
- [ ] Maya uses the v2 engineered system prompt
- [ ] Loading indicator, message count, error handling all work
- [ ] Both team members' names visible in the app (title, subtitle, or about section)
- [ ] Share your public Bolt URL with the instructor
