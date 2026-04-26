import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useAnimationFrame,
} from "framer-motion";

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const T = {
  green:        "#22c55e",
  greenLight:   "#f0fdf4",
  greenMid:     "#dcfce7",
  greenGlow:    "rgba(34,197,94,0.18)",
  blue:         "#3b82f6",
  blueLight:    "#eff6ff",
  blueMid:      "#bfdbfe",
  blueGlow:     "rgba(59,130,246,0.16)",
  teal:         "#14b8a6",
  tealLight:    "#f0fdfa",
  tealMid:      "#99f6e4",
  tealGlow:     "rgba(20,184,166,0.16)",
  violet:       "#8b5cf6",
  violetLight:  "#f5f3ff",
  violetGlow:   "rgba(139,92,246,0.14)",
  amber:        "#f59e0b",
  amberLight:   "#fffbeb",
  rose:         "#f43f5e",
  roseLight:    "#fff1f2",
  text:         "#0f172a",
  textSub:      "#475569",
  textMuted:    "#94a3b8",
  border:       "rgba(15,23,42,0.08)",
  borderGlass:  "rgba(255,255,255,0.55)",
  bg:           "#ffffff",
  surface:      "#f8fafc",
  glass:        "rgba(255,255,255,0.72)",
  glassDark:    "rgba(255,255,255,0.85)",
  font:         "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
  fontDisplay:  "'Sora', 'Inter', system-ui, sans-serif",
  shadow:       "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
  shadowMd:     "0 4px 20px rgba(0,0,0,0.07), 0 12px 40px rgba(0,0,0,0.07)",
  shadowLg:     "0 8px 32px rgba(0,0,0,0.10), 0 24px 64px rgba(0,0,0,0.09)",
  shadowGlass:  "0 8px 32px rgba(31,38,135,0.08), 0 2px 8px rgba(0,0,0,0.04)",
  radius:       "20px",
  radiusSm:     "12px",
  radiusXl:     "28px",
  radiusPill:   "999px",
};

// ─── Testimonial data ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 0,
    name: "Aanya Sharma",
    role: "Volunteer Sevak",
    location: "Bangalore, India",
    avatar: "AS",
    avatarGrad: ["#22c55e", "#14b8a6"],
    tag: "Volunteer Story",
    tagAccent: T.green,
    tagBg: T.greenLight,
    stars: 5,
    quote: "I found my purpose through Digital Sevaks. Within a week of joining, I was matched with an NGO teaching coding to underprivileged kids — something I'd dreamed of doing for years. The AI knew what I needed before I did.",
    metric: { value: "3 months", label: "to first real impact" },
    floatDelay: 0,
    floatDuration: 5.5,
    accent: T.green,
    accentGlow: T.greenGlow,
    featured: true,
  },
  {
    id: 1,
    name: "Rajiv Menon",
    role: "NGO Founder · Clean Future",
    location: "Chennai, India",
    avatar: "RM",
    avatarGrad: ["#3b82f6", "#8b5cf6"],
    tag: "NGO Impact",
    tagAccent: T.blue,
    tagBg: T.blueLight,
    stars: 5,
    quote: "We scaled our community outreach 3× without hiring a single additional coordinator. The platform's automation handles what used to take our team weeks — now it's done overnight.",
    metric: { value: "3×", label: "outreach growth" },
    floatDelay: 0.8,
    floatDuration: 6.2,
    accent: T.blue,
    accentGlow: T.blueGlow,
    featured: false,
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Computer Science Student",
    location: "Pune, India",
    avatar: "PN",
    avatarGrad: ["#14b8a6", "#3b82f6"],
    tag: "Student Journey",
    tagAccent: T.teal,
    tagBg: T.tealLight,
    stars: 5,
    quote: "This platform completely changed my perspective on what tech can do for society. I shipped a real-world irrigation tool used by 12,000 farmers. That's not something any internship could have given me.",
    metric: { value: "12K", label: "farmers impacted" },
    floatDelay: 1.4,
    floatDuration: 7.0,
    accent: T.teal,
    accentGlow: T.tealGlow,
    featured: false,
  },
  {
    id: 3,
    name: "Dr. Fatima Sheikh",
    role: "Programme Director · MedReach",
    location: "Hyderabad, India",
    avatar: "FS",
    avatarGrad: ["#8b5cf6", "#f43f5e"],
    tag: "NGO Impact",
    tagAccent: T.violet,
    tagBg: T.violetLight,
    stars: 5,
    quote: "Verified volunteers saved us months of vetting time. We used to spend 40% of our bandwidth just screening applicants. Now we deploy medical teams in days, not months.",
    metric: { value: "40%", label: "admin time saved" },
    floatDelay: 0.4,
    floatDuration: 5.8,
    accent: T.violet,
    accentGlow: T.violetGlow,
    featured: false,
  },
  {
    id: 4,
    name: "Karan Mehta",
    role: "UX Designer → Tech Lead",
    location: "Mumbai, India",
    avatar: "KM",
    avatarGrad: ["#f59e0b", "#22c55e"],
    tag: "Career Impact",
    tagAccent: T.amber,
    tagBg: T.amberLight,
    stars: 5,
    quote: "I came in as a junior designer. The matching engine placed me in a project that eventually became a 14-country health platform. My portfolio transformed overnight — and so did my career trajectory.",
    metric: { value: "14", label: "countries deployed" },
    floatDelay: 1.1,
    floatDuration: 6.6,
    accent: T.amber,
    accentGlow: "rgba(245,158,11,0.14)",
    featured: false,
  },
];

