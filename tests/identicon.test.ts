import { describe, it, expect } from 'vitest';
import { generateIdenticon } from '../src/utils/identicon';

describe('Algorithmic Identicon Engine (Stage 2.3)', () => {
  it('should generate deterministic SVG output for identical input', () => {
    const res1 = generateIdenticon('os-process-thread');
    const res2 = generateIdenticon('os-process-thread');
    expect(res1.svg).toBe(res2.svg);
    expect(res1.color).toBe(res2.color);
    expect(res1.svg).toContain('<svg');
    expect(res1.svg).toContain('</svg>');
  });

  it('should produce distinct visual patterns for different topics', () => {
    const resA = generateIdenticon('computer-network-tcp');
    const resB = generateIdenticon('linear-algebra-eigenvalues');
    expect(resA.svg).not.toBe(resB.svg);
  });
});
