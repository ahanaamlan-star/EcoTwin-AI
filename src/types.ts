export type TwinRegionId = 'metropolis-delta' | 'nordic-grid' | 'silicon-park' | 'amazonia-buffer';

export interface TwinRegion {
  id: TwinRegionId;
  name: string;
  category: 'Urban Coastal' | 'Clean Energy Grid' | 'Industrial Park' | 'Forest & Sink';
  location: string;
  lat: number;
  lng: number;
  areaKm2: number;
  population: number;
  baselineCO2Mtons: number;
  currentAQI: number;
  floodRiskScore: number; // 0-100
  heatIslandSeverity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  image: string;
  description: string;
  avgTempC?: number;
  seaLevelRiseRiskM?: number;
  renewableEnergyPct?: number;
  waterStressIndex?: number;
  avgAQI?: number;
  sustainabilityScore?: number;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Coastal Front' | 'Green Zone';
  tempOffsetC: number;
  canopyCoveragePct: number;
  currentCo2Ppm: number;
  elevationMeters: number;
  gridLoadMW: number;
  activeSensorsCount: number;
  status: 'optimal' | 'warning' | 'critical';
  coordinates: { x: number; y: number }; // Percentage relative positioning on twin map
}

export interface IoTSensor {
  id: string;
  name: string;
  type: 'Air Quality' | 'Thermal' | 'Hydrology' | 'Grid Load' | 'Acoustics' | 'Biodiversity';
  districtId: string;
  districtName: string;
  location: string;
  currentValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'online' | 'warning' | 'calibrating' | 'offline';
  lastPing: string;
  batteryLevel: number;
  history: { time: string; value: number }[];
}

export interface ScenarioParameters {
  regionId: TwinRegionId;
  targetYear: number;
  rainfallMm: number; // 500 to 3000 mm/year
  tempDelta: number; // +0.5 to +5.0 °C
  populationGrowthPct: number; // -1.0% to +5.0%
  evAdoptionPct: number; // 0% to 100%
  solarAdoptionPct: number; // 0% to 100%
  treePlantationPct: number; // 10% to 60%
  waterConsumptionLpd: number; // 100 to 350 Liters/capita/day
  wasteGenerationKgDay: number; // 0.5 to 3.5 kg/capita/day
  // Additional optional parameters for backwards compatibility
  seaLevelRiseM?: number;
  greenCanopyPct?: number;
  renewableGridPct?: number;
  industrialTaxPerTon?: number;
  buildingRetrofitPct?: number;
}

export interface SimulationResult {
  // Required 7 Gemini Return Metrics
  floodRiskScore: number; // 0-100
  floodRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  carbonEmissionsMtons: number; // Projected CO2 emissions
  annualCO2SavedTons: number; // Annual CO2 saved/offset
  economicImpactMillionUSD: number; // Net economic impact ($M)
  waterStressIndex: number; // 0-100 water stress index
  airQualityAQI: number; // AQI index (1-500)
  infrastructureRiskScore: number; // 0-100 risk score
  infrastructureRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  mitigationSuggestions: PolicyRecommendation[];
  // Backwards compatibility aliases
  predictedAQI?: number;
  heatIslandReductionC?: number;
  coastalFloodRiskLevel?: 'Low' | 'Moderate' | 'High' | 'Critical';
  infrastructureDamageEstMillionUSD?: number;
  economicNetBenefitMillionUSD?: number;
  energyGridStabilityScore?: number;
  biodiversityHealthIndex?: number;
  executiveSummary: string;
  keyRisks: string[];
  recommendations?: PolicyRecommendation[];
}

export interface PolicyRecommendation {
  title: string;
  category: string;
  impactRating: 'Critical' | 'High Impact' | 'Medium Impact';
  description: string;
  estROI: string;
}

export interface CarbonScopeData {
  category: string;
  scope1: number; // Direct emissions
  scope2: number; // Indirect electricity
  scope3: number; // Value chain
  target2030: number;
}

export interface SectorEmissions {
  id: 'industry' | 'transport' | 'agriculture' | 'commercial' | 'residential';
  name: string;
  currentEmissions: number; // Mtons CO2e/yr
  scope1: number;
  scope2: number;
  scope3: number;
  target2030: number;
  target2040: number;
  yoyChangePct: number;
  color: string;
  iconName: string;
  description: string;
  keyDrivers: string[];
}

export interface CarbonPredictionPoint {
  year: number;
  bauBaseline: number;
  currentTrajectory: number;
  netZeroTarget: number;
  offsetVolume: number;
}

export interface ChartTimeSeriesPoint {
  yearOrMonth: string;
  baselineEmissions: number;
  simulatedEmissions: number;
  temperatureC: number;
  aqiIndex: number;
  renewablePct: number;
  floodRiskProb: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  districtContext?: string;
  isThinking?: boolean;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  region: string;
  author: string;
  date: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published';
  summary: string;
  markdownContent: string;
}

