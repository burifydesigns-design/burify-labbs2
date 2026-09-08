const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
  /javascript:/gi,
  /data\s*:\s*text\/html/gi,
];

export function sanitizeHtml(html: string): string {
  let result = html;
  for (const pattern of DANGEROUS_PATTERNS) {
    result = result.replace(pattern, "");
  }
  return result;
}