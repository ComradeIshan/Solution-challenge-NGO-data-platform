import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ─── Design Tokens (identical to system) ───────────────────────────────────────
const T = {
  green:       "#22c55e",
  greenLight:  "#f0fdf4",
  greenMid:    "#dcfce7",
  blue:        "#3b82f6",
  blueLight:   "#eff6ff",
  blueMid:     "#bfdbfe",
  teal:        "#14b8a6",
  tealLight:   "#f0fdfa",
  tealMid:     "#99f6e4",
  violet:      "#8b5cf6",
  violetLight: "#f5f3ff",
  violetMid:   "#ddd6fe",
  amber:       "#f59e0b",
  amberLight:  "#fffbeb",
  amberMid:    "#fde68a",
  rose:        "#f43f5e",
  roseLight:   "#fff1f2",
  roseMid:     "#fecdd3",
  text:        "#0f172a",
  textSub:     "#475569",
  textMuted:   "#94a3b8",
  border:      "rgba(15,23,42,0.07)",
  bg:          "#ffffff",
  surface:     "#f8fafc",
  font:        "'Inter', system-ui, sans-serif",
  shadow:      "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)",
  shadowHover: "0 8px 32px rgba(0,0,0,0.10), 0 24px 56px rgba(0,0,0,0.08)",
  radius:      "20px",
  radiusSm:    "12px",
};

// ─── Data ───────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 0,
    quote: "Through UnityNet I applied my medical skills in rural Nepal. In three weeks our team screened 800 patients who had never seen a qualified doctor. The AI matching was uncanny — it knew my subspecialty before I'd even finished my profile.",
    name: "Dr. Riya Sharma",
    role: "Medical Volunteer",
    location: "Kathmandu, Nepal",
    avatar: "RS",
    avatarColor: "#dcfce7",
    avatarText: T.green,
    accent: T.green,
    accentLight: T.greenLight,
    accentMid: T.greenMid,
    org: "Doctors Without Gaps",
    stars: 5,
    metric: { value: "800", label: "patients screened" },
    tag: "Volunteer",
  },
  {
    id: 1,
    quote: "Our NGO scaled from 200 to 4,000 volunteers within six months of joining. The real-time dashboard gave our board the evidence they needed to unlock a $2M grant. We simply couldn't have grown without this platform.",
    name: "James Mwangi",
    role: "Executive Director",
    location: "Nairobi, Kenya",
    avatar: "JM",
    avatarColor: "#dbeafe",
    avatarText: T.blue,
    accent: T.blue,
    accentLight: T.blueLight,
    accentMid: T.blueMid,
    org: "Africa Water Initiative",
    stars: 5,
    metric: { value: "20×", label: "volunteer growth" },
    tag: "NGO Director",
  },
  {
    id: 2,
    quote: "As a software engineer I never imagined my code could irrigate farms in Ghana. UnityNet surfaced that opportunity in under 30 seconds. Six months later I'm the tech lead for a 14-country deployment.",
    name: "Sofia Lima",
    role: "Senior Engineer → Tech Lead",
    location: "São Paulo, Brazil",
    avatar: "SL",
    avatarColor: "#ede9fe",
    avatarText: T.violet,
    accent: T.violet,
    accentLight: T.violetLight,
    accentMid: T.violetMid,
    org: "Open Farm Network",
    stars: 5,
    metric: { value: "14", label: "countries deployed" },
    tag: "Tech Volunteer",
  },
  {
    id: 3,
    quote: "The blockchain-backed donation tracking is a game changer for institutional donors. Our compliance team went from 3-week audit cycles to same-day sign-off. We've doubled our annual giving as a direct result.",
    name: "Ahmed Al-Rashid",
    role: "Head of Philanthropy",
    location: "Dubai, UAE",
    avatar: "AA",
    avatarColor: "#fef3c7",
    avatarText: T.amber,
    accent: T.amber,
    accentLight: T.amberLight,
    accentMid: T.amberMid,
    org: "Gulf Futures Foundation",
    stars: 5,
    metric: { value: "2×", label: "annual giving" },
    tag: "Major Donor",
  },
  {
    id: 4,
    quote: "We went from 10 local volunteers to 300 remote contributors worldwide. UnityNet's automation handles onboarding, scheduling and reporting — saving our tiny team 40 hours a week.",
    name: "Priya Nair",
    role: "Programme Coordinator",
    location: "Bangalore, India",
    avatar: "PN",
    avatarColor: "#ccfbf1",
    avatarText: T.teal,
    accent: T.teal,
    accentLight: T.tealLight,
    accentMid: T.tealMid,
    org: "HealthBridge India",
    stars: 5,
    metric: { value: "40h", label: "saved weekly" },
    tag: "NGO Staff",
  },
  {
    id: 5,
    quote: "UnityNet didn't just connect me to a cause — it connected me to a community. I've built lifelong friendships across five continents, and my skills have protected drinking water for 12,000 people.",
    name: "Claire Dupont",
    role: "Environmental Engineer",
    location: "Lyon, France",
    avatar: "CD",
    avatarColor: "#fff1f2",
    avatarText: T.rose,
    accent: T.rose,
    accentLight: T.roseLight,
    accentMid: T.roseMid,
    org: "Clean Rivers Collective",
    stars: 5,
    metric: { value: "12K", label: "people with clean water" },
    tag: "Volunteer",
  },
];

