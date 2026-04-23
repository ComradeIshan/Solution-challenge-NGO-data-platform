import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import React from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  green: "#22c55e",
  teal: "#14b8a6",
  blue: "#3b82f6",
  accent: "#f59e0b",
  purple: "#8b5cf6",
  bg: "linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%)",
  glass: "rgba(255,255,255,0.72)",
  glassBorder: "1px solid rgba(255,255,255,0.9)",
  shadow: "0 20px 60px rgba(0,0,0,0.10)",
  shadowHover: "0 32px 80px rgba(0,0,0,0.18)",
  radius: 24,
  radiusSm: 16,
};

const glassCard = {
  background: T.glass,
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: T.glassBorder,
  borderRadius: T.radius,
  boxShadow: T.shadow,
};

// ─── ANIMATED COUNT-UP ────────────────────────────────────────────────────────
function CountUp({ target, duration = 1800, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── PULSE DOT ────────────────────────────────────────────────────────────────
function PulseDot({ color = T.green, size = 10 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <motion.span
        animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: color, opacity: 0.4 }}
      />
      <span style={{ width: size * 0.7, height: size * 0.7, borderRadius: "50%", background: color, display: "block" }} />
    </span>
  );
}

// ─── SHIMMER OVERLAY ──────────────────────────────────────────────────────────
function Shimmer() {
  return (
    <motion.div
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      style={{
        position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
        pointerEvents: "none", borderRadius: "inherit",
      }}
    />
  );
}

