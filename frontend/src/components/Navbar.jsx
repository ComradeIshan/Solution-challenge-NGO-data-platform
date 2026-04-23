import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const NAV_LINKS = ['Features', 'How It Works', 'NGOs', 'Impact', 'Blog']

function MagBtn({ label, primary }) {
  const ref = useRef(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 22 })
  const sy = useSpring(y, { stiffness: 220, damping: 22 })
  const [hov, setHov] = useState(false)
  return (
    <motion.button
      ref={ref}
      style={{
        x: sx, y: sy,
        fontFamily: "'Sora', system-ui, sans-serif",
        fontSize: 13, fontWeight: 600,
        color: primary ? '#fff' : '#22c55e',
        background: primary
          ? 'linear-gradient(135deg,#22c55e,#3b82f6)'
          : 'rgba(34,197,94,0.08)',
        border: primary ? 'none' : '1px solid rgba(34,197,94,0.3)',
        borderRadius: 999,
        padding: '8px 20px', cursor: 'pointer',
        boxShadow: hov && primary ? '0 6px 24px rgba(34,197,94,0.30)' : 'none',
        transition: 'box-shadow 0.3s',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width/2) * 0.22)
        y.set((e.clientY - r.top - r.height/2) * 0.22)
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setHov(false) }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >{label}</motion.button>
  )
}

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
      style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, width: 'min(calc(100% - 48px), 1100px)',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: '12px 24px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
        display: 'flex', alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg,#22c55e,#3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800 }}>U</span>
        </div>
        <span style={{
          fontFamily: "'Sora', system-ui, sans-serif", fontSize: 16, fontWeight: 800,
          background: 'linear-gradient(135deg,#22c55e,#3b82f6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '-0.03em',
        }}>UnityNet</span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 4, flex: 1, alignItems: 'center' }}>
        {NAV_LINKS.map(link => (
          <motion.a
            key={link} href="#"
            whileHover={{ color: '#22c55e' }}
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 13.5, fontWeight: 400,
              color: '#475569', textDecoration: 'none',
              padding: '6px 12px', borderRadius: 8,
              transition: 'color 0.2s',
            }}
          >{link}</motion.a>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <MagBtn label="Sign In" />
        <MagBtn label="Get Started" primary />
      </div>
    </motion.nav>
  )
}
