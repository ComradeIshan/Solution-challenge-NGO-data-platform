import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const C = {
  teal:"#14B8A6",
  blue:"#3B82F6",
  green:"#22C55E",
  amber:"#F59E0B",
  red:"#EF4444",

  bg:"#F8FAFC",
  bgSoft:"#EEF2F7",

  card:"rgba(255,255,255,0.7)",
  border:"rgba(0,0,0,0.06)",

  text:"#0F172A",
  textMid:"#475569",
  textDim:"#94A3B8",

  font:"Inter, sans-serif",
};

const mkGlass = (extra = {}) => ({
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  position: "relative",
  overflow: "hidden",
  ...extra,
});

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */
const areaData=[
  {m:"Oct",vol:420,mat:310,ngo:180},{m:"Nov",vol:580,mat:420,ngo:210},
  {m:"Dec",vol:510,mat:380,ngo:195},{m:"Jan",vol:720,mat:530,ngo:260},
  {m:"Feb",vol:880,mat:640,ngo:310},{m:"Mar",vol:960,mat:720,ngo:350},
  {m:"Apr",vol:1140,mat:850,ngo:420},
];
const barData=[
  {s:"Health",score:87,vol:420},{s:"Edu",score:73,vol:340},
  {s:"Env",score:91,vol:510},{s:"Food",score:65,vol:280},
  {s:"Tech",score:82,vol:390},{s:"Legal",score:58,vol:190},
];
const lineData=[
  {w:"W1",eng:62,ret:44},{w:"W2",eng:71,ret:52},{w:"W3",eng:68,ret:49},
  {w:"W4",eng:85,ret:63},{w:"W5",eng:79,ret:58},{w:"W6",eng:93,ret:71},
  {w:"W7",eng:88,ret:68},{w:"W8",eng:97,ret:76},
];
const SP={
  reports:[12,18,14,22,19,28,34,31,38,42],
  impact:[61,64,62,68,71,70,74,76,79,82],
  ngo:[74,76,73,79,81,80,83,85,87,89],
  engage:[52,55,51,58,62,60,65,68,71,74],
};
const CARDS=[
  {id:1,title:"Delhi Engagement Drop Analysis",tag:"ALERT",summary:"Volunteer sign-ups in Delhi NCR dropped 18% over the last fortnight. AI attributes this to competitive platforms and reduced NGO outreach cadence.",conf:91,pri:"HIGH",ts:"2 min ago",region:"Delhi NCR"},
  {id:2,title:"Environmental Sector Surge — West",tag:"TREND",summary:"Gujarat and Maharashtra show 34% uplift in eco-volunteering. Seasonal campaigns and 3 newly onboarded NGOs are primary drivers.",conf:87,pri:"MED",ts:"14 min ago",region:"Gujarat"},
  {id:3,title:"NGO Matching Efficiency Report",tag:"SUGGEST",summary:"AI matching algorithm achieved 92% first-round success rate this month — highest in recorded history. Low churn post-match confirms quality.",conf:95,pri:"MED",ts:"1 hr ago",region:"National"},
  {id:4,title:"Volunteer Retention Risk — Tier 2",tag:"ALERT",summary:"Dropout rates in Tier-2 cities elevated by 22%. Root cause: lack of local NGO density. Recommend outreach expansion immediately.",conf:78,pri:"HIGH",ts:"3 hr ago",region:"Tier-2"},
  {id:5,title:"Tech Volunteer Pipeline Analysis",tag:"TREND",summary:"Skilled tech volunteers up 41% YoY. Current NGO capacity insufficient to absorb demand — major growth opportunity on the table.",conf:83,pri:"LOW",ts:"6 hr ago",region:"Bangalore"},
];
const FEED_INIT=[
  {id:1,text:"Volunteer surge predicted in Tamil Nadu — 72hr window for optimal NGO placement.",icon:"⚡",pri:"HIGH",t:"just now"},
  {id:2,text:"Pattern: NGOs posting Tuesdays see 2.3× more matches vs weekends.",icon:"🧠",pri:"MED",t:"4m ago"},
  {id:3,text:"Impact score trending +12.4pts above quarterly baseline across 6 regions.",icon:"📈",pri:"LOW",t:"9m ago"},
  {id:4,text:"Anomaly: Mumbai food sector shows zero activity — potential reporting lag.",icon:"⚠️",pri:"HIGH",t:"17m ago"},
  {id:5,text:"AI projection confidence elevated to 94% — historical high recorded.",icon:"🎯",pri:"LOW",t:"31m ago"},
];
const FEED_POOL=[
  {id:100,text:"Cross-sector spike detected — potential viral volunteer campaign emerging.",icon:"📡",pri:"MED"},
  {id:101,text:"New NGO cluster forming in Northeast India — coverage gap closing fast.",icon:"🌐",pri:"LOW"},
  {id:102,text:"CRITICAL: Hyderabad engagement threshold breach — immediate review needed.",icon:"🔴",pri:"HIGH"},
  {id:103,text:"AI model retrained on Q1 data — projection accuracy improved by 6.2%.",icon:"🧬",pri:"LOW"},
];
const REGIONS=[
  {name:"Delhi NCR",r:198,imp:7.4,n:38,x:39,y:22},
  {name:"Mumbai",r:198,imp:8.1,n:54,x:27,y:49},
  {name:"Bangalore",r:167,imp:8.6,n:47,x:35,y:69},
  {name:"Chennai",r:121,imp:7.9,n:31,x:41,y:72},
  {name:"Kolkata",r:89,imp:7.1,n:24,x:64,y:34},
  {name:"Hyderabad",r:134,imp:8.3,n:39,x:39,y:58},
  {name:"Pune",r:97,imp:7.7,n:28,x:28,y:55},
  {name:"Ahmedabad",r:76,imp:7.2,n:21,x:23,y:38},
  {name:"Jaipur",r:63,imp:6.9,n:17,x:31,y:27},
  {name:"Lucknow",r:71,imp:6.8,n:19,x:48,y:26},
];
const CONNECTIONS=[[0,1],[0,5],[1,2],[1,6],[2,3],[2,5],[4,0],[7,1],[8,0],[9,0]];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */
const pc=p=>p==="HIGH"?C.red:p==="MED"?C.amber:C.green;
const tc=t=>t==="ALERT"?C.red:t==="TREND"?C.teal:C.blue;

