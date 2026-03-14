---
name: frontend-design
description: Anti-generic frontend design skill. Activates automatically for frontend/UI tasks to produce distinctive, professional designs instead of "AI slop".
trigger: When the task involves creating or modifying HTML, CSS, UI components, layouts, or visual design.
---

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs.
In frontend design, this creates what users call the "AI slop" aesthetic.
Avoid this: make creative, distinctive frontends that surprise and delight.

Focus on:
- Typography: Choose fonts that are beautiful, unique, and interesting.
  Avoid generic fonts like Arial and Inter; opt instead for distinctive
  choices that elevate the frontend's aesthetics.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for
  consistency. Dominant colors with sharp accents outperform timid,
  evenly-distributed palettes. Draw from IDE themes and cultural
  aesthetics for inspiration.
- Motion: Use animations for effects and micro-interactions. Prioritize
  CSS-only solutions for HTML. Focus on high-impact moments: one
  well-orchestrated page load with staggered reveals (animation-delay)
  creates more delight than scattered micro-interactions.
- Backgrounds: Create atmosphere and depth rather than defaulting to
  solid colors. Layer CSS gradients, use geometric patterns, or add
  contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely
designed for the context. Vary between light and dark themes, different
fonts, different aesthetics. It is critical that you think outside the box!
</frontend_aesthetics>

## Design Direction for this Project

This is a **Senior AI Engineer portfolio** — dark theme, technical, sophisticated.

### Identity
- Dark navy base with cyan accent (inspired by brittanychiang.com but with own personality)
- Secondary accent: purple/violet tones for AI identity
- Glassmorphism on cards (backdrop-blur + subtle border glow)
- Gradient text on primary headings (cyan → white)

### Typography Rules
- Headings: tight tracking (-0.03em), weight 600-800
- Body: line-height 1.6-1.7, weight 400
- Size jumps between heading and body: minimum 2x
- Font: Geist Sans (already configured) — acceptable as it's not generic

### Color Rules
- NEVER use default Tailwind palette (indigo-500, blue-600, etc.)
- Build from project's custom palette in global.css
- Guarantee WCAG AA contrast (4.5:1 normal text, 3:1 large text)

### Shadow Rules
- NEVER use shadow-md flat
- Multi-layer shadows, tinted to background color, low opacity
- Surface hierarchy: base → elevated → floating

### Animation Rules
- Only `transform` and `opacity`. NEVER `transition-all`
- Spring-like easing, not linear
- Page load: staggered reveals with animation-delay
- Hover/focus-visible/active states mandatory on all clickable elements

### Background Rules
- NEVER flat solid background
- Layer CSS gradients, noise SVG, subtle geometric patterns
- Use mix-blend-mode for image overlays

### Screenshot Comparison Workflow
- After each generation, take screenshot and compare against `brand_assets/reference-screenshot.png`
- Be precise: "heading 32px but reference shows ~24px", "gap 16px should be 24px"
- Review: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows
- Minimum 2 rounds of comparison. Only stop when no visible differences.
