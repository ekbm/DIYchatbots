// counter-worker.js — download counter backend for diychatbots.com (Cloudflare Worker)
//
// This is Moses's OWN backend for the site itself — not something end users
// deploy. It tracks how many times each template's "Download Free" button
// has actually been used, using Cloudflare KV as a tiny free database.
//
// SETUP — about 10 minutes, free:
//   1. In your Cloudflare account: Workers & Pages -> KV -> Create a namespace
//      called DOWNLOAD_COUNTS.
//   2. Workers & Pages -> Create -> Worker -> paste in this WHOLE file -> Deploy.
//   3. Open the Worker -> Bindings -> Add binding -> KV namespace.
//        Variable name: DOWNLOAD_COUNTS   (must match exactly, case-sensitive)
//        KV namespace:  the one you created in step 1 (its own name doesn't matter)
//      IMPORTANT: after adding the binding, go back to the code editor and make a
//      trivial change (add/remove a blank line) so "Deploy" lights up, then click
//      Deploy again. Adding a binding alone does not update the already-deployed
//      version — you'll get "TypeError: Cannot read properties of undefined
//      (reading 'get')" on /counts until you redeploy after the binding exists.
//   4. Open the Worker -> Settings -> Variables and Secrets, and add:
//        ALLOWED_ORIGIN = https://diychatbots.com
//                         (recommended — stops other sites from spamming your counts)
//   5. Copy the Worker URL. It looks like https://your-name.workers.dev
//   6. Paste that URL into COUNTER_BACKEND near the top of index.html's <script>.
//
// API:
//   GET /counts        -> {"it":12,"hr":3,...}           (read all counts, no increment)
//   GET /hit?id=it      -> {"id":"it","count":13}         (increment one template by 1)
//
// Template ids must match the ones used in index.html's templateMeta/DEMO_TEMPLATES:
// it, hr, retail, edu, health, legal, hotel, finance, sales, docs, restaurant, shop

const VALID_IDS = new Set([
  "it", "hr", "retail", "edu", "health", "legal", "hotel",
  "finance", "sales", "docs", "restaurant", "shop",
]);

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return json({ error: "Use GET" }, 405, cors);

    const url = new URL(request.url);

    if (url.pathname === "/counts") {
      const out = {};
      for (const id of VALID_IDS) {
        const val = await env.DOWNLOAD_COUNTS.get(id);
        out[id] = val ? parseInt(val, 10) : 0;
      }
      return json(out, 200, cors);
    }

    if (url.pathname === "/hit") {
      const id = url.searchParams.get("id");
      if (!id || !VALID_IDS.has(id)) return json({ error: "Unknown template id" }, 400, cors);
      const current = await env.DOWNLOAD_COUNTS.get(id);
      const next = (current ? parseInt(current, 10) : 0) + 1;
      await env.DOWNLOAD_COUNTS.put(id, String(next));
      return json({ id, count: next }, 200, cors);
    }

    return json({ error: "Not found" }, 404, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
