import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet, 
  TrendingUp, 
  Zap, 
  Droplets, 
  Globe, 
  Sun, 
  Building2, 
  Award, 
  ChevronRight, 
  RefreshCw, 
  PieChart as PieChartIcon, 
  Layers, 
  Target, 
  Info, 
  Check, 
  Share2, 
  AlertTriangle 
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
  Legend 
} from 'recharts';
import { ComprehensiveReport, ReportTypeKey, TwinRegion } from '../types';
import { PRESET_REPORTS_MAP } from '../data/mockReportingData';
import { exportElementToPDF } from '../utils/pdfExport';

interface ExecutiveReportsProps {
  region: TwinRegion;
  initialMarkdown?: string;
}

const REPORT_TYPE_CONFIGS: { key: ReportTypeKey; label: string; icon: any; color: string; description: string }[] = [
  {
    key: 'executive',
    label: 'Executive Summary',
    icon: FileText,
    color: 'emerald',
    description: 'High-level executive briefing combining ESG, Carbon, Water & Clean Energy metrics.'
  },
  {
    key: 'climate',
    label: 'Climate Impact Report',
    icon: Globe,
    color: 'cyan',
    description: 'Urban heat island mitigation, air quality index (AQI), and flood risk attenuation.'
  },
  {
    key: 'carbon',
    label: 'Carbon Report',
    icon: Target,
    color: 'teal',
    description: 'Scope 1, 2, and 3 greenhouse gas inventory, emission intensity, and net-zero targets.'
  },
  {
    key: 'water',
    label: 'Water Report',
    icon: Droplets,
    color: 'blue',
    description: 'Aquifer recharge, non-revenue water (NRW) leak telemetry, and wastewater circularity.'
  },
  {
    key: 'energy',
    label: 'Energy Report',
    icon: Sun,
    color: 'amber',
    description: 'Rooftop solar, wind power, utility BESS battery dispatch, and microgrid autonomy.'
  }
];

