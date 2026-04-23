import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  green: "#22c55e",
  greenLight: "#f0fdf4",
  greenMid: "#dcfce7",
  blue: "#3b82f6",
  blueLight: "#eff6ff",
  teal: "#14b8a6",
  tealLight: "#f0fdfa",
  text: "#0f172a",
  textSub: "#475569",
  textMuted: "#94a3b8",
  border: "rgba(15,23,42,0.07)",
  bg: "#ffffff",
  surface: "#f8fafc",
  font: "'Inter', system-ui, sans-serif",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.1)",
  radius: "16px",
  radiusSm: "10px",
};



// ─── Animated counter hook ──────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, inView = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return value;
}

// ─── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  suffix = "",
  prefix = "",
  accent,
  icon,
  delay,
  inView,
  trend,
}) {
  const count = useCountUp(value, 1600, inView);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useSpring(x, { stiffness: 200, damping: 24 });
  const glowY = useSpring(y, { stiffness: 200, damping: 24 });

  const glowXTrans = useTransform(glowX, (v) => v - 80);
const glowYTrans = useTransform(glowY, (v) => v - 80);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const accentLight =
    accent === T.green
      ? T.greenLight
      : accent === T.blue
        ? T.blueLight
        : T.tealLight;
  const accentMid =
    accent === T.green ? T.greenMid : accent === T.blue ? "#dbeafe" : "#ccfbf1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        x.set(0);
        y.set(0);
      }}
      onMouseMove={onMouseMove}
      style={{
        position: "relative",
        background: T.bg,
        border: `1px solid ${hovered ? accent + "35" : T.border}`,
        borderRadius: T.radius,
        padding: "20px 22px",
        cursor: "default",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 12px 30px rgba(0,0,0,0.12), 0 0 0 1px ${accent}20`
          : "0 4px 14px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s",
        flex: "1 1 0",
        minWidth: 0,
      }}
    >
      {/* Cursor glow */}
      {hovered && (
  <motion.div
    style={{
      position: "absolute",
      width: 160,
      height: 160,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
      x: glowXTrans,
      y: glowYTrans,
      pointerEvents: "none",
    }}
  />
)}

      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: accentLight,
            border: `1px solid ${accentMid}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
          }}
        >
          {icon}
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: T.greenLight,
              borderRadius: "20px",
              padding: "3px 9px",
            }}
          >
            <span style={{ fontSize: "11px", color: T.green, fontWeight: 600 }}>
              ↑ {trend}
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: T.font,
          fontSize: "clamp(22px, 2.5vw, 28px)",
          fontWeight: 800,
          color: T.text,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: T.font,
          fontSize: "13px",
          fontWeight: 500,
          color: T.textMuted,
        }}
      >
        {label}
      </div>

      {/* Bottom accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.3, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: "12%",
          right: "12%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
          borderRadius: "2px 2px 0 0",
          transformOrigin: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </motion.div>
  );
}

// ─── Animated SVG Line Chart ────────────────────────────────────────────────────
function LineChart({ inView }) {
  const W = 420,
    H = 140;
  const data = [32, 48, 38, 65, 52, 74, 61, 88, 72, 95, 82, 100];
  const pad = { t: 16, r: 16, b: 24, l: 32 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const minV = Math.min(...data);
  const maxV = Math.max(...data);
  const normalize = (v) => 1 - (v - minV) / (maxV - minV);

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * cw,
    y: pad.t + normalize(v) * ch,
  }));

  // Build smooth cubic bezier path
  const pathD = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M${pt.x},${pt.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
  }, "");

  // Fill area path
  const fillD = `${pathD} L${pts[pts.length - 1].x},${pad.t + ch} L${pts[0].x},${pad.t + ch} Z`;

  // Y grid lines
  const yTicks = [0, 0.33, 0.67, 1].map((t) => pad.t + t * ch);
  // X labels
  const xLabels = ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"];
  const xLabelPts = [0, 2, 4, 6, 8, 10, 11].map((i) => pts[i]?.x ?? 0);

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.green} stopOpacity="0.18" />
            <stop offset="100%" stopColor={T.green} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={T.blue} />
            <stop offset="60%" stopColor={T.green} />
            <stop offset="100%" stopColor={T.teal} />
          </linearGradient>
          <clipPath id="chartClip">
            <motion.rect
              x="0"
              y="0"
              height={H + 10}
              initial={{ width: 0 }}
              animate={inView ? { width: W + 10 } : {}}
              transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
            />
          </clipPath>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {yTicks.map((y, i) => (
          <line
            key={i}
            x1={pad.l}
            y1={y}
            x2={W - pad.r}
            y2={y}
            stroke={T.border}
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}

        {/* Fill area */}
        <motion.path
          d={fillD}
          fill="url(#chartFill)"
          clipPath="url(#chartClip)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        />

        {/* Main line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#chartLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#chartClip)"
        />

        {/* Data points */}
        {pts.map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3.5"
            fill={T.bg}
            stroke={i === pts.length - 1 ? T.green : T.blue}
            strokeWidth="2"
            filter={i === pts.length - 1 ? "url(#dotGlow)" : "none"}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 1.3 + i * 0.04 }}
            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
          />
        ))}

        {/* X axis labels */}
        {xLabels.map((label, i) => (
          <text
            key={label}
            x={xLabelPts[i]}
            y={H - 2}
            textAnchor="middle"
            style={{
              fontFamily: T.font,
              fontSize: "10px",
              fill: T.textMuted,
              fontWeight: 500,
            }}
          >
            {label}
          </text>
        ))}

        {/* Y axis ticks */}
        {[100, 67, 33, 0].map((v, i) => (
          <text
            key={v}
            x={pad.l - 6}
            y={yTicks[i] + 4}
            textAnchor="end"
            style={{ fontFamily: T.font, fontSize: "10px", fill: T.textMuted }}
          >
            {v}
          </text>
        ))}

        {/* Live dot with pulse */}
        {inView && (
          <>
            <motion.circle
              cx={pts[pts.length - 1].x}
              cy={pts[pts.length - 1].y}
              r="10"
              fill={T.green}
              fillOpacity="0.15"
              animate={{ r: [6, 14, 6], opacity: [0.3, 0, 0.3] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <circle
              cx={pts[pts.length - 1].x}
              cy={pts[pts.length - 1].y}
              r="4"
              fill={T.green}
              style={{ filter: `drop-shadow(0 0 4px ${T.green})` }}
            />
          </>
        )}
      </svg>
    </div>
  );
}

