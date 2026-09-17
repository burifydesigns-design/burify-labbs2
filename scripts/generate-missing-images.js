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

createImage("branding-website-together.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6B5FA9" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#6B5FA9" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D484B2" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#D484B2" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <rect x="80" y="80" width="720" height="920" rx="24" fill="url(#purpleGrad)" stroke="rgba(107,95,169,0.3)" stroke-width="1"/>
  <rect x="1120" y="80" width="720" height="920" rx="24" fill="url(#pinkGrad)" stroke="rgba(212,132,178,0.3)" stroke-width="1"/>
  <line x1="960" y1="80" x2="960" y2="1000" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-dasharray="8 8"/>

  <text x="440" y="180" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.5)" letter-spacing="3">BRAND IDENTITY</text>
  <rect x="160" y="240" width="280" height="50" rx="12" fill="rgba(107,95,169,0.15)"/>
  <text x="300" y="270" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.6)">Logo</text>
  <rect x="160" y="310" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="300" y="340" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Color Palette</text>
  <circle cx="220" cy="335" r="10" fill="#6B5FA9" opacity="0.6"/><circle cx="245" cy="335" r="10" fill="#D484B2" opacity="0.6"/><circle cx="270" cy="335" r="10" fill="#4dd9d9" opacity="0.6"/>

  <rect x="160" y="380" width="280" height="50" rx="12" fill="rgba(107,95,169,0.1)"/>
  <text x="300" y="410" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Typography</text>
  <text x="300" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="rgba(255,255,255,0.3)">Aa Bb Cc</text>

  <rect x="160" y="460" width="280" height="50" rx="12" fill="rgba(107,95,169,0.1)"/>
  <text x="300" y="490" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Voice &amp; Tone</text>

  <rect x="160" y="530" width="280" height="50" rx="12" fill="rgba(107,95,169,0.1)"/>
  <text x="300" y="560" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Imagery Style</text>

  <text x="440" y="660" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.4)" letter-spacing="4">+</text>

  <rect x="80" y="720" width="720" height="80" rx="16" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="440" y="765" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.4)">Consistent Experience</text>

  <text x="1480" y="180" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.5)" letter-spacing="3">WEBSITE</text>
  <rect x="1200" y="240" width="520" height="50" rx="12" fill="rgba(212,132,178,0.15)"/>
  <text x="1460" y="270" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.6)">Header &amp; Navigation</text>
  <rect x="1200" y="310" width="520" height="120" rx="12" fill="rgba(212,132,178,0.1)"/>
  <text x="1460" y="355" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Hero Section</text>
  <text x="1460" y="380" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Clear message, brand colors, strong CTA</text>

  <rect x="1200" y="450" width="520" height="120" rx="12" fill="rgba(212,132,178,0.08)"/>
  <text x="1460" y="495" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Services &amp; Content</text>
  <text x="1460" y="520" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Consistent typography, imagery, and tone</text>

  <rect x="1200" y="590" width="520" height="80" rx="12" fill="rgba(212,132,178,0.06)"/>
  <text x="1460" y="635" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Contact &amp; CTA</text>

  <text x="1480" y="740" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.4)" letter-spacing="4">=</text>

  <rect x="1120" y="780" width="720" height="80" rx="16" fill="rgba(212,132,178,0.08)" stroke="rgba(212,132,178,0.2)" stroke-width="1"/>
  <text x="1480" y="825" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)">Unified Digital Experience</text>

  <circle cx="960" cy="520" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <circle cx="960" cy="520" r="18" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
