import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

/* 🎯 Magnetic Button */
function MagBtn({ label, primary, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{
        x: sx, y: sy,
        fontFamily: "'Sora', system-ui, sans-serif",
        fontSize: 13, fontWeight: 600,
        color: primary ? "#fff" : "#22c55e",
        background: primary
          ? "linear-gradient(135deg,#22c55e,#3b82f6)"
          : "rgba(34,197,94,0.08)",
        border: primary ? "none" : "1px solid rgba(34,197,94,0.3)",
        borderRadius: 999,
        padding: "8px 20px",
        cursor: "pointer",
        boxShadow: hov && primary ? "0 6px 24px rgba(34,197,94,0.30)" : "none",
        transition: "all 0.25s ease",
        whiteSpace: "nowrap",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.22);
        y.set((e.clientY - r.top - r.height / 2) * 0.22);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}

/* 👤 Avatar dropdown */
function UserMenu({ userProfile, currentUser, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Get name from Firestore profile first, fall back to Firebase Auth ──
  const name =
    userProfile?.name ||
    userProfile?.orgName ||
    currentUser?.displayName ||
    null;

  const email =
    userProfile?.email ||
    currentUser?.email ||
    "";

  const role = userProfile?.role || "volunteer";

  // Generate initials
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : email
    ? email.slice(0, 2).toUpperCase()
    : "?";

  // First name only for navbar display
  const firstName = name
    ? name.split(" ")[0]
    : email.split("@")[0] || "User";

  const dashPath = role === "ngo" ? "/ngo-profile" : "/volunteer-profile";

  // Avatar gradient based on role
  const avatarBg = role === "ngo"
    ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
    : "linear-gradient(135deg, #22c55e, #14b8a6)";

  return (
    <div ref={menuRef} style={{ position: "relative" }}>

      {/* ── Avatar pill button ── */}
      <motion.div
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: role === "ngo"
            ? "rgba(59,130,246,0.08)"
            : "rgba(34,197,94,0.08)",
          border: `1px solid ${role === "ngo"
            ? "rgba(59,130,246,0.25)"
            : "rgba(34,197,94,0.25)"}`,
          borderRadius: 999, padding: "5px 12px 5px 5px",
          cursor: "pointer",
        }}
      >
        {/* Avatar circle with initials */}
        <motion.div
          animate={{ boxShadow: open
            ? `0 0 0 2px ${role === "ngo" ? "#3b82f6" : "#22c55e"}`
            : "0 0 0 0px transparent"
          }}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "#fff",
            flexShrink: 0, letterSpacing: "-0.01em",
          }}
        >
          {initials}
        </motion.div>

        {/* First name */}
        <span style={{
          fontFamily: "'Sora', system-ui",
          fontSize: 13, fontWeight: 600,
          color: "#0f172a",
          maxWidth: 90,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {firstName}
        </span>

        {/* Chevron */}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="#64748b" strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(226,232,240,0.9)",
              borderRadius: 16, padding: "8px",
              minWidth: 220,
              boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
              zIndex: 999,
            }}
          >
            {/* ── User info header ── */}
            <div style={{
              padding: "12px 14px",
              borderBottom: "1px solid rgba(226,232,240,0.8)",
              marginBottom: 6,
            }}>
              {/* Avatar + name row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: avatarBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${role === "ngo" ? "rgba(59,130,246,0.3)" : "rgba(34,197,94,0.3)"}`,
                }}>
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: "#0f172a",
                    fontFamily: "'Sora', system-ui",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {name || firstName}
                  </div>
                  <div style={{
                    fontSize: 11, color: "#94a3b8", marginTop: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {email}
                  </div>
                </div>
              </div>

              {/* Role badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px",
                background: role === "ngo"
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(34,197,94,0.1)",
                border: `1px solid ${role === "ngo"
                  ? "rgba(59,130,246,0.25)"
                  : "rgba(34,197,94,0.25)"}`,
                borderRadius: 999,
              }}>
                <span style={{ fontSize: 11 }}>
                  {role === "ngo" ? "🏛️" : "🙋"}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                  color: role === "ngo" ? "#2563eb" : "#16a34a",
                  textTransform: "uppercase",
                }}>
                  {role === "ngo" ? "NGO" : "Volunteer"}
                </span>
              </div>
            </div>

            {/* ── Menu items ── */}
            {[
              {
                icon: "👤",
                label: "My Profile",
                action: () => { navigate(dashPath); setOpen(false); }
              },
              {
                icon: "📊",
                label: "Dashboard",
                action: () => { navigate("/dashboard"); setOpen(false); }
              },
              {
                icon: "⚙️",
                label: "Settings",
                action: () => { navigate("/settings"); setOpen(false); }
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                onClick={item.action}
                whileHover={{ background: "rgba(34,197,94,0.06)", x: 3 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 10,
                  cursor: "pointer", fontSize: 13,
                  color: "#374151", fontFamily: "system-ui",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </motion.div>
            ))}

            {/* Divider */}
            <div style={{
              height: 1,
              background: "rgba(226,232,240,0.8)",
              margin: "6px 0",
            }} />

            {/* Logout */}
            <motion.div
              onClick={() => { onLogout(); setOpen(false); }}
              whileHover={{ background: "rgba(239,68,68,0.06)", x: 3 }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                cursor: "pointer", fontSize: 13,
                color: "#ef4444",
                fontFamily: "system-ui", fontWeight: 600,
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>🚪</span>
              Sign Out
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 🚀 NAVBAR */
export default function Navbar({ type = "landing" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const LINKS =
    type === "landing"
      ? [
          { name: "Home",         path: "/" },
          { name: "Features",     path: "#features" },
          { name: "How It Works", path: "#how-it-works" },
          { name: "AI Section",   path: "#ai" },
        ]
      : [
          { name: "Home",        path: "/" },
          { name: "Analytics",   path: "/analytics" },
          { name: "Dashboard",   path: "/dashboard" },
          { name: "AI Insights", path: "/ai-insights" },
          { name: "Reports",     path: "/reports" },
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
        position: "fixed", top: 16, left: 0, right: 0,
        margin: "0 auto", zIndex: 100,
        width: "min(calc(100% - 48px), 1100px)",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 20, padding: "12px 24px",
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
        border: "1px solid rgba(255,255,255,0.7)",
      }}
    >
      {/* LOGO */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16, textDecoration: "none" }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "linear-gradient(135deg,#22c55e,#3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
        }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>U</span>
        </div>
        <span style={{
          fontFamily: "'Sora', system-ui", fontWeight: 800, fontSize: 15,
          background: "linear-gradient(135deg,#22c55e,#3b82f6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          DigitalSevaks
        </span>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {LINKS.map((link) => {
          if (link.path.startsWith("#")) {
            return (
              <span
                key={link.name}
                onClick={() => handleScroll(link.path.replace("#", ""))}
                style={{
                  cursor: "pointer", padding: "6px 12px",
                  fontSize: 13, color: "#475569",
                  fontFamily: "system-ui", borderRadius: 8,
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => e.target.style.color = "#22c55e"}
                onMouseLeave={e => e.target.style.color = "#475569"}
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
                textDecoration: "none",
                color: isActive ? "#22c55e" : "#475569",
                padding: "6px 12px", fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "system-ui", borderRadius: 8,
                background: isActive ? "rgba(34,197,94,0.08)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* RIGHT — Auth area */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {loading ? (
          // ── Loading skeleton ──
          <div style={{
            width: 100, height: 36, borderRadius: 999,
            background: "linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }} />
        ) : currentUser ? (
          // ── Logged in: show avatar dropdown ──
          <UserMenu
            userProfile={userProfile}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        ) : (
          // ── Not logged in: show Sign In + Get Started ──
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

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.nav>
  );
}
