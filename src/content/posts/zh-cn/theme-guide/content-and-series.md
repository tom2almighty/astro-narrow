---
title: "内容与系列"
description: "文章 frontmatter、文件夹式系列、项目链接卡、标签与多语言。"
date: 2026-06-27
order: 2
tags: ["指南", "内容集合"]
toc: "center"
---

内容位于 `src/content/<集合>/<语言>/`,frontmatter 在构建期由 `src/content.config.ts` 校验。

## 文章 frontmatter

只有 `title` 和 `date` 是必填:

```yaml
---
title: "我的第一篇笔记"
description: "用于卡片与页面元信息。"
date: 2026-07-10
tags: [Astro, Markdown]
cover: "https://example.com/cover.jpg"
toc: center
draft: false
---
```

| 字段 | 用途 |
| --- | --- |
| `date` / `updatedDate` | 发布与修订日期 |
| `tags` | 归档筛选,自动发现 |
| `order` | 系列文件夹内的章节顺序 |
| `toc` | `center`、`side`、`true` 或 `false` |
| `cover` | 卡片与文章页封面 |
| `comments` | 单篇评论开关 |
| `math`, `mermaid`, `gallery`, `lightbox` | 功能提示 |

## 系列就是文件夹

`index.md` 拥有同目录 Markdown 兄弟文件的文件夹,就是一个系列——本指南正是如此:

```text
posts/zh-cn/theme-guide/
├── index.md                → /zh-cn/posts/theme-guide/
├── site-and-navigation.md  → /zh-cn/posts/theme-guide/site-and-navigation/
└── …
```

- 章节按 `order` 排序,回落到 `date`,再回落到文件名。
- 文章列表与首页只显示父文;归档、搜索和 RSS 包含每个章节。
- 父文页面渲染自动生成的章节列表;上一篇/下一篇在系列内行进;目录变成系列书脊。
- 只包含 `index.md` 与图片的文件夹仍是普通文章。

## 项目

项目是 `/projects/` 上的纯 frontmatter 链接卡片——Markdown 正文不会被渲染。`links` 把自由命名的键映射到 URL;通用键(`website`、`docs`、`demo` 等)与 Simple Icons 中存在的品牌键会自动匹配图标:

```yaml
---
title: "Astro Narrow"
description: "一个 Astro-native 内容主题。"
tags: [Astro]
order: 1
links:
  github: https://github.com/example/repo
  website: https://example.com
---
```

## 标签与归档

标签无需注册表——归档页从已发布文章中自动收集。筛选 URL 可直接分享:`/archives/?tag=Astro`。

## 多语言

默认语言(`en`)不带 URL 前缀;其他语言既是目录名也是 URL 前缀(`zh-cn/` → `/zh-cn/…`)。新增语言时,扩展 `src/config/i18n.ts` 的 `locales`、`astro.config.mjs` 的 `i18n.locales` 与 `src/content.config.ts` 中允许的 `lang` 值,然后镜像内容目录。
