alter table public.blog_posts
  add column if not exists legacy_metadata jsonb not null default '{}'::jsonb;

comment on column public.blog_posts.legacy_metadata is
  'Preserves legacy blog fields not represented by first-class CMS columns, including author, tags, canonical URL, related service paths, featured flag, and CTA.';
