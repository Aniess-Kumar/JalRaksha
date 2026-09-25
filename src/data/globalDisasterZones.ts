import { GlobalDisasterZone, Community, WaterSource, SanitationFacility, HealthFacility, RoadSegment, CommunityReport } from '../types';
import { 
  INITIAL_COMMUNITIES, 
  MOCK_WATER_SOURCES, 
  MOCK_SANITATION_FACILITIES, 
  MOCK_HEALTH_FACILITIES, 
  MOCK_ROADS, 
  MOCK_FLOOD_POLYGONS, 
  INITIAL_COMMUNITY_REPORTS 
} from './mockData';
import { 
  KOSHI_RIVER_CORRIDOR, 
  BRAHMAPUTRA_RIVER_CORRIDOR, 
  INDUS_RIVER_CORRIDOR, 
  getRiverCorridorForZone 
} from './riverCorridors';

// 1. Koshi River Basin, Nepal / India (Transboundary Riverine & Embankment Breach)
export const KOSHI_DISASTER_ZONE: GlobalDisasterZone = {
  id: 'koshi',
  name: 'Koshi River Basin (Sunsari & Saptari)',
  country: 'Nepal / India',
  continent: 'Asia',
  flag: '🇳🇵',
  floodType: 'Transboundary Monsoon Riverine & Embankment Breach',
  center: [26.585, 87.03],
  zoom: 11,
  bounds: [[26.42, 86.75], [26.75, 87.22]],
  disasterDate: 'Active Monsoon Monitoring',
  situationSummary: 'Heavy monsoon precipitation and tributary surges across the Koshi River catchment have resulted in widespread inundation across Sunsari and Saptari districts. High hydrostatic pressure along the western embankment and braided sandbar submergence cut off drinking water access and isolated key health posts.',
  sensorSpecs: 'Copernicus Sentinel-1 SAR (10m) + NASA GPM IMERG + GLO-30 HAND',
  inundatedAreaSqKm: 184,
  totalPopulation: 34850,
  communities: INITIAL_COMMUNITIES,
  waterSources: MOCK_WATER_SOURCES,
  sanitationFacilities: MOCK_SANITATION_FACILITIES,
  healthFacilities: MOCK_HEALTH_FACILITIES,
  roads: MOCK_ROADS,
  floodPolygons: MOCK_FLOOD_POLYGONS,
  reports: INITIAL_COMMUNITY_REPORTS,
  riverCorridor: KOSHI_RIVER_CORRIDOR,
};

// 2. Brahmaputra Valley, Assam, India (Braided Floodplain & Island Char Inundation)
const ASSAM_COMMUNITIES: Community[] = [
  {
    id: 'assam-1',
    name: 'Lahorighat Char',
    code: 'ASM-MOR-01',
    ward: 'Block 2',
    ruralMunicipality: 'Lahorighat Revenue Circle',
    district: 'Morigaon',
    coordinates: [26.4750, 92.4280],
    population: 4120,
    exposedPopulation: 3800,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 2.1,
    inundatedAreaPct: 88,
    mainWaterSource: 'Tara Handpumps & River Island Tube Wells',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Bhuragaon Highland Overhead Tank',
    alternativeWaterDistanceStraightKm: 4.8,
    alternativeWaterDistanceAccessibleKm: 14.2,
    alternativeWaterReason: 'Direct boat ghat submerged under 2.5m flood rush; ferry service suspended by SDRF due to turbulent river currents',
    sanitationAffected: true,
    sanitationStatus: '92% of elevated latrine platforms washed away or inundated with river silt',
    healthFacilityName: 'Lahorighat Model Hospital',
    healthFacilityAccessibility: 'SEVERELY DISRUPTED',
    healthDistanceStraightKm: 5.2,
    healthDistanceAccessibleKm: 16.5,
    healthAccessObstacle: 'Pachatia embankment breached in two locations; high-clearance SDRF motorized boats only',
    roadAccessibility: 'INACCESSIBLE',
    roadObstacle: 'PWD Embankment Road washed away at Chainage 11+400',
    confidenceIndicator: 0.96,
    priorityScore: 94,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Critical island char flood depth (>2.0m river inundation)',
      'Submersion of all potable Tara hand pumps',
      'High incidence of suspected enteric waterborne transmission',
      'Severe 14.2 km water access gap across river breach'
    ],
    recommendedInterventions: [
      'Airdrop of halogen water purification tablets and 10L collapsible jerrycans',
      'Deployment of Indian Army / SDRF floating mobile filtration plant',
      'Emergency medical evacuation of severely dehydrated children to Morigaon Civil Hospital'
    ]
  },
  {
    id: 'assam-2',
    name: 'Bhuragaon Riverside',
    code: 'ASM-MOR-04',
    ward: 'Ward 3',
    ruralMunicipality: 'Bhuragaon Circle',
    district: 'Morigaon',
    coordinates: [26.4250, 92.3850],
    population: 3600,
    exposedPopulation: 2950,
    floodExposure: 'HIGH',
    floodDepthMeters: 1.6,
    inundatedAreaPct: 69,
    mainWaterSource: 'Jal Jeevan Mission (JJM) Piped Water Scheme',
    mainWaterStatus: 'Contaminated',
    alternativeWaterSource: 'Morigaon Town Booster Pumping Station',
    alternativeWaterDistanceStraightKm: 6.5,
    alternativeWaterDistanceAccessibleKm: 15.8,
    alternativeWaterReason: 'State Highway 3 flooded at Kopili bridge approach; only heavy tractors can navigate',
    sanitationAffected: true,
    sanitationStatus: 'Septic tanks flooded; biological effluent backflow detected in village ponds',
    healthFacilityName: 'Bhuragaon Primary Health Centre',
    healthFacilityAccessibility: 'LIMITED',
    healthDistanceStraightKm: 3.1,
    healthDistanceAccessibleKm: 8.4,
    healthAccessObstacle: 'Waterlogged courtyard, medical store relocated to first floor',
    roadAccessibility: 'LIMITED',
    roadObstacle: 'Kopili backwater overflowing 0.75m over tarmac',
    confidenceIndicator: 0.93,
    priorityScore: 86,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'JJM piped water intake station electrical pump flooded',
      'Widespread pit latrine overflow into community drinking ponds',
      'Access detour ratio exceeding 2.4x'
    ],
    recommendedInterventions: [
      'Emergency diesel dewatering pump for JJM intake well',
      'Distribution of chlorine bleaching powder bags for well disinfection',
      'Erection of mobile raised emergency pit latrines at relief camp'
    ]
  },
  {
    id: 'assam-3',
    name: 'Dhing Chariali',
    code: 'ASM-NAG-02',
    ward: 'Ward 5',
    ruralMunicipality: 'Dhing Revenue Circle',
    district: 'Nagaon',
    coordinates: [26.4680, 92.6100],
    population: 5200,
    exposedPopulation: 3400,
    floodExposure: 'HIGH',
    floodDepthMeters: 1.25,
    inundatedAreaPct: 58,
    mainWaterSource: 'Public Ring Wells & Deep Borewells',
    mainWaterStatus: 'Potentially Disrupted',
    alternativeWaterSource: 'Dhing Railway Colony Deep Borewell',
    alternativeWaterDistanceStraightKm: 2.4,
    alternativeWaterDistanceAccessibleKm: 5.6,
    alternativeWaterReason: 'Main market road flooded 0.5m; non-motorized transport blocked',
    sanitationAffected: false,
    sanitationStatus: 'Elevated school toilets operational with limited supply',
    healthFacilityName: 'Dhing First Referral Unit (FRU)',
    healthFacilityAccessibility: 'ACCESSIBLE',
    healthDistanceStraightKm: 1.8,
    healthDistanceAccessibleKm: 2.7,
    healthAccessObstacle: 'Paved access passable with minor waterlogging on shoulder',
    roadAccessibility: 'LIMITED',
    roadObstacle: 'Water overflowing culvert at Station Road',
    confidenceIndicator: 0.91,
    priorityScore: 71,
    priorityCategory: 'HIGH',
    keyReasons: [
      'High exposed population (3,400 residents)',
      'Groundwater turbidity surge in public ring wells',
      'Partial road obstruction slowing water tanker distribution'
    ],
    recommendedInterventions: [
      'Supply of bottled drinking water crates to Dhing relief shelter',
      'Water quality testing for coliform and iron contamination',
      'Sandbag reinforcement of Dhing-Nagaon feeder road'
    ]
  },
  {
    id: 'assam-4',
    name: 'Kaliabor Bagicha',
    code: 'ASM-NAG-08',
    ward: 'Tea Garden Line 4',
    ruralMunicipality: 'Kaliabor Sub-Division',
    district: 'Nagaon',
    coordinates: [26.5820, 93.0150],
    population: 2800,
    exposedPopulation: 1950,
    floodExposure: 'MODERATE',
    floodDepthMeters: 0.85,
    inundatedAreaPct: 42,
    mainWaterSource: 'Tea Estate Gravity Spring System',
    mainWaterStatus: 'Potentially Disrupted',
    alternativeWaterSource: 'Jakhalabandha Army Camp Piped Supply',
    alternativeWaterDistanceStraightKm: 3.5,
    alternativeWaterDistanceAccessibleKm: 7.9,
    alternativeWaterReason: 'Bridge approach scour on NH-715 bypass',
    sanitationAffected: true,
    sanitationStatus: 'Workers settlement community latrines submerged',
    healthFacilityName: 'Jakhalabandha Civil Hospital',
    healthFacilityAccessibility: 'ACCESSIBLE',
    healthDistanceStraightKm: 4.2,
    healthDistanceAccessibleKm: 6.8,
    healthAccessObstacle: 'NH-715 traffic restricted to one lane due to wildlife corridor speed limits',
    roadAccessibility: 'ACCESSIBLE',
    roadObstacle: 'Slow traffic crawl near Kaziranga buffer zone',
    confidenceIndicator: 0.88,
    priorityScore: 62,
    priorityCategory: 'HIGH',
    keyReasons: [
      'Tea estate community sanitation compromise',
      'Muddy turbidity in spring catchment line',
      'Need to monitor diarrhea cases among plantation workers'
    ],
    recommendedInterventions: [
      'Mobile water purification unit dispatched to tea estate factory grounds',
      'Distribution of oral rehydration salts (ORS) sachets to worker lines'
    ]
  },
  {
    id: 'assam-5',
    name: 'Silghat Riverfront',
    code: 'ASM-NAG-11',
    ward: 'Ghat Ward',
    ruralMunicipality: 'Kaliabor Circle',
    district: 'Nagaon',
    coordinates: [26.6180, 92.9340],
    population: 2100,
    exposedPopulation: 1750,
    floodExposure: 'HIGH',
    floodDepthMeters: 1.7,
    inundatedAreaPct: 74,
    mainWaterSource: 'Silghat Municipal River Intake & Sand Filters',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Silghat Jute Mill Elevated Tank',
    alternativeWaterDistanceStraightKm: 1.8,
    alternativeWaterDistanceAccessibleKm: 6.2,
    alternativeWaterReason: 'River bank road submerged under 1.2m current',
    sanitationAffected: true,
    sanitationStatus: 'Port latrines and public toilets flooded',
    healthFacilityName: 'Silghat State Dispensary',
    healthFacilityAccessibility: 'LIMITED',
    healthDistanceStraightKm: 1.5,
    healthDistanceAccessibleKm: 4.8,
    healthAccessObstacle: 'Ghat approach submerged; foot-patrol and dinghy access only',
    roadAccessibility: 'SEVERELY DISRUPTED',
    roadObstacle: 'Brahmaputra bank erosion cutting 150m of riverfront asphalt',
    confidenceIndicator: 0.95,
    priorityScore: 84,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Direct Brahmaputra bank surge overtopping intake structure',
      'Bank erosion threatening secondary water line',
      'Significant detour gap for emergency water bowsers'
    ],
    recommendedInterventions: [
      'Geo-bag bank protection at intake pumphouse',
      'Deployment of 2 x 2,000L collapsible water tanks at Jute Mill ground'
    ]
  },
  {
    id: 'assam-6',
    name: 'Samaguri Bilpar',
    code: 'ASM-NAG-15',
    ward: 'Wetland Margin',
    ruralMunicipality: 'Samaguri Circle',
    district: 'Nagaon',
    coordinates: [26.4350, 92.8450],
    population: 3100,
    exposedPopulation: 1400,
    floodExposure: 'MODERATE',
    floodDepthMeters: 0.7,
    inundatedAreaPct: 35,
    mainWaterSource: 'Deep Tube Well Cluster with Overhead Res',
    mainWaterStatus: 'Functional',
    alternativeWaterSource: 'Samaguri College Campus Borewell',
    alternativeWaterDistanceStraightKm: 2.0,
    alternativeWaterDistanceAccessibleKm: 3.2,
    alternativeWaterReason: 'Minor water ponding on village feeder',
    sanitationAffected: false,
    sanitationStatus: 'Domestic soak pits functional; wetland boundary monitored',
    healthFacilityName: 'Samaguri Community Health Centre',
    healthFacilityAccessibility: 'ACCESSIBLE',
    healthDistanceStraightKm: 2.8,
    healthDistanceAccessibleKm: 3.6,
    healthAccessObstacle: 'Clear paved road',
    roadAccessibility: 'ACCESSIBLE',
    roadObstacle: 'Potholes from heavy rain but passable',
    confidenceIndicator: 0.92,
    priorityScore: 44,
    priorityCategory: 'MODERATE',
    keyReasons: [
      'Overhead reservoir functional and unflooded',
      'Road connections intact',
      'Can serve as safe forward logistics base for western Nagaon relief'
    ],
    recommendedInterventions: [
      'Maintain water chlorination stocks',
      'Establish clean water distribution point for surrounding char displaced'
    ]
  }
];

