---
title: "考研408 · 操作系统：02 进程与线程深度解析"
description: "进程实体、PCB 核心管理、五态与七态调度状态机流转（含 SVG 高清图解）、ULT/KLT 线程模型与四大经典同步互斥问题详解。"
publishedDate: "2024-09-10"
tags: ["考研408", "操作系统", "进程与线程", "高分笔记"]
lifecycle:
  status: "evergreen"
  confidence: 0.98
  last_verified: "2026-03-12"
revisions:
  - date: "2024-09-10"
    summary: "整理 408 历年真题核心知识点与进程线程调度模型"
---

## 2.1 进程概念与特征

- **进程**：系统进行资源分配和调度的一个独立单位（具备动态性）。
- **传统“程序”**：仅是一组静态的指令集合。

**PCB (Process Control Block)**：描述和管理进程信息的核心数据结构。
- **进程实体 (进程映像)**：$\text{PCB} + \text{程序段(代码)} + \text{数据段(变量)}$。
- 进程映像是进程运行的静态快照。
> **核心公理**：PCB 是进程存在的唯一标志；操作系统是 PCB 的唯一管理者。

### 进程五大特征
1. **动态性**：进程由创建而生、由撤销而亡（最本质特征）。
2. **并发性**：多个进程实体同存于内存中，并在一段时间内同时向前推进。
3. **独立性**：独立获得资源、独立接受调度的基本单位。
4. **异步性**：各自独立、以不可预知的速度向前推进（需要通过同步机制保证顺序）。
5. **结构性**：由 PCB、程序段、数据段组成。

---

## 2.2 进程状态与流转模型

进程按生命周期状态划分为：
- **创建态**：分配 PCB、申请内存资源。
- **就绪态**：已获得除 CPU 之外的一切必要资源。
- **运行态**：CPU 正在执行进程指令。
- **阻塞态**：等待某事件或 I/O 条件，就绪之前无法执行。
- **终止态**：系统回收资源，注销 PCB。

<svg viewBox="0 0 880 260" width="100%" height="260" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; display:block; margin:20px auto; max-width:100%; border-radius: 12px; border: 1px solid #e2e8f0;">
  <defs>
    <marker id="arr-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569"/>
    </marker>
    <marker id="arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16a34a"/>
    </marker>
    <marker id="arr-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ea580c"/>
    </marker>
    <marker id="arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#d97706"/>
    </marker>
  </defs>

  <rect x="20" y="30" width="95" height="48" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="67.5" y="60" text-anchor="middle" font-size="16" font-weight="bold" fill="#0369a1">创建态</text>

  <rect x="230" y="30" width="95" height="48" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="277.5" y="60" text-anchor="middle" font-size="16" font-weight="bold" fill="#14532d">就绪态</text>

  <rect x="520" y="30" width="95" height="48" rx="8" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
  <text x="567.5" y="60" text-anchor="middle" font-size="16" font-weight="bold" fill="#9a3412">运行态</text>

  <rect x="760" y="30" width="95" height="48" rx="8" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
  <text x="807.5" y="60" text-anchor="middle" font-size="16" font-weight="bold" fill="#334155">终止态</text>

  <rect x="375" y="180" width="100" height="48" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="425" y="210" text-anchor="middle" font-size="16" font-weight="bold" fill="#92400e">阻塞态</text>

  <line x1="115" y1="54" x2="222" y2="54" stroke="#475569" stroke-width="2" marker-end="url(#arr-gray)"/>
  <text x="170" y="45" text-anchor="middle" font-size="12" font-weight="bold" fill="#475569">创建完成</text>

  <line x1="325" y1="44" x2="512" y2="44" stroke="#16a34a" stroke-width="2" marker-end="url(#arr-green)"/>
  <text x="420" y="35" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">获得处理机(调度) ──►</text>

  <line x1="520" y1="64" x2="333" y2="64" stroke="#ea580c" stroke-width="2" marker-end="url(#arr-orange)"/>
  <text x="420" y="80" text-anchor="middle" font-size="12" font-weight="bold" fill="#ea580c">◄── 时间片用完 / 被抢占</text>

  <line x1="615" y1="54" x2="752" y2="54" stroke="#475569" stroke-width="2" marker-end="url(#arr-gray)"/>
  <text x="685" y="45" text-anchor="middle" font-size="12" font-weight="bold" fill="#475569">结束 / 异常</text>

  <line x1="520" y1="78" x2="480" y2="173" stroke="#d97706" stroke-width="2" marker-end="url(#arr-amber)"/>
  <text x="545" y="135" text-anchor="start" font-size="12" font-weight="bold" fill="#b45309">申请资源 / 等待事件 (主动)</text>

  <line x1="375" y1="180" x2="331" y2="85" stroke="#16a34a" stroke-width="2" marker-end="url(#arr-green)"/>
  <text x="315" y="135" text-anchor="end" font-size="12" font-weight="bold" fill="#15803d">等待事件发生 (被动唤醒)</text>
