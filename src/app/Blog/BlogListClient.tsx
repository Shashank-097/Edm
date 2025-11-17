'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CategoryButtons from './CategoryButtons.client';

const MAX_WORDS = 80;
const POSTS_PER_SLIDE = 6;

/* ------------------- Types ------------------- */
export interface BlogPost {
  id: string | number;
  slug: string;
  title: string;
  content: string;
  author?: string;
  date?: string;
  category?: string;
  images?: string[];
  media?: {
    images?: string[];
    videos?: string[];
  };
}

/* ---------------- Utility Functions ---------------- */
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '');
}

function truncateWords(text: string, maxWords: number) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

/* --------- Hydration-safe date formatter ---------- */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ------------------- Component ------------------- */
export default function BlogListClient({ posts: initialPosts }: { posts: BlogPost[] }) {
  const [posts] = useState<BlogPost[]>(initialPosts ?? []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter + sort
  const visiblePosts: BlogPost[] =
    selectedCategory === 'All'
      ? posts.slice().sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
      : posts
          .filter((post) => post.category === selectedCategory)
          .slice()
          .sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime());

  const totalSlides = Math.max(1, Math.ceil(visiblePosts.length / POSTS_PER_SLIDE));
  const currentPosts = visiblePosts.slice(
    currentSlide * POSTS_PER_SLIDE,
    (currentSlide + 1) * POSTS_PER_SLIDE
  );

  return (
    <main className="min-h-screen bg-[#0A0F1C] p-6 text-white relative">
      
      {/* Admin Button */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-50 bg-[#00B7FF] text-white font-bold px-4 py-2 rounded-full shadow-lg"
      >
        Admin Login
      </Link>

      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4">The Beacon</h1>

        {/* Categories */}
        <CategoryButtons
          selectedCategory={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            setCurrentSlide(0);
          }}
          showAll={showAllCategories}
          setShowAll={setShowAllCategories}
        />

        {/* Blog List */}
        {currentPosts.length === 0 ? (
          <p className="text-center text-lg text-gray-600 mt-12">No blogs posted yet.</p>
        ) : (
          <div className="space-y-12">
            {currentPosts.map((post, idx) => {
              const images = post.images ?? post.media?.images ?? [];

              return (
                <Link key={post.id} href={`/Blog/${post.slug}`} className="block group">
                  <motion.article
                    className="p-6 rounded-2xl bg-gradient-to-r from-[#0e1633] via-[#112136] to-[#0e1633] 
                               border border-transparent shadow-lg relative"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">

                      {/* Thumbnail */}
                      {images.length > 0 && (
                        <div className="relative rounded-xl overflow-hidden shadow-lg max-w-xs mb-4 md:mb-0 md:mr-5 w-full md:w-auto">
                          <Image
                            src={images[0]}
                            alt={`${post.title} cover`}
                            width={400}
                            height={192}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                                          flex justify-center items-end p-3 opacity-0 
                                          group-hover:opacity-100 transition">
                            <span className="text-white font-semibold text-sm">Read Full Blog</span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="w-full">
                        <h2 className="text-2xl font-bold mb-1 text-[#00B7FF]">
                          {post.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-2">
                          {post.author && (
                            <span>
                              Written by:{' '}
                              <span className="text-[#00B7FF]">{post.author}</span>
                            </span>
                          )}
                          {post.date && (
                            <span>
                              Date:{' '}
                              <span className="text-[#00B7FF]">
                                {formatDate(post.date)}
                              </span>
                            </span>
                          )}
                        </div>

                        <span className="inline-block mb-2 px-3 py-1 rounded-full bg-[#00B7FF]/20 text-[#00B7FF] font-semibold text-xs select-none">
                          {post.category ?? 'Uncategorized'}
                        </span>

                        {/* FIXED — remove HTML from text preview */}
                        <p className="text-gray-200 whitespace-pre-wrap">
                          {truncateWords(stripHtml(post.content), MAX_WORDS)}
                        </p>

                        <span className="mt-2 inline-block text-sm font-semibold text-[#00B7FF]">
                          Read Full Blog →
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => setCurrentSlide(Math.max(currentSlide - 1, 0))}
              disabled={currentSlide === 0}
            >
              Previous
            </button>
            <span>
              {currentSlide + 1} / {totalSlides}
            </span>
            <button
              onClick={() =>
                setCurrentSlide(Math.min(currentSlide + 1, totalSlides - 1))
              }
              disabled={currentSlide === totalSlides - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
