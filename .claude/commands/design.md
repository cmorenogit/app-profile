---
allowed-tools: Read, Glob, Grep, Bash(node:*), WebFetch
description: Multi-pass design review against design system
---

## Design System Review

Read the design system rules from CLAUDE.md, the frontend-design skill, and brand_assets/.

## Pass 1: Token Compliance
Review all CSS/HTML/Astro files for:
1. Are CSS variables defined for all design tokens?
2. Is spacing following the 8-point grid?
3. Are colors from the defined palette (not Tailwind defaults)?
4. Are fonts from the approved list (not Inter/Roboto/Arial)?
5. Is there a surface hierarchy (base → elevated → floating)?

## Pass 2: Visual Quality
Take a screenshot of each major page and analyze:
1. Typography hierarchy — are size jumps ≥2x?
2. Color contrast — does it meet WCAG AA?
3. Interactive states — do all clickable elements have hover/focus/active?
4. Animation — are transitions using transform/opacity only?
5. Backgrounds — is there depth or just flat solid colors?

## Pass 3: Consistency
Compare components across pages:
1. Are buttons visually identical across all pages?
2. Is spacing consistent between same-type sections?
3. Are shadows uniform for same-elevation elements?
4. Is the typography scale consistent?

## Output
Generate a prioritized report:
- 🔴 Critical: Violations that break the design system
- 🟡 Warning: Inconsistencies that degrade quality
- 🟢 Suggestion: Optional polish improvements

Then fix all Critical and Warning issues automatically.
Take a final screenshot to verify fixes.
