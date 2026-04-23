import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import React from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateData() {
  const weeks = 24;
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const base = Math.random();
      const weekend = d >= 5 ? 0.5 : 1;
      const trend = 0.4 + (w / weeks) * 0.6;
      return {
        value: Math.floor(base * weekend * trend * 80),
        week: w, day: d,
        label: `Week ${w + 1}, ${DAYS[d]}`,
      };
    })
  );
}

const GRID_DATA = generateData();

function cellColor(v) {
  if (v === 0) return "rgba(0,0,0,0.04)";
  if (v < 15) return "rgba(34,197,94,0.15)";
  if (v < 30) return "rgba(34,197,94,0.32)";
  if (v < 50) return "rgba(34,197,94,0.55)";
  if (v < 65) return "rgba(34,197,94,0.75)";
  return "#22c55e";
}

export default function HeatmapGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [tooltip, setTooltip] = useState(null);

  const allCells = GRID_DATA.flat();
  const totalActivity = allCells.reduce((s, c) => s + c.value, 0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.2 }}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 24,
        padding: "26px 28px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#94a3b8",
            fontFamily: "'DM Sans', system-ui", marginBottom: 3,
          }}>
            Volunteer Activity Grid
          </p>
          <h3 style={{
            fontSize: 20, fontWeight: 800, color: "#0f172a",
            margin: 0, fontFamily: "'DM Sans', system-ui",
            letterSpacing: "-0.02em",
          }}>
            24-Week Activity Heatmap
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 24, fontWeight: 900, color: "#0f172a",
            fontFamily: "'DM Sans', system-ui", letterSpacing: "-0.03em",
          }}>
            {totalActivity.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', system-ui" }}>
            total actions
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div style={{ display: "flex", gap: 3, marginBottom: 6, paddingLeft: 32 }}>
        {MONTHS.slice(0, 12).map((m, i) => (
          <div key={i} style={{ width: i < 11 ? 42 : 38, fontSize: 9, color: "#94a3b8", fontFamily: "'DM Sans', system-ui", fontWeight: 600 }}>
            {i % 2 === 0 ? m : ""}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: 6 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 1 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{
              height: 14, width: 26, fontSize: 9, color: "#94a3b8",
              fontFamily: "'DM Sans', system-ui", fontWeight: 600,
              display: "flex", alignItems: "center",
            }}>
              {i % 2 !== 0 ? d : ""}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
          {GRID_DATA.map((week, w) => (
            <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {week.map((cell, d) => {
                const idx = w * 7 + d;
                return (
                  <motion.div
                    key={d}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      delay: idx * 0.003,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    whileHover={{ scale: 1.4, zIndex: 10 }}
                    onHoverStart={(e) => setTooltip({ cell, x: e.clientX, y: e.clientY })}
                    onHoverEnd={() => setTooltip(null)}
                    style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: cellColor(cell.value),
                      cursor: "pointer",
                      position: "relative",
                      border: cell.value > 60 ? "1px solid rgba(34,197,94,0.4)" : "none",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, paddingLeft: 32 }}>
        <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Sans', system-ui" }}>Less</span>
        {[0, 12, 28, 48, 65, 80].map((v, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: cellColor(v) }} />
        ))}
        <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Sans', system-ui" }}>More</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            style={{
              position: "fixed",
              left: tooltip.x + 12,
              top: tooltip.y - 50,
              background: "rgba(15,23,42,0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "8px 14px",
              pointerEvents: "none",
              zIndex: 1000,
              fontFamily: "'DM Sans', system-ui",
            }}
          >
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>
              {tooltip.cell.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
              {tooltip.cell.value} <span style={{ color: "#22c55e" }}>actions</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
