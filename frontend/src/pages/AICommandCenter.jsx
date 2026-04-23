import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ─── DARK MISSION-CONTROL DESIGN TOKENS ──────────────────────────────────────
const C = {
  green:    "#22c55e",
  teal:     "#14b8a6",
  blue:     "#38bdf8",
  indigo:   "#6366f1",
  amber:    "#f59e0b",
  red:      "#ef4444",
  bg: "radial-gradient(circle at 20% 20%, #0b1620, #050a10)",
  surface: "rgba(255,255,255,0.03)",
surfaceHi:"rgba(255,255,255,0.08)",
border: "rgba(255,255,255,0.06)",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(20,184,166,0.2)",
  glow:     (c, a=0.35) => `0 0 40px ${c}${Math.round(a*255).toString(16).padStart(2,"0")}`,
  font:     "'DM Sans', system-ui, sans-serif",
  mono:     "'JetBrains Mono', 'Fira Code', monospace",
};

const glass = (extra={}) => ({
  background: C.surface,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  ...extra,
});

// ─── REUSABLE ATOMS ───────────────────────────────────────────────────────────
function PulseDot({ color=C.green, size=8 }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", width:size, height:size, flexShrink:0 }}>
      <motion.span animate={{ scale:[1,2.6,1], opacity:[.5,0,.5] }} transition={{ duration:2, repeat:Infinity }}
        style={{ position:"absolute", inset:0, borderRadius:"50%", background:color }} />
      <span style={{ position:"relative", width:"60%", height:"60%", margin:"auto", borderRadius:"50%", background:color, display:"block" }} />
    </span>
  );
}

