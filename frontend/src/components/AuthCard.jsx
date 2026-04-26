import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "./InputField";
import { fadeUp, stagger } from "../animations/variants";
import React from "react";
import { useNavigate } from "react-router-dom";

/* ── tiny helpers ── */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* Google icon SVG */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* Spinner */
function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        flexShrink: 0,
      }}
    />
  );
}

/* Magnetic button wrapper */
function MagButton({
  children,
  onClick,
  style = {},
  disabled = false,
  variant = "primary",
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const base = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    border: "none",
    borderRadius: "100px",
    cursor: disabled ? "not-allowed" : "pointer",
    overflow: "hidden",
    userSelect: "none",
    ...style,
  };

  const variants = {
    primary: {
      background: "linear-gradient(135deg,#1f2937,#111827)",
      color: "#fff",
    },
    google: {
      background: "#fff",
      color: "#1f2937",
      border: "1.5px solid #e5e7eb",
    },
    outline: {
      background: "transparent",
      color: "#1f2937",
      border: "1.5px solid #e5e7eb",
    },
  };

  const navigate = useNavigate();

  return (
    <motion.button
      type={onClick ? "button" : "submit"}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({
          x: (e.clientX - r.left - r.width / 2) * 0.2,
          y: (e.clientY - r.top - r.height / 2) * 0.2,
        });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      whileHover={{ scale: 1.04, y: pos.y - 2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      style={{ ...base, ...variants[variant], opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────── */
/*         MAIN AUTH CARD          */
/* ─────────────────────────────── */
export default function AuthCard() {
  const [mode, setMode] = useState("login"); /* "login" | "signup" */
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  /* validation */
  function validate() {
    const e = {};
    if (mode === "signup" && !form.name.trim())
      e.name = "Full name is required";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (mode === "signup" && form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); /* simulate API */
    setLoading(false);
    setSubmitted(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  }

  async function handleForgot() {
    if (!isValidEmail(form.email)) {
      setErrors({ email: "Enter your email first" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setForgotSent(true);
  }

  function switchMode(m) {
    setMode(m);
    setErrors({});
    setSubmitted(false);
    setForgotSent(false);
    setForm({ name: "", email: "", password: "", confirm: "" });
  }

  /* password strength */
  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][
    pwStrength
  ];

  return (
    /* glass card */
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
        padding: "40px 40px 36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle gradient shimmer top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg,#22c55e,#3b82f6,#14b8a6)",
          borderRadius: "28px 28px 0 0",
        }}
      />

      {/* ── MODE TOGGLE TAB ── */}
      <motion.div variants={fadeUp} style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            background: "#f3f4f6",
            borderRadius: "100px",
            padding: "4px",
            position: "relative",
          }}
        >
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: "100px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: mode === m ? "#1f2937" : "#9ca3af",
                position: "relative",
                zIndex: 1,
                transition: "color 0.22s ease",
              }}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
          {/* sliding pill */}
          <motion.div
            animate={{ x: mode === "login" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              position: "absolute",
              top: "4px",
              bottom: "4px",
              left: "4px",
              width: "calc(50% - 4px)",
              background: "#fff",
              borderRadius: "100px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      </motion.div>

      {/* ── SUCCESS STATE ── */}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: "center", padding: "24px 0 16px" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <h3
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "22px",
                fontWeight: 500,
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              {mode === "login" ? "Welcome back!" : "Account ready 🚀"}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              {mode === "login"
                ? "You're now signed in. Redirecting to your dashboard…"
                : "Your DigitalSevaks account is ready. Let's get started."}
            </p>
            <MagButton style={{ width: "100%", padding: "14px" }}>
              Go to Dashboard →
            </MagButton>
          </motion.div>
        ) : (
          /* ── FORM ── */
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -18 : 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 18 : -18 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* heading */}
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "#111827",
                  marginBottom: "6px",
                  letterSpacing: "-0.3px",
                }}
              >
                {mode === "login"
                  ? "Sign in to DigitalSevaks"
                  : "Join DigitalSevaks"}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {mode === "login"
                  ? "Good to see you again. Let's make impact."
                  : "Start making a real difference today."}
              </p>
            </div>

            {/* Google button */}
            <MagButton
              variant="google"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
              onClick={() => {}}
            >
              <GoogleIcon />
              Continue with Google
            </MagButton>

            {/* divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              <span
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  fontFamily: "'DM Sans',sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                or continue with email
              </span>
              <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            </div>

            {/* fields */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <InputField
                      id="name"
                      label="Full Name"
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      error={errors.name}
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                autoComplete="email"
              />

              <div>
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                {/* password strength bar — signup only */}
                {mode === "signup" && form.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: "8px", paddingLeft: "2px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <motion.div
                          key={n}
                          animate={{
                            background:
                              n <= pwStrength ? strengthColor : "#e5e7eb",
                          }}
                          transition={{ duration: 0.3 }}
                          style={{
                            flex: 1,
                            height: "3px",
                            borderRadius: "2px",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: strengthColor,
                        fontFamily: "'DM Sans',sans-serif",
                        fontWeight: 500,
                        transition: "color 0.3s",
                      }}
                    >
                      {strengthLabel}
                    </p>
                  </motion.div>
                )}
              </div>

              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <InputField
                      id="confirm"
                      label="Confirm Password"
                      type="password"
                      value={form.confirm}
                      onChange={set("confirm")}
                      error={errors.confirm}
                      autoComplete="new-password"
                      success={
                        form.confirm &&
                        !errors.confirm &&
                        form.password === form.confirm
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* forgot password */}
            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: "10px" }}>
                {forgotSent ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: "12px",
                      color: "#16a34a",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    ✓ Reset link sent!
                  </motion.span>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgot}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#9ca3af",
                      fontFamily: "'DM Sans',sans-serif",
                      transition: "color 0.18s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {/* submit button */}
            <MagButton
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "22px",
                fontSize: "15px",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : mode === "login" ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </MagButton>

            {/* switch mode link */}
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "13px",
                color: "#9ca3af",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {mode === "login"
                ? "New to DigitalSevaks? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "login" ? "signup" : "login")
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#3b82f6",
                  fontWeight: 500,
                  fontSize: "13px",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "color 0.18s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
