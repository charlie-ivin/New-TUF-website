# Thumbs Up Friday — website + editor

This is a plain static website (no build step) with a Sveltia CMS editor
built in. Content lives in the `content/*.json` files; editing them through
the CMS at `/admin` just commits changes straight to GitHub, and the live
site picks them up automatically because the pages fetch the JSON at
runtime.

## File map

- `index.html`, `timetable.html`, `apply.html`, `timeline.html` — the pages
- `assets/style.css` — all styling
- `assets/site.js` — builds the external nav buttons + footer from `content/site.json`
- `content/*.json` — the actual editable text (this is what Sveltia CMS edits)
- `admin/index.html`, `admin/config.yml` — the CMS

## 1. Create the GitHub repo

1. Go to github.com and create a new repository (public or private both work).
2. Upload every file in this folder to it, keeping the same folder structure.

## 2. Point the CMS at your repo

Open `admin/config.yml` and change:

```yaml
backend:
  name: github
  repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
  branch: main
```

to your actual `username/repo-name`. Commit that change.

## 3. Host the site

Easiest option — GitHub Pages, free:

1. In your repo, go to **Settings → Pages**.
2. Under "Source", choose the `main` branch and `/ (root)` folder.
3. Save. GitHub will give you a URL like
   `https://yourusername.github.io/your-repo-name/`.

(Netlify or Vercel work too if you'd rather use one of those — just connect
the repo and deploy with no build command, since there isn't one.)

## 4. Set up login for the CMS

The CMS needs a way to prove you're allowed to edit the repo. Two options:

**Quickest (good for one or two editors):**
Visit `https://yourdomain.com/admin`, click **Sign In with Token**, and
follow the link it gives you to generate a GitHub personal access token
with repo permissions. Paste the token in. Done — no extra setup.

**One-click "Login with GitHub" (better if several people will edit it):**
Deploy Sveltia's free OAuth helper on Cloudflare Workers:
1. Follow the steps at https://github.com/sveltia/sveltia-cms-auth
2. Register a GitHub OAuth App (github.com/settings/developers) using the
   Worker URL you get from step 1.
3. Add `base_url: https://your-worker-url` to the top of `admin/config.yml`.

## 5. Edit content

Go to `https://yourdomain.com/admin`, sign in, and you'll see five
sections: Site Settings, Home Page, Timetable Page, Apply to Join Page,
and Timeline Page. Every heading, paragraph, card, quote, and the calendar
embed URL is editable there — no code required. Publishing a change commits
it to GitHub, and the live site updates within a minute or two.

## Notes

- Internal nav links (Home / Timetable / Apply to Join / Timeline) are now
  plain relative links — no more `target="_blank"` workaround needed, since
  the site isn't embedded in a Google Sites iframe anymore.
- External links (TUF Register, Give Us Feedback, Bakers Info Hub) still
  open in a new tab, and are editable from **Site Settings** in the CMS.
- The Google Calendar embed URL is editable from **Timetable Page** in the
  CMS if you ever change calendars.
