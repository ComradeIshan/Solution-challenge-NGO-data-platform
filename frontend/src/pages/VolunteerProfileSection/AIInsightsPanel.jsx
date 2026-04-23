import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

const INSIGHTS = [
  {
    id: 0,
    icon: "📅",
    headline: "Peak Performance: Weekends",
    body: "You complete 73% more tasks on Saturday–Sunday. We've pre-scheduled your next 3 matches accordingly.",
    accent: T.green,
    accentLight: T.greenLight,
  },
  {
    id: 1,
    icon: "🎓",
    headline: "Strongest Area: Education",
    body: "Your teaching sessions average 4.9★. You are in the top 3% of education volunteers nationally.",
    accent: T.blue,
    accentLight: T.blueLight,
  },
  {
    id: 2,
    icon: "📈",
    headline: "Impact Trajectory: +38% MoM",
    body: "Your monthly impact score has grown 38% over the last 3 months. You are on track for Platinum tier by April.",
    accent: T.teal,
    accentLight: T.tealLight,
  },
];

const RECOMMENDED_NGOS = [
  { name: "Shiksha Foundation",   match: 96, sector: "Education",      icon: "📚", accent: T.green  },
  { name: "Tech4Good India",      match: 91, sector: "Technology",     icon: "💻", accent: T.blue   },
  { name: "GreenEarth Network",   match: 84, sector: "Environment",    icon: "🌱", accent: T.teal   },
];

// ─── Typewriter effect ──────────────────────────────────────────────────────────
function Typewriter({ text, active, speed = 28 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [active, text]);
  return <span>{displayed}<span style={{ opacity: displayed.length < text.length ? 1 : 0, transition: "opacity 0.3s" }}>|</span></span>;
}

// ─── Insight card ────────────────────────────────────────────────────────────────
function InsightCard({ insight, delay, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: 12, alignItems: "flex-start",
        padding: "14px 16px",
        background: hov ? `${insight.accent}08` : "transparent",
        borderRadius: T.radiusSm,
        border: `1px solid ${hov ? insight.accent + "25" : "transparent"}`,
        transition: "all 0.25s ease", cursor: "default",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: insight.accentLight,
        border: `1px solid ${insight.accent}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, flexShrink: 0,
      }}>{insight.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: insight.accent, marginBottom: 3 }}>
          {insight.headline}
        </div>
        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 300, color: T.textSub, lineHeight: 1.65 }}>
          {inView ? <Typewriter text={insight.body} active={inView} speed={20 + delay * 10} /> : ""}
        </div>
      </div>
    </motion.div>
  );
}

// ─── NGO recommendation row ──────────────────────────────────────────────────────
function NGORow({ ngo, delay, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px", borderRadius: T.radiusSm,
        background: hov ? `${ngo.accent}08` : "transparent",
        border: `1px solid ${hov ? ngo.accent + "25" : "transparent"}`,
        cursor: "pointer", transition: "all 0.22s ease",
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${ngo.accent}18`, border: `1px solid ${ngo.accent}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>{ngo.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.text }}>{ngo.name}</div>
        <div style={{ fontFamily: T.font, fontSize: 10, fontWeight: 400, color: T.textMuted }}>{ngo.sector}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 48, height: 4, borderRadius: 99, background: `${ngo.accent}20`, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${ngo.match}%` } : {}}
            transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: 99, background: ngo.accent }}
          />
        </div>
        <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 800, color: ngo.accent, minWidth: 28 }}>
          {ngo.match}%
        </span>
      </div>
    </motion.div>
  );
}

export default function AIInsightsPanel() {
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
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top gradient accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${T.green}, ${T.teal}, ${T.blue}, ${T.violet})`,
      }} />

      {/* Ambient glow */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.green}15, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `linear-gradient(135deg, ${T.green}25, ${T.blue}15)`,
          border: `1px solid ${T.green}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0,
        }}>🤖</div>
        <div>
          <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
            AI Profile Insights
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, flexShrink: 0 }}
            />
            <span style={{ fontFamily: T.font, fontSize: 10, fontWeight: 500, color: T.textMuted }}>
              Analyzing your profile · Updated 3 min ago
            </span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
        {INSIGHTS.map((ins, i) => (
          <InsightCard key={ins.id} insight={ins} delay={0.12 + i * 0.14} inView={inView} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: T.border, marginBottom: 16 }} />

      {/* Recommended NGOs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.text }}>
          Recommended for You
        </span>
        <span style={{
          fontFamily: T.font, fontSize: 9, fontWeight: 700,
          color: T.violet, background: T.violetLight,
          border: `1px solid ${T.violet}25`,
          borderRadius: T.radiusPill, padding: "1px 7px",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>AI Pick</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {RECOMMENDED_NGOS.map((ngo, i) => (
          <NGORow key={ngo.name} ngo={ngo} delay={0.5 + i * 0.1} inView={inView} />
        ))}
      </div>
    </motion.div>
  );
}
