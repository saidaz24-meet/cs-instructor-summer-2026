import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

# Haiku pricing (per million tokens)
COST_PER_M_INPUT = 0.25   # dollars
COST_PER_M_OUTPUT = 1.25  # dollars


def format_cost(total_input_tokens, total_output_tokens):
    """Return estimated cost in cents as a formatted string."""
    cost = (total_input_tokens / 1_000_000 * COST_PER_M_INPUT +
            total_output_tokens / 1_000_000 * COST_PER_M_OUTPUT)
    return f"{cost * 100:.4f}¢"


def run_chat():
    personality = input("What personality should the AI have? (press Enter for default) ").strip()
    if not personality:
        system_message = (
            "Your name is Alex. You are a helpful and friendly assistant who helps students "
            "learn about technology and computer science. You explain things clearly and always "
            "encourage curiosity."
        )
    else:
        system_message = personality

    print("\nChat started! Type 'exit' to quit, 'reset' to clear history.\n")

    history = []
    total_input_tokens = 0
    total_output_tokens = 0

    while True:
        turn = len(history) // 2 + 1
        user_input = input(f"[Turn {turn}] You: ").strip()

        if not user_input:
            continue

        if user_input.lower() == "exit":
            print("Goodbye!")
            break

        if user_input.lower() == "reset":
            history = []
            total_input_tokens = 0
            total_output_tokens = 0
            print("--- Conversation cleared. Starting fresh! ---\n")
            continue

        history.append({"role": "user", "content": user_input})

        # Step 3: inspect full history before the call
        print("History:", history)

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,   # Step 2: try changing to 50 or 500
            temperature=0.7,  # Step 2: try 0 (deterministic) or 1 (creative)
            system=system_message,
            messages=history,
        )

        # Step 1: inspect the full raw response
        print(response)

        reply = response.content[0].text

        # Bonus 1 & 2: token usage per turn and running total
        turn_input = response.usage.input_tokens
        turn_output = response.usage.output_tokens
        total_input_tokens += turn_input
        total_output_tokens += turn_output
        total_tokens = total_input_tokens + total_output_tokens

        print(f"Claude: {reply}\n")
        print(f"[Tokens used — In: {turn_input} | Out: {turn_output} | Total this turn: {turn_input + turn_output}]")
        print(f"[Running total — {total_tokens} tokens | Estimated cost: {format_cost(total_input_tokens, total_output_tokens)}]")
        print()

        history.append({"role": "assistant", "content": reply})


run_chat()
