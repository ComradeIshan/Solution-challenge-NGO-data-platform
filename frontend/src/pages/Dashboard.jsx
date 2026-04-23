import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Users, Building2, Heart, TrendingUp, Bell, Search,
  ArrowUpRight, Leaf, Handshake, Globe, Sparkles,
  ChevronRight, MapPin, Clock, CheckCircle2, Zap,
  BarChart2, Activity, Star, Plus
} from "lucide-react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  green: "#22c55e",
  greenDark: "#16a34a",
  teal: "#14b8a6",
  blue: "#3b82f6",
  text: "#0f172a",
  secondary: "#475569",
  muted: "#94a3b8",
};

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 }
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const slideIn = {
  hidden: { opacity: 0, x: 32 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, type: "spring", stiffness: 240, damping: 20 }
  }),
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const impactData = [
  { month: "Jan", impact: 12000, ngos: 28, sevaks: 340 },
  { month: "Feb", impact: 19000, ngos: 35, sevaks: 520 },
  { month: "Mar", impact: 28000, ngos: 42, sevaks: 680 },
  { month: "Apr", impact: 38000, ngos: 55, sevaks: 890 },
  { month: "May", impact: 52000, ngos: 68, sevaks: 1120 },
  { month: "Jun", impact: 71000, ngos: 82, sevaks: 1450 },
  { month: "Jul", impact: 95000, ngos: 96, sevaks: 1780 },
  { month: "Aug", impact: 124000, ngos: 115, sevaks: 2200 },
];

const ngoActivity = [
  { name: "ChildFirst", tasks: 84, matched: 71 },
  { name: "GreenEarth", tasks: 63, matched: 55 },
  { name: "FoodForAll", tasks: 97, matched: 88 },
  { name: "EduReach", tasks: 52, matched: 47 },
  { name: "HealthBridge", tasks: 76, matched: 64 },
  { name: "WaterHope", tasks: 45, matched: 38 },
];

const activityFeed = [
  { id: 1, name: "Priya Sharma", action: "joined ChildFirst Foundation", time: "2m ago", avatar: "PS", color: "#22c55e" },
  { id: 2, name: "Rahul Verma", action: "completed 10 volunteer hours", time: "8m ago", avatar: "RV", color: "#3b82f6" },
  { id: 3, name: "Meena Patel", action: "matched with GreenEarth NGO", time: "15m ago", avatar: "MP", color: "#14b8a6" },
  { id: 4, name: "Arjun Nair", action: "referred 3 new Sevaks", time: "32m ago", avatar: "AN", color: "#f59e0b" },
  { id: 5, name: "Sunita Rao", action: "completed skill assessment", time: "1h ago", avatar: "SR", color: "#8b5cf6" },
  { id: 6, name: "Kiran Das", action: "registered as NGO coordinator", time: "2h ago", avatar: "KD", color: "#ef4444" },
];

const opportunities = [
  { id: 1, ngo: "ChildFirst Foundation", task: "After-school tutoring program for underprivileged students in Grade 5–8", location: "Delhi NCR", tag: "Education", color: "#22c55e" },
  { id: 2, ngo: "GreenEarth Alliance", task: "Urban plantation drive & community awareness campaign", location: "Bangalore", tag: "Environment", color: "#14b8a6" },
  { id: 3, ngo: "FoodForAll Trust", task: "Weekend meal distribution & kitchen volunteering", location: "Mumbai", tag: "Food Security", color: "#3b82f6" },
];

const statsData = [
  { label: "Total Sevaks", value: 12847, icon: Users, suffix: "", color: "#22c55e", bg: "from-green-50 to-emerald-50", glow: "rgba(34,197,94,0.15)" },
  { label: "NGOs Registered", value: 348, icon: Building2, suffix: "+", color: "#3b82f6", bg: "from-blue-50 to-sky-50", glow: "rgba(59,130,246,0.15)" },
  { label: "Lives Impacted", value: 4800000, icon: Heart, suffix: "", color: "#14b8a6", bg: "from-teal-50 to-cyan-50", glow: "rgba(20,184,166,0.15)" },
  { label: "Match Rate", value: 94, icon: TrendingUp, suffix: "%", color: "#f59e0b", bg: "from-amber-50 to-yellow-50", glow: "rgba(245,158,11,0.15)" },
];

// ─── COUNT UP HOOK ────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

// ─── BACKGROUND BLOBS ─────────────────────────────────────────────────────────
function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* blob 1 */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* blob 2 */}
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: "absolute", top: "20%", right: "-8%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* blob 3 */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}

// ─── GLASS CARD ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", style = {}, hover = true, glowColor = "rgba(34,197,94,0.08)" }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: `0 20px 60px ${glowColor}, 0 4px 20px rgba(0,0,0,0.06)` } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={className}
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 20, r = 10 }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      style={{ width: w, height: h, borderRadius: r, background: "linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)", backgroundSize: "200% 100%" }}
    />
  );
}

