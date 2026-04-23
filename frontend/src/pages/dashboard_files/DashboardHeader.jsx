import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

const SPARKLINE = [40, 55, 48, 70, 65, 82, 78, 95, 88, 110, 104, 124];

function Sparkline() {
  const max = Math.max(...SPARKLINE);
  const min = Math.min(...SPARKLINE);
  const w = 80, h = 28;
  const pts = SPARKLINE.map((v, i) => {
    const x = (i / (SPARKLINE.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke="url(#spk)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(SPARKLINE.length - 1) / (SPARKLINE.length - 1) * w}
        cy={h - ((SPARKLINE[SPARKLINE.length - 1] - min) / (max - min)) * h}
        r={3}
        fill="#22c55e"
      />
    </svg>
  );
}

export default function DashboardHeader() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 28, paddingBottom: 24,
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: brand + greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 3 }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #22c55e, #14b8a6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          ⚡
        </motion.div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: "#0f172a",
              margin: 0, letterSpacing: "-0.02em",
            }}>
              {greeting}, Arjun
            </h1>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, color: "#94a3b8", margin: 0,
          }}>
            Here's your impact for{" "}
            <span style={{ color: "#22c55e", fontWeight: 600 }}>
              {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </span>
          </p>
        </div>
      </div>

      {/* Center: sparkline */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 14,
          padding: "8px 16px",
          display: "flex", alignItems: "center", gap: 12,
          cursor: "default",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Weekly Growth
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
            +24% <span style={{ color: "#22c55e", fontSize: 11 }}>↑</span>
          </div>
        </div>
        <Sparkline />
      </motion.div>

      {/* Right: search + bell + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.07)",
            borderRadius: 30, padding: "8px 16px",
            cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <span style={{ fontSize: 13 }}>🔍</span>
          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
            Search anything...
          </span>
          <kbd style={{
            fontSize: 10, color: "#94a3b8", background: "rgba(0,0,0,0.05)",
            borderRadius: 4, padding: "1px 5px", fontFamily: "monospace",
          }}>⌘K</kbd>
        </motion.div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setNotifOpen(n => !n)}
          style={{
            position: "relative", width: 40, height: 40, borderRadius: 14,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          🔔
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: "absolute", top: 7, right: 7,
              width: 8, height: 8, borderRadius: "50%",
              background: "#ef4444", border: "2px solid white",
            }}
          />
        </motion.button>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          style={{
            width: 40, height: 40, borderRadius: 14,
            background: "linear-gradient(135deg, #22c55e, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          AS
        </motion.div>
      </div>
    </motion.div>
  );
}
