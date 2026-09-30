---
title: "GitUp 中文使用手册（速查版）"
slug: gitup-guide
date: 2026-09-30
summary: "macOS 原生 Git 客户端 GitUp 速查：图谱操作、撤销、快照与常用快捷键。"
draft: false
series: tools
seriesOrder: 1
tags: [git, gitup, macos]
toc: true
---


> 基于官方文档、GitHub Wiki、官网及社区资料整理翻译
> 适用平台：macOS 12.4+
> 项目地址：https://github.com/git-up/GitUp
> 官方网站：https://gitup.co/

---

## 一、GitUp 是什么

GitUp 是一款**原生 macOS 免费开源 Git 客户端**（GPL-3.0），作者 Pierre-Olivier Latour（@swisspol），2015 年发布。

它与其他 Git GUI 最大的区别：**不调用 git 命令行，直接读写磁盘上的 `.git` 数据库**。这带来三个核心优势：

1. **极快**：官方 Git 仓库 40,000 个 commit 的完整图谱加载不到 1 秒
2. **可撤销一切**：包括 rebase、merge、reset 等破坏性操作，`Cmd+Z` 即可回滚
3. **图谱即操作**：直接拖拽 commit 节点完成 rebase、排序、合并，不用记命令

---

## 二、安装方式

### 方式 1：官网下载（推荐）
1. 访问 https://github.com/git-up/GitUp/releases
2. 下载最新稳定版（tag 以 `v` 开头，如 `v1.2.3`）
3. 拖入 `/Applications`

### 方式 2：Homebrew
```bash
brew install --cask gitup
```

### 方式 3：源码编译（需 Xcode）
```bash
git clone --recursive https://github.com/git-up/GitUp.git
cd GitUp
open GitUp.xcodeproj
# Xcode 中选择 GitUp scheme，Cmd+R 运行
```

---

## 三、三大核心视图

GitUp 只有三个主视图，通过 `Cmd+数字` 切换：

| 快捷键 | 视图 | 用途 |
|---|---|---|
| `Cmd+1` | **Map（图谱视图）** | 查看/操作分支提交历史图，核心工作区 |
| `Cmd+2` | **Commit（提交视图）** | 查看工作区改动、暂存、创建提交 |
| `Cmd+3` | **Branches（分支视图）** | 列出所有分支、tag，管理分支 |

> 每个仓库独立记忆上次退出时所在视图，下次打开自动恢复。

---

## 四、Map 图谱视图（最常用）

### 4.1 基础导航

| 操作 | 效果 |
|---|---|
| **单击** commit 节点 | 选中该 commit（不切换代码） |
| **双击** commit 节点 | `git checkout` 检出该 commit（会切换 HEAD，慎用） |
| **空格 Space** | 打开 Quick View 面板：查看 commit message + 完整 diff |
| `↑` / `↓` | 在 commit 节点间上下移动选中 |
| 鼠标滚轮 / 双指滑动 | 滚动图谱 |
| 双指缩放 | 缩放图谱 |

> **重要避坑**：想看 commit 详情用「单击 + 空格」，不要双击——双击会直接 checkout 切换代码到旧版本，导致 detached HEAD。

### 4.2 右键菜单（commit 节点上）

在任意 commit 节点上右键，可执行以下操作（括号内为快捷键）：

| 操作 | 快捷键 | 说明 |
|---|---|---|
| Quick View | `Space` | 快速查看 commit 详情和 diff |
| Diff with HEAD | `I` | 对比该 commit 与当前 HEAD 的差异 |
| Diff with Parent | — | 对比该 commit 与其父提交的差异 |
| Checkout Detached HEAD | — | 检出该 commit（进入分离头指针状态） |
| **Edit Message / Reword** | `E` | 修改该 commit 的提交信息（无需 rebase） |
| **Squash with Parent** | `S` | 将该 commit 合并到父提交（squash） |
| Swap with Parent (Move Down) | `D` | 与父提交交换位置（向下移） |
| Swap with Child (Move Up) | `U` | 与子提交交换位置（向上移） |
| **Delete** | — | 删除该 commit |
| **Rewrite** | `W` | 重写该 commit（修改其内容） |
| **Split** | — | 将一个 commit 拆分成多个 commit |
| Revert Current Branch | `Option+S` | 反向提交，撤销该 commit 的改动 |
| **Cherry-Pick** | `R` | 将该 commit 拣选到当前分支 |
| Merge Current Branch onto Here | `M` | 把当前分支合并到该 commit 位置 |
| **Rebase Current Branch onto Here** | `Option+R` | 把当前分支变基到该 commit |
| Set Tip of Current Branch Here | `Option+T` | 将当前分支指针强制移到该 commit（等价 reset --hard） |
| Add Tag | — | 在该 commit 打 tag |
| Create Branch | `B` | 从该 commit 新建分支 |

