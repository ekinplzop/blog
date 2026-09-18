import type { CollectionEntry } from 'astro:content';

export interface DocTreeNode {
  name: string;
  isFolder: boolean;
  slug?: string;
  title?: string;
  children: DocTreeNode[];
}

export function buildDocTree(docs: CollectionEntry<'docs'>[]): DocTreeNode[] {
  const root: DocTreeNode = {
    name: 'root',
    isFolder: true,
    children: [],
  };

  for (const doc of docs) {
    // 规范化路径拆分
    const parts = doc.slug.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (isFile) {
        current.children.push({
          name: part,
          isFolder: false,
          slug: doc.slug,
          title: doc.data.title || part,
          children: [],
        });
      } else {
        let folderNode = current.children.find((c) => c.isFolder && c.name === part);
        if (!folderNode) {
          folderNode = {
            name: part,
            isFolder: true,
            children: [],
          };
          current.children.push(folderNode);
        }
        current = folderNode;
      }
    }
  }

  // 自定义排序权重：考研408 -> 考研数学 -> 核心前沿 -> 期末课程 -> 英语
  const categoryWeight: Record<string, number> = {
    '考研408': 1,
    '考研数学': 2,
    '期末课程': 3,
    '英语': 4,
  };

  function sortNodes(nodes: DocTreeNode[]) {
    nodes.sort((a, b) => {
      // 文件夹优先
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;

      // 顶级分类权重排序
      const weightA = categoryWeight[a.name] ?? 99;
      const weightB = categoryWeight[b.name] ?? 99;
      if (weightA !== weightB) return weightA - weightB;

      // 字母/数字前缀自然排序 (01, 02 顺次排列)
      return a.name.localeCompare(b.name, 'zh-CN', { numeric: true });
    });

    for (const node of nodes) {
      if (node.isFolder) {
        sortNodes(node.children);
      }
    }
  }

  sortNodes(root.children);
  return root.children;
}
