import React, { Suspense } from "react";
import GlobeScene from "./GlobeScene";
import GlassCard from "./GlassCard";

export default function GlobeWrapper() {
  return (
    <div style={{ position: "relative", height: 640 }}>
  
  <GlobeScene />

  {/* Floating Cards */}
  <GlassCard title="Active NGOs" value="128+" style={{ top: "10%", left: "5%" }} />
  <GlassCard title="Volunteers" value="3.2K" style={{ top: "60%", left: "0%" }} />
  <GlassCard title="Impact" value="142K+" style={{ top: "20%", right: "0%" }} />
  <GlassCard title="Match Rate" value="94%" style={{ bottom: "10%", right: "10%" }} />

</div>
  );
}