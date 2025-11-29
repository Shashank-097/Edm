'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CategoryButtons from './CategoryButtons.client';

const MAX_WORDS = 50;
const POSTS_PER_SLIDE = 6;

/* --------------------------------------------------------------------------
   TIPTAP-SAFE HTML → PLAIN TEXT EXTRACTOR
-------------------------------------------------------------------------- */
function extractPlainText(html: string): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/?(span|strong|em|b|i|u|mark|code)[^>]*>/gi, "")
    .replace(/<a [^>]*>(.*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPreview(html: string, maxWords: number) {
  const text = extractPlainText(html);
  if (!text) return "";
  const words = text.split(" ").filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

/* --------------------------------------------------------------------------
   FIXED DATE FORMAT
-------------------------------------------------------------------------- */
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function BlogListClient({ posts: initialPosts }: { posts: any[] }) {
  const [posts] = useState(initialPosts ?? []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const visiblePosts =
    selectedCategory === "All"
      ? posts.slice().sort((a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime())
      : posts
          .filter((p) => p.category === selectedCategory)
          .slice()
          .sort((a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime());

  const totalSlides = Math.max(1, Math.ceil(visiblePosts.length / POSTS_PER_SLIDE));

  const currentPosts = visiblePosts.slice(
    currentSlide * POSTS_PER_SLIDE,
    (currentSlide + 1) * POSTS_PER_SLIDE
  );

  const goToSlide = (slide: number) => {
    setDirection(slide > currentSlide ? 1 : -1);
    setCurrentSlide(slide);
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] p-6 text-white relative">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">The Beacon</h1>

        {/* CATEGORY FILTER */}
        <CategoryButtons
          selectedCategory={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            setCurrentSlide(0);
          }}
          showAll={showAllCategories}
          setShowAll={setShowAllCategories}
        />

        {/* BLOG SLIDES */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {currentPosts.length === 0 ? (
                <p className="text-center text-lg text-gray-400 mt-12">No blogs posted yet.</p>
              ) : (
                currentPosts.map((post: any, idx: number) => {
                  const images = post.media?.images ?? post.images ?? [];
                  const slug = post.slug ?? post._id ?? post.id ?? null;
                  const preview = getPreview(post.content, MAX_WORDS);

                  return (
                    <motion.article
                      key={post._id ?? post.id ?? idx}
                      className="cursor-pointer p-6 rounded-2xl bg-gradient-to-r 
                        from-[#0e1633] via-[#112136] to-[#0e1633] border shadow-lg 
                        relative group"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex flex-col md:flex-row gap-5">

                        {/* THUMBNAIL */}
                        {images.length > 0 && (
                          <div className="relative rounded-xl overflow-hidden shadow-lg w-full max-w-xs">
                            <Image
                              src={images[0]}
                              alt={post.title ?? 'cover'}
                              width={400}
                              height={240}
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* CONTENT */}
                        <div className="w-full">
                          <h2 className="text-2xl font-bold mb-1 text-[#00B7FF]">
                            {post.title}
                          </h2>

                          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-2">
                            {post.author && (
                              <span>
                                by <span className="text-[#00B7FF]">{post.author}</span>
                              </span>
                            )}
                            {post.date && <span>{formatDate(post.date)}</span>}
                          </div>

                          <span className="inline-block mb-2 px-3 py-1 rounded-full 
                            bg-[#00B7FF]/20 text-[#00B7FF] font-semibold text-xs"
                          >
                            {post.category ?? "Uncategorized"}
                          </span>

                          {/* PREVIEW */}
                          {preview && (
                            <p className="text-gray-200 whitespace-pre-wrap">
                              {preview}
                            </p>
                          )}

                          {/* READ MORE (FIXED) */}
                          {slug && (
                            <Link
                              href={`/blog/${encodeURIComponent(String(slug))}`}
                              className="mt-3 inline-block text-sm font-semibold 
                                text-[#00B7FF] hover:underline relative z-20"
                            >
                              Read More →
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* FULL-CARD CLICK (FIXED) */}
                      {slug && (
                        <Link
                          href={`/blog/${encodeURIComponent(String(slug))}`}
                          className="absolute inset-0 z-10"
                        />
                      )}
                    </motion.article>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PAGINATION */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center gap-8 mt-10">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-4 py-2 rounded-full bg-[#00B7FF]/20 hover:bg-[#00B7FF]/30 disabled:opacity-30"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentSlide ? "bg-[#00B7FF]" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="px-4 py-2 rounded-full bg-[#00B7FF]/20 hover:bg-[#00B7FF]/30 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* ADMIN BUTTON */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-50 bg-[#00B7FF] 
        text-white font-bold px-4 py-2 rounded-full shadow-lg"
      >
        Admin Login
      </Link>
    </main>
  );
}
