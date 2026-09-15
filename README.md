# The Ledger — Poker Session Tracker

A small, self-contained web app for tracking poker sessions: results by
month, a bankroll chart, a breakdown by game/location, and a log where you
can add new sessions and jot notes on what to improve.

No build step, no dependencies to install — it's plain HTML, CSS, and
JavaScript, plus two CDN-loaded libraries (Chart.js for the graphs, and a
Google Font).

## Files

```
poker-ledger/
├── index.html    the page shell (loads styles.css and app.js)
├── styles.css    all styling
├── app.js        app logic, including your starting session data
└── README.md     this file
```

## Running it locally

Just open `index.html` in a browser — double-click it, or drag it into a
browser window. No server required.

## Putting it on the web (so your phone can reach it too)

Opening the file locally only works on that one computer. To get a real
web address:

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag the whole `poker-ledger` folder (not just one file) onto the page.
3. Netlify gives you a live URL like `random-name-123.netlify.app` —
   open that on your phone and bookmark it, or add it to your home screen.
4. To keep the same URL for future updates (instead of getting a new
   random one each time), sign up for a free Netlify account first and
   claim the site — then you can redeploy to the same address.

Other free options that work the same way with a folder: **Vercel**,
**Cloudflare Pages**, or **GitHub Pages** (if you're comfortable with git).

## How your data is stored

Your sessions are saved in the browser's local storage — on whichever
device and browser you're using. This means:

- Adding a session on your phone won't show up on your laptop, and vice
  versa, unless you're using the exact same browser on the exact same
  device.
- Clearing your browser's site data/history for this page will erase your
  saved sessions (it'll fall back to reload the starting data baked into
  `app.js`).
- There's no server, account, or sign-in — everything lives in your
  browser only.

If you want true cross-device sync (add on your phone, see it instantly
on your laptop), that needs a real backend/database — a bigger step up
from this static version. Worth doing if this sticks as a habit.

## Updating the starting data

The starting sessions are the `SEED_SESSIONS` array near the top of
`app.js`. It only gets used the very first time the app loads with no
saved data yet — after that, your browser's local storage is the source
of truth. If you ever want to reset back to the original spreadsheet
data, clear the site's local storage in your browser's dev tools and
reload.
