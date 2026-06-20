# Setting up your DIYchatbots chatbot

This guide takes you from nothing to a live AI chatbot on your own website, with your API key kept private. It takes about 15 minutes and is free.

You'll do it in two halves:
- **A. Set up your backend** — a tiny free service that holds your AI key safely.
- **B. Put your chatbot on GitHub Pages** — free hosting for the chatbot page itself.

The golden rule: your API key only ever goes into the backend (part A). It never goes into the chatbot file. A web page is public, so anything inside it can be read by visitors — that's why the key lives somewhere private instead.

---

## A. Set up your backend (holds your key)

1. Get a free Anthropic API key: go to console.anthropic.com, sign up, open "API Keys", click "Create Key", and copy the key (it starts with `sk-ant-`). Keep it private.
2. Create a free account at dash.cloudflare.com.
3. Go to Workers & Pages → Create → Worker. Paste in the entire contents of the `proxy.js` file, then click Deploy.
4. Open the Worker → Settings → Variables and Secrets, and add:
   - `ANTHROPIC_API_KEY` = your `sk-ant-` key (mark it as a Secret).
   - `ALLOWED_ORIGIN` = your website address, e.g. `https://your-name.github.io` (optional, but recommended — it limits who can use your backend).
5. Copy the Worker's URL. It looks like `https://your-bot.your-name.workers.dev`.

You now have a private backend. Nothing public can see your key.

---

## B. Put your chatbot on GitHub Pages

### 1. Generate the chatbot
On DIYchatbots, fill in your bot's details, paste your backend URL into the "Your backend URL" box, and download. You'll get an HTML file (and this guide).

### 2. Create a GitHub account
If you don't have one, sign up free at github.com.

### 3. Create a repository
A repository is just a folder on GitHub for your file.
1. Click the "+" in the top-right → "New repository".
2. Give it a name (e.g. `my-chatbot`).
3. Set visibility to **Public** — required for free GitHub Pages.
4. Tick "Add a README file", then click "Create repository".

### 4. Upload your chatbot file
1. In the repository, click "Add file" → "Upload files".
2. Drag in the chatbot HTML file you downloaded.
3. **Rename it to exactly `index.html`** (all lowercase). This is the most common mistake — GitHub Pages looks for that exact name.
4. Click "Commit changes".

### 5. Turn on GitHub Pages
1. In the repository, click the "Settings" tab.
2. In the left sidebar, click "Pages".
3. Under "Source", choose "Deploy from a branch".
4. Set the branch to `main` and the folder to `/ (root)`, then click "Save".
5. Wait 1–2 minutes and refresh. A green bar shows your live URL, like `https://your-name.github.io/my-chatbot/`.

Open that URL — your chatbot is live. Because you set the backend URL, it answers with real AI; with no key anywhere in the page.

---

## C. Add it to your existing website (optional)

If you already have a website, you can drop the chatbot onto a page with this snippet (replace the address with your live URL):

```html
<iframe src="https://your-name.github.io/my-chatbot/" width="100%" height="700" style="border:0;"></iframe>
```

---

## Quick checks if something's wrong

- **Page shows 404:** the file isn't named exactly `index.html`, or Pages hasn't finished — wait a couple of minutes and refresh.
- **Chatbot replies with sample/demo text:** you didn't paste a backend URL when generating — re-generate with the URL filled in.
- **Chatbot shows an error instead of answering:** check the backend URL is correct, and that the `ANTHROPIC_API_KEY` secret is set in the Worker.
- **To test without AI at all:** leave the backend URL blank when generating — the chatbot runs in demo mode with sample replies.
