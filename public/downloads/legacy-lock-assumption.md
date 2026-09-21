---
title: 粗粒度全局互斥锁在集群同步中的设计（已废弃）
publishedDate: '2023-08-12'
tags:
  - 并发
  - 分布式锁
  - 历史认知
lifecycle:
  status: superseded
  confidence: 0.25
  last_verified: '2026-09-21'
description: 早期探索分布式锁时的简易单点模型，已被证明在高并发场景下存在死锁雪崩隐患。
revisions:
  - date: '2023-08-12'
    commit: 1b9e8a
    summary: 提出基于 Redis SETNX 的中心化排他锁
  - date: '2024-06-10'
    commit: 2f3d5c
    summary: 正式废弃：发生两起死锁级长尾阻塞，推翻该方案
superseded_by: consensus-decay
---
## 1. 早期方案回顾

在系统设计初期，为了极简交付，曾采用单一主节点持有互斥凭证：

$$ L_{\text{global}} = \text{AcquireLock}(\tau) $$

---

## 2. 为什么该结论已被完全推翻

在实际集群节点扩容后，由于时钟漂移和网络延迟，客户端续约失败直接导致了严重脑裂现象。请读者参阅后续基于拜占庭衰减推导的新方案。