const ASSAM_WATER_SOURCES: WaterSource[] = [
  {
    id: 'aws-1',
    name: 'Lahorighat High School Raised Deep Borewell',
    type: 'Deep Tube Well Overhead Tank',
    coordinates: [26.4760, 92.4290],
    status: 'Operational',
    communityNear: 'Lahorighat Char',
    householdsServed: 650,
    lastTestedTurbidityNtu: 2.8,
    eColiRisk: 'Low'
  },
  {
    id: 'aws-2',
    name: 'Bhuragaon Market Tara Handpump Cluster',
    type: 'Hand Pump / Shallow Tube Well',
    coordinates: [26.4260, 92.3860],
    status: 'Submerged',
    communityNear: 'Bhuragaon Riverside',
    householdsServed: 420,
    lastTestedTurbidityNtu: 68.0,
    eColiRisk: 'High'
  },
  {
    id: 'aws-3',
    name: 'Silghat Municipal River Intake Scheme',
    type: 'Piped Intake Scheme',
    coordinates: [26.6190, 92.9350],
    status: 'Damaged',
    communityNear: 'Silghat Riverfront',
    householdsServed: 880,
    lastTestedTurbidityNtu: 110.0,
    eColiRisk: 'High'
  },
  {
    id: 'aws-4',
    name: 'Dhing Railway Colony Deep Well',
    type: 'Deep Tube Well Overhead Tank',
    coordinates: [26.4690, 92.6120],
    status: 'Operational',
    communityNear: 'Dhing Chariali',
    householdsServed: 950,
    lastTestedTurbidityNtu: 1.9,
    eColiRisk: 'Low'
  }
];

const ASSAM_SANITATION: SanitationFacility[] = [
  {
    id: 'asan-1',
    name: 'Lahorighat Relief Camp Elevated Latrines',
    type: 'Community Latrine Block',
    coordinates: [26.4740, 92.4270],
    status: 'Flooded / Pit Overflow',
    communityNear: 'Lahorighat Char',
    pitsSubmerged: true
  },
  {
    id: 'asan-2',
    name: 'Dhing FRU Hospital Sanitation Block',
    type: 'Health Post WASH Block',
    coordinates: [26.4670, 92.6090],
    status: 'Operational',
    communityNear: 'Dhing Chariali',
    pitsSubmerged: false
  },
  {
    id: 'asan-3',
    name: 'Silghat Steamer Ghat Public Toilets',
    type: 'Public Market Facility',
    coordinates: [26.6170, 92.9330],
    status: 'Waterlogged',
    communityNear: 'Silghat Riverfront',
    pitsSubmerged: true
  }
];

const ASSAM_HEALTH: HealthFacility[] = [
  {
    id: 'ahf-1',
    name: 'Morigaon District Civil Hospital',
    type: 'District Hospital',
    coordinates: [26.2550, 92.3420],
    bedCapacity: 150,
    status: 'Fully Operational',
    accessibilityStatus: 'ACCESSIBLE',
    ambulanceAccessible: true,
    orsCholeraKitsStock: 'Adequate'
  },
  {
    id: 'ahf-2',
    name: 'Dhing First Referral Unit (FRU)',
    type: 'Primary Health Center (PHC)',
    coordinates: [26.4675, 92.6110],
    bedCapacity: 30,
    status: 'Fully Operational',
    accessibilityStatus: 'ACCESSIBLE',
    ambulanceAccessible: true,
    orsCholeraKitsStock: 'Adequate'
  },
  {
    id: 'ahf-3',
    name: 'Lahorighat Model Hospital',
    type: 'Primary Health Center (PHC)',
    coordinates: [26.4735, 92.4265],
    bedCapacity: 20,
    status: 'Partial Capacity - Ground Inundation',
    accessibilityStatus: 'LIMITED',
    ambulanceAccessible: false,
    orsCholeraKitsStock: 'Critical Shortage'
  }
];

const ASSAM_ROADS: RoadSegment[] = [
  {
    id: 'ar-1',
    name: 'Morigaon-Bhuragaon PWD Embankment Road',
    type: 'Embankment Road',
    coordinates: [
      [26.3500, 92.3600],
      [26.4000, 92.3750],
      [26.4250, 92.3850],
      [26.4500, 92.4100],
      [26.4750, 92.4280]
    ],
    status: 'Severely Disrupted / Washed Out',
    disruptionCause: 'Breached at Km 11 by Brahmaputra flood wave',
    detourDistanceKm: 14.2
  },
  {
    id: 'ar-2',
    name: 'National Highway 715 (Kaliabor Bypass)',
    type: 'Primary Highway',
    coordinates: [
      [26.5500, 92.9500],
      [26.5700, 92.9900],
      [26.5820, 93.0150],
      [26.6000, 93.0500]
    ],
    status: 'Flooded / High Clearance Only',
    disruptionCause: '0.4m water logging at culvert Km 62; speed restricted to 20 km/h for animal crossings',
    detourDistanceKm: 4.5
  },
  {
    id: 'ar-3',
    name: 'Dhing-Nagaon Feeder Road',
    type: 'Feeder Road',
    coordinates: [
      [26.4680, 92.6100],
      [26.4200, 92.6400],
      [26.3800, 92.6800],
      [26.3500, 92.6900]
    ],
    status: 'Open / Passable'
  }
];

const ASSAM_FLOOD_POLYGONS: [number, number][][] = [
  // Morigaon - Lahorighat braided inundation zone
  [
    [26.5500, 92.3500],
    [26.5300, 92.4800],
    [26.4900, 92.5200],
    [26.4400, 92.4600],
    [26.4000, 92.3800],
    [26.4200, 92.3200],
    [26.4800, 92.3100],
    [26.5500, 92.3500]
  ],
  // Kaliabor - Silghat riverfront inundation
  [
    [26.6400, 92.8800],
    [26.6500, 93.0200],
    [26.6100, 93.0600],
    [26.5700, 93.0200],
    [26.5800, 92.9200],
    [26.6200, 92.8700],
    [26.6400, 92.8800]
  ]
];

const ASSAM_REPORTS: CommunityReport[] = [
  {
    id: 'arep-1',
    reporterName: 'Pranjal Saikia (ASDMA Field Volunteer)',
    isAnonymous: false,
    communityId: 'assam-1',
    locationName: 'Lahorighat Char School Shelter',
    coordinates: [26.4755, 92.4285],
    reportType: 'Water source damaged',
    description: 'All 8 community Tara hand pumps in Lahorighat Char are submerged in brown silt water. 400 displaced families in the school shelter are drinking boiled river water. Cases of diarrhea in infants reported.',
    photoThumbnail: '🚰 Submerged Char Handpump',
    photoCategory: 'Drinking Water Inundation',
    severity: 'CRITICAL',
    timestamp: '2026-09-19 10:15 IST',
    status: 'Verified / Ground Confirmed',
    extractedInfo: {
      infrastructureImpacted: 'Island Hand Pump Cluster',
      damageCondition: 'Plinths under 1.8m muddy floodwater',
      washThreatVectors: ['Pathogenic ingestion', 'Rapid dysentery transmission'],
      confidenceScore: 0.98,
      recommendedEmergencyAction: 'Immediate airdrop of water purification drops and chlorine sachets'
    }
  },
  {
    id: 'arep-2',
    reporterName: 'Anowar Hussain (Boatman / Relief Volunteer)',
    isAnonymous: false,
    communityId: 'assam-1',
    locationName: 'Lahorighat Ghat Embankment Breach',
    coordinates: [26.4690, 92.4180],
    reportType: 'Road blocked',
    description: 'Embankment road breached for 40 meters. Current is too swift for manual country boats. Only twin-engine NDRF rescue rafts can cross.',
    photoThumbnail: '🌊 Breached PWD Embankment',
    photoCategory: 'Road & Embankment Severance',
    severity: 'CRITICAL',
    timestamp: '2026-09-19 08:50 IST',
    status: 'Verified / Ground Confirmed',
    extractedInfo: {
      infrastructureImpacted: 'PWD Embankment Road Link',
      damageCondition: '40m gap with 2.2m raging current',
      washThreatVectors: ['Logistics cut for water bowsers'],
      confidenceScore: 0.97,
      recommendedEmergencyAction: 'Deploy NDRF motorized rescue boats for water barrel transport'
    }
  }
];

