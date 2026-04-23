import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import React from "react";

const data = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 2100 },
  { name: "Mar", value: 2800 },
  { name: "Apr", value: 3600 },
  { name: "May", value: 4200 },
  { name: "Jun", value: 5100 },
  { name: "Jul", value: 6300 },
  { name: "Aug", value: 7200 },
];

export default function InsaneLineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40"
    >
      <h3 className="text-sm text-gray-500 mb-4">Platform Growth</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          {/* GRADIENT */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>

            {/* GLOW */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
          <XAxis dataKey="name" stroke="#999" />

          {/* CUSTOM TOOLTIP */}
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
            cursor={{
              stroke: "#3b82f6",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />

          {/* MAIN LINE */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            filter="url(#glow)"
          />

          {/* AREA FILL */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="transparent"
            fill="url(#lineGradient)"
            fillOpacity={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}