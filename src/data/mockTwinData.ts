import { 
  TwinRegion, 
  IoTSensor, 
  ScenarioParameters, 
  CarbonScopeData, 
  ChartTimeSeriesPoint, 
  ExecutiveReport, 
  SectorEmissions, 
  CarbonPredictionPoint, 
  DisasterRiskCardData, 
  AffectedZoneData,
  ReservoirData,
  GroundwaterAquiferData,
  RainfallDataPoint,
  SectorConsumptionData,
  PipeLeakAlert,
  WaterDemandForecastPoint,
  AIShortagePrediction,
  SolarPotentialData,
  WindPotentialData,
  BatteryStorageData,
  MicrogridNodeData,
  FinancialROIStats,
  CarbonReductionStats
} from '../types';

export const TWIN_REGIONS: TwinRegion[] = [
  {
    id: 'metropolis-delta',
    name: 'Metropolis Delta Hub',
    category: 'Urban Coastal',
    location: 'North Atlantic Bay Corridor',
    lat: 40.7128,
    lng: -74.0060,
    areaKm2: 1240,
    population: 4850000,
    baselineCO2Mtons: 14.8,
    currentAQI: 68,
    floodRiskScore: 72,
    heatIslandSeverity: 'Severe',
    avgTempC: 22.4,
    seaLevelRiseRiskM: 0.65,
    renewableEnergyPct: 62,
    waterStressIndex: 68,
    avgAQI: 68,
    sustainabilityScore: 78,
    image: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80',
    description: 'High-density coastal megacity facing tidal storm surges, thermal heat islands, and port logistics electrification demands.',
    districts: [
      {
        id: 'dist-1',
        name: 'Central Financial Plaza',
        type: 'Commercial',
        tempOffsetC: 3.4,
        canopyCoveragePct: 18,
        currentCo2Ppm: 485,
        elevationMeters: 4.2,
        gridLoadMW: 420,
        activeSensorsCount: 142,
        status: 'warning',
        coordinates: { x: 45, y: 52 }
      },
      {
        id: 'dist-2',
        name: 'Harbor Delta Logistics Port',
        type: 'Coastal Front',
        tempOffsetC: 1.8,
        canopyCoveragePct: 12,
        currentCo2Ppm: 520,
        elevationMeters: 1.5,
        gridLoadMW: 610,
        activeSensorsCount: 188,
        status: 'critical',
        coordinates: { x: 72, y: 78 }
      },
      {
        id: 'dist-3',
        name: 'North Eco Tech Corridor',
        type: 'Industrial',
        tempOffsetC: 2.1,
        canopyCoveragePct: 28,
        currentCo2Ppm: 440,
        elevationMeters: 12.0,
        gridLoadMW: 380,
        activeSensorsCount: 96,
        status: 'optimal',
        coordinates: { x: 30, y: 28 }
      },
      {
        id: 'dist-4',
        name: 'Green Ridge Residential Zone',
        type: 'Residential',
        tempOffsetC: 0.9,
        canopyCoveragePct: 44,
        currentCo2Ppm: 412,
        elevationMeters: 28.5,
        gridLoadMW: 190,
        activeSensorsCount: 110,
        status: 'optimal',
        coordinates: { x: 20, y: 65 }
      },
      {
        id: 'dist-5',
        name: 'South Estuarine Wetlands',
        type: 'Green Zone',
        tempOffsetC: -0.8,
        canopyCoveragePct: 78,
        currentCo2Ppm: 398,
        elevationMeters: 0.8,
        gridLoadMW: 15,
        activeSensorsCount: 84,
        status: 'warning',
        coordinates: { x: 80, y: 32 }
      }
    ]
  },
  {
    id: 'nordic-grid',
    name: 'Nordic Clean Energy Grid',
    category: 'Clean Energy Grid',
    location: 'Fennoscandia Smart Energy Zone',
    lat: 59.3293,
    lng: 18.0686,
    areaKm2: 3800,
    population: 1200000,
    baselineCO2Mtons: 3.2,
    currentAQI: 24,
    floodRiskScore: 18,
    heatIslandSeverity: 'Low',
    avgTempC: 12.1,
    seaLevelRiseRiskM: 0.20,
    renewableEnergyPct: 92,
    waterStressIndex: 22,
    avgAQI: 24,
    sustainabilityScore: 94,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Advanced offshore wind, hydro-storage, and district heat network digital twin with real-time grid inertia balancing.',
    districts: [
      {
        id: 'dist-6',
        name: 'Offshore Wind Cluster Alpha',
        type: 'Industrial',
        tempOffsetC: 0.2,
        canopyCoveragePct: 5,
        currentCo2Ppm: 402,
        elevationMeters: 0.0,
        gridLoadMW: 850,
        activeSensorsCount: 230,
        status: 'optimal',
        coordinates: { x: 85, y: 20 }
      },
      {
        id: 'dist-7',
        name: 'Fjord Hydro Reservoir Node',
        type: 'Green Zone',
        tempOffsetC: -1.2,
        canopyCoveragePct: 82,
        currentCo2Ppm: 395,
        elevationMeters: 450.0,
        gridLoadMW: 620,
        activeSensorsCount: 175,
        status: 'optimal',
        coordinates: { x: 25, y: 25 }
      },
      {
        id: 'dist-8',
        name: 'Smart District Heating Hub',
        type: 'Residential',
        tempOffsetC: 0.8,
        canopyCoveragePct: 35,
        currentCo2Ppm: 410,
        elevationMeters: 45.0,
        gridLoadMW: 280,
        activeSensorsCount: 140,
        status: 'optimal',
        coordinates: { x: 50, y: 60 }
      }
    ]
  },
  {
    id: 'silicon-park',
    name: 'Silicon Eco-Industrial Park',
    category: 'Industrial Park',
    location: 'West Coast Tech Valley',
    lat: 37.7749,
    lng: -122.4194,
    areaKm2: 450,
    population: 680000,
    baselineCO2Mtons: 8.4,
    currentAQI: 54,
    floodRiskScore: 35,
    heatIslandSeverity: 'Moderate',
    avgTempC: 21.8,
    seaLevelRiseRiskM: 0.35,
    renewableEnergyPct: 78,
    waterStressIndex: 58,
    avgAQI: 54,
    sustainabilityScore: 84,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    description: 'High-tech manufacturing, semiconductor fab, and datacenter cluster targeting 100% circular water and 24/7 carbon-free energy.',
    districts: [
      {
        id: 'dist-9',
        name: 'Datacenter Solar Microgrid',
        type: 'Industrial',
        tempOffsetC: 2.8,
        canopyCoveragePct: 15,
        currentCo2Ppm: 460,
        elevationMeters: 35.0,
        gridLoadMW: 520,
        activeSensorsCount: 310,
        status: 'warning',
        coordinates: { x: 60, y: 40 }
      },
      {
        id: 'dist-10',
        name: 'Fab 4 Water Recycling Plant',
        type: 'Industrial',
        tempOffsetC: 1.5,
        canopyCoveragePct: 22,
        currentCo2Ppm: 435,
        elevationMeters: 28.0,
        gridLoadMW: 210,
        activeSensorsCount: 195,
        status: 'optimal',
        coordinates: { x: 40, y: 70 }
      }
    ]
  },
  {
    id: 'amazonia-buffer',
    name: 'Amazonia Biome Buffer',
    category: 'Forest & Sink',
    location: 'South American Rainforest Margin',
    lat: -3.1190,
    lng: -60.0217,
    areaKm2: 18500,
    population: 140000,
    baselineCO2Mtons: -12.5, // Net carbon sink
    currentAQI: 18,
    floodRiskScore: 65,
    heatIslandSeverity: 'Low',
    avgTempC: 26.5,
    seaLevelRiseRiskM: 0.40,
    renewableEnergyPct: 88,
    waterStressIndex: 35,
    avgAQI: 18,
    sustainabilityScore: 91,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    description: 'LiDAR and satellite radar digital twin monitoring deforestation, soil moisture, biodiversity index, and carbon sequestration.',
    districts: [
      {
        id: 'dist-11',
        name: 'Primary Forest Reserve Sector A',
        type: 'Green Zone',
        tempOffsetC: -2.1,
        canopyCoveragePct: 92,
        currentCo2Ppm: 388,
        elevationMeters: 180.0,
        gridLoadMW: 2,
        activeSensorsCount: 280,
        status: 'optimal',
        coordinates: { x: 30, y: 45 }
      },
      {
        id: 'dist-12',
        name: 'River Basin Watershed Monitoring',
        type: 'Coastal Front',
        tempOffsetC: -1.0,
        canopyCoveragePct: 84,
        currentCo2Ppm: 392,
        elevationMeters: 85.0,
        gridLoadMW: 5,
        activeSensorsCount: 340,
        status: 'warning',
        coordinates: { x: 70, y: 65 }
      }
    ]
  }
];

