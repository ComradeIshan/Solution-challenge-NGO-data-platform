
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import InsaneLineChart from "../components/charts/InsaneLineChart";
import InsaneBarChart from "../components/charts/InsaneBarChart";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (mirrors landing + auth)
───────────────────────────────────────── */
const EASE   = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 340, damping: 28 };

const T = {
  ff: "'Fraunces', serif",
  fb: "'DM Sans', sans-serif",
  green:  "#22c55e", greenMid: "#16a34a", greenLight: "#dcfce7",
  blue:   "#3b82f6", blueMid:  "#2563eb", blueLight:  "#dbeafe",
  teal:   "#14b8a6", tealLight: "#ccfbf1",
  purple: "#8b5cf6", purpleLight: "#ede9fe",
  amber:  "#f89f06", amberLight: "#fef3c7",
  g50: "#fafaf9", g100: "#f4f4f5", g200: "#e4e4e7",
  g400: "#a1a1aa", g500: "#71717a", g600: "#52525b",
  g800: "#1f2937", g900: "#111827",
};

/* stagger container */
const stagger = (delay = 0.05, staggerChildren = 0.09) => ({
  hidden: {},
  show:   { transition: { staggerChildren, delayChildren: delay } },
});
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.45, ease: EASE } },
};


/* ═══════════════════════════════════════════════════════
   SECTION HEADER  (reusable)
═══════════════════════════════════════════════════════ */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: T.fb, fontSize: "10.5px", fontWeight: 600,
      color: T.g400, textTransform: "uppercase", letterSpacing: "0.9px",
      marginBottom: "14px",
    }}>
      {children}
    </p>
  );
}


/* ═══════════════════════════════════════════════════════
   GLASS CARD  (base wrapper used everywhere)
═══════════════════════════════════════════════════════ */
function GlassCard({ children, style = {}, hoverGlow = false, className = "" }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -4,
        boxShadow: hoverGlow
          ? "0 16px 48px rgba(34,197,94,0.08), 0 8px 24px rgba(0,0,0,0.07)"
          : "0 16px 48px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)",
      }}
      transition={SPRING}
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   COUNT-UP HOOK
═══════════════════════════════════════════════════════ */
function useCountUp(target, duration = 1400, started = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) raf = requestAnimationFrame(step);
      else setVal(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);
  return val;
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return n.toString();
}


/* ═══════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, suffix = "", delta, deltaLabel, gradient, iconBg, delay = 0 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count  = useCountUp(value, 1500, inView);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      transition={{ delay }}
      whileHover={{ y: -5, transition: SPRING }}
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.75)",
        borderRadius: "20px",
        padding: "24px 24px 20px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.28s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.9)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
      }}
    >
      {/* gradient wash top-right */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: gradient, opacity: 0.18,
        pointerEvents: "none",
      }} />
      {/* top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: gradient, opacity: 0.7,
        borderRadius: "20px 20px 0 0",
      }} />

      {/* icon */}
      <div style={{
        width: 42, height: 42, borderRadius: "12px",
        background: iconBg, display: "flex",
        alignItems: "center", justifyContent: "center",
        marginBottom: "16px", fontSize: "18px",
      }}>
        {icon}
      </div>

      {/* number */}
      <div style={{
        display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "4px",
      }}>
        <span style={{
          fontFamily: T.ff, fontSize: "32px", fontWeight: 500,
          color: T.g900, lineHeight: 1, letterSpacing: "-0.5px",
        }}>
          {formatNum(count)}
        </span>
        {suffix && (
          <span style={{ fontFamily: T.ff, fontSize: "18px", color: T.g400 }}>{suffix}</span>
        )}
      </div>

      {/* label */}
      <p style={{
        fontFamily: T.fb, fontSize: "13px", color: T.g500,
        marginBottom: "12px", fontWeight: 400,
      }}>
        {label}
      </p>

      {/* delta badge */}
      {delta !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "3px",
            background: delta >= 0 ? T.greenLight : "#fef2f2",
            color: delta >= 0 ? T.greenMid : "#dc2626",
            fontSize: "11px", fontWeight: 600,
            padding: "2px 8px", borderRadius: "100px",
            fontFamily: T.fb,
          }}>
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}%
          </span>
          <span style={{ fontSize: "11px", color: T.g400, fontFamily: T.fb }}>
            {deltaLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   MINI SPARKLINE  (div-based, animated on mount)
═══════════════════════════════════════════════════════ */
function Sparkline({ data, color, height = 40 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const max    = Math.max(...data);
  const min    = Math.min(...data);
  const norm = (v) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - norm(v),
  }));

  const pathD = pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cpx  = (prev.x + p.x) / 2;
    return `${d} C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
  }, "");

  const fillD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div ref={ref} style={{ width: "100%", height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {inView && (
          <>
            <motion.path
              d={fillD}
              fill={`url(#sg-${color.replace("#","")})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </>
        )}
      </svg>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   LINE CHART CARD
