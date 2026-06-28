# Deploying to Cloudflare Pages

The wedding page is a single static file (`ElishaGraceWedding.html`). The YouTube
live link and the Google Maps location are **environment variables**, injected at
request time by the Pages Function in `functions/_middleware.js`.

If an env variable is not set, its button is automatically **disabled**:
- No `YT_LIVE_LINK`  → the **Watch on YouTube** button is greyed out / not clickable.
- No `MAPS_URL`      → the **Open in Google Maps** button and the **QR** are disabled
  (QR shows "Location coming soon").

The QR image is generated **from `MAPS_URL`** (via api.qrserver.com), so scanning it
always opens the same location as the button — no separate QR file to manage.

## Environment variables

| Variable          | Required | Example                                                        |
|-------------------|----------|----------------------------------------------------------------|
| `MAPS_URL`        | yes      | `https://www.google.com/maps/place/St.+Stephen's+Parish+Hall/...` |
| `YT_LIVE_LINK`    | yes      | `https://www.youtube.com/watch?v=XXXXXXXXXXX`                   |
| `YT_EMBED_INLINE` | optional | `true` to play inside the box (your own stream with embedding ON), else `false`/unset for poster mode |
| `RSVP_URL`        | yes      | Google Apps Script web-app URL (ends in `/exec`) — see `rsvp-google-apps-script.gs` |

If `RSVP_URL` is not set, the RSVP submit button is disabled ("RSVP opening soon").
RSVP responses land in your Google Sheet (one row per guest).

## Option A — Deploy from Git (recommended)

1. Push this folder to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings: **Framework preset = None**, Build command = *(empty)*,
   Build output directory = `/` (root).
4. After the first deploy: **Settings → Environment variables** → add `MAPS_URL`,
   `YT_LIVE_LINK`, (and `YT_EMBED_INLINE` if needed) → **Save** → **Retry deployment**.

## Option B — Direct upload with Wrangler

```bash
npm i -g wrangler
wrangler login
# from this folder:
wrangler pages deploy . --project-name elisha-grace-wedding
# then set the variables:
wrangler pages secret put MAPS_URL --project-name elisha-grace-wedding
wrangler pages secret put YT_LIVE_LINK --project-name elisha-grace-wedding
# (or set them in the dashboard under Settings → Environment variables)
```

## Notes
- `_redirects` makes the root URL (`/`) serve `ElishaGraceWedding.html`, so guests
  can use the bare `*.pages.dev` link.
- Opening the file locally (`file://`) shows both buttons **disabled** — that is
  expected, because there is no env there. Use the deployed URL to see them live.
