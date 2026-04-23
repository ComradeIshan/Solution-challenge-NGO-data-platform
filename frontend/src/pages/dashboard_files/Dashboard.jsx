import { useState, useEffect, useCallback } from "react";
import BackgroundLayer from "./BackgroundLayer";
import DashboardHeader from "./DashboardHeader";
import HeroImpactSection from "./HeroImpactSection";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import ActivityFeed from "./ActivityFeed";
import OpportunitiesGrid from "./OpportunitiesGrid";
import FloatingKPI from "./FloatingKPI";
import React from "react";

export default function Dashboard() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 30%, #eff6ff 65%, #f0f9ff 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Layer 1: Background */}
      <BackgroundLayer mousePos={mousePos} />

      {/* Floating KPI that follows cursor */}
      <FloatingKPI mousePos={mousePos} />

      {/* Main content */}
      <div style={{
        maxWidth: 1360,
        margin: "0 auto",
        padding: "28px 28px 60px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* HEADER */}
        <DashboardHeader />

        {/* HERO — full width dominant */}
        <HeroImpactSection mousePos={mousePos} />

        {/* STATS GRID — 4 column */}
        <StatsGrid />

        {/* MAIN CONTENT — broken grid: 65/35 split */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 16,
          marginBottom: 24,
          alignItems: "start",
        }}>
          <ChartSection />
          <ActivityFeed />
        </div>

        {/* OPPORTUNITIES — 3 col, full width */}
        <OpportunitiesGrid />

        {/* FOOTER STATUS BAR */}
        <div style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingTop: 24,
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
          }} />
          <span style={{
            fontSize: 12, color: "#94a3b8",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>
            All systems operational · Digital Sevaks v2.4 · Last updated just now
          </span>
        </div>
      </div>
    </div>
  );
}
