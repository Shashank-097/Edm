'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    { top: number; left: number; size: number; delay: number }[]
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const generated = Array.from({ length: 20 }, () => ({
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(generated);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const icons = [
    { icon: <Mail size={28} />, top: 60, left: 40 },
    { icon: <Phone size={28} />, top: 250, left: 60 },
    { icon: <MessageCircle size={28} />, top: 150, left: 260 },
  ];

  const calculateOffset = (iconTop: number, iconLeft: number) => {
    const dx = iconLeft - cursorPos.x;
    const dy = iconTop - cursorPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.min(100 / (dist + 1), 20);
    return { x: (dx / dist) * force || 0, y: (dy / dist) * force || 0 };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1B2738] flex items-center justify-center p-6 relative overflow-hidden text-white">
      
      {/* Floating circles */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#00B7FF]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-10 w-60 h-60 bg-[#FF6B6B]/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Drifting particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white rounded-full opacity-20"
          style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 + Math.random() * 4, delay: p.delay }}
        />
      ))}

      {/* Floating icons */}
      {icons.map((icon, idx) => {
        const offset = calculateOffset(icon.top, icon.left);
        return (
          <motion.div
            key={idx}
            style={{
              position: 'absolute',
              top: icon.top,
              left: icon.left,
              x: offset.x,
              y: offset.y,
            }}
            className="text-[#00B7FF]/70"
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {icon.icon}
          </motion.div>
        );
      })}

      {/* Contact card */}
      <motion.section
        className="max-w-md w-full bg-[#112136]/90 rounded-3xl p-10 shadow-2xl backdrop-blur-md border border-[#00B7FF]/20 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-center text-4xl font-extrabold text-[#00B7FF] mb-4 animate-pulse">
          Contact Us
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Email us:{' '}
          <a
            href="mailto:contact@company.com"
            className="text-[#00B7FF] hover:underline"
          >
            connectatedm@gmail.com
          </a>
        </p>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert('Message sent successfully!');
          }}
        >
          <label className="flex flex-col">
            <span className="mb-2 font-semibold text-gray-400">Full Name</span>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              required
              autoComplete="off"
              className="rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-2 font-semibold text-gray-400">Email</span>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              required
              autoComplete="off"
              className="rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-2 font-semibold text-gray-400">Message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Write your message here"
              required
              className="resize-none rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
            />
          </label>

          <motion.button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#00B7FF] py-3 font-semibold text-white shadow-lg hover:bg-[#0077cc] hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </form>
      </motion.section>
    </main>
  );
}  