export const MOCK_IOT_SENSORS: IoTSensor[] = [
  {
    id: 'sns-101',
    name: 'Plaza Micro-Climate Station',
    type: 'Thermal',
    districtId: 'dist-1',
    districtName: 'Central Financial Plaza',
    location: 'Roof 4, Tower B',
    currentValue: 34.2,
    unit: '°C',
    trend: 'up',
    status: 'warning',
    lastPing: '2 secs ago',
    batteryLevel: 94,
    history: [
      { time: '08:00', value: 24.1 },
      { time: '10:00', value: 27.5 },
      { time: '12:00', value: 31.2 },
      { time: '14:00', value: 34.2 },
      { time: '16:00', value: 33.8 }
    ]
  },
  {
    id: 'sns-102',
    name: 'Harbor Tide & Surge Radar',
    type: 'Hydrology',
    districtId: 'dist-2',
    districtName: 'Harbor Delta Logistics Port',
    location: 'Pier 12 Buoy',
    currentValue: 1.84,
    unit: 'm surge',
    trend: 'up',
    status: 'warning',
    lastPing: '1 sec ago',
    batteryLevel: 88,
    history: [
      { time: '08:00', value: 0.65 },
      { time: '10:00', value: 0.92 },
      { time: '12:00', value: 1.45 },
      { time: '14:00', value: 1.84 },
      { time: '16:00', value: 1.79 }
    ]
  },
  {
    id: 'sns-103',
    name: 'Port Diesel Particulate Optical Optical Mesh',
    type: 'Air Quality',
    districtId: 'dist-2',
    districtName: 'Harbor Delta Logistics Port',
    location: 'Terminal 3 Gate',
    currentValue: 88.5,
    unit: 'µg/m³ PM2.5',
    trend: 'up',
    status: 'online',
    lastPing: '4 secs ago',
    batteryLevel: 98,
    history: [
      { time: '08:00', value: 42.0 },
      { time: '10:00', value: 64.2 },
      { time: '12:00', value: 81.0 },
      { time: '14:00', value: 88.5 },
      { time: '16:00', value: 76.4 }
    ]
  },
  {
    id: 'sns-104',
    name: 'Substation Micro-Grid Inertia Monitor',
    type: 'Grid Load',
    districtId: 'dist-3',
    districtName: 'North Eco Tech Corridor',
    location: 'Substation 8B',
    currentValue: 412,
    unit: 'MW Load',
    trend: 'stable',
    status: 'online',
    lastPing: 'Live stream',
    batteryLevel: 100,
    history: [
      { time: '08:00', value: 350 },
      { time: '10:00', value: 395 },
      { time: '12:00', value: 425 },
      { time: '14:00', value: 412 },
      { time: '16:00', value: 405 }
    ]
  },
  {
    id: 'sns-105',
    name: 'Wetland Bio-Acoustic Bio-Diversity Recorder',
    type: 'Biodiversity',
    districtId: 'dist-5',
    districtName: 'South Estuarine Wetlands',
    location: 'Mangrove Creek Node 14',
    currentValue: 84.2,
    unit: 'Species Bio-Index',
    trend: 'up',
    status: 'online',
    lastPing: '12 secs ago',
    batteryLevel: 76,
    history: [
      { time: '08:00', value: 78.0 },
      { time: '10:00', value: 80.5 },
      { time: '12:00', value: 82.1 },
      { time: '14:00', value: 84.2 },
      { time: '16:00', value: 85.0 }
    ]
  },
  {
    id: 'sns-106',
    name: 'Urban Noise & Vibration Hydro-Sensor',
    type: 'Acoustics',
    districtId: 'dist-1',
    districtName: 'Central Financial Plaza',
    location: 'Boulevard Intersection 5',
    currentValue: 71.4,
    unit: 'dB SPL',
    trend: 'down',
    status: 'online',
    lastPing: '3 secs ago',
    batteryLevel: 92,
    history: [
      { time: '08:00', value: 68.2 },
      { time: '10:00', value: 75.8 },
      { time: '12:00', value: 78.4 },
      { time: '14:00', value: 71.4 },
      { time: '16:00', value: 69.1 }
    ]
  }
];

