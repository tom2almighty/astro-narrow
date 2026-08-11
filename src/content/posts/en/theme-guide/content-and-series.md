---
title: "Content and Series"
description: "Post frontmatter, folder-based series, project link cards, tags, and locales."
date: 2026-06-27
order: 2
tags: ["Guide", "Content Collections"]
toc: "center"
---

Content lives under `src/content/<collection>/<locale>/`. Frontmatter is validated at build time by `src/content.config.ts`.

## Post frontmatter

Only `title` and `date` are required:

```yaml
---
title: "My First Note"
description: "Shown in cards and page metadata."
date: 2026-07-10
tags: [Astro, Markdown]
cover: "https://example.com/cover.jpg"
toc: center
draft: false
---
```

| Field | Use |
| --- | --- |
| `date` / `updatedDate` | Publish and revision dates |
| `tags` | Archive filtering; discovered automatically |
| `order` | Chapter order inside a series folder |
| `toc` | `center`, `side`, `true`, or `false` |
| `cover` | Cover image on cards and the post page |
| `comments` | Per-post comment switch |
| `math`, `mermaid`, `gallery`, `lightbox` | Feature hints |

## Series are folders

A folder whose `index.md` has sibling Markdown files becomes a series — exactly like this guide:

```text
posts/en/theme-guide/
├── index.md                → /posts/theme-guide/
├── site-and-navigation.md  → /posts/theme-guide/site-and-navigation/
└── …
```

- Chapters are ordered by `order`, falling back to `date`, then filename.
- The post list and home page show only the parent; archives, search, and RSS include every chapter.
- The parent page renders a generated chapter list; previous/next navigation walks the series; the table of contents becomes a series spine.
- A folder with only `index.md` plus images stays an ordinary post.

## Projects

Projects are frontmatter-only link cards on `/projects/` — the Markdown body is never rendered. `links` maps freely chosen keys to URLs; generic keys (`website`, `docs`, `demo`, …) and brand keys found in Simple Icons get icons automatically:

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

## Tags and archives

Tags need no registry — Archives collects them from published posts. Filter URLs are shareable: `/archives/?tag=Astro`.

## Locales

The default locale (`en`) has no URL prefix; every other locale is a folder name and a URL prefix (`zh-cn/` → `/zh-cn/…`). To add a locale, extend `locales` in `src/config/i18n.ts`, `i18n.locales` in `astro.config.mjs`, and the allowed `lang` values in `src/content.config.ts`, then mirror the content folders.
