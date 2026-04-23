import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import InsightCard from "./InsightCard";
import HeatmapGrid from "./HeatmapGrid";
import PredictionPanel from "./PredictionPanel";
import SmartFeed from "./SmartFeed";
import React from "react";

const INSIGHT_CARDS = [
  {
    category: "AI Forecast",
    title: "Volunteer Demand Forecast",
    change: 38.4,
    prefix: "",
    suffix: "%",
    trend: "up",
    trendPct: "12.3%",
    desc: "Projected demand surge next 4 weeks across tier-1 cities",
    icon: "🔮",
    iconBg: ["#22c55e", "#14b8a6"],
    lineColor: "#22c55e",
    tagColor: "#16a34a",
    tags: ["Q3 2024", "Delhi +45%", "High confidence"],
    sparkData: [
      { v: 22 }, { v: 28 }, { v: 25 }, { v: 34 }, { v: 30 },
      { v: 38 }, { v: 35 }, { v: 42 }, { v: 40 }, { v: 48 },
    ],
  },
  {
    category: "Predictive Model",
    title: "NGO Growth Prediction",
    change: 127,
    prefix: "+",
    suffix: "",
    trend: "up",
    trendPct: "24.1%",
    desc: "New NGOs expected to register by end of quarter",
    icon: "📊",
    iconBg: ["#3b82f6", "#8b5cf6"],
    lineColor: "#3b82f6",
    tagColor: "#2563eb",
    tags: ["Education ↑", "Healthcare ↑", "Rural"],
    sparkData: [
      { v: 60 }, { v: 72 }, { v: 68 }, { v: 84 }, { v: 90 },
      { v: 88 }, { v: 98 }, { v: 106 }, { v: 112 }, { v: 127 },
    ],
  },
  {
    category: "Trend Analysis",
    title: "Impact Trend Analysis",
    change: 4.8,
    prefix: "",
    suffix: "M",
    trend: "up",
    trendPct: "34.2%",
    desc: "Compounded lives impacted — 30-day rolling average",
    icon: "🌱",
    iconBg: ["#f59e0b", "#22c55e"],
    lineColor: "#f59e0b",
    tagColor: "#d97706",
    tags: ["Trending up", "All regions", "Accelerating"],
    sparkData: [
      { v: 2.1 }, { v: 2.4 }, { v: 2.9 }, { v: 3.2 }, { v: 3.6 },
      { v: 3.9 }, { v: 4.1 }, { v: 4.4 }, { v: 4.6 }, { v: 4.8 },
    ],
  },
];

export default function AIInsightsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} style={{ marginBottom: 40 }}>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{ marginBottom: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            {/* Animated AI badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #22c55e, #14b8a6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
              }}
            >
              🧠
            </motion.div>
            <div>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#94a3b8",
                fontFamily: "'DM Sans', system-ui", margin: 0,
              }}>
                Powered by Sevaks AI
              </p>
            </div>
            {/* Live badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 20, padding: "3px 10px",
            }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}
              />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", fontFamily: "'DM Sans', system-ui" }}>
                Real-time
              </span>
            </div>
          </div>
          <h2 style={{
            fontSize: 32, fontWeight: 900, color: "#0f172a",
            margin: 0, letterSpacing: "-0.03em",
            fontFamily: "'DM Sans', system-ui",
          }}>
            AI Insights & Predictive Analytics
          </h2>
          <p style={{
            fontSize: 14, color: "#64748b", margin: "6px 0 0",
            fontFamily: "'DM Sans', system-ui",
          }}>
            Machine learning models trained on 18 months of volunteer + NGO data
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(34,197,94,0.25)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff", border: "none", borderRadius: 30,
            padding: "11px 22px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', system-ui",
            boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 4,
          }}
        >
          🔮 Full AI Report
        </motion.button>
      </motion.div>

      {/* AI Insight Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 20,
      }}>
        {INSIGHT_CARDS.map((card, i) => (
          <InsightCard key={i} card={card} index={i} />
        ))}
      </div>

      {/* Heatmap — full width */}
      <div style={{ marginBottom: 20 }}>
        <HeatmapGrid />
      </div>

      {/* Bottom: Prediction Panel + Smart Feed (65/35 split) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: 16,
        alignItems: "start",
      }}>
        <PredictionPanel />
        <SmartFeed />
      </div>
    </section>
  );
}