function useCountUp(target,dur=1800){
  const[v,setV]=useState(0);
  useEffect(()=>{
    let cur=0;const step=target/(dur/16);
    const id=setInterval(()=>{cur=Math.min(cur+step,target);setV(Math.floor(cur));if(cur>=target)clearInterval(id);},16);
    return()=>clearInterval(id);
  },[target,dur]);
  return v;
}
function useClock(){
  const[t,setT]=useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id);},[]);
  return t;
}

/* ═══════════════════════════════════════════════════════════════════════════
   AMBIENT PARTICLES
═══════════════════════════════════════════════════════════════════════════ */
const PARTICLES=Array.from({length:26},(_,i)=>({
  id:i,x:Math.random()*100,y:Math.random()*100,
  size:Math.random()*2+0.5,dur:Math.random()*12+8,
  delay:Math.random()*-15,dx:(Math.random()-0.5)*30,dy:(Math.random()-0.5)*30,
  col:i%3===0?C.teal:i%3===1?C.blue:C.green,
}));

function Particles(){
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {PARTICLES.map(p=>(
        <motion.div key={p.id}
          animate={{x:[0,p.dx,0],y:[0,p.dy,0],opacity:[0,0.3,0]}}
          transition={{duration:p.dur,repeat:Infinity,delay:p.delay,ease:"easeInOut"}}
          style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
            width:p.size,height:p.size,borderRadius:"50%",background:p.col}}
        />
      ))}
    </div>
  );
}

