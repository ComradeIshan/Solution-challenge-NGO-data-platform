import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import React from "react";

// ─── Palette & Tokens ───────────────────────────────────────────────────────
const C = {
  g1: "#00ffa3", g2: "#00d4aa", t1: "#0af5d4", t2: "#00b4d8",
  b1: "#0077ff", b2: "#2d3a8c", dark: "#040d1a", card: "rgba(6,20,40,0.72)",
  glow: "rgba(0,255,163,0.18)", tGlow: "rgba(0,212,170,0.22)",
};
const GLASS = {
  background: C.card,
  backdropFilter: "blur(22px) saturate(1.8)",
  WebkitBackdropFilter: "blur(22px) saturate(1.8)",
  border: "1px solid rgba(0,255,163,0.13)",
  borderRadius: 24,
};
const fontFamily = "'DM Sans', 'Segoe UI', sans-serif";

// ─── Helpers ────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, started = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return val;
}

function useCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return { x, y };
}

// ─── Animated Blob ───────────────────────────────────────────────────────────
function Blob({ style, color = C.g1, size = 320, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: "absolute", borderRadius: "50%", filter: "blur(80px)",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        width: size, height: size, pointerEvents: "none", ...style,
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────
function ParticleField({ count = 38 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.4,
      a: Math.random(),
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.a += 0.005;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const alpha = (Math.sin(p.a) * 0.4 + 0.6).toFixed(2);
        ctx.fillStyle = `rgba(0,255,163,${alpha * 0.5})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [count]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }} />;
}

// ─── Chart Data ──────────────────────────────────────────────────────────────
const chartData = [
  { month: "Oct", actual: 42000, projected: null },
  { month: "Nov", actual: 55800, projected: null },
  { month: "Dec", actual: 63200, projected: null },
  { month: "Jan", actual: 71500, projected: null },
  { month: "Feb", actual: 79800, projected: 79800 },
  { month: "Mar", projected: 91200 },
  { month: "Apr", projected: 104600 },
  { month: "May", projected: 118300 },
  { month: "Jun", projected: 134700 },
  { month: "Jul", projected: 152000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value || payload[1]?.value;
  return (
    <div style={{ ...GLASS, padding: "10px 16px", fontSize: 13, color: "#e0fff6", fontFamily }}>
      <div style={{ color: C.g1, fontWeight: 700 }}>{label}</div>
      <div>{(val / 1000).toFixed(1)}k lives</div>
    </div>
  );
};

// ─── Predictive Hero Card ─────────────────────────────────────────────────────
function PredictiveHero() {
  const [started, setStarted] = useState(false);
  const count = useCountUp(152000, 2200, started);
  useEffect(() => { const t = setTimeout(() => setStarted(true), 300); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...GLASS, padding: "36px 40px", position: "relative", overflow: "hidden", gridColumn: "1 / -1" }}
    >
      <ParticleField count={45} />
      <Blob style={{ top: -80, right: -60 }} color={C.g1} size={380} delay={0} />
      <Blob style={{ bottom: -60, left: 100 }} color={C.t1} size={280} delay={2.5} />
      <Blob style={{ top: 60, left: -80 }} color={C.b1} size={260} delay={1.2} />

      {/* Radial pulse rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i} style={{
          position: "absolute", top: "28%", right: "12%",
          width: 160 + i * 90, height: 160 + i * 90,
          borderRadius: "50%", border: `1px solid rgba(0,255,163,${0.2 - i * 0.05})`,
          transform: "translate(50%, -50%)", pointerEvents: "none",
        }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <motion.span style={{ fontSize: 22 }} animate={{ rotate: [0, 15, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>🔮</motion.span>
              <span style={{ color: C.g1, fontFamily, fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Predictive Impact Intelligence</span>
            </div>
            <h2 style={{ fontFamily, color: "#e8fff8", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              Projected Lives{" "}
              <span style={{ background: `linear-gradient(135deg, ${C.g1}, ${C.t1}, ${C.b1})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Impacted
              </span>
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 8 }}
            >
              <span style={{ fontFamily, fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, background: `linear-gradient(135deg, ${C.g1}, ${C.t1})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                {count.toLocaleString()}
              </span>
              <span style={{ color: "rgba(200,255,240,0.6)", fontFamily, fontSize: 18 }}>by July '25</span>
            </motion.div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
            <motion.div
              animate={{ boxShadow: [`0 0 0px ${C.g1}00`, `0 0 24px ${C.g1}88`, `0 0 0px ${C.g1}00`] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ background: "rgba(0,255,163,0.12)", border: `1px solid ${C.g1}55`, borderRadius: 50, padding: "8px 18px", display: "flex", alignItems: "center", gap: 8 }}
            >
              <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: C.g1 }}
                animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span style={{ fontFamily, color: C.g1, fontWeight: 700, fontSize: 14 }}>92% AI Confidence</span>
            </motion.div>
            <div style={{ background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.3)", borderRadius: 50, padding: "6px 14px" }}>
              <span style={{ fontFamily, color: C.t2, fontSize: 12, fontWeight: 600 }}>📈 +91% projected growth</span>
            </div>
          </div>
        </div>

        <div style={{ height: 220, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.g1} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.g1} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.b1} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.b1} stopOpacity={0} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.25)" tick={{ fontFamily, fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.25)" tick={{ fontFamily, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x="Feb" stroke="rgba(255,255,255,0.25)" strokeDasharray="6 4" label={{ value: "Now", fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily }} />
              <Area type="monotone" dataKey="actual" stroke={C.g1} strokeWidth={2.5} fill="url(#actualGrad)" dot={{ fill: C.g1, r: 4, filter: "url(#glow)" }} isAnimationActive={true} animationDuration={1600} />
              <Area type="monotone" dataKey="projected" stroke={C.b1} strokeWidth={2} strokeDasharray="8 4" fill="url(#projGrad)" dot={{ fill: C.b1, r: 3 }} isAnimationActive={true} animationDuration={2000} animationBegin={400} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 12, flexWrap: "wrap" }}>
          {[{ c: C.g1, l: "Actual Impact" }, { c: C.b1, l: "AI Projection", dash: true }, { c: "rgba(255,255,255,0.3)", l: "Present" }].map(({ c, l, dash }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 24, height: 2, background: dash ? "transparent" : c, borderTop: dash ? `2px dashed ${c}` : "none", borderRadius: 2 }} />
              <span style={{ fontFamily, color: "rgba(200,255,240,0.55)", fontSize: 12 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
const insightData = [
  { icon: "📈", title: "Volunteer Surge", insight: "Growth accelerating in Delhi & NCR corridor", stat: "+28%", sub: "vs last quarter", color: C.g1, glow: "rgba(0,255,163,0.2)" },
  { icon: "🌱", title: "Environmental Wave", insight: "Eco campaigns trending 3× above average engagement", stat: "3.2×", sub: "engagement spike", color: C.t1, glow: "rgba(10,245,212,0.2)" },
  { icon: "⚡", title: "Peak Engagement", insight: "Weekends 6–9PM show highest conversion windows", stat: "68%", sub: "conversion peak", color: "#f0c060", glow: "rgba(240,192,96,0.2)" },
  { icon: "🏥", title: "Health Campaigns", insight: "Medical aid programs seeing consistent repeat participants", stat: "+41%", sub: "retention rate", color: C.b1, glow: "rgba(0,119,255,0.2)" },
];

function InsightCard({ data, index }) {
  const [hov, setHov] = useState(false);
  const started = useCountUp(parseFloat(data.stat), 1400, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.65, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6, scale: 1.015 }}
      style={{ ...GLASS, padding: "26px 28px", position: "relative", overflow: "hidden", cursor: "default",
        boxShadow: hov ? `0 12px 48px ${data.glow}, 0 0 0 1px ${data.color}33` : "0 4px 24px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.3s ease" }}
    >
      <Blob style={{ top: -40, right: -40, opacity: 0.5 }} color={data.color} size={180} delay={index * 0.8} />

      {/* Shimmer bar */}
      <motion.div
        style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`, borderRadius: 1 }}
        animate={{ width: hov ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <motion.span style={{ fontSize: 26 }} animate={hov ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }}>
            {data.icon}
          </motion.span>
          <motion.div
            style={{ background: `${data.color}18`, border: `1px solid ${data.color}44`, borderRadius: 8, padding: "4px 10px" }}
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
          >
            <span style={{ fontFamily, color: data.color, fontWeight: 800, fontSize: 16 }}>{data.stat}</span>
          </motion.div>
        </div>

        <div style={{ fontFamily, color: "#c8ffe8", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{data.title}</div>
        <div style={{ fontFamily, color: "rgba(180,240,220,0.65)", fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{data.insight}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", background: `linear-gradient(90deg, ${data.color}, ${data.color}88)`, borderRadius: 2 }}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(Math.abs(parseFloat(data.stat)), 100)}%` }}
              transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: "easeOut" }}
            />
          </div>
          <span style={{ fontFamily, color: `${data.color}aa`, fontSize: 11 }}>{data.sub}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AI Recommendations ───────────────────────────────────────────────────────
const recs = [
  { icon: "🚀", text: "Increase volunteer recruitment in Mumbai & Pune", conf: 89, color: C.g1 },
  { icon: "🏥", text: "Promote healthcare campaigns in Bihar corridor", conf: 84, color: C.t1 },
  { icon: "📱", text: "Launch digital literacy drive in Tier-2 cities", conf: 77, color: C.b1 },
  { icon: "🌿", text: "Intensify reforestation partnerships before monsoon", conf: 91, color: "#60d394" },
  { icon: "👶", text: "Expand child welfare programs in UP districts", conf: 73, color: "#f0c060" },
];

function AIRecommendations() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible < recs.length) {
      const t = setTimeout(() => setVisible(v => v + 1), 320 + visible * 80);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      style={{ ...GLASS, padding: "30px 32px", position: "relative", overflow: "hidden" }}
    >
      <Blob style={{ bottom: -60, right: -40 }} color={C.t1} size={240} delay={1} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: C.g1 }}
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
              <span style={{ fontFamily, color: C.g1, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>AI Engine Active</span>
            </div>
            <h3 style={{ fontFamily, color: "#e0fff4", fontWeight: 800, fontSize: 18, margin: 0 }}>🧠 What You Should Do Next</h3>
          </div>
          <motion.div
            animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${C.g1}55`, borderTopColor: C.g1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: 14 }}>⚙️</span>
          </motion.div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <AnimatePresence>
            {recs.slice(0, visible).map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ x: 4 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                  background: "rgba(255,255,255,0.04)", borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.07)", cursor: "default" }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily, color: "#d8f5ee", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{r.text}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
                      <motion.div
                        style={{ height: "100%", background: `linear-gradient(90deg, ${r.color}, ${r.color}70)`, borderRadius: 2 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${r.conf}%` }}
                        transition={{ duration: 1, delay: 0.15 + i * 0.05, ease: "easeOut" }}
                      />
                    </div>
                    <span style={{ fontFamily, color: r.color, fontSize: 12, fontWeight: 700, width: 36, textAlign: "right" }}>{r.conf}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Region Heatmap ───────────────────────────────────────────────────────────
const regions = [
  { name: "Delhi NCR", val: 95, x: 3, y: 1 }, { name: "Mumbai", val: 88, x: 1, y: 4 },
  { name: "Bangalore", val: 82, x: 3, y: 7 }, { name: "Kolkata", val: 74, x: 7, y: 3 },
  { name: "Chennai", val: 78, x: 5, y: 7 }, { name: "Hyderabad", val: 70, x: 4, y: 6 },
  { name: "Ahmedabad", val: 65, x: 2, y: 5 }, { name: "Pune", val: 72, x: 2, y: 5 },
  { name: "Jaipur", val: 58, x: 2, y: 2 }, { name: "Lucknow", val: 61, x: 5, y: 2 },
  { name: "Patna", val: 44, x: 6, y: 2 }, { name: "Bhopal", val: 50, x: 4, y: 4 },
];

function RegionCard({ r, i }) {
  const [hov, setHov] = useState(false);
  const intens = r.val / 100;
  const color = intens > 0.8 ? C.g1 : intens > 0.65 ? C.t1 : intens > 0.5 ? C.t2 : C.b1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 * i }}
      whileHover={{ scale: 1.12, zIndex: 10 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <motion.div
        style={{ width: 52, height: 52, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          background: `${color}${Math.floor(intens * 100 + 15).toString(16).padStart(2, "0")}`,
          border: `1px solid ${color}${hov ? "88" : "33"}`,
          boxShadow: hov ? `0 0 20px ${color}55` : "none" }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
      >
        <span style={{ fontFamily, color, fontWeight: 800, fontSize: 13 }}>{r.val}</span>
      </motion.div>
      {hov && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(4,13,26,0.95)", border: `1px solid ${color}44`, borderRadius: 8,
            padding: "6px 10px", whiteSpace: "nowrap", zIndex: 20 }}>
          <span style={{ fontFamily, color: "#e0fff4", fontSize: 11, fontWeight: 600 }}>{r.name}</span>
          <span style={{ fontFamily, color, fontSize: 11, marginLeft: 6 }}>{r.val}% impact</span>
        </motion.div>
      )}
    </motion.div>
  );
}

function HeatmapPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      style={{ ...GLASS, padding: "30px 32px", position: "relative", overflow: "hidden" }}
    >
      <Blob style={{ top: -40, left: 80 }} color={C.t2} size={200} delay={0.8} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>🌍</span>
          <div>
            <h3 style={{ fontFamily, color: "#e0fff4", fontWeight: 800, fontSize: 17, margin: 0 }}>Region Intelligence</h3>
            <div style={{ fontFamily, color: "rgba(180,240,220,0.5)", fontSize: 12 }}>Impact intensity across India</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {regions.map((r, i) => <RegionCard key={r.name} r={r} i={i} />)}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily, color: "rgba(180,240,220,0.5)", fontSize: 11 }}>Low</span>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${C.b1}, ${C.t2}, ${C.t1}, ${C.g1})` }} />
          <span style={{ fontFamily, color: "rgba(180,240,220,0.5)", fontSize: 11 }}>High</span>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          {[["🟢", "80–100", "Thriving"], ["🔵", "60–79", "Active"], ["🌀", "<60", "Growing"]].map(([e, r, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 10 }}>{e}</span>
              <span style={{ fontFamily, color: "rgba(180,240,220,0.55)", fontSize: 11 }}>{r} — {l}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Prediction Feed ──────────────────────────────────────────────────────────
const feedItems = [
  { icon: "🤖", text: "AI predicts +12% volunteer surge next weekend", time: "2s ago", color: C.g1, urgent: true },
  { icon: "🔍", text: "New opportunity cluster detected: Rajasthan rural belt", time: "18s ago", color: C.t1 },
  { icon: "⚠️", text: "Engagement dip flagged in Odisha — action advised", time: "1m ago", color: "#f0c060" },
  { icon: "📊", text: "Healthcare impact model updated with 1,240 new data points", time: "3m ago", color: C.b1 },
  { icon: "🌱", text: "Eco campaign momentum: 94% probability of viral spread", time: "7m ago", color: "#60d394" },
  { icon: "📌", text: "Campaign saturation risk detected in Bangalore sector 4", time: "12m ago", color: C.t2 },
];

function PredictionFeed() {
  const [items, setItems] = useState(feedItems);
  const [newIdx, setNewIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      const fresh = { ...feedItems[newIdx % feedItems.length], time: "just now", urgent: newIdx % 3 === 0 };
      setItems(prev => [fresh, ...prev.slice(0, 5)]);
      setNewIdx(n => n + 1);
    }, 5500);
    return () => clearInterval(iv);
  }, [newIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      style={{ ...GLASS, padding: "30px 32px", position: "relative", overflow: "hidden", gridColumn: "1 / -1" }}
    >
      <Blob style={{ bottom: -50, right: 200 }} color={C.b1} size={220} delay={1.5} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <h3 style={{ fontFamily, color: "#e0fff4", fontWeight: 800, fontSize: 17, margin: 0 }}>Real-Time Prediction Feed</h3>
            <motion.div style={{ background: "rgba(0,255,163,0.12)", border: `1px solid ${C.g1}44`, borderRadius: 20, padding: "3px 10px" }}
              animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <span style={{ fontFamily, color: C.g1, fontSize: 11, fontWeight: 700 }}>● LIVE</span>
            </motion.div>
          </div>
          <span style={{ fontFamily, color: "rgba(180,240,220,0.4)", fontSize: 12 }}>Auto-updating every 5s</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={`${item.text}-${item.time}-${i}`}
                layout
                initial={{ opacity: 0, x: -24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px",
                  background: i === 0 ? `${item.color}12` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 0 ? item.color + "44" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14, transition: "background 0.3s" }}
              >
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily, color: i === 0 ? "#e8fff8" : "rgba(200,240,225,0.8)", fontSize: 13, fontWeight: i === 0 ? 600 : 400, lineHeight: 1.4, marginBottom: 4 }}>
                    {item.text}
                  </div>
                  <div style={{ fontFamily, color: `${item.color}99`, fontSize: 11 }}>{item.time}</div>
                </div>
                {i === 0 && (
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 6 }} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Cursor Glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const { x, y } = useCursor();
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: 420, height: 420, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,255,163,0.07) 0%, transparent 65%)`,
        transform: "translate(-50%, -50%)",
        left: sx, top: sy,
      }}
    />
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ImpactIntelligence() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${C.dark}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,163,0.2); border-radius: 3px; }
      `}</style>

      <CursorGlow />

      <div style={{
        minHeight: "100vh", background: `radial-gradient(ellipse at 20% 0%, rgba(0,119,255,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(0,255,163,0.1) 0%, transparent 50%),
          linear-gradient(180deg, #030c18 0%, #040d1a 100%)`,
        padding: "clamp(20px, 4vw, 60px)",
        position: "relative",
      }}>
        {/* Fixed ambient blobs */}
        <Blob style={{ top: "5%", left: "5%", opacity: 0.4 }} color={C.g1} size={500} delay={0} />
        <Blob style={{ bottom: "10%", right: "8%", opacity: 0.35 }} color={C.b1} size={450} delay={2} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 40, position: "relative", zIndex: 1 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <motion.div style={{ width: 3, height: 44, background: `linear-gradient(180deg, ${C.g1}, ${C.b1})`, borderRadius: 2 }}
              animate={{ scaleY: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
            <div>
              <div style={{ fontFamily, color: C.g1, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                Digital Sevaks · AI Intelligence Layer
              </div>
              <h1 style={{ fontFamily, color: "#e8fff8", fontSize: "clamp(22px, 3.5vw, 38px)", fontWeight: 900, lineHeight: 1.1 }}>
                Impact Intelligence &{" "}
                <span style={{ background: `linear-gradient(90deg, ${C.g1}, ${C.t1}, ${C.b1})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Predictive Insights
                </span>
              </h1>
            </div>
          </div>
          <p style={{ fontFamily, color: "rgba(180,240,220,0.5)", fontSize: 14, marginLeft: 15, maxWidth: 560 }}>
            AI-powered forecasting and real-time intelligence to amplify your social impact
          </p>
        </motion.div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Hero */}
          <PredictiveHero />

          {/* Insight Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {insightData.map((d, i) => <InsightCard key={d.title} data={d} index={i} />)}
          </div>

          {/* AI Recs + Heatmap side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <AIRecommendations />
            <HeatmapPanel />
          </div>

          {/* Prediction Feed */}
          <PredictionFeed />
        </div>
      </div>
    </>
  );
}