═══════════════════════════════════════════════════════ */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const GROWTH_VOL  = [1200, 2100, 2800, 3600, 4200, 5100, 6300, 7200, 8800, 10400, 12100, 14800];
const GROWTH_NGO  = [80,   130,  190,  260,  310,  380,  440,  530,  620,  740,   880,   1040];

function LineChartCard() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("volunteers");
  const data = active === "volunteers" ? GROWTH_VOL : GROWTH_NGO;
  const color = active === "volunteers" ? T.blue : T.green;
  const max  = Math.max(...data);

  return (
    <GlassCard style={{ padding: "28px 28px 20px", flex: "1 1 0" }}>
      <div ref={ref}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontFamily: T.ff, fontSize: "17px", fontWeight: 500, color: T.g900, marginBottom: "3px" }}>
              Platform Growth
            </h3>
            <p style={{ fontFamily: T.fb, fontSize: "12px", color: T.g400 }}>
              Cumulative since January 2024
            </p>
          </div>
          {/* toggle pills */}
          <div style={{
            display: "flex", gap: "4px", background: T.g100,
            borderRadius: "10px", padding: "3px",
          }}>
            {["volunteers", "ngos"].map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                style={{
                  padding: "5px 12px", borderRadius: "8px", border: "none",
                  background: active === t ? "#fff" : "transparent",
                  fontFamily: T.fb, fontSize: "11.5px", fontWeight: 500,
                  color: active === t ? T.g900 : T.g400,
                  cursor: "pointer",
                  boxShadow: active === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.18s ease",
                }}
              >
                {t === "volunteers" ? "Volunteers" : "NGOs"}
              </button>
            ))}
          </div>
        </div>

        {/* current value hero */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "20px" }}>
          <span style={{ fontFamily: T.ff, fontSize: "36px", fontWeight: 500, color: T.g900, letterSpacing: "-0.6px", lineHeight: 1 }}>
            {formatNum(data[data.length - 1])}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "3px",
            background: T.greenLight, color: T.greenMid,
            fontSize: "11px", fontWeight: 600, padding: "2px 8px",
            borderRadius: "100px", fontFamily: T.fb,
          }}>
            ↑ 22.3% vs last month
          </span>
        </div>

        {/* sparkline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkline data={data} color={color} height={80} />
          </motion.div>
        </AnimatePresence>

        {/* x-axis labels */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: "8px",
        }}>
          {MONTHS.map((m, i) => (
            <span key={m} style={{
              fontFamily: T.fb, fontSize: "9.5px", color: i % 2 === 0 ? T.g400 : "transparent",
              letterSpacing: "0.2px",
            }}>
              {m}
            </span>
          ))}
        </div>

        {/* mini data points row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px", marginTop: "20px", paddingTop: "16px",
          borderTop: `1px solid ${T.g100}`,
        }}>
          {[
            { l: "Peak month", v: formatNum(max) },
            { l: "Avg / month", v: formatNum(Math.round(data.reduce((a, b) => a + b) / data.length)) },
            { l: "YTD growth",  v: `+${Math.round(((data[11] - data[0]) / data[0]) * 100)}%` },
          ].map((s) => (
            <div key={s.l}>
              <p style={{ fontFamily: T.ff, fontSize: "16px", fontWeight: 500, color: T.g900 }}>{s.v}</p>
              <p style={{ fontFamily: T.fb, fontSize: "10.5px", color: T.g400, marginTop: "2px" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}


/* ═══════════════════════════════════════════════════════
   BAR CHART CARD
═══════════════════════════════════════════════════════ */
const MONTHLY_ACT = [
  { m: "Jul", matches: 840,  camps: 32 },
  { m: "Aug", matches: 1100, camps: 41 },
  { m: "Sep", matches: 960,  camps: 38 },
  { m: "Oct", matches: 1340, camps: 55 },
  { m: "Nov", matches: 1580, camps: 62 },
  { m: "Dec", matches: 1820, camps: 74 },
];

function BarChartCard() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(null);
  const maxMatches = Math.max(...MONTHLY_ACT.map((d) => d.matches));

  return (
    <GlassCard style={{ padding: "28px 28px 20px", flex: "1 1 0" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontFamily: T.ff, fontSize: "17px", fontWeight: 500, color: T.g900, marginBottom: "3px" }}>
            Monthly Activity
          </h3>
          <p style={{ fontFamily: T.fb, fontSize: "12px", color: T.g400 }}>
            Matches made & campaigns run
          </p>
        </div>
        {/* legend */}
        <div style={{ display: "flex", gap: "14px" }}>
          {[{ color: T.blue, label: "Matches" }, { color: T.green, label: "Campaigns" }].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span style={{ fontFamily: T.fb, fontSize: "11px", color: T.g500 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bars */}
      <div ref={ref} style={{ display: "flex", gap: "12px", alignItems: "flex-end", height: "120px" }}>
        {MONTHLY_ACT.map((d, i) => {
          const pct   = (d.matches / maxMatches) * 100;
          const pctC  = (d.camps   / 74)         * 100;
          const isHov = hovered === i;

          return (
            <div
              key={d.m}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "default" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* tooltip */}
              <AnimatePresence>
                {isHov && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute",
                      background: T.g900, color: "#fff",
                      fontSize: "11px", fontFamily: T.fb,
                      padding: "5px 9px", borderRadius: "8px",
                      whiteSpace: "nowrap", zIndex: 10,
                      pointerEvents: "none",
                      transform: "translateY(-110%)",
                    }}
                  >
                    {d.matches.toLocaleString()} matches · {d.camps} campaigns
                  </motion.div>
                )}
              </AnimatePresence>

              {/* bar group */}
              <div style={{
                width: "100%", display: "flex", gap: "2px",
                alignItems: "flex-end", height: "100px",
                position: "relative",
              }}>
                {/* matches bar */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                  style={{
                    flex: 1, borderRadius: "4px 4px 0 0",
                    background: isHov
                      ? `linear-gradient(180deg,${T.blue},${T.blueMid})`
                      : `linear-gradient(180deg,rgba(59,130,246,0.7),rgba(37,99,235,0.8))`,
                    height: `${pct}%`,
                    transformOrigin: "bottom",
                    transition: "background 0.2s ease",
                    minHeight: 3,
                  }}
                />
                {/* campaigns bar */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.07 + 0.06, ease: EASE }}
                  style={{
                    flex: 1, borderRadius: "4px 4px 0 0",
                    background: isHov
                      ? `linear-gradient(180deg,${T.green},${T.greenMid})`
                      : `linear-gradient(180deg,rgba(34,197,94,0.65),rgba(22,163,74,0.75))`,
                    height: `${pctC}%`,
                    transformOrigin: "bottom",
                    transition: "background 0.2s ease",
                    minHeight: 3,
                  }}
                />
              </div>
              {/* month label */}
              <span style={{ fontFamily: T.fb, fontSize: "10px", color: isHov ? T.g800 : T.g400, transition: "color 0.18s" }}>
                {d.m}
              </span>
            </div>
          );
        })}
      </div>

      {/* summary */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${T.g100}`,
      }}>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { l: "Total matches", v: MONTHLY_ACT.reduce((a, b) => a + b.matches, 0).toLocaleString() },
            { l: "Total campaigns", v: MONTHLY_ACT.reduce((a, b) => a + b.camps, 0).toString() },
          ].map((s) => (
            <div key={s.l}>
              <p style={{ fontFamily: T.ff, fontSize: "16px", fontWeight: 500, color: T.g900 }}>{s.v}</p>
              <p style={{ fontFamily: T.fb, fontSize: "10.5px", color: T.g400, marginTop: "2px" }}>{s.l}</p>
            </div>
          ))}
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: T.blueLight, color: T.blueMid,
          fontSize: "11px", fontWeight: 600,
          padding: "4px 10px", borderRadius: "100px", fontFamily: T.fb,
        }}>
          ↑ 14.8% vs H1
        </span>
      </div>
    </GlassCard>
  );
}


/* ═══════════════════════════════════════════════════════
   DONUT RING  (div-based conic-gradient)
═══════════════════════════════════════════════════════ */
function DonutRing({ pct, color, size = 72, stroke = 8 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const t0 = performance.now();
    const dur = 1000;
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(e * pct));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, pct]);

  const bg = `conic-gradient(${color} 0% ${displayed}%, #f0f0f0 ${displayed}% 100%)`;

  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: bg,
        transition: "background 0.04s linear",
      }} />
      {/* inner cutout */}
      <div style={{
        position: "absolute",
        top: stroke, left: stroke, right: stroke, bottom: stroke,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: T.fb, fontSize: "12px", fontWeight: 600, color: T.g800 }}>
          {displayed}%
        </span>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   PERFORMANCE CARD