</svg>

---

## 2.3 线程实现方式与多线程模型

- **用户级线程 (ULT)**：由用户空间线程库管理，操作系统内核完全感知不到 ULT 的存在。
- **内核级线程 (KLT)**：由操作系统内核支持和管理，**内核级线程是处理机分配调度的基本物理单元**。

<div style="width: 100%; max-width: 920px; margin: 20px auto;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 480" width="100%" height="auto" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #cbd5e1;">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08"/>
      </filter>
    </defs>

    <rect x="10" y="10" width="900" height="460" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M 10 22 Q 10 10 22 10 L 898 10 Q 910 10 910 22 L 910 185 L 10 185 Z" fill="#f8fafc"/>
    <rect x="10" y="185" width="900" height="175" fill="#f1f5f9"/>
    <path d="M 10 360 L 910 360 L 910 458 Q 910 470 898 470 L 22 470 Q 10 470 10 458 Z" fill="#ffffff"/>
    <line x1="25" y1="185" x2="895" y2="185" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6 4"/>
    
    <text x="885" y="175" text-anchor="end" fill="#475569" font-size="14" font-weight="600">用户空间</text>
    <text x="885" y="208" text-anchor="end" fill="#475569" font-size="14" font-weight="600">内核空间</text>

    <!-- (a) 用户级方式 -->
    <g id="col-a">
      <path d="M 115 35 Q 119 40 115 45 Q 111 50 115 55 Q 119 60 115 65 Q 111 70 115 75 Q 119 80 115 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M 155 35 Q 159 40 155 45 Q 151 50 155 55 Q 159 60 155 65 Q 151 70 155 75 Q 159 80 155 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M 195 35 Q 199 40 195 45 Q 191 50 195 55 Q 199 60 195 65 Q 191 70 195 75 Q 199 80 195 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      
      <line x1="115" y1="85" x2="135" y2="115" stroke="#64748b" stroke-width="1.5"/>
      <line x1="155" y1="85" x2="155" y2="115" stroke="#64748b" stroke-width="1.5"/>
      <line x1="195" y1="85" x2="175" y2="115" stroke="#64748b" stroke-width="1.5"/>

      <rect x="115" y="115" width="80" height="32" rx="5" fill="#ffffff" stroke="#3b82f6" stroke-width="1.5" filter="url(#shadow)"/>
      <text x="155" y="136" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="600">线程库</text>
      <line x1="155" y1="147" x2="155" y2="265" stroke="#64748b" stroke-width="1.5"/>

      <circle cx="155" cy="290" r="24" fill="#ffffff" stroke="#0f172a" stroke-width="2" filter="url(#shadow)"/>
      <text x="155" y="298" text-anchor="middle" fill="#0f172a" font-size="20" font-weight="bold">P</text>
      <text x="155" y="390" text-anchor="middle" fill="#1e293b" font-size="15" font-weight="bold">(a) 用户级方式</text>
    </g>

    <!-- (b) 内核级方式 -->
    <g id="col-b">
      <path d="M 410 35 Q 414 40 410 45 Q 406 50 410 55 Q 414 60 410 65 Q 406 70 410 75 Q 414 80 410 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M 460 35 Q 464 40 460 45 Q 456 50 460 55 Q 464 60 460 65 Q 456 70 460 75 Q 464 80 460 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M 510 35 Q 514 40 510 45 Q 506 50 510 55 Q 514 60 510 65 Q 506 70 510 75 Q 514 80 510 85" fill="none" stroke="#2563eb" stroke-width="2"/>

      <line x1="410" y1="85" x2="410" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="460" y1="85" x2="460" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="510" y1="85" x2="510" y2="215" stroke="#64748b" stroke-width="1.5"/>

      <rect x="396" y="215" width="28" height="42" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <rect x="446" y="215" width="28" height="42" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <rect x="496" y="215" width="28" height="42" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>

      <line x1="410" y1="257" x2="448" y2="277" stroke="#64748b" stroke-width="1.5"/>
      <line x1="460" y1="257" x2="460" y2="266" stroke="#64748b" stroke-width="1.5"/>
      <line x1="510" y1="257" x2="472" y2="277" stroke="#64748b" stroke-width="1.5"/>

      <circle cx="460" cy="290" r="24" fill="#ffffff" stroke="#0f172a" stroke-width="2" filter="url(#shadow)"/>
      <text x="460" y="298" text-anchor="middle" fill="#0f172a" font-size="20" font-weight="bold">P</text>
      <text x="460" y="390" text-anchor="middle" fill="#1e293b" font-size="15" font-weight="bold">(b) 内核级方式</text>
    </g>

    <!-- (c) 组合方式 -->
    <g id="col-c">
      <path d="M 675 35 Q 679 40 675 45 Q 671 50 675 55 Q 679 60 675 65 Q 671 70 675 75 Q 679 80 675 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M 705 35 Q 709 40 705 45 Q 701 50 705 55 Q 709 60 705 65 Q 701 70 705 75 Q 709 80 705 85" fill="none" stroke="#2563eb" stroke-width="2"/>
      <path d="M 735 35 Q 739 40 735 45 Q 731 50 735 55 Q 739 60 735 65 Q 731 70 735 75 Q 739 80 735 85" fill="none" stroke="#2563eb" stroke-width="2"/>

      <rect x="665" y="115" width="80" height="32" rx="5" fill="#ffffff" stroke="#3b82f6" stroke-width="1.5" filter="url(#shadow)"/>
      <text x="705" y="136" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="600">线程库</text>

      <line x1="695" y1="147" x2="685" y2="215" stroke="#64748b" stroke-width="1.5"/>
      <line x1="715" y1="147" x2="725" y2="215" stroke="#64748b" stroke-width="1.5"/>

      <rect x="671" y="215" width="28" height="42" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <rect x="711" y="215" width="28" height="42" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>

      <line x1="685" y1="257" x2="698" y2="277" stroke="#64748b" stroke-width="1.5"/>
      <line x1="725" y1="257" x2="712" y2="277" stroke="#64748b" stroke-width="1.5"/>
      <circle cx="705" cy="290" r="24" fill="#ffffff" stroke="#0f172a" stroke-width="2" filter="url(#shadow)"/>
      <text x="705" y="298" text-anchor="middle" fill="#0f172a" font-size="20" font-weight="bold">P</text>

      <text x="755" y="390" text-anchor="middle" fill="#1e293b" font-size="15" font-weight="bold">(c) 组合方式</text>
    </g>
  </svg>
