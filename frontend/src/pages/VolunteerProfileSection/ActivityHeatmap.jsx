import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

// Generate 52 weeks × 7 days of mock data
function generateHeatmapData() {
  const weeks = 52;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      // Weighted random — more activity recently
      const recency = w / weeks;
      const base = Math.random();
      const val = base < 0.35 ? 0 : Math.min(4, Math.floor((base + recency * 0.4) * 5));
      week.push(val);
    }
    data.push(week);
  }
  // Ensure last few weeks are active
  for (let w = 48; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      if (Math.random() > 0.25) data[w][d] = Math.floor(Math.random() * 3) + 2;
    }
  }
  return data;
}

const HEATMAP_DATA = generateHeatmapData();

const LEVEL_COLORS = [
  "transparent",
  `${T.green}30`,
  `${T.green}55`,
  `${T.green}80`,
  T.green,
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["","M","","W","","F",""];

function HeatCell({ val, weekIdx, dayIdx, inView }) {
  const [hov, setHov] = useState(false);
  const totalDelay = (weekIdx * 7 + dayIdx) * 0.002;

  const labels = ["No activity", "1–2 hours", "3–4 hours", "5–6 hours", "7+ hours"];

  return (
    <div style={{ position: "relative" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.25, delay: totalDelay }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: "clamp(8px,1.2vw,12px)",
          height: "clamp(8px,1.2vw,12px)",
          borderRadius: 2,
          background: val === 0 ? `${T.border}` : LEVEL_COLORS[val],
          cursor: "default",
          border: hov && val > 0 ? `1px solid ${T.green}80` : "none",
          boxShadow: hov && val > 0 ? `0 0 6px ${T.green}60` : "none",
          transition: "border 0.15s, box-shadow 0.15s",
        }}
      />
      {/* Tooltip */}
      {hov && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: T.text, color: "#fff",
          fontFamily: T.font, fontSize: 9, fontWeight: 500,
          borderRadius: 5, padding: "3px 7px",
          whiteSpace: "nowrap", zIndex: 10,
          pointerEvents: "none",
          boxShadow: T.shadowMd,
        }}>
          {labels[val]}
        </div>
      )}
    </div>
  );
}

export default function ActivityHeatmap() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  // Total active days
  const activeDays  = HEATMAP_DATA.flat().filter(v => v > 0).length;
  const currentStreak = 14; // mock

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: T.radiusXl,
        padding: "clamp(18px,2.5vw,26px)",
        boxShadow: T.shadowGlass,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
            Activity Heatmap
          </span>
          <span style={{
            fontFamily: T.font, fontSize: 10, fontWeight: 700,
            color: T.green, background: T.greenLight,
            border: `1px solid ${T.greenMid}`,
            borderRadius: T.radiusPill, padding: "2px 8px",
          }}>{activeDays} active days</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.amber, letterSpacing: "-0.03em" }}>
              🔥 {currentStreak}
            </div>
            <div style={{ fontFamily: T.font, fontSize: 9, fontWeight: 500, color: T.textMuted }}>Day streak</div>
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div style={{
        display: "flex", gap: "clamp(6px,1vw,12px)",
        paddingLeft: "clamp(14px,2vw,20px)",
        marginBottom: 4,
        overflowX: "auto",
      }}>
        {MONTHS.map((m, i) => (
          <span key={m + i} style={{
            fontFamily: T.font, fontSize: 9, fontWeight: 500,
            color: T.textMuted, minWidth: "clamp(28px,3.5vw,36px)",
            textAlign: "center",
          }}>{m}</span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{
              height: "clamp(8px,1.2vw,12px)",
              fontFamily: T.font, fontSize: 8, fontWeight: 500,
              color: T.textMuted, display: "flex", alignItems: "center",
              width: 12, flexShrink: 0,
            }}>{d}</div>
          ))}
        </div>

        {/* Weeks */}
        {HEATMAP_DATA.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
            {week.map((val, di) => (
              <HeatCell key={di} val={val} weekIdx={wi} dayIdx={di} inView={inView} />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
        <span style={{ fontFamily: T.font, fontSize: 9, fontWeight: 500, color: T.textMuted }}>Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: 2,
            background: i === 0 ? T.border : c,
          }} />
        ))}
        <span style={{ fontFamily: T.font, fontSize: 9, fontWeight: 500, color: T.textMuted }}>More</span>
      </div>
    </motion.div>
  );
}
