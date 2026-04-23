// console.log("React:", React);
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area, CartesianGrid,
} from "recharts";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  green: "#22c55e", teal: "#14b8a6", blue: "#3b82f6",
  accent: "#f59e0b", purple: "#8b5cf6", red: "#ef4444",
  bg: "linear-gradient(160deg, #f0fdf4 0%, #eff6ff 50%, #fdf4ff 100%)",
  glass: "rgba(255,255,255,0.72)",
  glassDark: "rgba(255,255,255,0.5)",
  border: "1px solid rgba(255,255,255,0.9)",
  borderDim: "1px solid rgba(0,0,0,0.06)",
  shadow: "0 20px 60px rgba(0,0,0,0.09)",
  shadowHover: "0 32px 80px rgba(0,0,0,0.16)",
  font: "'DM Sans', system-ui, sans-serif",
};

const glassCard = (extra = {}) => ({
  background: C.glass,
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: C.border,
  borderRadius: 24,
  boxShadow: C.shadow,
  ...extra,
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function PulseDot({ color = C.green, size = 9 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
      <motion.span animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
      <span style={{ position: "relative", width: "65%", height: "65%", margin: "auto", borderRadius: "50%", background: color, display: "block" }} />
    </span>
  );
}

function CountUp({ to, duration = 1600, decimals = 0 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let s = 0, start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        s = p * to;
        setV(parseFloat(s.toFixed(decimals)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.disconnect();
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration, decimals]);
  return <span ref={ref}>{v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

function SectionLabel({ children }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ width: 24, height: 2, background: `linear-gradient(90deg, ${C.teal}, transparent)`, borderRadius: 4, display: "block" }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: C.font }}>{children}</span>
    </motion.div>
  );
}

// ─── 1. MATCHING HERO ─────────────────────────────────────────────────────────
function MatchingHero() {
  const [activeEdge, setActiveEdge] = useState(null);
  const [particles, setParticles] = useState([]);
  const [matchPulse, setMatchPulse] = useState(false);
  const particleId = useRef(0);

  // Node positions (SVG space 0-600 x 0-280)
  const nodes = [
    { id: "v1", x: 80,  y: 80,  label: "Priya M.", sub: "Teacher", emoji: "👩‍🏫", color: C.green },
    { id: "v2", x: 80,  y: 170, label: "Arjun S.", sub: "Engineer", emoji: "👨‍💻", color: C.blue },
    { id: "v3", x: 80,  y: 260, label: "Kavya R.", sub: "Designer", emoji: "👩‍🎨", color: C.purple },
    { id: "ai", x: 300, y: 170, label: "AI Engine", sub: "Matching", emoji: "🧠", color: C.teal, isCenter: true },
    { id: "n1", x: 520, y: 80,  label: "EduReach", sub: "Education", emoji: "🏫", color: C.accent },
    { id: "n2", x: 520, y: 170, label: "GreenEarth", sub: "Env", emoji: "🌿", color: C.green },
    { id: "n3", x: 520, y: 260, label: "TechAid", sub: "Technology", emoji: "💡", color: C.blue },
  ];

  const edges = [
    { from: "v1", to: "ai", strength: 0.95 },
    { from: "v2", to: "ai", strength: 0.78 },
    { from: "v3", to: "ai", strength: 0.88 },
    { from: "ai", to: "n1", strength: 0.92 },
    { from: "ai", to: "n2", strength: 0.85 },
    { from: "ai", to: "n3", strength: 0.71 },
  ];

  const getNode = (id) => nodes.find(n => n.id === id);

  // Auto-trigger match pulse
  useEffect(() => {
    const t = setInterval(() => {
      setMatchPulse(true);
      setTimeout(() => setMatchPulse(false), 800);
      // spawn particles on all edges
      edges.forEach((e, i) => {
        setTimeout(() => {
          const id = particleId.current++;
          const from = getNode(e.from), to = getNode(e.to);
          setParticles(p => [...p, { id, from, to, progress: 0, edge: e }]);
          setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), 1400);
        }, i * 80);
      });
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
      style={{ ...glassCard(), padding: "36px 40px", position: "relative", overflow: "hidden" }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}18, transparent)`, pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ width: 42, height: 42, borderRadius: 14, background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧠</motion.div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>AI Matching Engine</h2>
            <PulseDot color={C.green} />
            <span style={{ fontSize: 11, color: C.green, fontWeight: 800 }}>ACTIVE</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Real-time volunteer ↔ opportunity intelligence</p>
        </div>
        <div style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 20, background: `${C.teal}15`, border: `1px solid ${C.teal}30`, fontSize: 13, fontWeight: 700, color: C.teal }}>
          <CountUp to={1847} /> matches today
        </div>
      </div>

      {/* SVG Network */}
      <svg viewBox="0 0 600 310" style={{ width: "100%", height: 280 }}>
        {/* Edge lines */}
        {edges.map((e, i) => {
          const from = getNode(e.from), to = getNode(e.to);
          const isActive = activeEdge === i || matchPulse;
          return (
            <g key={i}>
              <motion.line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isActive ? C.teal : "rgba(20,184,166,0.15)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray="6,4"
                animate={{ strokeOpacity: isActive ? [0.6, 1, 0.6] : 0.35 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Strength label */}
              <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 7} textAnchor="middle"
                fontSize="9" fill={C.teal} fontWeight="700" opacity={isActive ? 1 : 0.5}>
                {Math.round(e.strength * 100)}%
              </text>
            </g>
          );
        })}

        {/* Animated particles along edges */}
        {particles.map(p => (
          <AnimatedParticle key={p.id} from={p.from} to={p.to} color={p.edge.strength > 0.85 ? C.green : C.teal} />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.id} style={{ cursor: "pointer" }}
            onMouseEnter={() => setActiveEdge(i)}
            onMouseLeave={() => setActiveEdge(null)}>
            {/* Glow ring */}
            <motion.circle cx={node.x} cy={node.y} r={node.isCenter ? 48 : 36}
              fill={node.color} fillOpacity={0.08}
              animate={{ r: node.isCenter ? [48, 56, 48] : [36, 40, 36], fillOpacity: matchPulse ? [0.08, 0.2, 0.08] : 0.08 }}
              transition={{ duration: node.isCenter ? 2 : 3, repeat: Infinity, delay: i * 0.2 }}
            />
            {/* Main circle */}
            <motion.circle cx={node.x} cy={node.y} r={node.isCenter ? 34 : 26}
              fill="white" stroke={node.color} strokeWidth={2}
              filter={`drop-shadow(0 4px 12px ${node.color}55)`}
              whileHover={{ r: node.isCenter ? 38 : 30 }}
              animate={matchPulse && node.isCenter ? { stroke: [C.teal, C.green, C.blue, C.teal] } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Emoji */}
            <text x={node.x} y={node.y + (node.isCenter ? 5 : 4)} textAnchor="middle"
              fontSize={node.isCenter ? 22 : 16} style={{ userSelect: "none" }}>
              {node.emoji}
            </text>
            {/* Label */}
            <text x={node.x} y={node.y + (node.isCenter ? 52 : 42)} textAnchor="middle"
              fontSize="9.5" fill="#0f172a" fontWeight="700" fontFamily={C.font}>{node.label}</text>
            <text x={node.x} y={node.y + (node.isCenter ? 63 : 53)} textAnchor="middle"
              fontSize="8.5" fill="#94a3b8" fontFamily={C.font}>{node.sub}</text>
          </g>
        ))}

        {/* Center "MATCH" burst on pulse */}
        <AnimatePresence>
          {matchPulse && (
            <motion.circle cx={300} cy={170} r={70}
              fill="none" stroke={C.green} strokeWidth={2}
              initial={{ r: 40, opacity: 1 }} animate={{ r: 100, opacity: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
      </svg>

      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 8 }}>
        {[["Volunteers", "3,240", C.green], ["AI Processes/sec", "847", C.teal], ["NGOs Active", "128", C.blue], ["Avg Match", "87%", C.accent]].map(([l, v, c]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c, fontFamily: C.font }}>{v}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedParticle({ from, to, color }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;
  return (
    <motion.circle cx={x} cy={y} r={4} fill={color}
      initial={{ opacity: 1 }} animate={{ opacity: progress > 0.9 ? 0 : 1 }}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );
}

// ─── 2. MATCH SCORE PANEL ─────────────────────────────────────────────────────
function CircularProgress({ pct, color, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let s = 0;
      const step = () => {
        s = Math.min(s + pct / 60, pct);
        setDrawn(s);
        if (s < pct) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.disconnect();
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  const offset = circ - (drawn / 100) * circ;
  return (
    <svg ref={ref} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: "stroke-dashoffset 0.05s" }}
      />
    </svg>
  );
}

function MatchScorePanel() {
  const breakdown = [
    { label: "Skill Alignment", value: 94, color: C.green },
    { label: "Location Match", value: 88, color: C.teal },
    { label: "Availability", value: 90, color: C.blue },
    { label: "Interest Overlap", value: 85, color: C.purple },
    { label: "Experience Level", value: 78, color: C.accent },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
      style={{ ...glassCard(), padding: "32px 36px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>Match Score Breakdown</h2>
      <p style={{ margin: "0 0 28px", fontSize: 13, color: "#64748b" }}>Priya Mehta ↔ EduReach Foundation</p>

      <div style={{ display: "flex", gap: 36, alignItems: "center", flexWrap: "wrap" }}>
        {/* Big ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <CircularProgress pct={92} color={C.green} size={140} stroke={12} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: C.green, fontFamily: C.font, lineHeight: 1 }}><CountUp to={92} />%</span>
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>MATCH</span>
          </div>
        </div>

        {/* Bars */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 14 }}>
          {breakdown.map((b, i) => (
            <motion.div key={b.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + 0.4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{b.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: b.color }}><CountUp to={b.value} />%</span>
              </div>
              <div style={{ height: 7, borderRadius: 10, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${b.value}%` }}
                  transition={{ delay: i * 0.08 + 0.7, duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${b.color}, ${b.color}88)`, position: "relative", overflow: "hidden" }}>
                  <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
                    style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini rings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flexShrink: 0 }}>
          {breakdown.slice(0, 4).map(b => (
            <div key={b.label} style={{ position: "relative", width: 64, height: 64 }}>
              <CircularProgress pct={b.value} color={b.color} size={64} stroke={6} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: b.color }}>{b.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── 3. OPPORTUNITY CARDS ─────────────────────────────────────────────────────
function OpportunityCards() {
  const [applied, setApplied] = useState({});
  const opps = [
    { id: 1, ngo: "EduReach Foundation", role: "Education Volunteer", match: 94, location: "Delhi", skills: ["Teaching", "Mentoring", "Hindi"], color: C.green, emoji: "🏫", urgent: true },
    { id: 2, ngo: "GreenEarth India", role: "Campaign Coordinator", match: 88, location: "Pune", skills: ["Communication", "Env Science"], color: C.teal, emoji: "🌿", urgent: false },
    { id: 3, ngo: "TechAid Society", role: "UI/UX Volunteer", match: 85, location: "Remote", skills: ["Design", "Figma", "Research"], color: C.blue, emoji: "💡", urgent: false },
    { id: 4, ngo: "HealthFirst NGO", role: "Community Health Worker", match: 79, location: "Mumbai", skills: ["Healthcare", "Outreach"], color: C.accent, emoji: "🏥", urgent: true },
    { id: 5, ngo: "WomenWing", role: "Workshop Facilitator", match: 76, location: "Bengaluru", skills: ["Training", "Leadership"], color: C.purple, emoji: "💪", urgent: false },
    { id: 6, ngo: "DataForGood", role: "Data Analyst", match: 72, location: "Remote", skills: ["Python", "Analytics"], color: C.red, emoji: "📊", urgent: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
      style={{ ...glassCard(), padding: "32px 36px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>Recommended Opportunities</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Ranked by AI match score · Updated in real-time</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          style={{ padding: "8px 18px", borderRadius: 20, border: "none", background: `linear-gradient(90deg, ${C.green}, ${C.teal})`, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          View All 128+
        </motion.button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {opps.map((o, i) => (
          <motion.div key={o.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 + 0.3 }}
            whileHover={{ y: -6, boxShadow: `0 20px 48px ${o.color}28` }}
            style={{ background: "rgba(255,255,255,0.82)", borderRadius: 20, padding: "22px 20px", border: `1px solid ${o.color}20`, position: "relative", overflow: "hidden", transition: "box-shadow 0.3s", cursor: "pointer" }}>
            {o.urgent && (
              <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 800, color: C.red, background: `${C.red}15`, padding: "2px 8px", borderRadius: 20 }}>
                🔥 URGENT
              </motion.div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${o.color}25, ${o.color}10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${o.color}30` }}>
                {o.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{o.ngo}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{o.role}</div>
              </div>
            </div>

            {/* Match badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <motion.div animate={{ boxShadow: [`0 0 0px ${o.color}`, `0 0 16px ${o.color}70`, `0 0 0px ${o.color}`] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                style={{ padding: "5px 14px", borderRadius: 20, background: `linear-gradient(90deg, ${o.color}20, ${o.color}10)`, border: `1px solid ${o.color}40`, fontWeight: 900, fontSize: 15, color: o.color }}>
                {o.match}% Match
              </motion.div>
              <span style={{ fontSize: 12, color: "#64748b" }}>📍 {o.location}</span>
            </div>

            {/* Skills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {o.skills.map(s => (
                <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 12, background: `${o.color}12`, color: o.color, fontWeight: 700, border: `1px solid ${o.color}20` }}>
                  {s}
                </span>
              ))}
            </div>

            {/* Apply button */}
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
              onClick={(e) => { e.stopPropagation(); setApplied(prev => ({ ...prev, [o.id]: true })); }}
              style={{
                width: "100%", padding: "10px", borderRadius: 14, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: C.font,
                background: applied[o.id] ? `${C.green}20` : `linear-gradient(90deg, ${o.color}, ${o.color}cc)`,
                color: applied[o.id] ? C.green : "white",
                transition: "all 0.3s",
              }}>
              {applied[o.id] ? "✓ Applied!" : "Quick Apply →"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 4. REAL-TIME MATCH FEED ──────────────────────────────────────────────────
function MatchFeed() {
  const baseEvents = [
    { icon: "🔗", text: "Priya M. matched with EduReach Foundation", sub: "94% match · Teaching skills", time: "now", color: C.green, type: "MATCH" },
    { icon: "🚀", text: "New opportunity: Field Researcher at GreenEarth", sub: "Delhi · Environmental Science", time: "1m ago", color: C.teal, type: "NEW" },
    { icon: "📈", text: "High volunteer demand in Delhi NCR region", sub: "28% above seasonal average", time: "3m ago", color: C.blue, type: "INSIGHT" },
    { icon: "🎯", text: "Arjun S. matched with TechAid Society", sub: "88% match · Engineering", time: "5m ago", color: C.purple, type: "MATCH" },
    { icon: "⚡", text: "EduReach posted 3 urgent openings", sub: "Deadline: 7 days", time: "8m ago", color: C.accent, type: "URGENT" },
    { icon: "🤝", text: "Kavya R. accepted WomenWing offer", sub: "Workshop Facilitator role", time: "12m ago", color: C.green, type: "ACCEPTED" },
    { icon: "💰", text: "GreenEarth reached campaign funding goal", sub: "₹10L milestone achieved", time: "15m ago", color: C.teal, type: "MILESTONE" },
  ];

  const extra = [
    { icon: "🔗", text: "Ravi K. matched with HealthFirst NGO", sub: "82% match · Healthcare", time: "now", color: C.green, type: "MATCH" },
    { icon: "🚀", text: "New: Data Analyst role at DataForGood", sub: "Remote · Python required", time: "now", color: C.blue, type: "NEW" },
    { icon: "⚡", text: "WomenWing urgent: 5 slots remaining", sub: "Bengaluru region", time: "now", color: C.accent, type: "URGENT" },
  ];

  const [events, setEvents] = useState(baseEvents);
  const idx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      const item = extra[idx.current % extra.length];
      setEvents(prev => [{ ...item }, ...prev.slice(0, 9)]);
      idx.current++;
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
      style={{ ...glassCard(), padding: "28px 28px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>Live Match Feed</h3>
            <PulseDot color={C.red} size={9} />
            <span style={{ fontSize: 10, color: C.red, fontWeight: 800 }}>LIVE</span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Real-time matching activity</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: 9 }}>
        <AnimatePresence initial={false}>
          {events.map((ev, i) => (
            <motion.div key={`${ev.text}-${i}`}
              initial={{ opacity: 0, x: -28, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: i === 0 ? `${ev.color}10` : "rgba(255,255,255,0.55)", borderRadius: 14, border: `1px solid ${i === 0 ? ev.color + "30" : "rgba(0,0,0,0.04)"}`, transition: "all 0.3s" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{ev.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#0f172a", fontWeight: i === 0 ? 700 : 500, lineHeight: 1.3 }}>{ev.text}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{ev.sub}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: `${ev.color}18`, color: ev.color, fontWeight: 800 }}>{ev.type}</span>
                <span style={{ fontSize: 10, color: "#cbd5e1" }}>{ev.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── 5. AI EXPLANATION PANEL ──────────────────────────────────────────────────
function AIExplanation() {
  const reasons = [
    { icon: "📚", title: "Teaching Skills Detected", detail: "Your 3+ years of tutoring experience maps directly to EduReach's volunteer requirements.", score: 96, color: C.green },
    { icon: "📍", title: "Location Synergy", detail: "Your preferred location Delhi overlaps with 14 of EduReach's active programs.", score: 88, color: C.teal },
    { icon: "🔄", title: "Volunteering Pattern", detail: "Past commitment of 8hrs/week aligns with EduReach's flexible shift structure.", score: 91, color: C.blue },
    { icon: "🎓", title: "Language Match", detail: "Hindi proficiency crucial for community outreach in target regions.", score: 84, color: C.purple },
    { icon: "⏰", title: "Availability Window", detail: "Weekday evenings (6–9PM) match 87% of scheduled program slots.", score: 87, color: C.accent },
  ];
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 600); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
      style={{ ...glassCard({ background: "linear-gradient(135deg, rgba(240,253,244,0.85) 0%, rgba(239,246,255,0.85) 100%)" }), padding: "32px 36px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}18, transparent)`, pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 3, repeat: Infinity }}
          style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
          🧬
        </motion.div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>Why This Match?</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>AI reasoning for Priya ↔ EduReach • Confidence: 94%</p>
        </div>
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 20, background: `${C.teal}15`, border: `1px solid ${C.teal}30`, fontSize: 12, fontWeight: 700, color: C.teal, display: "flex", alignItems: "center", gap: 6 }}>
          <PulseDot color={C.teal} size={8} />
          ANALYZING
        </motion.div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {reasons.map((r, i) => (
          <motion.div key={r.title}
            initial={{ opacity: 0, x: -24 }}
            animate={revealed ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 4 }}
            style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px", background: `${r.color}0c`, borderRadius: 16, border: `1px solid ${r.color}22`, cursor: "default" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{r.title}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: r.color }}>{r.score}%</span>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{r.detail}</p>
              <div style={{ height: 5, borderRadius: 10, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={revealed ? { width: `${r.score}%` } : {}}
                  transition={{ delay: i * 0.12 + 0.3, duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${r.color}, ${r.color}88)` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 6. MATCH SIMULATOR ───────────────────────────────────────────────────────
function MatchSimulator() {
  const skillOptions = ["Teaching", "Engineering", "Design", "Healthcare", "Data Science", "Communication"];
  const cityOptions = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Kolkata", "Remote"];
  const expOptions = ["<1 year", "1–3 years", "3–5 years", "5+ years"];

  const [skill, setSkill] = useState("Teaching");
  const [city, setCity] = useState("Delhi");
  const [exp, setExp] = useState("1–3 years");
  const [score, setScore] = useState(92);
  const [animating, setAnimating] = useState(false);

  const matchMatrix = {
    "Teaching+Delhi": 94, "Teaching+Mumbai": 82, "Teaching+Remote": 78,
    "Engineering+Delhi": 88, "Engineering+Remote": 91, "Engineering+Bengaluru": 85,
    "Design+Remote": 89, "Design+Mumbai": 84, "Design+Bengaluru": 87,
    "Healthcare+Delhi": 86, "Healthcare+Mumbai": 90, "Healthcare+Pune": 83,
    "Data Science+Remote": 93, "Data Science+Bengaluru": 88, "Data Science+Delhi": 85,
    "Communication+Delhi": 80, "Communication+Mumbai": 82, "Communication+Pune": 79,
  };

  const recalculate = useCallback((s, c, e) => {
    setAnimating(true);
    const key = `${s}+${c}`;
    const base = matchMatrix[key] || Math.floor(70 + Math.random() * 22);
    const expBonus = { "<1 year": -4, "1–3 years": 0, "3–5 years": 3, "5+ years": 6 };
    setTimeout(() => {
      setScore(Math.min(99, base + (expBonus[e] || 0)));
      setAnimating(false);
    }, 600);
  }, []);

  useEffect(() => { recalculate(skill, city, exp); }, [skill, city, exp]);

  const barData = [
    { name: "Teaching", demand: skill === "Teaching" ? 94 : 72, supply: 68 },
    { name: "Engineering", demand: skill === "Engineering" ? 94 : 85, supply: 78 },
    { name: "Design", demand: skill === "Design" ? 94 : 69, supply: 55 },
    { name: "Healthcare", demand: skill === "Healthcare" ? 94 : 88, supply: 60 },
    { name: "Data Sci", demand: skill === "Data Science" ? 94 : 77, supply: 44 },
  ];

  const SelectPill = ({ options, value, onChange }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => (
        <motion.button key={o} whileTap={{ scale: 0.94 }}
          onClick={() => onChange(o)}
          style={{ padding: "7px 15px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: C.font, transition: "all 0.2s",
            background: value === o ? `linear-gradient(90deg, ${C.teal}, ${C.blue})` : "rgba(0,0,0,0.05)",
            color: value === o ? "white" : "#475569", boxShadow: value === o ? `0 4px 16px ${C.teal}40` : "none" }}>
          {o}
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
      style={{ ...glassCard(), padding: "32px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}
          style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${C.accent}, ${C.red})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔄</motion.div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>Match Simulator</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Adjust filters · Watch AI recalculate in real-time</p>
        </div>
        <motion.div key={score} animate={{ scale: [0.85, 1.1, 1], opacity: [0.5, 1] }} transition={{ duration: 0.5 }}
          style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 20, background: `linear-gradient(90deg, ${C.green}, ${C.teal})`, color: "white", fontWeight: 900, fontSize: 22, boxShadow: `0 8px 28px ${C.green}50` }}>
          {animating ? "..." : `${score}%`}
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#475569" }}>Primary Skill</p>
            <SelectPill options={skillOptions} value={skill} onChange={setSkill} />
          </div>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#475569" }}>Preferred City</p>
            <SelectPill options={cityOptions} value={city} onChange={setCity} />
          </div>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#475569" }}>Experience Level</p>
            <SelectPill options={expOptions} value={exp} onChange={setExp} />
          </div>

          {/* Match meter */}
          <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Overall Match Quality</span>
              <motion.span key={score} animate={{ color: score > 85 ? C.green : score > 75 ? C.accent : C.red }} style={{ fontSize: 14, fontWeight: 900 }}>
                {score > 85 ? "Excellent" : score > 75 ? "Good" : "Fair"}
              </motion.span>
            </div>
            <div style={{ height: 10, borderRadius: 10, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <motion.div animate={{ width: `${score}%`, background: score > 85 ? `linear-gradient(90deg, ${C.green}, ${C.teal})` : score > 75 ? `linear-gradient(90deg, ${C.accent}, ${C.green})` : `linear-gradient(90deg, ${C.red}, ${C.accent})` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 10 }} />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#475569" }}>Skill Demand vs Supply</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "none", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", fontSize: 12 }} />
              <Bar dataKey="demand" name="Demand" fill={C.teal} radius={[6, 6, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="supply" name="Supply" fill={C.green} radius={[6, 6, 0, 0]} fillOpacity={0.65} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {[["Demand", C.teal], ["Supply", C.green]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 7. MATCH DISTRIBUTION GRAPH ─────────────────────────────────────────────
function MatchChart() {
  const areaData = [
    { month: "Jan", education: 42, environment: 28, health: 18, tech: 12 },
    { month: "Feb", education: 48, environment: 32, health: 22, tech: 16 },
    { month: "Mar", education: 52, environment: 38, health: 26, tech: 20 },
    { month: "Apr", education: 61, environment: 44, health: 30, tech: 25 },
    { month: "May", education: 74, environment: 52, health: 38, tech: 32 },
    { month: "Jun", education: 88, environment: 64, health: 46, tech: 40 },
  ];

  const regionData = [
    { region: "Delhi", opps: 64, matched: 58 },
    { region: "Mumbai", opps: 52, matched: 44 },
    { region: "Bengaluru", opps: 48, matched: 40 },
    { region: "Pune", opps: 36, matched: 28 },
    { region: "Kolkata", opps: 30, matched: 22 },
    { region: "Chennai", opps: 26, matched: 18 },
    { region: "Remote", opps: 44, matched: 42 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
      style={{ ...glassCard(), padding: "32px 36px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: C.font }}>Match Distribution Analytics</h2>
      <p style={{ margin: "0 0 28px", fontSize: 13, color: "#64748b" }}>Sector growth & regional opportunity coverage</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
        {/* Area chart */}
        <div>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#475569" }}>Matches by Sector · 6-Month Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                {[["eduGrad", C.green], ["envGrad", C.teal], ["hlthGrad", C.blue], ["techGrad", C.purple]].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "rgba(255,255,255,0.97)", border: "none", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", fontSize: 12 }} />
              <Area type="monotone" dataKey="education" name="Education" stroke={C.green} strokeWidth={2} fill="url(#eduGrad)" dot={false} />
              <Area type="monotone" dataKey="environment" name="Environment" stroke={C.teal} strokeWidth={2} fill="url(#envGrad)" dot={false} />
              <Area type="monotone" dataKey="health" name="Health" stroke={C.blue} strokeWidth={2} fill="url(#hlthGrad)" dot={false} />
              <Area type="monotone" dataKey="tech" name="Tech" stroke={C.purple} strokeWidth={2} fill="url(#techGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
            {[["Education", C.green], ["Environment", C.teal], ["Health", C.blue], ["Tech", C.purple]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Region horizontal bars */}
        <div>
          <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#475569" }}>Region · Opportunities vs Matched</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {regionData.map((r, i) => (
              <motion.div key={r.region} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 + 0.4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{r.region}</span>
                  <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>{Math.round(r.matched / r.opps * 100)}% filled</span>
                </div>
                <div style={{ position: "relative", height: 8, borderRadius: 10, background: "rgba(0,0,0,0.06)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(r.opps / 70) * 100}%` }}
                    transition={{ delay: i * 0.07 + 0.5, duration: 0.9 }}
                    style={{ position: "absolute", height: "100%", borderRadius: 10, background: `${C.blue}30` }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(r.matched / 70) * 100}%` }}
                    transition={{ delay: i * 0.07 + 0.7, duration: 0.9 }}
                    style={{ position: "absolute", height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${C.green}, ${C.teal})` }} />
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {[["Opportunities", `${C.blue}60`], ["Matched", `linear-gradient(90deg, ${C.green}, ${C.teal})`]].map(([l, bg]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: bg }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function MatchingSection() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font, padding: "40px 20px", position: "relative" }}>
      {/* Ambient orbs */}
      {[["-5%", "8%", C.green], ["85%", "20%", C.blue], ["40%", "75%", C.teal]].map(([l, t, c], i) => (
        <div key={i} style={{ position: "fixed", left: l, top: t, width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${c}09, transparent)`, pointerEvents: "none", zIndex: 0 }} />
      ))}

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Top nav strip */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Digital Sevaks</span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>/</span>
          <span style={{ fontSize: 13, color: "#64748b" }}>Smart Matching & Opportunity Engine</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" }}>Filters</motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ padding: "8px 20px", borderRadius: 20, border: "none", background: `linear-gradient(90deg, ${C.green}, ${C.teal})`, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Find My Match →</motion.button>
          </div>
        </motion.div>

        {/* 1 - Hero */}
        <div>
          <SectionLabel>Matching Core</SectionLabel>
          <MatchingHero />
        </div>

        {/* 2+3 - Score + Opportunities */}
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24, alignItems: "start" }}>
          <div>
            <SectionLabel>Match Score</SectionLabel>
            <MatchScorePanel />
          </div>
          <div>
            <SectionLabel>Live Feed</SectionLabel>
            <MatchFeed />
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <SectionLabel>Recommended Opportunities</SectionLabel>
          <OpportunityCards />
        </div>

        {/* AI Explanation */}
        <div>
          <SectionLabel>AI Reasoning Engine</SectionLabel>
          <AIExplanation />
        </div>

        {/* Simulator */}
        <div>
          <SectionLabel>Match Simulator</SectionLabel>
          <MatchSimulator />
        </div>

        {/* Chart */}
        <div>
          <SectionLabel>Match Distribution Analytics</SectionLabel>
          <MatchChart />
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Digital Sevaks · Smart Matching Engine · </span>
          <span style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>AI processing 847 matches/sec</span>
        </motion.div>
      </div>
    </div>
  );
}
