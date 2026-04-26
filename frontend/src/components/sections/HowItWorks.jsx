import React, { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ─── Design Tokens (exact match to system) ─────────────────────────────────────
const T = {
  green: "#22c55e",
  greenLight: "#f0fdf4",
  greenMid: "#dcfce7",
  blue: "#3b82f6",
  blueLight: "#eff6ff",
  blueMid: "#bfdbfe",
  teal: "#14b8a6",
  tealLight: "#f0fdfa",
  tealMid: "#99f6e4",
  violet: "#8b5cf6",
  violetLight: "#f5f3ff",
  violetMid: "#ddd6fe",
  text: "#0f172a",
  textSub: "#475569",
  textMuted: "#94a3b8",
  border: "rgba(15,23,42,0.07)",
  borderMid: "rgba(15,23,42,0.12)",
  bg: "#ffffff",
  surface: "#f8fafc",
  font: "'Inter', system-ui, sans-serif",
  shadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.08), 0 12px 36px rgba(0,0,0,0.07)",
  shadowHover: "0 8px 32px rgba(0,0,0,0.11), 0 24px 56px rgba(0,0,0,0.08)",
  radius: "20px",
  radiusSm: "12px",
  radiusXl: "28px",
};

// ─── Step data ──────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 0,
    number: "01",
    icon: "🏛️",
    title: "NGO Posts a Need",
    description:
      "Organisations define their mission requirements — skills, location, timeline, and expected outcomes. Our structured intake turns intent into an actionable brief in under two minutes.",
    accent: T.green,
    accentLight: T.greenLight,
    accentMid: T.greenMid,
    iconBg: "#dcfce7",
    detail: "2 min avg. intake time",
    detailIcon: "⚡",
  },
  {
    id: 1,
    number: "02",
    icon: "🤖",
    title: "AI Matches Volunteers",
    description:
      "Our engine cross-references 40+ signals — skills, availability, proximity, past impact scores, and cause affinity — surfacing the right people within seconds, not weeks.",
    accent: T.blue,
    accentLight: T.blueLight,
    accentMid: T.blueMid,
    iconBg: "#dbeafe",
    detail: "40+ match signals",
    detailIcon: "🧠",
  },
  {
    id: 2,
    number: "03",
    icon: "🤝",
    title: "Volunteers Get to Work",
    description:
      "Matched volunteers receive a full brief, onboarding checklist, and direct comms channel. Coordination is automated — they can start contributing on day one.",
    accent: T.teal,
    accentLight: T.tealLight,
    accentMid: T.tealMid,
    iconBg: "#ccfbf1",
    detail: "Day-one activation",
    detailIcon: "🚀",
  },
  {
    id: 3,
    number: "04",
    icon: "📊",
    title: "Impact Gets Measured",
    description:
      "Every outcome is verified and translated into live metrics on your dashboard. Donors see exactly where their support went. NGOs prove results. Trust compounds.",
    accent: T.violet,
    accentLight: T.violetLight,
    accentMid: T.violetMid,
    iconBg: "#ede9fe",
    detail: "Real-time verification",
    detailIcon: "✅",
  },
];

// ─── Ambient floating blobs ─────────────────────────────────────────────────────
function AmbientBlobs() {
  const blobs = [
    { x: "-4%", y: "5%", w: 380, color: `${T.green}0b`, dur: 18, delay: 0 },
    { x: "70%", y: "-5%", w: 340, color: `${T.blue}0a`, dur: 24, delay: 5 },
    { x: "45%", y: "65%", w: 260, color: `${T.teal}09`, dur: 20, delay: 8 },
    { x: "85%", y: "60%", w: 220, color: `${T.violet}08`, dur: 15, delay: 3 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 28, -18, 0],
            y: [0, -22, 14, 0],
            scale: [1, 1.06, 0.96, 1],
          }}
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.w,
            borderRadius: "50%",
            background: b.color,
            filter: "blur(80px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Magnetic CTA button ────────────────────────────────────────────────────────
