import React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * InputField — Floating label input with focus glow, error/success,
 * password toggle, and micro-interaction scale on focus.
 *
 * Props:
 *   id, label, type, value, onChange, error, success, hint,
 *   autoComplete, disabled
 */
export default function InputField({
  id,
  label,
  type = "text",
  value = "",
  onChange,
  error,
  success,
  hint,
  autoComplete,
  disabled = false,
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const inputRef = useRef(null);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPw ? "text" : "password") : type;

  const lifted = focused || value.length > 0;

  /* border color logic */
  const borderColor = error
    ? "#ef4444"
    : success
    ? "#22c55e"
    : focused
    ? "#3b82f6"
    : "#e5e7eb";

  const glowColor = error
    ? "rgba(239,68,68,0.12)"
    : success
    ? "rgba(34,197,94,0.12)"
    : "rgba(59,130,246,0.12)";

  return (
    <motion.div
      style={{ position: "relative", width: "100%", marginBottom: "6px" }}
      animate={{ scale: focused ? 1.012 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {/* wrapper */}
      <div
        style={{
          position: "relative",
          borderRadius: "14px",
          border: `1.5px solid ${borderColor}`,
          background: disabled ? "#f9fafb" : "#fff",
          transition: "border-color 0.22s ease, box-shadow 0.22s ease",
          boxShadow: focused ? `0 0 0 4px ${glowColor}` : "none",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* floating label */}
        <motion.label
          htmlFor={id}
          animate={{
            top: lifted ? "8px" : "50%",
            y: lifted ? "0%" : "-50%",
            fontSize: lifted ? "10px" : "14px",
            color: error
              ? "#ef4444"
              : success
              ? "#16a34a"
              : focused
              ? "#3b82f6"
              : "#9ca3af",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{
            position: "absolute",
            left: "16px",
            pointerEvents: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: lifted ? "0.4px" : "0",
            textTransform: lifted ? "uppercase" : "none",
            zIndex: 2,
            lineHeight: 1,
          }}
        >
          {label}
        </motion.label>

        {/* input */}
        <input
          ref={inputRef}
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "28px 16px 10px",
            paddingRight: isPassword ? "48px" : "16px",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "#1f2937",
            borderRadius: "14px",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />

        {/* password toggle */}
        {isPassword && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowPw((v) => !v);
            }}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              transition: "color 0.18s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#4b5563")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >
            <AnimatePresence mode="wait" initial={false}>
              {showPw ? (
                <motion.svg
                  key="hide"
                  initial={{ opacity: 0, rotate: -10 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 10 }}
                  transition={{ duration: 0.18 }}
                  width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="show"
                  initial={{ opacity: 0, rotate: 10 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -10 }}
                  transition={{ duration: 0.18 }}
                  width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      {/* error / hint message */}
      <AnimatePresence>
        {(error || hint) && (
          <motion.p
            key={error || hint}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: "6px",
              marginLeft: "4px",
              fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
              color: error ? "#ef4444" : "#6b7280",
              lineHeight: 1.4,
            }}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
