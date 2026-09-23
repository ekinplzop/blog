---
title: 考研数学 · 线性代数：特征值、特征向量与二次型公式速查
publishedDate: '2024-07-01'
tags:
  - 考研数学
  - 线性代数
  - 特征值与特征向量
  - 二次型
lifecycle:
  status: evergreen
  confidence: 0.98
  last_verified: '2026-09-23'
description: 行列式展开定理、范德蒙行列式、相似对角化、实对称矩阵正交对角化与二次型合同变换全景公式推导速查。
revisions:
  - date: '2024-07-01'
    summary: 完成全体系线性代数核心公式梳理
---
# 线性代数公式速查 特征值与特征向量，二次型

## 常用公式

### 1. 行列式展开

$$
|A| = \sum_{j=1}^{n} a_{ij} (-1)^{i+j} M_{ij} = \sum_{j=1}^{n} a_{ij} A_{ij}
$$

$M_{ij}$ 为**余子式**，$A_{ij}$ 为**代数余子式**。

### 2. 范德蒙行列式

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

### 3. 矩阵乘法

$$
A_{m \times s} \cdot B_{s \times n} = C_{m \times n}, \quad c_{ij} = \sum_{k=1}^{s} a_{ik} b_{kj}
$$

### 4. 转置、逆、伴随

$$
|AB| = |A||B|, \quad |kA| = k^n |A|
$$

**转置：**

$$
(A+B)^T = A^T + B^T, \quad (kA)^T = kA^T, \quad (AB)^T = B^T A^T, \quad |A^T| = |A|
$$

**逆：**

$$
(kA)^{-1} = \frac{1}{k} A^{-1}, \quad (AB)^{-1} = B^{-1} A^{-1}, \quad |A^{-1}| = |A|^{-1} = \frac{1}{|A|}, \quad (A^T)^{-1} = (A^{-1})^T, \quad A^{-1} = \frac{1}{|A|} A^*
$$

**伴随：**

$$
A^* A = |A| E, \quad |A^*| = |A|^{n-1}, \quad (A^T)^* = (A^*)^T, \quad (kA)^* = k^{n-1} A^*
$$

$$
(AB)^* = B^* A^*, \quad (A^*)^{-1} = (A^{-1})^*
$$

### 5. 秩

$$
r(AB) \le \min\{r(A),\ r(B)\}, \quad r(A+B) \le r(A) + r(B), \quad 0 \le r(A) \le \min(m, n)
$$

$$
r(A^*) = \begin{cases} n, & r(A) = n \\ 1, & r(A) = n-1 \\ 0, & r(A) < n-1 \end{cases}
$$

$$
r(A) = r(A^T) = r(kA) = r(PAP^T) = r(A^T A) = r(A A^T)
$$

> 若 $A_{m \times n} B_{n \times s} = O$，则 $r(A) + r(B) \le n$。

---

## 矩阵之间相互关系（向量组）

### 等价

$$
r(A) = r(B) \iff \text{有限次初等变换} \iff PAQ = B
$$

* **应用**：$(A \mid E) \to (E \mid A^{-1})$

### 正交

$$
A^T A = E = A A^T \implies A^{-1} = A^T, \quad |A| = \pm 1
$$

### 等价向量组

$$
r(A) = r(B) = r([A, B])
$$

### 相似

$$
B = P^{-1} A P \quad (P \text{ 是可逆矩阵}，\ A, B \text{ 均为 } n \text{ 阶方阵})
$$

> **必要条件**（特殊化：要求 $P$ 是可逆矩阵）：
>
> 1. $|A| = |B|$
> 2. $r(A) = r(B)$
> 3. $\lambda_A = \lambda_B \implies tr(A) = tr(B)$
> 4. $|\lambda E - A| = |\lambda E - B|$
> 5. $r(\lambda E - A) = r(\lambda E - B)$　(*)
> 6. $A, B$ 的各阶主子式之和分别相等：$tr(A),\ \begin{vmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{vmatrix} + \begin{vmatrix} a_{11} & a_{13} \\ a_{31} & a_{33} \end{vmatrix} + \begin{vmatrix} a_{22} & a_{23} \\ a_{32} & a_{33} \end{vmatrix},\ |A|$

**即便 ①～⑥ 全成立 $\Rightarrow$ $A \sim B$？**

**反例：**

$$
A = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 2 & 2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}, \quad
B = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 2 & 1 & 0 & 0 \\ 2 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}
$$

