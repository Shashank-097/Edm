"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram,  Linkedin } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6"; // ✅ Real X (Twitter) logo
import { JSX } from "react";

type SocialLinks = {
  instagram?: string;
  X?: string;
  linkedin?: string;
};

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  socials: SocialLinks;
};

const team: TeamMember[] = [
  {
    name: "Abhishek Tyagi",
    role: "Founder & CEO",
    bio: "Drives EDM’s vision, creative partnerships, and business growth through innovation and strategy.",
    photo: "/images/abhishek.jpg",
    socials: {
      instagram: "https://www.instagram.com/shivansh_6713?igsh=MnE3M2V3amFwY3Ex",
      X: "https://x.com/Abhishek245101?t=ztYL1DeC-8wNlHxv5_SOhA&s=09",
      linkedin:
        "https://www.linkedin.com/in/abhishek-tyagi-850840154?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
  },
  {
    name: "Ayush Dave",
    role: "Co-founder & Head of Operations",
    bio: "Certified by IIT Delhi, expert in campaign execution, analytics, and performance-driven innovation.",
    photo: "/images/ayush.jpg",
    socials: {
      instagram: "https://www.instagram.com/ayush18_?igsh=MW1xZ3FlcG1laDRlaw==",
      X: "https://x.com/DaveAyush?t=BWEKOkupC6bxbeXSOZ6OQQ&s=09",
      linkedin:
        "https://www.linkedin.com/in/ayush-dave-645293199?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
  },
];

export default function AboutClient(): JSX.Element {
  return (
    <main className="relative overflow-hidden bg-[#050B16] text-gray-300">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1425] via-[#07101f] to-[#050B16] opacity-90" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#00B7FF]/10 rounded-full blur-[120px]" />

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Hero */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#00B7FF] to-[#00d5ff] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About EDM
        </motion.h1>

        <p className="text-center text-lg md:text-xl mb-16 text-gray-400">
          Transforming Ideas into Digital Power
        </p>

        {/* Intro */}
        <section className="space-y-6 leading-relaxed text-gray-300">
          <p>
            At <strong>Era of Digital Marketing (EDM)</strong>, we believe every
            brand has a story worth scaling. As a next-generation{" "}
            <strong>digital marketing agency in India</strong>, we help
            businesses grow by turning creative ideas into measurable
            performance. From strategy to execution, our team blends creativity,
            data, and technology to craft campaigns that deliver — not just
            clicks, but real business growth.
          </p>
        </section>

        {/* Our Story */}
        <section className="mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-[#00B7FF]">
            Our Story — Built on Innovation and Performance
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Founded with a vision to bridge creativity and measurable impact,
            EDM was born from the belief that digital success is not about luck
            — it’s about strategy. Over the years, we’ve partnered with ambitious
            startups and established brands alike, delivering 360° marketing
            solutions that help them lead in competitive markets. Whether it’s
            optimizing search visibility, designing high-converting websites, or
            automating customer journeys — our approach stays data-driven,
            design-focused, and performance-oriented.
          </p>
        </section>

        {/* What We Do */}
        <section className="mt-24 space-y-10">
          <h2 className="text-3xl font-bold text-[#00B7FF]">What We Do Best</h2>
          <div className="space-y-8 text-gray-400">
            {[
              {
                title:
                  "Performance Marketing – Spend Smarter, Grow Faster",
                desc: "Maximize ROI with targeted campaigns across Google Ads, Facebook, Instagram, and LinkedIn. Our real-time analytics and optimization ensure every campaign drives measurable growth.",
              },
              {
                title: "SEO – Dominate the Rankings",
                desc: "Gain organic visibility with our advanced SEO strategies — keyword research, competitor analysis, and local SEO tailored for Indian businesses.",
              },
              {
                title: "Social Media Marketing – Build Your Brand’s Social Vibe",
                desc: "From strategy to content, we help brands engage audiences across Instagram, Facebook, LinkedIn, and beyond — with storytelling that fuels growth.",
              },
              {
                title:
                  "Website Design & Development – Your Digital Storefront, Reimagined",
                desc: "We build responsive, fast, and conversion-optimized websites that combine design elegance with performance.",
              },
              {
                title: "Graphic Design & Branding – Visuals That Captivate",
                desc: "From logos to brand systems, our creative team crafts designs that elevate your presence and communicate your story powerfully.",
              },
              {
                title:
                  "Marketing Automation & CRM – Convert Leads While You Sleep",
                desc: "We implement workflows and CRM systems that nurture leads, boost retention, and drive scalable customer relationships.",
              },
            ].map(({ title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.02 }}
                className="transition-transform"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {title}
                </h3>
                <p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How We Deliver */}
        <section className="mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-[#00B7FF]">
            How We Deliver Results
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Data-Driven Strategy based on in-depth research and insights.</li>
            <li>Transparent Reporting with real-time dashboards and reviews.</li>
            <li>Full-Funnel Approach from awareness to retention.</li>
            <li>
              Custom Solutions tailored for Indian markets — Delhi, Mumbai, and
              beyond.
            </li>
            <li>Continuous Optimization using performance data and trends.</li>
          </ul>
        </section>

        {/* Mission & Vision */}
        <section className="mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-[#00B7FF]">
            Our Mission & Vision
          </h2>
          <p>
            <strong>Mission:</strong> To empower businesses with digital
            strategies that merge creativity and technology, driving sustainable
            growth and measurable success.
          </p>
          <p>
            <strong>Vision:</strong> To be India’s most trusted digital partner
            for performance-led growth and brand transformation across global
            markets.
          </p>
        </section>

        {/* Leadership */}
        <section className="mt-32">
          <h2 className="text-3xl font-bold text-[#00B7FF] text-center mb-16">
            Our Leadership
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            {team.map(({ name, role, bio, photo, socials }) => (
              <motion.div
                key={name}
                className="group relative flex flex-col items-center text-center rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#0E1A2F] to-[#07101F] p-10 shadow-xl border border-[#00B7FF]/30 hover:border-[#00d5ff]/60 transition-all duration-500"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 40px rgba(0,183,255,0.4)",
                }}
              >
                {/* Circular glowing image */}
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#00B7FF]/20 blur-2xl -z-10" />
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    className="rounded-full object-cover border-4 border-[#00B7FF] shadow-lg transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h3 className="text-[#00B7FF] font-bold text-2xl mb-1">{name}</h3>
                <p className="text-gray-100 font-semibold mb-4">{role}</p>
                <p className="text-gray-400 text-sm mb-6 max-w-sm">{bio}</p>

                <div className="flex gap-5 justify-center">
                  {socials.instagram && (
                    <a href={socials.instagram} target="_blank" rel="noreferrer">
                      <Instagram size={24} className="text-[#00B7FF] hover:text-[#00d5ff]" />
                    </a>
                  )}
                  {socials.X && (
                    <a href={socials.X} target="_blank" rel="noreferrer">
                      <FaXTwitter size={24} className="text-[#00B7FF] hover:text-[#00d5ff]" />
                    </a>
                  )}
                  {socials.linkedin && (
                    <a href={socials.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin size={24} className="text-[#00B7FF] hover:text-[#00d5ff]" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          className="text-center mt-32"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Let’s Build the Next Digital Success Story
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Your brand deserves more than just traffic — it deserves transformation.
            Let’s connect and discuss how EDM can help you achieve your growth goals.
          </p>
          <Link
            href="/contact"
            className="px-10 py-4 bg-[#00B7FF] text-white rounded-full font-semibold text-lg hover:bg-[#00a3e6] transition-transform hover:scale-105 shadow-[0_0_25px_rgba(0,183,255,0.6)]"
          >
            Start Your Digital Journey →
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
