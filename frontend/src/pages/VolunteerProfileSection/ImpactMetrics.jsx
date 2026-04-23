import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

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

// ─── Circular progress ring ──────────────────────────────────────────────────────
function ProgressRing({ pct, accent, size = 72, strokeW = 6, children }) {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);
  const r    = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const cx   = size / 2, cy = size / 2;

  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${accent}20`} strokeWidth={strokeW} />
        <motion.circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={accent} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ - pct * circ } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{children}</div>
    </div>
  );
}

// ─── Single metric card ──────────────────────────────────────────────────────────
function MetricCard({ label, value, suffix, pct, accent, accentLight, icon, delay, description }) {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);
  const count  = useCountUp(value, 1600, inView);
  const [hov, setHov] = useState(false);

  const display = value >= 10000
    ? `${(count / 1000).toFixed(1)}K`
    : value >= 1000
    ? `${(count / 1000).toFixed(1)}K`
    : String(count);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.glass,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${hov ? accent + "35" : "rgba(255,255,255,0.6)"}`,
        borderRadius: T.radius,
        padding: "20px",
        boxShadow: hov ? T.shadowLg : T.shadowGlass,
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        display: "flex", flexDirection: "column", gap: 14,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Side accent bar */}
      <div style={{
        position: "absolute", left: 0, top: "20%", bottom: "20%",
        width: 3, borderRadius: "0 3px 3px 0",
        background: accent,
        opacity: hov ? 1 : 0.4,
        transition: "opacity 0.3s",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing pct={pct} accent={accent} size={68} strokeW={5}>
          <span style={{ fontSize: 22 }}>{icon}</span>
        </ProgressRing>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: T.font, fontSize: "clamp(22px,2.5vw,28px)",
            fontWeight: 800, color: T.text, letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            {display}{suffix}
          </div>
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.textMuted, marginTop: 3 }}>
            {label}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 400, color: T.textMuted }}>{description}</span>
          <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: accent }}>
            {Math.round(pct * 100)}%
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: `${accent}18`, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${pct * 100}%` } : {}}
            transition={{ duration: 1.3, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: 99, background: accent }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function ImpactMetrics() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  const METRICS = [
    { label: "Hours Contributed", value: 284,   suffix: "h",  pct: 0.71, accent: T.green,  accentLight: T.greenLight, icon: "⏱️", description: "vs. 400h annual goal", delay: 0.10 },
    { label: "Lives Impacted",    value: 12400, suffix: "+",  pct: 0.83, accent: T.teal,   accentLight: T.tealLight,  icon: "🌍", description: "Verified community reach",  delay: 0.18 },
    { label: "NGOs Worked With",  value: 8,     suffix: "",   pct: 0.53, accent: T.blue,   accentLight: T.blueLight,  icon: "🏛️", description: "Across 3 sectors",     delay: 0.26 },
    { label: "Tasks Completed",   value: 143,   suffix: "",   pct: 0.92, accent: T.violet, accentLight: T.violetLight,icon: "✅", description: "98.6% on-time rate",  delay: 0.34 },
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}
      >
        <span style={{ fontFamily: T.font, fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
          Personal Impact
        </span>
        <div style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 700,
          color: T.green, background: T.greenLight,
          border: `1px solid ${T.greenMid}`,
          borderRadius: T.radiusPill, padding: "2px 8px",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>Live</div>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,240px), 1fr))",
        gap: 12,
      }}>
        {METRICS.map(m => <MetricCard key={m.label} {...m} />)}
      </div>
    </div>
  );
}
