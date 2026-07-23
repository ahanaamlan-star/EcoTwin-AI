import { ComprehensiveReport, ReportTypeKey } from '../types';

export const PRESET_REPORTS_MAP: Record<ReportTypeKey, ComprehensiveReport> = {
  executive: {
    id: 'rpt-exec-2026',
    typeKey: 'executive',
    typeTitle: 'Executive Summary',
    title: 'Metropolis Delta 2026 Climate & ESG Master Executive Briefing',
    regionName: 'Metropolis Delta',
    generatedAt: '2026-07-22',
    author: 'Chief ESG & Resilience Advisory Board',
    status: 'Approved & Final',
    complianceBadge: 'SEC ESG & ISO 14064 Compliant',
    executiveSummary: 'This Executive Summary synthesizes overall environmental resilience, carbon footprint reductions, water security indexes, and clean energy grid transition across all 4 municipal districts in Metropolis Delta. Predictive digital twin modeling confirms a 32.4% net carbon reduction since baseline, with full municipal net-zero trajectory projected by 2034.',
    keyMetrics: [
      { label: 'Overall Sustainability Score', value: '88.4 / 100', change: '+6.2 pts', isPositive: true, subtext: 'Top 5% Global Metro' },
      { label: 'Net Annual CO2 Offset', value: '382,500 MT', change: '-12.8%', isPositive: true, subtext: 'Ahead of 2026 target' },
      { label: 'Clean Energy Grid Share', value: '64.2%', change: '+8.5%', isPositive: true, subtext: 'Solar + Wind + BESS' },
      { label: 'Municipal Water Stress Index', value: '28.1 / 100', change: '-14.3%', isPositive: true, subtext: 'Low Stress Zone' },
      { label: 'Est. 10-Yr Fiscal Return', value: '$248.5M', change: '+18.4% ROI', isPositive: true, subtext: 'Combined avoided damage' }
    ],
    chartTitle: '5-Year Cross-Domain Sustainability Trajectory',
    chartSubtitle: 'Historical vs Projected Performance Across Carbon, Energy & Water Indexes',
    chartData: [
      { year: '2022', carbonScore: 58, energyCleanPct: 38, waterEfficiencyScore: 62, targetBaseline: 50 },
      { year: '2023', carbonScore: 64, energyCleanPct: 45, waterEfficiencyScore: 68, targetBaseline: 55 },
      { year: '2024', carbonScore: 72, energyCleanPct: 52, waterEfficiencyScore: 74, targetBaseline: 62 },
      { year: '2025', carbonScore: 81, energyCleanPct: 58, waterEfficiencyScore: 82, targetBaseline: 70 },
      { year: '2026', carbonScore: 88, energyCleanPct: 64, waterEfficiencyScore: 88, targetBaseline: 78 },
      { year: '2027 Proj', carbonScore: 92, energyCleanPct: 72, waterEfficiencyScore: 91, targetBaseline: 84 },
      { year: '2028 Proj', carbonScore: 96, energyCleanPct: 81, waterEfficiencyScore: 95, targetBaseline: 90 }
    ],
    tableTitle: 'District-Level ESG & Resilience Matrix',
    tableHeaders: ['District', 'CO2 Offset (Tons)', 'Grid Clean %', 'Water Network Efficiency', 'Resilience Rating', 'YOY Variance'],
    tableRows: [
      { id: 'd-1', sectorName: 'Central Commercial Core', metricA: '142,000 MT', metricB: '72.4%', metricC: '94.2%', status: 'Optimal (A+)', variancePct: '+14.2%' },
      { id: 'd-2', sectorName: 'Coastal Defense Zone', metricA: '88,500 MT', metricB: '58.1%', metricC: '88.6%', status: 'Optimal (A)', variancePct: '+9.8%' },
      { id: 'd-3', sectorName: 'Northern Tech Corridor', metricA: '112,000 MT', metricB: '81.0%', metricC: '91.5%', status: 'Optimal (A+)', variancePct: '+18.1%' },
      { id: 'd-4', sectorName: 'Eastern Industrial Park', metricA: '40,000 MT', metricB: '45.3%', metricC: '78.0%', status: 'Moderate (B-)', variancePct: '+5.4%' }
    ],
    recommendations: [
      {
        id: 'rec-ex-1',
        title: 'Accelerate Heavy Industrial Microgrid Battery Interconnection',
        category: 'Energy & Grid Resilience',
        priority: 'Immediate Critical',
        impact: 'Reduces peak fossil fuel spinning reserve dispatch by 42MW during heatwaves.',
        estCostUSD: '$18.5 Million',
        timeframe: 'Q3 2026 - Q2 2027',
        responsibleAgency: 'Municipal Power Authority',
        actionSteps: [
          'Procure 80MWh LFP utility-scale battery banks for Eastern Industrial Park.',
          'Deploy automated demand-response node interfaces.'
        ]
      },
      {
        id: 'rec-ex-2',
        title: 'Expand Urban Forest Canopy in High Surface Heat Sectors',
        category: 'Urban Climate Adaptation',
        priority: 'High Priority',
        impact: 'Cuts local heat island peaks by 2.8°C and retains 120,000 m³ stormwater.',
        estCostUSD: '$6.2 Million',
        timeframe: 'Q4 2026 - Q4 2027',
        responsibleAgency: 'Parks & Public Works Directorate',
        actionSteps: [
          'Plant 45,000 native shade trees along major transit corridors.',
          'Install bioswale retention basins along 12km of arterial roads.'
        ]
      }
    ]
  },

  climate: {
    id: 'rpt-clim-2026',
    typeKey: 'climate',
    typeTitle: 'Climate Impact Report',
    typeTitleFull: 'Climate Resilience, Thermal Risk & Flood Mitigation Audit',
    title: 'Metropolis Delta Climate Vulnerability & Multi-Hazard Adaptation Assessment',
    regionName: 'Metropolis Delta',
    generatedAt: '2026-07-22',
    author: 'Climate Twin Hydro-Meteorological Modeling Unit',
    status: 'Approved & Final',
    complianceBadge: 'IPCC AR6 & UNDRR Sendai Framework Aligned',
    executiveSummary: 'This Climate Impact Report analyzes extreme thermal exposure, urban heat island intensity, flood attenuation capacity, and air quality index (AQI) dynamics. High-resolution digital twin fluid-dynamics models show that recent mangrove restoration and bioswale installations have reduced 100-year storm surge damage exposure by $84M while buffering urban heat spikes by 2.3°C.',
    keyMetrics: [
      { label: 'Peak Heat Island Offset', value: '-2.4°C', change: '-0.8°C better', isPositive: true, subtext: 'Summer peak surface temp' },
      { label: 'Avg Air Quality Index (AQI)', value: '38 (Good)', change: '24% better', isPositive: true, subtext: 'Safe EPA PM2.5 boundary' },
      { label: 'Coastal Flood Risk Index', value: '18.2 / 100', change: '-32%', isPositive: true, subtext: 'Low Surge Vulnerability' },
      { label: 'Stormwater Retention Capacity', value: '4.2M m³', change: '+38%', isPositive: true, subtext: 'Bioswales & wetland buffer' },
      { label: 'Population Heat Vulnerability', value: '4.2% High Risk', change: '-8.5%', isPositive: true, subtext: 'Shade canopy expansion' }
    ],
    chartTitle: 'Monthly Urban Temperature Anomaly & Air Quality Index (AQI)',
    chartSubtitle: 'Correlation between urban canopy expansion, heat mitigation, and ambient air cleanliness',
    chartData: [
      { month: 'Jan', peakTempC: 18.2, aqiPM25: 45, canopyOffsetC: -1.2, floodRiskScore: 24 },
      { month: 'Feb', peakTempC: 19.8, aqiPM25: 42, canopyOffsetC: -1.4, floodRiskScore: 28 },
      { month: 'Mar', peakTempC: 22.4, aqiPM25: 39, canopyOffsetC: -1.8, floodRiskScore: 22 },
      { month: 'Apr', peakTempC: 25.1, aqiPM25: 36, canopyOffsetC: -2.1, floodRiskScore: 18 },
      { month: 'May', peakTempC: 28.6, aqiPM25: 34, canopyOffsetC: -2.4, floodRiskScore: 15 },
      { month: 'Jun', peakTempC: 32.8, aqiPM25: 38, canopyOffsetC: -2.7, floodRiskScore: 14 },
      { month: 'Jul', peakTempC: 35.2, aqiPM25: 41, canopyOffsetC: -2.9, floodRiskScore: 16 },
      { month: 'Aug', peakTempC: 34.8, aqiPM25: 37, canopyOffsetC: -2.8, floodRiskScore: 20 },
      { month: 'Sep', peakTempC: 31.0, aqiPM25: 35, canopyOffsetC: -2.3, floodRiskScore: 25 },
      { month: 'Oct', peakTempC: 26.4, aqiPM25: 33, canopyOffsetC: -1.9, floodRiskScore: 21 },
      { month: 'Nov', peakTempC: 21.5, aqiPM25: 36, canopyOffsetC: -1.5, floodRiskScore: 19 },
      { month: 'Dec', peakTempC: 18.9, aqiPM25: 40, canopyOffsetC: -1.3, floodRiskScore: 22 }
    ],
    tableTitle: 'District Thermal & Hydro-Vulnerability Breakdown',
    tableHeaders: ['District Sector', 'Canopy Coverage %', 'Avg AQI', 'Storm Surge Buffer', 'Risk Classification', 'Mitigation Level'],
    tableRows: [
      { id: 'cl-1', sectorName: 'South Coastal Wetlands', metricA: '48.2%', metricB: '28 AQI', metricC: '9.2 / 10', status: 'Protected', variancePct: '-35% Surge Risk' },
      { id: 'cl-2', sectorName: 'Downtown High-Density Core', metricA: '22.5%', metricB: '42 AQI', metricC: '6.5 / 10', status: 'Monitored', variancePct: '-2.1°C Heat Offset' },
      { id: 'cl-3', sectorName: 'Northern Suburb Canopy Corridor', metricA: '54.0%', metricB: '24 AQI', metricC: '8.8 / 10', status: 'Optimal', variancePct: '-3.2°C Heat Offset' },
      { id: 'cl-4', sectorName: 'East Freight Logistics Zone', metricA: '18.1%', metricB: '54 AQI', metricC: '5.2 / 10', status: 'Action Required', variancePct: '+1.4°C Above Target' }
    ],
    recommendations: [
      {
        id: 'rec-cl-1',
        title: 'Mandate Reflective Cool Roofs & Green Walls for Commercial Core',
        category: 'Thermal Adaptation',
        priority: 'Immediate Critical',
        impact: 'Lowers rooftop surface temps by up to 14°C and cuts HVAC cooling loads by 18%.',
        estCostUSD: '$4.8 Million',
        timeframe: 'Q3 2026 - Q1 2027',
        responsibleAgency: 'Building Standards & Urban Planning Bureau',
        actionSteps: [
          'Enforce high-albedo solar reflectance index (SRI >= 82) for flat commercial roofs.',
          'Provide tax incentives for vertical living wall installations on parking structures.'
        ]
      },
      {
        id: 'rec-cl-2',
        title: 'Construct Coastal Living Shorelines & Barrier Dune Restoration',
        category: 'Flood & Sea-Level Surge',
        priority: 'High Priority',
        impact: 'Absorbs wave energy from category 3 storms and protects $420M in coastal assets.',
        estCostUSD: '$14.2 Million',
        timeframe: 'Q4 2026 - Q3 2027',
        responsibleAgency: 'Coastal Protection & Environmental Authority',
        actionSteps: [
          'Install 4.5km of oyster reef breakwaters along South Bayfront.',
          'Replant 120 hectares of native saltmarsh vegetation.'
        ]
      }
    ]
  },

  carbon: {
    id: 'rpt-carb-2026',
    typeKey: 'carbon',
    typeTitle: 'Carbon Report',
    title: 'Metropolis Delta Greenhouse Gas Emissions Inventory & Carbon Footprint Audit',
    regionName: 'Metropolis Delta',
    generatedAt: '2026-07-22',
    author: 'Municipal Carbon Accounting & Scope 1-3 Analytics Desk',
    status: 'Approved & Final',
    complianceBadge: 'GHG Protocol & CDP Gold Certified',
    executiveSummary: 'This Carbon Report provides a rigorous accounting of Scope 1 (Direct Municipal), Scope 2 (Purchased Electricity), and Scope 3 (Supply Chain & Freight Transit) greenhouse gas emissions. Total net greenhouse gas emissions fell to 1.18 Million Metric Tons CO2e in 2026, marking a 32.4% net decrease compared to the 2020 baseline.',
    keyMetrics: [
      { label: 'Total GHG Footprint', value: '1.18M MT CO2e', change: '-8.4% YOY', isPositive: true, subtext: 'Annual Scope 1+2+3' },
      { label: 'Scope 1 Direct Municipal', value: '280,000 MT', change: '-12.1%', isPositive: true, subtext: 'Fleet & municipal boilers' },
      { label: 'Scope 2 Power Grid Emissions', value: '420,000 MT', change: '-14.3%', isPositive: true, subtext: 'Grid decarbonization' },
      { label: 'Scope 3 Supply Chain', value: '480,000 MT', change: '-3.2%', isPositive: true, subtext: 'Logistics & waste embodied' },
      { label: 'Carbon Intensity Per Capita', value: '2.35 MT/person', change: '-11.0%', isPositive: true, subtext: 'Lowest in regional state' }
    ],
    chartTitle: 'Historical & Projected Greenhouse Gas Scope Breakdown (2021 - 2030)',
    chartSubtitle: 'Annual metric tons CO2e by Scope 1, Scope 2, and Scope 3 with Net-Zero 2034 Pathway',
    chartData: [
      { year: '2021', scope1: 420000, scope2: 680000, scope3: 610000, netTotal: 1710000, targetLimit: 1750000 },
      { year: '2022', scope1: 390000, scope2: 620000, scope3: 580000, netTotal: 1590000, targetLimit: 1600000 },
      { year: '2023', scope1: 360000, scope2: 560000, scope3: 550000, netTotal: 1470000, targetLimit: 1480000 },
      { year: '2024', scope1: 330000, scope2: 500000, scope3: 520000, netTotal: 1350000, targetLimit: 1360000 },
      { year: '2025', scope1: 305000, scope2: 460000, scope3: 495000, netTotal: 1260000, targetLimit: 1250000 },
      { year: '2026', scope1: 280000, scope2: 420000, scope3: 480000, netTotal: 1180000, targetLimit: 1150000 },
      { year: '2027 Proj', scope1: 220000, scope2: 340000, scope3: 440000, netTotal: 1000000, targetLimit: 1000000 },
      { year: '2028 Proj', scope1: 160000, scope2: 250000, scope3: 390000, netTotal: 800000, targetLimit: 820000 },
      { year: '2030 Proj', scope1: 80000, scope2: 120000, scope3: 300000, netTotal: 500000, targetLimit: 500000 }
    ],
    tableTitle: 'Sector-Wise Carbon Footprint & Reduction Targets',
    tableHeaders: ['Sector Name', 'Annual CO2e (MT)', 'Share of Total', 'Primary Reduction Lever', '2030 Reduction Goal', 'Status'],
    tableRows: [
      { id: 'cb-1', sectorName: 'Commercial Building Operations', metricA: '420,000 MT', metricB: '35.6%', metricC: 'Heat pump & rooftop solar retrofit', status: 'On Track', variancePct: '-12.4%' },
      { id: 'cb-2', sectorName: 'Urban Transit & Fleet Freight', metricA: '310,000 MT', metricB: '26.3%', metricC: '100% Electric Bus & EV Depot conversion', status: 'Ahead of Target', variancePct: '-18.1%' },
      { id: 'cb-3', sectorName: 'Heavy Industrial & Manufacturing', metricA: '260,000 MT', metricB: '22.0%', metricC: 'Green hydrogen & electrification', status: 'Under Review', variancePct: '-4.2%' },
      { id: 'cb-4', sectorName: 'Municipal Waste & Water Treatment', metricA: '190,000 MT', metricB: '16.1%', metricC: 'Methane capture & biogas cogeneration', status: 'Optimal', variancePct: '-15.8%' }
    ],
    recommendations: [
      {
        id: 'rec-cb-1',
        title: 'Institute Heavy Commercial EV Fleet Purchasing Mandate',
        category: 'Scope 1 Transit Decarbonization',
        priority: 'Immediate Critical',
        impact: 'Cuts 65,000 MT CO2e annually from inner-city delivery and logistics routes.',
        estCostUSD: '$12.0 Million Rebate Pool',
        timeframe: 'Q3 2026 - Q4 2027',
        responsibleAgency: 'Department of Transportation',
        actionSteps: [
          'Pass 2027 Freight Electrification Standard requiring 40% zero-emission freight sales.',
          'Build 12 dedicated high-power megawatt-level heavy vehicle charging hubs.'
        ]
      },
      {
        id: 'rec-cb-2',
        title: 'Deploy Municipal Methane Cogeneration Plant at Wastewater Hub',
        category: 'Scope 1 Fugitive Emissions',
        priority: 'High Priority',
        impact: 'Captures 92% of fugitive anaerobic digestion methane and generates 8MW clean power.',
        estCostUSD: '$9.5 Million',
        timeframe: 'Q1 2027 - Q4 2027',
        responsibleAgency: 'Water & Waste Management Authority',
        actionSteps: [
          'Install combined heat and power (CHP) microturbines at Central Treatment Facility.',
          'Sell surplus renewable biogas energy back to regional gas distribution grid.'
        ]
      }
    ]
  },

  water: {
    id: 'rpt-wat-2026',
    typeKey: 'water',
    typeTitle: 'Water Report',
    title: 'Metropolis Delta Hydro-Intelligence, Aquifer Health & Water Network Leakage Report',
    regionName: 'Metropolis Delta',
    generatedAt: '2026-07-22',
    author: 'Digital Water Intelligence & Acoustic Sensor Telemetry Unit',
    status: 'Approved & Final',
    complianceBadge: 'AWWA & World Bank Non-Revenue Water (NRW) Benchmark A+',
    executiveSummary: 'This Water Report presents a deep-dive telemetry audit of water distribution pipe integrity, underground aquifer recharge rates, industrial wastewater circularity, and non-revenue water (NRW) loss reduction. Through AI acoustic pressure sensors, municipal pipe leak losses dropped from 22.4% in 2022 to just 6.2% in 2026, conserving 3.4 Billion Liters of potable water annually.',
    keyMetrics: [
      { label: 'Non-Revenue Leak Loss Rate', value: '6.2%', change: '-16.2% pts', isPositive: true, subtext: 'World-class AWWA Benchmark' },
      { label: 'Annual Water Conserved', value: '3.42B Liters', change: '+28%', isPositive: true, subtext: 'Saved via IoT acoustic leak detection' },
      { label: 'Aquifer Water Table Depth', value: '38.4 meters', change: '+2.4m higher', isPositive: true, subtext: 'Recharge basins active' },
      { label: 'Wastewater Circularity Rate', value: '78.5%', change: '+12.3%', isPositive: true, subtext: 'Industrial greywater reuse' },
      { label: 'Daily Water Consumption/Capita', value: '112 Liters/day', change: '-14%', isPositive: true, subtext: 'Smart meter efficiency' }
    ],
    chartTitle: 'Distribution Network Water Supply vs Non-Revenue Leak Losses (2022 - 2026)',
    chartSubtitle: 'Impact of AI Acoustic Leak Detection and Pressure Optimization on Potable Water Conservation',
    chartData: [
      { month: 'Q1 2023', totalDistributedMML: 1450, leakLossesMML: 320, circularReclaimedMML: 420, aquiferLevelM: 34.2 },
      { month: 'Q2 2023', totalDistributedMML: 1520, leakLossesMML: 310, circularReclaimedMML: 460, aquiferLevelM: 34.8 },
      { month: 'Q3 2023', totalDistributedMML: 1680, leakLossesMML: 290, circularReclaimedMML: 510, aquiferLevelM: 35.1 },
      { month: 'Q4 2023', totalDistributedMML: 1420, leakLossesMML: 240, circularReclaimedMML: 530, aquiferLevelM: 35.5 },
      { month: 'Q1 2024', totalDistributedMML: 1380, leakLossesMML: 180, circularReclaimedMML: 610, aquiferLevelM: 36.2 },
      { month: 'Q2 2024', totalDistributedMML: 1410, leakLossesMML: 140, circularReclaimedMML: 680, aquiferLevelM: 36.9 },
      { month: 'Q3 2024', totalDistributedMML: 1510, leakLossesMML: 110, circularReclaimedMML: 740, aquiferLevelM: 37.4 },
      { month: 'Q4 2024', totalDistributedMML: 1350, leakLossesMML: 92, circularReclaimedMML: 790, aquiferLevelM: 37.8 },
      { month: 'Q1 2025', totalDistributedMML: 1310, leakLossesMML: 85, circularReclaimedMML: 830, aquiferLevelM: 38.1 },
      { month: 'Q2 2026', totalDistributedMML: 1290, leakLossesMML: 78, circularReclaimedMML: 880, aquiferLevelM: 38.4 }
    ],
    tableTitle: 'Water Sector Operational Performance & Leak Telemetry',
    tableHeaders: ['District Water Sector', 'Daily Flow (MML)', 'Pipe Leak Loss %', 'Pressure Stability Index', 'Reclaimed Water %', 'Health Status'],
    tableRows: [
      { id: 'wt-1', sectorName: 'Central High-Pressure Loop', metricA: '42.5 MML', metricB: '4.8%', metricC: '98.2 / 100', status: 'Optimal', variancePct: '-18.2% Leaks' },
      { id: 'wt-2', sectorName: 'Northern Suburb Distribution Zone', metricA: '31.0 MML', metricB: '5.2%', metricC: '96.4 / 100', status: 'Optimal', variancePct: '-14.1% Leaks' },
      { id: 'wt-3', sectorName: 'Coastal Desalination Feed Line', metricA: '28.4 MML', metricB: '3.9%', metricC: '99.1 / 100', status: 'Optimal', variancePct: '-8.5% Leaks' },
      { id: 'wt-4', sectorName: 'East Industrial Freight & Chemical Zone', metricA: '38.0 MML', metricB: '9.4%', metricC: '88.5 / 100', status: 'Leak Alert (Sector 7)', variancePct: '+2.1% Pressure Variance' }
    ],
    recommendations: [
      {
        id: 'rec-wt-1',
        title: 'Upgrade Industrial Zone Feeder Mains with Self-Healing Poly-Liner',
        category: 'Pipe Infrastructure Integrity',
        priority: 'Immediate Critical',
        impact: 'Eliminates remaining 9.4% leak loss in East Industrial Zone and saves 280M Liters/year.',
        estCostUSD: '$5.5 Million',
        timeframe: 'Q3 2026 - Q1 2027',
        responsibleAgency: 'Municipal Water Utility',
        actionSteps: [
          'Deploy trenchless cured-in-place pipe (CIPP) lining across 18.5km of trunk mains.',
          'Install 45 additional transient pressure surge dampening valves.'
        ]
      },
      {
        id: 'rec-wt-2',
        title: 'Expand Permeable Bioswale Aquifer Infiltration Basins',
        category: 'Aquifer Recharge & Groundwater',
        priority: 'High Priority',
        impact: 'Raises underground water table level by an additional 1.8m and buffers drought risk.',
        estCostUSD: '$3.8 Million',
        timeframe: 'Q4 2026 - Q3 2027',
        responsibleAgency: 'Environmental Protection & Hydrogeology Bureau',
        actionSteps: [
          'Construct 6 deep stormwater injection recharge wells fed by filtered bioswales.',
          'Install continuous automated conductivity and heavy metal water quality telemetry.'
        ]
      }
    ]
  },

  energy: {
    id: 'rpt-en-2026',
    typeKey: 'energy',
    typeTitle: 'Energy Report',
    title: 'Metropolis Delta Clean Power Grid, Microgrid Generation & Renewable Transition Audit',
    regionName: 'Metropolis Delta',
    generatedAt: '2026-07-22',
    author: 'Clean Energy & Smart Grid Neural Telemetry Center',
    status: 'Approved & Final',
    complianceBadge: 'IEEE 1547 & NERC CIP Cyber-Energy Standard',
    executiveSummary: 'This Energy Report evaluates municipal power generation mix, rooftop solar PV penetration, wind turbine capacity factors, utility-scale battery energy storage system (BESS) dispatch, and microgrid islanding resilience. Renewable generation accounted for 64.2% of total municipal electricity demand in 2026, offsetting $38.2M in peak wholesale energy purchases.',
    keyMetrics: [
      { label: 'Renewable Power Share', value: '64.2%', change: '+8.5% YOY', isPositive: true, subtext: 'Solar + Wind + BESS' },
      { label: 'Installed Solar PV Capacity', value: '284 MWp', change: '+42 MWp', isPositive: true, subtext: 'Rooftop & Parking Canopies' },
      { label: 'BESS Battery Storage Capacity', value: '140 MWh', change: '+35 MWh', isPositive: true, subtext: 'Peak shaving reserve' },
      { label: 'Grid Peak Load Offset', value: '58.4 MW', change: '-18%', isPositive: true, subtext: 'Reduced fossil spinning reserve' },
      { label: 'Levelized Energy Cost (LCOE)', value: '$0.048 / kWh', change: '-12.5%', isPositive: true, subtext: 'Cheaper than fossil baseload' }
    ],
    chartTitle: '24-Hour Municipal Power Generation Profile & Grid Demand Load Curve',
    chartSubtitle: 'Real-time solar, wind, battery discharge, and grid tie balancing across peak hours',
    chartData: [
      { hour: '00:00', solarMW: 0, windMW: 45, batteryMW: 20, fossilGridMW: 35, totalDemandMW: 100 },
      { hour: '03:00', solarMW: 0, windMW: 48, batteryMW: 15, fossilGridMW: 27, totalDemandMW: 90 },
      { hour: '06:00', solarMW: 25, windMW: 42, batteryMW: 0, fossilGridMW: 48, totalDemandMW: 115 },
      { hour: '09:00', solarMW: 110, windMW: 38, batteryMW: -35, fossilGridMW: 47, totalDemandMW: 160 },
      { hour: '12:00', solarMW: 195, windMW: 32, batteryMW: -60, fossilGridMW: 23, totalDemandMW: 190 },
      { hour: '15:00', solarMW: 160, windMW: 35, batteryMW: -20, fossilGridMW: 30, totalDemandMW: 205 },
      { hour: '18:00', solarMW: 45, windMW: 40, batteryMW: 45, fossilGridMW: 80, totalDemandMW: 210 },
      { hour: '21:00', solarMW: 0, windMW: 46, batteryMW: 35, fossilGridMW: 69, totalDemandMW: 150 }
    ],
    tableTitle: 'Substation Microgrid Nodes & Storage Performance',
    tableHeaders: ['Microgrid Node', 'Solar PV (MW)', 'Wind Power (MW)', 'BESS (MWh)', 'Grid Independence %', 'Node Status'],
    tableRows: [
      { id: 'en-1', sectorName: 'Node A - Northern Tech Campus', metricA: '85 MW', metricB: '12 MW', metricC: '45 MWh', status: 'Optimal (88.4%)', variancePct: '+14.2% Autonomy' },
      { id: 'en-2', sectorName: 'Node B - Downtown Financial Core', metricA: '62 MW', metricB: '0 MW', metricC: '30 MWh', status: 'Optimal (72.1%)', variancePct: '+8.9% Autonomy' },
      { id: 'en-3', sectorName: 'Node C - Coastal Port & Freight Depot', metricA: '45 MW', metricB: '58 MW', metricC: '40 MWh', status: 'Optimal (92.5%)', variancePct: '+18.5% Autonomy' },
      { id: 'en-4', sectorName: 'Node D - East Industrial Sector', metricA: '92 MW', metricB: '18 MW', metricC: '25 MWh', status: 'Synchronized (52.0%)', variancePct: '+4.1% Autonomy' }
    ],
    recommendations: [
      {
        id: 'rec-en-1',
        title: 'Deploy 60MWh Sodium-Ion Battery Storage Buffer at Industrial Node D',
        category: 'Grid Energy Storage',
        priority: 'Immediate Critical',
        impact: 'Raises East Industrial microgrid autonomy from 52% to 82% and prevents voltage dips.',
        estCostUSD: '$11.8 Million',
        timeframe: 'Q3 2026 - Q2 2027',
        responsibleAgency: 'Municipal Power Authority',
        actionSteps: [
          'Procure high-cycle-life Na-Ion energy storage system (ESS) containers.',
          'Integrate virtual power plant (VPP) software for automated frequency response.'
        ]
      },
      {
        id: 'rec-en-2',
        title: 'Mandate Bi-Directional V2G (Vehicle-to-Grid) Inverters at EV Bus Plazas',
        category: 'Smart Mobility Grid Balancing',
        priority: 'High Priority',
        impact: 'Unlocks 24MW of mobile battery storage during 18:00 - 21:00 peak grid evening hours.',
        estCostUSD: '$4.2 Million',
        timeframe: 'Q4 2026 - Q3 2027',
        responsibleAgency: 'Transit Authority & Electric Power Grid Operator',
        actionSteps: [
          'Retrofit 120 municipal electric transit bus charging bays with ISO 15118-20 V2G protocol.',
          'Establish automated peak discharge compensation tariff for transit fleet.'
        ]
      }
    ]
  }
};
