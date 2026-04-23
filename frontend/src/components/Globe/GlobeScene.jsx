import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { EarthMesh } from './EarthGlobe.jsx'

// ─── Lighting rig ─────────────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      {/* Ambient — base fill so dark side isn't pitch black */}
      <ambientLight intensity={0.28} color="#c8e0ff" />

      {/* Sun — key light from upper-left */}
      <directionalLight
        position={[5, 3, 5]}
        intensity={2.4}
        color="#fff5e8"
        castShadow
      />

      {/* Rim light — cool blue from the opposite side */}
      <directionalLight
        position={[-4, 1, -3]}
        intensity={0.5}
        color="#6699ff"
      />

      {/* Subtle green bounce from below (platform glow) */}
      <pointLight position={[0, -4, 2]} intensity={0.3} color="#22c55e" distance={12} />

      {/* Subtle hemisphere light for sky/ground differentiation */}
      <hemisphereLight
        skyColor="#ddeeff"
        groundColor="#334422"
        intensity={0.22}
      />
    </>
  )
}

// ─── Floating orbit wrapper (driven by JS, not Three.js rotation) ─────────────────
function FloatingGroup({ children }) {
  const groupRef = useRef()
  return (
    <group ref={groupRef}>
      {children}
    </group>
  )
}

export default function GlobeScene() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 520,
      }}
    >
      {/* Radial glow behind the globe */}
      <motion.div
        animate={{
          scale:   [1, 1.06, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 52%, rgba(34,197,94,0.18) 0%, rgba(59,130,246,0.14) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(32px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Outer soft ring */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          border: '1px solid rgba(34,197,94,0.18)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Canvas */}
      <div
        style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          shadows
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
        >
          <Lights />

          {/* Distant stars — very faint on light bg */}
          <Stars
            radius={100}
            depth={50}
            count={800}
            factor={2}
            saturation={0.4}
            fade
            speed={0.3}
          />

          {/* Floating animation wrapper */}
          <FloatingWrapper hovered={hovered}>
            <EarthMesh radius={2.2} />
          </FloatingWrapper>

          {/* Subtle orbit controls (no pan, limited zoom) */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI * 2 / 3}
            rotateSpeed={0.35}
          />
        </Canvas>
      </div>
    </div>
  )
}

// ─── Float animation via useFrame ────────────────────────────────────────────────
import { useFrame } from '@react-three/fiber'

function FloatingWrapper({ children, hovered }) {
  const ref = useRef()
  const t   = useRef(0)

  useFrame((_, delta) => {
    t.current += delta
    if (ref.current) {
      // Gentle sine float
      ref.current.position.y = Math.sin(t.current * 0.55) * 0.08
    }
  })

  return <group ref={ref}>{children}</group>
}
