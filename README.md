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

```bash
./scripts/verify-build.sh
```

脚本执行 `hugo --gc --minify` 并检查 `public/index.html` 是否存在。

## 仓库结构（概要）

- `hugo.toml` — 站点配置
- `content/` — Markdown 内容
- `layouts/` — 页面模板（自管）
- `public/` — 构建产物（已 gitignore）
