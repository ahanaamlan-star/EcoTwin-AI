import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  Flame, 
  Waves, 
  Wind, 
  Zap, 
  Radio, 
  Maximize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Sliders, 
  Info, 
  TrendingUp, 
  Building2, 
  Thermometer, 
  Droplets, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TwinRegion, District } from '../types';

interface DigitalTwinViewportProps {
  region: TwinRegion;
  onNavigateToSimulator: (districtId?: string) => void;
  onNavigateToCopilot: (contextText: string) => void;
}

export const DigitalTwinViewport: React.FC<DigitalTwinViewportProps> = ({
  region,
  onNavigateToSimulator,
  onNavigateToCopilot
}) => {
  // Layer controls
  const [activeBaseLayer, setActiveBaseLayer] = useState<'dark' | 'satellite' | 'lidar'>('dark');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showPollutionPlumes, setShowPollutionPlumes] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showIoTPins, setShowIoTPins] = useState(true);

  // Time Scrub Control
  const [timelineYear, setTimelineYear] = useState(2026);
  const [isPlaying, setIsPlaying] = useState(false);

  // Selected District
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(region.districts[0] || null);

  // Toggle play simulation
  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineYear((prev) => (prev >= 2045 ? 2026 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Viewport Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest">
              3D DIGITAL TWIN MODEL
            </span>
            <span className="text-xs text-white/40">• {region.location} ({region.areaKm2} km²)</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            {region.name}
          </h1>
          <p className="text-xs text-white/50 mt-0.5 max-w-2xl">
            {region.description}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToSimulator(selectedDistrict?.id)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <Sliders className="w-4 h-4 text-black" />
            <span>Simulate Interventions</span>
          </button>
          <button
            onClick={() => onNavigateToCopilot(`Explain heat and flood vulnerability for district: ${selectedDistrict?.name || region.name}`)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Query AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Workspace: Left Map Canvas, Right District Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Twin Viewport Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative h-[540px] rounded-3xl border border-white/10 bg-[#050608] overflow-hidden shadow-2xl group">
            {/* Base Layer Render (Image + Overlays) */}
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                activeBaseLayer === 'satellite' ? 'brightness-110 contrast-125' : 'brightness-75 contrast-110'
              }`}
              style={{ backgroundImage: `url(${region.image})` }}
            >
              <div className={`absolute inset-0 ${
                activeBaseLayer === 'dark' 
                  ? 'bg-black/80 backdrop-blur-[2px]' 
                  : activeBaseLayer === 'lidar' 
                  ? 'bg-emerald-950/80 mix-blend-multiply' 
                  : 'bg-black/40'
              }`} />
            </div>

            {/* Overlay Layer 1: Simulated Heatmap Overlay */}
            {showHeatmap && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 45% 52%, rgba(244, 63, 94, ${0.4 + (timelineYear - 2026) * 0.01}), transparent 40%),
                               radial-gradient(circle at 72% 78%, rgba(245, 158, 11, ${0.35 + (timelineYear - 2026) * 0.015}), transparent 35%),
                               radial-gradient(circle at 30% 28%, rgba(16, 185, 129, 0.25), transparent 30%)`
                }}
              />
            )}

            {/* Overlay Layer 2: Flood Zone Overlay */}
            {showFloodZones && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-45 mix-blend-color-dodge transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 75% 75%, rgba(6, 182, 212, ${0.5 + (timelineYear - 2026) * 0.02}), transparent 55%)`
                }}
              />
            )}

            {/* Overlay Layer 3: Grid Lines SVG */}
            {showGridLines && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="45%" y1="52%" x2="72%" y2="78%" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
                <line x1="45%" y1="52%" x2="30%" y2="28%" stroke="#06b6d4" strokeWidth="1.5" />
                <line x1="30%" y1="28%" x2="20%" y2="65%" stroke="#10b981" strokeWidth="1.5" />
                <line x1="72%" y1="78%" x2="80%" y2="32%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            )}

            {/* Interactive District Pins on Map */}
            {region.districts.map((district) => {
              const isSelected = selectedDistrict?.id === district.id;
              const statusBg = district.status === 'critical' ? 'bg-rose-500' : district.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <div
                  key={district.id}
                  onClick={() => setSelectedDistrict(district)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
                  style={{ left: `${district.coordinates.x}%`, top: `${district.coordinates.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className={`absolute w-8 h-8 rounded-full ${statusBg} opacity-30 animate-ping`} />
                    <button
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-all transform group-hover/pin:scale-125 ${
                        isSelected
                          ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-black scale-110 bg-white text-black'
                          : `${statusBg} text-black`
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Hover Tooltip Card */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pin:block w-44 p-2 bg-[#080a0f]/95 border border-white/10 rounded-xl shadow-2xl text-white z-30 pointer-events-none backdrop-blur-md">
                      <div className="font-bold text-[11px] truncate">{district.name}</div>
                      <div className="text-[10px] text-white/50 mt-0.5 flex justify-between font-mono">
                        <span>Temp: +{district.tempOffsetC}°C</span>
                        <span className="text-emerald-400">{district.currentCo2Ppm} ppm</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Top Viewport Layer Controls Floating Bar */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-30">
              <div className="flex items-center space-x-1 p-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                <button
                  onClick={() => setActiveBaseLayer('dark')}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-all ${
                    activeBaseLayer === 'dark' ? 'bg-white/10 text-emerald-400 font-bold border border-emerald-500/30' : 'text-white/50 hover:text-white'
                  }`}
                >
                  VECTOR
                </button>
                <button
                  onClick={() => setActiveBaseLayer('satellite')}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-all ${
                    activeBaseLayer === 'satellite' ? 'bg-white/10 text-emerald-400 font-bold border border-emerald-500/30' : 'text-white/50 hover:text-white'
                  }`}
                >
                  SATELLITE
                </button>
                <button
                  onClick={() => setActiveBaseLayer('lidar')}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-all ${
                    activeBaseLayer === 'lidar' ? 'bg-white/10 text-emerald-400 font-bold border border-emerald-500/30' : 'text-white/50 hover:text-white'
                  }`}
                >
                  LiDAR
                </button>
              </div>

              {/* Toggle Layer Overlays */}
              <div className="flex items-center space-x-1.5 p-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    showHeatmap ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'border-white/10 text-white/40 hover:text-white'
                  }`}
                  title="Toggle Heat Island Overlay"
                >
                  <Flame className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowFloodZones(!showFloodZones)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    showFloodZones ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'border-white/10 text-white/40 hover:text-white'
                  }`}
                  title="Toggle Flood Surge Risk Overlay"
                >
                  <Waves className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowGridLines(!showGridLines)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    showGridLines ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-white/10 text-white/40 hover:text-white'
                  }`}
                  title="Toggle Energy Grid Network"
                >
                  <Zap className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Timeline Controls Scrub Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 h-16 bg-black/80 backdrop-blur-lg rounded-2xl border border-white/10 flex items-center justify-between px-6 z-30">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)] shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 mx-6 space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/40 uppercase font-bold tracking-widest">TIMELINE CONTROL</span>
                  <span className="text-emerald-400 font-bold">YEAR {timelineYear}</span>
                </div>
                <input
                  type="range"
                  min={2026}
                  max={2045}
                  value={timelineYear}
                  onChange={(e) => setTimelineYear(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/10 h-1 rounded-full cursor-pointer"
                />
              </div>

              <div className="hidden sm:block text-right font-mono text-[10px] text-white/40 shrink-0">
                <div>PROJ: +{(((timelineYear ?? 2026) - 2026) * 0.08 + 1.4).toFixed(2)}°C</div>
                <div className="text-emerald-400">SURGE: +{(((timelineYear ?? 2026) - 2026) * 0.02 + 0.35).toFixed(2)}m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right District Telemetry Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedDistrict ? (
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono block">
                    SELECTED DISTRICT
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedDistrict.name}</h3>
                  <p className="text-xs text-white/40">{selectedDistrict.type} Zone</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase border ${
                    selectedDistrict.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : selectedDistrict.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {selectedDistrict.status}
                </span>
              </div>

              {/* KPI Grid for Selected District */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
                  <div className="text-white/40 text-[10px] flex items-center font-bold uppercase tracking-wider">
                    <Thermometer className="w-3 h-3 text-rose-400 mr-1" /> Temp Offset
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    +{selectedDistrict.tempOffsetC}°C
                  </div>
                  <div className="text-[9px] text-rose-400">Above rural baseline</div>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
                  <div className="text-white/40 text-[10px] flex items-center font-bold uppercase tracking-wider">
                    <Droplets className="w-3 h-3 text-cyan-400 mr-1" /> Green Canopy
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedDistrict.canopyCoveragePct}%
                  </div>
                  <div className="text-[9px] text-emerald-400">Urban foliage ratio</div>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
                  <div className="text-white/40 text-[10px] flex items-center font-bold uppercase tracking-wider">
                    <Wind className="w-3 h-3 text-amber-400 mr-1" /> Ambient CO2
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedDistrict.currentCo2Ppm} <span className="text-xs font-normal">ppm</span>
                  </div>
                  <div className="text-[9px] text-white/40">Target &lt; 420 ppm</div>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
                  <div className="text-white/40 text-[10px] flex items-center font-bold uppercase tracking-wider">
                    <Zap className="w-3 h-3 text-emerald-400 mr-1" /> Grid Load
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedDistrict.gridLoadMW} <span className="text-xs font-normal">MW</span>
                  </div>
                  <div className="text-[9px] text-white/40">{selectedDistrict.activeSensorsCount} IoT nodes</div>
                </div>
              </div>

              {/* District Action Cards */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onNavigateToSimulator(selectedDistrict.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all group"
                >
                  <span className="flex items-center">
                    <Sliders className="w-4 h-4 text-emerald-400 mr-2" />
                    Simulate Interventions
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateToCopilot(`Provide policy recommendations for ${selectedDistrict.name} with CO2 ${selectedDistrict.currentCo2Ppm} ppm and temp offset +${selectedDistrict.tempOffsetC}°C`)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all group"
                >
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 text-teal-400 mr-2" />
                    Generate AI Vulnerability Brief
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-white/40 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
              Select a district pin on the map to inspect telemetry.
            </div>
          )}

          {/* District List Overview Mini Panel */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">
              Region District Health ({region.districts.length})
            </h4>
            <div className="space-y-2">
              {region.districts.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    selectedDistrict?.id === d.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-white/70'
                  }`}
                >
                  <div>
                    <div className="font-medium text-white">{d.name}</div>
                    <div className="text-[10px] text-white/40">{d.type} • Elev: {d.elevationMeters}m</div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    d.status === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : d.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
