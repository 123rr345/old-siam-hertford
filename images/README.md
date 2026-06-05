# Old Siam — image slots

Every image on the site lives in this folder. The current files were **cropped
automatically from the screenshots you supplied** (the Google photo viewer
shots). They're good for launch, but to hit the full "£20k" finish you'll want
to drop in clean, high-resolution originals using the **exact same filenames**
below — nothing else needs to change.

> Target size: **~1600 px on the long edge**, JPG, quality ~85.
> Keep the filename identical and the new photo simply takes over its slot.

| File                   | Where it appears                         | Ideal real photo to use                                  |
|------------------------|------------------------------------------|----------------------------------------------------------|
| `hero-relief.jpg`      | **Hero** (full screen) + The Room        | The carved temple relief / teak interior wall            |
| `masaman.jpg`          | Dish 01 · Masaman + The Room             | A tight close-up of the Masaman chicken curry bowl       |
| `starter-platter.jpg`  | Dish 02 · Mixed Starter Platter          | The mixed starter platter, shot from above               |
| `sizzling-beef.mp4`    | **Dish 03 · Sizzling Beef (VIDEO)**      | The clip of the beef arriving/sizzling on the iron plate |
| `beef-poster.jpg`      | Poster frame for the beef video          | A sharp still of the sizzling beef (shows while it loads)|
| `greencurry.jpg`       | Dish 04 · Thai Green Curry + The Room    | A close-up of the green curry bowl                       |
| `tomyum.jpg`           | Dish 05 · Tom Yum Soup                   | The Tom Yum bowl (the prawn/mushroom soup)               |
| `noodles.jpg`          | Dish 06 · Drunken Noodles                | The wok-fried wide rice noodles                          |
| `table-spread.jpg`     | The Room gallery                         | A full table of dishes on the teak table                 |
| `interior-sunken.jpg`  | The Room gallery                         | The sunken-table dining room with the gold statue        |
| `dessert.jpg`          | The Room gallery                         | A plated dessert (deep-fried ice cream + strawberries)   |
| `shopfront-night.jpg`  | The Room + **closing full-bleed**        | The shopfront glowing at night                           |
| `shopfront-day.jpg`    | The Room gallery                         | The shopfront on Parliament Square by day                |

> **The beef section is now a looping video** (`sizzling-beef.mp4`), not a photo.
> It autoplays muted and loops. `beef.jpg` (the old blurry still) is no longer
> used — keep it or delete it. To change the clip, just replace the `.mp4`
> (and ideally update `beef-poster.jpg` to a matching still).

## Optional 7th dish — Pad Thai
The build ships **six** dish sections (all with real photos). To add Pad Thai:

1. Save a Pad Thai photo here as **`padthai.jpg`** (~1600 px long edge).
2. In `index.html`, copy any `<article class="dish"> … </article>` block,
   point its `<img src>` at `images/padthai.jpg`, change the name/copy,
   set the index to `07`, and add `class="dish--right"` to alternate the side.
   (There's a comment in `index.html` marking exactly where.)

## Swapping notes
- Aspect ratios are handled by CSS (`object-fit: cover`), so photos of any
  shape will fill their frame cleanly — just mind the focal point.
- The original full-resolution screenshots remain in the project root
  (`Screenshot 2026-06-04 …png`) if you want to re-crop differently.