// ─── Progress Bar ───────────────────────────────────────────────────────────────
function ProgressBar({ label, value, accent, delay, inView }) {
  const accentLight =
    accent === T.green
      ? T.greenLight
      : accent === T.blue
        ? T.blueLight
        : T.tealLight;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: T.font,
            fontSize: "12px",
            fontWeight: 500,
            color: T.textSub,
          }}
        >
          {label}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.4 }}
          style={{
            fontFamily: T.font,
            fontSize: "12px",
            fontWeight: 700,
            color: T.text,
          }}
        >
          {value}%
        </motion.span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "99px",
          background: accentLight,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", borderRadius: "99px", background: accent }}
        />
      </div>
    </div>
  );
}

// ─── Activity Feed Item ─────────────────────────────────────────────────────────
function ActivityItem({ icon, text, time, accent, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "8px",
          background:
            accent === T.green
              ? T.greenLight
              : accent === T.blue
                ? T.blueLight
                : T.tealLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: T.font,
          fontSize: "12px",
          color: T.textSub,
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>
      <span
        style={{
          fontFamily: T.font,
          fontSize: "11px",
          color: T.textMuted,
          flexShrink: 0,
        }}
      >
        {time}
      </span>
    </motion.div>
  );
}

// ─── Magnetic CTA Button ────────────────────────────────────────────────────────
function CTAButton({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const [hov, setHov] = useState(false);

  return (
   <motion.button
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 260, damping: 18 }}
      ref={ref}
      style={{
        x: sx,
        y: sy,
        fontFamily: T.font,
        fontSize: "15px",
        fontWeight: 600,
        color: "#fff",
        background: hov
          ? `linear-gradient(135deg, #16a34a 0%, #2563eb 100%)`
          : `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`,
        border: "none",
        borderRadius: "50px",
        padding: "14px 32px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: hov
          ? `0 8px 30px rgba(34,197,94,0.35), 0 2px 8px rgba(0,0,0,0.1)`
          : `0 4px 16px rgba(34,197,94,0.25), 0 1px 4px rgba(0,0,0,0.06)`,
        transition: "background 0.3s, box-shadow 0.3s",
        letterSpacing: "0.01em",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.28);
        y.set((e.clientY - r.top - r.height / 2) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        setHov(false);
      }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >
      <span>{children}</span>
      <motion.span
        animate={hov ? { x: 5 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        →
      </motion.span>
    </motion.button>
  );
}

// ─── Dashboard Panel ────────────────────────────────────────────────────────────
function DashboardPanel({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "24px",
        padding: "clamp(16px, 2.5vw, 28px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 12px 48px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "4px",
        }}
      >
        {["#f87171", "#fbbf24", "#4ade80"].map((c) => (
          <div
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: "24px",
            background: T.bg,
            borderRadius: "6px",
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
          }}
        >
          <span
            style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font }}
          >
            app.unitynet.io/dashboard
          </span>
        </div>
      </div>

      {/* Metric cards row */}
      <div style={{ display: "flex", gap: "10px" }}>
        <MetricCard
          label="Volunteers Matched"
          value={48200}
          suffix="+"
          accent={T.green}
          icon="🤝"
          delay={0.35}
          inView={inView}
          trend="12%"
        />
        <MetricCard
          label="Campaigns Active"
          value={2847}
          accent={T.blue}
          icon="📋"
          delay={0.48}
          inView={inView}
          trend="8%"
        />
        <MetricCard
          label="Impact Score"
          value={9.4}
          suffix=""
          prefix=""
          accent={T.teal}
          icon="⚡"
          delay={0.61}
          inView={inView}
          trend="0.3"
        />
      </div>

      {/* Chart section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.55 }}
        style={{
          background: "transparent",
          borderRadius: T.radius,
          border: "none",
          padding: "16px 16px 8px",
          transform: "scale(1.02)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.font,
                fontSize: "13px",
                fontWeight: 700,
                color: T.text,
              }}
            >
              Impact Growth
            </div>
            <div
              style={{
                fontFamily: T.font,
                fontSize: "11px",
                color: T.textMuted,
              }}
            >
              Volunteers served · 2024
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["1M", "3M", "1Y"].map((t, i) => (
              <div
                key={t}
                style={{
                  fontFamily: T.font,
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: i === 2 ? T.greenLight : "transparent",
                  color: i === 2 ? T.green : T.textMuted,
                  border:
                    i === 2
                      ? `1px solid ${T.greenMid}`
                      : "1px solid transparent",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <LineChart inView={inView} />
      </motion.div>

      {/* Bottom: progress + activity */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {/* Progress bars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{
            flex: "1 1 160px",
            background: "transparent",
            borderRadius: T.radius,
            border: "none",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontFamily: T.font,
              fontSize: "13px",
              fontWeight: 700,
              color: T.text,
              marginBottom: "2px",
            }}
          >
            Goal Progress
          </div>
          <ProgressBar
            label="Volunteer Reach"
            value={78}
            accent={T.green}
            delay={0.85}
            inView={inView}
          />
          <ProgressBar
            label="Campaign Fill Rate"
            value={63}
            accent={T.blue}
            delay={0.95}
            inView={inView}
          />
          <ProgressBar
            label="Donor Retention"
            value={91}
            accent={T.teal}
            delay={1.05}
            inView={inView}
          />
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.78 }}
          style={{
            flex: "1 1 180px",
            background: "transparent",
            borderRadius: T.radius,
            border: "none",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontFamily: T.font,
              fontSize: "13px",
              fontWeight: 700,
              color: T.text,
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Live Feed
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.green,
              }}
            />
          </div>
          <ActivityItem
            icon="🤝"
            text="Sarah matched with Red Cross Kenya"
            time="2m"
            accent={T.green}
            delay={0.9}
            inView={inView}
          />
          <ActivityItem
            icon="📋"
            text="Clean Water campaign hit 100% fill"
            time="8m"
            accent={T.blue}
            delay={1.0}
            inView={inView}
          />
          <ActivityItem
            icon="🌍"
            text="3 new NGOs verified in South Asia"
            time="15m"
            accent={T.teal}
            delay={1.1}
            inView={inView}
          />
          <ActivityItem
            icon="⚡"
            text="Impact score updated: +0.3 pts"
            time="22m"
            accent={T.green}
            delay={1.2}
            inView={inView}
          />
        </motion.div>
      </div>

      {/* Floating ambient blob inside panel */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.green}12, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </motion.div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────
export default function LiveImpactDashboard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 72px)",
        position: "relative",
        overflow: "hidden",
        fontFamily: T.font,
      }}
    >
      {/* Subtle background tint blobs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-80px",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.green}0d, transparent 65%)`,
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "5%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.blue}0d, transparent 65%)`,
            filter: "blur(60px)",
          }}
        />
      </div>

      <motion.div
  animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
  transition={{ duration: 18, repeat: Infinity }}
  style={{
    position: "absolute",
    top: "30%",
    left: "40%",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(20,184,166,0.08), transparent 70%)",
    filter: "blur(70px)",
  }}
/>

      <motion.div style={{ perspective: 1200 }}>
  <motion.div
    initial={{ rotateX: 6, rotateY: -6 }}
    animate={inView ? { rotateX: 0, rotateY: 0 } : {}}
    transition={{ duration: 1 }}
    style={{
      position: "relative",
      zIndex: 1,
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
      gap: "clamp(40px, 6vw, 80px)",
      alignItems: "center",
    }}
  >
        {/* ── Left column ── */}

        <motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={inView ? { opacity: 1, x: 0 } : {}}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "clamp(20px, 3vw, 28px)",
  }}