export const ExecutiveReports: React.FC<ExecutiveReportsProps> = ({ region }) => {
  const [activeReportKey, setActiveReportKey] = useState<ReportTypeKey>('executive');
  const [reportsData, setReportsData] = useState<Record<ReportTypeKey, ComprehensiveReport>>(PRESET_REPORTS_MAP);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [customBriefPrompt, setCustomBriefPrompt] = useState('');

  const currentReport = reportsData[activeReportKey] || PRESET_REPORTS_MAP.executive;

  // Handle Export CSV
  const handleExportCSV = () => {
    if (!currentReport) return;

    // Build CSV Content
    let csvRows: string[] = [];
    csvRows.push(`REPORT TITLE,"${currentReport.title.replace(/"/g, '""')}"`);
    csvRows.push(`REPORT TYPE,"${currentReport.typeTitle}"`);
    csvRows.push(`REGION,"${currentReport.regionName}"`);
    csvRows.push(`GENERATED AT,"${currentReport.generatedAt}"`);
    csvRows.push(`AUTHOR,"${currentReport.author}"`);
    csvRows.push(`COMPLIANCE,"${currentReport.complianceBadge}"`);
    csvRows.push('');

    // Key Metrics
    csvRows.push('--- KEY METRICS ---');
    csvRows.push('Metric Label,Value,Change,Trend Subtext');
    currentReport.keyMetrics.forEach(m => {
      csvRows.push(`"${m.label}","${m.value}","${m.change}","${m.subtext}"`);
    });
    csvRows.push('');

    // Table Data
    csvRows.push(`--- ${currentReport.tableTitle.toUpperCase()} ---`);
    csvRows.push(currentReport.tableHeaders.map(h => `"${h}"`).join(','));
    currentReport.tableRows.forEach(row => {
      csvRows.push(`"${row.sectorName}","${row.metricA}","${row.metricB}","${row.metricC}","${row.status}","${row.variancePct}"`);
    });
    csvRows.push('');

    // Strategic Recommendations
    csvRows.push('--- STRATEGIC ACTION RECOMMENDATIONS ---');
    csvRows.push('Title,Category,Priority,Est Cost USD,Timeframe,Agency,Impact');
    currentReport.recommendations.forEach(r => {
      csvRows.push(`"${r.title}","${r.category}","${r.priority}","${r.estCostUSD}","${r.timeframe}","${r.responsibleAgency}","${r.impact}"`);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentReport.typeKey}-report-${currentReport.regionName.toLowerCase().replace(/\s+/g, '-')}-${currentReport.generatedAt}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastNotification({
      type: 'success',
      message: `CSV Dataset exported for ${currentReport.typeTitle}!`
    });
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Handle Export PDF via client-side html2canvas + jsPDF engine
  const handleExportPDF = async () => {
    if (isExportingPDF || !currentReport) return;
    setIsExportingPDF(true);
    setToastNotification(null);

    try {
      await exportElementToPDF({
        elementId: 'printable-report-document',
        filename: `${currentReport.typeKey}-report-${currentReport.regionName.toLowerCase().replace(/\s+/g, '-')}-${currentReport.generatedAt}.pdf`,
        reportTitle: currentReport.title
      });

      setToastNotification({
        type: 'success',
        message: `PDF generated and downloaded successfully!`
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      setToastNotification({
        type: 'error',
        message: 'Failed to generate PDF file. Please try again.'
      });
    } finally {
      setIsExportingPDF(false);
      setTimeout(() => setToastNotification(null), 5000);
    }
  };

  // Handle AI Re-Synthesis of current report narrative
  const handleResynthesizeReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customBriefPrompt || currentReport.title,
          region: region.name,
          scenarioData: {
            reportType: currentReport.typeKey,
            baselineCO2Mtons: region.baselineCO2Mtons,
            currentAQI: region.currentAQI,
            floodRiskScore: region.floodRiskScore
          }
        })
      });

      const resData = await response.json();
      if (resData.success && resData.markdown) {
        setReportsData(prev => ({
          ...prev,
          [activeReportKey]: {
            ...prev[activeReportKey],
            executiveSummary: resData.markdown.slice(0, 600) + '...',
            generatedAt: new Date().toISOString().split('T')[0]
          }
        }));
      }
    } catch (err) {
      console.error('Error re-synthesizing AI report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification Alert Banner */}
      {toastNotification && (
        <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between shadow-2xl animate-fade-in ${
          toastNotification.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' 
            : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
        }`}>
          <div className="flex items-center space-x-3">
            {toastNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-bold">{toastNotification.message}</span>
          </div>
          <button 
            onClick={() => setToastNotification(null)}
            className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Reporting Center Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Enterprise Reporting Center</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ISO 14064 & SEC ESG Disclosure Ready
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sustainability & Climate Reporting Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate, customize, and export audit-ready Executive Summaries, Climate Impact, Carbon, Water, and Energy reports with interactive charts and AI recommendations.
          </p>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-sm hover:border-emerald-500/40"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Data</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed"
          >
            {isExportingPDF ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-emerald-400">Generating PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Export PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 print:hidden">
        {REPORT_TYPE_CONFIGS.map((cfg) => {
          const IconComponent = cfg.icon;
          const isActive = activeReportKey === cfg.key;
          return (
            <button
              key={cfg.key}
              onClick={() => setActiveReportKey(cfg.key)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-slate-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${
                  isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </div>

              <div>
                <h3 className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {cfg.label}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                  {cfg.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* AI Re-Synthesis Brief Input Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-3 backdrop-blur-xl print:hidden">
        <div className="flex items-center space-x-2 text-emerald-400 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold">AI Report Synthesizer</span>
        </div>
        <input
          type="text"
          placeholder={`Add custom focus directive for ${currentReport.typeTitle} in ${region.name}...`}
          value={customBriefPrompt}
          onChange={(e) => setCustomBriefPrompt(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
        />
        <button
          onClick={handleResynthesizeReport}
          disabled={isGenerating}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-500/20"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Generating AI Brief...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Re-Synthesize Brief</span>
            </>
          )}
        </button>
      </div>

      {/* MAIN RENDERED REPORT DOCUMENT CONTAINER */}
      <div id="printable-report-document" className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden printable-area">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Report Document Header */}
        <div className="border-b border-slate-800 pb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentReport.typeTitle}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {currentReport.complianceBadge}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Report ID: <strong className="text-slate-200 font-mono">{currentReport.id}</strong>
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {currentReport.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Target Region</span>
              <span className="font-bold text-white mt-0.5 block">{currentReport.regionName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Author / Publisher</span>
              <span className="font-bold text-white mt-0.5 block">{currentReport.author}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Audit Status</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">{currentReport.status}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Publication Date</span>
              <span className="font-bold text-white mt-0.5 block">{currentReport.generatedAt}</span>
            </div>
          </div>
        </div>

        {/* Section 1: AI Executive Summary Narrative */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>1. AI Executive Briefing & Narrative Summary</span>
            </h3>
            <span className="text-xs text-slate-400">Gemini Neural Analytics</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 text-sm text-slate-300 leading-relaxed font-normal">
            {currentReport.executiveSummary}
          </div>
        </div>

        {/* Section 2: Key Metrics Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>2. Core Performance Metrics & Benchmark Indicators</span>
            </h3>
            <span className="text-xs text-slate-400">{currentReport.keyMetrics.length} Key Indicators</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentReport.keyMetrics.map((m, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {m.label}
                </span>
                <div className="text-lg font-black text-emerald-400">
                  {m.value}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-bold text-emerald-300">{m.change}</span>
                  <span className="text-slate-500 truncate">{m.subtext}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Interactive Recharts Visualizations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>3. {currentReport.chartTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentReport.chartSubtitle}</p>
            </div>
            <span className="text-xs text-slate-400">Time-Series Telemetry</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              {currentReport.typeKey === 'executive' ? (
                <AreaChart data={currentReport.chartData}>
                  <defs>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="carbonScore" name="Sustainability Score" stroke="#10B981" fillOpacity={1} fill="url(#colorCarbon)" />
                  <Area type="monotone" dataKey="energyCleanPct" name="Clean Energy %" stroke="#06B6D4" fillOpacity={1} fill="url(#colorEnergy)" />
                </AreaChart>
              ) : currentReport.typeKey === 'climate' ? (
                <BarChart data={currentReport.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="peakTempC" name="Peak Temp (°C)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aqiPM25" name="Air Quality (AQI PM2.5)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : currentReport.typeKey === 'carbon' ? (
                <AreaChart data={currentReport.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="scope1" name="Scope 1 Direct" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="scope2" name="Scope 2 Grid" stackId="1" stroke="#06B6D4" fill="#06B6D4" />
                  <Area type="monotone" dataKey="scope3" name="Scope 3 Value Chain" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                </AreaChart>
              ) : currentReport.typeKey === 'water' ? (
                <AreaChart data={currentReport.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="totalDistributedMML" name="Total Water Distributed (MML)" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="leakLossesMML" name="Pipe Leak Loss (MML)" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                </AreaChart>
              ) : (
                <AreaChart data={currentReport.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="solarMW" name="Solar PV (MW)" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                  <Area type="monotone" dataKey="windMW" name="Wind Power (MW)" stackId="1" stroke="#06B6D4" fill="#06B6D4" />
                  <Area type="monotone" dataKey="fossilGridMW" name="Grid Fossil Baseload (MW)" stackId="1" stroke="#64748b" fill="#64748b" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 4: Data Table Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>4. {currentReport.tableTitle}</span>
            </h3>

            <button
              onClick={handleExportCSV}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 cursor-pointer print:hidden"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Table CSV</span>
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    {currentReport.tableHeaders.map((header, hIdx) => (
                      <th key={hIdx} className="p-3.5">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {currentReport.tableRows.map((row, rIdx) => (
                    <tr key={row.id || rIdx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-slate-200">{row.sectorName}</td>
                      <td className="p-3.5 font-medium text-emerald-400">{row.metricA}</td>
                      <td className="p-3.5 font-medium text-cyan-400">{row.metricB}</td>
                      <td className="p-3.5 font-medium text-slate-300">{row.metricC}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-300">{row.variancePct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 5: Strategic Actionable AI Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>5. Actionable Policy & Capital Investment Recommendations</span>
            </h3>
            <span className="text-xs text-slate-400">{currentReport.recommendations.length} Action Directives</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentReport.recommendations.map((rec, rIdx) => (
              <div key={rec.id || rIdx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center shrink-0">
                      R{rIdx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                    rec.priority === 'Immediate Critical' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {rec.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  <strong>Expected Impact:</strong> {rec.impact}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Est. Cost / Budget</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">{rec.estCostUSD}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Timeframe</span>
                    <span className="font-bold text-white mt-0.5 block">{rec.timeframe}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Lead Responsible Agency</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{rec.responsibleAgency}</span>
                  </div>
                </div>

                {rec.actionSteps && rec.actionSteps.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Milestones:</span>
                    {rec.actionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Document Approval Signatures Footer */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">CHIEF ESG OFFICER APPROVAL</span>
            <span className="font-bold text-white text-sm block">Dr. Elena Rostova</span>
            <span className="text-[10px] text-emerald-400 flex items-center font-mono pt-1">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> Digitally Signed & Encrypted
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">MUNICIPAL GOVERNANCE COUNCIL</span>
            <span className="font-bold text-white text-sm block">Metropolis City Planning Director</span>
            <span className="text-[10px] text-emerald-400 flex items-center font-mono pt-1">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> Municipal Archive Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
