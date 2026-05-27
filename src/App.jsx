import { useState, useEffect, useRef } from "react";

// ─── Inline Styles ────────────────────────────────────────────────────────────

const S = {
  dash: {
    minHeight: "100vh",
    background: "#0a0f1a",
    color: "#e2e8f0",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "32px",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  h1: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#f1f5f9",
    letterSpacing: "-0.4px",
    margin: 0,
  },
  headerSub: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  },
  badge: {
    fontSize: "11px",
    padding: "4px 12px",
    borderRadius: "99px",
    background: "rgba(16,185,129,0.12)",
    color: "#10b981",
    fontWeight: 600,
    letterSpacing: "0.5px",
    border: "1px solid rgba(16,185,129,0.2)",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "24px",
  },
  kpi: (accentColor) => ({
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderLeft: `3px solid ${accentColor}`,
    borderRadius: "12px",
    padding: "16px 18px",
  }),
  kpiLabel: {
    fontSize: "10px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "8px",
  },
  kpiVal: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#f1f5f9",
    letterSpacing: "-0.3px",
  },
  kpiSub: {
    fontSize: "11px",
    color: "#475569",
    marginTop: "3px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "16px",
  },
  panel: {
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "20px",
  },
  panelTitle: {
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    color: "#475569",
    marginBottom: "18px",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  inputLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  inputLabel: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  inputVal: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#e2e8f0",
  },
  hintNormal: {
    fontSize: "11px",
    color: "#475569",
    marginTop: "5px",
  },
  hintWarn: {
    fontSize: "11px",
    color: "#f59e0b",
    marginTop: "5px",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  aRow: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "8px",
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aLabel: {
    fontSize: "12px",
    color: "#64748b",
  },
  aVal: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#e2e8f0",
  },
  aValGreen: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#10b981",
  },
  aValRed: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#f87171",
  },
  dividerFull: {
    gridColumn: "1 / -1",
    height: "1px",
    background: "rgba(255,255,255,0.05)",
    margin: "4px 0",
  },
  costBreakdown: {
    marginTop: "20px",
    paddingTop: "18px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  costBarRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "5px",
    alignItems: "center",
  },
  costDot: (color) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    marginRight: "6px",
  }),
  costBarTrack: {
    height: "5px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "99px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  chartWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    height: "150px",
    padding: "0 4px",
  },
  barWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    height: "100%",
    justifyContent: "flex-end",
  },
  barAmt: {
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: 500,
  },
  barLabel: {
    fontSize: "10px",
    color: "#475569",
  },
  chartAxisLine: {
    borderTop: "1px solid rgba(255,255,255,0.07)",
    marginTop: "8px",
  },
  forecastHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  forecastNote: {
    fontSize: "11px",
    color: "#334155",
  },
};

// ─── Range Slider CSS (injected once) ────────────────────────────────────────

