import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Droplet, 
  Trash2, 
  Building2, 
  Route, 
  Compass, 
  Users, 
  ShieldCheck, 
  Satellite, 
  ChevronRight,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Community, WaterSource, SanitationFacility, HealthFacility } from '../types';
import { calculateCommunityPriority } from '../utils/priorityCalculator';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface CommunityAnalysisProps {
  communities: Community[];
  selectedCommunity: Community;
  onSelectCommunity: (comm: Community) => void;
  waterSources: WaterSource[];
  sanitationFacilities: SanitationFacility[];
  healthFacilities: HealthFacility[];
  onNavigateTab: (tab: TabId) => void;
}

export const CommunityAnalysis: React.FC<CommunityAnalysisProps> = ({
  communities,
  selectedCommunity,
  onSelectCommunity,
  waterSources,
  sanitationFacilities,
  healthFacilities,
  onNavigateTab,
}) => {
  const comm = selectedCommunity;
  const breakdown = calculateCommunityPriority(comm);

  // Find nearby facilities
  const nearbyWater = waterSources.filter((w) => w.communityNear === comm.name);
  const nearbySan = sanitationFacilities.filter((s) => s.communityNear === comm.name);
  const matchedHealth = healthFacilities.find((h) => h.name.includes(comm.name) || comm.healthFacilityName === h.name);

  return (
    <div className="w-full">
      <ModuleHeader category="triage" currentTab="community" onNavigateTab={onNavigateTab} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Community Selector & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Select Community for Deep Analysis
            </label>
            <select
              value={comm.id}
              onChange={(e) => {
                const found = communities.find((c) => c.id === e.target.value);
                if (found) onSelectCommunity(found);
              }}
              className="mt-0.5 bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.priorityCategory} - {c.priorityScore}) — {c.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('map')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Center on Map</span>
          </button>
          <button
            onClick={() => onNavigateTab('access')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-colors"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Facility Access Route</span>
          </button>
        </div>
      </div>

      {/* Primary Community Header & Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">{comm.code}</span>
              <span>•</span>
              <span>{comm.ward}, {comm.ruralMunicipality}</span>
              <span>•</span>
              <span>{comm.district} District, Nepal</span>
              <span>•</span>
              <span className="text-slate-500">[{comm.coordinates[0].toFixed(4)}°N, {comm.coordinates[1].toFixed(4)}°E]</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
              {comm.name}
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl">
              Post-flood diagnostic assessment indicates severe disruption to potable drinking water and local sanitation infrastructure with compromised road connectivity.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono">
            {/* Priority Score Box */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">WASH Priority</span>
              <div className="text-3xl font-black text-white flex items-center justify-end gap-1.5">
                <span className={comm.priorityCategory === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}>{comm.priorityScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black tracking-wider uppercase mt-0.5 ${
                comm.priorityCategory === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                comm.priorityCategory === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-cyan-600 text-white'
              }`}>
                {comm.priorityCategory}
              </span>
            </div>

            {/* Confidence Metric */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{Math.round(comm.confidenceIndicator * 100)}%</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Confidence</span>
              <span className="text-[9px] text-slate-500 block">SAR + Optical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual "WHY THIS COMMUNITY IS PRIORITIZED" Explanation Box (Required Highlight) */}
      <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-2 border-red-800/80 rounded-xl p-5 shadow-2xl space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-red-800/60 pb-2.5">
          <div className="flex items-center gap-2 text-red-300">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              WHY THIS COMMUNITY IS PRIORITIZED
            </h3>
          </div>
          <span className="text-[11px] text-red-300 font-semibold bg-red-950 px-2 py-0.5 rounded border border-red-800">
            Interpretable Decision Support Rationale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          {comm.keyReasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded bg-slate-950/70 border border-red-900/40 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{reason}</span>
            </div>
          ))}
          {/* Always ensure the core 5 required prompt checkpoints are explicitly represented */}
          <div className="flex items-start gap-2.5 p-2.5 rounded bg-slate-950/70 border border-red-900/40 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-snug">
              Alternative safe water point requires a <strong>{comm.alternativeWaterDistanceAccessibleKm} km</strong> detour ({comm.alternativeWaterDistanceStraightKm} km straight-line) due to road/culvert severances.
            </span>
          </div>
        </div>
      </div>

      {/* 5-Factor Vulnerability Diagnostic Dimensions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
        <span className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Vulnerability Factor Scores (Normalized 0–100)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Flood Factor */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Flood Exposure</span>
              <span className="font-bold text-sky-400">{breakdown.floodFactor} / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${breakdown.floodFactor}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{comm.floodDepthMeters}m depth, {comm.inundatedAreaPct}% area</p>
          </div>

          {/* WASH Disruption */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">WASH Disruption</span>
              <span className="font-bold text-cyan-400">{breakdown.washFactor} / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.washFactor}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{comm.mainWaterStatus}</p>
          </div>

          {/* Population Exposure */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Population Exposure</span>
              <span className="font-bold text-amber-400">{breakdown.populationFactor} / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown.populationFactor}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{comm.exposedPopulation.toLocaleString()} people exposed</p>
          </div>

          {/* Road Accessibility Penalty */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Road Isolation</span>
              <span className="font-bold text-red-400">{breakdown.accessibilityFactor} / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${breakdown.accessibilityFactor}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{comm.roadAccessibility}</p>
          </div>

          {/* Health Accessibility */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Health Access Cut</span>
              <span className="font-bold text-rose-400">{breakdown.healthFactor} / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${breakdown.healthFactor}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{comm.healthFacilityAccessibility}</p>
          </div>
        </div>
      </div>

      {/* Grid: Infrastructure Breakdown & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Water Infrastructure Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-cyan-400" />
              Water Supply Assets
            </span>
            <span className="text-[10px] text-red-400 font-semibold">{comm.mainWaterStatus}</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[11px]">Primary Intake Asset:</span>
              <strong className="text-white">{comm.mainWaterSource}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Alternative Safe Water Asset:</span>
              <strong className="text-cyan-300">{comm.alternativeWaterSource}</strong>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Straight-line distance:</span>
                <span className="text-slate-200 font-bold">{comm.alternativeWaterDistanceStraightKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actual accessible route:</span>
                <span className="text-amber-400 font-bold">{comm.alternativeWaterDistanceAccessibleKm} km</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <strong className="text-red-400">Road barrier:</strong> {comm.alternativeWaterReason}
              </div>
            </div>
          </div>
        </div>

        {/* Sanitation & Health Infrastructure */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-orange-400" />
              Sanitation & Health Access
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">{comm.healthFacilityAccessibility}</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[11px]">Sanitation Status:</span>
              <p className="text-slate-200">{comm.sanitationStatus}</p>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Designated Health Facility:</span>
              <strong className="text-white">{comm.healthFacilityName}</strong>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Health direct distance:</span>
                <span className="text-slate-200 font-bold">{comm.healthDistanceStraightKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Accessible route distance:</span>
                <span className="text-rose-400 font-bold">{comm.healthDistanceAccessibleKm} km</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <strong className="text-red-400">Health access impediment:</strong> {comm.healthAccessObstacle}
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Relief Interventions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Actionable Interventions
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Priority Deployment</span>
          </div>

          <ul className="space-y-2 text-slate-200 text-xs">
            {comm.recommendedInterventions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] shrink-0 font-bold border border-cyan-800">
                  {i + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
};
