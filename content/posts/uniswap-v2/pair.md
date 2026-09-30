---
title: "Uniswap V2 Pair 合约要点"
slug: uniswap-v2-pair
date: 2026-09-08
summary: "Pair 上的储备、swap 与流动性份额。"
draft: false
series: uniswap-v2
seriesOrder: 2
tags: [uniswap, amm]
toc: true
---

`UniswapV2Pair` 是 V2 的状态中心：两种 token 的储备量、LP 份额（ERC-20）以及累计价格观测，都在此合约维护。

## 储备与价格

`getReserves` 返回排序后的 `(reserve0, reserve1)` 与时间戳。swap 前会校验输入是否已转入 Pair（`balance` 大于储备），再按恒定乘积公式扣除 0.3% 量级手续费后更新储备。

## swap 与回调

`swap` 允许将输出先转给 `to`，再可选调用 `uniswapV2Call` 完成 flash swap。实现自定义回调时务必在回调结束前还清债务，否则整笔交易 revert。

## 与系列前一篇的关系

概览中的 Factory/Router 都围绕 Pair 地址展开；调试问题时优先核对 Pair 储备与 token 排序（token0 < token1）。
