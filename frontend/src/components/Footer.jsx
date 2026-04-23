import React, { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const T = {
  green:       "#22c55e",
  greenLight:  "#f0fdf4",
  greenMid:    "#dcfce7",
  blue:        "#3b82f6",
  blueLight:   "#eff6ff",
  blueMid:     "#bfdbfe",
  teal:        "#14b8a6",
  tealLight:   "#f0fdfa",
  text:        "#0f172a",
  textSub:     "#475569",
  textMuted:   "#94a3b8",
  border:      "rgba(15,23,42,0.07)",
  borderMid:   "rgba(15,23,42,0.12)",
  bg:          "#f8fafc",
  surface:     "#ffffff",
  font:        "'Inter', system-ui, sans-serif",
  shadow:      "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
  shadowMd:    "0 4px 20px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.06)",
  radius:      "16px",
  radiusLg:    "24px",
  radiusPill:  "999px",
};

const VP = { once: true, amount: 0.15 };

// ─── Nav data ───────────────────────────────────────────────────────────────────
const NAV_COLS = [
  {
    heading: "Product",
    links: ["Features", "AI Matching", "How It Works", "Impact Dashboard", "Integrations"],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Help Center", "Guides", "Community", "Changelog", "Privacy Policy", "Terms of Service"],
  },
];

// ─── Social icons ────────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "Twitter / X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "GitHub",
    href: "#",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

// ─── Ambient background blobs ────────────────────────────────────────────────────
function AmbientBlobs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {[
        { x: "5%",   y: "10%",  w: 360, color: "rgba(34,197,94,0.055)", dur: 20, delay: 0 },
        { x: "72%",  y: "5%",   w: 320, color: "rgba(59,130,246,0.05)", dur: 25, delay: 6 },
        { x: "45%",  y: "60%",  w: 260, color: "rgba(20,184,166,0.04)", dur: 18, delay: 9 },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 22, -14, 0], y: [0, -16, 10, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          style={{
            position: "absolute", left: b.x, top: b.y,
            width: b.w, height: b.w, borderRadius: "50%",
            background: b.color, filter: "blur(80px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Gradient divider line ────────────────────────────────────────────────────────
function GradientDivider() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} style={{ position: "relative", height: 1, overflow: "hidden" }}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${T.green} 25%, ${T.teal} 50%, ${T.blue} 75%, transparent 100%)`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}

// ─── Magnetic CTA button ─────────────────────────────────────────────────────────
function MagneticBtn({ label, primary = true, onClick }) {
  const ref = useRef(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 220, damping: 22 });
  const sy  = useSpring(y, { stiffness: 220, damping: 22 });
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      ref={ref}
      style={{
        x: sx, y: sy,
        fontFamily: T.font, fontSize: 14, fontWeight: 600,
        color:      primary ? "#fff" : T.green,
        background: primary
          ? `linear-gradient(135deg, ${T.green} 0%, ${T.blue} 100%)`
          : T.greenLight,
        border:     primary ? "none" : `1px solid ${T.greenMid}`,
        borderRadius: T.radiusPill,
        padding: "12px 26px", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 7,
        letterSpacing: "0.01em",
        boxShadow: primary && hov
          ? "0 8px 28px rgba(34,197,94,0.30)"
          : primary ? "0 4px 14px rgba(34,197,94,0.20)" : "none",
        transition: "box-shadow 0.3s",
      }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width  / 2) * 0.25);
        y.set((e.clientY - r.top  - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      {label}
      <motion.span
        animate={hov ? { x: 4 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ fontSize: 15 }}
      >→</motion.span>
    </motion.button>
  );
}

// ─── CTA strip ───────────────────────────────────────────────────────────────────
function FooterCTA() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg,
        padding: "clamp(28px,5vw,52px) clamp(24px,5vw,60px)",
        boxShadow: T.shadowMd,
        overflow: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}
    >
      {/* Background tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(120deg, ${T.greenLight} 0%, ${T.surface} 40%, ${T.blueLight} 100%)`,
        opacity: 0.55,
        pointerEvents: "none",
      }} />

      {/* Top gradient line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        borderRadius: `${T.radiusLg} ${T.radiusLg} 0 0`,
        background: `linear-gradient(90deg, ${T.green}, ${T.teal}, ${T.blue})`,
      }} />

      {/* Subtle floating glow behind text */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", left: "20%", top: "-30%",
          width: 280, height: 280, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(34,197,94,0.09), transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Text */}
      <div style={{ position: "relative", zIndex: 1, flex: "1 1 300px" }}>
        <h2 style={{
          fontFamily: T.font,
          fontSize: "clamp(22px,3.5vw,36px)",
          fontWeight: 800, color: T.text,
          letterSpacing: "-0.03em", lineHeight: 1.15,
          margin: "0 0 10px",
        }}>
          Start making{" "}
          <span style={{
            background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>impact</span>
          {" "}today
        </h2>
        <p style={{
          fontFamily: T.font, fontSize: "clamp(13px,1.4vw,15px)",
          fontWeight: 300, color: T.textSub,
          lineHeight: 1.7, margin: 0, maxWidth: 440,
        }}>
          Join thousands of volunteers and organisations already using UnityNet
          to create verifiable, measurable change in the world.
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      }}>
        <MagneticBtn label="Get Started" primary />
        <MagneticBtn label="Explore Opportunities" primary={false} />
      </div>
    </motion.div>
  );
}

