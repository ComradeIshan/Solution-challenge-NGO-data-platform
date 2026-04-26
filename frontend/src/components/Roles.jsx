import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — unchanged
═══════════════════════════════════════════════════════ */
const T = {
  ff: "'Fraunces', serif",
  fb: "'DM Sans', sans-serif",
  green: "#22c55e",
  greenMid: "#16a34a",
  greenLight: "#dcfce7",
  blue: "#3b82f6",
  blueMid: "#2563eb",
  blueLight: "#dbeafe",
  teal: "#14b8a6",
  tealMid: "#0f766e",
  tealLight: "#ccfbf1",
  g50: "#fafaf9",
  g100: "#f4f4f5",
  g200: "#e4e4e7",
  g300: "#d4d4d8",
  g400: "#a1a1aa",
  g500: "#71717a",
  g600: "#52525b",
  g800: "#1f2937",
  g900: "#111827",
};

/* ── Motion constants ── */
const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 300, damping: 28 };
const SPRING_STIFF = { type: "spring", stiffness: 400, damping: 32 };

/* ── Stagger container variant factory — unchanged ── */
const makeStagger = (delayChildren = 0.08, staggerChildren = 0.11) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const fadeUpHeader = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/* ═══════════════════════════════════════════════════════
   ROLE DATA — unchanged
═══════════════════════════════════════════════════════ */
const ROLES = [
  {
    id: "ngo",
    icon: "🏛️",
    iconBg: T.greenLight,
    iconColor: T.greenMid,
    accentColor: T.green,
    accentLight: T.greenLight,
    accentRgb: "34,197,94",
    tag: "For Organizations",
    tagColor: T.greenMid,
    tagBg: T.greenLight,
    title: "NGOs & Organizations",
    desc: "Post needs, manage campaigns, and track real-world impact — all from a single coordinated dashboard.",
    features: [
      { icon: "📋", text: "Post volunteer requirements in minutes" },
      { icon: "📊", text: "Real-time campaign analytics" },
      { icon: "🤝", text: "AI-matched volunteer pool" },
    ],
    cta: "Register NGO",
    stat: { value: "2,400+", label: "NGOs active" },
    topLine: `linear-gradient(90deg, ${T.green}, #10b981)`,
    hoverGlow: "rgba(34,197,94,0.10)",
    blobColor: "rgba(34,197,94,",
  },
  {
    id: "volunteer",
    icon: "🙌",
    iconBg: T.blueLight,
    iconColor: T.blueMid,
    accentColor: T.blue,
    accentLight: T.blueLight,
    accentRgb: "59,130,246",
    tag: "For Individuals",
    tagColor: T.blueMid,
    tagBg: T.blueLight,
    title: "Volunteers",
    desc: "Get intelligently matched with opportunities that fit your skills, schedule, and the causes you care about.",
    features: [
      { icon: "🎯", text: "AI-powered opportunity matching" },
      { icon: "🏆", text: "Verified impact certificates" },
      { icon: "📍", text: "Local & remote campaigns" },
    ],
    cta: "Join as Volunteer",
    stat: { value: "48K+", label: "Volunteers joined" },
    topLine: `linear-gradient(90deg, ${T.blue}, #06b6d4)`,
    hoverGlow: "rgba(59,130,246,0.10)",
    blobColor: "rgba(59,130,246,",
  },
  {
    id: "beneficiary",
    icon: "🌱",
    iconBg: T.tealLight,
    iconColor: T.tealMid,
    accentColor: T.teal,
    accentLight: T.tealLight,
    accentRgb: "20,184,166",
    tag: "For Communities",
    tagColor: T.tealMid,
    tagBg: T.tealLight,
    title: "Beneficiaries",
    desc: "Access verified relief, education, and healthcare support from trusted NGOs operating in your area.",
    features: [
      { icon: "✅", text: "Verified NGO network only" },
      { icon: "🗺️", text: "Location-based discovery" },
      { icon: "🔒", text: "Safe, confidential process" },
    ],
    cta: "Get Help",
    stat: { value: "4.8M", label: "Lives impacted" },
    topLine: `linear-gradient(90deg, ${T.teal}, #2563eb)`,
    hoverGlow: "rgba(20,184,166,0.10)",
    blobColor: "rgba(20,184,166,",
  },
];