export const MOCK_TIME_SERIES: ChartTimeSeriesPoint[] = [
  { yearOrMonth: '2020', baselineEmissions: 18.2, simulatedEmissions: 18.2, temperatureC: 1.1, aqiIndex: 82, renewablePct: 22, floodRiskProb: 45 },
  { yearOrMonth: '2022', baselineEmissions: 17.4, simulatedEmissions: 16.8, temperatureC: 1.3, aqiIndex: 76, renewablePct: 31, floodRiskProb: 49 },
  { yearOrMonth: '2024', baselineEmissions: 16.8, simulatedEmissions: 14.5, temperatureC: 1.4, aqiIndex: 68, renewablePct: 42, floodRiskProb: 54 },
  { yearOrMonth: '2026', baselineEmissions: 16.2, simulatedEmissions: 11.8, temperatureC: 1.6, aqiIndex: 58, renewablePct: 56, floodRiskProb: 58 },
  { yearOrMonth: '2028', baselineEmissions: 15.8, simulatedEmissions: 8.9, temperatureC: 1.8, aqiIndex: 48, renewablePct: 70, floodRiskProb: 62 },
  { yearOrMonth: '2030', baselineEmissions: 15.2, simulatedEmissions: 5.4, temperatureC: 1.9, aqiIndex: 38, renewablePct: 85, floodRiskProb: 65 },
  { yearOrMonth: '2035', baselineEmissions: 14.5, simulatedEmissions: 2.1, temperatureC: 2.2, aqiIndex: 28, renewablePct: 96, floodRiskProb: 72 },
  { yearOrMonth: '2040', baselineEmissions: 14.1, simulatedEmissions: 0.4, temperatureC: 2.4, aqiIndex: 22, renewablePct: 100, floodRiskProb: 78 }
];

export const DEFAULT_SCENARIO_PARAMS: ScenarioParameters = {
  regionId: 'metropolis-delta',
  targetYear: 2035,
  rainfallMm: 1450,
  tempDelta: 2.1,
  populationGrowthPct: 2.2,
  evAdoptionPct: 65,
  solarAdoptionPct: 55,
  treePlantationPct: 35,
  waterConsumptionLpd: 210,
  wasteGenerationKgDay: 1.8,
  seaLevelRiseM: 0.55,
  greenCanopyPct: 35,
  renewableGridPct: 80,
  industrialTaxPerTon: 85,
  buildingRetrofitPct: 50
};

export const CARBON_SCOPE_BREAKDOWN: CarbonScopeData[] = [
  { category: 'Heavy Industry & Manufacturing', scope1: 4.8, scope2: 2.1, scope3: 3.4, target2030: 3.2 },
  { category: 'Commercial Real Estate & Heating', scope1: 1.9, scope2: 3.8, scope3: 1.2, target2030: 2.0 },
  { category: 'Municipal & Commercial Transport', scope1: 3.4, scope2: 0.8, scope3: 2.2, target2030: 1.8 },
  { category: 'Logistics, Port & Marine Operations', scope1: 2.8, scope2: 1.2, scope3: 4.1, target2030: 2.5 },
  { category: 'Power Generation & Utility Grid', scope1: 5.2, scope2: 0.4, scope3: 0.9, target2030: 1.1 }
];

export const DEFAULT_SECTOR_EMISSIONS: SectorEmissions[] = [
  {
    id: 'industry',
    name: 'Industry',
    currentEmissions: 12.8,
    scope1: 6.2,
    scope2: 3.8,
    scope3: 2.8,
    target2030: 7.5,
    target2040: 1.2,
    yoyChangePct: -4.2,
    color: '#ef4444',
    iconName: 'Factory',
    description: 'Manufacturing plants, heavy refining, chemicals, steel fabrication, and cement kilns.',
    keyDrivers: ['Furnace electrification', 'Industrial hydrogen fuel switching', 'CCS carbon capture retrofit']
  },
  {
    id: 'transport',
    name: 'Transport',
    currentEmissions: 9.4,
    scope1: 5.8,
    scope2: 1.2,
    scope3: 2.4,
    target2030: 4.2,
    target2040: 0.4,
    yoyChangePct: -6.8,
    color: '#06b6d4',
    iconName: 'Truck',
    description: 'Municipal bus fleets, private ICE vehicles, heavy logistics freight, and port drayage.',
    keyDrivers: ['100% EV municipal fleet mandate', 'Heavy-duty hydrogen fuel cells', 'Urban rapid transit expansion']
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    currentEmissions: 4.6,
    scope1: 2.9,
    scope2: 0.5,
    scope3: 1.2,
    target2030: 2.8,
    target2040: 0.8,
    yoyChangePct: -2.1,
    color: '#10b981',
    iconName: 'Wheat',
    description: 'Peri-urban farming, soil tillage methane emissions, livestock management, and fertilizer run-off.',
    keyDrivers: ['Precision nitrogen fertilization', 'Regenerative biochar soil carbon', 'Methane-reducing livestock feed']
  },
  {
    id: 'commercial',
    name: 'Commercial',
    currentEmissions: 6.2,
    scope1: 1.8,
    scope2: 3.4,
    scope3: 1.0,
    target2030: 2.9,
    target2040: 0.2,
    yoyChangePct: -5.4,
    color: '#f59e0b',
    iconName: 'Building2',
    description: 'Corporate high-rises, retail malls, data centers, heat pumps, and HVAC cooling towers.',
    keyDrivers: ['Smart AI HVAC occupancy controls', 'Heat pump electric retrofits', 'On-site rooftop solar BESS']
  },
  {
    id: 'residential',
    name: 'Residential',
    currentEmissions: 5.2,
    scope1: 1.9,
    scope2: 2.8,
    scope3: 0.5,
    target2030: 2.1,
    target2040: 0.1,
    yoyChangePct: -3.9,
    color: '#8b5cf6',
    iconName: 'Home',
    description: 'Household gas heating, air conditioning, residential power grid draw, and cooking gas.',
    keyDrivers: ['Residential solar rooftop subsidies', 'District heat network connections', 'Insulation thermal sealing']
  }
];

