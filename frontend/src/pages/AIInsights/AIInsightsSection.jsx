// src/pages/AI insights/AIInsightsSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { analyzeNgoWebsiteWithGroq } from "./groqNgoAnalyzer.js";
import InsightCard from "./InsightCard";
import HeatmapGrid from "./HeatmapGrid";
import PredictionPanel from "./PredictionPanel";
import SmartFeed from "./SmartFeed";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_URLS = [
  "https://www.akshayapatra.org/",
  "https://goonj.org/",
  "https://www.pratham.org/",
  "https://www.teachforindia.org/",
  "https://www.smilefoundationindia.org/",
];

const LOADING_MESSAGES = [
  "Reading NGO website...",
  "Extracting public information...",
  "Detecting social impact areas...",
  "Mapping volunteer opportunities...",
  "Generating structured AI report...",
];

const SEVERITY_COLORS = {
  Low: {
    bg: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.4)",
    text: "#4ade80",
  },
  Medium: {
    bg: "rgba(251,191,36,0.15)",
    border: "rgba(251,191,36,0.4)",
    text: "#fbbf24",
  },
  High: {
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.4)",
    text: "#f87171",
  },
};

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "linear-gradient(135deg, #0a0f1e 0%, #0d1528 50%, #0a0f1e 100%)",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassHover: "rgba(255,255,255,0.07)",
  accent: "#6366f1",
  accentGlow: "rgba(99,102,241,0.3)",
  accentSoft: "rgba(99,102,241,0.15)",
  teal: "#2dd4bf",
  tealGlow: "rgba(45,212,191,0.25)",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  card: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.07)",
};

// ─── Tiny Helpers ─────────────────────────────────────────────────────────────

const Chip = ({ children, color = T.accent }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.03em",
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      marginRight: 6,
      marginBottom: 6,
    }}
  >
    {children}
  </span>
);

const SeverityBadge = ({ level }) => {
  const c = SEVERITY_COLORS[level] || SEVERITY_COLORS.Medium;
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {level}
    </span>
  );
};

const SectionHeading = ({ icon, title, count }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}
  >
    <span style={{ fontSize: 20 }}>{icon}</span>
    <h3
      style={{
        margin: 0,
        fontSize: 17,
        fontWeight: 700,
        color: T.text,
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </h3>
    {count != null && (
      <span
        style={{
          marginLeft: 4,
          padding: "1px 9px",
          borderRadius: 10,
          fontSize: 11,
          fontWeight: 700,
          background: T.accentSoft,
          color: T.accent,
          border: `1px solid ${T.accentGlow}`,
        }}
      >
        {count}
      </span>
    )}
  </div>
);

const GlassCard = ({ children, style = {} }) => (
  <div
    style={{
      background: T.card,
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 16,
      padding: "18px 20px",
      backdropFilter: "blur(12px)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Loading Panel ─────────────────────────────────────────────────────────────

const LoadingPanel = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1 < LOADING_MESSAGES.length ? i + 1 : i));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        gap: 28,
      }}
    >
      {/* Animated orb */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid transparent`,
            borderTopColor: T.accent,
            borderRightColor: T.teal,
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: `2px solid transparent`,
            borderTopColor: T.teal,
            borderLeftColor: T.accent,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.accentSoft} 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          🔍
        </div>
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          style={{
            margin: 0,
            fontSize: 15,
            color: T.textMuted,
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          {LOADING_MESSAGES[msgIdx]}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {LOADING_MESSAGES.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: i <= msgIdx ? 1 : 0.25,
              scale: i === msgIdx ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i <= msgIdx ? T.accent : T.textDim,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ─── Section: NGO Summary ──────────────────────────────────────────────────────

const NgoSummarySection = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 }}
  >
    <SectionHeading icon="🏛️" title="NGO Summary" />
    <GlassCard>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11,
              color: T.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Name
          </p>
          <p
            style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}
          >
            {data.name}
          </p>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11,
              color: T.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Location
          </p>
          <p style={{ margin: 0, fontSize: 14, color: T.textMuted }}>
            {data.location}
          </p>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 11,
              color: T.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Mission
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: T.textMuted,
              lineHeight: 1.6,
            }}
          >
            {data.mission}
          </p>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 11,
              color: T.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Target Groups
          </p>
          <div>
            {data.targetGroups.map((g, i) => (
              <Chip key={i} color={T.teal}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 11,
              color: T.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Focus Areas
          </p>
          <div>
            {data.focusAreas.map((a, i) => (
              <Chip key={i} color={T.accent}>
                {a}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

// ─── Section: Problem Areas ────────────────────────────────────────────────────

const ProblemAreasSection = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <SectionHeading
      icon="⚠️"
      title="Problem Areas Detected"
      count={data.length}
    />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 14,
      }}
    >
      {data.map((item, i) => (
        <GlassCard key={i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
                flex: 1,
                paddingRight: 8,
              }}
            >
              {item.title}
            </p>
            <SeverityBadge level={item.severity} />
          </div>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              color: T.textMuted,
              lineHeight: 1.6,
            }}
          >
            {item.description}
          </p>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${T.glassBorder}`,
            }}
          >
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 10,
                color: T.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Evidence
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: T.textMuted,
                fontStyle: "italic",
              }}
            >
              {item.evidenceFromWebsite}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);

