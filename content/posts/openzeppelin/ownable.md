---
title: "OpenZeppelin Ownable 速览"
slug: openzeppelin-ownable
date: 2026-09-15
summary: "单管理员权限模式与 transferOwnership 用法。"
draft: false
tags: [openzeppelin, solidity]
toc: true
---

OpenZeppelin 的 `Ownable` 为合约提供单一 **owner** 地址，并用 `onlyOwner` 修饰符保护敏感函数。适合协议参数、暂停开关等需要明确责任主体的场景。

继承后构造函数会调用 `_transferOwnership(msg.sender)`，部署者即首任 owner。变更 owner 应使用两步流程的 `Ownable2Step`，避免误转到错误地址后无法收回。

## 典型用法

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Config is Ownable {
    uint256 public feeBps;

    constructor(uint256 initialFee) Ownable(msg.sender) {
        feeBps = initialFee;
    }

    function setFeeBps(uint256 newFee) external onlyOwner {
        feeBps = newFee;
    }
}
```

## 注意点

`onlyOwner` 只解决「谁可以调用」，不替代业务层校验。若 owner 可为多签或 Timelock，应在部署脚本里把 ownership 转给对应合约地址。
