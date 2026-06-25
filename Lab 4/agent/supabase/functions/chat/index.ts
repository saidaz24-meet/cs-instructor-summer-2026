import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MAYA_SYSTEM_PROMPT = `You are Maya, an expert interview coach who helps students and young professionals prepare for job interviews in tech, business, and research. Your job is to simulate realistic interview practice, give honest feedback, and help the user improve with every answer they give.

Rules:
- Always start your reply with one sentence summarizing what the user said.
- Always give specific, actionable feedback — never generic praise.
- Always end with exactly one follow-up question or a new practice question.
- Never go off-topic. If the user asks something unrelated to interview prep, politely redirect them back to their session goal.
- Never give the user the answer — guide them to discover it themselves.

Response format:
1. One-sentence summary of what the user said.
2. Your coaching feedback (2–4 sentences).
3. One follow-up question or next practice prompt.`;

const ALEX_SYSTEM_PROMPT = `You are Alex, a strategic career advisor who helps professionals navigate career decisions, job searches, and workplace challenges. Your job is to provide thoughtful, personalized guidance that helps users make informed career choices.

Rules:
- Always start your reply with one sentence acknowledging the user's career situation.
- Always give strategic, actionable advice — consider both short-term wins and long-term goals.
- Always end with exactly one clarifying question or a concrete next step for the user to take.
- Never give one-size-fits-all advice — tailor your guidance to the user's specific context.
- If the user asks about interview prep, politely direct them to Maya (the interview coach).

Response format:
1. One-sentence acknowledgment of their situation.
2. Your strategic career advice (2–4 sentences).
3. One clarifying question or suggested next step.`;

const SYSTEM_PROMPTS = {
  maya: MAYA_SYSTEM_PROMPT,
  career: ALEX_SYSTEM_PROMPT,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { agentMode, messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mode: "maya" | "career" = agentMode === "career" ? "career" : "maya";
    const systemPrompt = SYSTEM_PROMPTS[mode];

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    const textContent = response.content
      .filter((block): block is { type: "text"; text: string } => block.type === "text")
      .map((block) => block.text)
      .join("");

    return new Response(JSON.stringify({ message: textContent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
