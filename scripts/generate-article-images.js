const sharp = require("sharp");
const path = require("path");

const outDir = path.join(process.cwd(), "public", "images", "blog");
const fs = require("fs");
fs.mkdirSync(outDir, { recursive: true });

async function createImage(filename, width, height, buildSvg) {
  const svgBuffer = Buffer.from(buildSvg(width, height));
  await sharp(svgBuffer)
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, filename));
  console.log(`Created: ${filename}`);
}

// Image 1: Featured - Landing Page vs Website
createImage("landing-page-vs-website.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="50%" stop-color="#12102a"/>
      <stop offset="100%" stop-color="#0a0a1e"/>
    </linearGradient>
    <linearGradient id="leftGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6B5FA9" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6B5FA9" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="rightGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D484B2" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#D484B2" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect x="80" y="80" width="720" height="920" rx="24" fill="url(#leftGrad)" stroke="rgba(107,95,169,0.3)" stroke-width="1"/>
  <rect x="1120" y="80" width="720" height="920" rx="24" fill="url(#rightGrad)" stroke="rgba(212,132,178,0.3)" stroke-width="1"/>
  <line x1="960" y1="80" x2="960" y2="1000" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="440" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="24" fill="rgba(255,255,255,0.6)" letter-spacing="3">LANDING PAGE</text>
  <text x="1480" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="24" fill="rgba(255,255,255,0.6)" letter-spacing="3">FULL WEBSITE</text>
  <text x="960" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="20" fill="rgba(255,255,255,0.4)" letter-spacing="4">VS</text>
  <circle cx="960" cy="520" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <circle cx="960" cy="520" r="25" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
</svg>
`);

// Image 2: Landing Page Conversion
createImage("landing-page-conversion.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect x="200" y="200" width="280" height="180" rx="16" fill="rgba(107,95,169,0.1)" stroke="rgba(107,95,169,0.3)" stroke-width="1"/>
  <text x="340" y="280" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.5)">AD</text>
  <line x1="480" y1="290" x2="720" y2="290" stroke="#6B5FA9" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
  <polygon points="720,290 700,282 700,298" fill="#6B5FA9" opacity="0.6"/>
  <rect x="760" y="200" width="400" height="680" rx="16" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.4)" stroke-width="1.5"/>
  <text x="960" y="280" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.7)">LANDING PAGE</text>
  <rect x="800" y="320" width="320" height="40" rx="8" fill="rgba(107,95,169,0.2)"/>
  <text x="960" y="345" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.4)">Focused Offer</text>
  <rect x="800" y="380" width="320" height="120" rx="8" fill="rgba(255,255,255,0.03)"/>
  <text x="960" y="450" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Clear Value</text>
  <rect x="840" y="520" width="240" height="48" rx="24" fill="#6B5FA9"/>
  <text x="960" y="549" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="white" font-weight="600">Book Consultation</text>
  <line x1="960" y1="680" x2="960" y2="780" stroke="#D484B2" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
  <polygon points="960,780 952,760 968,760" fill="#D484B2" opacity="0.6"/>
  <rect x="760" y="800" width="400" height="80" rx="16" fill="rgba(212,132,178,0.1)" stroke="rgba(212,132,178,0.4)" stroke-width="1"/>
  <text x="960" y="845" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.6)">LEAD</text>
</svg>
`);

