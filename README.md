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

浏览器打开 `http://localhost:1313/`。

## 构建与验证

生产构建（Hugo + Pagefind 索引）：

```bash
./scripts/build.sh
```

验证脚本（同样会跑 Hugo 与 Pagefind，并断言产物；不调用 `build.sh`）：

```bash
./scripts/verify-build.sh
```

本地预览带搜索的静态产物：

```bash
./scripts/build.sh
npx --yes serve public -p 4173
```

说明：`hugo server` 不会生成 Pagefind 索引；若尚未运行 `./scripts/build.sh`，顶栏搜索框会禁用并提示先生成索引。

## 仓库结构（概要）

- `hugo.toml` — 站点配置
- `content/` — Markdown 内容
- `layouts/` — 页面模板（自管）
- `assets/js/search.js` — Pagefind 搜索
- `scripts/build.sh` — Hugo + Pagefind
- `public/` — 构建产物（已 gitignore）
