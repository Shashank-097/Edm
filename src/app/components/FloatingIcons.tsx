'use client'

import { useEffect, useRef } from 'react'
// ✅ Updated import from lib folder
import { Rocket, Search, Share2, Palette, MonitorSmartphone, Zap } from '@/lib/icons'

const icons = [
  { Icon: Rocket, size: 48, x: 100, y: 100 },
  { Icon: Search, size: 36, x: 500, y: 200 },
  { Icon: Share2, size: 40, x: 300, y: 400 },
  { Icon: Palette, size: 50, x: 800, y: 350 },
  { Icon: MonitorSmartphone, size: 36, x: 200, y: 700 },
  { Icon: Zap, size: 42, x: 600, y: 600 },
]

export default function FloatingIcons() {
  const iconRefs = useRef<SVGSVGElement[]>([])
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)

    const angles = icons.map(() => Math.random() * 360)
    const speeds = icons.map(() => 0.5 + Math.random() * 0.5)
    const radii = icons.map(() => 10 + Math.random() * 10)
    const positions = icons.map((icon) => ({ ...icon }))

    const safeZone = {
      x1: window.innerWidth * 0.25,
      y1: window.innerHeight * 0.25,
      x2: window.innerWidth * 0.75,
      y2: window.innerHeight * 0.55,
    }

    let frame: number
    const animate = () => {
      iconRefs.current.forEach((el, i) => {
        if (!el) return
        angles[i] += speeds[i]

        let x = positions[i].x + Math.cos(angles[i] / 20) * radii[i]
        let y = positions[i].y + Math.sin(angles[i] / 25) * radii[i]

        // Cursor repulsion
        const dx = x - mousePos.current.x
        const dy = y - mousePos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const repel = (120 - dist) * 0.25
          x += (dx / dist) * repel
          y += (dy / dist) * repel
        }

        // Avoid safe zone
        if (x > safeZone.x1 && x < safeZone.x2 && y > safeZone.y1 && y < safeZone.y2) {
          if (x - safeZone.x1 < safeZone.x2 - x) x = safeZone.x1 - 30
          else x = safeZone.x2 + 30
        }

        // Rotation + scale animation
        const angleRotate = Math.sin(angles[i] / 15) * 15
        const scale = 1 + Math.sin(angles[i] / 10) * 0.1

        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angleRotate}deg) scale(${scale})`
      })

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {icons.map(({ Icon, size }, i) => (
        <Icon
          key={i}
          ref={(el) => {
            if (el) iconRefs.current[i] = el
          }}
          size={size}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: '#00B7FF',
            filter: 'drop-shadow(0 0 16px #00b7ffcc) drop-shadow(0 0 24px #00b7ff66)',
            userSelect: 'none',
          }}
        />
      ))}
    </div>
  )
}