### 4.3 拖拽操作（GitUp 最强功能）

直接用鼠标拖拽 commit 节点即可完成复杂操作：

- **拖拽 commit 到另一个分支上** → 交互式 rebase
- **拖拽 commit 到其父提交上方/下方** → 调整提交顺序
- **拖拽一个 commit 到另一个 commit 上** → squash 合并
- 所有拖拽操作**实时预览**结果，不满意直接 `Cmd+Z` 撤销

### 4.4 搜索

顶部搜索框支持即时搜索：
- commit message（提交信息）
- author（作者）
- diff content（diff 中的代码内容）
- 分支名、tag 名

输入关键词后实时过滤，点击结果直接跳转到对应 commit。

---

## 五、Commit 提交视图（`Cmd+2`）

### 5.1 两种模式

GitUp 提交视图有两种模式，在 `Preferences（偏好设置）` 中切换：

| 模式 | 行为 | 对应命令行 |
|---|---|---|
| **Advanced（高级，默认）** | 区分暂存区(index)和工作区(workdir)，支持按代码块(hunk)部分暂存 | `git add` + `git commit` |
| **Simple（简易）** | 合并暂存区和工作区，勾选文件即全部提交 | `git commit -a` |

### 5.2 Advanced 模式操作

- 左侧列表显示工作区改动文件
- 勾选文件 = 暂存（`git add`）
- 点击文件可查看具体 diff，支持**按 hunk 单独暂存**（部分提交）
- 底部输入 commit message，点击 Commit 按钮提交
- 支持 `Amend` 修改上一次提交

### 5.3 Simple 模式操作

- 不区分暂存区，直接勾选要提交的文件
- 不能做部分暂存（一个文件要么全提交，要么不提交）
- 适合新手和快速提交场景

---

## 六、Branches 分支视图（`Cmd+3`）

- 列出所有本地分支、远程分支、tag
- 选中分支后下方显示该分支的 commit 列表
- 右键分支可：checkout、rename、delete、merge、rebase
- 双击分支 = checkout 切换到该分支

---

## 七、王牌功能：Undo / Redo（撤销重做）

这是 GitUp 区别于所有其他 Git 客户端的核心功能。

| 快捷键 | 功能 |
|---|---|
| `Cmd+Z` | 撤销上一次操作 |
| `Cmd+Shift+Z` | 重做 |

**可撤销的操作包括**：
- commit / amend
- rebase（包括交互式 rebase）
- merge
- reset（包括 --hard）
- branch 删除 / 重命名
- cherry-pick
- 拖拽操作
- 甚至**在命令行里做的 git 操作**，回到 GitUp 也能 `Cmd+Z` 撤销

> 原理：GitUp 在每次破坏性操作前自动创建轻量快照，基于 reflog 实现语义级回滚，不是简单的命令历史。

---

## 八、王牌功能：Snapshots（快照）

类似 macOS 的 Time Machine，GitUp 会自动记录仓库每次状态变更。

### 手动创建快照
- 菜单 `Repository → Create Snapshot`
- 或在 Map 视图按 `s` 键

### 恢复快照
- 右侧边栏打开 Snapshots 面板
- 点击任意快照 → 一键回滚到该状态
- 快照记录：所有分支指针、tag、HEAD 位置

### 适用场景
- 做危险操作（rebase、force push）前先打快照
- 实验性分支策略测试
- 复杂 merge 冲突排查

---

## 九、Reflog 浏览器

GitUp 内置可视化 reflog 浏览器，比命令行 `git reflog` 友好得多：

- 每条记录带上下文、时间戳、预览 diff
- 可以找回已经"删除"的 commit
- 从 last-resort 恢复工具变成日常导航工具

---

## 十、其他实用功能

### 10.1 Stash（暂存）
- `Cmd+Shift+S` 或菜单操作 stash
- 支持 stash pop / apply / drop
- Stash 列表在侧边栏可见

### 10.2 远程操作（Fetch / Pull / Push）
- 右下角按钮或菜单操作
- GitUp 调用系统 git 执行网络操作，**代理配置走本机 git config**
- 没有内置代理面板，需在终端配置：
  ```bash
  # 全局代理
  git config --global http.proxy socks5://127.0.0.1:1086
  # 仅针对 GitHub
  git config --global http.https://github.com.proxy socks5://127.0.0.1:1086
  ```

### 10.3 冲突解决
- merge/rebase 冲突时，GitUp 会标记冲突文件
- 右键可选择用内置编辑器或外部 diff 工具解决
- 解决后标记为 resolved，继续操作

### 10.4 子模块（Submodule）
- 支持初始化、更新、同步子模块
- 子模块在图谱中以特殊标记显示