export const CARBON_PREDICTIONS_2040: CarbonPredictionPoint[] = [
  { year: 2024, bauBaseline: 38.2, currentTrajectory: 38.2, netZeroTarget: 38.2, offsetVolume: 0.0 },
  { year: 2025, bauBaseline: 38.8, currentTrajectory: 36.4, netZeroTarget: 34.0, offsetVolume: 0.8 },
  { year: 2026, bauBaseline: 39.4, currentTrajectory: 34.2, netZeroTarget: 29.5, offsetVolume: 1.6 },
  { year: 2028, bauBaseline: 40.5, currentTrajectory: 29.5, netZeroTarget: 21.0, offsetVolume: 3.2 },
  { year: 2030, bauBaseline: 41.8, currentTrajectory: 24.1, netZeroTarget: 13.5, offsetVolume: 5.0 },
  { year: 2032, bauBaseline: 42.9, currentTrajectory: 18.8, netZeroTarget: 8.2, offsetVolume: 6.2 },
  { year: 2035, bauBaseline: 44.5, currentTrajectory: 12.2, netZeroTarget: 3.8, offsetVolume: 7.5 },
  { year: 2038, bauBaseline: 46.1, currentTrajectory: 6.5, netZeroTarget: 1.1, offsetVolume: 8.4 },
  { year: 2040, bauBaseline: 47.8, currentTrajectory: 2.7, netZeroTarget: 0.0, offsetVolume: 9.2 }
];

export const PRESET_EXECUTIVE_REPORTS: ExecutiveReport[] = [
  {
    id: 'rpt-001',
    title: 'Metropolis Coastal Resilience & Flood Mitigation Strategy 2030',
    region: 'Metropolis Delta Hub',
    author: 'Dr. Elena Rostova (Lead Climate Twin Architect)',
    date: '2026-07-15',
    status: 'Approved',
    summary: 'Comprehensive analysis of 0.8m sea-level surge modeling with proposed permeable wetland bio-barriers and real-time tidal gate deployment.',
    markdownContent: `# Metropolis Coastal Resilience Report
**Prepared for**: Municipal Coastal Defense Commission  
**Digital Twin Model**: Metropolis Delta v4.2  

## Executive Summary
This simulation stress-tests the impact of extreme storm surge events (+1.8m peak surge) coupled with a projected baseline global mean temperature rise of +2.1°C by 2035.

### Key Technical Findings
- **Inundation Exposure**: Without intervention, 18.4% of commercial harbor assets face annual flood risk exceeding $140M in potential structural damage.
- **Nature-Based Solution (NBS)**: Expanding South Estuarine Wetlands by 350 hectares lowers wave energy dissipations by 42%.
- **Net Lifecycle Savings**: $3.80 saved in emergency repairs for every $1.00 invested in green infrastructure.

### Priority Interventions
1. Deploy 180 automated hydro-pressure sensors along Pier 1-14.
2. Retrofit Harbor Logistics Port with permeable porous pavement.
3. Establish dynamic AI surge gates connected directly to municipal IoT command.`
  },
  {
    id: 'rpt-002',
    title: 'Urban Heat Island Abatement & Cool Corridor Master Plan',
    region: 'Metropolis Delta Hub',
    author: 'Marcus Vance (City Urban Planner Director)',
    date: '2026-06-28',
    status: 'Under Review',
    summary: 'Evaluating thermal mitigation through 35% urban canopy expansion, reflective cool-roof mandates, and street micro-misting arrays.',
    markdownContent: `# Urban Heat Island Abatement Briefing
**Target District**: Central Financial Plaza & Urban Core  

## Summary
The thermal satellite digital twin revealed peak summer canopy temperatures exceeding rural baselines by 5.8°C.

### Mitigation Scenario Benchmarks
- **Target**: Reduce urban heat island intensity by 2.2°C by 2030.
- **Action Plan**: Mandate solar-reflective roofing on all commercial buildings > 1,500 sq m.
- **Health Outcome**: Estimated 310 fewer heat-related emergency hospitalizations annually.`
  }
];

