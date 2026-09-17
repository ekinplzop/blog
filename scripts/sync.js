import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OBSIDIAN_VAULT = 'D:\\document\\备忘录';
const BLOG_DOCS_DIR = path.resolve('./src/content/docs');

// 映射需要同步到博客的 Obsidian 分类目录
const SYNC_FOLDERS = ['考研408', '考研数学'];

console.log('🚀 开始从 Obsidian 同步笔记到博客系统...');

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
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf-8');

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
          `  confidence: 0.95`,
          `  last_verified: "${today}"`,
          '---',
          '',
          ''
        ].join('\n');
        content = frontmatter + content;
      }

      fs.writeFileSync(destPath, content, 'utf-8');
      console.log(`✅ 已同步: ${entry.name}`);
    }
  }
}

try {
  // 1. 同步各个知识库子目录
  for (const folder of SYNC_FOLDERS) {
    const src = path.join(OBSIDIAN_VAULT, folder);
    const dest = path.join(BLOG_DOCS_DIR, folder);
    copyRecursive(src, dest);
  }

  // 2. 自动执行 Git 提交与远程推送
  console.log('\n📦 正在自动编译检查并推送到 GitHub...');
  execSync('git add .', { stdio: 'inherit' });

  // 检查是否有变动
  const status = execSync('git status --porcelain').toString();
  if (!status.trim()) {
    console.log('✨ 笔记内容没有发生变动，无需推送。');
  } else {
    const timestamp = new Date().toLocaleString();
    execSync(`git commit -m "docs: 自动同步 Obsidian 笔记更新 (${timestamp})"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('\n🎉 完美搞定！GitHub Actions 已被自动触发，公网 30 秒内完成同步更新！');
  }
} catch (err) {
  console.error('❌ 同步过程中发生错误:', err.message);
}
