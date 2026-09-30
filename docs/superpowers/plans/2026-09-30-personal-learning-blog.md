# 个人学习博客（Hugo）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，按任务逐项实现。步骤使用 checkbox（`- [ ]`）跟踪。

**Goal:** 在 `blockchain_tech` 根目录落地一个可长期自用的 Hugo 静态学习博客：系列 + 标签、系统主题、Pagefind 搜索、Giscus 占位、RSS、种子文章。

**Architecture:** 单仓库 Hugo 项目，自管 `layouts/` + `assets/`，无 backend。Markdown 在 `content/`；构建产物在 `public/`。浏览器只跑主题脚本、Pagefind、文章页 Giscus。

**Tech Stack:** Hugo（Extended 推荐，≥0.120）、原生 CSS 变量、少量原生 JS、Pagefind（构建后索引）、Giscus（可配置占位）

**Spec:** `docs/superpowers/specs/2026-09-30-personal-learning-blog-design.md`

## Global Constraints

- 文档与用户可见文案用中文；代码标识符、路径、front matter 字段名用英文。
- 不引入第三方 Hugo 主题 submodule；布局写在本仓库。
- 不拆 `frontend/` / `backend/`；v1 无数据库、无钱包、无 CMS。
- Permalink：`/posts/<slug>/`、`/series/<series>/`、`/tags/<tag>/`。
- 一篇文章最多一个 `series`；章节顺序用 `seriesOrder`。
- 主题默认跟随系统，可手动覆盖并写入 `localStorage`。
- Giscus 未配置时只显示占位，不加载第三方脚本。
- Pagefind 索引缺失时搜索框禁用并提示。
- 视觉：Web3 向（深色底、明确强调色）；不要无脑复刻 coinvado 紫渐变 SaaS 脸。
- 实现过程中凡是「想到但不进 v1」的，追加到规格文档的「延期清单」，不要悄悄做进去。

---

## 文件结构（锁定）

| 路径 | 职责 |
| --- | --- |
| `hugo.toml` | 站点配置、permalink、taxonomy、参数（Giscus 等） |
| `.gitignore` | 忽略 `public/`、`resources/`、`.hugo_build.lock`、Pagefind 本地缓存等 |
| `archetypes/posts.md` | 新文章 front matter 模板 |
| `content/posts/*.md` | 文章 |
| `content/series/<id>/_index.md` | 系列说明页 |
| `content/posts/_index.md` | 文章列表节标题 |
| `layouts/_default/baseof.html` | HTML 壳、顶栏、页脚、资源引入 |
| `layouts/_default/home.html` | 首页：最新文章 + 系列卡片 |
| `layouts/posts/single.html` | 文章页：TOC、上一章/下一章、Giscus |
| `layouts/posts/list.html` | `/posts/` 列表 |
| `layouts/series/term.html` | 系列页：说明 + 按 `seriesOrder` 排序 |
| `layouts/series/list.html` | `/series/` 全部系列索引 |
| `layouts/tags/term.html` | 标签页 |
| `layouts/tags/list.html` | `/tags/` 标签云 |
| `layouts/partials/header.html` | 顶栏导航 + 主题按钮 + 搜索入口 |
| `layouts/partials/footer.html` | 页脚 |
| `layouts/partials/post-card.html` | 文章卡片 |
| `layouts/partials/series-card.html` | 系列卡片 |
| `layouts/partials/toc.html` | 可折叠目录 |
| `layouts/partials/post-nav.html` | 上一章/下一章 |
| `layouts/partials/giscus.html` | Giscus 或占位 |
| `layouts/partials/search.html` | 搜索 UI |
| `layouts/partials/head.html` | meta、CSS、主题预闪脚本 |
| `assets/css/main.css` | 全部样式与 CSS 变量 |
| `assets/js/theme.js` | 主题切换 |
| `assets/js/search.js` | Pagefind 对接；无索引时禁用 |
| `static/favicon.svg` | 站点图标 |
| `scripts/build.sh` | `hugo` + `npx pagefind` |
| `scripts/verify-build.sh` | 构建后断言关键路径存在 |
| `README.md` | 安装 Hugo、本地预览、写文、构建索引 |

---

### Task 1: 脚手架（Hugo 配置 + gitignore + 验证脚本骨架）

**Files:**
- Create: `hugo.toml`
- Create: `.gitignore`
- Create: `scripts/verify-build.sh`
- Create: `README.md`
- Create: `content/posts/_index.md`
- Create: `layouts/_default/baseof.html`（最小壳，Task 2 再充实）
- Create: `layouts/_default/home.html`（最小）
- Create: `layouts/_default/list.html`（最小）
- Create: `layouts/_default/single.html`（最小）

