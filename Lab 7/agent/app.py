import os
from anthropic import Anthropic
from dotenv import load_dotenv
from memory import save_history, load_history, print_recent_history, list_sessions

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

SYSTEM_MESSAGE = """You are Maya, an expert interview coach who helps students and young professionals
prepare for job interviews in tech, business, and research. Your job is to simulate realistic
interview practice, give honest feedback, and help the user improve with every answer they give.

WHAT YOU DO:
- Simulate realistic interview questions for the role the user specifies.
- Give specific, honest, actionable feedback on every answer.
- Guide the user to improve — never hand them the answer.
- Score each answer on a scale of 1-5 where 5 is perfect. Include the score in your reply
  in the format: Score: X/5

WHAT YOU WILL NOT DO:
- Answer questions unrelated to interview preparation.
- Give vague praise like "great answer!" without explaining why.

Every response must follow this format:
[Summary]: One sentence repeating what the user said.
[Response]: Your coaching feedback (2-4 sentences, specific and actionable).
[Score]: X/5 — one sentence explaining the score.
[Next Step]: One concrete action the user should take right now."""


def parse_score(reply):
    """Extract score from Maya's reply."""
    import re
    match = re.search(r'\[Score\].*?(\d)/5', reply)
    if match:
        return int(match.group(1))
    return None


def run_chat():
    # ── Bonus 2: Session support ──────────────────────────────────────
    existing = list_sessions()
    if existing:
        print(f"Existing sessions: {', '.join(existing)}")
        print("Enter a session name to continue it, or type a new name to start fresh.")
    else:
        print("No existing sessions found.")

    session_name = input("Session name (press Enter for default): ").strip()
    session_name = session_name if session_name else None
    # ──────────────────────────────────────────────────────────────────

    # Load history from file (persists across restarts)
    history = load_history(session_name)

    # ── Session goal ──────────────────────────────────────────────────
    if not history:
        goal = input("What's your interview goal for this session? ").strip()
        system_message = SYSTEM_MESSAGE + f"\n\nSession goal: {goal}"
    else:
        system_message = SYSTEM_MESSAGE
        print(f"Resuming session with {len(history)} messages loaded.")

    print("\nMaya: Hi! I'm Maya, your interview coach.")
    print("Commands: 'exit' to quit | '/history' to see recent messages | '/summary' for session recap\n")

    scores = []
    turn = 0

    while True:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        if user_input.lower() == 'exit':
            print(f"\nSession saved. Total turns: {turn}")
            if scores:
                avg = sum(scores) / len(scores)
                print(f"Average score this session: {avg:.1f}/5")
            break

        # ── Bonus 1: /history command ─────────────────────────────────
        if user_input.lower() == '/history':
            print_recent_history(history)
            continue

        # ── /summary command (from Lab 3) ─────────────────────────────
        if user_input.lower() == '/summary':
            summary_prompt = [{"role": "user", "content":
                "Summarize our conversation so far. List the questions practiced, "
                "the scores given, and the top 2 things the user should work on."}]
            response = client.messages.create(
                model='claude-3-haiku-20240307',
                max_tokens=500,
                system=system_message,
                messages=history + summary_prompt
            )
            print(f"\nMaya (summary):\n{response.content[0].text}\n")
            continue

        history.append({"role": "user", "content": user_input})

        response = client.messages.create(
            model='claude-3-haiku-20240307',
            max_tokens=400,
            system=system_message,
            messages=history
        )

        reply = response.content[0].text
        history.append({"role": "assistant", "content": reply})

        # Save after every turn
        save_history(history, session_name)

        turn += 1
        score = parse_score(reply)
        if score:
            scores.append(score)
            running_avg = sum(scores) / len(scores)
            print(f"\n[Turn {turn}] [Avg score: {running_avg:.1f}/5]")

        print(f"\nMaya:\n{reply}\n")


run_chat()
