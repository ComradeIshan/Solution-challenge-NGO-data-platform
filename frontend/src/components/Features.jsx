import React, { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const T = {
  bg:          "#f8fafc",
  white:       "#ffffff",
  text:        "#0f172a",
  textMid:     "#475569",
  textLight:   "#94a3b8",
  border:      "rgba(15,23,42,0.07)",
  borderMid:   "rgba(15,23,42,0.11)",
  green:       "#22c55e",
  greenDark:   "#16a34a",
  greenSoft:   "rgba(34,197,94,0.08)",
  greenLight:  "rgba(34,197,94,0.10)",
  blue:        "#3b82f6",
  blueSoft:    "rgba(59,130,246,0.08)",
  teal:        "#14b8a6",
  tealSoft:    "rgba(20,184,166,0.08)",
  amber:       "#f59e0b",
  amberSoft:   "rgba(245,158,11,0.09)",
  violet:      "#8b5cf6",
  violetSoft:  "rgba(139,92,246,0.08)",
  shadowSm:    "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:    "0 4px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)",
  shadowLg:    "0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
  ease:        [0.22, 1, 0.36, 1],
  font:        "'Inter', system-ui, -apple-system, sans-serif",
};

/* ── Tag color map ───────────────────────────────────────────────────────── */
const TAG_COLORS = {
  AI:         { text: T.blue,      bg: T.blueSoft,   border: "rgba(59,130,246,0.2)"  },
  Trust:      { text: T.green,     bg: T.greenLight,  border: "rgba(34,197,94,0.2)"  },
  Insights:   { text: T.teal,      bg: T.tealSoft,    border: "rgba(20,184,166,0.2)" },
  Automation: { text: T.amber,     bg: T.amberSoft,   border: "rgba(245,158,11,0.2)" },
  Network:    { text: T.violet,    bg: T.violetSoft,  border: "rgba(139,92,246,0.2)" },
  Matching:   { text: T.greenDark, bg: T.greenSoft,   border: "rgba(34,197,94,0.18)" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE DATA
═══════════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    id: "ai-engine",
    icon: "🧠",
    title: "AI Matching Engine",
    desc: "Smart algorithms connect the right people to the right causes instantly.",
    tag: "AI",
    accentColor: T.blue,
    accentSoft: T.blueSoft,
    featured: true,
    stat: { value: "97%", label: "match accuracy" },
  },
  {
    id: "verified",
    icon: "🔍",
    title: "Verified Profiles",
    desc: "Every volunteer and NGO is verified for credibility and real-world impact.",
    tag: "Trust",
    accentColor: T.green,
    accentSoft: T.greenLight,
  },
  {
    id: "tracking",
    icon: "📊",
    title: "Real-Time Impact Tracking",
    desc: "Track hours, outcomes, and measurable change as it happens.",
    tag: "Insights",
    accentColor: T.teal,
    accentSoft: T.tealSoft,
  },
  {
    id: "coordination",
    icon: "⚡",
    title: "Smart Coordination",
    desc: "Scheduling, onboarding, and reminders handled automatically.",
    tag: "Automation",
    accentColor: T.amber,
    accentSoft: T.amberSoft,
  },
  {
    id: "global",
    icon: "🌍",
    title: "Global Access",
    desc: "Collaborate with people and organizations across 190+ countries.",
    tag: "Network",
    accentColor: T.violet,
    accentSoft: T.violetSoft,
  },
  {
    id: "skills",
    icon: "🎯",
    title: "Skill-Based Opportunities",
    desc: "Find and post opportunities aligned with your exact expertise.",
    tag: "Matching",
    accentColor: T.greenDark,
    accentSoft: T.greenSoft,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE CARD
═══════════════════════════════════════════════════════════════════════════ */
function FeatureCard({ feature, index, inView }) {
  const [hovered,   setHovered]   = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const tagStyle = TAG_COLORS[feature.tag] || TAG_COLORS.AI;

  /* radial glow follows cursor */
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const isFeatured = feature.featured;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay: 0.08 + index * 0.075, ease: T.ease }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={isFeatured ? "feat-featured-wrap" : ""}
      style={{
        gridColumn: isFeatured ? "span 2" : "span 1",
        position: "relative",
        perspective: 900,
      }}
    >
      <motion.div
        animate={{
          y: hovered ? -6 : 0,
          rotateX: hovered && !isFeatured ? -1.5 : 0,
          rotateY: hovered && !isFeatured ? 1.5 : 0,
          boxShadow: hovered ? T.shadowLg : T.shadowMd,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        style={{
          background: T.white,
          border: `1px solid ${hovered ? feature.accentColor + "44" : T.border}`,
          borderRadius: isFeatured ? 24 : 20,
          padding: isFeatured ? "28px 32px" : "22px 22px",
          position: "relative",
          overflow: "hidden",
          cursor: "default",
          height: "100%",
          display: "flex",
          flexDirection: isFeatured ? "row" : "column",
          gap: isFeatured ? 32 : 0,
          alignItems: isFeatured ? "center" : "flex-start",
          transition: "border-color 0.25s ease",
        }}
        className={isFeatured ? "feat-featured" : ""}
      >
        {/* cursor radial glow */}
        {hovered && (
          <div style={{
            position: "absolute",
            pointerEvents: "none",
            width: 280, height: 280,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${feature.accentSoft} 0%, transparent 70%)`,
            left: cursorPos.x - 140,
            top:  cursorPos.y - 140,
            opacity: 0.85,
            transition: "none",
          }} />
        )}

        {/* featured: gradient border top */}
        {isFeatured && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${T.green}, ${T.blue})`,
            opacity: hovered ? 1 : 0.6,
            transition: "opacity 0.3s ease",
            borderRadius: "24px 24px 0 0",
          }} />
        )}

        {/* ── LEFT/MAIN content ────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          {/* icon */}
          <motion.div
            animate={{
              scale:  hovered ? 1.12 : 1,
              rotate: hovered ? (isFeatured ? 0 : 6) : 0,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: isFeatured ? 56 : 46,
              height: isFeatured ? 56 : 46,
              borderRadius: isFeatured ? 16 : 13,
              background: feature.accentSoft,
              border: `1px solid ${feature.accentColor}22`,
              fontSize: isFeatured ? 26 : 22,
              marginBottom: isFeatured ? 0 : 16,
              marginRight: isFeatured ? 20 : 0,
              flexShrink: 0,
            }}
          >
            {feature.icon}
          </motion.div>

          {/* title + desc (for featured: inline after icon) */}
          {isFeatured && (
            <div style={{ display: "inline-block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: T.text,
                  margin: 0, letterSpacing: "-0.025em" }}>
                  {feature.title}
                </h3>
                <TagBadge tag={feature.tag} hovered={hovered} />
              </div>
              <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.6,
                margin: 0, maxWidth: 360 }}>
                {feature.desc}
              </p>
            </div>
          )}

          {/* non-featured */}
          {!isFeatured && (
            <>
              <div style={{ display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 10 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: T.text,
                  margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  {feature.title}
                </h3>
                <TagBadge tag={feature.tag} hovered={hovered} />
              </div>
              <p style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.6,
                margin: 0 }}>
                {feature.desc}
              </p>
            </>
          )}
        </div>

        {/* ── FEATURED: right stat block ──────────────────────────── */}
        {isFeatured && feature.stat && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.38, ease: T.ease }}
            style={{
              flexShrink: 0,
              textAlign: "center",
              padding: "20px 32px",
              background: `linear-gradient(145deg, ${T.greenLight}, ${T.blueSoft})`,
              borderRadius: 16,
              border: `1px solid rgba(34,197,94,0.15)`,
              position: "relative", zIndex: 1,
            }}
          >
            <motion.div
              animate={hovered
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                fontSize: 42, fontWeight: 800,
                background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              {feature.stat.value}
            </motion.div>
            <div style={{ fontSize: 12, color: T.textMid,
              marginTop: 5, fontWeight: 500, letterSpacing: "0.01em" }}>
              {feature.stat.label}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAG BADGE
═══════════════════════════════════════════════════════════════════════════ */
function TagBadge({ tag, hovered }) {
  const s = TAG_COLORS[tag] || TAG_COLORS.AI;
  return (
    <motion.span
      animate={{ opacity: hovered ? 1 : 0.7 }}
      transition={{ duration: 0.2 }}
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: s.text,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 20,
        padding: "3px 9px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {tag}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-72px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        width: "100%",
        background: T.bg,
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
        fontFamily: T.font,
      }}
    >
      {/* ── ambient backgrounds ──────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(15,23,42,0.044) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute",
        width: 560, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
        top: "5%", right: "-8%", pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute",
        width: 500, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        bottom: "8%", left: "-6%", pointerEvents: "none",
      }} />

      {/* ── inner container ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.52, ease: T.ease }}
          style={{ textAlign: "center", marginBottom: 68 }}
        >
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.38, delay: 0.1, ease: T.ease }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 12, fontWeight: 600, color: T.greenDark,
              background: T.greenLight, border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 20, padding: "5px 14px", marginBottom: 22,
              letterSpacing: "0.02em",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.45, 1], opacity: [1, 0.45, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              style={{
                display: "inline-block", width: 7, height: 7,
                borderRadius: "50%", background: T.green,
              }}
            />
            Core Features
          </motion.div>

          {/* headline */}
          <h2 style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            color: T.text,
            lineHeight: 1.18,
            letterSpacing: "-0.03em",
            margin: "0 0 18px",
          }}>
            Everything you need to create{" "}
            <span style={{
              background: `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              real impact
            </span>
          </h2>

          {/* subtext */}
          <p style={{
            fontSize: 17, color: T.textMid, lineHeight: 1.65,
            maxWidth: 520, margin: "0 auto",
          }}>
            From discovery to measurable outcomes, UnityNet gives you the tools
            to move faster and smarter.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="feat-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 60,
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.5, ease: T.ease }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 14, flexWrap: "wrap",
          }}
        >
          <motion.a
            href="#"
            whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(34,197,94,0.34)" }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "12px 26px", fontSize: 15, fontWeight: 600,
              color: "#fff",
              background: `linear-gradient(135deg, ${T.green} 0%, ${T.greenDark} 100%)`,
              border: "1px solid rgba(22,163,74,0.25)",
              borderRadius: 11, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(34,197,94,0.28)",
              letterSpacing: "-0.01em",
            }}
          >
            Explore all features
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
            >→</motion.span>
          </motion.a>

          <motion.a
            href="#how"
            whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.09)",
              borderColor: "rgba(15,23,42,0.18)" }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "12px 22px", fontSize: 15, fontWeight: 500,
              color: T.textMid, background: T.white,
              border: `1px solid ${T.borderMid}`,
              borderRadius: 11, textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
              letterSpacing: "-0.01em",
            }}
          >
            See how it works
          </motion.a>
        </motion.div>
      </div>

      {/* responsive grid override */}
      <style>{`
        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .feat-featured-wrap { grid-column: span 1 !important; }
          .feat-featured { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
