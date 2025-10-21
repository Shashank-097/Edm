'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const ALL_CATEGORIES = [
  "Digital Marketing",
  "SEO (Search Engine Optimization)",
  "Social Media Marketing",
  "Performance Marketing",
  "Branding & Design",
  "Website Development",
  "Content Marketing",
  "Google Ads",
  "Analytics & Tools",
  "Business Growth",
  "Case Studies",
  "Trends & Innovations",
  "Tips & Guides",
  "Agency Updates",
  "Artificial Intelligence",
];

const MAX_WORDS = 100;
const POSTS_PER_SLIDE = 6;

function truncateWords(text: string, maxWords: number) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

type Media = {
  images?: string[];
  video?: string;
  audio?: string;
};

type Post = {
  title: string;
  content: string;
  category: string;
  media?: Media;
  date?: string;
  author?: string;
};

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredCategories = ALL_CATEGORIES.slice(0, 4);
  const CATEGORY_BUTTONS = ["All", ...featuredCategories];
  const otherCategories = ALL_CATEGORIES.slice(4);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const postsStr = localStorage.getItem('blog-posts');
      if (postsStr) {
        try {
          const parsed: Post[] = JSON.parse(postsStr).map((p) => ({
            ...p,
            media: {
              images: p.media?.images ?? [],
              video: p.media?.video,
              audio: p.media?.audio
            }
          }));
          setPosts(parsed);
        } catch (e) {
          console.error('Failed to parse blog posts from localStorage:', e);
        }
      }
    }
  }, []);

  const toggleExpand = (idx: number) => {
    setExpandedPost(expandedPost === idx ? null : idx);
  };

  const visiblePosts =
    selectedCategory === "All"
      ? posts.slice().sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
      : posts
          .filter(post => post.category === selectedCategory)
          .slice()
          .sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime());

  const totalSlides = Math.ceil(visiblePosts.length / POSTS_PER_SLIDE);
  const currentPosts = visiblePosts.slice(currentSlide * POSTS_PER_SLIDE, (currentSlide + 1) * POSTS_PER_SLIDE);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentSlide(0);
    setShowAllCategories(category === "Other");
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] p-6 text-white relative">
      {/* Admin link */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-50 bg-[#00B7FF] text-white font-bold px-4 py-2 rounded-full shadow-lg transition hover:bg-[#6AE5E6] focus:outline-none"
        title="Go to Admin Login"
      >
        Admin Login
      </Link>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-[#00B7FF] to-[#6AE5E6] bg-clip-text text-transparent drop-shadow py-1">
          The Beacon
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-[#00B7FF] to-[#6AE5E6] mx-auto rounded my-6" />

        {/* Category Buttons */}
        <div className="flex gap-3 justify-start overflow-x-auto scrollbar-hide mb-8 px-2 py-1">
          {CATEGORY_BUTTONS.map(category => (
            <motion.button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#00B7FF] to-[#6AE5E6] text-white shadow-lg"
                  : "bg-[#112136] text-[#00B7FF] hover:bg-[#0e1633] hover:text-[#00d5ff]"
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </motion.button>
          ))}

          {!showAllCategories && (
            <motion.button
              onClick={() => setShowAllCategories(true)}
              className="flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm bg-[#112136] text-[#00B7FF] hover:bg-[#0e1633] hover:text-[#00d5ff]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label="Show other categories"
            >
              Other
            </motion.button>
          )}
        </div>

        {/* Other Categories Dropdown */}
        {showAllCategories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 py-4 mb-6 rounded-xl bg-[#112136] border border-[#00B7FF]/50 flex flex-wrap gap-3 justify-center"
            role="region"
            aria-live="polite"
          >
            {otherCategories.map(category => (
              <motion.button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#00B7FF] to-[#6AE5E6] text-white shadow-lg"
                    : "bg-[#0A0F1C] text-[#00B7FF] hover:bg-[#112136] hover:text-[#00d5ff]"
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </motion.button>
            ))}
            <motion.button
              onClick={() => { setShowAllCategories(false); setSelectedCategory("All"); }}
              className="px-4 py-2 rounded-full font-semibold text-sm bg-[#FF4655] text-white hover:bg-[#FF637D] transition-all duration-300"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Close
            </motion.button>
          </motion.div>
        )}

        {/* Blog posts */}
        {currentPosts.length === 0 ? (
          <p className="text-center text-lg text-gray-600 mt-12">No blogs posted yet.</p>
        ) : (
          <div className="space-y-12">
            {currentPosts.map((post, idx) => {
              const globalIdx = currentSlide * POSTS_PER_SLIDE + idx;
              const isExpanded = expandedPost === globalIdx;
              const contentToShow = isExpanded ? post.content : truncateWords(post.content, MAX_WORDS);
              const hasMore = post.content.split(/\s+/).length > MAX_WORDS;

              const images = post.media?.images ?? [];

              return (
                <motion.article
                  key={globalIdx}
                  className="cursor-pointer p-6 rounded-2xl bg-gradient-to-r from-[#0e1633] via-[#112136] to-[#0e1633] border border-transparent shadow-lg relative group"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0, 183, 255, 0.6)' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => toggleExpand(globalIdx)}
                  tabIndex={0}
                  aria-expanded={isExpanded}
                >
                  <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
                    {images.length > 0 && (
                      <div className="relative rounded-xl overflow-hidden shadow-lg max-w-xs mb-4 md:mb-0 md:mr-5 w-full md:w-auto">
                        <Image
                          src={images[0]}
                          alt={`${post.title} cover`}
                          className="object-cover w-full h-48 transition group-hover:scale-105"
                          width={400}
                          height={192}
                          priority={idx < POSTS_PER_SLIDE} // prioritize images on first slide for better LCP
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-end p-3 opacity-0 group-hover:opacity-100 transition">
                          <span className="text-white font-semibold text-sm">Read More</span>
                        </div>
                      </div>
                    )}
                    <div className="w-full">
                      <h2 className="text-2xl font-bold mb-1 text-[#00B7FF] drop-shadow">{post.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-2">
                        {post.author && <span>Written by: <span className="text-[#00B7FF]">{post.author}</span></span>}
                        {post.date && <span>Date: <span className="text-[#00B7FF]">{formatDate(post.date)}</span></span>}
                      </div>
                      <span className="inline-block mb-2 px-3 py-1 rounded-full bg-[#00B7FF]/20 text-[#00B7FF] font-semibold text-xs select-none">
                        {post.category || "Uncategorized"}
                      </span>
                      <p className="text-gray-200 whitespace-pre-wrap">{contentToShow}</p>

                      {hasMore && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpand(globalIdx); }}
                          className="mt-2 text-sm font-semibold text-[#00B7FF] hover:underline"
                          aria-label={isExpanded ? "Read less" : "Read more"}
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}

                      {post.media?.video && (
                        <video controls src={post.media.video} className="mt-4 rounded-xl w-full max-h-64 shadow" />
                      )}
                      {post.media?.audio && (
                        <audio controls src={post.media.audio} className="mt-4 w-full" />
                      )}
                    </div>
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {images.slice(1).map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`${post.title} image ${i + 2}`}
                          className="max-h-20 rounded shadow"
                          width={80}
                          height={80}
                          style={{ minWidth: 80 }}
                          priority={false}
                        />
                      ))}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Slide navigation */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={() => setCurrentSlide(Math.max(currentSlide - 1, 0))}
              disabled={currentSlide === 0}
              className="px-6 py-2 bg-[#112136] text-[#00B7FF] rounded-full font-semibold hover:bg-[#0e1633] disabled:opacity-40 transition"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-gray-400 font-semibold self-center" aria-live="polite" aria-atomic="true">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button
              onClick={() => setCurrentSlide(Math.min(currentSlide + 1, totalSlides - 1))}
              disabled={currentSlide === totalSlides - 1}
              className="px-6 py-2 bg-[#112136] text-[#00B7FF] rounded-full font-semibold hover:bg-[#0e1633] disabled:opacity-40 transition"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
