export const imageSeoArchitecture = {
  filenames:
    "Use lowercase, hyphenated, descriptive filenames tied to the actual page subject.",
  altText:
    "Write useful alt text for meaningful images; use empty alt text only for decorative images.",
  responsiveImages:
    "Use next/image with explicit dimensions or stable aspect ratios and route-appropriate sizes.",
  optimization:
    "Prefer AVIF/WebP output through Next.js image optimization and lazy-load non-critical images.",
  openGraphImages: {
    status: "planned",
    dimensions: {
      width: 1200,
      height: 630,
    },
    rule: "Add page-specific Open Graph images only when real visual assets exist.",
  },
} as const;