</div>

---

## 2.4 核心调度性能指标

在评价 CPU 调度算法优劣时，四大基准数学模型如下：

$$
\text{CPU 利用率} = \frac{\text{有效工作时间}}{\text{总运行时间}} \qquad \text{系统吞吐量} = \frac{\text{完成作业数}}{\text{总耗时}}
$$

$$
\text{周转时间} = \text{作业完成时间} - \text{作业提交时间} \qquad \text{带权周转时间} = \frac{\text{周转时间}}{\text{实际运行时间}} \ge 1
$$

**高响应比优先 (HRRN) 决策模型**：

$$
\text{响应比 } R_p = \frac{\text{等待时间} + \text{要求服务时间}}{\text{要求服务时间}} = 1 + \frac{\text{等待时间}}{\text{要求服务时间}}
$$

---

## 2.5 经典四大同步互斥问题速查

1. **生产者-消费者问题**：核心在于 $\text{P(empty)}$ 与 $\text{P(mutex)}$ 顺序绝对不可颠倒，否则触发互锁死锁。
2. **多生产者-多消费者问题**：当缓冲区容量为 1 时，可安全省略互斥信号量 `mutex`。
3. **读者-写者问题**：采用计数器思想——“第一个进来的读者上写锁，最后一个离开的读者解写锁”；引入排队锁 `w` 保证读写公平。
4. **哲学家进餐问题**：破坏死锁环路（限制进餐人数至多 4 人、或奇偶号左右手拿筷顺序相反）。
