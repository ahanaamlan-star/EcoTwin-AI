import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Waves, 
  Wind, 
  Thermometer, 
  Flame, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Building2, 
  Zap, 
  Activity, 
  FileSpreadsheet, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  Send,
  Radio,
  Clock,
  Navigation,
  ShieldCheck,
  ChevronRight,
  Layers
} from 'lucide-react';
import { DisasterType, DisasterRiskCardData, AffectedZoneData, TwinRegion } from '../types';
import { DEFAULT_DISASTER_CARDS, DEFAULT_AFFECTED_ZONES } from '../data/mockTwinData';

interface DisasterPredictionProps {
  region?: TwinRegion;
  onNavigateToCopilot?: (prompt: string) => void;
  onNavigateToReports?: (markdown: string) => void;
}

export const DisasterPrediction: React.FC<DisasterPredictionProps> = ({
  region,
  onNavigateToCopilot,
  onNavigateToReports
}) => {
  const [disasterCards, setDisasterCards] = useState<DisasterRiskCardData[]>(DEFAULT_DISASTER_CARDS);
  const [selectedDisasterId, setSelectedDisasterId] = useState<DisasterType>('flood');
  const [affectedZones, setAffectedZones] = useState<AffectedZoneData[]>(DEFAULT_AFFECTED_ZONES);
  const [activeTab, setActiveTab] = useState<'cards' | 'gauges' | 'mitigation' | 'zones'>('cards');

  // Simulation parameters state
  const [stormSurgeMeters, setStormSurgeMeters] = useState<number>(1.85);
  const [windVelocityKmh, setWindVelocityKmh] = useState<number>(185);
  const [ambientTempC, setAmbientTempC] = useState<number>(42.5);
  const [fuelMoisturePct, setFuelMoisturePct] = useState<number>(5.2);
  const [reservoirCapacityPct, setReservoirCapacityPct] = useState<number>(34.2);

  // Status message state
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Selected disaster data
  const selectedDisaster = disasterCards.find(d => d.id === selectedDisasterId) || disasterCards[0];

  // Disaster Icon mapping
  const getDisasterIcon = (type: DisasterType) => {
    switch (type) {
      case 'flood': return Waves;
      case 'cyclone': return Wind;
      case 'heatwave': return Thermometer;
      case 'wildfire': return Flame;
      case 'drought': return Sun;
      default: return ShieldAlert;
    }
  };

  // Dynamic calculation of probabilities based on simulation parameters
  const recalculateProbabilities = () => {
    setDisasterCards(prev => prev.map(card => {
      let calcProb = card.probability;
      if (card.id === 'flood') {
        calcProb = Math.min(99, Math.max(10, Math.round(stormSurgeMeters * 42 + (windVelocityKmh / 10))));
      } else if (card.id === 'cyclone') {
        calcProb = Math.min(99, Math.max(10, Math.round((windVelocityKmh / 2.5) + (stormSurgeMeters * 10))));
      } else if (card.id === 'heatwave') {
        calcProb = Math.min(99, Math.max(10, Math.round((ambientTempC - 20) * 3.8)));
      } else if (card.id === 'wildfire') {
        calcProb = Math.min(99, Math.max(10, Math.round((20 - fuelMoisturePct) * 4 + (ambientTempC * 0.8))));
      } else if (card.id === 'drought') {
        calcProb = Math.min(99, Math.max(10, Math.round((100 - reservoirCapacityPct) * 0.85)));
      }

      let severity: 'Critical' | 'High' | 'Elevated' | 'Moderate' | 'Low' = 'Moderate';
      if (calcProb >= 80) severity = 'Critical';
      else if (calcProb >= 65) severity = 'High';
      else if (calcProb >= 50) severity = 'Elevated';
      else if (calcProb >= 30) severity = 'Moderate';
      else severity = 'Low';

      return {
        ...card,
        probability: calcProb,
        severity
      };
    }));

    setActionAlert('Recalibrated disaster probabilities using live telemetry & parameter triggers!');
    setTimeout(() => setActionAlert(null), 3500);
  };

  // Helper to get probability gauge color
  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return '#ef4444'; // Red
    if (prob >= 65) return '#f97316'; // Orange
    if (prob >= 50) return '#f59e0b'; // Amber
    if (prob >= 30) return '#06b6d4'; // Cyan
    return '#10b981'; // Green
  };

  // Filter affected zones by selected disaster
  const filteredZones = affectedZones.filter(z => z.disasterTypes.includes(selectedDisasterId));

  // Trigger Evacuation Alert
  const handleTriggerEvacuation = (zoneName: string) => {
    setAffectedZones(prev => prev.map(z => {
      if (z.name === zoneName) {
        return { ...z, evacuationStatus: 'Mandatory' };
      }
      return z;
    }));
    setActionAlert(`🚨 EMERGENCY: Mandatory Evacuation Alert broadcasted for ${zoneName}!`);
    setTimeout(() => setActionAlert(null), 4000);
  };

  // Export Mitigation Plan to Executive Reports
  const handleExportMitigationPlan = () => {
    const markdown = `# Disaster Mitigation & Emergency Response Plan: ${selectedDisaster.title}

**Region**: ${region?.name || 'Metropolis Delta Hub'}  
**Prepared By**: AI Disaster Prediction Center & Emergency Command  
**Current Risk Level**: ${selectedDisaster.severity.toUpperCase()} (${selectedDisaster.probability}% Probability)  
**Target Window**: ${selectedDisaster.timeframe}  
**Affected Districts**: ${selectedDisaster.affectedDistrictsCount}  
**Estimated Population at Risk**: ${selectedDisaster.estimatedPopAtRisk.toLocaleString()} residents  

---

## 1. Threat Overview & Telemetry Triggers
${selectedDisaster.description}

### Live Telemetry Signals:
${selectedDisaster.keyTelemetry.map(t => `- **${t.label}**: ${t.value} [${t.status.toUpperCase()}]`).join('\n')}

---

## 2. Multi-Phase Action Mitigation Protocol
${selectedDisaster.mitigationSteps.map((step, idx) => `
### Step ${idx + 1}: ${step.title}
- **Phase**: ${step.phase}
- **Lead Agency**: ${step.agency}
- **Execution Status**: ${step.status.toUpperCase()}
- **Estimated Budget Allocation**: $${step.estimatedCostUSD.toLocaleString()}
- **Operational Detail**: ${step.detail}
`).join('\n')}

---

## 3. Vulnerable Zones & Evacuation Readiness
${filteredZones.map(zone => `
- **Zone**: ${zone.name} (${zone.primaryCoordinates})
  - **Risk Rating**: ${zone.riskLevel}
  - **Evacuation Status**: ${zone.evacuationStatus}
  - **Population at Risk**: ${zone.populationAtRisk.toLocaleString()}
  - **Emergency Shelters Available**: ${zone.sheltersAvailable} shelters
  - **Vulnerabilities**: ${zone.vulnerabilityFactors.join(', ')}
`).join('\n')}
`;

    if (onNavigateToReports) {
      onNavigateToReports(markdown);
    }
  };

  // Ask Copilot about this disaster
  const handleAskCopilotAboutDisaster = () => {
    if (onNavigateToCopilot) {
      onNavigateToCopilot(
        `What immediate emergency actions should we deploy for a ${selectedDisaster.severity} ${selectedDisaster.title} with ${selectedDisaster.probability}% probability affecting ${selectedDisaster.estimatedPopAtRisk.toLocaleString()} residents?`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-400 animate-pulse" /> AI DISASTER PREDICTION CENTER
            </span>
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              Ensemble Neural Model v8.4 • 5 Threat Vectors
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Early Warning, Probability Gauges & Mitigation Engine
          </h1>
          <p className="text-xs text-white/50 mt-0.5 max-w-3xl">
            Real-time multi-hazard threat assessment for Flood, Cyclone, Heatwave, Wildfire, and Drought with interactive probability gauges and actionable defense protocols.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAskCopilotAboutDisaster}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Copilot</span>
          </button>

          <button
            onClick={handleExportMitigationPlan}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
            <span>Export Mitigation Brief</span>
          </button>
        </div>
      </div>

      {/* Alert Banner if triggered */}
      {actionAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <span className="text-[10px] text-emerald-400/60 uppercase">SYSTEM COMMAND</span>
        </div>
      )}

      {/* 5 DISASTER RISK CARDS GRID (Flood, Cyclone, Heatwave, Wildfire, Drought) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            1. Multi-Hazard Threat Risk Cards (Select to Inspect)
          </h2>
          <span className="text-[10px] text-white/40 font-mono">
            5 Active Predictive Models
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {disasterCards.map((card) => {
            const Icon = getDisasterIcon(card.id);
            const isSelected = selectedDisasterId === card.id;
            const gaugeColor = getProbabilityColor(card.probability);
            const radius = 28;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (card.probability / 100) * circumference;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedDisasterId(card.id)}
                className={`p-4 rounded-2xl bg-white/[0.03] border transition-all cursor-pointer space-y-3 backdrop-blur-xl relative overflow-hidden group shadow-xl ${
                  isSelected 
                    ? 'border-emerald-400 ring-1 ring-emerald-400/50 bg-white/[0.07] scale-[1.02]' 
                    : 'border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                {/* Top header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${card.primaryColor}20`, color: card.primaryColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block capitalize">{card.id}</span>
                      <span className="text-[9px] text-white/40 font-mono block">{card.category}</span>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <span 
                    className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono border"
                    style={{ 
                      backgroundColor: `${gaugeColor}15`, 
                      color: gaugeColor, 
                      borderColor: `${gaugeColor}40` 
                    }}
                  >
                    {card.severity}
                  </span>
                </div>

                {/* Circular Probability Gauge */}
                <div className="flex items-center justify-between pt-1">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                      <circle
                        cx="35"
                        cy="35"
                        r={radius}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="35"
                        cy="35"
                        r={radius}
                        stroke={gaugeColor}
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-sm font-extrabold font-mono text-white leading-none">
                        {card.probability}%
                      </span>
                      <span className="text-[8px] text-white/40 uppercase font-mono mt-0.5">Prob</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-[10px] text-white/40 font-mono flex items-center justify-end">
                      <Clock className="w-3 h-3 mr-1 text-white/40" />
                      {card.timeframe}
                    </div>
                    <div className="text-[10px] text-white/60 font-mono">
                      <strong className="text-white font-bold">{card.affectedDistrictsCount}</strong> Districts
                    </div>
                    <div className="text-[10px] text-rose-400 font-mono font-bold">
                      {(card.estimatedPopAtRisk / 1000).toFixed(0)}k At Risk
                    </div>
                  </div>
                </div>

                {/* Telemetry Snippet */}
                <div className="bg-black/30 rounded-xl p-2 text-[10px] font-mono space-y-1 border border-white/5">
                  <div className="flex justify-between text-white/50">
                    <span>Primary Sensor:</span>
                    <span className="text-white font-bold">{card.keyTelemetry[0]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Reading:</span>
                    <span className="font-bold text-amber-300">{card.keyTelemetry[0]?.value}</span>
                  </div>
                </div>

                {/* Inspect Link */}
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>{isSelected ? 'ACTIVE VIEW' : 'INSPECT & MITIGATE'}</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Interactive Threat Parameter Triggers (Sliders) */}
      <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              2. Interactive Disaster Parameter Simulator
            </h3>
            <p className="text-[10px] text-white/50">
              Adjust environmental triggers to dynamically recalculate probability gauges across all 5 disaster models.
            </p>
          </div>
          <button
            onClick={recalculateProbabilities}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
            <span>Recalibrate Gauges</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
          {/* Slider 1: Storm Surge */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-cyan-400 font-bold">Storm Surge</span>
              <span className="text-white font-bold">{stormSurgeMeters.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.5}
              step={0.05}
              value={stormSurgeMeters}
              onChange={(e) => {
                setStormSurgeMeters(parseFloat(e.target.value));
                recalculateProbabilities();
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-cyan-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Affects Flood & Cyclone</span>
          </div>

          {/* Slider 2: Wind Speed */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-blue-400 font-bold">Wind Speed</span>
              <span className="text-white font-bold">{windVelocityKmh} km/h</span>
            </div>
            <input
              type="range"
              min={40}
              max={280}
              step={5}
              value={windVelocityKmh}
              onChange={(e) => {
                setWindVelocityKmh(parseInt(e.target.value));
                recalculateProbabilities();
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-blue-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Affects Cyclone & Wildfire</span>
          </div>

          {/* Slider 3: Heat Canopy Temp */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-rose-400 font-bold">Heat Index</span>
              <span className="text-white font-bold">{ambientTempC.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min={25}
              max={48}
              step={0.5}
              value={ambientTempC}
              onChange={(e) => {
                setAmbientTempC(parseFloat(e.target.value));
                recalculateProbabilities();
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-rose-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Affects Heatwave & Wildfire</span>
          </div>

          {/* Slider 4: Fuel Moisture */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-orange-400 font-bold">Fuel Moisture</span>
              <span className="text-white font-bold">{fuelMoisturePct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={25.0}
              step={0.5}
              value={fuelMoisturePct}
              onChange={(e) => {
                setFuelMoisturePct(parseFloat(e.target.value));
                recalculateProbabilities();
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-orange-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Affects Wildfire Ignition</span>
          </div>

          {/* Slider 5: Reservoir Level */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-amber-400 font-bold">Reservoir Cap</span>
              <span className="text-white font-bold">{reservoirCapacityPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={10.0}
              max={95.0}
              step={1.0}
              value={reservoirCapacityPct}
              onChange={(e) => {
                setReservoirCapacityPct(parseFloat(e.target.value));
                recalculateProbabilities();
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg accent-amber-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">Affects Drought Deficit</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Detailed Disaster View & Mitigation Plan Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mitigation Plan Generator & Execution Steps */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span 
                  className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono border"
                  style={{ 
                    backgroundColor: `${selectedDisaster.primaryColor}20`, 
                    color: selectedDisaster.primaryColor,
                    borderColor: `${selectedDisaster.primaryColor}40`
                  }}
                >
                  ACTIVE THREAT DETAILED PROTOCOL
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 capitalize">
                3. Mitigation Plan: {selectedDisaster.title}
              </h3>
              <p className="text-xs text-white/50">
                Actionable response protocols, agency assignments, and budget allocations.
              </p>
            </div>

            <button
              onClick={handleExportMitigationPlan}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Send to Briefing</span>
            </button>
          </div>

          {/* Telemetry Sensor Gauges Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedDisaster.keyTelemetry.map((tel, idx) => (
              <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-white/40 font-mono block">{tel.label}</span>
                <span className="text-sm font-bold font-mono text-white block">{tel.value}</span>
                <span className={`text-[9px] font-mono font-bold uppercase ${
                  tel.status === 'critical' ? 'text-rose-400' : tel.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  Status: {tel.status}
                </span>
              </div>
            ))}
          </div>

          {/* Mitigation Protocol Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Multi-Phase Mitigation Execution Timeline</span>
              <span className="text-white/40 text-[10px]">
                Total Est. Cost: ${selectedDisaster.mitigationSteps.reduce((a, s) => a + s.estimatedCostUSD, 0).toLocaleString()}
              </span>
            </h4>

            <div className="space-y-3">
              {selectedDisaster.mitigationSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-white/10 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-mono text-emerald-400 font-bold text-[10px] uppercase">
                      {step.phase}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase self-start sm:self-auto ${
                      step.status === 'active' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : step.status === 'deploying' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white">{step.title}</h5>
                  <p className="text-xs text-white/60 leading-relaxed">{step.detail}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-white/40">
                    <span className="flex items-center">
                      <Building2 className="w-3 h-3 text-white/40 mr-1" />
                      Lead: {step.agency}
                    </span>
                    <span className="text-white font-bold">
                      ${step.estimatedCostUSD.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Display Affected Regions / Zones */}
        <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-2xl">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              4. Display Affected Regions & Evacuation Status
            </h3>
            <p className="text-[10px] text-white/40">
              Filtered for <strong className="text-white capitalize">{selectedDisaster.id}</strong> threat exposure
            </p>
          </div>

          <div className="space-y-3">
            {filteredZones.length === 0 ? (
              <div className="p-6 text-center text-xs text-white/40 font-mono">
                No high-risk zones detected for this disaster scenario.
              </div>
            ) : (
              filteredZones.map(zone => (
                <div key={zone.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {zone.name}
                      </h5>
                      <span className="text-[9px] text-white/40 font-mono block">{zone.primaryCoordinates}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      zone.evacuationStatus === 'Mandatory' 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                        : zone.evacuationStatus === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      Evac: {zone.evacuationStatus}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                    <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                      <span className="text-white/40 block">Pop. at Risk</span>
                      <span className="text-rose-400 font-bold">{zone.populationAtRisk.toLocaleString()}</span>
                    </div>
                    <div className="p-2 bg-black/20 rounded-xl space-y-0.5">
                      <span className="text-white/40 block">Shelters Open</span>
                      <span className="text-emerald-400 font-bold">{zone.sheltersAvailable} Shelters</span>
                    </div>
                  </div>

                  {/* Vulnerability list */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-white/40 font-mono uppercase block">Vulnerabilities:</span>
                    <div className="flex flex-wrap gap-1">
                      {zone.vulnerabilityFactors.map((v, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-white/60 font-mono">
                          • {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trigger Evacuation Button */}
                  <button
                    onClick={() => handleTriggerEvacuation(zone.name)}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono font-bold text-[10px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Radio className="w-3 h-3 text-rose-400" />
                    <span>Broadcast Wireless Evacuation Alert</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
