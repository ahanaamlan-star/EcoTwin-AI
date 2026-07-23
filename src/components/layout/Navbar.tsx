import React, { useState } from 'react';
import { 
  Globe2, 
  Sparkles, 
  Bell, 
  Search, 
  ChevronDown, 
  Cpu, 
  Layers, 
  User, 
  Check, 
  Sliders,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { TWIN_REGIONS } from '../../data/mockTwinData';
import { TwinRegionId } from '../../types';

interface NavbarProps {
  selectedRegionId: TwinRegionId;
  onSelectRegion: (id: TwinRegionId) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  isSimulating?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedRegionId,
  onSelectRegion,
  activeTab,
  onNavigate,
  isSimulating = false
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activePersona, setActivePersona] = useState('Municipal Director (ESG)');

  const currentRegion = TWIN_REGIONS.find((r) => r.id === selectedRegionId) || TWIN_REGIONS[0];

  const personas = [
    { title: 'Municipal Director (ESG)', dept: 'City Administration' },
    { title: 'Lead Climate Architect', dept: 'Urban Planning Commission' },
    { title: 'Energy Grid Engineer', dept: 'Utilities & Power' },
    { title: 'Community Sustainability Lead', dept: 'Public Affairs' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between shadow-2xl">
      {/* Brand & Digital Twin Selector */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('viewport')}
        >
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-transform group-hover:scale-105">
            <Globe2 className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">
                EcoTwin AI
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest">
                Simulation Active
              </span>
            </div>
            <p className="text-[10px] text-white/40 font-mono hidden sm:block">
              LAT: {Number(currentRegion?.lat ?? 40.7128).toFixed(4)} • LNG: {Number(currentRegion?.lng ?? -74.0060).toFixed(4)}
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden md:block" />

        {/* Digital Twin Region Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs text-white/90 transition-all backdrop-blur-md"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <div className="text-left">
              <span className="text-[9px] text-white/40 block font-bold uppercase tracking-wider">ACTIVE TWIN MODEL</span>
              <span className="font-semibold text-white">{currentRegion.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/40 ml-1" />
          </button>

          {showRegionDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#080a0f] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Select Digital Twin Region
              </div>
              <div className="space-y-1">
                {TWIN_REGIONS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      onSelectRegion(region.id);
                      setShowRegionDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      selectedRegionId === region.id
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'hover:bg-white/5 text-white/70'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{region.name}</div>
                      <div className="text-[10px] text-white/40">{region.category} • {region.location}</div>
                    </div>
                    {selectedRegionId === region.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Search & Live Simulation Status */}
      <div className="hidden lg:flex items-center space-x-3">
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search sensors, districts..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white/90 placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
          />
        </div>

        {isSimulating ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.2)]">
            <Cpu className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            <span className="font-mono text-[10px] font-bold tracking-wider">NEURAL SIM ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="font-mono text-[10px] text-white/50">TWIN SYNC: 100% (12ms)</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Copilot Quick Launch */}
        <button
          onClick={() => onNavigate('copilot')}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 relative transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#050608] shadow-[0_0_8px_#f59e0b]" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#080a0f] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-bold text-white">System Telemetry Alerts</span>
                <span className="text-[10px] text-emerald-400 font-mono">3 Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-white/80">
                  <div className="font-bold text-amber-400 text-[11px]">Heat Island Surge Alert</div>
                  <div className="text-[10px] text-white/50 mt-0.5">Central Financial Plaza spike to +3.4°C baseline.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-white/80">
                  <div className="font-bold text-teal-300 text-[11px]">Tidal Surge Prediction</div>
                  <div className="text-[10px] text-white/50 mt-0.5">Harbor Port buoy indicates high-tide peak in 4 hrs.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-white/80">
                  <div className="font-bold text-emerald-400 text-[11px]">Grid Inertia Balanced</div>
                  <div className="text-[10px] text-white/50 mt-0.5">Substation 8B solar dispatch increased +12%.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persona Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center space-x-2 p-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full rounded-[6px] bg-[#050608] flex items-center justify-center text-emerald-400 font-bold text-[10px]">
                EA
              </div>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-[11px] font-semibold text-white leading-tight">{activePersona}</div>
              <div className="text-[9px] font-mono text-emerald-400">ENTERPRISE ADMIN</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden md:block" />
          </button>

          {showPersonaMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#080a0f] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Switch Role Context
              </div>
              <div className="space-y-1">
                {personas.map((p) => (
                  <button
                    key={p.title}
                    onClick={() => {
                      setActivePersona(p.title);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      activePersona === p.title
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium'
                        : 'hover:bg-white/5 text-white/70'
                    }`}
                  >
                    <div className="font-semibold text-white">{p.title}</div>
                    <div className="text-[10px] text-white/40">{p.dept}</div>
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 px-3">
                <span className="flex items-center"><ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" /> SEC / ISO Compliant</span>
                <span className="font-mono">v4.8.2</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
