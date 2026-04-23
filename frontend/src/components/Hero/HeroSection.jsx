import React, { useRef, useState, Suspense } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import GlobeScene from '../Globe/GlobeScene'

// ─── Design tokens ───────────────────────────────────────────────────────────────
const T = {
  green:      '#22c55e',
  greenLight: '#f0fdf4',
  greenMid:   '#dcfce7',
  blue:       '#3b82f6',
  blueLight:  '#eff6ff',
  teal:       '#14b8a6',
  text:       '#0f172a',
  textSub:    '#475569',
  textMuted:  '#94a3b8',
  border:     'rgba(15,23,42,0.07)',
  bg:         '#f8fafc',
  surface:    '#ffffff',
  fontDisplay:"'Sora', system-ui, sans-serif",
  fontBody:   "'DM Sans', system-ui, sans-serif",
}

// ─── Magnetic button ─────────────────────────────────────────────────────────────
function MagBtn({ label, primary = true, icon }) {
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
        fontFamily: T.fontDisplay, fontSize: 15, fontWeight: 600,
        color: primary ? '#fff' : T.green,
        background: primary
          ? `linear-gradient(135deg, ${T.green} 0%, #1ea4e0 100%)`
          : T.greenLight,
        border: primary ? 'none' : `1px solid ${T.greenMid}`,
        borderRadius: 999,
        padding: '14px 32px', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        letterSpacing: '0.01em',
        boxShadow: primary && hov
          ? '0 10px 32px rgba(34,197,94,0.35)'
          : primary ? '0 4px 16px rgba(34,197,94,0.22)' : 'none',
        transition: 'box-shadow 0.3s',
      }}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width/2) * 0.26)
        y.set((e.clientY - r.top - r.height/2) * 0.26)
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setHov(false) }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >
      {label}
      <motion.span
        animate={hov ? { x: 4 } : { x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ fontSize: 17 }}
      >{icon || '→'}</motion.span>
    </motion.button>
  )
}

// ─── Trust badge ─────────────────────────────────────────────────────────────────
function TrustBadge({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.05, type: 'spring', stiffness: 220 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 999,
        padding: '7px 16px 7px 8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        width: 'fit-content', marginBottom: 28,
      }}
    >
      {/* Stacked avatars */}
      <div style={{ display: 'flex' }}>
        {['#22c55e','#3b82f6','#14b8a6','#8b5cf6'].map((c, i) => (
          <div key={c} style={{
            width: 26, height: 26, borderRadius: '50%',
            background: `linear-gradient(135deg, ${c}, ${c}bb)`,
            border: '2px solid white',
            marginLeft: i > 0 ? -8 : 0, zIndex: 4-i,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#fff', fontWeight: 700,
            flexShrink: 0,
          }}>
            {['N','G','O','+'][i]}
          </div>
        ))}
      </div>
      <div>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 700, color: T.text,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ color: '#fbbf24' }}>★★★★★</span>
          Trusted by 2,400+ NGOs
        </div>
        <div style={{ fontFamily: T.fontBody, fontSize: 10.5, fontWeight: 300, color: T.textMuted }}>
          worldwide
        </div>
      </div>
    </motion.div>
  )
}

// ─── Impact stats row ─────────────────────────────────────────────────────────────
function StatRow({ inView }) {
  const stats = [
    { icon: '🙋', val: '48K+', label: 'Volunteers' },
    { icon: '🌍', val: '190',  label: 'Countries' },
    { icon: '💙', val: '1.2M', label: 'Lives Touched' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.58 }}
      style={{
        display: 'flex', gap: 0,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        width: 'fit-content',
        marginTop: 4,
      }}
    >
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: '14px 22px',
          borderRight: i < stats.length-1 ? `1px solid ${T.border}` : 'none',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.val}</div>
          <div style={{ fontFamily: T.fontBody, fontSize: 10.5, fontWeight: 400, color: T.textMuted, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </motion.div>
  )
}

// ─── Floating context card ────────────────────────────────────────────────────────
function FloatCard({ text, sub, accent, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 200 }}
      style={{
        position: 'absolute', zIndex: 10,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: 14,
        padding: '10px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <motion.div
            animate={{ scale: [1,1.4,1] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0, boxShadow: `0 0 6px ${accent}` }}
          />
          <span style={{ fontFamily: T.fontDisplay, fontSize: 12, fontWeight: 700, color: T.text }}>{text}</span>
        </div>
        <div style={{ fontFamily: T.fontBody, fontSize: 10.5, fontWeight: 300, color: T.textMuted, marginTop: 3 }}>{sub}</div>
      </motion.div>
    </motion.div>
  )
}

