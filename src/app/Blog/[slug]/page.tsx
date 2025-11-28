// app/blog/[slug]/page.tsx

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

/* ---------------- Calculate Reading Time ---------------- */
function calcReadingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* ---------------- Extract Headings ---------------- */
function extractHeadings(html: string) {
  const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi;
  const items: { level: number; text: string; id: string }[] = [];
  const usedIds = new Map<string, number>();
  let match;

  while ((match = headingRegex.exec(html))) {
    const level = Number(match[1]);
    const text = match[2].replace(/<[^>]+>/g, "");
    let id = text.toLowerCase().replace(/[^\w]+/g, "-") || "section";

    if (usedIds.has(id)) {
      const count = usedIds.get(id)! + 1;
      usedIds.set(id, count);
      id = `${id}-${count}`;
    } else {
      usedIds.set(id, 1);
    }

    items.push({ level, text, id });
  }

  return items;
}

/* ---------------- PAGE COMPONENT (Next.js 15 Compatible) ---------------- */
export default async function BlogSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params; // ✅ FIX: no await, correct typing

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return <div className="p-10 text-white">API URL Missing</div>;

  const blogData = await fetchPostBySlug(base, slug);
  const blog = Array.isArray(blogData) ? blogData[0] : blogData;

  if (!blog) return <div className="p-10 text-white">Blog Not Found</div>;

  const images = blog.media?.images ?? blog.images ?? [];
  const sanitizedHTML = DOMPurify.sanitize(blog.content || "");
  const toc = extractHeadings(sanitizedHTML);
  const readingTime = calcReadingTime(sanitizedHTML);

  /* ---------- Inject heading IDs ---------- */
  const headingIdMap = new Map<string, number>();
  const htmlWithIds = sanitizedHTML.replace(
    /<h([1-4])([^>]*)>(.*?)<\/h\1>/gi,
    (full, lvl, rest, inner) => {
      let baseId = inner
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .replace(/[^\w]+/g, "-") || "section";

      const count = headingIdMap.get(baseId) || 0;
      headingIdMap.set(baseId, count + 1);

      const id = count > 0 ? `${baseId}-${count + 1}` : baseId;

      return `<h${lvl} id="${id}" ${rest}>${inner}</h${lvl}>`;
    }
  );

  /* ---------------- RENDER ---------------- */
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
            <h2 className="text-xl font-bold text-[#00B7FF] mb-3">
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {toc.map((item, idx) => (
                <li key={`${item.id}-${idx}`} className="ml-2">
                  <a
                    href={`#${item.id}`}
                    className="text-gray-300 hover:text-[#00B7FF] transition"
                  >
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
            prose-a:text-[#00B7FF]
            prose-strong:text-[#00B7FF]
            prose-em:text-[#00B7FF]
            prose-mark:text-[#00B7FF]
            prose-mark:bg-[#00B7FF]/20
            prose-li:marker:text-[#00B7FF]
            prose-img:rounded-xl
            prose-blockquote:border-l-4
            prose-blockquote:border-[#00B7FF]
            prose-pre:bg-[#112136]
          "
        >
          <div
            className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#00B7FF]
                       first-letter:float-left first-letter:pr-3 first-letter:leading-[0.8]"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
        </article>
      </div>
    </main>
  );
}
