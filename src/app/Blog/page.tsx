// app/blog/page.tsx
import BlogListClient from "./BlogListClient";
import React from "react";

/* ============================================================================
   FETCH BLOGS FROM API — HANDLES ALL PAYLOAD SHAPES
============================================================================ */
async function fetchBlogsFromAPI(): Promise<any[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    console.error("❌ NEXT_PUBLIC_API_URL is not set");
    return [];
  }

  try {
    const res = await fetch(`${base}/api/blogs`, { cache: "no-store" });

    console.log(
      "📡 fetch /api/blogs status:",
      res.status,
      "content-type:",
      res.headers.get("content-type")
    );

    if (!res.ok) {
      const txt = await res.text().catch(() => "<failed-to-read-body>");
      console.error("❌ server fetch blogs failed", res.status, txt);
      return [];
    }

    let payload: any;
    try {
      payload = await res.json();
    } catch (err) {
      const text = await res.text().catch(() => "<failed-to-read-body>");
      console.error("❌ JSON parse error from /api/blogs:", text, err);
      return [];
    }

    // Accept many possible shapes
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.blogs)) return payload.blogs;
    if (Array.isArray(payload?.items)) return payload.items;

    // Single blog fallback
    if (payload && typeof payload === "object" && (payload._id || payload.id)) {
      return [payload];
    }

    // Try finding an array inside the object
    const possibleArray = Object.values(payload).find((v) => Array.isArray(v));
    if (Array.isArray(possibleArray)) return possibleArray;

    console.warn("⚠️ Unexpected payload shape:", payload);
    return [];
  } catch (err) {
    console.error("❌ fetch blogs exception:", err);
    return [];
  }
}

/* ============================================================================
   MAIN PAGE — NORMALIZES ALL BLOGS
============================================================================ */
export default async function Page() {
  const rawPosts = await fetchBlogsFromAPI();
  console.log("📌 RAW POSTS RECEIVED:", rawPosts);

  const postsArray = Array.isArray(rawPosts) ? rawPosts : [];

  /* ==========================================================================
     NORMALIZATION — FIXES IMAGES, CONTENT, SLUG, DATES
  ========================================================================== */
  const posts = postsArray.map((p: any) => {
    /* ----------------------------------------------------------------------
       IMAGE NORMALIZATION — ALL LEGACY FORMATS SUPPORTED
    ---------------------------------------------------------------------- */
    let images: string[] = [];

    if (Array.isArray(p.media?.images)) {
      images = p.media.images;
    }
    // ❗ missing before — the reason thumbnails weren’t showing
    else if (typeof p.media?.image === "string") {
      images = [p.media.image];
    }
    else if (Array.isArray(p.media?.image)) {
      images = p.media.image;
    }
    else if (Array.isArray(p.images)) {
      images = p.images;
    }
    else if (typeof p.image === "string") {
      images = [p.image];
    }
    else if (typeof p.img === "string") {
      images = [p.img];
    }
    else if (typeof p.thumbnail === "string") {
      images = [p.thumbnail];
    }
    else if (typeof p.featuredImage === "string") {
      images = [p.featuredImage];
    }

    /* ----------------------------------------------------------------------
       VIDEOS NORMALIZATION
    ---------------------------------------------------------------------- */
    let videos: string[] = [];

    if (Array.isArray(p.media?.videos)) {
      videos = p.media.videos;
    } else if (Array.isArray(p.videos)) {
      videos = p.videos;
    } else if (typeof p.video === "string") {
      videos = [p.video];
    }

    /* ----------------------------------------------------------------------
       CONTENT NORMALIZATION — ENSURES HTML STRING
    ---------------------------------------------------------------------- */
    let content = p.content || p.contentPreview || "";

    if (typeof content !== "string") {
      try {
        content = JSON.stringify(content);
      } catch {
        content = "";
      }
    }

    /* ----------------------------------------------------------------------
       FINAL CLEAN POST OBJECT
    ---------------------------------------------------------------------- */
    return {
      id: p._id ?? p.id ?? `${p.title ?? "untitled"}-${p.date ?? ""}`,
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
