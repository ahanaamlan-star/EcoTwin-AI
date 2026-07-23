import React, { useState } from 'react';
import { 
  Droplets, 
  Waves, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Sliders, 
  Sparkles, 
  FileSpreadsheet, 
  Wrench, 
  ShieldAlert, 
  Cpu, 
  Compass, 
  Layers, 
  Search, 
  ArrowUpRight, 
  Clock, 
  Building2, 
  RefreshCw,
  Zap,
  Gauge,
  Radio,
  CloudRain
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
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  ReservoirData, 
  GroundwaterAquiferData, 
  RainfallDataPoint, 
  SectorConsumptionData, 
  PipeLeakAlert, 
  WaterDemandForecastPoint, 
  AIShortagePrediction,
  TwinRegion 
} from '../types';
import { 
  DEFAULT_RESERVOIRS, 
  DEFAULT_GROUNDWATER_AQUIFERS, 
  DEFAULT_RAINFALL_ANALYTICS, 
  DEFAULT_SECTOR_CONSUMPTION, 
  DEFAULT_LEAK_ALERTS, 
  DEFAULT_DEMAND_FORECAST, 
  DEFAULT_AI_SHORTAGE_PREDICTIONS 
} from '../data/mockTwinData';

interface WaterIntelligenceProps {
  region?: TwinRegion;
  onNavigateToCopilot?: (prompt: string) => void;
  onNavigateToReports?: (markdown: string) => void;
}