const TRUST_LOGOS = ["UNICEF", "Red Cross", "WHO", "Oxfam", "Save the Children", "MSF"];

const SUMMARY_STATS = [
  { value: "4.9", suffix: "/5", label: "Average rating", accent: T.green },
  { value: "2,400", suffix: "+", label: "Verified reviews", accent: T.blue },
  { value: "98", suffix: "%", label: "Would recommend", accent: T.teal },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1400, inView = false, isFloat = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const numTarget = parseFloat(target.replace(/[^0-9.]/g, "")) || 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = eased * numTarget;
      setValue(isFloat ? v.toFixed(1) : Math.floor(v));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return value;
}

// ─── Star Rating ────────────────────────────────────────────────────────────────
function Stars({ count, accent, delay, inView }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.3, delay: delay + i * 0.06, type: "spring", stiffness: 260 }}
          style={{ color: "#fbbf24", fontSize: "13px", display: "inline-block" }}
        >★</motion.span>
      ))}
    </div>
  );
}

// ─── Magnetic button ────────────────────────────────────────────────────────────
function MagneticButton({ children, variant = "primary" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });
  const [hov, setHov] = useState(false);

  const isPrimary = variant === "primary";

  return (
    <motion.button
      ref={ref}
      style={{
        x: sx, y: sy,
        fontFamily: T.font, fontSize: "15px", fontWeight: 600,
        color: isPrimary ? "#fff" : T.green,
        background: isPrimary
          ? `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`
          : T.greenLight,
        border: isPrimary ? "none" : `1px solid ${T.greenMid}`,
        borderRadius: "50px",
        padding: "13px 28px", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "8px",
        letterSpacing: "0.01em",
        boxShadow: hov && isPrimary
          ? "0 8px 30px rgba(34,197,94,0.35)"
          : isPrimary ? "0 4px 16px rgba(34,197,94,0.22)" : "none",
        transition: "box-shadow 0.3s, background 0.3s",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.28);
        y.set((e.clientY - r.top - r.height / 2) * 0.28);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >
      <span>{children}</span>
      <motion.span
        animate={hov ? { x: 4 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ fontSize: "16px" }}
      >→</motion.span>
    </motion.button>
  );
}

