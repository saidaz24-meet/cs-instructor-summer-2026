# Lab 2 — Understand the Backend & the API

Go under the hood: inspect the raw API response, experiment with parameters, and understand exactly what gets sent to the API on every turn.

## What you learn

- What the full API response object looks like (`id`, `model`, `usage`, `stop_reason`, etc.)
- What `input_tokens` and `output_tokens` mean
- How `max_tokens` limits the reply length
- How `temperature` controls randomness
- Why the full conversation history is sent on every API call

## How to run

```bash
cd agent
pip install anthropic python-dotenv
# add your API key to .env
python app.py
```

## What to try

| Experiment | How |
|------------|-----|
| See the raw response | Already printed — look for the `Message(...)` block |
| Limit reply length | Change `max_tokens` to `50` in `app.py` |
| Make answers deterministic | Change `temperature` to `0`, ask the same thing 3× |
| Make answers random | Change `temperature` to `1`, ask the same thing 3× |
| Watch history grow | Look at the `History:` line printed before each call |

## Bonuses implemented

- **Bonus 1** — Token usage printed after every reply (`In / Out / Total`)
- **Bonus 2** — Running total of tokens across the whole conversation
- **Bonus 3** — Estimated cost in cents using Haiku pricing ($0.25/M input, $1.25/M output)
