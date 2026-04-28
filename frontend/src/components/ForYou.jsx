import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const T = {
  green: "#22c55e",
  greenLight: "#f0fdf4",
  greenMid: "#dcfce7",
  greenDark: "#15803d",
  blue: "#3b82f6",
  blueLight: "#eff6ff",
  blueMid: "#bfdbfe",
  blueDark: "#1d4ed8",
  teal: "#14b8a6",
  tealLight: "#f0fdfa",
  tealMid: "#99f6e4",
  violet: "#8b5cf6",
  violetLight: "#f5f3ff",
  violetMid: "#ddd6fe",
  amber: "#f59e0b",
  amberLight: "#fffbeb",
  amberMid: "#fde68a",
  text: "#0f172a",
  textSub: "#475569",
  textMuted: "#94a3b8",
  border: "rgba(15,23,42,0.07)",
  borderMid: "rgba(15,23,42,0.13)",
  bg: "#ffffff",
  surface: "#f8fafc",
  surfaceDeep: "#f1f5f9",
  font: "'Inter', system-ui, sans-serif",
  shadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.08), 0 12px 36px rgba(0,0,0,0.07)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.10), 0 24px 56px rgba(0,0,0,0.08)",
  radius: "20px",
  radiusSm: "12px",
  radiusXl: "28px",
  radiusPill: "999px",
};

// ─── Audience data ──────────────────────────────────────────────────────────────
const AUDIENCES = [
  {
    id: "ngo",
    side: "left",
    eyebrow: "For NGOs & Nonprofits",
    headline: "Run your mission at full capacity",
    sub: "Stop losing weeks to manual volunteer coordination. DigitalSevaks gives your team the tools to find, vet, onboard, and measure — automatically.",
    cta: "Register Your NGO",
    // ctaSecondary: "See NGO Demo",
    accent: T.green,
    accentLight: T.greenLight,
    accentMid: T.greenMid,
    accentDark: T.greenDark,
    gradFrom: "#f0fdf4",
    gradTo: "#fafffe",
    glowColor: "rgba(34,197,94,0.12)",
    icon: "🏛️",
    metricColor: T.green,
    stats: [
      { value: "80%", label: "less admin time" },
      { value: "12×", label: "faster onboarding" },
      { value: "2,900+", label: "NGOs active" },
    ],
    benefits: [
      {
        icon: "🧠",
        title: "AI-Powered Intake",
        desc: "Describe your need once. Our engine converts it into a structured brief and begins matching within seconds.",
        tag: "Automation",
        tagAccent: T.green,
      },
      {
        icon: "🔍",
        title: "Verified Volunteer Profiles",
        desc: "Every volunteer is background-checked, skill-verified, and rated by past organisations.",
        tag: "Trust",
        tagAccent: T.teal,
      },
      {
        icon: "📊",
        title: "Live Impact Dashboard",
        desc: "Real-time metrics on hours contributed, outcomes achieved, and campaign fill rates — shareable with donors.",
        tag: "Transparency",
        tagAccent: T.blue,
      },
      {
        icon: "⚡",
        title: "Zero-Setup Coordination",
        desc: "Scheduling, reminders, onboarding docs, and compliance reporting handled entirely by the platform.",
        tag: "Efficiency",
        tagAccent: T.violet,
      },
    ],
    testimonial: {
      quote:
        "We went from 200 to 4,000 volunteers in six months. The dashboard gave our board the evidence to unlock a $2M grant.",
      name: "James Mwangi",
      role: "Executive Director · Africa Water Initiative",
      avatar: "JM",
      avatarBg: "#dbeafe",
      avatarText: T.blue,
    },
  },
  {
    id: "volunteer",
    side: "right",
    eyebrow: "For Volunteers & Donors",
    headline: "Your skills. The world's biggest problems.",
    sub: "Find opportunities that match your expertise, schedule, and values — then watch your contribution create verifiable, measurable change.",
    cta: "Join as Volunteer",
    // ctaSecondary: "Browse Campaigns",
    accent: T.blue,
    accentLight: T.blueLight,
    accentMid: T.blueMid,
    accentDark: T.blueDark,
    gradFrom: "#eff6ff",
    gradTo: "#fafffe",
    glowColor: "rgba(59,130,246,0.12)",
    icon: "🙋",
    metricColor: T.blue,
    stats: [
      { value: "< 30s", label: "to find a match" },
      { value: "48K+", label: "active volunteers" },
      { value: "190", label: "countries covered" },
    ],
    benefits: [
      {
        icon: "🎯",
        title: "Precision Matching",
        desc: "40+ signals surface opportunities that actually fit your skills, timezone, language, and cause preferences.",
        tag: "Smart Match",
        tagAccent: T.blue,
      },
      {
        icon: "📱",
        title: "Remote or In-Person",
        desc: "Choose fully remote tech contributions, local in-person roles, or hybrid arrangements — all on one platform.",
        tag: "Flexibility",
        tagAccent: T.teal,
      },
      {
        icon: "🏆",
        title: "Verified Impact Score",
        desc: "Build a portable, verified record of your contributions — useful for CVs, grant applications, and portfolio.",
        tag: "Recognition",
        tagAccent: T.violet,
      },
      {
        icon: "🌐",
        title: "Global Community",
        desc: "Connect with 48,000+ volunteers across 190 countries. Share knowledge, co-lead campaigns, make lifelong connections.",
        tag: "Network",
        tagAccent: T.green,
      },
    ],
    testimonial: {
      quote:
        "DigitalSevaks surfaced a farm-irrigation project in Ghana in under 30 seconds. Six months later I'm tech lead across 14 countries.",
      name: "Sofia Lima",
      role: "Software Engineer → Tech Volunteer",
      avatar: "SL",
      avatarBg: "#ede9fe",
      avatarText: T.violet,
    },
  },
];