export const ASSAM_DISASTER_ZONE: GlobalDisasterZone = {
  id: 'assam',
  name: 'Brahmaputra Valley (Morigaon & Nagaon)',
  country: 'India',
  continent: 'Asia',
  flag: '🇮🇳',
  floodType: 'Braided Monsoon Riverine & Island Char Inundation',
  center: [26.52, 92.65],
  zoom: 10,
  bounds: [[26.25, 92.25], [26.70, 93.15]],
  disasterDate: 'Active Monsoon Deluge',
  situationSummary: 'Severe surges along the Brahmaputra River and its southern tributaries (Kopili and Kolong) have inundated extensive riverine char islands and embankment villages across Morigaon and Nagaon districts, directly aligned with the official IWMI Multi-Source EO catalogue inventory.',
  sensorSpecs: 'ISRO Bhoonidhi (EOS-04/Cartosat-3) + Sentinel-1 SAR + IMD Radar',
  inundatedAreaSqKm: 312,
  totalPopulation: 42500,
  communities: ASSAM_COMMUNITIES,
  waterSources: ASSAM_WATER_SOURCES,
  sanitationFacilities: ASSAM_SANITATION,
  healthFacilities: ASSAM_HEALTH,
  roads: ASSAM_ROADS,
  floodPolygons: ASSAM_FLOOD_POLYGONS,
  reports: ASSAM_REPORTS,
  riverCorridor: BRAHMAPUTRA_RIVER_CORRIDOR,
};

// 3. Indus River Basin, Sindh, Pakistan (Glacial & Extreme Monsoon Flat-Plain Deluge)
const INDUS_COMMUNITIES: Community[] = [
  {
    id: 'indus-1',
    name: 'Johi Rural Cluster',
    code: 'PAK-DAD-01',
    ward: 'Union Council Johi',
    ruralMunicipality: 'Johi Tehsil',
    district: 'Dadu',
    coordinates: [26.6910, 67.6150],
    population: 6800,
    exposedPopulation: 6100,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 2.3,
    inundatedAreaPct: 91,
    mainWaterSource: 'Solar Reverse Osmosis (RO) Plant & Tube Wells',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Dadu Cantonment Water Bowsers',
    alternativeWaterDistanceStraightKm: 18.0,
    alternativeWaterDistanceAccessibleKm: 46.5,
    alternativeWaterReason: 'Indus Highway (N-55) severed by flood channel; detour through northern ring bund requires 46km transit',
    sanitationAffected: true,
    sanitationStatus: 'Total pit latrine collapse; standing sewage water surrounding ring dyke',
    healthFacilityName: 'Johi Taluka Hospital',
    healthFacilityAccessibility: 'SEVERELY DISRUPTED',
    healthDistanceStraightKm: 2.5,
    healthDistanceAccessibleKm: 11.2,
    healthAccessObstacle: 'Hospital ground floor under 1.2m stagnant water; rooftop emergency dispensary only',
    roadAccessibility: 'INACCESSIBLE',
    roadObstacle: 'Johi-Dadu road submerged under 1.8m water',
    confidenceIndicator: 0.97,
    priorityScore: 96,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Solar RO plant electronics completely submerged in brackish water',
      'Ring bund under continuous seepage pressure',
      'Over 6,000 residents trapped in islanded urban dyke',
      'High cholera and skin infection transmission rates'
    ],
    recommendedInterventions: [
      'Helicopter drop of mobile solar water desalinator / Ultrafiltration bags',
      'Airdrop of chlorine tablets, zinc, and IV fluid ringer lactate',
      'Heavy-duty diesel drainage pumps to protect town ring bund'
    ]
  },
  {
    id: 'indus-2',
    name: 'Khairpur Nathan Shah',
    code: 'PAK-DAD-05',
    ward: 'Ward 2',
    ruralMunicipality: 'K.N. Shah Tehsil',
    district: 'Dadu',
    coordinates: [27.0920, 67.7340],
    population: 9500,
    exposedPopulation: 8200,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 2.8,
    inundatedAreaPct: 95,
    mainWaterSource: 'Municipal Piped Scheme from Canal',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Mehar Elevated Water Tank',
    alternativeWaterDistanceStraightKm: 12.4,
    alternativeWaterDistanceAccessibleKm: 34.0,
    alternativeWaterReason: 'Main canal breach submerged N-55 highway for 16 continuous kilometers',
    sanitationAffected: true,
    sanitationStatus: 'Open defecation on highway margins; severe sanitary crisis',
    healthFacilityName: 'K.N. Shah Civil Dispensary',
    healthFacilityAccessibility: 'INACCESSIBLE',
    healthDistanceStraightKm: 1.2,
    healthDistanceAccessibleKm: 18.5,
    healthAccessObstacle: 'Completely drowned; medical staff relocated to Mehar camp',
    roadAccessibility: 'INACCESSIBLE',
    roadObstacle: 'Highway flooded up to 2m depth with strong undertow',
    confidenceIndicator: 0.98,
    priorityScore: 98,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Unprecedented flood inundation depth (>2.5m)',
      'Total town evacuation with thousands stranded on elevated railway tracks',
      'Saline groundwater renders shallow tube wells undrinkable without RO filtration'
    ],
    recommendedInterventions: [
      'Deployment of Pakistan Navy motorized rescue boats with potable water bowsers',
      'Immediate establishment of floating WASH station at railway embankment'
    ]
  },
  {
    id: 'indus-3',
    name: 'Sehwan Sharif Margin',
    code: 'PAK-JAM-03',
    ward: 'Lalbagh',
    ruralMunicipality: 'Sehwan Tehsil',
    district: 'Jamshoro',
    coordinates: [26.4250, 67.8650],
    population: 7200,
    exposedPopulation: 4100,
    floodExposure: 'HIGH',
    floodDepthMeters: 1.1,
    inundatedAreaPct: 54,
    mainWaterSource: 'Manchar Lake Treatment Scheme & Tube Wells',
    mainWaterStatus: 'Contaminated',
    alternativeWaterSource: 'Kotri Industrial Area Water Bowser Fleet',
    alternativeWaterDistanceStraightKm: 22.0,
    alternativeWaterDistanceAccessibleKm: 38.0,
    alternativeWaterReason: 'Indus Highway south open but jammed with relief convoys',
    sanitationAffected: true,
    sanitationStatus: 'Shrine pilgrimage sanitation facilities waterlogged',
    healthFacilityName: 'Syed Abdullah Shah Institute of Medical Sciences',
    healthFacilityAccessibility: 'ACCESSIBLE',
    healthDistanceStraightKm: 1.5,
    healthDistanceAccessibleKm: 2.2,
    healthAccessObstacle: 'Passable with ambulances',
    roadAccessibility: 'LIMITED',
    roadObstacle: 'Water near culverts, heavy traffic gridlock',
    confidenceIndicator: 0.92,
    priorityScore: 78,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Manchar lake breach water approaching outer drainage canal',
      'Severe population influx from drowned K.N. Shah and Johi',
      'Heavy pressure on existing municipal piped supply'
    ],
    recommendedInterventions: [
      'Installation of 10,000L emergency bladder tanks at displaced person camps',
      'Continuous chlorination monitoring of Sehwan municipal supply'
    ]
  }
];

export const INDUS_DISASTER_ZONE: GlobalDisasterZone = {
  id: 'indus',
  name: 'Indus River Basin (Sindh & Manchar Plain)',
  country: 'Pakistan',
  continent: 'Asia',
  flag: '🇵🇰',
  floodType: 'Severe Glacial Melt & Extreme Monsoon Flat-Plain Deluge',
  center: [26.75, 67.75],
  zoom: 10,
  bounds: [[26.30, 67.40], [27.25, 68.10]],
  disasterDate: 'Severe Floodplain Inundation',
  situationSummary: 'Catastrophic overbanking of the Indus River and overflow of Lake Manchar submerging hundreds of square kilometers across Dadu and Jamshoro districts. In flat alluvial terrain, floodwaters persist for weeks, submerging solar reverse osmosis plants and cutting off major national transit arteries.',
  sensorSpecs: 'Sentinel-1 SAR + VIIRS Flood Inundation + GloFAS Hydrography',
  inundatedAreaSqKm: 890,
  totalPopulation: 78000,
  communities: INDUS_COMMUNITIES,
  waterSources: [
    {
      id: 'iws-1',
      name: 'Johi Town Solar RO Water Station',
      type: 'Piped Intake Scheme',
      coordinates: [26.6920, 67.6160],
      status: 'Submerged',
      communityNear: 'Johi Rural Cluster',
      householdsServed: 1200,
      eColiRisk: 'High'
    },
    {
      id: 'iws-2',
      name: 'Sehwan City Water Filtration Facility',
      type: 'Deep Tube Well Overhead Tank',
      coordinates: [26.4260, 67.8660],
      status: 'Operational',
      communityNear: 'Sehwan Sharif Margin',
      householdsServed: 2400,
      eColiRisk: 'Low'
    }
  ],
  sanitationFacilities: [
    {
      id: 'isan-1',
      name: 'Johi Relief Shelter Latrine Cluster',
      type: 'Community Latrine Block',
      coordinates: [26.6900, 67.6140],
      status: 'Flooded / Pit Overflow',
      communityNear: 'Johi Rural Cluster',
      pitsSubmerged: true
    }
  ],
  healthFacilities: [
    {
      id: 'ihf-1',
      name: 'Syed Abdullah Shah Medical Institute (Sehwan)',
      type: 'District Hospital',
      coordinates: [26.4270, 67.8670],
      bedCapacity: 200,
      status: 'Fully Operational',
      accessibilityStatus: 'ACCESSIBLE',
      ambulanceAccessible: true,
      orsCholeraKitsStock: 'Adequate'
    },
    {
      id: 'ihf-2',
      name: 'Johi Taluka Headquarters Hospital',
      type: 'Primary Health Center (PHC)',
      coordinates: [26.6915, 67.6155],
      bedCapacity: 40,
      status: 'Partial Capacity - Ground Inundation',
      accessibilityStatus: 'SEVERELY DISRUPTED',
      ambulanceAccessible: false,
      orsCholeraKitsStock: 'Depleted'
    }
  ],
  roads: [
    {
      id: 'ir-1',
      name: 'Indus National Highway N-55 (Dadu-Sehwan Section)',
      type: 'Primary Highway',
      coordinates: [
        [26.4250, 67.8650],
        [26.5500, 67.8100],
        [26.6910, 67.7500],
        [27.0920, 67.7340]
      ],
      status: 'Severely Disrupted / Washed Out',
      disruptionCause: 'Submerged up to 2m depth across 18km of road length',
      detourDistanceKm: 46.5
    }
  ],
  floodPolygons: [
    [
      [26.6000, 67.5500],
      [26.7500, 67.5800],
      [27.1500, 67.6500],
      [27.2000, 67.8000],
      [26.8500, 67.8500],
      [26.5000, 67.8800],
      [26.4000, 67.7000],
      [26.6000, 67.5500]
    ]
  ],
  reports: [
    {
      id: 'irep-1',
      reporterName: 'Dr. Tariq Laghari (District Health Officer)',
      isAnonymous: false,
      communityId: 'indus-1',
      locationName: 'Johi Ring Bund Medical Post',
      coordinates: [26.6925, 67.6145],
      reportType: 'Health Emergency',
      description: 'Acute watery diarrhea cases have surged over 240 patients in 24 hours. The solar RO plant is dead under 2m of flood water. Trapped population has no clean water left.',
      severity: 'CRITICAL',
      timestamp: '2026-09-18 14:20 PKT',
      status: 'Verified / Ground Confirmed',
      extractedInfo: {
        infrastructureImpacted: 'Municipal RO Drinking Plant & Rural Hospital',
        damageCondition: 'Electrical inundation and sewer overflow',
        washThreatVectors: ['Cholera outbreak', 'Total potable water exhaustion'],
        confidenceScore: 0.99,
        recommendedEmergencyAction: 'Helicopter airlift of water purifiers and IV infusions'
      }
    }
  ],
  riverCorridor: INDUS_RIVER_CORRIDOR,
};