function CountUp({ to, duration=1800, prefix="", suffix="" }) {
  const [v, setV] = useState(0);
  const ref = useRef();
  useEffect(()=>{
    const ob = new IntersectionObserver(([e])=>{
      if(!e.isIntersecting) return;
      let start=null;
      const tick=(ts)=>{
        if(!start) start=ts;
        const p=Math.min((ts-start)/duration,1);
        setV(Math.round(p*to));
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      ob.disconnect();
    },{threshold:.2});
    if(ref.current) ob.observe(ref.current);
    return ()=>ob.disconnect();
  },[to,duration]);
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

function MiniSparkline({ data, color }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v,i)=>`${(i/(data.length-1))*100},${100-(v/max)*80}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width:72, height:36 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}-${Math.random()}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GlowBadge({ label, color }) {
  return (
    <motion.span whileHover={{ scale:1.06 }}
      style={{ fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:20,
        background:`${color}18`, border:`1px solid ${color}40`, color, fontFamily:C.font, letterSpacing:".05em" }}>
      {label}
    </motion.span>
  );
}

// ─── CURSOR GLOW ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness:80, damping:20 });
  const sy = useSpring(y, { stiffness:80, damping:20 });
  useEffect(()=>{
    const h=(e)=>{ x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove",h);
    return ()=>window.removeEventListener("mousemove",h);
  },[]);
  return (
    <motion.div style={{ position:"fixed", top:0, left:0, width:480, height:480, borderRadius:"50%", pointerEvents:"none", zIndex:0,
      background:"radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
      translateX: useTransform(sx, v=>v-240), translateY: useTransform(sy, v=>v-240) }} />
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SecLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <span style={{ width:20, height:2, background:`linear-gradient(90deg,${C.teal},transparent)`, borderRadius:4, display:"block" }}/>
      <span style={{ fontSize:10, fontWeight:800, color:C.teal, textTransform:"uppercase", letterSpacing:".12em", fontFamily:C.font }}>
        {children}
      </span>
    </div>
  );
}

// ─── 1. AI COMMAND HERO ───────────────────────────────────────────────────────
function CommandHero() {
  const kpis = [
    { label:"Active Volunteers", value:3240, suffix:"", icon:"👥", color:C.green },
    { label:"NGOs Connected",    value:128,  suffix:"", icon:"🏢", color:C.teal },
    { label:"Matches / sec",     value:847,  suffix:"", icon:"⚡", color:C.blue },
    { label:"Impact Score",      value:94,   suffix:"%",icon:"🎯", color:C.amber },
  ];

  return (
    <div style={{ position:"relative", padding:"60px 0 40px", textAlign:"center", overflow:"hidden" }}>
      {/* Orbital rings */}
      {[220,300,380].map((r,i)=>(
        <motion.div key={i}
          animate={{ rotate: i%2===0?360:-360 }}
          transition={{ duration:20+i*8, repeat:Infinity, ease:"linear" }}
          style={{ position:"absolute", top:"50%", left:"50%",
            width:r*2, height:r*2, borderRadius:"50%",
            border:`1px solid ${C.teal}${i===0?"30":i===1?"18":"0d"}`,
            transform:`translate(-50%,-50%)`, pointerEvents:"none",
          }}>
          <div style={{ position:"absolute", top:-5, left:"50%", width:10, height:10, borderRadius:"50%",
            background:i===0?C.teal:i===1?C.green:C.blue,
            boxShadow:`0 0 12px ${i===0?C.teal:i===1?C.green:C.blue}`, transform:"translateX(-50%)" }} />
        </motion.div>
      ))}

      {/* Central glow */}
      <motion.div animate={{ scale:[1,1.08,1], opacity:[.4,.7,.4] }} transition={{ duration:4, repeat:Infinity }}
        style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:320, height:320, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(20,184,166,0.14), transparent)",
          pointerEvents:"none" }} />

      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:.9, ease:[.22,1,.36,1] }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:18 }}>
          <PulseDot color={C.green} size={10}/>
          <span style={{ fontSize:11, fontWeight:800, color:C.green, letterSpacing:".14em", fontFamily:C.font }}>SYSTEM ONLINE · ALL ENGINES ACTIVE</span>
          <PulseDot color={C.green} size={10}/>
        </div>
        <h1 style={{ margin:0, fontSize:"clamp(2.4rem,5vw,4rem)", fontWeight:900, color:"white",
          fontFamily:C.font, letterSpacing:"-0.03em", lineHeight:1.1 }}>
          AI{" "}
          <span style={{ background:`linear-gradient(90deg, ${C.teal}, ${C.green}, ${C.blue})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Command
          </span>
          {" "}Center
        </h1>
        <p style={{ marginTop:12, fontSize:16, color:"rgba(255,255,255,0.45)", maxWidth:500, margin:"14px auto 0", lineHeight:1.6 }}>
          Real-time intelligence powering social impact across India
        </p>
      </motion.div>

      {/* KPI strip */}
      <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:48, flexWrap:"wrap" }}>
        {kpis.map((k,i)=>(
          <motion.div key={k.label}
            initial={{ opacity:0, y:24, scale:.95 }} animate={{ opacity:1, y:0, scale:1 }}
            transition={{ delay:.3+i*.1, duration:.6, ease:[.22,1,.36,1] }}
            whileHover={{ y:-6, boxShadow:C.glow(k.color,.25) }}
            style={{ ...glass({ padding:"22px 28px", minWidth:160, textAlign:"center",
              boxShadow:C.glow(k.color,.1), transition:"box-shadow .3s, transform .3s" }) }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{k.icon}</div>
            <div style={{ fontSize:30, fontWeight:900, color:k.color, fontFamily:C.font, lineHeight:1 }}>
              <CountUp to={k.value} suffix={k.suffix}/>
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:5, fontWeight:600 }}>{k.label}</div>
            <motion.div animate={{ scaleX:[.6,1,.6] }} transition={{ duration:3, repeat:Infinity, delay:i*.4 }}
              style={{ height:2, borderRadius:4, background:`linear-gradient(90deg,${k.color},transparent)`, marginTop:10 }}/>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── 2. SYSTEM HEALTH GRID ────────────────────────────────────────────────────
function SystemHealth() {
  const systems = [
    { name:"Matching Engine",  status:"operational", uptime:99.97, latency:12,  color:C.green,  icon:"⚡", spark:[60,75,82,78,90,88,95,92] },
    { name:"AI Inference API", status:"operational", uptime:99.91, latency:28,  color:C.teal,   icon:"🧠", spark:[70,68,80,85,78,90,88,94] },
    { name:"Data Sync Layer",  status:"degraded",    uptime:97.40, latency:145, color:C.amber,  icon:"🔄", spark:[90,85,70,60,55,65,72,68] },
    { name:"NGO Network",      status:"operational", uptime:99.85, latency:34,  color:C.green,  icon:"🏢", spark:[50,62,70,80,85,88,90,92] },
    { name:"Volunteer Feed",   status:"operational", uptime:99.99, latency:8,   color:C.blue,   icon:"👥", spark:[80,85,90,92,88,94,96,98] },
    { name:"Impact Analytics", status:"maintenance", uptime:95.20, latency:220, color:C.red,    icon:"📊", spark:[95,90,80,40,20,30,25,35] },
  ];

  const statusColor = { operational:C.green, degraded:C.amber, maintenance:C.red };
  const statusLabel = { operational:"OPERATIONAL", degraded:"DEGRADED", maintenance:"MAINTENANCE" };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
      {systems.map((s,i)=>(
        <motion.div key={s.name}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:i*.07+.2, duration:.55, ease:[.22,1,.36,1] }}
          whileHover={{ y:-5, borderColor:C.borderHi, boxShadow:C.glow(s.color,.2) }}
          style={{ ...glass({ padding:"22px 24px", border:`1px solid ${C.border}`, transition:"all .3s", cursor:"default" }) }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:12,
                background:`linear-gradient(135deg,${s.color}25,${s.color}0d)`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.85)" }}>{s.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                  <PulseDot color={statusColor[s.status]} size={7}/>
                  <span style={{ fontSize:9, fontWeight:800, color:statusColor[s.status], letterSpacing:".08em" }}>
                    {statusLabel[s.status]}
                  </span>
                </div>
              </div>
            </div>
            <MiniSparkline data={s.spark} color={statusColor[s.status]}/>
          </div>
          <div style={{ display:"flex", gap:20 }}>
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:s.color, fontFamily:C.mono }}>{s.uptime}%</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:600 }}>UPTIME</div>
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:"rgba(255,255,255,.6)", fontFamily:C.mono }}>{s.latency}ms</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:600 }}>LATENCY</div>
            </div>
          </div>
          <div style={{ marginTop:14, height:4, borderRadius:10, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${s.uptime}%` }}
              transition={{ delay:i*.07+.6, duration:1, ease:"easeOut" }}
              style={{ height:"100%", borderRadius:10, background:`linear-gradient(90deg,${s.color},${s.color}80)` }}/>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── 3. IMPACT MAP ────────────────────────────────────────────────────────────
function ImpactMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    { id:"DL", name:"Delhi NCR",   x:40, y:25, r:22, v:920,  ngo:14, impact:94, color:C.green },
    { id:"MH", name:"Mumbai",      x:27, y:52, r:18, v:640,  ngo:9,  impact:82, color:C.teal },
    { id:"KA", name:"Bengaluru",   x:36, y:72, r:16, v:510,  ngo:8,  impact:80, color:C.blue },
    { id:"MH2",name:"Pune",        x:31, y:60, r:13, v:380,  ngo:6,  impact:72, color:C.amber },
    { id:"WB", name:"Kolkata",     x:68, y:44, r:14, v:290,  ngo:5,  impact:68, color:C.indigo },
    { id:"TN", name:"Chennai",     x:43, y:78, r:12, v:240,  ngo:4,  impact:64, color:C.green },
    { id:"TS", name:"Hyderabad",   x:42, y:65, r:11, v:210,  ngo:3,  impact:60, color:C.teal },
    { id:"RJ", name:"Jaipur",      x:35, y:36, r:10, v:170,  ngo:3,  impact:56, color:C.blue },
    { id:"GJ", name:"Ahmedabad",   x:24, y:44, r:10, v:155,  ngo:2,  impact:52, color:C.amber },
    { id:"UP", name:"Lucknow",     x:51, y:30, r:9,  v:130,  ngo:2,  impact:48, color:C.indigo },
  ];

  const totalVolunteers = regions.reduce((a,b)=>a+b.v,0);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
      style={{ ...glass({ padding:"32px 36px" }) }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"rgba(255,255,255,.9)", fontFamily:C.font }}>Geographic Intelligence</h2>
          <p style={{ margin:"4px 0 0", fontSize:13, color:"rgba(255,255,255,.35)" }}>Live volunteer density & NGO activity heatmap</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[["Volunteer Density",C.green],["NGO Activity",C.teal],["Impact Zone",C.blue]].map(([l,c])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:28, alignItems:"start" }}>
        {/* SVG Map */}
        <div style={{ position:"relative", background:"rgba(255,255,255,.02)", borderRadius:16,
          border:`1px solid ${C.border}`, overflow:"hidden" }}>
          {/* Grid lines */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.15 }}>
            {Array.from({length:8}).map((_,i)=>(
              <line key={`h${i}`} x1="0" y1={`${i*14.28}%`} x2="100%" y2={`${i*14.28}%`} stroke={C.teal} strokeWidth=".5"/>
            ))}
            {Array.from({length:8}).map((_,i)=>(
              <line key={`v${i}`} x1={`${i*14.28}%`} y1="0" x2={`${i*14.28}%`} y2="100%" stroke={C.teal} strokeWidth=".5"/>
            ))}
          </svg>

          <svg viewBox="0 0 100 100" style={{ width:"100%", height:340 }}>
            <defs>
              <radialGradient id="mapbg" cx="50%" cy="50%">
                <stop offset="0%" stopColor={C.teal} stopOpacity=".05"/>
                <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#mapbg)"/>

            {/* India outline — simplified */}
            <path d="M28,14 L50,10 L66,12 L76,22 L79,36 L73,50 L76,60 L70,72 L60,82 L52,90 L46,84 L38,74 L30,62 L23,52 L20,40 L24,26 Z"
              fill="rgba(20,184,166,0.06)" stroke="rgba(20,184,166,0.25)" strokeWidth=".6"/>

            {/* Connection lines between top nodes */}
            {regions.slice(0,6).map((r,i)=>regions.slice(i+1,i+2).map(r2=>(
              <motion.line key={`${r.id}-${r2.id}`}
                x1={r.x} y1={r.y} x2={r2.x} y2={r2.y}
                stroke={C.teal} strokeWidth=".3" strokeOpacity=".2" strokeDasharray="2,3"
                initial={{ pathLength:0 }} animate={{ pathLength:1 }}
                transition={{ delay:.8, duration:1.5 }}
              />
            )))}

            {/* Hotspots */}
            {regions.map((r,i)=>(
              <g key={r.id} style={{ cursor:"pointer" }}
                onMouseEnter={()=>setHoveredRegion(r)}
                onMouseLeave={()=>setHoveredRegion(null)}>
                {/* Outer pulse ring */}
                <motion.circle cx={r.x} cy={r.y} r={r.r}
                  fill={r.color} fillOpacity={hoveredRegion?.id === r.id ? 0.2 : 0.06}
                  animate={{ r:[r.r, r.r+4, r.r], fillOpacity:[.06,.14,.06] }}
                  transition={{ duration:2.8+i*.2, repeat:Infinity, delay:i*.25 }}
                />
                {/* Inner dot */}
                <motion.circle cx={r.x} cy={r.y} r={r.r*.35}
                  fill={r.color}
                  initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ delay:.3+i*.08, type:"spring", stiffness:200 }}
                  style={{ filter:`drop-shadow(0 0 6px ${r.color})` }}
                />
                <text x={r.x} y={r.y+r.r+5} textAnchor="middle"
                  fontSize="4" fill="rgba(255,255,255,.5)" fontFamily={C.font} fontWeight="600">
                  {r.name.split(" ")[0]}
                </text>
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredRegion && (
              <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                style={{ position:"absolute", top:16, left:16,
                  background:"rgba(7,13,20,.95)", borderRadius:14, padding:"14px 18px",
                  border:`1px solid ${hoveredRegion.color}40`, minWidth:180 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"white", marginBottom:8 }}>{hoveredRegion.name}</div>
                {[["👥 Volunteers", hoveredRegion.v.toLocaleString()],
                  ["🏢 NGOs", hoveredRegion.ngo],
                  ["🎯 Impact", `${hoveredRegion.impact}%`]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ color:"rgba(255,255,255,.5)" }}>{l}</span>
                    <span style={{ color:hoveredRegion.color, fontWeight:700 }}>{v}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Region list */}
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {regions.map((r,i)=>(
            <motion.div key={r.id}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:i*.06+.3 }}
              onMouseEnter={()=>setHoveredRegion(r)}
              onMouseLeave={()=>setHoveredRegion(null)}
              style={{ padding:"10px 14px", borderRadius:12, cursor:"pointer",
                background: hoveredRegion?.id===r.id?`${r.color}12`:C.surface,
                border:`1px solid ${hoveredRegion?.id===r.id?r.color+"35":C.border}`,
                transition:"all .2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:r.color,
                    boxShadow:`0 0 8px ${r.color}` }}/>
                  <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.75)" }}>{r.name}</span>
                </div>
                <span style={{ fontSize:11, color:r.color, fontWeight:800 }}>{r.impact}%</span>
              </div>
              <div style={{ marginTop:7, height:3, borderRadius:10, background:"rgba(255,255,255,.06)" }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${r.impact}%` }}
                  transition={{ delay:i*.06+.5, duration:.8 }}
                  style={{ height:"100%", borderRadius:10, background:`linear-gradient(90deg,${r.color},${r.color}60)` }}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── 4. REAL-TIME DECISION FEED ───────────────────────────────────────────────
