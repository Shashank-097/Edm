'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useSafeScroll } from '@/utils/useSafeScroll';
import HeroSection from '@/app/components/Hero';
import ServiceSection from '@/app/components/ourservices';
import AboutSection from '@/app/components/about';
import Clientslogo from '@/app/components/Clientslogo';
import ChatbotToggle from '@/app/components/ChatbotToggle';

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  // ✅ TypeScript fix for build error
  const { scrollYProgress: heroScroll } = useSafeScroll(
    heroRef as React.RefObject<HTMLElement>
  );

  return (
    <>
      <main className="bg-[#0A0F1C] text-white overflow-hidden relative z-10">
        {/* Home Section */}
        <div id="home">
          <HeroSection heroRef={heroRef} heroScroll={heroScroll} />
        </div>

        {/* Services Section */}
        <div id="services">
          <ServiceSection />
        </div>

        {/* About Section */}
        <div id="about">
          <AboutSection />
        </div>

        {/* Blog Section - Optional */}
        <div id="blog"></div>

        {/* Contact Section - Optional */}
        <div id="contact"></div>

        <Clientslogo />
      </main>

      {/* Chatbot Toggle */}
      <ChatbotToggle />
    </>
  );
}
