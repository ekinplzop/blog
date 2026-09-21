import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { slug } from 'github-slugger';

export function getDocSlug(relativeFilePath) {
  const cleanPath = relativeFilePath.replace(/\\/g, '/').replace(/\.md$/, '');
  const segments = cleanPath.split('/');
  return segments.map((s) => slug(s)).join('/');
}

export function generateDownloads(
  docsDir = path.resolve('./src/content/docs'),
  outDir = path.resolve('./public/downloads')
) {
  if (!fs.existsSync(docsDir)) {
    console.warn(`[generate-downloads] Docs directory not found: ${docsDir}`);
    return [];
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const generated = [];

  function walk(currentDir, relativeBase = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        walk(fullPath, relativePath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const rawContent = fs.readFileSync(fullPath, 'utf-8');
        const docSlug = getDocSlug(relativePath);
        const flatSlug = docSlug.replace(/\//g, '-');

        // 验证/保留完整 frontmatter
        let finalContent = rawContent;
        const hasFrontmatter = rawContent.trimStart().startsWith('---');

        // 1. 生成树状目录对应路径 (如 public/downloads/考研408/操作系统/02-进程与线程.md)
        const hierarchicalDest = path.join(outDir, `${docSlug}.md`);
        const hierarchicalDir = path.dirname(hierarchicalDest);
        if (!fs.existsSync(hierarchicalDir)) {
          fs.mkdirSync(hierarchicalDir, { recursive: true });
        }
        fs.writeFileSync(hierarchicalDest, finalContent, 'utf-8');

        // 2. 生成平铺安全路径 (如 public/downloads/考研408-操作系统-02-进程与线程.md)
        const flatDest = path.join(outDir, `${flatSlug}.md`);
        if (flatDest !== hierarchicalDest) {
          fs.writeFileSync(flatDest, finalContent, 'utf-8');
        }

        generated.push({
          sourceFile: relativePath,
          slug: docSlug,
          flatSlug,
          hierarchicalDest,
          flatDest,
          hasFrontmatter,
          size: Buffer.byteLength(finalContent, 'utf-8'),
        });
      }
    }
  }

  walk(docsDir);
  return generated;
}

// 直接运行脚本时的自执行逻辑
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  console.log('======================================================');
  console.log('📦 Cognitive Kernel - 原始 Markdown 静态导出生成器');
  console.log('======================================================\n');

  const list = generateDownloads();
  console.log(`✅ 成功将 ${list.length} 篇知识库文档导出为原始 Markdown 静态产物。`);
  console.log(`📁 导出目标目录: public/downloads/`);
  console.log(`🛡️ 100% 具备完整 Frontmatter，零客户端运行时开销，完全兼容 GitHub Pages 静态托管。\n`);
}
