import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import React from "react";

function RotatingGlobe() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002; // smooth rotation
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
  color="#3b82f6"
  emissive="#22c55e"
  emissiveIntensity={0.4}
  wireframe
/>
    </Sphere>
  );
}

export default function Globe() {
  return (
    <div style={{ width: 360, height: 360 }}>
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} />

        <RotatingGlobe />

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}