// app/blog/CategoryButtons.client.tsx
'use client';
import { motion } from 'framer-motion';

const ALL_CATEGORIES = [
  "Digital Marketing","SEO (Search Engine Optimization)","Social Media Marketing",
  "Performance Marketing","Branding & Design","Website Development","Content Marketing",
  "Google Ads","Analytics & Tools","Business Growth","Case Studies","Trends & Innovations",
  "Tips & Guides","Agency Updates","Artificial Intelligence"
];

export default function CategoryButtons({
  selectedCategory,
  onSelect,
  showAll,
  setShowAll
}: {
  selectedCategory: string;
  onSelect: (c: string) => void;
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}) {
  const featured = ALL_CATEGORIES.slice(0, 4);
  const CATEGORY_BUTTONS = ['All', ...featured];
  const otherCategories = ALL_CATEGORIES.slice(4);

  return (
    <>
      <div className="flex gap-3 justify-start overflow-x-auto scrollbar-hide mb-8 px-2 py-1">
        {CATEGORY_BUTTONS.map(category => (
          <motion.button
            key={category}
            onClick={() => onSelect(category)}
            className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedCategory === category ? 'bg-gradient-to-r from-[#00B7FF] to-[#6AE5E6] text-white shadow-lg' : 'bg-[#112136] text-[#00B7FF]'
            }`}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </motion.button>
        ))}

        {!showAll && (
          <motion.button onClick={() => setShowAll(true)} aria-label="Show other categories" className="flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm bg-[#112136] text-[#00B7FF]">
            Other
          </motion.button>
        )}
      </div>

      {showAll && (
        <div className="max-w-4xl mx-auto px-4 py-4 mb-6 rounded-xl bg-[#112136] border border-[#00B7FF]/50 flex flex-wrap gap-3 justify-center">
          {otherCategories.map(cat => (
            <motion.button key={cat} onClick={() => { onSelect(cat); setShowAll(false); }} className="px-4 py-2 rounded-full font-semibold text-sm bg-[#0A0F1C] text-[#00B7FF]">
              {cat}
            </motion.button>
          ))}
          <motion.button onClick={() => setShowAll(false)} className="px-4 py-2 rounded-full font-semibold text-sm bg-[#FF4655] text-white">Close</motion.button>
        </div>
      )}
    </>
  );
}