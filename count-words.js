const fs = require('fs');
const content = fs.readFileSync('data/blog.ts', 'utf8');
const day8Articles = [
  'healthcare-website-ctas',
  'map-healthcare-admin-workflow-before-automating', 
  'healthcare-website-copy-patients-understand',
  'prioritize-healthcare-website-fixes',
  'healthcare-local-links'
];
day8Articles.forEach(slug => {
  const start = content.indexOf('slug: "' + slug + '"');
  if (start === -1) { console.log(slug + ': NOT FOUND'); return; }
  const articleStart = content.indexOf('content: `', start);
  const articleEnd = content.indexOf('`,', articleStart);
  const articleContent = content.substring(articleStart + 9, articleEnd);
  const text = articleContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(w => w.length > 0).length;
  console.log(slug + ': ' + words + ' words');
});