export type DisasterType = 'flood' | 'cyclone' | 'heatwave' | 'wildfire' | 'drought';

export interface DisasterMitigationStep {
  phase: 'Immediate Response (0-12h)' | 'Short-Term Defense (12-48h)' | 'Infrastructure Resilience (48h+)' | 'Long-Term Recovery';
  title: string;
  detail: string;
  agency: string;
  status: 'ready' | 'deploying' | 'active' | 'scheduled';
  estimatedCostUSD: number;
}

export interface DisasterRiskCardData {
  id: DisasterType;
  title: string;
  category: string;
  probability: number; // 0 to 100
  severity: 'Critical' | 'High' | 'Elevated' | 'Moderate' | 'Low';
  primaryColor: string;
  accentColor: string;
  timeframe: string;
  affectedDistrictsCount: number;
  estimatedPopAtRisk: number;
  description: string;
  keyTelemetry: { label: string; value: string; status: 'normal' | 'warning' | 'critical' }[];
  mitigationSteps: DisasterMitigationStep[];
}

export interface AffectedZoneData {
  id: string;
  name: string;
  disasterTypes: DisasterType[];
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Safe';
  populationAtRisk: number;
  sheltersAvailable: number;
  evacuationStatus: 'Clear' | 'Advisory' | 'Mandatory' | 'In Progress';
  vulnerabilityFactors: string[];
  primaryCoordinates: string;
}

// Water Intelligence Interfaces
export interface ReservoirData {
  id: string;
  name: string;
  capacityMCM: number;
  currentMCM: number;
  percentageFull: number;
  inflowRateM3s: number;
  outflowRateM3s: number;
  status: 'Optimal' | 'Caution' | 'Critical Low' | 'Surge Risk';
  trend: 'rising' | 'falling' | 'stable';
  primarySupplyTarget: string;
}

export interface GroundwaterAquiferData {
  id: string;
  name: string;
  depthToWaterMeters: number; // meters below surface
  baselineDepthMeters: number;
  depletionRateCmYr: number;
  salinityPPM: number;
  rechargeRatePct: number;
  healthIndex: number; // 0 to 100
  status: 'Healthy' | 'Moderate Depletion' | 'Severe Deficit';
}

export interface RainfallDataPoint {
  month: string;
  historicalAvgMm: number;
  currentActualMm: number;
  forecastMm: number;
}

export interface SectorConsumptionData {
  sector: string;
  mld: number; // Million Liters per Day
  percentage: number;
  efficiencyRating: 'A+' | 'A' | 'B' | 'C' | 'D';
  color: string;
}

export interface PipeLeakAlert {
  id: string;
  district: string;
  pipelineSegment: string;
  estimatedLossLph: number; // Liters per Hour
  pressureDropPsi: number;
  acousticFreqHz: number;
  urgency: 'Critical Burst' | 'High Leak' | 'Minor Seepage';
  coordinates: string;
  status: 'Detected' | 'Repair Dispatched' | 'Isolated' | 'Resolved';
}

export interface WaterDemandForecastPoint {
  period: string;
  projectedDemandMLD: number;
  availableSupplyMLD: number;
  shortageGapMLD: number;
  tempAnomalyC: number;
}

export interface AIShortagePrediction {
  districtName: string;
  daysOfReserveRemaining: number;
  shortageProbabilityPct: number;
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low';
  primaryCause: string;
  recommendedActions: string[];
}

// Renewable Energy Planner Interfaces
export interface SolarPotentialData {
  solarIrradianceKwhM2Day: number; // e.g. 5.8
  peakCapacityMW: number; // e.g. 120
  annualGenerationGWh: number; // e.g. 210
  suitableRoofAreaSqM: number; // e.g. 450,000
  rooftopSuitabilityScore: number; // 0-100
  hourlyGenerationCurve: { hour: string; solarMW: number; loadMW: number }[];
}

export interface WindPotentialData {
  avgWindSpeedMs: number; // e.g. 8.4 m/s
  capacityFactorPct: number; // e.g. 42.5%
  installedTurbineCount: number;
  annualWindGenerationGWh: number;
  windRoseDirectionData: { direction: string; frequencyPct: number; avgSpeedMs: number }[];
}

export interface BatteryStorageData {
  totalCapacityMWh: number;
  currentStateOfChargePct: number;
  maxChargeDischargePowerMW: number;
  roundTripEfficiencyPct: number;
  cycleLifeRemainingPct: number;
  chemistryType: string;
  hourlyStateOfCharge: { hour: string; socPct: number; netFlowMW: number }[];
}

