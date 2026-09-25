import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  Compass, 
  Download,
  Maximize2,
  Database,
  Sparkles
} from 'lucide-react';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface SatelliteModuleProps {
  onNavigateTab: (tab: TabId) => void;
}

export const SatelliteModule: React.FC<SatelliteModuleProps> = ({ onNavigateTab }) => {
  // Before / After slider position (0 - 100%)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [selectedSensor, setSelectedSensor] = useState<'s1' | 's2' | 'dem'>('s1');

  return (
    <div className="w-full">
      <ModuleHeader category="science" currentTab="satellite" onNavigateTab={onNavigateTab} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
            <Satellite className="w-6 h-6 text-cyan-400" />
            Earth Observation (EO) & Remote Sensing Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) & Optical Inundation Analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SAR Cloud Penetration: 100%
          </span>
        </div>
      </div>

      {/* Interactive Before/After EO Flood Comparison Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="font-bold text-white text-sm">
              Optical Baseline vs. Post-Flood SAR Waterlogging Inundation
            </span>
            <p className="text-[11px] text-slate-400">
              Drag the center slider to inspect before-and-after flood extent across the affected floodplain AOI
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-400 font-semibold">◀ Pre-Flood Normal</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-semibold">Post-Flood SAR Extent ▶</span>
          </div>
        </div>

        {/* Comparison Stage */}
        <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden select-none border border-slate-700 bg-slate-950">
          {/* Post-flood image (Background / Right side) */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1400&auto=format&fit=crop&q=80" 
              alt="Post-flood inundated terrain" 
              className="w-full h-full object-cover filter saturate-150 contrast-125"
              referrerPolicy="no-referrer"
            />
            {/* Blue flood overlay tint */}
            <div className="absolute inset-0 bg-cyan-900/40 mix-blend-multiply pointer-events-none" />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur border border-cyan-500/60 text-cyan-300 font-bold text-xs shadow-lg">
              Sentinel-1 SAR Post-Flood Inundation (Oct 2024)
            </div>
          </div>

          {/* Pre-flood image (Foreground / Left side with clip-path) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full min-w-full">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80" 
                alt="Pre-flood dry season baseline" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur border border-emerald-500/60 text-emerald-300 font-bold text-xs shadow-lg whitespace-nowrap">
                Sentinel-2 Optical Pre-Flood Baseline
              </div>
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white shadow-xl">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* Invisible interactive range input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Observed Inundated Area: <strong className="text-cyan-300">184.2 km²</strong></span>
          <span>Max Inundation Depth (HAND Model): <strong className="text-red-400">2.4 meters</strong></span>
          <span>SAR Revisit Cycle: <strong className="text-white">6 Days (Descending Pass)</strong></span>
        </div>
      </div>

      {/* Sensor Specifications & EO Processing Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Sensor 1: Sentinel-1 SAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              Sentinel-1A/B SAR
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Active Radar
            </span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Frequency Band:</span>
              <span className="text-slate-200">C-Band (5.405 GHz)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Polarizations:</span>
              <span className="text-slate-200">Dual (VV + VH)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Spatial Resolution:</span>
              <span className="text-slate-200">10m Interferometric Wide</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Weather Penalty:</span>
              <span className="text-emerald-400 font-bold">0% (Cloud-Penetrating)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
            SAR radar waves bounce off calm floodwaters specularly away from the receiver, producing dark low-backscatter signatures (&lt; -16 dB).
          </p>
        </div>

        {/* Sensor 2: Sentinel-2 MSI Optical */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Sentinel-2 MSI
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Multispectral
            </span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Spectral Bands:</span>
              <span className="text-slate-200">13 Bands (VNIR to SWIR)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Indices Computed:</span>
              <span className="text-slate-200">MNDWI & NDVI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Spatial Resolution:</span>
              <span className="text-slate-200">10m / 20m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monsoon Cloud Cover:</span>
              <span className="text-amber-400">64% Occluded</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
            Provides pristine pre-disaster agricultural baseline and settlement footprint, used to verify permanent water bodies and canals.
          </p>
        </div>

        {/* Elevation Model: Copernicus DEM */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Copernicus DEM 30m
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              HAND Model
            </span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Vertical Accuracy:</span>
              <span className="text-slate-200">&lt; 4 meters (GLO-30)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hydrologic Model:</span>
              <span className="text-slate-200">HAND (Height Above Drainage)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Depth Estimation:</span>
              <span className="text-slate-200">Water Surface Elevation - DEM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Flow Direction:</span>
              <span className="text-slate-200">D8 Flow Routing</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
            Translates 2D flood surface polygon masks into 3D water depth profiles, identifying submerged pumps and waterlogged latrine pits.
          </p>
        </div>
      </div>

      {/* Live Data Connection Blueprint */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Production Earth Observation Architecture & API Pluggability
        </div>
        <p className="text-slate-300 leading-relaxed">
          The JALRAKSHA prototype is architected with standardized GeoJSON & Cloud-Optimized GeoTIFF (COG) interfaces. 
          When deployed operationally, the backend automatically connects to the following open geospatial services:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">1. Copernicus Data Space</strong>
            <span className="text-slate-400 text-[11px]">OData and STAC API client polling Sentinel-1 GRD products over any designated global disaster AOI every 6-12 days.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">2. Google Earth Engine</strong>
            <span className="text-slate-400 text-[11px]">Cloud-native Otsu thresholding algorithm execution generating vector flood extent polygons.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">3. OpenStreetMap Overpass</strong>
            <span className="text-slate-400 text-[11px]">Real-time topology extraction for water points (amenity=drinking_water) and highways.</span>
          </div>
        </div>
      </div>

      {/* Official IWMI 69-Dataset Reference Integration Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-700/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              IWMI Multi-Source Earth Observation Data Catalogue (Ghosh, 2026)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            Explore the full 69-dataset inventory across 13 thematic groups (featuring NASA-ISRO NISAR L- & S-band SAR, EOS-04/RISAT-1A, Cartosat-3, and 15 Indian emergency portals like Bhuvan & Sachet).
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('catalogue')}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02]"
        >
          <Database className="w-4 h-4" />
          <span>Browse 69 Datasets →</span>
        </button>
      </div>
    </div>
  </div>
  );
};
