import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OBSIDIAN_VAULT = 'D:\\document\\备忘录';
const BLOG_DOCS_DIR = path.resolve('./src/content/docs');

// 支持同步的子文件夹
const SYNC_FOLDERS = ['考研408', '考研数学', '英语', '期末课程'];
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.PNG', '.JPG', '.JPEG']);

console.log('====================================================');
console.log('🚀 Cognitive Kernel - Obsidian 智能知识库同步引擎');
console.log('====================================================\n');

let syncedDocs = 0;
let syncedAssets = 0;

function cleanSvgFormatting(markdownText) {
  // 1. 解开可能包裹在 SVG 外层的各类 <div style="..."> 容器
  let text = markdownText.replace(/<div[^>]*>\s*(<svg[\s\S]*?<\/svg>)\s*<\/div>/gi, (match, svgContent) => {
    return '\n\n' + svgContent.trim() + '\n\n';
  });

  // 2. 深度净化所有 SVG：
  // 根因：CommonMark 规定 HTML 块遇到空行会直接闭合；若空行后的 SVG 内联标签带有 4 个以上空格缩进，
  // 会被 Markdown 解释器判定为“缩进代码块”（Indented Code Block）！
  // 解决对策：
  // - 移除 SVG 标签内部所有完全空白的无意义空行（消除 CommonMark HTML 块提前终止触发源）；
  // - 去除每行首尾多余缩进（trim），确保没有任何一行以 4 个空格开头；
  // - 注入自适应居中与最大宽度的内联样式保证移动/桌面端完美呈现。
  return text.replace(/<svg[\s\S]*?<\/svg>/gi, (rawSvg) => {
    const lines = rawSvg.split('\n');
    const cleanedLines = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      cleanedLines.push(trimmed);
    }
    let res = cleanedLines.join('\n');
    if (!res.includes('display:')) {
      if (/style=["']/i.test(res)) {
        res = res.replace(/<svg\b([^>]*)style=["']([^"']*)["']/i, '<svg$1style="display:block;margin:20px auto;max-width:100%;$2"');
      } else {
        res = res.replace(/<svg\b/i, '<svg style="display:block;margin:20px auto;max-width:100%;" ');
      }
    }
    return '\n\n' + res + '\n\n';
  });
}

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '.obsidian' || entry.name.startsWith('.')) continue;
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);

      // 1. 同步 Markdown 笔记
      if (ext === '.md') {
        let content = fs.readFileSync(srcPath, 'utf-8');

        // 自动净化 SVG 格式，避免外层嵌套 div 或缩进导致其变成代码块
        content = cleanSvgFormatting(content);

        // 智能检查：如果笔记没有 Frontmatter，自动补齐标准生命周期元数据
        if (!content.trim().startsWith('---')) {
          const title = entry.name.replace(/\.md$/, '');
          const today = new Date().toISOString().split('T')[0];
          const frontmatter = [
            '---',
            `title: "${title}"`,
            `publishedDate: "${today}"`,
            `tags: ["考研笔记", "Obsidian"]`,
            `lifecycle:`,
            `  status: "evergreen"`,
            `  confidence: 0.98`,
            `  last_verified: "${today}"`,
            '---',
            '',
            ''
          ].join('\n');
          content = frontmatter + content;
        }

        fs.writeFileSync(destPath, content, 'utf-8');
        syncedDocs++;
      }
      // 2. 同步图片与高清示意图资源 (PNG, JPG, SVG 等)
      else if (IMAGE_EXTS.has(ext)) {
        fs.copyFileSync(srcPath, destPath);
        syncedAssets++;
      }
    }
  }
}

try {
  // 1. 同步所有知识库目录
  for (const folder of SYNC_FOLDERS) {
    const src = path.join(OBSIDIAN_VAULT, folder);
    const dest = path.join(BLOG_DOCS_DIR, folder);
    copyRecursive(src, dest);
  }

  // 同时也检查根目录下的单篇独立文章 (如 数学基础知识.md)
  const rootEntries = fs.readdirSync(OBSIDIAN_VAULT, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('.')) {
      const srcPath = path.join(OBSIDIAN_VAULT, entry.name);
      const destPath = path.join(BLOG_DOCS_DIR, entry.name);
      let content = fs.readFileSync(srcPath, 'utf-8');
      content = cleanSvgFormatting(content);
      if (!content.trim().startsWith('---')) {
        const title = entry.name.replace(/\.md$/, '');
        const today = new Date().toISOString().split('T')[0];
        const frontmatter = [
          '---',
          `title: "${title}"`,
          `publishedDate: "${today}"`,
          `tags: ["Obsidian", "速查"]`,
          `lifecycle:`,
          `  status: "evergreen"`,
          `  confidence: 0.95`,
          `  last_verified: "${today}"`,
          '---',
          '',
          ''
        ].join('\n');
        content = frontmatter + content;
      }
      fs.writeFileSync(destPath, content, 'utf-8');
      syncedDocs++;
    }
  }

  console.log(`📑 已扫描同步 ${syncedDocs} 篇 Markdown 笔记`);
  console.log(`🖼️  已同步 ${syncedAssets} 个图片/示意图资源\n`);

  // 1.5 智能应用四态生命周期认知分类 (通过 gray-matter 严格排重与规范化)
  execSync('node scripts/reclassify-lifecycle.js', { stdio: 'inherit' });

  // 2. 暂存所有改动
  console.log('📦 正在暂存变动到本地版本库...');
  execSync('git add .', { stdio: 'inherit' });

  // 检查是否有变动
  const status = execSync('git status --porcelain').toString();
  if (!status.trim()) {
    console.log('✨ 提示：所有内容已是最新状态，无未提交的变动。');
  } else {
    const timestamp = new Date().toLocaleString();
    execSync(`git commit -m "docs: sync obsidian vault (${timestamp})"`, { stdio: 'inherit' });
    console.log('✅ 本地提交成功！');
  }

  // 3. 带重试机制的推送
  console.log('\n🌐 正在推送到 GitHub 远程仓库 (支持网络重试)...');
  let pushed = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      pushed = true;
      break;
    } catch (pushErr) {
      console.warn(`⚠️ 第 ${attempt} 次推送超时或网络波动，正在重试...`);
      if (attempt < 3) {
        execSync('node -e "setTimeout(()=>{}, 2000)"');
      }
    }
  }

  if (pushed) {
    console.log('\n====================================================');
    console.log('🎉 同步全部成功！');
    console.log('GitHub Actions 正在云端自动构建，30 秒后公网即可见：');
    console.log('👉 https://ekinplzop.github.io/blog/');
    console.log('====================================================\n');
  } else {
    console.error('\n❌ GitHub 网络连接暂时超时，本地笔记已安全保存在本地 Git 中。');
  }
} catch (err) {
  console.error('❌ 执行过程中出现错误:', err.message);
}
