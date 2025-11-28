// app/blog/page.tsx
export const dynamic = "force-dynamic"; // 🔥 REQUIRED for runtime fetching

import BlogListClient from "./BlogListClient";
import React from "react";

/* ============================================================================
   FETCH BLOGS FROM API — WITH NO ERROR FROM NEXT.JS 15
============================================================================ */
async function fetchBlogsFromAPI(): Promise<any[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    console.error("❌ NEXT_PUBLIC_API_URL is not set");
    return [];
  }

  try {
    // ❗ IMPORTANT: remove next:{revalidate:0} to avoid dynamic errors
    const res = await fetch(`${base}/api/blogs`, {
      cache: "no-store", // always dynamic
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("❌ Blog fetch failed:", res.status, txt);
      return [];
    }

    // Safe JSON parse
    let payload: any;
    try {
      payload = await res.json();
    } catch (err) {
      console.error("❌ JSON parsing failed:", err);
      return [];
    }

    // Accept multiple formats
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.blogs)) return payload.blogs;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;

    if (payload && typeof payload === "object") {
      // Single blog fallback
      if (payload._id || payload.id) return [payload];

      // Try to find an array inside object
      const arr = Object.values(payload).find((v) => Array.isArray(v));
      if (Array.isArray(arr)) return arr;
    }

    console.warn("⚠️ Unknown blogs payload:", payload);
    return [];
  } catch (err) {
    console.error("❌ fetch blogs exception:", err);
    return [];
  }
}

/* ============================================================================
   MAIN — NORMALIZE POSTS FOR BlogListClient
============================================================================ */
export default async function Page() {
  const raw = await fetchBlogsFromAPI();
  const list = Array.isArray(raw) ? raw : [];

  const posts = list.map((p: any) => {
    /* ----------------------------------------------
       IMAGE NORMALIZATION (supports all legacy fields)
    ---------------------------------------------- */
    let images: string[] = [];

    if (Array.isArray(p.media?.images)) images = p.media.images;
    else if (typeof p.media?.image === "string") images = [p.media.image];
    else if (Array.isArray(p.media?.image)) images = p.media.image;
    else if (Array.isArray(p.images)) images = p.images;
    else if (typeof p.image === "string") images = [p.image];
    else if (typeof p.img === "string") images = [p.img];
    else if (typeof p.thumbnail === "string") images = [p.thumbnail];
    else if (typeof p.featuredImage === "string") images = [p.featuredImage];

    /* ----------------------------------------------
       VIDEO NORMALIZATION
    ---------------------------------------------- */
    let videos: string[] = [];

    if (Array.isArray(p.media?.videos)) videos = p.media.videos;
    else if (Array.isArray(p.videos)) videos = p.videos;
    else if (typeof p.video === "string") videos = [p.video];

    /* ----------------------------------------------
       CONTENT NORMALIZATION
    ---------------------------------------------- */
    let content = p.content || p.contentPreview || "";
    if (typeof content !== "string") {
      try {
        content = JSON.stringify(content);
      } catch {
        content = "";
      }
    }

    /* ----------------------------------------------
       FINAL CLEAN OBJECT
    ---------------------------------------------- */
    return {
      id: p._id ?? p.id ?? `${p.title}-${p.date ?? ""}`,
      slug: p.slug ?? p._id ?? p.id ?? "",
      title: p.title ?? "",
      content,
      category: p.category ?? "Uncategorized",
      date: p.date ?? "",
      author: p.author ?? "",
      images,
      videos,
      media: { images, videos },
    };
  });

  return <BlogListClient posts={posts} />;
}
