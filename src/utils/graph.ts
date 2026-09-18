import type { CollectionEntry } from 'astro:content';

export interface GraphNode {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: 'seedling' | 'in-progress' | 'evergreen' | 'superseded';
  confidence: number;
  tags: string[];
  radius: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'supersede' | 'cluster' | 'tag';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// 排除宽泛公共大词，避免形成全连通爆炸
const IGNORED_TAGS = new Set([
  '考研笔记',
  'obsidian',
  'Obsidian',
  '考研',
  '速查',
  '高分笔记',
  '真题',
  '笔记',
]);

export function buildGraphData(docs: CollectionEntry<'docs'>[]): GraphData {
  const nodes: GraphNode[] = docs.map((doc) => {
    const title = doc.data.title || doc.slug.split('/').pop() || doc.slug;
    const parts = doc.slug.split('/');
    const category = parts.length > 1 ? parts[parts.length - 2] : '核心理念';

    // 基础半径按重要度和置信度微调 (10 ~ 18px)
    let baseRadius = 11;
    if (doc.data.lifecycle.status === 'evergreen') baseRadius = 13;
    if (doc.slug.includes('consensus-decay') || doc.slug.includes('event-loop')) baseRadius = 16;

    const radius = Math.min(20, Math.max(9, baseRadius + (doc.data.lifecycle.confidence * 3)));

    return {
      id: doc.slug,
      slug: doc.slug,
      title,
      category,
      status: doc.data.lifecycle.status,
      confidence: doc.data.lifecycle.confidence,
      tags: doc.data.tags || [],
      radius,
    };
  });

  const links: GraphLink[] = [];
  const linkKeySet = new Set<string>();

  function addLink(source: string, target: string, type: 'supersede' | 'cluster' | 'tag') {
    if (source === target) return;
    const key1 = `${source}->${target}`;
    const key2 = `${target}->${source}`;
    if (!linkKeySet.has(key1) && !linkKeySet.has(key2)) {
      links.push({ source, target, type });
      linkKeySet.add(key1);
    }
  }

  // 1. 推翻关系 (Superseded Links) 保持高优先级
  for (const doc of docs) {
    if (doc.data.superseded_by) {
      const targetExists = docs.some((d) => d.slug === doc.data.superseded_by);
      if (targetExists) {
        addLink(doc.slug, doc.data.superseded_by, 'supersede');
      }
    }
  }

  // 2. 知识聚类链 (Cluster Spine): 按知识子文件夹自然成链，避免全连接
  // 比如：计网的物理层 -> 链路层 -> 网络层按学习路径连成主干，形成漂亮的星系星座
  const categoryMap = new Map<string, CollectionEntry<'docs'>[]>();
  for (const doc of docs) {
    const parts = doc.slug.split('/');
    const groupKey = parts.length > 1 ? parts.slice(0, -1).join('/') : '__root__';
    if (!categoryMap.has(groupKey)) {
      categoryMap.set(groupKey, []);
    }
    categoryMap.get(groupKey)!.push(doc);
  }

  for (const [_, groupDocs] of categoryMap.entries()) {
    if (groupDocs.length <= 1) continue;

    // 顺次排序连成知识脉络链 (骨干链)，而不是两两互连的乱线
    groupDocs.sort((a, b) => a.slug.localeCompare(b.slug));

    for (let i = 0; i < groupDocs.length - 1; i++) {
      addLink(groupDocs[i].slug, groupDocs[i + 1].slug, 'cluster');
    }
    // 如果组内文章超过 4 篇，首尾不闭合，保持优雅树枝/链状
  }

  // 3. 精准专业主题关联 (仅对具体的强专有技术标签，且关联度在 2~3 篇以内的稀疏关联)
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const docA = docs[i];
      const docB = docs[j];
      const specificTags = (docA.data.tags || []).filter(
        (t) => !IGNORED_TAGS.has(t) && (docB.data.tags || []).includes(t)
      );

      if (specificTags.length > 0) {
        addLink(docA.slug, docB.slug, 'tag');
      }
    }
  }

  return { nodes, links };
}