// ─── Animated star rating ───────────────────────────────────────────────────────
function StarRating({ count, accent, inView, delay = 0 }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{
            duration: 0.35, delay: delay + i * 0.07,
            type: "spring", stiffness: 280, damping: 16,
          }}
          style={{ color: "#fbbf24", fontSize: "13px", display: "inline-block", lineHeight: 1 }}
        >★</motion.span>
      ))}
    </div>
  );
}

// ─── Animated quote icon ────────────────────────────────────────────────────────
function QuoteIcon({ accent, hovered }) {
  return (
    <motion.div
      animate={{ opacity: hovered ? 1 : 0.35, scale: hovered ? 1.08 : 1 }}
      transition={{ duration: 0.25 }}
      style={{ lineHeight: 0.7, userSelect: "none" }}
    >
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
        <path
          d="M0 24V14.4C0 8.16 3.84 3.36 11.52 0L13.44 3.12C9.6 4.8 7.2 7.44 6.72 10.56H12V24H0ZM20 24V14.4C20 8.16 23.84 3.36 31.52 0L33.44 3.12C29.6 4.8 27.2 7.44 26.72 10.56H32V24H20Z"
          fill={accent}
          fillOpacity="0.25"
        />
      </svg>
    </motion.div>
  );
}

// ─── Avatar with pulse + gradient ──────────────────────────────────────────────
function Avatar({ initials, grad, size = 44, featured = false, hovered = false }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* Pulse ring */}
      {featured && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -4,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${grad[0]}40, transparent 70%)`,
          }}
        />
      )}
      {/* Glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          background: `radial-gradient(circle, ${grad[0]}50, transparent 70%)`,
          filter: "blur(4px)",
        }}
      />
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        style={{
          width: size, height: size, borderRadius: "50%",
          background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.font, fontSize: size * 0.3, fontWeight: 700,
          color: "#fff", letterSpacing: "0.02em",
          border: "2px solid rgba(255,255,255,0.6)",
          boxShadow: `0 4px 12px ${grad[0]}40`,
          position: "relative",
        }}
      >
        {initials}
      </motion.div>
    </div>
  );
}

// ─── Single testimonial card ────────────────────────────────────────────────────
function TestiCard({
  t, index, inView, activeId, setActiveId,
  layoutMode = "stack", // "stack" | "carousel"
}) {
  const ref     = useRef(null);
  const isActive = activeId === t.id;
  const isDimmed = activeId !== null && !isActive;

  // Cursor-follow glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowBg = useTransform(
    [mouseX, mouseY],
    ([mx, my]) =>
      `radial-gradient(280px circle at ${mx}px ${my}px, ${t.accent}18, transparent 70%)`
  );

  // 3-D tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rX   = useSpring(rawX, { stiffness: 140, damping: 20 });
  const rY   = useSpring(rawY, { stiffness: 140, damping: 20 });
  const rotateX = useTransform(rX, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(rY, [-0.5, 0.5], [-5, 5]);

  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
    rawX.set((e.clientY - r.top)  / r.height - 0.5);
    rawY.set((e.clientX - r.left) / r.width  - 0.5);
  }, []);

  const onLeave = useCallback(() => {
    setActiveId(null);
    rawX.set(0); rawY.set(0);
  }, []);

  const cardDelay = 0.12 + index * 0.14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? {
        opacity: isDimmed ? 0.42 : 1,
        y: 0,
        scale: isDimmed ? 0.978 : 1,
      } : {}}
      transition={{
        duration: 0.65, delay: cardDelay,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.3 },
        scale:   { duration: 0.22 },
      }}
      style={{ perspective: 900 }}
    >
      {/* Floating idle */}
      <motion.div
        animate={{ y: [0, t.floatDelay % 2 === 0 ? -8 : -6, 0] }}
        transition={{
          duration: t.floatDuration,
          repeat: Infinity, ease: "easeInOut",
          delay: t.floatDelay,
        }}
      >
        {/* 3D tilt wrapper */}
        <motion.div
          ref={ref}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onMouseEnter={() => setActiveId(t.id)}
          animate={{
            boxShadow: isActive
              ? `${T.shadowLg}, 0 0 0 1.5px ${t.accent}40`
              : T.shadowGlass,
            y: isActive ? -6 : 0,
          }}
          transition={{ duration: 0.28 }}
          style={{
            background: T.glass,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${isActive ? t.accent + "40" : T.borderGlass}`,
            borderRadius: T.radiusXl,
            padding: "clamp(20px, 2.5vw, 28px)",
            position: "relative", overflow: "hidden",
            cursor: "default",
            boxShadow: T.shadowGlass,
            transition: "border-color 0.3s",
          }}
        >
          {/* Cursor glow */}
          <motion.div style={{
            position: "absolute", inset: 0, borderRadius: T.radiusXl,
            background: glowBg, pointerEvents: "none",
            opacity: isActive ? 1 : 0, transition: "opacity 0.3s",
          }} />

          {/* Animated gradient border on active */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  position: "absolute", inset: -1.5,
                  borderRadius: `calc(${T.radiusXl} + 2px)`,
                  background: `linear-gradient(135deg, ${t.accent}50, transparent 50%, ${t.accent}25)`,
                  zIndex: -1, pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>

          {/* Noise texture overlay */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: T.radiusXl,
            opacity: 0.025, pointerEvents: "none",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }} />

          {/* Top row: quote + tag */}
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", marginBottom: "12px",
          }}>
            <QuoteIcon accent={t.accent} hovered={isActive} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontFamily: T.font, fontSize: "10px", fontWeight: 700,
                color: t.tagAccent, background: t.tagBg,
                border: `1px solid ${t.tagAccent}25`,
                borderRadius: T.radiusPill, padding: "3px 10px",
                letterSpacing: "0.07em", textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>{t.tag}</span>
              {t.featured && (
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: t.accent,
                    boxShadow: `0 0 8px ${t.accent}`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Stars */}
          <div style={{ marginBottom: "10px" }}>
            <StarRating count={t.stars} accent={t.accent} inView={inView} delay={cardDelay} />
          </div>

          {/* Quote text */}
          <p style={{
            fontFamily: T.font, fontSize: "clamp(13px, 1.2vw, 14px)",
            fontWeight: 300, color: T.textSub,
            lineHeight: 1.8, margin: "0 0 16px",
            fontStyle: "italic",
          }}>
            "{t.quote}"
          </p>

          {/* Metric pill */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: cardDelay + 0.3 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `${t.accent}12`,
              border: `1px solid ${t.accent}22`,
              borderRadius: "10px", padding: "7px 13px",
              marginBottom: "16px",
            }}
          >
            <span style={{
              fontFamily: T.font, fontSize: "18px", fontWeight: 800,
              color: t.accent, letterSpacing: "-0.03em", lineHeight: 1,
            }}>{t.metric.value}</span>
            <span style={{
              fontFamily: T.font, fontSize: "11px",
              fontWeight: 400, color: T.textSub,
            }}>{t.metric.label}</span>
          </motion.div>

          {/* Divider */}
          <div style={{ height: "1px", background: T.border, marginBottom: "14px" }} />

          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              initials={t.avatar}
              grad={t.avatarGrad}
              size={40}
              featured={t.featured}
              hovered={isActive}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: T.font, fontSize: "13px",
                fontWeight: 700, color: T.text, lineHeight: 1.2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{t.name}</div>
              <div style={{
                fontFamily: T.font, fontSize: "11px",
                fontWeight: 400, color: T.textMuted, marginTop: "2px",
              }}>{t.role}</div>
              {t.location && (
                <div style={{
                  fontFamily: T.font, fontSize: "10px",
                  fontWeight: 400, color: T.textMuted, marginTop: "1px",
                  display: "flex", alignItems: "center", gap: "3px",
                }}>
                  <span style={{ fontSize: "9px" }}>📍</span>{t.location}
                </div>
              )}
            </div>
          </div>

          {/* Bottom accent */}
          <motion.div
            animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", bottom: 0, left: "10%", right: "10%",
              height: "2.5px", borderRadius: "2px 2px 0 0",
              background: `linear-gradient(90deg, transparent, ${t.accent}80, transparent)`,
              transformOrigin: "center",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Overlapping avatar cluster ─────────────────────────────────────────────────
