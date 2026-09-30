# 个人学习博客（Hugo）

日期：2026-09-30  
状态：已审阅  
仓库：`blockchain_tech`（写规格时为空目录）

长期自用的协议与 Solidity 笔记站（Uniswap V2、OpenZeppelin 等）。不是 CMS demo。在 Git 里写 Markdown，构建成静态站点发布。

## 目标

- 能写、能翻、能养很多年的技术长文。
- 第一天就按公开站的信息架构做；域名和 CI 可以后置。
- Web3 观感（支持深色），但不是钱包 dApp。
- 跟随系统主题，并允许手动覆盖且记住选择。

## v1 已锁定决策

| 主题 | 选择 |
| --- | --- |
| 写作方式 | Git 里 Markdown（`hugo new`），不上 CMS |
| 读者 | 先给自己用，结构按公开站来 |
| 信息架构 | 个人博客：首页 = 最新文章 + 系列卡片（不是文档侧栏，不是笔记网格） |
| 分类 | 一篇文章最多挂一个系列（可空）+ 标签 |
| 生成器 | Hugo；布局自管（本仓库 `layouts/`、`assets/`） |
| 后端 | 无。评论 = Giscus。搜索 = 构建后 Pagefind。 |
| 路径 | `/posts/<slug>/`、`/series/<series>/`、`/tags/<tag>/` |
| 主题来源 | 自管布局，不用第三方主题 submodule |

参考 [coinvado.net](https://coinvado.net/)（Hugo 0.163.3 + GitHub Pages）的静态托管形态；不参考其 permalink（文章挂在 `/slug/`）和信息架构（SEO 教程站 vs 系列优先的学习笔记）。

## 架构

仓库根目录就是一个 Hugo 项目。不拆 `frontend/` / `backend/`。

```
hugo.toml
archetypes/
content/                 # 文章 + 系列说明页
layouts/                 # 站点骨架与各页面类型
assets/                  # CSS、主题/搜索相关 JS
static/                  # favicon、logo
public/                  # 构建产物，gitignore
```

流程：改 Markdown → 本地 `hugo server` → 之后 `hugo` + Pagefind → 把 `public/` 丢到 GitHub Pages 或 Cloudflare Pages。

浏览器里只跑三块：主题脚本（`prefers-color-scheme` + `localStorage`）、Pagefind、文章页 Giscus。没有应用服务器、数据库、钱包。

## 内容模型

文章放 `content/posts/*.md`。系列用自定义 taxonomy `series`。标签用 Hugo 内置 `tags`。系列说明放在 `content/series/<id>/_index.md`。

Front matter：

- `title`（必填）
- `date`（必填）
- `summary`（列表与 RSS）
- `draft`（为 true 时仅本地可见）
- `series`（可选字符串；最多一个）
- `seriesOrder`（整数；系列内章节顺序）
- `tags`（字符串数组）
- `toc`（布尔，默认 true）
- 可选 `slug`

用 archetype：`hugo new posts/<name>.md` 自动带上上述字段。

系列名写错时构建仍可通过，但该文不会出现在对应系列页（按「无系列」处理）。缺 `title` 或 `date` 必须构建失败。

## 页面

- `/` — 最新若干文章 + 系列入口卡片（标题、简介、篇数）
- `/posts/` — 按日期倒序列表，必要时分页
- `/series/<id>/` — 系列说明 + 按 `seriesOrder` 排列的章节
- `/posts/<slug>/` — 文章：元信息、可折叠 TOC、正文、系列内上一章/下一章（无系列则按日期相邻）、其下 Giscus
- `/tags/<tag>/` — 该标签下的文章
- `/index.xml` — v1 必做全站 RSS。分系列 feed：若 Hugo 少改布局就能出则做，否则进延期清单

搜索：构建后用 Pagefind 扫 `public/`；顶栏搜索入口。索引不存在时搜索框禁用，并提示先跑构建/索引。

Giscus：仅文章页。仓库/Discussions 未配置时显示占位文案，不加载第三方脚本。Giscus 主题与 `data-theme` 对齐。

主题：默认跟随系统；顶栏按钮强制浅/深并写入 `localStorage`；清除选择后回到跟随系统。

## v1 质量底线

- `hugo` 能干净构建
- 种子内容：Uniswap V2 系列至少两篇有序章节；一篇 OpenZeppelin（或同类）带标签的文章——足以点通首页、系列、标签、TOC、上一章/下一章
- 系统主题 + 手动覆盖可用
- RSS 能被阅读器打开
- v1 不做浏览器 E2E；作者本地走一遍即可

## 延期清单（v2、v3 及以后）

设计过程中想到、明确不进 v1 的事项。后续可从这里挑，不当作承诺。

### 产品 / 信息架构

- 文档站式常驻左侧目录作为主骨架
- 笔记库式卡片网格或时间线当首页
- 一篇文章挂多个系列
- 文章嵌在 `content/<series>/` 下，而不是 `posts/` + taxonomy
- 像 coinvado 那样用根路径 permalink（`/slug/` 而非 `/posts/slug/`）
- 按标签推荐相关文章（超出系列上一章/下一章）
- 阅读进度条；超出 Hugo 阅读时长之外的「剩余时间」
- 置顶/精选、摄影类 hero
- 导航里的关于 / now / 演讲页（有真实文案再加）
- 激进 SEO：IndexNow、额外 JSON-LD
- 多语言 / 语言切换
- 按标签出 RSS；邮件 newsletter
- 付费墙、会员、打赏

### 写作 / CMS

- Web 后台或无头 CMS
- Git 型 CMS（Decap、Tina）或 Notion/Obsidian 同步
- 审稿流程、定时发布
- 超出仓库内 Markdown/图片的图表流水线
- MDX / React islands（那时更适合考虑 Astro）
- CI 内编译文中 Solidity 片段

### 评论 / 社区

- 自建评论（Remark42、Isso、Waline、Twikoo）
- 在 GitHub 仓库还不存在时就接好 Giscus（v1 未配置前只做占位）
- 点赞反应；Discord/QQ 当产品表面
- 账号系统

### 搜索 / 发现

- Fuse.js、`index.json`、Algolia、Meilisearch
- 独立搜索路由与排序 UI
- AI 摘要或「问这篇文章」

### 视觉 / 主题

- 继续用第三方 Hugo 主题的 git submodule 跟踪上游
- 拷贝主题进来但仍跟踪上游版本
- Visual companion 出图迭代
- 钱包连接、ENS 资料、重动效 dApp 壳
- 链上发布、内容哈希、代币门禁

### 平台

- 拆成 `frontend/` + `backend/`
- Next.js、Astro、VitePress、Fumadocs（v1 不用，不等于永远不用）
- 生产域名、TLS、CI 部署、预览 URL
- 分析统计、错误上报
- 浏览器 E2E
- CI 里的死链检查
- 图片 CDN / 自动生成 OG 图

### 内容运营

- 从旁边实验仓库（如 `v2-core`、OpenZeppelin 检出）灌成已发布文章
- 针对 GitHub 源码行号的引用体例
- 跨系列版本关系（如 Uniswap v2 vs v3）

## 测试（v1）

手动：`hugo server`、种子文章、深浅色、系列上一章/下一章、标签页、RSS。以后可选：CI 跑 `hugo --gc --minify` 和死链检查。

## 开放配置（不挡设计）

- Giscus：GitHub 仓库名、Discussions 分类
- Pagefind：安装与构建命令写在实现计划里
- 颜色 token：实现阶段定；须支持系统主题，并偏 Web3 观感（深色底、明确强调色；不要无脑复刻 coinvado 的紫渐变 SaaS 脸）
