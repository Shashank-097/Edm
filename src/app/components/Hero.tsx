'use client';

import {
  MotionConfig,
  motion,
  useTransform,
  type MotionValue,
  useReducedMotion,
  Variants,
} from 'framer-motion';
import { useEffect, useState } from 'react';
import FloatingIcons from '../../app/components/FloatingIcons';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  heroScroll: MotionValue<number>;
}

// Cursor trail effect – stays unchanged
function CursorTrail() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setCoords({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: coords.x - 24,
        y: coords.y - 24,
        pointerEvents: 'none',
        zIndex: 100,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.18, scale: [1, 1.65, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      className="w-12 h-12 rounded-full bg-[#00b7ff] blur-2xl mix-blend-screen"
    />
  );
}

// Animated headline typing behavior
const headlineWords = [
  { text: 'Transforming', neon: false, typing: false },
  { text: 'Ideas', neon: true, typing: true },
  { text: 'Into', neon: false, typing: false },
  { text: 'Digital', neon: true, typing: true },
  { text: 'Power', neon: true, typing: true },
];

const typingContainer: Variants = {
  hidden: {},
  visible: (i = 1) => ({
    transition: { staggerChildren: 0.12, delayChildren: i * 0.6 },
  }),
};

const letterVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 700, damping: 30 },
  },
};

// Individual word typing component
function TypingWord({
  word,
  neon,
  delayIndex,
}: {
  word: string;
  neon: boolean;
  delayIndex: number;
}) {
  return (
    <motion.span
      className={`inline-block mx-2 ${neon ? 'neon-overlay' : 'text-white'}`}
      variants={typingContainer}
      initial="hidden"
      animate="visible"
      custom={delayIndex}
      aria-label={word}
    >
      {word.split('').map((char, idx) => (
        <motion.span key={char + idx} variants={letterVariant} className="inline-block">
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HeroSection({ heroRef, heroScroll }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport size on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Scroll-based motion values
  const heroOpacity = useTransform(heroScroll, [0, 0.3], [1, 0]);
  const titleShiftY = useTransform(heroScroll, [0, 1], ['0px', '-40px']);
  const hintOpacity = useTransform(heroScroll, [0, 0.15], [1, 0]);

  const subText =
    'EDM (Era of Digital Marketing) blends creativity, strategy, and performance to accelerate your brand’s digital growth.';

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0F1C] text-white"
      >
        {/* Floating elements only for desktop */}
        {!isMobile && <FloatingIcons />}
        {!shouldReduceMotion && !isMobile && <CursorTrail />}

        {/* Glow background layers */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[radial-gradient(circle_at_top_left,_rgba(0,183,255,0.1),_transparent_70%)] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-[radial-gradient(circle_at_bottom_right,_rgba(0,117,255,0.12),_transparent_80%)] rounded-full" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, translateY: titleShiftY }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
        >
          {/* Headline Animation */}
          <motion.h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight relative">
            {headlineWords.map(({ text, neon, typing }, idx) =>
              typing ? (
                isMobile ? (
                  <span
                    key={text}
                    className={`inline-block mx-2 ${
                      neon ? 'neon-overlay-mobile' : 'text-white'
                    }`}
                  >
                    {text}
                  </span>
                ) : (
                  <TypingWord key={text} word={text} neon={neon} delayIndex={idx} />
                )
              ) : (
                <motion.span
                  key={text}
                  className="inline-block mx-2 text-white"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: [0, 1, 0.75], y: 0 }}
                  transition={{
                    delay: idx * 0.7,
                    duration: 1.2,
                    times: [0, 0.7, 1],
                  }}
                >
                  {text}
                </motion.span>
              )
            )}
            <span className="reflection" />
          </motion.h1>

          {/* Subtitle paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 2, ease: 'easeOut', delay: 4.3 }}
            className="mt-6 text-sm sm:text-base text-gray-400/80 max-w-3xl leading-relaxed"
          >
            {subText}
          </motion.p>

          {/* Cleaned CTA Button (escaped properly) */}
          <motion.a
            href="/contact"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 4.7 }}
            whileHover={{ scale: 1.07, boxShadow: '0 0 24px #00b7ff' }}
            whileTap={{ scale: 0.94 }}
            className="group relative mt-10 inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-[#cfefff] bg-[#0b1220]/80 border border-[#00b7ff]/20 transition-all duration-500"
          >
            <span className="relative z-10 flex items-center">{'Let\'s Connect'}</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00b7ff] to-[#0075ff] opacity-0 group-hover:opacity-80 blur-md transition-all duration-700" />
            <span className="absolute inset-0 rounded-full border border-[#00b7ff]/10 group-hover:border-[#00b7ff]/70 group-hover:shadow-[0_0_25px_rgba(0,183,255,0.6)] transition-all duration-700" />
          </motion.a>
        </motion.div>

        {/* Scroll hint stays below */}
        {!isMobile && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-400"
          >
            <div className="text-sm">Scroll</div>
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-full border border-gray-500/30 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14"
                  stroke="#b8dfff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M6 12l6 6 6-6"
                  stroke="#b8dfff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* Embedded CSS animations */}
        <style jsx>{`
          @keyframes shimmerFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes neonPulse {
            0% {
              filter: drop-shadow(0 0 8px rgba(0, 183, 255, 0.8))
                drop-shadow(0 0 20px rgba(0, 183, 255, 0.5))
                drop-shadow(0 0 40px rgba(0, 128, 255, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 15px rgba(0, 183, 255, 1))
                drop-shadow(0 0 40px rgba(0, 128, 255, 0.8))
                drop-shadow(0 0 60px rgba(0, 183, 255, 0.6));
            }
            100% {
              filter: drop-shadow(0 0 8px rgba(0, 183, 255, 0.8))
                drop-shadow(0 0 20px rgba(0, 183, 255, 0.5))
                drop-shadow(0 0 40px rgba(0, 128, 255, 0.3));
            }
          }
          .neon-overlay {
            font-weight: 800;
            letter-spacing: -0.02em;
            color: transparent;
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            background-image: linear-gradient(90deg, #00b7ff, #00d5ff, #007aff);
            background-size: 300% 100%;
            animation: shimmerFlow 10s ease-in-out infinite, neonPulse 4s ease-in-out infinite;
            mix-blend-mode: screen;
          }
          .neon-overlay-mobile {
            background-image: linear-gradient(90deg, #00b7ff, #00d5ff);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            filter: drop-shadow(0 0 5px rgba(0, 183, 255, 0.6));
          }
          .reflection {
            position: absolute;
            top: 0;
            left: 0;
            width: 36%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(255, 255, 255, 0.36) 45%,
              rgba(255, 255, 255, 0.08) 70%,
              transparent 100%
            );
            animation: reflectionSweep 12s ease-in-out infinite;
            animation-delay: 5.2s;
            pointer-events: none;
            mix-blend-mode: screen;
          }
          @keyframes reflectionSweep {
            0% {
              transform: translateX(-160%) skewX(-20deg);
              opacity: 0;
            }
            20% {
              opacity: 0.28;
            }
            50% {
              opacity: 0.08;
            }
            100% {
              transform: translateX(160%) skewX(-20deg);
              opacity: 0;
            }
          }
        `}</style>
      </section>
    </MotionConfig>
  );
}
