import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

/* ───────── DATA ───────── */
const data = [
  { name: "Jan", users: 1200, matches: 400 },
  { name: "Feb", users: 2100, matches: 700 },
  { name: "Mar", users: 2800, matches: 900 },
  { name: "Apr", users: 3600, matches: 1200 },
  { name: "May", users: 4200, matches: 1500 },
  { name: "Jun", users: 5100, matches: 1800 },
];

/* ───────── CUSTOM TOOLTIP ───────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white/90 backdrop-blur-xl border shadow-xl rounded-xl px-4 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-blue-600">
        {payload[0].value} users
      </p>
    </div>
  );
};

/* ───────── LINE CHART (INSANE) ───────── */
export function InsaneLineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border shadow-sm hover:shadow-xl transition"
    >
      <h3 className="text-lg font-semibold mb-6">
        Growth Analytics 🚀
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="users"
            stroke="url(#lineGradient)"
            strokeWidth={4}
            dot={{ r: 0 }}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* ───────── BAR CHART (INSANE) ───────── */
export function InsaneBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border shadow-sm hover:shadow-xl transition"
    >
      <h3 className="text-lg font-semibold mb-6">
        Match Activity ⚡
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />

          <Bar
            dataKey="matches"
            fill="url(#barGradient)"
            radius={[10, 10, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}