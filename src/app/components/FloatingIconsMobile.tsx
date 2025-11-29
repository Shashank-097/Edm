'use client';

import { useEffect, useRef } from 'react';
import { Rocket, Search, Share2, Palette } from '@/lib/icons';

const mobileIcons = [
  { Icon: Rocket, size: 30, startX: 30, startY: 140 },
  { Icon: Search, size: 26, startX: 260, startY: 240 },
  { Icon: Share2, size: 28, startX: 80, startY: 380 },
  { Icon: Palette, size: 30, startX: 180, startY: 490 },
];

export default function FloatingIconsMobile() {
  const refs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const speeds = mobileIcons.map(() => 0.5 + Math.random() * 0.3);
    const offsets = mobileIcons.map(() => Math.random() * 50);

    let frame: number;

    const animate = () => {
      const now = Date.now() / 1000;

      refs.current.forEach((el, i) => {
        if (!el) return;

        const t = now * speeds[i] + offsets[i];

        const x = mobileIcons[i].startX + Math.sin(t) * 10;
        const y = mobileIcons[i].startY + Math.cos(t * 1.2) * 12;
        const scale = 1 + Math.sin(t * 1.8) * 0.05;

        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = `${0.75 + Math.sin(t * 0.7) * 0.15}`;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="floating-icons-mobile-container">
      {mobileIcons.map(({ Icon, size }, i) => (
        <Icon
          key={i}
          size={size}
          ref={(el) => { refs.current[i] = el; }}
          className="floating-icon-mobile"
        />
      ))}
    </div>
  );
}