---

## 十一、完整快捷键速查表

### 全局
| 快捷键 | 功能 |
|---|---|
| `Cmd+1` | 切换到 Map 图谱视图 |
| `Cmd+2` | 切换到 Commit 提交视图 |
| `Cmd+3` | 切换到 Branches 分支视图 |
| `Cmd+Z` | 撤销 |
| `Cmd+Shift+Z` | 重做 |
| `Cmd+,` | 打开偏好设置 |
| `Cmd+O` | 打开仓库 |
| `Cmd+W` | 关闭当前仓库窗口 |

### Map 视图
| 快捷键 | 功能 |
|---|---|
| `Space` | Quick View 查看选中 commit 详情 |
| `↑` / `↓` | 上下移动选中 commit |
| `E` | Edit Message 修改提交信息 |
| `S` | Squash with Parent 合并到父提交 |
| `D` | Swap with Parent 与父提交交换（下移） |
| `U` | Swap with Child 与子提交交换（上移） |
| `W` | Rewrite 重写 commit |
| `R` | Cherry-Pick 拣选到当前分支 |
| `M` | Merge 合并当前分支到此处 |
| `Option+R` | Rebase 当前分支到此处 |
| `Option+T` | Set Tip 强制移动分支指针到此处 |
| `Option+S` | Revert 反向提交 |
| `B` | 从选中 commit 新建分支 |
| `I` | Diff with HEAD 对比当前 HEAD |
| `s` | 创建 Snapshot 快照 |

### Commit 视图
| 快捷键 | 功能 |
|---|---|
| `Cmd+Enter` | 提交 |
| `Space` | 选中/取消选中文件 |
| `Tab` | 在文件列表和 message 输入框间切换 |

---

## 十二、命令行启动 GitUp

GitUp 没有自带 CLI 命令，用 macOS `open` 命令即可：

```bash
# 打开当前目录仓库
open -a GitUp .

# 打开指定路径仓库
open -a GitUp /path/to/repo
```

### 配置别名（推荐）
在 `~/.zshrc` 中添加：
```zsh
alias gitup='open -a GitUp .'
```
生效：`source ~/.zshrc`，之后 `cd repo && gitup` 即可。

### 打开后自动跳到 Commit 视图
```zsh
alias gitup='open -a GitUp . && osascript -e '\''tell application "GitUp" to activate'\'' -e '\''tell application "System Events" to keystroke "2" using command down'\'''
```
> 需在「系统设置 → 隐私与安全性 → 辅助功能」给终端授权。

---

## 十三、常见问题

### Q1：GitUp 支持调整字体大小吗？
不支持 App 内单独调字号。可通过 macOS 系统设置 → 辅助功能 → 显示 → 文本大小 全局调整。

### Q2：GitUp 有代理设置吗？
没有内置代理面板。网络操作（fetch/pull/push）调用系统 git，代理通过 `git config` 配置，见第十章。

### Q3：双击 commit 后代码变了怎么办？
双击 = checkout，进入 detached HEAD。切回你的分支即可：`Cmd+3` 打开分支视图，双击目标分支。或直接 `Cmd+Z` 撤销。

### Q4：Simple 模式和 Advanced 模式怎么选？
- 新手 / 快速提交 / 不需要部分暂存 → Simple
- 需要按 hunk 部分提交 / 精细拆分 commit → Advanced（默认）

### Q5：GitUp 支持 Windows / Linux 吗？
不支持，仅 macOS（及 iOS 上的 GitUpKit 框架）。Windows 用户可用 TortoiseGit。

### Q6：和 SourceTree / GitHub Desktop 比有什么优劣？
| 维度 | GitUp | SourceTree | GitHub Desktop |
|---|---|---|---|
| 速度 | 极快（直读数据库） | 较慢（包装命令行） | 中等 |
| 撤销能力 | 几乎所有操作可撤销 | 有限 | 有限 |
| 交互式 rebase | 拖拽可视化，极强 | 支持但操作繁琐 | 不支持 |
| 远程平台集成 | 弱（无 PR 面板） | 强（GitHub/GitLab/Bitbucket） | 强（仅 GitHub） |
| 学习曲线 | 低（图谱直观） | 中 | 极低 |
| 适合场景 | 本地历史操作、大仓库 | 团队全功能 | GitHub 简单工作流 |

---

## 十四、学习资源

- 官方网站：https://gitup.co/
- GitHub 仓库：https://github.com/git-up/GitUp
- GitHub Wiki：https://github.com/git-up/GitUp/wiki
- Release 下载：https://github.com/git-up/GitUp/releases
- Issues 反馈：https://github.com/git-up/GitUp/issues

---

*本手册基于 GitUp 官方文档及社区资料整理，最后更新：2026-09-30*
