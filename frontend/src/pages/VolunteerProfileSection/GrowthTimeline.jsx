import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { T, VP } from "./tokens.js";
import React from "react";

const EVENTS = [
  {
    date: "Jan 2023",
    title: "Joined Digital Sevaks",
    desc: "Profile created, skills verified, AI matching enabled",
    icon: "🚀", accent: T.green, type: "milestone",
  },
  {
    date: "Feb 2023",
    title: "First Task Completed",
    desc: "Taught basic math to 40 students at Shiksha NGO, Bangalore",
    icon: "✅", accent: T.teal, type: "task",
  },
  {
    date: "Apr 2023",
    title: "50 Hours Badge Unlocked",
    desc: "Reached 50 hours — awarded Dedicated Sevak badge",
    icon: "🏅", accent: T.amber, type: "achievement",
  },
  {
    date: "Jul 2023",
    title: "Top Performer — Q2",
    desc: "Ranked #4 in Education category, Bangalore region",
    icon: "🏆", accent: T.violet, type: "achievement",
  },
  {
    date: "Sep 2023",
    title: "NGO Partnership: Clean Future",
    desc: "Joined water conservation drive — 3 months, 12,400 lives reached",
    icon: "🤝", accent: T.blue, type: "milestone",
  },
  {
    date: "Jan 2024",
    title: "Gold Sevak — Level 7",
    desc: "Promoted to Gold tier after 200+ hours and 5-star feedback",
    icon: "⭐", accent: T.amber, type: "achievement",
  },
  {
    date: "Now",
    title: "Active — 284 Hours",
    desc: "Currently matched with MedReach Health Camp, Hyderabad",
    icon: "⚡", accent: T.green, type: "current",
  },
];

function TimelineEvent({ event, index, inView }) {
  const [hov, setHov] = useState(false);
  const isLeft  = index % 2 === 0;
  const isCurrent = event.type === "current";

  return (
    <div style={{
      display: "flex",
      flexDirection: isLeft ? "row" : "row-reverse",
      alignItems: "flex-start",
      gap: 0,
      position: "relative",
    }}>
      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flex: "0 0 calc(50% - 24px)",
          background: T.glass,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${hov ? event.accent + "40" : "rgba(255,255,255,0.6)"}`,
          borderRadius: T.radius,
          padding: "14px 16px",
          boxShadow: hov ? `${T.shadowMd}, 0 0 0 1px ${event.accent}20` : T.shadowGlass,
          transform: hov ? "translateY(-3px)" : "none",
          transition: "all 0.25s ease",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Top accent */}
        {isCurrent && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${T.green}, ${T.teal})`,
          }} />
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <motion.span
            animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 18 }}
          >{event.icon}</motion.span>
          <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: event.accent, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            {event.date}
          </span>
        </div>
        <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4, lineHeight: 1.3 }}>
          {event.title}
        </div>
        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 300, color: T.textSub, lineHeight: 1.6 }}>
          {event.desc}
        </div>
      </motion.div>

      {/* Center spine + node */}
      <div style={{
        flex: "0 0 48px", display: "flex",
        flexDirection: "column", alignItems: "center",
        position: "relative",
      }}>
        {/* Node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.08 + index * 0.1, type: "spring", stiffness: 280 }}
          style={{
            width: 20, height: 20, borderRadius: "50%",
            background: event.accent,
            border: "3px solid white",
            boxShadow: `0 0 12px ${event.accent}60, 0 2px 8px rgba(0,0,0,0.15)`,
            zIndex: 2, flexShrink: 0, marginTop: 14,
          }}
        >
          {isCurrent && (
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute", inset: -4, borderRadius: "50%",
                background: event.accent, opacity: 0.3,
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Spacer on opposite side */}
      <div style={{ flex: "0 0 calc(50% - 24px)" }} />
    </div>
  );
}

export default function GrowthTimeline() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  // Scroll-driven line draw
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: T.radiusXl,
        padding: "clamp(20px,3vw,32px)",
        boxShadow: T.shadowGlass,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
          Growth Timeline
        </span>
        <span style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 700,
          color: T.teal, background: T.tealLight,
          border: `1px solid ${T.tealMid}`,
          borderRadius: T.radiusPill, padding: "2px 8px", letterSpacing: "0.07em",
          textTransform: "uppercase",
        }}>14 months</span>
      </div>

      <div style={{ position: "relative" }}>
        {/* Vertical center line */}
        <div style={{
          position: "absolute", left: "calc(50% - 1px)", top: 0, bottom: 0,
          width: 2, background: `${T.greenMid}`,
          borderRadius: 99, overflow: "hidden",
        }}>
          <motion.div
            style={{
              width: "100%",
              height: lineH,
              background: `linear-gradient(to bottom, ${T.green}, ${T.teal}, ${T.blue})`,
              borderRadius: 99,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {EVENTS.map((event, i) => (
            <TimelineEvent key={event.title} event={event} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
