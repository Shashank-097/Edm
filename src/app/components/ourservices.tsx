'use client'

import { motion, Variants } from 'framer-motion'
import { useState } from 'react'
import { Rocket, Search, Share2, Palette, MonitorSmartphone, Zap } from 'lucide-react'

const services = [
  {
    id: 1,
    title: 'Performance Marketing',
    tagline: 'Spend smarter, grow faster',
    description:
      'ROI-focused campaigns using Google Ads, Facebook Ads, and more. Real-time tracking and analytics to optimize ad spend with lead generation strategies.',
    icon: Rocket,
    color: '#00b7ff',
  },
  {
    id: 2,
    title: 'Search Engine Optimization',
    tagline: 'Helping you dominate search rankings',
    description:
      'Comprehensive keyword research and competitor analysis. On-page and off-page optimization with local SEO strategies for enhanced visibility.',
    icon: Search,
    color: '#007aff',
  },
  {
    id: 3,
    title: 'Social Media Marketing',
    tagline: "Building your brand's social vibe",
    description:
      'Strategy development for Instagram, LinkedIn, Facebook, and more. Creating scroll-stopping content with advanced audience targeting.',
    icon: Share2,
    color: '#00d5ff',
  },
  {
    id: 4,
    title: 'Graphic Design',
    tagline: 'Visuals that captivate and communicate',
    description:
      'High-quality branding materials including logos and infographics. Social media creatives and custom designs that reflect your brand identity.',
    icon: Palette,
    color: '#00b7ff',
  },
  {
    id: 5,
    title: 'Website Design & Development',
    tagline: 'Your digital storefront, reimagined',
    description:
      'Designing responsive and visually stunning websites. E-commerce platforms with speed optimization and mobile-friendly designs.',
    icon: MonitorSmartphone,
    color: '#0091cc',
  },
  {
    id: 6,
    title: 'Marketing Automation & CRM',
    tagline: 'Convert leads while you sleep',
    description:
      'Automated email sequences, lead nurturing workflows, and CRM integration. Behavioral targeting and personalized customer journeys at scale.',
    icon: Zap,
    color: '#007aff',
  },
]

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function NeonFlipServices() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [flipped, setFlipped] = useState<boolean[]>(Array(services.length).fill(false))

  return (
    <section className="relative bg-[#0A0F1C] py-24 min-h-screen overflow-hidden">
      {/* Neon Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#00122F] to-[#0A0F1C] animate-pulse-slow"></div>
        <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-[#00b7ff33] blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-[#007aff33] blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Heading */}
        <motion.h2
          className="text-5xl font-extrabold bg-gradient-to-r from-[#00b7ff] via-[#00d5ff] to-[#007aff] bg-clip-text text-transparent text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.25 }}
        >
          Our Services
        </motion.h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map(({ id, title, description, icon: Icon, color, tagline }, i) => (
            <motion.div
              key={id}
              className="relative w-full h-64 cursor-pointer perspective-1000 select-none"
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => {
                const newFlipped = [...flipped]
                newFlipped[i] = !newFlipped[i]
                setFlipped(newFlipped)
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                scale: 1.08,
                rotateX: -4,
                rotateY: 6,
                boxShadow: `0 0 36px 8px ${color}, 0 1px 10px 2px #001d35, inset 0 0 15px 5px ${color}55`,
                transition: { duration: 0.35, ease: 'easeInOut' },
              }}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform, box-shadow',
              }}
            >
              {/* Card container with smooth flip */}
              <motion.div
                className="relative h-full w-full rounded-2xl border border-[#004C80] bg-[#0B1728] shadow-lg"
                animate={{ rotateY: flipped[i] ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 25, mass: 0.6 }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl backface-hidden"
                  style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
                >
                  <div className="p-4 rounded-full mb-4 shadow-lg bg-black/40">
                    <Icon
                      size={48}
                      color={hoveredIndex === i ? color : '#fff'}
                      style={{
                        filter: hoveredIndex === i ? `drop-shadow(0 0 14px ${color})` : 'none',
                        transition: 'color 0.3s, filter 0.3s',
                      }}
                    />
                  </div>
                  <h3
                    className="text-xl font-semibold tracking-wider text-center"
                    style={{
                      color: hoveredIndex === i ? color : '#fff',
                      textShadow:
                        hoveredIndex === i ? `0 0 16px ${color}, 0 0 2px #fff` : '',
                      letterSpacing: '0.04em',
                      fontFamily: 'Poppins, Inter, sans-serif',
                      transition: 'color 0.3s, text-shadow 0.3s',
                    }}
                  >
                    {title}
                  </h3>
                  <button
                    className="mt-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#00B7FF33] backdrop-blur-sm shadow-neon hover:brightness-125 transition"
                  >
                    View Details
                  </button>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 p-6 flex flex-col justify-center rounded-2xl bg-[#071826] text-gray-200 backface-hidden"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      color,
                      letterSpacing: '0.025em',
                      fontFamily: 'Poppins, Inter, sans-serif',
                    }}
                  >
                    {title}
                  </h3>
                  <span
                    className="text-base font-medium mb-3"
                    style={{
                      color,
                      textShadow: `0 0 10px ${color}80`,
                    }}
                  >
                    {tagline}
                  </span>
                  <p className="text-sm leading-relaxed text-[#a1c7ee]">{description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