// ─── Background mesh ──────────────────────────────────────────────────────────────
function HeroBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Top-left green bloom */}
      <motion.div
        animate={{ x:[0,20,0], y:[0,-14,0], scale:[1,1.06,1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-10%', left: '-8%',
          width: 540, height: 540, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.10), transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Right blue bloom */}
      <motion.div
        animate={{ x:[0,-16,0], y:[0,10,0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.09), transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Bottom teal accent */}
      <motion.div
        animate={{ x:[0,12,0], y:[0,-8,0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        style={{
          position: 'absolute', bottom: '-5%', left: '30%',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.07), transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(15,23,42,0.038) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
    </div>
  )
}

// ─── Main hero ────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  // Simple inView — always true since this is above the fold
  const inView = true

  const stagger = (i) => ({ duration: 0.65, delay: 0.1 + i * 0.12, ease: [0.22,1,0.36,1] })

  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafc 40%, #eff6ff 100%)',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      padding: 'clamp(100px,14vh,140px) clamp(20px,5vw,64px) clamp(60px,8vw,100px)',
      overflow: 'hidden',
      fontFamily: T.fontBody,
    }}>
      <HeroBg />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1240, margin: '0 auto', width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(32px,5vw,72px)',
        flexWrap: 'wrap',
      }}>

        {/* ── LEFT CONTENT ── */}
        <div style={{
          flex: '1 1 440px', maxWidth: 580,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', gap: 0,
        }}>
          <TrustBadge inView={inView} />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(1)}
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 'clamp(34px,5.5vw,64px)',
              fontWeight: 800, color: T.text,
              lineHeight: 1.08, letterSpacing: '-0.04em',
              margin: '0 0 22px',
            }}
          >
            Empowering Communities{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 60%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline',
            }}>
              Through Collaboration
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(2)}
            style={{
              fontFamily: T.fontBody,
              fontSize: 'clamp(15px,1.6vw,18px)',
              fontWeight: 300, color: T.textSub,
              lineHeight: 1.75, margin: '0 0 34px',
              maxWidth: 480,
            }}
          >
            UnityNet's AI matching engine connects volunteers with NGOs in real time —
            surfacing the right skills for every mission, across 190 countries.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(3)}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}
          >
            <MagBtn label="Join as Volunteer" primary icon="🙋" />
            <MagBtn label="Register NGO" primary={false} icon="🏛️" />
          </motion.div>

          <StatRow inView={inView} />
        </div>

        {/* ── RIGHT GLOBE ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22,1,0.36,1] }}
          style={{
            flex: '0 0 auto',
            width: 'clamp(300px, 46vw, 580px)',
            height: 'clamp(300px, 46vw, 580px)',
            position: 'relative',
          }}
        >
          {/* Floating info cards */}
          <FloatCard
            text="New volunteer matched!"
            sub="Education · Mumbai, India"
            accent={T.green}
            delay={1.4}
            style={{ top: '12%', left: '-6%' }}
          />
          <FloatCard
            text="+3 lives impacted"
            sub="Clean Water · Nairobi, Kenya"
            accent={T.blue}
            delay={1.8}
            style={{ bottom: '18%', right: '-4%' }}
          />
          <FloatCard
            text="Campaign filled 100%"
            sub="Healthcare · São Paulo"
            accent={T.teal}
            delay={2.1}
            style={{ bottom: '6%', left: '8%' }}
          />

          {/* Globe canvas */}
          <Suspense fallback={<GlobeFallback />}>
            <GlobeScene />
          </Suspense>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 22, height: 36, borderRadius: 12,
            border: '1.5px solid rgba(15,23,42,0.16)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: '5px 0',
          }}
        >
          <div style={{ width: 4, height: 9, borderRadius: 99, background: T.textMuted }} />
        </motion.div>
        <span style={{ fontFamily: T.fontBody, fontSize: 11, color: T.textMuted, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

// ─── Loading fallback ─────────────────────────────────────────────────────────────
function GlobeFallback() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid rgba(34,197,94,0.2)',
          borderTop: '3px solid #22c55e',
        }}
      />
    </div>
  )
}
