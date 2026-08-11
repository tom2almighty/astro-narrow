# Astro Narrow

A content-focused Astro theme: one narrow reading column, a sitewide palette readers can tune themselves, and type that scales smoothly with the screen. Migrated from Hugo Narrow, keeping its overall design ideas.

[English](README.md) · [简体中文](README.zh-CN.md) · [Hugo Narrow](https://github.com/tom2almighty/hugo-narrow)

## Features

- One-pick recoloring: choose a theme color and the whole site follows — shades, borders, links, dark mode included
- Readers tune the look themselves: theme color, color scheme, frosted glass, film grain, and page width, remembered across visits
- Type and spacing scale smoothly with the screen, comfortable from phones to large monitors
- Drop a few posts into one folder to make a series: chapters order themselves, the table of contents becomes a series spine, and previous/next links stay inside the series
- Paginated post list, tag archives, full-text search, RSS, and sitemap out of the box
- Multiple languages (English default, Simplified Chinese example included)
- Markdown extras: math, Mermaid diagrams, tabs, alerts, image galleries with a lightbox
- Project cards from a few lines of frontmatter, with automatic icons for common sites

## Quick Start

```sh
pnpm install
pnpm dev
pnpm build
pnpm astro check
```

## Main Config Files

| File                    | Purpose                             | Common options                                                                       |
| ----------------------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| `src/config/site.ts`    | Site, author, and global features   | `contentWidth`, `nav`, `footerNav`, `home`, `list.pageSize`, `comments`, `analytics` |
| `src/config/i18n.ts`    | Locales and display names           | `defaultLocale`, `locales`, `localeMeta`                                             |
| `src/config/theme.ts`   | Default theme, schemes, presets     | `defaultTheme`, `defaultScheme`, `schemes`, `seedPresets`, `seedColor`               |
| `src/content.config.ts` | Available frontmatter fields        | Update when adding or changing content fields                                        |
| `src/styles/tokens.css` | Design tokens                       | Paper/ink axioms, theme seeds, mix recipe, Utopia type/space scales, `--radius`      |

When adding a locale, also update `i18n.locales` in `astro.config.mjs` and the allowed `lang` values in `src/content.config.ts`.

## Navigation

`nav` and `footerNav` accept registered route ids (`posts`, `projects`, `archives`) and inline links. Inline links work with internal paths and external URLs in both locations; external URLs open in a new tab with an arrow marker.

```ts
nav: [
  "posts",
  "projects",
  "archives",
  { label: "GitHub", href: "https://github.com/", icon: "simple-icons:github" },
  { label: { en: "About", "zh-cn": "关于" }, href: "/about/" },
],
footerNav: ["archives"],
```

`label` is a plain string or a per-locale record; `icon` is optional.

## Home Sections and Pagination

```ts
home: {
  recentPosts: { enabled: true, limit: 3 },
},
list: {
  pageSize: 10,
},
```

`/posts/` paginates with `pageSize`; page two and later live at `/posts/page/<n>/`.

## Content Taxonomy

Posts use `tags` only:

```yaml
---
title: Writing with Astro Narrow
date: 2026-07-10
tags: [Astro, Markdown]
---
```

Archives discovers tags from published posts. Filter URLs can be shared directly:

```text
/archives/?tag=Astro
```

## Series (Subposts)

A series is a folder inside the posts collection. The folder's `index.md` is the parent post; every sibling Markdown file is a chapter:

```text
src/content/posts/en/astro-guide/
├── index.md        → /posts/astro-guide/
├── setup.md        → /posts/astro-guide/setup/
└── deploy.md       → /posts/astro-guide/deploy/
```

- Chapters are ordered by the `order` frontmatter number, falling back to `date`, then filename.
- The post list and home page show only the parent; archives, search, and RSS include every chapter.
- The parent page renders a generated chapter list; previous/next navigation runs inside the series.
- The table of contents becomes a series spine: all chapters listed, the current one expanded, position shown in the capsule.
- A folder containing only `index.md` plus assets stays an ordinary post.

## Projects

Projects are frontmatter-only link cards rendered in a three-column grid — no detail pages. `links` maps freely chosen keys to URLs; generic keys (`website`, `docs`, `demo`, …) and brand keys found in Simple Icons get icons automatically, everything else falls back to an arrow.

```yaml
---
title: "Astro Narrow"
description: "An Astro-native content theme."
tags: [Astro]
order: 1
links:
  github: https://github.com/example/repo
  website: https://example.com
---
```

## Theming

Changing colors requires no color theory:

- **Readers**: the Dock's display settings offer preset swatches and a custom hue slider — pick a color and the whole site recolors instantly and remembers the choice. The scheme buttons next to them (Plain / Tinted / Vivid / Soft) decide how boldly the color is used: whether the paper takes a subtle wash, how strong hovers and accents appear.
- **Site owners**: the default theme, default scheme, and swatch presets live in `src/config/theme.ts`. For a brand color, add one line to `src/styles/tokens.css`: `[data-theme='brand'] { --seed: … }`. For your own scheme, copy the template block at the end of tokens.css, adjust a few percentages, and register it in `theme.ts` — the Dock button appears automatically.

The principle in one sentence: the entire palette is derived from paper, ink, and a single theme color through one shared `color-mix()` recipe, so every color, every scheme, and both light and dark mode stay in tune automatically.

Typography and spacing come from vendored [Utopia](https://utopia.fyi) `clamp()` scales (`--step-*`, `--space-*`), exposed as Tailwind utilities (`text-step-1`, `p-fl-m`, …). Article styles live in `src/styles/prose.css`.

## Markdown Tabs

Tabs use `remark-directive` syntax. The outer container uses four colons because it contains nested directives.

````md
::::tabs
:::tab{title="pnpm"}

```sh
pnpm install
```

:::

:::tab{title="npm"}

```sh
npm install
```

:::
::::
````

## GitHub Pages

The example workflow is in `.github/workflows/deploy.yml`. Before the first deployment, open repository **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**. Without this setting, `actions/deploy-pages` can fail with `HttpError: Not Found`.

The workflow sets `ASTRO_SITE` and `ASTRO_BASE` automatically for both user pages and project pages.

## License

This project is licensed under the [GNU General Public License Version 3](LICENSE).