═══════════════════════════════════════════════════════ */
function PerfCard({ icon, title, subtitle, pct, color, trend, detail }) {
  return (
    <GlassCard style={{ padding: "22px 22px 18px" }} hoverGlow>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <h4 style={{ fontFamily: T.fb, fontSize: "13.5px", fontWeight: 600, color: T.g800 }}>
              {title}
            </h4>
          </div>
          <p style={{ fontFamily: T.fb, fontSize: "11.5px", color: T.g400, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          background: trend >= 0 ? T.greenLight : "#fef2f2",
          color: trend >= 0 ? T.greenMid : "#dc2626",
          fontSize: "10.5px", fontWeight: 600,
          padding: "2px 8px", borderRadius: "100px", fontFamily: T.fb,
          flexShrink: 0,
        }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <DonutRing pct={pct} color={color} size={64} stroke={7} />
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: T.ff, fontSize: "22px", fontWeight: 500,
            color: T.g900, lineHeight: 1, marginBottom: "4px",
          }}>
            {pct}%
          </p>
          <p style={{ fontFamily: T.fb, fontSize: "11.5px", color: T.g500, lineHeight: 1.55 }}>
            {detail}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}


/* ═══════════════════════════════════════════════════════
   ACTIVITY ITEM
═══════════════════════════════════════════════════════ */
function ActivityItem({ icon, iconBg, text, time, accent }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 3, transition: { duration: 0.18 } }}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 0",
        borderBottom: `1px solid ${T.g100}`,
        cursor: "default",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "10px",
        background: iconBg, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: "15px", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: T.fb, fontSize: "13px", color: T.g800,
          fontWeight: 500, lineHeight: 1.4,
        }}>
          {text}
        </p>
        <p style={{ fontFamily: T.fb, fontSize: "11px", color: T.g400, marginTop: "2px" }}>
          {time}
        </p>
      </div>
      {accent && (
        <span style={{
          fontSize: "10.5px", fontWeight: 600,
          color: accent.color, background: accent.bg,
          padding: "2px 8px", borderRadius: "100px",
          fontFamily: T.fb, flexShrink: 0,
        }}>
          {accent.label}
        </span>
      )}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   MINI PROGRESS BAR (for regional section)
