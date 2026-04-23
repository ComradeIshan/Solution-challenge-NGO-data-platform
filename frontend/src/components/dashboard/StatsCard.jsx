import { motion } from "framer-motion";
import React from "react";

const colors = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  pink: "bg-pink-100 text-pink-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

export default function StatsCard({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative p-6 rounded-2xl bg-white shadow-sm hover:shadow-xl transition"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}
      >
        ●
      </div>

      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </motion.div>
  );
}