// 4. Rio Grande do Sul, Porto Alegre & Guaíba Basin, Brazil (Metropolitan Lagoon & Pumping Surge)
const BRAZIL_COMMUNITIES: Community[] = [
  {
    id: 'br-1',
    name: 'Sarandi (Zona Norte)',
    code: 'BRA-POA-01',
    ward: 'Bairro Sarandi',
    ruralMunicipality: 'Porto Alegre',
    district: 'Região Metropolitana',
    coordinates: [-29.9850, -51.1350],
    population: 18500,
    exposedPopulation: 16200,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 2.4,
    inundatedAreaPct: 92,
    mainWaterSource: 'DMAE Estação de Tratamento de Água (ETA São João)',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Caminhão-Pipa Base Canoas (Hospital de Campanha)',
    alternativeWaterDistanceStraightKm: 5.8,
    alternativeWaterDistanceAccessibleKm: 18.6,
    alternativeWaterReason: 'Dique do Arroio Sarandi rompido; Avenida Assis Brasil e BR-290 bloqueadas por 2.0m de água',
    sanitationAffected: true,
    sanitationStatus: 'Estação de bombeamento de esgoto inundada; contaminação biológica em toda a mancha urbana',
    healthFacilityName: 'UPA Zona Norte Moacyr Scliar',
    healthFacilityAccessibility: 'INACCESSIBLE',
    healthDistanceStraightKm: 2.1,
    healthDistanceAccessibleKm: 14.5,
    healthAccessObstacle: 'Inundada até o teto; pacientes transferidos para hospital de campanha em Canoas',
    roadAccessibility: 'INACCESSIBLE',
    roadObstacle: 'Avenida Assis Brasil completamente navegável apenas por botes e motos aquáticas',
    confidenceIndicator: 0.99,
    priorityScore: 97,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Rompimento de dique de contenção metropolitano',
      'Desligamento elétrico preventivo da ETA São João deixando 85% do bairro sem água potável',
      'Mais de 16.000 pessoas desalojadas ou ilhadas em telhados',
      'Risco crítico de leptospirose e hepatite A por contato com água de esgoto'
    ],
    recommendedInterventions: [
      'Resgate com embarcações da Defesa Civil e Corpo de Bombeiros',
      'Envio prioritário de água mineral engarrafada e pastilhas de hipoclorito de sódio',
      'Instalação de bombas de drenagem de alta capacidade cedidas por produtores de arroz'
    ]
  },
  {
    id: 'br-2',
    name: 'Ilhas do Guaíba (Ilha da Pintada)',
    code: 'BRA-POA-04',
    ward: 'Região das Ilhas',
    ruralMunicipality: 'Porto Alegre',
    district: 'Região Metropolitana',
    coordinates: [-30.0150, -51.2550],
    population: 3400,
    exposedPopulation: 3200,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 3.1,
    inundatedAreaPct: 98,
    mainWaterSource: 'ETA Ilhas (Captação Rio Jacuí)',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Ponto Flutuante Batalhão Naval (Cais Mauá)',
    alternativeWaterDistanceStraightKm: 3.2,
    alternativeWaterDistanceAccessibleKm: 8.5,
    alternativeWaterReason: 'Ponte do Guaíba interditada; travessia restrita a barcos militares com correnteza extrema',
    sanitationAffected: true,
    sanitationStatus: 'Fossas sépticas 100% alagadas; esgoto carreado para o estuário',
    healthFacilityName: 'Posto de Saúde Ilha da Pintada',
    healthFacilityAccessibility: 'INACCESSIBLE',
    healthDistanceStraightKm: 0.8,
    healthDistanceAccessibleKm: 5.2,
    healthAccessObstacle: 'Estrutura submersa sob 2.8 metros de lâmina d’água',
    roadAccessibility: 'INACCESSIBLE',
    roadObstacle: 'Acesso terrestre totalmente inexistente durante a cheia histórica',
    confidenceIndicator: 0.98,
    priorityScore: 95,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Nível do Guaíba ultrapassou a cota histórica de 5.35 metros',
      'Isolamento hidrológico total da comunidade insular',
      'Ausência completa de água tratada para consumo humano'
    ],
    recommendedInterventions: [
      'Comboio fluvial da Marinha do Brasil com dessalinizadores e bolsas de água potável',
      'Evacuação médica de idosos e enfermos para abrigos no continente'
    ]
  },
  {
    id: 'br-3',
    name: 'Centro Histórico & Mercado Público',
    code: 'BRA-POA-02',
    ward: 'Centro',
    ruralMunicipality: 'Porto Alegre',
    district: 'Região Metropolitana',
    coordinates: [-30.0280, -51.2290],
    population: 12000,
    exposedPopulation: 7500,
    floodExposure: 'HIGH',
    floodDepthMeters: 1.5,
    inundatedAreaPct: 65,
    mainWaterSource: 'ETA Moinhos de Vento',
    mainWaterStatus: 'Potentially Disrupted',
    alternativeWaterSource: 'Reservatório Hospital de Clínicas',
    alternativeWaterDistanceStraightKm: 2.8,
    alternativeWaterDistanceAccessibleKm: 6.4,
    alternativeWaterReason: 'Avenida Mauá e Rua dos Andradas tomadas pelas águas do Guaíba que transbordaram o Muro da Mauá',
    sanitationAffected: true,
    sanitationStatus: 'Refluxo de bueiros pluviais pelas comportas com defeito de vedação',
    healthFacilityName: 'Hospital Santa Casa de Misericórdia',
    healthFacilityAccessibility: 'LIMITED',
    healthDistanceStraightKm: 1.1,
    healthDistanceAccessibleKm: 3.5,
    healthAccessObstacle: 'Acesso restrito por veículos com tração integral e caminhões do Exército',
    roadAccessibility: 'LIMITED',
    roadObstacle: 'Comportas de proteção 3 e 4 vazando com refluxo do Guaíba',
    confidenceIndicator: 0.96,
    priorityScore: 82,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Falha nas comportas do sistema de contenção de cheias',
      'Falta de energia elétrica nas estações elevatórias de água pluvial',
      'Paralisação do comércio de alimentos e farmácias'
    ],
    recommendedInterventions: [
      'Reparo emergencial nas comportas com sacos de areia e retroescavadeiras',
      'Geradores a diesel para manter o abastecimento da Santa Casa e hospitais centrais'
    ]
  }
];

