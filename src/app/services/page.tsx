'use client'

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Rocket,
  Search,
  Share2,
  Palette,
  MonitorSmartphone,
  Zap,
} from "lucide-react";

const services = [
  {
    id: 1,
    title: "Performance Marketing",
    tagline: "Spend smarter, grow faster",
    description:
      "ROI-focused campaigns using Google Ads, Facebook Ads, and more. Real-time tracking and analytics to optimize ad spend with lead generation strategies.",
    icon: Rocket,
    color: "#00b7ff",
  },
  {
    id: 2,
    title: "Search Engine Optimization",
    tagline: "Helping you dominate search rankings",
    description:
      "Comprehensive keyword research and competitor analysis. On-page and off-page optimization with local SEO strategies for enhanced visibility.",
    icon: Search,
    color: "#007aff",
  },
  {
    id: 3,
    title: "Social Media Marketing",
    tagline: "Building your brand's social vibe",
    description:
      "Strategy development for Instagram, LinkedIn, Facebook, and more. Creating scroll-stopping content with advanced audience targeting.",
    icon: Share2,
    color: "#00d5ff",
  },
  {
    id: 4,
    title: "Graphic Design",
    tagline: "Visuals that captivate and communicate",
    description:
      "High-quality branding materials including logos and infographics. Social media creatives and custom designs that reflect your brand identity.",
    icon: Palette,
    color: "#00b7ff",
  },
  {
    id: 5,
    title: "Website Design & Development",
    tagline: "Your digital storefront, reimagined",
    description:
      "Designing responsive and visually stunning websites. E-commerce platforms with speed optimization and mobile-friendly designs.",
    icon: MonitorSmartphone,
    color: "#0091cc",
  },
  {
    id: 6,
    title: "Marketing Automation & CRM",
    tagline: "Convert leads while you sleep",
    description:
      "Automated email sequences, lead nurturing workflows, and CRM integration. Behavioral targeting and personalized customer journeys at scale.",
    icon: Zap,
    color: "#007aff",
  },
];

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function NeonSpotlightServices() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative bg-[#0A0F1C] py-24 overflow-hidden">
      {/* Neon background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#00122F] to-[#0A0F1C]"></div>
        <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-[#00b7ff20] rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
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

        <div className="flex flex-col gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={service.id}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative overflow-hidden rounded-2xl p-[2px] transition-all duration-300"
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, ${service.color}33, #00b7ff33)`
                    : "linear-gradient(135deg, #0F1629, #0F1629)",
                  boxShadow: isHovered
                    ? `0 0 30px ${service.color}55`
                    : "0 0 10px rgba(0,0,0,0.3)",
                }}
              >
                {/* inner card */}
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 bg-[#0F1629]/90 rounded-2xl px-6 py-8 md:py-10 backdrop-blur-lg">
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl"
                    style={{
                      background: `${service.color}15`,
                      boxShadow: isHovered
                        ? `0 0 25px ${service.color}66`
                        : "none",
                    }}
                  >
                    <Icon size={40} color={service.color} />
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p
                      className="text-[#00b7ff] font-medium mb-3"
                      style={{ color: service.color }}
                    >
                      {service.tagline}
                    </p>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Animated neon sweep on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