// ─── STATS CARD ───────────────────────────────────────────────────────────────
function StatsCard({ stat, index, loading }) {
  const { count, ref } = useCountUp(stat.value);
  const Icon = stat.icon;

  const fmt = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <motion.div variants={fadeUp} custom={index}>
      <GlassCard glowColor={stat.glow} style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Skeleton w={40} h={40} r={12} />
            <Skeleton w="60%" h={32} r={8} />
            <Skeleton w="80%" h={16} r={6} />
          </div>
        ) : (
          <div ref={ref}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${stat.color}25`,
              }}>
                <Icon size={20} color={stat.color} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "rgba(34,197,94,0.08)", borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                <ArrowUpRight size={12} color="#22c55e" />
                <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>+12%</span>
              </motion.div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {fmt(count)}<span style={{ color: stat.color }}>{stat.suffix}</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
            {/* progress bar */}
            <div style={{ marginTop: 16, height: 3, borderRadius: 4, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ delay: index * 0.1 + 0.6, duration: 1, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }}
              />
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
      border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12,
      padding: "10px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    }}>
      <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, color: p.color, fontWeight: 700, margin: "2px 0" }}>
          {p.name}: <span style={{ color: COLORS.text }}>{typeof p.value === "number" && p.value > 1000 ? (p.value / 1000).toFixed(1) + "K" : p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── CHART CARD ───────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div variants={fadeUp} custom={delay}>
      <GlassCard style={{ padding: "24px" }} hover={false}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, margin: 0 }}>{title}</h3>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 0" }}>{subtitle}</p>
        </div>
        {children}
      </GlassCard>
    </motion.div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
function ActivityFeed() {
  return (
    <motion.div variants={fadeUp} custom={3}>
      <GlassCard style={{ padding: "24px", height: "100%" }} hover={false}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, margin: 0 }}>Live Activity</h3>
            <p style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 0" }}>Real-time updates</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 4px rgba(34,197,94,0.2)" }}
          />
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {activityFeed.map((item, i) => (
            <motion.div
              key={item.id}
              variants={slideIn}
              custom={i}
              whileHover={{ x: 4, background: "rgba(34,197,94,0.04)" }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                marginBottom: 4, transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: `${item.color}20`, border: `1.5px solid ${item.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: item.color,
              }}>
                {item.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: COLORS.text, margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
                  {item.name} <span style={{ color: COLORS.secondary, fontWeight: 400 }}>{item.action}</span>
                </p>
                <p style={{ fontSize: 11, color: COLORS.muted, margin: "3px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={10} /> {item.time}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}

// ─── OPPORTUNITY CARD ─────────────────────────────────────────────────────────
function OpportunityCard({ opp, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={fadeUp} custom={index}>
      <GlassCard
        glowColor={`${opp.color}20`}
        style={{ padding: "22px", cursor: "pointer", overflow: "hidden", position: "relative" }}
      >
        {/* accent line */}
        <motion.div
          animate={{ height: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", left: 0, top: 0, width: 3,
            background: `linear-gradient(180deg, ${opp.color}, ${opp.color}40)`,
            borderRadius: "0 0 0 0",
          }}
        />
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: opp.color,
              background: `${opp.color}15`, borderRadius: 20, padding: "3px 10px",
              border: `1px solid ${opp.color}25`,
            }}>{opp.tag}</span>
            <span style={{ fontSize: 11, color: COLORS.muted, display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin size={10} /> {opp.location}
            </span>
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: "0 0 6px", lineHeight: 1.4 }}>{opp.ngo}</h4>
          <p style={{ fontSize: 12, color: COLORS.secondary, margin: "0 0 16px", lineHeight: 1.6 }}>{opp.task}</p>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 8px 24px ${opp.color}30` }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: `linear-gradient(135deg, ${opp.color}, ${opp.color}cc)`,
              color: "#fff", border: "none", borderRadius: 30,
              padding: "8px 18px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            Apply Now <ChevronRight size={13} />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── IMPACT HIGHLIGHT ─────────────────────────────────────────────────────────
function ImpactHighlight() {
  const floatIcons = [
    { Icon: Leaf, color: "#22c55e", x: "8%", y: "20%", delay: 0 },
    { Icon: Handshake, color: "#3b82f6", x: "85%", y: "15%", delay: 1.2 },
    { Icon: Globe, color: "#14b8a6", x: "15%", y: "70%", delay: 0.6 },
    { Icon: Star, color: "#f59e0b", x: "80%", y: "75%", delay: 1.8 },
    { Icon: Sparkles, color: "#8b5cf6", x: "50%", y: "10%", delay: 0.9 },
  ];

  return (
    <motion.div
      variants={fadeUp}
      custom={5}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 24,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2027 100%)",
        padding: "64px 40px", textAlign: "center", marginBottom: 32,
      }}
    >
      {/* animated bg glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", width: 500, height: 300,
          background: "radial-gradient(ellipse, rgba(34,197,94,0.25) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none",
        }}
      />

      {/* floating icons */}
      {floatIcons.map(({ Icon, color, x, y, delay }, i) => (
        <motion.div
          key={i}
          animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay }}
          style={{
            position: "absolute", left: x, top: y,
            width: 40, height: 40, borderRadius: 12,
            background: `${color}20`, border: `1px solid ${color}30`,
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={18} color={color} />
        </motion.div>
      ))}

      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
            🌱 Collective Impact
          </p>
          <h2 style={{
            fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 900,
            color: "#fff", margin: 0, letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            4.8<span style={{ color: "#22c55e" }}>M</span>
          </h2>
          <p style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", marginTop: 8, fontWeight: 500 }}>
            Lives Touched & Transformed
          </p>
        </motion.div>

        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40, flexWrap: "wrap" }}>
          {[
            { icon: "🤝", val: "12,847", label: "Active Sevaks" },
            { icon: "🏢", val: "348", label: "Partner NGOs" },
            { icon: "🌍", val: "28", label: "States Covered" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.3, type: "spring" }}
              viewport={{ once: true }}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{item.val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const [notifCount] = useState(5);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 36,
      }}
    >
      <div>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #22c55e, #14b8a6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
          }}>
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Digital Sevaks
          </span>
        </motion.div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: COLORS.text, margin: 0, letterSpacing: "-0.03em" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "4px 0 0", fontWeight: 500 }}>
          Your impact overview — <span style={{ color: "#22c55e" }}>all systems active</span>
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* search pill */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)", borderRadius: 30,
            padding: "8px 16px", cursor: "pointer",
          }}
        >
          <Search size={14} color={COLORS.muted} />
          <span style={{ fontSize: 13, color: COLORS.muted }}>Search...</span>
        </motion.div>

        {/* bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "relative", width: 42, height: 42, borderRadius: 14,
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Bell size={18} color={COLORS.secondary} />
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: "absolute", top: 8, right: 8,
              width: 8, height: 8, borderRadius: "50%",
              background: "#ef4444", border: "2px solid white",
            }}
          />
        </motion.button>

        {/* avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: 42, height: 42, borderRadius: 14,
            background: "linear-gradient(135deg, #22c55e, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
            cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
          }}
        >
          AS
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 30%, #eff6ff 65%, #f0f9ff 100%)",
      fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif",
      position: "relative",
    }}>
      <BackgroundBlobs />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <Header />

        {/* STATS GRID */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}
        >
          {statsData.map((stat, i) => (
            <StatsCard key={stat.label} stat={stat} index={i} loading={loading} />
          ))}
        </motion.div>

        {/* MAIN GRID: CHARTS + FEED */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 24 }}
        >
          {/* LEFT: charts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* AREA CHART */}
            <ChartCard title="Impact Over Time" subtitle="Lives touched across all NGO activities" delay={0}>
              {loading ? (
                <Skeleton w="100%" h={200} r={12} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={impactData}>
                    <defs>
                      <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="sevaksGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + "K" : v} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="impact" name="Impact" stroke="#22c55e" strokeWidth={2.5} fill="url(#impactGrad)" dot={false} activeDot={{ r: 5, fill: "#22c55e" }} />
                    <Area type="monotone" dataKey="sevaks" name="Sevaks" stroke="#3b82f6" strokeWidth={2} fill="url(#sevaksGrad)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* BAR CHART */}
            <ChartCard title="NGO Activity Breakdown" subtitle="Tasks posted vs. volunteers matched" delay={1}>
              {loading ? (
                <Skeleton w="100%" h={180} r={12} />
              ) : (
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={ngoActivity} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tasks" name="Tasks" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="matched" name="Matched" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* RIGHT: activity feed */}
          <ActivityFeed />
        </motion.div>

        {/* IMPACT HIGHLIGHT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
        >
          <ImpactHighlight />
        </motion.div>

        {/* OPPORTUNITIES */}
        <div style={{ marginBottom: 24 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, margin: 0, letterSpacing: "-0.02em" }}>
                Open Opportunities
              </h2>
              <p style={{ fontSize: 13, color: COLORS.muted, margin: "4px 0 0" }}>Matched to your skills & location</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(34,197,94,0.25)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#fff", border: "none", borderRadius: 30,
                padding: "9px 20px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Plus size={14} /> View All
            </motion.button>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {opportunities.map((opp, i) => (
              <OpportunityCard key={opp.id} opp={opp} index={i} />
            ))}
          </motion.div>
        </div>

        {/* FOOTER ROW */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "24px 0", borderTop: "1px solid rgba(0,0,0,0.05)" }}
        >
          <CheckCircle2 size={14} color="#22c55e" />
          <span style={{ fontSize: 12, color: COLORS.muted }}>All systems operational · Digital Sevaks Platform v2.4</span>
        </motion.div>
      </div>
    </div>
  );
}