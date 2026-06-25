# Running the Agent Without an API Key
### For staff who have a Claude subscription but no Anthropic API key

This guide shows you how to modify `app.py` so it works using the **Claude Code app**
you already have installed — no API key required.

---

## Before you start: one check

Open your terminal and type:

```
claude --version
```

If you see a version number, you're good. If you get "command not found", open the
Claude Code desktop app first, then try again.

---

## What to change in app.py

### Step 1 — Remove these 4 lines from the top

Find and **delete** these lines:

```python
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
```

Replace them with just this:

```python
import subprocess
```

So the top of your file should now look like this:

```python
import os
import subprocess

def ask_claude(system_message, history, user_input):
    prompt = "System: " + system_message + "\n\n"
    for msg in history:
        label = "Human" if msg["role"] == "user" else "Assistant"
        prompt += label + ": " + msg["content"] + "\n\n"
    prompt += "Human: " + user_input + "\nAssistant:"

    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True
    )
    return result.stdout.strip()
```

---

### Step 2 — Replace the API call inside the loop

Find this block (it's inside the `while True:` loop):

```python
response = client.messages.create(
    model='claude-3-haiku-20240307',
    max_tokens=300,
    temperature=0.7,
    system=system_message,
    messages=history
)

reply = response.content[0].text
```

Delete it and replace with this single line:

```python
reply = ask_claude(system_message, history, user_input)
```

---

### Step 3 — Delete the .env file (you don't need it)

You no longer need the `.env` file or the `ANTHROPIC_API_KEY` line.
You can leave it there — it just won't be used.

---

## What your final app.py should look like

```python
import os
import subprocess

def ask_claude(system_message, history, user_input):
    prompt = "System: " + system_message + "\n\n"
    for msg in history:
        label = "Human" if msg["role"] == "user" else "Assistant"
        prompt += label + ": " + msg["content"] + "\n\n"
    prompt += "Human: " + user_input + "\nAssistant:"

    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True
    )
    return result.stdout.strip()


def run_chat():
    print("You: (type exit to quit)")
    system_message = "Your name is Alex. You are a helpful and friendly assistant who helps students learn about technology and computer science. You explain things clearly and always encourage curiosity."
    history = []

    while True:
        user_input = input(">> ")

        if user_input.lower() == "exit":
            break

        history.append({"role": "user", "content": user_input})

        reply = ask_claude(system_message, history, user_input)

        print(f"Claude: {reply}")
        history.append({"role": "assistant", "content": reply})


run_chat()
```

---

## Run it

```
python app.py
```

No API key. No `.env`. Just the Claude app running on your computer.

---

## Things to know

- **It's a bit slower** — each message opens the Claude app in the background, which takes 2-3 seconds extra.
- **The conversation memory still works** — the history is passed along in every message, same as the real API.
- **The Claude app must be installed** — if you uninstall it, this stops working.
- **This only works on your own computer** — it uses your personal Claude login.

---

## When you get a real API key

Switch back by replacing `import subprocess` and the `ask_claude` function
with the original 4 lines, and restoring the `client.messages.create()` call.
Everything else in the code stays the same.