═══════════════════════════════════════════════════════ */
function ProgressRow({ label, value, max, color }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const pct    = Math.round((value / max) * 100);

  return (
    <div ref={ref} style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontFamily: T.fb, fontSize: "12px", color: T.g600, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: T.fb, fontSize: "12px", color: T.g400 }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: "5px", borderRadius: "100px", background: T.g100, overflow: "hidden" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={inView ? { width: `${pct}%` } : { width: "0%" }}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{ height: "100%", borderRadius: "100px", background: color }}
        />
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   LIVE PULSE BADGE
═══════════════════════════════════════════════════════ */
function LiveBadge() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: T.greenLight, borderRadius: "100px",
      padding: "4px 12px",
    }}>
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }}
      />
      <span style={{
        fontFamily: T.fb, fontSize: "11px", fontWeight: 600,
        color: T.greenMid, letterSpacing: "0.4px",
      }}>
        Live Data
      </span>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   HEATMAP STRIP  (7-day activity)
═══════════════════════════════════════════════════════ */
function IndiaNeedMap() {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState("");
  const initializedRef = useRef(false);

  useEffect(() => {
    const hotspots = [
      {
        name: "Madhya Pradesh",
        lat: 23.4733,
        lng: 77.9470,
        color: "#dc2626",
        level: "Critical need",
        score: "92%",
        radius: 220000,
      },
      {
        name: "Bihar",
        lat: 25.0961,
        lng: 85.3131,
        color: "#f97316",
        level: "High need",
        score: "84%",
        radius: 190000,
      },
      {
        name: "Odisha",
        lat: 20.9517,
        lng: 85.0985,
        color: "#f59e0b",
        level: "High need",
        score: "79%",
        radius: 180000,
      },
      {
        name: "Rajasthan",
        lat: 27.0238,
        lng: 74.2179,
        color: "#eab308",
        level: "Moderate need",
        score: "68%",
        radius: 210000,
      },
      {
        name: "Assam",
        lat: 26.2006,
        lng: 92.9376,
        color: "#22c55e",
        level: "Rising need",
        score: "61%",
        radius: 170000,
      },
    ];

    const cleanupFns = [];

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps || initializedRef.current) return;
      initializedRef.current = true;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.9734, lng: 78.6569 },
        zoom: 5,
        mapTypeId: "roadmap",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy",
        clickableIcons: false,
        styles: [
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#4b5563" }],
          },
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      hotspots.forEach((spot) => {
        const center = { lat: spot.lat, lng: spot.lng };

        const circle = new window.google.maps.Circle({
          strokeColor: spot.color,
          strokeOpacity: 0.55,
          strokeWeight: 1.5,
          fillColor: spot.color,
          fillOpacity: 0.16,
          map,
          center,
          radius: spot.radius,
        });

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          title: `${spot.name} — ${spot.level}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: spot.color,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
            scale: 8,
          },
          zIndex: 20,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="min-width:148px;padding:2px 2px 0 2px;font-family:DM Sans,Arial,sans-serif;">
              <div style="font-size:12px;font-weight:700;color:#111827;margin-bottom:4px;">${spot.name}</div>
              <div style="font-size:10px;color:#6b7280;margin-bottom:6px;">${spot.level}</div>
              <div style="display:inline-block;padding:3px 8px;border-radius:999px;background:${spot.color}18;color:${spot.color};font-size:10px;font-weight:700;">
                Need score ${spot.score}
              </div>
            </div>
          `,
          disableAutoPan: true,
        });

        infoWindow.open({ anchor: marker, map, shouldFocus: false });

        const clickHandler = () => infoWindow.open({ anchor: marker, map, shouldFocus: false });
        marker.addListener("click", clickHandler);

        cleanupFns.push(() => {
          infoWindow.close();
          marker.setMap(null);
          circle.setMap(null);
        });
      });
    };

    if (window.google?.maps) {
      initMap();
      return () => {
        cleanupFns.forEach((fn) => fn());
        initializedRef.current = false;
      };
    }

    const existingScript = document.getElementById("google-maps-script-unitynet");

    const handleLoad = () => initMap();
    const handleError = () => {
      setMapError("Google Maps failed to load. Add your API key in Analytics.jsx.");
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
        cleanupFns.forEach((fn) => fn());
        initializedRef.current = false;
      };
    }

    const script = document.createElement("script");
    script.id = "google-maps-script-unitynet";
    script.async = true;
    script.defer = true;
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA7dcBYHl72IYgR8vxFqr5q6-H0r9dE-sE";
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
      cleanupFns.forEach((fn) => fn());
      initializedRef.current = false;
    };
  }, []);

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "360px",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          background: "#f8fafc",
        }}
      >
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            pointerEvents: "none",
          }}
        />

        {mapError && (
          <div
            style={{
              position: "absolute",
              left: "16px",
              right: "16px",
              bottom: "16px",
              padding: "10px 12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              fontFamily: T.fb,
              fontSize: "11.5px",
              color: T.g600,
              zIndex: 3,
            }}
          >
            {mapError}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          marginTop: "14px",
        }}
      >
        {[
          { label: "Critical", color: "#dc2626" },
          { label: "High", color: "#f97316" },
          { label: "Moderate", color: "#eab308" },
          { label: "Rising", color: "#22c55e" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: item.color,
              }}
            />
            <span
              style={{
                fontFamily: T.fb,
                fontSize: "10.5px",
                color: T.g500,
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN ANALYTICS PAGE
═══════════════════════════════════════════════════════ */
export default function Analytics() {
  const [timeRange, setTimeRange] = useState("12m");
  const [now] = useState(new Date());
  const fmt = (d) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);

  /* ── Recent activity ── */
  const activity = [
    { icon: "🙋", iconBg: T.blueLight,   text: "3 volunteers joined — Bengaluru chapter", time: fmt(new Date(now - 4*60000)),    accent: { label: "New", color: T.blueMid, bg: T.blueLight } },
    { icon: "🏢", iconBg: T.greenLight,  text: "Asha Foundation NGO registered",          time: fmt(new Date(now - 11*60000)),   accent: { label: "NGO", color: T.greenMid, bg: T.greenLight } },
    { icon: "🎯", iconBg: T.purpleLight, text: "AI matched 7 volunteers → Clean Ganga",   time: fmt(new Date(now - 28*60000)),   accent: { label: "Match", color: T.purple, bg: T.purpleLight } },
    { icon: "✅", iconBg: T.tealLight,   text: "Literacy Drive campaign completed",        time: fmt(new Date(now - 52*60000)),   accent: { label: "Done", color: T.teal, bg: T.tealLight } },
    { icon: "❤️", iconBg: "#fce7f3",     text: "+42 beneficiaries reached in Odisha",     time: fmt(new Date(now - 1.5*3600000)), accent: null },
    { icon: "📊", iconBg: T.amberLight,  text: "Monthly impact report auto-generated",    time: fmt(new Date(now - 3*3600000)),  accent: null },
    { icon: "🌱", iconBg: T.greenLight,  text: "Reforestation campaign — 800 saplings",   time: fmt(new Date(now - 5*3600000)),  accent: { label: "Impact", color: T.greenMid, bg: T.greenLight } },
  ];

    return (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: EASE }}
    style={{
      minHeight: "100vh",
      background: "#f7f7f6",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* 🔥 GLOBAL AMBIENT GLOW */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `
          radial-gradient(600px at 20% 20%, rgba(59,130,246,0.08), transparent),
          radial-gradient(600px at 80% 80%, rgba(34,197,94,0.08), transparent)
        `,
        zIndex: 0,
      }}
    />


      {/* ALL YOUR EXISTING CONTENT GOES HERE */}
      {/* ── fake inner scroll area (assumes sidebar already present) ── */}
      
      
      <div
  style={{
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "36px 32px 64px",
    position: "relative",
    zIndex: 1, // ✅ VERY IMPORTANT
  }}
>

        {/* ════════════════════════════════
            HEADER
        ════════════════════════════════ */}
        <motion.div
          variants={stagger(0, 0.1)}
          initial="hidden"
          animate="show"
          style={{ marginBottom: "36px" }}
        >
          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <LiveBadge />
            <span style={{ fontFamily: T.fb, fontSize: "11px", color: T.g400 }}>
              Last updated: {fmt(now)}
            </span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{
                fontFamily: T.ff, fontSize: "clamp(26px,2.8vw,36px)",
                fontWeight: 500, color: T.g900, letterSpacing: "-0.5px",
                lineHeight: 1.1, marginBottom: "6px",
              }}>
                Analytics
              </h1>
              <p style={{ fontFamily: T.fb, fontSize: "14px", color: T.g500, lineHeight: 1.5 }}>
                Track your impact and platform growth in real time.
              </p>
            </div>

            {/* time range selector */}
            <div style={{
              display: "flex", gap: "3px",
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.7)",
              borderRadius: "12px", padding: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              {["7d", "30d", "3m", "12m"].map((r) => (
                <motion.button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "6px 14px", borderRadius: "9px", border: "none",
                    background: timeRange === r ? T.g900 : "transparent",
                    color: timeRange === r ? "#fff" : T.g500,
                    fontFamily: T.fb, fontSize: "12px", fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    letterSpacing: "0.01em",
                  }}
                >
                  {r}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════
            STAT CARDS  (4-grid)
        ════════════════════════════════ */}
        <SectionLabel>Overview</SectionLabel>
        <motion.div
          variants={stagger(0.06, 0.1)}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px", marginBottom: "28px",
          }}
        >
          <StatCard
            icon="🤝" label="Total Volunteers"
            value={48420} delta={12.4} deltaLabel="vs last month"
            gradient="linear-gradient(135deg,#3b82f6,#06b6d4)"
            iconBg={T.blueLight}
          />
          <StatCard
            icon="🏢" label="Active NGOs"
            value={2418} delta={8.1} deltaLabel="vs last month"
            gradient="linear-gradient(135deg,#22c55e,#10b981)"
            iconBg={T.greenLight}
          />
          <StatCard
            icon="❤️" label="Lives Impacted"
            value={4810000} delta={21.7} deltaLabel="vs last month"
            gradient="linear-gradient(135deg,#f43f5e,#fb923c)"
            iconBg="#ffe4e6"
          />
          <StatCard
            icon="⚡" label="Match Success Rate"
            value={96} suffix="%" delta={2.3} deltaLabel="vs last month"
            gradient="linear-gradient(135deg,#8b5cf6,#6366f1)"
            iconBg={T.purpleLight}
          />
        </motion.div>

        {/* ════════════════════════════════
            CHARTS ROW
        ════════════════════════════════ */}
        <SectionLabel>Growth & Activity</SectionLabel>
        <motion.div
          variants={stagger(0.08, 0.12)}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "16px", marginBottom: "28px",
          }}
        >
          <>
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 160 }}
  >
    <InsaneLineChart />
  </motion.div>

  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 160 }}
  >
    <InsaneBarChart />
  </motion.div>
