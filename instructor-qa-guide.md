# Instructor Q&A Guide — AI Agents with Python & Claude API

Predicted student questions and answers for each lab. Grounded in the actual committed code.

---

## Lab 1 — Build Your First AI Agent

**Q: My terminal says `anthropic` is not found. What did I do wrong?**
You skipped the install step. Run `pip install anthropic` in the same environment your script runs in. If you're using a virtual env, make sure it's activated first.

**Q: Why do I need `load_dotenv()`? Can't I just paste the API key directly in the code?**
You can, but never do it. Hardcoding keys means if you push to GitHub, your key is exposed and Anthropic will revoke it. `load_dotenv()` reads from a `.env` file that stays on your machine and never gets committed.

**Q: What's the difference between `system` and `messages` in the API call?**
`system` is the invisible instruction layer — the AI reads it but it never appears in the conversation. `messages` is the actual back-and-forth. Think of `system` as the job description and `messages` as the actual interview.

**Q: Why does `response.content[0].text` have `[0]`? Why not just `.content`?**
`.content` returns a list because the API can theoretically return multiple content blocks (text, images, etc.). In our case there's always one text block, so we grab index `[0]` and then `.text` to get the string out.

**Q: My chat loop runs forever and Ctrl+C crashes ugly. Is that normal?**
Yes. `while True` loops forever by design. The `break` on `"exit"` is the clean exit. Ctrl+C works too — it just throws a `KeyboardInterrupt`. You can wrap the loop in `try/except KeyboardInterrupt` if you want a cleaner shutdown message.

**Q: For Bonus 1, why is the turn counter `len(history) // 2 + 1` instead of just `len(history)`?**
Because each turn adds two entries to history — one `user` dict and one `assistant` dict. After one full exchange, `len(history) == 2`. Integer-divide by 2 gives the real turn count, then `+1` offsets for the current turn you're on.

**Q: For Bonus 2, does clearing `history = []` affect anything else?**
Only if something else holds a reference to the old list. Since we reassign the variable, the old list gets garbage collected. The `system_message` is separate and stays — which is exactly what you want.

**Q: What happens if I pass an empty `messages=[]` list to the API?**
The API call will fail. Anthropic requires at least one message in the list. You'll get a `BadRequestError`. Always ensure the user typed something before calling the API.

---

## Lab 2 — Understand the Backend & the API

**Q: I printed `response` and got a giant object dump. What am I looking at?**
That's the full `Message` object Anthropic returns. The fields you care about: `.content[0].text` (the reply), `.usage.input_tokens`, `.usage.output_tokens`. The rest is metadata — model name, stop reason, request ID.

**Q: Why does `temperature=0` make responses "deterministic"? What's temperature actually doing?**
Temperature controls how the model samples its next word. At `0` it always picks the highest-probability word, so same input → same output. At `0.7` it introduces randomness. Higher = more creative and unpredictable.

**Q: I set `max_tokens=50` and the reply got cut off mid-sentence. Is that a bug?**
Not a bug — that's exactly what `max_tokens` does. It's a hard cap on output length. The model stops generating even mid-thought. Use it to control cost and response length, not to shape content.

**Q: My total token count keeps growing each turn. Why?**
Because `history` grows with every turn and you send the entire history to the API each time. The model has no memory of its own — you're re-sending the whole conversation so it has context. More turns = more input tokens = higher cost.

**Q: The cost calculation seems tiny. Is this formula right?**
Yes. Haiku is very cheap — $0.25 per million input tokens. A typical student session might use 5,000 tokens total, costing $0.00125. The formula `(tokens / 1_000_000) * rate` is correct.

**Q: Why do we track `total_input_tokens` and `total_output_tokens` separately?**
Because they have different prices. Input is $0.25/M, output is $1.25/M — five times more expensive. Conflating them gives you a wrong cost estimate. Always track them separately.

**Q: I printed `history` before the API call and it already has the previous assistant reply. Why?**
Because you appended the assistant's last reply at the end of the previous turn. That's the correct pattern — the model needs to see its own previous responses to maintain coherent conversation.