export const DEFAULT_DISASTER_CARDS: DisasterRiskCardData[] = [
  {
    id: 'flood',
    title: 'Coastal Storm Surge & Riverine Flood',
    category: 'Hydrological Risk',
    probability: 84,
    severity: 'Critical',
    primaryColor: '#06b6d4',
    accentColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
    timeframe: 'Next 12 - 36 Hours',
    affectedDistrictsCount: 4,
    estimatedPopAtRisk: 184000,
    description: 'High tide spring surge aligned with heavy estuarine watershed discharge (+1.85m water level above mean high water).',
    keyTelemetry: [
      { label: 'River Basin Gauges', value: '4.82m (Severe High)', status: 'critical' },
      { label: 'Tidal Hydro Pressure', value: '104.2 kPa (Rising)', status: 'warning' },
      { label: 'Rainfall Rate', value: '48 mm/hr Peak', status: 'critical' }
    ],
    mitigationSteps: [
      {
        phase: 'Immediate Response (0-12h)',
        title: 'Activate Automated Tidal Surge Barriers',
        detail: 'Trigger hydraulic gates at Harbor Channel Pier 1-14 and alert harbor vessels.',
        agency: 'Port & Waterways Authority',
        status: 'active',
        estimatedCostUSD: 450000
      },
      {
        phase: 'Short-Term Defense (12-48h)',
        title: 'Deploy High-Volume Mobile Pump Trucks',
        detail: 'Position 12 heavy diesel pumps at low-lying subway entry shafts in Coastal Bayfront.',
        agency: 'Municipal Emergency Management',
        status: 'deploying',
        estimatedCostUSD: 280000
      },
      {
        phase: 'Infrastructure Resilience (48h+)',
        title: 'Construct Estuarine Bio-Swale Wetlands',
        detail: 'Expand 240 hectares of permeable mangrove marsh to absorb wave energy.',
        agency: 'Department of Environmental Defense',
        status: 'ready',
        estimatedCostUSD: 3400000
      }
    ]
  },
  {
    id: 'cyclone',
    title: 'Category 4 Tropical Cyclone Landfall',
    category: 'Meteorological Risk',
    probability: 68,
    severity: 'High',
    primaryColor: '#3b82f6',
    accentColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-400',
    timeframe: 'Next 24 - 48 Hours',
    affectedDistrictsCount: 5,
    estimatedPopAtRisk: 310000,
    description: 'Rapid intensification over warm ocean anomaly (+2.4°C SST). Sustained winds of 215 km/h with severe eyewall gusts.',
    keyTelemetry: [
      { label: 'Barometric Pressure', value: '942 hPa (Dropping)', status: 'critical' },
      { label: 'Max Gust Velocity', value: '230 km/h', status: 'critical' },
      { label: 'Ocean Surface Temp', value: '29.8°C Anomaly', status: 'warning' }
    ],
    mitigationSteps: [
      {
        phase: 'Immediate Response (0-12h)',
        title: 'Mandatory Coastal Zone Evacuation',
        detail: 'Issue Wireless Emergency Alerts for Zone A & Zone B residents to move inland.',
        agency: 'Civil Defense & Public Safety',
        status: 'active',
        estimatedCostUSD: 1200000
      },
      {
        phase: 'Short-Term Defense (12-48h)',
        title: 'Harden Grid Substation Enclosures',
        detail: 'Install storm shutters and backup battery microgrids at 18 critical electrical hubs.',
        agency: 'Regional Energy Grid Corp',
        status: 'deploying',
        estimatedCostUSD: 850000
      },
      {
        phase: 'Infrastructure Resilience (48h+)',
        title: 'Underground Power Line Retrofit',
        detail: 'Bury 45 km of high-voltage transmission lines along primary coastal corridors.',
        agency: 'Department of Infrastructure',
        status: 'ready',
        estimatedCostUSD: 12500000
      }
    ]
  },
  {
    id: 'heatwave',
    title: 'Severe Urban Heat Island & Thermal Spike',
    category: 'Climatic Stress',
    probability: 91,
    severity: 'Critical',
    primaryColor: '#ef4444',
    accentColor: 'from-rose-500/20 to-amber-500/10 border-rose-500/40 text-rose-400',
    timeframe: 'Next 3 - 7 Days',
    affectedDistrictsCount: 6,
    estimatedPopAtRisk: 420000,
    description: 'Persistent high-pressure heat dome trapping urban canopy temperatures above 42.5°C for 5 consecutive days.',
    keyTelemetry: [
      { label: 'Peak Canopy Temp', value: '43.2°C (Extreme)', status: 'critical' },
      { label: 'Humidity Index', value: '78% Wet Bulb', status: 'critical' },
      { label: 'Power Grid Load', value: '96.8% Max Capacity', status: 'warning' }
    ],
    mitigationSteps: [
      {
        phase: 'Immediate Response (0-12h)',
        title: 'Open 24/7 Air-Conditioned Cooling Hubs',
        detail: 'Convert 14 community centers and libraries into designated emergency heat shelters.',
        agency: 'Health & Human Services',
        status: 'active',
        estimatedCostUSD: 310000
      },
      {
        phase: 'Short-Term Defense (12-48h)',
        title: 'Deploy High-Pressure Street Micro-Misting',
        detail: 'Operate automated cooling mist stations at high-pedestrian transit plazas.',
        agency: 'Urban Environment Bureau',
        status: 'deploying',
        estimatedCostUSD: 180000
      },
      {
        phase: 'Infrastructure Resilience (48h+)',
        title: 'Cool Roof & Canopy Cover Mandate',
        detail: 'Apply high-albedo solar reflective coating to 850,000 m² of commercial rooftops.',
        agency: 'Building Standards Commission',
        status: 'ready',
        estimatedCostUSD: 5200000
      }
    ]
  },
  {
    id: 'wildfire',
    title: 'Wildland-Urban Interface Firestorm',
    category: 'Combustion Hazard',
    probability: 54,
    severity: 'Elevated',
    primaryColor: '#f97316',
    accentColor: 'from-orange-500/20 to-red-500/10 border-orange-500/40 text-orange-400',
    timeframe: 'Next 24 - 72 Hours',
    affectedDistrictsCount: 3,
    estimatedPopAtRisk: 86000,
    description: 'Low fuel moisture (<6%) combined with offshore dry Santa Ana/foehn winds blowing at 55 km/h across dry chaparral.',
    keyTelemetry: [
      { label: 'Fuel Moisture Index', value: '5.2% (Extremely Dry)', status: 'critical' },
      { label: 'Relative Humidity', value: '11% (Severe Drought)', status: 'critical' },
      { label: 'Thermal Infrared Hotspots', value: '14 Active Detection Clusters', status: 'warning' }
    ],
    mitigationSteps: [
      {
        phase: 'Immediate Response (0-12h)',
        title: 'Pre-position Aerial Tankers & Retardant Drops',
        detail: 'Station 4 fire-suppression helicopters at West Ridge Heliport for instant spot response.',
        agency: 'Wildland Fire Service',
        status: 'ready',
        estimatedCostUSD: 720000
      },
      {
        phase: 'Short-Term Defense (12-48h)',
        title: 'Clear 100m Buffer Defensible Space',
        detail: 'Execute mechanical brush clearing along residential interface perimeters.',
        agency: 'Forestry & Conservation Board',
        status: 'deploying',
        estimatedCostUSD: 410000
      },
      {
        phase: 'Infrastructure Resilience (48h+)',
        title: 'AI Infrared Drone Perimeter Mesh',
        detail: 'Deploy 24 continuous thermal scanning drones with autonomous spark detection algorithms.',
        agency: 'Public Safety Technology Division',
        status: 'ready',
        estimatedCostUSD: 1950000
      }
    ]
  },
  {
    id: 'drought',
    title: 'Multi-Year Aquifer & Agricultural Drought',
    category: 'Hydrological Deficit',
    probability: 42,
    severity: 'Moderate',
    primaryColor: '#eab308',
    accentColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-400',
    timeframe: 'Next 30 - 180 Days',
    affectedDistrictsCount: 4,
    estimatedPopAtRisk: 240000,
    description: 'Reservoir storage levels at 34% total capacity following 18 months of below-average snowpack and precipitation.',
    keyTelemetry: [
      { label: 'Main Reservoir Level', value: '34.2% Capacity', status: 'warning' },
      { label: 'Soil Moisture Deficit', value: '-68 mm vs Historic', status: 'warning' },
      { label: 'Groundwater Table Depletion', value: '-3.8m Decline', status: 'warning' }
    ],
    mitigationSteps: [
      {
        phase: 'Immediate Response (0-12h)',
        title: 'Level 3 Agricultural Water Rationing',
        detail: 'Enforce smart IoT flow-restrictors on non-essential irrigation channels.',
        agency: 'Regional Water Resources Board',
        status: 'active',
        estimatedCostUSD: 150000
      },
      {
        phase: 'Short-Term Defense (12-48h)',
        title: 'Reclaimed Water Recycling Pipelines',
        detail: 'Divert 40M gallons/day of treated industrial water for agricultural recharge.',
        agency: 'Sanitation & Water Bureau',
        status: 'deploying',
        estimatedCostUSD: 890000
      },
      {
        phase: 'Infrastructure Resilience (48h+)',
        title: 'Desalination Plant Expansion & Managed Recharge',
        detail: 'Build reverse-osmosis coastal facility with deep aquifer injection wells.',
        agency: 'Infrastructure Development Agency',
        status: 'ready',
        estimatedCostUSD: 48000000
      }
    ]
  }
];

