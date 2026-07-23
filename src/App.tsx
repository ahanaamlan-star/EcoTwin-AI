import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwinViewport } from './pages/DigitalTwinViewport';
import { ScenarioSimulator } from './pages/ScenarioSimulator';
import { DisasterPrediction } from './pages/DisasterPrediction';
import { WaterIntelligence } from './pages/WaterIntelligence';
import { RenewableEnergyPlanner } from './pages/RenewableEnergyPlanner';
import { IoTMesh } from './pages/IoTMesh';
import { CarbonAnalytics } from './pages/CarbonAnalytics';
import { AICopilot } from './pages/AICopilot';
import { AIPolicyAdvisor } from './pages/AIPolicyAdvisor';
import { ExecutiveReports } from './pages/ExecutiveReports';
import { CommunityImpact } from './pages/CommunityImpact';

import { TWIN_REGIONS } from './data/mockTwinData';
import { TwinRegionId } from './types';

export default function App() {
  const [selectedRegionId, setSelectedRegionId] = useState<TwinRegionId>('metropolis-delta');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Cross-page state transfers
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');
  const [reportInitialMarkdown, setReportInitialMarkdown] = useState<string>('');
  const [simulatorDistrictId, setSimulatorDistrictId] = useState<string | undefined>(undefined);

  const activeRegion = TWIN_REGIONS.find((r) => r.id === selectedRegionId) || TWIN_REGIONS[0];

  // Navigation handlers
  const handleNavigateToSimulator = (districtId?: string) => {
    setSimulatorDistrictId(districtId);
    setActiveTab('simulator');
  };

  const handleNavigateToCopilot = (promptText: string) => {
    setCopilotInitialPrompt(promptText);
    setActiveTab('copilot');
  };

  const handleNavigateToReports = (markdownOrData?: any) => {
    if (typeof markdownOrData === 'string') {
      setReportInitialMarkdown(markdownOrData);
    } else if (markdownOrData && typeof markdownOrData === 'object') {
      setReportInitialMarkdown(
        `# Custom AI Climate Briefing\n\n**Executive Summary**:\n${markdownOrData.executiveSummary || 'Scenario simulation completed.'}\n\n**Key Risks Identified**:\n${(markdownOrData.keyRisks || []).map((r: string) => `- ${r}`).join('\n')}`
      );
    }
    setActiveTab('reports');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Application Navbar */}
      <Navbar
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        isSimulating={isSimulating}
      />

      {/* Main Body Layout with Sidebar */}
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Viewport / Page Content Container */}
        <main
          className={`flex-1 transition-all duration-300 p-4 lg:p-6 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                region={activeRegion}
                onNavigate={setActiveTab}
                onNavigateToSimulator={handleNavigateToSimulator}
                onNavigateToCopilot={handleNavigateToCopilot}
                onNavigateToReports={handleNavigateToReports}
              />
            )}

            {activeTab === 'viewport' && (
              <DigitalTwinViewport
                region={activeRegion}
                onNavigateToSimulator={handleNavigateToSimulator}
                onNavigateToCopilot={handleNavigateToCopilot}
              />
            )}

            {activeTab === 'simulator' && (
              <ScenarioSimulator
                region={activeRegion}
                initialDistrictId={simulatorDistrictId}
                onNavigateToCopilot={handleNavigateToCopilot}
                onNavigateToReports={handleNavigateToReports}
                setIsSimulating={setIsSimulating}
              />
            )}

            {activeTab === 'disaster' && (
              <DisasterPrediction
                region={activeRegion}
                onNavigateToCopilot={handleNavigateToCopilot}
                onNavigateToReports={handleNavigateToReports}
              />
            )}

            {activeTab === 'water' && (
              <WaterIntelligence
                region={activeRegion}
                onNavigateToCopilot={handleNavigateToCopilot}
                onNavigateToReports={handleNavigateToReports}
              />
            )}

            {activeTab === 'renewable-energy' && (
              <RenewableEnergyPlanner
                region={activeRegion}
                onNavigateToCopilot={handleNavigateToCopilot}
                onNavigateToReports={handleNavigateToReports}
              />
            )}

            {activeTab === 'iot-mesh' && (
              <IoTMesh onNavigateToCopilot={handleNavigateToCopilot} />
            )}

            {activeTab === 'carbon' && (
              <CarbonAnalytics onNavigateToReports={(md) => handleNavigateToReports(md)} />
            )}

            {activeTab === 'copilot' && (
              <AICopilot
                region={activeRegion}
                initialPrompt={copilotInitialPrompt}
                onNavigateToReports={handleNavigateToReports}
              />
            )}

            {activeTab === 'policy-advisor' && (
              <AIPolicyAdvisor
                region={activeRegion.name}
                onNavigateToCopilot={handleNavigateToCopilot}
                onNavigateToReports={() => setActiveTab('reports')}
              />
            )}

            {activeTab === 'reports' && (
              <ExecutiveReports
                region={activeRegion}
                initialMarkdown={reportInitialMarkdown}
              />
            )}

            {activeTab === 'community' && (
              <CommunityImpact region={activeRegion} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
