import { motion } from "framer-motion";
import React from "react";

export default function ChartCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">
        Growth Overview
      </h3>

      <div className="flex items-end gap-2 h-40">
        {[40, 60, 30, 80, 55, 90, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-green-400 to-blue-500 rounded-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}