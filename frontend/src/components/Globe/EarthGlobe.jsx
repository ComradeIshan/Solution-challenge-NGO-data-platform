import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useGlobeTextures from "./useGlobeTextures";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EARTH_RADIUS    = 2.0;
const CLOUD_RADIUS    = 2.03;
const ATMO_RADIUS     = 2.18;
const ROTATION_SPEED  = 0.0018;
const CLOUD_SPEED     = 0.0025;

// Data node positions [lat, lon] → (phi, theta) on sphere surface
const DATA_NODES = [
  { lat: 28.6,  lon: 77.2,  label: "New Delhi",     color: "#22c55e" },
  { lat: 51.5,  lon: -0.1,  label: "London",         color: "#14b8a6" },
  { lat: 40.7,  lon: -74.0, label: "New York",       color: "#3b82f6" },
  { lat: 35.7,  lon: 139.7, label: "Tokyo",          color: "#22c55e" },
  { lat: -33.9, lon: 18.4,  label: "Cape Town",      color: "#f59e0b" },
  { lat: -23.5, lon: -46.6, label: "São Paulo",      color: "#14b8a6" },
  { lat: 1.3,   lon: 103.8, label: "Singapore",      color: "#3b82f6" },
  { lat: 48.9,  lon: 2.3,   label: "Paris",          color: "#22c55e" },
];

// Arc connections [fromIdx, toIdx]
const ARCS = [
  [0, 1], [1, 2], [2, 3], [3, 6],
  [0, 6], [1, 7], [4, 1], [5, 2],
];

// Convert lat/lon to 3D sphere position
function latLonToVec3(lat, lon, radius) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Build a quadratic bezier arc between two sphere points
function buildArc(fromVec, toVec, segments = 48) {
  const mid = fromVec.clone().add(toVec).normalize().multiplyScalar(EARTH_RADIUS * 1.35);
  const curve = new THREE.QuadraticBezierCurve3(fromVec, mid, toVec);
  const points = curve.getPoints(segments);
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  return geom;
}

// ─── ATMOSPHERE SHADER ────────────────────────────────────────────────────────
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    gl_FragColor = vec4(0.25, 0.65, 1.0, 1.0) * intensity * 2.2;
  }
`;

// ─── DATA NODE MESH ───────────────────────────────────────────────────────────
function DataNode({ position, color, phase }) {
  const meshRef   = useRef();
  const outerRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Pulsing outer ring
    if (outerRef.current) {
      const s = 1 + 0.6 * Math.abs(Math.sin(t * 1.8 + phase));
      outerRef.current.scale.set(s, s, s);
      outerRef.current.material.opacity = 0.5 - 0.3 * Math.abs(Math.sin(t * 1.8 + phase));
    }
    // Inner dot glow
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 1.0 + 0.5 * Math.sin(t * 2.2 + phase);
    }
  });

  const col = new THREE.Color(color);

  return (
    <group position={position}>
      {/* Inner solid dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial
          color={col}
          emissive={col}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* Outer pulsing ring */}
      <mesh ref={outerRef}>
        <ringGeometry args={[0.045, 0.065, 24]} />
        <meshBasicMaterial
          color={col}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── CONNECTION ARC ───────────────────────────────────────────────────────────
function ConnectionArc({ from, to, color, phase }) {
  const matRef = useRef();
  const geom   = useMemo(() => buildArc(from, to), [from, to]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.opacity = 0.25 + 0.2 * Math.abs(Math.sin(t * 0.9 + phase));
    }
  });

  return (
    <line geometry={geom}>
      <lineBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0.35}
        linewidth={1}
      />
    </line>
  );
}

// ─── PARTICLE FIELD ───────────────────────────────────────────────────────────
function ParticleField({ count = 400 }) {
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = EARTH_RADIUS * (2.4 + Math.random() * 1.8);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  const fieldRef = useRef();
  useFrame(({ clock }) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      fieldRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.05;
    }
  });

  return (
    <points ref={fieldRef} geometry={geom}>
      <pointsMaterial
        color="#93c5fd"
        size={0.018}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ─── MAIN EARTH GLOBE ────────────────────────────────────────────────────────
export default function EarthGlobe() {
  const earthRef  = useRef();
  const cloudRef  = useRef();
  const nodesRef  = useRef();

  const { dayMap, nightMap, normalMap, specularMap, cloudsMap } = useGlobeTextures();

  // Pre-compute node world positions
  const nodePositions = useMemo(() =>
    DATA_NODES.map(n => latLonToVec3(n.lat, n.lon, EARTH_RADIUS + 0.01)),
  []);

  // Arc color cycling
  const arcColors = ["#22c55e", "#14b8a6", "#3b82f6", "#f59e0b"];

  useFrame((_, delta) => {
    if (earthRef.current)  earthRef.current.rotation.y  += ROTATION_SPEED;
    if (cloudRef.current)  cloudRef.current.rotation.y  += CLOUD_SPEED;
    if (nodesRef.current)  nodesRef.current.rotation.y  += ROTATION_SPEED;
  });

  return (
    <group>
      {/* ── LIGHTING ── */}
      {/* Sun simulation — warm directional from upper-right */}
      <directionalLight
        position={[5, 3, 4]}
        intensity={1.85}
        color="#fff8f0"
        castShadow={false}
      />
      {/* Soft ambient fill */}
      <ambientLight
      position={[6, 3, 5]}
       intensity={2.2} color="#fff5e6" />
      {/* Rim / backlight — cool blue edge */}
      <pointLight
        position={[-5, -2, -5]}
        intensity={0.7}
        color="#3b82f6"
      />

      {/* ── ATMOSPHERE GLOW ── */}
      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[ATMO_RADIUS, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* ── EARTH SPHERE ── */}
      <mesh ref={earthRef} receiveShadow castShadow>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
  map={dayMap}
  normalMap={normalMap}
  normalScale={new THREE.Vector2(0.6, 0.6)}
  roughness={0.65}
  metalness={0.05}
  emissiveMap={nightMap}
  emissive="#ffb36b"
  emissiveIntensity={0.35}
/>
      </mesh>

      {/* ── CLOUD LAYER ── */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[CLOUD_RADIUS, 64, 64]} />
        <meshStandardMaterial
          alphaMap={cloudsMap}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#ffffff"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* ── PARTICLE FIELD ── */}
      <ParticleField count={500} />

      {/* ── DATA NODES (rotate with Earth) ── */}
      <group ref={nodesRef}>
        {nodePositions.map((pos, i) => (
          <DataNode
            key={i}
            position={pos}
            color={DATA_NODES[i].color}
            phase={i * 0.8}
          />
        ))}

        {/* ── CONNECTION ARCS ── */}
        {ARCS.map(([a, b], i) => (
          <ConnectionArc
            key={i}
            from={nodePositions[a]}
            to={nodePositions[b]}
            color={arcColors[i % arcColors.length]}
            phase={i * 0.5}
          />
        ))}
      </group>
    </group>
  );
}
