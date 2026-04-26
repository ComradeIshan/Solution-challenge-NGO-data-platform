import React, { useState, useEffect, useRef } from "react";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  doc,
  setDoc,
  serverTimestamp,
} from "../services/firebase";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const G = {
  green: "#22c55e",
  greenDark: "#16a34a",
  greenLight: "#4ade80",
  blue: "#3b82f6",
  blueDark: "#1d4ed8",
  blueLight: "#60a5fa",
  teal: "#14b8a6",
  tealLight: "#5eead4",
  border: "#e5e7eb",
  borderFocus: "rgba(34,197,94,0.5)",
  glass: "rgba(255,255,255,0.82)",
  glassBorder: "rgba(255,255,255,0.9)",
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  error: "#ef4444",
  errorBg: "rgba(239,68,68,0.06)",
  shadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)",
  shadowGlow: "0 0 0 3px rgba(34,197,94,0.18)",
  shadowBlue: "0 0 0 3px rgba(59,130,246,0.18)",
};

// ─── FONTS ─────────────────────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0fdf4;overflow:hidden}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(34,197,94,0.3);border-radius:2px}
    input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px white inset!important}
    ::placeholder{color:#94a3b8}
    .chip-active{background:linear-gradient(135deg,#22c55e,#16a34a)!important;color:#fff!important;border-color:transparent!important}
  `}</style>
);

// ─── ANIMATED BLOB BACKGROUND ──────────────────────────────────────────────
const BlobBg = () => (
  <div
    style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
  >
    {[
      {
        w: 320,
        h: 320,
        top: "5%",
        left: "10%",
        c1: "#166534",
        c2: "#14532d",
        d: 0,
      },
      {
        w: 400,
        h: 400,
        top: "45%",
        left: "-8%",
        c1: "#1d4ed8",
        c2: "#1e3a8a",
        d: 3,
      },
      {
        w: 280,
        h: 280,
        top: "15%",
        left: "55%",
        c1: "#0f766e",
        c2: "#115e59",
        d: 6,
      },
      {
        w: 350,
        h: 350,
        top: "65%",
        left: "50%",
        c1: "#15803d",
        c2: "#1d4ed8",
        d: 2,
      },
    ].map((b, i) => (
      <motion.div
        key={i}
        animate={{
          x: [0, 18, -12, 0],
          y: [0, -22, 14, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 14 + i * 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: b.d,
        }}
        style={{
          position: "absolute",
          width: b.w,
          height: b.h,
          borderRadius: "50%",
          top: b.top,
          left: b.left,
          filter: "blur(60px)",
          opacity: 0.55,
          background: `radial-gradient(circle, ${b.c1}, ${b.c2})`,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, rgba(22,101,52,0.85) 0%, rgba(21,128,61,0.7) 40%, rgba(29,78,216,0.8) 100%)",
      }}
    />
  </div>
);

// ─── FLOATING ACTIVITY CARDS ───────────────────────────────────────────────
const activityItems = [
  { icon: "🌱", text: "Priya joined as Volunteer", time: "2s ago" },
  { icon: "🏥", text: "HealthBridge NGO verified", time: "1m ago" },
  { icon: "✅", text: "Campaign completed", time: "3m ago" },
  { icon: "🤝", text: "Match made in Mumbai", time: "5m ago" },
  { icon: "🌍", text: "EduGrow reached 1k hrs", time: "8m ago" },
];

const FloatingCard = ({ item, style, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
    transition={{
      opacity: { delay, duration: 0.5 },
      y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" },
      scale: { delay, duration: 0.5 },
    }}
    style={{
      position: "absolute",
      ...style,
      background: "rgba(255,255,255,0.14)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 14,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      zIndex: 3,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontSize: 16 }}>{item.icon}</span>
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(255,255,255,0.95)",
          lineHeight: 1.3,
        }}
      >
        {item.text}
      </div>
      <div
        style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 1 }}
      >
        {item.time}
      </div>
    </div>
  </motion.div>
);

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────
const Counter = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0,
      end = target,
      dur = 1800;
    const step = Math.max(1, Math.ceil(end / (dur / 16)));
    const t = setInterval(() => {
      start = Math.min(start + step, end);
      setVal(start);
      if (start >= end) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return (
    <span>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

// ─── LEFT PANEL ────────────────────────────────────────────────────────────
const LeftPanel = () => {
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setTicker((p) => (p + 1) % activityItems.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        flex: "0 0 46%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2.5rem",
      }}
    >
      <BlobBg />
      {/* Floating activity cards */}
      <FloatingCard
        item={activityItems[0]}
        style={{ top: "12%", left: "4%" }}
        delay={0.8}
      />
      <FloatingCard
        item={activityItems[2]}
        style={{ top: "58%", left: "52%" }}
        delay={1.4}
      />
      <FloatingCard
        item={activityItems[3]}
        style={{ bottom: "16%", left: "6%" }}
        delay={2.0}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 4, textAlign: "center" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 24,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: G.greenLight,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.05em",
            }}
          >
            TRUSTED BY 48,000+ VOLUNTEERS
          </span>
        </motion.div>

        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: "2.6rem",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Start making an
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #4ade80, #5eead4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            impact today
          </span>
        </h1>
        <p
          style={{
            fontSize: "0.92rem",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            maxWidth: 280,
            margin: "0 auto 2rem",
          }}
        >
          DigitalSevaks bridges passionate volunteers with NGOs that need them
          most — creating real change at scale.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 32,
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          {[
            { n: 48000, s: "+", l: "Volunteers" },
            { n: 1200, s: "+", l: "NGOs" },
            { n: 6.2, s: "M", l: "Hours Given" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.12 }}
            >
              <div
                style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {i === 2 ? s.n : <Counter target={s.n} />}
                {s.s}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 2,
                }}
              >
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live ticker */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: "10px 18px",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: G.greenLight,
              flexShrink: 0,
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={ticker}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
              }}
            >
              {activityItems[ticker].icon} {activityItems[ticker].text}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// ─── FLOATING LABEL INPUT ──────────────────────────────────────────────────
const FloatInput = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoFocus,
  icon,
  rightEl,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: error ? 4 : 16 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          border: `1.5px solid ${error ? G.error : focused ? G.green : G.border}`,
          background: error ? G.errorBg : "#fff",
          boxShadow: focused
            ? error
              ? `0 0 0 3px rgba(239,68,68,0.12)`
              : G.shadowGlow
            : "none",
          transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {icon && (
          <div
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? G.green : G.textMuted,
              transition: "color 0.2s",
              zIndex: 1,
              display: "flex",
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          style={{
            width: "100%",
            height: 54,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: icon
              ? "18px 14px 6px 42px"
              : rightEl
                ? "18px 44px 6px 16px"
                : "18px 16px 6px",
            fontSize: "0.9rem",
            fontFamily: "Plus Jakarta Sans,sans-serif",
            color: G.textPrimary,
            borderRadius: 12,
          }}
        />
        <label
          style={{
            position: "absolute",
            left: icon ? 42 : 16,
            pointerEvents: "none",
            fontSize: focused || hasValue ? "10px" : "14px",
            top: focused || hasValue ? "8px" : "50%",
            transform: focused || hasValue ? "none" : "translateY(-50%)",
            color: error ? G.error : focused ? G.green : G.textMuted,
            fontWeight: focused ? 600 : 400,
            transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
            fontFamily: "Plus Jakarta Sans,sans-serif",
          }}
        >
          {label}
        </label>
        {rightEl && (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 11, color: G.error, marginTop: 4, marginLeft: 4 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

// ─── PRIMARY BUTTON ─────────────────────────────────────────────────────────
const PrimaryBtn = ({
  children,
  onClick,
  loading,
  disabled,
  style = {},
  variant = "green",
}) => {
  const bg =
    variant === "blue"
      ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
      : "linear-gradient(135deg, #22c55e, #16a34a)";
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={
        disabled || loading
          ? {}
          : {
              y: -3,
              scale: 1.04,
              boxShadow:
                variant === "blue"
                  ? "0 10px 30px rgba(59,130,246,0.4)"
                  : "0 10px 30px rgba(34,197,94,0.4)",
            }
      }
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      style={{
        width: "100%",
        height: 52,
        border: "none",
        borderRadius: 14,
        background: disabled ? "#e5e7eb" : bg,
        color: disabled ? "#9ca3af" : "#fff",
        fontSize: "0.92rem",
        fontWeight: 700,
        fontFamily: "Plus Jakarta Sans,sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        letterSpacing: "0.01em",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {loading ? <Spinner /> : children}
    </motion.button>
  );
};

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    style={{
      width: 20,
      height: 20,
      border: "2.5px solid rgba(255,255,255,0.4)",
      borderTopColor: "#fff",
      borderRadius: "50%",
    }}
  />
);

// ─── ICON COMPONENTS ────────────────────────────────────────────────────────
const IconEye = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconMail = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,12 2,6" />
  </svg>
);
const IconLock = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconUser = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconChevron = ({ dir = "right" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points={dir === "right" ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
  </svg>
);
const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// ─── PROGRESS DOTS ───────────────────────────────────────────────────────────
const ProgressDots = ({ total, current }) => (
  <div
    style={{
      display: "flex",
      gap: 6,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          width: i === current ? 24 : 8,
          background:
            i < current ? G.green : i === current ? G.green : "#e5e7eb",
        }}
        style={{
          height: 8,
          borderRadius: 4,
          transition: "background 0.3s",
        }}
      />
    ))}
  </div>
);

// ─── CHIP SELECT ─────────────────────────────────────────────────────────────
const ChipSelect = ({ options, selected, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {options.map((opt) => {
      const active = selected.includes(opt.value);
      return (
        <motion.button
          key={opt.value}
          onClick={() => onToggle(opt.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "7px 14px",
            borderRadius: 20,
            border: `1.5px solid ${active ? G.green : G.border}`,
            background: active
              ? `linear-gradient(135deg,${G.green},${G.greenDark})`
              : "#f9fafb",
            color: active ? "#fff" : G.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Plus Jakarta Sans,sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
          {active && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <IconCheck />
            </motion.span>
          )}
        </motion.button>
      );
    })}
  </div>
);

// ─── ROLE CARD ────────────────────────────────────────────────────────────────
const RoleCard = ({ icon, title, desc, color, onClick, selected }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ y: -4, boxShadow: `0 16px 40px ${color}25` }}
    whileTap={{ scale: 0.98 }}
    style={{
      flex: 1,
      border: `2px solid ${selected ? color : G.border}`,
      borderRadius: 18,
      padding: "24px 20px",
      background: selected
        ? `linear-gradient(135deg,${color}08,${color}04)`
        : "#fff",
      cursor: "pointer",
      textAlign: "center",
      transition: "border-color 0.2s,background 0.2s",
      boxShadow: selected
        ? `0 0 0 4px ${color}18, 0 8px 24px ${color}15`
        : G.shadow,
      position: "relative",
    }}
  >
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${color},${color}cc)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconCheck />
      </motion.div>
    )}
    <motion.div
      animate={{ scale: selected ? [1, 1.15, 1] : 1 }}
      transition={{ duration: 0.4 }}
      style={{ fontSize: 40, marginBottom: 12, display: "block" }}
    >
      {icon}
    </motion.div>
    <div
      style={{
        fontWeight: 700,
        fontSize: "1rem",
        color: G.textPrimary,
        marginBottom: 6,
        fontFamily: "Sora,sans-serif",
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.6 }}>
      {desc}
    </div>
  </motion.div>
);

// ─── SLIDE TRANSITION ─────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
};

// ─── SIGN IN FORM ─────────────────────────────────────────────────────────────
const SignInForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!email || !/\S+@\S+\.\S+/.test(email))
      e.email = "Please enter a valid email";
    if (!pass || pass.length < 6)
      e.pass = "Password must be at least 6 characters";
    return e;
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Save to Firestore (merge so existing users aren't overwritten)
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setDone(true);
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setDone(true);
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found" || err.code === "auth/wrong-password"
          ? "Invalid email or password"
          : err.message;
      setErrors({ pass: msg });
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <SuccessState
        title="Welcome back!"
        sub="Redirecting to your dashboard…"
      />
    );

  return (
    <motion.div
      key="signin"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "Sora,sans-serif",
            fontSize: "1.6rem",
            fontWeight: 800,
            color: G.textPrimary,
            marginBottom: 6,
          }}
        >
          Welcome back
        </h2>
        <p style={{ fontSize: "0.85rem", color: G.textSecondary }}>
          Sign in to continue your impact journey
        </p>
      </div>

      {/* Google */}
      <motion.button
        onClick={handleGoogle}
        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          height: 50,
          border: `1.5px solid ${G.border}`,
          borderRadius: 14,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: "pointer",
          fontSize: "0.88rem",
          fontWeight: 600,
          fontFamily: "Plus Jakarta Sans,sans-serif",
          color: G.textPrimary,
          marginBottom: 20,
        }}
      >
        <GoogleIcon onClick={handleGoogle} /> Continue with Google
      </motion.button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1, height: 1, background: G.border }} />
        <span style={{ fontSize: 12, color: G.textMuted, fontWeight: 600 }}>
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: G.border }} />
      </div>

      <FloatInput
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((p) => ({ ...p, email: "" }));
        }}
        error={errors.email}
        icon={<IconMail />}
      />

      <FloatInput
        label="Password"
        type={showPw ? "text" : "password"}
        value={pass}
        onChange={(e) => {
          setPass(e.target.value);
          setErrors((p) => ({ ...p, pass: "" }));
        }}
        error={errors.pass}
        icon={<IconLock />}
        rightEl={
          <button
            onClick={() => setShowPw((p) => !p)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {showPw ? <IconEyeOff /> : <IconEye />}
          </button>
        }
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <motion.span
          whileHover={{ color: G.greenDark }}
          onClick={async () => {
            if (!email) {
              setErrors({ email: "Enter your email first" });
              return;
            }
            try {
              await sendPasswordResetEmail(auth, email);
              alert("Password reset link sent to your email!");
            } catch (err) {
              setErrors({ email: err.message });
            }
          }}
          style={{
            fontSize: 13,
            color: G.green,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Forgot password?
        </motion.span>
      </div>

      <PrimaryBtn onClick={submit} loading={loading}>
        Sign In{" "}
        <span style={{ display: "flex" }}>
          <IconChevron />
        </span>
      </PrimaryBtn>

      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: G.textSecondary,
          marginTop: 20,
        }}
      >
        New to DigitalSevaks?{" "}
        <motion.span
          whileHover={{ color: G.greenDark }}
          onClick={onSwitch}
          style={{ color: G.green, fontWeight: 700, cursor: "pointer" }}
        >
          Create account
        </motion.span>
      </p>
    </motion.div>
  );
};

// ─── SUCCESS STATE ─────────────────────────────────────────────────────────────
const SuccessState = ({ title, sub }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{ textAlign: "center", padding: "2rem 0" }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#22c55e,#16a34a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </motion.div>
    <h3
      style={{
        fontFamily: "Sora,sans-serif",
        fontSize: "1.4rem",
        fontWeight: 800,
        color: G.textPrimary,
        marginBottom: 8,
      }}
    >
      {title}
    </h3>
    <p style={{ fontSize: "0.88rem", color: G.textSecondary }}>{sub}</p>
  </motion.div>
);

// ─── SKILLS/INTERESTS DATA ──────────────────────────────────────────────────────
const SKILLS = [
  { value: "coding", label: "Coding", icon: "💻" },
  { value: "teaching", label: "Teaching", icon: "📚" },
  { value: "design", label: "Design", icon: "🎨" },
  { value: "medical", label: "Medical", icon: "🏥" },
  { value: "legal", label: "Legal", icon: "⚖️" },
  { value: "writing", label: "Writing", icon: "✍️" },
  { value: "events", label: "Events", icon: "🎪" },
  { value: "finance", label: "Finance", icon: "💰" },
];
const CAUSES = [
  { value: "education", label: "Education", icon: "📖" },
  { value: "health", label: "Healthcare", icon: "❤️" },
  { value: "environment", label: "Environment", icon: "🌿" },
  { value: "hunger", label: "Hunger", icon: "🥗" },
  { value: "animals", label: "Animals", icon: "🐾" },
  { value: "rights", label: "Human Rights", icon: "✊" },
];
const NGO_TYPES = [
  { value: "edu", label: "Education" },
  { value: "health", label: "Healthcare" },
  { value: "env", label: "Environment" },
  { value: "relief", label: "Disaster Relief" },
  { value: "rights", label: "Human Rights" },
  { value: "other", label: "Other" },
];

// ─── VOLUNTEER SIGNUP STEPS ───────────────────────────────────────────────────
const VolunteerSteps = ({ onBack, onDone }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({
    name: "",
    email: "",
    pass: "",
    skills: [],
    causes: [],
    avail: "",
    city: "",
    state: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const up = (k) => (v) => setData((p) => ({ ...p, [k]: v }));
  const toggleArr = (k) => (v) =>
    setData((p) => ({
      ...p,
      [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v],
    }));

  const goNext = async () => {
    const e = {};
    if (step === 0) {
      if (!data.name.trim()) e.name = "Name required";
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
        e.email = "Valid email required";
      if (!data.pass || data.pass.length < 6) e.pass = "Min 6 characters";
    }
    if (step === 1) {
      if (!data.skills.length) e.skills = "Pick at least one skill";
      if (!data.causes.length) e.causes = "Pick at least one cause";
      if (!data.avail) e.avail = "Select availability";
    }
    if (step === 2) {
      if (!data.city.trim()) e.city = "City required";
      if (!data.bio.trim()) e.bio = "Bio required";
    }
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setDir(1);
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      try {
        // 1. Create Firebase Auth user
        const { user } = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.pass,
        );

        // 2. Set display name in Firebase Auth
        await updateProfile(user, { displayName: data.name });

        // 3. Save full volunteer profile to Firestore
        await setDoc(doc(db, "users", user.uid), {
          role: "volunteer",
          name: data.name,
          email: data.email,
          skills: data.skills,
          causes: data.causes,
          availability: data.avail,
          city: data.city,
          state: data.state,
          bio: data.bio,
          createdAt: serverTimestamp(),
        });

        onDone();
      } catch (err) {
        setErrors({
          name:
            err.code === "auth/email-already-in-use"
              ? "This email is already registered"
              : err.message,
        });
        setDir(-1);
        setStep(0); // send back to email/pass step
      } finally {
        setLoading(false);
      }
    }
  };
  const goBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setDir(-1);
    setStep((s) => s - 1);
  };

  const PwEye = () => {
    const [show, setShow] = useState(false);
    return (
      <button
        onClick={() => {
          setShow(!show);
          up("pass")(data.pass);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: G.textMuted,
          display: "flex",
          padding: 4,
        }}
      >
        {show ? <IconEyeOff /> : <IconEye />}
      </button>
    );
  };

  return (
    <motion.div
      key="vsteps"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <motion.button
          onClick={goBack}
          whileHover={{ x: -2 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: G.textSecondary,
            display: "flex",
            padding: 4,
          }}
        >
          <IconChevron dir="left" />
        </motion.button>
        <div>
          <h2
            style={{
              fontFamily: "Sora,sans-serif",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: G.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {step === 0
              ? "Your Details"
              : step === 1
                ? "Your Skills & Interests"
                : "Location & Bio"}
          </h2>
          <p style={{ fontSize: 12, color: G.textSecondary, marginTop: 2 }}>
            Volunteer Registration · Step {step + 1} of 3
          </p>
        </div>
      </div>
      <ProgressDots total={3} current={step} />

      <div style={{ minHeight: 280, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div
              key="vs0"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <FloatInput
                label="Full Name"
                value={data.name}
                onChange={(e) => up("name")(e.target.value)}
                error={errors.name}
                icon={<IconUser />}
              />
              <FloatInput
                label="Email"
                type="email"
                value={data.email}
                onChange={(e) => up("email")(e.target.value)}
                error={errors.email}
                icon={<IconMail />}
              />
              <FloatInput
                label="Password"
                type="password"
                value={data.pass}
                onChange={(e) => up("pass")(e.target.value)}
                error={errors.pass}
                icon={<IconLock />}
              />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="vs1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: G.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  Your Skills
                </div>
                <ChipSelect
                  options={SKILLS}
                  selected={data.skills}
                  onToggle={toggleArr("skills")}
                />
                {errors.skills && (
                  <div style={{ fontSize: 11, color: G.error, marginTop: 6 }}>
                    {errors.skills}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: G.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  Causes You Care About
                </div>
                <ChipSelect
                  options={CAUSES}
                  selected={data.causes}
                  onToggle={toggleArr("causes")}
                />
                {errors.causes && (
                  <div style={{ fontSize: 11, color: G.error, marginTop: 6 }}>
                    {errors.causes}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: G.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  Availability
                </div>
                <select
                  value={data.avail}
                  onChange={(e) => up("avail")(e.target.value)}
                  style={{
                    width: "100%",
                    height: 50,
                    border: `1.5px solid ${errors.avail ? G.error : G.border}`,
                    borderRadius: 12,
                    padding: "0 14px",
                    fontSize: 14,
                    color: data.avail ? G.textPrimary : G.textMuted,
                    outline: "none",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    background: "#fff",
                  }}
                >
                  <option value="">Select availability…</option>
                  <option value="weekends">Weekends only</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="flexible">Flexible</option>
                  <option value="fulltime">Full-time</option>
                </select>
                {errors.avail && (
                  <div style={{ fontSize: 11, color: G.error, marginTop: 4 }}>
                    {errors.avail}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="vs2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <FloatInput
                    label="City"
                    value={data.city}
                    onChange={(e) => up("city")(e.target.value)}
                    error={errors.city}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FloatInput
                    label="State"
                    value={data.state}
                    onChange={(e) => up("state")(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: G.textPrimary,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Short Bio
                </label>
                <textarea
                  value={data.bio}
                  onChange={(e) => up("bio")(e.target.value)}
                  placeholder="Tell NGOs what drives you…"
                  style={{
                    width: "100%",
                    height: 100,
                    border: `1.5px solid ${errors.bio ? G.error : G.border}`,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 14,
                    color: G.textPrimary,
                    outline: "none",
                    resize: "none",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    lineHeight: 1.6,
                  }}
                />
                {errors.bio && (
                  <div style={{ fontSize: 11, color: G.error, marginTop: 2 }}>
                    {errors.bio}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PrimaryBtn onClick={goNext} loading={loading} style={{ marginTop: 8 }}>
        {step < 2 ? "Continue" : "Join as Volunteer"}{" "}
        {!loading && (
          <span style={{ display: "flex" }}>
            <IconChevron />
          </span>
        )}
      </PrimaryBtn>
    </motion.div>
  );
};

// ─── NGO SIGNUP STEPS ─────────────────────────────────────────────────────────
const NgoSteps = ({ onBack, onDone }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({
    orgName: "",
    email: "",
    pass: "",
    ngoType: "",
    regNum: "",
    years: "",
    city: "",
    state: "",
    desc: "",
    volReq: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const up = (k) => (v) => setData((p) => ({ ...p, [k]: v }));

  const goNext = async () => {
    const e = {};
    if (step === 0) {
      if (!data.orgName.trim()) e.orgName = "Organization name required";
      if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
        e.email = "Valid email required";
      if (!data.pass || data.pass.length < 6) e.pass = "Min 6 characters";
    }
    if (step === 1) {
      if (!data.ngoType) e.ngoType = "Select NGO type";
      if (!data.regNum.trim()) e.regNum = "Registration number required";
    }
    if (step === 2) {
      if (!data.city.trim()) e.city = "City required";
      if (!data.desc.trim()) e.desc = "Description required";
    }
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setDir(1);
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.pass,
        );

        await updateProfile(user, { displayName: data.orgName });

        await setDoc(doc(db, "users", user.uid), {
          role: "ngo",
          orgName: data.orgName,
          email: data.email,
          ngoType: data.ngoType,
          regNum: data.regNum,
          yearsInOperation: data.years,
          city: data.city,
          state: data.state,
          description: data.desc,
          volunteerRequirements: data.volReq,
          verified: false,
          createdAt: serverTimestamp(),
        });

        onDone();
      } catch (err) {
        setErrors({
          orgName:
            err.code === "auth/email-already-in-use"
              ? "This email is already registered"
              : err.message,
        });
        setDir(-1);
        setStep(0);
      } finally {
        setLoading(false);
      }
    }
  };
  const goBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setDir(-1);
    setStep((s) => s - 1);
  };

  return (
    <motion.div
      key="ngosteps"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <motion.button
          onClick={goBack}
          whileHover={{ x: -2 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: G.textSecondary,
            display: "flex",
            padding: 4,
          }}
        >
          <IconChevron dir="left" />
        </motion.button>
        <div>
          <h2
            style={{
              fontFamily: "Sora,sans-serif",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: G.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {step === 0
              ? "Organization Details"
              : step === 1
                ? "NGO Information"
                : "Location & Mission"}
          </h2>
          <p style={{ fontSize: 12, color: G.textSecondary, marginTop: 2 }}>
            NGO Registration · Step {step + 1} of 3
          </p>
        </div>
      </div>
      <ProgressDots total={3} current={step} />

      <div style={{ minHeight: 280, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div
              key="ns0"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <FloatInput
                label="Organization Name"
                value={data.orgName}
                onChange={(e) => up("orgName")(e.target.value)}
                error={errors.orgName}
                icon={<IconUser />}
              />
              <FloatInput
                label="Official Email"
                type="email"
                value={data.email}
                onChange={(e) => up("email")(e.target.value)}
                error={errors.email}
                icon={<IconMail />}
              />
              <FloatInput
                label="Password"
                type="password"
                value={data.pass}
                onChange={(e) => up("pass")(e.target.value)}
                error={errors.pass}
                icon={<IconLock />}
              />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="ns1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: G.textPrimary,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  NGO Type
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  {NGO_TYPES.map((t) => (
                    <motion.button
                      key={t.value}
                      onClick={() => up("ngoType")(t.value)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 20,
                        border: `1.5px solid ${data.ngoType === t.value ? G.blue : G.border}`,
                        background:
                          data.ngoType === t.value
                            ? `linear-gradient(135deg,${G.blue},${G.blueDark})`
                            : "#f9fafb",
                        color:
                          data.ngoType === t.value ? "#fff" : G.textSecondary,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Plus Jakarta Sans,sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {t.label}
                    </motion.button>
                  ))}
                </div>
                {errors.ngoType && (
                  <div style={{ fontSize: 11, color: G.error, marginTop: 4 }}>
                    {errors.ngoType}
                  </div>
                )}
              </div>
              <FloatInput
                label="Registration Number"
                value={data.regNum}
                onChange={(e) => up("regNum")(e.target.value)}
                error={errors.regNum}
              />
              <FloatInput
                label="Years in Operation"
                type="number"
                value={data.years}
                onChange={(e) => up("years")(e.target.value)}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="ns2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <FloatInput
                    label="City"
                    value={data.city}
                    onChange={(e) => up("city")(e.target.value)}
                    error={errors.city}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FloatInput
                    label="State"
                    value={data.state}
                    onChange={(e) => up("state")(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: G.textPrimary,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Organization Description
                </label>
                <textarea
                  value={data.desc}
                  onChange={(e) => up("desc")(e.target.value)}
                  placeholder="Describe your mission and impact…"
                  style={{
                    width: "100%",
                    height: 90,
                    border: `1.5px solid ${errors.desc ? G.error : G.border}`,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 14,
                    color: G.textPrimary,
                    outline: "none",
                    resize: "none",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    lineHeight: 1.6,
                  }}
                />
                {errors.desc && (
                  <div style={{ fontSize: 11, color: G.error, marginTop: 2 }}>
                    {errors.desc}
                  </div>
                )}
              </div>
              <FloatInput
                label="Volunteer Requirements (optional)"
                value={data.volReq}
                onChange={(e) => up("volReq")(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PrimaryBtn
        onClick={goNext}
        loading={loading}
        style={{ marginTop: 8 }}
        variant="blue"
      >
        {step < 2 ? "Continue" : "Register NGO"}{" "}
        {!loading && (
          <span style={{ display: "flex" }}>
            <IconChevron />
          </span>
        )}
      </PrimaryBtn>
    </motion.div>
  );
};

// ─── SIGN UP FLOW ──────────────────────────────────────────────────────────────
const SignUpFlow = ({ onSwitch }) => {
  const [role, setRole] = useState(null); // null | 'volunteer' | 'ngo'
  const [done, setDone] = useState(false);

  if (done)
    return (
      <SuccessState
        title={role === "volunteer" ? "You're a Volunteer!" : "NGO Registered!"}
        sub={
          role === "volunteer"
            ? "Your impact journey begins now — welcome to DigitalSevaks."
            : "We'll review your application within 48 hours."
        }
      />
    );
  if (role === "volunteer")
    return (
      <VolunteerSteps
        onBack={() => setRole(null)}
        onDone={() => setDone(true)}
      />
    );
  if (role === "ngo")
    return (
      <NgoSteps onBack={() => setRole(null)} onDone={() => setDone(true)} />
    );

  return (
    <motion.div
      key="roleselect"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "Sora,sans-serif",
            fontSize: "1.55rem",
            fontWeight: 800,
            color: G.textPrimary,
            marginBottom: 6,
          }}
        >
          Join DigitalSevaks
        </h2>
        <p style={{ fontSize: "0.85rem", color: G.textSecondary }}>
          Choose how you want to make an impact
        </p>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        <RoleCard
          icon="🙋"
          title="Volunteer"
          color={G.green}
          desc="Share your time and skills with NGOs that need you most"
          selected={role === "volunteer"}
          onClick={() => setRole("volunteer")}
        />
        <RoleCard
          icon="🏛️"
          title="NGO"
          color={G.blue}
          desc="Find dedicated volunteers to power your campaigns and missions"
          selected={role === "ngo"}
          onClick={() => setRole("ngo")}
        />
      </div>

      <motion.p
        whileHover={{}}
        style={{ textAlign: "center", fontSize: 13, color: G.textSecondary }}
      >
        Already a member?{" "}
        <motion.span
          whileHover={{ color: G.greenDark }}
          onClick={onSwitch}
          style={{ color: G.green, fontWeight: 700, cursor: "pointer" }}
        >
          Sign in
        </motion.span>
      </motion.p>
    </motion.div>
  );
};

// ─── AUTH CARD ─────────────────────────────────────────────────────────────────
const AuthCard = () => {
  const [tab, setTab] = useState("signin"); // signin | signup
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: G.glass,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${G.glassBorder}`,
        borderRadius: 24,
        boxShadow: G.shadow,
        width: "100%",
        maxWidth: 440,
        padding: "2.25rem 2rem",
        position: "relative",
      }}
    >
      {/* Tab toggle */}
      <div
        style={{
          display: "flex",
          background: "#f1f5f9",
          borderRadius: 999,
          padding: 4,
          marginBottom: 28,
          position: "relative",
        }}
      >
        <AnimatePresence>
          <motion.div
            key={tab}
            layoutId="tabPill"
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              borderRadius: 999,
              background: "#fff",
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              left: tab === "signin" ? 4 : "50%",
              width: "calc(50% - 4px)",
            }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        </AnimatePresence>
        {[
          { id: "signin", label: "Sign In" },
          { id: "signup", label: "Create Account" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              border: "none",
              background: "none",
              padding: "9px 12px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              color: tab === t.id ? G.textPrimary : G.textSecondary,
              fontFamily: "Plus Jakarta Sans,sans-serif",
              borderRadius: 999,
              transition: "color 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form area */}
      <div style={{ minHeight: 380 }}>
        <AnimatePresence mode="wait">
          {tab === "signin" ? (
            <SignInForm key="signin" onSwitch={() => setTab("signup")} />
          ) : (
            <SignUpFlow key="signup" onSwitch={() => setTab("signin")} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function DigitalSevaksAuth() {
  return (
    <>
      <FontLink />
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "#f0fdf4",
        }}
      >
        <LeftPanel />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "rgba(248,250,252,0.7)",
            overflowY: "auto",
          }}
        >
          <AuthCard />
        </div>
      </div>
    </>
  );
}
