import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

// ─── Animated count-up ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1600, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);
  return val;
}

// ─── Rotating gradient border ring ──────────────────────────────────────────────
function GradientRing({ size = 110, active }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", inset: -4, borderRadius: "50%",
          background: `conic-gradient(${T.green}, ${T.teal}, ${T.blue}, ${T.violet}, ${T.green})`,
          padding: 3,
        }}
      >
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: T.surface,
        }} />
      </motion.div>

      {/* Glow behind avatar */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: -12, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.green}30, ${T.teal}15, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Avatar */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.green}, ${T.teal}, ${T.blue})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.font, fontSize: 36, fontWeight: 800,
        color: "#fff", letterSpacing: "-0.02em",
        border: "3px solid rgba(255,255,255,0.9)",
        boxShadow: `0 8px 24px ${T.green}40`,
      }}>
        AK
      </div>

      {/* Online dot */}
      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: "absolute", bottom: 4, right: 4,
          width: 16, height: 16, borderRadius: "50%",
          background: T.green, border: "3px solid white",
          boxShadow: `0 0 8px ${T.green}`,
        }}
      />
    </div>
  );
}

// ─── Impact score ring ───────────────────────────────────────────────────────────
function ScoreRing({ score = 940, max = 1000, active }) {
  const count = useCountUp(score, 1800, active);
  const pct   = score / max;
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const dash  = pct * circ;

  return (
    <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: "absolute", inset: 0 }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.greenMid} strokeWidth="6" />
        {/* Fill */}
        <motion.circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={`url(#scoreGrad)`}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={active ? { strokeDashoffset: circ - dash } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "44px 44px" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={T.green} />
            <stop offset="100%" stopColor={T.teal} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {count}
        </span>
        <span style={{ fontFamily: T.font, fontSize: 8, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Score
        </span>
      </div>
    </div>
  );
}

export default function ProfileHeroCard() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);
  const [hov, setHov] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glowBg = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(320px circle at ${x}px ${y}px, ${T.green}10, transparent 65%)`
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left); my.set(e.clientY - r.top);
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      animate2={{ y: hov ? -6 : 0 }}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hov ? T.green + "40" : "rgba(255,255,255,0.6)"}`,
        borderRadius: T.radiusXl,
        padding: "clamp(24px,3vw,36px)",
        boxShadow: hov ? T.shadowLg : T.shadowMd,
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Top gradient bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${T.green}, ${T.teal}, ${T.blue})`,
        borderRadius: `${T.radiusXl} ${T.radiusXl} 0 0`,
      }} />

      {/* Cursor glow */}
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: T.radiusXl,
        background: glowBg, pointerEvents: "none",
        opacity: hov ? 1 : 0, transition: "opacity 0.3s",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
        <GradientRing size={100} active={inView} />

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h2 style={{
              fontFamily: T.font, fontSize: "clamp(20px,2.5vw,26px)",
              fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.03em",
            }}>Arjun Kumar</h2>
            {/* Top 5% badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 260 }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: `linear-gradient(135deg, ${T.amber}22, ${T.amber}12)`,
                border: `1px solid ${T.amber}40`,
                borderRadius: T.radiusPill, padding: "3px 10px",
              }}
            >
              <span style={{ fontSize: 12 }}>🏆</span>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.amber, letterSpacing: "0.06em" }}>
                TOP 5% SEVAK
              </span>
            </motion.div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {[
              { icon: "🎓", text: "Community Volunteer" },
              { icon: "📍", text: "Bangalore, India" },
              { icon: "📅", text: "Joined Jan 2023" },
            ].map((item) => (
              <span key={item.text} style={{
                fontFamily: T.font, fontSize: 12, fontWeight: 400,
                color: T.textSub, display: "flex", alignItems: "center", gap: 4,
              }}>
                <span>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>

          {/* Sevak level bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.textMuted }}>
                Level 7 — Gold Sevak
              </span>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.green }}>
                2,840 / 3,000 XP
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: T.greenMid, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: "94.6%" } : {}}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: "100%", borderRadius: 99,
                  background: `linear-gradient(90deg, ${T.green}, ${T.teal})`,
                }}
              />
            </div>
          </div>
        </div>

        <ScoreRing score={940} active={inView} />
      </div>

      {/* Quick stats row */}
      <div style={{ display: "flex", gap: 0, background: T.surface, borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {[
          { label: "Hours", value: 284, suffix: "h", accent: T.green },
          { label: "Lives", value: 12400, suffix: "+", accent: T.teal },
          { label: "NGOs", value: 8, suffix: "", accent: T.blue },
          { label: "Tasks", value: 143, suffix: "", accent: T.violet },
        ].map((s, i) => {
          const count = useCountUp(s.value, 1600, inView);
          return (
            <div key={s.label} style={{
              flex: 1, textAlign: "center", padding: "14px 8px",
              borderRight: i < 3 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{
                fontFamily: T.font, fontSize: "clamp(16px,2vw,22px)",
                fontWeight: 800, color: s.accent,
                letterSpacing: "-0.04em", lineHeight: 1,
              }}>
                {count >= 1000 ? `${(count/1000).toFixed(1)}K` : count}{s.suffix}
              </div>
              <div style={{ fontFamily: T.font, fontSize: 10, fontWeight: 500, color: T.textMuted, marginTop: 3 }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