</svg>
`);

createImage("small-business-conversion-problems.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <text x="960" y="80" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.5)" letter-spacing="3">WHY WEBSITES FAIL TO CONVERT</text>
  <line x1="200" y1="100" x2="1720" y2="100" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>

  <rect x="80" y="140" width="520" height="200" rx="16" fill="rgba(232,69,58,0.06)" stroke="rgba(232,69,58,0.2)" stroke-width="1"/>
  <text x="320" y="180" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)" letter-spacing="1">01</text>
  <text x="320" y="210" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" font-weight="600">Unclear Value</text>
  <text x="320" y="235" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Visitors leave because they</text>
  <text x="320" y="255" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">don't understand what you offer</text>
  <rect x="160" y="275" width="280" height="40" rx="8" fill="rgba(232,69,58,0.15)"/>
  <text x="300" y="300" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="#e8453a">Weak headline</text>

  <rect x="640" y="140" width="520" height="200" rx="16" fill="rgba(232,145,90,0.06)" stroke="rgba(232,145,90,0.2)" stroke-width="1"/>
  <text x="880" y="180" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)" letter-spacing="1">02</text>
  <text x="880" y="210" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" font-weight="600">Weak CTA</text>
  <text x="880" y="235" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Generic buttons leave visitors</text>
  <text x="880" y="255" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">without a clear next step</text>
  <rect x="720" y="275" width="280" height="40" rx="8" fill="rgba(232,145,90,0.15)"/>
  <text x="860" y="300" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="#e8915a">Learn More?</text>

  <rect x="1200" y="140" width="520" height="200" rx="16" fill="rgba(107,95,169,0.06)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="1440" y="180" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)" letter-spacing="1">03</text>
  <text x="1440" y="210" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" font-weight="600">Poor Mobile UX</text>
  <text x="1440" y="235" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Hard to use on phones,</text>
  <text x="1440" y="255" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">visitors leave frustrated</text>
  <rect x="1280" y="275" width="280" height="40" rx="8" fill="rgba(107,95,169,0.15)"/>
  <text x="1420" y="300" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="#6B5FA9">Zooming required</text>

  <rect x="80" y="380" width="520" height="200" rx="16" fill="rgba(212,132,178,0.06)" stroke="rgba(212,132,178,0.2)" stroke-width="1"/>
  <text x="320" y="420" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)" letter-spacing="1">04</text>
  <text x="320" y="450" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" font-weight="600">No Trust Signals</text>
  <text x="320" y="475" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Missing testimonials, reviews,</text>
  <text x="320" y="495" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">case studies, or social proof</text>
  <rect x="160" y="515" width="280" height="40" rx="8" fill="rgba(212,132,178,0.15)"/>
  <text x="300" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="#D484B2">No reviews shown</text>

  <rect x="640" y="380" width="520" height="200" rx="16" fill="rgba(232,69,58,0.06)" stroke="rgba(232,69,58,0.2)" stroke-width="1"/>
  <text x="880" y="420" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)" letter-spacing="1">05</text>
  <text x="880" y="450" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" font-weight="600">Too Much Noise</text>
  <text x="880" y="475" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Too many sections, popups,</text>
  <text x="880" y="495" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">and competing CTAs</text>
  <rect x="720" y="515" width="280" height="40" rx="8" fill="rgba(232,69,58,0.15)"/>
  <text x="860" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="#e8453a">Overwhelmed visitor</text>

  <rect x="1200" y="380" width="520" height="200" rx="16" fill="rgba(232,145,90,0.06)" stroke="rgba(232,145,90,0.2)" stroke-width="1"/>
  <text x="1440" y="420" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.4)" letter-spacing="1">06</text>
  <text x="1440" y="450" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" font-weight="600">Slow Performance</text>
  <text x="1440" y="475" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Large images, unoptimised</text>
  <text x="1440" y="495" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">assets, weak hosting</text>
  <rect x="1280" y="515" width="280" height="40" rx="8" fill="rgba(232,145,90,0.15)"/>
  <text x="1420" y="540" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="#e8915a">4+ second load</text>

  <line x1="200" y1="620" x2="1720" y2="620" stroke="rgba(107,95,169,0.15)" stroke-width="1"/>

  <rect x="660" y="660" width="600" height="80" rx="16" fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.2)" stroke-width="1"/>
  <text x="960" y="700" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)" letter-spacing="1">THE FIX: CLARITY + TRUST + ACTION</text>
  <text x="960" y="725" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">A better website experience converts visitors into customers</text>
</svg>
`);

createImage("ai-human-design-workflow.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6B5FA9" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6B5FA9" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4dd9d9" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#4dd9d9" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <text x="960" y="80" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.5)" letter-spacing="3">AI + HUMAN = BETTER WEB DESIGN</text>
  <line x1="200" y1="100" x2="1720" y2="100" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>

  <rect x="80" y="140" width="560" height="840" rx="24" fill="url(#purpleGrad)" stroke="rgba(107,95,169,0.3)" stroke-width="1"/>
  <text x="360" y="200" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.5)" letter-spacing="2">HUMAN DESIGNER</text>
  <rect x="140" y="240" width="360" height="50" rx="12" fill="rgba(107,95,169,0.15)"/>
  <text x="320" y="270" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Strategy &amp; Planning</text>
  <rect x="140" y="310" width="360" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="320" y="340" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Brand Understanding</text>
  <rect x="140" y="380" width="360" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="320" y="410" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Creative Direction</text>
  <rect x="140" y="450" width="360" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="320" y="480" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Quality Judgment</text>
  <rect x="140" y="520" width="360" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="320" y="550" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Client Communication</text>
  <rect x="140" y="590" width="360" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="320" y="620" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Final Decision Making</text>

  <rect x="1280" y="140" width="560" height="840" rx="24" fill="url(#cyanGrad)" stroke="rgba(77,217,217,0.3)" stroke-width="1"/>
  <text x="1560" y="200" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.5)" letter-spacing="2">AI ASSISTANT</text>
  <rect x="1340" y="240" width="360" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1520" y="270" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Generate Wireframes</text>
  <rect x="1340" y="310" width="360" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1520" y="340" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Draft Content</text>
  <rect x="1340" y="380" width="360" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1520" y="410" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Suggest Layouts</text>
  <rect x="1340" y="450" width="360" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1520" y="480" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Analyze Patterns</text>
  <rect x="1340" y="520" width="360" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1520" y="550" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Optimize Performance</text>
  <rect x="1340" y="590" width="360" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1520" y="620" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Speed Up Workflow</text>

  <rect x="760" y="360" width="400" height="120" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="960" y="410" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" fill="rgba(255,255,255,0.6)" letter-spacing="1">COLLABORATION</text>
  <text x="960" y="435" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">AI provides options, human</text>
  <text x="960" y="455" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">designer makes the right call</text>

  <rect x="760" y="520" width="400" height="100" rx="20" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="960" y="565" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)" letter-spacing="1">BETTER OUTCOME</text>
  <text x="960" y="590" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Faster, clearer, more strategic</text>
  <text x="960" y="610" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">website for the business</text>

  <line x1="640" y1="420" x2="760" y2="420" stroke="rgba(107,95,169,0.4)" stroke-width="2"/>
  <polygon points="760,420 748,414 748,426" fill="rgba(107,95,169,0.4)"/>
  <line x1="1160" y1="420" x2="1280" y2="420" stroke="rgba(77,217,217,0.4)" stroke-width="2"/>
  <polygon points="1280,420 1268,414 1268,426" fill="rgba(77,217,217,0.4)"/>
