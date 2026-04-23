import { Bell } from "lucide-react";
import React from "react";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-white">

      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search..."
          className="px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Bell size={20} />

        <div className="w-9 h-9 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}