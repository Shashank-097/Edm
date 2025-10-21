"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const team = [
  {
    name: "Abhishek Tyagi",
    role: "Founder & CEO",
    bio: "Drives EDM’s vision, creative partnerships, and business growth.",
    photo: "/images/abhishek.jpg",
    socials: {
      instagram: "https://www.instagram.com/shivansh_6713?igsh=MnE3M2V3amFwY3Ex",
      twitter:
       "https://x.com/Abhishek245101?t=ztYL1DeC-8wNlHxv5_SOhA&s=09",
      linkedin: "https://www.linkedin.com/in/abhishek-tyagi-850840154?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
  },
  {
    name: "Ayush Dave",
    role: "Co-founder & Head of Operations",
    bio: "Certified by IIT Delhi, expert in campaign execution and innovation.",
    photo: "/images/ayush.jpg",
    socials: {
      instagram: "https://www.instagram.com/ayush18_?igsh=MW1xZ3FlcG1laDRlaw==",
      twitter: "https://x.com/DaveAyush?t=BWEKOkupC6bxbeXSOZ6OQQ&s=09",
      linkedin: "https://www.linkedin.com/in/ayush-dave-645293199?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
  },
];

export default function AboutSection() {
  return (
    <section className="relative max-w-5xl mx-auto py-24 px-6">
      {/* Headline */}
      <motion.h2
        className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-[#00B7FF] to-[#00d5ff] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,183,255,0.6)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        About EDM
      </motion.h2>

      {/* Intro paragraph */}
      <motion.p
        className="text-gray-300 text-center max-w-4xl mx-auto mb-16 text-lg md:text-xl leading-relaxed"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        EDM (Era of Digital Marketing) combines creative thinking with technical
        precision to grow brands through data-driven strategy, innovation, and
        partnership.
      </motion.p>

      {/* Team cards */}
      <motion.div
        className="grid gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.16 } },
        }}
      >
        {team.map(({ name, role, bio, photo, socials }) => (
          <motion.div
            key={name}
            className="group relative flex flex-col md:flex-row items-center rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#0E1A2F] to-[#07101F] p-8 shadow-lg border border-[#00B7FF]/30 hover:border-[#00d5ff]/60 transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 0 35px rgba(0,183,255,0.4)',
            }}
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#00B7FF]/10 via-[#00d5ff]/10 to-transparent blur-2xl" />

            <Link
              href="/about"
              aria-label={`Go to About page for ${name}`}
              className="flex flex-col md:flex-row items-center w-full relative z-10"
            >
              {/* Photo */}
              <motion.div
                className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative"
                whileHover={{ rotate: 1.5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00B7FF] to-[#00d5ff] opacity-30 blur-2xl animate-pulse -z-10" />
                <img
                  src={photo}
                  alt={`${name} photo`}
                  className="w-52 h-52 rounded-full object-cover border-4 border-[#00B7FF] shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(0,183,255,0.8)]"
                />
              </motion.div>

              {/* Text */}
              <div className="text-center md:text-left flex flex-col flex-1">
                <h3 className="text-[#00B7FF] font-extrabold text-2xl mb-2 tracking-wide drop-shadow-lg group-hover:text-[#00d5ff] transition-colors duration-300">
                  {name}
                </h3>
                <p className="text-gray-100 font-semibold text-base mb-4">
                  {role}
                </p>
                <motion.p
                  className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  {bio}
                </motion.p>
              </div>
            </Link>

            {/* Social Icons */}
            <div className="flex gap-6 justify-center md:justify-start mt-6 relative z-10">
              {socials.instagram && (
                <motion.a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} Instagram`}
                  whileHover={{ scale: 1.2, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Instagram
                    size={28}
                    className="text-[#00B7FF] hover:text-[#00d5ff] transition-colors"
                  />
                </motion.a>
              )}
              {socials.twitter && (
                <motion.a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} Twitter`}
                  whileHover={{ scale: 1.2, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Twitter
                    size={28}
                    className="text-[#00B7FF] hover:text-[#00d5ff] transition-colors"
                  />
                </motion.a>
              )}
              {socials.linkedin && (
                <motion.a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} LinkedIn`}
                  whileHover={{ scale: 1.2, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Linkedin
                    size={28}
                    className="text-[#00B7FF] hover:text-[#00d5ff] transition-colors"
                  />
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="flex justify-center mt-20"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.8, ease: 'easeInOut' }}
        viewport={{ once: true }}
      >
        <Link
          href="/about"
          className="px-12 py-4 bg-[#00B7FF] text-white rounded-full font-semibold text-lg hover:bg-[#009ae0] shadow-[0_0_20px_rgba(0,183,255,0.6)] transition-transform duration-300 ease-in-out hover:scale-105"
        >
          See Full Story
        </Link>
      </motion.div>
    </section>
  );
}