---

## Lab 3 — Goal-Based AI Agent (Mini Project 1)

**Q: Why do we use `build_system_message(session_goal)` instead of writing the goal directly in `BASE_SYSTEM`?**
Because the goal changes per session based on user input. `BASE_SYSTEM` is the fixed personality and rules. `build_system_message()` stitches the static base with the dynamic goal at runtime. This is the standard pattern for parameterized prompts.

**Q: My `/summary` command isn't triggering. What's wrong?**
Check your input comparison — if you're comparing to `"/summary"` but the user typed `" /summary"` with a leading space, it won't match. Always call `.strip()` on `user_input` before comparing.

**Q: How does `request_summary()` work without starting a new conversation?**
It makes a completely separate API call with a modified version of the history. It appends a user message asking for a summary, then sends it. The result never gets added to the real `history`, so the main conversation is untouched.

**Q: My score parser crashes when the model doesn't include "Score:" in its reply.**
Wrap the parsing block in a check: `if "Score:" in line`. If no score line is found, skip it. Also tighten the system prompt to always require a score — prompt engineering and defensive parsing together are more reliable than either alone.

**Q: Why use `sum(scores) / len(scores)` instead of tracking a running total variable?**
Keeping the raw `scores` list means you can recompute the average, find min/max, or display all scores later. A running total discards history. Lists are more flexible for the same storage cost.

**Q: Why is the goal injected into the system message instead of as a first user message?**
System messages set the agent's identity and rules — they're authoritative. A user message is something the agent responds to. Goal-setting belongs in `system` because it defines the agent's behavior for the whole session.

**Q: The model sometimes scores answers `6/5`. How do I handle that?**
Two things: tighten the system prompt ("Score must be an integer from 1 to 5, nothing else"). And in your parser, clamp: `score = max(1, min(5, int(raw)))`. Prompt engineering + defensive parsing together.

---

## Lab 4 — Build a Frontend UI with Bolt.new

**Q: Why is the Claude API called from a Supabase edge function instead of directly from React?**
Never put your API key in frontend code — it's visible to anyone who opens DevTools. The edge function runs server-side, keeps the key secret, and acts as a secure proxy. React calls the edge function; the edge function calls Claude.

**Q: What's Deno? I thought we were using Node.js.**
Deno is an alternative JavaScript/TypeScript runtime — think of it as a newer, more secure Node.js. Supabase edge functions run on Deno. The syntax is nearly identical to Node but imports use URLs instead of `npm install`. You don't need to deeply understand it — just know it runs your `index.ts`.

**Q: Why does `handleModeSwitch()` clear messages? Can't I keep the history when switching agents?**
You could, but the new agent receives a conversation it has no context for and may respond inconsistently. Clearing messages on switch gives each agent a clean start. If you want to preserve history per agent, you'd need separate state arrays for each mode.

**Q: The `handleExport()` function creates a "Blob" — what's that?**
A Blob is a browser API for creating in-memory files. You create a Blob from your chat text, generate a temporary URL with `URL.createObjectURL()`, then programmatically click a hidden `<a>` tag to trigger the download. Standard browser pattern for client-side file generation.

**Q: Why does the copy button use a `copiedId` state instead of a boolean `copied` flag?**
Because there are multiple messages, each with its own copy button. A single boolean can't track which specific message was copied. `copiedId` stores the `id` of the message currently showing the checkmark, so only that button changes icon.

**Q: My Bolt app deployed but the AI isn't responding. How do I debug?**
Check in order: (1) Is `ANTHROPIC_API_KEY` set in Bolt's environment variables? (2) Open browser DevTools Network tab — is the call to the edge function failing? (3) Check Supabase edge function logs for the actual error. Missing env var is the most common cause.

**Q: `supabase.functions.invoke` — what does that actually send over the network?**
An HTTP POST request to your Supabase edge function URL with a JSON body `{ agentMode, messages }`. Supabase handles authentication headers automatically. The Deno function receives this, builds the Claude API call, and returns the response.

