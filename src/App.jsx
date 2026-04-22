import { useState, useEffect, useCallback, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════
   CLUTCH — Know what you can drive.
   Car Affordability Calculator for Indian Salaried Professionals
   ═══════════════════════════════════════════════════════════════ */

/* ─── THEME CONTEXT ─────────────────────────────────────────── */
const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);

const LIGHT = {
  bg: "#F6F5F0", surface: "#FFFFFF", card: "#FFFFFF", cardHover: "#FAFAF8",
  border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
  accent: "#D4870E", accentBg: "rgba(212,135,14,0.08)", accentGlow: "rgba(212,135,14,0.18)",
  text: "#1A1A18", textSec: "#6B6B66", textMuted: "#A3A39E",
  green: "#16A34A", greenBg: "rgba(22,163,74,0.08)",
  yellow: "#CA8A04", yellowBg: "rgba(202,138,4,0.08)",
  red: "#DC2626", redBg: "rgba(220,38,38,0.06)",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  shadowLg: "0 4px 24px rgba(0,0,0,0.08)",
  carBg: "#F0EFE8", inputBg: "#F6F5F0", toggleBg: "#E8E7E0",
};
const DARK = {
  bg: "#0B0B0A", surface: "#141413", card: "#1A1A18", cardHover: "#222220",
  border: "rgba(255,255,255,0.07)", borderStrong: "rgba(255,255,255,0.12)",
  accent: "#E8A020", accentBg: "rgba(232,160,32,0.12)", accentGlow: "rgba(232,160,32,0.25)",
  text: "#F0F0EC", textSec: "#8A8A84", textMuted: "#555550",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.10)",
  yellow: "#EAB308", yellowBg: "rgba(234,179,8,0.10)",
  red: "#EF4444", redBg: "rgba(239,68,68,0.08)",
  shadow: "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
  shadowLg: "0 4px 24px rgba(0,0,0,0.4)",
  carBg: "#111110", inputBg: "#111110", toggleBg: "#2A2A28",
};

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const GlobalCSS = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Karla:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{background:${dark?DARK.bg:LIGHT.bg};transition:background 0.35s;}
    :root{
      --outfit:'Outfit',sans-serif;
      --karla:'Karla',sans-serif;
      --mono:'JetBrains Mono',monospace;
    }
    input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:99px;outline:none;cursor:pointer;transition:background 0.2s;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:${dark?DARK.accent:LIGHT.accent};cursor:pointer;box-shadow:0 0 0 4px ${dark?DARK.accentGlow:LIGHT.accentGlow};border:3px solid ${dark?'#0B0B0A':'#FFFFFF'};}
    input[type=number]{-moz-appearance:textfield;}
    input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{-webkit-appearance:none;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
    .fu{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}
    .fu1{animation-delay:.05s}.fu2{animation-delay:.1s}.fu3{animation-delay:.15s}
    .fu4{animation-delay:.2s}.fu5{animation-delay:.25s}.fu6{animation-delay:.3s}
    .su{animation:slideUp .45s cubic-bezier(.22,1,.36,1) both}
    *::-webkit-scrollbar{display:none}
  `}</style>
);

/* ─── CAR DATA WITH VARIANTS ────────────────────────────────── */
const CARS = [
  { id:1, name:"Maruti Alto K10", brand:"Maruti", segment:"Hatchback", fuel:"Petrol",
    variants:[{n:"Std",p:399000},{n:"VXi",p:449000},{n:"VXi+",p:499000},{n:"VXi AGS",p:534000}], hue:"#E53935" },
  { id:2, name:"Tata Tiago", brand:"Tata", segment:"Hatchback", fuel:"Petrol/CNG",
    variants:[{n:"XE",p:560000},{n:"XM",p:620000},{n:"XT",p:690000},{n:"XZ+",p:770000}], hue:"#1E88E5" },
  { id:3, name:"Maruti WagonR", brand:"Maruti", segment:"Hatchback", fuel:"Petrol/CNG",
    variants:[{n:"LXi",p:554000},{n:"VXi",p:609000},{n:"ZXi",p:660000},{n:"ZXi AGS",p:699000}], hue:"#E53935" },
  { id:4, name:"Tata Punch", brand:"Tata", segment:"Hatchback", fuel:"Petrol",
    variants:[{n:"Pure",p:606000},{n:"Adventure",p:715000},{n:"Accomplished",p:810000},{n:"Creative",p:960000}], hue:"#1E88E5" },
  { id:5, name:"Maruti Swift", brand:"Maruti", segment:"Hatchback", fuel:"Petrol",
    variants:[{n:"LXi",p:649000},{n:"VXi",p:729000},{n:"ZXi",p:849000},{n:"ZXi+",p:949000}], hue:"#E53935" },
  { id:6, name:"Hyundai Grand i10 Nios", brand:"Hyundai", segment:"Hatchback", fuel:"Petrol/CNG",
    variants:[{n:"Era",p:572000},{n:"Magna",p:640000},{n:"Sportz",p:730000},{n:"Asta",p:810000}], hue:"#0D47A1" },
  { id:7, name:"Maruti Baleno", brand:"Maruti", segment:"Hatchback", fuel:"Petrol",
    variants:[{n:"Sigma",p:672000},{n:"Delta",p:765000},{n:"Zeta",p:855000},{n:"Alpha",p:965000}], hue:"#E53935" },
  { id:8, name:"Hyundai i20", brand:"Hyundai", segment:"Hatchback", fuel:"Petrol",
    variants:[{n:"Magna",p:704000},{n:"Sportz",p:836000},{n:"Asta",p:999000},{n:"Asta(O)",p:1121000}], hue:"#0D47A1" },

  { id:9, name:"Maruti Dzire", brand:"Maruti", segment:"Sedan", fuel:"Petrol/CNG",
    variants:[{n:"LXi",p:679000},{n:"VXi",p:779000},{n:"ZXi",p:879000},{n:"ZXi+",p:999000}], hue:"#E53935" },
  { id:10, name:"Hyundai Aura", brand:"Hyundai", segment:"Sedan", fuel:"Petrol/CNG",
    variants:[{n:"E",p:630000},{n:"S",p:729000},{n:"SX",p:829000},{n:"SX+",p:899000}], hue:"#0D47A1" },
  { id:11, name:"Honda Amaze", brand:"Honda", segment:"Sedan", fuel:"Petrol",
    variants:[{n:"E",p:799000},{n:"S",p:879000},{n:"VX",p:959000},{n:"ZX",p:1009000}], hue:"#CC0000" },
  { id:12, name:"Maruti Ciaz", brand:"Maruti", segment:"Sedan", fuel:"Petrol",
    variants:[{n:"Sigma",p:941000},{n:"Delta",p:1010000},{n:"Zeta",p:1075000},{n:"Alpha",p:1140000}], hue:"#E53935" },
  { id:13, name:"Honda City", brand:"Honda", segment:"Sedan", fuel:"Petrol",
    variants:[{n:"V",p:1189000},{n:"VX",p:1309000},{n:"ZX",p:1459000},{n:"ZX CVT",p:1529000}], hue:"#CC0000" },

  { id:14, name:"Nissan Magnite", brand:"Nissan", segment:"Compact SUV", fuel:"Petrol",
    variants:[{n:"XE",p:600000},{n:"XL",p:720000},{n:"XV",p:840000},{n:"XV Premium",p:960000}], hue:"#C62828" },
  { id:15, name:"Renault Kiger", brand:"Renault", segment:"Compact SUV", fuel:"Petrol",
    variants:[{n:"RXE",p:600000},{n:"RXL",p:710000},{n:"RXT",p:830000},{n:"RXZ",p:940000}], hue:"#FFB300" },
  { id:16, name:"Hyundai Venue", brand:"Hyundai", segment:"Compact SUV", fuel:"Petrol",
    variants:[{n:"E",p:794000},{n:"S",p:889000},{n:"S+",p:999000},{n:"SX(O)",p:1189000}], hue:"#0D47A1" },
  { id:17, name:"Tata Nexon", brand:"Tata", segment:"Compact SUV", fuel:"Petrol/EV",
    variants:[{n:"Smart",p:810000},{n:"Pure",p:935000},{n:"Creative",p:1100000},{n:"Fearless+",p:1310000}], hue:"#1E88E5" },
  { id:18, name:"Kia Sonet", brand:"Kia", segment:"Compact SUV", fuel:"Petrol/Diesel",
    variants:[{n:"HTE",p:799000},{n:"HTK",p:889000},{n:"HTK+",p:1059000},{n:"HTX+",p:1249000}], hue:"#FC5A03" },
  { id:19, name:"Maruti Brezza", brand:"Maruti", segment:"Compact SUV", fuel:"Petrol/CNG",
    variants:[{n:"LXi",p:834000},{n:"VXi",p:935000},{n:"ZXi",p:1089000},{n:"ZXi+",p:1199000}], hue:"#E53935" },
  { id:20, name:"Maruti Grand Vitara", brand:"Maruti", segment:"Compact SUV", fuel:"Hybrid",
    variants:[{n:"Sigma",p:1070000},{n:"Delta",p:1150000},{n:"Zeta",p:1320000},{n:"Alpha",p:1510000}], hue:"#E53935" },
  { id:21, name:"Toyota Hyryder", brand:"Toyota", segment:"Compact SUV", fuel:"Hybrid",
    variants:[{n:"E",p:1073000},{n:"G",p:1189000},{n:"S",p:1349000},{n:"V",p:1510000}], hue:"#333" },

  { id:22, name:"Hyundai Creta", brand:"Hyundai", segment:"SUV", fuel:"Petrol/Diesel",
    variants:[{n:"E",p:1100000},{n:"EX",p:1230000},{n:"S",p:1399000},{n:"SX(O)",p:1699000}], hue:"#0D47A1" },
  { id:23, name:"Kia Seltos", brand:"Kia", segment:"SUV", fuel:"Petrol/Diesel",
    variants:[{n:"HTE",p:1090000},{n:"HTK+",p:1279000},{n:"HTX+",p:1459000},{n:"X-Line",p:1699000}], hue:"#FC5A03" },
  { id:24, name:"Mahindra Scorpio N", brand:"Mahindra", segment:"SUV", fuel:"Petrol/Diesel",
    variants:[{n:"Z4",p:1360000},{n:"Z6",p:1489000},{n:"Z8",p:1619000},{n:"Z8 L",p:1879000}], hue:"#D32F2F" },
  { id:25, name:"Mahindra XUV700", brand:"Mahindra", segment:"SUV", fuel:"Petrol/Diesel",
    variants:[{n:"MX",p:1399000},{n:"AX3",p:1549000},{n:"AX5",p:1729000},{n:"AX7 L",p:1999000}], hue:"#D32F2F" },
  { id:26, name:"MG Hector", brand:"MG", segment:"SUV", fuel:"Petrol/Hybrid",
    variants:[{n:"Style",p:1399000},{n:"Super",p:1599000},{n:"Smart",p:1789000},{n:"Savvy",p:1999000}], hue:"#B71C1C" },
  { id:27, name:"Tata Harrier", brand:"Tata", segment:"SUV", fuel:"Diesel",
    variants:[{n:"Smart",p:1499000},{n:"Pure+",p:1669000},{n:"Adventure+",p:1879000},{n:"Fearless+",p:2089000}], hue:"#1E88E5" },
  { id:28, name:"Tata Safari", brand:"Tata", segment:"SUV", fuel:"Diesel",
    variants:[{n:"Smart",p:1600000},{n:"Pure+",p:1789000},{n:"Adventure+",p:1989000},{n:"Accomplished+",p:2299000}], hue:"#1E88E5" },
];

/* ─── SVG CAR SILHOUETTES ───────────────────────────────────── */
const CarSVG = ({ segment, color, size = 100 }) => {
  const paths = {
    Hatchback: (
      <>
        <path d="M18,34 L18,27 C18,25 19,24 20,23 L30,19 C33,15 38,12 48,12 L68,12 C74,12 78,14 80,18 L88,23 C89,24 90,25 90,27 L90,34" fill={color+"20"} stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <line x1="52" y1="12" x2="52" y2="23" stroke={color+"60"} strokeWidth="1.5"/>
        <line x1="18" y1="34" x2="90" y2="34" stroke={color} strokeWidth="2"/>
        <circle cx="32" cy="36" r="7" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="32" cy="36" r="3" fill={color+"30"}/>
        <circle cx="76" cy="36" r="7" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="76" cy="36" r="3" fill={color+"30"}/>
      </>
    ),
    Sedan: (
      <>
        <path d="M12,34 L12,27 C12,25 13,24 14,23 L28,20 C31,14 37,10 47,10 L62,10 C70,10 76,13 78,17 L90,22 C93,23 96,25 96,28 L96,34" fill={color+"20"} stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <line x1="48" y1="10" x2="46" y2="22" stroke={color+"60"} strokeWidth="1.5"/>
        <line x1="72" y1="13" x2="74" y2="22" stroke={color+"60"} strokeWidth="1.5"/>
        <line x1="12" y1="34" x2="96" y2="34" stroke={color} strokeWidth="2"/>
        <circle cx="30" cy="36" r="7" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="30" cy="36" r="3" fill={color+"30"}/>
        <circle cx="80" cy="36" r="7" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="80" cy="36" r="3" fill={color+"30"}/>
      </>
    ),
    "Compact SUV": (
      <>
        <path d="M14,32 L14,24 C14,22 15,21 16,20 L28,17 C31,11 37,8 48,8 L66,8 C73,8 78,11 80,14 L90,19 C92,20 94,22 94,24 L94,32" fill={color+"20"} stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <line x1="50" y1="8" x2="49" y2="19" stroke={color+"60"} strokeWidth="1.5"/>
        <line x1="14" y1="32" x2="94" y2="32" stroke={color} strokeWidth="2"/>
        <rect x="16" y="23" width="3" height="5" rx="1" fill={color+"50"}/>
        <circle cx="30" cy="35" r="8" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="30" cy="35" r="3.5" fill={color+"30"}/>
        <circle cx="78" cy="35" r="8" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="78" cy="35" r="3.5" fill={color+"30"}/>
      </>
    ),
    SUV: (
      <>
        <path d="M10,30 L10,22 C10,22 11,19 12,18 L24,15 C27,9 34,5 46,5 L64,5 C72,5 78,8 81,12 L92,17 C94,18 96,20 96,22 L96,30" fill={color+"20"} stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <line x1="48" y1="5" x2="47" y2="17" stroke={color+"60"} strokeWidth="1.5"/>
        <line x1="70" y1="7" x2="71" y2="17" stroke={color+"60"} strokeWidth="1.5"/>
        <line x1="10" y1="30" x2="96" y2="30" stroke={color} strokeWidth="2"/>
        <rect x="12" y="21" width="4" height="5" rx="1" fill={color+"50"}/>
        <rect x="90" y="21" width="4" height="5" rx="1" fill={color+"50"}/>
        <circle cx="28" cy="33" r="8.5" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="28" cy="33" r="4" fill={color+"30"}/>
        <circle cx="78" cy="33" r="8.5" fill="none" stroke={color} strokeWidth="2.5"/>
        <circle cx="78" cy="33" r="4" fill={color+"30"}/>
      </>
    ),
  };
  return (
    <svg viewBox="0 0 108 46" width={size} height={size * 0.43} style={{ display: "block" }}>
      {paths[segment] || paths.Hatchback}
    </svg>
  );
};

/* ─── LOGO ──────────────────────────────────────────────────── */
const ClutchLogo = ({ t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width="32" height="32" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="none" stroke={t.accent} strokeWidth="3"/>
      <circle cx="20" cy="20" r="10" fill="none" stroke={t.accent} strokeWidth="2" strokeDasharray="4 3"/>
      <circle cx="20" cy="20" r="4" fill={t.accent}/>
    </svg>
    <span style={{ fontFamily: "var(--outfit)", fontSize: 20, fontWeight: 900, color: t.text, letterSpacing: "-0.03em" }}>
      clutch<span style={{ color: t.accent }}>.</span>
    </span>
  </div>
);

/* ─── UTILS ─────────────────────────────────────────────────── */
const fmt = (n) => {
  if (!n || n <= 0) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000)     return `₹${Math.round(n/1000)}K`;
  return `₹${n}`;
};
const fmtFull = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const calcEMI = (p, r, m) => {
  if (p <= 0 || m <= 0) return 0;
  const mr = r / 12 / 100;
  return Math.round((p * mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1));
};
const calcBudget = (sal, dp, ex) => {
  const maxE = Math.max(0, sal * 0.40 - ex);
  const comfE = Math.max(0, sal * 0.30 - ex);
  const r = 9 / 12 / 100, n = 60;
  const f = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  return { maxBudget: Math.round(maxE * f + dp), comfortBudget: Math.round(comfE * f + dp), maxEMI: maxE, comfEMI: comfE };
};
const zone = (price, b) => {
  if (price <= b.comfortBudget) return { l: "Good Fit", c: "green" };
  if (price <= b.maxBudget)     return { l: "Stretch", c: "yellow" };
  return                               { l: "Above Budget", c: "red" };
};

/* ─── SHARED UI ─────────────────────────────────────────────── */
const Pill = ({ children, active, onClick, t, color }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: 99, cursor: "pointer",
    fontFamily: "var(--karla)", fontSize: 12, fontWeight: active ? 700 : 500,
    background: active ? (color || t.accent) : t.surface,
    color: active ? "#fff" : t.textSec,
    border: active ? "none" : `1px solid ${t.border}`,
    transition: "all 0.2s", whiteSpace: "nowrap",
  }}>{children}</button>
);

const StatBox = ({ label, value, color, t }) => (
  <div style={{ flex: 1, textAlign: "center", padding: "10px 6px" }}>
    <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.textMuted, letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: "var(--outfit)", fontSize: 14, fontWeight: 700, color: color || t.text }}>{value}</div>
  </div>
);

const ThemeToggle = ({ dark, setDark, t }) => (
  <button onClick={() => setDark(!dark)} style={{
    width: 44, height: 26, borderRadius: 99, border: `1px solid ${t.border}`,
    background: t.toggleBg, cursor: "pointer", position: "relative", padding: 0,
    transition: "background 0.3s",
  }}>
    <div style={{
      width: 20, height: 20, borderRadius: 99, background: t.accent,
      position: "absolute", top: 2, left: dark ? 21 : 3,
      transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10,
    }}>{dark ? "🌙" : "☀️"}</div>
  </button>
);

/* ─── INPUT SCREEN ──────────────────────────────────────────── */
const InputScreen = ({ salary, setSalary, dp, setDp, exEMI, setExEMI, onGo, t }) => {
  const b = calcBudget(salary, dp, exEMI);
  const sliderBg = (val, min, max) =>
    `linear-gradient(to right, ${t.accent} ${((val-min)/(max-min))*100}%, ${t.inputBg} 0%)`;

  return (
    <div style={{ padding: "0 20px 40px" }}>
      {/* Hero */}
      <div className="fu" style={{ textAlign: "center", padding: "32px 0 24px" }}>
        <h1 style={{
          fontFamily: "var(--outfit)", fontSize: 30, fontWeight: 900,
          lineHeight: 1.15, color: t.text, letterSpacing: "-0.03em", marginBottom: 8,
        }}>
          Know what you<br />can <span style={{ color: t.accent }}>drive</span>.
        </h1>
        <p style={{ fontSize: 14, color: t.textSec, fontFamily: "var(--karla)", lineHeight: 1.6 }}>
          Your salary → Your budget → Your car.
        </p>
      </div>

      {/* Budget preview */}
      {b.maxBudget > 0 && (
        <div className="fu fu1" style={{
          background: t.accentBg, border: `1.5px solid ${t.accentGlow}`,
          borderRadius: 18, padding: "18px 20px", marginBottom: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.accent, letterSpacing: "0.06em", marginBottom: 4 }}>YOUR MAX BUDGET</div>
            <div style={{ fontFamily: "var(--outfit)", fontSize: 30, fontWeight: 900, color: t.accent }}>{fmt(b.maxBudget)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.green, letterSpacing: "0.06em", marginBottom: 4 }}>COMFORT ZONE</div>
            <div style={{ fontFamily: "var(--outfit)", fontSize: 20, fontWeight: 800, color: t.green }}>{fmt(b.comfortBudget)}</div>
          </div>
        </div>
      )}

      {/* Sliders card */}
      <div className="fu fu2" style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 22, padding: "24px 20px", boxShadow: t.shadow,
      }}>
        {/* Salary */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 600, color: t.text }}>Monthly In-Hand Salary</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: t.accent }}>{fmtFull(salary)}</span>
          </div>
          <input type="range" min={15000} max={500000} step={1000} value={salary}
            onChange={e => setSalary(+e.target.value)}
            style={{ background: sliderBg(salary, 15000, 500000) }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "var(--mono)" }}>₹15K</span>
            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "var(--mono)" }}>₹5L</span>
          </div>
        </div>

        <div style={{ height: 1, background: t.border, margin: "0 0 24px" }} />

        {/* Down payment */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 600, color: t.text }}>Down Payment Saved</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: t.accent }}>{fmt(dp)}</span>
          </div>
          <input type="range" min={0} max={2000000} step={10000} value={dp}
            onChange={e => setDp(+e.target.value)}
            style={{ background: sliderBg(dp, 0, 2000000) }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "var(--mono)" }}>₹0</span>
            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "var(--mono)" }}>₹20L</span>
          </div>
        </div>

        <div style={{ height: 1, background: t.border, margin: "0 0 24px" }} />

        {/* Existing EMI */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 600, color: t.text }}>Existing Monthly EMIs</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: exEMI > 0 ? t.red : t.textMuted }}>
              {exEMI > 0 ? fmtFull(exEMI) : "None"}
            </span>
          </div>
          <input type="range" min={0} max={100000} step={500} value={exEMI}
            onChange={e => setExEMI(+e.target.value)}
            style={{ background: sliderBg(exEMI, 0, 100000) }} />
        </div>

        {/* Capacity row */}
        <div style={{ display: "flex", gap: 1, background: t.border, borderRadius: 14, overflow: "hidden", marginTop: 20 }}>
          <StatBox label="SAFE EMI" value={fmtFull(b.comfEMI)} color={t.green} t={t} />
          <StatBox label="MAX EMI" value={fmtFull(b.maxEMI)} color={t.yellow} t={t} />
          <StatBox label="EMI CAP" value="40%" color={t.textSec} t={t} />
        </div>
      </div>

      {/* CTA */}
      <div className="fu fu3" style={{ marginTop: 24 }}>
        <button onClick={onGo} style={{
          width: "100%", padding: "18px 0", borderRadius: 16, border: "none",
          background: t.accent, color: "#fff", cursor: "pointer",
          fontFamily: "var(--outfit)", fontSize: 16, fontWeight: 800,
          letterSpacing: "-0.01em", boxShadow: `0 4px 20px ${t.accentGlow}`,
          transition: "transform 0.12s",
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Show My Cars →
        </button>
      </div>

      <p className="fu fu4" style={{ textAlign: "center", fontSize: 11, color: t.textMuted, marginTop: 14, fontFamily: "var(--karla)" }}>
        Based on 9% p.a., 60-month tenure · Ex-showroom prices
      </p>
    </div>
  );
};

/* ─── VARIANT BOTTOM SHEET ───────────────────────────────────── */
const VariantSheet = ({ open, car, current, onSelect, onClose, t }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "flex-end", justifyContent: "center",
    }}>
      <div className="su" onClick={e => e.stopPropagation()} style={{
        background: t.surface, borderRadius: "22px 22px 0 0",
        width: "100%", maxWidth: 430, padding: "20px 20px 32px",
      }}>
        {/* Handle bar */}
        <div style={{ width: 36, height: 4, borderRadius: 99, background: t.border, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--outfit)", fontSize: 16, fontWeight: 800, color: t.text }}>
            Select Variant
          </span>
          <span style={{ fontFamily: "var(--karla)", fontSize: 12, color: t.textSec }}>
            {car.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {car.variants.map((vr, i) => {
            const isActive = i === current;
            return (
              <button key={i} onClick={() => { onSelect(i); onClose(); }} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                background: isActive ? t.accentBg : t.card,
                border: `1.5px solid ${isActive ? t.accent + "50" : t.border}`,
                transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 99,
                    border: `2px solid ${isActive ? t.accent : t.border}`,
                    background: isActive ? t.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isActive && <div style={{ width: 6, height: 6, borderRadius: 99, background: "#fff" }} />}
                  </div>
                  <span style={{
                    fontFamily: "var(--outfit)", fontSize: 14, fontWeight: isActive ? 700 : 500,
                    color: isActive ? t.accent : t.text,
                  }}>{vr.n}</span>
                </div>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600,
                  color: isActive ? t.accent : t.textSec,
                }}>{fmt(vr.p)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── VARIANT DROPDOWN TRIGGER ──────────────────────────────── */
const VariantTrigger = ({ car, vi, onOpen, t }) => (
  <button onClick={onOpen} style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
    background: t.accentBg, border: `1px solid ${t.accent}30`,
    transition: "all 0.2s",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.textMuted, letterSpacing: "0.06em" }}>VARIANT</span>
      <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 700, color: t.accent }}>
        {car.variants[vi].n}
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: t.text }}>
        {fmt(car.variants[vi].p)}
      </span>
      <span style={{ fontSize: 10, color: t.textMuted, transition: "transform 0.2s" }}>▼</span>
    </div>
  </button>
);

/* ─── CAR CARD ──────────────────────────────────────────────── */
const CarCard = ({ car, budget, dp, salary, t, onSelect, onCompare, isCompared }) => {
  const [vi, setVi] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const v = car.variants[vi];
  const z = zone(v.p, budget);
  const zc = t[z.c];
  const zbg = t[z.c + "Bg"];
  const emi60 = calcEMI(Math.max(0, v.p - dp), 9, 60);

  return (
    <div className="fu" style={{
      background: t.card, border: `1px solid ${t.border}`,
      borderRadius: 20, overflow: "hidden", marginBottom: 14,
      boxShadow: t.shadow, transition: "all 0.2s",
    }}>
      {/* Car visual header */}
      <div style={{
        background: t.carBg, padding: "16px 20px 12px", position: "relative",
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                fontSize: 9, fontFamily: "var(--mono)", fontWeight: 600,
                color: car.hue, background: car.hue + "15",
                padding: "2px 8px", borderRadius: 4, letterSpacing: "0.06em",
              }}>{car.brand.toUpperCase()}</div>
              <span style={{
                fontSize: 9, fontFamily: "var(--mono)", color: zc, background: zbg,
                padding: "2px 8px", borderRadius: 4, fontWeight: 600,
              }}>{z.l.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: "var(--outfit)", fontSize: 17, fontWeight: 800, color: t.text, marginBottom: 4 }}>
              {car.name}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontFamily: "var(--karla)", color: t.textSec }}>{car.segment}</span>
              <span style={{ color: t.textMuted }}>·</span>
              <span style={{ fontSize: 11, fontFamily: "var(--karla)", color: car.fuel.includes("EV") ? t.green : t.textSec }}>{car.fuel}</span>
            </div>
          </div>
          <CarSVG segment={car.segment} color={car.hue} size={100} />
        </div>
      </div>

      {/* Variant selector */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}` }}>
        <VariantTrigger car={car} vi={vi} onOpen={() => setSheetOpen(true)} t={t} />
      </div>
      <VariantSheet open={sheetOpen} car={car} current={vi}
        onSelect={setVi} onClose={() => setSheetOpen(false)} t={t} />

      {/* Price + EMI row */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.textMuted, marginBottom: 3 }}>EX-SHOWROOM</div>
          <div style={{ fontFamily: "var(--outfit)", fontSize: 22, fontWeight: 900, color: t.text }}>{fmt(v.p)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.textMuted, marginBottom: 3 }}>EMI / 60 MO</div>
          <div style={{ fontFamily: "var(--outfit)", fontSize: 18, fontWeight: 800, color: zc }}>{fmtFull(emi60)}<span style={{ fontSize: 11, fontWeight: 400 }}>/mo</span></div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "0 16px 14px", display: "flex", gap: 8 }}>
        <button onClick={() => onSelect(car, vi)} style={{
          flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
          background: t.accent, color: "#fff", cursor: "pointer",
          fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 700,
        }}>Calculate EMI →</button>
        <button onClick={() => onCompare(car, vi)} style={{
          width: 44, height: 42, borderRadius: 12, cursor: "pointer",
          border: `1.5px solid ${isCompared ? t.accent : t.border}`,
          background: isCompared ? t.accentBg : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, transition: "all 0.2s",
        }}>{isCompared ? "✓" : "+"}</button>
      </div>
    </div>
  );
};