function MagneticButton({ children, variant = "primary" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });
  const [hov, setHov] = useState(false);
  const isPrimary = variant === "primary";

  return (
    <motion.button
      ref={ref}
      style={{
        x: sx,
        y: sy,
        fontFamily: T.font,
        fontSize: "15px",
        fontWeight: 600,
        color: isPrimary ? "#fff" : T.green,
        background: isPrimary
          ? `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`
          : T.greenLight,
        border: isPrimary ? "none" : `1px solid ${T.greenMid}`,
        borderRadius: "50px",
        padding: "13px 30px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        letterSpacing: "0.01em",
        boxShadow:
          hov && isPrimary
            ? "0 8px 30px rgba(34,197,94,0.35)"
            : isPrimary
              ? "0 4px 16px rgba(34,197,94,0.22)"
              : "none",
        transition: "box-shadow 0.3s",
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
        animate={hov ? { x: 4 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ fontSize: "16px" }}
      >
        →
      </motion.span>
    </motion.button>
  );
}

// ─── Individual step card ───────────────────────────────────────────────────────
function StepCard({ step, index, inView, activeId, setActiveId, totalSteps }) {
  const ref = useRef(null);
  const isActive = activeId === step.id;
  const isDimmed = activeId !== null && !isActive;

  // Cursor-follow glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowBg = useTransform(
    [mouseX, mouseY],
    ([mx, my]) =>
      `radial-gradient(300px circle at ${mx}px ${my}px, ${step.accent}13, transparent 65%)`,
  );

  // 3-D tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rX = useSpring(rawX, { stiffness: 160, damping: 22 });
  const rY = useSpring(rawY, { stiffness: 160, damping: 22 });
  const rotateX = useTransform(rX, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(rY, [-0.5, 0.5], [-4, 4]);

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
    rawX.set((e.clientY - r.top) / r.height - 0.5);
    rawY.set((e.clientX - r.left) / r.width - 0.5);
  };
  const handleLeave = () => {
    setActiveId(null);
    rawX.set(0);
    rawY.set(0);
  };

  const cardDelay = 0.15 + index * 0.13;

  return (
    <div style={{ display: "flex", gap: "0px", alignItems: "stretch" }}>
      {/* Left: number + vertical line column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "56px",
          flexShrink: 0,
        }}
      >
        {/* Number bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: cardDelay - 0.05,
            type: "spring",
            stiffness: 260,
          }}
          animate2={{
            background: isActive ? step.accent : T.bg,
            borderColor: isActive ? step.accent : `${step.accent}40`,
            color: isActive ? "#fff" : step.accent,
            boxShadow: isActive ? `0 4px 16px ${step.accent}40` : T.shadow,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isActive ? step.accent : T.bg,
            border: `1.5px solid ${isActive ? step.accent : step.accent + "40"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: T.font,
            fontSize: "12px",
            fontWeight: 800,
            color: isActive ? "#fff" : step.accent,
            flexShrink: 0,
            zIndex: 1,
            boxShadow: isActive ? `0 4px 16px ${step.accent}40` : T.shadow,
            transition:
              "background 0.3s, color 0.3s, box-shadow 0.3s, border-color 0.3s",
          }}
        >
          {step.number}
        </motion.div>

        {/* Vertical connector (not on last card) */}
        {index < totalSteps - 1 && (
          <div
            style={{
              flex: 1,
              width: "1.5px",
              marginTop: "8px",
              marginBottom: "8px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, ${step.accent}30, transparent)`,
              }}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: cardDelay + 0.2,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, ${step.accent}60, ${step.accent}15)`,
                transformOrigin: "top",
              }}
            />
            {inView && (
              <motion.div
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: cardDelay + 0.6,
                }}
                style={{
                  position: "absolute",
                  left: "-3px",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: step.accent,
                  boxShadow: `0 0 6px ${step.accent}`,
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Right: the card itself */}
      <div
        style={{
          flex: 1,
          paddingLeft: "16px",
          paddingBottom: index < totalSteps - 1 ? "24px" : "0",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={
            inView
              ? {
                  opacity: isDimmed ? 0.45 : 1,
                  x: 0,
                  scale: isDimmed ? 0.985 : 1,
                }
              : {}
          }
          transition={{
            duration: 0.6,
            delay: cardDelay,
            ease: [0.22, 1, 0.36, 1],
            opacity: { duration: 0.25 },
            scale: { duration: 0.2 },
          }}
          style={{ perspective: 900, height: "100%" }}
        >
          <motion.div
            ref={ref}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              height: "100%",
            }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onMouseEnter={() => setActiveId(step.id)}
            animate={{
              boxShadow: isActive ? T.shadowHover : T.shadow,
              borderColor: isActive ? `${step.accent}35` : T.border,
              y: isActive ? -4 : 0,
            }}
            transition={{ duration: 0.25 }}
            style={{
              background: T.bg,
              border: "1px solid",
              borderColor: T.border,
              borderRadius: T.radius,
              padding: "clamp(20px, 2.5vw, 28px)",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              boxShadow: T.shadow,
            }}
          >
            {/* Cursor glow overlay */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: T.radius,
                background: glowBg,
                pointerEvents: "none",
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />

            {/* Animated gradient border on hover */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    inset: -1,
                    borderRadius: `calc(${T.radius} + 1px)`,
                    background: `linear-gradient(135deg, ${step.accent}45, transparent 55%, ${step.accent}25)`,
                    zIndex: -1,
                    pointerEvents: "none",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Top row: icon + detail chip */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <motion.div
                animate={
                  isActive
                    ? { scale: 1.12, rotate: [0, -8, 8, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={
                  isActive
                    ? { type: "spring", stiffness: 260, damping: 16 }
                    : { duration: 0.3 }
                }
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  background: step.iconBg,
                  border: `1px solid ${step.accent}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  flexShrink: 0,
                  boxShadow: isActive ? `0 6px 20px ${step.accent}25` : "none",
                  transition: "box-shadow 0.3s",
                }}
              >
                {step.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: cardDelay + 0.25 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: step.accentLight,
                  border: `1px solid ${step.accentMid}`,
                  borderRadius: "50px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: step.accent,
                  fontFamily: T.font,
                  whiteSpace: "nowrap",
                }}
              >
                <span>{step.detailIcon}</span>
                <span>{step.detail}</span>
              </motion.div>
            </div>

            {/* Title */}
            <motion.h3
              animate={{ color: isActive ? step.accent : T.text }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: T.font,
                fontSize: "clamp(17px, 1.8vw, 20px)",
                fontWeight: 700,
                lineHeight: 1.25,
                margin: "0 0 10px",
                letterSpacing: "-0.02em",
              }}
            >
              {step.title}
            </motion.h3>

            {/* Description */}
            <p
              style={{
                fontFamily: T.font,
                fontSize: "clamp(13px, 1.2vw, 14px)",
                fontWeight: 300,
                color: T.textSub,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {step.description}
            </p>

            {/* Bottom accent bar */}
            <motion.div
              animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                bottom: 0,
                left: "8%",
                right: "8%",
                height: "2.5px",
                borderRadius: "2px 2px 0 0",
                background: `linear-gradient(90deg, transparent, ${step.accent}80, transparent)`,
                transformOrigin: "center",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Progress tracker pills ─────────────────────────────────────────────────────
function ProgressTracker({ activeId, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.7 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "48px",
      }}
    >
      {STEPS.map((step, i) => (
        <div
          key={step.id}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <motion.div
            animate={{
              background: activeId === step.id ? step.accent : T.surface,
              borderColor: activeId === step.id ? step.accent : T.borderMid,
              boxShadow:
                activeId === step.id ? `0 0 12px ${step.accent}40` : "none",
            }}
            transition={{ duration: 0.25 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "50px",
              border: "1px solid",
              borderColor: T.borderMid,
              cursor: "default",
            }}
          >
            <span style={{ fontSize: "13px" }}>{step.icon}</span>
            <span
              style={{
                fontFamily: T.font,
                fontSize: "12px",
                fontWeight: 600,
                color: activeId === step.id ? "#fff" : T.textMuted,
                transition: "color 0.25s",
                whiteSpace: "nowrap",
              }}
            >
              {step.title}
            </span>
          </motion.div>
          {i < STEPS.length - 1 && (
            <div
              style={{ width: "20px", height: "1px", background: T.border }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ─── Right panel: sticky summary card ──────────────────────────────────────────
function SummaryPanel({ activeId, inView }) {
  const METRICS = [
    {
      label: "Time from post to match",
      value: "< 30 sec",
      accent: T.green,
      icon: "⚡",
    },
    {
      label: "Volunteer match accuracy",
      value: "98%",
      accent: T.blue,
      icon: "🎯",
    },
    {
      label: "NGOs on the platform",
      value: "2,900+",
      accent: T.teal,
      icon: "🏛️",
    },
    {
      label: "Verified impact outcomes",
      value: "1.2M+",
      accent: T.violet,
      icon: "✅",
    },
  ];

  return (
    <div style={{ position: "sticky", top: "clamp(80px, 10vh, 120px)" }}>
      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusXl,
          padding: "clamp(22px, 3vw, 34px)",
          boxShadow: T.shadowMd,
          position: "relative",
          overflow: "hidden",
          marginBottom: "14px",
        }}
      >
        {/* Ambient glow */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.green}15, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Window dots */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
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
        </div>

        <p
          style={{
            fontFamily: T.font,
            fontSize: "11px",
            fontWeight: 700,
            color: T.textMuted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 20px",
          }}
        >
          Platform at a glance
        </p>

        {METRICS.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.35 + i * 0.09 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "11px 13px",
              borderRadius: T.radiusSm,
              background: T.surface,
              border: `1px solid ${T.border}`,
              marginBottom: i < METRICS.length - 1 ? "8px" : "0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "8px",
                  background: `${row.accent}15`,
                  border: `1px solid ${row.accent}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {row.icon}
              </div>
              <span
                style={{
                  fontFamily: T.font,
                  fontSize: "13px",
                  fontWeight: 400,
                  color: T.textSub,
                }}
              >
                {row.label}
              </span>
            </div>
            <span
              style={{
                fontFamily: T.font,
                fontSize: "15px",
                fontWeight: 800,
                color: row.accent,
                letterSpacing: "-0.02em",
                flexShrink: 0,
              }}
            >
              {row.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Active step tooltip */}
      <AnimatePresence mode="wait">
        {activeId !== null ? (
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: STEPS[activeId].accentLight,
              border: `1px solid ${STEPS[activeId].accentMid}`,
              borderRadius: T.radius,
              padding: "15px 18px",
              display: "flex",
              alignItems: "center",
              gap: "13px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "11px",
                background: STEPS[activeId].iconBg,
                border: `1px solid ${STEPS[activeId].accent}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {STEPS[activeId].icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: STEPS[activeId].accent,
                  marginBottom: "3px",
                }}
              >
                Step {STEPS[activeId].number} — {STEPS[activeId].title}
              </div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "12px",
                  fontWeight: 400,
                  color: T.textSub,
                }}
              >
                {STEPS[activeId].detail}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              padding: "13px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.green,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: T.font,
                fontSize: "13px",
                fontWeight: 400,
                color: T.textMuted,
              }}
            >
              Hover a step to explore it
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
      >
        <div style={{
  marginTop: "24px",
  padding: "20px 24px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.06))",
  border: "1px solid rgba(34,197,94,0.15)",
  textAlign: "center"
}}>
  <h3 style={{
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#0f172a"
  }}>
    Real impact. Verified instantly.
  </h3>

  <p style={{
    fontSize: "13px",
    color: "#64748b"
  }}>
    Every action is tracked, verified, and visible — building trust across NGOs, volunteers, and communities.
  </p>
</div>


        {/* <MagneticButton variant="primary">Get Started Free</MagneticButton> */}
        {/* <MagneticButton variant="secondary">Watch Demo</MagneticButton> */}
      </motion.div>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.08 });
  const [activeId, setActiveId] = useState(null);

  return (
    <section
    id="how-it-works"
      ref={sectionRef}
      style={{
        position: "relative",
        background: T.bg,
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 72px)",
        overflow: "hidden",
        fontFamily: T.font,
      }}
    >
      <AmbientBlobs />

      {/* Dot grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto 56px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: T.greenLight,
              border: `1px solid ${T.greenMid}`,
              borderRadius: "50px",
              padding: "6px 14px",
              marginBottom: "20px",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.45, 1], opacity: [1, 0.45, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
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
                fontFamily: T.font,
                fontSize: "12px",
                fontWeight: 600,
                color: T.green,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              How It Works
            </span>
          </motion.div>

          <h2
            style={{
              fontFamily: T.font,
              fontSize: "clamp(30px, 5vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: T.text,
              margin: "0 0 16px",
            }}
          >
            From{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              need
            </span>{" "}
            to{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${T.teal}, ${T.violet})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              impact
            </span>{" "}
            in four steps
          </h2>

          <p
            style={{
              fontFamily: T.font,
              fontSize: "clamp(14px, 1.5vw, 17px)",
              fontWeight: 300,
              color: T.textSub,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            DigitalSevaks handles the complexity so volunteers and NGOs can
            focus on what actually matters — doing good in the world.
          </p>
        </motion.div>

        {/* ── Progress tracker ── */}
        <ProgressTracker activeId={activeId} inView={inView} />

        {/* ── Two-column layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* Left: stacked step cards */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                inView={inView}
                activeId={activeId}
                setActiveId={setActiveId}
                totalSteps={STEPS.length}
              />
            ))}
          </div>

          {/* Right: sticky summary panel */}
          <SummaryPanel activeId={activeId} inView={inView} />
        </div>

        {/* ── Bottom trust strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.85 }}
          style={{
            marginTop: "clamp(48px, 7vw, 80px)",
            padding: "clamp(20px, 2.5vw, 28px) clamp(24px, 4vw, 40px)",
            background: `linear-gradient(135deg, ${T.greenLight}, ${T.blueLight})`,
            border: `1px solid ${T.greenMid}`,
            borderRadius: T.radiusXl,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "32px" }}
            >
              🌍
            </motion.div>
            <div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: "3px",
                }}
              >
                The entire process takes under 5 minutes
              </div>
              <div
                style={{
                  fontFamily: T.font,
                  fontSize: "13px",
                  fontWeight: 300,
                  color: T.textSub,
                }}
              >
                48,000+ volunteers matched · 2,900+ NGOs served · 1.2M lives
                impacted
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["No credit card", "Free forever plan", "Cancel anytime"].map(
              (txt) => (
                <div
                  key={txt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: T.font,
                    fontSize: "12px",
                    fontWeight: 500,
                    color: T.textSub,
                    background: T.bg,
                    border: `1px solid ${T.border}`,
                    borderRadius: "50px",
                    padding: "5px 12px",
                  }}
                >
                  <span style={{ color: T.green, fontSize: "12px" }}>✓</span>
                  {txt}
                </div>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
