import { RiverCorridorData } from '../types';

// ============================================================================
// 1. KOSHI RIVER CORRIDOR (Sapta Koshi Braided Mega-Floodplain & Embankment Breach)
// ============================================================================
export const KOSHI_RIVER_CORRIDOR: RiverCorridorData = {
  riverName: 'Sapta Koshi (The Moving River of Eastern Nepal & Bihar)',
  catchmentSqKm: 61000,
  corridorWidthKm: 9.4,
  description: 'A dynamic, hyper-sedimented braided river corridor exiting the Himalayan foothills at Chatara gorge and expanding into a multi-threaded alluvial mega-fan. Marked by high avulsion tendencies, shifting sand islands (tappu), and heavy hydrostatic pressure against afflux embankments.',
  
  channels: [
    {
      id: 'koshi-thalweg-main',
      name: 'Primary Koshi Deep Thalweg (Main Flow Channel)',
      type: 'main_thalweg',
      widthM: 480,
      depthM: 3.8,
      waterVelocityMs: 3.6,
      flowDirectionDeg: 215,
      coordinates: [
        [26.7650, 87.1620],
        [26.7420, 87.1480],
        [26.7180, 87.1350],
        [26.6920, 87.1150],
        [26.6650, 87.0980],
        [26.6380, 87.0750],
        [26.6080, 87.0420],
        [26.5790, 87.0120],
        [26.5490, 86.9740],
        [26.5260, 86.9450],
        [26.5180, 86.9320], // Koshi Barrage
        [26.4920, 86.9150],
        [26.4650, 86.8920],
        [26.4350, 86.8680],
      ]
    },
    {
      id: 'koshi-east-braid',
      name: 'Eastern Braided Anabranch (Koshi Tappu Chute)',
      type: 'braided_chute',
      widthM: 220,
      depthM: 2.1,
      waterVelocityMs: 2.4,
      flowDirectionDeg: 198,
      coordinates: [
        [26.7180, 87.1350],
        [26.6850, 87.1380],
        [26.6520, 87.1220],
        [26.6210, 87.0950],
        [26.5920, 87.0650],
        [26.5580, 87.0250],
        [26.5260, 86.9450]
      ]
    },
    {
      id: 'koshi-west-braid',
      name: 'Western Secondary Splay (Saptari Flood Channel)',
      type: 'secondary_anabranch',
      widthM: 180,
      depthM: 1.9,
      waterVelocityMs: 2.1,
      flowDirectionDeg: 210,
      coordinates: [
        [26.6650, 87.0980],
        [26.6400, 87.0480],
        [26.6120, 87.0080],
        [26.5750, 86.9680],
        [26.5380, 86.9320],
        [26.5180, 86.9320]
      ]
    },
    {
      id: 'koshi-breach-avulsion',
      name: 'Paschim Kusaha Breach Avulsion Torrent (Active Flood Escape)',
      type: 'paleochannel_inundation',
      widthM: 340,
      depthM: 2.6,
      waterVelocityMs: 4.1,
      flowDirectionDeg: 145,
      coordinates: [
        [26.5820, 87.0250], // Breach point
        [26.5710, 87.0520],
        [26.5520, 87.0850],
        [26.5280, 87.1120],
        [26.4950, 87.1350],
        [26.4620, 87.1520]
      ]
    }
  ],

  sandbars: [
    {
      id: 'koshi-tappu-central-island',
      name: 'Central Koshi Tappu Alluvial Island (Protected Char)',
      type: 'Alluvial Island (Tappu / Char)',
      areaHectares: 1420,
      isFlooded: true,
      submersionPct: 76,
      coordinates: [
        [26.6950, 87.1050],
        [26.6780, 87.1250],
        [26.6450, 87.1150],
        [26.6150, 87.0850],
        [26.6280, 87.0620],
        [26.6650, 87.0800],
        [26.6950, 87.1050]
      ]
    },
    {
      id: 'koshi-sandbar-prakashpur',
      name: 'Prakashpur Braided Silt Spit & Sand Shoal',
      type: 'Mid-Channel Sandbar',
      areaHectares: 480,
      isFlooded: true,
      submersionPct: 92,
      coordinates: [
        [26.6380, 87.0680],
        [26.6220, 87.0820],
        [26.5980, 87.0550],
        [26.6120, 87.0380],
        [26.6380, 87.0680]
      ]
    },
    {
      id: 'koshi-south-char',
      name: 'Haripur Lower Char Reserve',
      type: 'Alluvial Island (Tappu / Char)',
      areaHectares: 860,
      isFlooded: true,
      submersionPct: 84,
      coordinates: [
        [26.5750, 87.0050],
        [26.5620, 87.0350],
        [26.5350, 87.0120],
        [26.5420, 86.9820],
        [26.5750, 87.0050]
      ]
    }
  ],

  embankments: [
    {
      id: 'koshi-east-embankment',
      name: 'Eastern Afflux Flood Embankment Bund (Sunsari Defense)',
      type: 'Left Afflux Bund',
      status: 'Breached / Washed Away',
      breachWidthM: 1850,
      breachOutflowCusecs: 142000,
      description: 'Major eastern protective levee. Catastrophic breach occurred at Chainage 12.9km (Kusaha sector), allowing massive avulsion surge into eastern settlement corridors.',
      coordinates: [
        [26.7450, 87.1650],
        [26.7050, 87.1550],
        [26.6650, 87.1350],
        [26.6250, 87.1050],
        [26.5920, 87.0550],
        [26.5820, 87.0250], // BREACH POINT
        [26.5650, 87.0050],
        [26.5350, 86.9650],
        [26.5180, 86.9380]
      ]
    },
    {
      id: 'koshi-west-embankment',
      name: 'Western Afflux Flood Embankment Bund (Saptari Defense)',
      type: 'Right Afflux Bund',
      status: 'Severe Seepage / Piping',
      description: 'Heavy hydraulic pressure on western guide dyke. Saturated earthen levee showing boiling sand boils and piping distress near Bhardaha.',
      coordinates: [
        [26.7400, 87.1250],
        [26.6950, 87.0950],
        [26.6500, 87.0550],
        [26.6050, 87.0050],
        [26.5600, 86.9550],
        [26.5250, 86.9180],
        [26.5180, 86.9250]
      ]
    }
  ],

  gaugingStations: [
    {
      id: 'gauge-chatara',
      name: 'Chatara Hydrometric Station (Nepal DHM #695)',
      riverName: 'Sapta Koshi River (Inflow Entry)',
      coordinates: [26.7580, 87.1650],
      currentStageM: 219.8,
      dangerStageM: 218.0,
      warningStageM: 216.5,
      dischargeCusecs: 435000,
      dischargeM3s: 12318,
      trend: 'Rising',
      alertStatus: 'Danger Exceeded',
      flowVelocityMs: 3.8,
      turbidityNtu: 1850,
      lastUpdated: '15 min ago (Live DHM Telemetry)',
      description: 'Primary gorge entry measuring transboundary inflow from Sun Koshi, Arun, and Tamor confluence.'
    },
    {
      id: 'gauge-prakashpur',
      name: 'Prakashpur Afflux Hydrological Node',
      riverName: 'Sapta Koshi Mid-Basin',
      coordinates: [26.6280, 87.0850],
      currentStageM: 88.4,
      dangerStageM: 86.5,
      warningStageM: 85.0,
      dischargeCusecs: 395000,
      dischargeM3s: 11185,
      trend: 'Rising Rapidly',
      alertStatus: 'Danger Exceeded',
      flowVelocityMs: 3.4,
      turbidityNtu: 1620,
      lastUpdated: '10 min ago (Acoustic Doppler)',
      description: 'Critical monitoring point 4km upstream of Kusaha breach zone.'
    },
    {
      id: 'gauge-barrage',
      name: 'Koshi Barrage Control Bridge (Bhimnagar)',
      riverName: 'Sapta Koshi Outlet (52/56 Gates Open)',
      coordinates: [26.5180, 86.9320],
      currentStageM: 74.2,
      dangerStageM: 72.8,
      warningStageM: 71.5,
      dischargeCusecs: 468000,
      dischargeM3s: 13252,
      trend: 'Rising',
      alertStatus: 'Danger Exceeded',
      flowVelocityMs: 4.2,
      turbidityNtu: 2100,
      lastUpdated: '5 min ago (CWC / DHM Joint Telemetry)',
      description: 'Historic international barrage. 52 of 56 flood sluice gates hoisted to maximum emergency clearance.'
    },
    {
      id: 'gauge-bhardaha',
      name: 'Bhardaha West Bund Seepage Gauge',
      riverName: 'Western Flood Corridor',
      coordinates: [26.5680, 86.9620],
      currentStageM: 78.6,
      dangerStageM: 78.0,
      warningStageM: 76.5,
      dischargeCusecs: 78000,
      dischargeM3s: 2208,
      trend: 'Steady',
      alertStatus: 'Warning',
      flowVelocityMs: 2.1,
      turbidityNtu: 980,
      lastUpdated: '25 min ago',
      description: 'Monitors backwater hydraulic pressure against Saptari western agricultural polders.'
    }
  ],

  flowVectors: [
    { id: 'fv-1', coordinates: [26.7350, 87.1450], angleDeg: 210, velocityMs: 3.8, label: '3.8 m/s' },
    { id: 'fv-2', coordinates: [26.6850, 87.1120], angleDeg: 215, velocityMs: 3.5, label: '3.5 m/s' },
    { id: 'fv-3', coordinates: [26.6450, 87.0850], angleDeg: 220, velocityMs: 3.4, label: '3.4 m/s' },
    { id: 'fv-4', coordinates: [26.5820, 87.0320], angleDeg: 145, velocityMs: 4.1, label: '4.1 m/s (Breach Jet)' },
    { id: 'fv-5', coordinates: [26.5450, 86.9680], angleDeg: 225, velocityMs: 3.6, label: '3.6 m/s' },
    { id: 'fv-6', coordinates: [26.5120, 86.9280], angleDeg: 218, velocityMs: 4.2, label: '4.2 m/s (Barrage Chute)' }
  ],

  depthZones: [
    {
      id: 'koshi-deep-corridor',
      name: 'Core Braided Riverbed (> 2.5m Inundation)',
      depthRange: '> 2.5m (Torrential Current)',
      category: 'deep_channel',
      color: '#0c4a6e',
      fillOpacity: 0.65,
      coordinates: [
        [26.7600, 87.1650],
        [26.7150, 87.1420],
        [26.6750, 87.1180],
        [26.6350, 87.0850],
        [26.5950, 87.0500],
        [26.5600, 87.0100],
        [26.5300, 86.9650],
        [26.5150, 86.9300],
        [26.5050, 86.9380],
        [26.5350, 86.9950],
        [26.5750, 87.0420],
        [26.6150, 87.0850],
        [26.6550, 87.1180],
        [26.7000, 87.1550],
        [26.7600, 87.1650]
      ]
    },
    {
      id: 'koshi-submerged-floodplain',
      name: 'Submerged Riverine Terrace & Chars (1.2m - 2.5m)',
      depthRange: '1.2m - 2.5m (Critical WASH Submersion)',
      category: 'submerged_floodplain',
      color: '#0284c7',
      fillOpacity: 0.45,
      coordinates: [
        [26.7200, 87.1650],
        [26.6800, 87.1550],
        [26.6400, 87.1350],
        [26.6000, 87.1100],
        [26.5600, 87.0700],
        [26.5200, 87.0300],
        [26.4900, 86.9800],
        [26.4800, 86.9200],
        [26.5100, 86.8800],
        [26.5500, 86.9200],
        [26.5900, 86.9900],
        [26.6300, 87.0400],
        [26.6700, 87.0700],
        [26.7200, 87.1650]
      ]
    },
    {
      id: 'koshi-waterlogged-alluvium',
      name: 'Waterlogged Agricultural Lowlands & Silt (0.3m - 1.2m)',
      depthRange: '0.3m - 1.2m (Saturated Alluvium)',
      category: 'shallow_waterlogging',
      color: '#06b6d4',
      fillOpacity: 0.28,
      coordinates: [
        [26.7000, 87.1850],
        [26.6500, 87.1700],
        [26.6100, 87.1450],
        [26.5700, 87.1200],
        [26.5300, 87.0900],
        [26.4700, 87.0400],
        [26.4500, 86.9600],
        [26.4600, 86.8400],
        [26.5000, 86.8300],
        [26.5400, 86.8600],
        [26.5900, 86.9200],
        [26.6400, 86.9800],
        [26.6800, 87.0400],
        [26.7000, 87.1850]
      ]
    }
  ],

  // High-Magnification Level of Detail (LOD) Micro-Hydrology Features (Zoom >= 13 & 14)
  microSpurs: [
    {
      id: 'spur-chatara-1',
      name: 'Spur #1 - Chatara Left Revetment Boulder Groyne',
      type: 'boulder_spur',
      coordinates: [[26.7560, 87.1645], [26.7548, 87.1595]],
      lengthM: 140,
      condition: 'Intact Armor',
      scourDepthM: 1.8,
      flowDeflectionDeg: 45
    },
    {
      id: 'spur-prakashpur-4',
      name: 'Spur #4 - Prakashpur Heavy Armored Groyne',
      type: 'impermeable_groyne',
      coordinates: [[26.6710, 87.1370], [26.6690, 87.1290]],
      lengthM: 180,
      condition: 'Intact Armor',
      scourDepthM: 2.4,
      flowDeflectionDeg: 55
    },
    {
      id: 'spur-kusaha-12',
      name: 'Spur #12 - Kusaha Pre-Breach Spur (Severely Scoured)',
      type: 'boulder_spur',
      coordinates: [[26.5920, 87.0545], [26.5895, 87.0460]],
      lengthM: 210,
      condition: 'Nose Scour Observed',
      scourDepthM: 4.8,
      flowDeflectionDeg: 60
    },
    {
      id: 'spur-kusaha-14',
      name: 'Spur #14 - Breach Root Spur (Overtopped & Sunk)',
      type: 'submerged_weir',
      coordinates: [[26.5820, 87.0250], [26.5800, 87.0170]],
      lengthM: 240,
      condition: 'Partially Damaged',
      scourDepthM: 6.2,
      flowDeflectionDeg: 75
    },
    {
      id: 'spur-west-bhardaha',
      name: 'West Bank Deflection Groyne W-6',
      type: 'impermeable_groyne',
      coordinates: [[26.6080, 87.0060], [26.6095, 87.0135]],
      lengthM: 160,
      condition: 'Intact Armor',
      scourDepthM: 2.1,
      flowDeflectionDeg: 40
    },
    {
      id: 'spur-barrage-guide',
      name: 'Bhimnagar Guide Bund Upstream Spur',
      type: 'boulder_spur',
      coordinates: [[26.5360, 86.9660], [26.5335, 86.9580]],
      lengthM: 190,
      condition: 'Intact Armor',
      scourDepthM: 3.1,
      flowDeflectionDeg: 50
    }
  ],

  depthSoundings: [
    {
      id: 'snd-ch-1',
      coordinates: [26.7520, 87.1550],
      depthM: 5.4,
      channelType: 'Thalweg Deep',
      velocityMs: 3.8,
      bottomSediment: 'Gravel Bed'
    },
    {
      id: 'snd-ch-2',
      coordinates: [26.7050, 87.1260],
      depthM: 4.2,
      channelType: 'Thalweg Deep',
      velocityMs: 3.6,
      bottomSediment: 'Coarse Sand'
    },
    {
      id: 'snd-tappu-edge',
      coordinates: [26.6720, 87.1180],
      depthM: 1.9,
      channelType: 'Braided Riffle',
      velocityMs: 2.4,
      bottomSediment: 'Fine Silt'
    },
    {
      id: 'snd-shoal-1',
      coordinates: [26.6450, 87.0780],
      depthM: 0.6,
      channelType: 'Bar Fringing Shoal',
      velocityMs: 1.1,
      bottomSediment: 'Sandy Shoal'
    },
    {
      id: 'snd-kusaha-thalweg',
      coordinates: [26.6020, 87.0360],
      depthM: 4.8,
      channelType: 'Thalweg Deep',
      velocityMs: 3.7,
      bottomSediment: 'Coarse Sand'
    },
    {
      id: 'snd-breach-throat',
      coordinates: [26.5810, 87.0280],
      depthM: 6.8,
      channelType: 'Thalweg Deep',
      velocityMs: 4.3,
      bottomSediment: 'Coarse Sand'
    },
    {
      id: 'snd-avulsion-splay',
      coordinates: [26.5620, 87.0650],
      depthM: 2.8,
      channelType: 'Floodplain Inundation',
      velocityMs: 3.2,
      bottomSediment: 'Fine Silt'
    },
    {
      id: 'snd-barrage-pool',
      coordinates: [26.5220, 86.9380],
      depthM: 5.9,
      channelType: 'Thalweg Deep',
      velocityMs: 4.1,
      bottomSediment: 'Coarse Sand'
    }
  ],

  hydraulicStructures: [
    {
      id: 'struct-chatara-intake',
      name: 'Chatara Main Canal Irrigation Intake Sluice',
      type: 'sluice_gate',
      coordinates: [26.7540, 87.1630],
      status: 'Operational',
      capacityDescription: '15,000 cfs capacity; silt exclusion vanes operating at 100%'
    },
    {
      id: 'struct-prakashpur-ghat',
      name: 'Prakashpur Emergency Relief Boat Ghat',
      type: 'emergency_boat_ghat',
      coordinates: [26.6620, 87.1280],
      status: 'Active Evacuation Point',
      capacityDescription: 'SDRF / Nepal Army motorized Zodiac craft launching ramp; 12 rescue boats stationed'
    },
    {
      id: 'struct-kusaha-sluice',
      name: 'Kusaha Cross-Drainage Culvert KM 11+800',
      type: 'drainage_culvert',
      coordinates: [26.5950, 87.0580],
      status: 'Submerged / Backwater',
      capacityDescription: 'Twin 2.5m box culverts; high river stage forcing reverse backwater into farmland'
    },
    {
      id: 'struct-barrage-sluices',
      name: 'Koshi Barrage Main Radial Sluice System',
      type: 'barrage_pier',
      coordinates: [26.5180, 86.9320],
      status: 'Operational',
      capacityDescription: '56 radial flood gates; 52 raised to 14ft clearance, passing 468,000 cfs'
    },
    {
      id: 'struct-bhardaha-ghat',
      name: 'Bhardaha West Bund Relief Ghat',
      type: 'emergency_boat_ghat',
      coordinates: [26.5640, 86.9580],
      status: 'Active Evacuation Point',
      capacityDescription: 'Country wooden boat & inflatable craft staging dock for western stranded bastis'
    }
  ],

  turbulenceVortices: [
    {
      id: 'vortex-breach',
      name: 'Breach Throat Scour Jet & Hydraulic Undertow',
      coordinates: [26.5820, 87.0270],
      type: 'breach_scour_jet',
      velocityMs: 4.4,
      diameterM: 85,
      dangerLevel: 'EXTREME'
    },
    {
      id: 'vortex-spur-12',
      name: 'Spur 12 Nose Eddy Vortex',
      coordinates: [26.5890, 87.0440],
      type: 'eddy_vortex',
      velocityMs: 3.2,
      diameterM: 45,
      dangerLevel: 'HIGH'
    },
    {
      id: 'vortex-barrage-chute',
      name: 'Barrage Undershot Stilling Basin Turbulence',
      coordinates: [26.5160, 86.9300],
      type: 'channel_confluence_shear',
      velocityMs: 4.8,
      diameterM: 120,
      dangerLevel: 'EXTREME'
    }
  ],

  // Precision Bathymetric Depth Isobaths (Nautical Depth Contours)
  isobaths: [
    {
      id: 'koshi-iso-0.8m',
      name: '0.8m Shallow Shoal Margin Isobath',
      depthM: 0.8,
      contourType: 'shoal_margin',
      coordinates: [
        [26.7580, 87.1680],
        [26.7250, 87.1500],
        [26.6900, 87.1280],
        [26.6550, 87.1050],
        [26.6200, 87.0750],
        [26.5850, 87.0400],
        [26.5500, 87.0000],
        [26.5200, 86.9550],
        [26.4850, 86.9250]
      ]
    },
    {
      id: 'koshi-iso-1.5m',
      name: '1.5m Intermediate Navigable Contour',
      depthM: 1.5,
      contourType: 'intermediate',
      coordinates: [
        [26.7620, 87.1650],
        [26.7320, 87.1450],
        [26.7020, 87.1220],
        [26.6680, 87.0980],
        [26.6320, 87.0680],
        [26.5980, 87.0320],
        [26.5620, 86.9900],
        [26.5250, 86.9450],
        [26.4750, 86.9050]
      ]
    },
    {
      id: 'koshi-iso-2.5m',
      name: '2.5m Deep Channel Contour',
      depthM: 2.5,
      contourType: 'deep_navigable',
      coordinates: [
        [26.7650, 87.1620],
        [26.7380, 87.1420],
        [26.7100, 87.1180],
        [26.6750, 87.0900],
        [26.6400, 87.0580],
        [26.6020, 87.0220],
        [26.5680, 86.9800],
        [26.5280, 86.9380],
        [26.4650, 86.8920]
      ]
    },
    {
      id: 'koshi-iso-3.5m',
      name: '3.5m Heavy Hydrostatic Scour Contour',
      depthM: 3.5,
      contourType: 'deep_navigable',
      coordinates: [
        [26.7550, 87.1580],
        [26.7180, 87.1350],
        [26.6800, 87.1080],
        [26.6450, 87.0720],
        [26.6100, 87.0350],
        [26.5750, 86.9950],
        [26.5320, 86.9420],
        [26.4950, 86.9120]
      ]
    },
    {
      id: 'koshi-iso-5.0m',
      name: '5.0m Deep Thalweg Core Axis',
      depthM: 5.0,
      contourType: 'thalweg_trench',
      isDynamicScour: true,
      coordinates: [
        [26.7500, 87.1540],
        [26.7120, 87.1300],
        [26.6700, 87.0980],
        [26.6350, 87.0620],
        [26.5950, 87.0250],
        [26.5550, 86.9750],
        [26.5200, 86.9340]
      ]
    }
  ],

  // Cutbank Scour & Erosion Vulnerability Hotspots (Where riverbanks actively fail)
  cutbankErosionZones: [
    {
      id: 'cutbank-kusaha-breach',
      name: 'Kusaha Afflux Meander Cutbank (Breach Site Scour)',
      coordinates: [
        [26.5920, 87.0320],
        [26.5860, 87.0380],
        [26.5810, 87.0420],
        [26.5750, 87.0480]
      ],
      scourSeverity: 'CRITICAL',
      bankRetreatRateMPerYear: 58,
      bankHeightM: 4.8,
      vulnerableAsset: 'East Afflux Embankment Ch 12.1km & Kusaha Settlements',
      soilComposition: 'Fine alluvial silt & cohesionless micaceous sand'
    },
    {
      id: 'cutbank-prakashpur-bend',
      name: 'Prakashpur Outer Meander Scour Flank',
      coordinates: [
        [26.6680, 87.1180],
        [26.6580, 87.1080],
        [26.6450, 87.0920]
      ],
      scourSeverity: 'HIGH',
      bankRetreatRateMPerYear: 32,
      bankHeightM: 3.6,
      vulnerableAsset: 'Prakashpur Riverside School & Rural Access Bund',
      soilComposition: 'Stratified sandy loam with riprap talus failure'
    },
    {
      id: 'cutbank-bhardaha-west',
      name: 'Bhardaha West Concave Impingement Scour',
      coordinates: [
        [26.5720, 86.9750],
        [26.5620, 86.9680],
        [26.5520, 86.9580]
      ],
      scourSeverity: 'HIGH',
      bankRetreatRateMPerYear: 26,
      bankHeightM: 3.2,
      vulnerableAsset: 'Western Flood Bund Ch 8+400 & Saptari Farmlands',
      soilComposition: 'Unconsolidated flood silts over sandy aquifer'
    }
  ],

  // Riparian Oxbow Wetlands & Floodplain Buffers ("Beels / Chaurs")
  oxbowWetlands: [
    {
      id: 'wetland-tappu-beel',
      name: 'Koshi Tappu Ramsar Wetland Lagoon (Beel #1)',
      coordinates: [
        [26.6850, 87.1420],
        [26.6780, 87.1550],
        [26.6620, 87.1620],
        [26.6480, 87.1520],
        [26.6420, 87.1380],
        [26.6560, 87.1320],
        [26.6750, 87.1350]
      ],
      surfaceAreaHa: 420,
      depthM: 2.2,
      retentionCapacityMillionM3: 9.2,
      bufferingStatus: 'Active Flood Retention',
      vegetationDensity: 'Dense Typha Elephantina & Saccharum Marsh'
    },
    {
      id: 'wetland-madhuvan-chaur',
      name: 'Madhuvan Floodplain Retention Depression',
      coordinates: [
        [26.6200, 87.1120],
        [26.6120, 87.1280],
        [26.5980, 87.1350],
        [26.5860, 87.1220],
        [26.5920, 87.1050],
        [26.6080, 87.1020]
      ],
      surfaceAreaHa: 310,
      depthM: 1.8,
      retentionCapacityMillionM3: 5.6,
      bufferingStatus: 'Critical Storage',
      vegetationDensity: 'Riparian Sedge & Submerged Macrophytes'
    },
    {
      id: 'wetland-kusaha-paleochannel',
      name: 'Kusaha Paleochannel Wetland Depression',
      coordinates: [
        [26.5650, 87.0850],
        [26.5520, 87.1020],
        [26.5350, 87.1180],
        [26.5200, 87.1120],
        [26.5320, 87.0920],
        [26.5480, 87.0780]
      ],
      surfaceAreaHa: 580,
      depthM: 2.8,
      retentionCapacityMillionM3: 16.2,
      bufferingStatus: 'Natural Spillway',
      vegetationDensity: 'Saturated Alluvial Reed Marsh'
    }
  ],

  // Hydrographic Cross-Section Transects (Riverbed Elevation Survey Profiles)
  crossTransects: [
    {
      id: 'xs-chatara',
      name: 'Transect XS-1: Chatara Gorge Outlet',
      code: 'XS-101',
      coordinates: [[26.7620, 87.1420], [26.7580, 87.1850]],
      chainageKm: 2.4,
      riverWidthM: 1250,
      maxDepthM: 7.2,
      thalwegElevationM: 104.2,
      elevationPoints: [
        { distanceM: 0, elevationM: 118.5, depthM: 0, label: 'Right Bank Levee' },
        { distanceM: 280, elevationM: 109.8, depthM: 2.4, label: 'West Bar Edge' },
        { distanceM: 620, elevationM: 104.2, depthM: 7.2, label: 'Deep Thalweg Trench' },
        { distanceM: 950, elevationM: 108.5, depthM: 3.1, label: 'Mid-Channel Shoal' },
        { distanceM: 1250, elevationM: 117.2, depthM: 0, label: 'Left Bank Foothill' }
      ]
    },
    {
      id: 'xs-prakashpur',
      name: 'Transect XS-2: Prakashpur Mid-Reach Braiding',
      code: 'XS-105',
      coordinates: [[26.6550, 87.0650], [26.6450, 87.1550]],
      chainageKm: 18.6,
      riverWidthM: 4200,
      maxDepthM: 5.6,
      thalwegElevationM: 88.4,
      elevationPoints: [
        { distanceM: 0, elevationM: 96.2, depthM: 0, label: 'West Afflux Bund' },
        { distanceM: 800, elevationM: 91.5, depthM: 2.5, label: 'West Anabranch' },
        { distanceM: 1900, elevationM: 94.8, depthM: 0.2, label: 'Tappu Sand Island' },
        { distanceM: 2800, elevationM: 88.4, depthM: 5.6, label: 'Main Thalweg' },
        { distanceM: 4200, elevationM: 97.5, depthM: 0, label: 'East Embankment' }
      ]
    },
    {
      id: 'xs-kusaha',
      name: 'Transect XS-3: Kusaha Breach Axis',
      code: 'XS-109',
      coordinates: [[26.5950, 86.9850], [26.5750, 87.0750]],
      chainageKm: 32.2,
      riverWidthM: 3800,
      maxDepthM: 6.8,
      thalwegElevationM: 81.2,
      elevationPoints: [
        { distanceM: 0, elevationM: 89.5, depthM: 0, label: 'West Flood Bund' },
        { distanceM: 1100, elevationM: 84.6, depthM: 3.4, label: 'Riverbed Chute' },
        { distanceM: 2100, elevationM: 81.2, depthM: 6.8, label: 'Thalweg Scour Hole' },
        { distanceM: 3100, elevationM: 79.5, depthM: 8.5, label: 'Breach Crater' },
        { distanceM: 3800, elevationM: 87.8, depthM: 0, label: 'Breached Crest' }
      ]
    },
    {
      id: 'xs-barrage',
      name: 'Transect XS-4: Bhimnagar Barrage Forebay',
      code: 'XS-114',
      coordinates: [[26.5250, 86.9150], [26.5150, 86.9550]],
      chainageKm: 44.8,
      riverWidthM: 1150,
      maxDepthM: 6.1,
      thalwegElevationM: 72.8,
      elevationPoints: [
        { distanceM: 0, elevationM: 82.5, depthM: 0, label: 'West Guide Bund' },
        { distanceM: 250, elevationM: 74.5, depthM: 4.4, label: 'West Undersluice' },
        { distanceM: 600, elevationM: 72.8, depthM: 6.1, label: 'Central Spillway' },
        { distanceM: 920, elevationM: 73.9, depthM: 5.0, label: 'East Undersluice' },
        { distanceM: 1150, elevationM: 82.8, depthM: 0, label: 'East Guide Bund' }
      ]
    }
  ],

  // Secondary & Tertiary Drainage Feeders (Creeks, Nullahs, Inflow Canals)
  tributaryFeeders: [
    {
      id: 'trib-triyuga',
      name: 'Triyuga River Confluence',
      type: 'confluent_river',
      coordinates: [
        [26.7820, 87.0250],
        [26.7550, 87.0650],
        [26.7250, 87.1050],
        [26.7180, 87.1350]
      ],
      inflowCusecs: 42000,
      widthM: 140,
      confluenceLocation: 'Right Bank near Prakashpur Apex',
      sedimentLoad: 'High Glacial/Silt'
    },
    {
      id: 'trib-chatara-canal',
      name: 'Chatara Left Bank Irrigation Main Escape',
      type: 'irrigation_escape',
      coordinates: [
        [26.7540, 87.1630],
        [26.7350, 87.1850],
        [26.7050, 87.1950],
        [26.6800, 87.1900]
      ],
      inflowCusecs: 14500,
      widthM: 65,
      confluenceLocation: 'Left Bank Eastern Agricultural Zone',
      sedimentLoad: 'Low Suspended'
    },
    {
      id: 'trib-bhawa-khola',
      name: 'Bhawa Khola Foothill Torrent',
      type: 'mountain_torrent',
      coordinates: [
        [26.7950, 87.1950],
        [26.7720, 87.1820],
        [26.7560, 87.1660]
      ],
      inflowCusecs: 18500,
      widthM: 80,
      confluenceLocation: 'Chatara Left Bank Upstream Gorge',
      sedimentLoad: 'Moderate Bedload'
    },
    {
      id: 'trib-saptari-drainage',
      name: 'Bhardaha Agrarian Seepage Nullah',
      type: 'alluvial_drainage',
      coordinates: [
        [26.6350, 86.9450],
        [26.6120, 86.9720],
        [26.5850, 86.9850],
        [26.5680, 86.9620]
      ],
      inflowCusecs: 8200,
      widthM: 45,
      confluenceLocation: 'West Flood Bund Splay Junction',
      sedimentLoad: 'Moderate Bedload'
    }
  ],

  // Detailed Barrage Gate Infrastructure
  barrageDetails: {
    barrageName: 'Koshi Barrage (Bhimnagar)',
    totalGates: 56,
    gatesOpen: 52,
    pondLevelM: 74.2,
    tailwaterLevelM: 69.4,
    affluxHeadM: 4.8,
    coordinates: [26.5180, 86.9320],
    gateStatuses: [
      { gateRange: 'Gates 1 - 10 (West Undersluice)', status: 'Open (Discharging)', dischargeShare: 18 },
      { gateRange: 'Gates 11 - 28 (Spillway Section A)', status: 'Open (Discharging)', dischargeShare: 32 },
      { gateRange: 'Gates 29 - 38 (Central Silt Vanes)', status: 'Partial Hoist', dischargeShare: 14 },
      { gateRange: 'Gates 39 - 52 (Spillway Section B)', status: 'Open (Discharging)', dischargeShare: 28 },
      { gateRange: 'Gates 53 - 56 (East Undersluice)', status: 'Silted Sill', dischargeShare: 8 }
    ]
  }
};

