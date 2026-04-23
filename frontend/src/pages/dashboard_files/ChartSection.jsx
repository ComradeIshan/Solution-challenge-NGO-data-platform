import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import React from "react";

const areaData = [
  { month: "Jan", impact: 12, sevaks: 340, ngos: 28 },
  { month: "Feb", impact: 19, sevaks: 520, ngos: 35 },
  { month: "Mar", impact: 28, sevaks: 680, ngos: 42 },
  { month: "Apr", impact: 38, sevaks: 890, ngos: 55 },
  { month: "May", impact: 52, sevaks: 1120, ngos: 68 },
  { month: "Jun", impact: 71, sevaks: 1450, ngos: 82 },
  { month: "Jul", impact: 95, sevaks: 1780, ngos: 96 },
  { month: "Aug", impact: 124, sevaks: 2200, ngos: 115 },
];

const barData = [
  { name: "ChildFirst", tasks: 84, matched: 71 },
  { name: "GreenEarth", tasks: 63, matched: 55 },
  { name: "FoodForAll", tasks: 97, matched: 88 },
  { name: "EduReach", tasks: 52, matched: 47 },
  { name: "HealthBridge", tasks: 76, matched: 64 },
];

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: "12px 16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        fontFamily: "'DM Sans', sans-serif",
        minWidth: 140,
      }}
    >
      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#475569" }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginLeft: "auto" }}>
            {typeof p.value === "number" && p.value > 100 ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#94a3b8",
      marginBottom: 4,
    }}>{children}</p>
  );
}

const TABS = ["Impact (K)", "Sevaks", "NGOs"];

export default function ChartSection() {
  const [activeTab, setActiveTab] = useState(0);

  const areaKey = ["impact", "sevaks", "ngos"][activeTab];
  const areaColor = ["#22c55e", "#3b82f6", "#14b8a6"][activeTab];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* AREA CHART — full width */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 22 }}
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 24,
          padding: "28px 28px 20px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <SectionLabel>Growth Trajectory</SectionLabel>
            <h3 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: "#0f172a",
              margin: 0, letterSpacing: "-0.02em",
            }}>Impact Over Time</h3>
          </div>
          {/* Tab switcher */}
          <div style={{
            display: "flex", gap: 4,
            background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: 4,
          }}>
            {TABS.map((t, i) => (
              <motion.button
                key={t}
                onClick={() => setActiveTab(i)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                  background: activeTab === i ? "#fff" : "transparent",
                  color: activeTab === i ? "#0f172a" : "#94a3b8",
                  boxShadow: activeTab === i ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={areaData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColor} stopOpacity={0.28} />
                <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<GlassTooltip />} />
            <Area
              key={areaKey}
              type="monotone"
              dataKey={areaKey}
              name={TABS[activeTab]}
              stroke={areaColor}
              strokeWidth={2.5}
              fill="url(#grad1)"
              dot={false}
              activeDot={{ r: 6, fill: areaColor, stroke: "#fff", strokeWidth: 2 }}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* BAR CHART */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 200, damping: 22 }}
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 24,
          padding: "28px 28px 20px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <SectionLabel>NGO Performance</SectionLabel>
          <h3 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: "#0f172a",
            margin: 0, letterSpacing: "-0.02em",
          }}>Tasks vs. Matched Volunteers</h3>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={barData} barCategoryGap="30%" margin={{ left: -20 }}>
            <defs>
              <linearGradient id="barG1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="barG2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" stopOpacity={1} />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
            <Tooltip content={<GlassTooltip />} />
            <Bar dataKey="tasks" name="Tasks" fill="url(#barG2)" radius={[6, 6, 0, 0]} animationDuration={1000} />
            <Bar dataKey="matched" name="Matched" fill="url(#barG1)" radius={[6, 6, 0, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
          {[["#e2e8f0", "Tasks Posted"], ["#22c55e", "Matched"]].map(([c, l], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
              {l}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
