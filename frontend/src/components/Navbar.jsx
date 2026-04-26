import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

/* 🎯 Magnetic Button */
function MagBtn({ label, primary }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });

  const [hov, setHov] = useState(false);

  return (
    <motion.button
      ref={ref}
      style={{
        x: sx,
        y: sy,
        fontFamily: "'Sora', system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 600,
        color: primary ? "#fff" : "#22c55e",
        background: primary
          ? "linear-gradient(135deg,#22c55e,#3b82f6)"
          : "rgba(34,197,94,0.08)",
        border: primary ? "none" : "1px solid rgba(34,197,94,0.3)",
        borderRadius: 999,
        padding: "8px 20px",
        cursor: "pointer",
        boxShadow:
          hov && primary ? "0 6px 24px rgba(34,197,94,0.30)" : "none",
        transition: "all 0.25s ease",
        whiteSpace: "nowrap",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.22);
        y.set((e.clientY - r.top - r.height / 2) * 0.22);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        setHov(false);
      }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}

/* 🚀 NAVBAR */
export default function Navbar({ type = "landing" }) {
  const location = useLocation();

  // ✅ Safe user parsing (prevents crash if null)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const LINKS =
    type === "landing"
      ? [
          { name: "Home", path: "/" },
          { name: "Features", path: "#features" },
          { name: "How It Works", path: "#how-it-works" },
          { name: "AI Section", path: "#ai" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Analytics", path: "/analytics" },
          { name: "Dashboard", path: "/dashboard" },
          { name: "AI Insights", path: "#ai" },
          { name: "Reports", path: "/reports" },
        ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 16,
        left: 0,
        right: 0,
        margin: "0 auto",
        zIndex: 100,
        width: "min(calc(100% - 48px), 1100px)",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* LOGO */}
      <Link
        to="/"
        style={{
          display: "flex",
          gap: 8,
          marginRight: 16,
          textDecoration: "none", // ✅ remove underline
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg,#22c55e,#3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 800 }}>U</span>
        </div>

        <span
          style={{
            fontFamily: "'Sora'",
            fontWeight: 800,
            background: "linear-gradient(135deg,#22c55e,#3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DigitalSevaks
        </span>
      </Link>

      {/* LINKS */}
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {LINKS.map((link) => {
          if (link.path.startsWith("#")) {
            return (
              <span
                key={link.name}
                onClick={() => handleScroll(link.path.replace("#", ""))}
                style={{
                  cursor: "pointer",
                  padding: "6px 12px",
                }}
              >
                {link.name}
              </span>
            );
          }

          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              style={{
                textDecoration: "none", // ✅ remove underline
                color: isActive ? "#22c55e" : "#475569",
                padding: "6px 12px",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 8 }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <MagBtn label="Dashboard" primary />
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#ef4444",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <MagBtn label="Sign In" />
            </Link>
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <MagBtn label="Get Started" primary />
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}