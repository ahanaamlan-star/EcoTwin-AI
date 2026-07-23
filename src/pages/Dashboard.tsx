import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Sun,
  Wind, 
  Thermometer, 
  Waves, 
  Trees, 
  Award, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Globe2, 
  MapPin, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  Layers, 
  FileText, 
  BookOpen,
  ChevronRight,
  Info,
  ExternalLink,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ComposedChart, 
  Line 
} from 'recharts';
import { TwinRegion, District } from '../types';
import { MOCK_TIME_SERIES, MOCK_IOT_SENSORS } from '../data/mockTwinData';

interface DashboardProps {
  region: TwinRegion;
  onNavigate: (tab: string) => void;
  onNavigateToSimulator: (districtId?: string) => void;
  onNavigateToCopilot: (promptText: string) => void;
  onNavigateToReports: (data?: any) => void;
}

// Reusable Animated Counter component
const AnimatedCounter: React.FC<{
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}> = ({ value = 0, decimals = 0, prefix = '', suffix = '' }) => {
  const safeVal = typeof value === 'number' && !isNaN(value) ? value : 0;
  const [displayValue, setDisplayValue] = React.useState<number>(safeVal);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    const startValue = 0;
    const endValue = safeVal;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [safeVal]);

  const numVal = typeof displayValue === 'number' && !isNaN(displayValue) ? displayValue : 0;

  return (
    <span>
      {prefix}
      {numVal.toFixed(decimals ?? 0)}
      {suffix}
    </span>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  region,
  onNavigate,
  onNavigateToSimulator,
  onNavigateToCopilot,
  onNavigateToReports
}) => {
  const [activeMapLayer, setActiveMapLayer] = useState<'heat' | 'flood' | 'canopy' | 'grid'>('heat');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(region.districts[0] || null);
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [chartTimeframe, setChartTimeframe] = useState<'5Y' | '10Y' | '20Y'>('10Y');

  // Keep selected district in sync with region switch
  React.useEffect(() => {
    if (region.districts && region.districts.length > 0) {
      setSelectedDistrict(region.districts[0]);
    }
  }, [region]);

  // Derive Hero Metric values from active region
  const heroMetrics = [
    {
      id: 'emissions',
      label: 'Carbon Emissions',
      value: region?.baselineCO2Mtons ?? 14.8,
      decimals: 1,
      unit: 'Mtons/yr',
      trend: '-12.4%',
      isPositiveTrend: true, // Decreasing CO2 is positive
      icon: Activity,
      accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'Scope 1-3 Audit',
      target: 'Target: 5.4 Mtons by 2030'
    },
    {
      id: 'renewable',
      label: 'Renewable Energy %',
      value: region?.renewableEnergyPct ?? 65,
      decimals: 0,
      unit: '%',
      trend: '+8.5% YoY',
      isPositiveTrend: true,
      icon: Zap,
      accentColor: 'from-amber-500/20 to-emerald-500/10 border-amber-500/30 text-amber-400',
      badge: 'Grid Dispatch',
      target: 'Target: 85% Clean'
    },
    {
      id: 'water',
      label: 'Water Availability',
      value: (region?.waterStressIndex ?? 50) < 40 ? 88.4 : (region?.waterStressIndex ?? 50) < 70 ? 74.2 : 58.6,
      decimals: 1,
      unit: '% Capacity',
      trend: (region?.waterStressIndex ?? 50) > 60 ? '-3.2% Low Surge' : '+2.1% Stable',
      isPositiveTrend: (region?.waterStressIndex ?? 50) <= 60,
      icon: Droplets,
      accentColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      badge: 'Aquifer & Storage',
      target: 'Reservoir Supply Stable'
    },
    {
      id: 'aqi',
      label: 'Air Quality Index',
      value: region?.avgAQI ?? region?.currentAQI ?? 48,
      decimals: 0,
      unit: 'AQI',
      trend: (region?.avgAQI ?? region?.currentAQI ?? 48) < 50 ? 'Good Air Quality' : 'Moderate Ozone',
      isPositiveTrend: (region?.avgAQI ?? region?.currentAQI ?? 48) < 60,
      icon: Wind,
      accentColor: 'from-teal-500/20 to-cyan-500/10 border-teal-500/30 text-teal-300',
      badge: 'PM2.5 Sensor Mesh',
      target: 'Sub-50 EPA Benchmark'
    },
    {
      id: 'heat',
      label: 'Heat Risk',
      value: Math.round((region?.avgTempC ?? 22.4) * 15),
      decimals: 0,
      unit: '/100 Index',
      trend: `+${((region?.avgTempC ?? 22.4) - 1.2).toFixed(1)}°C Anomaly`,
      isPositiveTrend: false,
      icon: Thermometer,
      accentColor: 'from-rose-500/20 to-amber-500/10 border-rose-500/30 text-rose-400',
      badge: 'Heat Island Threat',
      target: 'Mitigation Priority'
    },
    {
      id: 'flood',
      label: 'Flood Risk',
      value: (region?.seaLevelRiseRiskM ?? 0.65) > 0.5 ? 78 : 42,
      decimals: 0,
      unit: '% Probable',
      trend: `+${(region?.seaLevelRiseRiskM ?? 0.65).toFixed(2)}m Surge Potential`,
      isPositiveTrend: false,
      icon: Waves,
      accentColor: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      badge: 'Hydro Dynamic',
      target: 'Seawall Defense Active'
    },
    {
      id: 'tree',
      label: 'Tree Coverage',
      value: Math.round((region?.districts ?? []).reduce((acc, d) => acc + (d.canopyCoveragePct ?? 0), 0) / (region?.districts?.length || 1)),
      decimals: 1,
      unit: '% Canopy',
      trend: '+142 Ha Added',
      isPositiveTrend: true,
      icon: Trees,
      accentColor: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-300',
      badge: 'Urban Canopy',
      target: 'Goal: 40% Coverage'
    },
    {
      id: 'score',
      label: 'Sustainability Score',
      value: region?.sustainabilityScore ?? 82,
      decimals: 0,
      unit: '/100',
      trend: 'Grade A Resilience',
      isPositiveTrend: true,
      icon: Award,
      accentColor: 'from-purple-500/20 to-emerald-500/10 border-purple-500/30 text-purple-300',
      badge: 'ESG Audit Tier 1',
      target: 'SEC & ISO Compliant'
    }
  ];

  // System climate alerts feed
  const climateAlerts = [
    {
      id: 'alt-1',
      severity: 'critical',
      title: 'Thermal Spike Alert: Central Financial Plaza',
      location: 'Central Financial Plaza (District 1)',
      delta: '+3.4°C over baseline threshold',
      timestamp: '12 mins ago',
      sensor: 'Plaza Micro-Climate Station (sns-101)',
      recommendation: 'Deploy high-albedo cool roof reflectives & misting stations.'
    },
    {
      id: 'alt-2',
      severity: 'warning',
      title: 'Tidal Surge Risk Warning: Harbor Logistics Port',
      location: 'Harbor Delta Logistics Port (District 2)',
      delta: 'Surge gauge at +1.84m peak high-tide',
      timestamp: '28 mins ago',
      sensor: 'Harbor Surge Radar (sns-102)',
      recommendation: 'Activate automated flood barrier seawalls at Terminal 3.'
    },
    {
      id: 'alt-3',
      severity: 'warning',
      title: 'Diesel PM2.5 Spike: Industrial Logistics Gate',
      location: 'Harbor Delta Port Corridor',
      delta: '88.5 µg/m³ PM2.5 detected',
      timestamp: '45 mins ago',
      sensor: 'Optical Particulate Sensor (sns-103)',
      recommendation: 'Reroute heavy freight vehicles via electrified bypass lanes.'
    },
    {
      id: 'alt-4',
      severity: 'info',
      title: 'Grid Balance Optimal: Substation 8B Dispatch',
      location: 'North Eco Tech Corridor (District 3)',
      delta: '+12% Solar dispatch absorbed into battery bank',
      timestamp: '1 hr ago',
      sensor: 'Inertia Monitor (sns-104)',
      recommendation: 'Maintain automatic peak-shaving algorithm.'
    }
  ];

  const filteredAlerts = climateAlerts.filter(a => {
    if (alertFilter === 'all') return true;
    return a.severity === alertFilter;
  });

  // AI Climate Interventions
  const aiRecommendations = [
    {
      id: 'rec-1',
      title: 'Deploy Rooftop Solar Canopies & Cool Roofs across Commercial Districts',
      category: 'Renewable & Heat Island',
      impactCO2: '-420,000 Tons / yr',
      roiYears: '3.4 Years',
      feasibility: 'High (94%)',
      costEst: '$14.2M Municipal CapEx',
      description: 'Retrofitted commercial rooftops lower surface temperature by 2.8°C while producing 180 GWh of clean solar power directly into local urban grids.'
    },
    {
      id: 'rec-2',
      title: 'Construct Coastal Bio-swales & Permeable Hydro Corridors',
      category: 'Stormwater & Flood Mitigation',
      impactCO2: 'Prevents $85M Flood Loss',
      roiYears: '2.1 Years',
      feasibility: 'Very High (98%)',
      costEst: '$8.5M Grant Funded',
      description: 'Absorbs 85% of peak storm runoff, reducing storm surge inundation risks for low-lying logistics piers and residential sectors.'
    },
    {
      id: 'rec-3',
      title: 'Automate Industrial Zone Battery Energy Storage Dispatch (BESS)',
      category: 'Grid Decarbonization',
      impactCO2: '-280,000 Tons / yr',
      roiYears: '2.8 Years',
      feasibility: 'Medium (86%)',
      costEst: '$18.0M Utility Co-investment',
      description: 'Stabilizes grid inertia during peak cooling hours, replacing fossil peaker plants with zero-carbon battery discharges.'
    }
  ];

  // Recharts Data Prep
  const energyMixData = [
    { name: 'Solar PV', value: 38, color: '#10b981' },
    { name: 'Offshore Wind', value: 26, color: '#14b8a6' },
    { name: 'Hydroelectric', value: 18, color: '#06b6d4' },
    { name: 'BESS Battery', value: 12, color: '#3b82f6' },
    { name: 'Grid Peaker (Fossil)', value: 6, color: '#f43f5e' }
  ];

  const districtRiskData = region.districts.map(d => ({
    name: d.name.length > 18 ? d.name.substring(0, 16) + '...' : d.name,
    fullTitle: d.name,
    aqi: d.currentCo2Ppm > 420 ? 78 : 42,
    canopyPct: d.canopyCoveragePct,
    heatIndex: Math.round((d.tempOffsetC + 2) * 20 + 30),
    gridLoad: d.gridLoadMW
  }));

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
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Executive Header Banner */}
      <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest font-mono">
              AI CLIMATE COMMAND CENTER
            </span>
            <span className="text-xs text-white/40 flex items-center font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              Live Digital Twin Sync • {region.location}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            {region.name} Overview
          </h1>
          <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
            Real-time multi-dimensional climate twin monitoring carbon emissions, renewable power dispatch, thermal island metrics, and AI resilience strategies.
          </p>
        </div>

        {/* Quick Executive Actions */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>Reporting Center</span>
          </button>
          <button
            onClick={() => onNavigate('policy-advisor')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>AI Policy Advisor</span>
          </button>
          <button
            onClick={() => onNavigate('renewable-energy')}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Renewable Energy Planner</span>
          </button>
          <button
            onClick={() => onNavigate('water')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Water Intelligence</span>
          </button>
          <button
            onClick={() => onNavigate('disaster')}
            className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Disaster Prediction</span>
          </button>
          <button
            onClick={() => onNavigateToSimulator()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center space-x-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-black" />
            <span>Launch Scenario Simulator</span>
          </button>
          <button
            onClick={() => onNavigateToCopilot(`Summarize overall climate resilience and critical risks for ${region.name}.`)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask AI Copilot</span>
          </button>
          <button
            onClick={() => onNavigateToReports()}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium text-xs transition-all flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-white/50" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 8 Hero Metric KPI Cards with Animated Counters */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Key Climate & Environmental Hero Telemetry
            </h2>
          </div>
          <span className="text-[10px] text-white/40 font-mono">Updated 2 secs ago</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {heroMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300 group relative shadow-lg overflow-hidden flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block">
                      {m.label}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-white/5 border border-white/10 text-white/60">
                      {m.badge}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${m.accentColor} border shadow-inner shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-baseline space-x-1.5">
                    <AnimatedCounter value={m.value} decimals={m.decimals} />
                    <span className="text-xs font-normal text-white/50 font-sans">{m.unit}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className={`font-mono font-bold flex items-center ${
                      m.isPositiveTrend ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {m.isPositiveTrend ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                      {m.trend}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono truncate">{m.target}</span>
                  </div>
                </div>

                {/* Bottom subtle indicator line */}
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${
                      m.isPositiveTrend ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(15, m.value > 100 ? 85 : m.value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Section & District Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Preview Canvas Container */}
        <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  GIS Digital Twin Map Preview
                </h3>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Active Layer: <strong className="text-emerald-400 capitalize">{activeMapLayer} overlay</strong> • Select district pins to inspect local sensors
              </p>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveMapLayer('heat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeMapLayer === 'heat' ? 'bg-emerald-500 text-black font-semibold shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Thermal
              </button>
              <button
                onClick={() => setActiveMapLayer('flood')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeMapLayer === 'flood' ? 'bg-cyan-500 text-black font-semibold shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Flood Risk
              </button>
              <button
                onClick={() => setActiveMapLayer('canopy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeMapLayer === 'canopy' ? 'bg-teal-500 text-black font-semibold shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Canopy
              </button>
              <button
                onClick={() => setActiveMapLayer('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeMapLayer === 'grid' ? 'bg-amber-500 text-black font-semibold shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Simulated Interactive Vector Map Canvas */}
          <div className="relative h-80 sm:h-96 rounded-2xl bg-[#04060a] border border-white/10 overflow-hidden group flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />

            {/* Animated Layer Gradient Effect */}
            <div className={`absolute inset-0 opacity-20 transition-all duration-700 pointer-events-none ${
              activeMapLayer === 'heat' ? 'bg-gradient-to-tr from-rose-900/40 via-amber-900/30 to-emerald-900/20' :
              activeMapLayer === 'flood' ? 'bg-gradient-to-tr from-blue-900/50 via-cyan-900/30 to-teal-900/20' :
              activeMapLayer === 'canopy' ? 'bg-gradient-to-tr from-emerald-900/50 via-teal-900/30 to-green-900/20' :
              'bg-gradient-to-tr from-amber-900/50 via-yellow-900/30 to-emerald-900/20'
            }`} />

            {/* Render District Nodes / Pins */}
            <div className="absolute inset-0 p-8 flex items-center justify-center">
              {region.districts.map((d, i) => {
                const isSelected = selectedDistrict?.id === d.id;
                // Position pins across vector canvas
                const posX = d.coordinates?.x ?? (20 + (i * 22) % 70);
                const posY = d.coordinates?.y ?? (25 + (i * 18) % 60);

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse Ring */}
                      <div className={`absolute w-10 h-10 rounded-full animate-ping opacity-40 ${
                        isSelected ? 'bg-emerald-400' : 'bg-white/20'
                      }`} />

                      {/* Node Button */}
                      <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-2xl transition-all transform group-hover/pin:scale-125 border ${
                        isSelected 
                          ? 'bg-emerald-500 text-black border-white shadow-[0_0_20px_rgba(16,185,129,0.8)]' 
                          : 'bg-[#080a0f] text-emerald-400 border-white/20 hover:border-emerald-400'
                      }`}>
                        {i + 1}
                      </div>

                      {/* Floating District Badge */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 bg-[#080a0f]/90 border border-white/10 rounded-lg text-[10px] font-semibold text-white whitespace-nowrap shadow-xl pointer-events-none group-hover/pin:block hidden">
                        {d.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Overlay Info & Full 3D Viewport Launcher */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#080a0f]/90 border border-white/10 rounded-xl p-3.5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30">
              <div className="flex items-center space-x-3 text-xs">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">{selectedDistrict?.name || 'Select a District'}</span>
                  <span className="text-[10px] text-white/50 font-mono">
                    Type: {selectedDistrict?.type} • Canopy: {selectedDistrict?.canopyCoveragePct}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('viewport')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                <span>Full 3D Viewport</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected District Deep Dive Card */}
        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                DISTRICT TELEMETRY
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE STREAM
              </span>
            </div>

            {selectedDistrict ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedDistrict.name}</h4>
                  <p className="text-xs text-white/50 font-mono">
                    Category: {selectedDistrict.type}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono block">TEMP OFFSET</span>
                    <span className={`text-base font-bold font-mono ${selectedDistrict.tempOffsetC > 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      +{selectedDistrict.tempOffsetC}°C
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono block">CANOPY COVER</span>
                    <span className="text-base font-bold font-mono text-emerald-300">
                      {selectedDistrict.canopyCoveragePct}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono block">CO2 CONCENTRATION</span>
                    <span className="text-base font-bold font-mono text-teal-300">
                      {selectedDistrict.currentCo2Ppm} PPM
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono block">GRID LOAD</span>
                    <span className="text-base font-bold font-mono text-amber-300">
                      {selectedDistrict.gridLoadMW} MW
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center text-xs font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> District Action Plan
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Prioritize cool pavement application and rooftop solar storage integration in {selectedDistrict.name}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/40 py-8 text-center">
                Click a district node on the map to inspect telemetry
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateToSimulator(selectedDistrict?.id)}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex items-center justify-center space-x-2"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Simulate District Interventions</span>
          </button>
        </div>
      </div>

      {/* Interactive Charts Section using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Emissions Trajectory (Area Chart) */}
        <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Carbon Emissions Trajectory & AI Target (2020 - 2040)
                </h3>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Baseline BAU Emissions vs AI-Optimized Net-Zero Strategy (Mtons CO2 / yr)
              </p>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Net-Zero Horizon 2035
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TIME_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="yearOrMonth" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="baselineEmissions" 
                  name="Baseline Business-as-Usual" 
                  stroke="#f43f5e" 
                  fillOpacity={1} 
                  fill="url(#colorBaseline)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="simulatedEmissions" 
                  name="AI Optimized Intervention Trajectory" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorSimulated)" 
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Clean Energy Grid Supply Mix (Pie / Donut Chart) */}
        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Clean Energy Supply Mix
              </h3>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Live Grid Generation Dispatch
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {energyMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-extrabold font-mono text-white">{region.renewableEnergyPct}%</span>
              <span className="text-[10px] font-mono text-emerald-400">CLEAN GRID</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {energyMixData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-white/80">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Climate Risk Comparison Bar Chart */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                District Climate Risk & Resilience Multi-Index
              </h3>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Comparative Analysis of Heat Stress Index, AQI Level, and Canopy Coverage % across region districts
            </p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={districtRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="canopyPct" name="Canopy Coverage %" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="aqi" name="AQI Level" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="heatIndex" name="Heat Stress Index" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Climate Alerts Feed & AI Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Climate Telemetry Alerts */}
        <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Recent Climate Alerts ({filteredAlerts.length})
                </h3>
              </div>

              {/* Alert Filter Buttons */}
              <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl text-[10px]">
                <button
                  onClick={() => setAlertFilter('all')}
                  className={`px-2 py-0.5 rounded ${alertFilter === 'all' ? 'bg-white/10 text-white font-bold' : 'text-white/40'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setAlertFilter('critical')}
                  className={`px-2 py-0.5 rounded ${alertFilter === 'critical' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-white/40'}`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setAlertFilter('warning')}
                  className={`px-2 py-0.5 rounded ${alertFilter === 'warning' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-white/40'}`}
                >
                  Warning
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                      alt.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      alt.severity === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">{alt.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{alt.title}</h4>
                  <p className="text-[11px] text-white/60 font-mono">{alt.delta}</p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-white/40 truncate max-w-[180px]">{alt.sensor}</span>
                    <button
                      onClick={() => onNavigateToCopilot(`Investigate alert: ${alt.title}. What immediate mitigation steps are recommended?`)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('iot-mesh')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex items-center justify-center space-x-2 mt-4"
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Inspect All 420 IoT Sensors</span>
          </button>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                AI Strategic Climate Interventions
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white/40">Powered by Gemini 3.6 Flash</span>
          </div>

          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {rec.category}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {rec.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {rec.description}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block">CO2 OFFSET</span>
                    <span className="font-bold text-emerald-400">{rec.impactCO2}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block">PAYBACK ROI</span>
                    <span className="font-bold text-amber-300">{rec.roiYears}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 block">FEASIBILITY</span>
                    <span className="font-bold text-cyan-300">{rec.feasibility}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-end space-x-3 text-xs">
                  <button
                    onClick={() => onNavigateToSimulator()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold transition-all flex items-center space-x-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Simulate Policy</span>
                  </button>
                  <button
                    onClick={() => onNavigateToCopilot(`Draft a proposal for: ${rec.title}. Cost estimate is ${rec.costEst}.`)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Draft Policy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
