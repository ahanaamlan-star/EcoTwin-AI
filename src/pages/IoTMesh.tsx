import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Battery, 
  RefreshCw, 
  Clock, 
  Sliders, 
  TrendingUp, 
  TrendingDown,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Zap,
  Volume2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { IoTSensor } from '../types';
import { MOCK_IOT_SENSORS } from '../data/mockTwinData';

interface IoTMeshProps {
  onNavigateToCopilot: (prompt: string) => void;
}

export const IoTMesh: React.FC<IoTMeshProps> = ({ onNavigateToCopilot }) => {
  const [sensors, setSensors] = useState<IoTSensor[]>(MOCK_IOT_SENSORS);
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor>(MOCK_IOT_SENSORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Live sensor ping simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sns) => {
          const delta = (Math.random() - 0.48) * 0.8;
          const currentVal = typeof sns?.currentValue === 'number' ? sns.currentValue : 0;
          const newValue = parseFloat((currentVal + delta).toFixed(2));
          return {
            ...sns,
            currentValue: Math.max(0, newValue),
            lastPing: 'Just now'
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', 'Air Quality', 'Thermal', 'Hydrology', 'Grid Load', 'Biodiversity', 'Acoustics'];

  const filteredSensors = sensors.filter((sns) => {
    const matchesSearch = sns.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sns.districtName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || sns.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest font-mono">
              REAL-TIME IoT MESH
            </span>
            <span className="text-xs text-white/40">• 420 Connected Telemetry Nodes</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            IoT Environmental Sensor Network
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Streaming real-time micro-climate, water, acoustics, and power telemetry.
          </p>
        </div>

        {/* Live Network Health Status */}
        <div className="flex items-center space-x-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div className="text-left font-mono">
            <div className="text-[10px] text-white/40">NETWORK LATENCY</div>
            <div className="text-xs font-bold text-emerald-400">12ms (99.98% Uptime)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-2xl backdrop-blur-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search sensor name or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white/90 placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedType === cat
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-white/[0.03] border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sensor List Table / Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSensors.map((sns) => {
              const isSelected = selectedSensor?.id === sns.id;
              return (
                <div
                  key={sns.id}
                  onClick={() => setSelectedSensor(sns)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 backdrop-blur-xl ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40">{sns.id}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase ${
                        sns.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {sns.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{sns.name}</h4>
                    <p className="text-[10px] text-white/40">{sns.districtName}</p>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-white/10">
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {sns.currentValue} <span className="text-xs font-normal text-white/50">{sns.unit}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-white/40 font-mono">
                      <Battery className="w-3 h-3 text-emerald-400" />
                      <span>{sns.batteryLevel}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Sensor Telemetry Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {selectedSensor ? (
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    INSPECTOR • NODE {selectedSensor.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedSensor.name}</h3>
                  <p className="text-xs text-white/40">{selectedSensor.location}</p>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-emerald-400 font-bold">{selectedSensor.type}</div>
                  <div className="text-[10px] text-white/40">Ping: {selectedSensor.lastPing}</div>
                </div>
              </div>

              {/* Current Value Display */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-mono font-bold">LIVE TELEMETRY READOUT</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    {selectedSensor.currentValue} <span className="text-sm font-normal text-white/50">{selectedSensor.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CALIBRATED
                  </span>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80 font-semibold">24-Hour Telemetry Stream</span>
                  <span className="text-white/40 font-mono text-[10px]">Sample Rate: 1s</span>
                </div>
                <div className="h-44 w-full bg-[#050608] border border-white/10 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSensor.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#080a0f', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px', color: '#fff' }} />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onNavigateToCopilot(`Analyze sensor readings for node ${selectedSensor.id} (${selectedSensor.name}) in ${selectedSensor.districtName} showing ${selectedSensor.currentValue} ${selectedSensor.unit}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 font-semibold text-xs transition-all"
              >
                Query AI Anomaly Diagnostics
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
