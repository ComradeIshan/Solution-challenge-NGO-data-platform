import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import EarthGlobe from "./EarthGlobe";
import React from "react";

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.25} />

      <directionalLight
        position={[6, 3, 5]}
        intensity={2.2}
        color="#fff5e6"
      />

      <pointLight position={[-5, -2, -5]} intensity={0.7} color="#3b82f6" />

      <EarthGlobe />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}