// ─── Section: Volunteer Needs ──────────────────────────────────────────────────

const VolunteerNeedsSection = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
  >
    <SectionHeading icon="🤝" title="Volunteer Needs" count={data.length} />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 14,
      }}
    >
      {data.map((item, i) => (
        <GlassCard key={i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
              }}
            >
              {item.role}
            </p>
            <SeverityBadge level={item.priority} />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: T.textMuted,
              lineHeight: 1.6,
            }}
          >
            {item.reason}
          </p>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);

// ─── Section: Impact Insights ──────────────────────────────────────────────────

const ImpactInsightsSection = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <SectionHeading icon="📈" title="Impact Insights" count={data.length} />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 14,
      }}
    >
      {data.map((item, i) => (
        <GlassCard key={i} style={{ borderLeft: `3px solid ${T.teal}` }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 13,
              color: T.textMuted,
              lineHeight: 1.6,
            }}
          >
            {item.insight}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: T.teal }}>📊</span>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: T.teal,
                fontWeight: 500,
              }}
            >
              {item.metricOrEvidence}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);

// ─── Section: AI-Powered Digital Suggestions ────────────────────────────────────────────

const DigitalSevaksSuggestionsSection = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25 }}
  >
    <SectionHeading
      icon="💡"
      title="AI-Powered Digital Suggestions"
      count={data.length}
    />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 14,
      }}
    >
      {data.map((item, i) => (
        <GlassCard key={i} style={{ borderLeft: `3px solid ${T.accent}` }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 13,
              color: T.textMuted,
              lineHeight: 1.6,
            }}
          >
            {item.suggestion}
          </p>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              background: T.accentSoft,
              border: `1px solid ${T.accentGlow}`,
            }}
          >
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 10,
                color: T.accent,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontWeight: 700,
              }}
            >
              Expected Benefit
            </p>
            <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
              {item.expectedBenefit}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);

// ─── Section: AI Score Cards ───────────────────────────────────────────────────

const AiScoreCardsSection = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <SectionHeading icon="🎯" title="AI Score Cards" />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 14,
      }}
    >
      {data.map((item, i) => {
        const pct = Math.min(100, Math.max(0, item.score));
        const color = pct >= 70 ? "#4ade80" : pct >= 45 ? "#fbbf24" : "#f87171";
        return (
          <GlassCard key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.text,
                }}
              >
                {item.label}
              </p>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pct}
              </span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 5,
                borderRadius: 3,
                background: "rgba(255,255,255,0.08)",
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  delay: 0.4 + i * 0.05,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                style={{
                  height: "100%",
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                }}
              />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: T.textMuted,
                lineHeight: 1.5,
              }}
            >
              {item.reason}
            </p>
          </GlassCard>
        );
      })}
    </div>
  </motion.div>
);

// ─── Error Card ────────────────────────────────────────────────────────────────

