import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import React from "react";

/* ───────── COUNT HOOK (SMOOTH + VIEWPORT BASED) ───────── */
function useCountUp(target, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime;
    const duration = 1400;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(ease * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    requestAnimationFrame(step);
  }, [target, start]);

  return value;
}

/* ───────── FORMAT NUMBERS ───────── */
function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n;
}

/* ───────── CARD ───────── */
function StatCard({ icon, label, value, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const count = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className="stat-card glass"
    >
      <div className="stat-icon">{icon}</div>

      <div className="stat-number">
        {formatNum(count)}
      </div>

      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

/* ───────── MAIN SECTION ───────── */
export default function Stats() {
  return (
    <motion.section
  id="stats"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  variants={{
    show: {
      transition: { staggerChildren: 0.15 }
    }
  }}
>
  <div className="stats-grid">
    <StatCard icon="🤝" label="Volunteers" value={48200} />
    <StatCard icon="🏢" label="NGOs" value={2400} />
    <StatCard icon="❤️" label="Lives Impacted" value={4800000} />
    <StatCard icon="⚡" label="Success Rate" value={96} />
  </div>
</motion.section>
  );
}