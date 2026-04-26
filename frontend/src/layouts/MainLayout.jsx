import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ fix path if needed

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}