**Interfaces:**
- Consumes: 无
- Produces: 可构建的最小 Hugo 站点；`scripts/verify-build.sh` 检查 `public/index.html`

- [ ] **Step 1: 确认本机 Hugo**

Run:

```bash
command -v hugo || brew install hugo
hugo version
```

Expected: 打印 Hugo 版本（建议 Extended，≥0.120）。

- [ ] **Step 2: 写入 `hugo.toml`**

```toml
baseURL = "http://localhost:1313/"
languageCode = "zh-cn"
title = "链上笔记"
defaultContentLanguage = "zh-cn"
enableRobotsTXT = true
summaryLength = 80

[pagination]
  pagerSize = 20

[permalinks]
  posts = "/posts/:slug/"

[taxonomies]
  tag = "tags"
  series = "series"

[params]
  description = "协议与 Solidity 长期学习笔记"
  giscusRepo = ""
  giscusRepoId = ""
  giscusCategory = "Announcements"
  giscusCategoryId = ""

[markup]
  [markup.highlight]
    style = "monokai"
    lineNos = false
    noClasses = false
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3
    ordered = false

[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML"]
  term = ["HTML", "RSS"]
```

- [ ] **Step 3: 写入 `.gitignore`**

```gitignore
public/
resources/
.hugo_build.lock
.DS_Store
node_modules/
```

- [ ] **Step 4: 最小布局与内容**

`content/posts/_index.md`:

```markdown
---
title: "文章"
---
```

`layouts/_default/baseof.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>{{ .Title }}</title></head>
<body>{{ block "main" . }}{{ end }}</body>
</html>
```

`layouts/_default/home.html`、`list.html`、`single.html` 均为：

```html
{{ define "main" }}{{ .Title }}{{ end }}
```

`scripts/verify-build.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
hugo --gc --minify
test -f public/index.html
echo "verify-build: base OK"
```

```bash
chmod +x scripts/verify-build.sh
```

- [ ] **Step 5: 跑验证**

Run: `./scripts/verify-build.sh`  
Expected: 打印 `verify-build: base OK`。

- [ ] **Step 6: README 开头**

说明安装 Hugo、`hugo server`、`./scripts/verify-build.sh`、自管布局。

- [ ] **Step 7: Commit**

```bash
cd /Users/xushiying/Projects/lbc-2026s3/blockchain/blockchain_tech
git init   # 仅当尚无 .git
git add hugo.toml .gitignore content/posts/_index.md layouts scripts README.md docs
git commit -m "$(cat <<'EOF'
chore: scaffold Hugo learning blog

EOF
)"
```

---

### Task 2: 基础布局壳 + CSS 主题变量 + 顶栏页脚

**Files:**
- Create: `layouts/partials/head.html`
- Create: `layouts/partials/header.html`
- Create: `layouts/partials/footer.html`
- Create: `layouts/partials/search.html`（空壳或最小 input，Task 6 充实）
- Modify: `layouts/_default/baseof.html`
- Create: `assets/css/main.css`
- Create: `assets/js/theme.js`
- Create: `static/favicon.svg`

**Interfaces:**
- Consumes: `hugo.toml` 的 `params.description`
- Produces: `data-theme` 为 `light` | `dark` | 缺省（跟随系统）；`localStorage` key = `theme`

