import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 2100 },
  { name: "Mar", value: 2800 },
  { name: "Apr", value: 3600 },
  { name: "May", value: 4200 },
  { name: "Jun", value: 5100 },
];

export default function AdvancedLineChart() {
  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm">
      <h3 className="mb-4 text-sm text-gray-500">Growth Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" />

          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
            fill="url(#color)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}