export type PriorityCategory = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type ExposureLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type AccessStatus = 'ACCESSIBLE' | 'LIMITED' | 'SEVERELY DISRUPTED' | 'INACCESSIBLE';

export interface Community {
  id: string;
  name: string;
  code: string;
  ward: string;
  ruralMunicipality: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  population: number;
  exposedPopulation: number;
  floodExposure: ExposureLevel;
  floodDepthMeters: number;
  inundatedAreaPct: number;
  mainWaterSource: string;
  mainWaterStatus: 'Potentially Disrupted' | 'Contaminated' | 'Submerged' | 'Functional' | 'Partially Functional';
  alternativeWaterSource: string;
  alternativeWaterDistanceStraightKm: number;
  alternativeWaterDistanceAccessibleKm: number;
  alternativeWaterReason: string;
  sanitationAffected: boolean;
  sanitationStatus: string;
  healthFacilityName: string;
  healthFacilityAccessibility: AccessStatus;
  healthDistanceStraightKm: number;
  healthDistanceAccessibleKm: number;
  healthAccessObstacle: string;
  roadAccessibility: AccessStatus;
  roadObstacle: string;
  confidenceIndicator: number; // 0.0 - 1.0 (e.g. 0.94)
  priorityScore: number; // 0 - 100
  priorityCategory: PriorityCategory;
  keyReasons: string[];
  recommendedInterventions: string[];
}

export interface WaterSource {
  id: string;
  name: string;
  type: 'Hand Pump / Shallow Tube Well' | 'Deep Tube Well Overhead Tank' | 'Piped Intake Scheme' | 'Gravity Flow Scheme' | 'Emergency Bladder Point';
  coordinates: [number, number];
  status: 'Submerged' | 'Contaminated' | 'Damaged' | 'Operational' | 'Standby';
  communityNear: string;
  householdsServed: number;
  lastTestedTurbidityNtu?: number;
  eColiRisk?: 'High' | 'Moderate' | 'Low';
}

export interface SanitationFacility {
  id: string;
  name: string;
  type: 'Community Latrine Block' | 'School Sanitation Facility' | 'Health Post WASH Block' | 'Public Market Facility';
  coordinates: [number, number];
  status: 'Flooded / Pit Overflow' | 'Damaged Superstructure' | 'Waterlogged' | 'Operational';
  communityNear: string;
  pitsSubmerged: boolean;
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'District Hospital' | 'Primary Health Center (PHC)' | 'Health Post (HP)' | 'Sub-Health Post';
  coordinates: [number, number];
  bedCapacity: number;
  status: 'Fully Operational' | 'Partial Capacity - Ground Inundation' | 'Emergency Triage Only';
  accessibilityStatus: AccessStatus;
  ambulanceAccessible: boolean;
  orsCholeraKitsStock: 'Adequate' | 'Critical Shortage' | 'Depleted';
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'Primary Highway' | 'Feeder Road' | 'Embankment Road' | 'Rural Track' | 'Bridge';
  coordinates: [number, number][]; // Polyline
  status: 'Open / Passable' | 'Flooded / High Clearance Only' | 'Severely Disrupted / Washed Out' | 'Bridge Damaged';
  disruptionCause?: string;
  detourDistanceKm?: number;
}

export type ReportType =
  | 'Water Contamination'
  | 'Latrine Overflow'
  | 'Road Cutoff'
  | 'Health Emergency'
  | 'Water source damaged'
  | 'Toilet/sanitation facility damaged'
  | 'Road blocked'
  | 'Bridge damaged'
  | 'Health facility inaccessible'
  | 'Community stranded'
  | 'Other';

export interface CommunityReport {
  id: string;
  reporterName?: string;
  reporterRole?: string;
  isAnonymous?: boolean;
  communityId: string;
  communityName?: string;
  locationName?: string;
  coordinates: [number, number];
  reportType: ReportType;
  description: string;
  photoUrl?: string;
  photoThumbnail?: string;
  photoCategory?: string;
  urgency?: PriorityCategory;
  severity?: PriorityCategory;
  timestamp: string;
  status: 'UNVERIFIED' | 'VERIFIED' | 'SATELLITE MATCHED' | 'Reported / Unverified' | 'Verified / Ground Confirmed';
  extractedInfo?: {
    waterStatus?: string;
    sanitationIssue?: string;
    accessStatus?: string;
    infrastructureImpacted?: string;
    damageCondition?: string;
    washThreatVectors?: string[];
    confidenceScore?: number;
    recommendedEmergencyAction?: string;
  };
}

