# Astro Narrow

一个内容优先的 Astro 主题:一条窄幅阅读栏、种子式 color-mix 配色、Utopia 流式排版。

[English](README.md) · [简体中文](README.zh-CN.md) · [Hugo Narrow](https://github.com/tom2almighty/hugo-narrow)

## 功能

- 种子配色系统:共享纸与墨 + 一枚 `--seed`,全部 token 用 `color-mix()` 调出——深色模式自动成立
- Dock 内的访客外观控制:种子预设色板 + 自定义色相条、毛玻璃模糊、胶片颗粒
- 基于 Utopia 刻度的流式字号与间距
- 文件夹式系列:`index.md` 为父文,同目录文件为章节,目录升级为系列书脊
- 文章列表分页、标签归档、搜索、RSS、sitemap
- 多语言(默认 `en`,示例 `zh-cn`)
- 数学公式、Mermaid、Tabs、提示块、图库
- 纯 frontmatter 项目卡片,外链自动匹配图标

## 快速开始

```sh
pnpm install
pnpm dev
pnpm build
pnpm astro check
```

## 主要配置文件

| 文件                    | 用途                     | 常用配置                                                                             |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `src/config/site.ts`    | 站点、作者与全局功能     | `contentWidth`、`nav`、`footerNav`、`home`、`list.pageSize`、`comments`、`analytics` |
| `src/config/i18n.ts`    | 语言与显示名称           | `defaultLocale`、`locales`、`localeMeta`                                             |
| `src/config/theme.ts`   | 默认主题、预设与取色配方 | `defaultTheme`、`seedPresets`、`seedColor`                                           |
| `src/content.config.ts` | 可用的 frontmatter 字段  | 新增或修改内容字段时更新                                                             |
| `src/styles/tokens.css` | 设计令牌                 | 纸/墨公理色、主题种子、混色配方、Utopia 字号/间距刻度、`--radius`                    |

新增语言时,同时更新 `astro.config.mjs` 的 `i18n.locales` 和 `src/content.config.ts` 中允许的 `lang` 值。

## 导航

`nav` 与 `footerNav` 接受注册路由 id(`posts`、`projects`、`archives`)和内联链接。内联链接在两处都同时支持内部路径与外部 URL;外部 URL 会在新标签页打开并带箭头标记。

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

`label` 可以是字符串或按语言的对象;`icon` 可选。

## 首页区块与分页

```ts
home: {
  recentPosts: { enabled: true, limit: 3 },
},
list: {
  pageSize: 10,
},
```

`/posts/` 按 `pageSize` 分页,第二页起位于 `/posts/page/<n>/`。

## 内容分类

文章只使用 `tags`:

```yaml
---
title: 用 Astro Narrow 写作
date: 2026-07-10
tags: [Astro, Markdown]
---
```

归档页会从已发布文章中自动发现标签。筛选 URL 可以直接分享:

```text
/archives/?tag=Astro
```

## 系列(Subpost)

系列就是 posts 集合里的一个文件夹。文件夹的 `index.md` 是父文,同目录的每个 Markdown 文件是章节:

```text
src/content/posts/zh-cn/astro-guide/
├── index.md        → /zh-cn/posts/astro-guide/
├── setup.md        → /zh-cn/posts/astro-guide/setup/
└── deploy.md       → /zh-cn/posts/astro-guide/deploy/
```

- 章节按 frontmatter 的 `order` 数字排序,回落到 `date`,再回落到文件名。
- 文章列表和首页只显示父文;归档、搜索和 RSS 包含每个章节。
- 父文页面渲染自动生成的章节列表;上一篇/下一篇在系列内部闭环。
- 目录会变成系列书脊:列出全部章节,展开当前章,胶囊显示位置。
- 只包含 `index.md` 和资源文件的文件夹仍是普通文章。

## 项目

项目是纯 frontmatter 的链接卡片,以三列网格展示——没有详情页。`links` 把自由命名的键映射到 URL;通用键(`website`、`docs`、`demo` 等)与 Simple Icons 中存在的品牌键会自动匹配图标,其余回退为箭头。

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

## 主题配色

调色板由三个颜色混出:共享的 `--paper` 与 `--ink`(随 `.dark` 类翻转)+ 每套主题一枚 `--seed`。所有语义令牌(`canvas`、`border`、`fg`、`accent` 等)用 `color-mix(in oklab, …)` 从三者推导——朝 `--fg` 混获得对比度,朝 `--canvas` 混融入页面——悬浮泛主题色,任何颜色都不会失调。种子由访客在 Dock 中挑选:预设色板(定义于 `src/config/theme.ts`)加自定义色相滑条,实时生效并持久化;亮度/彩度固定在经全色相对比度验证的安全值,任何色相都可读,第一枚色板恢复单色默认。同一面板还能调节毛玻璃模糊与胶片颗粒。内置默认为单色 `ink` 主题;站点也可用一行 `[data-theme] { --seed: … }` 硬编码自己的预设。卡片直接坐在纸面上靠发丝边框分隔;浮层与导航栏共用半透明纸面处理。

字号与间距来自内置的 [Utopia](https://utopia.fyi) `clamp()` 刻度(`--step-*`、`--space-*`),并暴露为 Tailwind 工具类(`text-step-1`、`p-fl-m` 等)。正文样式位于 `src/styles/prose.css`——主题不使用 `@tailwindcss/typography`。

## Markdown Tabs

Tabs 使用 `remark-directive` 语法。外层容器使用四个冒号,因为它包含嵌套指令。

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

示例工作流位于 `.github/workflows/deploy.yml`。首次部署前,在仓库 **Settings > Pages** 中把 **Build and deployment > Source** 设置为 **GitHub Actions**。缺少该设置时,`actions/deploy-pages` 可能报 `HttpError: Not Found`。

工作流会为用户页和项目页自动设置 `ASTRO_SITE` 和 `ASTRO_BASE`。

## 许可证

本项目基于 [GNU General Public License Version 3](LICENSE) 发布。
