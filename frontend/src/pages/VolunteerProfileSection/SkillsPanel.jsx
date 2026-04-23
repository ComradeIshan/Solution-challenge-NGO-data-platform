import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

const SKILLS = [
  { label: "Teaching",         level: 95, accent: T.green,  icon: "📚" },
  { label: "Healthcare",       level: 72, accent: T.teal,   icon: "🏥" },
  { label: "Environment",      level: 88, accent: T.blue,   icon: "🌱" },
  { label: "Technology",       level: 91, accent: T.violet, icon: "💻" },
  { label: "Community Org.",   level: 78, accent: T.amber,  icon: "🤝" },
  { label: "Data Analysis",    level: 65, accent: T.rose,   icon: "📊" },
];

const MATCH_AREAS = [
  { label: "Education NGOs",      pct: 0.92, accent: T.green  },
  { label: "Tech for Good",       pct: 0.87, accent: T.blue   },
  { label: "Environmental Orgs",  pct: 0.81, accent: T.teal   },
  { label: "Health Initiatives",  pct: 0.68, accent: T.violet },
];

// ─── Skill tag chip ──────────────────────────────────────────────────────────────
function SkillTag({ skill, delay, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.35, delay, type: "spring", stiffness: 260 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        background: hov ? `${skill.accent}18` : `${skill.accent}0e`,
        border: `1px solid ${hov ? skill.accent + "45" : skill.accent + "20"}`,
        borderRadius: T.radiusPill,
        padding: "7px 14px",
        cursor: "default",
        boxShadow: hov ? `0 4px 16px ${skill.accent}25` : "none",
        transform: hov ? "translateY(-2px) scale(1.04)" : "none",
        transition: "all 0.25s ease",
      }}
    >
      <span style={{ fontSize: 15 }}>{skill.icon}</span>
      <span style={{
        fontFamily: T.font, fontSize: 13, fontWeight: 600,
        color: skill.accent,
      }}>{skill.label}</span>
      <span style={{
        fontFamily: T.font, fontSize: 10, fontWeight: 800,
        color: skill.accent, opacity: 0.7,
        background: `${skill.accent}15`, borderRadius: 99,
        padding: "1px 6px", marginLeft: 2,
      }}>{skill.level}%</span>
    </motion.div>
  );
}

// ─── Match strength bar ──────────────────────────────────────────────────────────
function MatchBar({ item, delay, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px",
        borderRadius: T.radiusSm,
        background: hov ? `${item.accent}08` : "transparent",
        transition: "background 0.2s",
        cursor: "default",
      }}
    >
      <span style={{
        fontFamily: T.font, fontSize: 12, fontWeight: 500,
        color: T.textSub, minWidth: 140, flexShrink: 0,
      }}>{item.label}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 99, background: `${item.accent}18`, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${item.pct * 100}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", borderRadius: 99, background: item.accent }}
        />
      </div>
      <span style={{
        fontFamily: T.font, fontSize: 13, fontWeight: 800,
        color: item.accent, minWidth: 36, textAlign: "right",
        letterSpacing: "-0.02em",
      }}>{Math.round(item.pct * 100)}%</span>
    </motion.div>
  );
}

export default function SkillsPanel() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: T.radiusXl,
        padding: "clamp(20px,3vw,28px)",
        boxShadow: T.shadowGlass,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
          Skills & Capabilities
        </span>
        <span style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 700,
          color: T.blue, background: T.blueLight,
          border: `1px solid ${T.blueMid}`,
          borderRadius: T.radiusPill, padding: "3px 10px", letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>AI Verified</span>
      </div>

      {/* Skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {SKILLS.map((s, i) => (
          <SkillTag key={s.label} skill={s} delay={0.08 + i * 0.07} inView={inView} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: T.border, marginBottom: 18 }} />

      {/* AI Match header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, flexShrink: 0 }}
        />
        <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text }}>
          AI Match Strength
        </span>
        <span style={{
          fontFamily: T.font, fontSize: 11, fontWeight: 400, color: T.textMuted,
        }}>— You are a strong fit for:</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {MATCH_AREAS.map((item, i) => (
          <MatchBar key={item.label} item={item} delay={0.1 + i * 0.08} inView={inView} />
        ))}
      </div>

      {/* Recommended badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.4 }}
        style={{
          marginTop: 16,
          background: `linear-gradient(135deg, ${T.greenLight}, ${T.blueLight})`,
          border: `1px solid ${T.greenMid}`,
          borderRadius: T.radius,
          padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>🤖</span>
        <div>
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.text }}>
            "You are a 92% match for Education NGOs"
          </div>
          <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 300, color: T.textSub, marginTop: 2 }}>
            Based on skills, hours, and past impact — updated daily
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
