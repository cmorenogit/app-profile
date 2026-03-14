---
allowed-tools: Read, Bash(node:*), Bash(lighthouse:*), Bash(npx:*)
description: Full validation — accessibility, performance, design
---

## Step 1: Lighthouse Audit
Run lighthouse on localhost:4321 (Astro dev port), save results as JSON.
Report scores for: Performance, Accessibility, Best Practices, SEO.

## Step 2: WCAG Check
Verify:
- All text meets 4.5:1 contrast ratio (normal) or 3:1 (large)
- All images have alt text
- All interactive elements are keyboard accessible
- Heading hierarchy is sequential (h1 → h2 → h3)
- Focus indicators are visible

## Step 3: Performance Check
Verify:
- All images have loading="lazy"
- Critical fonts have rel="preload"
- No render-blocking resources
- CSS is minimal and no unused styles

## Step 4: Fix and Re-audit
Fix all issues found, then re-run Lighthouse.
Report before/after scores.
