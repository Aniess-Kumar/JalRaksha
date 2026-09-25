import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Filter, 
  Layers, 
  AlertTriangle, 
  Droplet, 
  Building2, 
  Trash2, 
  Compass, 
  Maximize2, 
  Check, 
  X, 
  Info,
  ChevronRight,
  Route,
  Activity,
  Search,
  ExternalLink,
  Ruler,
  Navigation,
  Eye,
  Sliders,
  MapPin,
  Maximize,
  Minimize,
  Radio,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe,
  Waves,
  Gauge,
  ShieldAlert,
  ArrowDownRight,
  Droplets,
  Sparkles,
  BarChart2,
  Mountain,
  Grid,
  Anchor,
  TrendingDown
} from 'lucide-react';
import { 
  Community, 
  WaterSource, 
  SanitationFacility, 
  HealthFacility, 
  RoadSegment, 
  CommunityReport, 
  FilterState,
  PriorityCategory,
  GlobalDisasterZone,
  RiverCorridorData,
  RiverGaugingStation,
  EmbankmentSection,
  RiverChannelSegment,
  RiverSandbarIsland,
  RiverIsobathContour,
  RiverCutbankErosion,
  RiverOxbowWetland,
  RiverCrossTransect,
  RiverTributaryFeeder
} from '../types';
import { MOCK_FLOOD_POLYGONS } from '../data/mockData';
import { GLOBAL_DISASTER_ZONES } from '../data/globalDisasterZones';
import { KOSHI_RIVER_CORRIDOR, getRiverCorridorForZone } from '../data/riverCorridors';
import { TabId } from './Navbar';
import { getCommunityRouteData, RouteInspectionData } from '../utils/mapRouteHelper';
import { interpolateCatmullRomSpline } from '../utils/riverInterpolation';

interface DisasterMapProps {
  communities: Community[];
  waterSources: WaterSource[];
  sanitationFacilities: SanitationFacility[];
  healthFacilities: HealthFacility[];
  roads: RoadSegment[];
  reports: CommunityReport[];
  selectedCommunity: Community | null;
  onSelectCommunity: (comm: Community | null) => void;
  onNavigateTab: (tab: TabId) => void;
  activeLayerPreset?: string;
  theme?: 'dark' | 'light';
  activeZone?: GlobalDisasterZone;
  floodPolygons?: [number, number][][];
  onOpenZoneSelector?: () => void;
  onSelectZone?: (zone: GlobalDisasterZone) => void;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  communities,
  waterSources,
  sanitationFacilities,
  healthFacilities,
  roads,
  reports,
  selectedCommunity,
  onSelectCommunity,
  onNavigateTab,
  theme = 'dark',
  activeZone,
  floodPolygons,
  onOpenZoneSelector,
  onSelectZone,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelTileLayerRef = useRef<L.TileLayer | null>(null);
  const scaleControlRef = useRef<L.Control.Scale | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  // Basemap style - Default to high-resolution photorealistic satellite imagery for realistic river corridor visualization
  const [basemap, setBasemap] = useState<'satellite' | 'topo' | 'opentopo' | 'dark' | 'osm'>('satellite');

  // Community profile card minimizable state
  const [isProfileMinimized, setIsProfileMinimized] = useState<boolean>(false);

  // Flood Extent Opacity Slider
  const [floodOpacity, setFloodOpacity] = useState<number>(0.45);

  // Detour Route Inspection on Map
  const [showRouteAnalysis, setShowRouteAnalysis] = useState<boolean>(true);
  const [routeFacilityTarget, setRouteFacilityTarget] = useState<'water' | 'health'>('water');

