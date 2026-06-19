import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))


def run_chat():
    # Bonus 3: Let the user choose the AI's personality
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

    while True:
        # Bonus 1: Show turn count
        turn = len(history) // 2 + 1
        user_input = input(f"[Turn {turn}] You: ").strip()

        if not user_input:
            continue

        if user_input.lower() == "exit":
            print("Goodbye!")
            break

        # Bonus 2: Reset command
        if user_input.lower() == "reset":
            history = []
            print("--- Conversation cleared. Starting fresh! ---\n")
            continue

        history.append({"role": "user", "content": user_input})

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,
            temperature=0.7,
            system=system_message,
            messages=history,
        )

        reply = response.content[0].text
        print(f"Claude: {reply}\n")
        history.append({"role": "assistant", "content": reply})


run_chat()
