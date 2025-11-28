// app/blog/[slug]/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

/* ---------------- FETCH ONE BLOG ---------------- */
async function fetchPostBySlug(base: string, slug: string) {
  try {
    // use no-store to always fetch fresh content on server
    const res = await fetch(`${base}/api/blogs/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      // provide a helpful error for logs
      const text = await res.text().catch(() => "");
      console.error("fetchPostBySlug failed:", res.status, text);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("fetchPostBySlug exception:", err);
    return null;
  }
}

/* ---------------- Calculate Reading Time ---------------- */
function calcReadingTime(html: string) {
  const text = (html || "").replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ---------------- Extract Headings (unique ids) ---------------- */
function extractHeadings(html: string) {
  const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi;
  const items: { level: number; text: string; id: string }[] = [];
  const usedIds = new Map<string, number>();
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html))) {
    const level = Number(match[1]);
    const text = match[2].replace(/<[^>]+>/g, "");
    let id = text.toLowerCase().replace(/[^\w]+/g, "-") || "section";

    if (usedIds.has(id)) {
      const count = (usedIds.get(id) ?? 1) + 1;
      usedIds.set(id, count);
      id = `${id}-${count}`;
    } else {
      usedIds.set(id, 1);
    }

    items.push({ level, text, id });
  }

  return items;
}

/* ---------------- PAGE COMPONENT ---------------- */
export default async function BlogSlugPage(props: { params?: { slug?: string | string[] } }) {
  // Do NOT await params — just read it
  const rawSlug = props?.params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";

  if (!slug) {
    return <div className="p-10 text-white">Missing slug</div>;
  }

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return <div className="p-10 text-white">API URL Missing</div>;
  }

  const blogData = await fetchPostBySlug(base, slug);
  const blog = Array.isArray(blogData) ? blogData[0] : blogData;

  if (!blog) {
    // returning 404-like UI for safety
    return <div className="p-10 text-white">Blog Not Found</div>;
  }

  const images: string[] = blog.media?.images ?? blog.images ?? [];
  const sanitizedHTML = DOMPurify.sanitize(blog.content ?? blog.contentPreview ?? "");
  const toc = extractHeadings(sanitizedHTML);
  const readingTime = calcReadingTime(sanitizedHTML);

  /* inject unique ids into headings so TOC anchors work */
  const headingIdMap = new Map<string, number>();
  const htmlWithIds = (sanitizedHTML || "").replace(
    /<h([1-4])([^>]*)>(.*?)<\/h\1>/gi,
    (_full, lvl, rest, inner) => {
      const baseId =
        (inner || "").replace(/<[^>]+>/g, "").toLowerCase().replace(/[^\w]+/g, "-") || "section";

      const count = headingIdMap.get(baseId) ?? 0;
      const newCount = count + 1;
      headingIdMap.set(baseId, newCount);

      const id = newCount > 1 ? `${baseId}-${newCount}` : baseId;
      // keep whatever attributes were on original heading (rest)
      return `<h${lvl} id="${id}" ${rest}>${inner}</h${lvl}>`;
    }
  );

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-[#00B7FF]">{blog.title}</h1>

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

        {toc.length > 0 && (
          <aside className="mb-10 p-5 rounded-xl bg-[#112136]/40 border border-[#00B7FF]/20">
            <h2 className="text-xl font-bold text-[#00B7FF] mb-3">Table of Contents</h2>
            <ul className="space-y-2">
              {toc.map((item, idx) => (
                <li key={`${item.id}-${idx}`} className="ml-2">
                  <a href={`#${item.id}`} className="text-gray-300 hover:text-[#00B7FF] transition">
                    {"— ".repeat(item.level - 1)}
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <article
          className="
            prose prose-lg prose-invert max-w-none leading-relaxed
            prose-headings:text-[#00B7FF]
            prose-a:text-[#00B7FF] hover:prose-a:underline
            prose-strong:text-[#00B7FF]
            prose-em:text-[#00B7FF] prose-em:italic
            prose-mark:text-[#00B7FF] prose-mark:bg-[#00B7FF]/20
            prose-li:marker:text-[#00B7FF]
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-l-4
            prose-blockquote:border-[#00B7FF]
            prose-blockquote:text-gray-300
            prose-blockquote:pl-6
            prose-code:text-[#00B7FF]
            prose-pre:bg-[#112136]
            prose-pre:text-gray-200
            prose-pre:border border-[#00B7FF]/30
          "
        >
          <div
            className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#00B7FF] first-letter:float-left first-letter:pr-3 first-letter:leading-[0.8]"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
        </article>
      </div>
    </main>
  );
}