function AvatarCluster({ inView }) {
  const data = [
    { initials: "AS", grad: ["#22c55e","#14b8a6"] },
    { initials: "RM", grad: ["#3b82f6","#8b5cf6"] },
    { initials: "PN", grad: ["#14b8a6","#3b82f6"] },
    { initials: "FS", grad: ["#8b5cf6","#f43f5e"] },
    { initials: "KM", grad: ["#f59e0b","#22c55e"] },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ display: "flex" }}>
        {data.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10, scale: 0.7 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.6 + i * 0.08, type: "spring", stiffness: 260 }}
            style={{ marginLeft: i > 0 ? "-10px" : 0, zIndex: data.length - i }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: `linear-gradient(135deg, ${d.grad[0]}, ${d.grad[1]})`,
              border: "2px solid rgba(255,255,255,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.font, fontSize: "11px", fontWeight: 700, color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}>{d.initials}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 1.1 }}
          style={{ fontFamily: T.font, fontSize: "13px", fontWeight: 700, color: T.text }}
        >48,000+ Sevaks</motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.25 }}
          style={{ fontFamily: T.font, fontSize: "11px", fontWeight: 300, color: T.textMuted }}
        >creating impact daily</motion.div>
      </div>
    </div>
  );
}

// ─── Trust badge ─────────────────────────────────────────────────────────────────
function TrustBadge({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: 0.08, type: "spring", stiffness: 240 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: T.greenLight, border: `1px solid ${T.greenMid}`,
        borderRadius: T.radiusPill, padding: "6px 14px", marginBottom: "20px",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, flexShrink: 0 }}
      />
      <span style={{
        fontFamily: T.font, fontSize: "12px", fontWeight: 600,
        color: T.green, letterSpacing: "0.07em", textTransform: "uppercase",
      }}>Voices of Impact</span>
    </motion.div>
  );
}

