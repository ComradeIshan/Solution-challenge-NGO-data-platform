import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

// ─── Procedural Earth texture (no external files needed) ─────────────────────────
// We build a high-quality procedural earth directly in WebGL via a canvas texture,
// giving us continents, oceans, and ice caps without any CDN dependency.
function buildEarthCanvas(w = 2048, h = 1024) {
  const canvas  = document.createElement('canvas')
  canvas.width  = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // ── Ocean base ──────────────────────────────────────────────────────────────
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h)
  oceanGrad.addColorStop(0,   '#1a3a5c')
  oceanGrad.addColorStop(0.3, '#1e4976')
  oceanGrad.addColorStop(0.5, '#245a8a')
  oceanGrad.addColorStop(0.7, '#1e4976')
  oceanGrad.addColorStop(1,   '#1a3a5c')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, w, h)

  // ── Ocean shimmer lines ──────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(100,180,255,0.07)'
  ctx.lineWidth = 1
  for (let y = 0; y < h; y += 12) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y + Math.sin(y * 0.05) * 6)
    ctx.stroke()
  }

  // ── Helper: draw land mass ───────────────────────────────────────────────────
  function drawLand(path, color, detail = true) {
    ctx.save()
    ctx.beginPath()
    const p = new Path2D(path)
    ctx.fill(p)
    if (detail) {
      // Subtle interior shading
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fill(p)
    }
    ctx.restore()
  }

  // Land color palette
  const LAND_BASE    = '#3d6b2f'
  const LAND_MID     = '#4a7a38'
  const LAND_LIGHT   = '#5a8f42'
  const LAND_DESERT  = '#c9a96e'
  const LAND_SAND    = '#d4b483'
  const LAND_ICE     = '#ddeeff'
  const LAND_TUNDRA  = '#8ba888'

  // ── Scale helpers ────────────────────────────────────────────────────────────
  // Convert geographic lon/lat to pixel x/y
  const px = (lon) => ((lon + 180) / 360) * w
  const py = (lat) => ((90  -  lat) / 180) * h

  // Build a polygon path string from [lon,lat] pairs
  function poly(pts) {
    return pts.map(([lo, la], i) =>
      `${i === 0 ? 'M' : 'L'}${px(lo).toFixed(1)},${py(la).toFixed(1)}`
    ).join(' ') + ' Z'
  }

  // ── Draw land masses using simplified continental outlines ───────────────────

  // NORTH AMERICA
  ctx.fillStyle = LAND_MID
  const namerica = poly([
    [-168,72],[-140,70],[-125,68],[-110,60],[-95,62],[-85,65],[-75,70],
    [-65,72],[-55,68],[-55,58],[-60,48],[-65,44],[-67,46],[-70,42],
    [-72,42],[-80,40],[-75,35],[-80,25],[-87,20],[-92,16],[-85,10],
    [-77,8],[-77,18],[-90,18],[-92,22],[-97,22],[-105,22],[-110,24],
    [-117,30],[-120,34],[-124,38],[-124,48],[-130,54],[-135,58],
    [-145,60],[-150,62],[-155,58],[-160,60],[-165,62],[-168,72]
  ])
  ctx.fill(new Path2D(namerica))

  // GREENLAND
  ctx.fillStyle = LAND_TUNDRA
  ctx.fill(new Path2D(poly([
    [-45,84],[-20,84],[-18,76],[-22,70],[-30,68],[-42,65],[-50,68],[-52,72],[-45,84]
  ])))

  // SOUTH AMERICA
  ctx.fillStyle = LAND_BASE
  ctx.fill(new Path2D(poly([
    [-80,12],[-77,8],[-62,12],[-55,6],[-52,4],[-50,0],[-48,-4],[-35,-8],
    [-35,-14],[-38,-18],[-42,-22],[-44,-24],[-48,-28],[-52,-32],[-58,-38],
    [-62,-44],[-65,-50],[-68,-54],[-68,-56],[-72,-50],[-72,-42],[-68,-36],
    [-62,-28],[-60,-22],[-58,-16],[-60,-10],[-62,-4],[-66,2],[-70,4],
    [-75,8],[-80,12]
  ])))

  // Amazon basin highlight
  ctx.fillStyle = '#2d5e22'
  ctx.fill(new Path2D(poly([
    [-68,-2],[-60,-2],[-50,-4],[-48,-8],[-52,-12],[-62,-10],[-68,-6],[-68,-2]
  ])))

  // EUROPE
  ctx.fillStyle = LAND_LIGHT
  ctx.fill(new Path2D(poly([
    [-10,62],[0,60],[10,56],[15,54],[20,54],[28,56],[30,60],[28,64],
    [22,68],[16,70],[8,70],[0,68],[-5,65],[-10,62]
  ])))
  ctx.fill(new Path2D(poly([
    [-10,38],[0,36],[5,38],[10,42],[15,44],[18,40],[20,38],[22,38],
    [26,40],[30,42],[30,46],[25,48],[20,48],[15,48],[10,50],[5,48],
    [0,46],[-5,44],[-8,42],[-10,38]
  ])))

  // Iberian Peninsula
  ctx.fillStyle = LAND_SAND
  ctx.fill(new Path2D(poly([[-9,38],[-6,36],[0,36],[3,38],[0,42],[-5,44],[-9,38]])))

  // Scandanavia
  ctx.fillStyle = LAND_TUNDRA
  ctx.fill(new Path2D(poly([[5,58],[8,56],[12,56],[15,58],[22,64],[28,70],[18,72],[8,70],[5,64],[5,58]])))

  // AFRICA
  ctx.fillStyle = LAND_MID
  ctx.fill(new Path2D(poly([
    [-18,16],[-12,20],[-5,24],[0,28],[10,30],[20,30],[32,30],[38,24],
    [42,12],[44,4],[42,-2],[36,-8],[30,-14],[26,-18],[32,-22],[34,-28],
    [30,-32],[22,-36],[18,-34],[16,-30],[14,-26],[12,-20],[10,-14],[8,-8],
    [6,-2],[6,4],[4,10],[2,14],[-2,12],[-4,8],[-8,6],[-12,8],[-14,12],[-18,16]
  ])))

  // Sahara desert
  ctx.fillStyle = LAND_DESERT
  ctx.fill(new Path2D(poly([
    [-10,22],[0,24],[10,26],[20,24],[30,22],[35,18],[30,14],[20,14],
    [10,14],[0,14],[-8,16],[-10,22]
  ])))

  // ASIA
  ctx.fillStyle = LAND_MID
  ctx.fill(new Path2D(poly([
    [26,42],[35,38],[40,36],[45,30],[50,26],[55,22],[60,22],[65,24],
    [70,20],[75,16],[80,12],[85,12],[90,22],[95,26],[100,24],[105,20],
    [110,22],[115,26],[120,30],[125,32],[128,36],[130,40],[132,42],
    [135,46],[135,50],[132,54],[128,56],[120,54],[110,50],[105,48],
    [100,50],[95,52],[90,54],[85,54],[80,52],[75,54],[70,54],[65,56],
    [60,56],[55,58],[50,56],[45,50],[40,46],[35,46],[30,46],[26,42]
  ])))

  // Tibetan plateau
  ctx.fillStyle = '#8a9e7a'
  ctx.fill(new Path2D(poly([[76,26],[84,26],[92,28],[96,26],[92,32],[84,32],[76,30],[76,26]])))

  // Arabian Peninsula / Middle East
  ctx.fillStyle = LAND_DESERT
  ctx.fill(new Path2D(poly([
    [36,30],[42,30],[48,28],[54,22],[58,20],[60,18],[56,14],[50,12],
    [44,14],[38,20],[36,24],[36,30]
  ])))

  // India
  ctx.fillStyle = '#4f7a3e'
  ctx.fill(new Path2D(poly([[68,22],[72,20],[76,18],[80,16],[84,14],[80,10],[76,8],[72,8],[68,10],[64,14],[66,18],[68,22]])))

  // Southeast Asia / Indonesia suggestion
  ctx.fillStyle = LAND_BASE
  ctx.fill(new Path2D(poly([[100,4],[104,4],[106,2],[104,0],[100,2],[100,4]])))
  ctx.fill(new Path2D(poly([[108,0],[112,0],[114,-2],[112,-4],[108,-2],[108,0]])))
  ctx.fill(new Path2D(poly([[118,-4],[122,-4],[124,-6],[120,-8],[116,-6],[118,-4]])))

  // RUSSIA / SIBERIA
  ctx.fillStyle = LAND_TUNDRA
  ctx.fill(new Path2D(poly([
    [30,66],[40,68],[50,70],[60,72],[70,74],[80,74],[90,76],[100,76],
    [110,74],[120,72],[130,70],[135,68],[140,64],[138,58],[132,54],
    [125,54],[120,56],[110,58],[100,60],[90,60],[80,60],[70,58],[60,56],
    [50,56],[45,54],[40,52],[35,50],[30,52],[28,58],[30,66]
  ])))

  // AUSTRALIA
  ctx.fillStyle = LAND_DESERT
  ctx.fill(new Path2D(poly([
    [114,-22],[118,-20],[122,-18],[128,-14],[132,-12],[136,-12],[140,-14],
    [144,-16],[148,-18],[150,-22],[152,-26],[152,-30],[150,-34],[148,-38],
    [144,-38],[140,-36],[136,-34],[130,-32],[124,-30],[118,-28],[114,-26],[114,-22]
  ])))
  ctx.fillStyle = '#b89060'
  ctx.fill(new Path2D(poly([[120,-24],[128,-22],[132,-24],[130,-28],[122,-28],[120,-24]])))

  // NEW ZEALAND
  ctx.fillStyle = LAND_LIGHT
  ctx.fill(new Path2D(poly([[170,-36],[172,-38],[172,-42],[170,-44],[168,-42],[168,-38],[170,-36]])))

  // JAPAN
  ctx.fillStyle = LAND_LIGHT
  ctx.fill(new Path2D(poly([[130,32],[132,34],[134,36],[136,36],[134,34],[132,32],[130,32]])))
  ctx.fill(new Path2D(poly([[140,38],[142,40],[144,42],[142,44],[140,42],[138,40],[140,38]])))

  // ARCTIC ICE
  ctx.fillStyle = LAND_ICE
  ctx.globalAlpha = 0.85
  ctx.fillRect(0, 0, w, py(78))
  ctx.globalAlpha = 1

  // ANTARCTIC ICE
  ctx.fillStyle = LAND_ICE
  ctx.globalAlpha = 0.9
  ctx.fillRect(0, py(-72), w, h - py(-72))
  ctx.globalAlpha = 1

  // ── Atmospheric haze at poles (gradient overlay) ──────────────────────────────
  const poleTopGrad = ctx.createLinearGradient(0, 0, 0, py(60))
  poleTopGrad.addColorStop(0, 'rgba(200,230,255,0.28)')
  poleTopGrad.addColorStop(1, 'rgba(200,230,255,0)')
  ctx.fillStyle = poleTopGrad
  ctx.fillRect(0, 0, w, py(60))

  const poleBotGrad = ctx.createLinearGradient(0, py(-60), 0, h)
  poleBotGrad.addColorStop(0, 'rgba(200,230,255,0)')
  poleBotGrad.addColorStop(1, 'rgba(200,230,255,0.28)')
  ctx.fillStyle = poleBotGrad
  ctx.fillRect(0, py(-60), w, h - py(-60))

  return canvas
}

