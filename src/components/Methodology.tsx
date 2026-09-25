import React from 'react';
import { 
  BookOpen, 
  Satellite, 
  Layers, 
  Users, 
  Route, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Database,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface MethodologyProps {
  onNavigateTab: (tab: TabId) => void;
}

export const Methodology: React.FC<MethodologyProps> = ({ onNavigateTab }) => {
  const pipelineSteps = [
    {
      step: 1,
      title: "Earth Observation Inundation Mapping",
      icon: <Satellite className="w-5 h-5 text-cyan-400" />,
      tag: "Sentinel-1 C-SAR",
      description: "Copernicus Sentinel-1 SAR GRD products are radiometrically calibrated, speckle-filtered (Lee filter), and terrain-corrected. Otsu automated thresholding on dual-polarization (VV/VH) backscatter change identifies standing surface water regardless of heavy monsoon cloud cover.",
    },
    {
      step: 2,
      title: "Critical Infrastructure Spatial Overlay",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      tag: "GIS Topo Intersection",
      description: "Point-in-polygon and buffer spatial queries intersect mapped flood extents with OpenStreetMap and Nepal Department of Water Supply and Sewerage (DWSS) geo-registries of tube wells, water treatment kiosks, pit latrines, and health posts.",
    },
    {
      step: 3,
      title: "Gridded Population Exposure Estimation",
      icon: <Users className="w-5 h-5 text-amber-400" />,
      tag: "WorldPop / Census",
      description: "Zonal statistics overlay 100m high-resolution WorldPop demographic rasters and Nepal National Census 2021 ward-level aggregations over inundation polygons to compute the exact number of exposed individuals per settlement.",
    },
    {
      step: 4,
      title: "Network Routing & Accessibility Modeling",
      icon: <Route className="w-5 h-5 text-red-400" />,
      tag: "OSRM / pgRouting",
      description: "Rather than deceptive straight-line euclidean proximity, graph-theoretic shortest-path routing calculates actual accessible road kilometers to alternative water points and hospitals, penalizing submerged bridges and washed-out causeways.",
    },
    {
      step: 5,
      title: "Configurable WASH Priority Index Engine",
      icon: <Sliders className="w-5 h-5 text-purple-400" />,
      tag: "Multi-Criteria Decision",
      description: "Normalizes flood exposure, drinking water disruption, sanitation breach risk, exposed population, and road detour penalties into an interpretable 0–100 score with dynamic user-weighted sliders.",
    },
    {
      step: 6,
      title: "Citizen Ground-Truth & NLP Extraction",
      icon: <FileText className="w-5 h-5 text-yellow-400" />,
      tag: "Gemini 2.5 NLP",
      description: "Unstructured SMS dispatches, radio transcripts, and community field photos are parsed by AI to extract mentions of pump submergence, pathogen outbreaks, and road cuts, verifying or refining satellite-derived estimates.",
    },
  ];

  return (
    <div className="w-full">
      <ModuleHeader category="science" currentTab="methodology" onNavigateTab={onNavigateTab} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Methodology & Technical Architecture
          </h2>
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
            SPARK 4.0: EO Hackathon 2026
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Problem Statement 5: “After the Flood — Mapping WASH Disruptions and Community Needs”
        </p>
      </div>

      {/* Problem Statement 5 Alignment Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Operational Mandate & Objective</span>
        </div>
        <p className="leading-relaxed">
          Standard disaster maps stop at displaying where the water is. 
          <strong className="text-white"> JALRAKSHA </strong> answers the operational humanitarian question: 
          <em className="text-cyan-300"> “Which communities are most affected from a WASH perspective, why are they vulnerable, and where should emergency intervention be prioritized?”</em> 
          by combining Earth Observation radar, infrastructure networks, population exposure, and ground truth dispatches.
        </p>
      </div>

      {/* 6-Step Visual End-to-End Pipeline Flowchart */}
      <div className="space-y-3 font-mono">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          End-to-End Decision Support Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((step) => (
            <div 
              key={step.step}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 hover:border-slate-700 transition-colors shadow-lg relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-black text-xs text-cyan-400">
                      {step.step}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {step.tag}
                    </span>
                  </div>
                  {step.icon}
                </div>

                <h4 className="font-bold text-white text-xs leading-snug">
                  {step.title}
                </h4>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Phase {step.step} of 6</span>
                <span className="text-cyan-400">Validated</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulation of WASH Emergency Priority Index */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs shadow-xl">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
          Mathematical Formulation of Priority Score
        </h3>

        <p className="text-slate-300 leading-relaxed">
          The prototype score avoids black-box arbitrary AI allocations. Each vulnerability dimension is normalized between 0.0 and 1.0 based on empirical physical thresholds:
        </p>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <div className="text-cyan-300 font-bold text-center text-xs md:text-sm">
            Priority Index = [ (w_flood · S_flood) + (w_wash · S_wash) + (w_pop · S_pop) + (w_access · S_access) + (w_health · S_health) ] ÷ ∑(w) × 100
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div>• <strong className="text-slate-200">S_flood:</strong> Inundation depth (&gt;1.5m = 1.0) & surface water percentage.</div>
            <div>• <strong className="text-slate-200">S_wash:</strong> Main tube well submergence & latrine pit breach status.</div>
            <div>• <strong className="text-slate-200">S_pop:</strong> Normalized exposed headcount per settlement.</div>
            <div>• <strong className="text-slate-200">S_access:</strong> Road severance & detour gap penalty (Accessible km - Direct km).</div>
            <div className="md:col-span-2">• <strong className="text-slate-200">S_health:</strong> Routing impedance to functional emergency health post with ORS supply.</div>
          </div>
        </div>
      </div>

      {/* Real Datasets Integration Architecture (Prompt Mandate) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Plugging In Live Global & National Geospatial APIs
          </h3>
          <span className="text-[10px] text-slate-400">Production Transition Readiness</span>
        </div>

        <p className="text-slate-300 leading-relaxed">
          The system architecture operates globally across any flood-affected basin or coastal floodplain worldwide. 
          The data ingestion layer is completely decoupled so disaster management agencies and UN OCHA clusters can point directly to live endpoints:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px]">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">1. Copernicus Data Space Ecosystem (CDSE)</strong>
            <p className="text-slate-400">Connects via STAC API to ingest Sentinel-1 SLC/GRD and Sentinel-2 L2A BOA reflectance tiles worldwide with automated cloud masking.</p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">2. Humanitarian Data Exchange (HDX) / WorldPop</strong>
            <p className="text-slate-400">Pulls Global UN OCHA COD-AB administrative boundaries and 100m age-stratified demographic exposure rasters for any target country.</p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">3. National Disaster Portals & River Hydrology Telemetry</strong>
            <p className="text-slate-400">Integrates real-time national hydrometeorology telemetry (e.g., Nepal DHM/BIPAD, India CWC, USGS Water Services, Copernicus GloFAS) for upstream river gauge discharge and crest monitoring.</p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block">4. OpenStreetMap Overpass API & OSRM</strong>
            <p className="text-slate-400">Dynamic routing network graph updated continuously as field crews tag washed-out bridges with barrier=yes.</p>
          </div>
        </div>
      </div>

      {/* Authoritative EO Data Framework Citation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-cyan-700/80 rounded-xl p-5 space-y-3 font-mono text-xs shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-sm">Foundational Data Framework: IWMI Multi-Source EO Catalogue (2026)</span>
          </div>
          <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded text-[10px] font-bold">
            Authoritative Research Reference
          </span>
        </div>

        <p className="text-slate-300 font-sans leading-relaxed text-xs">
          JALRAKSHA's observational architecture is built in direct alignment with the <em>"Multi-Source Earth Observation Data Catalogue for Rapid Flood Mapping, Monitoring and Assessment focusing the 2026 Assam Floods"</em> by Surajit Ghosh (International Water Management Institute - IWMI). This framework provides 69 curated datasets across 13 thematic groups and 15 operational Indian disaster portals, prioritizing 60–70% Indian national sources (ISRO Bhoonidhi, Bhuvan, IMD, CWC) complemented by open global data.
        </p>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 font-mono">
            Key missions featured: <strong>NASA-ISRO NISAR L/S SAR (2026)</strong>, <strong>Sentinel-1</strong>, <strong>EOS-04 RISAT-1A</strong>, <strong>CartoDEM</strong>, <strong>Google Flood Hub</strong>
          </div>
          <button
            onClick={() => onNavigateTab('catalogue')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Explore Full 69-Dataset Catalogue →</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
