/**
 * components/landing/CTASection.jsx
 *
 * Final CTA section for the Digital Sevaks landing page.
 * Emotional, immersive, conversion-focused.
 *
 * Animations:
 *   - Staggered word-by-word headline reveal
 *   - Animated gradient blob background with mouse parallax
 *   - Floating emoji particles with independent trajectories
 *   - Magnetic + glowing CTA buttons
 *   - Shimmer shine sweep on primary button (idle loop)
 *   - Scroll-triggered entry for all elements
 *   - Avatar cluster with float/bounce
 *   - Trust badge pulse
 *   - Spotlight radial glow that follows cursor inside section
 *   - Mesh grid overlay
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────
   DESIGN TOKENS — exact match to project system
───────────────────────────────────────── */
const T = {
  ff: "'Fraunces', serif",
  fb: "'DM Sans', sans-serif",

  green:       "#22c55e",
  greenMid:    "#16a34a",
  greenDark:   "#14532d",
  greenLight:  "#dcfce7",

  blue:        "#3b82f6",
  blueMid:     "#2563eb",
  blueDark:    "#1e3a8a",
  blueLight:   "#dbeafe",

  teal:        "#14b8a6",
  tealMid:     "#0f766e",
  tealDark:    "#134e4a",

  white:       "#ffffff",
  g100:        "#f4f4f5",
  g200:        "#e4e4e7",
  g400:        "#a1a1aa",
  g500:        "#71717a",
};

/* ─────────────────────────────────────────
   MOTION CONSTANTS
───────────────────────────────────────── */
const EASE        = [0.16, 1, 0.3, 1];
const SPRING      = { type: "spring", stiffness: 320, damping: 28 };
const SPRING_FAST = { type: "spring", stiffness: 420, damping: 32 };

const makeStagger = (delay = 0.06, children = 0.1) => ({
  hidden: {},
  show:   { transition: { staggerChildren: children, delayChildren: delay } },
});

const wordReveal = {
  hidden: { opacity: 0, y: 48, rotateX: -18 },
  show: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.78, ease: EASE },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};


/* ═══════════════════════════════════════════════════════
   BLOB LAYER — 3 animated blurred gradient orbs
═══════════════════════════════════════════════════════ */
const BLOBS = [
  {
    color:   "radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 65%)",
    size:    600,
    top:     "-18%",
    left:    "-12%",
    xKeys:   [0, 40, -20, 0],
    yKeys:   [0, -50, 30, 0],
    dur:     20,
    delay:   0,
  },
  {
    color:   "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 65%)",
    size:    540,
    top:     "30%",
    right:   "-14%",
    xKeys:   [0, -45, 20, 0],
    yKeys:   [0, 35, -40, 0],
    dur:     25,
    delay:   5,
  },
  {
    color:   "radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 65%)",
    size:    480,
    bottom:  "-20%",
    left:    "30%",
    xKeys:   [0, 25, -30, 0],
    yKeys:   [0, -30, 45, 0],
    dur:     22,
    delay:   10,
  },
];

function BlobLayer({ parallaxX, parallaxY }) {
  const blobX = useTransform(parallaxX, v => v * 0.6);
  const blobY = useTransform(parallaxY, v => v * 0.6);

  return (
    <>
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          style={{ x: blobX, y: blobY }}
          animate={{ x: b.xKeys, y: b.yKeys }}
          transition={{
            duration:    b.dur,
            delay:       b.delay,
            repeat:      Infinity,
            ease:        "easeInOut",
          }}
        >
          <div style={{
            position:      "absolute",
            top:           b.top,
            left:          b.left,
            right:         b.right,
            bottom:        b.bottom,
            width:         b.size,
            height:        b.size,
            borderRadius:  "50%",
            background:    b.color,
            filter:        "blur(72px)",
            pointerEvents: "none",
            willChange:    "transform",
          }} />
        </motion.div>
      ))}
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   MESH GRID OVERLAY
   CSS grid of faint lines — adds depth without noise