function DecisionFeed() {
  const base = [
    { icon:"🧠", text:"AI suggests increasing recruitment in Delhi by 22%", sub:"Based on 3-week demand surge analysis", time:"now",    color:C.green,  type:"SUGGEST",   priority:"HIGH" },
    { icon:"📉", text:"Engagement drop detected in Mumbai — down 14%",       sub:"Volunteers inactive >10 days flagged",   time:"2m",     color:C.amber,  type:"ALERT",     priority:"MED" },
    { icon:"⚡", text:"Healthcare sector demand spike: +38% this week",       sub:"Predicted to persist 4–6 weeks",        time:"5m",     color:C.blue,   type:"TREND",     priority:"HIGH" },
    { icon:"🎯", text:"Edu-Bridge Rural crossed 1,000 beneficiary milestone", sub:"Top 2% of all active campaigns",        time:"11m",    color:C.teal,   type:"MILESTONE", priority:"LOW" },
    { icon:"🔄", text:"Re-matching 47 volunteers with higher-fit NGOs",       sub:"AI confidence >90% on reassignments",   time:"18m",    color:C.indigo, type:"ACTION",    priority:"MED" },
    { icon:"📍", text:"Tier-2 city coverage below target threshold",          sub:"Suggested: Jaipur, Lucknow, Nagpur",    time:"25m",    color:C.amber,  type:"ALERT",     priority:"HIGH" },
    { icon:"✅", text:"GreenEarth campaign auto-renewed by AI system",        sub:"Renewal confidence: 97.3%",             time:"34m",    color:C.green,  type:"AUTO",      priority:"LOW" },
  ];
  const extra = [
    { icon:"🧠", text:"AI detected new skill gap in Data Analytics sector",  sub:"Recommend 60+ data volunteers in Pune", time:"now",    color:C.teal,   type:"SUGGEST", priority:"HIGH" },
    { icon:"⚡", text:"Volunteer surge in Bengaluru — 3× normal intake",     sub:"AI recommending urgent NGO expansions", time:"now",    color:C.green,  type:"TREND",   priority:"HIGH" },
    { icon:"📉", text:"Low campaign conversion rate: Kolkata at 34%",        sub:"Below 55% target — action needed",      time:"now",    color:C.red,    type:"ALERT",   priority:"HIGH" },
  ];
  const [items, setItems] = useState(base);
  const idx = useRef(0);
  useEffect(()=>{
    const t = setInterval(()=>{
      setItems(p=>[extra[idx.current%extra.length],...p.slice(0,8)]);
      idx.current++;
    },4200);
    return ()=>clearInterval(t);
  },[]);

  const priorityColor = { HIGH:C.red, MED:C.amber, LOW:C.green };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.15 }}
      style={{ ...glass({ padding:"28px 28px", height:"100%", display:"flex", flexDirection:"column" }) }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:"rgba(255,255,255,.9)", fontFamily:C.font }}>Decision Intelligence</h3>
            <PulseDot color={C.red} size={8}/>
            <span style={{ fontSize:9, color:C.red, fontWeight:800 }}>LIVE</span>
          </div>
          <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,.3)" }}>AI-generated strategic alerts</p>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", display:"flex", flexDirection:"column", gap:8 }}>
        <AnimatePresence initial={false}>
          {items.map((item,i)=>(
            <motion.div key={`${item.text}-${i}`}
              initial={{ opacity:0, x:-24, height:0 }}
              animate={{ opacity:1, x:0, height:"auto" }}
              exit={{ opacity:0 }}
              transition={{ duration:.4, ease:[.22,1,.36,1] }}
              style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px",
                background:i===0?`${item.color}12`:C.surface,
                borderRadius:12, border:`1px solid ${i===0?item.color+"30":C.border}`,
                transition:"all .2s" }}>
              <span style={{ fontSize:17, flexShrink:0 }}>{item.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,.8)", fontWeight:i===0?700:500, lineHeight:1.4 }}>{item.text}</p>
                <p style={{ margin:"3px 0 0", fontSize:10, color:"rgba(255,255,255,.3)" }}>{item.sub}</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:`${item.color}20`, color:item.color, fontWeight:800 }}>{item.type}</span>
                <span style={{ fontSize:9, padding:"2px 5px", borderRadius:8, background:`${priorityColor[item.priority]}15`, color:priorityColor[item.priority], fontWeight:700 }}>{item.priority}</span>
                <span style={{ fontSize:9, color:"rgba(255,255,255,.2)" }}>{item.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── 5. AI DECISION ENGINE ────────────────────────────────────────────────────
function AIDecisionEngine() {
  const actions = [
    { title:"Increase recruitment in Tier-2 cities", detail:"Targeting Jaipur, Lucknow, Nagpur, Bhopal — 340 unfilled volunteer slots", confidence:92, impact:"HIGH", color:C.green, icon:"🚀" },
    { title:"Promote education campaigns nationally", detail:"Education sector shows 3.4× ROI vs current resource allocation", confidence:88, impact:"HIGH", color:C.teal, icon:"🎓" },
    { title:"Re-engage dormant volunteers in Mumbai", detail:"612 volunteers inactive >3 weeks — automated outreach recommended", confidence:85, impact:"MED", color:C.blue, icon:"🔄" },
    { title:"Expand healthcare volunteer base by 40%", detail:"Demand outpacing supply in 6 major metro healthcare NGOs", confidence:81, impact:"HIGH", color:C.amber, icon:"🏥" },
    { title:"Launch Delhi winter campaign early", detail:"Historical data shows 28% higher engagement in Oct–Nov window", confidence:79, impact:"MED", color:C.indigo, icon:"❄️" },
    { title:"Automate NGO onboarding for Tier-3 cities", detail:"24 NGOs in queue — manual bottleneck causing 18-day avg delay", confidence:76, impact:"MED", color:C.teal, icon:"⚙️" },
  ];
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
      style={{ ...glass({ padding:"32px 36px" }) }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <motion.div animate={{ rotate:[0,360] }} transition={{ duration:16, repeat:Infinity, ease:"linear" }}
          style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${C.teal},${C.blue})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</motion.div>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"rgba(255,255,255,.9)", fontFamily:C.font }}>AI Decision Engine</h2>
          <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,.35)" }}>Ranked strategic recommendations · Auto-refreshing</p>
        </div>
        <motion.div animate={{ opacity:[.5,1,.5] }} transition={{ duration:2.5, repeat:Infinity }}
          style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:20,
            background:`${C.teal}15`, border:`1px solid ${C.teal}30`,
            fontSize:11, fontWeight:800, color:C.teal, display:"flex", alignItems:"center", gap:6 }}>
          <PulseDot color={C.teal} size={7}/>
          PROCESSING
        </motion.div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {actions.map((a,i)=>(
          <motion.div key={a.title}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:i*.08+.3, duration:.5 }}
            whileHover={{ x:4, borderColor:`${a.color}40` }}
            onClick={()=>setExpanded(expanded===i?null:i)}
            style={{ padding:"18px 20px", borderRadius:16, cursor:"pointer",
              background:`${a.color}08`, border:`1px solid ${expanded===i?a.color+"40":a.color+"15"}`,
              transition:"all .2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,.85)" }}>{a.title}</span>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <motion.span animate={{ boxShadow:[`0 0 0px ${a.color}`,`0 0 16px ${a.color}60`,`0 0 0px ${a.color}`] }}
                      transition={{ duration:2.5, repeat:Infinity, delay:i*.3 }}
                      style={{ fontSize:14, fontWeight:900, color:a.color, background:`${a.color}20`,
                        padding:"3px 12px", borderRadius:20, border:`1px solid ${a.color}35` }}>
                      {a.confidence}%
                    </motion.span>
                    <span style={{ fontSize:9, padding:"2px 7px", borderRadius:8, fontWeight:800,
                      background:`${a.impact==="HIGH"?C.red:C.amber}18`,
                      color:a.impact==="HIGH"?C.red:C.amber }}>{a.impact}</span>
                  </div>
                </div>
                <div style={{ height:6, borderRadius:10, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${a.confidence}%` }}
                    transition={{ delay:i*.08+.6, duration:1, ease:"easeOut" }}
                    style={{ height:"100%", borderRadius:10, background:`linear-gradient(90deg,${a.color},${a.color}80)`,
                      position:"relative", overflow:"hidden" }}>
                    <motion.div animate={{ x:["-100%","200%"] }} transition={{ duration:2.5, repeat:Infinity, repeatDelay:2.5 }}
                      style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)" }}/>
                  </motion.div>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {expanded===i && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                  transition={{ duration:.3 }} style={{ overflow:"hidden" }}>
                  <p style={{ margin:"12px 0 0", fontSize:13, color:"rgba(255,255,255,.45)", lineHeight:1.5, paddingLeft:32 }}>
                    {a.detail}
                  </p>
                  <div style={{ paddingLeft:32, marginTop:10, display:"flex", gap:10 }}>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
                      style={{ padding:"7px 18px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:700, fontSize:12,
                        background:`linear-gradient(90deg,${a.color},${a.color}cc)`, color:"white" }}>
                      Execute Action
                    </motion.button>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
                      style={{ padding:"7px 18px", borderRadius:20, border:`1px solid ${C.border}`, cursor:"pointer",
                        fontWeight:700, fontSize:12, background:"transparent", color:"rgba(255,255,255,.5)" }}>
                      Dismiss
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 6. ANALYTICS CHARTS ─────────────────────────────────────────────────────
function AnalyticsCharts() {
  const growthData = [
    { m:"Jul", vol:1200, ngo:60,  match:890  },
    { m:"Aug", vol:1500, ngo:72,  match:1100 },
    { m:"Sep", vol:1800, ngo:85,  match:1380 },
    { m:"Oct", vol:2200, ngo:98,  match:1750 },
    { m:"Nov", vol:2700, ngo:110, match:2200 },
    { m:"Dec", vol:3240, ngo:128, match:2840 },
  ];
  const sectorData = [
    { s:"Education",   demand:94, supply:68 },
    { s:"Environment", demand:82, supply:74 },
    { s:"Healthcare",  demand:88, supply:56 },
    { s:"Technology",  demand:76, supply:70 },
    { s:"Women Emp.",  demand:72, supply:52 },
    { s:"Disaster",    demand:65, supply:48 },
  ];
  const radarData = [
    { sub:"Reach",    A:88 }, { sub:"Depth",  A:82 },
    { sub:"Speed",    A:94 }, { sub:"Accuracy",A:90 },
    { sub:"Coverage", A:78 }, { sub:"Trust",   A:96 },
  ];

  const tooltipStyle = {
    background:"rgba(7,13,20,.97)", border:`1px solid ${C.border}`,
    borderRadius:12, boxShadow:`0 8px 32px rgba(0,0,0,.4)`, fontSize:12, color:"rgba(255,255,255,.8)"
  };

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
      style={{ ...glass({ padding:"32px 36px" }) }}>
      <h2 style={{ margin:"0 0 6px", fontSize:20, fontWeight:800, color:"rgba(255,255,255,.9)", fontFamily:C.font }}>
        Advanced Analytics
      </h2>
      <p style={{ margin:"0 0 28px", fontSize:13, color:"rgba(255,255,255,.35)" }}>Platform growth, sector demand, and impact distribution</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 300px", gap:28 }}>
        {/* Growth area chart */}
        <div>
          <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".06em" }}>Growth Trends (6 months)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growthData}>
              <defs>
                {[["vg",C.green],["ng",C.teal],["mg",C.blue]].map(([id,c])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity=".3"/>
                    <stop offset="95%" stopColor={c} stopOpacity="0"/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/>
              <XAxis dataKey="m" tick={{ fontSize:11, fill:"rgba(255,255,255,.3)" }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Area type="monotone" dataKey="vol"   name="Volunteers" stroke={C.green} strokeWidth={2} fill="url(#vg)" dot={false}/>
              <Area type="monotone" dataKey="match" name="Matches"    stroke={C.blue}  strokeWidth={2} fill="url(#mg)" dot={false}/>
              <Area type="monotone" dataKey="ngo"   name="NGOs"       stroke={C.teal}  strokeWidth={2} fill="url(#ng)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector bar chart */}
        <div>
          <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".06em" }}>Sector Demand vs Supply</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorData} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/>
              <XAxis dataKey="s" tick={{ fontSize:9, fill:"rgba(255,255,255,.3)" }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Bar dataKey="demand" name="Demand" fill={C.teal}  radius={[5,5,0,0]} fillOpacity=".8"/>
              <Bar dataKey="supply" name="Supply" fill={C.green} radius={[5,5,0,0]} fillOpacity=".6"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div>
          <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".06em" }}>Impact Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,.08)"/>
              <PolarAngleAxis dataKey="sub" tick={{ fontSize:10, fill:"rgba(255,255,255,.4)", fontWeight:600 }}/>
              <Radar dataKey="A" stroke={C.teal} fill={C.teal} fillOpacity=".2" strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:20, marginTop:16, flexWrap:"wrap" }}>
        {[["Volunteers",C.green],["Matches",C.blue],["NGOs",C.teal],["Demand",C.teal],["Supply",C.green]].map(([l,c])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:c, opacity:.8 }}/>
            <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{l}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 7. CONTROL PANEL ─────────────────────────────────────────────────────────
function ControlPanel() {
  const [toggles, setToggles] = useState({
    autoMatch:true, aiRecommend:true, liveSync:true,
    campaignAuto:false, tierExpansion:false, smartAlerts:true,
  });
  const [sensitivity, setSensitivity] = useState(78);
  const [lastAction, setLastAction] = useState(null);

  const toggle = (k)=>{
    setToggles(p=>({...p,[k]:!p[k]}));
    setLastAction(`${k} ${!toggles[k]?"enabled":"disabled"}`);
    setTimeout(()=>setLastAction(null),2500);
  };

  const controls = [
    { key:"autoMatch",     label:"Auto-Matching Engine",      desc:"AI matches volunteers automatically",   color:C.green },
    { key:"aiRecommend",   label:"AI Recommendations",        desc:"Surface strategic suggestions",         color:C.teal },
    { key:"liveSync",      label:"Real-Time Data Sync",       desc:"Continuous data pipeline active",       color:C.blue },
    { key:"campaignAuto",  label:"Campaign Auto-Launch",      desc:"Deploy campaigns without approval",     color:C.amber },
    { key:"tierExpansion", label:"Tier-2 City Expansion",     desc:"Auto-target smaller cities",            color:C.indigo },
    { key:"smartAlerts",   label:"Smart Alert System",        desc:"AI-generated priority notifications",   color:C.green },
  ];

  const campaigns = ["Launch Winter Drive","Trigger Delhi Blitz","Activate Healthcare Push","Send Mass Outreach"];

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
      style={{ ...glass({ padding:"32px 36px" }) }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <div style={{ width:44, height:44, borderRadius:14,
          background:`linear-gradient(135deg,${C.amber},${C.red})`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🎛️</div>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"rgba(255,255,255,.9)", fontFamily:C.font }}>Admin Control Panel</h2>
          <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,.35)" }}>System modes, sensitivity & campaign triggers</p>
        </div>
        <AnimatePresence>
          {lastAction && (
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:20,
                background:`${C.green}18`, border:`1px solid ${C.green}35`,
                fontSize:12, fontWeight:700, color:C.green }}>
              ✓ {lastAction}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Toggles */}
        <div>
          <p style={{ margin:"0 0 14px", fontSize:11, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".08em" }}>System Modes</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {controls.map((c,i)=>(
              <motion.div key={c.key} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.06+.2 }}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px",
                  borderRadius:14, background: toggles[c.key]?`${c.color}0d`:C.surface,
                  border:`1px solid ${toggles[c.key]?c.color+"25":C.border}`, transition:"all .2s" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.8)" }}>{c.label}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>{c.desc}</div>
                </div>
                <motion.div onClick={()=>toggle(c.key)}
                  style={{ width:44, height:24, borderRadius:12, cursor:"pointer",
                    background: toggles[c.key]?`linear-gradient(90deg,${c.color},${c.color}cc)`:"rgba(255,255,255,.1)",
                    position:"relative", boxShadow: toggles[c.key]?C.glow(c.color,.3):"none",
                    transition:"background .3s, box-shadow .3s" }}>
                  <motion.div animate={{ x: toggles[c.key]?22:2 }} transition={{ type:"spring", stiffness:400, damping:26 }}
                    style={{ position:"absolute", top:2, width:20, height:20, borderRadius:"50%",
                      background:"white", boxShadow:"0 2px 8px rgba(0,0,0,.3)" }}/>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sensitivity + Actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          {/* Slider */}
          <div style={{ padding:"22px 20px", borderRadius:16, background:C.surface, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"rgba(255,255,255,.7)" }}>Matching Sensitivity</p>
              <motion.span key={sensitivity} animate={{ color:[C.amber,C.green,C.teal] }} transition={{ duration:.4 }}
                style={{ fontSize:20, fontWeight:900, fontFamily:C.mono }}>{sensitivity}%</motion.span>
            </div>
            <input type="range" min={40} max={99} value={sensitivity}
              onChange={e=>setSensitivity(Number(e.target.value))}
              style={{ width:"100%", accentColor:C.teal, cursor:"pointer", height:6 }}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>Broad matches</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>Precise matches</span>
            </div>
            <div style={{ marginTop:14, padding:"10px 14px", borderRadius:12, background:`${C.teal}12`, border:`1px solid ${C.teal}25` }}>
              <p style={{ margin:0, fontSize:12, color:`${C.teal}`, lineHeight:1.5 }}>
                {sensitivity>=85?"🎯 High precision — fewer but stronger matches"
                 :sensitivity>=65?"⚖️ Balanced — optimal for most use cases"
                 :"🌐 Broad reach — more matches, lower avg confidence"}
              </p>
            </div>
          </div>

          {/* Campaign triggers */}
          <div>
            <p style={{ margin:"0 0 12px", fontSize:11, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".08em" }}>Campaign Triggers</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {campaigns.map((c,i)=>(
                <motion.button key={c} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*.07+.4 }}
                  whileHover={{ scale:1.04, boxShadow:C.glow(C.teal,.3) }} whileTap={{ scale:.95 }}
                  onClick={()=>setLastAction(c)}
                  style={{ padding:"10px 12px", borderRadius:12, border:`1px solid ${C.border}`, cursor:"pointer",
                    background:C.surface, color:"rgba(255,255,255,.65)", fontSize:11, fontWeight:700,
                    fontFamily:C.font, textAlign:"center", transition:"all .2s" }}>
                  {c}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 8. PREDICTIVE INSIGHTS ───────────────────────────────────────────────────
function PredictiveInsights() {
  const forecastData = [
    { m:"Jan",  actual:3240, predicted:null },
    { m:"Feb",  actual:null, predicted:3580 },
    { m:"Mar",  actual:null, predicted:3920 },
    { m:"Apr",  actual:null, predicted:4380 },
    { m:"May",  actual:null, predicted:4850 },
    { m:"Jun",  actual:null, predicted:5440 },
  ];

  const predictions = [
    { icon:"📈", label:"Volunteer growth Q1",   value:"+35%", confidence:91, color:C.green  },
    { icon:"🏢", label:"New NGOs onboarding",   value:"+28",  confidence:87, color:C.teal   },
    { icon:"⚡", label:"Match efficiency gain", value:"+18%", confidence:83, color:C.blue   },
    { icon:"🌍", label:"Cities expansion",       value:"+12",  confidence:79, color:C.amber  },
  ];

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
      style={{ ...glass({ padding:"32px 36px", position:"relative", overflow:"hidden" }) }}>
      {/* Glow sweep */}
      <motion.div animate={{ x:["-100%","200%"] }} transition={{ duration:4, repeat:Infinity, repeatDelay:6 }}
        style={{ position:"absolute", top:0, left:0, width:"30%", height:"100%",
          background:"linear-gradient(90deg,transparent,rgba(20,184,166,0.06),transparent)", pointerEvents:"none" }}/>

      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <motion.div animate={{ scale:[1,1.12,1] }} transition={{ duration:3.5, repeat:Infinity }}
          style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${C.indigo},${C.blue})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🚀</motion.div>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"rgba(255,255,255,.9)", fontFamily:C.font }}>Predictive Intelligence</h2>
          <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,.35)" }}>AI projections for next 6 months · 87% avg confidence</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:32 }}>
        {/* Forecast chart */}
        <div>
          <p style={{ margin:"0 0 12px", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".06em" }}>Volunteer Growth Forecast</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity=".4"/>
                  <stop offset="95%" stopColor={C.green} stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.indigo} stopOpacity=".3"/>
                  <stop offset="95%" stopColor={C.indigo} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/>
              <XAxis dataKey="m" tick={{ fontSize:11, fill:"rgba(255,255,255,.3)" }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{ background:"rgba(7,13,20,.97)", border:`1px solid ${C.border}`, borderRadius:12, fontSize:12 }}/>
              <ReferenceLine x="Jan" stroke="rgba(255,255,255,.15)" strokeDasharray="4,4"/>
              <Area type="monotone" dataKey="actual"    name="Actual"    stroke={C.green}  strokeWidth={2.5} fill="url(#actGrad)"  dot={{ fill:C.green, r:4 }} connectNulls={false}/>
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke={C.indigo} strokeWidth={2} strokeDasharray="5,4" fill="url(#predGrad)" dot={{ fill:C.indigo, r:3 }} connectNulls={false}/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            {[["Actual",C.green],["Predicted (AI)",C.indigo]].map(([l,c])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:10, height:2, background:c, borderRadius:4 }}/>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {predictions.map((p,i)=>(
            <motion.div key={p.label}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.1+.4 }}
              whileHover={{ x:-4 }}
              style={{ padding:"14px 16px", borderRadius:14,
                background:`${p.color}0c`, border:`1px solid ${p.color}25` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{p.icon}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,.6)", fontWeight:600 }}>{p.label}</span>
                </div>
                <motion.span animate={{ scale:[1,1.06,1] }} transition={{ duration:3, repeat:Infinity, delay:i*.5 }}
                  style={{ fontSize:18, fontWeight:900, color:p.color }}>{p.value}</motion.span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:4, borderRadius:10, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${p.confidence}%` }}
                    transition={{ delay:i*.1+.7, duration:1 }}
                    style={{ height:"100%", borderRadius:10, background:`linear-gradient(90deg,${p.color},${p.color}70)` }}/>
                </div>
                <span style={{ fontSize:10, color:p.color, fontWeight:800, flexShrink:0 }}>{p.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────
function FloatingParticles() {
  const pts = Array.from({length:20},(_,i)=>({
    id:i,
    x: `${Math.random()*100}%`,
    y: `${Math.random()*100}%`,
    size: 2+Math.random()*3,
    color:[C.green,C.teal,C.blue,C.indigo][Math.floor(Math.random()*4)],
    dur: 6+Math.random()*8,
    delay: Math.random()*4,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {pts.map(p=>(
        <motion.div key={p.id}
          animate={{ y:[0,-30,0], opacity:[0,.6,0], scale:[0,1,0] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.delay, ease:"easeInOut" }}
          style={{ position:"absolute", left:p.x, top:p.y,
            width:p.size, height:p.size, borderRadius:"50%",
            background:p.color, boxShadow:`0 0 6px ${p.color}` }}/>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AICommandCenter() {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:C.font, color:"white",
      position:"relative", overflowX:"hidden" }}>
      <CursorGlow/>
      <FloatingParticles/>

      {/* Ambient gradient mesh */}
      {[["-8%","5%",C.teal],["-5%","60%",C.blue],["80%","20%",C.green],["70%","70%",C.indigo]].map(([l,t,c],i)=>(
        <div key={i} style={{ position:"fixed", left:l, top:t,
          width:500, height:500, borderRadius:"50%", pointerEvents:"none", zIndex:0,
          background:`radial-gradient(circle, ${c}07, transparent)` }}/>
      ))}

      {/* Scanline texture */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.008) 2px, rgba(255,255,255,.008) 4px)" }}/>

      <div style={{ maxWidth:1320, margin:"0 auto", padding:"32px 24px", position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:36 }}>

        {/* Top bar */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px",
            borderRadius:16, background:"rgba(255,255,255,.03)",
            border:`1px solid ${C.border}`, backdropFilter:"blur(12px)" }}>
          <motion.div animate={{ rotate:[0,360] }} transition={{ duration:10, repeat:Infinity, ease:"linear" }}
            style={{ width:32, height:32, borderRadius:10,
              background:`linear-gradient(135deg,${C.teal},${C.blue})`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</motion.div>
          <span style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,.9)" }}>Digital Sevaks</span>
          <span style={{ color:"rgba(255,255,255,.2)", fontSize:14 }}>/</span>
          <span style={{ fontSize:13, color:"rgba(255,255,255,.4)" }}>AI Command Center</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:10, alignItems:"center" }}>
            <GlowBadge label="ADMIN" color={C.amber}/>
            <GlowBadge label="v3.2.1" color={C.teal}/>
            <motion.div animate={{ opacity:[.4,1,.4] }} transition={{ duration:2, repeat:Infinity }}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
                borderRadius:20, background:`${C.green}15`, border:`1px solid ${C.green}30` }}>
              <PulseDot color={C.green} size={7}/>
              <span style={{ fontSize:11, fontWeight:800, color:C.green }}>ALL SYSTEMS OPERATIONAL</span>
            </motion.div>
          </div>
        </motion.div>

        {/* 1 Hero */}
        <CommandHero/>

        {/* 2 System Health */}
        <div>
          <SecLabel>System Health & Status</SecLabel>
          <SystemHealth/>
        </div>

        {/* 3 Map + 4 Feed */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, alignItems:"start" }}>
          <div>
            <SecLabel>Global Impact Map</SecLabel>
            <ImpactMap/>
          </div>
          <div>
            <SecLabel>Decision Feed</SecLabel>
            <DecisionFeed/>
          </div>
        </div>

        {/* 5 AI Decision Engine */}
        <div>
          <SecLabel>AI Decision Engine</SecLabel>
          <AIDecisionEngine/>
        </div>

        {/* 6 Analytics */}
        <div>
          <SecLabel>Advanced Analytics</SecLabel>
          <AnalyticsCharts/>
        </div>

        {/* 7 Control Panel */}
        <div>
          <SecLabel>Admin Control Panel</SecLabel>
          <ControlPanel/>
        </div>

        {/* 8 Predictive */}
        <div>
          <SecLabel>Predictive Intelligence</SecLabel>
          <PredictiveInsights/>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
          style={{ textAlign:"center", padding:"20px 0",
            borderTop:`1px solid ${C.border}` }}>
          <span style={{ fontSize:12, color:"rgba(255,255,255,.2)" }}>
            Digital Sevaks AI Command Center · Mission Control v3.2 · 
          </span>
          <span style={{ fontSize:12, color:C.teal, fontWeight:700 }}>All engines running · 847 matches/sec</span>
        </motion.div>
      </div>
    </div>
  );
}
