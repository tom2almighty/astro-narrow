---
title: "Appearance"
description: "The seed color system, the Dock's picker and sliders, and hard-coding your own theme."
date: 2026-06-27
order: 3
tags: ["Guide", "Design Tokens"]
toc: "center"
---

The whole palette is mixed from three colors: shared `--paper` and `--ink` (which flip with dark mode) plus one `--seed`. Every token — canvas, borders, hover, links — derives from them with `color-mix(in oklab, …)`, so any seed stays in tune.

## The Dock display panel

The settings button on the bottom Dock opens the display panel:

- **Color mode** — light, auto, or dark. Auto follows the OS and updates live.
- **Theme color** — preset swatches plus a hue slider for a custom seed. The slider's lightness and chroma are fixed at contrast-validated values, so every hue is readable; the first swatch restores the monochrome default. Choices persist per visitor.
- **Frosted glass** — blur strength of the navigation bar, Dock, and floating panels.
- **Grain** — a film-grain overlay on the page, off by default.
- **Page width** — adjusts the reading column around your `contentWidth`.

## Hard-code a theme

To ship your own default color, declare a seed in `src/styles/tokens.css` and point `defaultTheme` in `src/config/theme.ts` at it:

```css
[data-theme='teal'] {
  --seed: oklch(52% 0.11 195);
}
```

Keep seeds around 50–58% lightness so white text stays readable on solid accents. The shipped monochrome default (`ink`) additionally binds the solid accent to the ink itself:

```css
[data-theme='ink'] {
  --seed: oklch(25% 0.012 285);
  --accent: var(--fg);
  --accent-contrast: var(--canvas);
  --accent-text: var(--fg);
}
```

## Type and spacing

Font sizes and spacing come from fluid [Utopia](https://utopia.fyi) scales (`--step-*`, `--space-*`) defined in the same file, exposed as Tailwind utilities (`text-step-1`, `p-fl-m`). One `--radius` rounds every box; alert callouts, code blocks, and tables all draw from the same tokens.
