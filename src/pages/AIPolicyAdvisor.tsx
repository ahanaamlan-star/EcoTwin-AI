import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Award, 
  Printer, 
  Download, 
  Send, 
  CheckCircle2, 
  Building2, 
  Layers, 
  PieChart as PieChartIcon, 
  Target, 
  Globe, 
  RefreshCw, 
  Sun, 
  Droplets, 
  Zap, 
  ChevronRight, 
  Info, 
  HelpCircle,
  Clock,
  ArrowUpRight,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { exportElementToPDF } from '../utils/pdfExport';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { PolicyAdviceReport } from '../types';

interface AIPolicyAdvisorProps {
  region: string;
  onNavigateToCopilot?: () => void;
  onNavigateToReports?: () => void;
}

const PRESET_QUESTIONS = [
  {
    domain: 'Net-Zero Transit',
    question: 'How can Metropolis Delta achieve net-zero carbon public transit and EV freight logistics by 2032?',
    icon: Zap,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    domain: 'Water Security',
    question: 'What policies will prevent underground aquifer depletion and cut urban water network leaks by 40%?',
    icon: Droplets,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
  },
  {
    domain: 'Renewable Microgrids',
    question: 'How to deploy 250MW rooftop solar and 120MWh battery storage across commercial districts with resilience guarantees?',
    icon: Sun,
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  },
  {
    domain: 'Industrial Carbon Tax',
    question: 'What carbon border adjustment and heavy industry cap-and-trade policies should be enforced to offset Scope 1-3 emissions?',
    icon: Target,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    domain: 'Green Building Standards',
    question: 'How can we mandate net-zero green building codes and embodied carbon limits for new high-density commercial developments?',
    icon: Building2,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
  },
  {
    domain: 'Urban Canopy & Heat',
    question: 'What regulatory framework encourages Miyawaki forest corridors, cool roofs, and bioswales to reduce summer urban heat by 3°C?',
    icon: Globe,
    color: 'text-green-400 bg-green-500/10 border-green-500/20'
  }
];