// ─── Footer navigation column ────────────────────────────────────────────────────
function FooterColumn({ heading, links, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <h4 style={{
        fontFamily: T.font, fontSize: 12, fontWeight: 700,
        color: T.text, letterSpacing: "0.08em",
        textTransform: "uppercase", margin: 0,
      }}>{heading}</h4>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((link) => (
          <FooterLink key={link} label={link} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Animated footer link ────────────────────────────────────────────────────────
function FooterLink({ label }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      animate={{ color: hov ? T.green : T.textSub, x: hov ? 3 : 0 }}
      transition={{ duration: 0.18 }}
      style={{
        fontFamily: T.font, fontSize: 13.5,
        fontWeight: 400, textDecoration: "none",
        color: T.textSub, display: "inline-block",
        cursor: "pointer",
      }}
    >
      {label}
    </motion.a>
  );
}

// ─── Social icon button ──────────────────────────────────────────────────────────
function SocialIcon({ social }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={social.href}
      aria-label={social.label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileTap={{ scale: 0.93 }}
      style={{ display: "inline-flex", cursor: "pointer" }}
    >
      <motion.div
        animate={{
          scale: hov ? 1.12 : 1,
          background: hov ? T.greenLight : T.bg,
          borderColor: hov ? `${T.green}35` : T.border,
        }}
        transition={{ duration: 0.2 }}
        style={{
          width: 36, height: 36, borderRadius: 10,
          border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: T.bg,
          boxShadow: T.shadow,
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill={hov ? T.green : T.textMuted}
          style={{ transition: "fill 0.2s", flexShrink: 0 }}
        >
          <path d={social.path} />
        </svg>
      </motion.div>
    </motion.a>
  );
}

// ─── Newsletter widget ───────────────────────────────────────────────────────────
function NewsletterWidget({ delay, inView }) {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <h4 style={{
        fontFamily: T.font, fontSize: 12, fontWeight: 700,
        color: T.text, letterSpacing: "0.08em",
        textTransform: "uppercase", margin: 0,
      }}>Stay in the loop</h4>

      <p style={{
        fontFamily: T.font, fontSize: 12.5, fontWeight: 300,
        color: T.textMuted, lineHeight: 1.6, margin: 0,
      }}>
        Impact stories and platform updates, twice a month.
      </p>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px",
            background: T.greenLight, border: `1px solid ${T.greenMid}`,
            borderRadius: T.radius,
          }}
        >
          <span style={{ color: T.green, fontSize: 14 }}>✓</span>
          <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.green }}>
            You're subscribed!
          </span>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label htmlFor="footer-email" style={{
            fontFamily: T.font, fontSize: 11, fontWeight: 500,
            color: T.textMuted, letterSpacing: "0.04em",
          }}>Email address</label>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="you@email.com"
              required
              style={{
                flex: 1, minWidth: 0,
                fontFamily: T.font, fontSize: 13, fontWeight: 400,
                color: T.text,
                background: T.surface,
                border: `1px solid ${focused ? T.green + "60" : T.border}`,
                borderRadius: T.radius,
                padding: "9px 12px",
                outline: "none",
                boxShadow: focused ? `0 0 0 3px ${T.green}15` : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: T.font, fontSize: 12, fontWeight: 600,
                color: "#fff",
                background: `linear-gradient(135deg, ${T.green}, ${T.teal})`,
                border: "none", borderRadius: T.radius,
                padding: "9px 16px", cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(34,197,94,0.25)",
              }}
            >
              Subscribe
            </motion.button>
          </div>
          <p style={{
            fontFamily: T.font, fontSize: 11, fontWeight: 300,
            color: T.textMuted, margin: 0,
          }}>
            No spam. Unsubscribe anytime.
          </p>
        </form>
      )}
    </motion.div>
  );
}

