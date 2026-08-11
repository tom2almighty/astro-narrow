# Astro Narrow

A content-focused Astro theme: one narrow reading column, a seeded color-mix palette, and fluid Utopia typography.

[English](README.md) · [简体中文](README.zh-CN.md) · [Hugo Narrow](https://github.com/tom2almighty/hugo-narrow)

## Features

- Seeded color system: shared paper & ink plus one `--seed`, every token mixed with `color-mix()` — dark mode for free
- Visitor appearance controls in the Dock: seed presets + custom hue picker, frosted-glass blur, film grain
- Fluid typography and spacing built on Utopia scales
- Folder-based series: `index.md` is the parent, sibling files are chapters, the TOC becomes a series spine
- Paginated post list, tag archives, search, RSS, sitemap
- Multiple languages (`en` default, `zh-cn` example)
- Math, Mermaid, tabs, alerts, image galleries
- Frontmatter-only project cards with auto-icon external links

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
| `src/config/theme.ts`   | Default theme, presets, seed recipe | `defaultTheme`, `seedPresets`, `seedColor`                                           |
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

The palette is mixed from three colors: shared `--paper` and `--ink` (which flip with the `.dark` class) plus one `--seed` per theme. Every semantic token (`canvas`, `border`, `fg`, `accent`, …) derives from them with `color-mix(in oklab, …)` — mixing toward `--fg` for contrast, toward `--canvas` to recede — so hover states glow with the theme color and nothing falls out of tune. Visitors pick the seed in the Dock: preset swatches (defined in `src/config/theme.ts`) plus a custom hue slider, applied live and persisted; lightness/chroma are fixed at contrast-validated values, so every hue is safe, and the first swatch restores the monochrome default. The same panel dials frosted-glass blur and a film-grain overlay. The shipped default is the monochrome `ink` theme; a site can hard-code its own preset with one `[data-theme] { --seed: … }` line. Cards sit on the canvas behind hairline borders; floating layers share the navbar's translucent-canvas treatment.

Typography and spacing come from vendored [Utopia](https://utopia.fyi) `clamp()` scales (`--step-*`, `--space-*`), exposed as Tailwind utilities (`text-step-1`, `p-fl-m`, …). Article styles live in `src/styles/prose.css` — the theme does not use `@tailwindcss/typography`.

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
