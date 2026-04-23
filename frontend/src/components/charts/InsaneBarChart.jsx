import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import React from "react";

const data = [
  { name: "Jul", matches: 840, campaigns: 32 },
  { name: "Aug", matches: 1100, campaigns: 41 },
  { name: "Sep", matches: 960, campaigns: 38 },
  { name: "Oct", matches: 1340, campaigns: 55 },
  { name: "Nov", matches: 1580, campaigns: 62 },
  { name: "Dec", matches: 1820, campaigns: 74 },
];

export default function InsaneBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40"
    >
      <h3 className="text-sm text-gray-500 mb-4">Monthly Activity</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#999" />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          />

          <Bar
            dataKey="matches"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          />

          <Bar
            dataKey="campaigns"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}