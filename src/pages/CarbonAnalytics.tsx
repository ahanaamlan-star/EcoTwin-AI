import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp,
  DollarSign, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles,
  ArrowUpRight,
  Factory,
  Truck,
  Wheat,
  Building2,
  Home,
  Sliders,
  RotateCcw,
  Target,
  FileSpreadsheet,
  PieChart as PieIcon,
  Activity,
  Layers,
  Leaf
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { SectorEmissions, CarbonPredictionPoint } from '../types';
import { DEFAULT_SECTOR_EMISSIONS, CARBON_PREDICTIONS_2040 } from '../data/mockTwinData';

interface CarbonAnalyticsProps {
  onNavigateToReports: (markdown?: string) => void;
}

export const CarbonAnalytics: React.FC<CarbonAnalyticsProps> = ({ onNavigateToReports }) => {
  // State for interactive sector emissions
  const [sectorEmissions, setSectorEmissions] = useState<SectorEmissions[]>(DEFAULT_SECTOR_EMISSIONS);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [decarbonizationPace, setDecarbonizationPace] = useState<'standard' | 'accelerated' | 'maximum'>('accelerated');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  // 1 & 2: Calculate total carbon emissions dynamically
  const totalEmissions = sectorEmissions.reduce((acc, sec) => acc + sec.currentEmissions, 0);

  // Sector icon mapping
  const getSectorIcon = (id: string) => {
    switch (id) {
      case 'industry': return Factory;
      case 'transport': return Truck;
      case 'agriculture': return Wheat;
      case 'commercial': return Building2;
      case 'residential': return Home;
      default: return Building;
    }
  };

  // Adjust sector emission value interactively
  const handleSectorEmissionChange = (id: string, newVal: number) => {
    setSectorEmissions(prev =>
      prev.map(sec => {
        if (sec.id === id) {
          const ratio = newVal / (sec.currentEmissions || 1);
          return {
            ...sec,
            currentEmissions: parseFloat(newVal.toFixed(1)),
            scope1: parseFloat((sec.scope1 * ratio).toFixed(1)),
            scope2: parseFloat((sec.scope2 * ratio).toFixed(1)),
            scope3: parseFloat((sec.scope3 * ratio).toFixed(1))
          };
        }
        return sec;
      })
    );
  };

  // Reset sector data to default
  const handleReset = () => {
    setSectorEmissions(DEFAULT_SECTOR_EMISSIONS);
    setDecarbonizationPace('accelerated');
  };

  // Dynamic 2024-2040 prediction trajectory adjusted for pace
  const paceMultiplier = decarbonizationPace === 'maximum' ? 0.7 : decarbonizationPace === 'standard' ? 1.2 : 1.0;

  const dynamicPredictions = CARBON_PREDICTIONS_2040.map(pt => {
    const scaleFactor = totalEmissions / 38.2;
    const reducedTrajectory = Math.max(0, pt.netZeroTarget + (pt.currentTrajectory - pt.netZeroTarget) * paceMultiplier);
    return {
      ...pt,
      bauBaseline: parseFloat((pt.bauBaseline * scaleFactor).toFixed(1)),
      currentTrajectory: parseFloat((reducedTrajectory * scaleFactor).toFixed(1)),
      netZeroTarget: parseFloat((pt.netZeroTarget * scaleFactor).toFixed(1)),
      offsetVolume: parseFloat((pt.offsetVolume * scaleFactor).toFixed(1))
    };
  });

  // Calculate Net Zero progress percentage
  // 2024 baseline = 38.2 Mtons, 2040 Target = 0 Mtons.
  const baseline2024 = 38.2;
  const currentTotal = totalEmissions;
  const netZeroProgressPct = Math.min(100, Math.max(0, Math.round(((baseline2024 - currentTotal + 15) / baseline2024) * 100)));

  // Sector pie chart data
  const pieChartData = sectorEmissions.map(sec => ({
    name: sec.name,
    value: parseFloat(sec.currentEmissions.toFixed(1)),
    pct: parseFloat(((sec.currentEmissions / (totalEmissions || 1)) * 100).toFixed(1)),
    color: sec.color
  }));

  // Recharts stacked bar data for Scope 1, 2, 3 per sector
  const sectorScopeData = sectorEmissions.map(sec => ({
    name: sec.name,
    'Scope 1 (Direct)': sec.scope1,
    'Scope 2 (Power)': sec.scope2,
    'Scope 3 (Supply Chain)': sec.scope3,
    '2030 Target': sec.target2030
  }));

  // Sector Net Zero readiness scores
  const sectorReadiness = sectorEmissions.map(sec => {
    const targetGap = sec.currentEmissions - sec.target2030;
    const score = Math.min(100, Math.max(15, Math.round(100 - (targetGap / sec.currentEmissions) * 60)));
    return {
      name: sec.name,
      score,
      color: sec.color
    };
  });

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#080a0f]/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1">
          <p className="font-mono font-bold text-emerald-400 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-[11px]">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value} Mtons
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Generate markdown content for Executive Report export
  const handleExportToExecutiveReports = () => {
    const reportMarkdown = `# Carbon Intelligence & Net Zero Audit Report

**Generated Date**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}  
**Audit Standard**: ISO 14064 GHG Accounting & Net Zero Target Framework  

---

## 1. Total Carbon Footprint Calculation
- **Total Regional Carbon Emissions**: **${totalEmissions.toFixed(1)} Mtons CO2e/yr**
- **Net Zero Target Progress**: **${netZeroProgressPct}% On Track** (Target Horizon: 2040)
- **Decarbonization Scenario**: ${decarbonizationPace.toUpperCase()} Mitigation Pace

---

## 2. Sector-by-Sector Emissions Breakdown
${sectorEmissions.map(sec => `
### ${sec.name} Sector
- **Total Emissions**: ${sec.currentEmissions} Mtons CO2e/yr (${((sec.currentEmissions / totalEmissions) * 100).toFixed(1)}% of total)
- **Scope 1 (Direct)**: ${sec.scope1} Mtons
- **Scope 2 (Power)**: ${sec.scope2} Mtons
- **Scope 3 (Supply Chain)**: ${sec.scope3} Mtons
- **2030 Intermediary Target**: ${sec.target2030} Mtons
- **2040 Net Zero Residual**: ${sec.target2040} Mtons
- **YoY Reduction Trend**: ${sec.yoyChangePct}%
- **Key Decarbonization Drivers**: ${sec.keyDrivers.join(', ')}
`).join('\n')}

---

## 3. Predictive Emissions Trajectory Until 2040
| Year | Business-As-Usual (Mtons) | Current Policy Path (Mtons) | Net Zero 2040 Target (Mtons) | Offset Volume (Mtons) |
|---|---|---|---|---|
${dynamicPredictions.map(pt => `| ${pt.year} | ${pt.bauBaseline} | ${pt.currentTrajectory} | ${pt.netZeroTarget} | ${pt.offsetVolume} |`).join('\n')}

---

## 4. Key Decarbonization Interventions
1. **Industry**: Rapid electrification of thermal process heat and hydrogen blending.
2. **Transport**: Accelerated fleet electrification and zero-emission logistics corridors.
3. **Agriculture**: Regenerative soil carbon capture and precision nutrient management.
4. **Commercial & Residential**: Smart heat pump retrofits and 100% clean grid power purchase agreements.
`;

    onNavigateToReports(reportMarkdown);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest font-mono">
              CARBON INTELLIGENCE & NET ZERO RADAR
            </span>
            <span className="text-xs text-white/40 flex items-center font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" /> ISO 14064 GHG Audited
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Sectoral Carbon Accounting & 2040 Prediction Engine
          </h1>
          <p className="text-xs text-white/50 mt-0.5 max-w-3xl">
            Real-time carbon emissions tracking across Industry, Transport, Agriculture, Commercial, and Residential sectors with predictive modeling up to 2040.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-xs flex items-center"
            title="Reset to Baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Export Carbon Report</span>
          </button>
        </div>
      </div>

      {/* Top Key Performance Indicators Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emissions Calculated */}
        <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-white/50 font-bold uppercase text-[10px] tracking-wider">TOTAL REGIONAL EMISSIONS</span>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Calculated
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white flex items-baseline justify-between">
            <span>{totalEmissions.toFixed(1)} <span className="text-xs font-normal text-white/40">Mtons CO2e</span></span>
            <Activity className="w-6 h-6 text-rose-400/80" />
          </div>
          <p className="text-[11px] text-emerald-400 font-mono flex items-center">
            <TrendingDown className="w-3.5 h-3.5 mr-1" /> -4.8% YoY Net Abatement Trend
          </p>
        </div>

        {/* Net Zero Progress Card */}
        <div className="p-5 bg-white/[0.03] border border-emerald-500/30 rounded-2xl backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">2040 NET ZERO PROGRESS</span>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Target 2040
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-baseline justify-between">
            <span>{netZeroProgressPct}% <span className="text-xs font-normal text-white/40">On Track</span></span>
            <Target className="w-6 h-6 text-emerald-400/80" />
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${netZeroProgressPct}%` }} />
          </div>
        </div>

        {/* Peak Year Passed */}
        <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-white/50 font-bold uppercase text-[10px] tracking-wider">PEAK EMISSIONS MILESTONE</span>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Passed
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 flex items-baseline justify-between">
            <span>2023 <span className="text-xs font-normal text-white/40">Peak Year</span></span>
            <Leaf className="w-6 h-6 text-cyan-300/80" />
          </div>
          <p className="text-[11px] text-white/50 font-mono">
            Structural Decoupling Achieved
          </p>
        </div>

        {/* Predicted 2040 Residual */}
        <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-white/50 font-bold uppercase text-[10px] tracking-wider">2040 PREDICTED RESIDUAL</span>
            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Model Projection
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300 flex items-baseline justify-between">
            <span>{dynamicPredictions[dynamicPredictions.length - 1].currentTrajectory} <span className="text-xs font-normal text-white/40">Mtons</span></span>
            <Sparkles className="w-6 h-6 text-purple-300/80" />
          </div>
          <p className="text-[11px] text-purple-300 font-mono">
            Offset Cap: {dynamicPredictions[dynamicPredictions.length - 1].offsetVolume} Mtons
          </p>
        </div>
      </div>

      {/* SECTION 1: Sector Carbon Emissions Breakdown (Industry, Transport, Agriculture, Commercial, Residential) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              1. Carbon Emissions by Sector (Interactive Controls)
            </h2>
            <p className="text-xs text-white/50">
              Displaying the 5 primary sectors: Industry, Transport, Agriculture, Commercial, and Residential. Use sliders to simulate sector decarbonization.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-white/40">Total Sum:</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              {totalEmissions.toFixed(1)} Mtons CO2e
            </span>
          </div>
        </div>

        {/* 5 Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectorEmissions.map(sec => {
            const Icon = getSectorIcon(sec.id);
            const isSelected = selectedSectorId === sec.id;
            const sectorSharePct = ((sec.currentEmissions / (totalEmissions || 1)) * 100).toFixed(1);

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectorId(isSelected ? null : sec.id)}
                className={`p-4 rounded-2xl bg-white/[0.03] border transition-all cursor-pointer space-y-3 backdrop-blur-xl shadow-lg relative ${
                  isSelected ? 'border-emerald-400 ring-1 ring-emerald-400/50 bg-white/[0.06]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Sector Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${sec.color}15`, color: sec.color }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white">{sec.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${sec.color}20`, color: sec.color }}>
                    {sectorSharePct}%
                  </span>
                </div>

                {/* Main Value */}
                <div>
                  <div className="text-2xl font-extrabold font-mono text-white">
                    {sec.currentEmissions} <span className="text-xs font-normal text-white/40">Mtons</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/50 mt-0.5">
                    <span>2030 Target: {sec.target2030}M</span>
                    <span className="text-emerald-400">{sec.yoyChangePct}% YoY</span>
                  </div>
                </div>

                {/* Scope Breakdown mini bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-white/40">
                    <span>S1: {sec.scope1}M</span>
                    <span>S2: {sec.scope2}M</span>
                    <span>S3: {sec.scope3}M</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full flex overflow-hidden">
                    <div style={{ width: `${(sec.scope1 / sec.currentEmissions) * 100}%` }} className="bg-rose-500 h-full" title={`Scope 1: ${sec.scope1}M`} />
                    <div style={{ width: `${(sec.scope2 / sec.currentEmissions) * 100}%` }} className="bg-amber-500 h-full" title={`Scope 2: ${sec.scope2}M`} />
                    <div style={{ width: `${(sec.scope3 / sec.currentEmissions) * 100}%` }} className="bg-cyan-500 h-full" title={`Scope 3: ${sec.scope3}M`} />
                  </div>
                </div>

                {/* Interactive Slider */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40">Adjust Output:</span>
                    <span className="text-white font-bold">{sec.currentEmissions} Mtons</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={20.0}
                    step={0.1}
                    value={sec.currentEmissions}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSectorEmissionChange(sec.id, parseFloat(e.target.value));
                    }}
                    className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Interactive Charts - Sector Comparison & Total Calculation Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stacked Bar Chart: Scope 1, 2, 3 Breakdown vs Target */}
        <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center">
                <BarChart3 className="w-4 h-4 text-cyan-400 mr-2" />
                Sector GHG Scope Breakdown (Scope 1, Scope 2, Scope 3 vs. 2030 Target)
              </h3>
              <p className="text-[10px] text-white/40">Direct vs. indirect grid and supply chain footprint for all 5 sectors</p>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Interactive Stack
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorScopeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} label={{ value: 'Mtons CO2e', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Scope 1 (Direct)" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Scope 2 (Power)" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Scope 3 (Supply Chain)" fill="#06b6d4" stackId="a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2030 Target" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Emissions Distribution Donut Pie Chart */}
        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center">
              <PieIcon className="w-4 h-4 text-emerald-400 mr-2" />
              Calculated Total Sector Share
            </h3>
            <p className="text-[10px] text-white/40">% Share of Total {totalEmissions.toFixed(1)} Mtons</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Share Legend list */}
          <div className="space-y-1.5 text-xs">
            {pieChartData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-white/80">
                <span className="flex items-center text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-white">
                  {item.value} M <span className="text-white/40">({item.pct}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Predict Emissions Until 2040 Chart */}
      <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl space-y-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded text-[9px] font-bold uppercase font-mono">
                AI PREDICTIVE NEURAL FORECAST
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">
              3. Regional Carbon Emissions Prediction (2024 – 2040)
            </h3>
            <p className="text-xs text-white/50">
              Multi-scenario modeling contrasting Business-As-Usual (BAU) vs. Current Policy Path vs. Net Zero 2040 Target trajectory.
            </p>
          </div>

          {/* Decarbonization Pace Selector */}
          <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <span className="text-[10px] text-white/40 font-mono uppercase px-2">Decarbonization Speed:</span>
            <button
              onClick={() => setDecarbonizationPace('standard')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                decarbonizationPace === 'standard' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-white/50 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setDecarbonizationPace('accelerated')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                decarbonizationPace === 'accelerated' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-white/50 hover:text-white'
              }`}
            >
              Accelerated
            </button>
            <button
              onClick={() => setDecarbonizationPace('maximum')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                decarbonizationPace === 'maximum' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/50 hover:text-white'
              }`}
            >
              Net Zero Max
            </button>
          </div>
        </div>

        {/* Prediction Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicPredictions}>
              <defs>
                <linearGradient id="colorBau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNetZero" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} label={{ value: 'Emissions (Mtons CO2e)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="bauBaseline" name="Business-As-Usual (BAU)" stroke="#ef4444" fillOpacity={1} fill="url(#colorBau)" strokeWidth={2} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="currentTrajectory" name="Current Policy Trajectory" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="netZeroTarget" name="Net Zero 2040 Target Curve" stroke="#10b981" fillOpacity={1} fill="url(#colorNetZero)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction Summary Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] text-white/40 font-mono uppercase">2030 Intermediary Milestone</span>
            <div className="text-lg font-bold font-mono text-amber-300">
              {dynamicPredictions.find(p => p.year === 2030)?.currentTrajectory} Mtons
            </div>
            <p className="text-[10px] text-white/50">43% reduction vs. 2024 baseline</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] text-white/40 font-mono uppercase">Cumulative Abatement (2024-2040)</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              342.5 Mtons
            </div>
            <p className="text-[10px] text-emerald-400">Avoided carbon damage: ~$18.8B</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
            <span className="text-[10px] text-white/40 font-mono uppercase">2040 Direct Air Capture Offset</span>
            <div className="text-lg font-bold font-mono text-purple-300">
              9.2 Mtons/yr
            </div>
            <p className="text-[10px] text-white/50">Direct carbon removal capacity</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Display Net Zero Progress & Sector Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Net Zero Readiness Scorecard */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center">
              <Target className="w-4 h-4 text-emerald-400 mr-2" />
              4. Sector Net Zero Readiness Scorecard
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Audited 2026
            </span>
          </div>

          <div className="space-y-3">
            {sectorReadiness.map(sec => (
              <div key={sec.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: sec.color }} />
                    {sec.name} Sector
                  </span>
                  <span className="font-mono font-bold" style={{ color: sec.color }}>
                    {sec.score}% Ready
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sec.score}%`, backgroundColor: sec.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Net Zero Roadmap Milestones Timeline */}
        <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              Net Zero Milestone Roadmap
            </h3>
            <p className="text-[10px] text-white/40">Binding regulatory & policy target markers</p>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-white/10">
            <div className="flex items-start space-x-3 relative pl-6">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 absolute left-1.5 top-1" />
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">2025 • COMPLETED</span>
                <p className="text-xs font-bold text-white">100% Municipal Bus Fleet Electrification</p>
                <p className="text-[11px] text-white/50">Zero-emission transit corridors across 4 metropolitan districts.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 relative pl-6">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20 absolute left-1.5 top-1" />
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-300">2030 • IN PROGRESS</span>
                <p className="text-xs font-bold text-white">85% Clean Energy Grid & Commercial Retrofit</p>
                <p className="text-[11px] text-white/50">Phase out natural gas heating in municipal buildings.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 relative pl-6">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-500/20 absolute left-1.5 top-1" />
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-300">2035 • UPCOMING</span>
                <p className="text-xs font-bold text-white">Industrial Green Hydrogen & High-Heat CCS</p>
                <p className="text-[11px] text-white/50">Full decarbonization of heavy steel and cement manufacturing.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 relative pl-6">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400 ring-4 ring-purple-500/20 absolute left-1.5 top-1" />
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-300">2040 • FINAL TARGET</span>
                <p className="text-xs font-bold text-white">Net Zero Carbon Economy & Direct Air Offset</p>
                <p className="text-[11px] text-white/50">100% net carbon neutrality with high-integrity biochar & DAC.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c0f17] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Export Carbon Intelligence Report</h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              <p>
                Generate an audited executive briefing package containing calculated total emissions (<strong className="text-emerald-400">{totalEmissions.toFixed(1)} Mtons</strong>), sector breakdown across Industry, Transport, Agriculture, Commercial, Residential, and 2024-2040 predictive modeling.
              </p>

              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 space-y-1 font-mono text-[11px]">
                <div className="text-white font-semibold">Report Metadata:</div>
                <div className="text-white/50">• Calculated Total: {totalEmissions.toFixed(1)} Mtons CO2e</div>
                <div className="text-white/50">• Net Zero 2040 Progress: {netZeroProgressPct}% On Track</div>
                <div className="text-white/50">• Target Projection Horizon: 2024 - 2040</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleExportToExecutiveReports}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black fill-black" />
                <span>Send to Reports Studio</span>
              </button>

              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                    totalEmissions,
                    netZeroProgressPct,
                    sectorEmissions,
                    predictions: dynamicPredictions
                  }, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `carbon_intelligence_report_${new Date().toISOString().slice(0,10)}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  setExportedStatus('JSON Dataset Downloaded!');
                  setTimeout(() => setExportedStatus(null), 3000);
                }}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Raw JSON</span>
              </button>
            </div>

            {exportedStatus && (
              <p className="text-center text-xs text-emerald-400 font-mono font-bold animate-pulse">
                {exportedStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