  // Interactive Measurement Ruler Tool
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measureDistanceKm, setMeasureDistanceKm] = useState<number | null>(null);

  // Live cursor coordinates
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Bottom Community Quick-Select Dock
  const [showBottomDock, setShowBottomDock] = useState<boolean>(true);

  // Layer Visibility Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    floodExtent: true,
    settlements: true,
    waterSources: true,
    sanitation: true,
    health: true,
    roads: true,
    reports: true,
    criticalOnly: false,
  });

  // River Corridor Realism Controls & Fine Hydrography
  const [riverVisibility, setRiverVisibility] = useState({
    corridor: true,
    channels: true,
    sandbars: true,
    embankments: true,
    gaugingStations: true,
    flowVectors: true,
    depthGradient: true,
    microSpurs: true,
    depthSoundings: true,
    hydraulicStructures: true,
    turbulences: true,
    isobaths: true,
    erosionZones: true,
    oxbowWetlands: true,
    crossTransects: true,
    tributaries: true,
    geoElevationContours: true,
    geoGraticule: false,
  });

  const [selectedRiverFeature, setSelectedRiverFeature] = useState<{
    type: 'gauge' | 'embankment' | 'channel' | 'sandbar' | 'spur' | 'sounding' | 'structure' | 'turbulence' | 'isobath' | 'erosion' | 'wetland' | 'transect' | 'tributary';
    data: any;
  } | null>(null);

  const [showRiverToolbar, setShowRiverToolbar] = useState<boolean>(true);
  const [currentZoom, setCurrentZoom] = useState<number>(11);
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => activeZone?.center || [26.585, 87.03]);

  // Dynamic River Corridor Data: adapts smoothly when moving across regions or selecting zones!
  const activeCorridor: RiverCorridorData = useMemo(() => {
    // 1. If activeZone is defined and map position is in activeZone's general catchment (~0.55 deg / ~60km)
    if (activeZone?.riverCorridor) {
      const dLat = Math.abs(mapCenter[0] - activeZone.center[0]);
      const dLng = Math.abs(mapCenter[1] - activeZone.center[1]);
      if (dLat < 0.55 && dLng < 0.55) {
        return activeZone.riverCorridor;
      }
    }
    // 2. Check if user is near another known global disaster zone
    const nearbyZone = GLOBAL_DISASTER_ZONES.find((z) => {
      const dLat = Math.abs(mapCenter[0] - z.center[0]);
      const dLng = Math.abs(mapCenter[1] - z.center[1]);
      return dLat < 0.55 && dLng < 0.55;
    });
    if (nearbyZone) {
      return nearbyZone.riverCorridor || getRiverCorridorForZone(nearbyZone.id, nearbyZone.center[0], nearbyZone.center[1]);
    }
    // 3. User panned/moved to any other location on Earth: generate real-time realistic hydrological system for current coordinates!
    return getRiverCorridorForZone(
      `basin-${mapCenter[0].toFixed(2)}-${mapCenter[1].toFixed(2)}`,
      mapCenter[0],
      mapCenter[1]
    );
  }, [activeZone, mapCenter]);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    district: 'All',
    priorityCategory: 'All',
    minPopulation: 0,
    floodExposure: 'All',
    accessibility: 'All',
    facilityType: 'All',
  });

  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Nepal Koshi Basin center
    const map = L.map(mapContainerRef.current, {
      center: [26.585, 87.03],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add metric scale bar
    const scaleControl = L.control.scale({
      position: 'bottomright',
      imperial: false,
      metric: true,
    }).addTo(map);
    scaleControlRef.current = scaleControl;

    // Track mouse coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({
        lat: Math.round(e.latlng.lat * 10000) / 10000,
        lng: Math.round(e.latlng.lng * 10000) / 10000,
      });
    });

    // Track zoom level changes for real-time Level of Detail (LOD)
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Track map center when the user moves/pans to change map according to location
    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter([
        Math.round(center.lat * 10000) / 10000,
        Math.round(center.lng * 10000) / 10000,
      ]);
    });

    mapInstanceRef.current = map;

    // Create layer groups (hydrological layers ordered bottom-to-top)
    const geoElevationLayer = L.layerGroup().addTo(map);
    const geoGraticuleLayer = L.layerGroup().addTo(map);
    const riverDepthLayer = L.layerGroup().addTo(map);
    const riverWetlandsLayer = L.layerGroup().addTo(map);
    const riverSandbarsLayer = L.layerGroup().addTo(map);
    const riverChannelsLayer = L.layerGroup().addTo(map);
    const riverTributariesLayer = L.layerGroup().addTo(map);
    const riverIsobathsLayer = L.layerGroup().addTo(map);
    const riverEmbankmentsLayer = L.layerGroup().addTo(map);
    const riverErosionLayer = L.layerGroup().addTo(map);
    const riverMicroSpursLayer = L.layerGroup().addTo(map);
    const riverTransectsLayer = L.layerGroup().addTo(map);
    const riverSoundingsLayer = L.layerGroup().addTo(map);
    const riverStructuresLayer = L.layerGroup().addTo(map);
    const riverTurbulenceLayer = L.layerGroup().addTo(map);
    const riverVectorsLayer = L.layerGroup().addTo(map);
    const riverGaugesLayer = L.layerGroup().addTo(map);
    const floodLayer = L.layerGroup().addTo(map);
    const settlementsLayer = L.layerGroup().addTo(map);
    const waterLayer = L.layerGroup().addTo(map);
    const sanitationLayer = L.layerGroup().addTo(map);
    const healthLayer = L.layerGroup().addTo(map);
    const roadLayer = L.layerGroup().addTo(map);
    const reportsLayer = L.layerGroup().addTo(map);
    const routesLayer = L.layerGroup().addTo(map);
    const measureLayer = L.layerGroup().addTo(map);

    layerGroupsRef.current = {
      geoElevation: geoElevationLayer,
      geoGraticule: geoGraticuleLayer,
      riverDepth: riverDepthLayer,
      riverWetlands: riverWetlandsLayer,
      riverSandbars: riverSandbarsLayer,
      riverChannels: riverChannelsLayer,
      riverTributaries: riverTributariesLayer,
      riverIsobaths: riverIsobathsLayer,
      riverEmbankments: riverEmbankmentsLayer,
      riverErosion: riverErosionLayer,
      riverMicroSpurs: riverMicroSpursLayer,
      riverTransects: riverTransectsLayer,
      riverSoundings: riverSoundingsLayer,
      riverStructures: riverStructuresLayer,
      riverTurbulence: riverTurbulenceLayer,
      riverVectors: riverVectorsLayer,
      riverGauges: riverGaugesLayer,
      flood: floodLayer,
      settlements: settlementsLayer,
      water: waterLayer,
      sanitation: sanitationLayer,
      health: healthLayer,
      roads: roadLayer,
      reports: reportsLayer,
      routes: routesLayer,
      measure: measureLayer,
    };

    return () => {
      if (baseTileLayerRef.current) {
        map.removeLayer(baseTileLayerRef.current);
        baseTileLayerRef.current = null;
      }
      if (labelTileLayerRef.current) {
        map.removeLayer(labelTileLayerRef.current);
        labelTileLayerRef.current = null;
      }
      layerGroupsRef.current = {};
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2A. Setup global window handler for map popup zone activation
  useEffect(() => {
    (window as any).__jalrakshaSelectZone = (zoneId: string) => {
      const target = GLOBAL_DISASTER_ZONES.find((z) => z.id === zoneId);
      if (target && onSelectZone) {
        onSelectZone(target);
      }
    };
    return () => {
      delete (window as any).__jalrakshaSelectZone;
    };
  }, [onSelectZone]);

  // 2B. Auto-Center & Bounds Fit when activeZone changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeZone) return;

    if (activeZone.bounds && activeZone.bounds.length === 2) {
      map.fitBounds(activeZone.bounds, { padding: [40, 40], maxZoom: 13, animate: true });
    } else if (activeZone.center) {
      map.flyTo(activeZone.center, activeZone.zoom || 11, { duration: 1.2 });
    }
  }, [activeZone]);

  // 2C. Update Basemap Tiles (100% Free, NO API Key Required, Zero Watermarks)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (labelTileLayerRef.current) {
      map.removeLayer(labelTileLayerRef.current);
      labelTileLayerRef.current = null;
    }

    if (basemap === 'dark') {
      // Esri World Dark Gray Base + Reference Labels: Clean dark GIS canvas with NO API key needed
      const baseLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, HERE, Garmin, OpenStreetMap contributors',
          maxZoom: 18,
        }
      );
      const labelLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '',
          maxZoom: 18,
          opacity: 0.9,
        }
      );
      baseLayer.addTo(map);
      labelLayer.addTo(map);
      baseTileLayerRef.current = baseLayer;
      labelTileLayerRef.current = labelLayer;
    } else if (basemap === 'satellite') {
      // Esri World Imagery + boundary/places overlay, NO API key needed
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      );
      const labelLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '',
          maxZoom: 19,
          opacity: 0.85,
        }
      );
      satLayer.addTo(map);
      labelLayer.addTo(map);
      baseTileLayerRef.current = satLayer;
      labelTileLayerRef.current = labelLayer;
    } else if (basemap === 'opentopo') {
      // OpenTopoMap: High-precision topographic contours, benchmarks, and shaded relief
      const opentopoLayer = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenTopoMap (CC-BY-SA), SRTM',
          maxZoom: 17,
        }
      );
      opentopoLayer.addTo(map);
      baseTileLayerRef.current = opentopoLayer;
    } else if (basemap === 'topo') {
      // Esri World Topographic Map with contours and shaded relief, NO API key needed
      const topoLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, Intermap, USGS, METI/NASA',
          maxZoom: 18,
        }
      );
      topoLayer.addTo(map);
      baseTileLayerRef.current = topoLayer;
    } else {
      // OpenStreetMap standard: 100% free open community tiles, NO API key needed
      const osmLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }
      );
      osmLayer.addTo(map);
      baseTileLayerRef.current = osmLayer;
    }
  }, [basemap]);

  // 3. Filter communities
  const filteredCommunities = communities.filter((comm) => {
    if (filterState.search && !comm.name.toLowerCase().includes(filterState.search.toLowerCase()) && !comm.district.toLowerCase().includes(filterState.search.toLowerCase())) {
      return false;
    }
    if (filterState.district !== 'All' && comm.district !== filterState.district) {
      return false;
    }
    if (filterState.priorityCategory !== 'All' && comm.priorityCategory !== filterState.priorityCategory) {
      return false;
    }
    if (filterState.floodExposure !== 'All' && comm.floodExposure !== filterState.floodExposure) {
      return false;
    }
    if (filterState.accessibility !== 'All' && comm.roadAccessibility !== filterState.accessibility) {
      return false;
    }
    if (comm.population < filterState.minPopulation) {
      return false;
    }
    if (layerVisibility.criticalOnly && comm.priorityCategory !== 'CRITICAL') {
      return false;
    }
    return true;
  });

  // 4. Draw Core Layers (Flood, Roads, Water, Sanitation, Health, Reports, Settlements)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current?.settlements) return;

    const { flood, settlements, water, sanitation, health, roads: roadsLayer, reports: repsLayer } = layerGroupsRef.current;
    if (!flood || !settlements || !water || !sanitation || !health || !roadsLayer || !repsLayer) return;

    // A. Flood Extent with variable opacity slider
    flood.clearLayers();
    if (layerVisibility.floodExtent) {
      const activePolygons = floodPolygons || activeZone?.floodPolygons || MOCK_FLOOD_POLYGONS;
      activePolygons.forEach((coords) => {
        const poly = L.polygon(coords, {
          color: '#0284c7',
          weight: 2,
          fillColor: '#0369a1',
          fillOpacity: floodOpacity,
          dashArray: '4, 4',
        });
        poly.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; padding: 4px; color: #f8fafc;">
            <strong style="color: #38bdf8;">${activeZone?.name || 'Copernicus Sentinel-1'} SAR Inundation</strong><br/>
            <span>Type: ${activeZone?.floodType || 'Flood Inundation'}</span><br/>
            <span>Sensor: ${activeZone?.sensorSpecs || 'C-Band SAR VV/VH Polarimetry'}</span><br/>
            <span>Extent: ~${activeZone?.inundatedAreaSqKm || 184} km² active inundation</span>
          </div>
        `);
        poly.addTo(flood);
      });
    }

    // B. Roads with disruption styles
    roadsLayer.clearLayers();
    if (layerVisibility.roads) {
      roads.forEach((road) => {
        const isDisrupted = road.status.includes('Severely Disrupted') || road.status.includes('Washed Out');
        const isFlooded = road.status.includes('High Clearance Only');
        const isDetour = road.name.includes('Detour');

        const poly = L.polyline(road.coordinates, {
          color: isDisrupted ? '#ef4444' : isFlooded ? '#f59e0b' : isDetour ? '#06b6d4' : '#64748b',
          weight: isDisrupted ? 4 : isDetour ? 3.5 : 2.5,
          dashArray: isDisrupted ? '6, 6' : isDetour ? '2, 4' : undefined,
          opacity: 0.9,
        });

        poly.bindTooltip(`${road.name} • ${road.status}`, {
          sticky: true,
          direction: 'top',
        });

        poly.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
            <strong style="color: #38bdf8;">${road.name}</strong> (${road.type})<br/>
            Status: <span style="font-weight: bold; color: ${isDisrupted ? '#f87171' : '#34d399'}">${road.status}</span><br/>
            ${road.disruptionCause ? `<span>Impact: ${road.disruptionCause}</span><br/>` : ''}
            ${road.detourDistanceKm ? `<span>Detour Gap: +${road.detourDistanceKm} km</span>` : ''}
          </div>
        `);
        poly.addTo(roadsLayer);
      });
    }

    // C. Water Sources
    water.clearLayers();
    if (layerVisibility.waterSources) {
      waterSources.forEach((ws) => {
        const isSubmerged = ws.status === 'Submerged' || ws.status === 'Contaminated';
        const color = isSubmerged ? '#dc2626' : ws.status === 'Damaged' ? '#ea580c' : '#0284c7';
        
        const icon = L.divIcon({
          className: 'custom-water-marker',
          html: `<div style="background-color: ${color}; width: 13px; height: 13px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);"></div>`,
          iconSize: [13, 13],
          iconAnchor: [6.5, 6.5],
        });

        const marker = L.marker(ws.coordinates, { icon });
        marker.bindTooltip(`${ws.name} (${ws.status})`, { direction: 'top' });
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
            <strong style="color: #38bdf8;">${ws.name}</strong><br/>
            Type: ${ws.type}<br/>
            Status: <span style="color: ${isSubmerged ? '#f87171' : '#38bdf8'}; font-weight: bold;">${ws.status}</span><br/>
            Households Served: ${ws.householdsServed}<br/>
            ${ws.eColiRisk ? `Contamination Risk: <strong>${ws.eColiRisk}</strong>` : ''}
          </div>
        `);
        marker.addTo(water);
      });
    }

    // D. Sanitation Facilities
    sanitation.clearLayers();
    if (layerVisibility.sanitation) {
      sanitationFacilities.forEach((san) => {
        const isAffected = san.status.includes('Flooded') || san.pitsSubmerged;
        const color = isAffected ? '#ea580c' : '#10b981';

        const icon = L.divIcon({
          className: 'custom-san-marker',
          html: `<div style="background-color: ${color}; width: 12px; height: 12px; transform: rotate(45deg); border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker(san.coordinates, { icon });
        marker.bindTooltip(`${san.name} (${san.status})`, { direction: 'top' });
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
            <strong style="color: #fb923c;">${san.name}</strong><br/>
            Type: ${san.type}<br/>
            Status: <span style="color: ${color}; font-weight: bold;">${san.status}</span><br/>
            Pits Submerged: ${san.pitsSubmerged ? 'YES (Fecal Pathogen Hazard)' : 'No'}
          </div>
        `);
        marker.addTo(sanitation);
      });
    }

    // E. Health Facilities
    health.clearLayers();
    if (layerVisibility.health) {
      healthFacilities.forEach((hf) => {
        const isCut = hf.accessibilityStatus !== 'ACCESSIBLE';
        const color = isCut ? '#f43f5e' : '#10b981';

        const icon = L.divIcon({
          className: 'custom-health-marker',
          html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 4px; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: white; box-shadow: 0 0 6px rgba(0,0,0,0.6);">+</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker(hf.coordinates, { icon });
        marker.bindTooltip(`${hf.name} • ${hf.accessibilityStatus}`, { direction: 'top' });
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
            <strong style="color: #f43f5e;">${hf.name}</strong><br/>
            Type: ${hf.type}<br/>
            Status: ${hf.status}<br/>
            Access: <strong style="color: ${color};">${hf.accessibilityStatus}</strong><br/>
            ORS/Cholera Kits: ${hf.orsCholeraKitsStock} units
          </div>
        `);
        marker.addTo(health);
      });
    }

    // F. Citizen Field Reports
    repsLayer.clearLayers();
    if (layerVisibility.reports) {
      reports.forEach((rep) => {
        const icon = L.divIcon({
          className: 'custom-rep-marker',
          html: `<div style="background-color: #eab308; color: black; font-size: 10px; font-weight: bold; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);">!</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker(rep.coordinates, { icon });
        marker.bindTooltip(`Report: ${rep.reportType} [${rep.status}]`, { direction: 'top' });
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc; max-width: 220px;">
            <strong style="color: #fbbf24;">FIELD REPORT: ${rep.reportType}</strong><br/>
            <span style="color: #fef08a; font-weight: bold;">[${rep.status}]</span><br/>
            <p style="margin: 4px 0; color: #cbd5e1;">"${rep.description.slice(0, 100)}..."</p>
            <span style="font-size: 9px; color: #94a3b8;">${rep.timestamp}</span>
          </div>
        `);
        marker.addTo(repsLayer);
      });
    }

    // G. Settlements with Hover Tooltips and Pulsing Ring on Selected
    settlements.clearLayers();
    if (layerVisibility.settlements) {
      filteredCommunities.forEach((comm) => {
        const isCritical = comm.priorityCategory === 'CRITICAL';
        const isHigh = comm.priorityCategory === 'HIGH';
        const isModerate = comm.priorityCategory === 'MODERATE';
        const isSelected = selectedCommunity?.id === comm.id;

        const color = isCritical ? '#dc2626' : isHigh ? '#ea580c' : isModerate ? '#eab308' : '#06b6d4';
        const size = isSelected ? 28 : isCritical ? 24 : isHigh ? 20 : 18;

        const icon = L.divIcon({
          className: 'custom-settlement-marker',
          html: `
            <div style="position: relative; width: ${size}px; height: ${size}px;">
              ${isSelected ? `<div class="pulsing-radar" style="position: absolute; inset: -8px; border-radius: 50%; border: 2px solid #38bdf8; pointer-events: none;"></div>` : ''}
              <div style="
                background: ${color};
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: ${isSelected ? '3px solid #38bdf8' : '2px solid white'};
                box-shadow: 0 0 ${isSelected ? '14px #38bdf8' : '8px rgba(0,0,0,0.7)'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: monospace;
                font-size: 10px;
                font-weight: bold;
                cursor: pointer;
              ">
                ${comm.priorityScore}
              </div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker(comm.coordinates, { icon });
        marker.on('click', () => {
          onSelectCommunity(comm);
          setIsProfileMinimized(false);
        });

        // Fast hover tooltip
        marker.bindTooltip(`
          <strong>${comm.name}</strong> • Priority: ${comm.priorityScore} (${comm.priorityCategory})<br/>
          <span>Exposed: ${comm.exposedPopulation.toLocaleString()} | Flood: ${comm.floodDepthMeters}m</span>
        `, { direction: 'top', sticky: false });

        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc; min-width: 190px;">
            <strong style="font-size: 12px; color: #38bdf8;">${comm.name}</strong> (${comm.district})<br/>
            <span>Priority: <strong style="color: ${color};">${comm.priorityScore} (${comm.priorityCategory})</strong></span><br/>
            <span>Exposed: ${comm.exposedPopulation.toLocaleString()} / ${comm.population.toLocaleString()}</span><br/>
            <span>Flood Depth: ${comm.floodDepthMeters}m (${comm.floodExposure})</span><br/>
            <span>Road Access: <strong>${comm.roadAccessibility}</strong></span><br/>
            <span>Water Disruption: <strong>${comm.mainWaterStatus}</strong></span>
          </div>
        `);

        marker.addTo(settlements);
      });
    }
  }, [
    filteredCommunities, 
    layerVisibility, 
    waterSources, 
    sanitationFacilities, 
    healthFacilities, 
    roads, 
    reports, 
    selectedCommunity, 
    onSelectCommunity,
    floodOpacity,
    activeZone,
    floodPolygons
  ]);

  // 4B. River Corridor Realism Rendering Hook
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current) return;

    const {
      geoElevation,
      geoGraticule,
      riverDepth,
      riverWetlands,
      riverSandbars,
      riverChannels,
      riverTributaries,
      riverIsobaths,
      riverEmbankments,
      riverErosion,
      riverMicroSpurs,
      riverTransects,
      riverSoundings,
      riverStructures,
      riverTurbulence,
      riverGauges,
      riverVectors,
    } = layerGroupsRef.current;

    if (!riverDepth || !riverSandbars || !riverChannels || !riverEmbankments || !riverGauges || !riverVectors) {
      return;
    }

    // 1. Clear existing corridor and geo layers
    geoElevation?.clearLayers();
    geoGraticule?.clearLayers();
    riverDepth?.clearLayers();
    riverWetlands?.clearLayers();
    riverSandbars?.clearLayers();
    riverChannels?.clearLayers();
    riverTributaries?.clearLayers();
    riverIsobaths?.clearLayers();
    riverEmbankments?.clearLayers();
    riverErosion?.clearLayers();
    riverMicroSpurs?.clearLayers();
    riverTransects?.clearLayers();
    riverSoundings?.clearLayers();
    riverStructures?.clearLayers();
    riverTurbulence?.clearLayers();
    riverGauges?.clearLayers();
    riverVectors?.clearLayers();

    if (!riverVisibility.corridor || !activeCorridor) return;

    // Dynamic Zoom Level of Detail (LOD) scaling factor for realistic stream widths
    const zoomScale = currentZoom >= 16 ? 2.8 : currentZoom >= 14 ? 1.9 : currentZoom >= 13 ? 1.4 : 1.0;

    // A. Bathymetric Multi-Depth Zones (Realistic Hydrological Gradient)
    if (riverVisibility.depthGradient && activeCorridor.depthZones) {
      activeCorridor.depthZones.forEach((dz) => {
        const isDeep = dz.category === 'deep_channel';
        const isSubmerged = dz.category === 'submerged_floodplain';
        
        // Natural water depth coloration: deep river azure, alluvial flood cerulean, waterlogged silt cyan
        const polyColor = isDeep ? '#0369a1' : isSubmerged ? '#0284c7' : '#0891b2';
        const polyFill = isDeep ? '#075985' : isSubmerged ? '#0ea5e9' : '#06b6d4';
        const polyOpacity = isDeep 
          ? Math.min(0.72, 0.58 * (floodOpacity / 0.45))
          : isSubmerged 
          ? Math.min(0.52, 0.38 * (floodOpacity / 0.45))
          : Math.min(0.32, 0.22 * (floodOpacity / 0.45));

        const poly = L.polygon(dz.coordinates, {
          color: polyColor,
          weight: isDeep ? 1.5 : 0.8,
          opacity: 0.85,
          fillColor: polyFill,
          fillOpacity: polyOpacity,
          className: 'realistic-river-bed',
        });

        poly.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #38bdf8;">${dz.name}</strong><br/>
            <span>Depth Range: ${dz.depthRange}</span><br/>
            <span>Hydraulic Zone: ${dz.category.replace('_', ' ').toUpperCase()}</span>
          </div>
        `, { sticky: true, direction: 'top' });

        poly.addTo(riverDepth);
      });
    }

    // B. Alluvial Islands & Sandbars ("Chars / Tappu" with realistic river sand and silt tones)
    if (riverVisibility.sandbars && activeCorridor.sandbars) {
      activeCorridor.sandbars.forEach((sb) => {
        // Natural river sand tones: alluvial buff, fine silt sand with natural shoreline contour (no cartoon dashes)
        const poly = L.polygon(sb.coordinates, {
          color: '#cbb07c',
          weight: 1.5,
          opacity: 0.95,
          fillColor: '#ecd599',
          fillOpacity: sb.submersionPct > 70 ? 0.65 : 0.82,
          className: 'realistic-sandbar-island',
        });

        poly.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #f59e0b;">🏝️ ${sb.name}</strong><br/>
            <span>Type: Alluvial Island Char (Silt Sandbar)</span><br/>
            <span>Area: ${sb.areaHectares} ha | Submersion: <strong style="color: ${sb.submersionPct > 70 ? '#f87171' : '#f59e0b'};">${sb.submersionPct}%</strong></span><br/>
            <span>Vegetation: ${sb.vegetationCover || 'Riparian Marsh Grass & Silt'}</span>
          </div>
        `, { sticky: true });

        poly.on('click', () => {
          setSelectedRiverFeature({ type: 'sandbar', data: sb });
        });

        poly.addTo(riverSandbars);
      });
    }

    // C. River Channels (Multi-Pass Living Water Currents & Streamflow with Spline Smoothing)
    if (riverVisibility.channels && activeCorridor.channels) {
      activeCorridor.channels.forEach((ch) => {
        const isThalweg = ch.type === 'main_thalweg';
        const isBreachAvulsion = ch.type === 'paleochannel_inundation';
        const smoothChCoords = interpolateCatmullRomSpline(ch.coordinates, 4);

        // Pass 1: Outer Riverbed Bathymetric Trench (gives depth & soft natural edge)
        const bedTrench = L.polyline(smoothChCoords, {
          color: isBreachAvulsion ? '#7f1d1d' : isThalweg ? '#075985' : '#0369a1',
          weight: Math.round((isBreachAvulsion ? 16 : isThalweg ? 18 : 11) * zoomScale),
          opacity: 0.45,
          lineCap: 'round',
          lineJoin: 'round',
          className: 'realistic-river-bed',
        });
        bedTrench.addTo(riverChannels);

        // Pass 2: Main Flowing Water Body (Natural Cerulean / Deep Glacial Runoff)
        const waterBody = L.polyline(smoothChCoords, {
          color: isBreachAvulsion ? '#b91c1c' : isThalweg ? '#0284c7' : '#0ea5e9',
          weight: Math.round((isBreachAvulsion ? 9 : isThalweg ? 10 : 6) * zoomScale),
          opacity: 0.88,
          lineCap: 'round',
          lineJoin: 'round',
        });
        waterBody.addTo(riverChannels);

        // Pass 3: Specular Surface Wave & Living Sunlight Shimmer (Continuous fluid current flow)
        const currentStream = L.polyline(smoothChCoords, {
          color: isBreachAvulsion ? '#fca5a5' : isThalweg ? '#e0f2fe' : '#bae6fd',
          weight: Math.max(2, Math.round((isBreachAvulsion ? 3 : isThalweg ? 3.5 : 2.2) * zoomScale)),
          opacity: 0.92,
          dashArray: isBreachAvulsion ? '16, 12' : isThalweg ? '32, 24' : '20, 16',
          className: isBreachAvulsion ? 'realistic-breach-torrent' : 'realistic-water-stream',
        });

        currentStream.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: ${isBreachAvulsion ? '#f43f5e' : '#38bdf8'};">${ch.name}</strong><br/>
            <span>Channel Width: ~${ch.widthM}m | Depth: ${ch.depthM}m</span><br/>
            <span>Water Velocity: <strong style="color: #38bdf8;">${ch.waterVelocityMs} m/s</strong></span><br/>
            <span>Discharge: ${ch.dischargeCusecs ? `${ch.dischargeCusecs.toLocaleString()} cusecs` : 'Dynamic Inflow'}</span>
          </div>
        `, { sticky: true });

        currentStream.on('click', () => {
          setSelectedRiverFeature({ type: 'channel', data: ch });
        });

        currentStream.addTo(riverChannels);

        // For breach avulsion: render an expanding alluvial crevasse splay sediment outwash fan
        if (isBreachAvulsion && ch.coordinates.length > 3) {
          const breachPoint = ch.coordinates[0];
          // Fan-shaped sediment plume expanding into floodplain
          const splayFan = L.polygon([
            breachPoint,
            [breachPoint[0] - 0.015, breachPoint[1] + 0.035],
            [breachPoint[0] - 0.055, breachPoint[1] + 0.075],
            [breachPoint[0] - 0.110, breachPoint[1] + 0.115],
            [breachPoint[0] - 0.125, breachPoint[1] + 0.070],
            [breachPoint[0] - 0.060, breachPoint[1] + 0.020],
            breachPoint
          ], {
            color: '#b45309',
            weight: 1.2,
            opacity: 0.75,
            fillColor: '#b45309',
            fillOpacity: 0.38,
            className: 'realistic-splay-fan',
          });

          splayFan.bindTooltip(`
            <div style="font-family: monospace; font-size: 11px;">
              <strong style="color: #f59e0b;">🌊 Active Crevasse Splay (Sediment & Flood Outwash)</strong><br/>
              <span>High-velocity turbulent sediment plume surging into eastern paleochannels.</span>
            </div>
          `, { sticky: true });

          splayFan.addTo(riverChannels);
        }
      });
    }

    // D. Flood Embankments & Levees (Engineered Bunds with Riprap Slope & Breach Flares)
    if (riverVisibility.embankments && activeCorridor.embankments) {
      activeCorridor.embankments.forEach((emb) => {
        const isBreached = emb.status.includes('Breached');

        // Foundation / Toe Dyke
        const foundation = L.polyline(emb.coordinates, {
          color: isBreached ? '#7f1d1d' : '#1e293b',
          weight: isBreached ? 5 : 4,
          opacity: 0.7,
        });
        foundation.addTo(riverEmbankments);

        // Crown Road Crest
        const bundLine = L.polyline(emb.coordinates, {
          color: isBreached ? '#dc2626' : '#64748b',
          weight: isBreached ? 3 : 2,
          dashArray: isBreached ? '6, 6' : undefined,
          opacity: 0.95,
        });

        bundLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: ${isBreached ? '#ef4444' : '#cbd5e1'};">🛡️ ${emb.name}</strong><br/>
            <span>Status: <strong style="color: ${isBreached ? '#ef4444' : '#10b981'};">${emb.status}</strong></span><br/>
            <span>Crest Elevation: ${emb.crestElevationM}m | Length: ${emb.lengthKm} km</span>
          </div>
        `, { sticky: true });

        bundLine.on('click', () => {
          setSelectedRiverFeature({ type: 'embankment', data: emb });
        });

        bundLine.addTo(riverEmbankments);

        // Breach hazard flare marker
        if (isBreached && emb.coordinates.length > 5) {
          const midIdx = Math.floor(emb.coordinates.length / 2);
          const breachPoint = emb.coordinates[midIdx];

          const breachIcon = L.divIcon({
            className: 'custom-breach-flare',
            html: `
              <div class="breach-alert-flare" style="
                background: #ef4444;
                color: white;
                border: 2px solid white;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                box-shadow: 0 0 16px #ef4444;
                cursor: pointer;
              ">
                ⚡
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const breachMarker = L.marker(breachPoint, { icon: breachIcon });
          breachMarker.bindTooltip(`
            <div style="font-family: monospace; font-size: 11px; color: #fee2e2;">
              <strong style="color: #ef4444;">⚠️ ACTIVE EMBANKMENT BREACH</strong><br/>
              <span>Scour Gap: <strong>${emb.breachWidthM || 1850}m</strong></span><br/>
              <span>Avulsion Outflow: <strong>${(emb.breachOutflowCusecs || 142000).toLocaleString()} cfs</strong></span><br/>
              <span>Click for hydraulic breach diagnostics</span>
            </div>
          `, { direction: 'top' });

          breachMarker.on('click', () => {
            setSelectedRiverFeature({ type: 'embankment', data: emb });
          });

          breachMarker.addTo(riverEmbankments);
        }
      });
    }

    // E. Real-Time Hydrometric Gauging Stations
    if (riverVisibility.gaugingStations && activeCorridor.gaugingStations) {
      activeCorridor.gaugingStations.forEach((gs) => {
        const isDanger = gs.alertStatus === 'Danger Exceeded';
        const isWarning = gs.alertStatus === 'Warning';
        const color = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#06b6d4';

        const stationIcon = L.divIcon({
          className: 'custom-river-gauge-marker',
          html: `
            <div style="position: relative; width: 34px; height: 34px; cursor: pointer;">
              <div class="pulsing-radar" style="position: absolute; inset: -6px; border-radius: 50%; border: 2px solid ${color}; pointer-events: none;"></div>
              <div style="
                background: rgba(15, 23, 42, 0.96);
                border: 2px solid ${color};
                border-radius: 8px;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 14px ${color};
                color: ${color};
                font-family: monospace;
                font-size: 11px;
                font-weight: bold;
              ">
                <span>🌊</span>
              </div>
              <div style="
                position: absolute;
                bottom: -18px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid ${color};
                border-radius: 4px;
                padding: 1px 4px;
                color: white;
                font-family: monospace;
                font-size: 9px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.7);
              ">
                ${Math.round(gs.dischargeCusecs / 1000)}k cfs
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker(gs.coordinates, { icon: stationIcon });
        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
            <strong style="color: ${color}; font-size: 12px;">${gs.name}</strong> (${gs.basin})<br/>
            <span>Stage: <strong style="color: ${isDanger ? '#ef4444' : '#38bdf8'};">${gs.currentStageM}m</strong> (Danger: ${gs.dangerStageM}m)</span><br/>
            <span>Discharge: <strong>${gs.dischargeCusecs.toLocaleString()} cusecs</strong> (${gs.dischargeM3s.toLocaleString()} m³/s)</span><br/>
            <span>Trend: <strong>${gs.trend}</strong> | Status: <strong style="color: ${color};">${gs.alertStatus}</strong></span><br/>
            <span style="font-size: 9px; color: #94a3b8;">Click for live telemetry & hydrograph</span>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedRiverFeature({ type: 'gauge', data: gs });
        });

        marker.addTo(riverGauges);
      });
    }

    // F. Hydrodynamic Current & Flow Vectors
    if (riverVisibility.flowVectors && activeCorridor.flowVectors) {
      activeCorridor.flowVectors.forEach((fv) => {
        const vectorIcon = L.divIcon({
          className: 'custom-flow-vector',
          html: `
            <div style="
              transform: rotate(${fv.angleDeg}deg);
              display: flex;
              align-items: center;
              gap: 2px;
              pointer-events: none;
            ">
              <div style="
                width: 22px;
                height: 3px;
                background: linear-gradient(90deg, rgba(56, 189, 248, 0.15), #38bdf8);
                border-radius: 2px;
                box-shadow: 0 0 6px #38bdf8;
              "></div>
              <div style="
                width: 0;
                height: 0;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 8px solid #38bdf8;
                filter: drop-shadow(0 0 4px #38bdf8);
              "></div>
              <div style="
                transform: rotate(-${fv.angleDeg}deg);
                background: rgba(15, 23, 42, 0.9);
                border: 1px solid #0284c7;
                border-radius: 3px;
                padding: 0px 4px;
                font-size: 8.5px;
                font-family: monospace;
                color: #38bdf8;
                white-space: nowrap;
                margin-left: 2px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.5);
              ">
                ${fv.label}
              </div>
            </div>
          `,
          iconSize: [64, 20],
          iconAnchor: [32, 10],
        });

        L.marker(fv.coordinates, { icon: vectorIcon }).addTo(riverVectors);
      });
    }

    // =========================================================================
    // LEVEL OF DETAIL (LOD) HIGH-RESOLUTION HYDROLOGY (Visible when Zoom >= 13)
    // =========================================================================

    // G. Micro-Spurs & Boulder Groynes (River training spurs deflecting main thalweg)
    if (currentZoom >= 13 && riverVisibility.microSpurs && riverMicroSpurs && activeCorridor.microSpurs) {
      activeCorridor.microSpurs.forEach((spur) => {
        const isDamaged = spur.condition.includes('Damaged') || spur.condition.includes('Nose Scour');

        // Outer riprap armor base
        const spurBase = L.polyline(spur.coordinates, {
          color: '#292524',
          weight: currentZoom >= 15 ? 8 : 6,
          opacity: 0.85,
          lineCap: 'square',
          className: 'river-spur-armored',
        });
        spurBase.addTo(riverMicroSpurs);

        // Armor crest
        const spurCrest = L.polyline(spur.coordinates, {
          color: isDamaged ? '#f59e0b' : '#a8a29e',
          weight: currentZoom >= 15 ? 3.5 : 2.5,
          dashArray: '4, 2',
          opacity: 0.95,
        });

        spurCrest.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #f1f5f9;">🛡️ ${spur.name}</strong><br/>
            <span>Type: ${spur.type.replace('_', ' ').toUpperCase()}</span><br/>
            <span>Length: <strong>${spur.lengthM}m</strong> | Deflection Angle: <strong>${spur.flowDeflectionDeg}°</strong></span><br/>
            <span>Armor Condition: <strong style="color: ${isDamaged ? '#f87171' : '#34d399'};">${spur.condition}</strong></span><br/>
            <span>Nose Scour Depth: <strong>${spur.scourDepthM}m</strong></span>
          </div>
        `, { sticky: true });

        spurCrest.on('click', () => {
          setSelectedRiverFeature({ type: 'spur', data: spur });
        });
        spurCrest.addTo(riverMicroSpurs);

        // Nose Scour Node at the tip of the spur
        if (spur.coordinates.length >= 2) {
          const nosePoint = spur.coordinates[1];
          const noseMarker = L.circleMarker(nosePoint, {
            radius: currentZoom >= 15 ? 7 : 5,
            color: isDamaged ? '#ef4444' : '#10b981',
            weight: 2,
            fillColor: isDamaged ? '#b91c1c' : '#059669',
            fillOpacity: 0.95,
          });

          noseMarker.bindTooltip(`
            <div style="font-family: monospace; font-size: 11px;">
              <strong style="color: ${isDamaged ? '#ef4444' : '#34d399'};">Spur Nose Scour Pool</strong><br/>
              <span>Depth: ${spur.scourDepthM}m | Status: ${spur.condition}</span>
            </div>
          `, { direction: 'top' });

          noseMarker.on('click', () => {
            setSelectedRiverFeature({ type: 'spur', data: spur });
          });
          noseMarker.addTo(riverMicroSpurs);
        }
      });
    }

    // H. Bathymetric Spot Depth Soundings (Precision water depth in meters)
    if (currentZoom >= 13 && riverVisibility.depthSoundings && riverSoundings && activeCorridor.depthSoundings) {
      activeCorridor.depthSoundings.forEach((snd) => {
        const isDeep = snd.depthM >= 3.5;
        const isShoal = snd.depthM < 1.4;
        const badgeColor = isDeep ? '#0284c7' : isShoal ? '#d97706' : '#0891b2';
        const badgeBg = isDeep ? 'rgba(7, 89, 133, 0.92)' : isShoal ? 'rgba(180, 83, 9, 0.92)' : 'rgba(8, 145, 178, 0.92)';

        const soundingIcon = L.divIcon({
          className: 'custom-sounding-node',
          html: `
            <div class="river-depth-sounding-marker" style="
              background: ${badgeBg};
              border: 1.5px solid ${badgeColor};
              border-radius: 9999px;
              padding: 1px 5px;
              font-family: monospace;
              font-size: 10px;
              font-weight: 800;
              color: #ffffff;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.6);
              display: flex;
              align-items: center;
              gap: 3px;
              cursor: pointer;
            ">
              <span style="font-size: 9px;">${isShoal ? '⚠️' : '⚓'}</span>
              <span>${snd.depthM.toFixed(1)}m</span>
            </div>
          `,
          iconSize: [46, 20],
          iconAnchor: [23, 10],
        });

        const marker = L.marker(snd.coordinates, { icon: soundingIcon });
        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
            <strong style="color: ${badgeColor}; font-size: 12px;">Bathymetric Sounding: ${snd.depthM}m</strong><br/>
            <span>Channel Zone: <strong>${snd.channelType}</strong></span><br/>
            <span>Current Velocity: <strong>${snd.velocityMs} m/s</strong></span><br/>
            <span>Bed Material: <strong>${snd.bottomSediment}</strong></span><br/>
            <span style="color: ${isShoal ? '#fbbf24' : '#38bdf8'}; font-size: 9.5px;">
              ${isShoal ? '⚠️ Shallow Shoal - High grounding hazard for motorized rescue craft' : '✔️ Safe Navigable Draft Depth'}
            </span>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedRiverFeature({ type: 'sounding', data: snd });
        });

        marker.addTo(riverSoundings);
      });
    }

    // =========================================================================
    // HIGH-MAGNIFICATION STRUCTURES & EDDY VORTICES (Visible when Zoom >= 14)
    // =========================================================================

    // I. Hydraulic Structures (Sluice Gates, Culverts, Emergency Rescue Boat Ghats)
    if (currentZoom >= 14 && riverVisibility.hydraulicStructures && riverStructures && activeCorridor.hydraulicStructures) {
      activeCorridor.hydraulicStructures.forEach((struct) => {
        const isGhat = struct.type === 'emergency_boat_ghat';
        const isSluice = struct.type === 'sluice_gate';

        const structIcon = L.divIcon({
          className: 'custom-river-structure',
          html: `
            <div style="
              background: ${isGhat ? 'rgba(13, 148, 136, 0.95)' : isSluice ? 'rgba(67, 56, 202, 0.95)' : 'rgba(71, 85, 105, 0.95)'};
              border: 1.5px solid ${isGhat ? '#2dd4bf' : isSluice ? '#818cf8' : '#94a3b8'};
              border-radius: 6px;
              padding: 2px 6px;
              color: white;
              font-family: monospace;
              font-size: 9.5px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.7);
              cursor: pointer;
            ">
              <span>${isGhat ? '🚤' : isSluice ? '⚙️' : '🏛️'}</span>
              <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${struct.name}
              </span>
            </div>
          `,
          iconSize: [160, 24],
          iconAnchor: [80, 12]
        });

        const marker = L.marker(struct.coordinates, { icon: structIcon });
        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: ${isGhat ? '#2dd4bf' : '#818cf8'};">${struct.name}</strong><br/>
            <span>Structure Type: ${struct.type.replace('_', ' ').toUpperCase()}</span><br/>
            <span>Status: <strong style="color: #34d399;">${struct.status}</strong></span><br/>
            <span>Capacity / Function: ${struct.capacityDescription}</span>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedRiverFeature({ type: 'structure', data: struct });
        });

        marker.addTo(riverStructures);
      });
    }

    // J. Turbulence Vortices & Hydraulic Undertow Jets
    if (currentZoom >= 14 && riverVisibility.turbulences && riverTurbulence && activeCorridor.turbulenceVortices) {
      activeCorridor.turbulenceVortices.forEach((vortex) => {
        const vortexIcon = L.divIcon({
          className: 'custom-vortex-marker',
          html: `
            <div class="river-vortex-spin" style="
              width: 34px;
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              border: 2px dashed #f43f5e;
              background: radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(244, 63, 94, 0.05) 75%);
              filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.8));
              cursor: pointer;
            ">
              <span style="font-size: 16px;">🌀</span>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker(vortex.coordinates, { icon: vortexIcon });
        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px; color: #fee2e2;">
            <strong style="color: #f43f5e;">🌀 ${vortex.name}</strong><br/>
            <span>Vortex Type: ${vortex.type.replace('_', ' ').toUpperCase()}</span><br/>
            <span>Rotational Velocity: <strong>${vortex.velocityMs} m/s</strong></span><br/>
            <span>Eddy Diameter: <strong>${vortex.diameterM}m</strong></span><br/>
            <span style="color: #fda4af; font-weight: bold;">Hazard: Severe capsize & undertow risk</span>
          </div>
        `, { direction: 'top' });

        marker.on('click', () => {
          setSelectedRiverFeature({ type: 'turbulence', data: vortex });
        });

        marker.addTo(riverTurbulence);
      });
    }

    // K. Precision Bathymetric Depth Isobaths (Nautical Depth Contours with Sounding Badges)
    if (riverVisibility.isobaths && riverIsobaths && activeCorridor.isobaths) {
      activeCorridor.isobaths.forEach((iso) => {
        const isThalweg = iso.contourType === 'thalweg_trench';
        const isDeep = iso.contourType === 'deep_navigable';
        const isIntermediate = iso.contourType === 'intermediate';
        const isShoal = iso.contourType === 'shoal_margin';

        const strokeColor = isThalweg ? '#082f49' : isDeep ? '#0284c7' : isIntermediate ? '#06b6d4' : '#38bdf8';
        const strokeWidth = isThalweg ? 3.2 : isDeep ? 2.4 : isIntermediate ? 1.8 : 1.4;
        const dashPattern = isShoal ? '5, 6' : isIntermediate ? '10, 4' : undefined;

        const smoothIsoCoords = interpolateCatmullRomSpline(iso.coordinates, 4);

        const isoLine = L.polyline(smoothIsoCoords, {
          color: strokeColor,
          weight: strokeWidth,
          dashArray: dashPattern,
          opacity: 0.92,
          className: isThalweg ? 'river-thalweg-trench-line' : 'river-isobath-line',
        });

        isoLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: ${strokeColor};">⚓ Isobath Contour: -${iso.depthM.toFixed(1)}m</strong><br/>
            <span>Contour Classification: <strong>${iso.name}</strong></span><br/>
            <span>Hydraulic Zone: <strong>${iso.contourType.replace('_', ' ').toUpperCase()}</strong></span><br/>
            <span style="font-size: 9px; color: #94a3b8;">Click for bathymetric profile specs</span>
          </div>
        `, { sticky: true });

        isoLine.on('click', () => {
          setSelectedRiverFeature({ type: 'isobath', data: iso });
        });

        isoLine.addTo(riverIsobaths);

        // Add depth sounding pill along the contour
        if (currentZoom >= 13 && iso.coordinates.length >= 3) {
          const midIdx = Math.floor(iso.coordinates.length / 2);
          const soundingPt = iso.coordinates[midIdx];

          const depthBadgeIcon = L.divIcon({
            className: 'custom-isobath-badge',
            html: `
              <div style="
                background: rgba(15, 23, 42, 0.92);
                border: 1px solid ${strokeColor};
                border-radius: 9999px;
                padding: 0px 4px;
                font-family: monospace;
                font-size: 8.5px;
                font-weight: 800;
                color: ${strokeColor};
                white-space: nowrap;
                box-shadow: 0 1px 4px rgba(0,0,0,0.6);
                cursor: pointer;
              ">
                -${iso.depthM.toFixed(1)}m
              </div>
            `,
            iconSize: [36, 16],
            iconAnchor: [18, 8]
          });

          const depthMarker = L.marker(soundingPt, { icon: depthBadgeIcon });
          depthMarker.on('click', () => {
            setSelectedRiverFeature({ type: 'isobath', data: iso });
          });
          depthMarker.addTo(riverIsobaths);
        }
      });
    }

    // L. Bank Cutbank Erosion & Scour Vulnerability Hotspots
    if (riverVisibility.erosionZones && riverErosion && activeCorridor.cutbankErosionZones) {
      activeCorridor.cutbankErosionZones.forEach((cb) => {
        const isCritical = cb.scourSeverity === 'CRITICAL';
        const color = isCritical ? '#ef4444' : '#f59e0b';
        const smoothCbCoords = interpolateCatmullRomSpline(cb.coordinates, 3);

        const bankLine = L.polyline(smoothCbCoords, {
          color: color,
          weight: isCritical ? 4.5 : 3.5,
          dashArray: '8, 5',
          opacity: 0.95,
          className: 'cutbank-scour-line'
        });

        bankLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px; color: #fee2e2;">
            <strong style="color: ${color};">⚠️ ${cb.name}</strong><br/>
            <span>Scour Risk: <strong style="color: ${color};">${cb.scourSeverity}</strong></span><br/>
            <span>Bank Retreat Rate: <strong>${cb.bankRetreatRateMPerYear} m/year</strong></span><br/>
            <span>Bank Escarpment Height: <strong>${cb.bankHeightM}m</strong></span><br/>
            <span>At Risk: <strong>${cb.vulnerableAsset}</strong></span>
          </div>
        `, { sticky: true });

        bankLine.on('click', () => {
          setSelectedRiverFeature({ type: 'erosion', data: cb });
        });

        bankLine.addTo(riverErosion);

        // Warning alert node at apex
        const apexPt = cb.coordinates[Math.floor(cb.coordinates.length / 2)];
        const alertIcon = L.divIcon({
          className: 'custom-cutbank-alert',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              background: rgba(239, 68, 68, 0.9);
              border: 1.5px solid #ffffff;
              color: white;
              font-size: 11px;
              box-shadow: 0 0 10px #ef4444;
              cursor: pointer;
            ">
              ⚠️
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const alertMarker = L.marker(apexPt, { icon: alertIcon });
        alertMarker.on('click', () => {
          setSelectedRiverFeature({ type: 'erosion', data: cb });
        });
        alertMarker.addTo(riverErosion);
      });
    }

    // M. Riparian Oxbow Wetlands & Flood Buffers ("Beels / Chaurs")
    if (riverVisibility.oxbowWetlands && riverWetlands && activeCorridor.oxbowWetlands) {
      activeCorridor.oxbowWetlands.forEach((ox) => {
        const poly = L.polygon(ox.coordinates, {
          color: '#059669',
          weight: 1.5,
          opacity: 0.9,
          fillColor: '#10b981',
          fillOpacity: 0.38,
          className: 'riparian-oxbow-wetland'
        });

        poly.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #34d399;">🌿 ${ox.name}</strong><br/>
            <span>Type: Riparian Oxbow Lagoon / Natural Retention Beel</span><br/>
            <span>Water Area: <strong>${ox.surfaceAreaHa} ha</strong> | Depth: <strong>${ox.depthM}m</strong></span><br/>
            <span>Retention Capacity: <strong>${ox.retentionCapacityMillionM3} million m³</strong></span><br/>
            <span>Status: <strong style="color: #6ee7b7;">${ox.bufferingStatus}</strong></span>
          </div>
        `, { sticky: true });

        poly.on('click', () => {
          setSelectedRiverFeature({ type: 'wetland', data: ox });
        });

        poly.addTo(riverWetlands);
      });
    }

    // N. Hydrographic Cross-Section Transects
    if (riverVisibility.crossTransects && riverTransects && activeCorridor.crossTransects) {
      activeCorridor.crossTransects.forEach((xs) => {
        const xsLine = L.polyline(xs.coordinates, {
          color: '#c084fc',
          weight: 2.2,
          dashArray: '6, 6',
          opacity: 0.9,
        });

        xsLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #c084fc;">📐 ${xs.name} (${xs.code})</strong><br/>
            <span>River Width: <strong>${xs.riverWidthM.toLocaleString()}m</strong> | Chainage: <strong>km ${xs.chainageKm}</strong></span><br/>
            <span>Thalweg Max Depth: <strong>${xs.maxDepthM}m</strong> (Elev ${xs.thalwegElevationM}m MSL)</span><br/>
            <span style="color: #e9d5ff; font-weight: bold;">Click to inspect bed cross-section elevation profile</span>
          </div>
        `, { sticky: true });

        xsLine.on('click', () => {
          setSelectedRiverFeature({ type: 'transect', data: xs });
        });

        xsLine.addTo(riverTransects);

        // Center badge
        const midLat = (xs.coordinates[0][0] + xs.coordinates[1][0]) / 2;
        const midLng = (xs.coordinates[0][1] + xs.coordinates[1][1]) / 2;

        const xsBadge = L.divIcon({
          className: 'custom-xs-badge',
          html: `
            <div style="
              background: rgba(88, 28, 135, 0.92);
              border: 1px solid #c084fc;
              border-radius: 4px;
              padding: 1px 4px;
              font-family: monospace;
              font-size: 9px;
              font-weight: bold;
              color: white;
              white-space: nowrap;
              cursor: pointer;
            ">
              ${xs.code}
            </div>
          `,
          iconSize: [40, 18],
          iconAnchor: [20, 9]
        });

        const badgeMarker = L.marker([midLat, midLng], { icon: xsBadge });
        badgeMarker.on('click', () => {
          setSelectedRiverFeature({ type: 'transect', data: xs });
        });
        badgeMarker.addTo(riverTransects);
      });
    }

    // O. Secondary & Tertiary Tributaries
    if (riverVisibility.tributaries && riverTributaries && activeCorridor.tributaryFeeders) {
      activeCorridor.tributaryFeeders.forEach((trib) => {
        const smoothTrib = interpolateCatmullRomSpline(trib.coordinates, 4);

        const tribLine = L.polyline(smoothTrib, {
          color: '#38bdf8',
          weight: Math.max(2, Math.round(2.5 * zoomScale)),
          opacity: 0.85,
          dashArray: '8, 4',
        });

        tribLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #38bdf8;">💧 ${trib.name}</strong><br/>
            <span>Type: ${trib.type.replace('_', ' ').toUpperCase()}</span><br/>
            <span>Inflow Discharge: <strong>${trib.inflowCusecs.toLocaleString()} cfs</strong></span><br/>
            <span>Confluence: ${trib.confluenceLocation}</span><br/>
            <span>Sediment: ${trib.sedimentLoad}</span>
          </div>
        `, { sticky: true });

        tribLine.on('click', () => {
          setSelectedRiverFeature({ type: 'tributary', data: trib });
        });

        tribLine.addTo(riverTributaries);
      });
    }

    // P. Topographic Elevation Contours (Hypsometric lines for Geo Map detailing)
    if (riverVisibility.geoElevationContours && geoElevation) {
      const center = activeZone?.center || mapCenter;
      const baseElevations = [70, 80, 90, 100, 120, 150];
      
      baseElevations.forEach((elev, idx) => {
        const offset = 0.08 + idx * 0.035;
        const contourCoords: [number, number][] = [
          [center[0] + offset * 1.6, center[1] - 0.25],
          [center[0] + offset * 1.3, center[1] - 0.08],
          [center[0] + offset * 1.1, center[1] + 0.10],
          [center[0] + offset * 0.9, center[1] + 0.28],
          [center[0] + offset * 0.75, center[1] + 0.45],
        ];

        const smoothContour = interpolateCatmullRomSpline(contourCoords, 4);

        const contourLine = L.polyline(smoothContour, {
          color: '#94a3b8',
          weight: 1.2,
          opacity: 0.55,
          dashArray: '3, 4',
          className: 'geo-elevation-contour'
        });

        contourLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 10px;">
            <span>Terrain Elevation: <strong>${elev}m MSL</strong> (Topographic Isohypse)</span>
          </div>
        `, { sticky: true });

        contourLine.addTo(geoElevation);

        if (smoothContour.length > 5) {
          const lblPoint = smoothContour[Math.floor(smoothContour.length / 2)];
          const elevLabel = L.divIcon({
            className: 'custom-elevation-label',
            html: `
              <div style="
                font-family: monospace;
                font-size: 8.5px;
                color: #94a3b8;
                opacity: 0.85;
                white-space: nowrap;
                letter-spacing: 0.5px;
              ">
                ${elev}m
              </div>
            `,
            iconSize: [28, 12],
            iconAnchor: [14, 6]
          });
          L.marker(lblPoint, { icon: elevLabel }).addTo(geoElevation);
        }
      });
    }

    // Q. Precision Geo-Graticule Coordinate Grid
    if (riverVisibility.geoGraticule && geoGraticule) {
      const bounds = map.getBounds();
      const minLat = Math.floor(bounds.getSouth() * 10) / 10;
      const maxLat = Math.ceil(bounds.getNorth() * 10) / 10;
      const minLng = Math.floor(bounds.getWest() * 10) / 10;
      const maxLng = Math.ceil(bounds.getEast() * 10) / 10;

      for (let lat = minLat; lat <= maxLat; lat += 0.1) {
        const line = L.polyline([[lat, minLng - 0.5], [lat, maxLng + 0.5]], {
          color: '#38bdf8',
          weight: 0.6,
          opacity: 0.25,
          dashArray: '2, 4',
        });
        line.bindTooltip(`${lat.toFixed(1)}°N`, { permanent: true, direction: 'right', className: 'graticule-tooltip' });
        line.addTo(geoGraticule);
      }

      for (let lng = minLng; lng <= maxLng; lng += 0.1) {
        const line = L.polyline([[minLat - 0.5, lng], [maxLat + 0.5, lng]], {
          color: '#38bdf8',
          weight: 0.6,
          opacity: 0.25,
          dashArray: '2, 4',
        });
        line.bindTooltip(`${lng.toFixed(1)}°E`, { permanent: true, direction: 'top', className: 'graticule-tooltip' });
        line.addTo(geoGraticule);
      }
    }

  }, [activeCorridor, riverVisibility, floodOpacity, currentZoom, mapCenter, activeZone]);

  // 5. Draw Detour vs Straight-Line Route when a community is selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current?.routes) return;

    const routesLayer = layerGroupsRef.current.routes;
    routesLayer.clearLayers();

    if (!showRouteAnalysis || !selectedCommunity) return;

    const routeData: RouteInspectionData = getCommunityRouteData(selectedCommunity, routeFacilityTarget);

    // Straight-Line Euclidean Polyline (Cyan/White dashed)
    const straightLine = L.polyline(routeData.straightPolyline, {
      color: '#38bdf8',
      weight: 2.5,
      dashArray: '5, 8',
      opacity: 0.85,
    });
    straightLine.bindTooltip(`Deceptive Straight-Line: ${routeData.straightDistanceKm} km`, {
      permanent: true,
      direction: 'center',
      className: 'bg-cyan-950 text-cyan-200 border-cyan-500 font-mono text-[10px]'
    });
    straightLine.addTo(routesLayer);

    // Actual Road Detour Polyline (Amber/Orange solid)
    const detourLine = L.polyline(routeData.accessiblePolyline, {
      color: '#f59e0b',
      weight: 4.5,
      opacity: 0.95,
    });
    detourLine.bindTooltip(`Actual Passable Detour: ${routeData.accessibleDistanceKm} km (+${routeData.detourGapKm} km)`, {
      permanent: true,
      direction: 'top',
      className: 'bg-amber-950 text-amber-200 border-amber-500 font-mono text-[10px]'
    });
    detourLine.addTo(routesLayer);

    // Target Destination Marker with Glowing Pin
    const targetIcon = L.divIcon({
      className: 'route-target-pin',
      html: `
        <div style="
          background: #0284c7;
          border: 2px solid white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
          box-shadow: 0 0 12px #38bdf8;
        ">
          ${routeFacilityTarget === 'water' ? '💧' : '🏥'}
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const targetMarker = L.marker(routeData.targetCoords, { icon: targetIcon });
    targetMarker.bindPopup(`
      <div style="font-family: monospace; font-size: 11px; color: #f8fafc;">
        <strong style="color: #38bdf8;">TARGET: ${routeData.targetName}</strong><br/>
        <span>Direct Distance: ${routeData.straightDistanceKm} km</span><br/>
        <span style="color: #f59e0b; font-weight: bold;">Passable Detour: ${routeData.accessibleDistanceKm} km (+${routeData.detourGapKm} km)</span><br/>
        <p style="margin-top: 4px; font-size: 10px; color: #94a3b8;">${routeData.obstacle}</p>
      </div>
    `);
    targetMarker.addTo(routesLayer);

  }, [selectedCommunity, showRouteAnalysis, routeFacilityTarget]);

  // 6. Interactive Measurement Tool click listener
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current?.measure) return;

    const measureLayer = layerGroupsRef.current.measure;

    if (!isMeasuring) {
      measureLayer.clearLayers();
      setMeasurePoints([]);
      setMeasureDistanceKm(null);
      return;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickPt: [number, number] = [e.latlng.lat, e.latlng.lng];

      setMeasurePoints((prev) => {
        if (prev.length === 0) {
          measureLayer.clearLayers();
          const p1 = L.circleMarker(clickPt, { radius: 6, color: '#38bdf8', fillColor: '#0284c7', fillOpacity: 0.9 });
          p1.bindTooltip('Point A (Start)', { permanent: true, direction: 'top' });
          p1.addTo(measureLayer);
          return [clickPt];
        } else {
          const ptA = prev[0];
          const ptB = clickPt;

          const p2 = L.circleMarker(ptB, { radius: 6, color: '#f59e0b', fillColor: '#d97706', fillOpacity: 0.9 });
          p2.bindTooltip('Point B (End)', { permanent: true, direction: 'top' });
          p2.addTo(measureLayer);

          const distanceMeters = map.distance(ptA, ptB);
          const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100;
          setMeasureDistanceKm(distanceKm);

          const line = L.polyline([ptA, ptB], {
            color: '#38bdf8',
            weight: 3,
            dashArray: '4, 6',
          });
          line.bindTooltip(`Measured: ${distanceKm} km (${Math.round(distanceMeters)} m)`, {
            permanent: true,
            direction: 'center',
          });
          line.addTo(measureLayer);

          return [ptA, ptB];
        }
      });
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isMeasuring]);

  // Preset Extent Focus helpers
  const handleFocusExtent = (type: 'basin' | 'epicenter' | 'global') => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (type === 'basin') {
      if (activeZone?.bounds && activeZone.bounds.length === 2) {
        map.fitBounds(activeZone.bounds, { padding: [40, 40], maxZoom: 13, animate: true });
      } else if (activeZone?.center) {
        map.flyTo(activeZone.center, activeZone.zoom || 11, { duration: 1.2 });
      } else {
        map.flyTo([26.585, 87.03], 11, { duration: 1 });
      }
    } else if (type === 'epicenter') {
      const topCritical = communities.slice().sort((a, b) => b.priorityScore - a.priorityScore)[0];
      if (topCritical) {
        onSelectCommunity(topCritical);
        map.flyTo(topCritical.coordinates, 13.5, { duration: 1.2 });
      }
    } else if (type === 'global') {
      map.flyTo([20, 10], 2.2, { duration: 1.5 });
    }
  };

  const activeRouteData = selectedCommunity ? getCommunityRouteData(selectedCommunity, routeFacilityTarget) : null;
  const availableDistricts = Array.from(new Set(communities.map((c) => c.district))).filter(Boolean);

  return (
    <div className="relative w-full h-[calc(100vh-57px)] flex flex-col overflow-hidden bg-slate-950 font-sans">
      {/* Top Filter & GIS Control Toolbar */}
      <div className="z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search community, district or region..."
              value={filterState.search}
              onChange={(e) => setFilterState({ ...filterState, search: e.target.value })}
              className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs w-44"
            />
          </div>

          {/* Dynamic District Filter */}
          <select
            value={filterState.district}
            onChange={(e) => setFilterState({ ...filterState, district: e.target.value })}
            className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-500 max-w-[150px]"
          >
            <option value="All">All Districts ({availableDistricts.length})</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterState.priorityCategory}
            onChange={(e) => setFilterState({ ...filterState, priorityCategory: e.target.value })}
            className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MODERATE">🟡 Moderate Priority</option>
            <option value="LOW">🔵 Low Priority</option>
          </select>

          {/* Quick Focus Extent Presets */}
          <div className="hidden md:flex items-center gap-1 pl-1 border-l border-slate-800">
            <button
              onClick={() => handleFocusExtent('basin')}
              className="px-2 py-1 bg-slate-950 border border-slate-700 hover:border-cyan-500 rounded text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
              title={`Reset view to ${activeZone?.name || 'Basin'} AOI`}
            >
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>{activeZone ? activeZone.name.split(' ')[0] : 'Basin'} AOI</span>
            </button>
            <button
              onClick={() => handleFocusExtent('epicenter')}
              className="px-2 py-1 bg-red-950/80 border border-red-700 hover:bg-red-900 rounded text-[11px] text-red-200 font-bold flex items-center gap-1"
              title="Focus on Highest Vulnerability Epicenter"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Epicenter</span>
            </button>
            <button
              onClick={() => handleFocusExtent('global')}
              className="px-2 py-1 bg-slate-950 border border-slate-700 hover:border-cyan-500 rounded text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
              title="Zoom out to Global Planet Overview"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>World Extent</span>
            </button>
            {onOpenZoneSelector && (
              <button
                onClick={onOpenZoneSelector}
                className="px-2 py-1 bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-700/90 hover:border-cyan-400 text-cyan-200 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                title="Switch Global Disaster Zone or Set Any Location on Earth"
              >
                <span>{activeZone?.flag || '🌐'}</span>
                <span>Switch Zone</span>
              </button>
            )}
          </div>
        </div>

        {/* Right side controls: Basemap, Route Mode, Ruler, Layers */}
        <div className="flex items-center gap-2">
          {/* Detour Route Toggle */}
          <button
            onClick={() => setShowRouteAnalysis(!showRouteAnalysis)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border ${
              showRouteAnalysis
                ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-semibold'
                : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Straight-line vs Passable Detour Route"
          >
            <Route className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Detour Routes</span>
          </button>

          {/* Measurement Ruler Tool */}
          <button
            onClick={() => {
              setIsMeasuring(!isMeasuring);
              if (isMeasuring) {
                setMeasurePoints([]);
                setMeasureDistanceKm(null);
              }
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border ${
              isMeasuring
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold animate-pulse'
                : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Click 2 points on map to measure straight-line distance"
          >
            <Ruler className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">{isMeasuring ? 'Measuring...' : 'Measure'}</span>
          </button>

          {/* Basemap Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
                basemap === 'satellite'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="High-Resolution Satellite Earth Imagery"
            >
              <span>🛰️ Sat</span>
            </button>
            <button
              onClick={() => setBasemap('topo')}
              className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
                basemap === 'topo'
                  ? 'bg-cyan-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Topographic Elevation & Shaded Relief"
            >
              <span>⛰️ Topo</span>
            </button>
            <button
              onClick={() => setBasemap('opentopo')}
              className={`px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
                basemap === 'opentopo'
                  ? 'bg-amber-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="OpenTopoMap with high-precision contours & hillshade relief"
            >
              <span>🧭 GeoTopo</span>
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${
                basemap === 'dark'
                  ? 'bg-slate-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Clean Dark Cartographic Canvas"
            >
              Dark
            </button>
            <button
              onClick={() => setBasemap('osm')}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${
                basemap === 'osm'
                  ? 'bg-slate-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="OpenStreetMap Roads & Vectors"
            >
              OSM
            </button>
          </div>

          {/* Layer Panel Button */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
              showLayerPanel ? 'bg-slate-800 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-700 text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-slate-950" />

        {/* Measurement Active Instruction Banner */}
        {isMeasuring && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur border border-cyan-500/80 rounded-lg px-4 py-2 text-xs font-mono text-cyan-200 shadow-2xl flex items-center gap-3">
            <Ruler className="w-4 h-4 text-cyan-400" />
            <span>
              {measurePoints.length === 0
                ? 'Click Point A on the map to start measurement'
                : measurePoints.length === 1
                ? 'Click Point B to calculate distance'
                : `Distance measured: ${measureDistanceKm} km`}
            </span>
            <button
              onClick={() => {
                setIsMeasuring(false);
                setMeasurePoints([]);
                setMeasureDistanceKm(null);
              }}
              className="text-slate-400 hover:text-white ml-2 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* River Corridor Realism Status & Quick Controls Floating Bar */}
        {showRiverToolbar && activeCorridor && !isMeasuring && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100vw-32px)] flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/60 rounded-full px-3 py-1.5 shadow-2xl text-xs font-mono">
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/80">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <div className="flex items-center gap-1">
                <span className="font-bold text-cyan-200 truncate max-w-[130px] sm:max-w-[190px]">
                  {activeCorridor.riverName}
                </span>
                <span className="hidden md:inline text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  {activeCorridor.currentDischargeStatus}
                </span>
              </div>
            </div>

            {/* Dynamic Zoom Level & Level of Detail (LOD) Indicator */}
            <div className="flex items-center gap-1.5 pl-1 pr-2 border-r border-slate-700/80">
              <span className="text-[10px] text-slate-400">
                LOD <strong className="text-cyan-300 font-mono">{currentZoom.toFixed(1)}x</strong>
              </span>
              {currentZoom < 13 ? (
                <button
                  onClick={() => {
                    const map = mapInstanceRef.current;
                    if (map) map.setZoom(13.5);
                  }}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950/90 text-cyan-300 border border-cyan-700 hover:bg-cyan-800 hover:text-white transition-all font-semibold flex items-center gap-1"
                  title="Zoom in to see spurs, soundings, structures, and eddies"
                >
                  <span>🔍 Zoom for Detail</span>
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 font-bold">
                  <span>● High Detail Active</span>
                </span>
              )}
            </div>

            {/* Quick layer toggles */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRiverVisibility(prev => ({ ...prev, channels: !prev.channels }))}
                className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                  riverVisibility.channels
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Braided River Channels and Thalweg"
              >
                <span>Channels</span>
              </button>

              <button
                onClick={() => setRiverVisibility(prev => ({ ...prev, sandbars: !prev.sandbars }))}
                className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                  riverVisibility.sandbars
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Alluvial Island Chars and Sandbars"
              >
                <span>Sandbars</span>
              </button>

              <button
                onClick={() => setRiverVisibility(prev => ({ ...prev, embankments: !prev.embankments }))}
                className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                  riverVisibility.embankments
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Flood Embankment Bunds & Breach Points"
              >
                <span>Bunds</span>
              </button>

              {currentZoom >= 13 && (
                <>
                  <button
                    onClick={() => setRiverVisibility(prev => ({ ...prev, microSpurs: !prev.microSpurs }))}
                    className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                      riverVisibility.microSpurs
                        ? 'bg-stone-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Boulder Groynes and Micro-Spurs"
                  >
                    <span>Spurs</span>
                  </button>

                  <button
                    onClick={() => setRiverVisibility(prev => ({ ...prev, depthSoundings: !prev.depthSoundings }))}
                    className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                      riverVisibility.depthSoundings
                        ? 'bg-sky-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Precision Bathymetric Depth Soundings"
                  >
                    <span>Soundings</span>
                  </button>

                  <button
                    onClick={() => setRiverVisibility(prev => ({ ...prev, isobaths: !prev.isobaths }))}
                    className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                      riverVisibility.isobaths
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Precision Depth Isobaths"
                  >
                    <span>Isobaths</span>
                  </button>

                  <button
                    onClick={() => setRiverVisibility(prev => ({ ...prev, erosionZones: !prev.erosionZones }))}
                    className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                      riverVisibility.erosionZones
                        ? 'bg-rose-700 text-white font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Cutbank Erosion & Scour Hotspots"
                  >
                    <span>Erosion</span>
                  </button>

                  <button
                    onClick={() => setRiverVisibility(prev => ({ ...prev, crossTransects: !prev.crossTransects }))}
                    className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                      riverVisibility.crossTransects
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Cross-Section Survey Transects"
                  >
                    <span>Transects</span>
                  </button>
                </>
              )}

              {currentZoom >= 14 && (
                <button
                  onClick={() => setRiverVisibility(prev => ({ ...prev, turbulences: !prev.turbulences }))}
                  className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                    riverVisibility.turbulences
                      ? 'bg-rose-600 text-white font-bold shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle Hydraulic Undertow Vortices & Eddies"
                >
                  <span>Eddies</span>
                </button>
              )}

              <button
                onClick={() => setRiverVisibility(prev => ({ ...prev, gaugingStations: !prev.gaugingStations }))}
                className={`px-2 py-0.5 rounded-full text-[10px] transition-all flex items-center gap-1 ${
                  riverVisibility.gaugingStations
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Hydrometric Gauging Stations"
              >
                <span>Gauges</span>
              </button>

              {/* Instant High-Realism Satellite corridor view toggle */}
              <button
                onClick={() => setBasemap(basemap === 'satellite' ? 'dark' : 'satellite')}
                className={`hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border transition-all ${
                  basemap === 'satellite'
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:bg-slate-700'
                }`}
                title="Toggle Photorealistic Satellite Imagery Overlay"
              >
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>Satellite</span>
              </button>
            </div>
          </div>
        )}

        {/* Selected River Feature (Gauging Station, Breach, Channel, Sandbar) Telemetry Panel */}
        {selectedRiverFeature && (
          <div className="absolute top-3 left-3 z-20 w-80 md:w-96 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-md border border-cyan-500/60 rounded-xl p-3.5 text-xs font-mono shadow-2xl space-y-2.5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {selectedRiverFeature.type === 'gauge' ? 'Hydrometric Telemetry' :
                     selectedRiverFeature.type === 'embankment' ? 'Defense Levee / Breach' :
                     selectedRiverFeature.type === 'channel' ? 'Braided River Channel' :
                     selectedRiverFeature.type === 'sandbar' ? 'Alluvial Island Char' :
                     selectedRiverFeature.type === 'spur' ? 'Micro-Spur & Groyne Armor' :
                     selectedRiverFeature.type === 'sounding' ? 'Bathymetric Spot Depth Sounding' :
                     selectedRiverFeature.type === 'structure' ? 'Hydraulic Structure & Relief Ghat' :
                     selectedRiverFeature.type === 'isobath' ? 'Precision Bathymetric Isobath' :
                     selectedRiverFeature.type === 'erosion' ? 'Bank Cutbank Scour Hazard' :
                     selectedRiverFeature.type === 'wetland' ? 'Riparian Oxbow Wetland Lagoon' :
                     selectedRiverFeature.type === 'transect' ? 'Cross-Section River Elevation Survey' :
                     selectedRiverFeature.type === 'tributary' ? 'Feeder Tributary / Canal Inflow' :
                     'Hydrodynamic Vortex Shear'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {selectedRiverFeature.data.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeCorridor.riverName} • {activeCorridor.basinRegion}
                </p>
              </div>
              <button
                onClick={() => setSelectedRiverFeature(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gauge Specific Details */}
            {selectedRiverFeature.type === 'gauge' && (
              <div className="space-y-2">
                {/* Stage Height Barometer */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Current Water Stage:</span>
                    <span className="text-base font-black text-cyan-300">
                      {selectedRiverFeature.data.currentStageM} m
                    </span>
                  </div>

                  {/* Visual gauge bar */}
                  <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        selectedRiverFeature.data.currentStageM >= selectedRiverFeature.data.dangerStageM
                          ? 'bg-gradient-to-r from-amber-500 to-red-600'
                          : selectedRiverFeature.data.currentStageM >= selectedRiverFeature.data.warningStageM
                          ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                          : 'bg-cyan-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (selectedRiverFeature.data.currentStageM / (selectedRiverFeature.data.dangerStageM * 1.05)) * 100)}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9.5px] text-slate-400 pt-0.5">
                    <span>Warning: {selectedRiverFeature.data.warningStageM}m</span>
                    <span className="text-red-400 font-bold">Danger: {selectedRiverFeature.data.dangerStageM}m</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Discharge Rate:</span>
                    <span className="text-cyan-300 font-bold text-xs">
                      {selectedRiverFeature.data.dischargeCusecs.toLocaleString()} cfs
                    </span>
                    <span className="text-slate-500 text-[9px] block">
                      ({selectedRiverFeature.data.dischargeM3s.toLocaleString()} m³/s)
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">River Velocity:</span>
                    <span className="text-amber-300 font-bold text-xs">
                      {selectedRiverFeature.data.flowVelocityMs} m/s
                    </span>
                    <span className="text-slate-500 text-[9px] block">
                      Trend: <strong className={selectedRiverFeature.data.trend === 'Rising' ? 'text-red-400' : 'text-cyan-400'}>{selectedRiverFeature.data.trend}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Sediment / Turbidity:</span>
                  <span className="font-semibold text-slate-200">{selectedRiverFeature.data.turbidityNtu} NTU (High Silt Load)</span>
                </div>

                {/* Alert Banner */}
                <div className={`p-2 rounded-lg text-[10px] flex items-center gap-2 border ${
                  selectedRiverFeature.data.alertStatus === 'Danger Exceeded'
                    ? 'bg-red-950/60 border-red-800 text-red-200'
                    : 'bg-amber-950/60 border-amber-800 text-amber-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>
                    <strong>{selectedRiverFeature.data.alertStatus}:</strong> High hydrodynamic pressure on downstream levees and spurs.
                  </span>
                </div>
              </div>
            )}

            {/* Embankment Specific Details */}
            {selectedRiverFeature.type === 'embankment' && (
              <div className="space-y-2">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Structural Status:</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      selectedRiverFeature.data.status.includes('Breached')
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {selectedRiverFeature.data.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bank Orientation:</span>
                    <span className="font-bold text-slate-200">{selectedRiverFeature.data.bank}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Length:</span>
                    <span className="font-bold text-slate-200">{selectedRiverFeature.data.lengthKm} km</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Crest Elevation:</span>
                    <span className="font-bold text-cyan-300">{selectedRiverFeature.data.crestElevationM} m MSL</span>
                  </div>
                </div>

                {selectedRiverFeature.data.status.includes('Breached') && (
                  <div className="bg-red-950/60 border border-red-800/80 p-2.5 rounded-lg space-y-1 text-[11px]">
                    <span className="text-red-300 font-bold uppercase text-[10px] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-red-400" />
                      Hydraulic Breach Scour Diagnostics
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                      <div className="p-1.5 rounded bg-slate-950/80 border border-red-900/60">
                        <span className="text-slate-400 block">Scour Gap:</span>
                        <span className="text-red-300 font-bold text-xs">{selectedRiverFeature.data.breachWidthM || 1850} m</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950/80 border border-red-900/60">
                        <span className="text-slate-400 block">Avulsion Outflow:</span>
                        <span className="text-red-300 font-bold text-xs">{(selectedRiverFeature.data.breachOutflowCusecs || 142000).toLocaleString()} cfs</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300 pt-1 leading-tight">
                      Torrential course diversion into eastern paleochannels. Active scour scouring settlements across Sunsari and downstream Bihar.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Channel Specific Details */}
            {selectedRiverFeature.type === 'channel' && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hydraulic Channel Type:</span>
                    <span className="font-bold text-cyan-400">{selectedRiverFeature.data.type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Width:</span>
                    <span className="font-bold text-slate-200">~{selectedRiverFeature.data.widthM} m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Water Depth:</span>
                    <span className="font-bold text-cyan-300">{selectedRiverFeature.data.depthM} m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Flow Velocity:</span>
                    <span className="font-bold text-amber-300">{selectedRiverFeature.data.waterVelocityMs} m/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Discharge:</span>
                    <span className="font-bold text-cyan-300">
                      {selectedRiverFeature.data.dischargeCusecs ? `${selectedRiverFeature.data.dischargeCusecs.toLocaleString()} cfs` : 'Dynamic Flow'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sandbar / Char Specific Details */}
            {selectedRiverFeature.type === 'sandbar' && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Alluvial Island Area:</span>
                    <span className="font-bold text-amber-400">{selectedRiverFeature.data.areaHectares} hectares</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Submersion Ratio:</span>
                    <span className="font-bold text-red-400">{selectedRiverFeature.data.submersionPct}% Submerged</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vegetation Cover:</span>
                    <span className="font-bold text-emerald-400">{selectedRiverFeature.data.vegetationCover}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Inhabitant Status:</span>
                    <span className="font-semibold text-slate-300">Transient cattle herders & riparian hamlets</span>
                  </div>
                </div>
              </div>
            )}

            {/* Micro-Spur / Groyne Details */}
            {selectedRiverFeature.type === 'spur' && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Groyne Type:</span>
                    <span className="font-bold text-slate-200">{selectedRiverFeature.data.type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Structure Length:</span>
                    <span className="font-bold text-cyan-300">{selectedRiverFeature.data.lengthM} meters</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deflection Angle:</span>
                    <span className="font-bold text-sky-400">{selectedRiverFeature.data.flowDeflectionDeg}° from bank</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Structural Condition:</span>
                    <span className={`font-bold ${
                      selectedRiverFeature.data.condition.includes('Damaged') || selectedRiverFeature.data.condition.includes('Scour')
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}>
                      {selectedRiverFeature.data.condition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nose Scour Depth:</span>
                    <span className="font-bold text-amber-400">{selectedRiverFeature.data.scourDepthM} m bathymetric trough</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bathymetric Depth Sounding Details */}
            {selectedRiverFeature.type === 'sounding' && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Spot Water Depth:</span>
                    <span className="text-base font-black text-cyan-300">{selectedRiverFeature.data.depthM.toFixed(1)} m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Channel Morphology:</span>
                    <span className="font-bold text-slate-200 capitalize">{selectedRiverFeature.data.channelType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Velocity:</span>
                    <span className="font-bold text-sky-400">{selectedRiverFeature.data.velocityMs} m/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bottom Sediment:</span>
                    <span className="font-bold text-amber-300">{selectedRiverFeature.data.bottomSediment}</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                    {selectedRiverFeature.data.depthM < 1.4 ? (
                      <span className="text-amber-400 font-semibold">⚠️ Shallow shoaling area. Motorized rescue boats require shallow-draft jet propulsions to avoid stranding.</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">✔️ Navigable deep draft channel. Suitable for loaded relief rafts and NDRF heavy rescue zodiacs.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hydraulic Structure Details */}
            {selectedRiverFeature.type === 'structure' && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Structure Type:</span>
                    <span className="font-bold text-teal-300 capitalize">{selectedRiverFeature.data.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Operational Status:</span>
                    <span className="font-bold text-emerald-400">{selectedRiverFeature.data.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Capacity / Role:</span>
                    <span className="font-semibold text-slate-200">{selectedRiverFeature.data.capacityDescription}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Turbulence Vortex Details */}
            {selectedRiverFeature.type === 'turbulence' && (
              <div className="space-y-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-red-950/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hydrodynamic Phenomenon:</span>
                    <span className="font-bold text-rose-400 capitalize">{selectedRiverFeature.data.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rotational Speed:</span>
                    <span className="font-bold text-red-300">{selectedRiverFeature.data.velocityMs} m/s angular shear</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vortex Diameter:</span>
                    <span className="font-bold text-amber-300">{selectedRiverFeature.data.diameterM} meters</span>
                  </div>
                  <div className="p-1.5 rounded bg-red-950/50 border border-red-900/60 text-[10px] text-rose-200">
                    ⚠️ <strong>High Evacuation Hazard:</strong> Severe undertow suction zone. Inflatable and non-motorized craft risk capsizing immediately upon approach.
                  </div>
                </div>
              </div>
            )}

            {/* Precision Bathymetric Isobath Detail */}
            {selectedRiverFeature.type === 'isobath' && (
              <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bathymetric Depth:</span>
                  <span className="text-base font-black text-cyan-300">-{selectedRiverFeature.data.depthM?.toFixed(1)} m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Contour Classification:</span>
                  <span className="font-bold text-slate-200 capitalize">{selectedRiverFeature.data.contourType?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hydraulic Scour Regime:</span>
                  <span className={`font-bold ${selectedRiverFeature.data.isDynamicScour ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedRiverFeature.data.isDynamicScour ? 'Active Scour Trench' : 'Stable Riverbed Isoline'}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-[10px] text-cyan-200">
                  {selectedRiverFeature.data.depthM >= 3.0 ? (
                    <span>⚓ <strong>Deep Thalweg Conduit:</strong> Unrestricted draft clearance for rescue craft; high hydraulic pressure against riverbed.</span>
                  ) : selectedRiverFeature.data.depthM >= 1.5 ? (
                    <span>✔️ <strong>Intermediate Channel:</strong> Passable by motorized boats at moderate engine trim.</span>
                  ) : (
                    <span>⚠️ <strong>Shoal Margin:</strong> Grounding hazard. Motorized propellers risk hitting silt/sand bar shelves.</span>
                  )}
                </div>
              </div>
            )}

            {/* Cutbank Erosion Scour Hazard Detail */}
            {selectedRiverFeature.type === 'erosion' && (
              <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-red-900/50 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Scour Vulnerability:</span>
                  <span className="px-2 py-0.5 rounded font-black text-xs bg-red-600 text-white">
                    {selectedRiverFeature.data.scourSeverity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bank Retreat Rate:</span>
                  <span className="font-bold text-amber-300">{selectedRiverFeature.data.bankRetreatRateMPerYear} m / year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bank Escarpment Height:</span>
                  <span className="font-bold text-slate-200">{selectedRiverFeature.data.bankHeightM} meters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Soil Composition:</span>
                  <span className="font-semibold text-slate-300 text-right max-w-[170px] truncate">{selectedRiverFeature.data.soilComposition}</span>
                </div>
                <div className="p-1.5 rounded bg-red-950/60 border border-red-800/60 text-[10px] text-rose-200">
                  ⚠️ <strong>Asset At Risk:</strong> {selectedRiverFeature.data.vulnerableAsset}
                </div>
              </div>
            )}

            {/* Riparian Oxbow Wetland Lagoon Detail */}
            {selectedRiverFeature.type === 'wetland' && (
              <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-emerald-900/50 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Wetland Water Area:</span>
                  <span className="font-bold text-emerald-400">{selectedRiverFeature.data.surfaceAreaHa} hectares</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Retention Capacity:</span>
                  <span className="font-bold text-cyan-300">{selectedRiverFeature.data.retentionCapacityMillionM3} million m³</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Buffering Status:</span>
                  <span className="font-bold text-emerald-300">{selectedRiverFeature.data.bufferingStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vegetation Cover:</span>
                  <span className="font-semibold text-slate-300 text-right max-w-[170px] truncate">{selectedRiverFeature.data.vegetationDensity}</span>
                </div>
                <div className="p-1.5 rounded bg-emerald-950/50 border border-emerald-800/50 text-[10px] text-emerald-200">
                  🌿 <strong>Alluvial Sponge Function:</strong> Oxbow wetland acts as a natural flood attenuation buffer, mitigating downstream hydraulic shock.
                </div>
              </div>
            )}

            {/* Cross-Section Transect Profile Detail with SVG Elevation Chart */}
            {selectedRiverFeature.type === 'transect' && (
              <div className="space-y-2">
                <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-purple-900/50 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Transect Code / Reach:</span>
                    <span className="font-bold text-purple-300">{selectedRiverFeature.data.code} (Chainage km {selectedRiverFeature.data.chainageKm})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Riverbed Width:</span>
                    <span className="font-bold text-slate-200">~{selectedRiverFeature.data.riverWidthM?.toLocaleString()} meters</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Max Thalweg Bed Depth:</span>
                    <span className="font-bold text-cyan-300">{selectedRiverFeature.data.maxDepthM} m ({selectedRiverFeature.data.thalwegElevationM}m MSL)</span>
                  </div>
                </div>

                {/* SVG Bathymetric Bed Profile Chart */}
                {selectedRiverFeature.data.elevationPoints && (
                  <div className="bg-slate-950/90 p-2.5 rounded-lg border border-purple-950 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold">
                      <span>Hydrographic Bed Elevation Profile</span>
                      <span className="text-slate-400 text-[9px]">Distance vs Depth</span>
                    </div>
                    <div className="h-28 w-full bg-slate-900/80 rounded border border-slate-800 p-1 relative flex flex-col justify-end">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <line x1="0" y1="20" x2="300" y2="20" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4,2" />
                        <text x="5" y="16" fill="#38bdf8" fontSize="8" fontFamily="monospace">Water Surface</text>
                        {(() => {
                          const pts = selectedRiverFeature.data.elevationPoints;
                          const maxDist = pts[pts.length - 1]?.distanceM || 1;
                          const svgPoints = pts.map((p: any) => {
                            const x = (p.distanceM / maxDist) * 300;
                            const y = 20 + (p.depthM / (selectedRiverFeature.data.maxDepthM * 1.25 || 10)) * 55;
                            return `${x},${y}`;
                          });
                          const polyPath = `0,75 ${svgPoints.join(' ')} 300,75`;
                          return (
                            <>
                              <polygon points={polyPath} fill="rgba(88, 28, 135, 0.35)" stroke="#c084fc" strokeWidth="1.8" />
                              {pts.map((p: any, idx: number) => {
                                const x = (p.distanceM / maxDist) * 300;
                                const y = 20 + (p.depthM / (selectedRiverFeature.data.maxDepthM * 1.25 || 10)) * 55;
                                return (
                                  <circle key={idx} cx={x} cy={y} r="2.5" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="1" />
                                );
                              })}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>West Bank (0m)</span>
                      <span className="text-purple-300 font-bold">Thalweg: {selectedRiverFeature.data.maxDepthM}m</span>
                      <span>East Bank ({selectedRiverFeature.data.riverWidthM}m)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feeder Tributary / Canal Inflow Detail */}
            {selectedRiverFeature.type === 'tributary' && (
              <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-sky-900/50 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Feeder Inflow Discharge:</span>
                  <span className="font-bold text-sky-300">{selectedRiverFeature.data.inflowCusecs?.toLocaleString()} cfs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Channel Type:</span>
                  <span className="font-bold text-slate-200 capitalize">{selectedRiverFeature.data.type?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Confluence Location:</span>
                  <span className="font-semibold text-slate-300 text-right max-w-[170px] truncate">{selectedRiverFeature.data.confluenceLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sediment Turbidity Load:</span>
                  <span className="font-bold text-amber-300">{selectedRiverFeature.data.sedimentLoad}</span>
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="pt-1">
              <button
                onClick={() => {
                  const map = mapInstanceRef.current;
                  if (!map) return;
                  if (selectedRiverFeature.data.coordinates) {
                    if (Array.isArray(selectedRiverFeature.data.coordinates[0])) {
                      // polygon or polyline
                      const bounds = L.latLngBounds(selectedRiverFeature.data.coordinates);
                      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                    } else {
                      // single point
                      map.flyTo(selectedRiverFeature.data.coordinates, 14.5, { duration: 1 });
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition-colors shadow-md"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Fly & Center on Feature</span>
              </button>
            </div>
          </div>
        )}

        {/* Layer Control Panel (Floating Overlay) */}
        {showLayerPanel && (
          <div className="absolute top-3 right-3 z-20 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 text-xs font-mono shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-200">
              <span className="font-semibold flex items-center gap-1.5 text-cyan-400">
                <Layers className="w-4 h-4" />
                GIS Map Layers & Extent
              </span>
              <button 
                onClick={() => setShowLayerPanel(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inundation Opacity Slider */}
            <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Flood Extent Opacity:</span>
                <span className="font-bold text-cyan-400">{Math.round(floodOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.85"
                step="0.05"
                value={floodOpacity}
                onChange={(e) => setFloodOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1 text-slate-300">
              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-sky-600 border border-sky-400 opacity-70" />
                  <span>Sentinel-1 Flood Extent</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.floodExtent}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, floodExtent: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
                  <span>Settlements by Priority</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.settlements}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, settlements: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Water Sources</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.waterSources}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, waterSources: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rotate-45 bg-orange-500" />
                  <span>Sanitation Facilities</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.sanitation}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, sanitation: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-500 text-[9px] flex items-center justify-center font-bold text-white">+</span>
                  <span>Health Facilities</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.health}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, health: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-red-500 border-b border-dashed border-red-400" />
                  <span>Disrupted / Open Roads</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.roads}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, roads: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 text-black text-[9px] flex items-center justify-center font-bold">!</span>
                  <span>Citizen Field Reports</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.reports}
                  onChange={(e) => setLayerVisibility({ ...layerVisibility, reports: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </label>

              {/* River Corridor Sub-layers */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5" />
                    River Corridor Realism
                  </span>
                  <input
                    type="checkbox"
                    checked={riverVisibility.corridor}
                    onChange={(e) => setRiverVisibility({ ...riverVisibility, corridor: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                  />
                </div>

                {riverVisibility.corridor && (
                  <div className="pl-2 space-y-1 text-[11px] text-slate-300">
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-cyan-400 rounded-sm" />
                        <span>Braided Channels & Thalweg</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.channels}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, channels: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-amber-700 border border-amber-500 rounded-sm" />
                        <span>Sandbars & Chars ("Tappu")</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.sandbars}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, sandbars: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-red-600 rounded-sm" />
                        <span>Embankments & Breaches</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.embankments}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, embankments: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-blue-600 border border-cyan-400 rounded-sm" />
                        <span>Hydrometric Gauging Stations</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.gaugingStations}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, gaugingStations: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-sky-400" />
                        <span>Hydrodynamic Flow Vectors</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.flowVectors}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, flowVectors: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-sky-900 border border-sky-600 rounded-sm" />
                        <span>Bathymetric Multi-Depth Zones</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.depthGradient}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, depthGradient: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Micro-Hydrology Level of Detail Layers */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-1 bg-stone-500 border-b border-amber-400" />
                        <span>Micro-Spurs & Groynes</span>
                        <span className={`text-[8.5px] px-1 py-0.2 rounded font-mono ${currentZoom >= 13 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                          {currentZoom >= 13 ? 'Active (≥13x)' : 'Zoom ≥13x'}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.microSpurs}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, microSpurs: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-700 text-[8px] flex items-center justify-center font-bold text-white">⚓</span>
                        <span>Depth Soundings</span>
                        <span className={`text-[8.5px] px-1 py-0.2 rounded font-mono ${currentZoom >= 13 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                          {currentZoom >= 13 ? 'Active (≥13x)' : 'Zoom ≥13x'}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.depthSoundings}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, depthSoundings: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px]">🚤</span>
                        <span>Hydraulic Structures & Ghats</span>
                        <span className={`text-[8.5px] px-1 py-0.2 rounded font-mono ${currentZoom >= 14 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                          {currentZoom >= 14 ? 'Active (≥14x)' : 'Zoom ≥14x'}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.hydraulicStructures}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, hydraulicStructures: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px]">🌀</span>
                        <span>Turbulence Vortices & Eddies</span>
                        <span className={`text-[8.5px] px-1 py-0.2 rounded font-mono ${currentZoom >= 14 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                          {currentZoom >= 14 ? 'Active (≥14x)' : 'Zoom ≥14x'}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.turbulences}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, turbulences: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Depth Isobath Contours */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-blue-500 border-b border-dashed border-cyan-300" />
                        <span>Depth Isobaths (Contour Lines)</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.isobaths}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, isobaths: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Cutbank Erosion Scour Zones */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-1 bg-red-500 border-t border-dashed border-amber-300" />
                        <span>Cutbank Erosion & Bank Scour</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.erosionZones}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, erosionZones: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Riparian Oxbow Wetlands */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-700 border border-emerald-400 rounded-sm" />
                        <span>Riparian Oxbow Wetlands ("Beels")</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.oxbowWetlands}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, oxbowWetlands: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Hydrographic Cross-Section Transects */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-purple-400 border-b border-dashed border-purple-300" />
                        <span>Cross-Section Survey Transects</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.crossTransects}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, crossTransects: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Secondary Tributaries & Canals */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-1 bg-sky-400 rounded-sm" />
                        <span>Secondary Feeders & Canals</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.tributaries}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, tributaries: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Topographic Elevation Contours */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <Mountain className="w-3 h-3 text-slate-400" />
                        <span>Geo Topographic Contours (MSL)</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.geoElevationContours}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, geoElevationContours: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>

                    {/* Precision Geo-Graticule Coordinates Grid */}
                    <label className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <Grid className="w-3 h-3 text-slate-400" />
                        <span>Precision Geo-Graticule Grid</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={riverVisibility.geoGraticule}
                        onChange={(e) => setRiverVisibility({ ...riverVisibility, geoGraticule: e.target.checked })}
                        className="rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Cartographic Legend */}
            <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1">
              <span className="text-slate-400 uppercase font-semibold">Corridor & Priority Legend</span>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-cyan-400" /> Deep Thalweg Channel</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical (≥75)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-700" /> Alluvial Sandbar</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-600" /> High (55-74)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-red-600" /> Levee Breach Scour</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Mod (35-54)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-blue-500 border-b border-dashed border-cyan-300" /> Depth Isobath</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-purple-400" /> Survey Transect</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-700" /> Oxbow Wetland</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-1 bg-red-500" /> Cutbank Scour</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Community Detail Sliding Panel - Minimizable and Closable */}
        {selectedCommunity && (
          isProfileMinimized ? (
            <div 
              id="minimized-community-profile"
              className="absolute top-3 left-3 z-20 max-w-[calc(100vw-24px)] flex items-center gap-2.5 px-3 py-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-xl text-xs font-mono shadow-2xl transition-all select-none animate-in fade-in"
            >
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsProfileMinimized(false)}
                title="Click to expand community profile"
              >
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  selectedCommunity.priorityCategory === 'CRITICAL' ? 'bg-red-500' :
                  selectedCommunity.priorityCategory === 'HIGH' ? 'bg-amber-500' : 'bg-cyan-500'
                }`} />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white max-w-[140px] sm:max-w-[200px] truncate group-hover:text-cyan-300 transition-colors">
                      {selectedCommunity.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                      selectedCommunity.priorityCategory === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                      selectedCommunity.priorityCategory === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {selectedCommunity.priorityCategory} {selectedCommunity.priorityScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400">
                    <span>👥 {selectedCommunity.exposedPopulation.toLocaleString()} exp</span>
                    <span>•</span>
                    <span>🌊 {selectedCommunity.floodDepthMeters}m</span>
                    <span>•</span>
                    <span className={selectedCommunity.mainWaterStatus === 'Submerged' ? 'text-red-400 font-semibold truncate max-w-[90px]' : 'truncate max-w-[90px]'}>
                      {selectedCommunity.mainWaterStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
                <button
                  onClick={() => setIsProfileMinimized(false)}
                  title="Expand community profile details"
                  className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold transition-colors"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Expand</span>
                </button>

                <button
                  onClick={() => onSelectCommunity(null)}
                  title="Close and deselect settlement"
                  className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute top-3 left-3 z-20 w-80 md:w-96 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 text-xs font-mono shadow-2xl space-y-2.5 animate-in fade-in">
              <div className="flex items-start justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">COMMUNITY PROFILE</span>
                  <h3 className="text-base font-bold text-white">{selectedCommunity.name}</h3>
                  <p className="text-[11px] text-slate-400">{selectedCommunity.ward}, {selectedCommunity.ruralMunicipality}, {selectedCommunity.district}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsProfileMinimized(true)}
                    title="Minimize profile to compact bar"
                    className="text-slate-400 hover:text-cyan-300 p-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    <Minimize className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onSelectCommunity(null)}
                    title="Close profile and deselect"
                    className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

            {/* Route Inspection Target Switcher */}
            {showRouteAnalysis && activeRouteData && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-2 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                    <Route className="w-3 h-3 text-amber-400" />
                    Spatial Detour Inspection
                  </span>
                  <div className="flex items-center gap-1 text-[9px]">
                    <button
                      onClick={() => setRouteFacilityTarget('water')}
                      className={`px-1.5 py-0.5 rounded ${routeFacilityTarget === 'water' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      Safe Water
                    </button>
                    <button
                      onClick={() => setRouteFacilityTarget('health')}
                      className={`px-1.5 py-0.5 rounded ${routeFacilityTarget === 'health' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      Health Post
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="p-1 rounded bg-slate-950/70 border border-cyan-800/50">
                    <span className="text-slate-400 block">Euclidean Direct:</span>
                    <span className="text-cyan-300 font-bold">{activeRouteData.straightDistanceKm} km</span>
                  </div>
                  <div className="p-1 rounded bg-slate-950/70 border border-amber-800/50">
                    <span className="text-slate-400 block">Actual Passable:</span>
                    <span className="text-amber-300 font-bold">{activeRouteData.accessibleDistanceKm} km (+{activeRouteData.detourGapKm} km)</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  <span className="text-amber-400 font-semibold">Obstacle:</span> {activeRouteData.obstacle}
                </p>
              </div>
            )}

            {/* Spec Fields Box */}
            <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Potential population exposed:</span>
                <span className="font-bold text-amber-300">{selectedCommunity.exposedPopulation.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ {selectedCommunity.population.toLocaleString()}</span></span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Flood exposure:</span>
                <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                  selectedCommunity.floodExposure === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                  selectedCommunity.floodExposure === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                  'bg-yellow-950 text-yellow-300'
                }`}>
                  {selectedCommunity.floodExposure} ({selectedCommunity.floodDepthMeters}m depth)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Main water source:</span>
                <span className="font-semibold text-red-400 text-right truncate max-w-[170px]">{selectedCommunity.mainWaterStatus}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Road accessibility:</span>
                <span className={`font-bold ${selectedCommunity.roadAccessibility === 'SEVERELY DISRUPTED' ? 'text-red-400' : selectedCommunity.roadAccessibility === 'LIMITED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedCommunity.roadAccessibility}
                </span>
              </div>

              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">WASH PRIORITY:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-black tracking-widest ${
                  selectedCommunity.priorityCategory === 'CRITICAL' ? 'bg-red-600 text-white' :
                  selectedCommunity.priorityCategory === 'HIGH' ? 'bg-amber-600 text-white' :
                  'bg-cyan-600 text-white'
                }`}>
                  {selectedCommunity.priorityCategory} ({selectedCommunity.priorityScore})
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="btn-community-deep-analysis"
                onClick={() => onNavigateTab('community')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition-colors"
              >
                <span>Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-community-facility-routing"
                onClick={() => onNavigateTab('access')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-[11px] transition-colors"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Facility Detour</span>
              </button>
            </div>
          </div>
        ))}

        {/* Bottom Community Quick-Select Dock */}
        <div className="absolute bottom-6 left-3 right-3 z-20 flex flex-col items-center pointer-events-none">
          {/* Dock toggle header */}
          <div className="pointer-events-auto mb-1">
            <button
              onClick={() => setShowBottomDock(!showBottomDock)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border border-slate-700 hover:border-cyan-500 text-[11px] font-mono text-slate-300 hover:text-white shadow-xl backdrop-blur transition-all"
            >
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{communities.length} {activeZone ? activeZone.name.split(' ')[0] : ''} Settlements Quick-Dock</span>
              {showBottomDock ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>

          {showBottomDock && (
            <div className="pointer-events-auto w-full max-w-5xl bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-2 shadow-2xl overflow-x-auto scrollbar-none flex items-center gap-2">
              {communities
                .slice()
                .sort((a, b) => b.priorityScore - a.priorityScore)
                .map((c, index) => {
                  const isSelected = selectedCommunity?.id === c.id;
                  const isCritical = c.priorityCategory === 'CRITICAL';
                  const isHigh = c.priorityCategory === 'HIGH';
                  const badgeBg = isCritical ? 'bg-red-600' : isHigh ? 'bg-amber-600' : 'bg-cyan-600';

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCommunity(c);
                        setIsProfileMinimized(false);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(c.coordinates, 13, { duration: 1 });
                        }
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all border ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-950 text-white ring-1 ring-cyan-400/50'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${badgeBg} text-white font-mono text-[10px] font-black flex items-center justify-center`}>
                        {c.priorityScore}
                      </span>
                      <div className="leading-tight">
                        <div className="text-[11px] font-semibold truncate max-w-[110px]">{c.name}</div>
                        <div className="text-[9px] font-mono text-slate-400">{c.district} • {c.roadAccessibility === 'SEVERELY DISRUPTED' ? 'Disrupted' : 'Passable'}</div>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Live Coordinate Status Bar along Bottom */}
        <div className="absolute bottom-1 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 rounded px-2.5 py-0.5 text-[10px] font-mono text-slate-400 flex items-center gap-3 shadow-lg">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EO Sensor: Sentinel-1 C-SAR</span>
          </span>
          {cursorCoords && (
            <span className="text-slate-300">
              {cursorCoords.lat}° N, {cursorCoords.lng}° E
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
