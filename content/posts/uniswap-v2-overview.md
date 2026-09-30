---
title: "Uniswap V2 概览"
slug: uniswap-v2-overview
date: 2026-09-01
summary: "Uniswap V2 的核心组件与恒定乘积 AMM 直觉。"
draft: false
series: uniswap-v2
seriesOrder: 1
tags: [uniswap, amm]
toc: true
---

Uniswap V2 是以太坊上广泛使用的自动做市协议。与订单簿不同，流动性由 LP 存入资金池，交易者按池内储备与手续费规则成交，价格由 **x·y = k** 约束隐式决定。

## 核心合约

- **Factory**：部署并登记交易对（Pair），同一 token 对只对应一个 Pair 地址。
- **Pair**：持有两种 ERC-20 储备，处理 swap、mint/burn 流动性，并累积协议费。
- **Router02**：面向用户的封装，处理 ETH/WETH 包装、多跳路径与最小输出校验。

## 阅读顺序建议

先理解 Pair 上的储备更新与 `swap` 不变量，再回头看 Router 如何组装 calldata 与 deadline。下一篇进入 Pair 合约细节。
