import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";
import { useAuth } from "../../context/AuthContext";

// ─── Animated count-up ────────────────────────────────────────────────────────
function useCountUp(target, duration = 1600, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let rafId;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);
  return val;
}

// ─── Stat item — own component so useCountUp is never inside .map() ──────────
function StatItem({ stat, index, active }) {
  const count = useCountUp(stat.value, 1600, active);
  return (
    <div style={{
      flex: 1, textAlign: "center", padding: "14px 8px",
      borderRight: index < 3 ? `1px solid ${T.border}` : "none",
    }}>
      <div style={{
        fontFamily: T.font, fontSize: "clamp(16px,2vw,22px)",
        fontWeight: 800, color: stat.accent, letterSpacing: "-0.04em", lineHeight: 1,
      }}>
        {count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}{stat.suffix}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 10, fontWeight: 500, color: T.textMuted, marginTop: 3 }}>
        {stat.label}
      </div>
    </div>
  );
}

// ─── Rotating gradient border ring ───────────────────────────────────────────
function GradientRing({ size = 110, name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute", inset: -4, borderRadius: "50%",
          background: `conic-gradient(${T.green}, ${T.teal}, ${T.blue}, ${T.violet}, ${T.green})`,
          padding: 3,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: T.surface }} />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: -12, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.green}30, ${T.teal}15, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.green}, ${T.teal}, ${T.blue})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.font, fontSize: size > 80 ? 32 : 24, fontWeight: 800,
        color: "#fff", letterSpacing: "-0.02em",
        border: "3px solid rgba(255,255,255,0.9)",
        boxShadow: `0 8px 24px ${T.green}40`,
      }}>
        {initials}
      </div>
      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: "absolute", bottom: 4, right: 4,
          width: 16, height: 16, borderRadius: "50%",
          background: T.green, border: "3px solid white",
          boxShadow: `0 0 8px ${T.green}`,
        }}
      />
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score = 0, max = 500, active }) {
  const count = useCountUp(score, 1800, active);
  const circ  = 2 * Math.PI * 36;
  const dash  = Math.min(score / max, 1) * circ;
  return (
    <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: "absolute", inset: 0 }}>
        <circle cx="44" cy="44" r="36" fill="none" stroke={T.greenMid} strokeWidth="6" />
        <motion.circle
          cx="44" cy="44" r="36" fill="none"
          stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={active ? { strokeDashoffset: circ - dash } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "44px 44px" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={T.green} />
            <stop offset="100%" stopColor={T.teal}  />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {count}
        </span>
        <span style={{ fontFamily: T.font, fontSize: 8, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Score
        </span>
      </div>
    </div>
  );
}

// ─── Level ────────────────────────────────────────────────────────────────────
function getLevel(xp = 0) {
  if (xp >= 10000) return { level: 10, title: "Platinum Sevak" };
  if (xp >= 7000)  return { level: 8,  title: "Diamond Sevak"  };
  if (xp >= 5000)  return { level: 7,  title: "Gold Sevak"     };
  if (xp >= 3000)  return { level: 6,  title: "Silver Sevak"   };
  if (xp >= 1500)  return { level: 4,  title: "Rising Sevak"   };
  if (xp >= 500)   return { level: 2,  title: "Active Sevak"   };
  return                  { level: 1,  title: "Bronze Sevak"   };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: T.glass, backdropFilter: "blur(20px)",
      borderRadius: T.radiusXl, padding: "clamp(24px,3vw,36px)",
      boxShadow: T.shadowMd, border: "1px solid rgba(255,255,255,0.6)",
    }}>
      <style>{`@keyframes skshimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
      <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "center" }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)",
          backgroundSize: "400px 100%", animation: "skshimmer 1.4s infinite linear",
        }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            height: 28, width: "55%", borderRadius: 8,
            background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)",
            backgroundSize: "400px 100%", animation: "skshimmer 1.4s infinite linear",
          }} />
          <div style={{ display: "flex", gap: 8 }}>
            {[80, 100, 90].map((w, i) => (
              <div key={i} style={{
                height: 18, width: w, borderRadius: 99,
                background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)",
                backgroundSize: "400px 100%",
                animation: `skshimmer 1.4s infinite linear ${i * 0.15}s`,
              }} />
            ))}
          </div>
          <div style={{
            height: 6, width: "100%", borderRadius: 99,
            background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)",
            backgroundSize: "400px 100%", animation: "skshimmer 1.4s infinite linear",
          }} />
        </div>
      </div>
      <div style={{ display: "flex", borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            flex: 1, padding: "14px 8px", textAlign: "center",
            borderRight: i < 3 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{
              height: 24, width: "60%", margin: "0 auto 6px", borderRadius: 6,
              background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)",
              backgroundSize: "400px 100%",
              animation: `skshimmer 1.4s infinite linear ${i * 0.1}s`,
            }} />
            <div style={{
              height: 12, width: "40%", margin: "0 auto", borderRadius: 4,
              background: "linear-gradient(90deg,#f0fdf4,#dcfce7,#f0fdf4)",
              backgroundSize: "400px 100%",
              animation: `skshimmer 1.4s infinite linear ${i * 0.1}s`,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfileHeroCard() {
  const ref = useRef(null);

  // `mounted` guarantees the card is always visible after the first render.
  // `inView` only gates count-up animations (no longer controls opacity).
  // This fixes the blank card: useInView can return false when the element
  // is at the top of the page and the intersection fires before paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const inView  = useInView(ref, { ...VP, once: true });
  const animate = mounted || inView;

  const [hov, setHov] = useState(false);
  const mx     = useMotionValue(0);
  const my     = useMotionValue(0);
  const glowBg = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(320px circle at ${x}px ${y}px, ${T.green}10, transparent 65%)`
  );

  const { userProfile, currentUser, loading } = useAuth();

  // Show skeleton only while Firebase Auth is still resolving.
  // Once `loading` is false, always render the card — even if the Firestore
  // doc is missing — so we never loop on skeleton forever.
  if (loading) return <SkeletonCard />;

  const p        = userProfile ?? {};
  const name     = p.name     || currentUser?.displayName || "User";
  const city     = p.city     || "";
  const state    = p.state    || "";
  const skills   = p.skills   || [];
  const xp       = p.xp       ?? 0;
  const joinYear = p.createdAt?.toDate?.().getFullYear?.() ?? null;

  const { level, title } = getLevel(xp);
  const xpForNext = [500, 1500, 3000, 5000, 7000, 10000].find(n => n > xp) ?? 10000;
  const xpPct     = Math.min((xp / xpForNext) * 100, 100).toFixed(1);

  const stats = [
    { label: "Hours", value: p.hoursCompleted ?? 0, suffix: "h",  accent: T.green  },
    { label: "Lives", value: p.livesImpacted  ?? 0, suffix: "+",  accent: T.teal   },
    { label: "NGOs",  value: p.ngosJoined     ?? 0, suffix: "",   accent: T.blue   },
    { label: "Tasks", value: p.tasksCompleted ?? 0, suffix: "",   accent: T.violet },
  ];

  const pills = [
    { icon: "🎓", text: skills.length ? skills[0].charAt(0).toUpperCase() + skills[0].slice(1) : "Volunteer" },
    { icon: "📍", text: city && state ? `${city}, ${state}` : city || "—" },
    { icon: "📅", text: joinYear ? `Joined ${joinYear}` : "Joined recently" },
  ];

  return (
    <motion.div
      ref={ref}
      // KEY FIX: animate in as soon as `mounted` is true (next tick after render),
      // not gated on `inView` — that was causing the permanently blank card.
      initial={{ opacity: 0, y: 28 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) { mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hov ? T.green + "40" : "rgba(255,255,255,0.6)"}`,
        borderRadius: T.radiusXl, padding: "clamp(24px,3vw,36px)",
        boxShadow: hov ? T.shadowLg : T.shadowMd,
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Top gradient bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${T.green}, ${T.teal}, ${T.blue})`,
        borderRadius: `${T.radiusXl} ${T.radiusXl} 0 0`,
      }} />

      {/* Cursor glow */}
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: T.radiusXl,
        background: glowBg, pointerEvents: "none",
        opacity: hov ? 1 : 0, transition: "opacity 0.3s",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
        <GradientRing size={100} name={name} />

        <div style={{ flex: 1, minWidth: 180 }}>
          {/* Name + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h2 style={{
              fontFamily: T.font, fontSize: "clamp(20px,2.5vw,26px)",
              fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.03em",
            }}>
              {name}
            </h2>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={animate ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 260 }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: `linear-gradient(135deg, ${T.amber}22, ${T.amber}12)`,
                border: `1px solid ${T.amber}40`,
                borderRadius: T.radiusPill, padding: "3px 10px",
              }}
            >
              <span style={{ fontSize: 12 }}>🏆</span>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.amber, letterSpacing: "0.06em" }}>
                TOP 5% SEVAK
              </span>
            </motion.div>
          </div>

          {/* Info pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {pills.map((item) => (
              <span key={item.text} style={{
                fontFamily: T.font, fontSize: 12, fontWeight: 500,
                color: T.textSub, display: "flex", alignItems: "center", gap: 4,
              }}>
                <span>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>

          {/* XP bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.textMuted }}>
                Level {level} — {title}
              </span>
              <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.green }}>
                {xp.toLocaleString()} / {xpForNext.toLocaleString()} XP
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: T.greenMid, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={animate ? { width: `${xpPct}%` } : {}}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${T.green}, ${T.teal})` }}
              />
            </div>
          </div>
        </div>

        <ScoreRing score={xp} max={xpForNext} active={animate} />
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", background: T.surface,
        borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.border}`,
      }}>
        {stats.map((s, i) => (
          <StatItem key={s.label} stat={s} index={i} active={animate} />
        ))}
      </div>
    </motion.div>
  );
}
