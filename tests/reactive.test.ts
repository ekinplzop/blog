import { describe, it, expect } from 'vitest';

// 提取与前端相同的安全计算逻辑进行单元测试
function safeEvaluate(expr: string, vars: Record<string, number>): number {
  try {
    let sanitized = expr;
    for (const [v, val] of Object.entries(vars)) {
      const reg = new RegExp(`\\b${v}\\b`, 'g');
      sanitized = sanitized.replace(reg, String(val));
    }

    // STRIDE 严密白名单：只允许合法数学操作与 Math 安全函数，彻底隔离 window, eval, constructor
    const stripped = sanitized
      .replace(/Math\.(floor|ceil|round|abs|sqrt|pow|log|log2|log10|min|max|PI|E)/g, '')
      .replace(/[0-9.]+/g, '');

    if (/[^+\-*/%(),\s]/.test(stripped)) {
      return NaN;
    }

    return Function(`"use strict"; return (${sanitized});`)();
  } catch {
    return NaN;
  }
}

describe('Reactive DSL Calculation & Safety Sandbox', () => {
  it('should correctly evaluate basic arithmetic with bound variables', () => {
    const vars = { w: 12, t: 4 };
    const expr = '1 + w / t';
    const result = safeEvaluate(expr, vars);
    expect(result).toBe(4);
  });

  it('should support Math functions like Math.floor and Math.log2', () => {
    const vars = { n: 10, v: 8 };
    const bft = safeEvaluate('Math.floor((n - 1) / 3)', vars);
    expect(bft).toBe(3);

    const dataRate = safeEvaluate('2400 * Math.log2(v)', vars);
    expect(dataRate).toBe(7200);
  });

  it('should reject and neutralize malicious injection payloads (STRIDE P0)', () => {
    const vars = {};
    const malicious = 'eval("alert(1)")';
    expect(safeEvaluate(malicious, vars)).toBeNaN();

    const protoPollution = 'Object.prototype.polluted = 1';
    expect(safeEvaluate(protoPollution, vars)).toBeNaN();

    const fetchAttempt = 'fetch("https://evil.com")';
    expect(safeEvaluate(fetchAttempt, vars)).toBeNaN();
  });
});
