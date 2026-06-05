# Old Siam — Hertford

A single-page, scroll-driven, cinematic site for **Old Siam**, Hertford's
authentic Thai restaurant. Plain HTML, CSS and vanilla JS — no frameworks,
no build step.

## Run it
Just open **`index.html`** in a browser. That's it.

## Deploy
- **GitHub Pages:** push this folder to a repo → Settings → Pages → deploy from
  branch (root). Done.
- **Netlify:** drag the folder onto the Netlify dashboard, or connect the repo.
  No build command, publish directory = root.

## Files
| File              | Purpose                                              |
|-------------------|------------------------------------------------------|
| `index.html`      | Page structure & all copy                            |
| `styles.css`      | Dark aubergine/gold art direction + responsive rules |
| `script.js`       | IntersectionObserver reveals + one rAF parallax loop |
| `images/`         | All photography (see `images/README.md` for slots)   |

## Tuning the motion (all in `script.js`, well-commented)
- **Parallax strength** — the `data-speed="…"` attribute on elements in
  `index.html`. Higher = more drift; negative = opposite direction.
- **Mobile damping** — `MOBILE_DAMP` constant.
- **Reveal timing** — `threshold` / `rootMargin` on `revealObserver`.
- **Count-up speed** — `COUNT_MS` constant.

## Accessibility / performance
- Honours `prefers-reduced-motion` (heavy motion off, gentle fades only).
- Below-the-fold images are `loading="lazy"`; the hero is eager + high priority.
- All `<img>` have width/height so nothing shifts as the page loads.
- One passive scroll listener; all layout work batched in a single
  `requestAnimationFrame` tick.

## Real details baked in
6 Parliament Square, Hertford SG14 1EY · 01992 559 999 ·
Lunch 12:00–14:30 · Dinner 18:00–23:00 · 4.6★ (636 Google reviews).
