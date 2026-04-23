import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const INITIAL_FEED = [
  { id: 1, name: "Priya Sharma", action: "joined ChildFirst Foundation", time: "just now", av: "PS", color: "#22c55e", isNew: true },
  { id: 2, name: "Rahul Verma", action: "completed 10 volunteer hours", time: "3m ago", av: "RV", color: "#3b82f6", isNew: false },
  { id: 3, name: "Meena Patel", action: "matched with GreenEarth NGO", time: "9m ago", av: "MP", color: "#14b8a6", isNew: false },
  { id: 4, name: "Arjun Nair", action: "referred 3 new Sevaks", time: "21m ago", av: "AN", color: "#f59e0b", isNew: false },
  { id: 5, name: "Sunita Rao", action: "completed skill assessment", time: "45m ago", av: "SR", color: "#8b5cf6", isNew: false },
  { id: 6, name: "Kiran Das", action: "registered as NGO coordinator", time: "1h ago", av: "KD", color: "#ef4444", isNew: false },
];

const NEW_EVENTS = [
  { id: 10, name: "Vikram Singh", action: "started volunteering at EduReach", time: "just now", av: "VS", color: "#22c55e", isNew: true },
  { id: 11, name: "Ananya Roy", action: "completed impact assessment", time: "just now", av: "AR", color: "#14b8a6", isNew: true },
];

export default function ActivityFeed() {
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (eventIndex < NEW_EVENTS.length) {
        setFeed(prev => [{ ...NEW_EVENTS[eventIndex], id: Date.now() }, ...prev.slice(0, 5)]);
        setEventIndex(i => i + 1);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [eventIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 22 }}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 24,
        padding: "24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#94a3b8", marginBottom: 2,
          }}>
            Live Updates
          </p>
          <h3 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 20, fontWeight: 700, color: "#0f172a",
            margin: 0, letterSpacing: "-0.02em",
          }}>
            Activity Feed
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 4px rgba(34,197,94,0.2)",
            }}
          />
          <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Feed items */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        <AnimatePresence>
          {feed.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ x: 4, background: "rgba(34,197,94,0.04)" }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 8px", borderRadius: 14, cursor: "pointer",
                transition: "background 0.2s",
                position: "relative",
                borderLeft: item.isNew ? "2px solid #22c55e" : "2px solid transparent",
              }}
            >
              {item.isNew && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              )}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: `${item.color}18`,
                border: `1.5px solid ${item.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: item.color,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {item.av}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 12, color: "#0f172a", margin: 0,
                  fontWeight: 700, lineHeight: 1.4,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {item.name}
                </p>
                <p style={{
                  fontSize: 11, color: "#475569", margin: "1px 0 0",
                  lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {item.action}
                </p>
                <p style={{
                  fontSize: 10, color: "#94a3b8", margin: "3px 0 0",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {item.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(34,197,94,0.15)" }}
        whileTap={{ scale: 0.98 }}
        style={{
          marginTop: 16, padding: "10px",
          background: "rgba(34,197,94,0.06)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: 12, cursor: "pointer",
          fontSize: 12, fontWeight: 700, color: "#16a34a",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        View all activity →
      </motion.button>
    </motion.div>
  );
}