// Image 3: Full Website Ecosystem
createImage("full-website-business-ecosystem.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect x="760" y="120" width="400" height="840" rx="24" fill="rgba(212,132,178,0.06)" stroke="rgba(212,132,178,0.25)" stroke-width="1"/>
  <rect x="820" y="180" width="280" height="50" rx="12" fill="rgba(212,132,178,0.12)"/>
  <text x="960" y="212" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Home</text>
  <rect x="820" y="250" width="280" height="50" rx="12" fill="rgba(212,132,178,0.08)"/>
  <text x="960" y="282" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">About</text>
  <rect x="820" y="320" width="280" height="50" rx="12" fill="rgba(212,132,178,0.08)"/>
  <text x="960" y="352" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Services</text>
  <rect x="820" y="390" width="280" height="50" rx="12" fill="rgba(212,132,178,0.08)"/>
  <text x="960" y="422" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Portfolio</text>
  <rect x="820" y="460" width="280" height="50" rx="12" fill="rgba(212,132,178,0.08)"/>
  <text x="960" y="492" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Blog</text>
  <rect x="820" y="530" width="280" height="50" rx="12" fill="rgba(212,132,178,0.08)"/>
  <text x="960" y="562" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Contact</text>
  <rect x="280" y="300" width="320" height="100" rx="16" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="440" y="355" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)">Brand</text>
  <rect x="1320" y="300" width="320" height="100" rx="16" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="1480" y="355" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)">Trust</text>
  <rect x="280" y="500" width="320" height="100" rx="16" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="440" y="555" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)">Content</text>
  <rect x="1320" y="500" width="320" height="100" rx="16" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="1480" y="555" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)">Portfolio</text>
  <line x1="600" y1="350" x2="760" y2="250" stroke="rgba(212,132,178,0.2)" stroke-width="1"/>
  <line x1="600" y1="550" x2="760" y2="450" stroke="rgba(212,132,178,0.2)" stroke-width="1"/>
  <line x1="1160" y1="250" x2="1320" y2="350" stroke="rgba(212,132,178,0.2)" stroke-width="1"/>
  <line x1="1160" y1="450" x2="1320" y2="550" stroke="rgba(212,132,178,0.2)" stroke-width="1"/>
  <text x="960" y="980" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.3)" letter-spacing="4">BUSINESS ECOSYSTEM</text>
</svg>
`);

// Image 4: Decision Framework
createImage("choose-landing-page-or-website.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect x="160" y="200" width="680" height="680" rx="24" fill="rgba(107,95,169,0.06)" stroke="rgba(107,95,169,0.25)" stroke-width="1"/>
  <text x="500" y="280" text-anchor="middle" font-family="ui-monospace, monospace" font-size="20" fill="rgba(255,255,255,0.6)" letter-spacing="2">PATH A</text>
  <rect x="260" y="340" width="480" height="60" rx="12" fill="rgba(107,95,169,0.15)"/>
  <text x="500" y="375" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">One Offer</text>
  <line x1="500" y1="400" x2="500" y2="460" stroke="#6B5FA9" stroke-width="2" opacity="0.5"/>
  <polygon points="500,460 492,448 508,448" fill="#6B5FA9" opacity="0.5"/>
  <rect x="260" y="480" width="480" height="60" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="500" y="515" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">One Goal</text>
  <line x1="500" y1="540" x2="500" y2="600" stroke="#6B5FA9" stroke-width="2" opacity="0.5"/>
  <polygon points="500,600 492,588 508,588" fill="#6B5FA9" opacity="0.5"/>
  <rect x="260" y="620" width="480" height="60" rx="12" fill="#6B5FA9" opacity="0.2" stroke="#6B5FA9" stroke-width="1.5"/>
  <text x="500" y="655" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="white" font-weight="600">Landing Page</text>
  <rect x="1080" y="200" width="680" height="680" rx="24" fill="rgba(212,132,178,0.06)" stroke="rgba(212,132,178,0.25)" stroke-width="1"/>
  <text x="1420" y="280" text-anchor="middle" font-family="ui-monospace, monospace" font-size="20" fill="rgba(255,255,255,0.6)" letter-spacing="2">PATH B</text>
  <rect x="1180" y="340" width="480" height="60" rx="12" fill="rgba(212,132,178,0.15)"/>
  <text x="1420" y="375" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Multiple Services</text>
  <line x1="1420" y1="400" x2="1420" y2="460" stroke="#D484B2" stroke-width="2" opacity="0.5"/>
  <polygon points="1420,460 1412,448 1428,448" fill="#D484B2" opacity="0.5"/>
  <rect x="1180" y="480" width="480" height="60" rx="12" fill="rgba(212,132,178,0.12)"/>
  <text x="1420" y="515" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Brand Story</text>
  <line x1="1420" y1="540" x2="1420" y2="600" stroke="#D484B2" stroke-width="2" opacity="0.5"/>
  <polygon points="1420,600 1412,588 1428,588" fill="#D484B2" opacity="0.5"/>
  <rect x="1180" y="620" width="480" height="60" rx="12" fill="#D484B2" opacity="0.2" stroke="#D484B2" stroke-width="1.5"/>
  <text x="1420" y="655" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="white" font-weight="600">Full Website</text>
  <text x="960" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.3)" letter-spacing="2">WHICH PATH?</text>
</svg>
`);

console.log("All images created successfully.");
