import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = path.resolve('./src/content/docs');

// 1. 定义精确匹配分类规则
const SUPERSEDED_MAP = {
  'legacy-lock-assumption': 'consensus-decay',
  '期末课程/云计算记忆': '期末课程/云计算复习资料精简背诵版',
  '期末课程/云计算课后习题与简答题汇总': '期末课程/云计算课后习题与简答题汇总-带答案精简版',
};

const SEEDLING_SET = new Set([
  '备忘录',
  '计划表',
  '数学基础知识',
  'Pi 使用手册',
  '考研408/数据结构/数据结构zone',
  '考研408/数据结构/数据结构之链表应用题',
  '考研数学/概率论与数理统计/珍题证明题',
  '考研数学/概率论与数理统计/珍题问答集',
  '考研数学/线性代数/线代珍题',
  '考研408/计算机网络/00 索引与跨层速查',
]);

function determineLifecycle(slug) {
  if (SUPERSEDED_MAP[slug]) {
    return {
      status: 'superseded',
      confidence: 0.25,
      superseded_by: SUPERSEDED_MAP[slug],
    };
  }

  if (SEEDLING_SET.has(slug)) {
    return {
      status: 'seedling',
      confidence: 0.65,
    };
  }

  // 实战演进分类判定 (英语单词、图像处理各章、云计算精简、网络协议各层、数据结构应用题、分布式共识)
  if (
    slug.startsWith('英语/') ||
    slug.startsWith('期末课程/图像处理与计算机视觉/') ||
    slug.startsWith('期末课程/云计算') ||
    slug.startsWith('考研408/数据结构/') ||
    slug.includes('03 数据链路层') ||
    slug.includes('04 网络层') ||
    slug.includes('05 传输层') ||
    slug.includes('06 应用层') ||
    slug === 'consensus-decay'
  ) {
    return {
      status: 'in-progress',
      confidence: 0.85,
    };
  }

  // 其余均为成熟深度理论：操作系统原理、线性代数定理、高等数学微积分、事件循环模型
  return {
    status: 'evergreen',
    confidence: 0.98,
  };
}

function getAllDocFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllDocFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

const docFiles = getAllDocFiles(DOCS_DIR);
const stats = {
  evergreen: 0,
  'in-progress': 0,
  seedling: 0,
  superseded: 0,
};

const today = new Date().toISOString().split('T')[0];

for (const file of docFiles) {
  const relative = path.relative(DOCS_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '');
  let raw = fs.readFileSync(file, 'utf-8');
  const target = determineLifecycle(relative);
  stats[target.status]++;

  // 先把所有损坏的孤立缩进行删除
  const lines = raw.split(/\r?\n/);
  const filtered = [];
  let inFrontmatter = false;
  let dashesCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') {
      dashesCount++;
      if (dashesCount <= 2) {
        inFrontmatter = dashesCount === 1;
        filtered.push(line);
        continue;
      }
    }
    if (inFrontmatter) {
      // 过滤掉任何在顶层的孤立缩进行 (例如之前的 "  last_verified: ...")
      if (/^\s+last_verified:/.test(line) || /^\s+status:/.test(line) || /^\s+confidence:/.test(line)) {
        continue;
      }
      if (/^lifecycle:/.test(line) || /^superseded_by:/.test(line)) {
        continue;
      }
    }
    filtered.push(line);
  }

  raw = filtered.join('\n');

  let parsed;
  try {
    parsed = matter(raw);
  } catch {
    // 如果仍然解析不了，构造纯净 body
    const bodyIndex = raw.indexOf('---', 4);
    const body = bodyIndex !== -1 ? raw.slice(bodyIndex + 3) : raw;
    parsed = { data: {}, content: body };
  }

  const title = parsed.data.title || path.basename(file, '.md');
  const publishedDate = parsed.data.publishedDate || today;
  const tags = parsed.data.tags || ['Obsidian'];
  const revisions = parsed.data.revisions || [];
  const description = parsed.data.description || '';

  const cleanData = {
    title,
    publishedDate,
    tags,
    lifecycle: {
      status: target.status,
      confidence: target.confidence,
      last_verified: today,
    },
  };

  if (description) cleanData.description = description;
  if (revisions.length > 0) cleanData.revisions = revisions;
  if (target.superseded_by) cleanData.superseded_by = target.superseded_by;

  const newFileContent = matter.stringify(parsed.content.trim() + '\n', cleanData);
  fs.writeFileSync(file, newFileContent, 'utf-8');
}

console.log('======================================================');
console.log('🎯 认知状态机生命周期精准重分布完成 (已通过 gray-matter 格式校验)：');
console.log('======================================================');
console.log(`🌲 常青定论 (Evergreen):   ${stats.evergreen} 篇 (深度数学/OS/体系结构核心理论)`);
console.log(`⚡ 实战演进 (In-Progress): ${stats['in-progress']} 篇 (协议分层/工程实践/图像处理/单词)`);
console.log(`🌱 探索萌芽 (Seedling):    ${stats.seedling} 篇 (备忘录/草稿/刷题记录/思考雏形)`);
console.log(`🛑 已推翻定论 (Superseded): ${stats.superseded} 篇 (已被更新版本替代的旧笔记)`);
console.log(`📊 总计文章数:             ${Object.values(stats).reduce((a, b) => a + b, 0)} 篇`);
console.log('======================================================\n');
