import { Canvas } from "@react-three/fiber";
import EarthGlobe from "./EarthGlobe";
import React from "react";

export default function GlobeScene() {
  return (
    <Canvas
  camera={{ position: [0, 0, 5.5], fov: 40 }}
  style={{ background: "transparent" }}
  gl={{ alpha: true }}
>
      <EarthGlobe />
    </Canvas>
  );
}