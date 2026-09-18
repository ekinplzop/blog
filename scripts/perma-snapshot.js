import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DOCS_DIR = path.resolve('./src/content/docs');
const SNAPSHOTS_DIR = path.resolve('./public/snapshots');
const INDEX_FILE = path.resolve('./src/data/snapshots.json');

if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

let snapshotIndex = {};
if (fs.existsSync(INDEX_FILE)) {
  try {
    snapshotIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
  } catch {
    snapshotIndex = {};
  }
}

// 排除本地或特殊协议 URL
const IGNORED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'w3.org',
  'github.com/ekinplzop/blog',
  'ekinplzop.github.io',
];

function getUrlHash(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
}

function extractUrlsFromText(text) {
  const urls = new Set();
  // 匹配 Markdown 链接 [text](url)
  const mdLinkRegex = /\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(text)) !== null) {
    urls.add(match[2]);
  }

  // 匹配纯文本 URL
  const rawUrlRegex = /(https?:\/\/[a-zA-Z0-9.\-_~:/?#[\]@!$&'*+,;=%]+)/g;
  while ((match = rawUrlRegex.exec(text)) !== null) {
    const raw = match[1].replace(/[),.;]$/, '');
    urls.add(raw);
  }

  return Array.from(urls);
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

async function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CognitiveKernel/1.0 SnapshotBot',
      },
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function generateSnapshotHtml(url, title, bodyHtml, fetchDate) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[快照] ${title || url}</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0c; color: #f3f4f6; line-height: 1.6; }
    .perma-header { background: #121216; border-bottom: 1px solid #27272a; padding: 16px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; font-family: monospace; font-size: 12px; }
    .badge { background: #0284c7; color: #fff; padding: 3px 8px; border-radius: 9999px; font-weight: bold; }
    .url { color: #38bdf8; text-decoration: none; word-break: break-all; }
    .url:hover { text-decoration: underline; }
    .main-content { max-width: 900px; margin: 32px auto; padding: 0 20px; word-break: break-word; }
  </style>
</head>
<body>
  <div class="perma-header">
    <div style="display:flex; align-items:center; gap:8px;">
      <span class="badge">🏛️ Cognitive Kernel 永久快照归档</span>
      <span>抓取日期: ${fetchDate}</span>
    </div>
    <div>
      原网址: <a class="url" href="${url}" target="_blank" rel="noopener noreferrer">${url} ↗</a>
    </div>
  </div>
  <main class="main-content">
    <h1>${title || '离线快照存档'}</h1>
    <div class="snapshot-body">
      ${bodyHtml}
    </div>
  </main>
</body>
</html>`;
}

async function run() {
  console.log('======================================================');
  console.log('🏛️  Cognitive Kernel - 外链永久快照归档引擎 (Perma-Snapshot)');
  console.log('======================================================\n');

  const docFiles = getAllDocFiles(DOCS_DIR);
  const allUrls = new Set();

  for (const file of docFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const urls = extractUrlsFromText(content);
    for (const u of urls) {
      // 过滤内网或无效 URL
      try {
        const parsed = new URL(u);
        const isIgnored = IGNORED_DOMAINS.some(d => parsed.host.includes(d));
        if (!isIgnored && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
          allUrls.add(u);
        }
      } catch {}
    }
  }

  const urlList = Array.from(allUrls);
  console.log(`🔍 扫描到 ${urlList.length} 个独立外部引用链接。\n`);

  let newSnapshots = 0;
  for (const url of urlList) {
    const hash = getUrlHash(url);
    const snapshotFile = path.join(SNAPSHOTS_DIR, `${hash}.html`);

    // 如果快照已存在，跳过重新下载
    if (snapshotIndex[url] && fs.existsSync(snapshotFile)) {
      continue;
    }

    process.stdout.write(`⏳ 正在归档: ${url} ... `);
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await fetchWithTimeout(url, 4000);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const rawHtml = await res.text();
      // 提取标题
      const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      // 提取正文文本/主要内容
      let bodyText = rawHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

      const bodyMatch = bodyText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const cleanBody = bodyMatch ? bodyMatch[1] : bodyText;

      const snapshotHtml = generateSnapshotHtml(url, title, cleanBody, today);
      fs.writeFileSync(snapshotFile, snapshotHtml, 'utf-8');

      snapshotIndex[url] = {
        hash,
        title: title || url,
        date: today,
        status: 'saved',
      };
      newSnapshots++;
      console.log('✅ 快照已生成');
    } catch (err) {
      console.log(`⚠️ 抓取跳过 (${err.message})`);
      // 依然记录失败状态，防止每次构建重复重试卡死
      snapshotIndex[url] = {
        hash,
        date: today,
        status: 'failed',
        error: err.message,
      };
    }
  }

  fs.writeFileSync(INDEX_FILE, JSON.stringify(snapshotIndex, null, 2), 'utf-8');
  console.log(`\n🎉 快照归档完成！新增 ${newSnapshots} 份永久离线快照，索引库已同步。`);
}

run();