export const BRAZIL_DISASTER_ZONE: GlobalDisasterZone = {
  id: 'rio_grande',
  name: 'Rio Grande do Sul (Porto Alegre & Guaíba Basin)',
  country: 'Brazil',
  continent: 'South America',
  flag: '🇧🇷',
  floodType: 'Urban Drainage, Lagoon Surge & Pumping Station Failure',
  center: [-30.01, -51.20],
  zoom: 11,
  bounds: [[-30.15, -51.35], [-29.85, -51.05]],
  disasterDate: 'Extreme Historical Guaíba Surge',
  situationSummary: 'Record-breaking inundation of the Guaíba Lagoon (>5.35m) and Taquari-Sinos river basins submerging metropolitan Porto Alegre, Canoas, and Eldorado do Sul. The failure of protective floodgates and electric pump stations incapacitated 5 of 6 municipal water treatment plants (DMAE), leaving over 80% of the metropolitan population without piped potable water.',
  sensorSpecs: 'Sentinel-1 SAR + SAOCOM L-Band SAR + PlanetScope (3m) Optical',
  inundatedAreaSqKm: 420,
  totalPopulation: 1400000,
  communities: BRAZIL_COMMUNITIES,
  waterSources: [
    {
      id: 'bws-1',
      name: 'ETA São João (DMAE Porto Alegre)',
      type: 'Piped Intake Scheme',
      coordinates: [-29.9920, -51.1850],
      status: 'Submerged',
      communityNear: 'Sarandi (Zona Norte)',
      householdsServed: 120000,
      eColiRisk: 'High'
    },
    {
      id: 'bws-2',
      name: 'ETA Moinhos de Vento (DMAE)',
      type: 'Deep Tube Well Overhead Tank',
      coordinates: [-30.0250, -51.2010],
      status: 'Operational',
      communityNear: 'Centro Histórico & Mercado Público',
      householdsServed: 85000,
      eColiRisk: 'Low'
    }
  ],
  sanitationFacilities: [
    {
      id: 'bsan-1',
      name: 'EBAP 16 (Estação de Bombeamento de Água Pluvial Sarandi)',
      type: 'Public Market Facility',
      coordinates: [-29.9880, -51.1390],
      status: 'Flooded / Pit Overflow',
      communityNear: 'Sarandi (Zona Norte)',
      pitsSubmerged: true
    }
  ],
  healthFacilities: [
    {
      id: 'bhf-1',
      name: 'Complexo Hospitalar Santa Casa de Porto Alegre',
      type: 'District Hospital',
      coordinates: [-30.0310, -51.2210],
      bedCapacity: 1100,
      status: 'Fully Operational',
      accessibilityStatus: 'LIMITED',
      ambulanceAccessible: true,
      orsCholeraKitsStock: 'Adequate'
    },
    {
      id: 'bhf-2',
      name: 'UPA Zona Norte Moacyr Scliar',
      type: 'Primary Health Center (PHC)',
      coordinates: [-29.9860, -51.1360],
      bedCapacity: 40,
      status: 'Partial Capacity - Ground Inundation',
      accessibilityStatus: 'INACCESSIBLE',
      ambulanceAccessible: false,
      orsCholeraKitsStock: 'Depleted'
    }
  ],
  roads: [
    {
      id: 'br-road-1',
      name: 'Rodovia BR-290 (Acesso Ponte Nova do Guaíba)',
      type: 'Primary Highway',
      coordinates: [
        [-30.0150, -51.2350],
        [-30.0100, -51.2050],
        [-30.0050, -51.1800]
      ],
      status: 'Severely Disrupted / Washed Out',
      disruptionCause: 'Submersa sob 1.7m com interdição total pela PRF',
      detourDistanceKm: 18.6
    }
  ],
  floodPolygons: [
    [
      [-29.9700, -51.1200],
      [-29.9900, -51.1100],
      [-30.0400, -51.2000],
      [-30.0500, -51.2600],
      [-30.0100, -51.2800],
      [-29.9600, -51.1800],
      [-29.9700, -51.1200]
    ]
  ],
  reports: [
    {
      id: 'brep-1',
      reporterName: 'Capitão Lucas Silveira (Defesa Civil RS)',
      isAnonymous: false,
      communityId: 'br-1',
      locationName: 'Avenida Assis Brasil, Sarandi',
      coordinates: [-29.9870, -51.1370],
      reportType: 'Water Contamination',
      description: 'Água das cheias ultrapassou os telhados no Bairro Sarandi após o colapso do dique. Sem abastecimento de água potável há 72 horas. Risco imediato de contaminação por leptospirose. Necessidade urgente de caminhões-pipa escoltados e kits de cloração.',
      severity: 'CRITICAL',
      timestamp: '2026-09-18 11:30 BRT',
      status: 'Verified / Ground Confirmed',
      extractedInfo: {
        infrastructureImpacted: 'Sistema de Distribuição DMAE e Dique Norte',
        damageCondition: 'Inundação total de estações de bombeamento e residências',
        washThreatVectors: ['Surto iminente de leptospirose', 'Esgotamento de água tratada'],
        confidenceScore: 0.99,
        recommendedEmergencyAction: 'Distribuição massiva de água mineral e pastilhas de hipoclorito'
      }
    }
  ]
};

// 5. Valencia & Mediterranean Coast, Spain (Extreme Flash Deluge & Ravine Torrents)
const VALENCIA_COMMUNITIES: Community[] = [
  {
    id: 'val-1',
    name: 'Paiporta (Zona Cero)',
    code: 'ESP-VAL-01',
    ward: 'Casco Urbano & Barranco del Poyo',
    ruralMunicipality: 'Paiporta',
    district: 'Horta Sud',
    coordinates: [39.4260, -0.4180],
    population: 26000,
    exposedPopulation: 22500,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 2.6,
    inundatedAreaPct: 94,
    mainWaterSource: 'Red Municipal Aguas de Valencia (Intake Turia-Júcar)',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Camiones Cisterna UME (Polideportivo Municipal)',
    alternativeWaterDistanceStraightKm: 1.8,
    alternativeWaterDistanceAccessibleKm: 7.2,
    alternativeWaterReason: 'Calles colapsadas por acumulación de vehículos arrastrados y 1.2m de lodo viscoso; puentes peatonales del barranco destruidos',
    sanitationAffected: true,
    sanitationStatus: 'Red de colectores de alcantarillado rota; lodo fecal estancado en bajos y garajes',
    healthFacilityName: 'Centro de Salud de Paiporta',
    healthFacilityAccessibility: 'INACCESSIBLE',
    healthDistanceStraightKm: 0.6,
    healthDistanceAccessibleKm: 4.8,
    healthAccessObstacle: 'Planta baja y urgencias destruidas por el torrente de agua y barro; traslado de enfermos a Hospital La Fe en Valencia',
    roadAccessibility: 'SEVERELY DISRUPTED',
    roadObstacle: 'CV-400 y accesos desde la V-30 cortados por acumulación de coches y socavones en la calzada',
    confidenceIndicator: 0.99,
    priorityScore: 98,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Avenida relámpago del Barranco del Poyo superando los 2.000 m³/s',
      'Rotura generalizada de tuberías de distribución de agua potable bajo el asfalto socavado',
      'Acumulación masiva de lodo con riesgo biológico de tétanos y gastroenteritis bacteriana',
      'Bloqueo físico de calles principales impidiendo el reparto de suministros en camión'
    ],
    recommendedInterventions: [
      'Despliegue urgente de maquinaria pesada de la UME y bomberos para abrir viales',
      'Instalación de plantas potabilizadoras móviles en puntos elevados de Paiporta',
      'Distribución puerta a puerta de agua embotellada y kits de desinfección con lejía alimentaria'
    ]
  },
  {
    id: 'val-2',
    name: 'Catarroja / Massanassa',
    code: 'ESP-VAL-03',
    ward: 'Barrio del Raval',
    ruralMunicipality: 'Catarroja',
    district: 'Horta Sud',
    coordinates: [39.4040, -0.4020],
    population: 29000,
    exposedPopulation: 21000,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 2.1,
    inundatedAreaPct: 86,
    mainWaterSource: 'Red Metropolitana EMSHI',
    mainWaterStatus: 'Contaminated',
    alternativeWaterSource: 'Punto de Reparto Cruz Roja (Estación Renfe)',
    alternativeWaterDistanceStraightKm: 1.4,
    alternativeWaterDistanceAccessibleKm: 5.5,
    alternativeWaterReason: 'Túneles subterráneos anegados y barro impidiendo el tráfico rodado convencional',
    sanitationAffected: true,
    sanitationStatus: 'Estaciones de bombeo de aguas residuales sin suministro eléctrico',
    healthFacilityName: 'Centro de Especialidades de Catarroja',
    healthFacilityAccessibility: 'LIMITED',
    healthDistanceStraightKm: 1.1,
    healthDistanceAccessibleKm: 3.9,
    healthAccessObstacle: 'Entrada despejada a pie pero intransitable para ambulancias normales',
    roadAccessibility: 'SEVERELY DISRUPTED',
    roadObstacle: 'Pista de Silla (V-31) con tramos bloqueados por vehículos apilados',
    confidenceIndicator: 0.97,
    priorityScore: 92,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Inundación de garajes comunitarios con hidrocarburos y aguas fecales',
      'Corte prolongado del suministro de agua de boca en miles de viviendas',
      'Dificultad de movilidad para población anciana atrapada en pisos altos'
    ],
    recommendedInterventions: [
      'Camiones cisterna militares para abastecimiento de agua no potable para baldeo y limpieza',
      'Equipos de voluntarios y bomberos con bombas de achique de lodos'
    ]
  },
  {
    id: 'val-3',
    name: 'Chiva (Cabecera del Barranco)',
    code: 'ESP-VAL-07',
    ward: 'Centro Histórico',
    ruralMunicipality: 'Chiva',
    district: 'La Hoya de Buñol',
    coordinates: [39.4730, -0.7180],
    population: 16000,
    exposedPopulation: 8900,
    floodExposure: 'HIGH',
    floodDepthMeters: 1.8,
    inundatedAreaPct: 62,
    mainWaterSource: 'Pozos Municipales de Chiva & Manantial de Marjana',
    mainWaterStatus: 'Potentially Disrupted',
    alternativeWaterSource: 'Depósito General El Castillo',
    alternativeWaterDistanceStraightKm: 2.2,
    alternativeWaterDistanceAccessibleKm: 6.1,
    alternativeWaterReason: 'Puentes de enlace sobre el barranco de Chiva colapsados estructuralmente',
    sanitationAffected: true,
    sanitationStatus: 'Colectores arrasados por la riada torrencial',
    healthFacilityName: 'Centro Sanitario Integrado de Buñol',
    healthFacilityAccessibility: 'LIMITED',
    healthDistanceStraightKm: 8.5,
    healthDistanceAccessibleKm: 19.2,
    healthAccessObstacle: 'Autovía A-3 cortada por socavones gigantescos',
    roadAccessibility: 'LIMITED',
    roadObstacle: 'A-3 en sentido Valencia impracticable; desvíos provisionales por carreteras secundarias',
    confidenceIndicator: 0.94,
    priorityScore: 79,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Precipitación extrema histórica (>490 mm en 8 horas)',
      'Destrucción de infraestructuras básicas de captación en los barrancos',
      'Desabastecimiento de agua corriente en urbanizaciones periféricas dispersas'
    ],
    recommendedInterventions: [
      'Generadores eléctricos de emergencia para pozos de bombeo',
      'Lanzamiento de líneas provisionales de polietileno de alta densidad para agua potable'
    ]
  }
];

