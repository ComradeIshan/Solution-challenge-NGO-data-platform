import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import React from "react";

function useCountUp(target, duration = 1400, enabled = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = null;
    const go = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(+(ease * target).toFixed(1));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [enabled, target, duration]);
  return val;
}

const GRADIENT_BORDERS = [
  "linear-gradient(135deg, #22c55e, #14b8a6, #3b82f6)",
  "linear-gradient(135deg, #3b82f6, #8b5cf6, #14b8a6)",
  "linear-gradient(135deg, #f59e0b, #22c55e, #14b8a6)",
];

const GLOW_COLORS = [
  "rgba(34,197,94,0.18)",
  "rgba(59,130,246,0.18)",
  "rgba(245,158,11,0.15)",
];

export default function InsightCard({ card, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [hovered, setHovered] = useState(false);
  const pct = useCountUp(card.change, 1200, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 220, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      style={{ position: "relative", borderRadius: 24, padding: 2, cursor: "default" }}
    >
      {/* Animated gradient border */}
      <motion.div
        animate={{ backgroundPosition: hovered ? "200% center" : "0% center" }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, borderRadius: 24,
          background: GRADIENT_BORDERS[index],
          backgroundSize: "200% auto",
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.3s",
        }}
      />

      {/* Glow */}
      <motion.div
        animate={hovered ? { opacity: 1, scale: 1.05 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: -12, borderRadius: 32,
          background: GLOW_COLORS[index],
          filter: "blur(20px)",
          pointerEvents: "none", zIndex: -1,
        }}
      />

      {/* Card body */}
      <div style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 22,
        padding: "24px 22px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Shimmer sweep on hover */}
        <motion.div
          animate={hovered ? { x: ["−150%", "250%"] } : { x: "-150%" }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
            transform: "skewX(-12deg)",
            pointerEvents: "none",
          }}
        />

        {/* Top */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#94a3b8",
              fontFamily: "'DM Sans', system-ui",
              marginBottom: 4,
            }}>
              {card.category}
            </div>
            <h3 style={{
              fontSize: 15, fontWeight: 800, color: "#0f172a",
              margin: 0, fontFamily: "'DM Sans', system-ui",
              letterSpacing: "-0.01em", lineHeight: 1.3,
            }}>
              {card.title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
            style={{
              width: 42, height: 42, borderRadius: 13,
              background: `linear-gradient(135deg, ${card.iconBg[0]}, ${card.iconBg[1]})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
              boxShadow: `0 4px 16px ${card.iconBg[0]}40`,
            }}
          >
            {card.icon}
          </motion.div>
        </div>

        {/* Big change number */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 6,
          }}>
            <span style={{
              fontFamily: "'DM Sans', system-ui",
              fontSize: 40, fontWeight: 900, letterSpacing: "-0.04em",
              color: "#0f172a", lineHeight: 1,
            }}>
              {card.prefix}{inView ? pct.toFixed(1) : "0.0"}
            </span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              {card.suffix}
            </span>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.12 + 0.6 }}
              style={{
                fontSize: 12, fontWeight: 800,
                color: card.trend === "up" ? "#22c55e" : "#ef4444",
                background: card.trend === "up" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                borderRadius: 20, padding: "3px 8px",
                fontFamily: "'DM Sans', system-ui",
              }}
            >
              {card.trend === "up" ? "↑" : "↓"} {card.trendPct}
            </motion.span>
          </div>
          <p style={{
            fontSize: 12, color: "#64748b", marginTop: 4,
            fontFamily: "'DM Sans', system-ui",
          }}>
            {card.desc}
          </p>
        </div>

        {/* Sparkline */}
        <div style={{ height: 56, marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={card.sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={card.lineColor}
                strokeWidth={2}
                dot={false}
                animationDuration={1200}
                animationBegin={index * 120 + 300}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10, fontSize: 11,
                  fontFamily: "'DM Sans', system-ui",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
                itemStyle={{ color: card.lineColor, fontWeight: 700 }}
                labelStyle={{ display: "none" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {card.tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 10, fontWeight: 700, color: card.tagColor,
              background: `${card.tagColor}12`,
              borderRadius: 20, padding: "3px 9px",
              border: `1px solid ${card.tagColor}25`,
              fontFamily: "'DM Sans', system-ui",
              letterSpacing: "0.04em",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
