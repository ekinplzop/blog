import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.resolve('./src/content/docs');
const MANIFEST_FILE = path.resolve('./src/data/review-manifest.json');

console.log('======================================================');
console.log('🔍 Cognitive Kernel - 知识一致性与冲突排查 Linter');
console.log('======================================================\n');

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

function parseSimpleFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: content };
  const rawYaml = match[1];
  const body = content.slice(match[0].length);

  const meta = {};
  rawYaml.split('\n').forEach((line) => {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kv) {
      let val = kv[2].trim().replace(/^["']|["']$/g, '');
      if (val === 'null') val = null;
      meta[kv[1]] = val;
    }
  });

  return { meta, body };
}

const docFiles = getAllDocFiles(DOCS_DIR);
const allDocsMap = new Map();

for (const file of docFiles) {
  const relative = path.relative(DOCS_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '');
  const raw = fs.readFileSync(file, 'utf-8');
  const { meta, body } = parseSimpleFrontmatter(raw);
  allDocsMap.set(relative, { file, meta, body });
}

console.log(`📑 正在对 ${allDocsMap.size} 篇知识库文档进行认知闭环一致性审计...\n`);

const issues = [];
const REVERSAL_KEYWORDS = ['已推翻', '之前错误', '早期假设错误', '推翻早期', '结论已废弃', '严重脑裂', '已被证明存在漏洞'];

for (const [slug, { meta, body }] of allDocsMap.entries()) {
  // 1. 检查已被推翻文档的跳转有效性
  if (meta.status === 'superseded') {
    if (!meta.superseded_by) {
      issues.push({
        slug,
        level: 'warning',
        type: 'MISSING_REDIRECTION',
        message: `文档标注为 [superseded 已推翻]，但未设置 superseded_by 指向替代的新观点文档。`,
      });
    } else if (!allDocsMap.has(meta.superseded_by)) {
      issues.push({
        slug,
        level: 'error',
        type: 'ORPHAN_POINTER',
        message: `文档 superseded_by 指向了不存在的文档 slug: "${meta.superseded_by}"。`,
      });
    }
  }

  // 2. 检查正文含明显推翻关键词但未标注状态的潜在矛盾 (Cognitive Drift)
  const hitKeywords = REVERSAL_KEYWORDS.filter((kw) => body.includes(kw));
  if (hitKeywords.length > 0 && meta.status !== 'superseded') {
    issues.push({
      slug,
      level: 'hint',
      type: 'POTENTIAL_CONTRADICTION',
      message: `检测到包含推翻语义词汇 [${hitKeywords.join(', ')}]，建议人工审查是否需声明认知迭代或拆解 Diff。`,
    });
  }
}

// 写入审查清单
const manifest = {
  scannedAt: new Date().toISOString(),
  totalScanned: allDocsMap.size,
  issueCount: issues.length,
  issues,
};

fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf-8');

if (issues.length === 0) {
  console.log('✅ 完美！全站文档认知状态与拓扑指针 100% 自洽，未发现任何死链或未声明冲突！');
} else {
  console.log(`⚠️ 发现 ${issues.length} 条认知一致性与审查建议：\n`);
  issues.forEach((item, idx) => {
    const icon = item.level === 'error' ? '❌' : item.level === 'warning' ? '⚠️' : '💡';
    console.log(`${idx + 1}. ${icon} [${item.slug}]`);
    console.log(`   └─ ${item.message}`);
  });
  console.log(`\n📋 审查清单已输出至: src/data/review-manifest.json`);
}
console.log('======================================================\n');
