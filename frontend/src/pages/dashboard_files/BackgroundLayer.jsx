import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import React from "react";

export default function BackgroundLayer({ mousePos }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>

      {/* Cursor radial glow */}
      <motion.div
        animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
        transition={{ type: "spring", stiffness: 80, damping: 25, mass: 0.5 }}
        style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(34,197,94,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />

      {/* Blob 1 — top left, green */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-15%", left: "-10%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Blob 2 — upper right, blue */}
      <motion.div
        animate={{ x: [0, -35, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute", top: "5%", right: "-12%",
          width: 620, height: 620, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)",
          filter: "blur(55px)",
        }}
      />

      {/* Blob 3 — center bottom, teal */}
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        style={{
          position: "absolute", bottom: "-5%", left: "25%",
          width: 550, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Blob 4 — bottom right */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}
