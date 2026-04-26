import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useAnimation } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const T = {
  bg:         "#f8fafc",
  white:      "#ffffff",
  text:       "#0f172a",
  textMid:    "#475569",
  textLight:  "#94a3b8",
  border:     "rgba(15,23,42,0.07)",
  borderMid:  "rgba(15,23,42,0.11)",
  green:      "#22c55e",
  greenDark:  "#16a34a",
  greenLight: "rgba(34,197,94,0.10)",
  greenSoft:  "rgba(34,197,94,0.07)",
  blue:       "#3b82f6",
  blueSoft:   "rgba(59,130,246,0.08)",
  teal:       "#14b8a6",
  tealSoft:   "rgba(20,184,166,0.08)",
  shadowSm:   "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:   "0 4px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)",
  shadowLg:   "0 10px 36px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05)",
  ease:       [0.22, 1, 0.36, 1],
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════════════════════ */
const NGO_DATA = {
  name:    "GreenRoots Foundation",
  type:    "Environmental NGO",
  emoji:   "🌱",
  color:   T.green,
  colorSoft: T.greenSoft,
  needs: ["Web Developer", "Data Analyst", "Graphic Designer"],
  stat:  { label: "Open roles", value: "12" },
  location: "Mumbai, India",
};

const VOL_DATA = {
  name:    "Priya Sharma",
  type:    "Volunteer",
  emoji:   "👩‍💻",
  color:   T.blue,
  colorSoft: T.blueSoft,
  skills: ["React", "Python", "Data Viz"],
  stat:   { label: "Match score", value: "97%" },
  availability: "10 hrs / week",
};