export const VALENCIA_DISASTER_ZONE: GlobalDisasterZone = {
  id: 'valencia',
  name: 'Valencia & Mediterranean Coast (DANA Flash Flood)',
  country: 'Spain',
  continent: 'Europe',
  flag: '🇪🇸',
  floodType: 'DANA Flash Deluge & Ravine Torrents',
  center: [39.42, -0.42],
  zoom: 11,
  bounds: [[39.30, -0.80], [39.55, -0.30]],
  disasterDate: 'Extreme DANA Flash Disaster',
  situationSummary: 'Catastrophic flash flooding triggered by an isolated high-altitude depression (DANA) dumping over 490 mm of rain in hours. The flash surge down Barranco del Poyo destroyed water supply mains, bridges, and power lines across Paiporta, Catarroja, and Sedaví, filling streets with meters of mud and cutting off potable water to over 150,000 residents.',
  sensorSpecs: 'Copernicus EMS Rapid Mapping + Sentinel-1 SAR + PAZ X-Band SAR',
  inundatedAreaSqKm: 165,
  totalPopulation: 220000,
  communities: VALENCIA_COMMUNITIES,
  waterSources: [
    {
      id: 'vws-1',
      name: 'Punto de Distribución UME Paiporta Polideportivo',
      type: 'Emergency Bladder Point',
      coordinates: [39.4270, -0.4170],
      status: 'Operational',
      communityNear: 'Paiporta (Zona Cero)',
      householdsServed: 6500,
      eColiRisk: 'Low'
    },
    {
      id: 'vws-2',
      name: 'Red General de Abastecimiento Paiporta-Picanya',
      type: 'Piped Intake Scheme',
      coordinates: [39.4290, -0.4210],
      status: 'Damaged',
      communityNear: 'Paiporta (Zona Cero)',
      householdsServed: 18000,
      eColiRisk: 'High'
    }
  ],
  sanitationFacilities: [
    {
      id: 'vsan-1',
      name: 'Colector General Barranco del Poyo',
      type: 'Public Market Facility',
      coordinates: [39.4240, -0.4150],
      status: 'Flooded / Pit Overflow',
      communityNear: 'Paiporta (Zona Cero)',
      pitsSubmerged: true
    }
  ],
  healthFacilities: [
    {
      id: 'vhf-1',
      name: 'Hospital Universitari i Politècnic La Fe (Valencia)',
      type: 'District Hospital',
      coordinates: [39.4440, -0.3760],
      bedCapacity: 1000,
      status: 'Fully Operational',
      accessibilityStatus: 'ACCESSIBLE',
      ambulanceAccessible: true,
      orsCholeraKitsStock: 'Adequate'
    },
    {
      id: 'vhf-2',
      name: 'Centro de Salud Paiporta',
      type: 'Primary Health Center (PHC)',
      coordinates: [39.4265, -0.4185],
      bedCapacity: 15,
      status: 'Partial Capacity - Ground Inundation',
      accessibilityStatus: 'INACCESSIBLE',
      ambulanceAccessible: false,
      orsCholeraKitsStock: 'Critical Shortage'
    }
  ],
  roads: [
    {
      id: 'vr-1',
      name: 'Carretera CV-400 (Acceso Sur Valencia-Paiporta)',
      type: 'Primary Highway',
      coordinates: [
        [39.4400, -0.3950],
        [39.4300, -0.4080],
        [39.4260, -0.4180],
        [39.4100, -0.4120]
      ],
      status: 'Severely Disrupted / Washed Out',
      disruptionCause: 'Vehículos apilados y 1.2m de barro viscoso; acceso solo con orugas militares',
      detourDistanceKm: 7.2
    }
  ],
  floodPolygons: [
    [
      [39.4450, -0.4400],
      [39.4500, -0.4000],
      [39.4100, -0.3800],
      [39.3800, -0.4000],
      [39.4000, -0.4300],
      [39.4450, -0.4400]
    ]
  ],
  reports: [
    {
      id: 'vrep-1',
      reporterName: 'Carlos Benítez (Voluntario Protección Civil)',
      isAnonymous: false,
      communityId: 'val-1',
      locationName: 'Calle Real / Barranco de Paiporta',
      coordinates: [39.4262, -0.4182],
      reportType: 'Water Contamination',
      description: 'El barro estancado en los bajos huele a aguas fecales. El agua corriente sale marrón y con olor fétido por rotura de tuberías subterráneas. La gente no tiene agua para beber ni para lavarse las heridas. Necesitamos cubas de agua limpia urgentemente.',
      severity: 'CRITICAL',
      timestamp: '2026-09-19 12:45 CET',
      status: 'Verified / Ground Confirmed',
      extractedInfo: {
        infrastructureImpacted: 'Red Subterránea de Distribución de Agua',
        damageCondition: 'Tuberías reventadas por socavones, lodo cloacal estancado',
        washThreatVectors: ['Infección de heridas por fango', 'Contaminación de depósitos domésticos'],
        confidenceScore: 0.99,
        recommendedEmergencyAction: 'Envío prioritario de camiones cisterna con agua potable y botas de agua'
      }
    }
  ]
};

// 6. Derna & Wadi Derna Basin, Libya (Catastrophic Dam Collapse & Coastal Surge)
const DERNA_COMMUNITIES: Community[] = [
  {
    id: 'derna-1',
    name: 'Wadi Derna City Center (Al-Bilad)',
    code: 'LBY-DER-01',
    ward: 'Al-Bilad Old Town',
    ruralMunicipality: 'Derna Municipality',
    district: 'Derna District',
    coordinates: [32.7680, 22.6390],
    population: 32000,
    exposedPopulation: 26500,
    floodExposure: 'CRITICAL',
    floodDepthMeters: 4.5,
    inundatedAreaPct: 98,
    mainWaterSource: 'Derna Coastal Desalination Plant & Wadi Wells',
    mainWaterStatus: 'Submerged',
    alternativeWaterSource: 'Libyan Red Crescent Mobile Desalination Barge',
    alternativeWaterDistanceStraightKm: 2.5,
    alternativeWaterDistanceAccessibleKm: 16.8,
    alternativeWaterReason: 'All 5 bridges connecting eastern and western Derna washed into the Mediterranean Sea; 70m canyon isolates the two halves',
    sanitationAffected: true,
    sanitationStatus: 'Municipal sewage network completely obliterated; sea water and flood debris mixed with thousands of casualties',
    healthFacilityName: 'Derna Al-Wahda Hospital',
    healthFacilityAccessibility: 'SEVERELY DISRUPTED',
    healthDistanceStraightKm: 1.8,
    healthDistanceAccessibleKm: 14.2,
    healthAccessObstacle: 'East-west dividing chasm; passable only via coastal military pontoon or helicopter',
    roadAccessibility: 'INACCESSIBLE',
    roadObstacle: 'Coastal Highway bridge collapsed into sea; city bifurcated',
    confidenceIndicator: 0.99,
    priorityScore: 99,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Dual upstream dam breach (Abu Mansour and Al-Bilad dams) releasing 30 million m³ of water',
      'Total destruction of central urban drinking water grid',
      'Severe pathogen risk from deceased casualties and sewage in seawater intakes',
      'Extreme 16.8 km detour gap due to severed bridges'
    ],
    recommendedInterventions: [
      'Deployment of floating offshore desalination ships',
      'Construction of temporary Bailey bridges across Wadi Derna channel',
      'Massive cholera and typhoid vaccination and chlorine distribution campaign'
    ]
  },
  {
    id: 'derna-2',
    name: 'Al-Sahel Western Heights',
    code: 'LBY-DER-03',
    ward: 'Western District',
    ruralMunicipality: 'Derna Municipality',
    district: 'Derna District',
    coordinates: [32.7520, 22.6150],
    population: 24000,
    exposedPopulation: 14000,
    floodExposure: 'HIGH',
    floodDepthMeters: 0.8,
    inundatedAreaPct: 45,
    mainWaterSource: 'Groundwater Wells in Upper Limestone Aquifer',
    mainWaterStatus: 'Potentially Disrupted',
    alternativeWaterSource: 'Tobruk Tanker Supply Convoy',
    alternativeWaterDistanceStraightKm: 35.0,
    alternativeWaterDistanceAccessibleKm: 78.0,
    alternativeWaterReason: 'Mountain switchback roads cracked and partially blocked by landslides',
    sanitationAffected: false,
    sanitationStatus: 'Overcrowded with 20,000 displaced residents from the destroyed center',
    healthFacilityName: 'Al-Shiha Field Clinic',
    healthFacilityAccessibility: 'ACCESSIBLE',
    healthDistanceStraightKm: 2.1,
    healthDistanceAccessibleKm: 3.5,
    healthAccessObstacle: 'Passable with 4x4 vehicles',
    roadAccessibility: 'LIMITED',
    roadObstacle: 'Mountain road damaged by erosion',
    confidenceIndicator: 0.95,
    priorityScore: 88,
    priorityCategory: 'CRITICAL',
    keyReasons: [
      'Massive influx of traumatized, displaced families from the destroyed wadi',
      'Severe pressure on limited western groundwater wells',
      'Logistics choke point from Tobruk and Benghazi'
    ],
    recommendedInterventions: [
      'Establishment of large-scale water bladder storage parks (50,000L)',
      'Mobile water chlorination testing units'
    ]
  }
];

export const DERNA_DISASTER_ZONE: GlobalDisasterZone = {
  id: 'derna',
  name: 'Derna Coastal Basin (Storm Daniel Dam Breach)',
  country: 'Libya',
  continent: 'Africa',
  flag: '🇱🇾',
  floodType: 'Catastrophic Dam Collapse & Coastal Surge',
  center: [32.76, 22.63],
  zoom: 12,
  bounds: [[32.72, 22.58], [32.80, 22.68]],
  disasterDate: 'Extreme Dam Failure Event',
  situationSummary: 'Catastrophic collapse of two dams along Wadi Derna triggered by Storm Daniel, sending a 7-meter wave of water, mud, and debris through central Derna into the Mediterranean Sea. The torrent washed away entire neighborhoods, destroyed all central water distribution pipelines, and destroyed all five connecting bridges, bifurcating the city.',
  sensorSpecs: 'Copernicus Sentinel-1 SAR + WorldView-3 (0.3m) + Pleiades Neo',
  inundatedAreaSqKm: 48,
  totalPopulation: 90000,
  communities: DERNA_COMMUNITIES,
  waterSources: [
    {
      id: 'dws-1',
      name: 'Derna Desalination Plant (Coastal)',
      type: 'Piped Intake Scheme',
      coordinates: [32.7710, 22.6510],
      status: 'Damaged',
      communityNear: 'Wadi Derna City Center (Al-Bilad)',
      householdsServed: 14000,
      eColiRisk: 'High'
    }
  ],
  sanitationFacilities: [
    {
      id: 'dsan-1',
      name: 'Derna Central Wastewater Outfall',
      type: 'Public Market Facility',
      coordinates: [32.7700, 22.6450],
      status: 'Flooded / Pit Overflow',
      communityNear: 'Wadi Derna City Center (Al-Bilad)',
      pitsSubmerged: true
    }
  ],
  healthFacilities: [
    {
      id: 'dhf-1',
      name: 'Al-Wahda Hospital (Central Derna)',
      type: 'District Hospital',
      coordinates: [32.7650, 22.6380],
      bedCapacity: 180,
      status: 'Partial Capacity - Ground Inundation',
      accessibilityStatus: 'SEVERELY DISRUPTED',
      ambulanceAccessible: false,
      orsCholeraKitsStock: 'Depleted'
    }
  ],
  roads: [
    {
      id: 'dr-1',
      name: 'Derna East-West Coastal Highway & Central Bridge',
      type: 'Bridge',
      coordinates: [
        [32.7650, 22.6300],
        [32.7670, 22.6380],
        [32.7690, 22.6450]
      ],
      status: 'Severely Disrupted / Washed Out',
      disruptionCause: 'Bridge completely collapsed into wadi; 70m impassable canyon',
      detourDistanceKm: 16.8
    }
  ],
  floodPolygons: [
    [
      [32.7500, 22.6200],
      [32.7600, 22.6300],
      [32.7750, 22.6450],
      [32.7800, 22.6550],
      [32.7700, 22.6600],
      [32.7550, 22.6400],
      [32.7500, 22.6200]
    ]
  ],
  reports: [
    {
      id: 'drep-1',
      reporterName: 'Ahmed Al-Mansouri (Libyan Red Crescent)',
      isAnonymous: false,
      communityId: 'derna-1',
      locationName: 'Al-Bilad East Bank, Derna',
      coordinates: [32.7685, 22.6395],
      reportType: 'Water source damaged',
      description: 'The entire central water grid is torn out of the earth. We cannot get clean water tankers from the west side to the east side because all five bridges are gone. People are desperate for bottled drinking water.',
      severity: 'CRITICAL',
      timestamp: '2026-09-17 16:10 EET',
      status: 'Verified / Ground Confirmed',
      extractedInfo: {
        infrastructureImpacted: 'Municipal Water Distribution Network & Bridges',
        damageCondition: 'Total hydraulic destruction of pipeline mains',
        washThreatVectors: ['Complete potable water deprivation', 'Acute pathogen transmission'],
        confidenceScore: 0.99,
        recommendedEmergencyAction: 'Deploy offshore water treatment barge and establish helicopter water drop point'
      }
    }
  ]
};

