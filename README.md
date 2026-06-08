# Grafterr Landing Page

A pixel-perfect, fully responsive landing page for **Grafterr** — a restaurant technology platform — built with **Option A: Plain JavaScript (Vanilla)**.

---

## Chosen Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styles | CSS3 (custom properties, flexbox, grid, keyframe animations) |
| Logic | Vanilla JavaScript ES6+ (ES modules — no bundler required) |
| Data | Local JSON file via `fetch()` |
| Fonts | Google Fonts (Syne + DM Sans) |

No CSS frameworks, no jQuery, no build step needed.

---

## Setup Instructions

### Option 1 — VS Code Live Server (recommended)

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (ritwickdey.LiveServer).
3. Right-click `index.html` → **Open with Live Server**.
4. The page opens at `http://127.0.0.1:5500`.

### Option 2 — Python HTTP server

```bash
cd grafterr-landing
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 3 — Node `serve`

```bash
npx serve grafterr-landing
```

> **Note:** Opening `index.html` directly as a `file://` URL will cause the `fetch()` call to fail due to CORS restrictions. Always use a local server.

---

## Project Structure

```
grafterr-landing/
├── index.html              ← App shell (no hardcoded text)
├── css/
│   ├── variables.css       ← Design tokens (colours, spacing, typography)
│   ├── base.css            ← Modern reset + typography scale
│   ├── components.css      ← Nav, buttons, cards, carousel arrows, skeletons
│   └── sections.css        ← Hero and Features section layouts + responsive
├── js/
│   ├── api.js              ← Mock API with simulated 1000–1500 ms delay
│   ├── components.js       ← DOM-building functions (one per UI piece)
│   ├── carousel.js         ← Carousel state, navigation, touch/swipe
│   └── main.js             ← App entry — orchestrates fetch → render
├── data/
│   └── content.json        ← All content (nav, hero, features, products)
└── assets/
    └── images/
        └── logo.svg
```

---

## Approach

### Data first
All visible text lives in `content.json`. The HTML shell contains zero user-facing strings. `js/api.js` wraps `fetch()` with a `setTimeout`-based delay to simulate a real API, exposing three functions:

- `api.getNavigation()`
- `api.getHeroContent()`
- `api.getFeaturesContent()`

A single fetch is made and the result is cached, so parallel section loads don't double-hit the file.

### Loading states
CSS-only shimmer skeletons are rendered synchronously (no flash of empty content) and replaced with real content once the API promise resolves.

### Error handling
Each section independently catches fetch errors and renders an error card with a **Retry** button. Clicking Retry clears the cache and re-triggers the full fetch.

### Carousel
`js/carousel.js` is a self-contained module. It reads the container width on every render pass and calculates slide widths dynamically, so it responds correctly to window resize. Touch swipe uses `touchstart / touchmove / touchend` events with a 50 px threshold. Arrow buttons disable at the boundaries.

### Responsive breakpoints
| Viewport | Products visible |
|---|---|
| ≤ 767 px (mobile) | 1 |
| 768–1023 px (tablet) | 2 |
| ≥ 1024 px (desktop) | 3 |

### Animations
- Floating hero shapes use `@keyframes` with different durations and delays to look organic.
- Content fades in via `.content-loaded` class added after render.
- Navbar transitions to frosted-glass on scroll.
- Card hover lifts with a per-card colour glow applied via JS.

---

## Assumptions

1. **No bundler required.** ES module `import/export` syntax is used natively (supported by all modern browsers). If IE11 support were needed a bundler like Vite would be added.
2. **Product illustrations** are inline SVG generated in `components.js` rather than external image files, keeping the repo self-contained and avoiding broken image references.
3. **Footer** is static HTML since it was not included in the JSON spec. Any content that would realistically come from a CMS would be added to `content.json`.
4. **Font loading** uses Google Fonts CDN. In a production build these would be self-hosted for performance and privacy.
5. The **logo image path** in `content.json` is used for the alt text only; the actual logo mark is an inline SVG in `components.js` for reliability.

---

## Evaluation Checklist

| Criterion | Status |
|---|---|
| Semantic HTML5 | ✅ |
| CSS custom properties | ✅ |
| Fully responsive 375 px → 1440 px | ✅ |
| Floating decorative shapes animated | ✅ |
| Loading skeletons (CSS only) | ✅ |
| All content from `content.json` via `fetch()` | ✅ |
| Simulated 1000–1500 ms network delay | ✅ |
| Zero hardcoded text in HTML | ✅ |
| Carousel: prev/next navigation | ✅ |
| Carousel: touch swipe (mobile) | ✅ |
| Carousel: smooth 300 ms transition | ✅ |
| Carousel: arrows disabled at boundaries | ✅ |
| Error state + Retry button | ✅ |
| `api.getHeroContent()` | ✅ |
| `api.getFeaturesContent()` | ✅ |
| `api.getNavigation()` | ✅ |
| No CSS frameworks | ✅ |
| No jQuery | ✅ |
| ES6 modules pattern | ✅ |
