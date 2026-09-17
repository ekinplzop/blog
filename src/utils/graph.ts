import type { CollectionEntry } from 'astro:content';

export interface GraphNode {
  id: string;
  slug: string;
  title: string;
  status: 'seedling' | 'in-progress' | 'evergreen' | 'superseded';
  confidence: number;
  tags: string[];
  radius: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'supersede' | 'tag';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function buildGraphData(docs: CollectionEntry<'docs'>[]): GraphData {
  const nodes: GraphNode[] = docs.map((doc) => {
    // 根据置信度和状态计算节点质量与展示半径 (14 ~ 22px)
    const baseRadius = doc.data.lifecycle.status === 'evergreen' ? 18 : 15;
    const radius = Math.min(24, Math.max(13, baseRadius + (doc.data.lifecycle.confidence * 4)));

    return {
      id: doc.slug,
      slug: doc.slug,
      title: doc.data.title || doc.slug.split('/').pop() || doc.slug,
      status: doc.data.lifecycle.status,
      confidence: doc.data.lifecycle.confidence,
      tags: doc.data.tags || [],
      radius,
    };
  });

  const links: GraphLink[] = [];
  const linkKeySet = new Set<string>();

  // 1. 推翻关系链接 (Supersede Links)
  for (const doc of docs) {
    if (doc.data.superseded_by) {
      const targetExists = docs.some((d) => d.slug === doc.data.superseded_by);
      if (targetExists) {
        const key = `${doc.slug}->${doc.data.superseded_by}`;
        links.push({
          source: doc.slug,
          target: doc.data.superseded_by,
          type: 'supersede',
        });
        linkKeySet.add(key);
      }
    }
  }

  // 2. 标签共现关系链接 (Tag Sharing Links)
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const docA = docs[i];
      const docB = docs[j];
      const sharedTags = docA.data.tags.filter((t) => docB.data.tags.includes(t));
      
      if (sharedTags.length > 0) {
        const key1 = `${docA.slug}->${docB.slug}`;
        const key2 = `${docB.slug}->${docA.slug}`;
        if (!linkKeySet.has(key1) && !linkKeySet.has(key2)) {
          links.push({
            source: docA.slug,
            target: docB.slug,
            type: 'tag',
          });
          linkKeySet.add(key1);
        }
      }
    }
  }

  return { nodes, links };
}