// ─── Atmosphere shader ────────────────────────────────────────────────────────────
const ATMO_VERT = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal   = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const ATMO_FRAG = `
varying vec3 vNormal;
uniform vec3 uGlowColor;
void main() {
  float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
  gl_FragColor = vec4(uGlowColor, intensity * 0.85);
}
`

// ─── Atmosphere ring ──────────────────────────────────────────────────────────────
function Atmosphere({ radius }) {
  const uniforms = useMemo(() => ({
    uGlowColor: { value: new THREE.Color(0x4ab8d4) }
  }), [])

  return (
    <mesh scale={[1.08, 1.08, 1.08]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        vertexShader={ATMO_VERT}
        fragmentShader={ATMO_FRAG}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── City light dots on night side ───────────────────────────────────────────────
function CityLights({ radius }) {
  const CITIES = useMemo(() => {
    const pts = []
    const cities = [
      [40.7,-74.0],[51.5,-0.1],[48.8,2.3],[52.5,13.4],[55.7,37.6],
      [35.6,139.7],[31.2,121.5],[28.6,77.2],[19.1,72.9],[1.3,103.8],
      [-33.9,18.4],[-23.5,-46.6],[37.4,-122.1],[34.0,-118.2],[41.8,-87.6],
      [43.7,-79.4],[45.5,-73.6],[-34.6,-58.4],[30.0,31.2],[-37.8,144.9],
      [59.3,18.1],[59.9,30.3],[50.1,14.4],[47.4,8.5],[46.2,6.1],
    ]
    cities.forEach(([lat, lon]) => {
      const phi   = (90 - lat) * Math.PI / 180
      const theta = (lon + 180) * Math.PI / 180
      pts.push(
        radius * 1.005 * Math.sin(phi) * Math.cos(theta),
        radius * 1.005 * Math.cos(phi),
        radius * 1.005 * Math.sin(phi) * Math.sin(theta)
      )
    })
    return new Float32Array(pts)
  }, [radius])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[CITIES, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffe080" size={0.018} sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

// ─── Globe mesh ───────────────────────────────────────────────────────────────────
export function EarthMesh({ radius = 2.2 }) {
  const meshRef = useRef()
  const cloudsRef = useRef()

  // Build earth texture from canvas
  const earthTexture = useMemo(() => {
    const canvas  = buildEarthCanvas(2048, 1024)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return texture
  }, [])

  // Build cloud texture
  const cloudTexture = useMemo(() => {
    const w = 1024, h = 512
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, w, h)
    // Wispy cloud patches
    const clouds = [
      [100,100,80,60],[300,80,120,50],[500,120,90,40],[700,90,110,55],
      [900,100,95,45],[50,200,70,35],[400,220,100,40],[650,180,80,50],
      [850,210,110,45],[150,300,90,40],[500,280,130,55],[800,300,85,35],
      [200,380,100,45],[600,360,120,50],[900,380,75,40],[100,450,85,35],
      [400,430,110,45],[700,460,95,40],[300,150,70,30],[600,200,80,35],
    ]
    clouds.forEach(([x, y, rx, ry]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      g.addColorStop(0,   'rgba(255,255,255,0.75)')
      g.addColorStop(0.4, 'rgba(255,255,255,0.45)')
      g.addColorStop(1,   'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()
    })
    const t = new THREE.CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [])

  // Build specular map (oceans shine, land is matte)
  const specTexture = useMemo(() => {
    const w = 512, h = 256
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    // White = ocean (reflective), black = land (matte)
    ctx.fillStyle = '#4a6fa5'
    ctx.fillRect(0, 0, w, h)
    const t = new THREE.CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [])

  // Build bump map (subtle terrain)
  const bumpTexture = useMemo(() => {
    const w = 1024, h = 512
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#888'
    ctx.fillRect(0, 0, w, h)
    // Mountain ranges
    const ranges = [
      [320,230,60,8],  // Himalayas
      [200,210,40,6],  // Middle East mountains
      [160,190,30,5],  // Alps
      [120,190,20,4],  // Pyrenees
      [480,195,15,4],  // Japanese Alps
      [280,370,25,5],  // Andes top
      [280,430,25,5],  // Andes mid
      [150,160,20,5],  // Scandinavian ridge
    ]
    ranges.forEach(([x, y, len, ht]) => {
      ctx.fillStyle = `rgb(${180+ht*5},${180+ht*5},${180+ht*5})`
      for (let i = -len; i < len; i++) {
        const nx = x + i + (Math.random()-0.5)*4
        const ny = y + (Math.random()-0.5)*8
        ctx.fillRect(nx, ny, 3, 3)
      }
    })
    const t = new THREE.CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current)   meshRef.current.rotation.y   += delta * 0.06
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.07
  })

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef} receiveShadow castShadow>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshPhongMaterial
          map={earthTexture}
          specularMap={specTexture}
          bumpMap={bumpTexture}
          bumpScale={0.04}
          specular={new THREE.Color(0x2255aa)}
          shininess={18}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={[1.007, 1.007, 1.007]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial
          alphaMap={cloudTexture}
          color={0xffffff}
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Atmosphere glow */}
      <Atmosphere radius={radius} />

      {/* City lights */}
      <CityLights radius={radius} />
    </group>
  )
}
