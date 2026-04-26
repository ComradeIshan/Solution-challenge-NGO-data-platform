import React from "react";
import { motion } from "framer-motion";
import GlobeScene from "../Globe/GlobeScene";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-bg-grid" />
      <div className="hero-bg-glow" />

      <div
        className="hero-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* LEFT */}
        <motion.div
          className="hero-left"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          style={{
            maxWidth: "560px", // 👈 tighter width (moves content left visually)
          }}
        >
          {/* 🔥 BADGE (BIGGER) */}
          <motion.div
            variants={fadeUp}
            className="hero-badge"
            style={{
              fontSize: "13.5px", // ⬆️ increased
              padding: "6px 14px",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span className="dot" />
            AI-powered platform connecting NGOs, volunteers & communities
          </motion.div>

          {/* TITLE */}
          <motion.h1 variants={fadeUp} className="hero-title">
            Empowering Communities <br />
            <span className="gradient-text">
              Through Collaboration
            </span>
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            variants={fadeUp}
            className="hero-sub"
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              marginTop: "14px",
            }}
          >
            DigitalSevaks connects NGOs, volunteers, and beneficiaries
            through intelligent matching and real-time impact tracking.
          </motion.p>

          {/* 🔥 BUTTON (BIGGER + BETTER) */}
          <motion.div
            variants={fadeUp}
            className="hero-actions"
            style={{ marginTop: "22px", display: "flex", gap: "16px" }}
          >
            <button
              className="btn-primary"
              onClick={() => navigate("/auth")}
              style={{
                padding: "14px 28px", // ⬆️ bigger
                fontSize: "15px",
                borderRadius: "999px",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg,#22c55e,#3b82f6)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(34,197,94,0.25)",
                transition: "all 0.25s ease",
              }}
            >
              Start Making Impact →
            </button>

            {/* secondary link */}
            <span
              className="hero-link"
              style={{
                fontSize: "14px",
                color: "#475569",
                cursor: "pointer",
                alignSelf: "center",
              }}
            >
              Explore How It Works
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT (GLOBE) */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            transform: "translateX(20px)", // 👈 pushes globe right → content feels more left
          }}
        >
          <div
            className="globe-wrapper"
            style={{
              transform: "scale(0.92)",
              opacity: 0.95,
            }}
          >
            {/* <GlobeScene /> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}