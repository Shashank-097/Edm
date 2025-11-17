// app/blog/page.tsx — server component
import BlogListClient, { BlogPost } from './BlogListClient';
import React from 'react';

async function fetchBlogsFromAPI(): Promise<unknown[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${base}/api/blogs`, { cache: 'no-store' });

  if (!res.ok) {
    console.error('server fetch blogs failed', await res.text());
    return [];
  }

  return await res.json();
}

type RawBlog = {
  _id?: string;
  id?: string;
  title?: string;
  content?: string;
  category?: string;
  date?: string;
  author?: string;
  images?: string[];
  videos?: string[];
  media?: {
    images?: string[];
    videos?: string[];
  };
};

/* ----------------- SLUG GENERATOR ----------------- */
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove invalid chars
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-');          // remove multiple hyphens
}

export default async function Page() {
  const rawPosts = await fetchBlogsFromAPI();

  const posts: BlogPost[] = (rawPosts ?? []).map((value) => {
    const p = value as RawBlog;

    const images = p.media?.images ?? p.images ?? [];
    const videos = p.media?.videos ?? p.videos ?? [];

    return {
      id: p._id ?? p.id ?? `${p.title ?? 'untitled'}-${p.date ?? ''}`,
      slug: generateSlug(p.title ?? ''),          // ✅ FIXED — ADDED SLUG
      title: p.title ?? '',
      content: p.content ?? '',
      category: p.category ?? 'Uncategorized',
      date: p.date ?? '',
      author: p.author ?? '',
      images,
      media: { images, videos },
    };
  });

  return <BlogListClient posts={posts} />;
}
