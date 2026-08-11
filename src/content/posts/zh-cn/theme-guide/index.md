---
title: "主题指南"
description: "一次配置 Astro Narrow:站点设置、内容模型与外观。"
date: 2026-06-27
tags: ["指南", "Astro"]
toc: "center"
---

Astro Narrow 是一个内容优先的主题:一条窄栏、一套由单枚种子色混出的安静配色,以及保持朴素的 Markdown。所有可配置项都集中在少数几个类型化文件里。

```sh
pnpm install
pnpm dev
pnpm build
```

| 文件 | 控制内容 |
| --- | --- |
| `src/config/site.ts` | 站点信息、导航、首页、分页、评论、统计 |
| `src/config/i18n.ts` | 语言与显示名称 |
| `src/config/theme.ts` | 默认主题与取色配方 |
| `src/content.config.ts` | 文章、项目、页面的 frontmatter 字段 |
| `src/styles/tokens.css` | 纸/墨公理色、种子配方、字号与间距刻度 |

本指南本身就是一个系列:文件夹的 `index.md` 是你正在读的这一页,章节是同目录的其他文件。打开目录即可看到系列书脊——列出全部章节并展开当前章。
