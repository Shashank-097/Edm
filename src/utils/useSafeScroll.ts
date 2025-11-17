'use client';

import { useScroll, type MotionValue } from 'framer-motion';
import { RefObject } from 'react';

type OffsetType =
  | 'start start' | 'start end' | 'start center'
  | 'center start' | 'center end' | 'center center'
  | 'end start' | 'end end' | 'end center';

export function useSafeScroll(
  targetRef: RefObject<HTMLElement>,
  offset: OffsetType[] = ['end end', 'end start']
): { scrollYProgress: MotionValue<number> } {
  const { scrollYProgress } = useScroll({ target: targetRef, offset });
  return { scrollYProgress };
}
