# checksubscriptions.app

Free, in-browser tool that scans bank/credit card statement text and finds recurring subscriptions.

---

## First-time setup

You need three things installed on your computer. If you already have them, skip ahead.

### 1. Install Node.js

Download from <https://nodejs.org/> — pick the **LTS** version (the green button on the left). Run the installer with default options.

To check it worked, open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
node --version
```

You should see something like `v20.x.x`.

### 2. Install Git

Mac: Git is usually pre-installed. Run `git --version` in Terminal. If you see a version number, you're set. If it prompts you to install developer tools, accept.

Windows: Download from <https://git-scm.com/download/win> and install with default options.

### 3. Sign up for GitHub

Go to <https://github.com> and create a free account if you don't have one. You'll need this to push your code so Cloudflare Pages can build it.

---

## Run the site locally

Open Terminal / Command Prompt, navigate to this folder, then:

```bash
npm install
npm run dev
```

The terminal will print something like `Local: http://localhost:5173/` — open that URL in your browser. You should see the site running.

To stop the dev server, press `Ctrl + C` in the terminal.

---

## Deploy to Cloudflare Pages

Since you bought your domain from Cloudflare, deployment is essentially one wizard.

### Step 1: Push the code to GitHub

In Terminal, from this project folder:

```bash
git init
git add .
git commit -m "Initial commit"
```

Then go to <https://github.com/new>:

1. Repository name: `checksubscription` (or anything you want)
2. Keep it **Public** or **Private** — your choice; Cloudflare can read both
3. Do NOT check "Add a README" (you already have one)
4. Click **Create repository**

GitHub will show a page with commands. Copy the two lines that start with `git remote add origin` and `git push`, paste them into your Terminal, and run them.

### Step 2: Connect Cloudflare Pages to GitHub

1. Go to <https://dash.cloudflare.com>
2. In the left sidebar, click **Workers & Pages**
3. Click **Create** → **Pages** tab → **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Pick the repository you just created

### Step 3: Configure the build

Cloudflare will ask for build settings. Use:

| Setting | Value |
|---|---|
| Framework preset | **Vite** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (leave empty) |

Click **Save and Deploy**. Cloudflare will install dependencies and build the site. Takes about 90 seconds. When it's done, you'll see a URL like `checksubscription-abc.pages.dev` — visit it to confirm the site works.

### Step 4: Connect your custom domain

1. In your Pages project, click **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `checksubscriptions.app`
4. Cloudflare detects the domain is in your account and configures DNS automatically
5. Repeat with `www.checksubscriptions.app` so both work

Wait 1-5 minutes for SSL to provision. After that, <https://checksubscriptions.app/> will be live.

---

## Setting up email at your domain

You wanted `hello@checksubscriptions.app` or similar to forward to your Gmail. Cloudflare offers free **Email Routing**:

1. In Cloudflare dashboard, select your domain (`checksubscriptions.app`)
2. Click **Email** in the left sidebar → **Email Routing**
3. Click **Get started** / **Enable**
4. Cloudflare adds the required MX/TXT/SPF DNS records automatically — accept
5. Under **Routes** → **Custom address**, click **Create address**
6. Address: `hello` (so `hello@checksubscriptions.app`)
7. Action: **Send to an email** → `misbau1975coding@gmail.com`
8. Cloudflare sends a verification email to your Gmail. Click the link to verify.

Now any email sent to `hello@checksubscriptions.app` arrives in your Gmail inbox. You can also create `support@`, `legal@`, etc., all forwarding to the same Gmail.

Once that's working, update the legal pages to use this address instead of your personal Gmail. Two find-and-replace edits in `src/SubscriptionLeakDetector.jsx`:

```
misbau1975coding@gmail.com  →  hello@checksubscriptions.app
```

(Two occurrences — one in PrivacyPage, one in TermsPage.)

Then `git add .`, `git commit -m "Use domain email"`, `git push`. Cloudflare will auto-rebuild and redeploy.

---

## Future updates

Whenever you change the code:

```bash
git add .
git commit -m "what you changed"
git push
```

Cloudflare Pages picks up the push, builds, and deploys automatically. Usually live within 2 minutes.

---

## What's next after launch

1. **Verify the site works end-to-end** — paste a statement, upload a PDF, click both legal links, send an email to `hello@checksubscriptions.app`
2. **Set up Google Search Console** — <https://search.google.com/search-console> — verify ownership and submit `https://checksubscriptions.app/sitemap.xml`
3. **Set up analytics** — Cloudflare Web Analytics is free and built into the dashboard. Or pay for Plausible if you want better dashboards.
4. **Apply to Google AdSense** — wait until you have ~10-20 daily visits, then apply at <https://adsense.google.com>
5. **Share** — Reddit (r/personalfinance, region-specific finance subs), Hacker News (Show HN), Twitter/X
