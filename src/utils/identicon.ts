/**
 * 认知内核算法感知几何徽章引擎 (Algorithmic Identicon Engine)
 * 纯数学与确定性哈希，零网络依赖，为每一篇文章生成独一无二的对称拓扑图腾印章
 */

export interface IdenticonResult {
  svg: string;
  color: string;
}

// 快速确定性哈希算法 (Murmur3 / FNV-1a 变体)
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// 基于种子的 PRNG (Linear Congruential Generator)
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// 高质感现代几何色板 (HSL 低饱和度科技色)
const PALETTES = [
  { hue: 199, sat: '89%', light: '48%' }, // 科技湖蓝 (Sky Blue)
  { hue: 160, sat: '84%', light: '39%' }, // 生态翠绿 (Emerald)
  { hue: 262, sat: '83%', light: '58%' }, // 认知紫罗兰 (Violet)
  { hue: 38,  sat: '92%', light: '50%' }, // 思想琥珀 (Amber)
  { hue: 339, sat: '90%', light: '51%' }, // 灵感玫红 (Rose)
  { hue: 173, sat: '80%', light: '40%' }, // 拓扑青绿 (Teal)
];

export function generateIdenticon(seedString: string, size: number = 32): IdenticonResult {
  const hash = hashString(seedString || 'default-seed');
  const rng = createRng(hash);

  const paletteIndex = Math.floor(rng() * PALETTES.length);
  const colorSpec = PALETTES[paletteIndex];
  const primaryColor = `hsl(${colorSpec.hue}, ${colorSpec.sat}, ${colorSpec.light})`;
  const fillColor = `hsla(${colorSpec.hue}, ${colorSpec.sat}, ${colorSpec.light}, 0.85)`;

  // 5x5 对称网格生成 (只需要决定左半边 3 列，右边 2 列轴对称映射)
  const gridSize = 5;
  const cellSize = size / gridSize;
  const grid: boolean[][] = [];

  for (let r = 0; r < gridSize; r++) {
    grid[r] = [];
    for (let c = 0; c < 3; c++) {
      // 阈值控制在 0.5 左右以获得美观的图案密度
      grid[r][c] = rng() > 0.48;
    }
    // 镜像对称
    grid[r][3] = grid[r][1];
    grid[r][4] = grid[r][0];
  }

  // 保证中心点有一定概率亮起以形成聚焦点
  if (rng() > 0.3) {
    grid[2][2] = true;
  }

  // 绘制 SVG 路径
  let rects = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c]) {
        const x = (c * cellSize).toFixed(1);
        const y = (r * cellSize).toFixed(1);
        const w = (cellSize * 0.92).toFixed(1);
        const h = (cellSize * 0.92).toFixed(1);
        rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fillColor}" />`;
      }
    }
  }

  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded-md shrink-0 shadow-xs border border-white/10" style="background: rgba(18, 18, 22, 0.6);">${rects}</svg>`;

  return {
    svg,
    color: primaryColor,
  };
}