/* ═══════════════════════════════════════════════════════
   NEW: FLOATING BACKGROUND BLOBS
   Three slow‑drifting blurred circles behind the grid.
   Each blob has its own path using x/y keyframe arrays.
═══════════════════════════════════════════════════════ */
const BLOB_CONFIGS = [
  {
    color: "rgba(34,197,94,0.07)",
    size: 420,
    top: "5%",
    left: "-8%",
    dur: 18,
    xKeys: [0, 30, -20, 0],
    yKeys: [0, -40, 20, 0],
    delay: 0,
  },
  {
    color: "rgba(59,130,246,0.07)",
    size: 380,
    top: "40%",
    right: "-10%",
    left: undefined,
    dur: 22,
    xKeys: [0, -35, 25, 0],
    yKeys: [0, 30, -30, 0],
    delay: 4,
  },
  {
    color: "rgba(20,184,166,0.06)",
    size: 340,
    top: "70%",
    left: "35%",
    dur: 26,
    xKeys: [0, 20, -15, 0],
    yKeys: [0, -25, 35, 0],
    delay: 8,
  },
];

function FloatingBlobs() {
  return (
    <>
      {BLOB_CONFIGS.map((b, i) => (
        <motion.div
          key={i}
          animate={{
            x: b.xKeys,
            y: b.yKeys,
          }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   UNCHANGED: FEATURE ROW
═══════════════════════════════════════════════════════ */
function FeatureRow({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "7px 0",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "8px",
          background: T.g100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: T.fb,
          fontSize: "13px",
          color: T.g600,
          lineHeight: 1.45,
          fontWeight: 400,
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UPGRADED: MAGNETIC CTA BUTTON
   Tracks cursor position and pulls the button toward it.
═══════════════════════════════════════════════════════ */
function CardCTA({ label, accentColor, accentLight, onClick }) {
  const [hov, setHov] = useState(false);
  const btnRef = useRef(null);

  /* spring-damped magnetic position */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 280, damping: 22 });
  const y = useSpring(rawY, { stiffness: 280, damping: 22 });

  const handleMouseMove = useCallback(
    (e) => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      rawX.set((e.clientX - cx) * 0.28);
      rawY.set((e.clientY - cy) * 0.28);
    },
    [rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHov(false);
  }, [rawX, rawY]);

  return (
    <motion.button
    onClick={onClick}
      ref={btnRef}
      style={{
        x,
        y,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: T.fb,
        fontSize: "13px",
        fontWeight: 600,
        color: hov ? "#fff" : accentColor,
        background: hov ? accentColor : accentLight,
        border: `1.5px solid ${hov ? accentColor : "transparent"}`,
        borderRadius: "100px",
        padding: "9px 20px",
        cursor: "pointer",
        letterSpacing: "0.01em",
        transition:
          "background 0.22s ease, color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: hov
          ? `0 6px 20px rgba(${
              accentColor === T.green
                ? "34,197,94"
                : accentColor === T.blue
                  ? "59,130,246"
                  : "20,184,166"
            },0.32)`
          : "none",
        willChange: "transform",
      }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING_STIFF}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      {/* arrow nudges on hover */}
      <motion.span
        animate={{ x: hov ? 4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        style={{ display: "inline-flex", fontSize: "12px" }}
      >
        →
      </motion.span>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   NEW: TEXT SHIMMER  — for card tag pill
   A moving highlight sweeps across the text.
═══════════════════════════════════════════════════════ */
function ShimmerTag({ text, color, bg }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          fontFamily: T.fb,
          fontSize: "10.5px",
          fontWeight: 600,
          color: color,
          background: bg,
          padding: "3px 10px",
          borderRadius: "100px",
          letterSpacing: "0.3px",
          textTransform: "uppercase",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* sweeping shine overlay */}
        <motion.span
          animate={{ x: ["-120%", "220%"] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UPGRADED: ROLE CARD
   Adds: cursor glow tracking, glass light streak,
   3-layer parallax depth, tilt (rotateX/Y).
═══════════════════════════════════════════════════════ */
function RoleCard({ role }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  /* ── raw pointer position inside card (0–1) ── */
  const pxRaw = useMotionValue(0.5);
  const pyRaw = useMotionValue(0.5);

  /* spring-smoothed versions for all effects */
  const px = useSpring(pxRaw, { stiffness: 160, damping: 22 });
  const py = useSpring(pyRaw, { stiffness: 160, damping: 22 });

  /* 3D tilt — rotateX/Y from pointer */
  const rotX = useTransform(py, [0, 1], [6, -6]);
  const rotY = useTransform(px, [0, 1], [-6, 6]);

  /* cursor glow position in px */
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const sgX = useSpring(glowX, { stiffness: 120, damping: 18 });
  const sgY = useSpring(glowY, { stiffness: 120, damping: 18 });

  /* light streak — sweeps based on px */
  const streakX = useTransform(px, [0, 1], ["-60%", "160%"]);

  /* depth parallax — icon moves most, desc least */
  const iconX = useTransform(px, [0, 1], [-6, 6]);
  const iconY = useTransform(py, [0, 1], [-6, 6]);
  const titleX = useTransform(px, [0, 1], [-3, 3]);
  const titleY = useTransform(py, [0, 1], [-3, 3]);
  const descX = useTransform(px, [0, 1], [-1.5, 1.5]);
  const descY = useTransform(py, [0, 1], [-1.5, 1.5]);

  /* hover state (for static CSS transitions) */
  const [hovered, setHovered] = useState(false);
  /* streak visibility */
  const [streakVisible, setStreakVisible] = useState(false);

  const onMouseMove = useCallback(
    (e) => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      pxRaw.set(nx);
      pyRaw.set(ny);
      glowX.set(e.clientX - r.left);
      glowY.set(e.clientY - r.top);
    },
    [pxRaw, pyRaw, glowX, glowY],
  );

  const onMouseEnter = useCallback(
    (e) => {
      setHovered(true);
      setStreakVisible(true);
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      pxRaw.set((e.clientX - r.left) / r.width);
      pyRaw.set((e.clientY - r.top) / r.height);
      /* hide streak after one sweep (~420ms) */
      setTimeout(() => setStreakVisible(false), 420);
    },
    [pxRaw, pyRaw],
  );

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    setStreakVisible(false);
    /* ease pointer back to centre */
    pxRaw.set(0.5);
    pyRaw.set(0.5);
  }, [pxRaw, pyRaw]);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={{
        boxShadow: hovered
          ? `0 24px 60px ${role.hoverGlow}, 0 8px 24px rgba(0,0,0,0.07)`
          : "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      }}
      style={{
        /* ── 3-D tilt via rotateX/Y from useTransform ── */
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        perspective: "800px",

        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.72)",
        borderRadius: "22px",
        padding: "30px 28px 26px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        willChange: "transform",
        transition: SPRING,
      }}
      transition={SPRING}
    >
      {/* ══ LAYER 0: fixed decorative elements ══ */}

      {/* 2px top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: role.topLine,
          borderRadius: "22px 22px 0 0",
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.28s ease",
          zIndex: 4,
        }}
      />

      {/* static corner gradient wash */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${role.accentColor}20 0%, transparent 70%)`,
          pointerEvents: "none",
          opacity: hovered ? 1 : 0.55,
          transition: "opacity 0.35s ease",
          zIndex: 1,
        }}
      />

      {/* ══ LAYER 1: cursor-tracking radial glow ══ */}
      <motion.div
        style={{
          position: "absolute",
          left: sgX,
          top: sgY,
          width: 260,
          height: 260,
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle, ${role.blobColor}0.13) 0%, transparent 65%)`,
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
          zIndex: 2,
          willChange: "transform",
        }}
      />

      {/* ══ LAYER 2: glass light streak ══ */}
      <AnimatePresence>
        {streakVisible && (
          <motion.div
            key="streak"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.38) 50%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 3,
              willChange: "transform",
              x: streakX,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* ══ LAYER 3: parallax content ══ */}

      {/* TAG — with shimmer */}
      <ShimmerTag text={role.tag} color={role.tagColor} bg={role.tagBg} />

      {/* ICON — fastest parallax layer */}
      <motion.div
        style={{
          x: iconX,
          y: iconY,
          width: 52,
          height: 52,
          borderRadius: "14px",
          background: role.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          marginBottom: "18px",
          flexShrink: 0,
          boxShadow: hovered
            ? `0 8px 20px rgba(${role.accentRgb},0.22), 0 0 0 1px ${role.accentColor}20`
            : `0 0 0 1px ${role.accentColor}18`,
          transition: "box-shadow 0.28s ease",
          willChange: "transform",
          zIndex: 5,
        }}
      >
        {role.icon}
      </motion.div>

      {/* TITLE — mid parallax layer */}
      <motion.h3
        style={{
          x: titleX,
          y: titleY,
          fontFamily: T.ff,
          fontSize: "20px",
          fontWeight: 500,
          color: T.g900,
          letterSpacing: "-0.2px",
          lineHeight: 1.2,
          marginBottom: "10px",
          willChange: "transform",
          zIndex: 5,
        }}
      >
        {role.title}
      </motion.h3>

      {/* DESC — slowest parallax layer */}
      <motion.p
        style={{
          x: descX,
          y: descY,
          fontFamily: T.fb,
          fontSize: "13.5px",
          color: T.g500,
          lineHeight: 1.68,
          marginBottom: "20px",
          fontWeight: 400,
          willChange: "transform",
          zIndex: 5,
        }}
      >
        {role.desc}
      </motion.p>

      {/* DIVIDER */}
      <div
        style={{
          height: "1px",
          background: T.g100,
          marginBottom: "16px",
          borderRadius: "1px",
          position: "relative",
          zIndex: 5,
        }}
      />

      {/* FEATURES — static (no parallax, keeps readability) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          marginBottom: "22px",
          flex: 1,
          position: "relative",
          zIndex: 5,
        }}
      >
        {role.features.map((f) => (
          <FeatureRow key={f.text} icon={f.icon} text={f.text} />
        ))}
      </div>

      {/* DIVIDER */}
      <div
        style={{
          height: "1px",
          background: T.g100,
          marginBottom: "20px",
          borderRadius: "1px",
          position: "relative",
          zIndex: 5,
        }}
      />

      {/* FOOTER: stat + magnetic CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: T.ff,
              fontSize: "17px",
              fontWeight: 500,
              color: T.g900,
              letterSpacing: "-0.2px",
              lineHeight: 1,
            }}
          >
            {role.stat.value}
          </span>
          <p
            style={{
              fontFamily: T.fb,
              fontSize: "10.5px",
              color: T.g400,
              marginTop: "2px",
              lineHeight: 1,
            }}
          >
            {role.stat.label}
          </p>
        </div>

        <CardCTA
  label={role.cta}
  accentColor={role.accentColor}
  accentLight={role.accentLight}
  onClick={() => {
    if (role.id === "ngo") navigate("/auth");
    if (role.id === "volunteer") navigate("/auth");
    if (role.id === "beneficiary") navigate("/auth");
  }}
/>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   UNCHANGED: CONNECTOR DOTS
═══════════════════════════════════════════════════════ */
function ConnectorDots() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        margin: "0 auto",
        paddingBottom: "40px",
      }}
    >
      {[T.greenLight, T.blueLight, T.tealLight].map((c, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: EASE }}
          style={{
            width: i === 1 ? 28 : 8,
            height: 6,
            borderRadius: "100px",
            background: c,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UNCHANGED: SECTION HEADER
═══════════════════════════════════════════════════════ */
function SectionHeader() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={makeStagger(0.04, 0.13)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={{
        textAlign: "center",
        marginBottom: "64px",
        maxWidth: "600px",
        margin: "0 auto 64px",
      }}
    >
      <motion.div variants={fadeUpHeader} style={{ marginBottom: "14px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: T.fb,
            fontSize: "10.5px",
            fontWeight: 600,
            color: T.g400,
            textTransform: "uppercase",
            letterSpacing: "0.9px",
            background: T.g100,
            padding: "4px 14px",
            borderRadius: "100px",
          }}
        >
          Who It's For
        </span>
      </motion.div>

      <motion.h2
        variants={fadeUpHeader}
        style={{
          fontFamily: T.ff,
          fontSize: "clamp(28px, 3.2vw, 42px)",
          fontWeight: 500,
          color: T.g900,
          letterSpacing: "-0.5px",
          lineHeight: 1.15,
          marginBottom: "16px",
        }}
      >
        One platform.{" "}
        <motion.span
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          style={{
            background: `linear-gradient(90deg, ${T.greenMid}, ${T.blue}, ${T.teal}, ${T.greenMid})`,
            backgroundSize: "240% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontStyle: "italic",
          }}
        >
          Three powerful roles.
        </motion.span>
      </motion.h2>

      <motion.p
        variants={fadeUpHeader}
        style={{
          fontFamily: T.fb,
          fontSize: "15.5px",
          color: T.g500,
          lineHeight: 1.7,
          fontWeight: 400,
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        Whether you lead, contribute, or receive support —{" "}
        <span style={{ color: T.g800, fontWeight: 500 }}>
          DigitalSevaks connects you.
        </span>
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   UNCHANGED: TRUST ROW
═══════════════════════════════════════════════════════ */
function TrustRow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const items = [
    { icon: "🔒", text: "Verified NGOs only" },
    { icon: "🤖", text: "AI-powered matching" },
    { icon: "📊", text: "Real-time impact tracking" },
    { icon: "🌍", text: "78 countries & growing" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
        marginTop: "52px",
      }}
    >
      {items.map((item) => (
        <div
          key={item.text}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${T.g200}`,
            borderRadius: "100px",
            padding: "7px 16px",
            fontFamily: T.fb,
            fontSize: "12.5px",
            color: T.g600,
            fontWeight: 500,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <span style={{ fontSize: "13px" }}>{item.icon}</span>
          {item.text}
        </div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROLES SECTION — main export
   Only change: FloatingBlobs added behind the content.
═══════════════════════════════════════════════════════ */
export default function Roles() {
  const cardsRef = useRef(null);
  const inView = useInView(cardsRef, { once: true, margin: "-80px" });

  return (
    <section
      id="roles"
      style={{
        background: "#f7f7f6",
        backgroundImage: [
          "radial-gradient(ellipse 65% 55% at 10% 20%, rgba(34,197,94,0.04) 0%, transparent 60%)",
          "radial-gradient(ellipse 55% 60% at 90% 80%, rgba(59,130,246,0.04) 0%, transparent 60%)",
          "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(20,184,166,0.03) 0%, transparent 55%)",
        ].join(","),
        padding: "100px 5% 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative circle rings — unchanged */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          border: `1px solid ${T.g200}`,
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          border: `1px solid ${T.g200}`,
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* ── NEW: slow drifting blobs ── */}
      <FloatingBlobs />

      {/* constrained content — unchanged */}
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <SectionHeader />
        <ConnectorDots />

        <motion.div
          ref={cardsRef}
          variants={makeStagger(0.06, 0.13)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            alignItems: "stretch",
            perspective: "1200px",
          }}
        >
          {ROLES.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </motion.div>

        <TrustRow />
      </div>
    </section>
  );
}