export const AIPolicyAdvisor: React.FC<AIPolicyAdvisorProps> = ({
  region,
  onNavigateToCopilot,
  onNavigateToReports
}) => {
  const [userQuery, setUserQuery] = useState(PRESET_QUESTIONS[0].question);
  const [selectedRegion, setSelectedRegion] = useState(region || 'Metropolis Delta');
  const [timeframe, setTimeframe] = useState('2026-2035');
  const [budgetTier, setBudgetTier] = useState('$50M - $200M Strategy');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'policy' | 'roadmap' | 'budget' | 'impact' | 'risk' | 'cba'>('policy');
  const [currentReport, setCurrentReport] = useState<PolicyAdviceReport | null>(null);
  const [reportHistory, setReportHistory] = useState<PolicyAdviceReport[]>([]);
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Generate Initial Policy Brief on Mount
  React.useEffect(() => {
    handleGeneratePolicy(userQuery);
  }, []);

  const handleGeneratePolicy = async (queryToSubmit?: string) => {
    const q = queryToSubmit || userQuery;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/policy-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          region: selectedRegion,
          timeframe,
          budgetTier
        })
      });

      const json = await response.json();
      if (json.success && json.report) {
        setCurrentReport(json.report);
        setReportHistory(prev => [json.report, ...prev.filter(r => r.id !== json.report.id)]);
      }
    } catch (err) {
      console.error('Error generating policy report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (isExportingPDF || !currentReport) return;
    setIsExportingPDF(true);
    setToastNotification(null);

    try {
      await exportElementToPDF({
        elementId: 'policy-advisor-report-document',
        filename: `AI-Policy-Report-${currentReport.targetRegion.toLowerCase().replace(/\s+/g, '-')}-${currentReport.generatedDate}.pdf`,
        reportTitle: currentReport.queryQuestion
      });

      setToastNotification({
        type: 'success',
        message: 'Successfully generated and downloaded AI Policy PDF Report!'
      });
    } catch (err) {
      console.error('Policy PDF export failed:', err);
      setToastNotification({
        type: 'error',
        message: 'Failed to generate Policy PDF Report. Please try again.'
      });
    } finally {
      setIsExportingPDF(false);
      setTimeout(() => setToastNotification(null), 5000);
    }
  };

  const COLORS = ['#10B981', '#06B6D4', '#F59E0B', '#6366F1', '#EC4899'];

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

      {/* Page Title & Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.6 Policy Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              UN SDG Compliant
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>AI Policy Advisor</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Formulate authoritative urban sustainability frameworks, implementation roadmaps, budget projections, and SDG risk assessments powered by Gemini AI.
          </p>
        </div>

        <div className="flex items-center space-x-3 print:hidden">
          {currentReport && (
            <>
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
            </>
          )}
          {onNavigateToCopilot && (
            <button
              onClick={onNavigateToCopilot}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult AI Copilot</span>
            </button>
          )}
        </div>
      </div>

      {/* Query Studio Input Box */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Sustainability & Policy Query Studio</span>
          </div>
          <span className="text-xs text-slate-400">
            Ask any policy, legislative, or capital investment question
          </span>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g. How can Metropolis Delta achieve net-zero carbon transportation by 2035?"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            />
            <button
              onClick={() => handleGeneratePolicy()}
              disabled={isLoading || !userQuery.trim()}
              className="absolute bottom-3 right-3 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Strategy...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate Policy Brief</span>
                </>
              )}
            </button>
          </div>

          {/* Config Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Municipal Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Metropolis Delta">Metropolis Delta (Core Urban)</option>
                <option value="Bayfront Coastal Area">Bayfront Coastal Area</option>
                <option value="Northern Innovation District">Northern Innovation District</option>
                <option value="Eastern Eco Industrial Hub">Eastern Eco Industrial Hub</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Implementation Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="2026-2030">2026 - 2030 (Fast Track 4-Year)</option>
                <option value="2026-2035">2026 - 2035 (Standard 9-Year)</option>
                <option value="2030-2040">2030 - 2040 (Long-Term Horizon)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Budget Framework Tier</label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="$10M - $50M Strategy">$10M - $50M Seed / District Level</option>
                <option value="$50M - $200M Strategy">$50M - $200M City-Wide Capital Plan</option>
                <option value="$200M - $1B Strategy">$200M - $1B Major Regional Transformation</option>
              </select>
            </div>
          </div>

          {/* Preset Sample Prompts */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Policy Scenarios (Click to load):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PRESET_QUESTIONS.map((preset, idx) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserQuery(preset.question);
                      handleGeneratePolicy(preset.question);
                    }}
                    className="p-2.5 rounded-xl border bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/40 text-left transition-all group flex items-start space-x-2.5 cursor-pointer"
                  >
                    <div className={`p-1.5 rounded-lg border ${preset.color} shrink-0 mt-0.5`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-300 transition-colors">
                        {preset.domain}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {preset.question}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-white">Synthesizing Sustainability Policy Brief...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Gemini AI is analyzing regulatory frameworks, calculating capital expenditure ROI, modeling SDG compliance targets, and assembling phase roadmaps.
          </p>
        </div>
      )}

      {/* Generated Policy Report View */}
      {!isLoading && currentReport && (
        <div id="policy-advisor-report-document" className="space-y-8 print:space-y-6">
          {/* Executive Header Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Approved Policy Brief
                  </span>
                  <span className="text-xs text-slate-400">
                    ID: {currentReport.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {currentReport.queryQuestion}
                </h2>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-400 shrink-0">
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Region: <strong className="text-white">{currentReport.targetRegion}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Horizon: <strong className="text-white">{currentReport.timeframeYears}</strong></span>
                </div>
              </div>
            </div>

            {/* Executive Summary Text */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {currentReport.executiveSummary}
            </p>

            {/* Quick Key Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Capex</div>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  ${(currentReport.budgetEstimates.capexUSD / 1000000).toFixed(1)}M
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Capital expenditure</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Annual CO2 Offset</div>
                <div className="text-base font-extrabold text-teal-400 mt-0.5">
                  {currentReport.expectedImpact.annualCO2ReductionTons.toLocaleString()} Tons
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Net zero trajectory</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Benefit-Cost Ratio</div>
                <div className="text-base font-extrabold text-cyan-400 mt-0.5">
                  {currentReport.costBenefitAnalysis.benefitCostRatio}x
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">NPV ${ (currentReport.costBenefitAnalysis.netPresentValueUSD / 1000000).toFixed(0) }M</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Social Return (SROI)</div>
                <div className="text-base font-extrabold text-amber-400 mt-0.5">
                  ${currentReport.costBenefitAnalysis.socialReturnOnInvestmentRatio} : $1
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Public health & jobs</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Payback Period</div>
                <div className="text-base font-extrabold text-indigo-400 mt-0.5">
                  {currentReport.costBenefitAnalysis.paybackPeriodYears} Years
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">IRR {currentReport.costBenefitAnalysis.internalRateOfReturnPct}%</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Primary SDGs</div>
                <div className="flex items-center space-x-1.5 mt-1">
                  {currentReport.relevantSDGs.map((sdg, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: sdg.colorHex || '#10B981' }}
                    >
                      SDG {sdg.sdgNumber}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{currentReport.relevantSDGs.length} Goals Targeted</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Report Sections */}
          <div className="flex items-center space-x-1 overflow-x-auto border-b border-slate-800 pb-2 print:hidden">
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'policy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Policy Recommendations</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Implementation Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'budget'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Budget & Funding</span>
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'impact'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Expected Impact & SDGs</span>
            </button>

            <button
              onClick={() => setActiveTab('risk')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'risk'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Risk Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('cba')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 'cba'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Cost-Benefit Analysis</span>
            </button>
          </div>

          {/* TAB 1: POLICY RECOMMENDATIONS */}
          {(activeTab === 'policy' || isPrintPreview) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Strategic Policy Measures ({currentReport.policyRecommendations.length})</span>
                </h3>
                <span className="text-xs text-slate-400">Legislative & Governance Directives</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {currentReport.policyRecommendations.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-white">{item.title}</h4>
                          <span className="text-xs text-slate-400">{item.category}</span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
                        item.priority === 'Immediate Critical' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : item.priority === 'High Priority'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Metadata Specs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Legislative Mechanism</span>
                        <span className="text-xs font-medium text-slate-200 mt-1 block leading-snug">{item.legislativeMechanism}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Lead Governance Body</span>
                        <span className="text-xs font-medium text-slate-200 mt-1 block leading-snug">{item.governanceBody}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Enforcement Model</span>
                        <span className="text-xs font-medium text-slate-200 mt-1 block leading-snug">{item.enforcementModel}</span>
                      </div>
                    </div>

                    {/* Key Action Measures Checklist */}
                    {item.keyMeasures && item.keyMeasures.length > 0 && (
                      <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/60 space-y-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Mandatory Implementation Directives:</span>
                        <div className="space-y-1.5">
                          {item.keyMeasures.map((measure, mIdx) => (
                            <div key={mIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{measure}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IMPLEMENTATION ROADMAP */}
          {(activeTab === 'roadmap' || isPrintPreview) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Phased Implementation Roadmap</span>
                </h3>
                <span className="text-xs text-slate-400">Execution Timeline & Milestones</span>
              </div>

              <div className="grid grid-cols-1 gap-6 relative">
                {currentReport.roadmapPhases.map((phase, pIdx) => (
                  <div key={pIdx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                          P{phase.phaseNumber}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{phase.phaseName}</h4>
                          <p className="text-xs text-emerald-400 font-semibold">{phase.timeframe}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {phase.responsibleAgencies?.map((agency, aIdx) => (
                          <span key={aIdx} className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {agency}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 font-normal">
                      <strong>Primary Objective:</strong> {phase.primaryObjective}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Key Milestones */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Key Milestones:</span>
                        <div className="space-y-1.5">
                          {phase.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Primary Deliverables */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Key Deliverables:</span>
                        <div className="space-y-1.5">
                          {phase.deliverables.map((d, dIdx) => (
                            <div key={dIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET & FUNDING */}
          {(activeTab === 'budget' || isPrintPreview) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Capital Budget & Funding Architecture</span>
                </h3>
                <span className="text-xs text-slate-400">Capex/Opex & Public-Private Mix</span>
              </div>

              {/* Total Budget Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Capital Outlay (Capex)</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ${(currentReport.budgetEstimates.capexUSD / 1000000).toFixed(1)}M
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Initial infrastructure investment</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual Operating Expenses (Opex)</span>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    ${(currentReport.budgetEstimates.opexAnnualUSD / 1000000).toFixed(1)}M / Year
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Maintenance & management</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Lifecycle Cost</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    ${(currentReport.budgetEstimates.totalLifecycleCostUSD / 1000000).toFixed(1)}M
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">10-Year cumulative lifecycle</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funding Sources Donut Chart */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                    <PieChartIcon className="w-4 h-4 text-emerald-400" />
                    <span>Funding Sources Mix</span>
                  </h4>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentReport.budgetEstimates.fundingSources}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="amountUSD"
                          nameKey="sourceName"
                        >
                          {currentReport.budgetEstimates.fundingSources.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`$${(Number(value) / 1000000).toFixed(2)}M`, 'Amount']}
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 mt-4">
                    {currentReport.budgetEstimates.fundingSources.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                          <span className="text-slate-300 font-medium">{source.sourceName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold">${(source.amountUSD / 1000000).toFixed(1)}M</span>
                          <span className="text-slate-400 ml-1.5">({source.percentagePct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capex Allocation Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Capex Line-Item Breakdown</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="pb-3">Category</th>
                          <th className="pb-3 text-right">Cost ($M)</th>
                          <th className="pb-3 text-right">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {currentReport.budgetEstimates.capexBreakdown.map((item, idx) => {
                          const pct = ((item.costUSD / currentReport.budgetEstimates.capexUSD) * 100).toFixed(1);
                          return (
                            <tr key={idx} className="hover:bg-slate-800/40">
                              <td className="py-3 font-medium text-slate-200">{item.category}</td>
                              <td className="py-3 text-right font-bold text-emerald-400">${(item.costUSD / 1000000).toFixed(2)}M</td>
                              <td className="py-3 text-right text-slate-400">{pct}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPECTED IMPACT & SDGS */}
          {(activeTab === 'impact' || isPrintPreview) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Expected Environmental & Social Impact</span>
                </h3>
                <span className="text-xs text-slate-400">Quantified KPIs & UN SDG Targets</span>
              </div>

              {/* Quantified Impact Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual CO2 Offset</span>
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    {currentReport.expectedImpact.annualCO2ReductionTons.toLocaleString()} Tons / Year
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Equivalent to taking 62,000 passenger vehicles off the road.</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water Saved</span>
                    <Droplets className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-cyan-400">
                    {currentReport.expectedImpact.waterSavedMML.toLocaleString()} MML / Year
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Million liters saved through smart circular pressure management.</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Air Quality (AQI) Gain</span>
                    <Globe className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-teal-400">
                    +{currentReport.expectedImpact.airQualityAQIImprovementPct}% Improvement
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Substantial reduction in particulate PM2.5 and NOx pollutants.</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Green Jobs Created</span>
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">
                    +{currentReport.expectedImpact.greenJobsCreatedCount.toLocaleString()} Direct Jobs
                  </div>
                  <p className="text-xs text-slate-400 mt-1">High-skill local employment in solar, EV, and smart water grid tech.</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urban Heat Island Delta</span>
                    <Sun className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-yellow-400">
                    -{currentReport.expectedImpact.heatIslandTempReductionC}°C Peak Mitigation
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Lower surface temperatures via reflective cool roofs and urban canopy.</p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Health Savings</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-indigo-400">
                    ${(currentReport.expectedImpact.publicHealthSavingsUSD / 1000000).toFixed(1)}M / Year
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Lower respiratory hospitalization and heat stress emergency costs.</p>
                </div>
              </div>

              {/* UN SDGs Alignment Cards */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span>UN Sustainable Development Goals (SDG) Alignment</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentReport.relevantSDGs.map((sdg, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className="px-3 py-1 rounded-md text-xs font-extrabold text-white shadow-sm"
                          style={{ backgroundColor: sdg.colorHex || '#10B981' }}
                        >
                          SDG {sdg.sdgNumber}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{sdg.targetRef}</span>
                      </div>

                      <h5 className="text-sm font-bold text-white">{sdg.sdgTitle}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {sdg.alignmentDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RISK ASSESSMENT */}
          {(activeTab === 'risk' || isPrintPreview) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>Risk Matrix & Regulatory Barriers</span>
                </h3>
                <span className="text-xs text-slate-400">Vulnerabilities & Mitigation Protocols</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-4">Category</th>
                        <th className="p-4">Risk Factor Description</th>
                        <th className="p-4">Severity</th>
                        <th className="p-4">Probability</th>
                        <th className="p-4">Mitigation Strategy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {currentReport.riskAssessment.map((risk, idx) => (
                        <tr key={risk.id || idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-bold text-slate-200">{risk.category}</td>
                          <td className="p-4 font-medium max-w-xs">{risk.riskDescription}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                              risk.severity === 'High' 
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : risk.severity === 'Medium'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {risk.severity}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                              risk.probability === 'High' 
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {risk.probability}
                            </span>
                          </td>
                          <td className="p-4 text-emerald-300 font-normal max-w-sm">
                            {risk.mitigationStrategy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COST-BENEFIT ANALYSIS */}
          {(activeTab === 'cba' || isPrintPreview) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Cost-Benefit & Fiscal Cash Flow Forecast</span>
                </h3>
                <span className="text-xs text-slate-400">NPV, IRR, and Cash Flow Projections</span>
              </div>

              {/* Financial Metrics Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Present Value (NPV)</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ${(currentReport.costBenefitAnalysis.netPresentValueUSD / 1000000).toFixed(1)}M
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">20-Year discounted cash flow</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internal Rate of Return</span>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    {currentReport.costBenefitAnalysis.internalRateOfReturnPct}%
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Project IRR yield</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Benefit-Cost Ratio (BCR)</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {currentReport.costBenefitAnalysis.benefitCostRatio}x
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Gross return multiple</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Social Return (SROI)</span>
                  <div className="text-2xl font-black text-indigo-400 mt-1">
                    ${currentReport.costBenefitAnalysis.socialReturnOnInvestmentRatio}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Per $1 invested</span>
                </div>
              </div>

              {/* Cash Flow Forecast Chart */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white mb-4">5-Year Cumulative Cash Flow & Benefit Trajectory ($)</h4>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentReport.costBenefitAnalysis.annualCashFlowForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" tickFormatter={(v) => `Year ${v}`} />
                      <YAxis stroke="#64748b" tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                      <Tooltip 
                        formatter={(val: any) => [`$${(Number(val) / 1000000).toFixed(2)}M`, 'Value']}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="costUSD" name="Annual Cost ($M)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="benefitUSD" name="Annual Benefit ($M)" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="netFlowUSD" name="Net Cash Flow ($M)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Conclusion Notes & Export Trigger Footer */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Executive Decision Summary</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                {currentReport.conclusionNotes}
              </p>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shrink-0 shadow-lg shadow-emerald-500/20 print:hidden disabled:cursor-not-allowed"
            >
              {isExportingPDF ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span className="text-emerald-400">Generating PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>Export Brief as PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PRINT-ONLY CSS SPECIFIC EXECUTIVE DOCUMENT STYLING */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .bg-slate-900, .bg-slate-950, .bg-slate-900\\/80, .bg-slate-900\\/90 {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
            color: #0f172a !important;
            box-shadow: none !important;
          }
          .text-white, .text-slate-200, .text-slate-300 {
            color: #0f172a !important;
          }
          .text-slate-400, .text-slate-500 {
            color: #475569 !important;
          }
          .border-slate-800, .border-slate-700 {
            border-color: #cbd5e1 !important;
          }
          .text-emerald-400 {
            color: #059669 !important;
          }
          .text-cyan-400 {
            color: #0891b2 !important;
          }
          .text-amber-400 {
            color: #d97706 !important;
          }
          .text-rose-400 {
            color: #e11d48 !important;
          }
        }
      `}</style>
    </div>
  );
};
