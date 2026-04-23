import { motion } from "framer-motion";
import React from "react";

const activities = [
  "👤 +1 volunteer joined in Mumbai",
  "❤️ 3 people helped in Delhi",
  "🏥 Medical camp completed",
  "📦 Supplies delivered",
];

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Recent Activity</h3>

      <div className="space-y-3 text-sm text-gray-600">
        {activities.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {a}
          </motion.div>
        ))}
      </div>
    </div>
  );
}