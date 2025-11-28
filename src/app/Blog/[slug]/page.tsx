// app/Blog/[slug]/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";

// prevent SSR crash
const DOMPurify = require("isomorphic-dompurify");

async function fetchPostBySlug(base: string, slug: string) {
  try {
    const res = await fetch(`${base}/api/blogs/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchPostBySlug error:", err);
    return null;
  }
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug; // ✅ correct

  if (!slug) return <div>Missing slug</div>;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return <div>Server misconfiguration</div>;

  const post = await fetchPostBySlug(base, slug);

  if (!post) return <div>Post not found</div>;

  const images = post.media?.images ?? post.images ?? [];

  const sanitizedContent = DOMPurify.sanitize(post.content || "");

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="text-sm text-gray-500 mb-6">
        {post.author && <span>By {post.author}</span>}
        {post.date && <span className="mx-2">•</span>}
        {post.date && (
          <span>{new Date(post.date).toLocaleDateString()}</span>
        )}
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <img
            src={images[0]}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>
      )}

      <article
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </main>
  );
}
