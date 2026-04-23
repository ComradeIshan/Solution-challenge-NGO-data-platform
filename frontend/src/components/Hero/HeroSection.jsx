import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { lazy } from "react";

const GlobeScene = lazy(() => import("../globe/GlobeScene"));

export default function HeroSection() {
  return (
    <section
  style={{
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    padding: "120px 60px",
    background:
      "radial-gradient(circle at 20% 30%, rgba(20,184,166,0.08), transparent), #020617",
    color: "white",
  }}
>
  {/* LEFT SIDE (YOUR ORIGINAL STYLE PRESERVED) */}
  <div style={{ maxWidth: 520 }}>

    <div
      style={{
        background: "#1e293b",
        padding: "6px 14px",
        borderRadius: 20,
        display: "inline-block",
        color: "#38bdf8",
        fontSize: 13,
        marginBottom: 24,
      }}
    >
      ● Trusted by 2,400+ NGOs worldwide
    </div>

    <h1
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "3.8rem",
        lineHeight: 1.1,
        color: "#e2e8f0",
        marginBottom: 12,
      }}
    >
      Empowering <br />
      Communities
    </h1>

    <h2
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "3.2rem",
        fontStyle: "italic",
        background: "linear-gradient(90deg,#22c55e,#14b8a6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 20,
      }}
    >
      Through Collaboration
    </h2>

    <p
      style={{
        color: "#94a3b8",
        fontSize: 16,
        marginBottom: 28,
      }}
    >
      UnityNet connects NGOs, volunteers, and beneficiaries
      through intelligent matching.
    </p>

    <div style={{ display: "flex", gap: 12 }}>
      <button
        style={{
          background: "#020617",
          color: "white",
          padding: "12px 20px",
          borderRadius: 30,
          border: "1px solid #1e293b",
        }}
      >
        Join as Volunteer →
      </button>

      <button
        style={{
          padding: "12px 20px",
          borderRadius: 30,
          border: "1px solid #334155",
          background: "transparent",
          color: "#cbd5f5",
        }}
      >
        Register NGO
      </button>
    </div>
  </div>

  {/* RIGHT SIDE (REAL GLOBE) */}
  <div
    style={{
      height: 650,
      position: "relative",
    }}
  >
    <React.Suspense fallback={null}>
      <GlobeScene />
    </React.Suspense>

    {/* Glow effect behind globe */}
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 500,
        background:
          "radial-gradient(circle, rgba(20,184,166,0.2), transparent)",
        filter: "blur(80px)",
        zIndex: -1,
      }}
    />
  </div>
</section>
  );
}