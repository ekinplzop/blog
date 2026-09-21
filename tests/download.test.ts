import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getDocSlug, generateDownloads } from '../scripts/generate-downloads.js';

describe('Raw Markdown Static Downloads Generator', () => {
  it('should accurately compute Astro-compatible slug paths', () => {
    expect(getDocSlug('consensus-decay.md')).toBe('consensus-decay');
    expect(getDocSlug('考研408/操作系统/01 计算机系统概述.md')).toBe('考研408/操作系统/01-计算机系统概述');
    expect(getDocSlug('期末课程\\图像处理与计算机视觉\\第一章-绪论.md')).toBe('期末课程/图像处理与计算机视觉/第一章-绪论');
  });

  it('should generate complete markdown download files preserving frontmatter', () => {
    const records = generateDownloads();
    expect(records.length).toBeGreaterThanOrEqual(66);

    // 检查核心示例长文 consensus-decay.md
    const consensusDoc = records.find((r) => r.slug === 'consensus-decay');
    expect(consensusDoc).toBeDefined();
    expect(fs.existsSync(consensusDoc!.hierarchicalDest)).toBe(true);

    const content = fs.readFileSync(consensusDoc!.hierarchicalDest, 'utf-8');
    expect(content.startsWith('---')).toBe(true);
    expect(content).toContain('title:');
    expect(content).toContain('lifecycle:');
    expect(content).toContain('status:');

    // 检查嵌套目录文章 (考研408/操作系统/02-进程与线程)
    const osDoc = records.find((r) => r.slug.includes('02-进程与线程'));
    expect(osDoc).toBeDefined();
    expect(fs.existsSync(osDoc!.hierarchicalDest)).toBe(true);
    expect(fs.existsSync(osDoc!.flatDest)).toBe(true);

    const osContent = fs.readFileSync(osDoc!.hierarchicalDest, 'utf-8');
    expect(osContent.startsWith('---')).toBe(true);
    expect(osContent).toContain('02 进程与线程');
    expect(osContent).toContain('status: evergreen');
  });
});
