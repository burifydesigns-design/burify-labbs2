// Throwaway QA script (not committed). Counts body-only words and scans for banned patterns.
const fs = require("fs");
const path = require("path");

const RANGES = {
  // First article each day is 1500-2000; others 900-1300
  "what-makes-a-healthcare-website-trustworthy": [1500, 2000],
  "why-your-competitor-ranks-above-you-on-google": [900, 1300],
  "automate-healthcare-enquiries-without-feeling-robotic": [900, 1300],
  "healthcare-websites-for-older-patients": [900, 1300],
  "what-a-healthcare-seo-score-tells-you": [900, 1300],
  "healthcare-website-speed-costs-patients": [1500, 2000],
  "how-google-evaluates-healthcare-content": [900, 1300],
  "5-healthcare-workflows-you-can-automate": [900, 1300],
  "website-ux-reduces-patient-friction": [900, 1300],
  "healthcare-website-conversion-audit": [900, 1300],
  "healthcare-website-navigation-patients": [1500, 2000],
  "healthcare-service-pages-seo": [900, 1300],
  "automated-appointment-workflows-patient-experience": [900, 1300],
  "healthcare-website-accessibility-checklist": [900, 1300],
  "healthcare-website-redesign-audit": [900, 1300],
  "healthcare-website-redesign-checklist": [1500, 2000],
  "healthcare-seo-audit-25-checks": [900, 1300],
  "ai-automation-vs-more-admin-staff": [900, 1300],
  "healthcare-appointment-form-design": [900, 1300],
  "healthcare-website-teardown": [900, 1300],
};

const BANNED = [
  "in today's digital landscape",
  "ever-evolving",
  "unlock the power of",
  "revolutionize",
  "game-changing",
  "seamless digital transformation",
  "leverage cutting-edge technology",
  "take your practice to the next level",
  "delve",
  "it's important to note",
  "in conclusion",
];

const PLACEHOLDER = ["TODO:", "lorem ipsum", "TBD", "[insert", "FIXME:", "PLACEHOLDER_", "XXX"];

const src = fs.readFileSync(path.join(__dirname, "data", "blog.ts"), "utf8");

// crude but effective: split on `id: "..."` blocks
const posts = [];
const re = /id:\s*"([^"]+)"\s*,\s*\n\s*slug:\s*"([^"]+)"\s*,\s*\n\s*title:\s*"([^"]+)"[\s\S]*?content:\s*`([\s\S]*?)`\s*,\s*\n\s*author/g;
let m;
while ((m = re.exec(src)) !== null) {
  posts.push({ id: m[1], slug: m[2], title: m[3], content: m[4] });
}

function bodyWords(html) {
  let t = html;
  // remove code blocks entirely
  t = t.replace(/<pre[\s\S]*?<\/pre>/gi, "");
  // remove tables entirely (markup excluded per instructions)
  t = t.replace(/<table[\s\S]*?<\/table>/gi, "");
  // remove html tags
  t = t.replace(/<[^>]+>/g, " ");
  // unescape
  t = t.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&#8211;/g, "-").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  return t.split(/\s+/).filter(Boolean).length;
}

let fails = 0;
for (const p of posts) {
  if (!RANGES[p.id]) continue;
  const words = bodyWords(p.content);
  const [lo, hi] = RANGES[p.id];
  const ok = words >= lo && words <= hi;
  if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${p.slug}  bodyWords=${words}  range=${lo}-${hi}`);
}
console.log("\n--- banned phrases ---");
let bannedFound = 0;
for (const p of posts) {
  if (!RANGES[p.id]) continue;
  const lower = p.content.toLowerCase();
  for (const b of BANNED) {
    if (lower.includes(b)) {
      console.log(`FOUND "${b}" in ${p.slug}`);
      bannedFound++;
    }
  }
}
if (!bannedFound) console.log("none found");
console.log("\n--- placeholders ---");
let phFound = 0;
for (const p of posts) {
  for (const ph of PLACEHOLDER) {
    if (p.content.toUpperCase().includes(ph.toUpperCase())) {
      console.log(`FOUND "${ph}" in ${p.slug}`);
      phFound++;
    }
  }
}
if (!phFound) console.log("none found");