export const WaterIntelligence: React.FC<WaterIntelligenceProps> = ({
  region,
  onNavigateToCopilot,
  onNavigateToReports
}) => {
  // State
  const [reservoirs, setReservoirs] = useState<ReservoirData[]>(DEFAULT_RESERVOIRS);
  const [aquifers, setAquifers] = useState<GroundwaterAquiferData[]>(DEFAULT_GROUNDWATER_AQUIFERS);
  const [rainfallData, setRainfallData] = useState<RainfallDataPoint[]>(DEFAULT_RAINFALL_ANALYTICS);
  const [consumptionSectors, setConsumptionSectors] = useState<SectorConsumptionData[]>(DEFAULT_SECTOR_CONSUMPTION);
  const [leakAlerts, setLeakAlerts] = useState<PipeLeakAlert[]>(DEFAULT_LEAK_ALERTS);
  const [demandForecast, setDemandForecast] = useState<WaterDemandForecastPoint[]>(DEFAULT_DEMAND_FORECAST);
  const [shortagePredictions, setShortagePredictions] = useState<AIShortagePrediction[]>(DEFAULT_AI_SHORTAGE_PREDICTIONS);

  const [activeSection, setActiveSection] = useState<'overview' | 'reservoirs' | 'groundwater' | 'rainfall' | 'consumption' | 'leaks' | 'ai-shortage'>('overview');

  // Simulation parameters for AI Shortage Prediction
  const [agriEfficiencyGainPct, setAgriEfficiencyGainPct] = useState<number>(0);
  const [desalinationBoostMLD, setDesalinationBoostMLD] = useState<number>(0);
  const [tempAnomalyC, setTempAnomalyC] = useState<number>(3.2);

  // Status feedback alert
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Computed Totals
  const totalCapacityMCM = reservoirs.reduce((a, r) => a + r.capacityMCM, 0);
  const totalCurrentMCM = reservoirs.reduce((a, r) => a + r.currentMCM, 0);
  const overallStoragePct = ((totalCurrentMCM / totalCapacityMCM) * 100).toFixed(1);

  const totalDemandMLD = consumptionSectors.reduce((a, s) => a + s.mld, 0);
  const totalLeaksLossLph = leakAlerts.filter(l => l.status !== 'Resolved').reduce((a, l) => a + l.estimatedLossLph, 0);

  // Handle Repair Dispatch
  const handleDispatchRepair = (leakId: string) => {
    setLeakAlerts(prev => prev.map(l => {
      if (l.id === leakId) {
        return { ...l, status: 'Repair Dispatched' };
      }
      return l;
    }));
    setActionNotice(`🔧 Rapid Repair Team dispatched to pipe segment ${leakId}! Pressure containment active.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Handle Isolate Valve
  const handleIsolateValve = (leakId: string) => {
    setLeakAlerts(prev => prev.map(l => {
      if (l.id === leakId) {
        return { ...l, status: 'Isolated' };
      }
      return l;
    }));
    setActionNotice(`⚡ Automated pressure relief valve isolated for segment ${leakId}. Water loss halted.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Recalculate AI Demand & Shortages
  const handleRunAiShortageModel = () => {
    const updatedForecast = demandForecast.map(pt => {
      const baseDemand = pt.projectedDemandMLD;
      const adjustedDemand = Math.round(baseDemand * (1 + (tempAnomalyC * 0.02) - (agriEfficiencyGainPct * 0.003)));
      const adjustedSupply = pt.availableSupplyMLD + desalinationBoostMLD;
      const gap = adjustedSupply - adjustedDemand;
      return {
        ...pt,
        projectedDemandMLD: adjustedDemand,
        availableSupplyMLD: adjustedSupply,
        shortageGapMLD: gap < 0 ? gap : 0
      };
    });

    setDemandForecast(updatedForecast);

    setActionNotice('🧠 AI Neural Water Shortage Predictor recalibrated! Updated 8-week supply-demand equilibrium.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Export Water Intelligence Briefing
  const handleExportWaterBriefing = () => {
    const markdown = `# Regional Water Intelligence & Shortage Prediction Report

**Region**: ${region?.name || 'Metropolis Delta Hub'}  
**Overall Reservoir Storage**: ${overallStoragePct}% (${totalCurrentMCM} MCM / ${totalCapacityMCM} MCM)  
**Total Daily Consumption**: ${totalDemandMLD} MLD  
**Active Pipe Leakage Loss**: ${totalLeaksLossLph.toLocaleString()} L/hr across ${leakAlerts.filter(l => l.status !== 'Resolved').length} detected bursts  

---

## 1. Reservoir Water Storage Matrix
${reservoirs.map(r => `- **${r.name}**: ${r.percentageFull}% (${r.currentMCM}/${r.capacityMCM} MCM) [Inflow: ${r.inflowRateM3s} m³/s | Outflow: ${r.outflowRateM3s} m³/s] - Status: ${r.status}`).join('\n')}

---

## 2. Groundwater Aquifer Monitoring
${aquifers.map(a => `- **${a.name}**: Depth ${a.depthToWaterMeters}m (Baseline ${a.baselineDepthMeters}m) | Depletion Rate: ${a.depletionRateCmYr} cm/yr | Salinity: ${a.salinityPPM} PPM | Health: ${a.healthIndex}/100`).join('\n')}

---

## 3. Acoustic Pipe Leak Detection Alerts
${leakAlerts.map(l => `- **${l.district}** (${l.pipelineSegment}): ${l.estimatedLossLph.toLocaleString()} L/hr loss, Pressure drop ${l.pressureDropPsi} PSI [Urgency: ${l.urgency} | Status: ${l.status}]`).join('\n')}

---

## 4. AI Shortage Risk Predictions
${shortagePredictions.map(sp => `
### District: ${sp.districtName}
- **Shortage Probability**: ${sp.shortageProbabilityPct}% [Risk Level: ${sp.riskLevel}]
- **Reserve Remaining**: ${sp.daysOfReserveRemaining} Days
- **Root Cause**: ${sp.primaryCause}
- **Recommended Interventions**:
${sp.recommendedActions.map(act => `  - ${act}`).join('\n')}
`).join('\n')}
`;

    if (onNavigateToReports) {
      onNavigateToReports(markdown);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> WATER INTELLIGENCE & SHORTAGE PREDICTOR
            </span>
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              Smart Hydrological Mesh v4.2 • 420 IoT Nodes
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Reservoirs, Aquifers, Leak Telemetry & AI Shortage Forecast
          </h1>
          <p className="text-xs text-white/50 mt-0.5 max-w-3xl">
            Real-time analytics for reservoir capacity, groundwater table depletion, acoustic leak detection, and AI predictive water shortage modeling.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onNavigateToCopilot) {
                onNavigateToCopilot("Analyze our regional water shortage probability, active acoustic pipe leaks, and recommend immediate supply optimization measures.");
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Water Copilot</span>
          </button>

          <button
            onClick={handleExportWaterBriefing}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
            <span>Export Water Briefing</span>
          </button>
        </div>
      </div>

      {/* Alert banner if triggered */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <span className="text-[10px] text-cyan-400/60 uppercase font-mono">HYDROLOGICAL MESH</span>
        </div>
      )}

      {/* TOP 4 KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Reservoir Storage */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>RESERVOIR STORAGE</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white font-mono">{overallStoragePct}%</span>
            <span className="text-xs text-cyan-400 font-mono">({totalCurrentMCM} / {totalCapacityMCM} MCM)</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
              style={{ width: `${overallStoragePct}%` }}
            />
          </div>
          <span className="text-[10px] text-white/40 font-mono block">4 Major Dams & Basins Monitored</span>
        </div>

        {/* Card 2: Groundwater Depletion */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>GROUNDWATER DEPTH</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">42.8m</span>
            <span className="text-xs text-rose-400 font-mono">+48.5 cm/yr</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Baseline: 28.0m</span>
            <span className="text-amber-400 font-bold">Salinity: 380 PPM</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono block">Central Alluvial Deep Aquifer</span>
        </div>

        {/* Card 3: Acoustic Pipe Leaks & Loss */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>ACOUSTIC LEAK LOSS</span>
            <Wrench className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-rose-400 font-mono">{totalLeaksLossLph.toLocaleString()}</span>
            <span className="text-xs text-white/50 font-mono">L/hr</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-rose-400 font-bold">{leakAlerts.filter(l => l.status === 'Detected').length} Unhandled Leaks</span>
            <span className="text-emerald-400 font-bold">{leakAlerts.filter(l => l.status !== 'Detected').length} Contained</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono block">IoT Acoustic Sensor Telemetry</span>
        </div>

        {/* Card 4: AI Shortage Probability */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-xs text-white/50 font-mono">
            <span>AI SHORTAGE RISK</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-rose-400 font-mono">88%</span>
            <span className="text-xs text-rose-400 font-mono">18 Days Reserve</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>South Valley Belt</span>
            <span className="text-rose-400 font-bold uppercase">CRITICAL</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono block">Neural Demand Forecast Model</span>
        </div>
      </div>

      {/* SECTION TABS NAV */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'overview' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          All Water Modules
        </button>

        <button
          onClick={() => setActiveSection('reservoirs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'reservoirs' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Reservoir Levels
        </button>

        <button
          onClick={() => setActiveSection('groundwater')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'groundwater' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Groundwater
        </button>

        <button
          onClick={() => setActiveSection('rainfall')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'rainfall' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Rainfall & Precip
        </button>

        <button
          onClick={() => setActiveSection('consumption')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'consumption' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Consumption & NRW
        </button>

        <button
          onClick={() => setActiveSection('leaks')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'leaks' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Leak Detection ({leakAlerts.filter(l => l.status === 'Detected').length})
        </button>

        <button
          onClick={() => setActiveSection('ai-shortage')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'ai-shortage' 
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          AI Shortage Predictor
        </button>
      </div>

      {/* SECTION 1: RESERVOIR LEVELS */}
      {(activeSection === 'overview' || activeSection === 'reservoirs') && (
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Waves className="w-4 h-4 text-cyan-400" />
                1. Reservoir Storage Levels & Inflow/Outflow Balance
              </h2>
              <p className="text-[10px] text-white/50">
                Primary dams and storage basins supporting municipal, agricultural, and industrial grids.
              </p>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">
              Total Current Storage: {totalCurrentMCM} / {totalCapacityMCM} MCM ({overallStoragePct}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reservoirs.map((res) => {
              const statusColor = 
                res.status === 'Optimal' ? '#10b981' :
                res.status === 'Caution' ? '#f59e0b' : '#ef4444';

              return (
                <div key={res.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white block">{res.name}</span>
                    <span 
                      className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono border"
                      style={{ 
                        backgroundColor: `${statusColor}15`, 
                        color: statusColor, 
                        borderColor: `${statusColor}40` 
                      }}
                    >
                      {res.status}
                    </span>
                  </div>

                  {/* Level Gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span>Capacity Level</span>
                      <span className="text-white font-bold">{res.percentageFull}% ({res.currentMCM} MCM)</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-700" 
                        style={{ width: `${res.percentageFull}%`, backgroundColor: statusColor }}
                      />
                    </div>
                  </div>

                  {/* Flow Rates */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                    <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                      <span className="text-white/40 block flex items-center">
                        <TrendingUp className="w-3 h-3 text-emerald-400 mr-1" />
                        Inflow
                      </span>
                      <span className="text-emerald-400 font-bold">{res.inflowRateM3s} m³/s</span>
                    </div>
                    <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                      <span className="text-white/40 block flex items-center">
                        <TrendingDown className="w-3 h-3 text-rose-400 mr-1" />
                        Outflow
                      </span>
                      <span className="text-rose-400 font-bold">{res.outflowRateM3s} m³/s</span>
                    </div>
                  </div>

                  <span className="text-[9px] text-white/40 font-mono block">
                    Target: {res.primarySupplyTarget}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: GROUNDWATER & AQUIFERS */}
      {(activeSection === 'overview' || activeSection === 'groundwater') && (
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              2. Groundwater Table Depletion & Aquifer Salinity
            </h2>
            <p className="text-[10px] text-white/50">
              Subsurface water depth monitoring, depletion rates, and saltwater intrusion risk index.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aquifers.map((aq) => {
              const depthDiff = (aq.depthToWaterMeters - aq.baselineDepthMeters).toFixed(1);
              return (
                <div key={aq.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">{aq.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      aq.status === 'Healthy' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : aq.status === 'Moderate Depletion'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {aq.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2.5 bg-black/20 rounded-xl space-y-1">
                      <span className="text-white/40 block">Depth To Water</span>
                      <span className="text-lg font-extrabold text-amber-400 block">{aq.depthToWaterMeters}m</span>
                      <span className="text-rose-400 font-bold block">+{depthDiff}m vs Baseline</span>
                    </div>

                    <div className="p-2.5 bg-black/20 rounded-xl space-y-1">
                      <span className="text-white/40 block">Depletion Speed</span>
                      <span className="text-lg font-extrabold text-rose-400 block">{aq.depletionRateCmYr} cm/yr</span>
                      <span className="text-cyan-400 block">Recharge: {aq.rechargeRatePct}%</span>
                    </div>
                  </div>

                  {/* Salinity & Health Meter */}
                  <div className="space-y-1 text-[10px] font-mono">
                    <div className="flex justify-between text-white/50">
                      <span>Salinity Index</span>
                      <span className="text-white font-bold">{aq.salinityPPM} PPM</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Aquifer Health Score</span>
                      <span className="text-emerald-400 font-bold">{aq.healthIndex} / 100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: RAINFALL ANALYTICS & DEMAND / CONSUMPTION */}
      {(activeSection === 'overview' || activeSection === 'rainfall' || activeSection === 'consumption') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rainfall Analytics Chart */}
          <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  3. Rainfall Analytics: Historical vs Actual vs Forecast
                </h2>
                <p className="text-[10px] text-white/50">
                  Monthly precipitation depth (mm) across watershed catchments.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rainfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="historicalAvgMm" name="Historical Avg (mm)" fill="#3b82f6" opacity={0.4} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="currentActualMm" name="Actual Rainfall (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="forecastMm" name="AI Precip Forecast (mm)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Consumption & NRW Loss */}
          <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-purple-400" />
                  4. Consumption Breakdown (Total: {totalDemandMLD} MLD)
                </h2>
                <p className="text-[10px] text-white/50">
                  Sector allocation & Non-Revenue Water (NRW) efficiency ratings.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {consumptionSectors.map((sec, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                      {sec.sector}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{sec.mld} MLD ({sec.percentage}%)</span>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${sec.percentage}%`, backgroundColor: sec.color }} 
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-white/40 pt-0.5">
                    <span>Efficiency Rating: <strong className="text-emerald-400">{sec.efficiencyRating}</strong></span>
                    {sec.sector.includes('Loss') && <span className="text-rose-400 font-bold">Priority Containment Zone</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ACOUSTIC PIPE LEAK DETECTION */}
      {(activeSection === 'overview' || activeSection === 'leaks') && (
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-400" />
                5. Real-Time Acoustic IoT Pipe Leak Telemetry
              </h2>
              <p className="text-[10px] text-white/50">
                Vibration frequencies & acoustic pressure drop sensors detecting underground bursts.
              </p>
            </div>
            <span className="text-[10px] text-rose-400 font-mono font-bold">
              Total Non-Revenue Water Burst Loss: {totalLeaksLossLph.toLocaleString()} L/hr
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leakAlerts.map((leak) => (
              <div key={leak.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">{leak.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    leak.urgency === 'Critical Burst' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' 
                      : leak.urgency === 'High Leak'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {leak.urgency}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{leak.district}</h4>
                  <span className="text-[10px] text-white/50 font-mono block">{leak.pipelineSegment}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                    <span className="text-white/40 block">Water Loss</span>
                    <span className="text-rose-400 font-bold">{leak.estimatedLossLph.toLocaleString()} L/hr</span>
                  </div>
                  <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                    <span className="text-white/40 block">Pressure Drop</span>
                    <span className="text-amber-400 font-bold">-{leak.pressureDropPsi} PSI</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>Freq: {leak.acousticFreqHz} Hz</span>
                  <span className="text-emerald-400 font-bold">{leak.status}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleDispatchRepair(leak.id)}
                    disabled={leak.status === 'Repair Dispatched' || leak.status === 'Resolved'}
                    className="py-1.5 px-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold transition-all cursor-pointer disabled:opacity-40"
                  >
                    Dispatch Repair
                  </button>
                  <button
                    onClick={() => handleIsolateValve(leak.id)}
                    disabled={leak.status === 'Isolated' || leak.status === 'Resolved'}
                    className="py-1.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] font-mono font-bold transition-all cursor-pointer disabled:opacity-40"
                  >
                    Isolate Valve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: DEMAND FORECAST & AI SHORTAGE PREDICTOR */}
      {(activeSection === 'overview' || activeSection === 'ai-shortage') && (
        <div className="space-y-6">
          {/* Interactive Simulation Parameters Bar */}
          <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  6. AI Shortage Simulator & Demand Forecast Engine
                </h2>
                <p className="text-[10px] text-white/50">
                  Simulate agricultural water efficiency gains, heatwave anomalies, and desalination plant ramps.
                </p>
              </div>
              <button
                onClick={handleRunAiShortageModel}
                className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-mono font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recalculate AI Model</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              {/* Slider 1: Heatwave Anomaly */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-rose-400 font-bold">Temp Anomaly</span>
                  <span className="text-white font-bold">+{tempAnomalyC.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={6.0}
                  step={0.2}
                  value={tempAnomalyC}
                  onChange={(e) => setTempAnomalyC(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg accent-rose-400 cursor-pointer"
                />
                <span className="text-[9px] text-white/40 block">Drives irrigation & cooling demand</span>
              </div>

              {/* Slider 2: Agri Efficiency Gain */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-emerald-400 font-bold">Agri Smart Drip Gain</span>
                  <span className="text-white font-bold">+{agriEfficiencyGainPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={2}
                  value={agriEfficiencyGainPct}
                  onChange={(e) => setAgriEfficiencyGainPct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-400 cursor-pointer"
                />
                <span className="text-[9px] text-white/40 block">Reduces bulk canal drawdowns</span>
              </div>

              {/* Slider 3: Desalination Ramp */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-cyan-400 font-bold">Desalination Ramp</span>
                  <span className="text-white font-bold">+{desalinationBoostMLD} MLD</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={desalinationBoostMLD}
                  onChange={(e) => setDesalinationBoostMLD(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg accent-cyan-400 cursor-pointer"
                />
                <span className="text-[9px] text-white/40 block">Ramps coastal reverse-osmosis supply</span>
              </div>
            </div>
          </div>

          {/* 8-Week Predictive Demand vs Supply Curve */}
          <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                8-Week Supply vs Projected Demand Curve (MLD)
              </h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="period" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="projectedDemandMLD" name="Projected Demand (MLD)" stroke="#ef4444" fillOpacity={1} fill="url(#demandGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="availableSupplyMLD" name="Available Supply (MLD)" stroke="#06b6d4" fillOpacity={1} fill="url(#supplyGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Shortage District Risk Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shortagePredictions.map((sp, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3 relative shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                    sp.riskLevel === 'Critical' 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse' 
                      : sp.riskLevel === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {sp.riskLevel} Shortage Risk
                  </span>
                  <span className="text-xs font-extrabold text-rose-400 font-mono">{sp.shortageProbabilityPct}% PROB</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{sp.districtName}</h4>
                  <div className="text-xs text-amber-300 font-mono font-bold mt-0.5">
                    ⏳ {sp.daysOfReserveRemaining} Days of Reserve Remaining
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <strong className="text-white block font-mono text-[10px] uppercase">Root Cause Analysis:</strong>
                  {sp.primaryCause}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-white/40 font-mono uppercase block">AI Interventions:</span>
                  <ul className="space-y-1 text-[11px] text-white/70 font-mono">
                    {sp.recommendedActions.map((act, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-cyan-400 mr-1.5">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
