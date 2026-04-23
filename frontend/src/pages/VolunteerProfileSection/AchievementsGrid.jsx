import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

const BADGES = [
  { id: 0, icon: "⏱️", title: "100 Hours",       desc: "Contributed 100+ hours",      accent: T.green,  unlocked: true  },
  { id: 1, icon: "🏆", title: "Top Performer",   desc: "Top 5% in region this month", accent: T.amber,  unlocked: true  },
  { id: 2, icon: "⚡", title: "Rapid Responder", desc: "Accepted task within 1 hour",  accent: T.blue,   unlocked: true  },
  { id: 3, icon: "🎓", title: "Mentor",           desc: "Guided 10 new volunteers",    accent: T.violet, unlocked: true  },
  { id: 4, icon: "🌍", title: "Global Impact",   desc: "Worked in 3+ countries",       accent: T.teal,   unlocked: true  },
  { id: 5, icon: "💯", title: "Perfect Score",   desc: "5-star rating streak 30 days", accent: T.rose,   unlocked: false },
  { id: 6, icon: "🔥", title: "300 Hours",       desc: "Contribute 300 total hours",   accent: T.amber,  unlocked: false },
  { id: 7, icon: "🦸", title: "Impact Hero",     desc: "50K+ lives impacted",          accent: T.green,  unlocked: false },
];

function BadgeCard({ badge, delay, inView }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 16 }}
      animate={inView ? { opacity: badge.unlocked ? 1 : 0.45, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.5, delay,
        type: badge.unlocked ? "spring" : "tween",
        stiffness: 260, damping: 18,
      }}
      onMouseEnter={() => badge.unlocked && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "16px 10px",
        background: hov ? `${badge.accent}10` : T.glass,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${hov ? badge.accent + "40" : "rgba(255,255,255,0.6)"}`,
        borderRadius: T.radius,
        cursor: badge.unlocked ? "default" : "not-allowed",
        boxShadow: hov ? `${T.shadowMd}, 0 0 20px ${badge.accent}25` : T.shadowGlass,
        transform: hov ? "translateY(-5px) scale(1.04)" : "none",
        transition: "all 0.3s ease",
        position: "relative", overflow: "hidden",
        filter: badge.unlocked ? "none" : "blur(0.5px) grayscale(0.4)",
      }}
    >
      {/* Unlock glow pulse */}
      {badge.unlocked && hov && (
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            position: "absolute", inset: 0, borderRadius: T.radius,
            background: `radial-gradient(circle, ${badge.accent}30, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon bubble */}
      <motion.div
        animate={badge.unlocked && hov ? { rotate: [0, -8, 8, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        style={{
          width: 48, height: 48, borderRadius: 14,
          background: badge.unlocked
            ? `linear-gradient(135deg, ${badge.accent}25, ${badge.accent}10)`
            : `${T.textMuted}18`,
          border: `1px solid ${badge.unlocked ? badge.accent + "30" : T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          boxShadow: badge.unlocked && hov ? `0 4px 16px ${badge.accent}35` : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        {badge.icon}
      </motion.div>

      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: T.font, fontSize: 11, fontWeight: 700,
          color: badge.unlocked ? T.text : T.textMuted,
          letterSpacing: "-0.01em",
        }}>{badge.title}</div>
        <div style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 300,
          color: T.textMuted, lineHeight: 1.4, marginTop: 2,
        }}>{badge.desc}</div>
      </div>

      {/* Unlocked checkmark */}
      {badge.unlocked && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 16, height: 16, borderRadius: "50%",
          background: badge.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: "#fff", fontWeight: 800,
        }}>✓</div>
      )}

      {/* Locked overlay */}
      {!badge.unlocked && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          fontSize: 12,
        }}>🔒</div>
      )}
    </motion.div>
  );
}

export default function AchievementsGrid() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  const unlocked = BADGES.filter(b => b.unlocked).length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: T.radiusXl,
        padding: "clamp(20px,3vw,28px)",
        boxShadow: T.shadowGlass,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
            Achievements
          </span>
          <span style={{
            fontFamily: T.font, fontSize: 10, fontWeight: 700,
            color: T.amber, background: T.amberLight,
            border: `1px solid ${T.amberMid}`,
            borderRadius: T.radiusPill, padding: "2px 8px",
          }}>{unlocked} / {BADGES.length} Unlocked</span>
        </div>
        <div style={{ height: 5, width: 100, borderRadius: 99, background: T.amberMid, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(unlocked / BADGES.length) * 100}%` } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: 99, background: T.amber }}
          />
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 110px), 1fr))",
        gap: 10,
      }}>
        {BADGES.map((badge, i) => (
          <BadgeCard key={badge.id} badge={badge} delay={0.06 + i * 0.06} inView={inView} />
        ))}
      </div>
    </motion.div>
  );
}