>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: T.greenLight,
              border: `1px solid ${T.greenMid}`,
              borderRadius: "50px",
              padding: "6px 14px",
              width: "fit-content",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: T.green,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: T.green,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Live Dashboard
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(28px, 4.5vw, 48px)",
              fontWeight: 800,
              color: T.text,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            See Your Impact{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in Real Time
            </span>
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "clamp(15px, 1.6vw, 17px)",
              fontWeight: 300,
              color: T.textSub,
              lineHeight: 1.75,
              margin: 0,
              maxWidth: "400px",
            }}
          >
            Every volunteer matched, every campaign filled, every life touched —
            measured and visible in a live dashboard built for NGOs and donors
            who demand accountability.
          </motion.p>

          {/* Feature bullets */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              {
                icon: "📊",
                text: "Real-time metrics — updated every 30 seconds",
              },
              { icon: "🤖", text: "AI-generated weekly impact summaries" },
              {
                icon: "🔗",
                text: "Shareable reports for donors and stakeholders",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: T.greenLight,
                    border: `1px solid ${T.greenMid}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: T.textSub,
                    fontWeight: 400,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.42 }}
            whileHover={{ scale: 1.05 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              paddingTop: "4px",
            }}
          >
           <CTAButton>View Live Demo</CTAButton>
            <span
              style={{ fontSize: "13px", color: T.textMuted, fontWeight: 400 }}
            >
              No signup · Instant access
            </span>
          </motion.div>

          {/* Social proof strip */}
<motion.div
  initial={{ opacity: 0 }}
  animate={inView ? { opacity: 1 } : {}}
  transition={{ duration: 0.5, delay: 0.6 }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: T.surface,
    borderRadius: T.radiusSm,
    border: `1px solid ${T.border}`,
    width: "fit-content",
  }}
>
  <div style={{ display: "flex" }}>
    {["#fb923c", "#a78bfa", "#34d399", "#60a5fa"].map((c, i) => (
      <div
        key={c}
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: c,
          border: "2px solid white",
          marginLeft: i > 0 ? "-8px" : 0,
          zIndex: 4 - i,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        }}
      >
        {["🧑", "👩", "🧑", "👨"][i]}
      </div>
    ))}
  </div>

  <div>
    <div style={{ fontSize: "12px", fontWeight: 700, color: T.text }}>
      2,900+ NGOs
    </div>
    <div style={{ fontSize: "11px", color: T.textMuted }}>
      tracking impact live
    </div>
  </div>
</motion.div>

</motion.div> {/* ✅ LEFT COLUMN END */}


{/* ── RIGHT COLUMN (MISSING PART) ── */}
<div style={{ position: "relative", zIndex: 2 }}>
  <DashboardPanel inView={inView} />
</div>

</motion.div> {/* ✅ GRID END */}
</motion.div> {/* ✅ PERSPECTIVE END */}

</section>
  );
}