</>
        </motion.div>

        {/* ════════════════════════════════
            ACTIVITY + PERFORMANCE + REGION
        ════════════════════════════════ */}
        <SectionLabel>Insights</SectionLabel>
        <motion.div
          variants={stagger(0.06, 0.1)}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "16px", marginBottom: "28px",
          }}
        >
          {/* Activity feed */}
          <GlassCard style={{ padding: "24px 24px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <h3 style={{ fontFamily: T.ff, fontSize: "17px", fontWeight: 500, color: T.g900 }}>
                Recent Activity
              </h3>
              <motion.button
                whileHover={{ color: T.blueMid }}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.fb, fontSize: "12px", color: T.g400 }}
              >
                View all →
              </motion.button>
            </div>
            <p style={{ fontFamily: T.fb, fontSize: "11.5px", color: T.g400, marginBottom: "4px" }}>
              Platform events across all regions
            </p>
            <motion.div variants={stagger(0.12, 0.08)} initial="hidden" animate="show">
              {activity.map((a, i) => (
                <ActivityItem key={i} {...a} />
              ))}
            </motion.div>
          </GlassCard>

          {/* Right column: performance + region */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* performance cards */}
            <PerfCard
              icon="🎯" title="Matching Efficiency"
              subtitle="Volunteers placed per campaign"
              pct={94} color={T.blue} trend={3.2}
              detail="4.7 avg volunteers per active campaign this month"
            />
            <PerfCard
              icon="⚡" title="Engagement Rate"
              subtitle="Active users / registered users"
              pct={78} color={T.green} trend={1.8}
              detail="78% of registered volunteers active in last 30 days"
            />
            <PerfCard
              icon="⏱️" title="Response Time"
              subtitle="Avg time to first volunteer match"
              pct={88} color={T.purple} trend={-0.4}
              detail="3.2 hrs avg first-match time (down from 4.1 hrs)"
            />
          </div>
        </motion.div>

        {/* ════════════════════════════════
            BOTTOM ROW: Heatmap + Regional
        ════════════════════════════════ */}
        <motion.div
          variants={stagger(0.08, 0.12)}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Activity heatmap */}
          <GlassCard style={{ padding: "24px" }}>
            <h3 style={{ fontFamily: T.ff, fontSize: "17px", fontWeight: 500, color: T.g900, marginBottom: "4px" }}>
              Activity Heatmap
            </h3>
            <p style={{ fontFamily: T.fb, fontSize: "11.5px", color: T.g400, marginBottom: "18px" }}>
              Google Maps India view with highlighted regions where NGO support is needed most
            </p>
            <IndiaNeedMap />
            {/* legend */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px" }}>
              <span style={{ fontFamily: T.fb, fontSize: "10px", color: T.g400 }}>Less</span>
              {["#f0f0f0", T.greenLight, "#86efac", "#4ade80", "#16a34a"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "2px", background: c }} />
              ))}
              <span style={{ fontFamily: T.fb, fontSize: "10px", color: T.g400 }}>More</span>
            </div>
          </GlassCard>

          {/* Regional breakdown */}
          <GlassCard style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <h3 style={{ fontFamily: T.ff, fontSize: "17px", fontWeight: 500, color: T.g900 }}>
                Regional Reach
              </h3>
              <span style={{
                fontFamily: T.fb, fontSize: "11px", color: T.g400,
                background: T.g100, padding: "3px 10px", borderRadius: "100px",
              }}>
                India focus
              </span>
            </div>
            <p style={{ fontFamily: T.fb, fontSize: "11.5px", color: T.g400, marginBottom: "20px" }}>
              Active volunteers by state
            </p>
            {[
              { label: "Maharashtra",   value: 9240,  max: 9240,  color: `linear-gradient(90deg,${T.blue},${T.blueMid})` },
              { label: "Karnataka",     value: 7820,  max: 9240,  color: `linear-gradient(90deg,${T.green},${T.greenMid})` },
              { label: "Tamil Nadu",    value: 6440,  max: 9240,  color: `linear-gradient(90deg,${T.teal},#0891b2)` },
              { label: "Delhi NCR",     value: 5880,  max: 9240,  color: `linear-gradient(90deg,${T.purple},#6366f1)` },
              { label: "West Bengal",   value: 4210,  max: 9240,  color: `linear-gradient(90deg,${T.amber},#f97316)` },
              { label: "Andhra Pradesh",value: 3560,  max: 9240,  color: `linear-gradient(90deg,#f43f5e,#fb923c)` },
            ].map((r) => (
              <ProgressRow key={r.label} {...r} />
            ))}
          </GlassCard>
        </motion.div>

      </div>
    </motion.div>
  );
}