// ============================================================================
// 2. BRAHMAPUTRA RIVER CORRIDOR (Assam, India - Mega Braided Floodplain)
// ============================================================================
export const BRAHMAPUTRA_RIVER_CORRIDOR: RiverCorridorData = {
  riverName: 'Brahmaputra River (Morigaon / Kaziranga Reach)',
  catchmentSqKm: 580000,
  corridorWidthKm: 14.2,
  description: 'One of the worlds largest braided sandbar systems with extreme monsoon discharges exceeding 2 million cusecs, carrying immense silt loads and constantly creating and eroding island chars.',
  channels: [
    {
      id: 'brahma-main',
      name: 'Primary Brahmaputra Deep Stream',
      type: 'main_thalweg',
      widthM: 850,
      depthM: 5.2,
      waterVelocityMs: 3.4,
      flowDirectionDeg: 250,
      coordinates: [
        [26.5300, 92.5200],
        [26.5050, 92.4750],
        [26.4820, 92.4300],
        [26.4600, 92.3850],
        [26.4350, 92.3400],
        [26.4100, 92.2900],
      ]
    },
    {
      id: 'brahma-south-braid',
      name: 'Lahorighat Char Bypass Anabranch',
      type: 'braided_chute',
      widthM: 380,
      depthM: 3.1,
      waterVelocityMs: 2.8,
      flowDirectionDeg: 245,
      coordinates: [
        [26.5050, 92.4750],
        [26.4750, 92.4450],
        [26.4450, 92.4050],
        [26.4150, 92.3550],
        [26.4100, 92.2900]
      ]
    }
  ],
  sandbars: [
    {
      id: 'brahma-lahorighat-char',
      name: 'Lahorighat Inundated Mega-Char',
      type: 'Alluvial Island (Tappu / Char)',
      areaHectares: 3200,
      isFlooded: true,
      submersionPct: 88,
      coordinates: [
        [26.4950, 92.4500],
        [26.4750, 92.4650],
        [26.4450, 92.4200],
        [26.4600, 92.3900],
        [26.4950, 92.4500]
      ]
    }
  ],
  embankments: [
    {
      id: 'brahma-pachatia-bund',
      name: 'Pachatia Brahmaputra Flood Dyke',
      type: 'Left Afflux Bund',
      status: 'Breached / Washed Away',
      breachWidthM: 650,
      breachOutflowCusecs: 85000,
      description: 'Breached in two sections at Chainage 11+400 under high flood pressure.',
      coordinates: [
        [26.4850, 92.4700],
        [26.4550, 92.4300],
        [26.4250, 92.3900],
        [26.3950, 92.3400]
      ]
    }
  ],
  gaugingStations: [
    {
      id: 'gauge-tezpur',
      name: 'Tezpur / Silghat Hydrological Station',
      riverName: 'Brahmaputra River',
      coordinates: [26.5200, 92.4900],
      currentStageM: 66.8,
      dangerStageM: 65.2,
      warningStageM: 64.0,
      dischargeCusecs: 1420000,
      dischargeM3s: 40209,
      trend: 'Rising',
      alertStatus: 'Danger Exceeded',
      flowVelocityMs: 3.4,
      turbidityNtu: 2400,
      lastUpdated: '20 min ago (CWC India)',
      description: 'Critical central Assam flood gauge. Water flowing 1.6m above High Flood Level (HFL).'
    }
  ],
  flowVectors: [
    { id: 'fv-asm-1', coordinates: [26.4950, 92.4550], angleDeg: 248, velocityMs: 3.4, label: '3.4 m/s' },
    { id: 'fv-asm-2', coordinates: [26.4550, 92.3950], angleDeg: 242, velocityMs: 3.1, label: '3.1 m/s' }
  ],
  depthZones: [
    {
      id: 'brahma-deep',
      name: 'Main Brahmaputra Channel (> 3.5m)',
      depthRange: '> 3.5m',
      category: 'deep_channel',
      color: '#0c4a6e',
      fillOpacity: 0.6,
      coordinates: [
        [26.5400, 92.5300],
        [26.4900, 92.4400],
        [26.4400, 92.3500],
        [26.4000, 92.2800],
        [26.4200, 92.2700],
        [26.4600, 92.3400],
        [26.5100, 92.4300],
        [26.5500, 92.5100],
        [26.5400, 92.5300]
      ]
    },
    {
      id: 'brahma-floodplain',
      name: 'Inundated Char & Riparian Zone (1.5m - 3.5m)',
      depthRange: '1.5m - 3.5m',
      category: 'submerged_floodplain',
      color: '#0284c7',
      fillOpacity: 0.4,
      coordinates: [
        [26.5500, 92.5400],
        [26.4700, 92.4600],
        [26.4100, 92.3700],
        [26.3700, 92.2900],
        [26.4300, 92.2600],
        [26.4800, 92.3200],
        [26.5300, 92.4100],
        [26.5700, 92.5100],
        [26.5500, 92.5400]
      ]
    },
    {
      id: 'brahma-sheet',
      name: 'Agricultural Overbank Waterlogging (0.4m - 1.5m)',
      depthRange: '0.4m - 1.5m',
      category: 'shallow_waterlogging',
      color: '#06b6d4',
      fillOpacity: 0.25,
      coordinates: [
        [26.5600, 92.5600],
        [26.4500, 92.4800],
        [26.3900, 92.3900],
        [26.3500, 92.3000],
        [26.4400, 92.2400],
        [26.5000, 92.3000],
        [26.5500, 92.3900],
        [26.5900, 92.5200],
        [26.5600, 92.5600]
      ]
    }
  ]
};