export const DEFAULT_AFFECTED_ZONES: AffectedZoneData[] = [
  {
    id: 'zone-1',
    name: 'Coastal Bayfront Pier 1-18',
    disasterTypes: ['flood', 'cyclone'],
    riskLevel: 'Critical',
    populationAtRisk: 78000,
    sheltersAvailable: 12,
    evacuationStatus: 'Mandatory',
    vulnerabilityFactors: ['Low elevation (<1.2m)', 'Dense high-rise apartments', 'Submerged power grid exposure'],
    primaryCoordinates: '40.7050° N, 74.0090° W'
  },
  {
    id: 'zone-2',
    name: 'Industrial East Logistics Port',
    disasterTypes: ['flood', 'heatwave', 'cyclone'],
    riskLevel: 'Critical',
    populationAtRisk: 42000,
    sheltersAvailable: 8,
    evacuationStatus: 'In Progress',
    vulnerabilityFactors: ['Heavy chemical storage tanks', 'High concrete heat absorption', 'Port crane wind vulnerability'],
    primaryCoordinates: '40.7180° N, 73.9850° W'
  },
  {
    id: 'zone-3',
    name: 'Central Business Plaza & Subway Core',
    disasterTypes: ['heatwave', 'flood'],
    riskLevel: 'High',
    populationAtRisk: 145000,
    sheltersAvailable: 24,
    evacuationStatus: 'Advisory',
    vulnerabilityFactors: ['Subway tunnel flood risk', 'Extreme thermal heat island (+5.2°C)', 'High grid load'],
    primaryCoordinates: '40.7250° N, 73.9980° W'
  },
  {
    id: 'zone-4',
    name: 'Western Woodlands & Brush Interface',
    disasterTypes: ['wildfire', 'drought', 'heatwave'],
    riskLevel: 'High',
    populationAtRisk: 38000,
    sheltersAvailable: 6,
    evacuationStatus: 'Advisory',
    vulnerabilityFactors: ['Dense dry timber fuel load', 'Narrow single-road evacuation bottlenecks', 'Low water pressure'],
    primaryCoordinates: '40.7420° N, 74.0250° W'
  },
  {
    id: 'zone-5',
    name: 'Southern Agricultural Basin',
    disasterTypes: ['drought', 'heatwave', 'flood'],
    riskLevel: 'Moderate',
    populationAtRisk: 52000,
    sheltersAvailable: 15,
    evacuationStatus: 'Clear',
    vulnerabilityFactors: ['Aquifer depletion', 'Unprotected crop acreage', 'Flash flood soil erosion'],
    primaryCoordinates: '40.6890° N, 74.0150° W'
  }
];

export const DEFAULT_RESERVOIRS: ReservoirData[] = [
  {
    id: 'res-1',
    name: 'Pine Creek Primary Reservoir',
    capacityMCM: 450,
    currentMCM: 218,
    percentageFull: 48.4,
    inflowRateM3s: 14.2,
    outflowRateM3s: 28.5,
    status: 'Caution',
    trend: 'falling',
    primarySupplyTarget: 'Metropolis North & Central Grid'
  },
  {
    id: 'res-2',
    name: 'Highland Alpine Watershed Dam',
    capacityMCM: 820,
    currentMCM: 635,
    percentageFull: 77.4,
    inflowRateM3s: 42.8,
    outflowRateM3s: 31.0,
    status: 'Optimal',
    trend: 'rising',
    primarySupplyTarget: 'Industrial East & Seaport Hub'
  },
  {
    id: 'res-3',
    name: 'South Valley Storage Basin',
    capacityMCM: 310,
    currentMCM: 92,
    percentageFull: 29.6,
    inflowRateM3s: 5.1,
    outflowRateM3s: 18.2,
    status: 'Critical Low',
    trend: 'falling',
    primarySupplyTarget: 'Southern Agricultural Belt'
  },
  {
    id: 'res-4',
    name: 'Coastal Aqueduct Surge Basin',
    capacityMCM: 180,
    currentMCM: 154,
    percentageFull: 85.5,
    inflowRateM3s: 22.0,
    outflowRateM3s: 19.5,
    status: 'Optimal',
    trend: 'stable',
    primarySupplyTarget: 'Bayfront Desalination Hybrid'
  }
];

export const DEFAULT_GROUNDWATER_AQUIFERS: GroundwaterAquiferData[] = [
  {
    id: 'aquifer-1',
    name: 'Central Alluvial Deep Aquifer',
    depthToWaterMeters: 42.8,
    baselineDepthMeters: 28.0,
    depletionRateCmYr: 48.5,
    salinityPPM: 380,
    rechargeRatePct: 22.4,
    healthIndex: 52,
    status: 'Moderate Depletion'
  },
  {
    id: 'aquifer-2',
    name: 'Coastal Saltwater Intrusion Zone',
    depthToWaterMeters: 58.2,
    baselineDepthMeters: 32.5,
    depletionRateCmYr: 72.0,
    salinityPPM: 1450,
    rechargeRatePct: 11.2,
    healthIndex: 28,
    status: 'Severe Deficit'
  },
  {
    id: 'aquifer-3',
    name: 'Northern Glacial Bedrock Aquifer',
    depthToWaterMeters: 18.4,
    baselineDepthMeters: 16.0,
    depletionRateCmYr: 8.2,
    salinityPPM: 180,
    rechargeRatePct: 68.5,
    healthIndex: 88,
    status: 'Healthy'
  }
];

export const DEFAULT_RAINFALL_ANALYTICS: RainfallDataPoint[] = [
  { month: 'Jan', historicalAvgMm: 85, currentActualMm: 62, forecastMm: 60 },
  { month: 'Feb', historicalAvgMm: 78, currentActualMm: 54, forecastMm: 50 },
  { month: 'Mar', historicalAvgMm: 92, currentActualMm: 41, forecastMm: 45 },
  { month: 'Apr', historicalAvgMm: 110, currentActualMm: 68, forecastMm: 70 },
  { month: 'May', historicalAvgMm: 125, currentActualMm: 82, forecastMm: 80 },
  { month: 'Jun', historicalAvgMm: 140, currentActualMm: 95, forecastMm: 90 },
  { month: 'Jul', historicalAvgMm: 165, currentActualMm: 88, forecastMm: 105 },
  { month: 'Aug', historicalAvgMm: 150, currentActualMm: 72, forecastMm: 110 },
  { month: 'Sep', historicalAvgMm: 120, currentActualMm: 115, forecastMm: 125 },
  { month: 'Oct', historicalAvgMm: 98, currentActualMm: 89, forecastMm: 95 },
  { month: 'Nov', historicalAvgMm: 88, currentActualMm: 76, forecastMm: 82 },
  { month: 'Dec', historicalAvgMm: 80, currentActualMm: 68, forecastMm: 72 }
];

