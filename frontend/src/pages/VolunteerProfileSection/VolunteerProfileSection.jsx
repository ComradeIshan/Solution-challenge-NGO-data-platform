import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { T } from "./tokens.js";

import ProfileHeroCard  from "./ProfileHeroCard.jsx";
import ImpactMetrics    from "./ImpactMetrics.jsx";
import SkillsPanel      from "./SkillsPanel.jsx";
import GrowthTimeline   from "./GrowthTimeline.jsx";
import AchievementsGrid from "./AchievementsGrid.jsx";
import AIInsightsPanel  from "./AIInsightsPanel.jsx";
import ActivityHeatmap  from "./ActivityHeatmap.jsx";
import React from "react";

// ─── Ambient background blobs ───────────────────────────────────────────────────
function AmbientLayer() {
  const blobs = [
    { x: "-4%",  y: "5%",   w: 420, color: `${T.green}0b`,  dur: 20, delay: 0  },
    { x: "72%",  y: "0%",   w: 360, color: `${T.blue}0a`,   dur: 26, delay: 5  },
    { x: "44%",  y: "55%",  w: 300, color: `${T.teal}09`,   dur: 18, delay: 9  },
    { x: "85%",  y: "70%",  w: 240, color: `${T.violet}08`, dur: 16, delay: 3  },
    { x: "10%",  y: "75%",  w: 200, color: `${T.amber}07`,  dur: 22, delay: 7  },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 28, -18, 0], y: [0, -22, 14, 0], scale: [1, 1.06, 0.97, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          style={{
            position: "absolute", left: b.x, top: b.y,
            width: b.w, height: b.w, borderRadius: "50%",
            background: b.color, filter: "blur(90px)",
          }}
        />
      ))}
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(15,23,42,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────────
function SectionTag({ label, sub }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      style={{ marginBottom: "clamp(24px,4vw,40px)" }}
    >
      {/* Badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: T.greenLight, border: `1px solid ${T.greenMid}`,
        borderRadius: 999, padding: "5px 14px", marginBottom: 12,
      }}>
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }}
        />
        <span style={{
          fontFamily: T.font, fontSize: 11, fontWeight: 700,
          color: T.green, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Sevak Intelligence</span>
      </div>

      <h2 style={{
        fontFamily: T.font,
        fontSize: "clamp(24px,4vw,40px)",
        fontWeight: 800, color: T.text,
        lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 10px",
      }}>
        Your{" "}
        <span style={{
          background: `linear-gradient(135deg, ${T.green}, ${T.teal}, ${T.blue})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>Profile Intelligence</span>
      </h2>

      <p style={{
        fontFamily: T.font, fontSize: "clamp(13px,1.4vw,15px)",
        fontWeight: 300, color: T.textSub,
        lineHeight: 1.72, margin: 0, maxWidth: 480,
      }}>
        A living, AI-powered view of your journey, skills, impact, and growth
        across every mission you've joined.
      </p>
    </motion.div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────────
export default function VolunteerProfileSection() {
  return (
    <section style={{
      position: "relative",
      background: "linear-gradient(160deg, #f0fdf4 0%, #f8fafc 45%, #eff6ff 100%)",
      padding: "clamp(56px,8vw,100px) clamp(16px,5vw,64px)",
      fontFamily: T.font,
      overflow: "hidden",
    }}>
      <AmbientLayer />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>
        <SectionTag />

        {/* ── Row 1: Hero (full width) ── */}
        <div style={{ marginBottom: 16 }}>
          <ProfileHeroCard />
        </div>

        {/* ── Row 2: Metrics + AI Insights ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 16, marginBottom: 16,
        }}>
          <ImpactMetrics />
          <AIInsightsPanel />
        </div>

        {/* ── Row 3: Skills + Achievements ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 16, marginBottom: 16,
        }}>
          <SkillsPanel />
          <AchievementsGrid />
        </div>

        {/* ── Row 4: Heatmap (full width) ── */}
        <div style={{ marginBottom: 16 }}>
          <ActivityHeatmap />
        </div>

        {/* ── Row 5: Timeline (full width) ── */}
        <GrowthTimeline />
      </div>
    </section>
  );
}
