export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

/* ---------------- FETCH ONE BLOG ---------------- */
async function fetchPostBySlug(base: string, slug: string) {
  try {
    const res = await fetch(`${base}/api/blogs/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function calcReadingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function extractHeadings(html: string) {
  const regex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi;
  const items = [];
  const used = new Map();
  let m;

  while ((m = regex.exec(html))) {
    const level = Number(m[1]);
    const clean = m[2].replace(/<[^>]+>/g, "");
    let id = clean.toLowerCase().replace(/[^\w]+/g, "-") || "section";

    const count = (used.get(id) || 0) + 1;
    used.set(id, count);

    if (count > 1) id = `${id}-${count}`;

    items.push({ level, text: clean, id });
  }

  return items;
}

export default async function BlogSlugPage({ params }: any) {
  // ❌ WRONG: const { slug } = await params;
  // ✅ FIX:
  const { slug } = params;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return <div className="p-10 text-white">API URL Missing</div>;

  const postData = await fetchPostBySlug(base, slug);
  const blog = Array.isArray(postData) ? postData[0] : postData;

  if (!blog) return <div className="p-10 text-white">Blog Not Found</div>;

  const images = blog.media?.images ?? blog.images ?? [];

  const sanitized = DOMPurify.sanitize(blog.content || "");
  const toc = extractHeadings(sanitized);
  const readingTime = calcReadingTime(sanitized);

  const idMap = new Map();
  const htmlWithIds = sanitized.replace(
    /<h([1-4])([^>]*)>(.*?)<\/h\1>/gi,
    (full, lvl, rest, inner) => {
      let baseId = inner
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .replace(/[^\w]+/g, "-") || "section";

      const count = (idMap.get(baseId) || 0) + 1;
      idMap.set(baseId, count);

      const id = count > 1 ? `${baseId}-${count}` : baseId;

      return `<h${lvl} id="${id}" ${rest}>${inner}</h${lvl}>`;
    }
  );

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-[#00B7FF]">
          {blog.title}
        </h1>

        <div className="flex items-center gap-6 text-gray-400 mb-4">
          {blog.author && (
            <p>
              By <span className="text-[#00B7FF]">{blog.author}</span>
            </p>
          )}
          {blog.date && <p>{new Date(blog.date).toLocaleDateString()}</p>}
          <p>⏱ {readingTime} min read</p>
        </div>

        {images.length > 0 && (
          <Image
            src={images[0]}
            width={900}
            height={450}
            alt="Blog Cover"
            className="rounded-xl shadow-lg mb-8"
            unoptimized
          />
        )}

        {/* ToC + Article — unchanged */}
        ...
      </div>
    </main>
  );
}
