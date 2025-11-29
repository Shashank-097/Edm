'use client';

import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blogs", href: "/blog" },  // changed "Blog" to lowercase path to follow URL conventions
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="bg-[#0A0F1C] text-gray-100 scroll-smooth relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0A0F1C]/95 to-transparent backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
            aria-label="Go to homepage"
          >
            <Image src="/edm-logo.png" alt="EDM Logo" width={40} height={40} priority />
            <span className="font-semibold text-white tracking-wide">EDM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.slice(0, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#6AE5E6] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-[#00B7FF] via-[#6AE5E6] to-[#00B7FF] text-[#0A0F1C] shadow-lg shadow-[#00B7FF]/40 hover:scale-105 transition-transform duration-200"
            >
              Let&apos;s Connect
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-md text-white hover:bg-white/10 transition"
              type="button"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
            onClick={() => setMobileMenuOpen(false)} // close when clicking outside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-64 h-full bg-[#0A0F1C] shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-2xl text-[#00B7FF]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md text-white hover:bg-white/10 transition"
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-[#6AE5E6] text-lg font-semibold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto">
                <Link
                  href="/contact"
                  className="block w-full text-center mt-6 px-5 py-3 font-semibold rounded-lg bg-gradient-to-r from-[#00B7FF] via-[#6AE5E6] to-[#00B7FF] text-[#0A0F1C] shadow-lg shadow-[#00B7FF]/50 hover:scale-105 transition-transform duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Let&apos;s Connect
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
