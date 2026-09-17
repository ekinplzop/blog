---
title: "JavaScript 事件循环微任务优先级的本质"
description: "深入 ECMAScript 规范与 V8 引擎内核，剖析 Microtask 与 Macrotask 的物理调度差异与心智模型。"
publishedDate: "2024-03-18"
tags: ["JavaScript", "V8", "异步编程"]
lifecycle:
  status: "evergreen"
  confidence: 0.98
  last_verified: "2026-01-10"
revisions:
  - date: "2024-03-18"
    commit: "4a2c1f"
    summary: "完成基于 V8 源码的任务队列拓扑解析"
superseded_by: null
---

## 1. 任务队列的物理结构

在浏览器主线程中，事件循环并不是一个无限轮询的单队列，而是维护着一个**微任务检查点（Microtask Checkpoint）**机制。

每次从调用栈退出、或宏任务（Macrotask）执行完毕后，引擎会立即排空（Drain）整个微任务队列，直到队列完全为空。

```javascript
console.log('1. 宏任务开始');

setTimeout(() => {
  console.log('4. 定时器宏任务');
}, 0);

Promise.resolve().then(() => {
  console.log('2. 微任务 A');
}).then(() => {
  console.log('3. 微任务 B');
});
```

---

## 2. 调度执行时序形式化

若宏任务队列为 $\mathcal{M} = [m_1, m_2, \dots]$，微任务队列为 $\mu = [u_1, u_2, \dots]$，单个 Tick 的执行序列严格遵循：

$$ \text{Tick}(m_k) = \text{Exec}(m_k) \circ \left( \prod_{u \in \mu} \text{Exec}(u) \right) \circ \text{Render}() $$

这解释了为什么在微任务中发生无限递归时，页面渲染与宏任务将被彻底饿死（Starvation）。