export const DEFAULT_SECTOR_CONSUMPTION: SectorConsumptionData[] = [
  { sector: 'Agricultural Irrigation', mld: 485, percentage: 46.2, efficiencyRating: 'C', color: '#3b82f6' },
  { sector: 'Municipal & Residential', mld: 295, percentage: 28.1, efficiencyRating: 'B', color: '#06b6d4' },
  { sector: 'Industrial Manufacturing', mld: 152, percentage: 14.5, efficiencyRating: 'A', color: '#8b5cf6' },
  { sector: 'Commercial & Hospitality', mld: 72, percentage: 6.8, efficiencyRating: 'A+', color: '#10b981' },
  { sector: 'System Loss / Non-Revenue Water', mld: 46, percentage: 4.4, efficiencyRating: 'D', color: '#ef4444' }
];

export const DEFAULT_LEAK_ALERTS: PipeLeakAlert[] = [
  {
    id: 'leak-101',
    district: 'Coastal Bayfront Pier 8',
    pipelineSegment: 'Main Trunk DN900 Cast Iron',
    estimatedLossLph: 14200,
    pressureDropPsi: 14.2,
    acousticFreqHz: 340,
    urgency: 'Critical Burst',
    coordinates: '40.7082° N, 74.0045° W',
    status: 'Detected'
  },
  {
    id: 'leak-102',
    district: 'Central Business District - 5th Ave',
    pipelineSegment: 'Feeder Sub-ring DN300 HDPE',
    estimatedLossLph: 4800,
    pressureDropPsi: 6.8,
    acousticFreqHz: 520,
    urgency: 'High Leak',
    coordinates: '40.7210° N, 73.9920° W',
    status: 'Repair Dispatched'
  },
  {
    id: 'leak-103',
    district: 'South Valley Ag Pipeline #4',
    pipelineSegment: 'Raw Water Line DN600 Steel',
    estimatedLossLph: 8900,
    pressureDropPsi: 9.5,
    acousticFreqHz: 290,
    urgency: 'High Leak',
    coordinates: '40.6920° N, 74.0180° W',
    status: 'Detected'
  },
  {
    id: 'leak-104',
    district: 'Western Woodlands Substation',
    pipelineSegment: 'Pressure Relief Bypass Valve',
    estimatedLossLph: 1200,
    pressureDropPsi: 2.1,
    acousticFreqHz: 710,
    urgency: 'Minor Seepage',
    coordinates: '40.7380° N, 74.0210° W',
    status: 'Isolated'
  }
];

export const DEFAULT_DEMAND_FORECAST: WaterDemandForecastPoint[] = [
  { period: 'Week 1', projectedDemandMLD: 1020, availableSupplyMLD: 1050, shortageGapMLD: 0, tempAnomalyC: 1.2 },
  { period: 'Week 2', projectedDemandMLD: 1045, availableSupplyMLD: 1040, shortageGapMLD: -5, tempAnomalyC: 2.1 },
  { period: 'Week 3', projectedDemandMLD: 1080, availableSupplyMLD: 1030, shortageGapMLD: -50, tempAnomalyC: 3.4 },
  { period: 'Week 4', projectedDemandMLD: 1120, availableSupplyMLD: 1010, shortageGapMLD: -110, tempAnomalyC: 4.8 },
  { period: 'Week 5', projectedDemandMLD: 1150, availableSupplyMLD: 990, shortageGapMLD: -160, tempAnomalyC: 5.2 },
  { period: 'Week 6', projectedDemandMLD: 1110, availableSupplyMLD: 1000, shortageGapMLD: -110, tempAnomalyC: 3.9 },
  { period: 'Week 7', projectedDemandMLD: 1060, availableSupplyMLD: 1020, shortageGapMLD: -40, tempAnomalyC: 2.2 },
  { period: 'Week 8', projectedDemandMLD: 1030, availableSupplyMLD: 1040, shortageGapMLD: 0, tempAnomalyC: 1.0 }
];

export const DEFAULT_AI_SHORTAGE_PREDICTIONS: AIShortagePrediction[] = [
  {
    districtName: 'South Valley Agricultural District',
    daysOfReserveRemaining: 18,
    shortageProbabilityPct: 88,
    riskLevel: 'Critical',
    primaryCause: 'South Valley Reservoir at 29.6% capacity combined with +3.4°C heatwave irrigation spikes.',
    recommendedActions: [
      'Enforce automated Level 3 agricultural flow-throttling on canal turnouts',
      'Divert 40 MLD from Coastal Aqueduct Surge Basin',
      'Deploy mobile brackish water filtration units'
    ]
  },
  {
    districtName: 'Coastal Bayfront Residential Zone',
    daysOfReserveRemaining: 32,
    shortageProbabilityPct: 64,
    riskLevel: 'High',
    primaryCause: 'Acoustic pipe leak (14,200 L/hr loss at Pier 8) accelerating localized pressure drops.',
    recommendedActions: [
      'Execute emergency acoustic leak patch at DN900 Trunk Pier 8',
      'Ramp up Bayfront Desalination Plant to 100% duty cycle (+25 MLD)',
      'Activate smart pressure-reducing valves (PRVs) across Zone 2'
    ]
  },
  {
    districtName: 'Metropolis Central Commercial Core',
    daysOfReserveRemaining: 65,
    shortageProbabilityPct: 28,
    riskLevel: 'Low',
    primaryCause: 'Stable supply from Highland Watershed; minor peak cooling tower demand during afternoon.',
    recommendedActions: [
      'Maintain automated HVAC greywater recycling mandates',
      'Monitor main feeder line acoustic vibration sensor telemetry'
    ]
  }
];

// Default Renewable Energy Planner Mock Data
export const DEFAULT_SOLAR_POTENTIAL: SolarPotentialData = {
  solarIrradianceKwhM2Day: 5.85,
  peakCapacityMW: 145,
  annualGenerationGWh: 248,
  suitableRoofAreaSqM: 520000,
  rooftopSuitabilityScore: 88,
  hourlyGenerationCurve: [
    { hour: '00:00', solarMW: 0, loadMW: 42 },
    { hour: '02:00', solarMW: 0, loadMW: 38 },
    { hour: '04:00', solarMW: 0, loadMW: 36 },
    { hour: '06:00', solarMW: 12, loadMW: 45 },
    { hour: '08:00', solarMW: 58, loadMW: 75 },
    { hour: '10:00', solarMW: 115, loadMW: 92 },
    { hour: '12:00', solarMW: 142, loadMW: 110 },
    { hour: '14:00', solarMW: 135, loadMW: 118 },
    { hour: '16:00', solarMW: 88, loadMW: 105 },
    { hour: '18:00', solarMW: 32, loadMW: 98 },
    { hour: '20:00', solarMW: 2, loadMW: 82 },
    { hour: '22:00', solarMW: 0, loadMW: 58 }
  ]
};

