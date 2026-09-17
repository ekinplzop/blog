<div align="center">

# 🧠 Cognitive Kernel (认知内核)

**次世代 Local-First 活体认知花园 · 思想演进时光机 · Bret Victor 反应式推演平台**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Framework-Astro%204.x-FF5D01.svg?style=flat-square&logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![KaTeX](https://img.shields.io/badge/Math-KaTeX-11B47A.svg?style=flat-square)](https://katex.org)
[![Build Status](https://img.shields.io/badge/Build-0%20Errors%20%7C%20100%25%20Static-emerald.svg?style=flat-square)]()

*“拒绝已死文本的静态归档，把思想的推导、演进、推翻与交互演算做成第一公民。”*

[核心特性](#-核心工程创新) • [快速上手](#-快速上手) • [内容编写规范](#-内容生命周期规范) • [部署上线](#-一键部署上线) • [方案书设计](/COGNITIVE_KERNEL_PROPOSAL.md)

</div>

---

## 🌟 核心工程创新

市面上绝大多数博客系统（Hexo、Ghost、WordPress）本质上都是“静态 HTML 展台”——文章写完即冻结，排版单一，缺乏深度演算能力与认知演进轨迹。

**Cognitive Kernel** 通过五大系统级机制重构了个人技术知识的表达形态：

### 1. 🌐 活体认知拓扑星图 (Canvas 2D 动力学物理引擎)
- **非华而不实的 3D 玩具**：纯原生手写力导向物理引擎（$\le 10\text{ KB}$），模拟库仑斥力与胡克引力，节点按成熟度呼吸发光。
- **真信息隐喻**：被推翻的旧文章与新方案之间拉出定向反向虚线；点击节点聚焦视口，支持物理碰撞甩动与手势拖拽。
- **双重休眠保护 (0% CPU 占用)**：能量极小值自动收敛休眠，离开可视视口瞬间彻底挂起，杜绝后台空转耗电。

### 2. ⚡ Bret Victor 反应式推演实验室 (Reactive Explanations)
- **告别死代码块**：正文中的数值被改造为可按住鼠标横向拖拽的行内微控件（`Scrubbable Numbers`）。
- **同频联动重绘**：拖动变量时，数学公式计算结果以 60fps 实时刷新，下方全连接 SVG 环形状态机与拓扑节点实时增删重绘。

### 3. ⏳ Cognitive Time-Machine (思想演进时光机)
- **展现认知的迭代轨迹**：文章顶部挂载时光穿梭滑块，支持 `2024 初代假设` $\leftrightarrow$ `2025 最新定论` $\leftrightarrow$ `⚡ 演进对比 (Diff)`。
- **原地 PR 级语义 Diff**：在同一个页面内，被推翻的旧假设以红色半透明删除线呈现，新提出的修正定理以绿色高亮展开。

### 4. 📐 爱德华·塔夫特 (Edward Tufte) 高信息密度三栏排版
- **左栏**：大纲目录与知识拓扑导航；
- **中栏**：严格控制在 68 字符（`68ch`）的黄金阅读画布，纯 CSS 零闪烁 KaTeX 数学公式渲染；
- **右栏**：Tufte 侧边轨道，直接展示 Git 提交记录与核心假设旁注，不打断阅读心流。

### 5. 🛡️ 三层解耦与 20 年抗衰老架构 (Zero-Drift Architecture)
- **L0 纯静态核心**：全站默认输出纯 HTML/CSS，断网本地双击即读，零服务器与商业云绑定。
- **L1 客户端增强**：按需激活轻量沙箱，发生异常时优雅降级为静态代码展示，阅读绝不中断。

---

## 🚀 快速上手

### 环境要求
- **Node.js**: $\ge 18.17.0$ (推荐 Node.js 20 LTS / 22 LTS)
- **包管理器**: `npm` / `pnpm` / `yarn`

### 本地启动

```bash
# 1. 克隆仓库并进入项目目录
git clone https://github.com/your-username/cognitive-kernel.git
cd cognitive-kernel

# 2. 安装依赖
npm install

# 3. 启动本地开发服务 (支持 HMR 热更新)
npm run dev
```

在浏览器打开 [http://localhost:4321](http://localhost:4321) 即可体验！

### 生产静态构建

```bash
# 严格执行 TypeScript 校验与纯静态生成
npm run build

# 本地预览打包产物
npm run preview
```

---

## 📝 内容生命周期规范 (Frontmatter Specification)

在 `src/content/docs/` 下直接编写任意 Markdown 文件，头部需声明认知生命周期状态机：

```markdown
---
title: "分布式共识中的确定性衰减模型"
description: "探讨节点规模增长对最终一致性收敛速率与故障容忍阈值的衰减影响。"
publishedDate: "2025-11-04"
tags: ["分布式系统", "共识算法", "系统架构"]
lifecycle:
  status: "in-progress" # 可选：seedling (萌芽) | in-progress (演进) | evergreen (常青) | superseded (已废弃)
  confidence: 0.82      # 作者主观确信度: 0.0 ~ 1.0
  last_verified: "2026-03-12"
revisions:
  - date: "2024-06-10"
    commit: "8f1a2d"
    summary: "提出初始假设：基于理想强同步时钟域推导"
  - date: "2025-11-04"
    commit: "c3e90b"
    summary: "重大重构：引入半同步模型，修正拜占庭容错衰减引理"
superseded_by: null     # 若废弃，填写替代文章的 slug，系统将自动生成警示横幅与跳转卡片
---
```

### 认知状态机语义速查

| 状态 | 颜色 | 视觉表现 | 适用场景 |
| :--- | :--- | :--- | :--- |
| `seedling` | 暖黄 | 虚线边框 + 呼吸小点 | 碎片思考、灵感草稿、尚在论证中的开放假设 |
| `in-progress`| 冷青 | 实线边框 + 活力蓝 | 已有工程验证原型，正处于实战检验期 |
| `evergreen` | 墨绿 | 纯净实体微标 | 经受长期生产检验、不可动摇的成熟认知基石 |
| `superseded`| 砖红 | 贯穿删除线 + 警示横幅 | **已被新认知推翻**，强制提示读者跳转新文章 |

---

## 🚢 一键部署上线

### 方案 A：GitHub Pages 自动化流水线 (推荐)

仓库已内建 `.github/workflows/deploy.yml`。

1. 在 GitHub 创建一个新仓库，将本项目代码推送至 `main` 分支：
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git branch -M main
   git push -u origin main
   ```
2. 进入 GitHub 仓库设置：**Settings $\to$ Pages**；
3. 将 **Source** 更改为 **GitHub Actions**；
4. 每次执行 `git push`，云端将自动校验、构建并在 1 分钟内完成全球上线发布！

### 方案 B：Cloudflare Pages / Vercel
直接在 Cloudflare Pages 面板绑定你的 Git 仓库：
- 构建命令：`npm run build`
- 输出目录：`dist`

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源发布。所有第三方依赖均采用宽松型开源协议（Astro, Tailwind, KaTeX 等），无任何 GPL 传染性版权风险。
