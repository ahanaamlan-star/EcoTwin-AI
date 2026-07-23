import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Leaf, 
  MapPin, 
  Activity, 
  Sliders, 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldAlert, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Globe, 
  Gauge, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Compass, 
  ArrowUpRight,
  Radio,
  Flame,
  Trees
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { 
  SolarPotentialData, 
  WindPotentialData, 
  BatteryStorageData, 
  MicrogridNodeData, 
  FinancialROIStats, 
  CarbonReductionStats,
  TwinRegion 
} from '../types';
import { 
  DEFAULT_SOLAR_POTENTIAL, 
  DEFAULT_WIND_POTENTIAL, 
  DEFAULT_BATTERY_STORAGE, 
  DEFAULT_MICROGRID_NODES, 
  DEFAULT_FINANCIAL_ROI, 
  DEFAULT_CARBON_REDUCTION 
} from '../data/mockTwinData';

interface RenewableEnergyPlannerProps {
  region?: TwinRegion;
  onNavigateToCopilot?: (prompt: string) => void;
  onNavigateToReports?: (markdown: string) => void;
}

export const RenewableEnergyPlanner: React.FC<RenewableEnergyPlannerProps> = ({
  region,
  onNavigateToCopilot,
  onNavigateToReports
}) => {
  // State
  const [solarData, setSolarData] = useState<SolarPotentialData>(DEFAULT_SOLAR_POTENTIAL);
  const [windData, setWindData] = useState<WindPotentialData>(DEFAULT_WIND_POTENTIAL);
  const [batteryData, setBatteryData] = useState<BatteryStorageData>(DEFAULT_BATTERY_STORAGE);
  const [microgridNodes, setMicrogridNodes] = useState<MicrogridNodeData[]>(DEFAULT_MICROGRID_NODES);
  const [financials, setFinancials] = useState<FinancialROIStats>(DEFAULT_FINANCIAL_ROI);
  const [carbonStats, setCarbonStats] = useState<CarbonReductionStats>(DEFAULT_CARBON_REDUCTION);

  const [activeSection, setActiveSection] = useState<'overview' | 'solar' | 'wind' | 'battery' | 'microgrid' | 'roi' | 'carbon'>('overview');
  const [selectedNode, setSelectedNode] = useState<MicrogridNodeData | null>(microgridNodes[0]);

  // Interactive Simulation Controls
  const [solarScaleMW, setSolarScaleMW] = useState<number>(solarData.peakCapacityMW);
  const [turbineCountScale, setTurbineCountScale] = useState<number>(windData.installedTurbineCount);
  const [batteryCapacityScaleMWh, setBatteryCapacityScaleMWh] = useState<number>(batteryData.totalCapacityMWh);
  const [capexScaleMillions, setCapexScaleMillions] = useState<number>(financials.initialCapexUSD / 1000000);

  // Notice banner
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Recalculate Simulation
  const handleRunEnergySimulation = () => {
    // Solar recalculation
    const solarRatio = solarScaleMW / DEFAULT_SOLAR_POTENTIAL.peakCapacityMW;
    const newAnnualSolarGWh = Math.round(DEFAULT_SOLAR_POTENTIAL.annualGenerationGWh * solarRatio);
    const updatedSolarHourly = DEFAULT_SOLAR_POTENTIAL.hourlyGenerationCurve.map(pt => ({
      ...pt,
      solarMW: Math.round(pt.solarMW * solarRatio)
    }));

    setSolarData(prev => ({
      ...prev,
      peakCapacityMW: solarScaleMW,
      annualGenerationGWh: newAnnualSolarGWh,
      hourlyGenerationCurve: updatedSolarHourly
    }));

    // Wind recalculation
    const windRatio = turbineCountScale / DEFAULT_WIND_POTENTIAL.installedTurbineCount;
    const newAnnualWindGWh = Math.round(DEFAULT_WIND_POTENTIAL.annualWindGenerationGWh * windRatio);
    setWindData(prev => ({
      ...prev,
      installedTurbineCount: turbineCountScale,
      annualWindGenerationGWh: newAnnualWindGWh
    }));

    // Battery recalculation
    setBatteryData(prev => ({
      ...prev,
      totalCapacityMWh: batteryCapacityScaleMWh
    }));

    // Financial ROI recalculation
    const totalRenewableGWh = newAnnualSolarGWh + newAnnualWindGWh;
    const estimatedOpexSavingsUSD = Math.round(totalRenewableGWh * 1000 * 0.088); // $0.088/kWh offset
    const capexUSD = capexScaleMillions * 1000000;
    const simplePayback = parseFloat((capexUSD / estimatedOpexSavingsUSD).toFixed(1));
    const npv = Math.round((estimatedOpexSavingsUSD * 12) - capexUSD);

    const updatedCashFlow = DEFAULT_FINANCIAL_ROI.cashFlowForecastYears.map(pt => {
      const cumSavings = Math.round((pt.year * estimatedOpexSavingsUSD) - capexUSD);
      return {
        ...pt,
        netCashFlowUSD: estimatedOpexSavingsUSD,
        cumulativeSavingsUSD: cumSavings
      };
    });

    setFinancials(prev => ({
      ...prev,
      initialCapexUSD: capexUSD,
      annualOpexSavingsUSD: estimatedOpexSavingsUSD,
      paybackPeriodYears: simplePayback,
      netPresentValue20YrUSD: npv,
      cashFlowForecastYears: updatedCashFlow
    }));

    // Carbon Reduction recalculation
    const newAnnualCO2Offset = Math.round(totalRenewableGWh * 330); // ~330 metric tons CO2 per GWh
    setCarbonStats(prev => ({
      ...prev,
      annualCO2OffsetMetricTons: newAnnualCO2Offset,
      lifetimeCO2OffsetMetricTons: newAnnualCO2Offset * 20,
      equivalentTreesPlanted: Math.round(newAnnualCO2Offset * 44.5),
      equivalentCoalPlantsRetired: parseFloat((newAnnualCO2Offset / 130000).toFixed(1)),
      fossilFuelReplacedBarrels: Math.round(newAnnualCO2Offset * 2.3)
    }));

    setActionNotice('⚡ Renewable Energy Digital Twin simulation re-converged! Energy mix, cash flows, and CO2 offsets recalculated.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Toggle Microgrid Islanding
  const handleToggleIslanding = (nodeId: string) => {
    setMicrogridNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const isCurrentlyIslanding = node.status === 'Islanding Active';
        const newStatus = isCurrentlyIslanding ? 'Optimal' : 'Islanding Active';
        const newGridInd = isCurrentlyIslanding ? 88 : 100;
        return {
          ...node,
          status: newStatus,
          gridIndependencePct: newGridInd
        };
      }
      return node;
    }));

    const targetNode = microgridNodes.find(n => n.id === nodeId);
    setActionNotice(`🛡️ Microgrid [${targetNode?.name}] mode toggled! Autonomous frequency & voltage balancing engaged.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Export Energy Report Briefing
  const handleExportBriefing = () => {
    const totalCapMW = solarData.peakCapacityMW + (windData.installedTurbineCount * 2.5);
    const totalGenGWh = solarData.annualGenerationGWh + windData.annualWindGenerationGWh;

    const markdown = `# Regional Renewable Energy & Microgrid Master Briefing

**Region**: ${region?.name || 'Metropolis Delta Hub'}  
**Total Renewable Generation Capacity**: ${totalCapMW.toFixed(1)} MW  
**Annual Clean Energy Yield**: ${totalGenGWh} GWh/year  
**Battery Energy Storage System (BESS)**: ${batteryData.totalCapacityMWh} MWh (${batteryData.currentStateOfChargePct}% SoC)  
**Financial Payback Period**: ${financials.paybackPeriodYears} Years | **Annual Opex Savings**: $${(financials.annualOpexSavingsUSD / 1000000).toFixed(1)}M/yr  
**Annual Carbon Offset**: ${carbonStats.annualCO2OffsetMetricTons.toLocaleString()} Metric Tons CO₂  

---

## 1. Solar Potential Matrix
- **Solar Irradiance**: ${solarData.solarIrradianceKwhM2Day} kWh/m²/day
- **Peak Photovoltaic Capacity**: ${solarData.peakCapacityMW} MW
- **Annual Solar Yield**: ${solarData.annualGenerationGWh} GWh
- **Suitable Rooftop Area**: ${solarData.suitableRoofAreaSqM.toLocaleString()} m² (Suitability Score: ${solarData.rooftopSuitabilityScore}/100)

---

## 2. Wind Potential & Velocity Distribution
- **Average Wind Speed (100m Hub)**: ${windData.avgWindSpeedMs} m/s
- **Capacity Factor**: ${windData.capacityFactorPct}%
- **Installed Wind Turbines**: ${windData.installedTurbineCount} Units
- **Annual Wind Yield**: ${windData.annualWindGenerationGWh} GWh

---

## 3. Battery Energy Storage System (BESS)
- **Nameplate Storage Capacity**: ${batteryData.totalCapacityMWh} MWh
- **Current State of Charge (SoC)**: ${batteryData.currentStateOfChargePct}%
- **Max Charge/Discharge Power**: ${batteryData.maxChargeDischargePowerMW} MW
- **Round-Trip Efficiency**: ${batteryData.roundTripEfficiencyPct}% (${batteryData.chemistryType})

---

## 4. Microgrid Network Status
${microgridNodes.map(m => `- **${m.name}** (${m.district}): Solar ${m.solarMW}MW | Wind ${m.windMW}MW | BESS ${m.batteryMWh}MWh | Load ${m.loadMW}MW | Grid Independence: ${m.gridIndependencePct}% - Status: ${m.status}`).join('\n')}

---

## 5. Financial ROI & Decarbonization Metrics
- **Initial Capex**: $${(financials.initialCapexUSD / 1000000).toFixed(1)}M
- **NPV (20-Year)**: $${(financials.netPresentValue20YrUSD / 1000000).toFixed(1)}M
- **IRR**: ${financials.internalRateOfReturnPct}%
- **Trees Equivalent**: ${carbonStats.equivalentTreesPlanted.toLocaleString()} Trees Planted
- **Coal Plants Replaced**: ${carbonStats.equivalentCoalPlantsRetired} Coal Plants
`;

    if (onNavigateToReports) {
      onNavigateToReports(markdown);
    }
  };

  const totalCapMW = solarData.peakCapacityMW + (windData.installedTurbineCount * 2.5);
  const totalGenGWh = solarData.annualGenerationGWh + windData.annualWindGenerationGWh;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> RENEWABLE ENERGY PLANNER & MICROGRID MESH
            </span>
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              Smart Energy Twin v4.8 • 100% Clean Grid Roadmap
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Solar, Wind, Battery Storage, Microgrid & Decarbonization ROI
          </h1>
          <p className="text-xs text-white/50 mt-0.5 max-w-3xl">
            Simulate regional solar & wind potential, battery energy storage systems (BESS), microgrid islanding resilience, financial ROI payback, and carbon offsets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onNavigateToCopilot) {
                onNavigateToCopilot("Analyze our regional renewable energy mix, battery storage capacity, payback period, and recommend optimal microgrid islanding strategies.");
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Energy Copilot</span>
          </button>

          <button
            onClick={handleExportBriefing}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
            <span>Export Energy Briefing</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-400/60 uppercase font-mono">ENERGY TWIN ENGINE</span>
        </div>
      )}

      {/* TOP 8 KEY RENEWABLE PERFORMANCE INDICATOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Solar Potential */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>SOLAR POTENTIAL</span>
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{solarData.peakCapacityMW} MW</span>
            <span className="text-xs text-amber-400 font-mono">Peak</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Irradiance: {solarData.solarIrradianceKwhM2Day} kWh/m²</span>
            <span className="text-amber-400 font-bold">{solarData.annualGenerationGWh} GWh/yr</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono block">Rooftop Area: {(solarData.suitableRoofAreaSqM / 1000).toFixed(0)}k m²</span>
        </div>

        {/* Card 2: Wind Potential */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>WIND POTENTIAL</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{windData.avgWindSpeedMs} m/s</span>
            <span className="text-xs text-cyan-400 font-mono">Avg Speed</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>{windData.installedTurbineCount} Turbines</span>
            <span className="text-cyan-400 font-bold">{windData.annualWindGenerationGWh} GWh/yr</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono block">Capacity Factor: {windData.capacityFactorPct}%</span>
        </div>

        {/* Card 3: Battery Storage */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>BATTERY BESS</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{batteryData.totalCapacityMWh} MWh</span>
            <span className="text-xs text-emerald-400 font-mono">{batteryData.currentStateOfChargePct}% SoC</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${batteryData.currentStateOfChargePct}%` }}
            />
          </div>
          <span className="text-[10px] text-white/40 font-mono block">{batteryData.chemistryType} • Eff {batteryData.roundTripEfficiencyPct}%</span>
        </div>

        {/* Card 4: Financial ROI & Carbon */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>EXPECTED SAVINGS & ROI</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-purple-400 font-mono">${(financials.annualOpexSavingsUSD / 1000000).toFixed(1)}M</span>
            <span className="text-xs text-purple-400 font-mono">/ year</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Payback: <strong className="text-emerald-400">{financials.paybackPeriodYears} yrs</strong></span>
            <span className="text-emerald-400 font-bold">IRR: {financials.internalRateOfReturnPct}%</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono block">CO₂ Offset: {carbonStats.annualCO2OffsetMetricTons.toLocaleString()} t/yr</span>
        </div>
      </div>

      {/* SECTION TABS NAV */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'overview' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          All Modules
        </button>

        <button
          onClick={() => setActiveSection('solar')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'solar' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Solar Potential
        </button>

        <button
          onClick={() => setActiveSection('wind')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'wind' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Wind Potential
        </button>

        <button
          onClick={() => setActiveSection('battery')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'battery' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Battery Storage
        </button>

        <button
          onClick={() => setActiveSection('microgrid')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'microgrid' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Microgrid Performance & Map ({microgridNodes.length})
        </button>

        <button
          onClick={() => setActiveSection('roi')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'roi' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Expected Savings & ROI
        </button>

        <button
          onClick={() => setActiveSection('carbon')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'carbon' 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Carbon Reduction
        </button>
      </div>

      {/* INTERACTIVE DIGITAL TWIN SIMULATOR CONTROLS */}
      <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Interactive Renewable Energy Simulation Controls
            </h2>
            <p className="text-[10px] text-white/50">
              Adjust photovoltaic capacity, wind turbine count, battery size, and capex budget to re-calculate clean energy yields, financial payback, and CO₂ reduction.
            </p>
          </div>

          <button
            onClick={handleRunEnergySimulation}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Recalculate Energy Twin</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Slider 1: Solar Capacity */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> Solar PV Capacity
              </span>
              <span className="text-white font-bold">{solarScaleMW} MW</span>
            </div>
            <input
              type="range"
              min={20}
              max={300}
              step={5}
              value={solarScaleMW}
              onChange={(e) => setSolarScaleMW(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-amber-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Scales rooftop & ground solar farms</span>
          </div>

          {/* Slider 2: Wind Turbines */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> Wind Turbine Count
              </span>
              <span className="text-white font-bold">{turbineCountScale} Units</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={2}
              value={turbineCountScale}
              onChange={(e) => setTurbineCountScale(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-cyan-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">2.5 MW offshore & ridge turbines</span>
          </div>

          {/* Slider 3: Battery Storage */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Battery className="w-3 h-3 text-emerald-400" /> Battery Storage (BESS)
              </span>
              <span className="text-white font-bold">{batteryCapacityScaleMWh} MWh</span>
            </div>
            <input
              type="range"
              min={50}
              max={400}
              step={10}
              value={batteryCapacityScaleMWh}
              onChange={(e) => setBatteryCapacityScaleMWh(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Grid-scale Lithium Iron Phosphate</span>
          </div>

          {/* Slider 4: Capex Scale */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-purple-400" /> Project Capex Budget
              </span>
              <span className="text-white font-bold">${capexScaleMillions}M</span>
            </div>
            <input
              type="range"
              min={50}
              max={300}
              step={5}
              value={capexScaleMillions}
              onChange={(e) => setCapexScaleMillions(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-purple-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Recalculates payback period & NPV</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: SOLAR POTENTIAL & 24H GENERATION CURVE */}
      {(activeSection === 'overview' || activeSection === 'solar') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 24-Hour Solar Generation vs Load Demand Chart */}
          <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  1. Solar Photovoltaic 24-Hour Generation vs Load Demand Curve
                </h2>
                <p className="text-[10px] text-white/50">
                  Solar output (MW) overlaid against regional grid power demand.
                </p>
              </div>
              <span className="text-amber-400 font-mono font-bold text-xs">
                Peak: {solarData.peakCapacityMW} MW ({solarData.annualGenerationGWh} GWh/yr)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={solarData.hourlyGenerationCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="solarMW" name="Solar Output (MW)" stroke="#f59e0b" fillOpacity={1} fill="url(#solarGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="loadMW" name="Grid Demand Load (MW)" stroke="#3b82f6" fillOpacity={1} fill="url(#loadGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Solar Potential Metrics Panel */}
          <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Solar Irradiance & Rooftop Map
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Solar Irradiance</span>
                <span className="text-xl font-bold text-amber-400 block">{solarData.solarIrradianceKwhM2Day} kWh/m²/day</span>
                <span className="text-[10px] text-emerald-400">Class A Solar Zone Rating</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Rooftop Suitability Index</span>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">{solarData.rooftopSuitabilityScore} / 100</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">HIGH POTENTIAL</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${solarData.rooftopSuitabilityScore}%` }} />
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Suitable Rooftop & Surface Area</span>
                <span className="text-lg font-bold text-cyan-400 block">{solarData.suitableRoofAreaSqM.toLocaleString()} m²</span>
                <span className="text-[10px] text-white/50 block">Ideal tilt: 28° South orientation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: WIND POTENTIAL & VELOCITY DISTRIBUTION */}
      {(activeSection === 'overview' || activeSection === 'wind') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wind Direction Distribution */}
          <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  2. Wind Velocity & Direction Frequency Distribution (Wind Rose)
                </h2>
                <p className="text-[10px] text-white/50">
                  Dominant wind directions and average wind speeds at 100m hub height.
                </p>
              </div>
              <span className="text-cyan-400 font-mono font-bold text-xs">
                Avg Wind: {windData.avgWindSpeedMs} m/s ({windData.annualWindGenerationGWh} GWh/yr)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={windData.windRoseDirectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="direction" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="frequencyPct" name="Direction Frequency (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgSpeedMs" name="Avg Velocity (m/s)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wind Fleet Status Panel */}
          <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                Wind Turbine Fleet Specs
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Active Wind Turbines</span>
                <span className="text-xl font-bold text-cyan-400 block">{windData.installedTurbineCount} Units</span>
                <span className="text-[10px] text-white/50 block">Nameplate 2.5 MW Direct-Drive Turbines</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Capacity Factor</span>
                <span className="text-xl font-bold text-emerald-400 block">{windData.capacityFactorPct}%</span>
                <span className="text-[10px] text-emerald-300 block">Top 10% Coastal Ridge Efficiency</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Cut-In / Cut-Out Speeds</span>
                <span className="text-sm font-bold text-white block">3.0 m/s – 25.0 m/s</span>
                <span className="text-[10px] text-white/50 block">Smart Yaw & Pitch Angle Control Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: BATTERY STORAGE (BESS) */}
      {(activeSection === 'overview' || activeSection === 'battery') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Battery State of Charge & Flow Curve */}
          <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  3. Battery Energy Storage System (BESS) State of Charge & Net Flow
                </h2>
                <p className="text-[10px] text-white/50">
                  24-hour battery SoC % and charge (+MW) / discharge (-MW) flow rate.
                </p>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-xs">
                Capacity: {batteryData.totalCapacityMWh} MWh ({batteryData.currentStateOfChargePct}% Current)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={batteryData.hourlyStateOfCharge} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="socPct" name="State of Charge (%)" stroke="#10b981" fillOpacity={1} fill="url(#socGrad)" strokeWidth={2.5} />
                  <Bar dataKey="netFlowMW" name="Charge/Discharge Power (MW)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Battery Health & Tech Specs */}
          <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Battery className="w-4 h-4 text-emerald-400" />
                BESS Health & Telemetry
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Battery Chemistry</span>
                <span className="text-sm font-bold text-white block">{batteryData.chemistryType}</span>
                <span className="text-[10px] text-emerald-400">Zero Thermal Runaway Risk Rating</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Round-Trip Efficiency</span>
                <span className="text-xl font-bold text-emerald-400 block">{batteryData.roundTripEfficiencyPct}%</span>
                <span className="text-[10px] text-white/50 block">Inverter & cooling loss included</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Remaining Cycle Health</span>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-cyan-400">{batteryData.cycleLifeRemainingPct}%</span>
                  <span className="text-[10px] text-white/50">6,500 / 7,000 Cycles</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${batteryData.cycleLifeRemainingPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MICROGRID PERFORMANCE & INTERACTIVE MAP */}
      {(activeSection === 'overview' || activeSection === 'microgrid') && (
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                4. Regional Microgrid Network Performance & Interactive Node Map
              </h2>
              <p className="text-[10px] text-white/50">
                Autonomous microgrids with dynamic islanding, voltage stability, and grid independence scoring.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Grid Overall Independence: 88.5% • Frequency: 60.00 Hz
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Map Visualizer */}
            <div className="lg:col-span-7 bg-black/40 border border-white/10 rounded-2xl p-4 relative min-h-[320px] flex flex-col justify-between overflow-hidden shadow-inner">
              {/* Grid Background Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white">INTERACTIVE MICROGRID MAP</span>
                </div>

                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-white/60">
                  Click a node pin to inspect status
                </div>
              </div>

              {/* Map Pins */}
              <div className="relative z-10 my-12 grid grid-cols-2 gap-6 sm:gap-10 p-4">
                {microgridNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const statusColor = 
                    node.status === 'Optimal' ? '#10b981' :
                    node.status === 'Islanding Active' ? '#3b82f6' : '#f59e0b';

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                        isSelected 
                          ? 'bg-white/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' 
                          : 'bg-black/40 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" style={{ color: statusColor }} />
                          {node.name}
                        </span>
                        <span 
                          className="w-2 h-2 rounded-full animate-ping"
                          style={{ backgroundColor: statusColor }}
                        />
                      </div>

                      <div className="text-[10px] font-mono text-white/50 mt-1">
                        {node.district}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-white/10">
                        <span className="text-cyan-400 font-bold">Solar: {node.solarMW}MW | Wind: {node.windMW}MW</span>
                        <span className="text-emerald-400 font-bold">{node.gridIndependencePct}% Ind.</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Node Details Box */}
              {selectedNode && (
                <div className="relative z-10 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-cyan-400 font-bold">{selectedNode.name}</span>
                    <span className="text-white/50 text-[10px] ml-2">[{selectedNode.coordinates}]</span>
                    <p className="text-[10px] text-white/60">
                      Load: {selectedNode.loadMW} MW | Frequency: {selectedNode.frequencyHz} Hz | Voltage: {selectedNode.voltageKV} kV
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleIslanding(selectedNode.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all cursor-pointer shrink-0"
                  >
                    Toggle Islanding
                  </button>
                </div>
              )}
            </div>

            {/* Microgrid Nodes Cards List */}
            <div className="lg:col-span-5 space-y-3">
              {microgridNodes.map((node) => {
                const statusColor = 
                  node.status === 'Optimal' ? '#10b981' :
                  node.status === 'Islanding Active' ? '#3b82f6' : '#f59e0b';

                return (
                  <div key={node.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{node.name}</span>
                      <span 
                        className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono border"
                        style={{ 
                          backgroundColor: `${statusColor}15`, 
                          color: statusColor, 
                          borderColor: `${statusColor}40` 
                        }}
                      >
                        {node.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1">
                      <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                        <span className="text-white/40 block">Solar/Wind</span>
                        <span className="text-amber-400 font-bold">{node.solarMW + node.windMW} MW</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                        <span className="text-white/40 block">BESS Size</span>
                        <span className="text-emerald-400 font-bold">{node.batteryMWh} MWh</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                        <span className="text-white/40 block">Grid Indep.</span>
                        <span className="text-cyan-400 font-bold">{node.gridIndependencePct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1">
                      <span>Freq: {node.frequencyHz} Hz • Volts: {node.voltageKV} kV</span>
                      <button
                        onClick={() => handleToggleIslanding(node.id)}
                        className="text-cyan-400 hover:underline font-bold cursor-pointer"
                      >
                        {node.status === 'Islanding Active' ? 'Re-sync Grid' : 'Activate Islanding'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: EXPECTED SAVINGS, ROI & CUMULATIVE CASH FLOW */}
      {(activeSection === 'overview' || activeSection === 'roi') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cumulative Cash Flow Curve */}
          <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  5. 20-Year Cumulative Cash Flow & Payback Horizon ($ USD)
                </h2>
                <p className="text-[10px] text-white/50">
                  Breakeven year threshold leading into long-term net positive revenue generation.
                </p>
              </div>
              <span className="text-purple-400 font-mono font-bold text-xs">
                Payback: {financials.paybackPeriodYears} Years | NPV: ${(financials.netPresentValue20YrUSD / 1000000).toFixed(1)}M
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financials.cashFlowForecastYears} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    formatter={(val: any) => `$${(Number(val) / 1000000).toFixed(1)}M`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="cumulativeSavingsUSD" name="Cumulative Net Position ($M)" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial ROI Summary Card */}
          <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                Financial ROI Metrics
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Initial Capex</span>
                <span className="text-xl font-bold text-white block">${(financials.initialCapexUSD / 1000000).toFixed(1)}M USD</span>
                <span className="text-[10px] text-white/50 block">Includes PV, wind, BESS & microgrid controllers</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Annual Opex Savings</span>
                <span className="text-xl font-bold text-emerald-400 block">${(financials.annualOpexSavingsUSD / 1000000).toFixed(1)}M / year</span>
                <span className="text-[10px] text-emerald-300 block">Fossil fuel power purchase offset</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-white/40 block text-[10px]">Levelized Cost of Energy (LCOE)</span>
                <span className="text-lg font-bold text-cyan-400 block">${financials.levelizedCostOfEnergyUSDPerKWh} / kWh</span>
                <span className="text-[10px] text-cyan-300 block">vs $0.145/kWh grid baseline</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: CARBON REDUCTION & DECARBONIZATION IMPACT */}
      {(activeSection === 'overview' || activeSection === 'carbon') && (
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              6. Carbon Reduction & Environmental Impact Equivalencies
            </h2>
            <p className="text-[10px] text-white/50">
              Quantified greenhouse gas mitigation, coal displacement, and ecological equivalencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/50">
                <span>ANNUAL CO₂ OFFSET</span>
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {carbonStats.annualCO2OffsetMetricTons.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/40 font-mono block">Metric Tons CO₂ / year</span>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/50">
                <span>TREES EQUIVALENT</span>
                <Trees className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-white font-mono">
                {(carbonStats.equivalentTreesPlanted / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-white/40 font-mono block">Equivalent Trees Planted</span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/50">
                <span>COAL PLANTS RETIRED</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-2xl font-extrabold text-rose-400 font-mono">
                {carbonStats.equivalentCoalPlantsRetired}
              </span>
              <span className="text-[10px] text-white/40 font-mono block">Coal Power Plants Offset</span>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/50">
                <span>OIL REPLACED</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                {(carbonStats.fossilFuelReplacedBarrels / 1000).toFixed(0)}k
              </span>
              <span className="text-[10px] text-white/40 font-mono block">Barrels of Oil Displaced/yr</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