// ─── Brand column ────────────────────────────────────────────────────────────────
function BrandColumn({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 240 }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(34,197,94,0.25)",
        }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: T.font }}>U</span>
        </div>
        <span style={{
          fontFamily: T.font, fontSize: 20, fontWeight: 800,
          background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.03em",
        }}>UnityNet</span>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: T.font, fontSize: 13.5, fontWeight: 300,
        color: T.textSub, lineHeight: 1.7, margin: 0,
      }}>
        Connecting people with purpose through intelligent matching. Building a
        world where skills meet need — at scale.
      </p>

      {/* Social icons */}
      <div style={{ display: "flex", gap: 8 }}>
        {SOCIALS.map((s) => <SocialIcon key={s.label} social={s} />)}
      </div>

      {/* Trust badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px",
        background: T.greenLight, border: `1px solid ${T.greenMid}`,
        borderRadius: 10, width: "fit-content",
      }}>
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, flexShrink: 0 }}
        />
        <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.green }}>
          48,000+ Sevaks active
        </span>
      </div>
    </motion.div>
  );
}

// ─── Bottom bar ──────────────────────────────────────────────────────────────────
function BottomBar({ inView }) {
  const LEGAL = ["Privacy Policy", "Terms of Service", "Cookie Preferences"];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.6 }}
      style={{
        paddingTop: 20,
        borderTop: `1px solid ${T.border}`,
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ fontFamily: T.font, fontSize: 12.5, fontWeight: 300, color: T.textMuted }}>
        © 2026 UnityNet, Inc. All rights reserved.
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
        {LEGAL.map((item, i) => (
          <FooterLink key={item} label={item} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Footer ─────────────────────────────────────────────────────────────────
export default function Footer() {
  const ref    = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <footer
      style={{
        position: "relative",
        background: T.bg,
        fontFamily: T.font,
        overflow: "hidden",
      }}
    >
      <AmbientBlobs />

      {/* Gradient divider at top */}
      <GradientDivider />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* CTA Strip */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "clamp(40px,6vw,72px) clamp(20px,5vw,64px) 0",
        }}>
          <FooterCTA />
        </div>

        {/* Main footer grid */}
        <div
          ref={ref}
          style={{
            maxWidth: 1200, margin: "0 auto",
            padding: "clamp(40px,5vw,64px) clamp(20px,5vw,64px) clamp(24px,4vw,40px)",
          }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
            gap: "clamp(28px,4vw,48px)",
            marginBottom: "clamp(32px,4vw,48px)",
            alignItems: "start",
          }}>
            {/* Brand */}
            <div style={{ gridColumn: "span 1" }}>
              <BrandColumn inView={inView} />
            </div>

            {/* Nav columns */}
            {NAV_COLS.map((col, i) => (
              <FooterColumn
                key={col.heading}
                heading={col.heading}
                links={col.links}
                delay={0.12 + i * 0.08}
                inView={inView}
              />
            ))}

            {/* Newsletter */}
            <NewsletterWidget delay={0.36} inView={inView} />
          </div>

          {/* Bottom bar */}
          <BottomBar inView={inView} />
        </div>
      </div>
    </footer>
  );
}