// ============================================================================
// 3. INDUS RIVER CORRIDOR (Sindh, Pakistan)
// ============================================================================
export const INDUS_RIVER_CORRIDOR: RiverCorridorData = {
  riverName: 'Indus River (Sukkur & Dadu Lake Corridor)',
  catchmentSqKm: 1165000,
  corridorWidthKm: 16.5,
  description: 'Monolithic riverine canal system in Sindh. Widespread breaches along the Right Bank Outfall Drain (RBOD) and Indus levees caused basin-wide backwater lake formation.',
  channels: [
    {
      id: 'indus-main',
      name: 'Indus River Primary Channel',
      type: 'main_thalweg',
      widthM: 750,
      depthM: 4.8,
      waterVelocityMs: 2.6,
      flowDirectionDeg: 195,
      coordinates: [
        [27.8500, 68.9500],
        [27.7000, 68.8600],
        [27.5500, 68.7500],
        [27.3500, 68.5800],
        [27.1500, 68.4200],
        [26.9500, 68.2500]
      ]
    }
  ],
  sandbars: [],
  embankments: [
    {
      id: 'indus-sukkur-bund',
      name: 'Tori Bund / RBOD Protective Embankment',
      type: 'Left Afflux Bund',
      status: 'Breached / Washed Away',
      breachWidthM: 1400,
      breachOutflowCusecs: 110000,
      description: 'Breached levee created a 100km long stagnant inland sea inundating agricultural talukas.',
      coordinates: [
        [27.7500, 68.8000],
        [27.5000, 68.6800],
        [27.2500, 68.4800],
        [27.0000, 68.3200]
      ]
    }
  ],
  gaugingStations: [
    {
      id: 'gauge-sukkur',
      name: 'Sukkur Barrage Discharge Control',
      riverName: 'Indus River',
      coordinates: [27.7000, 68.8500],
      currentStageM: 52.4,
      dangerStageM: 50.8,
      warningStageM: 49.5,
      dischargeCusecs: 780000,
      dischargeM3s: 22087,
      trend: 'Steady',
      alertStatus: 'Danger Exceeded',
      flowVelocityMs: 2.6,
      turbidityNtu: 2800,
      lastUpdated: '30 min ago (PMD Telemetry)',
      description: 'Exceptional super-flood discharge passing through 66 barrage gates.'
    }
  ],
  flowVectors: [
    { id: 'fv-ind-1', coordinates: [27.6500, 68.8200], angleDeg: 198, velocityMs: 2.6, label: '2.6 m/s' }
  ],
  depthZones: [
    {
      id: 'indus-lake',
      name: 'Stagnant Submerged Basin (> 2.0m)',
      depthRange: '> 2.0m',
      category: 'submerged_floodplain',
      color: '#0369a1',
      fillOpacity: 0.5,
      coordinates: [
        [27.8000, 68.9000],
        [27.6000, 68.7000],
        [27.3000, 68.5000],
        [27.0000, 68.3000],
        [27.1000, 68.1000],
        [27.4000, 68.3000],
        [27.7000, 68.6000],
        [27.8000, 68.9000]
      ]
    }
  ]
};

