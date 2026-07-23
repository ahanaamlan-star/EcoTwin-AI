import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Cpu, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Zap, 
  ShieldCheck, 
  Thermometer, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Droplets,
  CloudRain,
  Users,
  Car,
  Sun,
  Trees,
  Trash2,
  Waves,
  Wind,
  ShieldAlert,
  BarChart3,
  FileText
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
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { TwinRegion, ScenarioParameters, SimulationResult } from '../types';
import { DEFAULT_SCENARIO_PARAMS, MOCK_TIME_SERIES } from '../data/mockTwinData';

interface ScenarioSimulatorProps {
  region: TwinRegion;
  initialDistrictId?: string;
  onNavigateToCopilot: (prompt: string) => void;
  onNavigateToReports: (scenarioData: any) => void;
  setIsSimulating: (simulating: boolean) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  region,
  onNavigateToCopilot,
  onNavigateToReports,
  setIsSimulating
}) => {
  const [params, setParams] = useState<ScenarioParameters>({
    ...DEFAULT_SCENARIO_PARAMS,
    regionId: region.id
  });

  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // Run AI Simulation call to Express backend with Gemini
  const handleRunSimulation = async () => {
    setLoading(true);
    setIsSimulating(true);

    try {
      const response = await fetch('/api/gemini/simulate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: region.name,
          targetYear: params.targetYear,
          rainfallMm: params.rainfallMm,
          tempDelta: params.tempDelta,
          populationGrowthPct: params.populationGrowthPct,
          evAdoptionPct: params.evAdoptionPct,
          solarAdoptionPct: params.solarAdoptionPct,
          treePlantationPct: params.treePlantationPct,
          waterConsumptionLpd: params.waterConsumptionLpd,
          wasteGenerationKgDay: params.wasteGenerationKgDay
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setSimResult(resData.data);
      }
    } catch (err) {
      console.error('Error running scenario simulation:', err);
    } finally {
      setLoading(false);
      setIsSimulating(false);
    }
  };

  // Run initial simulation once on mount or region change
  React.useEffect(() => {
    handleRunSimulation();
  }, [region.id]);

  // Presets handler for rapid scenario testing
  const applyPreset = (presetName: string) => {
    if (presetName === 'high-resilience') {
      setParams({
        ...params,
        rainfallMm: 1600,
        tempDelta: 1.5,
        populationGrowthPct: 1.5,
        evAdoptionPct: 85,
        solarAdoptionPct: 80,
        treePlantationPct: 45,
        waterConsumptionLpd: 160,
        wasteGenerationKgDay: 1.1
      });
    } else if (presetName === 'storm-surge') {
      setParams({
        ...params,
        rainfallMm: 2450,
        tempDelta: 2.8,
        populationGrowthPct: 3.2,
        evAdoptionPct: 50,
        solarAdoptionPct: 45,
        treePlantationPct: 25,
        waterConsumptionLpd: 240,
        wasteGenerationKgDay: 2.2
      });
    } else if (presetName === 'extreme-heat') {
      setParams({
        ...params,
        rainfallMm: 750,
        tempDelta: 3.8,
        populationGrowthPct: 2.8,
        evAdoptionPct: 70,
        solarAdoptionPct: 90,
        treePlantationPct: 50,
        waterConsumptionLpd: 280,
        wasteGenerationKgDay: 2.0
      });
    }
  };

  // Prepare chart comparison data
  const riskComparisonData = simResult ? [
    { name: 'Flood Risk', score: simResult.floodRiskScore, max: 100, fill: '#06b6d4' },
    { name: 'Water Stress', score: simResult.waterStressIndex, max: 100, fill: '#3b82f6' },
    { name: 'Air Quality (AQI)', score: Math.min(100, Math.round((simResult.airQualityAQI / 200) * 100)), max: 100, fill: '#10b981' },
    { name: 'Infra Risk', score: simResult.infrastructureRiskScore, max: 100, fill: '#f43f5e' }
  ] : [];

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
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest font-mono">
              PREDICTIVE CLIMATE NEURAL ENGINE
            </span>
            <span className="text-xs text-white/40 flex items-center font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Gemini 3.6 Flash
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Climate Simulator & Stress Tester
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Adjust multi-variable urban climate sliders to simulate environmental, hydrological, and financial outcomes for <span className="text-emerald-400 font-semibold">{region.name}</span>.
          </p>
        </div>

        {/* Rapid Scenario Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-white/40 font-mono uppercase mr-1">Presets:</span>
          <button
            onClick={() => applyPreset('high-resilience')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-400 font-semibold transition-all"
          >
            High Resilience 2035
          </button>
          <button
            onClick={() => applyPreset('storm-surge')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-300 font-semibold transition-all"
          >
            Extreme Monsoon +2450mm
          </button>
          <button
            onClick={() => applyPreset('extreme-heat')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-semibold transition-all"
          >
            Thermal Spike +3.8°C
          </button>
        </div>
      </div>

      {/* Main Grid: Left 8 Slider Controls, Right Gemini Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 8 Slider Inputs Controls Panel */}
        <div className="lg:col-span-5 backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                8 Climate & Policy Sliders
              </h3>
              <button
                onClick={() => setParams(DEFAULT_SCENARIO_PARAMS)}
                className="text-[10px] text-white/40 hover:text-white flex items-center font-mono transition-colors"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset Defaults
              </button>
            </div>

            {/* Target Horizon Year */}
            <div className="space-y-1 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-white/80 font-medium">Simulation Horizon Year</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {params.targetYear}
                </span>
              </div>
              <input
                type="range"
                min={2026}
                max={2050}
                step={1}
                value={params.targetYear}
                onChange={(e) => setParams({ ...params, targetYear: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 1: Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400 mr-1.5" /> Rainfall
                </span>
                <span className="text-cyan-400 font-bold">{params.rainfallMm} mm/yr</span>
              </div>
              <input
                type="range"
                min={500}
                max={3000}
                step={25}
                value={params.rainfallMm}
                onChange={(e) => setParams({ ...params, rainfallMm: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400 mr-1.5" /> Temperature Shift
                </span>
                <span className="text-rose-400 font-bold">+{params.tempDelta}°C</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={params.tempDelta}
                onChange={(e) => setParams({ ...params, tempDelta: parseFloat(e.target.value) })}
                className="w-full accent-rose-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Population Growth */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Users className="w-3.5 h-3.5 text-indigo-400 mr-1.5" /> Population Growth
                </span>
                <span className="text-indigo-400 font-bold">{params.populationGrowthPct}% / yr</span>
              </div>
              <input
                type="range"
                min={-1.0}
                max={5.0}
                step={0.1}
                value={params.populationGrowthPct}
                onChange={(e) => setParams({ ...params, populationGrowthPct: parseFloat(e.target.value) })}
                className="w-full accent-indigo-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: EV Adoption */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Car className="w-3.5 h-3.5 text-teal-400 mr-1.5" /> EV Adoption Rate
                </span>
                <span className="text-teal-400 font-bold">{params.evAdoptionPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={params.evAdoptionPct}
                onChange={(e) => setParams({ ...params, evAdoptionPct: parseInt(e.target.value) })}
                className="w-full accent-teal-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 5: Solar Adoption */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Sun className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> Solar Adoption Share
                </span>
                <span className="text-amber-400 font-bold">{params.solarAdoptionPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={params.solarAdoptionPct}
                onChange={(e) => setParams({ ...params, solarAdoptionPct: parseInt(e.target.value) })}
                className="w-full accent-amber-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 6: Tree Plantation */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Trees className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Tree Plantation & Canopy
                </span>
                <span className="text-emerald-400 font-bold">{params.treePlantationPct}% Cover</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={1}
                value={params.treePlantationPct}
                onChange={(e) => setParams({ ...params, treePlantationPct: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 7: Water Consumption */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Droplets className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Water Consumption
                </span>
                <span className="text-blue-400 font-bold">{params.waterConsumptionLpd} L/capita/day</span>
              </div>
              <input
                type="range"
                min={100}
                max={350}
                step={5}
                value={params.waterConsumptionLpd}
                onChange={(e) => setParams({ ...params, waterConsumptionLpd: parseInt(e.target.value) })}
                className="w-full accent-blue-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 8: Waste Generation */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/80 flex items-center">
                  <Trash2 className="w-3.5 h-3.5 text-purple-400 mr-1.5" /> Waste Generation
                </span>
                <span className="text-purple-400 font-bold">{params.wasteGenerationKgDay} kg/capita/day</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.5}
                step={0.1}
                value={params.wasteGenerationKgDay}
                onChange={(e) => setParams({ ...params, wasteGenerationKgDay: parseFloat(e.target.value) })}
                className="w-full accent-purple-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-3 px-4 mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-black" />
                <span>Invoking Gemini Climate Neural Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black fill-black" />
                <span>Run Simulation & Compute Impacts</span>
              </>
            )}
          </button>
        </div>

        {/* Prediction Results Display Section */}
        <div className="lg:col-span-7 space-y-6">
          {simResult ? (
            <>
              {/* Executive Summary Card */}
              <div className="p-5 bg-white/[0.03] border border-emerald-500/30 rounded-3xl backdrop-blur-xl space-y-3 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> GEMINI AI SCENARIO VERDICT
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">Horizon Year {params.targetYear}</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-sans">
                  {simResult.executiveSummary}
                </p>
              </div>

              {/* Animated Cards for 7 Gemini Return Metrics */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    7 Core Gemini Simulation Outcomes
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">Live Predicted Metrics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* 1. Flood Risk */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-cyan-500/40 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase">1. Flood Risk</span>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                        simResult.floodRiskLevel === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        simResult.floodRiskLevel === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {simResult.floodRiskLevel} Level
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-cyan-400 flex items-baseline justify-between">
                      <span>{simResult.floodRiskScore} <span className="text-xs font-normal text-white/40">/100</span></span>
                      <Waves className="w-5 h-5 text-cyan-400/80" />
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${simResult.floodRiskScore}%` }} />
                    </div>
                  </div>

                  {/* 2. Carbon Emissions */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-emerald-500/40 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase">2. Carbon Emissions</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Net Mtons
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-emerald-400 flex items-baseline justify-between">
                      <span>{simResult.carbonEmissionsMtons} <span className="text-xs font-normal text-white/40">Mtons/yr</span></span>
                      <Trees className="w-5 h-5 text-emerald-400/80" />
                    </div>
                    <span className="text-[10px] text-emerald-300 font-mono block">
                      Offset: {(((simResult.annualCO2SavedTons ?? 0) / 1000)).toFixed(0)}k Tons saved
                    </span>
                  </div>

                  {/* 3. Economic Impact */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-amber-500/40 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase">3. Economic Impact</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Net ROI
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-amber-300 flex items-baseline justify-between">
                      <span>{simResult.economicImpactMillionUSD >= 0 ? `+$${simResult.economicImpactMillionUSD}` : `-$${Math.abs(simResult.economicImpactMillionUSD)}`}M</span>
                      <DollarSign className="w-5 h-5 text-amber-300/80" />
                    </div>
                    <span className="text-[10px] text-white/50 font-mono block">
                      Lifecycle Value Generation
                    </span>
                  </div>

                  {/* 4. Water Stress */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-blue-500/40 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase">4. Water Stress</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Aquifer
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-blue-400 flex items-baseline justify-between">
                      <span>{simResult.waterStressIndex} <span className="text-xs font-normal text-white/40">Index</span></span>
                      <Droplets className="w-5 h-5 text-blue-400/80" />
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: `${simResult.waterStressIndex}%` }} />
                    </div>
                  </div>

                  {/* 5. Air Quality */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-teal-500/40 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase">5. Air Quality</span>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                        simResult.airQualityAQI < 50 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        simResult.airQualityAQI < 100 ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        AQI {simResult.airQualityAQI}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-teal-300 flex items-baseline justify-between">
                      <span>{simResult.airQualityAQI} <span className="text-xs font-normal text-white/40">AQI</span></span>
                      <Wind className="w-5 h-5 text-teal-300/80" />
                    </div>
                    <span className="text-[10px] text-white/50 font-mono block">
                      {simResult.airQualityAQI < 50 ? 'Good / Safe Air' : 'Moderate Quality'}
                    </span>
                  </div>

                  {/* 6. Infrastructure Risk */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-rose-500/40 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-white/50 uppercase">6. Infra Risk</span>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                        simResult.infrastructureRiskLevel === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {simResult.infrastructureRiskLevel}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-rose-400 flex items-baseline justify-between">
                      <span>{simResult.infrastructureRiskScore} <span className="text-xs font-normal text-white/40">/100</span></span>
                      <ShieldAlert className="w-5 h-5 text-rose-400/80" />
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-rose-400 h-full rounded-full" style={{ width: `${simResult.infrastructureRiskScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recharts Area Chart: Emissions Trajectory */}
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl space-y-3 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Emissions Trajectory Curve (2020 - 2040)
                    </h4>
                    <p className="text-[10px] text-white/40">Baseline vs. AI Simulated Intervention</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Net-Zero Curve
                  </span>
                </div>
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_TIME_SERIES}>
                      <defs>
                        <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="yearOrMonth" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Area type="monotone" dataKey="baselineEmissions" name="Baseline Emissions (Mtons)" stroke="#f43f5e" fillOpacity={1} fill="url(#colorBaseline)" strokeWidth={2} />
                      <Area type="monotone" dataKey="simulatedEmissions" name="Simulated Emissions (Mtons)" stroke="#10b981" fillOpacity={1} fill="url(#colorSimulated)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recharts Bar Chart: Multi-Risk Assessment Profile */}
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl space-y-3 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Multi-Risk Profile Index Breakdown
                    </h4>
                    <p className="text-[10px] text-white/40">Comparative scores (0-100 scale)</p>
                  </div>
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="h-44 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="score" name="Risk Score (0-100)" radius={[6, 6, 0, 0]}>
                        {riskComparisonData.map((entry, index) => (
                          <rect key={`rect-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 7. Mitigation Suggestions */}
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center font-mono">
                    <Sparkles className="w-4 h-4 text-emerald-400 mr-1.5" />
                    7. Gemini AI Mitigation Suggestions
                  </h4>
                  <button
                    onClick={() => onNavigateToReports(simResult)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    <span>Export to Report</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(simResult.mitigationSuggestions || simResult.recommendations || []).map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            {rec.category}
                          </span>
                          <h5 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {rec.title}
                          </h5>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-white/5 text-amber-300 font-semibold border border-white/10">
                            Est. ROI: {rec.estROI}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
                            {rec.impactRating}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed font-sans">
                        {rec.description}
                      </p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                        <button
                          onClick={() => onNavigateToCopilot(`Tell me more about implementing policy: ${rec.title}. What are the immediate steps and budget allocation?`)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center"
                        >
                          <span>Ask Copilot for Action Plan</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white/[0.02] border border-white/10 rounded-3xl space-y-3">
              <Cpu className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-white">No Simulation Loaded</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Adjust sliders on the left and click "Run Simulation" to generate full predictions using Google Gemini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
