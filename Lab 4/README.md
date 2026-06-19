# Lab 4 — Build a Frontend UI with Bolt.new

> **This is the start of Mini Project 2.**
> From Lab 4 through Lab 6, you and your partner build one shared app together.
> Choose your partner and decide what your shared agent will do.

Turn your Python agent into a real web app — without writing HTML or CSS.
You describe what you want, Bolt builds it.

## What you learn

- How to turn a system prompt into a full web interface using natural language
- How the same Anthropic API works in JavaScript (not just Python)
- How to deploy a public URL in under a minute
- How to read and compare AI-generated code to code you wrote yourself

## No code to run locally

This lab lives on [bolt.new](https://bolt.new). Your app is generated and hosted there.
This folder contains the resources you need to do the lab.

## Files in this folder

| File | What it is |
|------|------------|
| [`bolt-prompt.md`](bolt-prompt.md) | Ready-to-paste prompt for Bolt (Maya pre-filled, Bonus 1 & 2 prompts included) |
| [`bonus3-code-comparison.md`](bonus3-code-comparison.md) | Fill-in template for Bonus 3 — comparing Bolt code to your app.py |

## Step-by-step

1. Open [bolt.new](https://bolt.new)
2. Copy the prompt from [`bolt-prompt.md`](bolt-prompt.md) — replace with your own agent if not using Maya
3. Paste it into Bolt and press Enter (~30 seconds to generate)
4. In the Bolt editor, find the `.env` section and add your API key:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```
5. Click the preview — test your agent in the browser
6. Click **Deploy** — copy your public URL
7. Paste your URL into [`bonus3-code-comparison.md`](bonus3-code-comparison.md)

## Bonuses

- **Bonus 1** — Use the "New Chat" prompt in `bolt-prompt.md` to add a reset button
- **Bonus 2** — Use the toggle prompt to add a second AI persona with a different system prompt and color accent
- **Bonus 3** — Fill in [`bonus3-code-comparison.md`](bonus3-code-comparison.md): find the API call in Bolt's code, list 3 differences and 3 similarities vs your `app.py`
