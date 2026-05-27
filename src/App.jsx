import { useState, useEffect, useRef } from "react";

// ─── Slider CSS (injected once) ───────────────────────────────────────────────
const sliderCSS = `
  input[type=range] {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 5px;
    background: #e2e8f0; border-radius: 99px; outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 22px; height: 22px; border-radius: 50%;
    background: #2563eb; cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
  }
  input[type=range]::-moz-range-thumb {
    width: 22px; height: 22px; border-radius: 50%;
    background: #2563eb; border: 3px solid #fff; cursor: pointer;
  }
`;

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:          "#f1f5f9",
  surface:     "#ffffff",
  surfaceAlt:  "#f8fafc",
  border:      "#e2e8f0",
  text:        "#0f172a",
  textSec:     "#64748b",
  textTert:    "#94a3b8",
  blue:        "#2563eb",
  blueLight:   "#eff6ff",
  green:       "#059669",
  greenLight:  "#ecfdf5",
  amber:       "#d97706",
  amberLight:  "#fffbeb",
  purple:      "#7c3aed",
  purpleLight: "#f5f3ff",
  red:         "#dc2626",
  redLight:    "#fef2f2",
};

// ─── Hook: window width ───────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

// ─── Components ───────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderTop: `3px solid ${accent}`, borderRadius: "12px", padding: "14px 16px",
    }}>
      <div style={{ fontSize: "10px", color: C.textTert, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: C.text, letterSpacing: "-0.3px" }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: C.textSec, marginTop: "2px" }}>{sub}</div>
    </div>
  );
}

function SliderInput({ label, value, setValue, min, max, step, display }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", color: C.textSec, fontWeight: 500 }}>{label}</span>
        <span style={{
          fontSize: "12px", fontWeight: 700, color: C.blue,
          background: C.blueLight, padding: "3px 10px",
          borderRadius: "99px",
        }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => setValue(Number(e.target.value))} />
    </div>
  );
}

function ARow({ label, value, color }) {
  const vc = color === "green" ? C.green : color === "red" ? C.red : C.text;
  const vb = color === "green" ? C.greenLight : color === "red" ? C.redLight : "transparent";
  return (
    <div style={{
      background: C.surfaceAlt, border: `1px solid ${C.border}`,
      borderRadius: "8px", padding: "10px 12px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{ fontSize: "12px", color: C.textSec }}>{label}</span>
      <span style={{
        fontSize: "12px", fontWeight: 700, color: vc,
        background: vb, padding: color ? "2px 8px" : "0",
        borderRadius: color ? "99px" : "0",
      }}>{value}</span>
    </div>
  );
}

function CostBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.textSec, marginBottom: "5px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
          {label}
        </span>
        <span style={{ fontWeight: 600, color: C.text }}>₹{value.toFixed(0)} Cr</span>
      </div>
      <div style={{ height: "6px", background: C.border, borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.35s ease" }} />
      </div>
    </div>
  );
}

function RevenueChart({ base }) {
  const years  = ["2025", "2026", "2027", "2028", "2029"];
  const mults  = [0.8, 0.9, 1.0, 1.1, 1.2];
  const vals   = mults.map((m) => base * m);
  const maxV   = Math.max(...vals, 0.001);
  const alphas = [0.3, 0.45, 0.65, 0.82, 1.0];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: C.textTert }}>
          Revenue Forecast (5-Year)
        </div>
        <span style={{ fontSize: "10px", color: C.textTert }}>+10%/yr growth</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "130px" }}>
        {vals.map((v, i) => (
          <div key={years[i]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "9px", color: C.textSec, fontWeight: 600 }}>₹{v.toFixed(1)}</span>
            <div style={{
              width: "100%",
              height: `${((v / maxV) * 100).toFixed(0)}px`,
              background: `rgba(37,99,235,${alphas[i]})`,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.4s ease", minHeight: "4px",
            }} />
            <span style={{ fontSize: "9px", color: C.textTert }}>{years[i]}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: "8px" }} />
    </>
  );
}

