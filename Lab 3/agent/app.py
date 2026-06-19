import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

# ─────────────────────────────────────────────
# System prompt — the agent's identity and rules
# ─────────────────────────────────────────────
BASE_SYSTEM = """
You are Maya, an expert interview coach who helps students and young professionals
prepare for job interviews in tech, business, and research.

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
3. Score (only when the user answered a practice question): "Score: X/5 — [reason]"
4. One follow-up question or next practice prompt.

Scoring rubric (use when evaluating a user's answer to a practice question):
- 5/5 — Clear, specific, structured (STAR format), confident, no filler.
- 4/5 — Good content but missing one of the above.
- 3/5 — Decent answer, vague in places, could be stronger.
- 2/5 — Too short, too general, or off-topic.
- 1/5 — No real answer given, or completely off.
"""


def build_system_message(session_goal: str) -> str:
    """Inject the user's session goal into the system prompt (Bonus 1)."""
    return BASE_SYSTEM + f"\n\nThe user's goal for this session: {session_goal}"


def request_summary(history: list) -> str:
    """Ask the model to summarize the conversation so far (Bonus 2)."""
    summary_prompt = (
        "Please give a structured summary of our interview prep session so far. "
        "Include: topics we covered, strengths you noticed, and 2–3 specific areas to improve."
    )
    messages = history + [{"role": "user", "content": summary_prompt}]
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=500,
        temperature=0.5,
        system=BASE_SYSTEM,
        messages=messages,
    )
    return response.content[0].text


def run_chat():
    print("=== Maya — Interview Coach ===\n")

    # Bonus 1: capture session goal upfront
    session_goal = input("What is your goal for today's session? (e.g. 'prepare for a software engineering interview')\n> ").strip()
    if not session_goal:
        session_goal = "general interview preparation"

    system_message = build_system_message(session_goal)

    print(f"\nGreat! Let's work on: {session_goal}")
    print("Type your messages below. Commands: /summary · exit\n")

    history = []
    scores = []   # Bonus 3: track scores across the session

    while True:
        turn = len(history) // 2 + 1
        user_input = input(f"[Turn {turn}] You: ").strip()

        if not user_input:
            continue

        if user_input.lower() == "exit":
            # Print average score on exit (Bonus 3)
            if scores:
                avg = sum(scores) / len(scores)
                print(f"\nSession complete! Your average score: {avg:.1f}/5 over {len(scores)} scored answer(s).")
            print("Good luck with your interview!")
            break

        # Bonus 2: /summary command
        if user_input.lower() == "/summary":
            if not history:
                print("No conversation to summarize yet.\n")
            else:
                print("\nMaya: Here's your session summary:\n")
                print(request_summary(history))
                print()
            continue

        history.append({"role": "user", "content": user_input})

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=400,
            temperature=0.7,
            system=system_message,
            messages=history,
        )

        reply = response.content[0].text
        print(f"\nMaya: {reply}\n")

        # Bonus 3: parse score from reply if present
        for line in reply.splitlines():
            if line.strip().startswith("Score:"):
                try:
                    score_part = line.split("Score:")[1].strip()   # e.g. "4/5 — reason"
                    score_value = int(score_part.split("/")[0].strip())
                    scores.append(score_value)
                    running_avg = sum(scores) / len(scores)
                    print(f"[Running average score: {running_avg:.1f}/5 over {len(scores)} answer(s)]\n")
                except (ValueError, IndexError):
                    pass

        history.append({"role": "assistant", "content": reply})


run_chat()
