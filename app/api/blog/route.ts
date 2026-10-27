import { NextResponse } from "next/server";
import { getCmsPublishedPosts } from "@/lib/blog-supabase";

export async function GET() {
  const posts = await getCmsPublishedPosts();
  return NextResponse.json(posts, {
    headers: { "Cache-Control": "no-store" },
  });
}