- [ ] **Step 1: `head.html`（防闪烁）**

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} · {{ .Site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<link rel="icon" href="{{ "favicon.svg" | relURL }}">
{{ with .OutputFormats.Get "RSS" }}
<link rel="alternate" type="application/rss+xml" title="{{ $.Site.Title }}" href="{{ .RelPermalink }}">
{{ end }}
<script>
(function () {
  var saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }
})();
</script>
{{ $css := resources.Get "css/main.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}">
```

- [ ] **Step 2: header / footer**

顶栏：首页、文章、系列、标签；`#theme-toggle`；`{{ partial "search.html" . }}`。  
页脚：©、站点名、「内容仅供学习」、RSS。

- [ ] **Step 3: 更新 `baseof.html`**

引入 head、header、`<main class="container">`、footer、`theme.js`（fingerprint + defer）、`{{ block "scripts" . }}`。

- [ ] **Step 4: `main.css`**

`:root` 与 `[data-theme="dark"]` / `[data-theme="light"]`，以及未设 `data-theme` 时的 `@media (prefers-color-scheme: dark)`。变量：`--bg`、`--surface`、`--text`、`--text-muted`、`--border`、`--accent`、`--accent-2`、`--code-bg`、`--radius`、`--max-width`（约 720–760px）。强调色偏青绿/琥珀链感，避免默认紫白 SaaS。

- [ ] **Step 5: `theme.js`**

点击在「强制浅 → 强制深 → 清除回到跟随系统」间循环（或浅/深/跟随三态，与规格一致）。`localStorage` key：`theme`。

- [ ] **Step 6: `favicon.svg`**

简单几何图标即可。

- [ ] **Step 7: 验证**

`hugo server`：顶栏可见；主题按钮切换且刷新保持。  
`./scripts/verify-build.sh`：PASS。

- [ ] **Step 8: Commit**

```bash
git add layouts assets static
git commit -m "$(cat <<'EOF'
feat: add base layout and system theme toggle

EOF
)"
```

---

### Task 3: 内容模型（archetype + 系列 + 种子文章）

**Files:**
- Create: `archetypes/posts.md`
- Create: `content/series/uniswap-v2/_index.md`
- Create: `content/posts/uniswap-v2-overview.md`
- Create: `content/posts/uniswap-v2-pair.md`
- Create: `content/posts/openzeppelin-ownable.md`
- Modify: `scripts/verify-build.sh`

**Interfaces:**
- Consumes: taxonomy `series`、`tags`
- Produces: front matter 字段 `title`、`date`、`summary`、`draft`、`series`、`seriesOrder`、`tags`、`toc`

- [ ] **Step 1: `archetypes/posts.md`**

```markdown
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
summary: ""
draft: true
series: ""
seriesOrder: 0
tags: []
toc: true
---
```

- [ ] **Step 2: 系列说明 + 三篇种子（`draft: false`）**

- `uniswap-v2` 系列 `_index.md`：中文简介  
- `uniswap-v2-overview.md`：`seriesOrder: 1`，`tags: [uniswap, amm]`，含至少两个 `##`  
- `uniswap-v2-pair.md`：`seriesOrder: 2`  
- `openzeppelin-ownable.md`：无 series，`tags: [openzeppelin, solidity]`，含代码围栏  

- [ ] **Step 3: 扩展 verify**

```bash
test -f public/posts/uniswap-v2-overview/index.html
test -f public/posts/uniswap-v2-pair/index.html
test -f public/posts/openzeppelin-ownable/index.html
test -d public/series/uniswap-v2
test -d public/tags/solidity
echo "verify-build: content OK"
```

Run: `./scripts/verify-build.sh`  
Expected: 含 `content OK`。

- [ ] **Step 4: Commit**

```bash
git add archetypes content scripts/verify-build.sh
git commit -m "$(cat <<'EOF'
feat: add content archetype and seed posts

EOF
)"
```

---

### Task 4: 列表与卡片（首页、文章列表、系列、标签）

**Files:**
- Create: `layouts/partials/post-card.html`
- Create: `layouts/partials/series-card.html`
- Modify: `layouts/_default/home.html`
- Create: `layouts/posts/list.html`
- Create: `layouts/series/term.html`
- Create: `layouts/series/list.html`
- Create: `layouts/tags/term.html`
- Create: `layouts/tags/list.html`
- Modify: `assets/css/main.css`

**Interfaces:**
- Consumes: `.Site.Taxonomies.series`、`.Params.seriesOrder`
- Produces: 系列页按 `seriesOrder` 升序；首页最新 5 篇 + 系列卡片

- [ ] **Step 1: post-card / series-card partials**

卡片含标题、日期、阅读时长、summary、标签；系列含描述与篇数。

- [ ] **Step 2: `home.html`**

系列区 `range` taxonomies；最新文章 `first 5` 的 `Section "posts"`。

- [ ] **Step 3: posts list + series/tags term/list**

系列 term：`.Content` + `{{ range (.Data.Pages.ByParam "seriesOrder") }}`。

- [ ] **Step 4: 验证**

手点首页 → 系列页顺序 1→2；`/tags/solidity/`；`/posts/`。  
`./scripts/verify-build.sh`。

- [ ] **Step 5: Commit**

```bash
git add layouts assets
git commit -m "$(cat <<'EOF'
feat: add home series cards and taxonomy list pages

EOF
)"
```

---

### Task 5: 文章页（TOC、上一章/下一章）

**Files:**
- Create: `layouts/posts/single.html`
- Create: `layouts/partials/toc.html`
- Create: `layouts/partials/post-nav.html`
- Create: `layouts/partials/giscus.html`（先占位，Task 7 完善条件加载）
- Modify: `assets/css/main.css`

**Interfaces:**
- Consumes: `.TableOfContents`、`.Params.toc`、`.Params.series`、`.Params.seriesOrder`
- Produces: 同系列按 `seriesOrder` 的 prev/next；无系列用 section 内日期相邻

- [ ] **Step 1: toc / post-nav / single**

`toc`：`details` 包裹；`toc: false` 或空 TOC 则不渲染。  
`post-nav`：有 series 则在 taxonomy pages 中按 `seriesOrder` 找邻章。  
`single`：元信息 + toc + content + post-nav + giscus。

- [ ] **Step 2: 验证**

overview → 下一章 pair；Ownable 页不报错。

- [ ] **Step 3: Commit**

```bash
git add layouts assets
git commit -m "$(cat <<'EOF'
feat: add post TOC and series prev/next navigation

EOF
)"
```

---

### Task 6: Pagefind 搜索

**Files:**
- Modify: `layouts/partials/search.html`
- Create: `assets/js/search.js`
- Create: `scripts/build.sh`
- Modify: `layouts/_default/baseof.html`
- Modify: `scripts/verify-build.sh`
- Modify: `README.md`
- Modify: `assets/css/main.css`

**Interfaces:**
- Consumes: `public/pagefind/pagefind.js`
- Produces: `scripts/build.sh` 执行 `hugo --gc --minify` 后 `npx --yes pagefind --site public`

- [ ] **Step 1: `scripts/build.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
hugo --gc --minify
npx --yes pagefind --site public
```

`chmod +x scripts/build.sh`

- [ ] **Step 2: search UI + JS**

用 `data-pagefind-url="{{ "pagefind/pagefind.js" | relURL }}"` 注入路径。  
import 失败：禁用输入，placeholder「请先运行 ./scripts/build.sh 生成索引」。

- [ ] **Step 3: verify 增加 pagefind 断言（直接 npx，勿与 build 互递归）**

```bash
hugo --gc --minify
npx --yes pagefind --site public
test -f public/pagefind/pagefind.js
echo "verify-build: pagefind OK"
```

测搜索推荐：

```bash
./scripts/build.sh
npx --yes serve public -p 4173
```

- [ ] **Step 4: Commit**

```bash
git add layouts assets scripts README.md
git commit -m "$(cat <<'EOF'
feat: add Pagefind search and build script

EOF
)"
```

---

### Task 7: Giscus 可配置接入

**Files:**
- Modify: `layouts/partials/giscus.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: `giscusRepo`、`giscusRepoId`、`giscusCategory`、`giscusCategoryId`
- Produces: 四者皆非空才加载 `https://giscus.app/client.js`；否则中文占位

- [ ] **Step 1: 条件渲染 script / 占位文案**（`data-theme="preferred_color_scheme"`，`data-lang="zh-CN"`）

- [ ] **Step 2: 验证未配置时无 giscus 网络请求**

- [ ] **Step 3: Commit**

```bash
git add layouts README.md
git commit -m "$(cat <<'EOF'
feat: add configurable Giscus with offline placeholder

EOF
)"
```

---

### Task 8: RSS 与 v1 收尾验收

**Files:**
- Modify: `scripts/verify-build.sh`（`test -f public/index.xml`）
- Modify: `README.md`
- Modify: 规格延期清单（仅当实现中新发现延期项）

**Interfaces:**
- Consumes: `[outputs]` 中的 RSS
- Produces: `/index.xml` 含至少一篇 item

- [ ] **Step 1: 断言 RSS**

```bash
test -f public/index.xml
```

- [ ] **Step 2: 手工验收清单全部通过**

- `hugo server` 可预览  
- 首页系列 + 最新文章  
- `/series/uniswap-v2/` 顺序 1→2  
- TOC、代码高亮、系列邻章  
- `/tags/solidity/`  
- 主题跟随 + 手动覆盖  
- `./scripts/build.sh` 后搜索可用  
- Giscus 占位  
- `/index.xml`  

- [ ] **Step 3: Commit**

```bash
git add scripts README.md docs
git commit -m "$(cat <<'EOF'
docs: finalize v1 blog workflow and RSS verify

EOF
)"
```

---

## 计划自检（对照规格）

| 规格要求 | 对应任务 |
| --- | --- |
| Hugo 自管布局、无 backend | Task 1–2 |
| front matter / series / tags / archetype | Task 3 |
| 首页最新 + 系列卡片 | Task 4 |
| 文章 TOC、上一章/下一章 | Task 5 |
| 系统主题 + 手动覆盖 | Task 2 |
| Pagefind 与缺失降级 | Task 6 |
| Giscus 占位 | Task 7 |
| RSS | Task 8 |
| 种子内容 | Task 3 + 8 |
| 延期项不实现 | Global Constraints |

---

**Gate 事实（写本文件前）：**

1. **引用方：** 无代码 import；执行实现的 agent / 你本人按本计划执行；与规格 `docs/superpowers/specs/2026-09-30-personal-learning-blog-design.md` 成对使用。  
2. **同类文件：** `docs/superpowers/plans/` 原先不存在；无同名计划。  
3. **数据 schema：** 无运行时数据文件；文章 front matter 字段见 Task 3。  
4. **用户原话：** 「继续」