---

## Lab 5 — Customize & Extend Your Bolt App

**Q: The loading spinner shows but then stays forever. What's wrong?**
Your `isLoading = false` reset is probably missing from the `catch` block. Make sure you set `isLoading = false` in a `finally` block so it always runs regardless of success or error.

**Q: Where does `<Loader2 className="animate-spin">` come from?**
`Loader2` is from the `lucide-react` icon library, which comes pre-installed in Bolt/Vite projects. `animate-spin` is a Tailwind CSS utility that applies a CSS rotation animation. You're composing existing tools — that's normal frontend development.

**Q: The error message "Something went wrong" is not very helpful. Can I show the actual error?**
In dev mode, yes — log it: `console.error(error)` inside the catch block. For users, keep it generic. Showing raw API errors leaks implementation details and is bad UX. Use the console for debugging, friendly copy for the UI.

**Q: How does `messages.filter(m => m.role === 'user').length` give me the user message count?**
`.filter()` creates a new array containing only elements where the condition is true. Since `messages` holds both `user` and `assistant` entries, filtering to `role === 'user'` isolates just user turns. `.length` then counts them.

**Q: My message count shows 0 until I refresh. Is the state updating?**
State updates in React are asynchronous — the UI re-renders after the state change, not immediately on the same line. If you log the count right after `setMessages()`, you'll see the old value. The rendered UI will be correct. Trust the render.

---

## Lab 6 — Prompt Engineering

**Q: What's the actual difference between v1 and v2? They say similar things.**
The difference is precision and structure. v1 is vague ("be helpful"). v2 defines WHO the agent is, WHAT it does, and WHAT NOT to do — plus a required output format and a worked example. The model follows specific instructions better than general ones. Run both and compare outputs side by side.

**Q: Why does the few-shot example go inside the system prompt instead of as a real message?**
You could put it as a fake message exchange, but it adds to your token count every turn and can confuse the model's sense of conversation history. In the system prompt it's a reference, not a real prior turn.

**Q: What's chain-of-thought and why is it "hidden"?**
Chain-of-thought tells the model to reason step by step before answering. "Hidden" means we add `"think step by step internally, but don't show your thinking"` — so the model reasons better but the user only sees the clean answer, not the scratchpad.

**Q: The `[Summary] / [Response] / [Next Step]` format keeps getting ignored. Why?**
Structured output instructions need to be stated clearly plus backed by an example. Try: `"You MUST format every response exactly as: [Summary]... [Response]... [Next Step]..."`. Models follow format instructions much more consistently when there's a worked example in the same prompt.

**Q: Does better prompt engineering cost more tokens?**
Yes — a longer system prompt uses more input tokens on every API call. But a well-engineered prompt reduces follow-up corrections, which saves turns. Net token spend often decreases even though per-call cost goes up slightly.

**Q: Is prompt engineering a permanent fix?**
It's iterative, not permanent. Models change, use cases evolve, edge cases emerge. Think of the system prompt as code that needs maintenance. Document versions (as you did with v1/v2 files) so you can roll back if a change makes things worse.

---

## Lab 7 — Persistent Memory

**Q: Why store history as JSON instead of a database?**
JSON files are simpler for a local Python app with one user — no setup, no server, no queries. Just `json.dump()` and `json.load()`. The Supabase version shows the database approach for multi-user web apps. Use the right tool for your scale.

**Q: My app crashes on first run because the file doesn't exist.**
That's why we have `if not os.path.exists(filename): return []`. If the file isn't there, return an empty list and start fresh. Handle the missing state case explicitly instead of letting it crash.

**Q: If I `save_history()` after every turn, won't that slow the app down?**
For small JSON files, the write is nearly instant — under 1ms. It only becomes a concern at tens of thousands of messages. Saving every turn is correct behavior: you never lose data if the app crashes mid-session.

