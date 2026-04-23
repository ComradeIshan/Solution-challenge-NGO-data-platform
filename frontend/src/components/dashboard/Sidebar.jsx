import { LayoutDashboard, Users, FileText } from "lucide-react";
import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r p-6 hidden md:block">

      <h1 className="text-xl font-semibold mb-8">
        Unity<span className="text-green-500">Net</span>
      </h1>

      <nav className="space-y-4 text-sm">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
        <SidebarItem icon={Users} label="Volunteers" />
        <SidebarItem icon={FileText} label="Reports" />
      </nav>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition 
      ${active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
      
      <Icon size={18} />
      {label}
    </div>
  );
}