const sliderCSS = `
  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 99px;
    outline: none;
    cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #0a0f1a;
    box-shadow: 0 0 0 1px rgba(59,130,246,0.4);
    transition: transform 0.15s;
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  input[type=range]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #0a0f1a;
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accentColor }) {
  return (
    <div style={S.kpi(accentColor)}>
      <div style={S.kpiLabel}>{label}</div>
      <div style={S.kpiVal}>{value}</div>
      <div style={S.kpiSub}>{sub}</div>
    </div>
  );
}

function SliderInput({ label, value, setValue, min, max, step, display }) {
  return (
    <div style={S.inputGroup}>
      <div style={S.inputLabelRow}>
        <span style={S.inputLabel}>{label}</span>
        <span style={S.inputVal}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}

function AnalyticsRow({ label, value, color }) {
  const valStyle = color === "green" ? S.aValGreen : color === "red" ? S.aValRed : S.aVal;
  return (
    <div style={S.aRow}>
      <span style={S.aLabel}>{label}</span>
      <span style={valStyle}>{value}</span>
    </div>
  );
}

function CostBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <>
      <div style={S.costBarRow}>
        <span>
          <span style={S.costDot(color)} />
          {label}
        </span>
        <span style={{ color: "#94a3b8", fontWeight: 500 }}>₹{value.toFixed(0)} Cr</span>
      </div>
      <div style={S.costBarTrack}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.35s ease" }} />
      </div>
    </>
  );
}

function RevenueChart({ base }) {
  const years = ["2025", "2026", "2027", "2028", "2029"];
  const mults = [0.8, 0.9, 1.0, 1.1, 1.2];
  const vals = mults.map((m) => base * m);
  const maxV = Math.max(...vals, 0.001);
  const barColors = ["#1e3a5f", "#1e4d8c", "#2563eb", "#1d4ed8", "#1e40af"];

  return (
    <>
      <div style={S.forecastHeader}>
        <div style={S.panelTitle}>Revenue Forecast (5-Year)</div>
        <span style={S.forecastNote}>+10% yr growth assumed</span>
      </div>
      <div style={S.chartWrapper}>
        {vals.map((v, i) => (
          <div style={S.barWrap} key={years[i]}>
            <span style={S.barAmt}>₹{v.toFixed(1)}</span>
            <div
              style={{
                width: "100%",
                height: `${((v / maxV) * 120).toFixed(0)}px`,
                background: barColors[i],
                borderRadius: "4px 4px 0 0",
                border: "1px solid rgba(59,130,246,0.2)",
                transition: "height 0.4s ease",
                minHeight: "4px",
              }}
            />
            <span style={S.barLabel}>{years[i]}</span>
          </div>
        ))}
      </div>
      <div style={S.chartAxisLine} />
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [solarMW, setSolarMW] = useState(20);
  const [batteryMWh, setBatteryMWh] = useState(40);
  const [ppa, setPpa] = useState(4.5);
  const [cuf, setCuf] = useState(22);

  // Inject slider CSS once
  const styleInjected = useRef(false);
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement("style");
    tag.textContent = sliderCSS;
    document.head.appendChild(tag);
  }, []);

  // ── Calculations ────────────────────────────────────────────────────────────
  const solarCost    = solarMW * 4;
  const batteryCost  = batteryMWh * 2;
  const miscCost     = 15;
  const totalCost    = solarCost + batteryCost + miscCost;
  const annualEnergy = solarMW * 8760 * (cuf / 100);
  const annualRevenue = (annualEnergy * 1000 * ppa) / 10_000_000;
  const omCost       = totalCost * 0.02;
  const annualProfit = annualRevenue - omCost;
  const payback      = annualProfit > 0 ? totalCost / annualProfit : null;

  const cufWarn = cuf > 26 || cuf < 18;
  const cufHint = cuf > 26
    ? "⚠ Above typical range for India (18–26%)"
    : cuf < 18
    ? "⚠ Below typical range for India (18–26%)"
    : "Recommended: 18% – 26% for India";

  const fmt = (n, d = 2) => `₹${n.toFixed(d)} Cr`;
  const fmtMWh = (n) => `${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })} MWh`;

  return (
    <div style={S.dash}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.h1}>Solar + BESS Financial Estimator</h1>
          <p style={S.headerSub}>Adjust plant parameters to model project economics</p>
        </div>
        <span style={S.badge}>LIVE MODEL</span>
      </div>

      {/* KPI Cards */}
      <div style={S.kpiGrid}>
        <KpiCard label="Total CAPEX"     value={`₹${totalCost.toFixed(0)} Cr`}    sub="Capital expenditure"    accentColor="#3b82f6" />
        <KpiCard label="Annual Revenue"  value={fmt(annualRevenue, 1)}              sub="At PPA tariff"          accentColor="#10b981" />
        <KpiCard label="Annual Profit"   value={fmt(annualProfit, 1)}               sub="Revenue minus O&M"      accentColor="#f59e0b" />
        <KpiCard label="Simple Payback"  value={payback ? `${payback.toFixed(1)} yrs` : "—"} sub="Years to recover CAPEX" accentColor="#a78bfa" />
      </div>

      {/* Main Grid */}
      <div style={S.mainGrid}>

        {/* Left Panel — Inputs */}
        <div style={S.panel}>
          <div style={S.panelTitle}>Plant Inputs</div>

          <SliderInput
            label="Solar Plant Size"
            value={solarMW}
            setValue={setSolarMW}
            min={1} max={500} step={1}
            display={`${solarMW} MW`}
          />
          <SliderInput
            label="Battery Size"
            value={batteryMWh}
            setValue={setBatteryMWh}
            min={0} max={1000} step={5}
            display={`${batteryMWh} MWh`}
          />
          <SliderInput
            label="PPA Tariff"
            value={ppa}
            setValue={setPpa}
            min={2} max={12} step={0.1}
            display={`₹${ppa.toFixed(1)}/kWh`}
          />
          <SliderInput
            label="CUF"
            value={cuf}
            setValue={setCuf}
            min={1} max={35} step={0.5}
            display={`${cuf}%`}
          />
          <p style={cufWarn ? S.hintWarn : S.hintNormal}>{cufHint}</p>

          {/* CAPEX Breakdown */}
          <div style={S.costBreakdown}>
            <div style={S.panelTitle}>CAPEX Breakdown</div>
            <CostBar label="Solar"   value={solarCost}   total={totalCost} color="#3b82f6" />
            <CostBar label="Battery" value={batteryCost} total={totalCost} color="#10b981" />
            <CostBar label="Misc"    value={miscCost}    total={totalCost} color="#64748b" />
          </div>
        </div>

        {/* Right Column */}
        <div style={S.rightCol}>

          {/* Analytics Panel */}
          <div style={S.panel}>
            <div style={S.panelTitle}>Financial Analytics</div>
            <div style={S.analyticsGrid}>
              <AnalyticsRow label="Solar Cost"      value={fmt(solarCost)} />
              <AnalyticsRow label="Battery Cost"    value={fmt(batteryCost)} />
              <AnalyticsRow label="Misc Cost"       value={fmt(miscCost)} />
              <AnalyticsRow label="Annual Energy"   value={fmtMWh(annualEnergy)} />
              <div style={S.dividerFull} />
              <AnalyticsRow label="Annual Revenue"  value={fmt(annualRevenue)}  color="green" />
              <AnalyticsRow label="O&M Cost (2%)"   value={fmt(omCost)}         color="red" />
              <AnalyticsRow label="Annual Profit"   value={fmt(annualProfit)}   color="green" />
              <AnalyticsRow label="Payback Period"  value={payback ? `${payback.toFixed(1)} years` : "—"} />
            </div>
          </div>

          {/* Chart Panel */}
          <div style={S.panel}>
            <RevenueChart base={annualRevenue} />
          </div>

        </div>
      </div>
    </div>
  );
}
