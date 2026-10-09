# URHOM — Polish Backlog

Recorded during the build-out of Sections 1–7. **Nothing here is to be fixed
until all seven sections are assembled**, at which point we do one professional
polish pass across the whole page.

Last updated: after the global readability / alignment / SEO QA pass.
That pass fixed the items struck through below. Everything still unchecked is
visual fine-tuning that was deliberately **not** touched, because the supplied
reference images remain the visual source of truth and this was a QA pass, not
a redesign.

---

## Global

- [ ] Final typography / font matching pass. The reference font draws `g` and `y`
      with hooked, curling descenders; Figtree draws them straight. ~45 free
      families tested without a match — likely Gilroy or a close commercial
      relative. Needs the original font file.
- [x] ~~Final spacing / alignment pass across all sections (left gutters differ
      per section).~~ Resolved — the five ad-hoc gutters (`4.2 / 6.37 / 6.8 /
      8.6 / 8.74vw`) collapsed into three tokens in `base.css`:
      `--gutter` 11.78vw (hero, per the reference), `--gutter-rail` 6.37vw
      (S2 + S4, the copy-column + card-rail family) and `--gutter-wide` 8.68vw
      (S3 + S5 + S6, the full-bleed photo family). Still open below: the footer
      sits on its own 7vw inner padding, and the S5 card band starts at 4.2vw
      while its copy starts at 8.68vw — both look deliberate against the
      references, so they were left alone. Confirm against the artboards.
- [ ] Final responsive / mobile pass.
- [ ] Final section-to-section transition choreography.
- [ ] Final Lenis / smooth-scroll tuning.
- [ ] Final animation timing / easing consistency.
- [ ] Final performance + image-loading optimisation (sizes/srcset, LQIP, decode).
- [x] ~~Final browser / console QA.~~ Console is clean (no errors, no failed
      requests) at 1600/1440/1280/1024/768/390.
- [ ] Still open from the QA pass: `#projects` (the four project cards),
      `#instagram`, `#facebook`, `#youtube`, `#linkedin`, `#blogs`, `#careers`,
      `#privacy`, `#terms`, `#sitemap` are inert placeholders — no real
      destinations were supplied. Everything else in the nav now resolves.
- [ ] `<link rel="canonical">`, the `og:url`/`og:image` absolute URLs and the
      JSON-LD `url`/`logo` all use `https://urhom.in/`, inferred from the
      `hello@urhom.in` address on the page. Confirm the real production domain.
- [ ] `og:image` currently points at `assets/hero.jpg` (1774x887). Produce a
      purpose-made 1200x630 share image.
- [ ] JSON-LD is `Organization` with only what the site actually states (name,
      description, email, city/region). Still missing, left as TODO rather than
      invented: street address, postal code, a verified telephone, and `sameAs`
      social URLs. The `+91 98765 43210` on the page looks like placeholder
      digits, so it was deliberately kept out of the structured data.
- [x] ~~Section rail still lists 01–05 while the page runs to 07.~~ Resolved —
      the rail now runs 01–07, matching the Section 4 and 6 references. Item 07
      stays inert until Section 7 exists.

## Section 1 — Hero

- [ ] Replace the reconstructed hero image with the original clean photograph
      when available. Current `assets/hero.jpg` was recovered from the reference
      screenshot (headline, scroll cue and nav pill painted out) and is soft at
      4K.
- [ ] Refine hero image positioning.
- [ ] Refine heading weight / typography.
- [ ] Recheck hero content vertical positioning.
- [x] ~~Recheck left-side scrim / image readability.~~ Resolved — the hero had
      no desktop scrim at all, so the lede measured 2.19:1. It now has a
      left-weighted scrim (a soft pool under the lede plus a gentle horizontal
      wash, peak alpha .30) and the lede/eyebrow use the on-photo inks. Measured
      left-third brightness +12.9, right-third +0.3 — the room, sofa and timber
      are untouched.
- [x] ~~Recheck section rail and scroll-indicator alignment.~~ The rail numbers
      (2.60:1) and the SCROLL label (2.48:1) were the worst contrast on the
      page. Both now use the on-photo inks and the fixed rail carries a soft
      travelling veil, since it crosses sky, foliage and dark timber.

## Section 2 — Collections

- [ ] Fine-tune left content vs. card horizontal balance.
- [ ] Fine-tune card dimensions and spacing.
- [ ] Recheck card bottom spacing / gradient.
- [ ] Recheck typography weight and spacing.
- [ ] Recheck background "02" ghost numeral positioning.

## Section 3 — Why URHOM

