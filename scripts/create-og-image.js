const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'public', 'images');
fs.mkdirSync(outDir, { recursive: true });

const w = 1200, h = 630;

const bgSvg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6B5FA9"/>
      <stop offset="100%" style="stop-color:#1A1625"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
</svg>`);

const overlaySvg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a78bfa"/>
      <stop offset="100%" style="stop-color:#f472b6"/>
    </linearGradient>
  </defs>
  <circle cx="200" cy="100" r="150" fill="rgba(167,139,250,0.06)"/>
  <circle cx="1050" cy="530" r="200" fill="rgba(244,114,182,0.06)"/>
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="100" y="170" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="bold" fill="white">Burify Labs</text>
  <line x1="100" y1="200" x2="480" y2="200" stroke="url(#a)" stroke-width="4" stroke-linecap="round"/>
  <text x="100" y="280" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="url(#a)">Web Design</text>
  <text x="100" y="340" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="url(#a)">AI Automation</text>
  <text x="100" y="400" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="url(#a)">AI Agents</text>
  <text x="100" y="460" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="url(#a)">Workflow Automation</text>
  <text x="100" y="540" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="rgba(255,255,255,0.45)">burifylabs.com</text>
  <circle cx="980" cy="480" r="65" fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.25)" stroke-width="1"/>
  <circle cx="980" cy="480" r="40" fill="none" stroke="rgba(167,139,250,0.45)" stroke-width="2"/>
  <circle cx="980" cy="480" r="18" fill="rgba(167,139,250,0.55)"/>
</svg>`);

async function create() {
  const bgBuffer = await sharp(bgSvg).resize(w, h).png().toBuffer();
  const overlayBuffer = await sharp(overlaySvg).resize(w, h).png().toBuffer();

  await sharp(bgBuffer)
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .png()
    .toFile(path.join(outDir, 'og-image.png'));

  console.log('OG image created successfully');
}

create().catch(err => console.error('Error:', err));
