"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Facebook, // ✅ Added Facebook icon
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050A17] text-gray-300 pt-16 pb-8 mt-24 border-t border-[#00B7FF]/20 relative overflow-hidden">
      {/* Glow line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00B7FF] via-[#00d5ff] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-12">
        {/* --- Column 1: Brand --- */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/edm-logo.png" alt="EDM Logo" className="h-9 w-auto" />
            <h3 className="text-white font-extrabold text-2xl tracking-wide">
              EDM
            </h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            EDM (Era of Digital Marketing) helps brands grow through creative
            strategy, digital innovation, and authentic audience engagement.
          </p>

          {/* Socials */}
          <div className="flex gap-5 mt-6">
            <a
              href="https://www.instagram.com/era_of_digital_marketing_?igsh=cXVyamU1M3V1dHB3&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[#00B7FF] transition-colors"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-[#00B7FF] transition-colors"
            >
              <Twitter size={22} />
            </a>
            <a
              href="https://www.linkedin.com/company/edm-era-of-digital-marketing/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#00B7FF] transition-colors"
            >
              <Linkedin size={22} />
            </a>
            {/* ✅ Added Facebook Icon */}
            <a
              href="https://www.facebook.com/share/17XAuT6nox/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#00B7FF] transition-colors"
            >
              <Facebook size={22} />
            </a>
          </div>
        </div>

        {/* --- Column 2: Quick Links --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-[#00B7FF] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#00B7FF] transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[#00B7FF] transition">
                Services
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#00B7FF] transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#00B7FF] transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Column 3: Services --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Services</h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-[#00B7FF] transition">Social Media Marketing</li>
            <li className="hover:text-[#00B7FF] transition">SEO Optimization</li>
            <li className="hover:text-[#00B7FF] transition">Brand Strategy</li>
            <li className="hover:text-[#00B7FF] transition">Web Design</li>
            <li className="hover:text-[#00B7FF] transition">Content Creation</li>
            <li className="hover:text-[#00B7FF] transition">Paid Ads Management</li>
          </ul>
        </div>

        {/* --- Column 4: Contact Info --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#00B7FF] mt-[2px]" />
              <span>
                 Head Office: Remote Operations (India)
                  <br />
                
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#00B7FF]" />
              <Link
                href="tel:+919876543210"
                className="hover:text-[#00B7FF] transition"
              >
                +91 8954980226
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#00B7FF]" />
              <Link
                href="mailto:info@edm.com"
                className="hover:text-[#00B7FF] transition"
              >
                connectatedm@gmail.com
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Column 5: Newsletter --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">
            Stay Updated
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to our newsletter for the latest trends & insights.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-[#0E1528] text-gray-200 placeholder-gray-500 px-4 py-3 rounded-full border border-[#00B7FF]/20 focus:border-[#00B7FF] outline-none transition"
              required
            />
            <button
              type="submit"
              className="bg-[#00B7FF] hover:bg-[#00d5ff] text-white px-6 py-3 rounded-full font-medium text-sm transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* --- Bottom line --- */}
      <div className="border-t border-[#00B7FF]/10 mt-12 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} EDM. All rights reserved.
      </div>
    </footer>
  );
}
