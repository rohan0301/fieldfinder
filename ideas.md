# First Base — Design Brainstorm

## Three Stylistic Approaches

### 1. Stadium Night Game
**Theme Name:** Night Diamond
**Brief:** Dark field-green and navy palette inspired by stadium night game lighting. Chalk-white typography, amber scoreboard accents. Feels like looking at a lit diamond from the stands.
**Probability:** 0.07

### 2. Municipal Data Dashboard
**Theme Name:** Civic Grid
**Brief:** Clean, high-contrast government-data aesthetic. Structured grid, monospace data labels, teal and orange. Feels like a city planning tool.
**Probability:** 0.02

### 3. Community Bulletin Board
**Theme Name:** Neighborhood Post
**Brief:** Warm, approachable, textured. Kraft paper tones, hand-drawn pin icons, friendly sans-serif. Feels like a community center flyer.
**Probability:** 0.01

---

## Selected Approach: Night Diamond

The PRD explicitly specifies this direction and it is the strongest match for the dual-audience use case. The stadium night aesthetic makes the product unmistakably about baseball the moment it loads, which is critical in a hackathon demo context.

---

## Expanded Design Direction: Night Diamond

### Design Movement
**Stadium Data Visualization** — Merges the visual language of sports broadcast graphics (scoreboard typography, field lighting, chalk lines) with the precision of civic data mapping tools.

### Core Principles
1. **The map is the product.** It takes 70% of the viewport. Every other element serves the map or gets out of its way.
2. **Data density without overwhelm.** RBI officials need information fast; parents need simplicity. The sidebar architecture handles both without building two products.
3. **Both views share visual DNA.** The same dark base, the same Barlow Condensed headings, the same amber accent. Only the data emphasis and accent color shift.
4. **Credibility through typography.** Monospace data values signal that the numbers are real, not decorative.

### Color Philosophy
Inspired by stadium night-game lighting. Dark base evokes the field at night; amber is the scoreboard; chalk-white is the foul line; sky-blue is the open sky beyond the outfield wall.

| Token | Hex | Usage |
| --- | --- | --- |
| field-green | #0D2B1E | Top nav, map control backgrounds |
| turf-green | #1A4A2E | Sidebar panel background, card surfaces |
| chalk-white | #F7F5F0 | Primary text, headings on dark backgrounds |
| amber | #E8A838 | CTAs, active states, score highlights, priority badges |
| sky-blue | #4A90D9 | Parent view accent, program type badges, walkability indicator |
| gap-red | #C0392B | Gap flags, infrastructure-needed field pins |
| ready-green | #27AE60 | Ready-to-deploy field pins, covered neighborhood indicators |
| mid-gray | #2C2C2A | Secondary text, dividers, inactive states |

### Layout Paradigm
Asymmetric split layout. The map bleeds edge to edge. A collapsible left sidebar slides in on interaction. A top navigation bar contains the toggle and search. The priority list appears in the sidebar by default in RBI view. No centered hero, no card grid, no typical SaaS layout.

### Signature Elements
1. **Amber pill toggle** — The RBI / For Families toggle is the most prominent UI element. It animates between states with a sliding pill.
2. **Neighborhood need score badge** — A large amber pill showing the 1–10 score, styled like a scoreboard readout.
3. **Chalk-line dividers** — Thin, slightly off-white horizontal rules that evoke the chalk lines of a baseball field.

### Interaction Philosophy
Interactions are intentional and fast. The sidebar slides in with a cubic-bezier ease that feels physically grounded. The view toggle animates the pill position rather than just swapping colors. Map pins fade between view states rather than snapping.

### Animation
- View toggle: 200ms ease-out pill slide
- Sidebar open: 300ms cubic-bezier(0.4, 0, 0.2, 1) slide-in from left
- Map pin crossfade: 150ms fade-out, 200ms fade-in
- Neighborhood highlight: 200ms opacity pulse on hover
- Score badge: count-up animation on sidebar open (optional)

### Typography System
- **Display / Headings:** Barlow Condensed Bold 700 — neighborhood names, scores, app name. Athletic, scoreboard energy.
- **Body / UI:** Inter 400 and 500 — all body copy, labels, sidebar content, data values.
- **Data / Monospace:** JetBrains Mono 400 — coordinates, census tract IDs, score values where precision matters.
- **Type scale:** Display 32px, H1 24px, H2 18px, Body 14px, Label 12px, Data 13px mono. Line height 1.5 throughout.

### Brand Essence
**First Base** — A civic mapping tool for RBI officials and Oakland parents that makes baseball access gaps visible and actionable for the first time.
Personality: **Purposeful. Credible. Grounded.**

### Brand Voice
Headlines and CTAs sound like a coach, not a startup. Direct, specific, no filler.
- Example headline: *"There is a diamond in Sobrante Park. No program has ever been placed there."*
- Example CTA: *"Flag for RBI Outreach"* — not "Learn More" or "Get Started."
- Banned phrases: "Welcome to our website," "Get started today," "Revolutionizing."

### Wordmark & Logo
A bold diamond shape (baseball infield diamond) rendered as a minimal geometric mark — a rotated square with a small circle at the center (home plate). No text in the mark. Used in the nav at 32px and as favicon.

### Signature Brand Color
**Amber #E8A838** — The scoreboard color. Unmistakably First Base.