export interface PriorityWeights {
  floodExposure: number; // default 25
  washDisruption: number; // default 25
  populationExposure: number; // default 20
  roadAccessibility: number; // default 15
  healthAccessibility: number; // default 15
}

export interface FilterState {
  search: string;
  district: string;
  priorityCategory: string;
  minPopulation: number;
  floodExposure: string;
  accessibility: string;
  facilityType: string;
}

export interface SatelliteLayerInfo {
  id: string;
  name: string;
  sensor: string;
  dateAcquired: string;
  resolution: string;
  description: string;
  badge: string;
}

export type EoAccessStatus = 'Open' | 'Restricted' | 'Commercial' | 'Open/Priced' | 'Model' | 'Partly open' | 'On request' | 'API/Public' | 'Varies' | 'Open (non-comm.)' | (string & {});

export type EoDataType = 'EO' | 'Non-EO' | 'Model';

export type EoImpactDomain = 'agriculture' | 'wildlife' | 'infrastructure_wash' | 'cross_cutting';

export interface EoDataset {
  id: string;
  name: string;
  tableNumber: number;
  thematicGroup: string;
  provider: string;
  resolution: string;
  revisit: string;
  primaryUse: string;
  dataType: EoDataType;
  access: EoAccessStatus;
  officialPortal: string;
  isIndianSource: boolean;
  impactDomains: EoImpactDomain[];
  relevanceToWASH: string;
}

export interface EoServicePortal {
  id: string;
  platform: string;
  provider: string;
  services: string; // e.g. "Flood (I, M, E); Cyclone (I)..."
  serviceTypes: ('I' | 'M' | 'E' | 'A' | 'F')[];
  coverage: string;
  webLink: string;
  description?: string;
}

export interface RiverGaugingStation {
  id: string;
  name: string;
  riverName: string;
  basin?: string;
  coordinates: [number, number];
  currentStageM: number;
  dangerStageM: number;
  warningStageM: number;
  dischargeCusecs: number;
  dischargeM3s: number;
  trend: 'Rising Rapidly' | 'Rising' | 'Steady' | 'Falling';
  alertStatus: 'Danger Exceeded' | 'Warning' | 'High Flow' | 'Normal';
  flowVelocityMs: number;
  turbidityNtu: number;
  lastUpdated: string;
  description?: string;
}

export interface EmbankmentSection {
  id: string;
  name: string;
  type: 'Left Afflux Bund' | 'Right Afflux Bund' | 'Guide Bund' | 'Spur Levee' | 'Natural Ridge';
  coordinates: [number, number][];
  status: 'Intact' | 'Breached / Washed Away' | 'Severe Seepage / Piping' | 'Overtopping Threat';
  breachWidthM?: number;
  breachOutflowCusecs?: number;
  crestElevationM?: number;
  lengthKm?: number;
  bank?: 'Left Bank' | 'Right Bank';
  description: string;
}

export interface RiverChannelSegment {
  id: string;
  name: string;
  type: 'main_thalweg' | 'braided_chute' | 'secondary_anabranch' | 'paleochannel_inundation';
  coordinates: [number, number][];
  widthM: number;
  depthM: number;
  waterVelocityMs: number;
  flowDirectionDeg?: number;
  dischargeCusecs?: number;
}

export interface RiverSandbarIsland {
  id: string;
  name: string;
  type: 'Alluvial Island (Tappu / Char)' | 'Mid-Channel Sandbar' | 'Point Bar / Silt Spit';
  coordinates: [number, number][];
  areaHectares: number;
  isFlooded: boolean;
  submersionPct: number;
  vegetationCover?: string;
}

export interface RiverFlowVector {
  id: string;
  coordinates: [number, number];
  angleDeg: number;
  velocityMs: number;
  label: string;
}

export interface RiverDepthZone {
  id: string;
  name: string;
  depthRange: string;
  category: 'deep_channel' | 'submerged_floodplain' | 'shallow_waterlogging';
  color: string;
  fillOpacity: number;
  coordinates: [number, number][];
}

export interface RiverMicroSpur {
  id: string;
  name: string;
  type: 'boulder_spur' | 'impermeable_groyne' | 'permeable_bamboo_screen' | 'submerged_weir';
  coordinates: [number, number][]; // [root on levee, nose in river]
  lengthM: number;
  condition: 'Intact Armor' | 'Nose Scour Observed' | 'Partially Damaged' | 'Submerged';
  scourDepthM: number;
  flowDeflectionDeg: number;
}

