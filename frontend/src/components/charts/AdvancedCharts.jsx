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

const lineData = [
  { name: "Jan", users: 1200 },
  { name: "Feb", users: 2100 },
  { name: "Mar", users: 2800 },
  { name: "Apr", users: 3600 },
  { name: "May", users: 4200 },
  { name: "Jun", users: 5100 },
];

const barData = [
  { name: "Jul", matches: 840 },
  { name: "Aug", matches: 1100 },
  { name: "Sep", matches: 960 },
  { name: "Oct", matches: 1340 },
  { name: "Nov", matches: 1580 },
  { name: "Dec", matches: 1820 },
];

export function AdvancedLineChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border"
    >
      <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function AdvancedBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border"
    >
      <h3 className="text-lg font-semibold mb-4">Monthly Matches</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />

          <Bar
            dataKey="matches"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}