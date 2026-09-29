# UI/UX & Design System Document (DESIGN.md)

## High-Performance Systems & Distributed Backend Portfolio

---

### Document Metadata

- **Project**: Systems & Distributed Backend Engineering Portfolio
- **Author**: Soumabrata Ghosh
- **Aesthetic Direction**: High-Velocity Industrial Systems / Catppuccin Mocha Dark Terminal
- **Status**: Design Specification & Component Wireframes
- **Version**: 2.0.0

---

## 1. Design Philosophy & Aesthetic Identity

High-caliber backend engineering portfolios must look and feel like **high-reliability telemetry software** (Grafana, Datadog, Stripe Dashboard, Cloudflare Radar):

- **Precision over Decoration**: Dense, information-rich layouts that prioritize signal-to-noise ratio.
- **Hardware-Accurate Data Display**: Monospace metrics with explicit units (`µs`, `ms`, `ops/sec`, `MB/s`), P95/P99 latency indicators, and sparklines.
- **Tactile Interactivity**: Every card responds to hover; every primary action (resume, GitHub, LinkedIn) is a single click; every architecture diagram can be expanded into an inspected lightbox.
- **Dark Industrial Colorway**: Deep Obsidian/Mocha backgrounds (`#11111b`, `#181825`) with vivid phosphor accents: Emerald (`#a6e3a1`), Sky/Cyan (`#89dceb`), and Mauve (`#cba6f7`).

---

## 2. Design Tokens & Color Palette

### 2.1 The Catppuccin Mocha Systems Palette

```css
:root {
  /* Background Layers */
  --bg-crust: #11111b; /* Deepest base layer (Terminal interior, canvas) */
  --bg-mantle: #181825; /* Page background */
  --bg-base: #1e1e2e; /* Card surfaces, input containers */
  --bg-surface-0: #313244; /* Card hover state, border hover */
  --bg-surface-1: #45475a; /* Elevated chip/pill surfaces */

  /* Borders & Dividers */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(203, 166, 247, 0.35); /* Mauve highlight */
  --border-success: rgba(166, 227, 161, 0.3); /* Green highlight */

  /* Typography Colors */
  --text-headline: #cdd6f4; /* High-contrast white/light text */
  --text-muted: #a6adc8; /* Secondary technical notes, labels */
  --text-dim: #6c7086; /* Timestamps, disabled controls */

  /* Functional Accents (Phosphor Signals) */
  --accent-green: #a6e3a1; /* Latency optimal, 200 OK, healthy state */
  --accent-yellow: #f9e2af; /* Streaming message queues, warnings */
  --accent-cyan: #89dceb; /* High throughput, C++ native compute */
  --accent-mauve: #cba6f7; /* Distributed locks, primary brand, headers */
  --accent-red: #f38ba8; /* Chaos attacks, DLQ, 5xx errors */
  --accent-blue: #89b4fa; /* Database persistence, PostgreSQL */
}
```

### 2.2 Typography Scale

- **Display Monospace**: `Geist Mono`, `JetBrains Mono`, or `Fira Code`. Used for all metrics, numbers, command inputs, badges, and code blocks.
- **Interface Sans**: `Geist Sans`, `Inter`, or `system-ui`. Used for headlines, descriptions, and readability in deep-dive articles.

| Token            | Font Family | Size / Weight     | Line Height | Usage                                     |
| :--------------- | :---------- | :---------------- | :---------- | :---------------------------------------- |
| `text-display`   | Sans        | 48px / 800 (Bold) | 1.15        | Main Hero Headline                        |
| `text-h2`        | Sans        | 30px / 700        | 1.25        | Section Titles (Projects, Architecture)   |
| `text-metric-lg` | Mono        | 28px / 700        | 1.0         | Bento Metric Values (`3.88M ops/sec`)     |
| `text-body`      | Sans        | 15px / 400        | 1.6         | Project Overviews, Case Studies           |
| `text-code`      | Mono        | 13px / 400        | 1.5         | Code blocks, JSON bodies                  |
| `text-badge`     | Mono        | 11px / 600        | 1.0         | Status pills, Layer tags (`L3 STREAMING`) |

---

## 3. Detailed Component Wireframes & Layout

### 3.1 Hero Section: Headline & Telemetry Bento Grid

