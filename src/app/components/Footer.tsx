"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#050A17] text-gray-300 pt-16 pb-8 border-t border-[#00B7FF]/20 relative overflow-hidden">
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00B7FF] via-[#00d5ff] to-transparent" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* --- Column 1: Brand --- */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/edm-logo.png" alt="EDM Logo" className="h-9 w-auto" />
            <h3 className="text-white font-extrabold text-2xl tracking-wide">
              EDM
            </h3>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Era of Digital Marketing helps brands grow through creative
            strategy, digital innovation, and authentic audience engagement.
          </p>

          {/* Social Links */}
          <div className="flex gap-5 mt-6">
            {[
              {
                href: "https://www.instagram.com/era_of_digital_marketing_?igsh=cXVyamU1M3V1dHB3&utm_source=qr",
                label: "Instagram",
                Icon: Instagram,
              },
              { href: "https://twitter.com/", label: "Twitter", Icon: FaXTwitter },
              {
                href: "https://www.linkedin.com/company/edm-era-of-digital-marketing/",
                label: "LinkedIn",
                Icon: Linkedin,
              },
              {
                href: "https://www.facebook.com/share/17XAuT6nox/",
                label: "Facebook",
                Icon: Facebook,
              },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-[#00B7FF] transition-colors"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>

        {/* --- Column 2: Quick Links --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Blogs", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="hover:text-[#00B7FF] transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 3: Services --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Services</h4>
          <ul className="space-y-3 text-sm">
            {[
              "Social Media Marketing",
              "SEO Optimization",
              "Brand Strategy",
              "Web Design",
              "Content Creation",
              "Paid Ads Management",
            ].map((service) => (
              <li
                key={service}
                className="hover:text-[#00B7FF] transition cursor-default"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 4: Contact Info --- */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#00B7FF] mt-[2px]" />
              <span>Head Office: Remote Operations (India)</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#00B7FF]" />
              <Link
                href="tel:+918954980226"
                className="hover:text-[#00B7FF] transition"
              >
                +91 8954980226
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#00B7FF]" />
              <Link
                href="mailto:connectatedm@gmail.com"
                className="hover:text-[#00B7FF] transition"
              >
                connectatedm@gmail.com
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Bottom Section --- */}
      <div className="border-t border-[#00B7FF]/10 mt-12 pt-6 text-center text-gray-500 text-sm space-y-2">
        <div className="flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
          <Link
            href="/termsconditions"
            className="hover:text-[#00B7FF] transition"
          >
            Terms & Conditions
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/privacypolicy"
            className="hover:text-[#00B7FF] transition"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} EDM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}