const ErrorCard = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{
      background: "rgba(239,68,68,0.07)",
      border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: 16,
      padding: "28px 24px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 36, marginBottom: 14 }}>⚠️</div>
    <p
      style={{
        margin: "0 0 8px",
        fontSize: 16,
        fontWeight: 700,
        color: "#fca5a5",
      }}
    >
      Analysis Failed
    </p>
    <p
      style={{
        margin: "0 0 20px",
        fontSize: 14,
        color: "#94a3b8",
        lineHeight: 1.6,
      }}
    >
      {message}
    </p>
    <button
      onClick={onRetry}
      style={{
        padding: "10px 24px",
        borderRadius: 10,
        border: "1px solid rgba(239,68,68,0.35)",
        background: "rgba(239,68,68,0.12)",
        color: "#fca5a5",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Try Again
    </button>
  </motion.div>
);

// ─── Original AI Insights Dashboard Fallback ─────────────────────────────────
const OLD_INSIGHT_CARDS = [
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
      { v: 22 },
      { v: 28 },
      { v: 25 },
      { v: 34 },
      { v: 30 },
      { v: 38 },
      { v: 35 },
      { v: 42 },
      { v: 40 },
      { v: 48 },
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
      { v: 60 },
      { v: 72 },
      { v: 68 },
      { v: 84 },
      { v: 90 },
      { v: 88 },
      { v: 98 },
      { v: 106 },
      { v: 112 },
      { v: 127 },
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
      { v: 2.1 },
      { v: 2.4 },
      { v: 2.9 },
      { v: 3.2 },
      { v: 3.6 },
      { v: 3.9 },
      { v: 4.1 },
      { v: 4.4 },
      { v: 4.6 },
      { v: 4.8 },
    ],
  },
];

