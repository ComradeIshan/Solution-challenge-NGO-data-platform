import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

const OPPS = [
  {
    ngo: "ChildFirst Foundation",
    task: "After-school tutoring for underprivileged students in Grade 5–8. Make a direct impact every weekend.",
    location: "Delhi NCR",
    tag: "Education",
    color: "#22c55e",
    icon: "📚",
    urgency: "Urgent",
    slots: 12,
  },
  {
    ngo: "GreenEarth Alliance",
    task: "Urban plantation drive & community awareness. Help restore green cover in metro areas.",
    location: "Bangalore",
    tag: "Environment",
    color: "#14b8a6",
    icon: "🌱",
    urgency: "Open",
    slots: 24,
  },
  {
    ngo: "FoodForAll Trust",
    task: "Weekend meal distribution & kitchen volunteering. Fight hunger one meal at a time.",
    location: "Mumbai",
    tag: "Food Security",
    color: "#3b82f6",
    icon: "🍱",
    urgency: "Filling",
    slots: 6,
  },
];

function MagneticButton({ children, color, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 10);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        x: sx, y: sy,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: "#fff", border: "none", borderRadius: 30,
        padding: "9px 20px",
        fontSize: 12, fontWeight: 700, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: `0 4px 16px ${color}30`,
        display: "flex", alignItems: "center", gap: 6,
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

function OppCard({ opp, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, boxShadow: `0 24px 60px ${opp.color}15, 0 4px 20px rgba(0,0,0,0.07)` }}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 24,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        cursor: "default",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Left accent bar */}
      <motion.div
        animate={{ height: hovered ? "100%" : "40%", opacity: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute", left: 0, top: 0,
          width: 3,
          background: `linear-gradient(180deg, ${opp.color}, ${opp.color}30)`,
          borderRadius: "0 2px 2px 0",
        }}
      />

      {/* Background glow */}
      <motion.div
        animate={hovered ? { opacity: 1, scale: 1.2 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", top: -30, right: -30,
          width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle, ${opp.color}12 0%, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${opp.color}15`, border: `1px solid ${opp.color}25`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>
              {opp.icon}
            </div>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: opp.color,
                background: `${opp.color}12`, borderRadius: 20, padding: "2px 8px",
                border: `1px solid ${opp.color}20`,
                fontFamily: "'DM Sans', sans-serif",
                display: "inline-block", marginBottom: 3,
              }}>
                {opp.tag}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                📍 {opp.location}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: opp.urgency === "Urgent" ? "#ef4444" : opp.urgency === "Filling" ? "#f59e0b" : "#94a3b8",
            background: opp.urgency === "Urgent" ? "rgba(239,68,68,0.08)" : opp.urgency === "Filling" ? "rgba(245,158,11,0.08)" : "rgba(0,0,0,0.04)",
            borderRadius: 20, padding: "4px 10px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {opp.urgency}
          </div>
        </div>

        <h4 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 17, fontWeight: 700, color: "#0f172a",
          margin: "0 0 8px", lineHeight: 1.3,
        }}>
          {opp.ngo}
        </h4>
        <p style={{
          fontSize: 12, color: "#475569", margin: "0 0 20px",
          lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif",
        }}>
          {opp.task}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <MagneticButton color={opp.color}>
            Apply Now →
          </MagneticButton>
          <div style={{
            fontSize: 11, color: "#94a3b8",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}>
            {opp.slots} spots left
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OpportunitiesGrid() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}
      >
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#94a3b8", marginBottom: 4,
          }}>
            Matched For You
          </p>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 28, fontWeight: 700, color: "#0f172a",
            margin: 0, letterSpacing: "-0.03em",
          }}>
            Open Opportunities
          </h2>
        </div>
        <MagneticButton color="#22c55e" style={{ marginBottom: 4 }}>
          + Explore All
        </MagneticButton>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {OPPS.map((opp, i) => <OppCard key={i} opp={opp} index={i} />)}
      </div>
    </div>
  );
}