/* ─── RESULTS SCREEN ────────────────────────────────────────── */
const ResultsScreen = ({ salary, dp, exEMI, budget, t, onBack, onSelect, compared, onCompare }) => {
  const [seg, setSeg] = useState("All");
  const segs = ["All", "Hatchback", "Sedan", "Compact SUV", "SUV"];

  const cars = CARS.filter(c => {
    const base = c.variants[0].p;
    const hasAffordableVariant = base <= budget.maxBudget;
    return hasAffordableVariant && (seg === "All" || c.segment === seg);
  }).sort((a, b) => b.variants[0].p - a.variants[0].p);

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "0 20px", position: "sticky", top: 0, zIndex: 10,
        background: `linear-gradient(to bottom, ${t.bg} 85%, transparent)`, paddingTop: 8, paddingBottom: 6 }}>
        <button onClick={onBack} className="fu" style={{
          background: "none", border: "none", color: t.textSec, cursor: "pointer",
          fontFamily: "var(--karla)", fontSize: 13, padding: "8px 0", display: "flex", alignItems: "center", gap: 6,
        }}>← Edit Salary</button>

        {/* Budget bar */}
        <div className="fu fu1" style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 18, padding: "16px 18px", marginBottom: 12, boxShadow: t.shadow,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.textMuted, letterSpacing: "0.06em" }}>BUDGET</div>
              <div style={{ fontFamily: "var(--outfit)", fontSize: 24, fontWeight: 900, color: t.accent, marginTop: 4 }}>
                {fmt(budget.comfortBudget)} <span style={{ fontSize: 14, color: t.textMuted, fontWeight: 400 }}>→</span> {fmt(budget.maxBudget)}
              </div>
            </div>
            <div style={{
              background: t.greenBg, border: `1px solid ${t.green}30`,
              borderRadius: 10, padding: "8px 12px", textAlign: "center",
            }}>
              <div style={{ fontFamily: "var(--outfit)", fontSize: 22, fontWeight: 900, color: t.green }}>{cars.length}</div>
              <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.green }}>CARS</div>
            </div>
          </div>
        </div>

        {/* Segment pills */}
        <div className="fu fu2" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
          {segs.map(s => <Pill key={s} active={seg===s} onClick={() => setSeg(s)} t={t}>{s}</Pill>)}
        </div>
      </div>

      {/* Car list */}
      <div style={{ padding: "4px 20px 0" }}>
        {cars.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: t.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
            <div style={{ fontFamily: "var(--outfit)", fontSize: 16 }}>No cars in this segment fit your budget</div>
          </div>
        ) : cars.map(car => (
          <CarCard key={car.id} car={car} budget={budget} dp={dp} salary={salary} t={t}
            onSelect={onSelect}
            onCompare={(c, vi) => onCompare(c, vi)}
            isCompared={compared.some(x => x.id === car.id)}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── EMI SCREEN ────────────────────────────────────────────── */
const EMIScreen = ({ car, variantIdx, salary, dp: initDp, budget, t, onBack }) => {
  const [vi, setVi] = useState(variantIdx);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(9.0);
  const [dp, setDp] = useState(initDp);
  const [sheetOpen, setSheetOpen] = useState(false);
  const v = car.variants[vi];
  const loan = Math.max(0, v.p - dp);
  const emi = calcEMI(loan, rate, tenure);
  const totalI = (emi * tenure) - loan;
  const pct = salary > 0 ? Math.round((emi / salary) * 100) : 0;
  const mc = pct <= 30 ? t.green : pct <= 40 ? t.yellow : t.red;
  const ml = pct <= 30 ? "Comfortable" : pct <= 40 ? "Stretch" : "High Risk";
  const tenures = [12, 24, 36, 48, 60, 84];

  return (
    <div style={{ padding: "0 20px 60px" }}>
      <button onClick={onBack} className="fu" style={{
        background: "none", border: "none", color: t.textSec, cursor: "pointer",
        fontFamily: "var(--karla)", fontSize: 13, padding: "16px 0 12px", display: "flex", alignItems: "center", gap: 6,
      }}>← Back to Cars</button>

      {/* Car + variant header */}
      <div className="fu fu1" style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 22,
        padding: "20px", boxShadow: t.shadow, marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: t.carBg, display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${t.border}`,
          }}>
            <CarSVG segment={car.segment} color={car.hue} size={56} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--outfit)", fontSize: 20, fontWeight: 900, color: t.text }}>{car.name}</div>
            <div style={{ fontSize: 12, color: t.textSec, fontFamily: "var(--karla)", marginTop: 2 }}>{car.segment} · {car.fuel}</div>
          </div>
        </div>
        {/* Variant selector */}
        <div style={{ marginTop: 14 }}>
          <VariantTrigger car={car} vi={vi} onOpen={() => setSheetOpen(true)} t={t} />
        </div>
      </div>
      <VariantSheet open={sheetOpen} car={car} current={vi}
        onSelect={setVi} onClose={() => setSheetOpen(false)} t={t} />

      {/* EMI hero */}
      <div className="fu fu2" style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 24,
        padding: "28px 24px", textAlign: "center", boxShadow: t.shadowLg, marginBottom: 14,
      }}>
        <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.textMuted, letterSpacing: "0.08em", marginBottom: 8 }}>
          YOUR MONTHLY EMI
        </div>
        <div style={{ fontFamily: "var(--outfit)", fontSize: 52, fontWeight: 900, color: mc, lineHeight: 1 }}>
          {fmtFull(emi)}
        </div>
        <div style={{ fontSize: 13, color: t.textSec, fontFamily: "var(--karla)", marginTop: 6 }}>per month</div>

        {/* % bar */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.textMuted }}>0%</span>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: mc, fontWeight: 600 }}>
              {pct}% of salary · {ml}
            </span>
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.textMuted }}>50%</span>
          </div>
          <div style={{ height: 8, background: t.inputBg, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(pct * 2, 100)}%`, background: mc, borderRadius: 99, transition: "all 0.4s" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 1, background: t.border, borderRadius: 14, overflow: "hidden", marginTop: 20 }}>
          <StatBox label="LOAN" value={fmt(loan)} color={t.text} t={t} />
          <StatBox label="INTEREST" value={fmt(totalI)} color={t.yellow} t={t} />
          <StatBox label="TOTAL COST" value={fmt(emi*tenure + dp)} color={t.accent} t={t} />
        </div>
      </div>

      {/* Controls */}
      <div className="fu fu3" style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 22,
        padding: "20px", boxShadow: t.shadow, marginBottom: 14,
      }}>
        {/* Down payment */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 600, color: t.text }}>Down Payment</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: t.accent, fontWeight: 600 }}>{fmt(dp)}</span>
          </div>
          <input type="range" min={0} max={Math.round(v.p * 0.7)} step={10000} value={dp}
            onChange={e => setDp(+e.target.value)}
            style={{ background: `linear-gradient(to right, ${t.accent} ${(dp/Math.round(v.p*0.7))*100}%, ${t.inputBg} 0%)` }} />
        </div>
        <div style={{ height: 1, background: t.border, margin: "0 0 20px" }} />
        {/* Tenure */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 600, color: t.text }}>Loan Tenure</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: t.accent, fontWeight: 600 }}>{tenure} months</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {tenures.map(tn => (
              <Pill key={tn} active={tenure===tn} onClick={() => setTenure(tn)} t={t}>{tn}m</Pill>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: t.border, margin: "0 0 20px" }} />
        {/* Rate */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 600, color: t.text }}>Interest Rate</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: t.accent, fontWeight: 600 }}>{rate.toFixed(1)}%</span>
          </div>
          <input type="range" min={7} max={16} step={0.1} value={rate}
            onChange={e => setRate(+e.target.value)}
            style={{ background: `linear-gradient(to right, ${t.accent} ${((rate-7)/9)*100}%, ${t.inputBg} 0%)` }} />
        </div>
      </div>

      {/* Price breakdown */}
      <div className="fu fu4" style={{
        background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: "16px 20px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: t.textMuted, letterSpacing: "0.06em", marginBottom: 12 }}>PRICE BREAKDOWN</div>
        {[
          { l: "Ex-Showroom", v: fmt(v.p) },
          { l: "Est. Registration & Insurance (~15%)", v: fmt(Math.round(v.p * 0.15)) },
          { l: "Est. On-Road Price", v: fmt(Math.round(v.p * 1.15)), bold: true, color: t.accent },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${t.border}` : "none" }}>
            <span style={{ fontSize: 13, fontFamily: "var(--karla)", color: r.bold ? t.text : t.textSec, fontWeight: r.bold ? 600 : 400 }}>{r.l}</span>
            <span style={{ fontFamily: "var(--outfit)", fontSize: 14, fontWeight: r.bold ? 900 : 600, color: r.color || t.text }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="fu fu5" style={{
        width: "100%", padding: "18px 0", borderRadius: 16, border: "none",
        background: pct <= 40 ? t.accent : t.red, color: "#fff", cursor: "pointer",
        fontFamily: "var(--outfit)", fontSize: 16, fontWeight: 800,
        boxShadow: `0 4px 20px ${pct <= 40 ? t.accentGlow : t.redBg}`,
      }}>
        {pct <= 40 ? "Check Loan Eligibility →" : "Consider a Lower Variant ↓"}
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: t.textMuted, marginTop: 12 }}>
        * Indicative EMI only. Final rate depends on your credit profile.
      </p>
    </div>
  );
};

/* ─── COMPARE TRAY + MODAL ──────────────────────────────────── */
const CompareTray = ({ compared, onRemove, onOpen, t }) => {
  if (compared.length === 0) return null;
  return (
    <div className="su" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      zIndex: 100, pointerEvents: "none",
    }}>
      <div style={{
        width: "100%", maxWidth: 430, pointerEvents: "auto",
        background: t.surface, borderTop: `1.5px solid ${t.accent}40`,
        borderRadius: "16px 16px 0 0",
        padding: "14px 16px 18px", boxShadow: `0 -4px 24px rgba(0,0,0,0.18)`,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--outfit)", fontSize: 13, fontWeight: 700, color: t.text }}>
          Compare ({compared.length}/3)
        </span>
        {compared.length >= 2 && (
          <button onClick={onOpen} style={{
            padding: "8px 18px", borderRadius: 10, border: "none",
            background: t.accent, color: "#fff", cursor: "pointer",
            fontFamily: "var(--outfit)", fontSize: 12, fontWeight: 700,
          }}>Compare Now →</button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {compared.map((c, i) => (
          <div key={i} style={{
            flex: 1, background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: "8px 10px", position: "relative",
          }}>
            <button onClick={() => onRemove(i)} style={{
              position: "absolute", top: -6, right: -6,
              width: 20, height: 20, borderRadius: 99,
              background: t.red, color: "#fff", border: "none",
              fontSize: 10, cursor: "pointer", lineHeight: "20px",
            }}>✕</button>
            <div style={{ fontFamily: "var(--outfit)", fontSize: 11, fontWeight: 700, color: t.text, marginBottom: 2 }}>
              {c.name.split(" ").slice(1).join(" ")}
            </div>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.accent }}>
              {c.variants[c.vi].n} · {fmt(c.variants[c.vi].p)}
            </div>
          </div>
        ))}
        {Array.from({ length: 3 - compared.length }).map((_, i) => (
          <div key={`e${i}`} style={{
            flex: 1, border: `1.5px dashed ${t.border}`,
            borderRadius: 12, padding: "14px 10px", textAlign: "center",
          }}>
            <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "var(--karla)" }}>+ Add car</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

const CompareModal = ({ compared, salary, dp, t, onClose }) => {
  const rows = [
    { l: "Price", fn: c => fmt(c.variants[c.vi].p) },
    { l: "Segment", fn: c => c.segment },
    { l: "Fuel", fn: c => c.fuel },
    { l: "EMI (60m, 9%)", fn: c => fmtFull(calcEMI(Math.max(0, c.variants[c.vi].p - dp), 9, 60)) + "/mo" },
    { l: "EMI % of Salary", fn: c => {
      const e = calcEMI(Math.max(0, c.variants[c.vi].p - dp), 9, 60);
      const p = Math.round((e / salary) * 100);
      return p + "%";
    }},
    { l: "On-Road Est.", fn: c => fmt(Math.round(c.variants[c.vi].p * 1.15)) },
    { l: "Total Interest", fn: c => {
      const e = calcEMI(Math.max(0, c.variants[c.vi].p - dp), 9, 60);
      return fmt((e * 60) - Math.max(0, c.variants[c.vi].p - dp));
    }},
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div className="su" onClick={e => e.stopPropagation()} style={{
        background: t.bg, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 430,
        maxHeight: "85vh", overflowY: "auto", padding: "24px 20px 40px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "var(--outfit)", fontSize: 20, fontWeight: 900, color: t.text }}>Compare Cars</span>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 99, background: t.card,
            border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 14, color: t.textSec,
          }}>✕</button>
        </div>

        {/* Car headers */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {compared.map((c, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                background: t.carBg, borderRadius: 14, padding: "12px 8px", marginBottom: 8,
                border: `1px solid ${t.border}`,
              }}>
                <CarSVG segment={c.segment} color={c.hue} size={70} />
              </div>
              <div style={{ fontFamily: "var(--outfit)", fontSize: 12, fontWeight: 800, color: t.text }}>{c.name}</div>
              <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: t.accent, marginTop: 2 }}>{c.variants[c.vi].n}</div>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        {rows.map((row, ri) => (
          <div key={ri} style={{
            display: "flex", borderBottom: `1px solid ${t.border}`,
          }}>
            <div style={{
              width: 90, flexShrink: 0, padding: "10px 0", fontSize: 11,
              fontFamily: "var(--karla)", fontWeight: 600, color: t.textSec,
            }}>{row.l}</div>
            {compared.map((c, ci) => (
              <div key={ci} style={{
                flex: 1, padding: "10px 6px", textAlign: "center",
                fontFamily: "var(--mono)", fontSize: 12, fontWeight: 500, color: t.text,
              }}>{row.fn(c)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── APP ROOT ───────────────────────────────────────────────── */
export default function Clutch() {
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState("input");
  const [salary, setSalary] = useState(60000);
  const [dp, setDp] = useState(200000);
  const [exEMI, setExEMI] = useState(0);
  const [selCar, setSelCar] = useState(null);
  const [selVi, setSelVi] = useState(0);
  const [compared, setCompared] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const t = dark ? DARK : LIGHT;
  const budget = calcBudget(salary, dp, exEMI);

  const handleSelect = (car, vi) => { setSelCar(car); setSelVi(vi); setScreen("emi"); };
  const handleCompare = (car, vi) => {
    setCompared(prev => {
      const exists = prev.findIndex(x => x.id === car.id);
      if (exists >= 0) return prev.filter((_, i) => i !== exists);
      if (prev.length >= 3) return prev;
      return [...prev, { ...car, vi }];
    });
  };

  return (
    <>
      <GlobalCSS dark={dark} />
      <div style={{
        minHeight: "100vh", background: t.bg, fontFamily: "var(--karla)",
        color: t.text, maxWidth: 430, margin: "0 auto", transition: "background 0.35s, color 0.35s",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 4px", position: "sticky", top: 0, zIndex: 50,
          background: t.bg, transition: "background 0.35s",
        }}>
          <ClutchLogo t={t} />
          <ThemeToggle dark={dark} setDark={setDark} t={t} />
        </div>

        {/* Screens */}
        {screen === "input" && (
          <InputScreen salary={salary} setSalary={setSalary} dp={dp} setDp={setDp}
            exEMI={exEMI} setExEMI={setExEMI} onGo={() => setScreen("results")} t={t} />
        )}
        {screen === "results" && (
          <ResultsScreen salary={salary} dp={dp} exEMI={exEMI} budget={budget} t={t}
            onBack={() => setScreen("input")} onSelect={handleSelect}
            compared={compared} onCompare={handleCompare} />
        )}
        {screen === "emi" && selCar && (
          <EMIScreen car={selCar} variantIdx={selVi} salary={salary} dp={dp}
            budget={budget} t={t} onBack={() => setScreen("results")} />
        )}

        {/* Compare tray */}
        {screen === "results" && (
          <CompareTray compared={compared}
            onRemove={i => setCompared(p => p.filter((_, j) => j !== i))}
            onOpen={() => setShowCompare(true)} t={t} />
        )}

        {/* Compare modal */}
        {showCompare && compared.length >= 2 && (
          <CompareModal compared={compared} salary={salary} dp={dp} t={t}
            onClose={() => setShowCompare(false)} />
        )}
      </div>
    </>
  );
}