═══════════════════════════════════════════════════════ */
function MeshGrid() {
  return (
    <div
      aria-hidden
      style={{
        position:       "absolute",
        inset:          0,
        backgroundImage: [
          "linear-gradient(rgba(34,197,94,0.05) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(34,197,94,0.05) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "48px 48px",
        pointerEvents:  "none",
        zIndex:         1,
      }}
    />
  );
}


/* ═══════════════════════════════════════════════════════
   FLOATING PARTICLES — emoji icons at random positions
   Each has its own float trajectory + entrance stagger
═══════════════════════════════════════════════════════ */
const PARTICLES = [
  { icon: "🌱", x: "8%",  y: "18%", dur: 7,  delay: 0,   size: 28 },
  { icon: "⚡", x: "88%", y: "22%", dur: 9,  delay: 1.5, size: 24 },
  { icon: "🤝", x: "12%", y: "72%", dur: 8,  delay: 2.8, size: 26 },
  { icon: "❤️", x: "82%", y: "68%", dur: 11, delay: 0.8, size: 22 },
  { icon: "🌍", x: "50%", y: "88%", dur: 10, delay: 3.5, size: 24 },
  { icon: "✨", x: "25%", y: "40%", dur: 6,  delay: 1.2, size: 20 },
  { icon: "🎯", x: "72%", y: "45%", dur: 8,  delay: 4.0, size: 22 },
];

function FloatingParticles({ inView }) {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView
            ? {
                opacity: [0, 0.25, 0.2],
                scale:   [0, 1.1, 1],
                y:       [0, -14, 0],
                rotate:  [0, p.dur % 2 === 0 ? 8 : -8, 0],
              }
            : { opacity: 0, scale: 0 }
          }
          transition={{
            opacity: { duration: 0.6, delay: 0.6 + i * 0.12 },
            scale:   { duration: 0.5, delay: 0.6 + i * 0.12, ease: EASE },
            y: {
              duration:    p.dur,
              delay:       p.delay + 1,
              repeat:      Infinity,
              ease:        "easeInOut",
            },
            rotate: {
              duration:    p.dur * 1.3,
              delay:       p.delay,
              repeat:      Infinity,
              ease:        "easeInOut",
            },
          }}
          style={{
            position:      "absolute",
            left:          p.x,
            top:           p.y,
            fontSize:      p.size,
            pointerEvents: "none",
            zIndex:        2,
            filter:        "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
            willChange:    "transform, opacity",
          }}
        >
          {p.icon}
        </motion.div>
      ))}
    </>
  );
}


/* ═══════════════════════════════════════════════════════
   SPOTLIGHT — radial glow that follows the cursor
   inside the section boundary
═══════════════════════════════════════════════════════ */
function Spotlight({ sectionRef }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 80, damping: 18 });
  const sy = useSpring(y, { stiffness: 80, damping: 18 });

  const bgX = useTransform(sx, v => `${v * 100}%`);
  const bgY = useTransform(sy, v => `${v * 100}%`);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r   = el.getBoundingClientRect();
      const nx  = (e.clientX - r.left) / r.width;
      const ny  = (e.clientY - r.top)  / r.height;
      x.set(Math.max(0, Math.min(1, nx)));
      y.set(Math.max(0, Math.min(1, ny)));
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [x, y, sectionRef]);

  return (
    <motion.div
      aria-hidden
      style={{
        position:      "absolute",
        inset:         0,
        pointerEvents: "none",
        zIndex:        1,
        background:    "radial-gradient(circle 500px at var(--sx) var(--sy), rgba(255,255,255,0.06) 0%, transparent 60%)",
        "--sx":        bgX,
        "--sy":        bgY,
      }}
    />
  );
}