- [ ] Fine-tune left content positioning.
- [ ] Give the four benefit columns slightly more breathing room.
- [x] ~~Improve benefit-description readability over the photograph — the fourth
      column ("End-to-End Support") sits on the busiest part of the image.~~
      Resolved. Columns 3 and 4 measured 2.81:1 and 3.47:1; they now measure
      5.53:1 and 6.83:1. The desktop scrim was left exactly as it was — the fix
      is purely the on-photo ink, so section 3's photograph is pixel-identical
      to before. Only the tablet (<=1180) scrim was strengthened, because the
      grid goes two-up there and the right column clears the old gradient.
- [ ] Recheck statistics panel size / position.
- [ ] Recheck overall vertical spacing (content is tuned to just fit 100vh at the
      1774×887 artboard; verify on shorter viewports).
- [x] ~~Ensure the image stays natural without excessive overlay.~~ Verified by
      measurement: sections 3 and 5 are pixel-identical to the original render.

## Section 4 — Real Spaces

- [ ] Final comparison against the supplied reference.
- [ ] Fine-tune card widths / gaps.
- [ ] Fine-tune carousel arrow / progress-indicator positioning.
- [ ] Fine-tune left-content spacing.
- [ ] Final typography alignment.
- [ ] Reference shows a faint photographic backdrop behind the section; currently
      a flat `#FAF8F5`. Needs the original backdrop asset if that look is wanted.

## Section 5 — Our Process

