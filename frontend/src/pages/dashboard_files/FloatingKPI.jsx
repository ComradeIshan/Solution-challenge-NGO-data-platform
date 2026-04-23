import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import React from "react";

export default function FloatingKPI({ mousePos }) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

  const x = useSpring(mousePos.x, { stiffness: 100, damping: 28, mass: 0.5 });
  const y = useSpring(mousePos.y, { stiffness: 100, damping: 28, mass: 0.5 });

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!shown) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: "fixed",
            x, y,
            translateX: "20px",
            translateY: "-100%",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div style={{
            background: "rgba(15,23,42,0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 16,
            padding: "12px 18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(34,197,94,0.1)",
            minWidth: 180,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}
              />
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>
                Live KPI
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.03em" }}>
              4.8M <span style={{ color: "#22c55e", fontSize: 14 }}>↑</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
              Lives impacted this year
            </div>
            <div style={{
              marginTop: 8, padding: "5px 10px",
              background: "rgba(34,197,94,0.1)",
              borderRadius: 8,
              fontSize: 10, fontWeight: 700, color: "#22c55e",
              fontFamily: "'DM Sans', sans-serif",
              display: "inline-block",
            }}>
              🚀 +24% vs last week
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