export interface MicrogridNodeData {
  id: string;
  name: string;
  district: string;
  coordinates: string;
  lat: number;
  lng: number;
  solarMW: number;
  windMW: number;
  batteryMWh: number;
  loadMW: number;
  gridIndependencePct: number;
  status: 'Optimal' | 'Islanding Active' | 'Grid Synchronized' | 'Maintenance';
  frequencyHz: number;
  voltageKV: number;
}

export interface FinancialROIStats {
  initialCapexUSD: number;
  annualOpexSavingsUSD: number;
  paybackPeriodYears: number;
  internalRateOfReturnPct: number;
  netPresentValue20YrUSD: number;
  levelizedCostOfEnergyUSDPerKWh: number;
  cashFlowForecastYears: { year: number; cumulativeSavingsUSD: number; netCashFlowUSD: number }[];
}

export interface CarbonReductionStats {
  annualCO2OffsetMetricTons: number;
  lifetimeCO2OffsetMetricTons: number;
  equivalentTreesPlanted: number;
  equivalentCoalPlantsRetired: number;
  fossilFuelReplacedBarrels: number;
}

// Reporting Center Interfaces
export type ReportTypeKey = 'executive' | 'climate' | 'carbon' | 'water' | 'energy';

export interface ReportMetricBadge {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  unit?: string;
}

export interface ReportRecommendationItem {
  id: string;
  title: string;
  category: string;
  priority: 'Immediate Critical' | 'High Priority' | 'Strategic Mid-Term';
  impact: string;
  estCostUSD: string;
  timeframe: string;
  responsibleAgency: string;
  actionSteps: string[];
}

export interface ReportTableRow {
  id: string;
  sectorName: string;
  metricA: string | number;
  metricB: string | number;
  metricC: string | number;
  status: string;
  variancePct: string;
}

export interface ComprehensiveReport {
  id: string;
  typeKey: ReportTypeKey;
  typeTitle: string;
  typeTitleFull?: string;
  title: string;
  regionName: string;
  generatedAt: string;
  author: string;
  status: 'Approved & Final' | 'Drafting' | 'Under Audit';
  executiveSummary: string;
  keyMetrics: ReportMetricBadge[];
  chartTitle: string;
  chartSubtitle: string;
  chartData: any[];
  tableTitle: string;
  tableHeaders: string[];
  tableRows: ReportTableRow[];
  recommendations: ReportRecommendationItem[];
  complianceBadge: string;
}

export interface PolicyRecommendationItem {
  id: string;
  title: string;
  category: string;
  priority: 'Immediate Critical' | 'High Priority' | 'Strategic Mid-Term';
  summary: string;
  legislativeMechanism: string;
  governanceBody: string;
  enforcementModel: string;
  keyMeasures: string[];
}

export interface PolicyRoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  timeframe: string;
  primaryObjective: string;
  milestones: string[];
  responsibleAgencies: string[];
  deliverables: string[];
}

export interface PolicyBudgetEstimate {
  capexUSD: number;
  opexAnnualUSD: number;
  totalLifecycleCostUSD: number;
  fundingSources: { sourceName: string; percentagePct: number; amountUSD: number }[];
  capexBreakdown: { category: string; costUSD: number }[];
}

export interface PolicyImpactMetrics {
  annualCO2ReductionTons: number;
  waterSavedMML: number;
  airQualityAQIImprovementPct: number;
  greenJobsCreatedCount: number;
  heatIslandTempReductionC: number;
  publicHealthSavingsUSD: number;
  additionalKPIs: { name: string; value: string; impact: string }[];
}

export interface PolicySDGAlignment {
  sdgNumber: number;
  sdgTitle: string;
  colorHex: string;
  targetRef: string;
  alignmentDescription: string;
}

export interface PolicyRiskItem {
  id: string;
  category: 'Regulatory' | 'Political' | 'Technical' | 'Financial' | 'Social';
  riskDescription: string;
  severity: 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low';
  mitigationStrategy: string;
}

export interface PolicyCostBenefitAnalysis {
  netPresentValueUSD: number;
  internalRateOfReturnPct: number;
  paybackPeriodYears: number;
  benefitCostRatio: number;
  socialReturnOnInvestmentRatio: number;
  annualCashFlowForecast: { year: number; costUSD: number; benefitUSD: number; netFlowUSD: number }[];
}

export interface PolicyAdviceReport {
  id: string;
  queryQuestion: string;
  targetRegion: string;
  timeframeYears: string;
  generatedAt: string;
  executiveSummary: string;
  policyRecommendations: PolicyRecommendationItem[];
  roadmapPhases: PolicyRoadmapPhase[];
  budgetEstimates: PolicyBudgetEstimate;
  expectedImpact: PolicyImpactMetrics;
  relevantSDGs: PolicySDGAlignment[];
  riskAssessment: PolicyRiskItem[];
  costBenefitAnalysis: PolicyCostBenefitAnalysis;
  conclusionNotes: string;
}



