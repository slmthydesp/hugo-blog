---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
# 对外 URL：/posts/<slug>/ ；子目录只用于仓库内分类，请显式写英文 slug
slug: "{{ .File.ContentBaseName }}"
date: {{ .Date }}
summary: ""
draft: true
series: ""
seriesOrder: 0
tags: []
toc: true
---

