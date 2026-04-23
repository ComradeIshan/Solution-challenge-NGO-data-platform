import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import React from "react";

const FLOAT_ICONS = [
  { icon: "🌱", delay: 0, x: "12%", y: "28%", size: 48 },
  { icon: "🤝", delay: 1.4, x: "82%", y: "18%", size: 44 },
  { icon: "🌍", delay: 0.7, x: "88%", y: "68%", size: 52 },
  { icon: "✨", delay: 2.1, x: "6%", y: "72%", size: 38 },
  { icon: "💚", delay: 1.8, x: "50%", y: "8%", size: 34 },
  { icon: "🏥", delay: 0.4, x: "22%", y: "82%", size: 36 },
];

function useCountUp(target, duration = 2200, delay = 400) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const d = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(d);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const raf = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started, target, duration]);

  return value;
}

export default function HeroImpactSection({ mousePos }) {
  const ref = useRef(null);
  const lives = useCountUp(4800000, 2400, 600);
  const sevaks = useCountUp(12847, 1800, 800);
  const ngos = useCountUp(348, 1600, 1000);

  const fmt = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toLocaleString();
  };

  // Parallax from mouse
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const gx = useSpring(useTransform(px, [-1, 1], [-18, 18]), { stiffness: 60, damping: 20 });
  const gy = useSpring(useTransform(py, [-1, 1], [-10, 10]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    px.set(((mousePos.x - cx) / (rect.width / 2)));
    py.set(((mousePos.y - cy) / (rect.height / 2)));
  }, [mousePos]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.1 }}
      style={{
        position: "relative",
        borderRadius: 32,
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a1f1a 100%)",
        padding: "72px 48px",
        marginBottom: 24,
        minHeight: 380,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {/* Mouse-reactive glow */}
      <motion.div
        style={{
          position: "absolute",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(20,184,166,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
          top: "50%", left: "50%",
          x: useTransform(px, [-1, 1], [-80, 80]),
          y: useTransform(py, [-1, 1], [-50, 50]),
          translateX: "-50%", translateY: "-50%",
          pointerEvents: "none",
        }}
      />

      {/* Orbiting ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: 500, height: 500,
          border: "1px dashed rgba(34,197,94,0.12)",
          borderRadius: "50%",
          top: "50%", left: "50%",
          marginLeft: -250, marginTop: -250,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: 360, height: 360,
          border: "1px dashed rgba(59,130,246,0.10)",
          borderRadius: "50%",
          top: "50%", left: "50%",
          marginLeft: -180, marginTop: -180,
          pointerEvents: "none",
        }}
      />

      {/* Floating icons */}
      {FLOAT_ICONS.map((fi, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1, scale: 1,
            y: [0, -12, 0],
            rotate: [-3, 3, -3],
          }}
          transition={{
            opacity: { delay: fi.delay + 0.8, duration: 0.5 },
            scale: { delay: fi.delay + 0.8, type: "spring", stiffness: 200 },
            y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: fi.delay },
            rotate: { duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: fi.delay },
          }}
          style={{
            position: "absolute",
            left: fi.x, top: fi.y,
            width: fi.size, height: fi.size,
            borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: fi.size * 0.45,
            cursor: "default",
            zIndex: 3,
          }}
        >
          {fi.icon}
        </motion.div>
      ))}

      {/* Content */}
      <motion.div style={{ x: gx, y: gy, position: "relative", zIndex: 4 }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "rgba(34,197,94,0.7)",
            marginBottom: 16, fontFamily: "'DM Sans', sans-serif",
          }}
        >
          🌱 Live Impact Engine · Digital Sevaks
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 20 }}
          style={{ position: "relative" }}
        >
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(64px, 10vw, 108px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}>
            {fmt(lives)}
          </div>
          {/* Shine sweep */}
          <motion.div
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 4, ease: "easeInOut", delay: 2.5 }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              skewX: "-12deg",
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: 20, color: "rgba(255,255,255,0.55)",
            marginTop: 10, marginBottom: 48,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          }}
        >
          Lives Touched & Transformed
        </motion.p>

        {/* Sub stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
          style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}
        >
          {[
            { val: fmt(sevaks), label: "Active Sevaks", icon: "👥" },
            { val: fmt(ngos), label: "Partner NGOs", icon: "🏢" },
            { val: "28", label: "States Covered", icon: "📍" },
            { val: "94%", label: "Match Rate", icon: "⚡" },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ textAlign: "center", cursor: "default" }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{
                fontSize: 26, fontWeight: 800, color: "#fff",
                fontFamily: "'Fraunces', Georgia, serif",
                letterSpacing: "-0.02em",
              }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* AI insight floating badge */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 220 }}
        whileHover={{ scale: 1.04, x: -4 }}
        style={{
          position: "absolute", right: 32, bottom: 32,
          background: "rgba(34,197,94,0.12)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 20,
          padding: "10px 18px",
          display: "flex", alignItems: "center", gap: 10,
          cursor: "default", zIndex: 5,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}
        />
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>AI Insight</div>
          <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>Impact ↑ 24% this week 🚀</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