const MATCH_LABELS = [
  { text: "Skills matched",        delay: 0.90 },
  { text: "Availability verified", delay: 1.10 },
  { text: "Impact aligned",        delay: 1.30 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED STYLES
═══════════════════════════════════════════════════════════════════════════ */
const card = {
  background: T.white,
  border:     `1px solid ${T.border}`,
  borderRadius: 20,
  boxShadow:  T.shadowMd,
  padding:    "24px",
};

/* ═══════════════════════════════════════════════════════════════════════════
   DATA FLOW PARTICLES  (SVG-based, lightweight)
═══════════════════════════════════════════════════════════════════════════ */
function DataFlowParticles({ active, direction = "ltr" }) {
  /* 5 staggered particles per lane */
  const particles = [0, 1, 2, 3, 4];
  const isLtr = direction === "ltr";

  return (
    <svg
      width="120" height="8"
      viewBox="0 0 120 8"
      style={{ overflow: "visible", display: "block" }}
      aria-hidden="true"
    >
      {/* track line */}
      <line
        x1="0" y1="4" x2="120" y2="4"
        stroke={isLtr ? T.green : T.blue}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      {/* animated particles */}
      {active && particles.map((p) => (
        <motion.circle
          key={p}
          cy="4"
          r="3"
          fill={isLtr ? T.green : T.blue}
          initial={{ cx: isLtr ? -4 : 124, opacity: 0 }}
          animate={{ cx: isLtr ? 124 : -4, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.4,
            delay: 0.85 + p * 0.22,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AI CORE  (animated centerpiece)
═══════════════════════════════════════════════════════════════════════════ */
function AICore({ active, matchFound }) {
  const nodes = [
    { x: 50, y: 50 },
    { x: 20, y: 26 }, { x: 80, y: 26 },
    { x: 14, y: 60 }, { x: 86, y: 60 },
    { x: 30, y: 80 }, { x: 70, y: 80 },
  ];
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,2],[3,5],[4,6],
  ];

  return (
    <motion.div
    id="ai-matching"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.88 }}
      transition={{ duration: 0.55, delay: 0.55, ease: T.ease }}
      style={{
        ...card,
        width: 180,
        height: 180,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: `linear-gradient(145deg, ${T.white} 0%, #f0fdf4 60%, #eff6ff 100%)`,
        boxShadow: matchFound
          ? `0 0 0 3px rgba(34,197,94,0.18), ${T.shadowLg}`
          : T.shadowLg,
        transition: "box-shadow 0.5s ease",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* soft ambient behind graph */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* neural network SVG */}
      <svg
        width="100" height="100"
        viewBox="0 0 100 100"
        style={{ position: "relative", zIndex: 1, overflow: "visible" }}
      >
        {/* edges */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke={matchFound ? T.green : T.teal}
            strokeWidth="1"
            strokeDasharray="60"
            initial={{ strokeDashoffset: 60, opacity: 0 }}
            animate={active ? { strokeDashoffset: 0, opacity: 0.35 } : {}}
            transition={{ duration: 0.6, delay: 0.65 + i * 0.04, ease: "easeOut" }}
          />
        ))}

        {/* nodes */}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y}
            r={i === 0 ? 7 : 4}
            fill={i === 0 ? (matchFound ? T.green : T.teal) : T.white}
            stroke={i === 0 ? (matchFound ? T.green : T.teal) : T.teal}
            strokeWidth={i === 0 ? 0 : 1.5}
            initial={{ scale: 0, opacity: 0 }}
            animate={active ? {
              scale: [0, 1.15, 1],
              opacity: 1,
              ...(matchFound && i === 0 ? { scale: [1, 1.25, 1] } : {}),
            } : {}}
            transition={{
              scale: { duration: 0.45, delay: 0.6 + i * 0.05, ease: T.ease },
              opacity: { duration: 0.3, delay: 0.6 + i * 0.05 },
              ...(matchFound && i === 0 ? {
                scale: { duration: 0.6, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }
              } : {}),
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>

      {/* "AI" label */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, delay: 0.9 }}
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%", transform: "translateX(-50%)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: T.teal,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        AI Engine
      </motion.div>

      {/* match badge */}
      <AnimatePresence>
        {matchFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.38, ease: T.ease }}
            style={{
              position: "absolute",
              top: -14,
              left: "50%", transform: "translateX(-50%)",
              background: `linear-gradient(135deg, ${T.green}, ${T.greenDark})`,
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.07em",
              padding: "4px 11px",
              borderRadius: 20,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
            }}
          >
            ✓ Match Found
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDE CARD  (NGO or Volunteer)
═══════════════════════════════════════════════════════════════════════════ */
function SideCard({ data, side, active, delay }) {
  const [hovered, setHovered] = useState(false);
  const isNgo = side === "ngo";
  const tags = isNgo ? data.needs : data.skills;
  const tagLabel = isNgo ? "Needs" : "Skills";
  const subInfo = isNgo ? data.location : data.availability;
  const subInfoIcon = isNgo ? "📍" : "⏱";

  return (
    <motion.div
      initial={{ opacity: 0, x: isNgo ? -36 : 36 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: T.ease }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ width: 220, flexShrink: 0, perspective: 800 }}
    >
      <motion.div
        animate={{
          y: hovered ? -5 : 0,
          rotateY: hovered ? (isNgo ? 3 : -3) : 0,
          rotateX: hovered ? -2 : 0,
          boxShadow: hovered ? T.shadowLg : T.shadowMd,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{
          ...card,
          background: hovered
            ? `linear-gradient(145deg, ${T.white}, ${data.colorSoft})`
            : T.white,
          borderColor: hovered ? data.color + "44" : T.border,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: data.colorSoft,
            border: `1px solid ${data.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}>
            {data.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: 13.5,
              color: T.text,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {data.name}
            </div>
            <div style={{ fontSize: 11, color: T.textLight, marginTop: 1 }}>{data.type}</div>
          </div>
        </div>

        {/* tags */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textLight,
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            {tagLabel}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={active ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: delay + 0.1 + i * 0.06, ease: T.ease }}
                style={{
                  fontSize: 11, fontWeight: 500,
                  color: data.color,
                  background: data.colorSoft,
                  border: `1px solid ${data.color}28`,
                  borderRadius: 6, padding: "3px 9px",
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: T.border, margin: "10px 0" }} />

        {/* footer stat + subinfo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: data.color, lineHeight: 1 }}>
              {data.stat.value}
            </div>
            <div style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>{data.stat.label}</div>
          </div>
          <div style={{
            fontSize: 11, color: T.textMid,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span>{subInfoIcon}</span>
            <span>{subInfo}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MATCH LINE  (connector between card and AI core)
═══════════════════════════════════════════════════════════════════════════ */
function MatchLine({ active, direction, matchFound }) {
  const isLtr = direction === "ltr";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay: 0.72 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        flexShrink: 0,
      }}
    >
      <DataFlowParticles active={active} direction={direction} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING LABEL  (appears during match sequence)
═══════════════════════════════════════════════════════════════════════════ */
function FloatingLabel({ text, delay, active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, delay, ease: T.ease }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11.5,
            fontWeight: 500,
            color: T.greenDark,
            background: T.greenSoft,
            border: `1px solid rgba(34,197,94,0.18)`,
            borderRadius: 20,
            padding: "5px 12px",
            whiteSpace: "nowrap",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, delay: delay + 0.15, repeat: Infinity, repeatDelay: 2.5 }}
            style={{ display: "inline-block", fontSize: 8, lineHeight: 1,
              width: 7, height: 7, borderRadius: "50%",
              background: T.green }}
          />
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function AISection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  /* orchestrated sequence */
  const [phase, setPhase] = useState(0);
  // phase 0 = idle, 1 = cards, 2 = core+lines, 3 = match, 4 = labels

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 100);   // cards slide in
    const t2 = setTimeout(() => setPhase(2), 580);   // core activates
    const t3 = setTimeout(() => setPhase(3), 1100);  // match found
    const t4 = setTimeout(() => setPhase(4), 1300);  // labels appear
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [inView]);

  const isActive    = phase >= 1;
  const coreActive  = phase >= 2;
  const matchFound  = phase >= 3;
  const labelsActive = phase >= 4;

  /* ── Styles (scoped inline) ────────────────────────────────────────── */
  const S = {
    section: {
      width: "100%",
      background: T.bg,
      padding: "100px 24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    inner: {
      maxWidth: 1080,
      margin: "0 auto",
    },
    /* ambient background blobs */
    blobGreen: {
      position: "absolute",
      width: 520, height: 380,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
      top: "10%", left: "-8%",
      pointerEvents: "none",
    },
    blobBlue: {
      position: "absolute",
      width: 480, height: 340,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
      bottom: "8%", right: "-6%",
      pointerEvents: "none",
    },
    dotGrid: {
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(circle, rgba(15,23,42,0.045) 1px, transparent 1px)`,
      backgroundSize: "28px 28px",
      pointerEvents: "none",
    },

    /* header */
    header: {
      textAlign: "center",
      marginBottom: 72,
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12,
      fontWeight: 600,
      color: T.greenDark,
      background: T.greenLight,
      border: `1px solid rgba(34,197,94,0.2)`,
      borderRadius: 20,
      padding: "5px 14px",
      marginBottom: 22,
      letterSpacing: "0.02em",
    },
    badgeDot: {
      width: 7, height: 7,
      borderRadius: "50%",
      background: T.green,
    },
    headline: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 800,
      color: T.text,
      lineHeight: 1.2,
      letterSpacing: "-0.03em",
      margin: "0 0 18px",
    },
    gradientWord: {
      background: `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtext: {
      fontSize: 17,
      color: T.textMid,
      lineHeight: 1.65,
      maxWidth: 500,
      margin: "0 auto",
    },

    /* visual area */
    visual: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      flexWrap: "wrap",
      marginBottom: 48,
      position: "relative",
    },
    labelRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 28,
      marginBottom: 64,
      minHeight: 36,
    },

    /* CTA */
    ctaWrap: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      flexWrap: "wrap",
    },
    ctaPrimary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 26px",
      fontSize: 15,
      fontWeight: 600,
      color: "#fff",
      background: `linear-gradient(135deg, ${T.green} 0%, ${T.greenDark} 100%)`,
      border: "1px solid rgba(22,163,74,0.25)",
      borderRadius: 11,
      textDecoration: "none",
      boxShadow: "0 4px 14px rgba(34,197,94,0.28)",
      cursor: "pointer",
      letterSpacing: "-0.01em",
    },
    ctaSecondary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "12px 22px",
      fontSize: 15,
      fontWeight: 500,
      color: T.textMid,
      background: T.white,
      border: `1px solid ${T.borderMid}`,
      borderRadius: 11,
      textDecoration: "none",
      boxShadow: T.shadowSm,
      cursor: "pointer",
      letterSpacing: "-0.01em",
    },
  };

  return (
    <section ref={sectionRef} id="ai" style={S.section}>
      {/* ambient backgrounds */}
      <div style={S.dotGrid} aria-hidden="true" />
      <div style={S.blobGreen} aria-hidden="true" />
      <div style={S.blobBlue} aria-hidden="true" />

      <div style={S.inner}>

        {/* ── HEADER ────────────────────────────────────────────────── */}
        <motion.div
          style={S.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: T.ease }}
        >
          <motion.div
            style={S.badge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: T.ease }}
          >
            <motion.span
              style={S.badgeDot}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            AI-Powered Matching
          </motion.div>

          <h2 style={S.headline}>
            <span style={S.gradientWord}>Smart matching</span>
            {" "}that understands{"\n"}both sides
          </h2>

          <p style={S.subtext}>
            Our AI reads between the lines — analyzing skills, schedules, and values
            to connect the right volunteers with the right organizations, every time.
          </p>
        </motion.div>

        {/* ── AI VISUAL ─────────────────────────────────────────────── */}
        <div style={S.visual}>
          {/* NGO card */}
          <SideCard
            data={NGO_DATA}
            side="ngo"
            active={isActive}
            delay={0.1}
          />

          {/* connector left */}
          <div style={{ padding: "0 18px", flexShrink: 0 }}>
            <MatchLine active={coreActive} direction="ltr" matchFound={matchFound} />
          </div>

          {/* AI Core */}
          <AICore active={coreActive} matchFound={matchFound} />

          {/* connector right */}
          <div style={{ padding: "0 18px", flexShrink: 0 }}>
            <MatchLine active={coreActive} direction="rtl" matchFound={matchFound} />
          </div>

          {/* Volunteer card */}
          <SideCard
            data={VOL_DATA}
            side="volunteer"
            active={isActive}
            delay={0.22}
          />
        </div>

        {/* ── FLOATING LABELS ────────────────────────────────────────── */}
        <div style={S.labelRow} aria-live="polite">
          {MATCH_LABELS.map(({ text, delay }) => (
            <FloatingLabel
              key={text}
              text={text}
              delay={delay}
              active={labelsActive}
            />
          ))}
        </div>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <motion.div
          style={S.ctaWrap}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.35, ease: T.ease }}
        >
          <motion.a
            href="#demo"
            style={S.ctaPrimary}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(34,197,94,0.36)" }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          >
            See AI in action
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >→</motion.span>
          </motion.a>

          {/* <motion.a
            href="#how"
            style={S.ctaSecondary}
            whileHover={{ y: -2, boxShadow: T.shadowMd, borderColor: "rgba(15,23,42,0.18)" }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          >
            Learn how it works
          </motion.a> */}
        </motion.div>

      </div>
    </section>
  );
}
