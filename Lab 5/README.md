# Lab 5 — Customize & Extend Your Bolt App

**Mini Project 2 — Continue**

## What this lab covers

Reading, improving, and extending the Bolt app from Lab 4 — all through prompting, no manual coding.

---

## Status: all features already implemented

The app committed in [`Lab 4/agent/`](../Lab%204/agent/) already satisfies every requirement and bonus for this lab:

| Requirement | Where it is |
|-------------|-------------|
| Loading indicator while AI responds | `App.tsx` — `isLoading` state + `<Loader2 animate-spin>` component |
| Message count display | `App.tsx` — `userMessageCount` + `totalMessageCount` shown in header |
| Friendly error message on API failure | `App.tsx` — catch block sets assistant message to "Something went wrong. Please try again." |
| Second agent tab (Alex — Career Advisor) | `App.tsx` — `AgentMode` type, `AGENT_CONFIG`, `handleModeSwitch()` |
| Separate conversation history per tab | `App.tsx` — `handleModeSwitch()` clears `messages` on tab switch |
| Bonus 1 — Copy button per message | `App.tsx` — `handleCopy()` + clipboard API + Check/Copy icon toggle |
| Bonus 2 — Export conversation as .txt | `App.tsx` — `handleExport()` creates a Blob and triggers download |

---

## Code reading questions (Step 1 answers)

| Question | Answer |
|----------|--------|
| Where is the system prompt stored? | `supabase/functions/chat/index.ts` — `MAYA_SYSTEM_PROMPT` and `ALEX_SYSTEM_PROMPT` constants |
| Where is the conversation history stored? | `App.tsx` — `messages` state (array of `{id, role, content}`) |
| What happens when the user presses Send? | `handleSubmit()` adds the user message to state, calls `supabase.functions.invoke('chat', ...)`, appends the reply |
| What gets sent to the API? | `agentMode` + `messages` array (role + content only, no ids) |

---

## Live app

https://ai-interview-coach-c-g1lq.bolt.host

---

## Bonuses

All three bonuses are implemented. See `App.tsx`:
- **Bonus 1** — Copy button: `handleCopy()`, `copiedId` state, `Copy`/`Check` icon swap
- **Bonus 2** — Export: `handleExport()`, Blob + object URL + `<a>` click pattern
- **Bonus 3** — The app was intentionally stress-tested during development (switching modes mid-conversation, rapid sends). No conflicts found — Bolt's generated code handles these cases cleanly.
