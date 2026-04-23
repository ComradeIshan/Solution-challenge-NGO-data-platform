import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import React from "react";

const SUGGESTIONS = [
  {
    id: 1,
    text: "Deploy more volunteers in Delhi NCR",
    sub: "High demand detected — 340% above capacity",
    icon: "📍",
    priority: "urgent",
    pct: "+340%",
    action: "Take Action",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
  },
  {
    id: 2,
    text: "Education NGOs trending up 24%",
    sub: "3 new orgs onboarded — boost matching score",
    icon: "📈",
    priority: "high",
    pct: "+24%",
    action: "View NGOs",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.06)",
  },
  {
    id: 3,
    text: "Healthcare sector needs 120 volunteers",
    sub: "Weekend surge predicted — Bengaluru, Mumbai",
    icon: "🏥",
    priority: "medium",
    pct: "120 open",
    action: "Match Now",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.06)",
  },
  {
    id: 4,
    text: "Optimize rural outreach timing",
    sub: "AI detected 68% lower engagement on Mondays",
    icon: "🌾",
    priority: "low",
    pct: "−68%",
    action: "Reschedule",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
  },
];

const PRIORITY_LABELS = {
  urgent: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Urgent" },
  high: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "High" },
  medium: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "Medium" },
  low: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Low" },
};

function SuggestionItem({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const p = PRIORITY_LABELS[item.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 240, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 4 }}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 12px", borderRadius: 16,
        background: hovered ? item.bg : "transparent",
        cursor: "pointer",
        transition: "background 0.2s",
        position: "relative",
        borderLeft: `2px solid ${hovered ? item.color : "transparent"}`,
        paddingLeft: hovered ? 14 : 14,
      }}
    >
      {/* Icon */}
      <motion.div
        animate={hovered ? { rotate: [0, -8, 8, 0], scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 38, height: 38, borderRadius: 11,
          background: `${item.color}15`,
          border: `1px solid ${item.color}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, flexShrink: 0,
        }}
      >
        {item.icon}
      </motion.div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#0f172a",
          fontFamily: "'DM Sans', system-ui", lineHeight: 1.3, marginBottom: 2,
        }}>
          {item.text}
        </div>
        <div style={{
          fontSize: 11, color: "#94a3b8",
          fontFamily: "'DM Sans', system-ui", lineHeight: 1.4,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {item.sub}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: p.color,
          background: p.bg, borderRadius: 20, padding: "2px 8px",
          fontFamily: "'DM Sans', system-ui",
        }}>
          {p.label}
        </span>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          style={{
            fontSize: 10, fontWeight: 700, color: item.color,
            background: `${item.color}12`, border: `1px solid ${item.color}25`,
            borderRadius: 20, padding: "4px 10px", cursor: "pointer",
            fontFamily: "'DM Sans', system-ui",
            opacity: hovered ? 1 : 0.7,
            transition: "opacity 0.2s",
          }}
        >
          {item.action} →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SmartFeed() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 24,
        padding: "24px 22px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        height: "100%",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#94a3b8",
            fontFamily: "'DM Sans', system-ui", marginBottom: 3,
          }}>
            Smart Suggestions
          </p>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: "#0f172a",
            margin: 0, fontFamily: "'DM Sans', system-ui", letterSpacing: "-0.02em",
          }}>
            AI Recommendations
          </h3>
        </div>
        {/* Animated brain icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.15))",
            border: "1px solid rgba(34,197,94,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}
        >
          🧠
        </motion.div>
      </div>

      {/* Model tag */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(20,184,166,0.06))",
        border: "1px solid rgba(34,197,94,0.12)",
        borderRadius: 12, padding: "8px 12px", marginBottom: 18,
      }}>
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}
        />
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#16a34a",
          fontFamily: "'DM Sans', system-ui",
        }}>
          Sevaks AI · Powered by real-time NGO + volunteer data
        </span>
      </div>

      {/* Items */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {inView && SUGGESTIONS.map((item, i) => (
          <SuggestionItem key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 16, paddingTop: 14,
        borderTop: "1px solid rgba(0,0,0,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', system-ui" }}>
          Updated 2 min ago
        </span>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(34,197,94,0.2)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontSize: 11, fontWeight: 700, color: "#16a34a",
            background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 20, padding: "6px 14px", cursor: "pointer",
            fontFamily: "'DM Sans', system-ui",
          }}
        >
          Refresh insights →
        </motion.button>
      </div>
    </motion.div>
  );
}
