import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

/* ---------------- SLUG GENERATOR ---------------- */
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

/* ---------------- FETCH ONE BLOG ---------------- */
async function getBlog(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${base}/api/blogs`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;

    const all = await res.json();

    return (
      all.find((b: any) => generateSlug(b.title ?? "") === slug) ?? null
    );
  } catch (err) {
    console.error("❌ Error fetching blog:", err);
    return null;
  }
}

/* ---------------- SLUG PAGE ---------------- */
export default async function BlogSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlog(params.slug);

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
        <h1 className="text-4xl font-bold mb-4 text-[#00B7FF]">
          {blog.title}
        </h1>

        {/* Author & Date */}
        {blog.author && (
          <p className="text-gray-400">
            Written by:{" "}
            <span className="text-[#00B7FF]">{blog.author}</span>
          </p>
        )}

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
            alt="blog cover"
            unoptimized
          />
        )}

        {/* Tiptap Content */}
        <article
          className="
            prose prose-lg prose-invert max-w-none leading-relaxed
            prose-headings:text-[#00B7FF]
            prose-a:text-[#00B7FF] hover:prose-a:underline
            prose-strong:text-white
            prose-li:marker:text-[#00B7FF]
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-[#00B7FF] prose-blockquote:text-gray-300
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