// Master collection of official pre-calibrated global disaster zones
export const GLOBAL_DISASTER_ZONES: GlobalDisasterZone[] = [
  KOSHI_DISASTER_ZONE,
  ASSAM_DISASTER_ZONE,
  INDUS_DISASTER_ZONE,
  BRAZIL_DISASTER_ZONE,
  VALENCIA_DISASTER_ZONE,
  DERNA_DISASTER_ZONE
];

// Global Geographic Presets for instant 1-click Custom AOI creation anywhere in the world
export interface GlobalPresetLocation {
  name: string;
  country: string;
  continent: string;
  flag: string;
  lat: number;
  lng: number;
  basin: string;
  floodDescription: string;
}

export const GLOBAL_PRESET_LOCATIONS: GlobalPresetLocation[] = [
  { name: 'Koshi River Basin', country: 'Nepal / India', continent: 'Asia', flag: '🇳🇵', lat: 26.585, lng: 87.03, basin: 'Ganges-Koshi', floodDescription: 'Monsoon riverine & embankment breach' },
  { name: 'Brahmaputra Valley (Assam)', country: 'India', continent: 'Asia', flag: '🇮🇳', lat: 26.52, lng: 92.65, basin: 'Brahmaputra', floodDescription: 'Braided river & island char submergence' },
  { name: 'Indus River Basin (Sindh)', country: 'Pakistan', continent: 'Asia', flag: '🇵🇰', lat: 26.75, lng: 67.75, basin: 'Indus', floodDescription: 'Mega-monsoon plain & lake breach' },
  { name: 'Porto Alegre (Guaíba)', country: 'Brazil', continent: 'South America', flag: '🇧🇷', lat: -30.01, lng: -51.20, basin: 'Guaíba / Jacuí', floodDescription: 'Metropolitan lagoon & pumping station failure' },
  { name: 'Valencia Coast (Paiporta)', country: 'Spain', continent: 'Europe', flag: '🇪🇸', lat: 39.42, lng: -0.42, basin: 'Barranco del Poyo / Turia', floodDescription: 'DANA extreme flash deluge & debris torrent' },
  { name: 'Derna Wadi Basin', country: 'Libya', continent: 'Africa', flag: '🇱🇾', lat: 32.76, lng: 22.63, basin: 'Wadi Derna', floodDescription: 'Catastrophic dam collapse & coastal surge' },
  { name: 'Chao Phraya Basin (Bangkok)', country: 'Thailand', continent: 'Asia', flag: '🇹🇭', lat: 13.75, lng: 100.50, basin: 'Chao Phraya', floodDescription: 'Lowland delta surge & industrial park inundation' },
  { name: 'Mekong River Delta (Can Tho)', country: 'Vietnam', continent: 'Asia', flag: '🇻🇳', lat: 10.03, lng: 105.78, basin: 'Mekong Delta', floodDescription: 'Tidal backwater & riverine agricultural flooding' },
  { name: 'Yangtze River Basin (Wuhan)', country: 'China', continent: 'Asia', flag: '🇨🇳', lat: 30.59, lng: 114.30, basin: 'Yangtze', floodDescription: 'Monsoon basin crest & urban sponge drainage test' },
  { name: 'Rhine-Meuse Delta (Rotterdam/Cologne)', country: 'Netherlands / Germany', continent: 'Europe', flag: '🇪🇺', lat: 50.93, lng: 6.95, basin: 'Rhine River', floodDescription: 'Rapid tributary crest & urban flood wall test' },
  { name: 'Mississippi Delta (New Orleans)', country: 'United States', continent: 'North America', flag: '🇺🇸', lat: 29.95, lng: -90.07, basin: 'Lower Mississippi', floodDescription: 'Hurricane storm surge & pumping station cutoff' },
  { name: 'Nairobi & Athi River Basin', country: 'Kenya', continent: 'Africa', flag: '🇰🇪', lat: -1.29, lng: 36.82, basin: 'Athi-Galana', floodDescription: 'Informal settlement deluge & sewer wash-out' },
  { name: 'Kerala Western Ghats (Periyar)', country: 'India', continent: 'Asia', flag: '🇮🇳', lat: 9.98, lng: 76.29, basin: 'Periyar River', floodDescription: 'Dam shutter opening & hillside flash runoff' },
  { name: 'Danube Basin (Budapest)', country: 'Hungary', continent: 'Europe', flag: '🇭🇺', lat: 47.49, lng: 19.04, basin: 'Danube', floodDescription: 'Central European riverine high-water emergency' }
];

/**
 * Universal Custom AOI Disaster Generator
 * Generates a fully coherent, calibrated disaster zone model for ANY coordinates on Earth.
 */
