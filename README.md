# Jomin & Malu Expense Diary

A 4-page expense tracker (Dashboard, Budgets, Transactions, Insights) that saves
your entries to a free Supabase database, ready to host free on GitHub Pages.

## 1. Create your database (Supabase — free)

1. Go to **https://supabase.com** → sign up → **New project** (pick any name/password/region, free tier).
2. Wait ~2 minutes for it to spin up.
3. Left sidebar → **SQL Editor** → **New query** → paste the contents of `supabase-setup.sql` → **Run**.
   This creates the `transactions` and `budgets` tables.
4. Left sidebar → **Project Settings** → **API**. Copy:
   - **Project URL**
   - **anon public** key
5. Open `js/config.js` in this folder and paste them in:
   ```js
   window.SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   window.SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
6. Save the file.

That's it for the database — no backend server to run. The pages talk to Supabase directly.

> **Note on privacy:** this app has no login screen. Anyone who has your site's
> link can view and add entries (that's what makes it work with zero setup).
> Don't share the link publicly. If you'd like a login screen later, Supabase
> supports free email/password auth and I can wire that in.

## 2. Try it locally first (optional)

Just double-click `index.html` to open it in a browser, or serve the folder with
any static file server. Add a test entry and refresh — if it's still there, the
database connection works.

## 3. Host it free on GitHub Pages

1. Create a new **public** GitHub repository (e.g. `expense-diary`).
2. Upload all the files in this folder (`index.html`, `budgets.html`,
   `transactions.html`, `insights.html`, the `css/` and `js/` folders,
   `supabase-setup.sql`, this `README.md`) — either via the GitHub web UI
   ("Add file" → "Upload files") or with git:
   ```bash
   git init
   git add .
   git commit -m "Expense diary"
   git branch -M main
   git remote add origin https://github.com/<your-username>/expense-diary.git
   git push -u origin main
   ```
3. In the repo: **Settings** → **Pages** → under "Build and deployment",
   set **Source** to "Deploy from a branch", **Branch** to `main` / `(root)` → **Save**.
4. Wait a minute, then your site is live at:
   `https://<your-username>.github.io/expense-diary/`

Both of you can bookmark that link (or add it to your phone's home screen —
open it in the browser, then "Add to Home Screen") and it'll behave like an app.

## Files

- `index.html` — Dashboard (stats, charts, budget snapshot, recent entries)
- `budgets.html` — Full budget list + editor
- `transactions.html` — Full entry list, add/edit/delete
- `insights.html` — Auto-generated notes + saving tips
- `css/style.css` — Shared styling
- `js/config.js` — Your Supabase keys (edit this)
- `js/app.js` — Shared logic: data layer, navigation, charts, modals
- `supabase-setup.sql` — Run once in Supabase to create the tables