function Scanlines(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",
      backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,184,0.012) 2px,rgba(0,212,184,0.012) 4px)`}}/>
  );
}

function CursorGlow(){
  const mx=useMotionValue(-300),my=useMotionValue(-300);
  const sx=useSpring(mx,{stiffness:120,damping:20});
  const sy=useSpring(my,{stiffness:120,damping:20});
  useEffect(()=>{
    const h=e=>{mx.set(e.clientX);my.set(e.clientY);};
    window.addEventListener("mousemove",h);return()=>window.removeEventListener("mousemove",h);
  },[]);
  return(
    <motion.div style={{position:"fixed",pointerEvents:"none",zIndex:2,
      x:sx,y:sy,translateX:"-50%",translateY:"-50%",
      width:300,height:300,borderRadius:"50%",
      background:"radial-gradient(circle,rgba(0,212,184,0.07) 0%,transparent 70%)"}}/>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL
═══════════════════════════════════════════════════════════════════════════ */
function Panel({children,style={},glow=C.teal,delay=0}){
  const[hov,setHov]=useState(false);
  return(
    <motion.div
      initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
      transition={{delay,duration:0.55,ease:[0.22,1,0.36,1]}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      style={{
        ...mkGlass(),
        boxShadow: hov
    ? "0 20px 50px rgba(0,0,0,0.08)"
    : "0 10px 30px rgba(0,0,0,0.05)",

  transform: hov ? "translateY(-6px)" : "none",

  transition:"all 0.3s ease",
  ...style,
}}
    >
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,
        background:`linear-gradient(90deg,transparent,${glow}60,transparent)`,
        opacity:hov?1:0.3,transition:"opacity 0.3s"}}/>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPARKLINE — animated draw
═══════════════════════════════════════════════════════════════════════════ */
function Sparkline({data,color}){
  const W=90,H=32;
  const min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const pts=data.map((v,i)=>({x:(i/(data.length-1))*W,y:H-((v-min)/range)*(H-4)-2}));
  const d=pts.map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fillPts=[...pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`),`${W},${H}`,"0,"+H].join(" ");
  const uid=color.replace("#","");
  return(
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id={`spf${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#spf${uid})`}/>
      <motion.polyline points={pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}}
        transition={{duration:1.2,ease:"easeOut"}}/>
      {pts.length>0&&(
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y}
          r="2.5" fill={color} style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CARD — Command Metric
═══════════════════════════════════════════════════════════════════════════ */
function MetricCard({label,value,suffix="",delta,color,sparkData,delay}){
  const count=useCountUp(value);
  const isPos=delta>0;
  return(
    <Panel delay={delay} glow={color} style={{padding:"22px 24px",flex:1,minWidth:200}}>
      <motion.div animate={{opacity:[0.15,0.35,0.15]}} transition={{repeat:Infinity,duration:3.5}}
        style={{position:"absolute",inset:-1,borderRadius:18,
          background:`radial-gradient(ellipse at 50% 0%,${color}25 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{color:C.textDim,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",
        marginBottom:10,fontFamily:C.font}}>
        <span style={{color}}> ◆ </span>{label}
      </div>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8}}>
        <div>
          <div style={{fontSize:32,fontWeight:700,lineHeight:1,fontFamily:C.font,
            background:`linear-gradient(135deg,${C.text} 0%,${color} 100%)`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {count.toLocaleString()}
            <span style={{fontSize:16,WebkitTextFillColor:C.textMid}}>{suffix}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:7}}>
            <motion.span animate={{scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:2}}
              style={{fontSize:10,color:isPos?C.green:C.red}}>{isPos?"▲":"▼"}</motion.span>
            <span style={{color:isPos?C.green:C.red,fontSize:12,fontWeight:700}}>{Math.abs(delta)}%</span>
            <span style={{color:C.textDim,fontSize:11}}> vs prev</span>
          </div>
        </div>
        <Sparkline data={sparkData} color={color}/>
      </div>
      <div style={{height:2,background:"rgba(255,255,255,0.06)",borderRadius:1,marginTop:16,overflow:"hidden"}}>
        <motion.div initial={{width:0}} animate={{width:`${Math.min((value/3000)*100,100).toFixed(0)}%`}}
          transition={{delay:delay+0.4,duration:1,ease:"easeOut"}}
          style={{height:"100%",background:`linear-gradient(90deg,${color},${color}80)`,
            boxShadow:`0 0 8px ${color}`,borderRadius:1}}/>
      </div>
      <div style={{position:"absolute",top:14,right:14}}>
        <motion.div animate={{scale:[1,1.6,1],opacity:[1,0.4,1]}} transition={{repeat:Infinity,duration:2.2}}
          style={{width:6,height:6,borderRadius:"50%",background:isPos?C.green:C.amber,
            boxShadow:`0 0 6px ${isPos?C.green:C.amber}`}}/>
      </div>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════════════════════════════════ */
function NeonTooltip({active,payload,label}){
  if(!active||!payload?.length)return null;
  return(
    <div style={{...mkGlass({borderRadius:12,padding:"10px 14px",minWidth:155}),
      boxShadow:`0 0 0 1px ${C.teal}55,0 8px 32px rgba(0,0,0,0.7)`,
      border:`1px solid ${C.teal}55`}}>
      <div style={{color:C.teal,fontSize:10,letterSpacing:"0.1em",marginBottom:7,fontFamily:C.font}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:p.color,boxShadow:`0 0 4px ${p.color}`}}/>
          <span style={{color:C.textMid,fontSize:11,fontFamily:C.font}}>{p.name}</span>
          <span style={{color:C.text,fontSize:12,fontWeight:700,marginLeft:"auto",fontFamily:C.font}}>
            {p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTEL BLOCK — Report Card
═══════════════════════════════════════════════════════════════════════════ */
function IntelBlock({card,delay}){
  const[open,setOpen]=useState(false);
  const[hov,setHov]=useState(false);
  const pColor=pc(card.pri),tColor=tc(card.tag);
  const circumference=2*Math.PI*20;
  return(
    <motion.div
      initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}}
      transition={{delay,duration:0.4,ease:[0.22,1,0.36,1]}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      style={{
        ...mkGlass({borderRadius:14,padding:0}),
        borderLeft:`2px solid ${pColor}`,
        boxShadow:hov?`0 0 0 1px ${pColor}44,0 6px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.07)`
          :`inset 0 1px 0 rgba(255,255,255,0.03)`,
        transform:hov?"translateY(-2px) scale(1.005)":"none",
        transition:"all 0.25s ease",cursor:"pointer",
      }}
    >
      <motion.div animate={{opacity:hov?0.6:0.2}} transition={{duration:0.3}}
        style={{position:"absolute",left:0,top:0,bottom:0,width:60,
          background:`linear-gradient(90deg,${pColor}18,transparent)`,pointerEvents:"none"}}/>
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,flexWrap:"wrap"}}>
              <span style={{background:`${pColor}22`,color:pColor,border:`1px solid ${pColor}55`,
                borderRadius:4,padding:"1px 8px",fontSize:9,fontWeight:700,letterSpacing:"0.12em",
                fontFamily:C.font,boxShadow:hov?`0 0 8px ${pColor}44`:"none",transition:"box-shadow 0.3s"}}>
                {card.pri}
              </span>
              <span style={{background:`${tColor}18`,color:tColor,border:`1px solid ${tColor}44`,
                borderRadius:4,padding:"1px 8px",fontSize:9,fontWeight:700,letterSpacing:"0.12em",fontFamily:C.font}}>
                ⬡ {card.tag}
              </span>
              <span style={{color:C.textDim,fontSize:10,fontFamily:C.font}}>{card.region} · {card.ts}</span>
            </div>
            <div style={{color:C.text,fontSize:13.5,fontWeight:600,lineHeight:1.4,fontFamily:C.font}}>{card.title}</div>
          </div>
          <div style={{flexShrink:0,textAlign:"center"}}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
              <motion.circle cx="26" cy="26" r="20" fill="none" stroke={pColor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{strokeDashoffset:circumference}}
                animate={{strokeDashoffset:circumference*(1-card.conf/100)}}
                transition={{delay:delay+0.4,duration:1,ease:"easeOut"}}
                transform="rotate(-90 26 26)"
                style={{filter:`drop-shadow(0 0 4px ${pColor})`}}/>
              <text x="26" y="30" textAnchor="middle" fill={pColor}
                style={{fontSize:12,fontWeight:700,fontFamily:C.font}}>{card.conf}%</text>
            </svg>
            <div style={{color:C.textDim,fontSize:9,fontFamily:C.font}}>conf.</div>
          </div>
        </div>
        <AnimatePresence>
          {open&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
              exit={{height:0,opacity:0}} transition={{duration:0.35}}>
              <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid rgba(255,255,255,0.06)`,
                color:C.textMid,fontSize:12.5,lineHeight:1.65,fontFamily:C.font}}>
                {card.summary}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{display:"flex",gap:7,marginTop:13,flexWrap:"wrap"}}>
          {[
            {lbl:open?"▲ Collapse":"▼ Expand",act:()=>setOpen(!open),col:C.teal},
            {lbl:"◉ Full Report",act:()=>{},col:C.blue},
            {lbl:"↓ Export",act:()=>{},col:C.textDim},
            {lbl:"⤴ Share",act:()=>{},col:C.textDim},
          ].map(({lbl,act,col})=>(
            <motion.button key={lbl} whileTap={{scale:0.94}} onClick={act} style={{
              background:`${col}12`,border:`1px solid ${col}40`,color:col,
              borderRadius:6,padding:"4px 11px",fontSize:10,cursor:"pointer",
              fontFamily:C.font,fontWeight:600,letterSpacing:"0.04em",transition:"all 0.2s",
            }}>{lbl}</motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEED ROW — Terminal style
═══════════════════════════════════════════════════════════════════════════ */
function FeedRow({item,i}){
  const pColor=pc(item.pri);
  return(
    <motion.div layout
      initial={{opacity:0,x:40,filter:"blur(4px)"}}
      animate={{opacity:1,x:0,filter:"blur(0px)"}}
      exit={{opacity:0,x:-40,filter:"blur(4px)"}}
      transition={{duration:0.4,ease:[0.22,1,0.36,1]}}
      style={{display:"flex",alignItems:"flex-start",gap:11,padding:"10px 14px",
        borderLeft:`2px solid ${pColor}`,
        background:`linear-gradient(90deg,${pColor}08,transparent)`,
        borderRadius:"0 10px 10px 0",marginBottom:8,position:"relative",overflow:"hidden"}}>
      {item.pri==="HIGH"&&(
        <motion.div animate={{opacity:[0,0.3,0,0.08,0]}} transition={{repeat:Infinity,duration:4,delay:i*0.7}}
          style={{position:"absolute",inset:0,background:pColor,pointerEvents:"none"}}/>
      )}
      <span style={{fontSize:15,lineHeight:1.4,flexShrink:0}}>{item.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{color:C.text,fontSize:12,lineHeight:1.5,fontFamily:C.font}}>{item.text}</div>
        <div style={{color:C.textDim,fontSize:10,marginTop:3,fontFamily:C.font}}>{item.t}</div>
      </div>
      <span style={{background:`${pColor}22`,color:pColor,border:`1px solid ${pColor}55`,
        borderRadius:4,padding:"1px 7px",fontSize:9,fontWeight:700,letterSpacing:"0.12em",
        flexShrink:0,fontFamily:C.font,
        boxShadow:item.pri==="HIGH"?`0 0 8px ${pColor}55`:"none"}}>
        {item.pri}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTELLIGENCE GRID — Heatmap
═══════════════════════════════════════════════════════════════════════════ */
function IntelGrid(){
  const[hov,setHov]=useState(null);
  const maxR=Math.max(...REGIONS.map(r=>r.r));
  return(
    <div style={{position:"relative",width:"100%",height:290,borderRadius:14,overflow:"hidden",
      background:"rgba(255,255,255,0.6)",border:`1px solid ${C.border}`}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.1}}>
        {Array.from({length:10},(_,i)=>(
          <line key={`v${i}`} x1={`${i*11}%`} y1="0" x2={`${i*11}%`} y2="100%"
            stroke={C.teal} strokeWidth="0.5"/>
        ))}
        {Array.from({length:8},(_,i)=>(
          <line key={`h${i}`} x1="0" y1={`${i*14}%`} x2="100%" y2={`${i*14}%`}
            stroke={C.teal} strokeWidth="0.5"/>
        ))}
      </svg>
      <div style={{position:"absolute",left:"38%",top:"48%",width:200,height:200,
        borderRadius:"50%",transform:"translate(-50%,-50%)",
        background:"radial-gradient(circle,rgba(0,212,184,0.06) 0%,transparent 70%)",
        pointerEvents:"none"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        {CONNECTIONS.map(([a,b],idx)=>{
          const ra=REGIONS[a],rb=REGIONS[b];
          if(!ra||!rb)return null;
          const active=hov?.name===ra.name||hov?.name===rb.name;
          return(
            <motion.line key={idx}
              x1={`${ra.x}%`} y1={`${ra.y}%`} x2={`${rb.x}%`} y2={`${rb.y}%`}
              stroke={C.teal} strokeWidth={active?1.4:0.6} strokeDasharray="4 6"
              animate={{opacity:active?0.7:[0.07,0.18,0.07]}}
              transition={{opacity:{repeat:Infinity,duration:3,delay:idx*0.2}}}/>
          );
        })}
      </svg>
      {REGIONS.map((r,i)=>{
        const size=9+(r.r/maxR)*22;
        const intensity=r.r/maxR;
        const col=intensity>0.7?C.teal:intensity>0.4?C.blue:C.green;
        const isH=hov?.name===r.name;
        return(
          <motion.div key={r.name}
            initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
            transition={{delay:i*0.06,type:"spring",stiffness:300}}
            onHoverStart={()=>setHov(r)} onHoverEnd={()=>setHov(null)}
            style={{position:"absolute",left:`${r.x}%`,top:`${r.y}%`,
              transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:isH?10:1}}>
            {[1,2].map(ring=>(
              <motion.div key={ring}
                animate={{scale:[1,2.2+ring*0.4,1],opacity:[0.5,0,0.5]}}
                transition={{repeat:Infinity,duration:2.5+ring*0.5,delay:i*0.15+ring*0.4}}
                style={{position:"absolute",inset:-(ring*6),borderRadius:"50%",
                  border:`1px solid ${col}`,pointerEvents:"none"}}/>
            ))}
            <motion.div animate={{boxShadow:isH?`0 0 20px ${col},0 0 40px ${col}66`:`0 0 6px ${col}88`}}
              style={{width:size,height:size,borderRadius:"50%",
                background:`radial-gradient(circle at 35% 35%,${col}dd,${col}66)`,
                border:`1.5px solid ${col}`}}/>
          </motion.div>
        );
      })}
      <div style={{position:"absolute",top:10,left:14,color:C.textDim,fontSize:9,
        letterSpacing:"0.14em",fontFamily:C.font}}>INTELLIGENCE GRID · INDIA · LIVE</div>
      <AnimatePresence>
        {hov&&(
          <motion.div initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}}
            exit={{opacity:0,scale:0.88}} transition={{duration:0.2}}
            style={{position:"absolute",bottom:14,right:14,
              ...mkGlass({borderRadius:12,padding:"14px 18px"}),
              border:`1px solid ${C.teal}55`,
              boxShadow:`0 0 0 1px ${C.teal}30,0 8px 32px rgba(0,0,0,0.7)`,minWidth:175}}>
            <div style={{color:C.teal,fontSize:12,fontWeight:700,marginBottom:9,fontFamily:C.font}}>
              ◆ {hov.name}
            </div>
            {[["Reports Gen.",hov.r,C.teal],["Avg Impact",hov.imp,C.blue],["Active NGOs",hov.n,C.green]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{color:C.textDim,fontSize:11,fontFamily:C.font}}>{k}</span>
                <span style={{color:c,fontSize:12,fontWeight:700,fontFamily:C.font}}>{v}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {hov&&(
        <div style={{position:"absolute",pointerEvents:"none",
          left:`${hov.x}%`,top:`${hov.y}%`,width:120,height:120,borderRadius:"50%",
          transform:"translate(-50%,-50%)",
          background:`radial-gradient(circle,${C.teal}18 0%,transparent 70%)`}}/>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOGGLE — Command Console
═══════════════════════════════════════════════════════════════════════════ */
function CmdToggle({label,value,onChange,color=C.teal}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"11px 0",borderBottom:`1px solid rgba(255,255,255,0.05)`}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <motion.div animate={{opacity:value?1:0.3}}
          style={{width:5,height:5,borderRadius:"50%",background:color,
            boxShadow:value?`0 0 6px ${color}`:undefined}}/>
        <span style={{color:C.textMid,fontSize:12,fontFamily:C.font}}>{label}</span>
      </div>
      <motion.div onClick={()=>onChange(!value)} whileTap={{scale:0.92}} style={{
        width:42,height:24,borderRadius:12,
        background:value?`linear-gradient(90deg,${color}60,${color}40)`:"rgba(255,255,255,0.06)",
        border:`1px solid ${value?color+"80":"rgba(255,255,255,0.12)"}`,
        position:"relative",cursor:"pointer",
        boxShadow:value?`0 0 12px ${color}44`:"none",transition:"all 0.3s ease",
      }}>
        <motion.div animate={{x:value?19:2}} transition={{type:"spring",stiffness:500,damping:30}}
          style={{position:"absolute",top:3,width:16,height:16,borderRadius:"50%",
            background:value?color:"rgba(255,255,255,0.35)",
            boxShadow:value?`0 0 8px ${color}`:"none"}}/>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER BUTTON
═══════════════════════════════════════════════════════════════════════════ */
function FB({val,cur,set}){
  const a=cur===val;
  return(
    <motion.button whileTap={{scale:0.93}} onClick={()=>set(val)} style={{
      background:a?`${C.teal}20`:"transparent",
      border:`1px solid ${a?C.teal+"70":"rgba(255,255,255,0.1)"}`,
      color:a?C.teal:C.textMid,borderRadius:6,padding:"5px 13px",fontSize:11,
      cursor:"pointer",fontFamily:C.font,fontWeight:a?700:400,
      boxShadow:a?`0 0 10px ${C.teal}30`:"none",transition:"all 0.2s",
    }}>{val}</motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════════════════════════ */
function SH({label,title,extra}){
  return(
    <div style={{marginBottom:16}}>
      <div style={{color:C.textDim,fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",
        fontFamily:C.font,marginBottom:4}}>
        <span style={{color:C.teal}}>◆</span> {label}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{color:C.text,fontSize:14,fontWeight:700,fontFamily:C.font}}>{title}</div>
        {extra}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function ReportsIntelligence(){
  const[dateRange,setDateRange]=useState("30d");
  const[region,setRegion]=useState("All");
  const[sector,setSector]=useState("All");
  const[autoRep,setAutoRep]=useState(true);
  const[weekly,setWeekly]=useState(true);
  const[alerts,setAlerts]=useState(false);
  const[sensitivity,setSens]=useState(72);
  const[generating,setGen]=useState(false);
  const[analysing,setAna]=useState(false);
  const[feed,setFeed]=useState(FEED_INIT);
  const clock=useClock();
  const poolIdx=useRef(0);

  useEffect(()=>{
    const id=setInterval(()=>{
      const item={...FEED_POOL[poolIdx.current%FEED_POOL.length],id:Date.now(),t:"just now"};
      poolIdx.current++;
      setFeed(prev=>[item,...prev.slice(0,6)]);
    },8000);
    return()=>clearInterval(id);
  },[]);

  const triggerGen=()=>{setGen(true);setTimeout(()=>setGen(false),2800);};
  const triggerAna=()=>{setAna(true);setTimeout(()=>setAna(false),3800);};

  return(
    <div style={{
      minHeight:"100vh",
      background: "#F8FAFC",
backgroundImage: `
  radial-gradient(circle at 20% 20%, rgba(20,184,166,0.08), transparent 40%),
  radial-gradient(circle at 80% 80%, rgba(59,130,246,0.08), transparent 40%),
  radial-gradient(ellipse 40% 30% at 50% 50%, rgba(16,232,144,0.02), transparent 70%)
`,
      fontFamily:C.font,color:C.text,position:"relative",
    }}>
      <style>{`
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(0,212,184,0.3);border-radius:2px}
        *{box-sizing:border-box}
      `}</style>

      {/* <CursorGlow/> */}
      <Particles/>
      {/* <Scanlines/> */}

      {/* gradient blobs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <motion.div animate={{scale:[1,1.15,1],opacity:[0.4,0.7,0.4]}} transition={{repeat:Infinity,duration:8}}
          style={{position:"absolute",top:"-10%",left:"-5%",width:500,height:500,borderRadius:"50%",
            background:`radial-gradient(circle,${C.teal}08,transparent 70%)`}}/>
        <motion.div animate={{scale:[1,1.2,1],opacity:[0.3,0.6,0.3]}} transition={{repeat:Infinity,duration:11,delay:3}}
          style={{position:"absolute",bottom:"-10%",right:"-5%",width:500,height:500,borderRadius:"50%",
            background:`radial-gradient(circle,${C.blue}08,transparent 70%)`}}/>
      </div>

      <div style={{position:"relative",zIndex:3,maxWidth:1440,margin:"0 auto",padding:"32px 28px"}}>

        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <motion.div initial={{opacity:0,y:-28}} animate={{opacity:1,y:0}}
          transition={{duration:0.7,ease:[0.22,1,0.36,1]}} style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
            flexWrap:"wrap",gap:16,marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:3,height:40,background:`linear-gradient(180deg,${C.teal},${C.blue})`,
                borderRadius:2,boxShadow:`0 0 12px ${C.teal}`}}/>
              <div>
                <motion.h1 animate={{opacity:[0.88,1,0.88]}} transition={{repeat:Infinity,duration:4}}
                  style={{fontSize:28,fontWeight:700,margin:0,letterSpacing:"-0.02em",
                    background:`linear-gradient(135deg,${C.text} 30%,${C.teal} 100%)`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Reports & Intelligence
                </motion.h1>
                <div style={{color:C.textDim,fontSize:12,marginTop:3,letterSpacing:"0.05em"}}>
                  AI-generated insights across all operations
                </div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,
                background:`${C.teal}12`,border:`1px solid ${C.teal}44`,borderRadius:20,padding:"5px 14px"}}>
                <motion.div animate={{scale:[1,1.6,1],opacity:[1,0.3,1]}} transition={{repeat:Infinity,duration:1.6}}
                  style={{width:8,height:8,borderRadius:"50%",background:C.teal,boxShadow:`0 0 8px ${C.teal}`}}/>
                <span style={{color:C.teal,fontSize:11,fontWeight:700,letterSpacing:"0.12em"}}>LIVE</span>
              </div>
              <div style={{color:C.textDim,fontSize:11}}>
                {clock.toLocaleTimeString("en-IN",{hour12:false})}
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:4}}>
              {["7d","30d","Custom"].map(v=><FB key={v} val={v} cur={dateRange} set={setDateRange}/>)}
            </div>
            <div style={{width:1,height:20,background:"rgba(255,255,255,0.1)"}}/>
            <div style={{display:"flex",gap:4}}>
              {["All","North","South","West","East"].map(v=><FB key={v} val={v} cur={region} set={setRegion}/>)}
            </div>
            <div style={{width:1,height:20,background:"rgba(255,255,255,0.1)"}}/>
            <div style={{display:"flex",gap:4}}>
              {["All","Health","Edu","Env","Tech"].map(v=><FB key={v} val={v} cur={sector} set={setSector}/>)}
            </div>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              {[["PDF",C.teal],["CSV",C.teal],["⤴ Share",C.blue]].map(([lbl,col])=>(
                <motion.button key={lbl} whileTap={{scale:0.93}} style={{
                  background:`${col}18`,border:`1px solid ${col}55`,color:col,
                  borderRadius:7,padding:"6px 14px",fontSize:11,cursor:"pointer",
                  fontFamily:C.font,fontWeight:600,
                }}>{lbl}</motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── KPI METRICS ─────────────────────────────────────────────── */}
        <div style={{display:"flex",gap:14,marginBottom:22,flexWrap:"wrap"}}>
          <MetricCard label="Total Reports Generated" value={2847} delta={14.2} color={C.teal}  sparkData={SP.reports} delay={0.08}/>
          <MetricCard label="Impact Score Trend"       value={82}   suffix="/100" delta={8.6}  color={C.blue}  sparkData={SP.impact}  delay={0.16}/>
          <MetricCard label="NGO Performance Index"    value={89}   suffix="%"   delta={5.1}  color={C.green} sparkData={SP.ngo}    delay={0.24}/>
          <MetricCard label="Volunteer Engagement"     value={74}   suffix="%"   delta={-3.2} color={C.amber} sparkData={SP.engage} delay={0.32}/>
        </div>

        {/* ── CHARTS ROW ──────────────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <Panel delay={0.28} glow={C.teal} style={{padding:22}}>
            <SH label="Growth Trends" title="Volunteer & Match Volume"/>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={areaData} margin={{left:-10,right:4}}>
                <defs>
                  {[[C.teal,"vol"],[C.blue,"mat"],[C.green,"ngo"]].map(([c,k])=>(
                    <linearGradient key={k} id={`ag-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity="0.4"/>
                      <stop offset="95%" stopColor={c} stopOpacity="0"/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
                <XAxis dataKey="m" tick={{fill:C.textDim,fontSize:10,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.textDim,fontSize:10,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                <Tooltip content={<NeonTooltip/>}/>
                <Area type="monotone" dataKey="vol" name="Volunteers" stroke={C.teal}  fill="url(#ag-vol)" strokeWidth={2}/>
                <Area type="monotone" dataKey="mat" name="Matches"    stroke={C.blue}  fill="url(#ag-mat)" strokeWidth={2}/>
                <Area type="monotone" dataKey="ngo" name="NGOs"       stroke={C.green} fill="url(#ag-ngo)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel delay={0.34} glow={C.blue} style={{padding:22}}>
            <SH label="Sector Breakdown" title="Performance by Sector"/>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={barData} barSize={18} margin={{left:-10,right:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
                <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.textDim,fontSize:10,fontFamily:C.font}} axisLine={false} tickLine={false}/>
                <Tooltip content={<NeonTooltip/>}/>
                <Bar dataKey="score" name="Score"      fill={C.teal} radius={[4,4,0,0]} fillOpacity={0.85}/>
                <Bar dataKey="vol"   name="Volunteers" fill={C.blue} radius={[4,4,0,0]} fillOpacity={0.7}/>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel delay={0.38} glow={C.green} style={{padding:22,marginBottom:16}}>
          <SH label="Engagement Over Time" title="Weekly Engagement & Retention Rates"/>
          <ResponsiveContainer width="100%" height={148}>
            <LineChart data={lineData} margin={{left:-10,right:4}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false}/>
              <XAxis dataKey="w" tick={{fill:C.textDim,fontSize:10,fontFamily:C.font}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.textDim,fontSize:10,fontFamily:C.font}} axisLine={false} tickLine={false} domain={[30,110]}/>
              <Tooltip content={<NeonTooltip/>}/>
              <Line type="monotone" dataKey="eng" name="Engagement" stroke={C.teal}  strokeWidth={2.5}
                dot={{r:3,fill:C.teal,strokeWidth:0}} activeDot={{r:5,fill:C.teal}}/>
              <Line type="monotone" dataKey="ret" name="Retention"  stroke={C.amber} strokeWidth={2}
                strokeDasharray="5 3" dot={{r:3,fill:C.amber,strokeWidth:0}}/>
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        {/* ── INTEL BLOCKS + LIVE FEED ─────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"1.45fr 1fr",gap:16,marginBottom:16}}>

          <Panel delay={0.42} glow={C.teal} style={{padding:22}}>
            <SH label="AI Generated" title="Intelligence Blocks"
              extra={
                <div style={{display:"flex",alignItems:"center",gap:7,
                  background:`${C.teal}12`,border:`1px solid ${C.teal}44`,borderRadius:6,padding:"3px 10px"}}>
                  <span style={{color:C.teal,fontSize:10,fontFamily:C.font}}>{CARDS.length} REPORTS</span>
                </div>
              }/>
            <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:540,overflowY:"auto",paddingRight:4}}>
              {CARDS.map((c,i)=><IntelBlock key={c.id} card={c} delay={i*0.07}/>)}
            </div>
          </Panel>

          <Panel delay={0.46} glow={C.red} style={{padding:22}}>
            <SH label="Mission Feed · Terminal" title="Live AI Insights"
              extra={
                <div style={{display:"flex",alignItems:"center",gap:7,
                  background:`${C.red}12`,border:`1px solid ${C.red}44`,borderRadius:20,padding:"3px 10px"}}>
                  <motion.div animate={{scale:[1,1.7,1],opacity:[1,0.2,1]}} transition={{repeat:Infinity,duration:1.3}}
                    style={{width:7,height:7,borderRadius:"50%",background:C.red,boxShadow:`0 0 8px ${C.red}`}}/>
                  <span style={{color:C.red,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:C.font}}>LIVE</span>
                </div>
              }/>
            <div style={{display:"flex",gap:5,marginBottom:12}}>
              {[C.red,C.amber,C.green].map(col=>(
                <div key={col} style={{width:8,height:8,borderRadius:"50%",background:col,opacity:0.7}}/>
              ))}
              <span style={{color:C.textDim,fontSize:9,marginLeft:8,fontFamily:C.font}}>mission_feed.log — streaming</span>
            </div>
            <div style={{maxHeight:480,overflowY:"auto",paddingRight:4}}>
              <AnimatePresence mode="popLayout">
                {feed.map((item,i)=><FeedRow key={item.id} item={item} i={i}/>)}
              </AnimatePresence>
            </div>
          </Panel>
        </div>

        {/* ── HEATMAP + CONSOLE ────────────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"1.45fr 1fr",gap:16,marginBottom:20}}>

          <Panel delay={0.5} glow={C.teal} style={{padding:22}}>
            <SH label="Regional Intelligence" title="Intelligence Grid · India"/>
            <IntelGrid/>
            <div style={{display:"flex",gap:18,marginTop:12}}>
              {[["High Activity",C.teal],["Mid Activity",C.blue],["Emerging",C.green]].map(([lbl,c])=>(
                <div key={lbl} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c,boxShadow:`0 0 4px ${c}`}}/>
                  <span style={{color:C.textDim,fontSize:10,fontFamily:C.font}}>{lbl}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel delay={0.54} glow={C.blue} style={{padding:22}}>
            <SH label="Command Console" title="Report Controls"/>
            <CmdToggle label="Auto-report Generation" value={autoRep} onChange={setAutoRep} color={C.teal}/>
            <CmdToggle label="Weekly Summaries"        value={weekly}  onChange={setWeekly}  color={C.blue}/>
            <CmdToggle label="AI Alerts"               value={alerts}  onChange={setAlerts}  color={C.amber}/>

            <div style={{marginTop:20,marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:C.textMid,fontSize:12,fontFamily:C.font}}>Insight Depth Sensitivity</span>
                <span style={{color:C.teal,fontSize:13,fontWeight:700,fontFamily:C.font,textShadow:`0 0 8px ${C.teal}`}}>
                  {sensitivity}%
                </span>
              </div>
              <div style={{position:"relative",height:6,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${sensitivity}%`,
                  background:`linear-gradient(90deg,${C.blue},${C.teal})`,
                  boxShadow:`0 0 10px ${C.teal}`,borderRadius:3,transition:"width 0.15s ease"}}/>
              </div>
              <input type="range" min="10" max="100" value={sensitivity}
                onChange={e=>setSens(+e.target.value)}
                style={{width:"100%",marginTop:-6,opacity:0,cursor:"pointer",height:20}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
                <span style={{color:C.textDim,fontSize:9,fontFamily:C.font}}>Surface</span>
                <span style={{color:C.textDim,fontSize:9,fontFamily:C.font}}>Deep Analysis</span>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:18}}>
              <motion.button whileTap={{scale:0.96}} onClick={triggerGen} style={{
                background:generating?`${C.teal}20`:`linear-gradient(135deg,${C.teal}30 0%,${C.blue}20 100%)`,
                border:`1px solid ${C.teal}70`,color:C.teal,
                borderRadius:10,padding:"13px 0",fontSize:12,fontWeight:700,
                cursor:"pointer",fontFamily:C.font,letterSpacing:"0.06em",
                boxShadow:generating?`0 0 20px ${C.teal}40`:`0 0 10px ${C.teal}20`,transition:"all 0.3s",
              }}>
                {generating
                  ?<motion.span animate={{opacity:[1,0.4,1]}} transition={{repeat:Infinity,duration:0.7}}>◌ GENERATING REPORT...</motion.span>
                  :"⚡ GENERATE FULL REPORT"}
              </motion.button>
              <motion.button whileTap={{scale:0.96}} onClick={triggerAna} style={{
                background:analysing?`${C.blue}20`:"rgba(59,142,246,0.12)",
                border:`1px solid ${C.blue}60`,color:C.blue,
                borderRadius:10,padding:"13px 0",fontSize:12,fontWeight:700,
                cursor:"pointer",fontFamily:C.font,letterSpacing:"0.06em",
                boxShadow:analysing?`0 0 20px ${C.blue}40`:"none",transition:"all 0.3s",
              }}>
                {analysing
                  ?<motion.span animate={{opacity:[1,0.4,1]}} transition={{repeat:Infinity,duration:0.7}}>🧠 DEEP ANALYSIS RUNNING...</motion.span>
                  :"🔬 RUN DEEP ANALYSIS"}
              </motion.button>
            </div>

            <div style={{marginTop:18,padding:"14px 16px",
              background:"rgba(0,212,184,0.04)",borderRadius:10,border:`1px solid ${C.teal}22`}}>
              <div style={{color:C.teal,fontSize:10,fontWeight:700,marginBottom:10,letterSpacing:"0.1em",fontFamily:C.font}}>
                ⚙ SYSTEM STATUS
              </div>
              {[
                ["AI Engine","Operational",C.green,true],
                ["Data Pipeline","Syncing",C.amber,true],
                ["Report Queue","4 pending",C.teal,false],
                ["Model Version","v4.2.1",C.blue,false],
              ].map(([k,v,col,pulse])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <span style={{color:C.textDim,fontSize:11,fontFamily:C.font}}>{k}</span>
                  <span style={{display:"flex",alignItems:"center",gap:5,color:col,fontSize:11,fontWeight:700,fontFamily:C.font}}>
                    {pulse&&(
                      <motion.span animate={{opacity:[1,0.3,1]}} transition={{repeat:Infinity,duration:1.8}}
                        style={{display:"inline-block",width:5,height:5,borderRadius:"50%",
                          background:col,boxShadow:`0 0 5px ${col}`}}/>
                    )}
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
          style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            color:C.textDim,fontSize:10,padding:"14px 0",
            borderTop:`1px solid rgba(255,255,255,0.05)`,
            letterSpacing:"0.06em",fontFamily:C.font}}>
          <span>AI COMMAND CENTER · REPORTS MODULE v4.0.0</span>
          <span>LAST SYNC: {clock.toLocaleTimeString("en-IN",{hour12:false})}</span>
          <span style={{display:"flex",alignItems:"center",gap:7}}>
            <motion.div animate={{opacity:[1,0.2,1]}} transition={{repeat:Infinity,duration:2.5}}
              style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
            ALL SYSTEMS NOMINAL
          </span>
        </motion.div>

      </div>
    </div>
  );
}
