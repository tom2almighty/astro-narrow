# AGENTS.md

This file provides guidance to Claude Code/Codex when working with code in this repository.

## Commands

```sh
pnpm install        # Node >= 22.12.0, pnpm workspace
pnpm dev            # dev server
pnpm build          # static build to dist/
pnpm preview        # serve the build
pnpm astro check    # type-check (.astro + .ts) — the closest thing to a test suite; run before committing
```

There is no lint or unit-test setup. `ASTRO_SITE` / `ASTRO_BASE` env vars set `site`/`base` at build time (used by the GitHub Pages workflow in `.github/workflows/deploy.yml`).

## What this is

A content-focused Astro 7 blog theme ("Astro Narrow"): one narrow reading column, a seeded `color-mix()` palette, Utopia fluid typography, i18n (`en` default + `zh-cn`). Static output only — no SSR. Commit messages in this repo are conventional-commit style, mostly in Chinese.

## Architecture

### Configuration lives in `src/config/`

All user-facing knobs are TypeScript config, not frontmatter or env:

- `site.ts` — site metadata, `contentWidth`, `nav`/`footerNav` (route ids `'posts' | 'projects' | 'archives'` or inline link objects), home sections, `list.pageSize`, comments (giscus), analytics (umami), gallery defaults.
- `theme.ts` — default theme id, seed presets (per-family oklch recipes), picker limits, and the seed string helper used by the runtime hue/chroma/lightness sliders.
- `i18n.ts` — locales, plus all locale/path helpers (`getLocalePath`, `switchLocalePath`, `getLocaleFromId`, …). Adding a locale requires touching three places: `i18n.locales` here, `i18n.locales` in `astro.config.mjs`, and the `lang` enum in `src/content.config.ts`.

### Content model (`src/content.config.ts`, `src/content/`)

Three glob-loader collections: `posts`, `projects`, `pages`.

- Content is organized by locale folder: `src/content/posts/en/...`, `.../zh-cn/...`. An entry's locale comes from the first id segment (or explicit `lang` frontmatter); `src/lib/content/entries.ts` holds the canonical helpers (`entryLocale`, `entrySlug`, `getLocalizedEntries`, tag collection, prev/next).
- **Series (subposts):** a folder inside `posts` whose `index.md` is the parent; sibling files are chapters, ordered by `order` → `date` → filename. Lists/home show only the parent; archives, search, and RSS include chapters; the TOC renders as a "series spine". Series logic is in `src/lib/content/entries.ts`.
- **Projects are frontmatter-only link cards** — the Markdown body is never rendered and no detail routes exist. `links` keys get icons automatically (generic keys and Simple Icons brand names).
- Posts use `tags` only (no categories). Archives filtering is client-side via query string (`/archives/?tag=X`, `src/scripts/archive-filters.ts`).

### Routing (`src/pages/`)

Two parallel route trees: the root tree serves the default locale unprefixed (`/posts/...`), and `src/pages/[locale]/` duplicates it for non-default locales (`/zh-cn/posts/...`). A change to one tree usually needs the same change in the other. `[...slug].astro` (both trees) renders the `pages` collection. `api/search.json.ts` emits the search index consumed by Fuse.js in `src/scripts/search.ts`; `rss.xml.ts` and `sitemap.xml.ts` are hand-rolled (no integrations).

### Markdown pipeline (`astro.config.mjs` + `src/lib/markdown/`)

The markdown processor is a custom `unified()` chain, and all custom plugins are local `.mjs` files: `remark-tabs` (directive-based `::::tabs`), `rehype-heading-anchors`, `rehype-alerts`, `rehype-image-groups` (gallery/lightbox markup), `rehype-mermaid`. Code blocks go through `astro-expressive-code` configured in `ec.config.mjs`. Math is remark-math + rehype-katex. Heavy features (math, mermaid, gallery, lightbox, comments, toc) are opted in/out per entry via frontmatter booleans in the shared schema.

### Theming: Paper · Ink · Seed (`src/styles/tokens.css`)

The entire palette is mixed from three colors: shared `--paper` and `--ink` (flipped by the `.dark` class) plus one `--seed` per theme. A seed is declared as recipe channels (`--seed-recipe-l/c/h`, e.g. in `[data-theme='ink']`), and everything else derives from it with modern CSS color math: `color-mix(in oklch, …)` for washes/hovers/borders, `oklch(from var(--seed) …)` relative color syntax for mode-adaptive accent text (darker in light, lifted in dark — Radix step-11 semantics), and `contrast-color(var(--seed))` for text on solid accent fills (step-9 semantics). **Adding a theme is a recipe block; never hard-code colors in components — use the semantic tokens.** Visitors change the seed at runtime from the Dock (`src/scripts/theme-controls.ts` + `src/components/ui/Dock.astro`); the picker limits live in `seedLimits` in `theme.ts`.

Tailwind v4 is configured CSS-first: `src/styles/global.css` maps the semantic tokens into utility namespaces via `@theme inline` (so `bg-canvas`, `text-fg-muted`, `border-border` track runtime theme switches with no variants). Typography/spacing are vendored Utopia `clamp()` scales exposed as `text-step-*` / `p-fl-*` utilities. Article styles are hand-written in `src/styles/prose.css` — `@tailwindcss/typography` is deliberately not used.

### Client-side scripts (`src/scripts/`)

Plain TypeScript modules (search modal, TOC, dock, theme controls, mermaid light/dark switching, gallery, tabs, reading progress) imported by the components that need them — no framework islands.