/* ═══════════════════════════════════════════════════════
   STAGGERED HEADLINE
   Each word (or span) enters independently
═══════════════════════════════════════════════════════ */
function AnimatedHeadline({ inView }) {
  /* Split headline into segments — some are gradient-highlighted */
  const segments = [
    { text: "Start Making",   gradient: false },
    { text: " ",              gradient: false },
    { text: "Real Impact",    gradient: true  },
    { text: " Today",         gradient: false },
  ];

  return (
    <motion.h2
      variants={makeStagger(0.12, 0.13)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={{
        fontFamily:    T.ff,
        fontSize:      "clamp(38px, 5.5vw, 76px)",
        fontWeight:    500,
        lineHeight:    1.08,
        letterSpacing: "-1px",
        marginBottom:  0,
        display:       "flex",
        flexWrap:      "wrap",
        justifyContent: "center",
        gap:           "0 0.2em",
        perspective:   "800px",
      }}
    >
      {segments.map((seg, i) =>
        seg.text === " " ? null : (
          <motion.span
            key={i}
            variants={wordReveal}
            style={{
              display:      "inline-block",
              color: seg.gradient ? "transparent" : "#0f172a",
              background:   seg.gradient
                ? "linear-gradient(110deg, #86efac 0%, #34d399 30%, #22d3ee 65%, #60a5fa 100%)"
                : undefined,
              backgroundSize: seg.gradient ? "200% 100%" : undefined,
              WebkitBackgroundClip: seg.gradient ? "text" : undefined,
              WebkitTextFillColor:  seg.gradient ? "transparent" : undefined,
              backgroundClip:       seg.gradient ? "text" : undefined,
            }}
          >
            {seg.gradient ? (
              /* Animated shimmer on gradient text */
              <motion.span
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                style={{
                  background:           "linear-gradient(110deg, #86efac 0%, #34d399 25%, #22d3ee 55%, #60a5fa 80%, #86efac 100%)",
                  backgroundSize:       "300% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                  display:              "inline",
                }}
              >
                {seg.text}
              </motion.span>
            ) : seg.text}
          </motion.span>
        )
      )}
    </motion.h2>
  );
}


/* ═══════════════════════════════════════════════════════
   CTA BUTTON — magnetic, glowing, with shine sweep
═══════════════════════════════════════════════════════ */
function CTAButton({ label, icon, variant = "primary", onClick }) {
  const btnRef          = useRef(null);
  const [hov, setHov]   = useState(false);
  const [shine, setShine] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, { stiffness: 300, damping: 24 });
  const y    = useSpring(rawY, { stiffness: 300, damping: 24 });

  /* Idle shine loop — fires every 4s */
  useEffect(() => {
    if (variant !== "primary") return;
    const t = setInterval(() => {
      setShine(true);
      setTimeout(() => setShine(false), 600);
    }, 4000);
    return () => clearInterval(t);
  }, [variant]);

  const handleMouseMove = useCallback((e) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left - r.width  / 2) * 0.22);
    rawY.set((e.clientY - r.top  - r.height / 2) * 0.22);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    setHov(false);
  }, [rawX, rawY]);

  const isPrimary = variant === "primary";

  const baseStyle = {
    position:       "relative",
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "10px",
    padding:        isPrimary ? "18px 40px" : "17px 38px",
    borderRadius:   "100px",
    fontFamily:     T.fb,
    fontSize:       "16px",
    fontWeight:     600,
    letterSpacing:  "0.01em",
    cursor:         "pointer",
    border:         "none",
    overflow:       "hidden",
    userSelect:     "none",
    willChange:     "transform",
  };

  const primaryStyle = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#ffffff",
  boxShadow: hov
    ? "0 14px 34px rgba(34,197,94,0.45)"
    : "0 8px 22px rgba(34,197,94,0.28)",
};

  const secondaryStyle = {
  background: "rgba(255,255,255,0.75)",
  color: "#0f172a",
  border: "1px solid rgba(0,0,0,0.08)",
  backdropFilter: "blur(12px)",
  boxShadow: hov
    ? "0 10px 25px rgba(0,0,0,0.08)"
    : "0 4px 12px rgba(0,0,0,0.05)",
};

  return (
    <motion.button
      ref={btnRef}
      style={{
        x, y,
        ...baseStyle,
        ...(isPrimary ? primaryStyle : secondaryStyle),
        transition: "box-shadow 0.3s ease",
      }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Shine sweep overlay — idle loop + hover trigger */}
      <AnimatePresence>
        {(shine || hov) && (
          <motion.span
            key="shine"
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x:  "220%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: "easeInOut" }}
            style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
              pointerEvents: "none",
              zIndex:     1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.span
        animate={hov ? { scale: 1.2, rotate: isPrimary ? 15 : -10 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ fontSize: "18px", position: "relative", zIndex: 2 }}
      >
        {icon}
      </motion.span>

      {/* Label */}
      <span style={{ position: "relative", zIndex: 2 }}>{label}</span>

      {/* Arrow */}
      <motion.span
        animate={hov ? { x: 5, opacity: 1 } : { x: 0, opacity: 0.7 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        style={{ fontSize: "14px", position: "relative", zIndex: 2 }}
      >
        →
      </motion.span>
    </motion.button>
  );
}


/* ═══════════════════════════════════════════════════════
   AVATAR CLUSTER — overlapping circles + count
═══════════════════════════════════════════════════════ */
const AVATAR_DATA = [
  { initials: "AS", bg: "rgba(34,197,94,0.5)",  border: "rgba(134,239,172,0.7)", delay: 0 },
  { initials: "RK", bg: "rgba(59,130,246,0.5)",  border: "rgba(147,197,253,0.7)", delay: 0.1 },
  { initials: "PM", bg: "rgba(20,184,166,0.5)",  border: "rgba(94,234,212,0.7)",  delay: 0.2 },
  { initials: "ST", bg: "rgba(139,92,246,0.5)", border: "rgba(196,181,253,0.7)", delay: 0.3 },
  { initials: "NJ", bg: "rgba(245,158,11,0.5)", border: "rgba(252,211,77,0.7)",  delay: 0.4 },
];

function AvatarCluster({ inView }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {AVATAR_DATA.map((av, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: -10 }}
          animate={inView
            ? { opacity: 1, scale: 1, x: 0 }
            : { opacity: 0, scale: 0, x: -10 }
          }
          transition={{ delay: 0.8 + av.delay, type: "spring", stiffness: 360, damping: 24 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width:          38,
              height:         38,
              borderRadius:   "50%",
              background:     av.bg,
              border:         `2px solid ${av.border}`,
              backdropFilter: "blur(8px)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     T.fb,
              fontSize:       "11px",
              fontWeight:     600,
              color:          "#0f172a",
              marginLeft:     i === 0 ? 0 : "-10px",
              zIndex:         AVATAR_DATA.length - i,
              boxShadow:      "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {av.initials}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   TRUST BADGE — "Trusted Platform" animated pill
═══════════════════════════════════════════════════════ */
function TrustBadge({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay: 1.1, duration: 0.5, ease: EASE }}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            "7px",
        background:     "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border:         "1px solid rgba(0,0,0,0.7)",
        borderRadius:   "100px",
        padding:        "6px 14px 6px 8px",
        boxShadow:      "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      {/* animated green pulse dot */}
      <div style={{ position: "relative", width: 22, height: 22 }}>
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          style={{
            position:     "absolute",
            inset:        0,
            borderRadius: "50%",
            background:   "rgba(34,197,94,0.5)",
          }}
        />
        <div style={{
          position:      "absolute",
          inset:         "4px",
          borderRadius:  "50%",
          background:    T.green,
          display:       "flex",
          alignItems:    "center",
          justifyContent: "center",
          fontSize:      "10px",
        }}>
          ✓
        </div>
      </div>
      <span style={{
        fontFamily:  T.fb,
        fontSize:    "12px",
        fontWeight:  600,
        color:       "#0f172a",
        letterSpacing: "0.2px",
      }}>
        Trusted Platform
      </span>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   URGENCY TICKER — subtle animated line
═══════════════════════════════════════════════════════ */
function UrgencyLine({ inView }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay: 0.9 }}
      style={{
        display:     "flex",
        alignItems:  "center",
        justifyContent: "center",
        gap:         "8px",
        marginTop:   "10px",
      }}
    >
      <motion.span
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ fontSize: "14px", display: "inline-block" }}
      >
        ⏱️
      </motion.span>
      <span style={{
        fontFamily:    T.fb,
        fontSize:      "13px",
        color: "#64748b",
        letterSpacing: "0.1px",
      }}>
        It takes less than{" "}
        <strong style={{ color: "#0f172a", fontWeight: 600 }}>
          2 minutes
        </strong>
        {" "}to get started
      </span>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   STAT COUNTER ROW — above the main headline
═══════════════════════════════════════════════════════ */
function StatsRow({ inView }) {
  const stats = [
    { val: "48K+",   label: "Sevaks Joined"  },
    { val: "2,400+", label: "NGOs Registered" },
    { val: "4.8M",   label: "Lives Impacted"  },
    { val: "96%",    label: "Match Rate"       },
  ];

  return (
    <motion.div
      variants={makeStagger(0.15, 0.12)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={{
        display:        "flex",
        justifyContent: "center",
        gap:            "clamp(24px, 5vw, 64px)",
        marginBottom:   "40px",
        flexWrap:       "wrap",
      }}
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={fadeUp}
          style={{ textAlign: "center" }}
        >
          <div style={{
            fontFamily:    T.ff,
            fontSize:      "clamp(22px, 3vw, 34px)",
            fontWeight:    500,
            color:         "#0f172a",
            lineHeight:    1,
            letterSpacing: "-0.5px",
          }}>
            {s.val}
          </div>
          <div style={{
            fontFamily: T.fb,
            fontSize:   "11.5px",
            color:      "#94a3b8",
            marginTop:  "4px",
            letterSpacing: "0.3px",
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN CTA SECTION — root export
═══════════════════════════════════════════════════════ */
export default function CTASection() {
  const sectionRef  = useRef(null);
  const inView      = useInView(sectionRef, { once: true, margin: "-80px" });

  /* Mouse parallax for the whole section (blobs + particles) */
  const rawX        = useMotionValue(0);
  const rawY        = useMotionValue(0);
  const parallaxX   = useSpring(rawX, { stiffness: 50, damping: 16 });
  const parallaxY   = useSpring(rawY, { stiffness: 50, damping: 16 });

  const handleMouseMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left - r.width  / 2) / r.width  * 28);
    rawY.set((e.clientY - r.top  - r.height / 2) / r.height * 28);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
  }, [rawX, rawY]);

  /* Gentle breathing float on the whole content area */
  const contentFloat = {
    animate: {
      y: [0, -6, 0],
      transition: { duration: 9, ease: "easeInOut", repeat: Infinity },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position:       "relative",
        overflow:       "hidden",
        padding:        "clamp(80px, 12vw, 140px) 5%",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        /* Base gradient — dark forest green → deep navy */
        background: `
  linear-gradient(160deg,
    #f0fdf4 0%,
    #ecfdf5 30%,
    #eff6ff 65%,
    #f0f9ff 100%
  )
`,
        fontFamily:     T.fb,
      }}
    >

      {/* ── LAYER 0: animated blobs ── */}
      <BlobLayer parallaxX={parallaxX} parallaxY={parallaxY} />

      {/* ── LAYER 1: mesh grid ── */}
      <MeshGrid />

      {/* ── LAYER 2: cursor spotlight ── */}
      <Spotlight sectionRef={sectionRef} />

      {/* ── LAYER 3: floating emoji particles ── */}
      <FloatingParticles inView={inView} />

      {/* ── LAYER 4: centre radial spotlight (static) ── */}
      <div
        aria-hidden
        style={{
          position:      "absolute",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%, -50%)",
          width:         "70vw",
          height:        "70vw",
          borderRadius:  "50%",
          background:    "radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(20,184,166,0.05) 35%, transparent 65%)",
          pointerEvents: "none",
          zIndex:        1,
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        variants={contentFloat}
        animate="animate"
        style={{
          position:       "relative",
          zIndex:         5,
          maxWidth:       "860px",
          width:          "100%",
          textAlign:      "center",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            "0",
        }}
      >

        {/* Stats row */}
        <StatsRow inView={inView} />

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          style={{ marginBottom: "22px" }}
        >
          <span style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "7px",
            background:     "rgba(34,197,94,0.15)",
            border:         "1px solid rgba(34,197,94,0.3)",
            borderRadius:   "100px",
            padding:        "5px 16px",
            fontFamily:     T.fb,
            fontSize:       "11px",
            fontWeight:     600,
            color:          "#86efac",
            textTransform:  "uppercase",
            letterSpacing:  "0.8px",
          }}>
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block" }}
            />
            Join the Movement
          </span>
        </motion.div>

        {/* Headline */}
        <div style={{ marginBottom: "24px" }}>
          <AnimatedHeadline inView={inView} />
        </div>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          transition={{ delay: 0.55 }}
          style={{
            fontFamily:  T.fb,
            fontSize:    "clamp(15px, 2vw, 19px)",
           color: "#475569",
            lineHeight:  1.72,
            maxWidth:    "580px",
            marginBottom: "42px",
          }}
        >
          Join thousands of{" "}
          <strong style={{ color: "#0f172a", fontWeight: 600 }}>
            Digital Sevaks
          </strong>
          {" "}transforming communities across India — one action at a time.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={makeStagger(0.6, 0.14)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{
            display:     "flex",
            gap:         "16px",
            flexWrap:    "wrap",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          {/* <motion.div variants={fadeUp}>
            <CTAButton
              label="Join as Sevak"
              icon="🌱"
              variant="primary"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CTAButton
              label="Register NGO"
              icon="🏛️"
              variant="secondary"
            /> */}
          {/* </motion.div> */}
        </motion.div>

        {/* Urgency line */}
        <UrgencyLine inView={inView} />

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
          style={{
            width:           "100%",
            maxWidth:        "320px",
            height:          "1px",
            background:      "linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)",
            margin:          "32px auto",
            transformOrigin: "center",
          }}
        />

        {/* Trust row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          transition={{ delay: 0.95 }}
          style={{
            display:     "flex",
            alignItems:  "center",
            justifyContent: "center",
            flexWrap:    "wrap",
            gap:         "16px 28px",
          }}
        >
          {/* Avatar cluster + count */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AvatarCluster inView={inView} />
            <div>
              <div style={{
                fontFamily:  T.ff,
                fontSize:    "16px",
                fontWeight:  500,
                color:       "#0f172a",
                lineHeight:  1,
              }}>
                48,000+
              </div>
              <div style={{
                fontFamily: T.fb,
                fontSize:   "11.5px",
                color: "#94a3b8",
                marginTop:  "3px",
              }}>
                Sevaks already onboard
              </div>
            </div>
          </div>

          {/* Vertical separator */}
          <div style={{
            width:      "1px",
            height:     "36px",
            background: "rgba(0,0,0,0.08)", 
          }} />

          {/* Trust badge */}
          <TrustBadge inView={inView} />
        </motion.div>

      </motion.div>

      {/* ── Bottom fade-out to next section ── */}
      <div
        aria-hidden
        style={{
          position:       "absolute",
          bottom:         0,
          left:           0,
          right:          0,
          height:         "80px",
          background:     "linear-gradient(to bottom, transparent, rgba(10,15,30,0.5))",
          pointerEvents:  "none",
          zIndex:         6,
        }}
      />
    </section>
  );
}
