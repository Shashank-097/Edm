import "./globals.css";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Edm",
  description: "Elevate your digital power",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 scroll-smooth">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition"
              aria-label="Go to homepage"
            >
              <Image
                src="/edm-logo.png"
                alt="EDM Logo"
                width={40}
                height={40}
                priority
              />
              <span className="font-semibold text-white tracking-wide">EDM</span>
            </Link>

            {/* Navigation links & CTA */}
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/" className="text-white hover:text-[#6AE5E6] transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-[#6AE5E6] transition-colors">
                About
              </Link>
              <Link href="/services" className="text-white hover:text-[#6AE5E6] transition-colors">
                Services
              </Link>
              <Link href="/Blog" className="text-white hover:text-[#6AE5E6] transition-colors">
                Blog
              </Link>
              <Link
                href="/contact"
                className="ml-4 px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-[#00B7FF] via-[#6AE5E6] to-[#00B7FF] text-[#0A0F1C] shadow-lg shadow-[#00B7FF]/50 hover:scale-105 transition-transform duration-200"
                aria-label="Book a Call"
              >
                Let's Connect
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
