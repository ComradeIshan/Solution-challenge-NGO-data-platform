import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import React from "react";

function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, target, duration]);

  return { value, ref };
}

const STATS = [
  {
    label: "Total Sevaks", target: 12847,
    fmt: (n) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toString(),
    icon: "👥", accent: "#22c55e", glow: "rgba(34,197,94,0.15)",
    progress: 72, tag: "+12% this month", tagColor: "#22c55e",
    desc: "Active volunteers",
  },
  {
    label: "NGOs Registered", target: 348, fmt: (n) => n + "+",
    icon: "🏢", accent: "#3b82f6", glow: "rgba(59,130,246,0.15)",
    progress: 58, tag: "+8 new", tagColor: "#3b82f6",
    desc: "Verified partners",
  },
  {
    label: "Lives Impacted", target: 4800,
    fmt: (n) => (n / 1000).toFixed(1) + "M",
    icon: "❤️", accent: "#14b8a6", glow: "rgba(20,184,166,0.15)",
    progress: 84, tag: "+24% week", tagColor: "#14b8a6",
    desc: "People reached",
  },
  {
    label: "Match Rate", target: 94, fmt: (n) => n + "%",
    icon: "⚡", accent: "#f59e0b", glow: "rgba(245,158,11,0.15)",
    progress: 94, tag: "↑ 3pts", tagColor: "#f59e0b",
    desc: "Successful placements",
  },
];

function StatCard({ stat, index }) {
  const { value, ref } = useCountUp(stat.target, 1600 + index * 100);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 220, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -6,
        boxShadow: `0 24px 64px ${stat.glow}, 0 4px 20px rgba(0,0,0,0.07)`,
      }}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 24,
        padding: "28px 26px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "box-shadow 0.3s ease",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* Gradient top edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`,
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.3s",
      }} />

      {/* Shine sweep on hover */}
      <motion.div
        animate={hovered ? { x: ["−150%", "250%"] } : { x: "−150%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
          skewX: "-12deg", pointerEvents: "none",
        }}
      />

      {/* Background glow circle */}
      <motion.div
        animate={hovered ? { scale: 1.4, opacity: 1 } : { scale: 1, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", top: -40, right: -40,
          width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            style={{
              width: 46, height: 46, borderRadius: 14,
              background: `linear-gradient(135deg, ${stat.accent}22, ${stat.accent}10)`,
              border: `1px solid ${stat.accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}
          >
            {stat.icon}
          </motion.div>
          <div style={{
            background: `${stat.accent}12`,
            border: `1px solid ${stat.accent}25`,
            borderRadius: 20, padding: "3px 10px",
            fontSize: 11, fontWeight: 700, color: stat.accent,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {stat.tag}
          </div>
        </div>

        {/* Number */}
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 38, fontWeight: 900, color: "#0f172a",
          letterSpacing: "-0.04em", lineHeight: 1,
          marginBottom: 4,
        }}>
          {stat.fmt(value)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>
          {stat.label}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
          {stat.desc}
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 4, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stat.progress}%` }}
            transition={{ delay: index * 0.1 + 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: "100%", borderRadius: 4,
              background: `linear-gradient(90deg, ${stat.accent}, ${stat.accent}80)`,
            }}
          />
        </div>
        <div style={{
          fontSize: 10, color: "#94a3b8", marginTop: 6,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        }}>
          {stat.progress}% of annual goal
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsGrid() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      marginBottom: 24,
    }}>
      {STATS.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
    </div>
  );
}
