# Design

<!-- impeccable:design-schema 1 -->

## Visual World

**Name:** Neon Tide — A bioluminescent interface where every interaction leaves a glowing wake.

**Metaphor:** Deep sea at night. User interactions (clicks, scrolls, hovers) trace luminous paths on a black void. Plankton glow cyan/electric blue. Traces fade like memory. Motion is minimal but expressive—each gesture leaves evidence before darkness reclaims it.

## Palette

| Role | Color | Usage |
|------|-------|-------|
| Ground | `#0a0a14` | Page background (near-black, deep water) |
| Primary Glow | `#00e5ff` | Active interactive elements, borders, traces (electric cyan) |
| Secondary Glow | `#0080ff` | Secondary actions, hover states, subtle highlights (deeper blue) |
| Accent | `#00ff88` | Success states, confirmations, positive feedback (electric lime) |
| Warning | `#ff6b00` | Errors, alerts, destructive actions (warm orange) |
| Text Base | `#e0e0e0` | Body text, labels (light gray on dark) |
| Text Muted | `#808080` | Hints, disabled states, secondary info (medium gray) |
| Border | `#1a2a3f` | Card edges, dividers (very dark blue) |

**Motion & Glow:**
- All interactive elements have subtle cyan glow (`box-shadow: 0 0 8px rgba(0,229,255,0.4)`)
- On hover: glow intensifies (`box-shadow: 0 0 12px rgba(0,229,255,0.7)`)
- On active: full brightness + pulse animation (1.2s cycle)
- Fade-out effect on dismissed toasts/traces: `opacity 0.6s ease-out`

## Typography

| Scale | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| Display | Inter | 32px | 700 | Page title, hero heading |
| Heading | Inter | 24px | 600 | Section titles, tool names |
| Subhead | Inter | 18px | 600 | Card headers, labels |
| Body | Inter | 14px | 400 | Paragraph text, descriptions |
| Caption | Inter | 12px | 400 | Hints, timestamps, metadata |
| Code | Courier New, monospace | 13px | 400 | Code blocks, token display |

**Line Height:** 1.5 (body), 1.2 (headings)  
**Letter Spacing:** 0 (default), 0.05em (headings)

## Layout & Spacing

**Rhythm:** 8px base unit.
- Padding: 8px, 16px, 24px, 32px
- Margins: 8px, 16px, 24px, 32px, 48px
- Gap (flex): 8px, 16px, 24px

**Breakpoints:**
- Mobile: 320px–767px (single column, vertical stack)
- Tablet: 768px–1023px (1.5 column, sidebar starts)
- Desktop: 1024px+ (2 column: sidebar 280px + content)

**Mobile-first responsive:**
- Tools stack vertically on mobile
- Sidebar collapses into hamburger (mobile < 768px)
- Content max-width 1200px on desktop

## Components

### Buttons

**States:** Default, Hover, Active, Disabled, Loading

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #0080ff, #00e5ff);
  color: #0a0a14;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.6);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.8);
}
```

### Input Fields

```css
.input {
  background: rgba(26, 42, 63, 0.6);
  border: 1px solid #1a2a3f;
  color: #e0e0e0;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: #00e5ff;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
  outline: none;
}
```

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(10, 10, 20, 0.95);
  color: #e0e0e0;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 3px solid #00e5ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;
}

.toast.toast-success { border-left-color: #00ff88; }
.toast.toast-error { border-left-color: #ff6b00; }
```

### Cards

```css
.card {
  background: rgba(26, 42, 63, 0.4);
  border: 1px solid #1a2a3f;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #00e5ff;
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

## Motion & Animation

| Animation | Duration | Easing | Purpose |
|-----------|----------|--------|---------|
| Fade in | 0.3s | ease-out | Reveal new content |
| Slide in | 0.3s | ease-out | Toast, modals |
| Pulse | 1.2s | ease-in-out | Active/loading state |
| Glow fade | 0.6s | ease-out | Dismiss trace |
| Scale bounce | 0.2s | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Button press feedback |

**Reduced motion:** All animations disabled when `prefers-reduced-motion: reduce` is set (entry performance tier auto-respects).

## Accessibility

- **Color contrast:** All text ≥4.5:1 against background (WCAG AA)
- **Touch targets:** Buttons, inputs ≥44px × 44px (mobile-friendly)
- **Semantic HTML:** `<button>`, `<input>`, `<label>`, `<nav>`, `<main>`, `<section>`
- **ARIA labels:** Interactive elements have `aria-label` or `aria-describedby`
- **Focus visible:** `outline: 2px solid #00e5ff` on tab focus
- **Dark mode:** Native dark theme (no light mode toggle planned)
- **Reduced motion:** Entry tier disables animations automatically
- **Save data:** Entry tier reduces image quality, lazy-loads non-critical assets

## Responsive Behavior

**Mobile (320px–767px):**
- Single column layout
- Full-width cards, stacked vertically
- Sidebar hidden (hamburger menu)
- Touch-friendly spacing (44px+ targets)
- Font sizes: base 14px, headings scaled down

**Tablet (768px–1023px):**
- Two-column layout begins (sidebar 240px + content)
- Cards in 2-column grid when appropriate
- Drawer sidebar (collapsible)

**Desktop (1024px+):**
- Stable sidebar (280px)
- Content max-width 1200px, centered
- Card grids up to 4 columns
- Hover interactions fully enabled

## Performance Tiers

| Tier | Trigger | Animation | Images | Fonts | CSS |
|------|---------|-----------|--------|-------|-----|
| Entry | Low CPU/mem or reduced-motion | Minimal (fade only) | Lazy-loaded, compressed | System stack | Critical inline, defer rest |
| Mid | Balanced device | Standard (fade, slide, glow) | Eager-loaded, optimized | Inter + system | Inline + async load |
| High | High-end (4+ cores, 4GB mem) | Full (pulse, bounce, particle traces) | Preload all | Inter only | Full async |

**Splash screen:** Performance-adaptive duration (entry: 1s, mid: 2s, high: 3s with particle animation).

## Tokens (CSS Variables)

```css
:root {
  --color-ground: #0a0a14;
  --color-glow-primary: #00e5ff;
  --color-glow-secondary: #0080ff;
  --color-accent-success: #00ff88;
  --color-accent-warning: #ff6b00;
  --color-text-base: #e0e0e0;
  --color-text-muted: #808080;
  --color-border: #1a2a3f;

  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;

  --duration-quick: 0.2s;
  --duration-base: 0.3s;
  --duration-slow: 0.6s;

  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Courier New', monospace;
}
```

## First Surface: Homepage / Tool Selector

**Purpose:** Land on Leoo Tools, see all available tools at a glance, pick one.

**Layout:**
- Header: Logo + title "Leoo Tools Pro" + search/filter
- Hero section: Tagline "Free, no-login web toolbox"
- Grid of tool cards (3 columns desktop, 1 mobile)
- Each card: Icon + tool name + brief description + "Open" button
- Footer: Links, copyright

**Interaction:**
- Card hover: Glow intensifies, slight lift (`transform: translateY(-2px)`)
- Search filters tools in real-time
- Click "Open" → navigate to tool page

**Performance:** Entry tier skips hero animation; mid/high tiers animate card entrance sequentially (stagger 0.1s).

---

**Last updated:** 2026-08-13  
**Approved by:** Syra (TESTI 800+)  
**Status:** Ready for implementation