// ─── Magnetic CTA ───────────────────────────────────────────────────────────────
function MagneticCTA({ label, variant = "primary" }) {
  const ref = useRef(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 200, damping: 22 });
  const sy  = useSpring(y, { stiffness: 200, damping: 22 });
  const [hov, setHov] = useState(false);
  const isPrimary = variant === "primary";

  return (
    <motion.button
      ref={ref}
      style={{
        x: sx, y: sy,
        fontFamily: T.font, fontSize: "14px", fontWeight: 600,
        color:      isPrimary ? "#fff" : T.green,
        background: isPrimary
          ? `linear-gradient(135deg, ${T.green}, ${T.blue})`
          : T.greenLight,
        border:     isPrimary ? "none" : `1px solid ${T.greenMid}`,
        borderRadius: T.radiusPill, padding: "12px 28px",
        cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "8px",
        boxShadow: hov && isPrimary ? `0 8px 28px rgba(34,197,94,0.38)` : isPrimary ? `0 4px 14px rgba(34,197,94,0.22)` : "none",
        transition: "box-shadow 0.3s",
        letterSpacing: "0.01em",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width  / 2) * 0.28);
        y.set((e.clientY - r.top  - r.height / 2) * 0.28);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >
      <span>{label}</span>
      <motion.span
        animate={hov ? { x: 4 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ fontSize: "15px" }}
      >→</motion.span>
    </motion.button>
  );
}

