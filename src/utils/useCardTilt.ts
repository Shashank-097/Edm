'use client'
import { useEffect, RefObject } from 'react'

export function useCardTilt(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -10
      const rotateY = ((x - centerX) / centerX) * 10
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const resetTilt = () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', resetTilt)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', resetTilt)
    }
  }, [ref])
}