### 相似对角化

$$
AP = P\Lambda, \quad P^{-1} A P = \Lambda, \quad A = P \Lambda P^{-1}
$$

$$
(\xi_1, \xi_2, \dots, \xi_n)^{-1} A (\xi_1, \xi_2, \dots, \xi_n) = \begin{pmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{pmatrix}
$$

> * **充要条件**：$A$ 有 $n$ 个线性无关的特征向量
> * **几何重数 $\le$ 代数重数**
> * **实对称矩阵必可正交对角化**
> * **$A$ 有 $n$ 个不同的特征值，则 $A$ 必可对角化**

### 合同

$$
B = C^T A C \quad (C \text{ 是可逆矩阵})\quad (\text{主要用于二次型})
$$

研究二次型在变量替换下的性质。

> **实对称矩阵合同的充要条件**：正负惯性指数相同（$\iff r(A) = p + q$）。

### 二阶特征值速算

$$
\begin{pmatrix} a & b \\ b & c \end{pmatrix} \ni \lambda^2 - (a+c)\lambda + (ac - b^2) = 0
$$

$$
\lambda_1 \lambda_2 = ac - b^2 = |A|, \quad \lambda_1 + \lambda_2 = a + c = tr(A)
$$

---

## 正定（出现在二次型章节）

**设 $A$ 为实对称正定矩阵，则：**

1. $A$ 可逆，且 $|A| > 0$
2. $A$ 的全部 $\lambda$ 大于 $0$
3. $A$ 的任意顺序主子式均大于 $0$
4. $A^{-1}$ 也是正定矩阵
5. 对任意非零向量 $x$，有 $x^T A x > 0$
6. 对任意可逆矩阵 $C$，$C^T A C$ 仍为正定矩阵

---

## 线性方程组解的判定

### $Ax = 0$

* $|A| \ne 0 \implies$ 只有零解 $\iff r(A) = n$
* $|A| = 0 \implies A$ 有非零解
* $|A| \ne 0 \implies r(A) = n$

### $Ax = b$

* $r(A) \ne r([A, b]) \implies$ 无解
* $r(A) = r([A, b]) = n \implies$ 有唯一解
* $r(A) = r([A, b]) < n \implies$ 无穷多解

### 列向量组的相关性

* $\alpha_1, \alpha_2, \dots, \alpha_m$ **线性相关** $\implies r(A) < m$，$Ax = 0$ 有非零解
* $\alpha_1, \alpha_2, \dots, \alpha_m$ **线性无关** $\implies r(A) = m$，$Ax = 0$ 只有零解

$$
|A| = \lambda_1 \lambda_2 \lambda_3 \cdots \lambda_n
$$

> **解方程 $Ax = b$、求特征向量时只能用行变换**。

**通解：**

$$
x = k_1 \xi_1 + k_2 \xi_2 + \cdots + k_{n-r} \xi_{n-r}
$$

---

## 施密特正交化

给定一组线性无关向量 $\alpha_1, \alpha_2, \dots, \alpha_m$，

构造与原向量等价的正交向量组：

$$
\beta_1 = \alpha_1, \quad \beta_2 = \alpha_2 - \frac{(\alpha_2, \beta_1)}{(\beta_1, \beta_1)} \beta_1
$$

---

## 特征值与特征向量

**定义**：$A$ 为 $n$ 阶方阵，$\lambda$ 为数，$\xi$ 为非零列向量：

$$
A\xi = \lambda \xi \quad (\text{有解且非零})
$$

$$
(\lambda E - A)x = 0 \iff r(\lambda E - A) < n \iff |\lambda E - A| = 0
$$

### 重要性质

> 若 $A\xi = \lambda \xi$，则 $f(A)\xi = f(\lambda)\xi$：
>
> $$A^k \xi = \lambda^k \xi, \quad A^{-1}\xi = \frac{1}{\lambda}\xi, \quad A^* \xi = \frac{|A|}{\lambda}\xi$$

* （经过行变换，）**三角矩阵的特征值为主对角线元素**
* 若 $|aA + bE| = 0$，则 $-\dfrac{b}{a}$ 是 $A$ 的特征值

**特征值的运算**：假设 $A$ 的特征值为 $\lambda_1, \lambda_2, \lambda_3$，那么 $|A - E|$ 的特征值：$\lambda_1 - 1,\ \lambda_2 - 1,\ \lambda_3 - 1$。

**推导**：

$$
A\xi = \lambda \xi, \quad E\xi = \xi
$$

$$
(A - E)\xi = A\xi - E\xi = \lambda \xi - \xi = (\lambda - 1)\xi
$$

---

## 实对称矩阵

$$
A^T = A \quad \text{即} \quad a_{ij} = a_{ji} \text{ 且均为实数}
$$

**性质：**

1. 特征值均为实数，$\lambda \in \mathbb{R}$
2. 不同特征值之间对应的特征向量正交
3. 一定可以正交相似对角化（存在正交矩阵 $Q$，使 $Q^T A Q = \Lambda$，$\Lambda = \begin{pmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{pmatrix}$）
4. 重特征值可根据施密特正交化使得正交

### 正交

* **向量正交**：$\alpha, \beta \implies \alpha^T \beta = 0$（$\alpha \perp \beta$）
* **正交矩阵**：$Q^T Q = E$，$Q^T = Q^{-1}$，$|Q| = \pm 1$
* 正交矩阵：行向量两两正交；列向量两两正交

### 可相似对角化

$$
P^{-1} A P = \Lambda \ (\text{对角})
$$

$$
P = (\xi_1, \xi_2, \dots, \xi_n), \quad \Lambda = \begin{pmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{pmatrix}
$$

> **条件**：($n$) 足够的线性无关的特征向量。
>
> 若 $A$ 是实对称矩阵 $\to$ 一定满足。

假设 $\xi_1, \xi_2$ 是同一个特征值，即属于同一个特征子空间，任意线性组合（施密特正交化）不会改变特征向量性质：

$$
\xi_i \to \pi_i \ (\text{单位化、正交化})
$$

$$
Q = (\pi_1, \pi_2, \dots, \pi_n)
$$

---

## 二次型

**解题流程：**

$$
f(x_1, x_2, x_3) \to \text{矩阵 } A \to \text{特征值 } \lambda \to \text{特征向量 } \xi
$$

* $\lambda$ → **标准形的系数**
* $\xi$ → 施密特正交化 → 规范形 $(-1, 1, 0)$
* ($x = Qy$)

### 合同变换的理论

设 $f(x) = x^T A x$（$A$ 对称），作可逆变换 $x = Cy$，代入：

$$
f = (Cy)^T A (Cy) = y^T C^T A C y
$$

故 $C^T A C$ 是同一个二次型在新变量 $y$ 下的矩阵。

假设求 $C$，使得 $C^T A C = \Lambda$，

等价于求变换 $x = Cy$，使得 $f$ 在新坐标下变成 $y^T \Lambda y$。

**已知 $A, \Lambda$，求可逆矩阵 $C$，使得 $C^T A C = \Lambda$ 的求解理论。**

**例：**

$$
A = \begin{pmatrix} 3 & 2 & 1 \\ 2 & 2 & 1 \\ 1 & 1 & 1 \end{pmatrix}, \quad \Lambda = \begin{pmatrix} 2 & & \\ & 3 & \\ & & 1 \end{pmatrix}
$$

则 $f(x) = x^T A x = 3x_1^2 + 2x_2^2 + x_3^2 + 4x_1 x_2 + 2x_1 x_3 + 2x_2 x_3$

$$
\xrightarrow{x = \alpha y} \quad y^T \Lambda y = 2y_1^2 + 3y_2^2 + y_3^2
$$

$$
y_1 = \frac{x_1}{\sqrt{2}}, \quad y_2 = \frac{x_1 + x_2}{\sqrt{3}} \quad \Longleftarrow \quad (x_1 + x_2 + x_3)^2 + 3\left(\frac{x_1 + x_2}{\sqrt{3}}\right)^2 + 2\left(\frac{x_1}{\sqrt{2}}\right)^2
$$

$$
\alpha = \begin{pmatrix} \sqrt{2} & 0 & 0 \\ -\sqrt{2} & \sqrt{3} & 0 \\ 0 & -\sqrt{3} & 1 \end{pmatrix}
$$

### 瑞利商（最大特征值）

$$
\max_{x^T x = 1} x^T A x = \lambda_{\max}
$$