// ============================================================================
// HELPER: Get River Corridor for any Disaster Zone (with procedural fallback)
// ============================================================================
export function getRiverCorridorForZone(zoneId: string, centerLat: number, centerLng: number): RiverCorridorData {
  if (zoneId === 'koshi') return KOSHI_RIVER_CORRIDOR;
  if (zoneId === 'assam') return BRAHMAPUTRA_RIVER_CORRIDOR;
  if (zoneId === 'indus') return INDUS_RIVER_CORRIDOR;

  // Procedural realistic river corridor generator for any custom or preset global zone
  const dLat = 0.08;
  const dLng = 0.07;
  
  return {
    riverName: `${zoneId.toUpperCase()} Drainage River System`,
    catchmentSqKm: 18400,
    corridorWidthKm: 6.8,
    description: `Active hydrological flood corridor and river network for ${zoneId.toUpperCase()}. Simulated hydrodynamic flow with deep thalweg, braided secondary channels, and river gauging telemetry.`,
    channels: [
      {
        id: `${zoneId}-thalweg-procedural`,
        name: `${zoneId.toUpperCase()} Primary Deep Channel (Thalweg)`,
        type: 'main_thalweg',
        widthM: 320,
        depthM: 3.2,
        waterVelocityMs: 2.8,
        flowDirectionDeg: 205,
        coordinates: [
          [centerLat + dLat * 1.5, centerLng + dLng * 1.4],
          [centerLat + dLat * 0.9, centerLng + dLng * 0.8],
          [centerLat + dLat * 0.3, centerLng + dLng * 0.2],
          [centerLat - dLat * 0.3, centerLng - dLng * 0.3],
          [centerLat - dLat * 0.9, centerLng - dLng * 0.7],
          [centerLat - dLat * 1.5, centerLng - dLng * 1.2],
        ]
      },
      {
        id: `${zoneId}-braid-procedural`,
        name: `${zoneId.toUpperCase()} Braided Overflow Splay`,
        type: 'braided_chute',
        widthM: 160,
        depthM: 1.8,
        waterVelocityMs: 2.1,
        flowDirectionDeg: 190,
        coordinates: [
          [centerLat + dLat * 0.9, centerLng + dLng * 0.8],
          [centerLat + dLat * 0.4, centerLng + dLng * 0.5],
          [centerLat - dLat * 0.1, centerLng - dLng * 0.1],
          [centerLat - dLat * 0.7, centerLng - dLng * 0.5],
          [centerLat - dLat * 1.5, centerLng - dLng * 1.2]
        ]
      }
    ],
    sandbars: [
      {
        id: `${zoneId}-sandbar-1`,
        name: `${zoneId.toUpperCase()} Central Sandbar Char`,
        type: 'Alluvial Island (Tappu / Char)',
        areaHectares: 640,
        isFlooded: true,
        submersionPct: 75,
        coordinates: [
          [centerLat + dLat * 0.5, centerLng + dLng * 0.4],
          [centerLat + dLat * 0.2, centerLng + dLng * 0.3],
          [centerLat - dLat * 0.2, centerLng - dLng * 0.1],
          [centerLat + dLat * 0.1, centerLng + dLng * 0.1],
          [centerLat + dLat * 0.5, centerLng + dLng * 0.4]
        ]
      }
    ],
    embankments: [
      {
        id: `${zoneId}-embankment-1`,
        name: `${zoneId.toUpperCase()} Flood Control Bund`,
        type: 'Left Afflux Bund',
        status: 'Breached / Washed Away',
        breachWidthM: 750,
        breachOutflowCusecs: 45000,
        description: `Earthen levee overtopped and breached during peak flood wave discharge.`,
        coordinates: [
          [centerLat + dLat * 1.4, centerLng + dLng * 1.6],
          [centerLat + dLat * 0.7, centerLng + dLng * 1.0],
          [centerLat + dLat * 0.0, centerLng + dLng * 0.4],
          [centerLat - dLat * 0.8, centerLng - dLng * 0.2],
          [centerLat - dLat * 1.4, centerLng - dLng * 0.8]
        ]
      }
    ],
    gaugingStations: [
      {
        id: `${zoneId}-gauge-1`,
        name: `${zoneId.toUpperCase()} Central Hydrometric Node`,
        riverName: `${zoneId.toUpperCase()} River`,
        coordinates: [centerLat + dLat * 0.3, centerLng + dLng * 0.2],
        currentStageM: 42.6,
        dangerStageM: 40.0,
        warningStageM: 38.5,
        dischargeCusecs: 285000,
        dischargeM3s: 8070,
        trend: 'Rising Rapidly',
        alertStatus: 'Danger Exceeded',
        flowVelocityMs: 3.2,
        turbidityNtu: 1450,
        lastUpdated: '12 min ago (Automated River Telemetry)',
        description: `Monitors upstream hydrodynamic discharge and flood wave arrival times.`
      }
    ],
    flowVectors: [
      { id: `${zoneId}-fv-1`, coordinates: [centerLat + dLat * 0.8, centerLng + dLng * 0.7], angleDeg: 205, velocityMs: 3.0, label: '3.0 m/s' },
      { id: `${zoneId}-fv-2`, coordinates: [centerLat - dLat * 0.4, centerLng - dLng * 0.4], angleDeg: 210, velocityMs: 2.7, label: '2.7 m/s' }
    ],
    depthZones: [
      {
        id: `${zoneId}-depth-deep`,
        name: `Deep River Corridor (> 2.0m)`,
        depthRange: `> 2.0m`,
        category: 'deep_channel',
        color: '#0c4a6e',
        fillOpacity: 0.6,
        coordinates: [
          [centerLat + dLat * 1.5, centerLng + dLng * 1.5],
          [centerLat + dLat * 0.7, centerLng + dLng * 0.8],
          [centerLat - dLat * 0.1, centerLng - dLng * 0.1],
          [centerLat - dLat * 0.9, centerLng - dLng * 0.8],
          [centerLat - dLat * 1.4, centerLng - dLng * 1.3],
          [centerLat - dLat * 1.2, centerLng - dLng * 1.5],
          [centerLat - dLat * 0.6, centerLng - dLng * 0.9],
          [centerLat + dLat * 0.1, centerLng + dLng * 0.0],
          [centerLat + dLat * 0.8, centerLng + dLng * 0.6],
          [centerLat + dLat * 1.6, centerLng + dLng * 1.3],
          [centerLat + dLat * 1.5, centerLng + dLng * 1.5]
        ]
      },
      {
        id: `${zoneId}-depth-mid`,
        name: `Submerged Floodplain (1.0m - 2.0m)`,
        depthRange: `1.0m - 2.0m`,
        category: 'submerged_floodplain',
        color: '#0284c7',
        fillOpacity: 0.4,
        coordinates: [
          [centerLat + dLat * 1.7, centerLng + dLng * 1.7],
          [centerLat + dLat * 0.8, centerLng + dLng * 1.0],
          [centerLat - dLat * 0.2, centerLng - dLng * 0.0],
          [centerLat - dLat * 1.1, centerLng - dLng * 0.7],
          [centerLat - dLat * 1.7, centerLng - dLng * 1.2],
          [centerLat - dLat * 1.5, centerLng - dLng * 1.7],
          [centerLat - dLat * 0.8, centerLng - dLng * 1.1],
          [centerLat - dLat * 0.0, centerLng - dLng * 0.2],
          [centerLat + dLat * 0.7, centerLng + dLng * 0.4],
          [centerLat + dLat * 1.8, centerLng + dLng * 1.1],
          [centerLat + dLat * 1.7, centerLng + dLng * 1.7]
        ]
      }
    ],
    microSpurs: [
      {
        id: `${zoneId}-spur-1`,
        name: `Upstream Deflection Spur #1`,
        type: 'boulder_spur',
        coordinates: [
          [centerLat + dLat * 0.75, centerLng + dLng * 0.95],
          [centerLat + dLat * 0.72, centerLng + dLng * 0.85]
        ],
        lengthM: 150,
        condition: 'Intact Armor',
        scourDepthM: 2.1,
        flowDeflectionDeg: 45
      },
      {
        id: `${zoneId}-spur-2`,
        name: `Mid-Corridor Heavy Groyne #2`,
        type: 'impermeable_groyne',
        coordinates: [
          [centerLat - dLat * 0.20, centerLng - dLng * 0.15],
          [centerLat - dLat * 0.18, centerLng - dLng * 0.25]
        ],
        lengthM: 185,
        condition: 'Nose Scour Observed',
        scourDepthM: 3.4,
        flowDeflectionDeg: 55
      }
    ],
    depthSoundings: [
      {
        id: `${zoneId}-snd-1`,
        coordinates: [centerLat + dLat * 1.1, centerLng + dLng * 1.0],
        depthM: 4.6,
        channelType: 'Thalweg Deep',
        velocityMs: 3.1,
        bottomSediment: 'Coarse Sand'
      },
      {
        id: `${zoneId}-snd-2`,
        coordinates: [centerLat + dLat * 0.3, centerLng + dLng * 0.25],
        depthM: 3.8,
        channelType: 'Thalweg Deep',
        velocityMs: 2.9,
        bottomSediment: 'Fine Silt'
      },
      {
        id: `${zoneId}-snd-3`,
        coordinates: [centerLat - dLat * 0.35, centerLng - dLng * 0.30],
        depthM: 1.6,
        channelType: 'Braided Riffle',
        velocityMs: 2.2,
        bottomSediment: 'Sandy Shoal'
      },
      {
        id: `${zoneId}-snd-4`,
        coordinates: [centerLat - dLat * 0.85, centerLng - dLng * 0.75],
        depthM: 0.7,
        channelType: 'Bar Fringing Shoal',
        velocityMs: 1.2,
        bottomSediment: 'Sandy Shoal'
      }
    ],
    hydraulicStructures: [
      {
        id: `${zoneId}-struct-ghat`,
        name: `${zoneId.toUpperCase()} Emergency Flood Relief Boat Ghat`,
        type: 'emergency_boat_ghat',
        coordinates: [centerLat + dLat * 0.45, centerLng + dLng * 0.35],
        status: 'Active Evacuation Point',
        capacityDescription: 'Dedicated staging ramp for disaster response motorized zodiacs and relief boats'
      },
      {
        id: `${zoneId}-struct-sluice`,
        name: `${zoneId.toUpperCase()} Flood Drainage Sluice Gate`,
        type: 'sluice_gate',
        coordinates: [centerLat - dLat * 0.30, centerLng - dLng * 0.22],
        status: 'Operational',
        capacityDescription: 'Cross-embankment flap valve drainage regulator'
      }
    ],
    turbulenceVortices: [
      {
        id: `${zoneId}-vortex-1`,
        name: `Channel Bifurcation Shear Vortex`,
        coordinates: [centerLat + dLat * 0.35, centerLng + dLng * 0.22],
        type: 'channel_confluence_shear',
        velocityMs: 3.4,
        diameterM: 60,
        dangerLevel: 'HIGH'
      }
    ],
    isobaths: [
      {
        id: `${zoneId}-iso-1`,
        name: '1.0m Navigable Shoal Margin Contour',
        depthM: 1.0,
        contourType: 'intermediate',
        coordinates: [
          [centerLat + dLat * 1.3, centerLng + dLng * 1.25],
          [centerLat + dLat * 0.8, centerLng + dLng * 0.75],
          [centerLat + dLat * 0.2, centerLng + dLng * 0.15],
          [centerLat - dLat * 0.4, centerLng - dLng * 0.35],
          [centerLat - dLat * 1.0, centerLng - dLng * 0.95]
        ]
      },
      {
        id: `${zoneId}-iso-2`,
        name: '3.0m Deep Thalweg Channel Contour',
        depthM: 3.0,
        contourType: 'thalweg_trench',
        isDynamicScour: true,
        coordinates: [
          [centerLat + dLat * 1.25, centerLng + dLng * 1.20],
          [centerLat + dLat * 0.75, centerLng + dLng * 0.70],
          [centerLat + dLat * 0.15, centerLng + dLng * 0.10],
          [centerLat - dLat * 0.45, centerLng - dLng * 0.40],
          [centerLat - dLat * 1.05, centerLng - dLng * 1.00]
        ]
      }
    ],
    cutbankErosionZones: [
      {
        id: `${zoneId}-cutbank-1`,
        name: `${zoneId.toUpperCase()} Outer Flank Bank Scour Hotspot`,
        coordinates: [
          [centerLat + dLat * 0.45, centerLng + dLng * 0.38],
          [centerLat + dLat * 0.35, centerLng + dLng * 0.28],
          [centerLat + dLat * 0.25, centerLng + dLng * 0.18]
        ],
        scourSeverity: 'CRITICAL',
        bankRetreatRateMPerYear: 38,
        bankHeightM: 4.2,
        vulnerableAsset: 'Riparian Lowland Settlement Bund & Agricultural Terraces',
        soilComposition: 'Fine silt and alluvial sand strata'
      }
    ],
    oxbowWetlands: [
      {
        id: `${zoneId}-wetland-1`,
        name: `${zoneId.toUpperCase()} Floodplain Retention Oxbow Basin`,
        coordinates: [
          [centerLat + dLat * 0.25, centerLng - dLng * 0.35],
          [centerLat + dLat * 0.15, centerLng - dLng * 0.25],
          [centerLat + dLat * 0.05, centerLng - dLng * 0.30],
          [centerLat + dLat * 0.10, centerLng - dLng * 0.45],
          [centerLat + dLat * 0.22, centerLng - dLng * 0.42]
        ],
        surfaceAreaHa: 280,
        depthM: 1.9,
        retentionCapacityMillionM3: 4.8,
        bufferingStatus: 'Active Flood Retention',
        vegetationDensity: 'Emergent Marsh Wetland Reed Beds'
      }
    ],
    crossTransects: [
      {
        id: `${zoneId}-xs-1`,
        name: `${zoneId.toUpperCase()} Corridor Hydrographic Transect XS-1`,
        code: 'XS-A',
        coordinates: [
          [centerLat + dLat * 0.3, centerLng - dLng * 0.4],
          [centerLat + dLat * 0.1, centerLng + dLng * 0.6]
        ],
        chainageKm: 12.4,
        riverWidthM: 2600,
        maxDepthM: 5.2,
        thalwegElevationM: 42.0,
        elevationPoints: [
          { distanceM: 0, elevationM: 50.0, depthM: 0, label: 'Left Bank Crest' },
          { distanceM: 650, elevationM: 44.5, depthM: 2.7, label: 'Braided Chute' },
          { distanceM: 1400, elevationM: 42.0, depthM: 5.2, label: 'Deep Thalweg Trench' },
          { distanceM: 2600, elevationM: 51.2, depthM: 0, label: 'Right Bank Levee' }
        ]
      }
    ],
    tributaryFeeders: [
      {
        id: `${zoneId}-trib-1`,
        name: `${zoneId.toUpperCase()} Upstream Feeder Torrent`,
        type: 'mountain_torrent',
        coordinates: [
          [centerLat + dLat * 1.5, centerLng + dLng * 0.5],
          [centerLat + dLat * 1.1, centerLng + dLng * 0.8],
          [centerLat + dLat * 0.8, centerLng + dLng * 0.75]
        ],
        inflowCusecs: 16500,
        widthM: 75,
        confluenceLocation: 'Upper Corridor Confluence Apex',
        sedimentLoad: 'Moderate Bedload'
      }
    ]
  };
}
