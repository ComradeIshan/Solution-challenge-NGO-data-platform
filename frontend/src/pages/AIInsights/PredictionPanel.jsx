import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import React from "react";

const FORECAST_DATA = [
  { d: "W1", v: 124 }, { d: "W2", v: 148 }, { d: "W3", v: 162 },
  { d: "W4", v: 189 }, { d: "W5", v: 214 }, { d: "W6", v: 238 },
  { d: "W7", v: 267 }, { d: "W8", v: 298 },
];

function useCountUp(target, duration = 1800, enabled = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = null;
    const go = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setV(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [enabled, target]);
  return v;
}

export default function PredictionPanel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useCountUp(287400, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.15 }}
      style={{ position: "relative" }}
    >
      {/* Breathing float */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative" }}
      >
        {/* Outer glow */}
        <div style={{
          position: "absolute", inset: -20,
          background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)",
          filter: "blur(20px)", borderRadius: 40,
          pointerEvents: "none",
        }} />

        <div style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(240,253,244,0.80))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: 28,
          padding: "28px 26px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(34,197,94,0.08)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Diagonal accent */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: 180, height: 180,
            background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
            borderRadius: "0 28px 0 0",
            pointerEvents: "none",
          }} />

          {/* AI indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: "absolute", width: 14, height: 14, borderRadius: "50%",
                  background: "#22c55e", opacity: 0.4,
                }}
              />
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "#22c55e", position: "relative", zIndex: 2,
                boxShadow: "0 0 8px rgba(34,197,94,0.6)",
              }} />
            </div>
            <span style={{
              fontSize: 11, fontWeight: 800, color: "#16a34a",
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "'DM Sans', system-ui",
            }}>
              Live AI Prediction
            </span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                fontSize: 10, color: "#94a3b8",
                fontFamily: "'DM Sans', system-ui",
                marginLeft: "auto",
              }}
            >
              Updating...
            </motion.div>
          </div>

          {/* Label */}
          <p style={{
            fontSize: 12, color: "#64748b", margin: "0 0 6px",
            fontFamily: "'DM Sans', system-ui", fontWeight: 500,
          }}>
            Expected Impact — Next 30 Days
          </p>

          {/* Big number */}
          <div style={{ marginBottom: 6 }}>
            <span style={{
              fontSize: 48, fontWeight: 900, color: "#0f172a",
              fontFamily: "'DM Sans', system-ui", letterSpacing: "-0.05em",
              lineHeight: 1,
            }}>
              {count.toLocaleString()}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 22,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: "#22c55e",
              background: "rgba(34,197,94,0.1)", borderRadius: 20,
              padding: "3px 10px", fontFamily: "'DM Sans', system-ui",
            }}>
              ↑ 34% vs last month
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', system-ui" }}>
              lives reached
            </span>
          </div>

          {/* Forecast chart */}
          <div style={{ height: 90, marginBottom: 18 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FORECAST_DATA}>
                <defs>
                  <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#94a3b8", fontFamily: "'DM Sans',system-ui" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)", border: "none",
                    borderRadius: 10, fontSize: 11, fontFamily: "'DM Sans',system-ui",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2.5}
                  fill="url(#predG)" dot={false}
                  activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Confidence */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans',system-ui" }}>
              Model confidence
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ height: 4, width: 100, borderRadius: 4, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: "87%" } : {}}
                  transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #22c55e, #14b8a6)" }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#22c55e", fontFamily: "'DM Sans',system-ui" }}>
                87%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
