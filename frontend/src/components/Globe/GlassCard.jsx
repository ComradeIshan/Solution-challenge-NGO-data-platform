import { motion } from "framer-motion";

export default function GlassCard({ title, value, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.05 }}
      style={{
        position: "absolute",
        padding: "16px 20px",
        borderRadius: "16px",
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "white",
        fontSize: 14,
        ...style,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </motion.div>
  );
}