export interface RiverDepthSounding {
  id: string;
  coordinates: [number, number];
  depthM: number;
  channelType: 'Thalweg Deep' | 'Braided Riffle' | 'Bar Fringing Shoal' | 'Floodplain Inundation';
  velocityMs: number;
  bottomSediment: 'Fine Silt' | 'Coarse Sand' | 'Gravel Bed' | 'Sandy Shoal';
}

export interface HydraulicStructure {
  id: string;
  name: string;
  type: 'sluice_gate' | 'drainage_culvert' | 'emergency_boat_ghat' | 'pump_intake' | 'barrage_pier';
  coordinates: [number, number];
  status: 'Operational' | 'Submerged / Backwater' | 'Active Evacuation Point' | 'Damaged';
  capacityDescription: string;
  icon?: string;
}

export interface RiverTurbulenceVortex {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'breach_scour_jet' | 'eddy_vortex' | 'channel_confluence_shear';
  velocityMs: number;
  diameterM: number;
  dangerLevel: 'EXTREME' | 'HIGH' | 'MODERATE';
}

export interface RiverIsobathContour {
  id: string;
  name: string;
  depthM: number;
  coordinates: [number, number][];
  contourType: 'thalweg_trench' | 'deep_navigable' | 'intermediate' | 'shoal_margin';
  isDynamicScour?: boolean;
}

export interface RiverCutbankErosion {
  id: string;
  name: string;
  coordinates: [number, number][];
  scourSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  bankRetreatRateMPerYear: number;
  bankHeightM: number;
  vulnerableAsset: string;
  soilComposition: string;
}

export interface RiverOxbowWetland {
  id: string;
  name: string;
  coordinates: [number, number][];
  surfaceAreaHa: number;
  depthM: number;
  retentionCapacityMillionM3: number;
  bufferingStatus: 'Active Flood Retention' | 'Critical Storage' | 'Natural Spillway';
  vegetationDensity: string;
}

export interface RiverCrossTransect {
  id: string;
  name: string;
  code: string;
  coordinates: [[number, number], [number, number]];
  chainageKm: number;
  riverWidthM: number;
  maxDepthM: number;
  thalwegElevationM: number;
  elevationPoints: { distanceM: number; elevationM: number; depthM: number; label?: string }[];
}

export interface RiverTributaryFeeder {
  id: string;
  name: string;
  type: 'mountain_torrent' | 'irrigation_escape' | 'alluvial_drainage' | 'confluent_river';
  coordinates: [number, number][];
  inflowCusecs: number;
  widthM: number;
  confluenceLocation: string;
  sedimentLoad: 'High Glacial/Silt' | 'Moderate Bedload' | 'Low Suspended';
}

export interface RiverBarrageGateGroup {
  barrageName: string;
  totalGates: number;
  gatesOpen: number;
  pondLevelM: number;
  tailwaterLevelM: number;
  affluxHeadM: number;
  coordinates: [number, number];
  gateStatuses: { gateRange: string; status: 'Open (Discharging)' | 'Silted Sill' | 'Partial Hoist'; dischargeShare: number }[];
}

export interface RiverCorridorData {
  riverName: string;
  catchmentSqKm: number;
  corridorWidthKm: number;
  description: string;
  currentDischargeStatus?: string;
  basinRegion?: string;
  channels: RiverChannelSegment[];
  sandbars: RiverSandbarIsland[];
  embankments: EmbankmentSection[];
  gaugingStations: RiverGaugingStation[];
  flowVectors: RiverFlowVector[];
  depthZones: RiverDepthZone[];
  microSpurs?: RiverMicroSpur[];
  depthSoundings?: RiverDepthSounding[];
  hydraulicStructures?: HydraulicStructure[];
  turbulenceVortices?: RiverTurbulenceVortex[];
  isobaths?: RiverIsobathContour[];
  cutbankErosionZones?: RiverCutbankErosion[];
  oxbowWetlands?: RiverOxbowWetland[];
  crossTransects?: RiverCrossTransect[];
  tributaryFeeders?: RiverTributaryFeeder[];
  barrageDetails?: RiverBarrageGateGroup;
}

export interface GlobalDisasterZone {
  id: string;
  name: string;
  country: string;
  continent: string;
  flag: string;
  floodType: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds?: [[number, number], [number, number]];
  disasterDate: string;
  situationSummary: string;
  sensorSpecs: string;
  inundatedAreaSqKm: number;
  totalPopulation: number;
  isCustom?: boolean;
  communities: Community[];
  waterSources: WaterSource[];
  sanitationFacilities: SanitationFacility[];
  healthFacilities: HealthFacility[];
  roads: RoadSegment[];
  floodPolygons: [number, number][][];
  reports: CommunityReport[];
  riverCorridor?: RiverCorridorData;
}



