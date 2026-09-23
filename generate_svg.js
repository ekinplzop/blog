const fs = require("fs");
const path = require("path");

const width = 1000;
const height = 660;
const cx = 330, cy = 330;

// 磁道定义（从外到内）
const tracks = [
  { id: 0, rIn: 220, rOut: 250, name: "外磁道 (Track 0)", color: "#3B82F6", isTrack: false },
  { id: 1, rIn: 185, rOut: 215, name: "磁道 1", color: "#10B981", isTrack: false },
  { id: 2, rIn: 150, rOut: 180, name: "磁道 2 (高亮完整磁道)", color: "#F97316", isTrack: true }, // 高亮整圈磁道
  { id: 3, rIn: 115, rOut: 145, name: "磁道 3", color: "#3B82F6", isTrack: false },
  { id: 4, rIn: 80,  rOut: 110, name: "内磁道 (Track 4)", color: "#10B981", isTrack: false },
];

const numSectors = 8;
const angleStep = 360 / numSectors; // 45度
const gapAngle = 1.8; // 扇区间隙
const toRad = deg => (deg * Math.PI) / 180;

let sectorPaths = [];

// 生成各个弧形扇区块
tracks.forEach((track, tIdx) => {
  for (let s = 0; s < numSectors; s++) {
    // 角度偏移，让磁头放在正右方 (约 0 度)
    const startDeg = s * angleStep + gapAngle / 2;
    const endDeg = (s + 1) * angleStep - gapAngle / 2;
    
    const r1 = track.rIn;
    const r2 = track.rOut;
    
    // 特别高亮：目标扇区（磁道2，扇区0，正在被磁头访问）
    const isTargetSector = (tIdx === 2 && s === 0);
    // 扇面区域：扇区 5（左上方）跨所有磁道，用于示意“扇面”
    const isInWedgeHighlight = (s === 5);

    let fill = track.color;
    let stroke = "none";
    let strokeWidth = 0;
    let fillOpacity = 0.88;

    if (track.isTrack) {
      fill = "#F97316"; // 橙色
      fillOpacity = 0.95;
    }
    
    if (isInWedgeHighlight) {
      // 扇面里的块稍微透出紫色蒙版或保持原色并加淡紫光晕
    }

    if (isTargetSector) {
      fill = "#EF4444"; // 亮红色，目标扇区
      stroke = "#FEE2E2";
      strokeWidth = 2.5;
      fillOpacity = 1;
    }

    const radStart = toRad(startDeg);
    const radEnd = toRad(endDeg);

    const x1 = cx + r2 * Math.cos(radStart);
    const y1 = cy + r2 * Math.sin(radStart);
    const x2 = cx + r2 * Math.cos(radEnd);
    const y2 = cy + r2 * Math.sin(radEnd);
    
    const x3 = cx + r1 * Math.cos(radEnd);
    const y3 = cy + r1 * Math.sin(radEnd);
    const x4 = cx + r1 * Math.cos(radStart);
    const y4 = cy + r1 * Math.sin(radStart);

    const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} ` +
              `A ${r2} ${r2} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} ` +
              `L ${x3.toFixed(2)} ${y3.toFixed(2)} ` +
              `A ${r1} ${r1} 0 0 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;

    sectorPaths.push(`  <path d="${d}" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="${strokeWidth}">
    <title>${track.name} - 扇区 #${s}</title>
  </path>`);
  }
});

// 扇面（Sector Wedge）虚线包络区域（扇区 5: 225° ~ 270°）
const wedgeS = 5;
const wDegStart = wedgeS * angleStep - 1;
const wDegEnd = (wedgeS + 1) * angleStep + 1;
const rwIn = 68;
const rwOut = 262;
const wx1 = cx + rwOut * Math.cos(toRad(wDegStart));
const wy1 = cy + rwOut * Math.sin(toRad(wDegStart));
const wx2 = cx + rwOut * Math.cos(toRad(wDegEnd));
const wy2 = cy + rwOut * Math.sin(toRad(wDegEnd));
const wx3 = cx + rwIn * Math.cos(toRad(wDegEnd));
const wy3 = cy + rwIn * Math.sin(toRad(wDegEnd));
const wx4 = cx + rwIn * Math.cos(toRad(wDegStart));
const wy4 = cy + rwIn * Math.sin(toRad(wDegStart));