export const DEFAULT_WIND_POTENTIAL: WindPotentialData = {
  avgWindSpeedMs: 8.6,
  capacityFactorPct: 44.2,
  installedTurbineCount: 48,
  annualWindGenerationGWh: 312,
  windRoseDirectionData: [
    { direction: 'N', frequencyPct: 12, avgSpeedMs: 7.2 },
    { direction: 'NE', frequencyPct: 18, avgSpeedMs: 8.5 },
    { direction: 'E', frequencyPct: 8, avgSpeedMs: 6.1 },
    { direction: 'SE', frequencyPct: 6, avgSpeedMs: 5.4 },
    { direction: 'S', frequencyPct: 10, avgSpeedMs: 7.8 },
    { direction: 'SW', frequencyPct: 28, avgSpeedMs: 10.2 },
    { direction: 'W', frequencyPct: 12, avgSpeedMs: 8.1 },
    { direction: 'NW', frequencyPct: 6, avgSpeedMs: 6.8 }
  ]
};

export const DEFAULT_BATTERY_STORAGE: BatteryStorageData = {
  totalCapacityMWh: 180,
  currentStateOfChargePct: 82,
  maxChargeDischargePowerMW: 60,
  roundTripEfficiencyPct: 92.5,
  cycleLifeRemainingPct: 96,
  chemistryType: 'LFP (Lithium Iron Phosphate)',
  hourlyStateOfCharge: [
    { hour: '00:00', socPct: 45, netFlowMW: -10 },
    { hour: '03:00', socPct: 32, netFlowMW: -12 },
    { hour: '06:00', socPct: 25, netFlowMW: 5 },
    { hour: '09:00', socPct: 52, netFlowMW: 35 },
    { hour: '12:00', socPct: 90, netFlowMW: 50 },
    { hour: '15:00', socPct: 98, netFlowMW: 20 },
    { hour: '18:00', socPct: 85, netFlowMW: -25 },
    { hour: '21:00', socPct: 62, netFlowMW: -30 }
  ]
};

export const DEFAULT_MICROGRID_NODES: MicrogridNodeData[] = [
  {
    id: 'mg-01',
    name: 'Bayfront Clean Power Hub',
    district: 'Coastal Bayfront District',
    coordinates: '37.7749, -122.4194',
    lat: 37.7749,
    lng: -122.4194,
    solarMW: 45,
    windMW: 60,
    batteryMWh: 80,
    loadMW: 38,
    gridIndependencePct: 94,
    status: 'Optimal',
    frequencyHz: 60.01,
    voltageKV: 13.8
  },
  {
    id: 'mg-02',
    name: 'Industrial Park Microgrid B',
    district: 'Industrial Port Logistics Area',
    coordinates: '37.7833, -122.4167',
    lat: 37.7833,
    lng: -122.4167,
    solarMW: 30,
    windMW: 25,
    batteryMWh: 40,
    loadMW: 42,
    gridIndependencePct: 82,
    status: 'Grid Synchronized',
    frequencyHz: 59.98,
    voltageKV: 13.8
  },
  {
    id: 'mg-03',
    name: 'South Valley Agri-Solar Grid',
    district: 'South Valley Agricultural District',
    coordinates: '37.7610, -122.4280',
    lat: 37.7610,
    lng: -122.4280,
    solarMW: 55,
    windMW: 15,
    batteryMWh: 35,
    loadMW: 22,
    gridIndependencePct: 98,
    status: 'Islanding Active',
    frequencyHz: 60.00,
    voltageKV: 12.4
  },
  {
    id: 'mg-04',
    name: 'Civic Core Emergency Microgrid',
    district: 'Metropolis Central Commercial Core',
    coordinates: '37.7880, -122.4050',
    lat: 37.7880,
    lng: -122.4050,
    solarMW: 15,
    windMW: 0,
    batteryMWh: 25,
    loadMW: 18,
    gridIndependencePct: 88,
    status: 'Optimal',
    frequencyHz: 60.02,
    voltageKV: 13.8
  }
];

export const DEFAULT_FINANCIAL_ROI: FinancialROIStats = {
  initialCapexUSD: 142000000, // $142M
  annualOpexSavingsUSD: 24500000, // $24.5M/yr
  paybackPeriodYears: 5.8,
  internalRateOfReturnPct: 18.4,
  netPresentValue20YrUSD: 185000000, // $185M NPV
  levelizedCostOfEnergyUSDPerKWh: 0.042, // $0.042/kWh
  cashFlowForecastYears: [
    { year: 1, cumulativeSavingsUSD: -117500000, netCashFlowUSD: 24500000 },
    { year: 2, cumulativeSavingsUSD: -93000000, netCashFlowUSD: 24500000 },
    { year: 3, cumulativeSavingsUSD: -68500000, netCashFlowUSD: 24500000 },
    { year: 4, cumulativeSavingsUSD: -44000000, netCashFlowUSD: 24500000 },
    { year: 5, cumulativeSavingsUSD: -19500000, netCashFlowUSD: 24500000 },
    { year: 6, cumulativeSavingsUSD: 5000000, netCashFlowUSD: 24500000 },
    { year: 7, cumulativeSavingsUSD: 29500000, netCashFlowUSD: 24500000 },
    { year: 8, cumulativeSavingsUSD: 54000000, netCashFlowUSD: 24500000 },
    { year: 9, cumulativeSavingsUSD: 78500000, netCashFlowUSD: 24500000 },
    { year: 10, cumulativeSavingsUSD: 103000000, netCashFlowUSD: 24500000 },
    { year: 15, cumulativeSavingsUSD: 225500000, netCashFlowUSD: 24500000 },
    { year: 20, cumulativeSavingsUSD: 348000000, netCashFlowUSD: 24500000 }
  ]
};

export const DEFAULT_CARBON_REDUCTION: CarbonReductionStats = {
  annualCO2OffsetMetricTons: 185000,
  lifetimeCO2OffsetMetricTons: 3700000,
  equivalentTreesPlanted: 8250000,
  equivalentCoalPlantsRetired: 1.4,
  fossilFuelReplacedBarrels: 430000
};