// ─── Testimonial Card ───────────────────────────────────────────────────────────
function TestiCard({ t, index, inView, activeId, setActiveId, col }) {
  const ref = useRef(null);
  const isActive = activeId === t.id;
  const isDimmed = activeId !== null && !isActive;

  // Cursor glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowBg = useTransform(
    [mouseX, mouseY],
    ([mx, my]) => `radial-gradient(260px circle at ${mx}px ${my}px, ${t.accent}12, transparent 65%)`
  );

  // Tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rX = useSpring(rawX, { stiffness: 150, damping: 20 });
  const rY = useSpring(rawY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(rX, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(rY, [-0.5, 0.5], [-4, 4]);

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
    rawX.set((e.clientY - r.top) / r.height - 0.5);
    rawY.set((e.clientX - r.left) / r.width - 0.5);
  };

  const staggerDelay = 0.1 + (col * 0.08) + (index % 3) * 0.14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? {
        opacity: isDimmed ? 0.45 : 1,
        y: 0,
        scale: isDimmed ? 0.982 : 1,
      } : {}}
      transition={{
        duration: 0.65, delay: staggerDelay,
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 0.2 },
        opacity: { duration: 0.25 },
      }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          setActiveId(null);
          rawX.set(0); rawY.set(0);
        }}
        onMouseEnter={() => setActiveId(t.id)}
        animate={{
          boxShadow: isActive ? T.shadowHover : T.shadow,
          borderColor: isActive ? `${t.accent}35` : T.border,
          y: isActive ? -5 : 0,
        }}
        transition={{ duration: 0.28 }}
        style={{
          background: T.bg,
          border: "1px solid",
          borderColor: T.border,
          borderRadius: T.radius,
          padding: "clamp(20px, 2.2vw, 26px)",
          display: "flex", flexDirection: "column", gap: "16px",
          cursor: "default", position: "relative", overflow: "hidden",
          boxShadow: T.shadow,
        }}
      >
        {/* Cursor glow */}
        <motion.div style={{
          position: "absolute", inset: 0, borderRadius: T.radius,
          background: glowBg, pointerEvents: "none",
          opacity: isActive ? 1 : 0, transition: "opacity 0.3s",
        }} />

        {/* Animated border on hover */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute", inset: -1, borderRadius: `calc(${T.radius} + 1px)`,
                background: `linear-gradient(135deg, ${t.accent}50, transparent 50%, ${t.accent}30)`,
                zIndex: -1, pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* Top: stars + tag */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stars count={t.stars} accent={t.accent} delay={staggerDelay} inView={inView} />
          <span style={{
            fontFamily: T.font, fontSize: "10px", fontWeight: 700,
            color: t.accent, background: t.accentLight,
            border: `1px solid ${t.accentMid}`,
            borderRadius: "50px", padding: "3px 10px",
            letterSpacing: "0.07em", textTransform: "uppercase",
          }}>{t.tag}</span>
        </div>

        {/* Quote mark */}
        <motion.div
          animate={isActive ? { scale: 1.1, opacity: 1 } : { scale: 1, opacity: 0.35 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "Georgia, serif", fontSize: "48px",
            color: t.accent, lineHeight: 0.6,
            marginBottom: "-6px", userSelect: "none",
          }}
        >"</motion.div>

        {/* Quote text */}
        <p style={{
          fontFamily: T.font, fontSize: "clamp(13px, 1.2vw, 14px)",
          fontWeight: 300, color: T.textSub,
          lineHeight: 1.8, margin: 0, flex: 1,
        }}>{t.quote}</p>

        {/* Metric callout */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: staggerDelay + 0.25 }}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: t.accentLight,
            border: `1px solid ${t.accentMid}`,
            borderRadius: "10px", padding: "10px 14px",
          }}
        >
          <span style={{
            fontFamily: T.font, fontSize: "20px", fontWeight: 800,
            color: t.accent, letterSpacing: "-0.03em", lineHeight: 1,
          }}>{t.metric.value}</span>
          <span style={{
            fontFamily: T.font, fontSize: "12px",
            fontWeight: 400, color: T.textSub, lineHeight: 1.3,
          }}>{t.metric.label}</span>
        </motion.div>

        {/* Author */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          paddingTop: "14px",
          borderTop: `1px solid ${T.border}`,
        }}>
          {/* Avatar */}
          <motion.div
            animate={isActive ? { scale: 1.08 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: t.avatarColor,
              border: `2px solid ${t.accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.font, fontSize: "13px", fontWeight: 700,
              color: t.avatarText, flexShrink: 0,
              boxShadow: isActive ? `0 0 0 3px ${t.accent}20` : "none",
              transition: "box-shadow 0.25s",
            }}
          >{t.avatar}</motion.div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: T.font, fontSize: "13px",
              fontWeight: 700, color: T.text,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{t.name}</div>
            <div style={{
              fontFamily: T.font, fontSize: "11px",
              color: T.textMuted, marginTop: "1px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{t.role} · {t.location}</div>
          </div>

          {/* Org badge */}
          <div style={{
            flexShrink: 0,
            fontFamily: T.font, fontSize: "10px", fontWeight: 600,
            color: T.textMuted,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: "6px", padding: "3px 8px",
            whiteSpace: "nowrap",
          }}>{t.org}</div>
        </div>

        {/* Bottom accent */}
        <motion.div
          animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", bottom: 0, left: "10%", right: "10%",
            height: "2px", borderRadius: "2px 2px 0 0",
            background: `linear-gradient(90deg, transparent, ${t.accent}70, transparent)`,
            transformOrigin: "center",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Summary stat counter ────────────────────────────────────────────────────────
function SummaryStat({ value, suffix, label, accent, delay, inView }) {
  const isFloat = value.includes(".");
  const num = useCountUp(value, 1200, inView, isFloat);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      style={{ textAlign: "center" }}
    >
      <div style={{
        fontFamily: T.font,
        fontSize: "clamp(28px, 3.5vw, 40px)",
        fontWeight: 800, letterSpacing: "-0.03em",
        background: `linear-gradient(135deg, ${accent}, ${T.blue})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", lineHeight: 1,
      }}>
        {num}{suffix}
      </div>
      <div style={{
        fontFamily: T.font, fontSize: "13px",
        fontWeight: 500, color: T.textMuted, marginTop: "6px",
      }}>{label}</div>
    </motion.div>
  );
}