export function generateCustomDisasterZone(
  name: string,
  country: string,
  lat: number,
  lng: number,
  radiusKm: number = 15,
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL' = 'CRITICAL'
): GlobalDisasterZone {
  const zoneId = `custom-${Math.abs(Math.round(lat * 100))}-${Math.abs(Math.round(lng * 100))}`;
  const dLat = (radiusKm / 111); // approx degrees lat
  const dLng = (radiusKm / (111 * Math.cos(lat * (Math.PI / 180)))); // approx degrees lng

  const comm1Coords: [number, number] = [lat + dLat * 0.25, lng - dLng * 0.15];
  const comm2Coords: [number, number] = [lat - dLat * 0.35, lng + dLng * 0.20];
  const comm3Coords: [number, number] = [lat + dLat * 0.05, lng + dLng * 0.35];
  const comm4Coords: [number, number] = [lat - dLat * 0.15, lng - dLng * 0.40];

  const customCommunities: Community[] = [
    {
      id: `${zoneId}-comm-1`,
      name: `${name} Central Lowland`,
      code: 'AOI-01',
      ward: 'Zone A',
      ruralMunicipality: `${name} Municipality`,
      district: 'Emergency AOI',
      coordinates: comm1Coords,
      population: 4800,
      exposedPopulation: 4100,
      floodExposure: severity,
      floodDepthMeters: severity === 'CRITICAL' ? 2.2 : severity === 'HIGH' ? 1.4 : 0.8,
      inundatedAreaPct: severity === 'CRITICAL' ? 84 : 65,
      mainWaterSource: 'Primary Municipal Water Supply Scheme',
      mainWaterStatus: 'Submerged',
      alternativeWaterSource: 'Highland Deep Borewell & Bladder Station',
      alternativeWaterDistanceStraightKm: 2.8,
      alternativeWaterDistanceAccessibleKm: 8.9,
      alternativeWaterReason: 'Direct access road submerged under 1.4m of moving floodwater; vehicle access blocked',
      sanitationAffected: true,
      sanitationStatus: 'Latrine containment overtopped; biological pathogen risk in standing water',
      healthFacilityName: `${name} Emergency Medical Center`,
      healthFacilityAccessibility: 'LIMITED',
      healthDistanceStraightKm: 2.4,
      healthDistanceAccessibleKm: 6.8,
      healthAccessObstacle: 'Access causeway inundated; emergency boat or high-clearance transit only',
      roadAccessibility: 'SEVERELY DISRUPTED',
      roadObstacle: 'Culvert scoured and bridge approach flooded',
      confidenceIndicator: 0.94,
      priorityScore: severity === 'CRITICAL' ? 92 : 78,
      priorityCategory: severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      keyReasons: [
        'High flood inundation verified via global SAR backscatter signature',
        'Primary drinking water source submerged & fecal contamination threat',
        'Significant accessibility impedance: 8.9 km detour vs 2.8 km direct',
        'Vulnerable population requiring urgent safe drinking water supplies'
      ],
      recommendedInterventions: [
        'Deploy 5,000L mobile emergency water bladder and chlorine purification drops',
        'Emergency culvert bypass and pontoon crossing for relief vehicles',
        'Surveillance team for waterborne diarrheal illness'
      ]
    },
    {
      id: `${zoneId}-comm-2`,
      name: `${name} River Margin`,
      code: 'AOI-02',
      ward: 'Zone B',
      ruralMunicipality: `${name} District`,
      district: 'Emergency AOI',
      coordinates: comm2Coords,
      population: 3200,
      exposedPopulation: 2600,
      floodExposure: 'HIGH',
      floodDepthMeters: 1.5,
      inundatedAreaPct: 71,
      mainWaterSource: 'Community Borehole Network',
      mainWaterStatus: 'Contaminated',
      alternativeWaterSource: 'Sub-district Elevated Cistern',
      alternativeWaterDistanceStraightKm: 3.5,
      alternativeWaterDistanceAccessibleKm: 9.4,
      alternativeWaterReason: 'Secondary bridge washed out by storm runoff',
      sanitationAffected: true,
      sanitationStatus: 'Septic backflow and waterlogged soakpits',
      healthFacilityName: `${name} Regional Clinic`,
      healthFacilityAccessibility: 'SEVERELY DISRUPTED',
      healthDistanceStraightKm: 3.8,
      healthDistanceAccessibleKm: 11.2,
      healthAccessObstacle: 'Water over highway with hazardous currents',
      roadAccessibility: 'SEVERELY DISRUPTED',
      roadObstacle: 'Roadbed washed out for 80 meters',
      confidenceIndicator: 0.91,
      priorityScore: 85,
      priorityCategory: 'CRITICAL',
      keyReasons: [
        'Water network contamination by river surge',
        'Access detour gap exceeding 2.7x',
        'High density of affected households'
      ],
      recommendedInterventions: [
        'Airdrop or boat delivery of water filtration packs',
        'Shock chlorination of community boreholes once water recedes'
      ]
    },
    {
      id: `${zoneId}-comm-3`,
      name: `${name} Eastern Settlement`,
      code: 'AOI-03',
      ward: 'Zone C',
      ruralMunicipality: `${name} Municipality`,
      district: 'Emergency AOI',
      coordinates: comm3Coords,
      population: 2900,
      exposedPopulation: 1800,
      floodExposure: 'MODERATE',
      floodDepthMeters: 0.9,
      inundatedAreaPct: 45,
      mainWaterSource: 'Deep Aquifer Well Cluster',
      mainWaterStatus: 'Potentially Disrupted',
      alternativeWaterSource: 'Township Booster Pump',
      alternativeWaterDistanceStraightKm: 2.1,
      alternativeWaterDistanceAccessibleKm: 4.3,
      alternativeWaterReason: 'Minor road waterlogging',
      sanitationAffected: false,
      sanitationStatus: 'Elevated toilets functional with minor seepage',
      healthFacilityName: `${name} Sub-Health Post`,
      healthFacilityAccessibility: 'ACCESSIBLE',
      healthDistanceStraightKm: 1.5,
      healthDistanceAccessibleKm: 2.2,
      healthAccessObstacle: 'Clear road passable with standard vehicles',
      roadAccessibility: 'ACCESSIBLE',
      roadObstacle: 'Potholes and minor standing water on road shoulders',
      confidenceIndicator: 0.89,
      priorityScore: 56,
      priorityCategory: 'HIGH',
      keyReasons: [
        'Partially functional water supply needing regular water testing',
        'Road link accessible for relief staging'
      ],
      recommendedInterventions: [
        'Establish clean water distribution hub for western settlements',
        'Deliver water storage jerrycans to relief shelters'
      ]
    },
    {
      id: `${zoneId}-comm-4`,
      name: `${name} Hillside Refuge Camp`,
      code: 'AOI-04',
      ward: 'Zone D',
      ruralMunicipality: `${name} Municipality`,
      district: 'Emergency AOI',
      coordinates: comm4Coords,
      population: 1500,
      exposedPopulation: 650,
      floodExposure: 'LOW',
      floodDepthMeters: 0.2,
      inundatedAreaPct: 15,
      mainWaterSource: 'Highland Gravity Spring & Tank',
      mainWaterStatus: 'Functional',
      alternativeWaterSource: 'Gravity Supply Main',
      alternativeWaterDistanceStraightKm: 1.0,
      alternativeWaterDistanceAccessibleKm: 1.2,
      alternativeWaterReason: 'Clear paved mountain road',
      sanitationAffected: false,
      sanitationStatus: 'Fully functional sanitation block',
      healthFacilityName: `${name} Camp Dispensary`,
      healthFacilityAccessibility: 'ACCESSIBLE',
      healthDistanceStraightKm: 0.8,
      healthDistanceAccessibleKm: 1.0,
      healthAccessObstacle: 'Directly accessible',
      roadAccessibility: 'ACCESSIBLE',
      roadObstacle: 'Clear paved road',
      confidenceIndicator: 0.93,
      priorityScore: 32,
      priorityCategory: 'LOW',
      keyReasons: [
        'Secure high ground location with uncompromised potable water',
        'Ideal forward logistics and safe shelter point'
      ],
      recommendedInterventions: [
        'Maintain clean water supply for arriving evacuees',
        'Stock emergency medical supplies'
      ]
    }
  ];

  const customWaterSources: WaterSource[] = [
    {
      id: `${zoneId}-ws-1`,
      name: `${name} Municipal Water Intake & Pump Station`,
      type: 'Piped Intake Scheme',
      coordinates: [lat + dLat * 0.20, lng - dLng * 0.10],
      status: 'Submerged',
      communityNear: `${name} Central Lowland`,
      householdsServed: 1250,
      lastTestedTurbidityNtu: 85.0,
      eColiRisk: 'High'
    },
    {
      id: `${zoneId}-ws-2`,
      name: `${name} Highland Deep Well & Solar Pump`,
      type: 'Deep Tube Well Overhead Tank',
      coordinates: comm4Coords,
      status: 'Operational',
      communityNear: `${name} Hillside Refuge Camp`,
      householdsServed: 950,
      lastTestedTurbidityNtu: 1.8,
      eColiRisk: 'Low'
    }
  ];

  const customSanitation: SanitationFacility[] = [
    {
      id: `${zoneId}-san-1`,
      name: `${name} Community Shelter Latrine Block`,
      type: 'Community Latrine Block',
      coordinates: [lat + dLat * 0.22, lng - dLng * 0.12],
      status: 'Flooded / Pit Overflow',
      communityNear: `${name} Central Lowland`,
      pitsSubmerged: true
    }
  ];

  const customHealth: HealthFacility[] = [
    {
      id: `${zoneId}-hf-1`,
      name: `${name} Regional Hospital`,
      type: 'District Hospital',
      coordinates: [lat - dLat * 0.20, lng + dLng * 0.15],
      bedCapacity: 120,
      status: 'Fully Operational',
      accessibilityStatus: 'ACCESSIBLE',
      ambulanceAccessible: true,
      orsCholeraKitsStock: 'Adequate'
    },
    {
      id: `${zoneId}-hf-2`,
      name: `${name} Primary Health Center`,
      type: 'Primary Health Center (PHC)',
      coordinates: [lat + dLat * 0.26, lng - dLng * 0.14],
      bedCapacity: 25,
      status: 'Partial Capacity - Ground Inundation',
      accessibilityStatus: 'LIMITED',
      ambulanceAccessible: false,
      orsCholeraKitsStock: 'Critical Shortage'
    }
  ];

  const customRoads: RoadSegment[] = [
    {
      id: `${zoneId}-road-1`,
      name: `${name} Primary Access Arterial Road`,
      type: 'Primary Highway',
      coordinates: [
        [lat - dLat * 0.40, lng - dLng * 0.40],
        [lat - dLat * 0.10, lng - dLng * 0.15],
        [lat + dLat * 0.20, lng - dLng * 0.10],
        [lat + dLat * 0.40, lng + dLng * 0.10]
      ],
      status: 'Severely Disrupted / Washed Out',
      disruptionCause: 'Culvert scoured and 1.4m of moving floodwaters overtopping road',
      detourDistanceKm: 8.9
    },
    {
      id: `${zoneId}-road-2`,
      name: `${name} Highland Bypass Route`,
      type: 'Feeder Road',
      coordinates: [
        [lat - dLat * 0.40, lng - dLng * 0.40],
        [lat - dLat * 0.20, lng - dLng * 0.45],
        comm4Coords,
        [lat + dLat * 0.30, lng - dLng * 0.30],
        [lat + dLat * 0.40, lng + dLng * 0.10]
      ],
      status: 'Open / Passable'
    }
  ];

  // Dynamic polygonal inundation around the center
  const customFloodPolygons: [number, number][][] = [
    [
      [lat + dLat * 0.40, lng - dLng * 0.20],
      [lat + dLat * 0.35, lng + dLng * 0.25],
      [lat + dLat * 0.10, lng + dLng * 0.45],
      [lat - dLat * 0.25, lng + dLng * 0.35],
      [lat - dLat * 0.40, lng + dLng * 0.05],
      [lat - dLat * 0.30, lng - dLng * 0.25],
      [lat + dLat * 0.05, lng - dLng * 0.35],
      [lat + dLat * 0.40, lng - dLng * 0.20]
    ]
  ];

  const customReports: CommunityReport[] = [
    {
      id: `${zoneId}-rep-1`,
      reporterName: 'Field Emergency Coordinator',
      isAnonymous: false,
      communityId: `${zoneId}-comm-1`,
      locationName: `${name} Lowland Shelter`,
      coordinates: comm1Coords,
      reportType: 'Water Contamination',
      description: `Rapid flood crest in ${name} has inundated municipal water supply intakes. Pit latrines are submerged with brown sewage water surrounding temporary shelters. Urgent need for clean potable water, chlorine treatment, and oral rehydration salts.`,
      severity: severity,
      timestamp: 'Just now (Live AOI Assessment)',
      status: 'Verified / Ground Confirmed',
      extractedInfo: {
        infrastructureImpacted: `${name} Municipal Intake Scheme`,
        damageCondition: 'Plinth under 1.5m floodwater; pumps offline',
        washThreatVectors: ['Biological contamination of shallow groundwater', 'Diarrheal outbreak risk'],
        confidenceScore: 0.96,
        recommendedEmergencyAction: 'Deploy mobile emergency water bladders and chlorine purification tablets'
      }
    }
  ];

  return {
    id: zoneId,
    name: `${name} (Global AOI)`,
    country: country || 'International',
    continent: 'Global',
    flag: '🌐',
    floodType: 'User Defined Global Flood AOI',
    center: [lat, lng],
    zoom: 11,
    bounds: [
      [lat - dLat * 0.6, lng - dLng * 0.6],
      [lat + dLat * 0.6, lng + dLng * 0.6]
    ],
    disasterDate: 'Live User Defined Area of Interest',
    situationSummary: `Real-time multi-criteria decision analysis (MCDA) executed for ${name} [${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E]. Synthetic fusion of all-weather satellite radar backscatter, Height Above Nearest Drainage (HAND) elevation, and OpenStreetMap infrastructure topology highlights severed road access and critical drinking water vulnerability.`,
    sensorSpecs: 'Global Sentinel-1 SAR Constellation + NASA GPM IMERG (Global 30-min) + Copernicus DEM',
    inundatedAreaSqKm: Math.round(Math.PI * Math.pow(radiusKm * 0.65, 2)),
    totalPopulation: 12400,
    isCustom: true,
    communities: customCommunities,
    waterSources: customWaterSources,
    sanitationFacilities: customSanitation,
    healthFacilities: customHealth,
    roads: customRoads,
    floodPolygons: customFloodPolygons,
    reports: customReports,
    riverCorridor: getRiverCorridorForZone(zoneId, lat, lng)
  };
}
