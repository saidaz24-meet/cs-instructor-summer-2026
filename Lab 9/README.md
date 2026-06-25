# Lab 9 — Deploy Your App to the Internet

> Final group project build and launch session. By the end, your app is live with a public URL.

## What you deploy

A multi-agent Bolt app with 4 tabs — one agent per team member — polished, tested, and live on the internet.

---

## Step 1: Build in Bolt

Open a new Bolt project and paste this starter prompt (fill in your team's agents):

```
Build a clean multi-agent web app with 4 tabs.
Each tab is a separate AI agent with its own system prompt and conversation history.

Tab 1 — [AGENT NAME]:
System prompt: [PASTE HERE]

Tab 2 — [AGENT NAME]:
System prompt: [PASTE HERE]

Tab 3 — [AGENT NAME]:
System prompt: [PASTE HERE]

Tab 4 — [AGENT NAME]:
System prompt: [PASTE HERE]

The app should:
- Load the API key from an environment variable: ANTHROPIC_API_KEY
- Have a clean, modern design
- Show a loading indicator while the AI is responding
- Handle API errors gracefully with a friendly message
- Display the app name and team name in the header
```

Build one agent tab at a time. Test each one before moving to the next.

---

## Step 2: Launch checklist

Go through this before deploying. Prompt Bolt to fix anything that fails.

- [ ] All four agents respond correctly in character
- [ ] Switching tabs does not mix conversation histories
- [ ] Loading indicator appears while AI is thinking
- [ ] Error handling works (test by temporarily removing the API key)
- [ ] App name and team name visible in the header
- [ ] Design is clean and consistent across all tabs
- [ ] No placeholder text or unfinished UI elements

---

## Step 3: Deploy

1. In Bolt, add `ANTHROPIC_API_KEY` to the environment variables section
2. Click **Deploy**
3. Copy your public URL
4. Share it with your instructor
5. Test the live URL — confirm everything works the same as in preview

---

## Step 4: Prepare your showcase demo

Each team member should be able to answer:

1. What does your agent do, and why did you design it that way?
2. What was the biggest challenge, and how did you solve it?
3. What would you add if you had more time?

Practice: open the live URL and walk through each agent out loud.

---

## Bonuses

**Bonus 1** — Add a landing page: a brief intro screen explaining what the app does before the user starts chatting.

Prompt:
```
Add a landing page that appears when the user first opens the app.
It should show the app name, a one-sentence description of what it does,
and a "Start" button that takes the user to the main chat interface.
```

**Bonus 2** — Add Supabase persistence so conversations survive page refreshes.

Prompt:
```
Add Supabase persistence so all messages are saved to a messages table.
Load the last 20 messages for the current user when the app starts.
Use SUPABASE_URL and SUPABASE_ANON_KEY environment variables.
```

**Bonus 3** — Add a usage dashboard showing how many messages each agent has received.

Prompt:
```
Add a small stats panel (collapsible) that shows how many messages
each agent tab has received in the current session.
Update the count in real time as new messages arrive.
```