- [ ] Fine-tune card widths and spacing against the reference.
- [ ] Fine-tune the curved white/image card transition (the wave path is a rough
      approximation of the reference's peel).
- [ ] Fine-tune yellow connecting-line positioning — it currently threads behind
      the row at a fixed percentage rather than hitting each card's icon.
- [ ] Fine-tune card icon positioning.
- [ ] Fine-tune heading / description positioning.
- [x] ~~Background needs the real landscape asset.~~ Resolved — the wide room
      shot was supplied and is now in place at its native 1774x887.
- [ ] Section runs slightly taller than 100vh at the artboard size, so the card
      bottoms sit just below the fold. Close the remaining gap.
- [ ] Final responsive / mobile process-card behaviour.
- [ ] Final animation timing and stagger.

## Section 6 — Happy Customers

- [ ] Fine-tune testimonial card widths / gaps against the reference.
- [ ] Fine-tune card image cropping / `object-position`.
- [ ] Fine-tune quote-badge position on the image/copy boundary.
- [ ] Fine-tune testimonial text spacing.
- [ ] Fine-tune customer portrait sizing / position (portraits are supplied as
      landscape crops, so they are centred at `50% 38%` inside the circle).
- [ ] Fine-tune stars and divider alignment.
- [ ] Fine-tune carousel arrow / progress positioning.
- [x] ~~Fine-tune left-content positioning.~~ Partly resolved — the copy column
      sat at `4.2vw`, only ~7px clear of the fixed rail, so the rail numbers
      overlapped the lede. It now uses the shared `--gutter-wide` (8.68vw), the
      same edge as sections 3 and 5. Re-check the column width against the
      reference now that it has moved.
- [ ] Fine-tune background image positioning.
- [ ] Final responsive / mobile testimonial behaviour.
- [ ] Final carousel transition timing.

## Section 7 — Footer

- [ ] Fine-tune footer column widths.
- [ ] Fine-tune footer vertical dividers.
- [ ] Fine-tune logo / social spacing.
- [ ] Fine-tune contact icon alignment.
- [ ] Fine-tune enquiry CTA dimensions.
- [ ] Fine-tune bottom legal bar spacing.
- [ ] Fine-tune background positioning / treatment. No footer background asset
      was supplied, so the reference's soft interior backdrop is currently two
      restrained radial gradients over `#FAF8F5`. Swap in the real photograph if
      that look is wanted.
- [ ] Final mobile footer layout.
- [ ] Final hover states for footer links / social buttons.
- [ ] Final accessibility pass for footer links and controls.
- [ ] The global fixed rail still renders over the footer's left edge. Decide
      whether it hides once the footer is in view.
- [ ] Social links are inert placeholders (`#instagram`, `#facebook`, `#youtube`,
      `#linkedin`) — no real URLs were supplied. Same for `#blogs`, `#careers`,
      `#about`, `#contact`, `#privacy`, `#terms`, `#sitemap`.

## Global final pass

- [ ] Compare all 7 sections against their supplied reference images.
- [ ] Typography consistency.
- [ ] Section spacing.
- [ ] Section-to-section transitions.
- [ ] Global section rail behaviour.
- [ ] Header behaviour.
- [ ] Lenis smooth scrolling.
- [ ] Animation timing / easing.
- [ ] Button consistency.
- [ ] Responsive behaviour.
- [ ] Image loading / performance.
- [ ] Console errors.
- [ ] Accessibility.
- [ ] Broken links / routes.
- [ ] Final visual QA at desktop / tablet / mobile.


---

# Global readability / alignment / SEO QA pass — outcome

Done in one controlled pass. No section was rebuilt, no image replaced, no font
changed, no layout redesigned.

## Verified by measurement, not by eye

Contrast was measured by hiding each text element, screenshotting the pixels
behind it, and computing the WCAG ratio against the element's own computed
colour. Text runs were sampled via `Range.getClientRects()` rather than the
element box — a block-level `<p>` can be 1380px wide while the words occupy
110px, which otherwise averages in background the reader never sees text on.

- **9 genuine AA failures found and fixed** (hero lede 2.19:1, rail numbers
  2.60:1, SCROLL label 2.48:1, benefit descriptions 2.81 / 3.47:1, process lede
  4.41:1, love lede 3.88:1, hero eyebrow 3.68:1, plus a laptop-only one below).
- **One real responsive bug found that was invisible at 1600px**: in the
  1181-1440px range `.benefits{max-width:none}` let the four-column row stretch
  to ~94vw, pushing columns 3 and 4 off the scrim onto the dark half of the
  photo (4.2:1 and 3.4:1). The row is now capped at `min(62vw,860px)`, which
  restores the original `keeps the row on the bright side` intent of the
  desktop `53vw` cap.
- **39 text elements now pass AA** at 1600 / 1440 / 1280 / 1024 / 768 / 390.
- Most of the fix is the new on-photo ink tokens, which cost the photographs
  nothing. Scrims were only strengthened where ink alone was not enough.

## What changed

- `base.css`: `--ink-photo` / `--ink-photo-soft` / `--ink-photo-faint` for copy
  that sits directly on photography, plus the three gutter tokens.
- Exactly one `<h1>`; sections 2-6 use `<h2>`; card, benefit, step and
  testimonial titles use `<h3>`. Footer column titles dropped from `<h2>` to
  `<h3>` (they are not page sections). Eyebrows stay as `<p>`.
- Card bodies moved from `<span>` to `<div>` wrappers — a `<span>` cannot
  legally contain an `<h3>`.
- Carousel buttons no longer strand keyboard focus: disabling the arrow a user
  is standing on used to drop focus to `<body>`, so focus now hands off.
- Head: title, meta description, canonical, Open Graph, Twitter card, JSON-LD.

## Deliberately NOT done

- No font substitution, no image regeneration, no colour-system change, no
  layout redesign, no animation rework — all out of scope for a QA pass.
- Alt text was already descriptive throughout and was left alone. Decorative
  backgrounds correctly keep `alt=""` with `aria-hidden` wrappers; customer
  portraits keep `alt=""` because the name sits next to them.
- Performance was already sound: every image carries width/height, below-fold
  images are lazy, the hero is `fetchpriority="high"` and not lazy, and no
  library is loaded twice. Nothing needed changing.

## Still worth a look

- The section 5 card band starts at `4.2vw` while its copy starts at `8.68vw`,
  and the footer uses its own ~7vw inner padding. Both read as deliberate
  against the references — confirm, then either keep or fold into the tokens.
- Section 6's lede clears AA at 7.15:1 but still sits on the busiest foliage of
  any section. If it reads soft to you on a real display, nudge that scrim.
- The fixed rail still renders over the footer's left edge (pre-existing).


---

# Glass-panel readability pass (hero + Why URHOM)

Reported as still hard to read on a real display, in the hero paragraph and
across the Why URHOM paragraph and four feature cards.

Worth recording **why the earlier pass missed this**: every one of those
elements already measured above WCAG AA. AA is computed against a *mean*
background, and these sit on sunlit foliage where the backdrop churns pixel to
pixel — "Expert Guidance" measured 5.35:1 against a mean of rgb(147,136,112),
which is a pass on paper and still uncomfortable to read. Contrast ratio alone
is not a sufficient test for fine text over photography; backdrop *variance*
matters as much, and the blur on a glass panel addresses that directly in a way
a gradient scrim does not.

Changes, all reusing the existing `.stats` glass recipe:

- `base.css` — the glass surface promoted to tokens (`--glass`, `--glass-soft`,
  `--glass-edge`, `--glass-radius`, `--glass-blur`, `--glass-shadow`) on a warm
  `253,250,245` tint rather than pure white, so it sits inside the #FAF8F5
  family.
- The four benefits now share **one** translucent warm-white panel, not four
  cards. Its `max-width` went 53vw -> 56vw: the old cap existed to keep the row
  "on the bright side" of the photo, which the panel now does by itself, so the
  cap only has to preserve the original column width against the panel padding.
  Line counts per column are back to the original 2/2/3/3.
- The stats panel moved onto the same tokens so the two stacked panels read as
  one family.
- Hero and Why washes rewarmed to the same tint; the hero gained a stronger
  pool under the lede.
- `.why__lede` moved from `--ink-mute` to `--ink-photo`, matching the hero lede.
  The rule across the site is now: copy on photography uses the darker on-photo
  inks, copy on flat white panels (sections 2 and 4) keeps `--ink-mute`.

Worst-case contrast **across scroll positions** (parallax moves the backdrop, so
a single-position reading is not enough): everything in both sections now sits
at 10.2-13.8:1, up from 5.3-6.5:1.

Still open:

- At 981-1180px the content gutter drops to ~61px while the rail is still shown
  until 980px, leaving only ~21px clearance. Nothing overlaps, but it is tight,
  and it affects every photo section, not just this one. The clean fix is to
  hide the rail at 1180px so it retires on the same breakpoint the layout
  switches at — not done here because it changes behaviour site-wide.

---

# Performance pass — scrolling and initial load

Reported as laggy scrolling (worse on the way back up) and slow loading.

## Root causes found

1. **Lenis was running a fixed-duration tween, not smoothing.** Its integrator is
   `if (duration && easing) {tween} else if (lerp) {...}`, and the config set
   `duration:1.05` *and* `lerp:null` — so `lerp` was dead config and every wheel
   tick started a fresh ~0.8s animation. The page trailed the pointer, and on a
   direction change it kept travelling the old way until that tween expired.
   Now `lerp:0.18`, which tracks a live target and reverses on the next frame.
2. **The rAF loop never stopped.** It stepped Lenis and read layout 60x/second
   forever, including on a still page and a hidden tab. It now parks after ~0.5s
   of stillness and wakes on real input.
3. **Images were ~2.7 MB of JPEG.** Converted to WebP (45% smaller, PSNR >= 36 dB,
   visually lossless) with the JPEGs kept as `<picture>` fallback, plus a 900px
   variant of the four full-bleed backgrounds for phones.
4. **reveal.js repainted the whole page at 2.6s.** Its safety net re-added
   `is-revealed` to already-revealed nodes and dropped `will-change` on all 61
   at once, tearing down every composited layer simultaneously. That repaint
   re-reported the hero paragraph as a new LCP candidate. Elements now settle
   individually on their own `transitionend`.
5. **Reduced-motion was forced to `scroll-behavior:smooth`** — the opposite of
   what that user asked for. Now left native.

## Measured (Fast 3G, median of 5)

| | before | after |
|---|---|---|
| load event, desktop | 6054 ms | 3700 ms |
| load event, phone | 4122 ms | 1948 ms |
| transferred, desktop | 1.15 MB | 0.68 MB |
| transferred, phone | 0.77 MB | 0.33 MB |
| wheel tick to 90% travel | 552 ms | 260 ms |
| wheel tick to settle | 802 ms | 460 ms |
| wrong-direction time on reversal | 115 ms | 82 ms |
| style recalcs per 3s idle | 180 | 0 |
| main thread per 3s idle | 0.070 s | 0.002 s |

## Hypotheses that measurement killed — do not "fix" these

- **Parallax read/write interleaving is not layout thrashing.** 200 iterations
  cost 0.9 ms interleaved vs 0.8 ms batched; transforms on composited layers do
  not invalidate layout, so the next `getBoundingClientRect()` is free.
- **The glass panels' `backdrop-filter` has no measurable main-thread cost**
  (3% vs 4% desktop, 13% vs 12% on a 6x-throttled phone). It runs on the
  compositor. GPU cost could not be measured headlessly — unresolved, needs a
  real device.
- **Self-hosting the font made things worse**, consistently (LCP 1.7s -> 3.9s).
  Reverted to Google Fonts.
- **A 1440px hero variant was not worth it.** It saved 66 KB but the existing
  `scale(1.03)` upscaled it, softening the hero (PSNR 30 dB). Dropped; desktop
  gets the full-detail image.

## Remaining / unresolved

- **Phone LCP is ~2.6s and largely unmoved by this work.** It is the hero
  paragraph, and it is gated by the reveal transition finishing, not by bytes.
  Improved from ~3.9s by fix 4 above. Taking it lower means shortening or
  removing the hero entrance animation, which is a design decision, not a
  performance fix — left alone deliberately.
- GPU cost of `backdrop-filter` on low-end phones is untested (see above).
- `python3 -m http.server` is single-threaded and distorts load measurements;
  the numbers above were taken against a threaded keep-alive server.
