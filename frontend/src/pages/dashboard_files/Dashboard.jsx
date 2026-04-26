import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BackgroundLayer from "./BackgroundLayer";
import HeroImpactSection from "./HeroImpactSection";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import ActivityFeed from "./ActivityFeed";
import OpportunitiesGrid from "./OpportunitiesGrid";
import FloatingKPI from "./FloatingKPI";
import CTA from "../../components/CTA";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  // ✅ SAFE user parsing
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ Protect route + role-based redirect
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background:
          "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 30%, #eff6ff 65%, #f0f9ff 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* ✅ Navbar with role */}
      <Navbar />

      {/* Background */}
      <BackgroundLayer mousePos={mousePos} />

      {/* Floating KPI */}
      <FloatingKPI mousePos={mousePos} />

      {/* CTA */}
      <div style={{ marginBottom: 20 }}>
        <CTA />
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "100px 20px 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* HERO */}
        <div style={{ marginTop: 20 }}>
          <HeroImpactSection mousePos={mousePos} />
        </div>

        {/* STATS */}
        <div style={{ marginTop: 24 }}>
          <StatsGrid />
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: "20px",
            marginTop: 24,
          }}
        >
          <ChartSection />
          <ActivityFeed />
        </div>

        {/* OPPORTUNITIES */}
        <div style={{ marginTop: 32 }}>
          <OpportunitiesGrid />
        </div>

        {/* ✅ ROLE-BASED PROFILE BUTTON */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() =>
              navigate(
                user?.role === "ngo"
                  ? "/ngo-profile"
                  : "/volunteer-profile"
              )
            }
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#22c55e,#3b82f6)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {user?.role === "ngo" ? "NGO Profile" : "My Profile"}
          </button>
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 4px rgba(34,197,94,0.15)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            All systems operational · Digital Sevaks v2.4
          </span>
        </div>
      </div>
    </div>
  );
}