// ─── 1. NGO HERO CARD ────────────────────────────────────────────────────────
function NGOHeroCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 32,
        overflow: "hidden",
        padding: 3,
        background: "linear-gradient(135deg, #22c55e, #14b8a6, #3b82f6, #8b5cf6)",
        backgroundSize: "300% 300%",
        boxShadow: hovered ? "0 32px 80px rgba(20,184,166,0.35)" : "0 16px 48px rgba(20,184,166,0.18)",
        transition: "box-shadow 0.4s ease",
        cursor: "pointer",
      }}
    >
      {/* Animated gradient border */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", inset: 0, borderRadius: 32,
          background: "linear-gradient(135deg, #22c55e, #14b8a6, #3b82f6, #8b5cf6)",
          backgroundSize: "300% 300%",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{
          position: "relative", zIndex: 1,
          background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
          borderRadius: 30, padding: "36px 40px",
          display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
        }}
      >
        {/* Logo with glow ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", inset: -6,
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, #22c55e, #14b8a6, #3b82f6, #8b5cf6, #22c55e)",
              filter: "blur(2px)",
            }}
          />
          <motion.div
            animate={{ boxShadow: hovered ? "0 0 40px rgba(20,184,166,0.6)" : "0 0 20px rgba(20,184,166,0.3)" }}
            style={{
              position: "relative", width: 88, height: 88, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #14b8a6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, border: "4px solid white",
            }}
          >
            🌿
          </motion.div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>
              EarthForward Foundation
            </h1>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: "linear-gradient(90deg, #3b82f6, #14b8a6)",
                color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px",
                borderRadius: 20, display: "flex", alignItems: "center", gap: 4,
              }}
            >
              ✓ VERIFIED
            </motion.span>
            <span style={{
              background: "linear-gradient(90deg, #f59e0b, #ef4444)",
              color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            }}>
              🏆 TOP NGO
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "#059669", fontWeight: 600, background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: 20 }}>
              🌱 Environment
            </span>
            <span style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
              📍 New Delhi, India
            </span>
            <span style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
              📅 Est. 2016
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", maxWidth: 500, lineHeight: 1.6 }}>
            Driving sustainable change through community empowerment, reforestation, and climate education across India's urban and rural regions.
          </p>
        </div>

        {/* Impact Score */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 30px rgba(34,197,94,0.5)", "0 0 0px rgba(34,197,94,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 110, height: 110, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #14b8a6)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "white", boxShadow: "0 8px 32px rgba(34,197,94,0.4)",
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
              <CountUp target={94} duration={1500} />
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>IMPACT SCORE</span>
          </motion.div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#059669", fontWeight: 700 }}>↑ Top 3% Nationally</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── 2. IMPACT METRICS ────────────────────────────────────────────────────────
function ImpactMetrics() {
  const metrics = [
    { icon: "❤️", label: "Lives Impacted", value: 142800, suffix: "", color: T.green, bg: "rgba(34,197,94,0.1)", barColor: "linear-gradient(90deg, #22c55e, #14b8a6)" },
    { icon: "🤝", label: "Active Volunteers", value: 3240, suffix: "", color: T.blue, bg: "rgba(59,130,246,0.1)", barColor: "linear-gradient(90deg, #3b82f6, #8b5cf6)" },
    { icon: "✅", label: "Projects Completed", value: 87, suffix: "", color: T.teal, bg: "rgba(20,184,166,0.1)", barColor: "linear-gradient(90deg, #14b8a6, #22c55e)" },
    { icon: "🚀", label: "Ongoing Campaigns", value: 12, suffix: "", color: T.accent, bg: "rgba(245,158,11,0.1)", barColor: "linear-gradient(90deg, #f59e0b, #ef4444)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, boxShadow: T.shadowHover }}
          style={{ ...glassCard, padding: "28px 24px", position: "relative", overflow: "hidden", transition: "box-shadow 0.3s" }}
        >
          <Shimmer />
          <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: m.color, fontFamily: "'DM Sans', system-ui", lineHeight: 1 }}>
            <CountUp target={m.value} duration={2000} suffix={m.suffix} />
          </div>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginTop: 4, marginBottom: 16 }}>{m.label}</div>
          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 10, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((m.value / (m.value * 1.2)) * 100, 100)}%` }}
              transition={{ delay: i * 0.1 + 0.8, duration: 1.2, ease: "easeOut" }}
              style={{ height: "100%", borderRadius: 10, background: m.barColor }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── 3. PROJECT PERFORMANCE ───────────────────────────────────────────────────
function ProjectPerformance() {
  const [expanded, setExpanded] = useState(null);
  const projects = [
    { name: "Green Delhi 2024", status: "Active", pct: 78, volunteers: 420, category: "Environment", color: T.green },
    { name: "Edu-Bridge Rural", status: "Active", pct: 61, volunteers: 280, category: "Education", color: T.blue },
    { name: "Clean Ganga Initiative", status: "Completed", pct: 100, volunteers: 850, category: "Environment", color: T.teal },
    { name: "Urban Solar Grid", status: "Active", pct: 44, volunteers: 160, category: "Energy", color: T.accent },
    { name: "Women's STEM Academy", status: "Completed", pct: 100, volunteers: 310, category: "Education", color: T.purple },
    { name: "Flood Relief Assam", status: "Active", pct: 89, volunteers: 620, category: "Disaster Relief", color: "#ef4444" },
  ];

  const radarData = [
    { subject: "Execution", A: 88 }, { subject: "Volunteers", A: 92 }, { subject: "Impact", A: 94 },
    { subject: "Timeline", A: 76 }, { subject: "Budget", A: 85 }, { subject: "Outreach", A: 90 },
  ];

  return (
    <div style={{ ...glassCard, padding: "32px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>Project Performance</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>Tracking all active and completed initiatives</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(34,197,94,0.1)", color: T.green, fontSize: 13, fontWeight: 600 }}>Active: 4</span>
          <span style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(59,130,246,0.1)", color: T.blue, fontSize: 13, fontWeight: 600 }}>Completed: 2</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 32, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                background: "rgba(255,255,255,0.8)", borderRadius: 16, padding: "18px 20px",
                border: `1px solid ${expanded === i ? p.color + "55" : "rgba(0,0,0,0.05)"}`,
                cursor: "pointer", transition: "border 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                  <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{p.name}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: `${p.color}20`, color: p.color, fontWeight: 700 }}>{p.category}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>👥 {p.volunteers}</span>
                  <span style={{ fontWeight: 800, color: p.color, fontSize: 16 }}>{p.pct}%</span>
                </div>
              </div>
              <div style={{ height: 8, borderRadius: 10, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.pct}%` }}
                  transition={{ delay: i * 0.08 + 0.5, duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${p.color}, ${p.color}aa)`, position: "relative", overflow: "hidden" }}
                >
                  <Shimmer />
                </motion.div>
              </div>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ paddingTop: 14, display: "flex", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Status: <strong style={{ color: p.status === "Active" ? T.green : T.blue }}>{p.status}</strong></div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Completion: <strong style={{ color: p.color }}>{p.pct}%</strong></div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Volunteers: <strong>{p.volunteers}</strong></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "20px 12px", border: "1px solid rgba(0,0,0,0.05)" }}
        >
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#64748b", textAlign: "center" }}>Performance Radar</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0,0,0,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} />
              <Radar name="Score" dataKey="A" stroke={T.teal} fill={T.teal} fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

// ─── 4. AI INSIGHTS PANEL ────────────────────────────────────────────────────
function AIInsightsPanel() {
  const insights = [
    { icon: "📈", text: "Volunteer demand expected to rise 28% next quarter in Delhi NCR region", type: "growth", color: T.green },
    { icon: "🎓", text: "Education campaigns showing 3.2× higher completion rates than sector average", type: "performance", color: T.blue },
    { icon: "📍", text: "High volunteer engagement concentrated in Delhi, Pune, Bengaluru corridors", type: "location", color: T.teal },
    { icon: "⚡", text: "Optimal campaign launch window: Tuesday–Thursday 6PM–9PM based on engagement data", type: "timing", color: T.accent },
    { icon: "🤖", text: "AI recommends expanding to Chennai — 67% volunteer density match with your profile", type: "expansion", color: T.purple },
  ];

  const chartData = [
    { m: "Jan", v: 2100 }, { m: "Feb", v: 2400 }, { m: "Mar", v: 2200 }, { m: "Apr", v: 2900 },
    { m: "May", v: 3100 }, { m: "Jun", v: 3240 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      style={{
        ...glassCard, padding: "32px 36px",
        background: "linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(239,246,255,0.9) 100%)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.12), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.10), transparent)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 0px rgba(20,184,166,0)", "0 0 20px rgba(20,184,166,0.6)", "0 0 0px rgba(20,184,166,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #14b8a6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}
        >
          🧠
        </motion.div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>AI Intelligence Panel</h2>
            <PulseDot color={T.green} size={10} />
            <span style={{ fontSize: 12, color: T.green, fontWeight: 700 }}>LIVE</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Powered by Digital Sevaks AI · Updated 2 min ago</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ x: 4 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                background: `${ins.color}0d`, borderRadius: 16, border: `1px solid ${ins.color}25`,
                cursor: "default",
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{ins.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, color: "#1e293b", fontWeight: 500, lineHeight: 1.5 }}>{ins.text}</p>
                <span style={{ fontSize: 11, color: ins.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{ins.type}</span>
              </div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: ins.color, flexShrink: 0, marginTop: 4 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Volunteer trend */}
        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 20, padding: "20px 16px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#64748b" }}>Volunteer Growth Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke={T.teal} strokeWidth={2.5} fill="url(#vGrad)" dot={{ fill: T.teal, r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: T.green, fontWeight: 700, textAlign: "center" }}>↑ +54% YoY growth</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 5. VOLUNTEER NETWORK ─────────────────────────────────────────────────────
function VolunteerNetwork() {
  const volunteers = [
    { name: "Priya Mehta", role: "Campaign Lead", score: 2840, emoji: "👩‍💼", color: T.green },
    { name: "Arjun Singh", role: "Field Coordinator", score: 2610, emoji: "👨‍🔬", color: T.blue },
    { name: "Kavya Nair", role: "Communications", score: 2420, emoji: "👩‍💻", color: T.teal },
    { name: "Rohit Das", role: "Tech Volunteer", score: 2200, emoji: "👨‍💻", color: T.purple },
    { name: "Anjali Rao", role: "Community Mgr", score: 2080, emoji: "👩‍🎨", color: T.accent },
    { name: "Vikram Bose", role: "Training Lead", score: 1960, emoji: "👨‍🏫", color: "#ef4444" },
    { name: "Sneha Pillai", role: "Data Analyst", score: 1840, emoji: "👩‍🔬", color: T.blue },
    { name: "Dev Kumar", role: "Logistics", score: 1720, emoji: "👨‍🚀", color: T.teal },
  ];

  const scrollRef = useRef(null);

  return (
    <div style={{ ...glassCard, padding: "32px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>Volunteer Network</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>Top contributors powering our mission</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{ padding: "8px 20px", borderRadius: 20, border: "none", background: "linear-gradient(90deg, #22c55e, #14b8a6)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          View All 3,240 →
        </motion.button>
      </div>
      <div
        ref={scrollRef}
        style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}
      >
        {volunteers.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 + 0.2 }}
            whileHover={{ y: -8, boxShadow: `0 16px 40px ${v.color}33` }}
            style={{
              flexShrink: 0, width: 160, background: "rgba(255,255,255,0.8)", borderRadius: 20, padding: "24px 16px",
              border: "1px solid rgba(0,0,0,0.06)", textAlign: "center", cursor: "pointer", transition: "box-shadow 0.3s",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${v.color}30, ${v.color}15)`,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
                fontSize: 28, border: `2px solid ${v.color}40`,
                boxShadow: `0 0 16px ${v.color}30`,
              }}
            >
              {v.emoji}
            </motion.div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>{v.name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>{v.role}</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: v.color }}>{v.score.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>XP Points</div>
            <motion.div
              animate={{ width: [`${(v.score / 3000) * 50}%`, `${(v.score / 3000) * 100}%`, `${(v.score / 3000) * 50}%`] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              style={{ height: 3, background: `linear-gradient(90deg, ${v.color}, transparent)`, borderRadius: 4, margin: "10px auto 0", maxWidth: "80%" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. LOCATION & REACH MAP ──────────────────────────────────────────────────
function LocationMap() {
  const regions = [
    { name: "Delhi NCR", volunteers: 920, projects: 14, strength: 95, x: 42, y: 28, color: T.green },
    { name: "Mumbai", volunteers: 640, projects: 9, strength: 80, x: 30, y: 52, color: T.blue },
    { name: "Bengaluru", volunteers: 510, projects: 8, strength: 72, x: 38, y: 72, color: T.teal },
    { name: "Pune", volunteers: 380, projects: 6, strength: 60, x: 32, y: 60, color: T.accent },
    { name: "Kolkata", volunteers: 290, projects: 5, strength: 48, x: 68, y: 44, color: T.purple },
    { name: "Chennai", volunteers: 240, projects: 4, strength: 42, x: 44, y: 78, color: "#ef4444" },
    { name: "Hyderabad", volunteers: 210, projects: 3, strength: 36, x: 44, y: 66, color: T.green },
    { name: "Jaipur", volunteers: 170, projects: 3, strength: 30, x: 36, y: 36, color: T.blue },
  ];

  const [active, setActive] = useState(null);

  return (
    <div style={{ ...glassCard, padding: "32px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>Geographic Reach</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>Impact across 8 major metro regions</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PulseDot color={T.green} size={10} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>LIVE COVERAGE</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" }}>
        {/* SVG Map */}
        <div style={{ position: "relative", background: "linear-gradient(135deg, rgba(240,253,244,0.6), rgba(239,246,255,0.6))", borderRadius: 20, padding: 20, border: "1px solid rgba(0,0,0,0.05)", minHeight: 340 }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: 300 }}>
            {/* India silhouette - simplified */}
            <path d="M28,15 L48,10 L65,12 L75,22 L78,35 L72,48 L75,58 L68,70 L58,80 L50,88 L44,82 L36,72 L28,60 L22,50 L20,38 L24,26 Z" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.3)" strokeWidth="0.5" />
            {/* Connection lines */}
            {regions.map((r, i) => regions.slice(i + 1, i + 3).map((r2, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={r.x} y1={r.y} x2={r2.x} y2={r2.y}
                stroke={r.color} strokeWidth="0.3" strokeOpacity="0.3" strokeDasharray="2,2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
              />
            )))}
            {/* Markers */}
            {regions.map((r, i) => (
              <g key={r.name} style={{ cursor: "pointer" }} onClick={() => setActive(active === i ? null : i)}>
                <motion.circle
                  cx={r.x} cy={r.y} r={r.strength / 20 + 2}
                  fill={r.color} fillOpacity={0.15}
                  animate={{ r: [r.strength / 20 + 2, r.strength / 20 + 5, r.strength / 20 + 2] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                />
                <motion.circle
                  cx={r.x} cy={r.y} r="3.5"
                  fill={r.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                  whileHover={{ r: 5 }}
                  style={{ filter: `drop-shadow(0 0 4px ${r.color})` }}
                />
                <text x={r.x + 5} y={r.y + 1} fontSize="3.5" fill="#475569" fontWeight="600">{r.name}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Region cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 + 0.2 }}
              whileHover={{ x: -4 }}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                background: active === i ? `${r.color}15` : "rgba(255,255,255,0.6)",
                border: `1px solid ${active === i ? r.color + "40" : "rgba(0,0,0,0.05)"}`,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{r.name}</span>
                </div>
                <span style={{ fontSize: 12, color: r.color, fontWeight: 700 }}>👥 {r.volunteers}</span>
              </div>
              <div style={{ marginTop: 8, height: 4, borderRadius: 10, background: "rgba(0,0,0,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.strength}%` }}
                  transition={{ delay: i * 0.07 + 0.5, duration: 0.8 }}
                  style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${r.color}, ${r.color}80)` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 7. ACHIEVEMENTS GRID ─────────────────────────────────────────────────────
function AchievementsGrid() {
  const achievements = [
    { icon: "🏆", title: "Top Rated NGO", desc: "Rated #1 in North India", unlocked: true, color: T.accent },
    { icon: "💚", title: "1000+ Lives", desc: "Impacted 142,000 lives", unlocked: true, color: T.green },
    { icon: "🚀", title: "Fast Growing", desc: "54% YoY volunteer growth", unlocked: true, color: T.blue },
    { icon: "🌍", title: "National Reach", desc: "Operating in 8+ cities", unlocked: true, color: T.teal },
    { icon: "🤝", title: "3K+ Network", desc: "3,240 active volunteers", unlocked: true, color: T.purple },
    { icon: "⚡", title: "AI Pioneer", desc: "First AI-driven NGO", unlocked: true, color: T.teal },
    { icon: "🔬", title: "Research Leader", desc: "10 published impact reports", unlocked: false, color: "#94a3b8" },
    { icon: "🌟", title: "5-Star Rating", desc: "Achieve 5.0 avg score", unlocked: false, color: "#94a3b8" },
  ];

  return (
    <div style={{ ...glassCard, padding: "32px 36px" }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>Achievements & Badges</h2>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b" }}>Recognition for impact and excellence</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 + 0.2, type: "spring", stiffness: 200 }}
            whileHover={a.unlocked ? { y: -6, boxShadow: `0 16px 40px ${a.color}33` } : {}}
            style={{
              textAlign: "center", padding: "24px 16px", borderRadius: 20,
              background: a.unlocked ? `linear-gradient(135deg, ${a.color}12, ${a.color}06)` : "rgba(0,0,0,0.03)",
              border: `1px solid ${a.unlocked ? a.color + "30" : "rgba(0,0,0,0.06)"}`,
              cursor: a.unlocked ? "pointer" : "default",
              filter: a.unlocked ? "none" : "grayscale(1)",
              opacity: a.unlocked ? 1 : 0.45,
              position: "relative", overflow: "hidden", transition: "box-shadow 0.3s",
            }}
          >
            {a.unlocked && <Shimmer />}
            <motion.div
              animate={a.unlocked ? { scale: [1, 1.08, 1], filter: [`drop-shadow(0 0 0px ${a.color})`, `drop-shadow(0 0 10px ${a.color})`, `drop-shadow(0 0 0px ${a.color})`] } : {}}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              style={{ fontSize: 36, marginBottom: 10 }}
            >
              {a.icon}
            </motion.div>
            <div style={{ fontSize: 14, fontWeight: 800, color: a.unlocked ? "#0f172a" : "#94a3b8", marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: a.unlocked ? "#64748b" : "#cbd5e1" }}>{a.desc}</div>
            {a.unlocked && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.07 + 0.5, type: "spring" }}
                style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white" }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── 8. ACTIVITY FEED ─────────────────────────────────────────────────────────
function ActivityFeed() {
  const baseActivities = [
    { icon: "👤", text: "Priya Mehta joined as Field Volunteer", time: "Just now", color: T.green, tag: "JOIN" },
    { icon: "🎯", text: "Green Delhi 2024 campaign hit 78% completion", time: "3 min ago", color: T.blue, tag: "MILESTONE" },
    { icon: "💰", text: "Donation milestone ₹5L reached for Clean Ganga", time: "8 min ago", color: T.accent, tag: "DONATION" },
    { icon: "🌟", text: "Arjun Singh promoted to Campaign Lead", time: "15 min ago", color: T.purple, tag: "PROMOTION" },
    { icon: "📢", text: "New campaign \"Solar Schools\" launched in UP", time: "22 min ago", color: T.teal, tag: "LAUNCH" },
    { icon: "✅", text: "Women's STEM Academy project completed successfully", time: "1 hr ago", color: T.green, tag: "COMPLETE" },
    { icon: "🤝", text: "Partnership signed with TechForGood Foundation", time: "2 hr ago", color: T.blue, tag: "PARTNER" },
    { icon: "📊", text: "Monthly impact report: 4,200 beneficiaries this month", time: "3 hr ago", color: T.teal, tag: "REPORT" },
  ];

  const [activities, setActivities] = useState(baseActivities);
  const [newItem, setNewItem] = useState(null);

  useEffect(() => {
    const extras = [
      { icon: "👤", text: "Ravi Sharma completed volunteer onboarding", time: "Just now", color: T.green, tag: "JOIN" },
      { icon: "🎯", text: "Edu-Bridge Rural reached 1,000 students milestone", time: "Just now", color: T.blue, tag: "MILESTONE" },
      { icon: "⚡", text: "AI matching connected 15 new volunteers to campaigns", time: "Just now", color: T.purple, tag: "AI" },
    ];
    let idx = 0;
    const timer = setInterval(() => {
      setNewItem(extras[idx % extras.length]);
      setActivities(prev => [{ ...extras[idx % extras.length] }, ...prev.slice(0, 7)]);
      idx++;
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ ...glassCard, padding: "32px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', system-ui" }}>Live Activity Feed</h2>
            <PulseDot color="#ef4444" size={10} />
            <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 700 }}>LIVE</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b" }}>Real-time updates from your NGO network</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>STREAMING</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 440, overflowY: "auto", scrollbarWidth: "none" }}>
        <AnimatePresence initial={false}>
          {activities.map((a, i) => (
            <motion.div
              key={`${a.text}-${i}`}
              initial={{ opacity: 0, x: -30, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                background: i === 0 ? `${a.color}10` : "rgba(255,255,255,0.6)",
                borderRadius: 14, border: `1px solid ${i === 0 ? a.color + "30" : "rgba(0,0,0,0.05)"}`,
                transition: "all 0.3s",
              }}
            >
              <motion.div
                animate={i === 0 ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
                style={{ fontSize: 20, flexShrink: 0 }}
              >
                {a.icon}
              </motion.div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, color: "#1e293b", fontWeight: i === 0 ? 600 : 400 }}>{a.text}</p>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{a.time}</span>
              </div>
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: `${a.color}15`, color: a.color, fontWeight: 700, flexShrink: 0 }}>
                {a.tag}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 800, color: T.teal, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 8 }}
    >
      <span style={{ width: 20, height: 2, background: `linear-gradient(90deg, ${T.teal}, transparent)`, display: "inline-block", borderRadius: 4 }} />
      {children}
    </motion.p>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function NGOProfileSection() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "40px 20px" }}>
      {/* Ambient BG orbs */}
      <div style={{ position: "fixed", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.06), transparent)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07), transparent)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", left: "30%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.06), transparent)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Platform label */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #22c55e, #14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>Digital Sevaks</span>
          <span style={{ fontSize: 13, color: "#64748b" }}>/ NGO Profile Intelligence</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" }}>Share Profile</motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ padding: "8px 20px", borderRadius: 20, border: "none", background: "linear-gradient(90deg, #22c55e, #14b8a6)", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Edit Profile</motion.button>
          </div>
        </motion.div>

        {/* 1 Hero */}
        <div>
          <SectionLabel>NGO Overview</SectionLabel>
          <NGOHeroCard />
        </div>

        {/* 2 Impact Metrics */}
        <div>
          <SectionLabel>Impact Metrics</SectionLabel>
          <ImpactMetrics />
        </div>

        {/* 3 Project Performance */}
        <div>
          <SectionLabel>Project Performance</SectionLabel>
          <ProjectPerformance />
        </div>

        {/* 4 AI Insights */}
        <div>
          <SectionLabel>AI Intelligence</SectionLabel>
          <AIInsightsPanel />
        </div>

        {/* 5 + 6 side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <SectionLabel>Volunteer Network</SectionLabel>
            <VolunteerNetwork />
          </div>
          <div>
            <SectionLabel>Live Activity</SectionLabel>
            <ActivityFeed />
          </div>
        </div>

        {/* 7 Location */}
        <div>
          <SectionLabel>Geographic Reach</SectionLabel>
          <LocationMap />
        </div>

        {/* 8 Achievements */}
        <div>
          <SectionLabel>Achievements & Badges</SectionLabel>
          <AchievementsGrid />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Digital Sevaks Platform · NGO Profile Intelligence · Powered by AI · </span>
          <span style={{ fontSize: 13, color: T.teal, fontWeight: 600 }}>Last synced: just now</span>
        </motion.div>
      </div>
    </div>
  );
}
