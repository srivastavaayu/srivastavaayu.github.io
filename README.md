# srivastavaayu.github.io

Personal portfolio website — built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no dependencies.

**Live:** [srivastavaayu.github.io](https://srivastavaayu.github.io)

---

## Stack

| Layer | Choice |
|-------|--------|
| Markup | HTML5 (semantic elements, ARIA, Open Graph, JSON-LD) |
| Styles | CSS3 with custom properties (design tokens) |
| Scripts | Vanilla JavaScript (ES6+) |
| Hosting | GitHub Pages |
| Fonts | Inter + JetBrains Mono via Google Fonts |

---

## Project Structure

```
.
├── index.html          # Home — hero, stats, community roles
├── work.html           # Experience — timeline, tech stack, resume
├── projects.html       # Projects — card grid
├── contact.html        # Contact — channels, availability card
├── 404.html            # Custom error page
│
├── css/
│   ├── tokens.css      # Design tokens (color, spacing, type, radius)
│   └── style.css       # All styles, built on top of tokens
│
├── js/
│   └── main.js         # All interactivity — zero dependencies
│
├── images/
│   └── aayush.jpg      # Avatar / favicon
│
├── sitemap.xml
└── robots.txt
```

---

## Features

- **Dark / light theme** — persisted to `localStorage`, respects `prefers-color-scheme`
- **Typewriter effect** — cycles through role phrases, skips animation on `prefers-reduced-motion`
- **Spotlight cursor** — smooth lerp-based glow that follows the mouse, pauses when tab is hidden
- **Scroll animations** — `IntersectionObserver`-driven fade-up on every `[data-animate]` element
- **Scroll progress bar** — RAF-throttled top bar showing read progress
- **Time-aware greeting** — hero greeting changes based on current IST hour
- **Visitor timezone widget** — contact page shows visitor's local time alongside IST
- **Active nav highlighting** — current page link marked with `aria-current="page"`
- **Responsive** — mobile-first layout, `100dvh` for Safari compatibility

### Easter Eggs

| Trigger | What happens |
|---------|-------------|
| Open DevTools console | Styled greeting + contact info |
| Konami code (↑↑↓↓←→←→BA) | Toast with an unpopular opinion |
| Click `<As/>` logo 5× on home | Progressive toast sequence |
| Hover over avatar | Emoji cursor trail |
| Visit `/#aayush` | Personal welcome toast with a contact link |

---

## Running Locally

No build step needed — just open the files directly or serve them with any static server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.

---

## SEO & Accessibility

- Canonical URLs on every page
- Open Graph + Twitter Card meta tags
- JSON-LD `Person` schema on homepage
- `sitemap.xml` with `<lastmod>` dates
- Skip-to-content link, `aria-label` on all interactive elements
- WCAG AA contrast on all text colours
- Semantic HTML throughout (`<nav>`, `<main>`, `<article>`, `<time datetime>`)
