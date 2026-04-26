import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import React from "react";

export default function DashboardLayout() {
  return (
    <>
      {/* ✅ Navbar always visible */}
      <Navbar type="app" />

      {/* ✅ Push content below navbar */}
      <div style={{ paddingTop: "90px" }}>
        <Outlet />
      </div>
    </>
  );
}