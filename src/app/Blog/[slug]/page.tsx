// app/Blog/[slug]/page.tsx
export const dynamic = "force-dynamic"; // ⬅ required because fetch is dynamic

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
  } catch (err) {
    console.error("❌ Blog fetch failed:", err);
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
  const items: { level: number; text: string; id: string }[] = [];
  const used = new Map<string, number>();
  let match: RegExpExecArray | null;

  const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi;

  while ((match = headingRegex.exec(html))) {
    const level = Number(match[1]);
    const rawText = match[2].replace(/<[^>]+>/g, "");
    let id = rawText.toLowerCase().replace(/[^\w]+/g, "-") || "section";

    const count = (used.get(id) || 0) + 1;
    used.set(id, count);

    if (count > 1) id = `${id}-${count}`;

    items.push({ level, text: rawText, id });
  }

  return items;
}

/* ---------------- PAGE COMPONENT ---------------- */
export default async function BlogSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug; // ⬅ VALID — not a Promise

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base)
    return <div className="p-10 text-white">API URL Missing</div>;

  const blogData = await fetchPostBySlug(base, slug);
  const blog = Array.isArray(blogData) ? blogData[0] : blogData;

  if (!blog)
    return <div className="p-10 text-white">Blog Not Found</div>;

  const images = blog.media?.images ?? blog.images ?? [];

  const sanitizedHTML = DOMPurify.sanitize(blog.content || "");

  const toc = extractHeadings(sanitizedHTML);
  const readingTime = calcReadingTime(sanitizedHTML);

  /* ---- Inject unique heading IDs ---- */
  const idMap = new Map<string, number>();

  const htmlWithIds = sanitizedHTML.replace(
    /<h([1-4])([^>]*)>(.*?)<\/h\1>/gi,
    (
      full: string,
      lvl: string,
      rest: string,
      inner: string
    ) => {
      let baseId =
        inner
          .replace(/<[^>]+>/g, "")
          .toLowerCase()
          .replace(/[^\w]+>/g, "-") || "section";

      const count = (idMap.get(baseId) || 0) + 1;
      idMap.set(baseId, count);

      const id = count > 1 ? `${baseId}-${count}` : baseId;

      return `<h${lvl} id="${id}" ${rest}>${inner}</h${lvl}>`;
    }
  );

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-2 text-[#00B7FF]">
          {blog.title}
        </h1>

        {/* META */}
        <div className="flex items-center gap-6 text-gray-400 mb-4">
          {blog.author && (
            <p>
              By <span className="text-[#00B7FF]">{blog.author}</span>
            </p>
          )}
          {blog.date && (
            <p>{new Date(blog.date).toLocaleDateString()}</p>
          )}
          <p>⏱ {readingTime} min read</p>
        </div>

        {/* COVER IMAGE */}
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

        {/* TOC */}
        {toc.length > 0 && (
          <aside className="mb-10 p-5 rounded-xl bg-[#112136]/40 border border-[#00B7FF]/20">
            <h2 className="text-xl font-bold text-[#00B7FF] mb-3">
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {toc.map((item, i) => (
                <li key={`${item.id}-${i}`} className="ml-2">
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

        {/* ARTICLE */}
        <article className="prose prose-lg prose-invert max-w-none leading-relaxed prose-headings:text-[#00B7FF]">
          <div dangerouslySetInnerHTML={{ __html: htmlWithIds }} />
        </article>
      </div>
    </main>
  );
}