</svg>
`);

createImage("how-ai-is-changing-web-design-2026.jpg", 1920, 1080, (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a1e"/>
      <stop offset="100%" stop-color="#12102a"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6B5FA9" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#6B5FA9" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4dd9d9" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#4dd9d9" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <rect x="120" y="120" width="720" height="840" rx="24" fill="url(#purpleGrad)" stroke="rgba(107,95,169,0.3)" stroke-width="1"/>
  <text x="480" y="200" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.5)" letter-spacing="3">HUMAN DIRECTION</text>
  <rect x="200" y="260" width="280" height="50" rx="12" fill="rgba(107,95,169,0.15)"/>
  <text x="340" y="290" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Brand Strategy</text>
  <rect x="200" y="330" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="340" y="360" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Creative Vision</text>
  <rect x="200" y="400" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="340" y="430" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Quality Control</text>
  <rect x="200" y="470" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="340" y="500" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Client Insight</text>
  <rect x="200" y="540" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="340" y="570" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Final Decisions</text>
  <rect x="200" y="610" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="340" y="640" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Business Understanding</text>
  <rect x="200" y="680" width="280" height="50" rx="12" fill="rgba(107,95,169,0.12)"/>
  <text x="340" y="710" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Experience Design</text>

  <rect x="1080" y="120" width="720" height="840" rx="24" fill="url(#cyanGrad)" stroke="rgba(77,217,217,0.3)" stroke-width="1"/>
  <text x="1440" y="200" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="rgba(255,255,255,0.5)" letter-spacing="3">AI ASSISTANCE</text>
  <rect x="1160" y="260" width="280" height="50" rx="12" fill="rgba(77,217,217,0.12)"/>
  <text x="1300" y="290" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Generate Wireframes</text>
  <rect x="1160" y="330" width="280" height="50" rx="12" fill="rgba(77,217,217,0.1)"/>
  <text x="1300" y="360" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Draft Content</text>
  <rect x="1160" y="400" width="280" height="50" rx="12" fill="rgba(77,217,217,0.1)"/>
  <text x="1300" y="430" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Suggest Layouts</text>
  <rect x="1160" y="470" width="280" height="50" rx="12" fill="rgba(77,217,217,0.1)"/>
  <text x="1300" y="500" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Analyze Patterns</text>
  <rect x="1160" y="540" width="280" height="50" rx="12" fill="rgba(77,217,217,0.1)"/>
  <text x="1300" y="570" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Optimize Performance</text>
  <rect x="1160" y="610" width="280" height="50" rx="12" fill="rgba(77,217,217,0.1)"/>
  <text x="1300" y="640" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Speed Up Workflow</text>
  <rect x="1160" y="680" width="280" height="50" rx="12" fill="rgba(77,217,217,0.1)"/>
  <text x="1300" y="710" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" fill="rgba(255,255,255,0.5)">Data-Driven Insights</text>

  <rect x="760" y="380" width="400" height="140" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="960" y="430" text-anchor="middle" font-family="ui-monospace, monospace" font-size="16" fill="rgba(255,255,255,0.6)" letter-spacing="1">COLLABORATION</text>
  <text x="960" y="460" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.4)">AI provides speed and options</text>
  <text x="960" y="485" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.4)">Human provides strategy and taste</text>

  <rect x="760" y="560" width="400" height="100" rx="20" fill="rgba(107,95,169,0.08)" stroke="rgba(107,95,169,0.2)" stroke-width="1"/>
  <text x="960" y="610" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" fill="rgba(255,255,255,0.5)" letter-spacing="1">BETTER WEBSITES</text>
  <text x="960" y="635" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">Faster, clearer, more strategic</text>
  <text x="960" y="655" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="rgba(255,255,255,0.3)">digital experiences</text>

  <line x1="840" y1="440" x2="760" y2="440" stroke="rgba(107,95,169,0.4)" stroke-width="2"/>
  <polygon points="760,440 772,434 772,446" fill="rgba(107,95,169,0.4)"/>
  <line x1="1160" y1="440" x2="1080" y2="440" stroke="rgba(77,217,217,0.4)" stroke-width="2"/>
  <polygon points="1080,440 1068,434 1068,446" fill="rgba(77,217,217,0.4)"/>
</svg>
`);

console.log("All missing blog images created successfully.");