// ─── Left content column ────────────────────────────────────────────────────────
function LeftContent({ inView }) {
  return (
    <div style={{
      position: "sticky", top: "clamp(80px, 10vh, 120px)",
      display: "flex", flexDirection: "column", gap: "24px",
      paddingRight: "clamp(0px, 2vw, 16px)",
    }}>
      <TrustBadge inView={inView} />

      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: T.fontDisplay,
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 800, color: T.text,
          lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0,
        }}
      >
        Real stories.{" "}
        <span style={{
          background: `linear-gradient(135deg, ${T.green}, ${T.teal}, ${T.blue})`,
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>Real change.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: T.font, fontSize: "clamp(14px, 1.4vw, 16px)",
          fontWeight: 300, color: T.textSub,
          lineHeight: 1.78, margin: 0, maxWidth: "360px",
        }}
      >
        From students finding purpose to NGOs scaling missions — every sevak has
        a story worth hearing. These are just a few of the 48,000+ who call
        Digital Sevaks home.
      </motion.p>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.34 }}
        style={{
          background: T.glass,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${T.borderGlass}`,
          borderRadius: T.radius,
          padding: "18px 20px",
          boxShadow: T.shadowGlass,
          display: "flex", gap: "0",
        }}
      >
        {[
          { value: "4.9", suffix: "/5",  label: "Avg. rating",    accent: T.green },
          { value: "98%", suffix: "",     label: "Recommend us",   accent: T.blue  },
          { value: "190", suffix: "+",    label: "Countries",      accent: T.teal  },
        ].map((s, i) => (
          <div key={s.label} style={{
            flex: 1, textAlign: "center",
            borderRight: i < 2 ? `1px solid ${T.border}` : "none",
            padding: "0 12px",
          }}>
            <div style={{
              fontFamily: T.font, fontSize: "22px", fontWeight: 800,
              color: s.accent, letterSpacing: "-0.03em", lineHeight: 1,
            }}>{s.value}{s.suffix}</div>
            <div style={{ fontFamily: T.font, fontSize: "10px", fontWeight: 500, color: T.textMuted, marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Avatar cluster + badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          background: T.glass,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${T.borderGlass}`,
          borderRadius: T.radius, padding: "14px 18px",
          boxShadow: T.shadowGlass,
        }}
      >
        <AvatarCluster inView={inView} />
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.62 }}
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        {/* <MagneticCTA label="Share Your Story" variant="primary" />
        <MagneticCTA label="Read All Stories" variant="secondary" /> */}
      </motion.div>

      {/* Connecting line accent */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        style={{
          width: "1.5px", height: "60px",
          background: `linear-gradient(to bottom, ${T.green}40, transparent)`,
          transformOrigin: "top",
          marginLeft: "2px",
        }}
      />
    </div>
  );
}