```
+---------------------------------------------------------------------------------------------------+
|  [● SYSTEM ACTIVE]  [C++ • Redis Lua • Kafka • Next.js]                                            |
|                                                                                                   |
|  Architecting Resilient Distributed Systems & Low-Latency Engines                                  |
|  High-throughput spatial partitioning, sub-microsecond in-memory lookups, and zero-race dispatch. |
|                                                                                                   |
|  +--------------------------------------------+  +---------------------------------------------+  |
|  |           QUICK ACCESS                     |  |            TELEMETRY BENTO GRID             |  |
|  |                                            |  |  +--------------------+ +-----------------+  |  |
|  |  [ View Resume PDF ]                       |  |  | SPATIAL INGESTION  | | TOP-5 k-NN      |  |  |
|  |                                            |  |  | 3.88M ops/sec      | | 16.5 µs         |  |  |
|  |  [ GitHub Profile ]                        |  |  | [=== Sparkline ==] | | [OPTIMAL]       |  |  |
|  |                                            |  |  +--------------------+ +-----------------+  |  |
|  |  [ LinkedIn ]                              |  |  +--------------------+ +-----------------+  |  |
|  |                                            |  |  | ATOMIC LOCK RATE   | | CHAOS RESILIENCE|  |  |
|  |                                            |  |  | 71.9k /sec         | | 50k Drivers     |  |  |
|  |                                            |  |  | Zero Race Leases   | | 0 Crashes       |  |  |
|  |                                            |  |  +--------------------+ +-----------------+  |  |
|  |                                            |  |                                              |  |
|  |                                            |  |  $ npx soumabrata                 [Copy NPX] |  |
|  |                                            |  |                                              |  |
|  +--------------------------------------------+  +---------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

#### Wireframe Specifications:

- **Responsive Ratio**: 5 columns (Quick Access) to 7 columns (Bento Grid) on `lg` screens; stacks cleanly on tablets and mobile devices.
- **Sparkline Component**: SVG path rendered with 12 parametric points reflecting real-time ingestion load.
- **Quick Access Panel**: Three plain anchor links (Resume, GitHub, LinkedIn). The NPX copy bar is the only client-side interaction in this section.

---

### 3.2 Flagship Showcase: InstaRide (The Deep-Dive Hero)

```
+---------------------------------------------------------------------------------------------------+
|  [FLAGSHIP #1]  [PRODUCTION v1.0.0]  [C++ SPATIAL CORE]  [ATOMIC LUA LEASE]                        |
|                                                                                                   |
|  InstaRide: High-Concurrency Spatial Dispatch Engine                                              |
|  Sub-millisecond driver matching across 100k moving vehicles with zero double-dispatch race cond.  |
|                                                                                                   |
|  +--------------------------------------------+  +---------------------------------------------+  |
|  |           ARCHITECTURE PIPELINE            |  |             VERIFIED BENCHMARKS             |  |
|  |                                            |  |                                             |  |
|  |  [ GPS Telemetry ]                         |  |  METRIC             C++ CORE    NAIVE SCAN  |  |
|  |        │                                   |  |  -----------------------------------------  |  |
|  |        ▼ (3.88M ops/sec)                   |  |  Spatial Ingest     3.88M/s     68k/s (57x) |  |
|  |  [ C++ PR-Quadtree ]                       |  |  Top-5 k-NN         16.5 µs     1,250 µs    |  |
|  |        │ (Top-5 candidates in 16.5µs)      |  |  Lock Acquisition   0.014 ms    2.8 ms      |  |
|  |        ▼                                   |  |  Double-Dispatch    0.000%      14.2%       |  |
|  |  [ Redis Lua Atomic Dispatch ]             |  |                                             |  |
|  |        │ (Zero race condition)             |  |  +---------------------------------------+  |  |
|  |        ▼                                   |  |  | CHAOS TEST SUITE SURVIVED:            |  |  |
|  |  [ Driver WS Broadcast ]                   |  |  | ✔ 50,000 Point Singularity Attack     |  |  |
|  |                                            |  |  | ✔ NaN/Inf Coordinate Poisoning           |  |
|  |                                            |  |  | ✔ Boundary Thrashing & Lock Starvation   |  |
|  |                                            |  |  |                                          |  |
|  |  [GitHub v1.0.0 Release & Source]          |  |  | [Read Architecture Post-Mortem →]        |  |
|  +--------------------------------------------+  +---------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Micro-Interactions & Animation Guidelines

1. **Subtle Neon Glow on Hover**:
   Cards use CSS `transition: border-color 200ms ease, box-shadow 200ms ease`. On hover, the border shifts from `border-subtle` (`rgba(255,255,255,0.08)`) to `var(--accent-mauve)` or `var(--accent-green)` with an ambient outer blur `0 0 20px rgba(166,227,161,0.10)`.
2. **Copy-to-Clipboard Feedback**:
   Clicking the NPX button transitions the icon from `<Copy />` to `<Check className="text-accent-green" />` and displays a floating toast `"Copied $ npx soumabrata to clipboard!"` for 2,000ms.

---

## 5. Responsive Design Matrix

| Breakpoint            | Window Width                    | Layout Structure    | Key Adaptations                                                                                          |
| :-------------------- | :------------------------------ | :------------------ | :------------------------------------------------------------------------------------------------------- |
| **Mobile (`sm`)**     | $< 640\text{px}$                | Single column       | Bento grid switches to 1x4 stack; quick access buttons full-width.                                               |
| **Tablet (`md`)**     | $640\text{px} - 1024\text{px}$  | 2-column bento      | Bento grid switches to 2x2; quick access and bento stack vertically (quick access on top).                |
| **Desktop (`lg`)**    | $1024\text{px} - 1440\text{px}$ | Asymmetric 5/7 Grid | Full side-by-side quick access + bento; sticky navigation bar; dual-column project showcase.               |
| **Ultrawide (`2xl`)** | $> 1440\text{px}$               | Centered Container  | Max-width capped at `1280px` (`max-w-7xl`) to prevent awkward eye travel and keep dense telemetry tight. |

---

## 6. Implementation Checklist & File Mapping

- [x] **PRD**: Completed at `docs/PRD.md`
- [x] **Architecture Spec**: Completed at `docs/ARCHITECTURE.md`
- [x] **Design & Tokens**: Completed at `docs/DESIGN.md`
- [ ] **Implementation Phase 1**: Upgrade `src/data/benchmarks.ts` and `src/data/projects.ts` with InstaRide verified data.
- [ ] **Implementation Phase 2**: Upgrade `src/components/sections/Hero.tsx` with Catppuccin Mocha tokens & hardware benchmark cards.
- [ ] **Implementation Phase 3**: Implement `/blog` index page and `/blog/[slug]` reader with reading-progress bar and per-block copy buttons.
- [ ] **Implementation Phase 4**: Implement `/write` Tiptap authoring studio with autosave, markdown export, and edit-by-slug.
