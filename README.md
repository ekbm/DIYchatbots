# DIYChatbots 🤖

**A free AI chatbot generator for small businesses — no code, no signup, self-hosted forever.**

DIYChatbots lets a small business owner with zero technical background pick an industry template, customise it with their own branding and knowledge base, and deploy a working AI assistant to their website. No subscription, no message limits, no account with DIYChatbots at all — the generated chatbot is a self-contained file the business owns and hosts themselves.

🌐 **Live at [diychatbots.com](https://diychatbots.com) — free, no account needed**

---

## The problem DIYChatbots solves

You run a small business and keep hearing you should "have an AI chatbot" — but:

- Every AI chatbot tool you've found wants $35–150/month before you can even try it
- You don't have a developer, and "no-code" platforms still assume you're comfortable with a SaaS dashboard
- You have no idea what an API key is, let alone how to keep one private
- You're not sure what happens to your customers' conversations, or what the AI is even allowed to say

DIYChatbots is built for exactly this: zero cost to try, zero technical background required, and plain-English guidance the whole way — including on the trust and liability questions most tools never mention. See [AI Employee Terms & Guidelines](https://diychatbots.com/ai-employee-terms.html) for that part.

---

## What DIYChatbots gives you

**12 industry templates** — IT Support, HR, Retail & E-commerce, Education, Healthcare, Legal & Compliance, Hospitality, Finance & Banking, Sales & Product Info, Documentation (manual/document Q&A), Restaurants & Cafés, and Small Shops & Boutiques — each with a pre-built persona, quick-actions, and a live demo you can try before downloading anything.

**A live builder** — customise company name, bot name, avatar, brand colour, tone, welcome message, and knowledge base, with the chat preview updating as you type.

**Knowledge base ingestion** — paste FAQs, upload documents, or reference URLs so the AI answers from your actual business content instead of guessing.

**A private backend, kept simple** — the generated chatbot never contains your API key. Instead you deploy a small Cloudflare Worker (`proxy.js`, included in this repo) that holds the key privately and relays requests to Anthropic's Claude API.

**Demo mode** — try the full interface with sample replies before connecting a real AI key, useful for showing stakeholders or just kicking the tyres.

**A plain-English setup guide** — downloads alongside your chatbot, covering GitHub account creation, uploading, enabling free hosting, and adding your knowledge base, written for someone doing this for the first time.

---

## How it works

```
Your customer's browser
        │  types a message
        ▼
Your chatbot (a static HTML file you host on GitHub Pages)
        │  sends the message
        ▼
Your backend (a Cloudflare Worker you deploy — proxy.js)
        │  adds your private API key
        ▼
Anthropic's Claude API
        │  generates a reply
        ▼
Back to your customer
```

Nothing passes through DIYChatbots at any point — there's no DIYChatbots server in this chain. You control your own hosting, your own backend, and your own API key end to end.

---

## Quick start (for site visitors)

1. Go to [diychatbots.com](https://diychatbots.com)
2. Pick a template, customise it, click **Download Free**
3. Follow the setup guide that downloads with it — GitHub Pages hosting and the Cloudflare Worker backend both take about 15–20 minutes total, first time through

No local setup, no cloning this repo, required for that path.

## Running the generator locally (for contributors / forks)

DIYChatbots' generator is a single static HTML file — no build step, no dependencies.

```bash
git clone https://github.com/ekbm/DIYchatbots
cd DIYchatbots
python -m http.server 8000
```

Then open **http://localhost:8000/index.html** in your browser.

`proxy.js` is the Cloudflare Worker template deployed by end users, not run locally — see [SETUP-GUIDE.md](SETUP-GUIDE.md) for how it's used.

---

## Why open source?

The whole pitch of DIYChatbots is trust: a small business owner is being asked to deploy something that holds their API key and talks to their customers. Being able to read `proxy.js` yourself — or have a more technical friend read it — before trusting it is the most honest thing a tool like this can offer.

---

## Contributing

Found a bug, or a template idea for an industry that isn't covered yet? Use the [Contact & Feedback page](https://diychatbots.com/contact.html) — it goes straight to the person building this, no ticket system in between. Pull requests are welcome too.

---

## Licence

**Chatbots you generate and download:** unrestricted, free for any use, including commercial — see [LICENSE.md](LICENSE.md).

**This repository (the generator tool itself):** free for personal, educational, or open-source use. A commercial licence is required to embed, white-label, or resell the generator as a competing product.

📧 Commercial licence enquiries: via the [Contact & Feedback page](https://diychatbots.com/contact.html)

---

## Forking & Reuse

You're welcome to explore and fork this code for personal or open-source use — see [LICENSE.md](LICENSE.md) for exactly what that covers.

If you're planning something commercial, please reach out first via the [Contact & Feedback page](https://diychatbots.com/contact.html) rather than assuming — it's a quick conversation and avoids a licence dispute later.
