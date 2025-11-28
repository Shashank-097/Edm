// app/Blog/[slug]/page.tsx
import BlogListClient from '../BlogListClient'; // or correct path for single post viewer
import React from 'react';

type Props = { params: { slug: string } };

async function fetchPostBySlug(base: string, slug: string) {
  try {
    const res = await fetch(`${base}/api/blogs/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) {
      const txt = await res.text().catch(() => '<no-body>');
      console.error('fetch post failed', res.status, txt);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('fetch post exception', err);
    return null;
  }
}

export default async function BlogPage({ params }: Props) {
  // <-- important: await params
  const { slug } = await params;

  if (!slug) {
    return <div>Missing slug</div>;
  }

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    console.error('NEXT_PUBLIC_API_URL not set');
    return <div>Server misconfiguration</div>;
  }

  const post = await fetchPostBySlug(base, slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  // normalize post media like you did before
  const images = post.media?.images ?? post.images ?? [];
  const videos = post.media?.videos ?? post.videos ?? [];

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        {post.author && <span>By {post.author}</span>}
        {post.date && <span className="mx-2">•</span>}
        {post.date && <span>{new Date(post.date).toLocaleDateString()}</span>}
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          {/* use next/image or plain img depending on your setup */}
          <img src={images[0]} alt={post.title} width={1200} height={600} className="rounded-lg object-cover" />
        </div>
      )}

      <article className="prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
    </main>
  );
}