**Q: What does `list_sessions()` actually do to find session files?**
It scans the current directory for filenames matching `history_*.json` and strips the prefix/suffix to return just the session names. No glob module needed — a simple `os.listdir()` + `startswith`/`endswith` check does it.

**Q: In Supabase, what's the `user_id` column for if students aren't logging in?**
It's a placeholder for future auth. Without login, hardcode a test ID or generate a UUID per session. In a real app, `user_id` links messages to the authenticated user so you can filter their history. Good schema design even before auth is wired up.

**Q: My `/history` command shows only assistant replies. Why?**
`history[-5:]` takes the last 5 entries from the list — if you just appended an assistant reply, those last 5 entries will be recent and weighted toward assistant messages. To show the last N turns, take `history[-(N*2):]` so you always get pairs.

**Q: Does loading history at startup load the whole file into RAM?**
Yes. `json.load()` reads the entire file into a Python list in memory. For a student chat history (kilobytes) this is perfectly fine. If you had millions of messages, you'd use a database with pagination instead.

---

## Lab 8 — Plan and Architect (No Code)

**Q: Why are we spending a whole lab on planning with no code?**
The most expensive mistakes happen before you write a single line. Defining agents, their responsibilities, and their interfaces upfront prevents two students from writing incompatible code, or discovering mid-project that the architecture can't support a feature.

**Q: How do we decide which student owns which agent?**
Split by function, not by complexity. Each agent should have one clear job. Assign by interest or skill, but the interface between agents (what data goes in and out) must be agreed on by everyone before anyone starts coding.

**Q: What's an "architecture diagram" supposed to show?**
At minimum: the components (agents, user, storage), the connections (what calls what), and the direction of data flow (arrows). A clear box-and-arrow sketch is enough to catch integration problems before they become bugs.

**Q: The planning template uses Python dict syntax. Is that actual runnable code?**
It's pseudocode that looks like Python to keep it familiar. The point isn't to run it — it's to force you to be specific about what each agent needs before you build it.

**Q: What if two students want to work on the same agent?**
Split the work — one handles the system prompt and behavior, the other handles the frontend tab and UI. Duplication is a coordination failure; the architecture plan should prevent it.

---

## Lab 9 — Deploy to the Internet

**Q: I set the API key in Bolt's environment variables but it's still not working.**
You need to redeploy after setting env vars — changes don't apply to an already-running deployment. In Bolt, save the env var, then trigger a new deploy. Check the variable name is exactly `ANTHROPIC_API_KEY` with no typos or extra spaces.

**Q: Can anyone see my API key if it's in Bolt's environment variables?**
No. Environment variables in the Bolt backend are server-side only — never sent to the browser. This is exactly why we use edge functions: the key lives on the server, not in the JavaScript that runs in the user's browser.

**Q: How do we make sure agent history doesn't mix between the four tabs?**
Each tab manages its own `messages` state array independently. If all four agents share one array, switching tabs shows the wrong history. One state array per agent, reset on tab switch.

**Q: The launch checklist says "agents in character" — what does that mean to test?**
Start a fresh session with each agent and give it an off-topic message. A properly configured agent should redirect, not answer it. If your interview coach answers questions about cooking, the system prompt needs tightening.

**Q: What happens to our app after the course ends?**
Bolt's free tier keeps apps live as long as the account is active. Supabase free projects may pause after inactivity (usually 1 week). If you want permanent hosting, export the project and deploy to Vercel or Netlify.

**Q: We have four agents but one edge function — how does the backend know which agent to use?**
That's what `agentMode` in the request body is for. The edge function receives it and uses it to select the right system prompt from a config object: `const config = AGENTS[agentMode]`. Each agent is just a different system prompt — same Claude model, different instructions.

**Q: Our app is live but slow — responses take 5-10 seconds. Is that normal?**
Yes for a first response — cold-starting the edge function adds latency. Subsequent calls within the same session are faster. If it's consistently slow, check that you're using `claude-3-haiku` (fastest) not a slower model, and that your edge function region is close to your users.
