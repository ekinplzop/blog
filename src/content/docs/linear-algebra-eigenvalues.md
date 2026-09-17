---
title: "考研数学 · 线性代数：特征值、特征向量与二次型公式速查"
description: "行列式展开定理、范德蒙行列式、相似对角化、实对称矩阵正交对角化与二次型合同变换全景公式推导速查。"
publishedDate: "2024-07-01"
tags: ["考研数学", "线性代数", "特征值与特征向量", "二次型"]
lifecycle:
  status: "evergreen"
  confidence: 1.0
  last_verified: "2026-03-12"
revisions:
  - date: "2024-07-01"
    summary: "完成全体系线性代数核心公式梳理"
---

## 1. 核心行列式与矩阵运算法则

### 行列式展开定理

$$
|A| = \sum_{j=1}^{n} a_{ij} (-1)^{i+j} M_{ij} = \sum_{j=1}^{n} a_{ij} A_{ij}
$$

其中 $M_{ij}$ 为**余子式**，$A_{ij}$ 为**代数余子式**。

### 范德蒙行列式 (Vandermonde)

$$
D_n = \begin{vmatrix}
1 & 1 & \cdots & 1 \\
x_1 & x_2 & \cdots & x_n \\
x_1^2 & x_2^2 & \cdots & x_n^2 \\
\vdots & \vdots & & \vdots \\
x_1^{n-1} & x_2^{n-1} & \cdots & x_n^{n-1}
\end{vmatrix}
= \prod_{1 \le j < i \le n} (x_i - x_j)
$$

### 伴随与逆矩阵核心等式

$$
A^* A = |A| E, \quad |A^*| = |A|^{n-1}, \quad (A^*)^{-1} = (A^{-1})^*
$$

$$
(AB)^* = B^* A^*, \quad (kA)^* = k^{n-1} A^*
$$

---

## 2. 矩阵之间三大等价关系对比

| 关系类型 | 形式定义 | 充要条件 / 核心判据 | 几何/代数本质 |
| :--- | :--- | :--- | :--- |
| **等价** ($A \simeq B$) | $PAQ = B$ ($P, Q$ 可逆) | $r(A) = r(B)$ | 相同维数线性空间同构映射 |
| **相似** ($A \sim B$) | $P^{-1}AP = B$ ($P$ 可逆) | 特征多项式相同、同一线性变换在不同基下的矩阵 | 保持特征值、迹 $tr(A)$、行列式 $|A|$ 守恒 |
| **合同** ($A \simeq_C B$) | $C^T A C = B$ ($C$ 可逆) | 正负惯性指数相同 ($r(A) = p + q$) | 二次型在满秩线性替换下的守恒 |

### 相似对角化充要条件

$$
P^{-1} A P = \Lambda = \begin{pmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{pmatrix}
$$

- **充要条件**：$A$ 拥有 $n$ 个线性无关的特征向量；
- **几何重数 $\le$ 代数重数**：每个特征值的几何重数（基础解系向量数）必须等于其代数重数；
- **实对称矩阵公理**：实对称矩阵必可正交相似对角化（存在正交矩阵 $Q$ 使 $Q^T A Q = \Lambda$）。

---

## 3. 施密特正交化过程 (Gram-Schmidt)

给定线性无关向量组 $\alpha_1, \alpha_2, \dots, \alpha_m$，构造正交基 $\beta_1, \beta_2, \dots, \beta_m$：

$$
\beta_1 = \alpha_1
$$

$$
\beta_2 = \alpha_2 - \frac{(\alpha_2, \beta_1)}{(\beta_1, \beta_1)} \beta_1
$$

$$
\beta_k = \alpha_k - \sum_{j=1}^{k-1} \frac{(\alpha_k, \beta_j)}{(\beta_j, \beta_j)} \beta_j
$$

最后单位化：$\eta_i = \frac{\beta_i}{\|\beta_i\|}$。

---

## 4. 正定二次型与瑞利商

**实对称矩阵 $A$ 正定的等价命题：**
1. 对任意非零列向量 $x \ne 0$，有二次型 $x^T A x > 0$；
2. $A$ 的全部特征值 $\lambda_i > 0$；
3. $A$ 的各阶顺序主子式全大于 $0$；
4. 正惯性指数 $p = n$。

**瑞利商极值定理 (Rayleigh Quotient)**：

$$
\max_{x^T x = 1} x^T A x = \lambda_{\max}, \qquad \min_{x^T x = 1} x^T A x = \lambda_{\min}
$$