// ─── Ambient blobs ──────────────────────────────────────────────────────────────
function AmbientBlobs() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { x: "0%",  y: "10%",  w: 400, color: `${T.green}0b`, dur: 18, delay: 0 },
        { x: "65%", y: "0%",   w: 360, color: `${T.blue}0b`,  dur: 22, delay: 4 },
        { x: "40%", y: "60%",  w: 280, color: `${T.teal}09`,  dur: 16, delay: 7 },
        { x: "80%", y: "55%",  w: 240, color: `${T.violet}08`,dur: 20, delay: 2 },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 25, -15, 0], y: [0, -20, 12, 0], scale: [1, 1.05, 0.97, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          style={{
            position: "absolute", left: b.x, top: b.y,
            width: b.w, height: b.w, borderRadius: "50%",
            background: b.color, filter: "blur(72px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Scrolling logo marquee ──────────────────────────────────────────────────────
function TrustMarquee({ inView }) {
  const doubled = [...TRUST_LOGOS, ...TRUST_LOGOS];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      style={{ overflow: "hidden", position: "relative", width: "100%" }}
    >
      {/* Fade edges */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(90deg, ${T.bg} 0%, transparent 12%, transparent 88%, ${T.bg} 100%)`,
      }} />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "48px", width: "max-content" }}
      >
        {doubled.map((logo, i) => (
          <div key={i} style={{
            fontFamily: T.font, fontSize: "13px",
            fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: T.textMuted,
            whiteSpace: "nowrap",
          }}>{logo}</div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const statsRef   = useRef(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.06 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });

  const [activeId, setActiveId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const FILTERS = ["All", "Volunteer", "NGO Director", "Tech Volunteer", "Major Donor", "NGO Staff"];

  const filtered = activeFilter === "All"
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.tag === activeFilter);

  // Split into 3 columns
  const col0 = filtered.filter((_, i) => i % 3 === 0);
  const col1 = filtered.filter((_, i) => i % 3 === 1);
  const col2 = filtered.filter((_, i) => i % 3 === 2);
  const cols = [col0, col1, col2];

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative", background: T.surface,
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 72px)",
        overflow: "hidden", fontFamily: T.font,
      }}
    >
      <AmbientBlobs />

      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>

        {/* ── Section Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 56px" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: T.greenLight, border: `1px solid ${T.greenMid}`,
              borderRadius: "50px", padding: "6px 14px", marginBottom: "20px",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }}
            />
            <span style={{
              fontSize: "12px", fontWeight: 600, color: T.green,
              letterSpacing: "0.07em", textTransform: "uppercase",
            }}>Voices from the Field</span>
          </motion.div>

          <h2 style={{
            fontFamily: T.font,
            fontSize: "clamp(28px, 4.5vw, 50px)",
            fontWeight: 800, color: T.text,
            lineHeight: 1.1, letterSpacing: "-0.03em",
            margin: "0 0 16px",
          }}>
            Real people.{" "}
            <span style={{
              background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Real impact.</span>
          </h2>

          <p style={{
            fontSize: "clamp(14px, 1.5vw, 17px)", fontWeight: 300,
            color: T.textSub, lineHeight: 1.75, margin: 0,
          }}>
            Thousands of volunteers, NGOs and donors trust UnityNet every day.
            Here's what they say about the experience.
          </p>
        </motion.div>

        {/* ── Summary stats ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "center", gap: "clamp(28px, 5vw, 64px)",
            marginBottom: "48px",
            padding: "clamp(16px, 2vw, 24px) clamp(24px, 4vw, 48px)",
            background: T.bg,
            border: `1px solid ${T.border}`,
            borderRadius: "16px",
            boxShadow: T.shadow,
          }}
        >
          {SUMMARY_STATS.map((s, i) => (
            <SummaryStat key={s.label} {...s} delay={0.2 + i * 0.1} inView={statsInView} />
          ))}
          <div style={{ width: "1px", background: T.border, alignSelf: "stretch", display: "none" }} />
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            display: "flex", flexWrap: "wrap",
            gap: "8px", justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          {FILTERS.map(f => {
            const active = activeFilter === f;
            return (
              <motion.button
                key={f}
                onClick={() => setActiveFilter(f)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  fontFamily: T.font, fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  color: active ? T.green : T.textSub,
                  background: active ? T.greenLight : T.bg,
                  border: `1px solid ${active ? T.greenMid : T.border}`,
                  borderRadius: "50px", padding: "7px 18px",
                  cursor: "pointer",
                  boxShadow: active ? `0 2px 10px rgba(34,197,94,0.15)` : "none",
                  transition: "all 0.2s",
                }}
              >{f}</motion.button>
            );
          })}
        </motion.div>

        {/* ── Masonry grid (3 cols) ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(12px, 1.5vw, 20px)",
          alignItems: "start",
        }}>
          <AnimatePresence mode="popLayout">
            {cols.map((col, colIdx) => (
              <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 1.5vw, 20px)" }}>
                {col.map((t, rowIdx) => (
                  <TestiCard
                    key={t.id}
                    t={t}
                    index={rowIdx}
                    col={colIdx}
                    inView={inView}
                    activeId={activeId}
                    setActiveId={setActiveId}
                  />
                ))}
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Trust strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            marginTop: "clamp(48px, 7vw, 80px)",
            borderRadius: "16px",
            border: `1px solid ${T.border}`,
            background: T.bg,
            padding: "clamp(20px, 3vw, 32px) clamp(20px, 4vw, 40px)",
            overflow: "hidden",
          }}
        >
          <p style={{
            fontFamily: T.font, fontSize: "12px",
            fontWeight: 600, color: T.textMuted,
            letterSpacing: "0.1em", textTransform: "uppercase",
            textAlign: "center", marginBottom: "20px",
          }}>Trusted by leading organisations worldwide</p>
          <TrustMarquee inView={inView} />
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.85 }}
          style={{
            marginTop: "clamp(32px, 5vw, 56px)",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
            gap: "20px",
            padding: "clamp(20px, 3vw, 32px) clamp(24px, 4vw, 40px)",
            background: `linear-gradient(135deg, ${T.greenLight}, ${T.blueLight})`,
            border: `1px solid ${T.greenMid}`,
            borderRadius: "20px",
          }}
        >
          <div>
            <div style={{ fontFamily: T.font, fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 700, color: T.text }}>
              Ready to write your own story?
            </div>
            <div style={{ fontFamily: T.font, fontSize: "14px", fontWeight: 300, color: T.textSub, marginTop: "4px" }}>
              Join 48,000+ changemakers already making a difference today.
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <MagneticButton variant="primary">Join UnityNet Free</MagneticButton>
            <MagneticButton variant="secondary">Read More Stories</MagneticButton>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
