import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

/* ------------------------------------------------------
   SLUG GENERATOR
------------------------------------------------------ */
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ------------------------------------------------------
   FETCH BLOG FROM BACKEND
------------------------------------------------------ */
async function getBlog(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    console.error("❌ NEXT_PUBLIC_API_URL is missing!");
    return null;
  }

  try {
    const res = await fetch(`${base}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("❌ Blog API failed:", res.status, res.statusText);
      return null;
    }

    const all = await res.json();

    if (!Array.isArray(all)) {
      console.error("❌ API response is not an array:", all);
      return null;
    }

    const blog = all.find((b: any) => generateSlug(b.title ?? "") === slug);

    return blog ?? null;
  } catch (err) {
    console.error("🔥 ERROR Fetching Blog:", err);
    return null;
  }
}

/* ------------------------------------------------------
   FIX FOR NEXT.JS 15 — params must be Promise
------------------------------------------------------ */
export default async function BlogSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params; // ✔️ Next.js 15 fix

  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center">
        <h1 className="text-3xl">Blog Not Found</h1>
      </div>
    );
  }

  const images = blog.media?.images ?? blog.images ?? [];

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-[#00B7FF]">{blog.title}</h1>

        {/* Author */}
        {blog.author && (
          <p className="text-gray-400">
            Written by: <span className="text-[#00B7FF]">{blog.author}</span>
          </p>
        )}

        {/* Date */}
        {blog.date && (
          <p className="text-gray-400 mb-6">
            {new Date(blog.date).toLocaleDateString()}
          </p>
        )}

        {/* Cover Image */}
        {images.length > 0 && (
          <Image
            src={images[0]}
            width={900}
            height={450}
            className="rounded-xl mb-8 shadow-lg"
            alt="Blog cover image"
            unoptimized
          />
        )}

        {/* TipTap Content */}
        <article
          className="
            prose prose-lg prose-invert 
            max-w-none 
            leading-relaxed
            prose-headings:text-[#00B7FF]
            prose-a:text-[#00B7FF] hover:prose-a:underline
            prose-strong:text-white
            prose-li:marker:text-[#00B7FF]
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-[#00B7FF] prose-blockquote:pl-4 prose-blockquote:text-gray-300
            prose-pre:bg-[#0f172a] prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-xl
          "
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content || ""),
            }}
          />
        </article>
      </div>
    </main>
  );
}
