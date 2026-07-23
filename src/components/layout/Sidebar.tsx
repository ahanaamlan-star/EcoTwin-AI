import React from 'react';
import { 
  LayoutDashboard,
  Globe2, 
  SlidersHorizontal, 
  Cpu, 
  BarChart3, 
  Sparkles, 
  FileSpreadsheet, 
  Users, 
  ChevronRight,
  ShieldAlert,
  Droplets,
  Sun,
  BookOpen,
  HelpCircle,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  collapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      badge: 'MAIN',
      icon: LayoutDashboard,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'viewport',
      label: 'Digital Twin Viewport',
      badge: '3D LIVE',
      icon: Globe2,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    },
    {
      id: 'simulator',
      label: 'Scenario Simulator',
      badge: 'AI GEN',
      icon: SlidersHorizontal,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    },
    {
      id: 'disaster',
      label: 'Disaster Prediction',
      badge: '5 RISK GAUGE',
      icon: ShieldAlert,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'water',
      label: 'Water Intelligence',
      badge: 'HYDROMESH',
      icon: Droplets,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'renewable-energy',
      label: 'Renewable Energy Planner',
      badge: 'CLEAN GRID',
      icon: Sun,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'iot-mesh',
      label: 'IoT Telemetry Mesh',
      badge: '420 Nodes',
      icon: Cpu,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    {
      id: 'carbon',
      label: 'Carbon Intelligence',
      badge: 'Scope 1-3',
      icon: BarChart3,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'copilot',
      label: 'AI Copilot Advisor',
      badge: 'Gemini 3.6',
      icon: Sparkles,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'policy-advisor',
      label: 'AI Policy Advisor',
      badge: 'SDG & ROI',
      icon: BookOpen,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'reports',
      label: 'Reporting Center',
      badge: 'PDF / CSV',
      icon: FileSpreadsheet,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'community',
      label: 'Community Impact',
      badge: 'Public',
      icon: Users,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    }
  ];

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-30 bg-black/40 border-r border-white/5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Upper Navigation Items */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className={`px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest ${collapsed ? 'hidden' : 'block'}`}>
          Navigation Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-white/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : 'text-white/50 group-hover:text-white'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate tracking-tight">{item.label}</span>
                )}
              </div>

              {!collapsed && (
                <span
                  className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#080a0f] border border-white/10 text-white text-xs rounded-xl shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 backdrop-blur-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / System Health / Collapse Toggle */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {!collapsed && (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/60 flex items-center font-bold text-[10px] uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Governance
              </span>
              <span className="text-emerald-400 font-bold font-mono text-[10px] tracking-wider">ACTIVE</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[88%] shadow-[0_0_8px_#10b981]" />
            </div>
            <div className="text-[10px] text-white/40 flex justify-between font-mono">
              <span>88% Net Carbon Goal</span>
              <span>Target 2030</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                collapsed ? '' : 'rotate-180'
              }`}
            />
          </button>

          {!collapsed && (
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onNavigate('copilot')}
                className="p-1.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all"
                title="Help & Copilot"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
