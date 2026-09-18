import { describe, it, expect } from 'vitest';
import { buildGraphData } from '../src/utils/graph';

describe('Cognitive Graph Topology & Clustering', () => {
  it('should ignore broad generic tags to prevent all-to-all connection explosion', () => {
    const mockDocs: any = [
      {
        slug: 'doc-a',
        data: {
          title: '文档 A',
          tags: ['考研笔记', 'Obsidian', '速查'],
          lifecycle: { status: 'evergreen', confidence: 0.9 },
        },
      },
      {
        slug: 'doc-b',
        data: {
          title: '文档 B',
          tags: ['考研笔记', 'Obsidian'],
          lifecycle: { status: 'evergreen', confidence: 0.8 },
        },
      },
    ];

    const graph = buildGraphData(mockDocs);
    expect(graph.nodes.length).toBe(2);

    // 因为只共享宽泛大词，不应该产生任何 tag 连线
    const tagLinks = graph.links.filter((l) => l.type === 'tag');
    expect(tagLinks.length).toBe(0);
  });

  it('should generate directional supersede links correctly', () => {
    const mockDocs: any = [
      {
        slug: 'old-lock',
        data: {
          title: '旧锁方案',
          tags: [],
          lifecycle: { status: 'superseded', confidence: 0.2 },
          superseded_by: 'new-consensus',
        },
      },
      {
        slug: 'new-consensus',
        data: {
          title: '新共识方案',
          tags: [],
          lifecycle: { status: 'in-progress', confidence: 0.85 },
        },
      },
    ];

    const graph = buildGraphData(mockDocs);
    const supersedeLink = graph.links.find((l) => l.type === 'supersede');
    expect(supersedeLink).toBeDefined();
    expect(supersedeLink?.source).toBe('old-lock');
    expect(supersedeLink?.target).toBe('new-consensus');
  });
});