// ─── Ambient blobs ──────────────────────────────────────────────────────────────
function AmbientBlobs() {
  const blobs = [
    { x: "-6%",  y: "8%",   w: 420, color: `${T.green}0c`,  dur: 20, delay: 0  },
    { x: "68%",  y: "-4%",  w: 380, color: `${T.blue}0b`,   dur: 25, delay: 6  },
    { x: "42%",  y: "60%",  w: 300, color: `${T.teal}09`,   dur: 18, delay: 10 },
    { x: "82%",  y: "65%",  w: 240, color: `${T.violet}08`, dur: 16, delay: 3  },
    { x: "20%",  y: "80%",  w: 200, color: `${T.amber}07`,  dur: 22, delay: 8  },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {blobs.map((b, i) => (
        <motion.div key={i}
          animate={{ x: [0, 28, -18, 0], y: [0, -22, 14, 0], scale: [1, 1.06, 0.96, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          style={{
            position: "absolute", left: b.x, top: b.y,
            width: b.w, height: b.w, borderRadius: "50%",
            background: b.color, filter: "blur(90px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Soft connecting lines between cards ────────────────────────────────────────
function ConnectingLines({ inView }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      pointerEvents: "none", zIndex: 0, overflow: "hidden",
    }}>
      {[0.2, 0.45, 0.68].map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
          style={{
            position: "absolute",
            left: `${10 + i * 35}%`,
            top: `${20 + i * 20}%`,
            width: "1px",
            height: `${60 + i * 15}px`,
            background: `linear-gradient(to bottom, ${T.green}30, ${T.blue}15, transparent)`,
            transformOrigin: "top",
          }}
        />
      ))}
    </div>
  );
}

// ─── Card stack layout (right panel) ───────────────────────────────────────────
function CardStack({ inView, activeId, setActiveId }) {
  // Column layout: featured top-full, then 2-col pairs
  const [featured, ...rest] = TESTIMONIALS;
  const pairs = [rest.slice(0, 2), rest.slice(2)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative" }}>
      <ConnectingLines inView={inView} />

      {/* Featured card — full width */}
      <TestiCard
        t={featured} index={0} inView={inView}
        activeId={activeId} setActiveId={setActiveId}
      />

      {/* Pair rows */}
      {pairs.map((pair, pi) => (
        <div key={pi} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: "14px",
        }}>
          {pair.map((t, ci) => (
            <TestiCard
              key={t.id} t={t}
              index={1 + pi * 2 + ci}
              inView={inView}
              activeId={activeId} setActiveId={setActiveId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Auto-scroll carousel (mobile / alt view) ─────────────────────────────────
function AutoCarousel({ inView }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div key={current}>
          <TestiCard
            t={TESTIMONIALS[current]}
            index={0} inView={inView}
            activeId={null} setActiveId={() => {}}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
        {TESTIMONIALS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            animate={{
              width: i === current ? 24 : 8,
              background: i === current ? T.green : T.textMuted,
              opacity: i === current ? 1 : 0.4,
            }}
            transition={{ duration: 0.25 }}
            style={{
              height: 8, borderRadius: T.radiusPill,
              border: "none", cursor: "pointer", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Bottom full-width strip ────────────────────────────────────────────────────
function TrustStrip({ inView }) {
  const orgs = ["UNICEF", "Red Cross", "WHO", "Oxfam", "Save the Children", "MSF", "GiveWell"];
  const doubled = [...orgs, ...orgs];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      style={{
        marginTop: "clamp(40px, 6vw, 64px)",
        background: T.glass,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${T.borderGlass}`,
        borderRadius: T.radiusXl,
        padding: "clamp(20px, 3vw, 28px) clamp(24px, 5vw, 48px)",
        boxShadow: T.shadowGlass,
        overflow: "hidden", position: "relative",
      }}
    >
      {/* Top gradient strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${T.green}, ${T.teal}, ${T.blue}, ${T.violet})`,
      }} />

      <p style={{
        fontFamily: T.font, fontSize: "11px", fontWeight: 700,
        color: T.textMuted, letterSpacing: "0.1em",
        textTransform: "uppercase", textAlign: "center", marginBottom: "20px", margin: "0 0 20px",
      }}>Trusted by organisations worldwide</p>

      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Edge fade */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: `linear-gradient(90deg, ${T.glass} 0%, transparent 15%, transparent 85%, ${T.glass} 100%)`,
        }} />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "48px", width: "max-content" }}
        >
          {doubled.map((org, i) => (
            <span key={i} style={{
              fontFamily: T.font, fontSize: "13px",
              fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: T.textMuted,
              whiteSpace: "nowrap",
            }}>{org}</span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────
export default function VoicesOfImpact() {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.06 });
  const [activeId, setActiveId] = useState(null);

  // Global mouse parallax for blobs
  const gMouseX = useMotionValue(0.5);
  const gMouseY = useMotionValue(0.5);
  const blobX   = useSpring(useTransform(gMouseX, [0, 1], [-24, 24]), { stiffness: 40, damping: 24 });
  const blobY   = useSpring(useTransform(gMouseY, [0, 1], [-16, 16]), { stiffness: 40, damping: 24 });

  const onGlobalMove = useCallback((e) => {
    gMouseX.set(e.clientX / window.innerWidth);
    gMouseY.set(e.clientY / window.innerHeight);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onGlobalMove}
      style={{
        position: "relative",
        background: "linear-gradient(160deg, #f0fdf4 0%, #f8fafc 40%, #eff6ff 100%)",
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 72px)",
        overflow: "hidden", fontFamily: T.font,
      }}
    >
      {/* Blobs with global mouse parallax */}
      <motion.div style={{ x: blobX, y: blobY, position: "absolute", inset: 0 }}>
        <AmbientBlobs />
      </motion.div>

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(15,23,42,0.045) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1240px", margin: "0 auto" }}>

        {/* Two-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: "clamp(32px, 5vw, 72px)",
          alignItems: "start",
        }}>
          <LeftContent inView={inView} />
          <CardStack inView={inView} activeId={activeId} setActiveId={setActiveId} />
        </div>

        <TrustStrip inView={inView} />
      </div>
    </section>
  );
}