const wedgeD = `M ${wx1.toFixed(2)} ${wy1.toFixed(2)} ` +
               `A ${rwOut} ${rwOut} 0 0 1 ${wx2.toFixed(2)} ${wy2.toFixed(2)} ` +
               `L ${wx3.toFixed(2)} ${wy3.toFixed(2)} ` +
               `A ${rwIn} ${rwIn} 0 0 0 ${wx4.toFixed(2)} ${wy4.toFixed(2)} Z`;

// 盘片逆时针旋转箭头 (在左下角附近做一段弧线箭头)
const rotR = 195;
const rotStart = toRad(120);
const rotEnd = toRad(160);
const rx1 = cx + rotR * Math.cos(rotStart);
const ry1 = cy + rotR * Math.sin(rotStart);
const rx2 = cx + rotR * Math.cos(rotEnd);
const ry2 = cy + rotR * Math.sin(rotEnd);
const rotPath = `M ${rx1.toFixed(2)} ${ry1.toFixed(2)} A ${rotR} ${rotR} 0 0 1 ${rx2.toFixed(2)} ${ry2.toFixed(2)}`;

// 磁臂与磁头位置（磁头悬停在 磁道2 (半径165), 角度 12° 处）
const headAngle = 10;
const headR = 165;
const hx = cx + headR * Math.cos(toRad(headAngle));
const hy = cy + headR * Math.sin(toRad(headAngle));

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- 背景渐变 -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>

    <!-- 卡片背景渐变 -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.95"/>
    </linearGradient>

    <!-- 磁头高光与渐变 -->
    <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="60%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>

    <!-- 主轴金属质感 -->
    <radialGradient id="spindleGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#94A3B8"/>
      <stop offset="50%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </radialGradient>

    <!-- 发光滤镜 -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    
    <!-- 箭头标记 -->
    <marker id="arrowSeek" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38BDF8"/>
    </marker>
    <marker id="arrowRotate" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#FACC15"/>
    </marker>
    <marker id="arrowPointer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94A3B8"/>
    </marker>
  </defs>

  <!-- 整体暗黑科技背景 -->
  <rect width="${width}" height="${height}" rx="16" fill="url(#bgGrad)" stroke="#334155" stroke-width="1.5"/>

  <!-- 顶部标题栏 -->
  <g id="title-header">
    <rect x="24" y="20" width="952" height="48" rx="8" fill="#1E293B" stroke="#334155" stroke-width="1"/>
    <circle cx="48" cy="44" r="6" fill="#3B82F6"/>
    <text x="64" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="700" fill="#F8FAFC">
      磁盘物理结构全景示意图（盘面 · 磁道 · 扇区 · 扇面 · 磁头）
    </text>
    <text x="830" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">
      考研 408 操作系统 / 计组
    </text>
  </g>

  <!-- 左侧：磁盘盘面图形区域 -->
  <g id="disk-canvas">
    <!-- 盘片外轮廓底盘投影与边框 -->
    <circle cx="${cx}" cy="${cy}" r="258" fill="#090D16" stroke="#475569" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="254" fill="none" stroke="#64748B" stroke-dasharray="3 3" stroke-width="1"/>

    <!-- 扇面（Sector Wedge）虚线标注背景高亮区 -->
    <path d="${wedgeD}" fill="#8B5CF6" fill-opacity="0.18" stroke="#A78BFA" stroke-width="2" stroke-dasharray="6 4"/>

    <!-- 40 个弧形扇区块 -->
    <g id="sectors">
${sectorPaths.join("\n")}
    </g>

    <!-- 中心主轴与空心孔 -->
    <circle cx="${cx}" cy="${cy}" r="70" fill="url(#spindleGrad)" stroke="#64748B" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="40" fill="#090D16" stroke="#334155" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="12" fill="#475569"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#E2E8F0">主轴</text>

    <!-- 旋转方向指示弧线与箭头 -->
    <path d="${rotPath}" fill="none" stroke="#FACC15" stroke-width="3" marker-end="url(#arrowRotate)"/>
    <text x="${cx - 170}" y="${cy + 120}" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#FACC15">
      盘片高速旋转方向
    </text>
    <text x