// ─── Tiny benefit card ──────────────────────────────────────────────────────────
function BenefitCard({
  benefit,
  accent,
  accentLight,
  index,
  inView,
  panelHovered,
}) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowBg = useTransform(
    [mouseX, mouseY],
    ([mx, my]) =>
      `radial-gradient(200px circle at ${mx}px ${my}px, ${accent}18, transparent 70%)`,
  );

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const rY = useSpring(rawY, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(rX, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(rY, [-0.5, 0.5], [-3, 3]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
    rawX.set((e.clientY - r.top) / r.height - 0.5);
    rawY.set((e.clientX - r.left) / r.width - 0.5);
  };
  const onLeave = () => {
    setHov(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: 0.3 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHov(true)}
        animate={{
          boxShadow: hov ? T.shadowLg : T.shadow,
          borderColor: hov ? `${accent}30` : T.border,
          y: hov ? -4 : 0,
        }}
        transition={{ duration: 0.22 }}
        style={{
          background: T.bg,
          border: "1px solid",
          borderColor: T.border,
          borderRadius: T.radius,
          padding: "18px 20px",
          position: "relative",
          overflow: "hidden",
          cursor: "default",
          boxShadow: T.shadow,
        }}
      >
        {/* Glow */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: T.radius,
            background: glowBg,
            pointerEvents: "none",
            opacity: hov ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />

        {/* Bottom bar */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0, opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: "2px",
            borderRadius: "2px 2px 0 0",
            background: `linear-gradient(90deg, transparent, ${accent}70, transparent)`,
            transformOrigin: "center",
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <motion.div
            animate={
              hov
                ? { scale: 1.1, rotate: [0, -6, 6, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={
              hov
                ? { type: "spring", stiffness: 260, damping: 14 }
                : { duration: 0.3 }
            }
            style={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: accentLight,
              border: `1px solid ${accent}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
            }}
          >
            {benefit.icon}
          </motion.div>

          <span
            style={{
              fontFamily: T.font,
              fontSize: "10px",
              fontWeight: 700,
              color: benefit.tagAccent,
              background: `${benefit.tagAccent}12`,
              border: `1px solid ${benefit.tagAccent}25`,
              borderRadius: T.radiusPill,
              padding: "3px 9px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {benefit.tag}
          </span>
        </div>

        <div
          style={{
            fontFamily: T.font,
            fontSize: "14px",
            fontWeight: 700,
            color: T.text,
            marginBottom: "5px",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {benefit.title}
        </div>

        <div
          style={{
            fontFamily: T.font,
            fontSize: "12.5px",
            fontWeight: 300,
            color: T.textSub,
            lineHeight: 1.7,
          }}
        >
          {benefit.desc}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Testimonial quote card ─────────────────────────────────────────────────────
function TestiCard({ testi, accent, accentLight, accentMid, inView, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: accentLight,
        border: `1px solid ${accentMid}`,
        borderRadius: T.radius,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "32px",
          color: accent,
          lineHeight: 0.7,
          userSelect: "none",
        }}
      >
        "
      </div>
      <p
        style={{
          fontFamily: T.font,
          fontSize: "13px",
          fontWeight: 300,
          color: T.textSub,
          lineHeight: 1.75,
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {testi.quote}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: testi.avatarBg,
            border: `1.5px solid ${accent}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: T.font,
            fontSize: "11px",
            fontWeight: 700,
            color: testi.avatarText,
            flexShrink: 0,
          }}
        >
          {testi.avatar}
        </div>
        <div>
          <div
            style={{
              fontFamily: T.font,
              fontSize: "12px",
              fontWeight: 700,
              color: T.text,
            }}
          >
            {testi.name}
          </div>
          <div
            style={{
              fontFamily: T.font,
              fontSize: "11px",
              fontWeight: 300,
              color: T.textMuted,
              marginTop: "1px",
            }}
          >
            {testi.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Audience Panel ─────────────────────────────────────────────────────────────

function AudiencePanel({ audience, inView, isLeft }) {
  const ref = useRef(null);
  const [panelHov, setPanelHov] = useState(false);
  const { accent, accentLight, accentMid, accentDark, glowColor } = audience;
  const navigate = useNavigate();

  const slideDir = isLeft ? -28 : 28;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: slideDir }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.75,
        delay: isLeft ? 0.1 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setPanelHov(true)}
      onMouseLeave={() => setPanelHov(false)}
      style={{
        background: T.bg,
        border: `1px solid ${panelHov ? accent + "25" : T.border}`,
        borderRadius: T.radiusXl,
        padding: "clamp(24px, 3.5vw, 40px)",
        position: "relative",
        overflow: "hidden",
        boxShadow: panelHov ? T.shadowLg : T.shadowMd,
        transition: "border-color 0.3s, box-shadow 0.35s",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Panel ambient glow */}
      <motion.div
        animate={{ opacity: panelHov ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(55% 40% at ${isLeft ? "15%" : "85%"} 10%, ${glowColor}, transparent 70%)`,
          borderRadius: T.radiusXl,
        }}
      />

      {/* Subtle gradient stripe top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          borderRadius: `${T.radiusXl} ${T.radiusXl} 0 0`,
          background: `linear-gradient(90deg, ${accent}, ${accent === T.green ? T.teal : T.teal})`,
          opacity: panelHov ? 1 : 0.4,
          transition: "opacity 0.3s",
        }}
      />

      {/* ── Header ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: isLeft ? 0.15 : 0.28 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: accentLight,
            border: `1px solid ${accentMid}`,
            borderRadius: T.radiusPill,
            padding: "5px 13px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "15px" }}>{audience.icon}</span>
          <span
            style={{
              fontFamily: T.font,
              fontSize: "12px",
              fontWeight: 600,
              color: accent,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {audience.eyebrow}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: isLeft ? 0.22 : 0.35 }}
          style={{
            fontFamily: T.font,
            fontSize: "clamp(22px, 2.8vw, 32px)",
            fontWeight: 800,
            color: T.text,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            margin: "0 0 12px",
            maxWidth: "380px",
          }}
        >
          {/* Gradient first word */}
          <span
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent === T.green ? T.teal : T.violet})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {audience.headline.split(" ").slice(0, 2).join(" ")}
          </span>{" "}
          {audience.headline.split(" ").slice(2).join(" ")}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: isLeft ? 0.3 : 0.43 }}
          style={{
            fontFamily: T.font,
            fontSize: "clamp(13px, 1.3vw, 15px)",
            fontWeight: 300,
            color: T.textSub,
            lineHeight: 1.75,
            margin: 0,
            maxWidth: "400px",
          }}
        >
          {audience.sub}
        </motion.p>
      </div>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: isLeft ? 0.35 : 0.48 }}
        style={{
          display: "flex",
          gap: "0",
          background: T.surface,
          borderRadius: T.radius,
          border: `1px solid ${T.border}`,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {audience.stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              padding: "16px 14px",
              textAlign: "center",
              borderRight:
                i < audience.stats.length - 1
                  ? `1px solid ${T.border}`
                  : "none",
            }}
          >
            <div
              style={{
                fontFamily: T.font,
                fontSize: "clamp(18px, 2.2vw, 24px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: accent,
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: T.font,
                fontSize: "11px",
                fontWeight: 500,
                color: T.textMuted,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Benefit cards 2×2 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "10px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {audience.benefits.map((b, i) => (
          <BenefitCard
            key={b.title}
            benefit={b}
            accent={accent}
            accentLight={accentLight}
            index={i}
            inView={inView}
            panelHovered={panelHov}
          />
        ))}
      </div>

      {/* ── Testimonial ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <TestiCard
          testi={audience.testimonial}
          accent={accent}
          accentLight={accentLight}
          accentMid={accentMid}
          inView={inView}
          delay={isLeft ? 0.65 : 0.78}
        />
      </div>

      {/* ── CTAs ── */}
      <motion.div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <PanelCTA
          label={audience.cta}
          accent={accent}
          primary
          onClick={() => {
            if (audience.id === "ngo") navigate("/auth");
            if (audience.id === "volunteer") navigate("/auth");
          }}
        />

        <PanelCTA
          label={audience.ctaSecondary}
          accent={accent}
          primary={false}
          onClick={() => {
            if (audience.id === "ngo") navigate("/auth");
            if (audience.id === "volunteer") navigate("/auth");
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Panel CTA button ───────────────────────────────────────────────────────────
function PanelCTA({ label, accent, primary, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      ref={ref}
      style={{
        x: sx,
        y: sy,
        fontFamily: T.font,
        fontSize: "13.5px",
        fontWeight: 600,
        color: primary ? "#fff" : accent,
        background: primary ? accent : `${accent}12`,
        border: primary ? "none" : `1px solid ${accent}30`,
        borderRadius: T.radiusPill,
        padding: "11px 24px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        letterSpacing: "0.01em",
        boxShadow:
          primary && hov
            ? `0 6px 24px ${accent}40`
            : primary
              ? `0 3px 12px ${accent}25`
              : "none",
        transition: "box-shadow 0.3s, background 0.25s",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        setHov(false);
      }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.95 }}
    >
      <span>{label}</span>
      <motion.span
        animate={hov ? { x: 4 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ fontSize: "15px" }}
      >
        →
      </motion.span>
    </motion.button>
  );
}

// ─── Center divider ─────────────────────────────────────────────────────────────
function CenterDivider({ inView }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        flexShrink: 0,
        width: "48px",
        alignSelf: "stretch",
        position: "relative",
      }}
    >
      {/* Vertical line top */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          flex: 1,
          width: "1.5px",
          background: `linear-gradient(to bottom, transparent, ${T.borderMid})`,
          transformOrigin: "top",
        }}
      />

      {/* OR badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          duration: 0.4,
          delay: 0.6,
          type: "spring",
          stiffness: 260,
        }}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: T.bg,
          border: `1px solid ${T.borderMid}`,
          boxShadow: T.shadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
          fontSize: "11px",
          fontWeight: 700,
          color: T.textMuted,
          flexShrink: 0,
          letterSpacing: "0.05em",
        }}
      >
        OR
      </motion.div>

      {/* Vertical line bottom */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          flex: 1,
          width: "1.5px",
          background: `linear-gradient(to bottom, ${T.borderMid}, transparent)`,
          transformOrigin: "bottom",
        }}
      />
    </div>
  );
}

// ─── Ambient blobs ──────────────────────────────────────────────────────────────
function AmbientBlobs() {
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
      {[
        { x: "-5%", y: "5%", w: 400, color: `${T.green}0a`, dur: 20, delay: 0 },
        { x: "70%", y: "0%", w: 360, color: `${T.blue}0a`, dur: 24, delay: 5 },
        { x: "42%", y: "55%", w: 280, color: `${T.teal}08`, dur: 18, delay: 9 },
        {
          x: "88%",
          y: "65%",
          w: 220,
          color: `${T.violet}07`,
          dur: 15,
          delay: 3,
        },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 26, -18, 0],
            y: [0, -20, 13, 0],
            scale: [1, 1.05, 0.97, 1],
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

// ─── Toggle tabs (mobile) ───────────────────────────────────────────────────────
function AudienceTabs({ active, setActive }) {
  return (
    <motion.div
      style={{
        display: "flex",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusPill,
        padding: "4px",
        width: "fit-content",
        margin: "0 auto 32px",
      }}
    >
      {[
        { id: "ngo", label: "🏛️ For NGOs" },
        { id: "volunteer", label: "🙋 For Volunteers" },
      ].map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: T.font,
            fontSize: "13px",
            fontWeight: 600,
            color:
              active === tab.id
                ? tab.id === "ngo"
                  ? T.green
                  : T.blue
                : T.textMuted,
            background: active === tab.id ? T.bg : "transparent",
            border: "none",
            borderRadius: T.radiusPill,
            padding: "9px 22px",
            cursor: "pointer",
            boxShadow: active === tab.id ? T.shadow : "none",
            transition: "all 0.25s",
          }}
        >
          {tab.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── Bottom unified CTA bar ─────────────────────────────────────────────────────
// function BottomCTA({ inView }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 22 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.6, delay: 0.9 }}
//       style={{
//         marginTop: "clamp(40px, 6vw, 64px)",
//         padding: "clamp(24px, 3.5vw, 36px) clamp(28px, 5vw, 52px)",
//         background: T.bg,
//         border: `1px solid ${T.border}`,
//         borderRadius: T.radiusXl,
//         boxShadow: T.shadowMd,
//         display: "flex", flexWrap: "wrap",
//         alignItems: "center", justifyContent: "space-between",
//         gap: "24px", position: "relative", overflow: "hidden",
//       }}
//     >
//       {/* Background gradient */}
//       <div style={{
//         position: "absolute", inset: 0, pointerEvents: "none",
//         background: `linear-gradient(105deg, ${T.greenLight} 0%, ${T.bg} 40%, ${T.blueLight} 100%)`,
//         opacity: 0.6,
//       }} />
//       <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px",
//         background: `linear-gradient(90deg, ${T.green}, ${T.teal}, ${T.blue})` }} />

//       {/* <div style={{ position: "relative", zIndex: 1 }}>
//         <div style={{
//           fontFamily: T.font,
//           fontSize: "clamp(18px, 2.5vw, 26px)",
//           fontWeight: 800, color: T.text,
//           letterSpacing: "-0.025em", marginBottom: "6px",
//         }}>
//           Not sure where to start?
//         </div>
//         <div style={{
//           fontFamily: T.font, fontSize: "14px",
//           fontWeight: 300, color: T.textSub,
//         }}>
//           Our 2-minute quiz finds the best path for your goals — NGO, volunteer, or donor.
//         </div>
//       </div> */}

//       {/* <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
//         {[
//           { label: "Take the Quiz →", primary: true },
//           { label: "Talk to a human", primary: false },
//         ].map(({ label, primary }) => (
//           <motion.button
//             key={label}
//             whileHover={{ scale: 1.04, y: -2 }}
//             whileTap={{ scale: 0.96 }}
//             style={{
//               fontFamily: T.font, fontSize: "14px", fontWeight: 600,
//               color:      primary ? "#fff" : T.text,
//               background: primary
//                 ? `linear-gradient(135deg, ${T.green}, ${T.blue})`
//                 : T.bg,
//               border:     primary ? "none" : `1px solid ${T.borderMid}`,
//               borderRadius: T.radiusPill, padding: "12px 28px",
//               cursor: "pointer",
//               boxShadow: primary ? `0 4px 20px rgba(34,197,94,0.3)` : T.shadow,
//             }}
//           >{label}</motion.button>
//         ))}
//       </div> */}
//     </motion.div>
//   );
// }

// ─── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 52px" }}
    >
      {/* Badge */}
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
          borderRadius: T.radiusPill,
          padding: "6px 14px",
          marginBottom: "20px",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: T.green,
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
          Built for Everyone
        </span>
      </motion.div>

      <h2
        style={{
          fontFamily: T.font,
          fontSize: "clamp(28px, 4.5vw, 50px)",
          fontWeight: 800,
          color: T.text,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          margin: "0 0 16px",
        }}
      >
        One platform.{" "}
        <span
          style={{
            background: `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Two powerful paths.
        </span>
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
        Whether you're mobilising volunteers or offering your skills,
        DigitalSevaks meets you exactly where you are.
      </p>
    </motion.div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────
export default function ForYou() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.06 });
  const [activeTab, setActiveTab] = useState("ngo");

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: T.surface,
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 72px)",
        overflow: "hidden",
        fontFamily: T.font,
      }}
    >
      <AmbientBlobs />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <SectionHeader inView={inView} />

        {/* Mobile tab toggle */}
        <div style={{ display: "none" }}>
          <AudienceTabs active={activeTab} setActive={setActiveTab} />
        </div>

        {/* Main dual-panel layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "0",
            alignItems: "start",
          }}
        >
          <AudiencePanel audience={AUDIENCES[0]} inView={inView} isLeft />
          <CenterDivider inView={inView} />
          <AudiencePanel
            audience={AUDIENCES[1]}
            inView={inView}
            isLeft={false}
          />
        </div>

        {/* <BottomCTA inView={inView} /> */}
      </div>
    </section>
  );
}
