// proxy.js — secure backend for DIYchatbots (Cloudflare Worker)
//
// This little file is what keeps your Anthropic API key private. Your chatbot
// (on your website) sends questions here; this proxy adds your key and talks to
// the AI, then sends the answer back. Your key lives only in this Worker's
// private settings — never in the chatbot file your website visitors can see.
//
// SETUP — about 5 minutes, free:
//   1. Get a free Anthropic API key at https://console.anthropic.com
//        (sign up -> "API Keys" -> "Create Key" -> copy the sk-ant-... value)
//   2. Make a free account at https://dash.cloudflare.com
//   3. Workers & Pages -> Create -> Worker -> paste in this WHOLE file -> Deploy
//   4. Open the Worker -> Settings -> Variables and Secrets, then add:
//        ANTHROPIC_API_KEY  = your sk-ant-... key   (mark it as a Secret)
//        ALLOWED_ORIGIN     = your website address, e.g. https://your-name.github.io
//                             (optional but recommended — limits who can use this proxy)
//   5. Copy the Worker URL (looks like https://your-bot.your-name.workers.dev)
//   6. Paste that URL into the "Your backend URL" box on DIYchatbots and
//      download your chatbot again.

const MODEL = "claude-sonnet-4-6"; // current model name; check Anthropic docs if this ever errors
const MAX_TOKENS = 600;

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Use POST" }, 405, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: "Backend is missing ANTHROPIC_API_KEY" }, 500, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Invalid request" }, 400, cors); }

    const system = (body.system || "").toString();
    const message = (body.message || "").toString();
    if (!message) return json({ error: "No message provided" }, 400, cors);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: system,
          messages: [{ role: "user", content: message }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return json({ error: (data.error && data.error.message) || "AI service error" }, res.status, cors);
      }
      const reply = (data.content && data.content[0] && data.content[0].text) || "";
      return json({ reply }, 200, cors);
    } catch (e) {
      return json({ error: "Could not reach the AI service" }, 502, cors);
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