function Panel({ children, style }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "14px", padding: "18px", ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.9px", color: C.textTert, marginBottom: "16px" }}>
      {children}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [solarMW,    setSolarMW]    = useState(20);
  const [batteryMWh, setBatteryMWh] = useState(40);
  const [ppa,        setPpa]        = useState(4.5);
  const [cuf,        setCuf]        = useState(22);

  const w       = useWindowWidth();
  const isMobile = w < 700;
  const isSmall  = w < 420;

  const styleInjected = useRef(false);
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement("style");
    tag.textContent = sliderCSS;
    document.head.appendChild(tag);
  }, []);

  // ── Calculations ─────────────────────────────────────────────────────────
  const solarCost     = solarMW * 4;
  const batteryCost   = batteryMWh * 2;
  const miscCost      = 15;
  const totalCost     = solarCost + batteryCost + miscCost;
  const annualEnergy  = solarMW * 8760 * (cuf / 100);
  const annualRevenue = (annualEnergy * 1000 * ppa) / 10_000_000;
  const omCost        = totalCost * 0.02;
  const annualProfit  = annualRevenue - omCost;
  const payback       = annualProfit > 0 ? totalCost / annualProfit : null;

  const cufWarn = cuf > 26 || cuf < 18;
  const cufHint = cuf > 26
    ? "⚠ Above typical range for India (18–26%)"
    : cuf < 18
    ? "⚠ Below typical range for India (18–26%)"
    : "✓ Within recommended range (18–26%)";

  const fmt    = (n, d = 2) => `₹${n.toFixed(d)} Cr`;
  const fmtMWh = (n) => `${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })} MWh`;

  const pad = isMobile ? "16px" : "28px";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: pad, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: "10px",
        marginBottom: "20px",
        paddingBottom: "16px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.jpeg"
            alt="Lith-On logo"
            style={{
              height: isMobile ? "36px" : "44px",
              width: "auto",
              borderRadius: "6px",
              flexShrink: 0,
            }}
          />
          <div>
            <h1 style={{ fontSize: isMobile ? "17px" : "20px", fontWeight: 700, color: C.text, letterSpacing: "-0.4px", margin: 0 }}>
              Solar + BESS Financial Estimator
            </h1>
            <p style={{ fontSize: "12px", color: C.textSec, marginTop: "3px" }}>
              Adjust plant parameters to model project economics
            </p>
          </div>
        </div>
        <span style={{
          fontSize: "10px", padding: "5px 12px", borderRadius: "99px",
          background: C.greenLight, color: C.green,
          fontWeight: 700, letterSpacing: "0.6px",
          border: `1px solid rgba(5,150,105,0.2)`,
          alignSelf: isMobile ? "flex-start" : "center",
          whiteSpace: "nowrap",
        }}>LIVE MODEL</span>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isSmall ? "1fr 1fr" : isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "10px",
        marginBottom: "16px",
      }}>
        <KpiCard label="Total CAPEX"    value={`₹${totalCost.toFixed(0)} Cr`}               sub="Capital expenditure"    accent={C.blue} />
        <KpiCard label="Annual Revenue" value={fmt(annualRevenue, 1)}                         sub="At PPA tariff"          accent={C.green} />
        <KpiCard label="Annual Profit"  value={fmt(annualProfit, 1)}                          sub="Revenue minus O&M"      accent={C.amber} />
        <KpiCard label="Simple Payback" value={payback ? `${payback.toFixed(1)} yrs` : "—"}  sub="Years to recover CAPEX" accent={C.purple} />
      </div>

      {/* ── Main Layout ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "300px 1fr",
        gap: "14px",
      }}>

        {/* Left — Inputs + CAPEX */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          <Panel>
            <SectionTitle>Plant Inputs</SectionTitle>
            <SliderInput label="Solar Plant Size" value={solarMW}    setValue={setSolarMW}    min={1}  max={500}  step={1}   display={`${solarMW} MW`} />
            <SliderInput label="Battery Size"     value={batteryMWh} setValue={setBatteryMWh} min={0}  max={1000} step={5}   display={`${batteryMWh} MWh`} />
            <SliderInput label="PPA Tariff"       value={ppa}        setValue={setPpa}        min={2}  max={12}   step={0.1} display={`₹${ppa.toFixed(1)}/kWh`} />
            <SliderInput label="CUF"              value={cuf}        setValue={setCuf}        min={1}  max={35}   step={0.5} display={`${cuf}%`} />
            <p style={{ fontSize: "11px", color: cufWarn ? C.amber : C.green, fontWeight: 500, marginTop: "-4px" }}>
              {cufHint}
            </p>
          </Panel>

          <Panel>
            <SectionTitle>CAPEX Breakdown</SectionTitle>
            <CostBar label="Solar"   value={solarCost}   total={totalCost} color={C.blue} />
            <CostBar label="Battery" value={batteryCost} total={totalCost} color={C.green} />
            <CostBar label="Misc"    value={miscCost}    total={totalCost} color={C.textTert} />
          </Panel>

        </div>

        {/* Right — Analytics + Chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          <Panel>
            <SectionTitle>Financial Analytics</SectionTitle>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "8px",
            }}>
              <ARow label="Solar Cost"     value={fmt(solarCost)} />
              <ARow label="Battery Cost"   value={fmt(batteryCost)} />
              <ARow label="Misc Cost"      value={fmt(miscCost)} />
              <ARow label="Annual Energy"  value={fmtMWh(annualEnergy)} />
              <div style={{ gridColumn: "1/-1", height: "1px", background: C.border, margin: "2px 0" }} />
              <ARow label="Annual Revenue" value={fmt(annualRevenue)}  color="green" />
              <ARow label="O&M Cost (2%)"  value={fmt(omCost)}         color="red" />
              <ARow label="Annual Profit"  value={fmt(annualProfit)}   color="green" />
              <ARow label="Payback Period" value={payback ? `${payback.toFixed(1)} years` : "—"} />
            </div>
          </Panel>

          <Panel>
            <RevenueChart base={annualRevenue} />
          </Panel>

        </div>
      </div>
    </div>
  );
}
