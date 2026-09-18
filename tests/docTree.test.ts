import { describe, it, expect } from 'vitest';
import { buildDocTree } from '../src/utils/docTree';

describe('DocTree Navigation Hierarchy', () => {
  it('should organize flat documents into nested categories', () => {
    const mockDocs: any = [
      {
        slug: '考研408/操作系统/01 计算机系统概述',
        data: { title: '01 计算机系统概述' },
      },
      {
        slug: '考研408/操作系统/02 进程与线程',
        data: { title: '02 进程与线程' },
      },
      {
        slug: '考研数学/线性代数/特征值速查',
        data: { title: '特征值速查' },
      },
      {
        slug: 'consensus-decay',
        data: { title: '分布式共识' },
      },
    ];

    const tree = buildDocTree(mockDocs);

    // 顶级应该包含 考研408, 考研数学, 以及根目录文章
    const names = tree.map((n) => n.name);
    expect(names).toContain('考研408');
    expect(names).toContain('考研数学');
    expect(names).toContain('consensus-decay');

    // 考研408 应该在 考研数学 前面 (权重排序)
    const idx408 = names.indexOf('考研408');
    const idxMath = names.indexOf('考研数学');
    expect(idx408).toBeLessThan(idxMath);

    // 操作系统内部应该按 01, 02 顺次排列
    const node408 = tree.find((n) => n.name === '考研408');
    expect(node408).toBeDefined();
    const osFolder = node408?.children.find((n) => n.name === '操作系统');
    expect(osFolder).toBeDefined();
    expect(osFolder?.children.length).toBe(2);
    expect(osFolder?.children[0].name).toBe('01 计算机系统概述');
    expect(osFolder?.children[1].name).toBe('02 进程与线程');
  });
});
