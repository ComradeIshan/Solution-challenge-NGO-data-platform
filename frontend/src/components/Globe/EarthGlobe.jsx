import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useGlobeTextures from "./useGlobeTextures";

const EARTH_RADIUS = 2;
const CLOUD_RADIUS = 2.03;
const ATMO_RADIUS = 2.2;

export default function EarthGlobe() {
  const earthRef = useRef();
  const cloudRef = useRef();
  const groupRef = useRef();

  const { dayMap, nightMap, normalMap, cloudsMap } = useGlobeTextures();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // rotation
    if (earthRef.current) earthRef.current.rotation.y += 0.0015;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.002;

    // subtle floating motion
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>

      {/* 🌟 LIGHTING (CINEMATIC) */}
      <ambientLight intensity={1.3} />

<directionalLight
  position={[5, 5, 5]}
  intensity={2.8}
/>

<pointLight
  position={[-5, -3, -5]}
  intensity={1.5}
  color="#3b82f6"
/>

      {/* 🌍 EARTH */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
  map={dayMap}
  normalMap={normalMap}
  roughness={0.7}
  metalness={0.05}
  emissive="#22c55e"
  emissiveIntensity={0.12}
  toneMapped={false}
/>
      </mesh>

      {/* ☁️ CLOUDS */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[CLOUD_RADIUS, 64, 64]} />
        <meshStandardMaterial
          alphaMap={cloudsMap}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* 🌌 ATMOSPHERE (GLOW EDGE) */}
      <mesh>
        <sphereGeometry args={[ATMO_RADIUS, 64, 64]} />
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 3.0);
              gl_FragColor = vec4(0.3,0.7,1.0,1.0) * intensity * 1.4;
            }
          `}
        />
      </mesh>

      {/* ✨ OUTER SOFT HALO */}
      <mesh>
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

    </group>
  );
}