function StaticInsightsDashboard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} style={{ marginBottom: 40 }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{
          marginBottom: 28,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            {/* Animated AI badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #22c55e, #14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
              }}
            >
              🧠
            </motion.div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  fontFamily: "'DM Sans', system-ui",
                  margin: 0,
                }}
              >
                Powered by Sevaks AI
              </p>
            </div>
            {/* Live badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#16a34a",
                  fontFamily: "'DM Sans', system-ui",
                }}
              >
                Real-time
              </span>
            </div>
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.03em",
              fontFamily: "'DM Sans', system-ui",
            }}
          >
            AI Insights & Predictive Analytics
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              margin: "6px 0 0",
              fontFamily: "'DM Sans', system-ui",
            }}
          >
            Machine learning models trained on 18 months of volunteer + NGO data
          </p>
        </div>

        <motion.button
          whileHover={{
            scale: 1.04,
            boxShadow: "0 8px 24px rgba(34,197,94,0.25)",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: 30,
            padding: "11px 22px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'DM Sans', system-ui",
            boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          🔮 Full AI Report
        </motion.button>
      </motion.div>

      {/* AI Insight Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {OLD_INSIGHT_CARDS.map((card, i) => (
          <InsightCard key={i} card={card} index={i} />
        ))}
      </div>

      {/* Heatmap — full width */}
      <div style={{ marginBottom: 20 }}>
        <HeatmapGrid />
      </div>

      {/* Bottom: Prediction Panel + Smart Feed (65/35 split) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 16,
          alignItems: "start",
        }}
      >
        <PredictionPanel />
        <SmartFeed />
      </div>
    </section>
  );
}
// ─── Main Component ────────────────────────────────────────────────────────────

export default function AIInsightsSection() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | result | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const resultRef = useRef(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    setResult(null);
    setErrorMsg("");
    try {
      const data = await analyzeNgoWebsiteWithGroq(url.trim());
      setResult(data);
      setStatus("result");
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        200,
      );
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setUrl("");
    setErrorMsg("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        padding: "48px 24px 80px",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        color: T.text,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 44 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 16px",
              borderRadius: 20,
              background: T.accentSoft,
              border: `1px solid ${T.accentGlow}`,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 12 }}>⚡</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.accent,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Powered by Groq AI
            </span>
          </div>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${T.text} 0%, ${T.accent} 60%, ${T.teal} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI NGO Website Intelligence
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 560,
              marginInline: "auto",
              fontSize: 15,
              color: T.textMuted,
              lineHeight: 1.7,
            }}
          >
            Paste any NGO website URL and DigitalSevaks AI will convert
            scattered public information into structured impact intelligence.
          </p>
        </motion.div>

        {/* ── Input Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            background: T.glass,
            border: `1px solid ${T.glassBorder}`,
            borderRadius: 20,
            padding: "28px 28px 24px",
            backdropFilter: "blur(16px)",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 14,
              color: T.textMuted,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Enter the website URL of the NGO that you want to help, donate to,
            or work with.
          </p>

          {/* Input row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://www.example-ngo.org"
              disabled={status === "loading"}
              style={{
                flex: 1,
                padding: "13px 18px",
                borderRadius: 12,
                border: `1px solid ${T.glassBorder}`,
                background: "rgba(255,255,255,0.05)",
                color: T.text,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e) => (e.target.style.borderColor = T.glassBorder)}
            />
            <motion.button
              onClick={handleAnalyze}
              disabled={status === "loading" || !url.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                border: "none",
                background:
                  status === "loading" || !url.trim()
                    ? "rgba(99,102,241,0.35)"
                    : `linear-gradient(135deg, ${T.accent}, #8b5cf6)`,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor:
                  status === "loading" || !url.trim()
                    ? "not-allowed"
                    : "pointer",
                whiteSpace: "nowrap",
                boxShadow:
                  status === "loading" || !url.trim()
                    ? "none"
                    : `0 4px 20px ${T.accentGlow}`,
                transition: "all 0.2s",
              }}
            >
              {status === "loading" ? "Analyzing..." : "Analyze NGO Website"}
            </motion.button>
          </div>

          {/* Helper text */}
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 12,
              color: T.textDim,
              textAlign: "center",
            }}
          >
            Use this to understand NGO mission, focus areas, volunteer needs,
            and donation impact before taking action.
          </p>

          {/* Demo URL chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {DEMO_URLS.map((durl, i) => (
              <motion.button
                key={i}
                onClick={() => setUrl(durl)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                disabled={status === "loading"}
                style={{
                  padding: "4px 12px",
                  borderRadius: 16,
                  border: `1px solid ${T.glassBorder}`,
                  background: "rgba(255,255,255,0.03)",
                  color: T.textMuted,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = T.accent;
                  e.target.style.color = T.accent;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = T.glassBorder;
                  e.target.style.color = T.textMuted;
                }}
              >
                {new URL(durl).hostname.replace("www.", "")}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── States ── */}
        <AnimatePresence mode="wait">
          {/* Default dashboard - keeps old AI Insights visible instead of blank */}
          {status === "idle" && (
            <motion.div
              key="default-dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                background:
                  "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 35%, #eff6ff 100%)",
                borderRadius: 28,
                padding: "28px",
                border: "1px solid rgba(255,255,255,0.72)",
                boxShadow: "0 18px 60px rgba(15,23,42,0.14)",
                overflow: "hidden",
              }}
            >
              <StaticInsightsDashboard />
            </motion.div>
          )}

          {/* Loading */}
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: T.glass,
                border: `1px solid ${T.glassBorder}`,
                borderRadius: 20,
                backdropFilter: "blur(16px)",
                overflow: "hidden",
              }}
            >
              <LoadingPanel />
            </motion.div>
          )}

          {/* Error */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorCard message={errorMsg} onRetry={() => setStatus("idle")} />
            </motion.div>
          )}

          {/* Result */}
          {status === "result" && result && (
            <motion.div
              key="result"
              ref={resultRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 32 }}
            >
              {/* Result header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: T.textDim,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Analysis complete
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.text,
                    }}
                  >
                    {result.ngoSummary.name}
                  </p>
                </div>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 12,
                    border: `1px solid ${T.glassBorder}`,
                    background: T.glass,
                    color: T.textMuted,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ↩ Analyze Another NGO
                </motion.button>
              </div>

              <NgoSummarySection data={result.ngoSummary} />
              <ProblemAreasSection data={result.problemAreasDetected} />
              <VolunteerNeedsSection data={result.volunteerNeeds} />
              <ImpactInsightsSection data={result.impactInsights} />
              <DigitalSevaksSuggestionsSection
                data={result.DigitalSevaksSuggestions}
              />
              <AiScoreCardsSection data={result.aiScoreCards} />

              {/* Bottom reset button */}
              <div style={{ textAlign: "center", paddingTop: 8 }}>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "12px 32px",
                    borderRadius: 14,
                    border: `1px solid ${T.accentGlow}`,
                    background: T.accentSoft,
                    color: T.accent,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🔄 Analyze Another NGO
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
