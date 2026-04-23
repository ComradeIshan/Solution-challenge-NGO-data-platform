import React from "react";
import { motion } from "framer-motion";
import Globe from "../components/Globe";

/* ─── Animations ───────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-layout">
        
        {/* LEFT CONTENT */}
        <motion.div
          className="hero-inner"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeUp} className="hero-badge">
            ● Trusted by 2,400+ NGOs worldwide
          </motion.p>

          <motion.h1 variants={fadeUp} className="hero-title">
            Empowering Communities <br />
            <em>Through Collaboration</em>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-sub">
            UnityNet connects NGOs, volunteers, and beneficiaries through intelligent matching.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-btns">
            <a className="btn-primary">Join as Volunteer →</a>
            <a className="btn-outline">Register NGO</a>
          </motion.div>
        </motion.div>

        {/* RIGHT GLOBE */}
        <motion.div
          className="hero-globe"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Globe />
        </motion.div>

      </div>
    </section>
  );
}