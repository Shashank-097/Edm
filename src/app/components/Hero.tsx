'use client';

import {
  MotionConfig,
  motion,
  useTransform,
  MotionValue,
  useReducedMotion,
  Variants,
} from 'framer-motion';
import { useEffect, useState } from 'react';

import FloatingIcons from '../../app/components/FloatingIcons';
import FloatingIconsMobile from '../../app/components/FloatingIconsMobile';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  heroScroll: MotionValue<number>;
}

/* ---------------------------------------------
   CURSOR TRAIL (Desktop Only)
--------------------------------------------- */
function CursorTrail() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
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

/* ---------------------------------------------
   TYPING ANIMATION (Desktop Only)
--------------------------------------------- */
const headlineWords = [
  { text: 'Transforming', neon: false, typing: false },
  { text: 'IDEAS', neon: true, typing: true },
  { text: 'Into', neon: false, typing: false },
  { text: 'DIGITAL', neon: true, typing: true },
  { text: 'POWER', neon: true, typing: true },
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

/* ---------------------------------------------
   MAIN HERO COMPONENT
--------------------------------------------- */
export default function HeroSection({ heroRef, heroScroll }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const heroOpacity = useTransform(heroScroll, [0, 0.3], [1, 0]);
  const titleShiftY = useTransform(heroScroll, [0, 1], ['0px', '-40px']);
  const hintOpacity = useTransform(heroScroll, [0, 0.15], [1, 0]);

  const subText =
    'EDM (Era of Digital Marketing) blends creativity, strategy, and performance to accelerate your brand’s digital growth.';

  const mobileStyles = isMobile
    ? 'px-5 max-w-[92%] mt-[-10px] space-y-4'
    : 'px-6 max-w-4xl';

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={heroRef}
        className={`relative h-screen flex flex-col items-center justify-center bg-[#0A0F1C] text-white 
          ${isMobile ? 'overflow-visible' : 'overflow-hidden'}
        `}
      >
        {/* Floating Icons (Desktop / Mobile) */}
        {isMobile ? <FloatingIconsMobile /> : <FloatingIcons />}

        {/* Cursor Trail — Desktop Only */}
        {!shouldReduceMotion && !isMobile && <CursorTrail />}

        {/* Background Glow */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[radial-gradient(circle_at_top_left,_rgba(0,183,255,0.1),_transparent_70%)] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-[radial-gradient(circle_at_bottom_right,_rgba(0,117,255,0.12),_transparent_80%)] rounded-full" />
        </div>

        {/* HERO CONTENT */}
        <motion.div
          style={{ opacity: heroOpacity, translateY: titleShiftY }}
          className={`relative z-10 flex flex-col items-center text-center ${mobileStyles}`}
        >
          <motion.h1 className="text-[1.85rem] leading-[1.3] sm:text-6xl lg:text-7xl font-extrabold tracking-tight relative">
            {headlineWords.map(({ text, neon, typing }, idx) =>
              isMobile ? (
                /* MOBILE VERSION (NO TYPING, ONLY SOFT NEON) */
                <motion.span
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: idx * 0.18 }}
                  className={`inline-block mx-[6px] ${
                    neon ? 'neon-mobile-soft' : 'text-white/90'
                  }`}
                >
                  {text}
                </motion.span>
              ) : typing ? (
                <TypingWord key={text} word={text} neon={neon} delayIndex={idx} />
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

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 2, ease: 'easeOut', delay: 4.3 }}
            className="mt-4 sm:mt-6 text-[14px] text-gray-400/80 max-w-[85%] leading-[1.5]"
          >
            {subText}
          </motion.p>

          <motion.a
            href="/contact"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 4.7 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            className="group relative mt-7 sm:mt-10 inline-flex items-center justify-center 
                       px-5 py-2.5 sm:px-8 rounded-full text-[13px] sm:text-[16px] 
                       font-semibold text-[#cfefff] bg-[#0b1220]/80 
                       border border-[#00b7ff]/20 transition-all duration-500"
          >
            <span className="relative z-10 flex items-center">{"Let's Connect"}</span>
          </motion.a>
        </motion.div>

        {/* Scroll indicator — Desktop Only */}
        {!isMobile && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-400"
          >
            <div className="text-sm">Scroll</div>
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-500/30 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14" stroke="#b8dfff" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M6 12l6 6 6-6" stroke="#b8dfff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* STYLES */}
        <style jsx>{`
          /* DESKTOP NEON */
          .neon-overlay {
            font-weight: 900 !important;
            letter-spacing: -0.01em;
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            background-image: linear-gradient(
              90deg,
              #00caff,
              #29e6ff,
              #66f0ff,
              #29e6ff,
              #00caff
            ) !important;
            background-size: 400% 100%;
            mix-blend-mode: screen;
            animation:
              electricShimmer 6s ease-in-out infinite,
              electricPulse 2.4s ease-in-out infinite;
            text-shadow:
              0 0 14px rgba(0, 170, 255, 0.9),
              0 0 26px rgba(0, 220, 255, 0.55),
              0 0 55px rgba(0, 240, 255, 0.35),
              0 0 85px rgba(0, 200, 255, 0.3);
          }

          @keyframes electricShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes electricPulse {
            0% {
              filter: drop-shadow(0 0 12px rgba(0, 210, 255, 0.9))
                      drop-shadow(0 0 25px rgba(0, 180, 255, 0.55))
                      drop-shadow(0 0 55px rgba(0, 240, 255, 0.35));
            }
            50% {
              filter: drop-shadow(0 0 22px rgba(0, 250, 255, 1))
                      drop-shadow(0 0 55px rgba(0, 220, 255, 0.8))
                      drop-shadow(0 0 100px rgba(0, 250, 255, 0.55));
            }
            100% {
              filter: drop-shadow(0 0 12px rgba(0, 210, 255, 0.9))
                      drop-shadow(0 0 25px rgba(0, 180, 255, 0.55))
                      drop-shadow(0 0 55px rgba(0, 240, 255, 0.35));
            }
          }

          /* ⚡ MOBILE NEON */
          @media (max-width: 768px) {
            .neon-mobile-soft {
              font-weight: 850 !important;
              background-image: linear-gradient(
                90deg,
                #29e6ff,
                #66faff,
                #29e6ff
              ) !important;
              background-size: 260% 100%;
              -webkit-background-clip: text !important;
              -webkit-text-fill-color: transparent !important;
              animation:
                electricMobileWave 5s ease-in-out infinite,
                electricMobilePulse 2.8s ease-in-out infinite;
              text-shadow:
                0 0 6px rgba(0, 200, 255, 0.55),
                0 0 18px rgba(0, 160, 255, 0.45),
                0 0 32px rgba(0, 230, 255, 0.35);
            }

            @keyframes electricMobileWave {
              0% { background-position: 0%; }
              50% { background-position: 100%; }
              100% { background-position: 0%; }
            }

            @keyframes electricMobilePulse {
              0% {
                text-shadow:
                  0 0 6px rgba(0, 200, 255, 0.55),
                  0 0 12px rgba(0, 160, 255, 0.4);
              }
              50% {
                text-shadow:
                  0 0 16px rgba(0, 240, 255, 1),
                  0 0 28px rgba(0, 180, 255, 0.55);
              }
              100% {
                text-shadow:
                  0 0 6px rgba(0, 200, 255, 0.55),
                  0 0 12px rgba(0, 160, 255, 0.4);
              }
            }
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
            20% { opacity: 0.28; }
            50% { opacity: 0.08; }
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
