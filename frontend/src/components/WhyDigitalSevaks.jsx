import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  green: "#22c55e", greenDark: "#16a34a", greenLight: "#4ade80",
  blue: "#3b82f6", blueDark: "#1d4ed8",
  teal: "#14b8a6",
  text: "#0f172a", text2: "#475569", text3: "#94a3b8",
};

// ─── FONT INJECTION ────────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    .why-section * { box-sizing: border-box; }
    .why-section { font-family: 'Plus Jakarta Sans', sans-serif; }
  `}</style>
);

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, decimals = 0, triggerRef }) => {
  const [val, setVal] = useState(0);
  const inView = useInView(triggerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (1800 / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(decimals ? parseFloat(start.toFixed(decimals)) : Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  return <span>{decimals ? val.toFixed(decimals) : val.toLocaleString()}</span>;
};

// ─── FEATURE CARDS DATA ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🎯",
    title: "Smart Matching",
    desc: "AI connects the right sevaks to the right causes — instantly and intelligently.",
    tag: "AI Powered",
    gradient: `linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.1))`,
    glowColor: "rgba(34,197,94,0.25)",
    tagBg: "rgba(34,197,94,0.1)",
    tagColor: T.greenDark,
    tagDot: T.green,
    stripGrad: `linear-gradient(90deg, ${T.green}, ${T.teal})`,
    hoverGlow: `radial-gradient(circle at 30% 30%, rgba(34,197,94,0.08), transparent 70%)`,
    floatOffset: 0,
    marginTop: 0,
  },
  {
    icon: "⚡",
    title: "Real-time Impact",
    desc: "Track contributions, hours, and outcomes live as they happen across campaigns.",
    tag: "Live Dashboard",
    gradient: `linear-gradient(135deg, rgba(20,184,166,0.15), rgba(59,130,246,0.1))`,
    glowColor: "rgba(20,184,166,0.25)",
    tagBg: "rgba(20,184,166,0.1)",
    tagColor: "#0d9488",
    tagDot: T.teal,
    stripGrad: `linear-gradient(90deg, ${T.teal}, ${T.blue})`,
    hoverGlow: `radial-gradient(circle at 30% 30%, rgba(20,184,166,0.08), transparent 70%)`,
    floatOffset: 0.6,
    marginTop: 24,
  },
  {
    icon: "🔒",
    title: "Verified NGOs",
    desc: "Only trusted and rigorously verified organizations are onboarded to our platform.",
    tag: "100% Trusted",
    gradient: `linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,197,94,0.08))`,
    glowColor: "rgba(59,130,246,0.25)",
    tagBg: "rgba(59,130,246,0.1)",
    tagColor: T.blueDark,
    tagDot: T.blue,
    stripGrad: `linear-gradient(90deg, ${T.blue}, ${T.green})`,
    hoverGlow: `radial-gradient(circle at 30% 30%, rgba(59,130,246,0.08), transparent 70%)`,
    floatOffset: 1.1,
    marginTop: -12,
  },
  {
    icon: "🌍",
    title: "Scalable Change",
    desc: "From local communities to nationwide impact — built to grow without limits.",
    tag: "Pan-India Scale",
    gradient: `linear-gradient(135deg, rgba(74,222,128,0.15), rgba(59,130,246,0.1))`,
    glowColor: "rgba(74,222,128,0.25)",
    tagBg: "rgba(34,197,94,0.08)",
    tagColor: T.greenDark,
    tagDot: T.greenLight,
    stripGrad: `linear-gradient(90deg, ${T.green}, ${T.blue})`,
    hoverGlow: `radial-gradient(circle at 30% 30%, rgba(34,197,94,0.07), transparent 70%)`,
    floatOffset: 1.7,
    marginTop: 12,
  },
];

// ─── FEATURE CARD ──────────────────────────────────────────────────────────────
const FeatureCard = ({ feature, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cx * 6, y: -cy * 6 });
  };

  const floatDurations = [4.2, 4.8, 3.9, 5.1];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: feature.marginTop } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.7, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={hovered ? {} : {
          y: [feature.marginTop, feature.marginTop - 10, feature.marginTop],
        }}
        transition={hovered ? {} : {
          duration: floatDurations[index],
          delay: feature.floatOffset,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          y: feature.marginTop - 14,
          scale: 1.038,
          boxShadow: "0 24px 60px rgba(0,0,0,0.11), 0 6px 16px rgba(0,0,0,0.07)",
          rotateX: tilt.y,
          rotateY: tilt.x,
        }}
        onMouseMove={handleMouseMove}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
        style={{
          background: "rgba(255,255,255,0.84)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.92)",
          borderRadius: 22,
          padding: "28px 24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
          cursor: "default",
          position: "relative",
          overflow: "hidden",
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        {/* Top gradient strip */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: feature.stripGrad, borderRadius: "22px 22px 0 0",
        }} />

        {/* Hover glow overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", inset: 0, borderRadius: 22,
            background: feature.hoverGlow, pointerEvents: "none",
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, delay: feature.floatOffset, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0, borderRadius: 16,
            background: `radial-gradient(circle, ${feature.glowColor}, transparent)`,
            pointerEvents: "none",
            width: 52, height: 52,
          }}
        />
        <div style={{
          width: 52, height: 52, borderRadius: 16, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 24,
          background: feature.gradient, marginBottom: 18, position: "relative",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}>
          {feature.icon}
        </div>

        {/* Content */}
        <div style={{ fontFamily: "Sora, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: T.text, marginBottom: 8, lineHeight: 1.3 }}>
          {feature.title}
        </div>
        <div style={{ fontSize: "0.85rem", color: T.text2, lineHeight: 1.65 }}>
          {feature.desc}
        </div>

        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          marginTop: 16, padding: "5px 11px", borderRadius: 999,
          background: feature.tagBg, fontSize: 11, fontWeight: 700,
          color: feature.tagColor, letterSpacing: "0.04em",
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: feature.tagDot }} />
          {feature.tag}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── ANIMATED BLOB ─────────────────────────────────────────────────────────────
const Blob = ({ style, duration, delay }) => (
  <motion.div
    animate={{ x: [0, 30, -20, 15, 0], y: [0, -40, 25, -15, 0], scale: [1, 1.08, 0.95, 1.05, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    style={{ position: "absolute", borderRadius: "50%", filter: "blur(70px)", opacity: 0.55, ...style }}
  />
);

// ─── MAIN SECTION ──────────────────────────────────────────────────────────────
export default function WhyDigitalSevaks() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Subtle parallax on mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width * 20);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height * 14);
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <FontStyle />
      <section
        ref={sectionRef}
        className="why-section"
        onMouseMove={handleMouseMove}
        style={{
          position: "relative", minHeight: "100vh",
          padding: "7rem 2rem", display: "flex",
          alignItems: "center", justifyContent: "center",
          overflow: "hidden", background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 30%, #eff6ff 65%, #f0f9ff 100%)",
        }}
      >
        {/* Divider */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.2), rgba(59,130,246,0.15), transparent)",
        }} />

        {/* Background blobs */}
        <Blob style={{ width: 500, height: 500, top: "-10%", left: "-8%", background: "radial-gradient(circle, rgba(34,197,94,0.28), rgba(20,184,166,0.12))" }} duration={16} delay={0} />
        <Blob style={{ width: 600, height: 600, bottom: "-15%", right: "-10%", background: "radial-gradient(circle, rgba(59,130,246,0.22), rgba(20,184,166,0.1))" }} duration={20} delay={-6} />
        <Blob style={{ width: 350, height: 350, top: "40%", left: "38%", background: "radial-gradient(circle, rgba(74,222,128,0.18), rgba(96,165,250,0.1))" }} duration={13} delay={-3} />

        {/* Mesh grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 2, maxWidth: 1200, width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center",
        }}>

          {/* ── LEFT ── */}
          <motion.div
            ref={leftRef}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 999, padding: "7px 16px", marginBottom: 28, width: "fit-content",
            }}>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${T.green}, ${T.teal})` }}
              />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: T.greenDark, letterSpacing: "0.08em" }}>
                WHY DIGITAL SEVAKS
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2 variants={itemVariants} style={{
              fontFamily: "Sora, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800, color: T.text, lineHeight: 1.1, marginBottom: 20,
            }}>
              Built to Turn<br />
              <span style={{
                background: `linear-gradient(135deg, ${T.green} 0%, ${T.teal} 50%, ${T.blue} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Intent into Impact
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p variants={itemVariants} style={{
              fontSize: "1.05rem", color: T.text2, lineHeight: 1.75,
              maxWidth: 400, marginBottom: 40,
            }}>
              We've engineered the fastest bridge between passionate volunteers and the NGOs that need them — so no good intention ever goes to waste.
            </motion.p>

            {/* Stats */}
            <motion.div variants={itemVariants} style={{ display: "flex", gap: 28, marginBottom: 40 }}>
              {[
                { target: 48, suffix: "K+", label: "Active Sevaks", decimals: 0 },
                { target: 1200, suffix: "+", label: "Verified NGOs", decimals: 0 },
                { target: 6.2, suffix: "M", label: "Impact Hours", decimals: 1 },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ fontFamily: "Sora, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: T.text }}>
                    <span style={{
                      background: `linear-gradient(135deg, ${T.green}, ${T.teal})`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      <AnimatedCounter target={s.target} decimals={s.decimals} triggerRef={sectionRef} />
                    </span>
                    {s.suffix}
                  </div>
                  <div style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 32 }}>
              <motion.button
                whileHover={{ y: -3, scale: 1.04, boxShadow: "0 12px 32px rgba(34,197,94,0.45)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "14px 28px", borderRadius: 14, border: "none",
                  background: `linear-gradient(135deg, ${T.green}, ${T.greenDark})`,
                  color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer",
                  fontFamily: "Plus Jakarta Sans, sans-serif", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 6px 20px rgba(34,197,94,0.35)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Start Your Journey
              </motion.button>
              <motion.button
                whileHover={{ background: "rgba(34,197,94,0.12)", borderColor: T.green }}
                style={{
                  padding: "14px 24px", borderRadius: 14,
                  border: "1.5px solid rgba(34,197,94,0.3)",
                  background: "rgba(34,197,94,0.06)",
                  color: T.greenDark, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Trust avatars */}
            <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex" }}>
                {[
                  { l: "P", g: `linear-gradient(135deg, ${T.green}, ${T.greenDark})` },
                  { l: "R", g: `linear-gradient(135deg, ${T.blue}, ${T.blueDark})` },
                  { l: "A", g: `linear-gradient(135deg, ${T.teal}, #0d9488)` },
                  { l: "S", g: "linear-gradient(135deg,#f59e0b,#d97706)" },
                  { l: "+", g: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
                ].map((av, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: "2.5px solid #fff", marginLeft: i === 0 ? 0 : -10,
                    background: av.g, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                  }}>{av.l}</div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>
                <strong style={{ color: T.text }}>48,000+</strong> sevaks already making a difference
              </span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: CARDS ── */}
          <motion.div
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18,
              position: "relative", x: springX, y: springY,
            }}
          >
            {/* Vertical connector */}
            <div style={{
              position: "absolute", top: "10%", bottom: "10%", left: "50%",
              width: 1, background: "linear-gradient(180deg, transparent, rgba(34,197,94,0.15), rgba(59,130,246,0.12), transparent)",
              pointerEvents: "none", zIndex: 0,
            }} />

            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", left: "50%", bottom: "2rem", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.4,
        }}>
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: 1.5, height: 40,
              background: `linear-gradient(180deg, ${T.green}, transparent)`,
            }}
          />
          <span style={{ fontSize: 10, letterSpacing: "0.1em", color: T.text3 }}>SCROLL</span>
        </div>
      </section>
    </>
  );
}
