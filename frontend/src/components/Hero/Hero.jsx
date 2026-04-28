import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

function EarthOrbitAnimation() {
  return (
    <div className="earth-visual-wrap">
      <style>{`
        .earth-visual-wrap {
          position: relative;
          width: 520px;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }

        .earth-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.34), rgba(34,197,94,0.14), transparent 68%);
          filter: blur(28px);
          animation: glowPulse 4s ease-in-out infinite;
        }

        .earth-sphere {
          position: relative;
          width: 315px;
          height: 315px;
          border-radius: 50%;
          overflow: hidden;
          background-image:
            radial-gradient(circle at 30% 24%, rgba(255,255,255,0.35), transparent 24%),
            url("https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg");
          background-size: cover;
          background-position: center;
          box-shadow:
            inset -38px -28px 75px rgba(0,0,0,0.55),
            inset 18px 14px 38px rgba(255,255,255,0.22),
            0 0 45px rgba(59,130,246,0.38),
            0 28px 75px rgba(15,23,42,0.22);
          animation: earthFloat 5s ease-in-out infinite;
          z-index: 3;
        }

        .earth-sphere::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 24%, transparent 0 35%, rgba(2,6,23,0.08) 58%, rgba(2,6,23,0.45) 100%);
          pointer-events: none;
          z-index: 2;
        }

        .earth-sphere::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.38);
          box-shadow: inset 0 0 28px rgba(255,255,255,0.18);
          pointer-events: none;
          z-index: 3;
        }

        .orbit-ring {
          position: absolute;
          width: 430px;
          height: 430px;
          border-radius: 50%;
          border: 1px solid rgba(59,130,246,0.25);
          transform: rotateX(68deg) rotateZ(-18deg);
          z-index: 4;
        }

        .orbit-ring.two {
          width: 470px;
          height: 470px;
          border-color: rgba(34,197,94,0.2);
          transform: rotateX(62deg) rotateZ(34deg);
        }

        .orbit-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #3b82f6);
          box-shadow: 0 0 20px rgba(34,197,94,0.8);
          z-index: 6;
        }

        .dot-a {
          animation: orbitA 7s linear infinite;
        }

        .dot-b {
          animation: orbitB 9s linear infinite;
          background: linear-gradient(135deg, #14b8a6, #60a5fa);
        }

        .dot-c {
          animation: orbitC 11s linear infinite;
          background: linear-gradient(135deg, #4ade80, #2563eb);
        }

        @keyframes earthFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.015);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes orbitA {
          0% {
            transform: rotate(0deg) translateX(215px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(215px) rotate(-360deg);
          }
        }

        @keyframes orbitB {
          0% {
            transform: rotate(120deg) translateX(235px) rotate(-120deg);
          }
          100% {
            transform: rotate(480deg) translateX(235px) rotate(-480deg);
          }
        }

        @keyframes orbitC {
          0% {
            transform: rotate(240deg) translateX(195px) rotate(-240deg);
          }
          100% {
            transform: rotate(600deg) translateX(195px) rotate(-600deg);
          }
        }

        @media (max-width: 900px) {
          .earth-visual-wrap {
            width: 360px;
            height: 360px;
            margin: 40px auto 0;
          }

          .earth-sphere {
            width: 220px;
            height: 220px;
          }

          .orbit-ring {
            width: 300px;
            height: 300px;
          }

          .orbit-ring.two {
            width: 330px;
            height: 330px;
          }

          @keyframes orbitA {
            0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
          }

          @keyframes orbitB {
            0% { transform: rotate(120deg) translateX(165px) rotate(-120deg); }
            100% { transform: rotate(480deg) translateX(165px) rotate(-480deg); }
          }

          @keyframes orbitC {
            0% { transform: rotate(240deg) translateX(135px) rotate(-240deg); }
            100% { transform: rotate(600deg) translateX(135px) rotate(-600deg); }
          }
        }
      `}</style>

      <div className="earth-glow" />
      <div className="orbit-ring" />
      <div className="orbit-ring two" />

      <div className="orbit-dot dot-a" />
      <div className="orbit-dot dot-b" />
      <div className="orbit-dot dot-c" />

      <div className="earth-sphere" />
    </div>
  );
}

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
        <motion.div
          className="hero-left"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          style={{
            maxWidth: "560px",
          }}
        >
          <motion.div
            variants={fadeUp}
            className="hero-badge"
            style={{
              fontSize: "13.5px",
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

          <motion.h1 variants={fadeUp} className="hero-title">
            Empowering Communities <br />
            <span className="gradient-text">Through Collaboration</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="hero-sub"
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              marginTop: "14px",
            }}
          >
            DigitalSevaks connects NGOs, volunteers, and beneficiaries through
            intelligent matching and real-time impact tracking.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="hero-actions"
            style={{ marginTop: "22px", display: "flex", gap: "16px" }}
          >
            <button
              className="btn-primary"
              onClick={() => navigate("/auth")}
              style={{
                padding: "14px 28px",
                fontSize: "15px",
                borderRadius: "999px",
                fontWeight: 600,
                background: "linear-gradient(135deg,#22c55e,#3b82f6)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(34,197,94,0.25)",
                transition: "all 0.25s ease",
              }}
            >
              Start Making Impact →
            </button>

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

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            transform: "translateX(20px)",
          }}
        >
          <EarthOrbitAnimation />
        </motion.div>
      </div>
    </section>
  );
}