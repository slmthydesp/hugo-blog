# 链上笔记 — 常用命令速查
#
# 用法：
#   make            # 打印帮助
#   make serve      # 本地预览（改完自动刷新）
#   make build      # 生产构建 + 搜索索引
#   make verify     # 构建并检查关键页面是否存在
#   make preview    # 构建后用静态服务器预览（可测搜索）
#   make new NAME=openzeppelin/foo   # 新建文章（可带子目录）
#   make clean      # 清理构建产物
#
# 说明：本机 Hugo 若装在 ~/.local/bin，下面会自动加入 PATH。
# 文章按主题放在 content/posts/<主题>/ 下，URL 仍用 front matter 的 slug。

export PATH := $(HOME)/.local/bin:$(PATH)

.DEFAULT_GOAL := help

.PHONY: help serve build verify preview new clean version

## 显示本 Makefile 支持的目标
help:
	@echo "可用命令："
	@echo "  make serve            本地开发预览 → http://localhost:1313/"
	@echo "  make build            生产构建（Hugo + Pagefind 搜索索引）"
	@echo "  make verify           构建并断言首页/文章/系列/标签/RSS/搜索"
	@echo "  make preview          构建后静态预览 → http://localhost:4173/（可测搜索）"
	@echo "  make new NAME=主题/slug  新建文章，如 openzeppelin/access-control（默认 draft）"
	@echo "  make clean            删除 public/、resources/ 等构建缓存"
	@echo "  make version          打印 Hugo 版本"

## 本地开发：热更新预览（不含 Pagefind 搜索索引）
serve:
	hugo server

## 生产构建：生成 public/，并写入 Pagefind 搜索索引
build:
	./scripts/build.sh

## 冒烟验证：构建 + 检查关键路径是否生成成功
verify:
	./scripts/verify-build.sh

## 带搜索的静态预览（先 build，再 serve public）
preview: build
	npx --yes serve public -p 4173

## 新建文章。示例：make new NAME=openzeppelin/access-control
new:
ifndef NAME
	$(error 请指定路径，例如：make new NAME=openzeppelin/access-control)
endif
	hugo new posts/$(NAME).md
	@echo "已创建 content/posts/$(NAME).md — 请设置 slug，然后 make serve 预览"

## 清理构建产物与 Hugo 缓存
clean:
	rm -rf public resources .hugo_build.lock
	@echo "已清理 public/、resources/、.hugo_build.lock"

## 检查 Hugo 是否可用
version:
	hugo version
