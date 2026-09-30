# 链上笔记

个人协议与 Solidity 学习笔记站（Hugo 静态站点）。布局与样式在本仓库 `layouts/`、`assets/` 自管，不使用第三方 Hugo 主题 submodule。

## 环境

安装 [Hugo Extended](https://gohugo.io/installation/)（建议 ≥ 0.120）：

```bash
command -v hugo || brew install hugo
hugo version
```

## 本地开发

```bash
hugo server
```

浏览器打开 `http://localhost:1313/`。页脚有全站 RSS：`/index.xml`。

## 写文章

```bash
hugo new posts/my-note.md
```

编辑 `content/posts/my-note.md` 的 front matter：`title`、`date`、`summary`、可选 `series` / `seriesOrder`、`tags`、`toc`。系列说明页在 `content/series/<id>/_index.md`。完成后用 `hugo server` 预览。

## 构建与验证

生产构建（Hugo + Pagefind 索引）：

```bash
./scripts/build.sh
```

验证脚本（Hugo + Pagefind，断言首页、种子文章、系列/标签、`public/index.xml`、Pagefind 索引；不调用 `build.sh`）：

```bash
./scripts/verify-build.sh
```

本地预览带搜索的静态产物：

```bash
./scripts/build.sh
npx --yes serve public -p 4173
```

说明：`hugo server` 不会生成 Pagefind 索引；若尚未运行 `./scripts/build.sh`，顶栏搜索框会禁用并提示先生成索引。

## 评论（Giscus）

文章页底部使用 [Giscus](https://giscus.app/)（GitHub Discussions）。在 `hugo.toml` 的 `[params]` 中填写以下四项；**四项均非空**时才会加载 `giscus.app` 脚本，否则仅显示中文占位文案，不产生第三方网络请求。

1. 在目标 GitHub 仓库开启 **Discussions**，并安装 [giscus 应用](https://github.com/apps/giscus)。
2. 打开 [giscus.app](https://giscus.app/zh-CN)，选择仓库与 Discussions 分类，页面会给出对应 ID。
3. 将值写入 `hugo.toml`：

```toml
[params]
  giscusRepo = "owner/repo"           # 例如 your-name/blockchain_tech
  giscusRepoId = "<repo-id>"          # 由 giscus.app 生成，勿编造
  giscusCategory = "General"          # Discussions 分类名称（与 giscus 向导一致）
  giscusCategoryId = "<category-id>"  # 由 giscus.app 生成，勿编造
```

本地改完后重新 `hugo server` 或 `./scripts/build.sh` 即可在文章页看到评论框。主题随系统深浅色（`preferred_color_scheme`），界面语言为 `zh-CN`。

## 仓库结构（概要）

- `hugo.toml` — 站点配置
- `content/` — Markdown 内容
- `layouts/` — 页面模板（自管）
- `assets/js/search.js` — Pagefind 搜索
- `scripts/build.sh` — Hugo + Pagefind
- `public/` — 构建产物（已 gitignore）
